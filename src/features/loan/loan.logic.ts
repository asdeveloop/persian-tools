import type { LoanInput, LoanResult } from './loan.types';

function calculateRegularLoan(principal: number, annualRate: number, months: number): LoanResult {
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    const monthlyPayment = principal / months;
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;
    return { monthlyPayment, totalPayment, totalInterest };
  }

  const pow = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = (principal * monthlyRate * pow) / (pow - 1);
  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  return { monthlyPayment, totalPayment, totalInterest };
}

function calculateQarzolhasanehLoan(principal: number, annualRate: number, months: number): LoanResult {
  // Qarzolhasaneh loans typically have very low rates (0-4%)
  // According to Central Bank regulations, these are calculated differently
  const monthlyRate = annualRate / 100 / 12;
  
  if (monthlyRate === 0) {
    const monthlyPayment = principal / months;
    const totalPayment = monthlyPayment * months;
    return { 
      monthlyPayment, 
      totalPayment, 
      totalInterest: 0,
      effectiveRate: 0 
    };
  }

  // For qarzolhasaneh, we use simple interest calculation
  const totalInterest = principal * monthlyRate * months;
  const totalPayment = principal + totalInterest;
  const monthlyPayment = totalPayment / months;
  
  // Calculate effective annual rate
  const effectiveRate = (totalInterest / principal) * (12 / months) * 100;

  return { 
    monthlyPayment, 
    totalPayment, 
    totalInterest,
    effectiveRate 
  };
}

function calculateSteppedLoan(
  principal: number, 
  baseRate: number, 
  totalMonths: number, 
  stepMonths: number, 
  rateIncrease: number
): LoanResult {
  const stepDetails: LoanResult['stepDetails'] = [];
  let remainingPrincipal = principal;
  let totalPayment = 0;
  let totalInterest = 0;
  let currentMonth = 0;

  while (currentMonth < totalMonths) {
    const monthsInThisStep = Math.min(stepMonths, totalMonths - currentMonth);
    const currentRate = baseRate + (rateIncrease * stepDetails.length);
    
    // Calculate payment for this step based on remaining principal
    const stepResult = calculateRegularLoan(remainingPrincipal, currentRate, monthsInThisStep);
    
    stepDetails.push({
      step: stepDetails.length + 1,
      months: monthsInThisStep,
      rate: currentRate,
      monthlyPayment: stepResult.monthlyPayment,
      totalPayment: stepResult.totalPayment
    });

    totalPayment += stepResult.totalPayment;
    totalInterest += stepResult.totalInterest;
    
    // Calculate remaining principal after this step
    const principalPaidInStep = stepResult.totalPayment - stepResult.totalInterest;
    remainingPrincipal -= principalPaidInStep;
    
    currentMonth += monthsInThisStep;
    
    // Break if principal is fully paid
    if (remainingPrincipal <= 0) break;
  }

  // Average monthly payment across all steps
  const avgMonthlyPayment = totalPayment / totalMonths;

  return {
    monthlyPayment: avgMonthlyPayment,
    totalPayment,
    totalInterest,
    stepDetails
  };
}

export function calculateLoan(input: LoanInput): LoanResult {
  const { 
    principal, 
    annualInterestRatePercent, 
    months, 
    loanType, 
    calculationType,
    stepMonths = 12, 
    stepRateIncrease = 1 
  } = input;

  // Input validation based on calculation type
  switch (calculationType) {
    case 'installment':
      if (!Number.isFinite(principal) || principal <= 0) {
        throw new Error('مبلغ وام باید بزرگ‌تر از صفر باشد.');
      }
      if (!Number.isFinite(annualInterestRatePercent) || annualInterestRatePercent < 0) {
        throw new Error('نرخ سود سالانه نامعتبر است.');
      }
      if (!Number.isFinite(months) || !Number.isInteger(months) || months <= 0) {
        throw new Error('مدت وام (ماه) باید یک عدد صحیح بزرگ‌تر از صفر باشد.');
      }
      break;
    
    case 'rate':
      if (!Number.isFinite(principal) || principal <= 0) {
        throw new Error('مبلغ وام باید بزرگ‌تر از صفر باشد.');
      }
      if (!Number.isFinite(months) || !Number.isInteger(months) || months <= 0) {
        throw new Error('مدت وام (ماه) باید یک عدد صحیح بزرگ‌تر از صفر باشد.');
      }
      break;
    
    case 'principal':
      if (!Number.isFinite(annualInterestRatePercent) || annualInterestRatePercent < 0) {
        throw new Error('نرخ سود سالانه نامعتبر است.');
      }
      if (!Number.isFinite(months) || !Number.isInteger(months) || months <= 0) {
        throw new Error('مدت وام (ماه) باید یک عدد صحیح بزرگ‌تر از صفر باشد.');
      }
      break;
    
    case 'months':
      if (!Number.isFinite(principal) || principal <= 0) {
        throw new Error('مبلغ وام باید بزرگ‌تر از صفر باشد.');
      }
      if (!Number.isFinite(annualInterestRatePercent) || annualInterestRatePercent < 0) {
        throw new Error('نرخ سود سالانه نامعتبر است.');
      }
      break;
  }

  switch (loanType) {
    case 'regular':
      if (calculationType === 'installment') {
        return calculateRegularLoan(principal, annualInterestRatePercent, months);
      } else if (calculationType === 'rate') {
        throw new Error('محاسبه نرخ سود برای وام عادی در حال حاضر پشتیبانی نمی‌شود.');
      } else if (calculationType === 'principal') {
        throw new Error('محاسبه مبلغ وام برای وام عادی در حال حاضر پشتیبانی نمی‌شود.');
      } else if (calculationType === 'months') {
        throw new Error('محاسبه مدت وام برای وام عادی در حال حاضر پشتیبانی نمی‌شود.');
      }
      break;
    
    case 'qarzolhasaneh':
      if (annualInterestRatePercent > 4) {
        throw new Error('نرخ سود وام قرض‌الحسنه نباید بیشتر از 4٪ باشد.');
      }
      if (calculationType === 'installment') {
        return calculateQarzolhasanehLoan(principal, annualInterestRatePercent, months);
      } else {
        throw new Error(`محاسبه ${calculationType} برای وام قرض‌الحسنه در حال حاضر پشتیبانی نمی‌شود.`);
      }
    
    case 'stepped':
      if (stepMonths <= 0 || stepMonths >= months) {
        throw new Error('تعداد ماه هر مرحله باید معتبر باشد.');
      }
      if (calculationType === 'installment') {
        return calculateSteppedLoan(principal, annualInterestRatePercent, months, stepMonths, stepRateIncrease);
      } else {
        throw new Error(`محاسبه ${calculationType} برای وام اقساط پلکانی در حال حاضر پشتیبانی نمی‌شود.`);
      }
    
    default:
      throw new Error('نوع وام نامعتبر است.');
  }

  throw new Error('نوع محاسبه نامعتبر است.');
}
