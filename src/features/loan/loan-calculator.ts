import type { LoanInput, LoanOutput, PaymentSchedule } from './loan.types';

function calculatePaymentSchedule(
  amount: number,
  durationMonths: number,
  annualRate: number,
  paymentFrequency: 'monthly' | 'quarterly' | 'yearly' = 'monthly',
  repaymentType: 'annuity' | 'simple' | 'stepped' | 'grace' = 'annuity',
  gracePeriodMonths = 0,
  steppedRate?: number,
  startDate: Date = new Date(),
): PaymentSchedule[] {
  const schedule: PaymentSchedule[] = [];
  let remaining = amount;

  // Calculate periods per year based on payment frequency
  const periodsPerYear = paymentFrequency === 'monthly'
    ? 12
    : paymentFrequency === 'quarterly'
      ? 4
      : 1;
  const periodRate = annualRate / 100 / periodsPerYear;
  const totalPeriods = paymentFrequency === 'monthly'
    ? durationMonths
    : paymentFrequency === 'quarterly'
      ? Math.floor(durationMonths / 3)
      : Math.floor(durationMonths / 12);

  // Calculate installment based on repayment type
  let installment: number;

  if (repaymentType === 'annuity') {
    if (periodRate === 0) {
      installment = amount / totalPeriods;
    } else {
      const pow = Math.pow(1 + periodRate, totalPeriods);
      installment = (amount * periodRate * pow) / (pow - 1);
    }
  } else if (repaymentType === 'simple') {
    const totalInterest = amount * (annualRate / 100) * (durationMonths / 12);
    installment = (amount + totalInterest) / totalPeriods;
  } else {
    // For stepped and grace, use annuity as base
    if (periodRate === 0) {
      installment = amount / totalPeriods;
    } else {
      const pow = Math.pow(1 + periodRate, totalPeriods);
      installment = (amount * periodRate * pow) / (pow - 1);
    }
  }

  for (let period = 1; period <= totalPeriods; period++) {
    const interest = remaining * periodRate;
    // Handle grace period
    if (repaymentType === 'grace' && period <= (gracePeriodMonths / (12 / periodsPerYear))) {
      schedule.push({
        period,
        date: calculateDueDate(startDate, period, paymentFrequency),
        principal: 0,
        interest,
        installment: interest,
        remaining,
      });
      continue;
    }

    // Handle stepped rate
    let currentInstallment = installment;
    if (repaymentType === 'stepped' && steppedRate) {
      const stepIncrease = Math.floor((period - 1) / (totalPeriods / 3)) * steppedRate;
      const currentRate = periodRate + (stepIncrease / 100 / periodsPerYear);
      if (currentRate > 0) {
        const remainingPeriods = totalPeriods - period + 1;
        const pow = Math.pow(1 + currentRate, remainingPeriods);
        currentInstallment = (remaining * currentRate * pow) / (pow - 1);
      }
    }

    const currentInterest = remaining * periodRate;
    const currentPrincipal = currentInstallment - currentInterest;

    schedule.push({
      period,
      date: calculateDueDate(startDate, period, paymentFrequency),
      principal: Math.min(currentPrincipal, remaining),
      interest: currentInterest,
      installment: currentInstallment,
      remaining: Math.max(0, remaining - currentPrincipal),
    });

    remaining -= currentPrincipal;
    if (remaining <= 0) {
      break;
    }
  }

  return schedule;
}

function calculateDueDate(
  startDate: Date,
  period: number,
  frequency: 'monthly' | 'quarterly' | 'yearly',
): string {
  const date = new Date(startDate);

  switch (frequency) {
    case 'monthly':
      date.setMonth(date.getMonth() + period);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + (period * 3));
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + period);
      break;
  }

  return date.toISOString().split('T')[0] ?? '';
}

function calculateLatePenalty(monthlyInstallment: number, lateMonths: number, penaltyRate: number): number {
  if (!lateMonths || !penaltyRate) {
    return 0;
  }
  return lateMonths * monthlyInstallment * (penaltyRate / 100);
}

function calculateFees(amount: number, feeFlat?: number, feePercent?: number): number {
  let totalFees = 0;
  if (feeFlat) {
    totalFees += feeFlat;
  }
  if (feePercent) {
    totalFees += amount * (feePercent / 100);
  }
  return totalFees;
}

export function calculateLoan(input: LoanInput): LoanOutput {
  const {
    amount,
    durationMonths,
    annualInterestRate,
    repaymentType = 'annuity',
    paymentFrequency = 'monthly',
    gracePeriodMonths = 0,
    steppedRate,
    startDate = new Date(),
    lateMonths = 0,
    latePenaltyRate = 0,
    feeFlat,
    feePercent,
  } = input;

  // Input validation
  if (amount <= 0) {
    throw new Error('مبلغ وام باید بزرگ‌تر از صفر باشد.');
  }
  if (durationMonths <= 0) {
    throw new Error('مدت وام باید بزرگ‌تر از صفر باشد.');
  }
  if (annualInterestRate < 0) {
    throw new Error('نرخ سود سالانه نامعتبر است.');
  }
  if (gracePeriodMonths < 0 || gracePeriodMonths >= durationMonths) {
    throw new Error('دوره مرجوعی باید معتبر باشد.');
  }

  // Calculate payment schedule
  const schedule = calculatePaymentSchedule(
    amount,
    durationMonths,
    annualInterestRate,
    paymentFrequency,
    repaymentType,
    gracePeriodMonths,
    steppedRate,
    startDate,
  );

  // Calculate totals
  const totalRepayment = schedule.reduce((sum, payment) => sum + payment.installment, 0);
  const totalInterest = schedule.reduce((sum, payment) => sum + payment.interest, 0);

  // Calculate additional costs
  const totalLatePenalty = calculateLatePenalty(
    schedule[0]?.installment ?? 0,
    lateMonths,
    latePenaltyRate,
  );

  const totalFees = calculateFees(amount, feeFlat, feePercent);

  const finalPayableAmount = totalRepayment + totalLatePenalty + totalFees;

  // @ts-expect-error: exactOptionalPropertyTypes issue with optional fields
  return {
    monthlyInstallment: schedule[0]?.installment ?? 0,
    totalRepayment,
    totalInterest,
    totalLatePenalty: totalLatePenalty > 0 ? totalLatePenalty : undefined,
    totalFees: totalFees > 0 ? totalFees : undefined,
    finalPayableAmount,
    schedule,
  };
}
