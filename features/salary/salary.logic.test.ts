import { describe, it, expect } from 'vitest';
import { calculateSalary, calculateGrossFromNet, calculateMinimumWage } from './index';

describe('salary logic', () => {
  it('calculates gross and net salary with deductions', () => {
    const result = calculateSalary({
      baseSalary: 15_000_000,
      workingDays: 30,
      workExperienceYears: 2,
      overtimeHours: 10,
      nightOvertimeHours: 0,
      holidayOvertimeHours: 0,
      missionDays: 0,
      isMarried: true,
      numberOfChildren: 1,
      hasWorkerCoupon: true,
      hasTransportation: true,
      otherBenefits: 0,
      otherDeductions: 0,
      isDevelopmentZone: false,
    });

    expect(result.grossSalary).toBeGreaterThan(0);
    expect(result.netSalary).toBeLessThanOrEqual(result.grossSalary);
    expect(result.summary.totalDeductions).toBeCloseTo(result.summary.insurance + result.summary.tax, 2);
  });

  it('solves gross from target net salary', () => {
    const targetNet = 12_000_000;
    const result = calculateGrossFromNet(targetNet, {
      workingDays: 30,
      workExperienceYears: 0,
      overtimeHours: 0,
      nightOvertimeHours: 0,
      holidayOvertimeHours: 0,
      missionDays: 0,
      isMarried: false,
      numberOfChildren: 0,
      hasWorkerCoupon: false,
      hasTransportation: false,
      otherBenefits: 0,
      otherDeductions: 0,
      isDevelopmentZone: false,
    });

    expect(Math.abs(result.netSalary - targetNet)).toBeLessThan(50_000);
  });

  it('calculates minimum wage output', () => {
    const result = calculateMinimumWage({
      workExperienceYears: 1,
      isMarried: false,
      numberOfChildren: 0,
      isDevelopmentZone: false,
      otherDeductions: 0,
    });

    expect(result.totalGross).toBeGreaterThan(0);
    expect(result.netSalary).toBeLessThanOrEqual(result.totalGross);
  });
});
