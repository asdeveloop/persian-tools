import { describe, it, expect } from 'vitest';
import {
  addDays,
  dayOfYear,
  getWeekdayName,
  normalizeToGregorian,
  differenceInDays,
  differenceInYmd,
  gregorianToJalali,
  isLeapJalali,
  isValidJalaliDate,
  isValidGregorianDate,
  jalaliToGregorian,
} from './date-tools.logic';

describe('date tools logic', () => {
  it('converts Gregorian to Jalali correctly for Nowruz 1403', () => {
    const jalali = gregorianToJalali(2024, 3, 20);
    expect(jalali).toEqual({ year: 1403, month: 1, day: 1 });
  });

  it('converts Jalali to Gregorian correctly for 1402/07/01', () => {
    const gregorian = jalaliToGregorian(1402, 7, 1);
    expect(gregorian).toEqual({ year: 2023, month: 9, day: 23 });
  });

  it('validates leap years in Jalali calendar', () => {
    expect(isLeapJalali(1399)).toBe(true);
    expect(isLeapJalali(1400)).toBe(false);
  });

  it('validates date ranges', () => {
    expect(isValidGregorianDate({ year: 2024, month: 2, day: 29 })).toBe(true);
    expect(isValidGregorianDate({ year: 2023, month: 2, day: 29 })).toBe(false);
    expect(isValidJalaliDate({ year: 1401, month: 12, day: 30 })).toBe(false);
  });

  it('calculates difference and day shifts accurately', () => {
    const start = { year: 2024, month: 3, day: 20 };
    const end = { year: 2024, month: 3, day: 21 };
    expect(differenceInDays(start, end)).toBe(1);

    const shifted = addDays(start, 10);
    expect(shifted).toEqual({ year: 2024, month: 3, day: 30 });

    const ymd = differenceInYmd(start, { year: 2025, month: 4, day: 25 });
    expect(ymd).toEqual({ years: 1, months: 1, days: 5 });
  });

  it('returns day of year and weekday name correctly', () => {
    expect(dayOfYear({ year: 2024, month: 1, day: 1 })).toBe(1);
    expect(dayOfYear({ year: 2024, month: 12, day: 31 })).toBe(366);
    expect(getWeekdayName({ year: 2024, month: 3, day: 20 })).toBe('چهارشنبه');
  });

  it('normalizes dates based on calendar type', () => {
    const greg = normalizeToGregorian({ year: 2024, month: 3, day: 20 }, 'gregorian');
    expect(greg).toEqual({ year: 2024, month: 3, day: 20 });

    const jalali = normalizeToGregorian({ year: 1403, month: 1, day: 1 }, 'jalali');
    expect(jalali).toEqual({ year: 2024, month: 3, day: 20 });

    const invalid = normalizeToGregorian({ year: 1403, month: 13, day: 1 }, 'jalali');
    expect(invalid).toBeNull();
  });
});
