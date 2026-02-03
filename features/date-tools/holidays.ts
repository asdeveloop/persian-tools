import type { DateParts } from './date-tools.logic';

export type HolidayType = 'official' | 'cultural';

export type JalaliHoliday = {
  month: number;
  day: number;
  title: string;
  type: HolidayType;
};

export const FIXED_JALALI_HOLIDAYS: JalaliHoliday[] = [
  { month: 1, day: 1, title: 'نوروز', type: 'official' },
  { month: 1, day: 2, title: 'نوروز', type: 'official' },
  { month: 1, day: 3, title: 'نوروز', type: 'official' },
  { month: 1, day: 4, title: 'نوروز', type: 'official' },
  { month: 1, day: 12, title: 'روز جمهوری اسلامی', type: 'official' },
  { month: 1, day: 13, title: 'روز طبیعت', type: 'official' },
  { month: 3, day: 14, title: 'رحلت امام خمینی', type: 'official' },
  { month: 3, day: 15, title: 'قیام ۱۵ خرداد', type: 'official' },
  { month: 11, day: 22, title: 'پیروزی انقلاب اسلامی', type: 'official' },
  { month: 12, day: 29, title: 'ملی شدن صنعت نفت', type: 'official' },
];

export type JalaliHolidayResult = JalaliHoliday & { year: number };

export function listJalaliHolidays(year: number): JalaliHolidayResult[] {
  return FIXED_JALALI_HOLIDAYS.map((item) => ({ ...item, year }));
}

export function getJalaliHoliday(date: DateParts): JalaliHolidayResult | null {
  const match = FIXED_JALALI_HOLIDAYS.find(
    (holiday) => holiday.month === date.month && holiday.day === date.day,
  );
  if (!match) {
    return null;
  }
  return { ...match, year: date.year };
}
