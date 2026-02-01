import type { SalaryInput, SalaryOutput, MinimumWageOutput, TaxBracket } from './salary.types';

// ثابت‌های قانونی سال ۱۴۰۴
const ANNUAL_TAX_EXEMPTION_1404 = 288_000_000; // ۲۸۸ میلیون تومان معافیت سالانه
const WORKER_INSURANCE_RATE = 7; // ۷٪ سهم کارگر از بیمه

// حداقل حقوق ۱۴۰۴ (تومان)
const MINIMUM_WAGE_1404 = 8_100_000; // حقوق پایه
const HOUSING_ALLOWANCE_1404 = 2_500_000; // کمک هزینه مسکن
const FOOD_ALLOWANCE_1404 = 1_000_000; // کمک هزینه غذا

// جدول مالیات تصاعدی سال ۱۴۰۴
const TAX_BRACKETS_1404: TaxBracket[] = [
  { from: 0, to: 24_000_000, rate: 0, fixedAmount: 0 },
  { from: 24_000_001, to: 48_000_000, rate: 10, fixedAmount: 0 },
  { from: 48_000_001, to: 96_000_000, rate: 15, fixedAmount: 2_400_000 },
  { from: 96_000_001, to: 192_000_000, rate: 20, fixedAmount: 9_600_000 },
  { from: 192_000_001, to: 384_000_000, rate: 25, fixedAmount: 28_800_000 },
  { from: 384_000_001, to: Infinity, rate: 30, fixedAmount: 76_800_000 },
];

export function calculateSalary(input: SalaryInput): SalaryOutput {
  return calculateGrossToNet(input);
}

function calculateGrossToNet(input: SalaryInput): SalaryOutput {
  const {
    baseSalary,
    customInsuranceRate = WORKER_INSURANCE_RATE,
    otherDeductions = 0,
  } = input;

  // اعتبارسنجی
  if (!Number.isFinite(baseSalary) || baseSalary < 0) {
    throw new Error('حقوق پایه نامعتبر است.');
  }
  if (
    !Number.isFinite(customInsuranceRate)
    || customInsuranceRate < 0
    || customInsuranceRate > 100
  ) {
    throw new Error('درصد بیمه باید بین ۰ تا ۱۰۰ باشد.');
  }
  if (!Number.isFinite(otherDeductions) || otherDeductions < 0) {
    throw new Error('کسورات دیگر نامعتبر است.');
  }

  // محاسبه بیمه
  const insuranceAmount = (baseSalary * customInsuranceRate) / 100;

  // محاسبه درآمد مشمول مالیات
  const monthlyTaxableIncome = Math.max(0, baseSalary - insuranceAmount);
  const annualTaxableIncome = monthlyTaxableIncome * 12;

  // محاسبه مالیات قبل از معافیت
  const taxBeforeExemption = calculateProgressiveTax(annualTaxableIncome);
  const monthlyTaxBeforeExemption = taxBeforeExemption / 12;

  // محاسبه معافیت مالیاتی
  let taxExemption = 0;
  if (annualTaxableIncome <= ANNUAL_TAX_EXEMPTION_1404) {
    taxExemption = monthlyTaxBeforeExemption;
  }

  // اعمال تخفیف مناطق کمتر توسعه‌یافته
  const taxAmount = monthlyTaxBeforeExemption - taxExemption;

  // محاسبه حقوق خالص
  const totalDeductions = insuranceAmount + taxAmount + otherDeductions;
  const netSalary = Math.max(0, baseSalary - totalDeductions);

  // محاسبه نرخ مؤثر مالیات
  const effectiveTaxRate = baseSalary > 0 ? (taxAmount / baseSalary) * 100 : 0;
  const effectiveInsuranceRate = baseSalary > 0 ? (insuranceAmount / baseSalary) * 100 : 0;

  return {
    grossSalary: baseSalary,
    netSalary,
    baseSalary,
    details: {
      base: {
        calculated: baseSalary,
        experienceBonus: 0,
      },
      overtime: {
        normal: 0,
        night: 0,
        holiday: 0,
        total: 0,
      },
      allowances: {
        housing: 0,
        food: 0,
        child: 0,
        coupon: 0,
        mission: 0,
        transportation: 0,
        total: 0,
      },
      insurance: {
        workerShare: insuranceAmount,
        employerShare: (baseSalary * 23) / 100,
        total: insuranceAmount + (baseSalary * 23) / 100,
        rate: customInsuranceRate,
      },
      tax: {
        beforeExemption: monthlyTaxBeforeExemption,
        exemption: taxExemption,
        final: taxAmount,
        rate: effectiveTaxRate,
        brackets: getAppliedBrackets(annualTaxableIncome),
      },
      deductions: {
        other: otherDeductions,
        total: otherDeductions,
      },
    },
    summary: {
      grossSalary: baseSalary,
      totalDeductions,
      netSalary,
      effectiveTaxRate,
      effectiveInsuranceRate,
      monthlyTaxableIncome,
      annualTaxableIncome,
    },
  };
}

// Helper functions

export function calculateMinimumWage(input: SalaryInput): MinimumWageOutput {
  const {
    workExperienceYears = 0,
    isMarried = false,
    numberOfChildren = 0,
    customInsuranceRate = WORKER_INSURANCE_RATE,
    otherDeductions = 0,
  } = input;

  // محاسبه حقوق پایه بر اساس سابقه کار
  let baseSalary = MINIMUM_WAGE_1404;
  if (workExperienceYears > 0) {
    const experienceBonus = Math.floor(workExperienceYears / 5) * 500_000;
    // ۵۰۰ هزار تومان به ازای هر ۵ سال سابقه
    baseSalary += experienceBonus;
  }

  // محاسبه مزایا
  const housingAllowance = HOUSING_ALLOWANCE_1404;
  const foodAllowance = FOOD_ALLOWANCE_1404;
  let familyAllowance = 0;

  if (isMarried) {
    familyAllowance += 500_000; // حق اولاد همسر
  }

  if (numberOfChildren > 0) {
    familyAllowance += numberOfChildren * 300_000; // حق اولاد به ازای هر فرزند
  }

  const totalGross = baseSalary + housingAllowance + foodAllowance + familyAllowance;
  const experienceBonus = workExperienceYears > 0
    ? Math.floor(workExperienceYears / 5) * 500_000
    : 0;

  // Calculate insurance and tax
  const insuranceAmount = (totalGross * customInsuranceRate) / 100;
  const monthlyTaxableIncome = Math.max(0, totalGross - insuranceAmount);
  const annualTaxableIncome = monthlyTaxableIncome * 12;
  const taxAmount = calculateProgressiveTax(annualTaxableIncome) / 12;
  const netSalary = Math.max(0, totalGross - insuranceAmount - taxAmount - otherDeductions);

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

function calculateProgressiveTax(annualIncome: number): number {
  let tax = 0;

  for (const bracket of TAX_BRACKETS_1404) {
    if (annualIncome <= bracket.from) {
      break;
    }

    const taxableInBracket = Math.min(
      annualIncome - bracket.from,
      bracket.to - bracket.from,
    );

    if (taxableInBracket > 0) {
      tax += (taxableInBracket * bracket.rate) / 100;
    }
  }

  return tax;
}

function getAppliedBrackets(annualIncome: number): TaxBracket[] {
  return TAX_BRACKETS_1404.filter(bracket =>
    annualIncome > bracket.from,
  );
}

export function calculateMinimumWageDetails(input: SalaryInput): MinimumWageOutput {
  const {
    workExperienceYears = 0,
    isMarried = false,
    numberOfChildren = 0,
  } = input;

  // محاسبه حقوق پایه بر اساس سابقه کار
  let baseSalary = MINIMUM_WAGE_1404;
  const experienceBonus = Math.floor(workExperienceYears / 5) * 500_000;
  baseSalary += experienceBonus;

  // محاسبه مزایا
  const housingAllowance = HOUSING_ALLOWANCE_1404;
  const foodAllowance = FOOD_ALLOWANCE_1404;
  let familyAllowance = 0;

  if (isMarried) {
    familyAllowance += 500_000;
  }

  if (numberOfChildren > 0) {
    familyAllowance += numberOfChildren * 300_000;
  }

  const totalGross = baseSalary + housingAllowance + foodAllowance + familyAllowance;

  // محاسبه خالص حقوق
  const salaryResult = calculateGrossToNet({
    ...input,
    baseSalary: totalGross,
  });

  return {
    baseSalary,
    housingAllowance,
    foodAllowance,
    familyAllowance,
    experienceBonus,
    totalGross,
    netSalary: salaryResult.netSalary,
    insuranceAmount: salaryResult.details.insurance.workerShare,
    taxAmount: salaryResult.details.tax.final,
  };
}
