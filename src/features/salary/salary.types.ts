/**
 * انواع داده‌های مربوط به محاسبه حقوق و دستمزد
 * مطابق با قوانین وزارت کار ایران
 */

// =================================
// ورودی اصلی محاسبه حقوق
// =================================

export interface SalaryInput {
  // اطلاعات پایه
  baseSalary: number;
  workingDays?: number;
  workExperienceYears?: number;

  // اضافه‌کاری
  overtimeHours?: number;
  nightOvertimeHours?: number;
  holidayOvertimeHours?: number;

  // مأموریت
  missionDays?: number;

  // اطلاعات خانوادگی
  isMarried?: boolean;
  numberOfChildren?: number;

  // مزایا و کسورات
  hasWorkerCoupon?: boolean;
  hasTransportation?: boolean;
  otherBenefits?: number;
  otherDeductions?: number;

  // اطلاعات منطقه‌ای
  isDevelopmentZone?: boolean;

  // سفارشی‌سازی نرخ‌ها
  customInsuranceRate?: number;
}

// =================================
// خروجی اصلی محاسبه حقوق
// =================================

export interface SalaryOutput {
  // حقوق پایه
  grossSalary: number;
  netSalary: number;
  baseSalary: number;

  // جزئیات محاسبه
  details: SalaryDetails;

  // خلاصه اطلاعات
  summary: SalarySummary;
}

// =================================
// جزئیات کامل محاسبه
// =================================

export interface SalaryDetails {
  // حقوق پایه و مزایا
  base: {
    calculated: number;
    experienceBonus: number;
  };

  overtime: {
    normal: number;
    night: number;
    holiday: number;
    total: number;
  };

  allowances: {
    housing: number;
    food: number;
    child: number;
    coupon: number;
    mission: number;
    transportation: number;
    total: number;
  };

  insurance: {
    workerShare: number;
    employerShare: number;
    total: number;
    rate: number;
  };

  tax: {
    beforeExemption: number;
    exemption: number;
    final: number;
    rate: number;
    brackets: TaxBracket[];
  };

  deductions: {
    other: number;
    total: number;
  };
}

// =================================
// خلاصه اطلاعات حقوق
// =================================

export interface SalarySummary {
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  effectiveTaxRate: number;
  effectiveInsuranceRate: number;
  monthlyTaxableIncome: number;
  annualTaxableIncome: number;
}

// =================================
// انواع حالت‌های محاسبه
// =================================

export type CalculationMode = 'gross-to-net' | 'net-to-gross' | 'minimum-wage';

// =================================
// اطلاعات مربوط به حداقل دستمزد
// =================================

export interface MinimumWageInput {
  workExperienceYears?: number;
  isMarried?: boolean;
  numberOfChildren?: number;
  isDevelopmentZone?: boolean;
  otherDeductions?: number;
}

export interface MinimumWageOutput {
  baseSalary: number;
  housingAllowance: number;
  foodAllowance: number;
  familyAllowance: number;
  experienceBonus: number;
  totalGross: number;
  netSalary: number;
  insuranceAmount: number;
  taxAmount: number;
}

// =================================
// اطلاعات مالیات
// =================================

export interface TaxBracket {
  from: number;
  to: number;
  rate: number;
  fixedAmount: number;
}

// =================================
// اطلاعات بیمه
// =================================

export interface InsuranceDetails {
  grossSalary: number;
  exemptAmount: number;
  insuranceableIncome: number;
  workerShare: number;
  employerShare: number;
  total: number;
  workerRate: number;
  employerRate: number;
  totalRate: number;
}

// =================================
// اطلاعات کسورات
// =================================

export interface DeductionDetails {
  insurance: number;
  tax: number;
  legal: number;
  total: number;
  breakdown: {
    loanPayment: number;
    unionFee: number;
    penalty: number;
    advancePayment: number;
    other: number;
  };
}

// =================================
// اطلاعات مزایا
// =================================

export interface AllowanceInput {
  isMarried?: boolean;
  numberOfChildren?: number;
  missionDays?: number;
  hasTransportation?: boolean;
  hasWorkerCoupon?: boolean;
}

export interface AllowanceDetails {
  housing: number;
  food: number;
  child: number;
  coupon: number;
  mission: number;
  transportation: number;
  total: number;
}

// =================================
// اطلاعات اضافه‌کاری
// =================================

export type OvertimeType = 'normal' | 'night' | 'holiday';

export interface OvertimeDetails {
  normal: {
    hours: number;
    amount: number;
  };
  night: {
    hours: number;
    amount: number;
  };
  holiday: {
    hours: number;
    amount: number;
  };
  total: {
    hours: number;
    amount: number;
  };
}

// =================================
// نتایج اعتبارسنجی
// =================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// =================================
// گزینه‌های محاسبه
// =================================

export interface CalculationOptions {
  includeTaxExemptions?: boolean;
  applyDevelopmentZoneDiscount?: boolean;
  customTaxBrackets?: TaxBracket[];
  roundResults?: boolean;
  currency?: 'IRR' | 'T';
}
