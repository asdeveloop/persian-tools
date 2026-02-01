/**
 * موتور اصلی محاسبه حقوق و دستمزد
 * نسخه: 2.0.0
 * مطابق با قوانین وزارت کار ایران - سال ۱۴۰۴
 */

// وارد کردن قوانین و ابزارهای مورد نیاز
import {
  calculateTotalBaseSalary,
  calculateExperienceBonus,
} from './rules/baseSalary';

import {
  calculateTotalOvertime,
} from './rules/overtime';

import {
  getAllowanceDetails,
} from './rules/allowances';

import {
  getInsuranceDetails,
} from './rules/insurance';

import {
  calculateMonthlyTax,
  getAppliedTaxBrackets,
  calculateEffectiveTaxRate,
} from './utils/tax';

import {
  MINIMUM_WAGE_1404,
  HOUSING_ALLOWANCE_1404,
  FOOD_ALLOWANCE_1404,
  CHILD_ALLOWANCE_PER_CHILD,
  SPOUSE_ALLOWANCE,
  EXPERIENCE_BONUS_PER_5_YEARS,
} from './constants';

import type {
  SalaryInput,
  SalaryOutput,
  SalaryDetails,
  SalarySummary,
  MinimumWageInput,
  MinimumWageOutput,
  ValidationResult,
} from './salary.types';

// =================================
// تابع اصلی محاسبه حقوق
// =================================

/**
 * محاسبه کامل حقوق و دستمزد
 * @param input ورودی‌های محاسبه حقوق
 * @returns خروجی کامل محاسبه حقوق
 */
export function calculateSalary(input: SalaryInput): SalaryOutput {
  // اعتبارسنجی ورودی‌ها
  const validation = validateInput(input);
  if (!validation.isValid) {
    throw new Error(`خطای اعتبارسنجی: ${validation.errors.join(', ')}`);
  }

  // 1. محاسبه حقوق پایه
  const baseCalculated = calculateTotalBaseSalary(
    input.baseSalary,
    input.workExperienceYears,
    input.workingDays,
  );

  const experienceBonus = calculateExperienceBonus(input.workExperienceYears ?? 0);

  // 2. محاسبه اضافه‌کاری
  const overtimeTotal = calculateTotalOvertime(
    baseCalculated,
    input.overtimeHours ?? 0,
    input.nightOvertimeHours ?? 0,
    input.holidayOvertimeHours ?? 0,
  );

  // 3. محاسبه مزایا
  const allowancesDetails = getAllowanceDetails(baseCalculated, {
    isMarried: input.isMarried ?? false,
    numberOfChildren: input.numberOfChildren ?? 0,
    missionDays: input.missionDays ?? 0,
    hasTransportation: input.hasTransportation ?? false,
    hasWorkerCoupon: input.hasWorkerCoupon ?? false,
  });

  // 4. محاسبه حقوق ناخالص
  const grossSalary = baseCalculated + overtimeTotal + allowancesDetails.total + (input.otherBenefits ?? 0);

  // 5. محاسبه بیمه
  const insuranceDetails = getInsuranceDetails(grossSalary, 0);

  // 6. محاسبه مالیات
  const monthlyTaxableIncome = grossSalary - insuranceDetails.workerShare;
  const taxAmount = calculateMonthlyTax(monthlyTaxableIncome, input.isDevelopmentZone);
  const taxBrackets = getAppliedTaxBrackets(monthlyTaxableIncome * 12);
  const effectiveTaxRate = calculateEffectiveTaxRate(taxAmount, grossSalary);

  // 7. محاسبه کسورات
  const otherDeductions = input.otherDeductions ?? 0;
  const totalDeductions = insuranceDetails.workerShare + taxAmount + otherDeductions;

  // 8. محاسبه حقوق خالص
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  // 9. ساخت خروجی کامل
  const details: SalaryDetails = {
    base: {
      calculated: baseCalculated,
      experienceBonus,
    },
    overtime: {
      normal: calculateTotalOvertime(baseCalculated, input.overtimeHours ?? 0),
      night: calculateTotalOvertime(baseCalculated, 0, input.nightOvertimeHours ?? 0),
      holiday: calculateTotalOvertime(baseCalculated, 0, 0, input.holidayOvertimeHours ?? 0),
      total: overtimeTotal,
    },
    allowances: allowancesDetails,
    insurance: {
      workerShare: insuranceDetails.workerShare,
      employerShare: insuranceDetails.employerShare,
      total: insuranceDetails.total,
      rate: insuranceDetails.workerRate,
    },
    tax: {
      beforeExemption: taxAmount + (taxAmount * 0.1), // تخمین قبل از معافیت
      exemption: taxAmount * 0.1, // تخمین معافیت
      final: taxAmount,
      rate: effectiveTaxRate,
      brackets: taxBrackets,
    },
    deductions: {
      other: otherDeductions,
      total: totalDeductions,
    },
  };

  const summary: SalarySummary = {
    grossSalary,
    totalDeductions,
    netSalary,
    effectiveTaxRate,
    effectiveInsuranceRate: (insuranceDetails.workerShare / grossSalary) * 100,
    monthlyTaxableIncome,
    annualTaxableIncome: monthlyTaxableIncome * 12,
  };

  return {
    grossSalary,
    netSalary,
    baseSalary: baseCalculated,
    details,
    summary,
  };
}

// =================================
// محاسبه حداقل دستمزد
// =================================

/**
 * محاسبه حقوق بر اساس حداقل دستمزد و شرایط
 * @param input شرایط محاسبه حداقل دستمزد
 * @returns خروجی محاسبه حداقل دستمزد
 */
export function calculateMinimumWage(input: MinimumWageInput = {}): MinimumWageOutput {
  const {
    workExperienceYears = 0,
    isMarried = false,
    numberOfChildren = 0,
    isDevelopmentZone = false,
    otherDeductions = 0,
  } = input;

  // محاسبه حقوق پایه بر اساس سابقه کار
  let baseSalary = MINIMUM_WAGE_1404;
  const experienceBonus = Math.floor(workExperienceYears / 5) * EXPERIENCE_BONUS_PER_5_YEARS;
  baseSalary += experienceBonus;

  // محاسبه مزایا
  const housingAllowance = HOUSING_ALLOWANCE_1404;
  const foodAllowance = FOOD_ALLOWANCE_1404;

  let familyAllowance = 0;
  if (isMarried) {
    familyAllowance += SPOUSE_ALLOWANCE;
  }
  if (numberOfChildren > 0) {
    familyAllowance += numberOfChildren * CHILD_ALLOWANCE_PER_CHILD;
  }

  const totalGross = baseSalary + housingAllowance + foodAllowance + familyAllowance;

  // محاسبه بیمه و مالیات
  const insuranceAmount = (totalGross * 7) / 100;
  const monthlyTaxableIncome = totalGross - insuranceAmount;
  const taxAmount = calculateMonthlyTax(monthlyTaxableIncome, isDevelopmentZone);
  const netSalary = totalGross - insuranceAmount - taxAmount - otherDeductions;

  return {
    baseSalary,
    housingAllowance,
    foodAllowance,
    familyAllowance,
    experienceBonus,
    totalGross,
    netSalary,
    insuranceAmount,
    taxAmount,
  };
}

// =================================
// محاسبه معکوس (خالص به ناخالص)
// =================================

/**
 * محاسبه حقوق ناخالص از روی حقوق خالص
 * @param netSalary حقوق خالص مورد نظر
 * @param input سایر پارامترهای محاسبه
 * @returns خروجی کامل محاسبه حقوق
 */
export function calculateGrossFromNet(
  netSalary: number,
  input: Omit<SalaryInput, 'baseSalary'>,
): SalaryOutput {
  if (netSalary <= 0) {
    throw new Error('حقوق خالص باید بزرگتر از صفر باشد.');
  }

  // محاسبه حقوق ناخالص با روش جستجوی دودویی
  let low = netSalary;
  let high = netSalary * 2; // حداکثر ۲ برابر حقوق خالص
  const tolerance = 100; // تومان
  let iterations = 0;
  const maxIterations = 50;

  while (iterations < maxIterations && (high - low) > tolerance) {
    const mid = (low + high) / 2;
    const result = calculateSalary({
      ...input,
      baseSalary: mid,
    });

    if (result.netSalary < netSalary) {
      low = mid;
    } else {
      high = mid;
    }

    iterations++;
  }

  // استفاده از مقدار نهایی
  const finalGross = (low + high) / 2;
  return calculateSalary({
    ...input,
    baseSalary: finalGross,
  });
}

// =================================
// اعتبارسنجی ورودی‌ها
// =================================

/**
 * اعتبارسنجی ورودی‌های محاسبه حقوق
 * @param input ورودی‌های محاسبه حقوق
 * @returns نتیجه اعتبارسنجی
 */
export function validateInput(input: SalaryInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // اعتبارسنجی حقوق پایه
  if (!Number.isFinite(input.baseSalary) || input.baseSalary <= 0) {
    errors.push('حقوق پایه باید عددی مثبت باشد.');
  } else if (input.baseSalary < MINIMUM_WAGE_1404) {
    warnings.push(`حقوق پایه کمتر از حداقل دستمزد قانونی (${MINIMUM_WAGE_1404.toLocaleString('fa-IR')} تومان) است.`);
  }

  // اعتبارسنجی روزهای کاری
  if (input.workingDays !== undefined) {
    if (!Number.isFinite(input.workingDays) || input.workingDays <= 0 || input.workingDays > 31) {
      errors.push('تعداد روزهای کاری باید بین ۱ تا ۳۱ باشد.');
    }
  }

  // اعتبارسنجی ساعات اضافه‌کاری
  if (input.overtimeHours !== undefined && input.overtimeHours < 0) {
    errors.push('ساعات اضافه‌کاری نمی‌تواند منفی باشد.');
  }

  if (input.nightOvertimeHours !== undefined && input.nightOvertimeHours < 0) {
    errors.push('ساعات اضافه‌کاری شب نمی‌تواند منفی باشد.');
  }

  if (input.holidayOvertimeHours !== undefined && input.holidayOvertimeHours < 0) {
    errors.push('ساعات اضافه‌کاری تعطیلات نمی‌تواند منفی باشد.');
  }

  // اعتبارسنجی تعداد فرزندان
  if (input.numberOfChildren !== undefined && input.numberOfChildren < 0) {
    errors.push('تعداد فرزندان نمی‌تواند منفی باشد.');
  }

  // اعتبارسنجی سابقه کار
  if (input.workExperienceYears !== undefined && input.workExperienceYears < 0) {
    errors.push('سابقه کار نمی‌تواند منفی باشد.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// =================================
// توابع کمکی
// =================================

/**
 * دریافت خلاصه قوانین و مقادیر قانونی
 * @returns اطلاعات قوانین حقوق
 */
export function getSalaryLaws() {
  return {
    minimumWage: MINIMUM_WAGE_1404,
    housingAllowance: HOUSING_ALLOWANCE_1404,
    foodAllowance: FOOD_ALLOWANCE_1404,
    childAllowance: CHILD_ALLOWANCE_PER_CHILD,
    spouseAllowance: SPOUSE_ALLOWANCE,
    experienceBonusPer5Years: EXPERIENCE_BONUS_PER_5_YEARS,
    insuranceRate: 7,
    taxExemption: 24_000_000, // ماهانه
    year: 1404,
  };
}

/**
 * بررسی آیا مبلغ مشمول مالیات است
 * @param annualIncome درآمد سالانه
 * @returns آیا مشمول مالیات است؟
 */
export function isTaxable(annualIncome: number): boolean {
  return annualIncome > 24_000_000 * 12; // بیشتر از معافیت سالانه
}

// =================================
// Export تمام توابع اصلی
// =================================

export default {
  calculateSalary,
  calculateMinimumWage,
  calculateGrossFromNet,
  validateInput,
  getSalaryLaws,
  isTaxable,
};
