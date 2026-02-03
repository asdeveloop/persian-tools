import { describe, it, expect } from 'vitest';
import { getJalaliHoliday, listJalaliHolidays } from './holidays';

describe('jalali holidays', () => {
  it('returns fixed holidays for a date', () => {
    const holiday = getJalaliHoliday({ year: 1403, month: 1, day: 1 });
    expect(holiday?.title).toBe('نوروز');
  });

  it('lists holidays for a year', () => {
    const list = listJalaliHolidays(1403);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]?.year).toBe(1403);
  });
});
