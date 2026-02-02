import { describe, it, expect } from 'vitest';
import { toPersianNumbers, formatPersianCurrency, isPersianText } from '@/shared/utils/persian';

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

  describe('isPersianText', () => {
    it('should detect Persian text', () => {
      expect(isPersianText('سلام')).toBe(true);
      expect(isPersianText('hello')).toBe(false);
      expect(isPersianText('hello سلام')).toBe(true);
    });
  });
});
