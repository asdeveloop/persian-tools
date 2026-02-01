import { describe, it, expect } from 'vitest';
import { parseLooseNumber, toEnglishDigits } from './number';

describe('number utils', () => {
  it('converts Persian digits to English', () => {
    expect(toEnglishDigits('۱۲۳٬۴۵۶٫۷۸')).toBe('123,456.78');
  });

  it('parses loose Persian numbers with separators', () => {
    expect(parseLooseNumber('۱۲٬۳۴۵٬۶۷۸')).toBe(12345678);
  });

  it('returns null for invalid input', () => {
    expect(parseLooseNumber('۱۲a۳')).toBeNull();
    expect(parseLooseNumber('')).toBeNull();
  });

  it('parses negative numbers', () => {
    expect(parseLooseNumber('-۱۲۳۴')).toBe(-1234);
  });
});
