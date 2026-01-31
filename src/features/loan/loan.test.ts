import { describe, expect, it } from 'vitest';
import { calculateLoan } from './loan.logic';

describe('calculateLoan', () => {
  it('should calculate zero-interest loan', () => {
    const r = calculateLoan({ principal: 120_000_000, annualInterestRatePercent: 0, months: 12 });
    expect(r.monthlyPayment).toBeCloseTo(10_000_000);
    expect(r.totalInterest).toBeCloseTo(0);
  });

  it('should calculate annuity loan with interest', () => {
    const r = calculateLoan({ principal: 100_000_000, annualInterestRatePercent: 24, months: 24 });
    expect(r.monthlyPayment).toBeGreaterThan(0);
    expect(r.totalPayment).toBeGreaterThan(100_000_000);
    expect(r.totalInterest).toBeGreaterThan(0);
  });

  it('should reject invalid months', () => {
    expect(() => calculateLoan({ principal: 100_000_000, annualInterestRatePercent: 24, months: 0 })).toThrow();
  });
});
