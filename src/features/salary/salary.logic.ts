import type { SalaryInput, SalaryResult } from './salary.types';

export function calculateSalary(input: SalaryInput): SalaryResult {
  const { grossMonthlySalary, insurancePercent, taxPercent, otherDeductions } = input;

  if (!Number.isFinite(grossMonthlySalary) || grossMonthlySalary < 0) {
    throw new Error('حقوق ناخالص نامعتبر است.');
  }
  if (!Number.isFinite(insurancePercent) || insurancePercent < 0 || insurancePercent > 100) {
    throw new Error('درصد بیمه باید بین ۰ تا ۱۰۰ باشد.');
  }
  if (!Number.isFinite(taxPercent) || taxPercent < 0 || taxPercent > 100) {
    throw new Error('درصد مالیات باید بین ۰ تا ۱۰۰ باشد.');
  }
  if (!Number.isFinite(otherDeductions) || otherDeductions < 0) {
    throw new Error('کسورات دیگر نامعتبر است.');
  }

  const insuranceAmount = (grossMonthlySalary * insurancePercent) / 100;
  const taxAmount = (grossMonthlySalary * taxPercent) / 100;
  const netSalary = Math.max(0, grossMonthlySalary - insuranceAmount - taxAmount - otherDeductions);

  return { insuranceAmount, taxAmount, netSalary };
}
