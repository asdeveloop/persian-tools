export type LoanInput = {
  principal: number;
  annualInterestRatePercent: number;
  months: number;
};

export type LoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};
