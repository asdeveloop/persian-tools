/**
 * قوانین مربوط به محاسبه کسورات مختلف
 */

/**
 * محاسبه سایر کسورات
 * @param deductions لیست مبالغ کسورات (تومان)
 * @returns مجموع کسورات (تومان)
 */
export function calculateOtherDeductions(...deductions: number[]): number {
  return deductions.reduce((total, deduction) => {
    if (Number.isFinite(deduction) && deduction > 0) {
      return total + deduction;
    }
    return total;
  }, 0);
}

/**
 * محاسبه کسورات قانونی (غیر از بیمه و مالیات)
 * @param input ورودی کسورات
 * @returns مجموع کسورات قانونی (تومان)
 */
export interface LegalDeductionsInput {
  loanPayment?: number; // اقساط وام
  unionFee?: number; // حق عضویت اتحادیه
  penalty?: number; // جریمه و غیبت
  advancePayment?: number; // پیش‌پرداخت حقوق
  other?: number; // سایر کسورات
}

export function calculateLegalDeductions(input: LegalDeductionsInput = {}): number {
  const {
    loanPayment = 0,
    unionFee = 0,
    penalty = 0,
    advancePayment = 0,
    other = 0,
  } = input;

  return calculateOtherDeductions(loanPayment, unionFee, penalty, advancePayment, other);
}

/**
 * محاسبه مجموع کسورات شامل بیمه و مالیات
 * @param insuranceAmount مبلغ بیمه (تومان)
 * @param taxAmount مبلغ مالیات (تومان)
 * @param otherDeductions سایر کسورات (تومان)
 * @returns مجموع کسورات (تومان)
 */
export function calculateTotalDeductions(
  insuranceAmount: number,
  taxAmount: number,
  otherDeductions = 0,
): number {
  return insuranceAmount + taxAmount + otherDeductions;
}

/**
 * دریافت جزئیات کسورات
 * @param insuranceAmount مبلغ بیمه (تومان)
 * @param taxAmount مبلغ مالیات (تومان)
 * @param input ورودی کسورات قانونی
 * @returns جزئیات کامل کسورات
 */
export function getDeductionDetails(
  insuranceAmount: number,
  taxAmount: number,
  input: LegalDeductionsInput = {},
) {
  const legalDeductions = calculateLegalDeductions(input);
  const totalDeductions = calculateTotalDeductions(insuranceAmount, taxAmount, legalDeductions);

  return {
    insurance: insuranceAmount,
    tax: taxAmount,
    legal: legalDeductions,
    total: totalDeductions,
    breakdown: {
      loanPayment: input.loanPayment ?? 0,
      unionFee: input.unionFee ?? 0,
      penalty: input.penalty ?? 0,
      advancePayment: input.advancePayment ?? 0,
      other: input.other ?? 0,
    },
  };
}

/**
 * اعتبارسنجی مبالغ کسورات
 * @param amount مبلغ کسورات (تومان)
 * @returns آیا مبلغ معتبر است؟
 */
export function isValidDeductionAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount >= 0;
}
