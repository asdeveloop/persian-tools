import { describe, expect, it } from 'vitest';
import { calculateSalary } from './salary.logic';

describe('calculateSalary', () => {
  it('should calculate net salary', () => {
    const r = calculateSalary({
      grossMonthlySalary: 30_000_000,
      insurancePercent: 7,
      taxPercent: 10,
      otherDeductions: 0
    });
    expect(r.insuranceAmount).toBeCloseTo(2_100_000);
    expect(r.taxAmount).toBeCloseTo(3_000_000);
    expect(r.netSalary).toBeCloseTo(24_900_000);
  });

  it('should not return negative net salary', () => {
    const r = calculateSalary({
      grossMonthlySalary: 1_000_000,
      insurancePercent: 50,
      taxPercent: 50,
      otherDeductions: 1_000_000
    });
    expect(r.netSalary).toBe(0);
  });

  it('should reject invalid tax percent', () => {
    expect(() =>
      calculateSalary({ grossMonthlySalary: 10, insurancePercent: 0, taxPercent: 200, otherDeductions: 0 })
    ).toThrow();
  });
});
