import type { SalaryInput, SalaryResult, MinimumWageResult, TaxBracket, CalculationMode } from './salary.types';

// ثابت‌های قانونی سال ۱۴۰۴
const ANNUAL_TAX_EXEMPTION_1404 = 288_000_000; // ۲۸۸ میلیون تومان معافیت سالانه
const MONTHLY_TAX_EXEMPTION_1404 = ANNUAL_TAX_EXEMPTION_1404 / 12; // ۲۴ میلیون تومان معافیت ماهانه
const WORKER_INSURANCE_RATE = 7; // ۷٪ سهم کارگر از بیمه
const EMPLOYER_INSURANCE_RATE = 23; // ۲۳٪ سهم کارفرما از بیمه

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

export function calculateSalary(input: SalaryInput): SalaryResult {
  const mode = input.mode || 'gross-to-net';
  
  if (mode === 'net-to-gross') {
    return calculateNetToGross(input);
  } else if (mode === 'minimum-wage') {
    return calculateMinimumWage(input);
  } else {
    return calculateGrossToNet(input);
  }
}

function calculateGrossToNet(input: SalaryInput): SalaryResult {
  const {
    grossMonthlySalary = 0,
    insurancePercent = WORKER_INSURANCE_RATE,
    otherDeductions = 0,
    isDevelopmentZone = false,
    hasChildren = false,
    numberOfChildren = 0,
    isMarried = false,
  } = input;

  // اعتبارسنجی
  if (!Number.isFinite(grossMonthlySalary) || grossMonthlySalary < 0) {
    throw new Error('حقوق ناخالص نامعتبر است.');
  }
  if (!Number.isFinite(insurancePercent) || insurancePercent < 0 || insurancePercent > 100) {
    throw new Error('درصد بیمه باید بین ۰ تا ۱۰۰ باشد.');
  }
  if (!Number.isFinite(otherDeductions) || otherDeductions < 0) {
    throw new Error('کسورات دیگر نامعتبر است.');
  }

  // محاسبه بیمه
  const insuranceAmount = (grossMonthlySalary * insurancePercent) / 100;
  
  // محاسبه درآمد مشمول مالیات
  const monthlyTaxableIncome = Math.max(0, grossMonthlySalary - insuranceAmount);
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
  let taxAmount = monthlyTaxBeforeExemption - taxExemption;
  if (isDevelopmentZone) {
    taxAmount *= 0.5; // ۵۰٪ تخفیف
  }
  
  // محاسبه حقوق خالص
  const totalDeductions = insuranceAmount + taxAmount + otherDeductions;
  const netSalary = Math.max(0, grossMonthlySalary - totalDeductions);
  
  // محاسبه نرخ مؤثر مالیات
  const effectiveTaxRate = grossMonthlySalary > 0 ? (taxAmount / grossMonthlySalary) * 100 : 0;

  return {
    grossMonthlySalary,
    netSalary,
    insuranceAmount,
    taxAmount,
    otherDeductions,
    totalDeductions,
    taxBeforeExemption: monthlyTaxBeforeExemption,
    taxExemption,
    effectiveTaxRate,
    monthlyTaxableIncome,
    annualTaxableIncome,
    appliedBrackets: getAppliedBrackets(annualTaxableIncome),
  };
}

function calculateNetToGross(input: SalaryInput): SalaryResult {
  const {
    netMonthlySalary = 0,
    insurancePercent = WORKER_INSURANCE_RATE,
    otherDeductions = 0,
    isDevelopmentZone = false,
  } = input;

  if (!Number.isFinite(netMonthlySalary) || netMonthlySalary < 0) {
    throw new Error('حقوق خالص نامعتبر است.');
  }

  // محاسبه حقوق ناخالص با روش تکرار (نیوتن-رافسون)
  let grossSalary = netMonthlySalary * 1.4; // حدس اولیه
  let iterations = 0;
  const maxIterations = 100;
  const tolerance = 1; // تومان

  while (iterations < maxIterations) {
    const result = calculateGrossToNet({
      ...input,
      grossMonthlySalary: grossSalary,
      mode: 'gross-to-net',
    });
    
    const difference = result.netSalary - netMonthlySalary;
    
    if (Math.abs(difference) <= tolerance) {
      break;
    }
    
    // تنظیم حقوق ناخالص جدید
    const adjustmentFactor = 1 + (difference / grossSalary);
    grossSalary *= adjustmentFactor;
    iterations++;
  }

  return calculateGrossToNet({
    ...input,
    grossMonthlySalary: grossSalary,
    mode: 'gross-to-net',
  });
}

function calculateMinimumWage(input: SalaryInput): SalaryResult {
  const {
    workExperienceYears = 0,
    isMarried = false,
    numberOfChildren = 0,
    insurancePercent = WORKER_INSURANCE_RATE,
    otherDeductions = 0,
    isDevelopmentZone = false,
  } = input;

  // محاسبه حقوق پایه بر اساس سابقه کار
  let baseSalary = MINIMUM_WAGE_1404;
  if (workExperienceYears > 0) {
    const experienceBonus = Math.floor(workExperienceYears / 5) * 500_000; // ۵۰۰ هزار تومان به ازای هر ۵ سال سابقه
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

  const grossMonthlySalary = baseSalary + housingAllowance + foodAllowance + familyAllowance;

  return calculateGrossToNet({
    ...input,
    grossMonthlySalary,
    mode: 'gross-to-net',
  });
}

function calculateProgressiveTax(annualIncome: number): number {
  let tax = 0;
  
  for (const bracket of TAX_BRACKETS_1404) {
    if (annualIncome <= bracket.from) break;
    
    const taxableInBracket = Math.min(
      annualIncome - bracket.from,
      bracket.to - bracket.from
    );
    
    if (taxableInBracket > 0) {
      tax += (taxableInBracket * bracket.rate) / 100;
    }
  }
  
  return tax;
}

function getAppliedBrackets(annualIncome: number): TaxBracket[] {
  return TAX_BRACKETS_1404.filter(bracket => 
    annualIncome > bracket.from
  );
}

export function calculateMinimumWageDetails(input: SalaryInput): MinimumWageResult {
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

  const totalGross = baseSalary + housingAllowance + foodAllowance + familyAllow;
  
  // محاسبه خالص حقوق
  const salaryResult = calculateGrossToNet({
    ...input,
    grossMonthlySalary: totalGross,
    mode: 'gross-to-net',
  });

  return {
    baseSalary,
    housingAllowance,
    foodAllowance,
    familyAllowance,
    experienceBonus,
    totalGross,
    netSalary: salaryResult.netSalary,
    insuranceAmount: salaryResult.insuranceAmount,
    taxAmount: salaryResult.taxAmount,
  };
}
