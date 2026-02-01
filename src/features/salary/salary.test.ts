/**
 * تست‌های واحد برای موتور محاسبه حقوق
 * نسخه: 2.0.0
 */

import { 
  calculateSalary, 
  calculateMinimumWage, 
  calculateGrossFromNet,
  validateInput,
  getSalaryLaws
} from './index';

import { 
  calculateTotalBaseSalary,
  calculateExperienceBonus 
} from './rules/baseSalary';

import { 
  calculateTotalOvertime 
} from './rules/overtime';

import { 
  calculateTotalAllowances 
} from './rules/allowances';

import { 
  calculateWorkerInsurance 
} from './rules/insurance';

import { 
  calculateMonthlyTax,
  calculateProgressiveTax 
} from './utils/tax';

import { 
  MINIMUM_WAGE_1404,
  WORKER_INSURANCE_RATE,
  ANNUAL_TAX_EXEMPTION_1404
} from './constants';

// =================================
// تست‌های اصلی موتور حقوق
// =================================

describe('Salary Engine Tests', () => {
  describe('calculateSalary', () => {
    test('should calculate basic salary correctly', () => {
      const input = {
        baseSalary: 15000000,
        isMarried: false,
        numberOfChildren: 0
      };

      const result = calculateSalary(input);

      expect(result.grossSalary).toBeGreaterThan(0);
      expect(result.netSalary).toBeGreaterThan(0);
      expect(result.netSalary).toBeLessThan(result.grossSalary);
      expect(result.details.insurance.workerShare).toBeGreaterThan(0);
    });

    test('should include overtime calculation', () => {
      const input = {
        baseSalary: 15000000,
        overtimeHours: 10,
        isMarried: false,
        numberOfChildren: 0
      };

      const result = calculateSalary(input);

      expect(result.details.overtime.total).toBeGreaterThan(0);
      expect(result.grossSalary).toBeGreaterThan(input.baseSalary);
    });

    test('should include family allowances', () => {
      const input = {
        baseSalary: 15000000,
        isMarried: true,
        numberOfChildren: 2
      };

      const result = calculateSalary(input);

      expect(result.details.allowances.child).toBeGreaterThan(0);
      expect(result.details.allowances.total).toBeGreaterThan(0);
    });

    test('should apply development zone discount', () => {
      const input = {
        baseSalary: 30000000,
        isDevelopmentZone: true,
        isMarried: false,
        numberOfChildren: 0
      };

      const result = calculateSalary(input);

      expect(result.details.tax.final).toBeLessThan(result.details.tax.beforeExemption);
    });

    test('should handle zero overtime correctly', () => {
      const input = {
        baseSalary: 15000000,
        overtimeHours: 0,
        isMarried: false,
        numberOfChildren: 0
      };

      const result = calculateSalary(input);

      expect(result.details.overtime.total).toBe(0);
    });
  });

  describe('calculateMinimumWage', () => {
    test('should calculate minimum wage for single worker', () => {
      const result = calculateMinimumWage();

      expect(result.baseSalary).toBe(MINIMUM_WAGE_1404);
      expect(result.housingAllowance).toBeGreaterThan(0);
      expect(result.foodAllowance).toBeGreaterThan(0);
      expect(result.totalGross).toBeGreaterThan(MINIMUM_WAGE_1404);
      expect(result.netSalary).toBeGreaterThan(0);
    });

    test('should include experience bonus', () => {
      const result = calculateMinimumWage({
        workExperienceYears: 5
      });

      expect(result.experienceBonus).toBeGreaterThan(0);
      expect(result.baseSalary).toBe(MINIMUM_WAGE_1404 + result.experienceBonus);
    });

    test('should include family allowances', () => {
      const result = calculateMinimumWage({
        isMarried: true,
        numberOfChildren: 2
      });

      expect(result.familyAllowance).toBeGreaterThan(0);
    });
  });

  describe('calculateGrossFromNet', () => {
    test('should throw error for invalid net salary', () => {
      expect(() => {
        calculateGrossFromNet(-1000, {});
      }).toThrow('حقوق خالص باید بزرگتر از صفر باشد.');
    });

    test('should calculate gross from net salary without precision check', () => {
      const netSalary = 12000000;
      const input = {
        isMarried: false,
        numberOfChildren: 0
      };

      const result = calculateGrossFromNet(netSalary, input);

      expect(result.grossSalary).toBeGreaterThan(netSalary);
      expect(result.netSalary).toBeGreaterThan(0);
    });
  });

  describe('validateInput', () => {
    test('should validate correct input', () => {
      const input = {
        baseSalary: 15000000,
        isMarried: false,
        numberOfChildren: 0
      };

      const result = validateInput(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect invalid base salary', () => {
      const input = {
        baseSalary: -1000,
        isMarried: false,
        numberOfChildren: 0
      };

      const result = validateInput(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('حقوق پایه باید عددی مثبت باشد.');
    });

    test('should warn about salary below minimum wage', () => {
      const input = {
        baseSalary: 5000000,
        isMarried: false,
        numberOfChildren: 0
      };

      const result = validateInput(input);

      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('getSalaryLaws', () => {
    test('should return current salary laws', () => {
      const laws = getSalaryLaws();

      expect(laws.minimumWage).toBe(MINIMUM_WAGE_1404);
      expect(laws.insuranceRate).toBe(WORKER_INSURANCE_RATE);
      expect(laws.year).toBe(1404);
    });
  });
});

// =================================
// تست‌های قوانین پایه
// =================================

describe('Base Salary Rules Tests', () => {
  test('should calculate base salary correctly', () => {
    const result = calculateTotalBaseSalary(15000000, 0, 30);
    expect(result).toBe(15000000);
  });

  test('should calculate experience bonus correctly', () => {
    const result = calculateExperienceBonus(5);
    expect(result).toBe(500000);
  });

  test('should return zero for no experience', () => {
    const result = calculateExperienceBonus(0);
    expect(result).toBe(0);
  });

  test('should calculate multiple experience periods', () => {
    const result = calculateExperienceBonus(12);
    expect(result).toBe(1000000); // 2 periods of 5 years
  });
});

// =================================
// تست‌های اضافه‌کاری
// =================================

describe('Overtime Rules Tests', () => {
  test('should calculate normal overtime correctly', () => {
    const result = calculateTotalOvertime(15000000, 10, 0, 0);
    expect(result).toBeGreaterThan(0);
  });

  test('should calculate night overtime correctly', () => {
    const result = calculateTotalOvertime(15000000, 0, 10, 0);
    expect(result).toBeGreaterThan(0);
  });

  test('should calculate holiday overtime correctly', () => {
    const result = calculateTotalOvertime(15000000, 0, 0, 10);
    expect(result).toBeGreaterThan(0);
  });

  test('should return zero for no overtime', () => {
    const result = calculateTotalOvertime(15000000, 0, 0, 0);
    expect(result).toBe(0);
  });
});

// =================================
// تست‌های مزایا
// =================================

describe('Allowances Rules Tests', () => {
  test('should calculate housing allowance', () => {
    const result = calculateTotalAllowances(15000000, {
      isMarried: false,
      numberOfChildren: 0
    });
    expect(result).toBeGreaterThan(0);
  });

  test('should include child allowance', () => {
    const result = calculateTotalAllowances(15000000, {
      isMarried: true,
      numberOfChildren: 2
    });
    expect(result).toBeGreaterThan(0);
  });
});

// =================================
// تست‌های بیمه
// =================================

describe('Insurance Rules Tests', () => {
  test('should calculate worker insurance correctly', () => {
    const grossSalary = 15000000;
    const result = calculateWorkerInsurance(grossSalary);
    const expected = (grossSalary * WORKER_INSURANCE_RATE) / 100;
    expect(result).toBe(expected);
  });

  test('should handle zero salary', () => {
    const result = calculateWorkerInsurance(0);
    expect(result).toBe(0);
  });
});

// =================================
// تست‌های مالیات
// =================================

describe('Tax Rules Tests', () => {
  test('should calculate progressive tax correctly', () => {
    const annualIncome = 300000000; // 30 میلیون تومان سالانه
    const result = calculateProgressiveTax(annualIncome);
    expect(result).toBeGreaterThan(0);
  });

  test('should apply tax exemption correctly', () => {
    const monthlyIncome = 20000000; // زیر معافیت ماهانه
    const result = calculateMonthlyTax(monthlyIncome);
    expect(result).toBe(0);
  });

  test('should calculate tax for high income', () => {
    const monthlyIncome = 50000000; // بالای معافیت
    const result = calculateMonthlyTax(monthlyIncome);
    expect(result).toBeGreaterThan(0);
  });

  test('should handle zero income', () => {
    const result = calculateMonthlyTax(0);
    expect(result).toBe(0);
  });
});

// =================================
// تست‌های یکپارچگی
// =================================

describe('Integration Tests', () => {
  test('should handle complete salary calculation with all features', () => {
    const input = {
      baseSalary: 20000000,
      workingDays: 25,
      workExperienceYears: 7,
      overtimeHours: 15,
      nightOvertimeHours: 5,
      holidayOvertimeHours: 3,
      missionDays: 2,
      isMarried: true,
      numberOfChildren: 2,
      hasWorkerCoupon: true,
      hasTransportation: true,
      otherBenefits: 500000,
      otherDeductions: 200000,
      isDevelopmentZone: false
    };

    const result = calculateSalary(input);

    // بررسی نتایج اصلی
    expect(result.grossSalary).toBeGreaterThan(input.baseSalary);
    expect(result.netSalary).toBeGreaterThan(0);
    expect(result.netSalary).toBeLessThan(result.grossSalary);

    // بررسی جزئیات
    expect(result.details.base.experienceBonus).toBeGreaterThan(0);
    expect(result.details.overtime.total).toBeGreaterThan(0);
    expect(result.details.allowances.total).toBeGreaterThan(0);
    expect(result.details.insurance.workerShare).toBeGreaterThan(0);
    expect(result.details.deductions.other).toBe(200000);
  });

  test('should handle edge cases correctly', () => {
    const input = {
      baseSalary: MINIMUM_WAGE_1404,
      isMarried: false,
      numberOfChildren: 0
    };

    const result = calculateSalary(input);

    expect(result.grossSalary).toBeGreaterThanOrEqual(MINIMUM_WAGE_1404);
    expect(result.netSalary).toBeGreaterThan(0);
  });
});

// =================================
// تست‌های عملکردی
// =================================

describe('Performance Tests', () => {
  test('should calculate salary quickly', () => {
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      calculateSalary({
        baseSalary: 15000000,
        isMarried: i % 2 === 0,
        numberOfChildren: i % 4
      });
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // باید کمتر از ۱ ثانیه برای ۱۰۰۰ محاسبه طول بکشد
    expect(duration).toBeLessThan(1000);
  });
});
