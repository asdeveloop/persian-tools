import { describe, it, expect } from 'vitest';
import {
  calculateTax,
  calculateCompoundInterest,
  convertRialToToman,
  convertTomanToRial,
} from '@/shared/utils/finance';

describe('finance utils', () => {
  it('calculates tax correctly', () => {
    const result = calculateTax(1000, 9);
    expect(result.taxAmount).toBe(90);
    expect(result.totalWithTax).toBe(1090);
  });

  it('calculates compound interest', () => {
    const result = calculateCompoundInterest({
      principal: 1000,
      annualRatePercent: 12,
      years: 1,
      timesPerYear: 12,
    });
    expect(result.total).toBeGreaterThan(1000);
    expect(result.interest).toBeGreaterThan(0);
  });

  it('converts rial and toman', () => {
    expect(convertRialToToman(100)).toBe(10);
    expect(convertTomanToRial(10)).toBe(100);
  });
});
