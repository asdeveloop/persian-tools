import type { LoanInput, LoanResult } from './loan.types';

export function calculateLoan(input: LoanInput): LoanResult {
  const { principal, annualInterestRatePercent, months } = input;

  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error('مبلغ وام باید بزرگ‌تر از صفر باشد.');
  }
  if (!Number.isFinite(annualInterestRatePercent) || annualInterestRatePercent < 0) {
    throw new Error('نرخ سود سالانه نامعتبر است.');
  }
  if (!Number.isFinite(months) || !Number.isInteger(months) || months <= 0) {
    throw new Error('مدت وام (ماه) باید یک عدد صحیحِ بزرگ‌تر از صفر باشد.');
  }

  const monthlyRate = annualInterestRatePercent / 100 / 12;

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
