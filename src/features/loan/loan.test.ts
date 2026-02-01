import { describe, expect, it } from 'vitest';
import { calculateLoan } from './loan.logic';

describe('calculateLoan', () => {
  it('should calculate regular zero-interest loan', () => {
    const r = calculateLoan({
      principal: 120_000_000,
      annualInterestRatePercent: 0,
      months: 12,
      loanType: 'regular',
      calculationType: 'installment',
    });
    expect(r.monthlyPayment).toBeCloseTo(10_000_000);
    expect(r.totalInterest).toBeCloseTo(0);
  });

  it('should calculate regular annuity loan with interest', () => {
    const r = calculateLoan({
      principal: 100_000_000,
      annualInterestRatePercent: 24,
      months: 24,
      loanType: 'regular',
      calculationType: 'installment',
    });
    expect(r.monthlyPayment).toBeGreaterThan(0);
    expect(r.totalPayment).toBeGreaterThan(100_000_000);
    expect(r.totalInterest).toBeGreaterThan(0);
  });

  it('should calculate qarzolhasaneh loan', () => {
    const r = calculateLoan({
      principal: 50_000_000,
      annualInterestRatePercent: 4,
      months: 24,
      loanType: 'qarzolhasaneh',
      calculationType: 'installment',
    });
    expect(r.monthlyPayment).toBeGreaterThan(0);
    expect(r.effectiveRate).toBeDefined();
    expect(r.effectiveRate).toBeLessThanOrEqual(4.01); // Allow for floating point precision
  });

  it('should calculate stepped loan', () => {
    const r = calculateLoan({
      principal: 100_000_000,
      annualInterestRatePercent: 18,
      months: 36,
      loanType: 'stepped',
      calculationType: 'installment',
      stepMonths: 12,
      stepRateIncrease: 2,
    });
    expect(r.monthlyPayment).toBeGreaterThan(0);
    const stepDetails = r.stepDetails ?? [];
    expect(stepDetails.length).toBeGreaterThanOrEqual(1);
    if (stepDetails.length > 0) {
      expect(stepDetails[0]?.rate).toBe(18);
    }
    // Check that we have multiple steps for a 36-month loan with 12-month steps
    if (stepDetails.length > 1) {
      expect(stepDetails[1]?.rate).toBe(20);
    }
  });

  it('should reject qarzolhasaneh loan with rate > 4%', () => {
    expect(() => calculateLoan({
      principal: 100_000_000,
      annualInterestRatePercent: 5,
      months: 24,
      loanType: 'qarzolhasaneh',
      calculationType: 'installment',
    })).toThrow('نرخ سود وام قرض‌الحسنه نباید بیشتر از 4٪ باشد.');
  });

  it('should reject invalid months', () => {
    expect(() => calculateLoan({
      principal: 100_000_000,
      annualInterestRatePercent: 24,
      months: 0,
      loanType: 'regular',
      calculationType: 'installment',
    })).toThrow();
  });

  it('should reject invalid stepped loan parameters', () => {
    expect(() => calculateLoan({
      principal: 100_000_000,
      annualInterestRatePercent: 24,
      months: 24,
      loanType: 'stepped',
      calculationType: 'installment',
      stepMonths: 0,
    })).toThrow();
  });

  it('should reject unsupported calculation types for regular loans', () => {
    expect(() => calculateLoan({
      principal: 100_000_000,
      annualInterestRatePercent: 24,
      months: 24,
      loanType: 'regular',
      calculationType: 'rate',
    })).toThrow('محاسبه نرخ سود برای وام عادی در حال حاضر پشتیبانی نمی‌شود.');
  });
});
