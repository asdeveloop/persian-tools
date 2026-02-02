import { describe, it, expect } from 'vitest';
import {
  toPersianNumbers,
  formatPersianCurrency,
  formatPersianNumber,
  formatPersianDate,
  fixPersianSpacing,
  isPersianText,
} from '@/shared/utils/persian';

describe('Persian Utils', () => {
  describe('toPersianNumbers', () => {
    it('should convert English numbers to Persian', () => {
      expect(toPersianNumbers('123')).toBe('۱۲۳');
      expect(toPersianNumbers(456)).toBe('۴۵۶');
    });

    it('should handle mixed strings', () => {
      expect(toPersianNumbers('Price: 100')).toBe('Price: ۱۰۰');
    });
  });

  describe('formatPersianCurrency', () => {
    it('should format number as currency', () => {
      const result = formatPersianCurrency(1000000);
      expect(result).toContain('تومان');
      expect(result).toContain('۱');
    });

    it('should support custom currency', () => {
      const result = formatPersianCurrency(500, 'ریال');
      expect(result).toContain('ریال');
    });
  });

  describe('formatPersianNumber', () => {
    it('should use Persian digits and separators', () => {
      const result = formatPersianNumber(12345);
      expect(result).toContain('۱۲');
      expect(result).toContain('٬');
    });
  });

  describe('formatPersianDate', () => {
    it('should format date using Persian calendar when available', () => {
      const date = new Date(2024, 2, 20);
      let expected = '';
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      try {
        expected = new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(date);
      } catch {
        expected = new Intl.DateTimeFormat('fa-IR', options).format(date);
      }
      expect(formatPersianDate(date)).toBe(expected);
    });
  });

  describe('fixPersianSpacing', () => {
    it('should insert half-space before suffixes', () => {
      expect(fixPersianSpacing('کتابها')).toBe('کتاب\u200Cها');
      expect(fixPersianSpacing('بهترین')).toBe('به\u200Cترین');
    });

    it('should not duplicate half-space', () => {
      expect(fixPersianSpacing('کتاب\u200Cها')).toBe('کتاب\u200Cها');
    });
  });

  describe('isPersianText', () => {
    it('should detect Persian text', () => {
      expect(isPersianText('سلام')).toBe(true);
      expect(isPersianText('hello')).toBe(false);
      expect(isPersianText('hello سلام')).toBe(true);
    });
  });
});
