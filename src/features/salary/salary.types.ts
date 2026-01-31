export type SalaryInput = {
  grossMonthlySalary: number;
  insurancePercent: number;
  taxPercent: number;
  otherDeductions: number;
};

export type SalaryResult = {
  insuranceAmount: number;
  taxAmount: number;
  netSalary: number;
};
