/**
 * قوانین مربوط به محاسبه حقوق پایه
 */

import {
  MINIMUM_WAGE_1404,
  EXPERIENCE_BONUS_PER_5_YEARS,
  STANDARD_WORKING_DAYS_PER_MONTH,
} from '../constants';

/**
 * محاسبه حقوق پایه بر اساس روزهای کاری
 * @param baseSalary حقوق پایه ماهانه (تومان)
 * @param workingDays تعداد روزهای کاری در ماه (پیش‌فرض: ۳۰)
 * @returns حقوق پایه محاسبه شده (تومان)
 */
export function calculateBaseSalary(
  baseSalary: number,
  workingDays: number = STANDARD_WORKING_DAYS_PER_MONTH,
): number {
  if (baseSalary < MINIMUM_WAGE_1404) {
    throw new Error(`حقوق پایه نمی‌تواند کمتر از حداقل دستمزد (${MINIMUM_WAGE_1404.toLocaleString('fa-IR')} تومان) باشد.`);
  }

  const dailySalary = baseSalary / STANDARD_WORKING_DAYS_PER_MONTH;
  return dailySalary * workingDays;
}

/**
 * محاسبه پاداش سابقه کار
 * @param workExperienceYears سابقه کار (سال)
 * @returns مبلغ پاداش سابقه کار (تومان)
 */
export function calculateExperienceBonus(workExperienceYears: number): number {
  if (workExperienceYears <= 0) {
    return 0;
  }

  const fiveYearPeriods = Math.floor(workExperienceYears / 5);
  return fiveYearPeriods * EXPERIENCE_BONUS_PER_5_YEARS;
}

/**
 * محاسبه حقوق کل شامل پاداش سابقه
 * @param baseSalary حقوق پایه (تومان)
 * @param workExperienceYears سابقه کار (سال)
 * @param workingDays تعداد روزهای کاری
 * @returns حقوق کل پایه (تومان)
 */
export function calculateTotalBaseSalary(
  baseSalary: number,
  workExperienceYears = 0,
  workingDays: number = STANDARD_WORKING_DAYS_PER_MONTH,
): number {
  const calculatedBaseSalary = calculateBaseSalary(baseSalary, workingDays);
  const experienceBonus = calculateExperienceBonus(workExperienceYears);

  return calculatedBaseSalary + experienceBonus;
}

/**
 * اعتبارسنجی حقوق پایه
 * @param baseSalary حقوق پایه (تومان)
 * @returns آیا حقوق پایه معتبر است؟
 */
export function isValidBaseSalary(baseSalary: number): boolean {
  return Number.isFinite(baseSalary) && baseSalary >= MINIMUM_WAGE_1404;
}
