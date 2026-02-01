/**
 * قوانین مربوط به محاسبه اضافه‌کاری
 */

import { 
  OVERTIME_MULTIPLIER_NORMAL, 
  OVERTIME_MULTIPLIER_NIGHT, 
  OVERTIME_MULTIPLIER_HOLIDAY,
  STANDARD_WORKING_HOURS_PER_DAY,
  STANDARD_WORKING_DAYS_PER_MONTH 
} from '../constants';

export type OvertimeType = 'normal' | 'night' | 'holiday';

/**
 * محاسبه مبلغ اضافه‌کاری
 * @param baseSalary حقوق پایه ماهانه (تومان)
 * @param overtimeHours تعداد ساعات اضافه‌کاری
 * @param type نوع اضافه‌کاری (پیش‌فرض: normal)
 * @returns مبلغ اضافه‌کاری (تومان)
 */
export function calculateOvertime(
  baseSalary: number,
  overtimeHours: number,
  type: OvertimeType = 'normal'
): number {
  if (overtimeHours <= 0) return 0;
  
  const hourlyRate = calculateHourlyRate(baseSalary);
  const multiplier = getOvertimeMultiplier(type);
  
  return hourlyRate * overtimeHours * multiplier;
}

/**
 * محاسبه نرخ ساعتی حقوق
 * @param baseSalary حقوق پایه ماهانه (تومان)
 * @returns نرخ ساعتی (تومان)
 */
export function calculateHourlyRate(baseSalary: number): number {
  const monthlyHours = STANDARD_WORKING_HOURS_PER_DAY * STANDARD_WORKING_DAYS_PER_MONTH;
  return baseSalary / monthlyHours;
}

/**
 * دریافت ضریب اضافه‌کاری بر اساس نوع
 * @param type نوع اضافه‌کاری
 * @returns ضریب اضافه‌کاری
 */
export function getOvertimeMultiplier(type: OvertimeType): number {
  switch (type) {
    case 'night':
      return OVERTIME_MULTIPLIER_NIGHT;
    case 'holiday':
      return OVERTIME_MULTIPLIER_HOLIDAY;
    default:
      return OVERTIME_MULTIPLIER_NORMAL;
  }
}

/**
 * محاسبه مجموع اضافه‌کاری با انواع مختلف
 * @param baseSalary حقوق پایه ماهانه (تومان)
 * @param normalHours ساعات اضافه‌کاری عادی
 * @param nightHours ساعات اضافه‌کاری شب
 * @param holidayHours ساعات اضافه‌کاری تعطیلات
 * @returns مجموع مبلغ اضافه‌کاری (تومان)
 */
export function calculateTotalOvertime(
  baseSalary: number,
  normalHours: number = 0,
  nightHours: number = 0,
  holidayHours: number = 0
): number {
  const normalAmount = calculateOvertime(baseSalary, normalHours, 'normal');
  const nightAmount = calculateOvertime(baseSalary, nightHours, 'night');
  const holidayAmount = calculateOvertime(baseSalary, holidayHours, 'holiday');
  
  return normalAmount + nightAmount + holidayAmount;
}

/**
 * اعتبارسنجی ساعات اضافه‌کاری
 * @param overtimeHours ساعات اضافه‌کاری
 * @returns آیا ساعات معتبر است؟
 */
export function isValidOvertimeHours(overtimeHours: number): boolean {
  return Number.isFinite(overtimeHours) && overtimeHours >= 0 && overtimeHours <= 120; // حداکثر ۱۲۰ ساعت در ماه
}
