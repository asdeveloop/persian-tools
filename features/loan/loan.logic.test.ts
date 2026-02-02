import { describe, it, expect } from 'vitest';
import { calculateLoan } from './loan.logic';

describe('loan logic', () => {
  it('calculates installment for regular loan', () => {
    const result = calculateLoan({
      calculationType: 'installment',
      loanType: 'regular',
      principal: 1_000_000,
      annualInterestRatePercent: 12,
      months: 12,
    });

    expect(result.monthlyPayment).toBeCloseTo(88848.79, 2);
    expect(result.totalPayment).toBeCloseTo(result.monthlyPayment * 12, 5);
  });

  it('solves rate from payment', () => {
    const result = calculateLoan({
      calculationType: 'rate',
      loanType: 'regular',
      principal: 1_000_000,
      annualInterestRatePercent: 0,
      months: 12,
      monthlyPayment: 88848.79,
    });

    expect(result.annualInterestRatePercent).toBeCloseTo(12, 1);
  });

  it('handles stepped loans with step details', () => {
    const result = calculateLoan({
      calculationType: 'installment',
      loanType: 'stepped',
      principal: 5_000_000,
      annualInterestRatePercent: 18,
      months: 24,
      stepMonths: 6,
      stepRateIncrease: 2,
    });

    expect(result.stepDetails?.length).toBeGreaterThan(0);
  });

  it('throws on invalid inputs', () => {
    expect(() =>
      calculateLoan({
        calculationType: 'installment',
        loanType: 'regular',
        principal: -1,
        annualInterestRatePercent: 10,
        months: 12,
      }),
    ).toThrow('مبلغ وام نامعتبر است.');

    expect(() =>
      calculateLoan({
        calculationType: 'installment',
        loanType: 'regular',
        principal: 1_000_000,
        annualInterestRatePercent: 10,
        months: 0,
      }),
    ).toThrow('مدت بازپرداخت باید بیشتر از صفر باشد.');
  });
});
