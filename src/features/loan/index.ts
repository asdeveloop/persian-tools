// Enhanced Loan Calculator Module
export { calculateEnhancedLoan } from './loan.logic';
export { calculateLoan } from './loan.logic';

// Types
export type {
  LoanInput,
  LoanOutput,
  PaymentSchedule,
  RepaymentType,
  PaymentFrequency,
  // Legacy types for backward compatibility
  LegacyLoanInput,
  LegacyLoanResult,
  LoanType,
  CalculationType,
} from './loan.types';

// Pages
export { default as LoanPage } from './LoanPage';
export { default as EnhancedLoanPage } from './EnhancedLoanPage';
