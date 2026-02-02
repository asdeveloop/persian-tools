export type CalendarType = 'jalali' | 'gregorian';

export type DateParts = {
  year: number;
  month: number;
  day: number;
};

const JALALI_YEAR_MIN = 1;
const JALALI_YEAR_MAX = 3177;

const gregorianMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

const div = (a: number, b: number) => Math.trunc(a / b);
const mod = (a: number, b: number) => a - Math.trunc(a / b) * b;

const jalaliBreaks = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
  2456, 3178,
];

type JalaliCalc = {
  leap: number;
  gy: number;
  march: number;
};

function jalaliCalendar(jy: number): JalaliCalc {
  if (jy < jalaliBreaks[0] || jy >= jalaliBreaks[jalaliBreaks.length - 1]) {
    throw new Error('سال شمسی خارج از بازه معتبر است.');
  }

  const gy = jy + 621;
  let leapJ = -14;
  let jp = jalaliBreaks[0];
  let jm = 0;
  let jump = 0;

  for (let i = 1; i < jalaliBreaks.length; i += 1) {
    jm = jalaliBreaks[i];
    jump = jm - jp;
    if (jy < jm) {
      break;
    }
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) {
    leapJ += 1;
  }

  const leapG = div(gy, 4) - div(div(gy, 100) + 1, 4) * 3 - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) {
    n = n - jump + div(jump + 4, 33) * 33;
  }

  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }

  return { leap, gy, march };
}

export function isLeapGregorian(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInGregorianMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    return 0;
  }
  if (month === 2) {
    return isLeapGregorian(year) ? 29 : 28;
  }
  return gregorianMonthDays[month - 1];
}

export function isValidGregorianDate({ year, month, day }: DateParts): boolean {
  if (year < 1 || year > 9999) {
    return false;
  }
  const daysInMonth = daysInGregorianMonth(year, month);
  return daysInMonth > 0 && day >= 1 && day <= daysInMonth;
}

export function isLeapJalali(year: number): boolean {
  return jalaliCalendar(year).leap === 0;
}

export function isValidJalaliDate({ year, month, day }: DateParts): boolean {
  if (year < JALALI_YEAR_MIN || year > JALALI_YEAR_MAX) {
    return false;
  }
  if (month < 1 || month > 12) {
    return false;
  }
  const maxDay = month <= 6 ? 31 : month <= 11 ? 30 : isLeapJalali(year) ? 30 : 29;
  return day >= 1 && day <= maxDay;
}

// Conversion formulas adapted from jalaali-js (MIT)
export function jalaliToGregorian(jy: number, jm: number, jd: number): DateParts {
  jy -= 979;
  jm -= 1;
  jd -= 1;

  let jDayNo = 365 * jy + div(jy, 33) * 8 + div((jy % 33) + 3, 4) + jd;

  for (let i = 0; i < jm; i += 1) {
    jDayNo += i < 6 ? 31 : 30;
  }

  let gDayNo = jDayNo + 79;

  let gy = 1600 + 400 * div(gDayNo, 146097);
  gDayNo = gDayNo % 146097;

  let leap = true;
  if (gDayNo >= 36525) {
    gDayNo -= 1;
    gy += 100 * div(gDayNo, 36524);
    gDayNo = gDayNo % 36524;
    if (gDayNo >= 365) {
      gDayNo += 1;
    } else {
      leap = false;
    }
  }

  gy += 4 * div(gDayNo, 1461);
  gDayNo %= 1461;

  if (gDayNo >= 366) {
    leap = false;
    gDayNo -= 1;
    gy += div(gDayNo, 365);
    gDayNo = gDayNo % 365;
  }

  const monthDays = [...gregorianMonthDays];
  if (leap) {
    monthDays[1] = 29;
  }

  let gm = 0;
  for (; gm < 12 && gDayNo >= monthDays[gm]; gm += 1) {
    gDayNo -= monthDays[gm];
  }

  const gd = gDayNo + 1;
  return { year: gy, month: gm + 1, day: gd };
}

export function gregorianToJalali(gy: number, gm: number, gd: number): DateParts {
  gy -= 1600;
  gm -= 1;
  gd -= 1;

  let gDayNo = 365 * gy + div(gy + 3, 4) - div(gy + 99, 100) + div(gy + 399, 400);

  for (let i = 0; i < gm; i += 1) {
    gDayNo += gregorianMonthDays[i];
  }
  if (gm > 1 && isLeapGregorian(gy + 1600)) {
    gDayNo += 1;
  }

  gDayNo += gd;

  let jDayNo = gDayNo - 79;

  const jNp = div(jDayNo, 12053);
  jDayNo %= 12053;

  let jy = 979 + 33 * jNp + 4 * div(jDayNo, 1461);
  jDayNo %= 1461;

  if (jDayNo >= 366) {
    jy += div(jDayNo - 1, 365);
    jDayNo = (jDayNo - 1) % 365;
  }

  const jm = jDayNo < 186 ? 1 + div(jDayNo, 31) : 7 + div(jDayNo - 186, 30);
  const jd = jDayNo < 186 ? 1 + mod(jDayNo, 31) : 1 + mod(jDayNo - 186, 30);

  return { year: jy, month: jm, day: jd };
}

export function createUtcDate(date: DateParts): Date {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

export function getUtcDateParts(date: Date): DateParts {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

export function getLocalDateParts(date: Date): DateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function normalizeToGregorian(date: DateParts, calendar: CalendarType): DateParts | null {
  if (calendar === 'gregorian') {
    return isValidGregorianDate(date) ? date : null;
  }
  return isValidJalaliDate(date) ? jalaliToGregorian(date.year, date.month, date.day) : null;
}

export function compareDateParts(a: DateParts, b: DateParts): number {
  if (a.year !== b.year) {
    return a.year < b.year ? -1 : 1;
  }
  if (a.month !== b.month) {
    return a.month < b.month ? -1 : 1;
  }
  if (a.day !== b.day) {
    return a.day < b.day ? -1 : 1;
  }
  return 0;
}

export function differenceInDays(start: DateParts, end: DateParts): number {
  const startDate = createUtcDate(start);
  const endDate = createUtcDate(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function differenceInYmd(
  start: DateParts,
  end: DateParts,
): {
  years: number;
  months: number;
  days: number;
} {
  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;

  if (days < 0) {
    months -= 1;
    const prevMonth = end.month === 1 ? 12 : end.month - 1;
    const prevYear = end.month === 1 ? end.year - 1 : end.year;
    days += daysInGregorianMonth(prevYear, prevMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export function addDays(date: DateParts, offsetDays: number): DateParts {
  const base = createUtcDate(date);
  const shifted = new Date(base.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return getUtcDateParts(shifted);
}

export function dayOfYear(date: DateParts): number {
  let total = 0;
  for (let i = 1; i < date.month; i += 1) {
    total += daysInGregorianMonth(date.year, i);
  }
  return total + date.day;
}

export function daysInGregorianYear(year: number): number {
  return isLeapGregorian(year) ? 366 : 365;
}

export function getWeekdayName(date: DateParts): string {
  const weekday = createUtcDate(date).getUTCDay();
  switch (weekday) {
    case 0:
      return 'یکشنبه';
    case 1:
      return 'دوشنبه';
    case 2:
      return 'سه‌شنبه';
    case 3:
      return 'چهارشنبه';
    case 4:
      return 'پنجشنبه';
    case 5:
      return 'جمعه';
    default:
      return 'شنبه';
  }
}
