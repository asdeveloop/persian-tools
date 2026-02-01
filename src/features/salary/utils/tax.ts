/**
 * ابزارهای محاسبه مالیات بر اساس قوانین ایران
 */

import { TAX_BRACKETS_1404, ANNUAL_TAX_EXEMPTION_1404, DEVELOPMENT_ZONE_TAX_DISCOUNT } from '../constants';
import type { TaxBracket } from '../constants';

/**
 * محاسبه مالیات تصاعدی بر اساس درآمد سالانه
 * @param annualIncome درآمد سالانه مشمول مالیات (تومان)
 * @returns مبلغ مالیات سالانه (تومان)
 */
export function calculateProgressiveTax(annualIncome: number): number {
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

/**
 * محاسبه مالیات ماهانه با اعمال معافیت‌های قانونی
 * @param monthlyTaxableIncome درآمد ماهانه مشمول مالیات (تومان)
 * @param isDevelopmentZone آیا در منطقه کمتر توسعه‌یافته مشغول است؟
 * @returns مبلغ مالیات ماهانه (تومان)
 */
export function calculateMonthlyTax(
  monthlyTaxableIncome: number, 
  isDevelopmentZone: boolean = false
): number {
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
    taxAmount *= DEVELOPMENT_ZONE_TAX_DISCOUNT;
  }
  
  return Math.max(0, taxAmount);
}

/**
 * دریافت پله‌های مالیاتی اعمال شده برای یک درآمد
 * @param annualIncome درآمد سالانه (تومان)
 * @returns آرایه‌ای از پله‌های مالیاتی اعمال شده
 */
export function getAppliedTaxBrackets(annualIncome: number): TaxBracket[] {
  return TAX_BRACKETS_1404.filter(bracket => 
    annualIncome > bracket.from
  );
}

/**
 * محاسبه نرخ مؤثر مالیات
 * @param monthlyTax مالیات ماهانه (تومان)
 * @param grossMonthlySalary حقوق ناخالص ماهانه (تومان)
 * @returns نرخ مؤثر مالیات (درصد)
 */
export function calculateEffectiveTaxRate(
  monthlyTax: number, 
  grossMonthlySalary: number
): number {
  if (grossMonthlySalary <= 0) return 0;
  return (monthlyTax / grossMonthlySalary) * 100;
}

/**
 * بررسی معافیت مالیات بر اساس درآمد سالانه
 * @param annualIncome درآمد سالانه (تومان)
 * @returns آیا مشمول معافیت کامل است؟
 */
export function isFullyTaxExempt(annualIncome: number): boolean {
  return annualIncome <= ANNUAL_TAX_EXEMPTION_1404;
}

/**
 * محاسبه مالیات با نرخ ثابت ۱۰٪ (برای مزایای خاص)
 * @param amount مبلغ مشمول مالیات (تومان)
 * @returns مالیات با نرخ ۱۰٪ (تومان)
 */
export function calculateFlatTax(amount: number): number {
  return (amount * 10) / 100;
}
