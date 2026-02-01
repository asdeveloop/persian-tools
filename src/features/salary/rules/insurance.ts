/**
 * قوانین مربوط به محاسبه بیمه تامین اجتماعی
 */

import { 
  WORKER_INSURANCE_RATE, 
  EMPLOYER_INSURANCE_RATE, 
  TOTAL_INSURANCE_RATE 
} from '../constants';

/**
 * محاسبه سهم کارگر از بیمه
 * @param grossSalary حقوق ناخالص (تومان)
 * @param customRate نرخ سفارشی بیمه کارگر (اختیاری)
 * @returns مبلغ بیمه سهم کارگر (تومان)
 */
export function calculateWorkerInsurance(
  grossSalary: number, 
  customRate?: number
): number {
  const rate = customRate ?? WORKER_INSURANCE_RATE;
  return (grossSalary * rate) / 100;
}

/**
 * محاسبه سهم کارفرما از بیمه
 * @param grossSalary حقوق ناخالص (تومان)
 * @param customRate نرخ سفارشی بیمه کارفرما (اختیاری)
 * @returns مبلغ بیمه سهم کارفرما (تومان)
 */
export function calculateEmployerInsurance(
  grossSalary: number, 
  customRate?: number
): number {
  const rate = customRate ?? EMPLOYER_INSURANCE_RATE;
  return (grossSalary * rate) / 100;
}

/**
 * محاسبه مجموع بیمه (سهم کارگر + کارفرما)
 * @param grossSalary حقوق ناخالص (تومان)
 * @returns مجموع مبلغ بیمه (تومان)
 */
export function calculateTotalInsurance(grossSalary: number): number {
  return (grossSalary * TOTAL_INSURANCE_RATE) / 100;
}

/**
 * محاسبه درآمد مشمول بیمه
 * @param grossSalary حقوق ناخالص (تومان)
 * @param exemptAmount مبالغ معاف از بیمه (تومان)
 * @returns درآمد مشمول بیمه (تومان)
 */
export function calculateInsuranceableIncome(
  grossSalary: number, 
  exemptAmount: number = 0
): number {
  return Math.max(0, grossSalary - exemptAmount);
}

/**
 * دریافت جزئیات بیمه
 * @param grossSalary حقوق ناخالص (تومان)
 * @param exemptAmount مبالغ معاف از بیمه (تومان)
 * @returns جزئیات محاسبه بیمه
 */
export function getInsuranceDetails(
  grossSalary: number, 
  exemptAmount: number = 0
) {
  const insuranceableIncome = calculateInsuranceableIncome(grossSalary, exemptAmount);
  
  return {
    grossSalary,
    exemptAmount,
    insuranceableIncome,
    workerShare: calculateWorkerInsurance(insuranceableIncome),
    employerShare: calculateEmployerInsurance(insuranceableIncome),
    total: calculateTotalInsurance(insuranceableIncome),
    workerRate: WORKER_INSURANCE_RATE,
    employerRate: EMPLOYER_INSURANCE_RATE,
    totalRate: TOTAL_INSURANCE_RATE
  };
}

/**
 * اعتبارسنجی نرخ بیمه
 * @param rate نرخ بیمه (درصد)
 * @returns آیا نرخ معتبر است؟
 */
export function isValidInsuranceRate(rate: number): boolean {
  return Number.isFinite(rate) && rate >= 0 && rate <= 100;
}

/**
 * محاسبه معافیت دو هفتم بیمه
 * @param grossSalary حقوق ناخالص (تومان)
 * @returns مبلغ معافیت دو هفتم (تومان)
 */
export function calculateTwoSeventhsExemption(grossSalary: number): number {
  return (grossSalary * 2) / 7;
}
