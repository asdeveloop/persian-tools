import { describe, it, expect } from 'vitest';
import { calculateEnhancedLoan } from './loan.logic';
import type { LoanInput } from './loan.types';

describe('Enhanced Loan Calculator', () => {
  const basicInput: LoanInput = {
    amount: 200000000,
    durationMonths: 24,
    annualInterestRate: 18,
    repaymentType: 'annuity',
    paymentFrequency: 'monthly',
  };

  describe('Basic Calculations', () => {
    it('should calculate annuity loan correctly', () => {
      const result = calculateEnhancedLoan(basicInput);

      expect(result.monthlyInstallment).toBeGreaterThan(0);
      expect(result.totalRepayment).toBeGreaterThan(basicInput.amount);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.finalPayableAmount).toBe(result.totalRepayment);
      expect(result.schedule).toHaveLength(24);
    });

    it('should calculate simple interest loan correctly', () => {
      const input = { ...basicInput, repaymentType: 'simple' as const };
      const result = calculateEnhancedLoan(input);

      expect(result.monthlyInstallment).toBeGreaterThan(0);
      expect(result.totalRepayment).toBeGreaterThan(basicInput.amount);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('should handle zero interest rate', () => {
      const input = { ...basicInput, annualInterestRate: 0 };
      const result = calculateEnhancedLoan(input);

      expect(result.monthlyInstallment).toBeCloseTo(basicInput.amount / 24, 5);
      expect(result.totalInterest).toBe(0);
      expect(result.totalRepayment).toBeCloseTo(basicInput.amount, 5);
    });
  });

  describe('Payment Frequency', () => {
    it('should calculate quarterly payments correctly', () => {
      const input = { ...basicInput, paymentFrequency: 'quarterly' as const };
      const result = calculateEnhancedLoan(input);

      expect(result.schedule.length).toBeLessThanOrEqual(8); // 24 months / 3 = 8 quarters
      expect(result.monthlyInstallment).toBeGreaterThan(0);
    });

    it('should calculate yearly payments correctly', () => {
      const input = { ...basicInput, paymentFrequency: 'yearly' as const };
      const result = calculateEnhancedLoan(input);

      expect(result.schedule.length).toBeLessThanOrEqual(2); // 24 months / 12 = 2 years
      expect(result.monthlyInstallment).toBeGreaterThan(0);
    });
  });

  describe('Grace Period', () => {
    it('should calculate grace period correctly', () => {
      const input = {
        ...basicInput,
        repaymentType: 'grace' as const,
        gracePeriodMonths: 6,
      };
      const result = calculateEnhancedLoan(input);

      expect(result.schedule.length).toBeGreaterThan(0);
      // First 6 months should have principal = 0
      const gracePayments = result.schedule.slice(0, 6);
      gracePayments.forEach(payment => {
        expect(payment.principal).toBe(0);
      });
    });
  });

  describe('Stepped Rate', () => {
    it('should calculate stepped rate correctly', () => {
      const input = {
        ...basicInput,
        repaymentType: 'stepped' as const,
        steppedRate: 2,
      };
      const result = calculateEnhancedLoan(input);

      expect(result.monthlyInstallment).toBeGreaterThan(0);
      expect(result.schedule.length).toBeGreaterThan(0);
    });
  });

  describe('Late Payment Penalty', () => {
    it('should calculate late penalty correctly', () => {
      const input = {
        ...basicInput,
        lateMonths: 2,
        latePenaltyRate: 2,
      };
      const result = calculateEnhancedLoan(input);

      expect(result.totalLatePenalty).toBeGreaterThan(0);
      expect(result.finalPayableAmount).toBe(
        result.totalRepayment + (result.totalLatePenalty ?? 0),
      );
    });

    it('should not add penalty when no late months', () => {
      const input = { ...basicInput, lateMonths: 0, latePenaltyRate: 2 };
      const result = calculateEnhancedLoan(input);

      expect(result.totalLatePenalty).toBeUndefined();
    });
  });

  describe('Fees', () => {
    it('should calculate flat fee correctly', () => {
      const input = { ...basicInput, feeFlat: 500000 };
      const result = calculateEnhancedLoan(input);

      expect(result.totalFees).toBe(500000);
      expect(result.finalPayableAmount).toBe(result.totalRepayment + 500000);
    });

    it('should calculate percentage fee correctly', () => {
      const input = { ...basicInput, feePercent: 1.5 };
      const result = calculateEnhancedLoan(input);

      expect(result.totalFees).toBe(basicInput.amount * 0.015);
      expect(result.finalPayableAmount).toBe(result.totalRepayment + (result.totalFees ?? 0));
    });

    it('should calculate both flat and percentage fees', () => {
      const input = { ...basicInput, feeFlat: 500000, feePercent: 1.5 };
      const result = calculateEnhancedLoan(input);

      expect(result.totalFees).toBe(500000 + (basicInput.amount * 0.015));
      expect(result.finalPayableAmount).toBe(result.totalRepayment + (result.totalFees ?? 0));
    });
  });

  describe('Payment Schedule', () => {
    it('should generate correct payment schedule', () => {
      const result = calculateEnhancedLoan(basicInput);

      expect(result.schedule).toHaveLength(24);

      // Check first payment
      const firstPayment = result.schedule[0];
      expect(firstPayment?.period).toBe(1);
      expect(firstPayment?.principal).toBeGreaterThan(0);
      expect(firstPayment?.interest).toBeGreaterThan(0);
      expect(firstPayment?.installment).toBe(result.monthlyInstallment);
      expect(firstPayment?.remaining).toBeLessThan(basicInput.amount);

      // Check last payment
      const lastPayment = result.schedule[result.schedule.length - 1];
      expect(lastPayment?.remaining).toBe(0);
    });

    it('should handle custom start date', () => {
      const customDate = new Date('2024-01-01');
      const input = { ...basicInput, startDate: customDate };
      const result = calculateEnhancedLoan(input);

      expect(result.schedule[0]?.date).toBe('2024-02-01');
    });
  });

  describe('Input Validation', () => {
    it('should throw error for negative amount', () => {
      const input = { ...basicInput, amount: -100000 };

      expect(() => calculateEnhancedLoan(input)).toThrow('مبلغ وام باید بزرگ‌تر از صفر باشد.');
    });

    it('should throw error for zero duration', () => {
      const input = { ...basicInput, durationMonths: 0 };

      expect(() => calculateEnhancedLoan(input)).toThrow('مدت وام باید بزرگ‌تر از صفر باشد.');
    });

    it('should throw error for negative interest rate', () => {
      const input = { ...basicInput, annualInterestRate: -5 };

      expect(() => calculateEnhancedLoan(input)).toThrow('نرخ سود سالانه نامعتبر است.');
    });

    it('should throw error for invalid grace period', () => {
      const input = {
        ...basicInput,
        repaymentType: 'grace' as const,
        gracePeriodMonths: 30, // More than duration
      };

      expect(() => calculateEnhancedLoan(input)).toThrow('دوره مرجوعی باید معتبر باشد.');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle loan with all features enabled', () => {
      const complexInput: LoanInput = {
        amount: 500000000,
        durationMonths: 36,
        annualInterestRate: 20,
        repaymentType: 'stepped',
        paymentFrequency: 'quarterly',
        gracePeriodMonths: 3,
        steppedRate: 1.5,
        startDate: new Date('2024-01-01'),
        lateMonths: 1,
        latePenaltyRate: 2.5,
        feeFlat: 1000000,
        feePercent: 2,
      };

      const result = calculateEnhancedLoan(complexInput);

      expect(result.monthlyInstallment).toBeGreaterThan(0);
      expect(result.totalRepayment).toBeGreaterThan(complexInput.amount);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalLatePenalty).toBeGreaterThan(0);
      expect(result.totalFees).toBeGreaterThan(0);
      expect(result.finalPayableAmount).toBe(
        result.totalRepayment + (result.totalLatePenalty ?? 0) + (result.totalFees ?? 0),
      );
      expect(result.schedule.length).toBeGreaterThan(0);
    });
  });
});
