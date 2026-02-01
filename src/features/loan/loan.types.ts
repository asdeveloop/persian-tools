export type RepaymentType = 'annuity' | 'simple' | 'stepped' | 'grace';
export type PaymentFrequency = 'monthly' | 'quarterly' | 'yearly';

export interface LoanInput {
  amount: number;
  durationMonths: number;
  annualInterestRate: number;
  repaymentType: RepaymentType;
  paymentFrequency?: PaymentFrequency;
  gracePeriodMonths?: number;
  steppedRate?: number;
  startDate?: Date;
  lateMonths?: number;
  latePenaltyRate?: number;
  feeFlat?: number;
  feePercent?: number;
}

export interface PaymentSchedule {
  period: number;
  date: string;
  principal: number;
  interest: number;
  installment: number;
  remaining: number;
}

export interface LoanOutput {
  monthlyInstallment: number;
  totalRepayment: number;
  totalInterest: number;
  totalLatePenalty?: number;
  totalFees?: number;
  finalPayableAmount: number;
  schedule: PaymentSchedule[];
}

// Legacy types for backward compatibility
export type LoanType = 'regular' | 'qarzolhasaneh' | 'stepped';
export type CalculationType = 'installment' | 'rate' | 'principal' | 'months';

export type LegacyLoanInput = {
  principal: number;
  annualInterestRatePercent: number;
  months: number;
  loanType: LoanType;
  calculationType: CalculationType;
  stepMonths?: number;
  stepRateIncrease?: number;
};

export type LegacyLoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  stepDetails?: {
    step: number;
    months: number;
    rate: number;
    monthlyPayment: number;
    totalPayment: number;
  }[];
  effectiveRate?: number;
};

// Alias for backward compatibility
export type LoanResult = LegacyLoanResult;
