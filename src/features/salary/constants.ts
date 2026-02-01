/**
 * ثابت‌های قانونی مربوط به محاسبه حقوق و دستمزد در ایران - سال ۱۴۰۴
 * این فایل امکان به‌روزرسانی سالانه قوانین را فراهم می‌کند
 */

// =================================
// حداقل دستمزد و مزایای پایه ۱۴۰۴
// =================================

export const MINIMUM_WAGE_1404 = 8_100_000; // حقوق پایه ماهانه (تومان)
export const HOUSING_ALLOWANCE_1404 = 2_500_000; // کمک هزینه مسکن (تومان)
export const FOOD_ALLOWANCE_1404 = 1_000_000; // کمک هزینه غذا (تومان)

// =================================
// نرخ‌های بیمه تامین اجتماعی
// =================================

export const WORKER_INSURANCE_RATE = 7; // درصد سهم کارگر از بیمه
export const EMPLOYER_INSURANCE_RATE = 23; // درصد سهم کارفرما از بیمه
export const TOTAL_INSURANCE_RATE = 30; // مجموع نرخ بیمه

// =================================
// معافیت‌های مالیاتی ۱۴۰۴
// =================================

export const ANNUAL_TAX_EXEMPTION_1404 = 288_000_000; // معافیت سالانه مالیات (تومان)
export const MONTHLY_TAX_EXEMPTION_1404 = ANNUAL_TAX_EXEMPTION_1404 / 12; // معافیت ماهانه

// =================================
// جدول مالیات تصاعدی سال ۱۴۰۴
// =================================

export interface TaxBracket {
  from: number; // از (تومان)
  to: number; // تا (تومان)
  rate: number; // نرخ مالیات (درصد)
  fixedAmount: number; // مبلغ ثابت مالیات (تومان)
}

export const TAX_BRACKETS_1404: TaxBracket[] = [
  { from: 0, to: 24_000_000, rate: 0, fixedAmount: 0 },
  { from: 24_000_001, to: 48_000_000, rate: 10, fixedAmount: 0 },
  { from: 48_000_001, to: 96_000_000, rate: 15, fixedAmount: 2_400_000 },
  { from: 96_000_001, to: 192_000_000, rate: 20, fixedAmount: 9_600_000 },
  { from: 192_000_001, to: 384_000_000, rate: 25, fixedAmount: 28_800_000 },
  { from: 384_000_001, to: Infinity, rate: 30, fixedAmount: 76_800_000 },
];

// =================================
// مزایای قانونی
// =================================

export const CHILD_ALLOWANCE_PER_CHILD = 150_000; // حق اولاد به ازای هر فرزند (تومان)
export const SPOUSE_ALLOWANCE = 500_000; // حق اولاد همسر (تومان)
export const EXPERIENCE_BONUS_PER_5_YEARS = 500_000; // پاداش سابقه به ازای هر ۵ سال (تومان)

// =================================
// نرخ‌های اضافه‌کاری
// =================================

export const OVERTIME_MULTIPLIER_NORMAL = 1.4; // ضریب اضافه‌کاری عادی
export const OVERTIME_MULTIPLIER_NIGHT = 1.5; // ضریب اضافه‌کاری شب
export const OVERTIME_MULTIPLIER_HOLIDAY = 1.8; // ضریب اضافه‌کاری تعطیلات رسمی

// =================================
// ضرایب مأموریت و ایاب‌وذهاب
// =================================

export const MISSION_DAILY_RATE = 200_000; // حق مأموریت روزانه (تومان)
export const TRANSPORTATION_ALLOWANCE = 150_000; // کمک هزینه ایاب‌وذهاب (تومان)

// =================================
// بن کارگری
// =================================

export const WORKER_COUPON_MONTHLY = 100_000; // بن کارگری ماهانه (تومان)

// =================================
// ساعات کاری استاندارد
// =================================

export const STANDARD_WORKING_HOURS_PER_DAY = 8; // ساعات کاری استاندارد روزانه
export const STANDARD_WORKING_DAYS_PER_MONTH = 30; // روزهای کاری استاندارد ماهانه
export const STANDARD_WORKING_HOURS_PER_MONTH = STANDARD_WORKING_HOURS_PER_DAY * STANDARD_WORKING_DAYS_PER_MONTH; // ۲۴۰ ساعت

// =================================
// ضریب سنوات و عیدی
// =================================

export const SENIORITY_BONUS_RATE = 2.5; // ضریب سنوات (درصد از حقوق پایه)
export const ANNUAL_BONUS_RATE = 100; // ضریب عیدی (درصد از حقوق پایه)
export const MAX_ANNUAL_BONUS = 8_100_000 * 2; // سقف عیدی سالانه

// =================================
// مناطق کمتر توسعه‌یافته
// =================================

export const DEVELOPMENT_ZONE_TAX_DISCOUNT = 0.5; // تخفیف ۵۰٪ مالیات مناطق کمتر توسعه‌یافته
