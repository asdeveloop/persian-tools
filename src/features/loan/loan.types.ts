export type LoanType = 'regular' | 'qarzolhasaneh' | 'stepped';
export type CalculationType = 'installment' | 'rate' | 'principal' | 'months';

export type LoanInput = {
  principal: number;
  annualInterestRatePercent: number;
  months: number;
  loanType: LoanType;
  calculationType: CalculationType;
  // For stepped loans
  stepMonths?: number; // Number of months for each step
  stepRateIncrease?: number; // Rate increase per step (percentage points)
};

export type LoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  // For stepped loans
  stepDetails?: {
    step: number;
    months: number;
    rate: number;
    monthlyPayment: number;
    totalPayment: number;
  }[];
  effectiveRate?: number; // Effective annual rate for qarzolhasaneh
};
