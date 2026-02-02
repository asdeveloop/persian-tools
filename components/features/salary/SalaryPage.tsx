'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMoneyFa, parseLooseNumber } from '@/shared/utils/number';
import { getSessionJson, setSessionJson } from '@/shared/storage/sessionStorage';
import {
  calculateSalary,
  calculateMinimumWage,
  calculateGrossFromNet,
  getSalaryLaws,
} from '@/features/salary/index';
import type { SalaryInput, SalaryOutput, MinimumWageOutput } from '@/features/salary/salary.types';
import { AnimatedCard, FadeIn } from '@/shared/ui/AnimatedComponents';
import Button from '@/shared/ui/Button';
import { colors, toolCategories } from '@/shared/ui/theme';

type CalculationMode = 'gross-to-net' | 'net-to-gross' | 'minimum-wage';

type SalaryFormState = {
  mode: CalculationMode;
  baseSalaryText: string;
  netSalaryText: string;
  workingDaysText: string;
  workExperienceYearsText: string;
  overtimeHoursText: string;
  nightOvertimeHoursText: string;
  holidayOvertimeHoursText: string;
  missionDaysText: string;
  isMarried: boolean;
  numberOfChildrenText: string;
  hasWorkerCoupon: boolean;
  hasTransportation: boolean;
  otherBenefitsText: string;
  otherDeductionsText: string;
  isDevelopmentZone: boolean;
};

const sessionKey = 'salary.form.v2';

export default function SalaryPage() {
  const financialActiveStyle = {
    backgroundColor: toolCategories.financial.primary,
    borderColor: toolCategories.financial.primary,
  };
  const initial = useMemo<SalaryFormState>(() => {
    return (
      getSessionJson<SalaryFormState>(sessionKey) ?? {
        mode: 'gross-to-net',
        baseSalaryText: '15000000',
        netSalaryText: '12000000',
        workingDaysText: '30',
        workExperienceYearsText: '0',
        overtimeHoursText: '0',
        nightOvertimeHoursText: '0',
        holidayOvertimeHoursText: '0',
        missionDaysText: '0',
        isMarried: false,
        numberOfChildrenText: '0',
        hasWorkerCoupon: true,
        hasTransportation: true,
        otherBenefitsText: '0',
        otherDeductionsText: '0',
        isDevelopmentZone: false,
      }
    );
  }, []);

  const [form, setForm] = useState<SalaryFormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SalaryOutput | null>(null);
  const [minimumWageResult, setMinimumWageResult] = useState<MinimumWageOutput | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setSessionJson(sessionKey, form);
  }, [form]);

  const onCalculate = useCallback(() => {
    setError(null);
    setResult(null);
    setMinimumWageResult(null);

    try {
      if (form.mode === 'minimum-wage') {
        const workExperienceYears = parseLooseNumber(form.workExperienceYearsText) ?? 0;
        const numberOfChildren = parseLooseNumber(form.numberOfChildrenText) ?? 0;
        const otherDeductions = parseLooseNumber(form.otherDeductionsText) ?? 0;

        const minWageResult = calculateMinimumWage({
          workExperienceYears,
          isMarried: form.isMarried,
          numberOfChildren,
          isDevelopmentZone: form.isDevelopmentZone,
          otherDeductions,
        });

        setMinimumWageResult(minWageResult);
      } else if (form.mode === 'net-to-gross') {
        const netSalary = parseLooseNumber(form.netSalaryText);
        if (netSalary === null) {
          return setError('لطفاً حقوق خالص را به‌صورت عدد وارد کنید.');
        }

        const input: Omit<SalaryInput, 'baseSalary'> = {
          workingDays: parseLooseNumber(form.workingDaysText) ?? 30,
          workExperienceYears: parseLooseNumber(form.workExperienceYearsText) ?? 0,
          overtimeHours: parseLooseNumber(form.overtimeHoursText) ?? 0,
          nightOvertimeHours: parseLooseNumber(form.nightOvertimeHoursText) ?? 0,
          holidayOvertimeHours: parseLooseNumber(form.holidayOvertimeHoursText) ?? 0,
          missionDays: parseLooseNumber(form.missionDaysText) ?? 0,
          isMarried: form.isMarried,
          numberOfChildren: parseLooseNumber(form.numberOfChildrenText) ?? 0,
          hasWorkerCoupon: form.hasWorkerCoupon,
          hasTransportation: form.hasTransportation,
          otherBenefits: parseLooseNumber(form.otherBenefitsText) ?? 0,
          otherDeductions: parseLooseNumber(form.otherDeductionsText) ?? 0,
          isDevelopmentZone: form.isDevelopmentZone,
        };

        const calculationResult = calculateGrossFromNet(netSalary, input);
        setResult(calculationResult);
      } else {
        const baseSalary = parseLooseNumber(form.baseSalaryText);
        if (baseSalary === null) {
          return setError('لطفاً حقوق پایه را به‌صورت عدد وارد کنید.');
        }

        const input: SalaryInput = {
          baseSalary,
          workingDays: parseLooseNumber(form.workingDaysText) ?? 30,
          workExperienceYears: parseLooseNumber(form.workExperienceYearsText) ?? 0,
          overtimeHours: parseLooseNumber(form.overtimeHoursText) ?? 0,
          nightOvertimeHours: parseLooseNumber(form.nightOvertimeHoursText) ?? 0,
          holidayOvertimeHours: parseLooseNumber(form.holidayOvertimeHoursText) ?? 0,
          missionDays: parseLooseNumber(form.missionDaysText) ?? 0,
          isMarried: form.isMarried,
          numberOfChildren: parseLooseNumber(form.numberOfChildrenText) ?? 0,
          hasWorkerCoupon: form.hasWorkerCoupon,
          hasTransportation: form.hasTransportation,
          otherBenefits: parseLooseNumber(form.otherBenefitsText) ?? 0,
          otherDeductions: parseLooseNumber(form.otherDeductionsText) ?? 0,
          isDevelopmentZone: form.isDevelopmentZone,
        };

        const calculationResult = calculateSalary(input);
        setResult(calculationResult);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    }
  }, [form]);

  const laws = getSalaryLaws();

  useEffect(() => {
    onCalculate();
  }, [onCalculate]);

  return (
    <div className="min-h-screen">
      <div className="space-y-8 p-6">
        {/* Header */}
        <FadeIn delay={0}>
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white shadow-[var(--shadow-strong)] mb-6"
              style={{ backgroundColor: toolCategories.financial.primary }}
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <h1 className="text-4xl font-black text-[var(--text-primary)] mb-4">
              محاسبه‌گر حقوق و دستمزد پیشرفته
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              {'محاسبه حقوق و مالیات بر اساس قوانین سال '}
              {laws.year}
              {' با پشتیبانی از معافیت‌های قانونی و نرخ‌های تصاعدی.'}{' '}
              {'شامل بیمه تامین اجتماعی، مزایا و کسورات مختلف.'}
            </p>
            <div className="mt-4 text-sm text-[var(--text-muted)]">
              حداقل دستمزد: {formatMoneyFa(laws.minimumWage)} تومان | معافیت مالیات:{' '}
              {formatMoneyFa(laws.taxExemption)} تومان ماهانه
            </div>
          </div>
        </FadeIn>

        {error && (
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[rgb(var(--color-danger-rgb)/0.12)] px-6 py-4 text-sm text-[var(--color-danger)]"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          </div>
        )}

        {/* Input Form */}
        <FadeIn delay={0.15}>
          <div className="max-w-6xl mx-auto">
            <AnimatedCard className="p-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {(['gross-to-net', 'net-to-gross', 'minimum-wage'] as CalculationMode[]).map(
                  (mode) => (
                    <motion.button
                      key={mode}
                      onClick={() => setForm((s) => ({ ...s, mode }))}
                      className={[
                        'p-4 rounded-[var(--radius-lg)] border-2 text-right transition-all duration-[var(--motion-medium)]',
                        form.mode === mode
                          ? 'border-opacity-100 shadow-[var(--shadow-medium)] text-white'
                          : 'border-[var(--border-light)] bg-[var(--surface-1)] text-[var(--text-primary)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-subtle)]',
                      ].join(' ')}
                      {...(form.mode === mode ? { style: financialActiveStyle } : {})}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-bold mb-1">
                        {mode === 'gross-to-net' && 'حقوق ناخالص به خالص'}
                        {mode === 'net-to-gross' && 'حقوق خالص به ناخالص'}
                        {mode === 'minimum-wage' && 'حداقل دستمزد'}
                      </div>
                      <div
                        className={`text-xs ${form.mode === mode ? 'text-[var(--text-inverted)]' : 'text-[var(--text-muted)]'}`}
                      >
                        {mode === 'gross-to-net' && 'محاسبه حقوق خالص بر اساس حقوق پایه'}
                        {mode === 'net-to-gross' && 'محاسبه حقوق پایه از خالص'}
                        {mode === 'minimum-wage' && 'محاسبه حداقل دستمزد قانونی'}
                      </div>
                    </motion.button>
                  ),
                )}
              </div>

              {form.mode !== 'minimum-wage' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {form.mode === 'gross-to-net' && (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="salary-base"
                        className="text-sm font-semibold text-[var(--text-primary)]"
                      >
                        حقوق پایه (تومان)
                      </label>
                      <input
                        id="salary-base"
                        type="text"
                        value={form.baseSalaryText}
                        onChange={(e) => setForm((s) => ({ ...s, baseSalaryText: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  )}
                  {form.mode === 'net-to-gross' && (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="salary-net"
                        className="text-sm font-semibold text-[var(--text-primary)]"
                      >
                        حقوق خالص (تومان)
                      </label>
                      <input
                        id="salary-net"
                        type="text"
                        value={form.netSalaryText}
                        onChange={(e) => setForm((s) => ({ ...s, netSalaryText: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="salary-working-days"
                      className="text-sm font-semibold text-[var(--text-primary)]"
                    >
                      روزهای کاری
                    </label>
                    <input
                      id="salary-working-days"
                      type="text"
                      value={form.workingDaysText}
                      onChange={(e) => setForm((s) => ({ ...s, workingDaysText: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="salary-experience"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    سابقه کار (سال)
                  </label>
                  <input
                    id="salary-experience"
                    type="text"
                    value={form.workExperienceYearsText}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, workExperienceYearsText: e.target.value }))
                    }
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="salary-overtime"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    ساعات اضافه کاری
                  </label>
                  <input
                    id="salary-overtime"
                    type="text"
                    value={form.overtimeHoursText}
                    onChange={(e) => setForm((s) => ({ ...s, overtimeHoursText: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="salary-night-overtime"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    اضافه کاری شب
                  </label>
                  <input
                    id="salary-night-overtime"
                    type="text"
                    value={form.nightOvertimeHoursText}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, nightOvertimeHoursText: e.target.value }))
                    }
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="salary-holiday-overtime"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    اضافه کاری تعطیل
                  </label>
                  <input
                    id="salary-holiday-overtime"
                    type="text"
                    value={form.holidayOvertimeHoursText}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, holidayOvertimeHoursText: e.target.value }))
                    }
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="salary-mission-days"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    روزهای ماموریت
                  </label>
                  <input
                    id="salary-mission-days"
                    type="text"
                    value={form.missionDaysText}
                    onChange={(e) => setForm((s) => ({ ...s, missionDaysText: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="salary-children"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    تعداد فرزند
                  </label>
                  <input
                    id="salary-children"
                    type="text"
                    value={form.numberOfChildrenText}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, numberOfChildrenText: e.target.value }))
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={form.isMarried}
                    onChange={(e) => setForm((s) => ({ ...s, isMarried: e.target.checked }))}
                  />
                  متاهل هستم
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={form.hasWorkerCoupon}
                    onChange={(e) => setForm((s) => ({ ...s, hasWorkerCoupon: e.target.checked }))}
                  />
                  بن کارگری
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={form.hasTransportation}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, hasTransportation: e.target.checked }))
                    }
                  />
                  کمک هزینه حمل و نقل
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={form.isDevelopmentZone}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, isDevelopmentZone: e.target.checked }))
                    }
                  />
                  منطقه توسعه یافته
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="salary-other-benefits"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    سایر مزایا (تومان)
                  </label>
                  <input
                    id="salary-other-benefits"
                    type="text"
                    value={form.otherBenefitsText}
                    onChange={(e) => setForm((s) => ({ ...s, otherBenefitsText: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="salary-other-deductions"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    سایر کسورات (تومان)
                  </label>
                  <input
                    id="salary-other-deductions"
                    type="text"
                    value={form.otherDeductionsText}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, otherDeductionsText: e.target.value }))
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <Button type="button" variant="secondary" onClick={() => setForm(initial)}>
                  بازنشانی فرم
                </Button>
                <Button type="button" onClick={onCalculate}>
                  محاسبه مجدد
                </Button>
              </div>
            </AnimatedCard>
          </div>
        </FadeIn>

        {/* Results Summary */}
        <AnimatePresence>
          {result && (
            <FadeIn delay={0.3}>
              <div className="max-w-6xl mx-auto">
                <AnimatedCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgb(var(--color-financial-rgb) / 0.1)' }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: toolCategories.financial.primary }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      نتیجه محاسبه حقوق
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ color: toolCategories.financial.primary }}
                    >
                      {showDetails ? 'مخفی کردن جزئیات' : 'نمایش جزئیات'}
                    </motion.button>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="rounded-[var(--radius-lg)] p-6 border"
                      style={{
                        background: [
                          'linear-gradient(135deg,',
                          `${colors.primary[50]},`,
                          `${colors.primary[100]})`,
                        ].join(' '),
                        borderColor: colors.primary[200],
                      }}
                    >
                      <div
                        className="text-sm font-bold mb-2"
                        style={{ color: colors.primary[600] }}
                      >
                        حقوق ناخالص
                      </div>
                      <div className="text-2xl font-black" style={{ color: colors.primary[800] }}>
                        {formatMoneyFa(result.grossSalary)} تومان
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-[var(--radius-lg)] p-6 border"
                      style={{
                        background:
                          'linear-gradient(135deg, rgb(var(--color-danger-rgb) / 0.2), rgb(var(--color-danger-rgb) / 0.3))',
                        borderColor: 'rgb(var(--color-danger-rgb) / 0.4)',
                      }}
                    >
                      <div
                        className="text-sm font-bold mb-2"
                        style={{ color: colors.status.error }}
                      >
                        مجموع کسورات
                      </div>
                      <div className="text-2xl font-black" style={{ color: colors.status.error }}>
                        {formatMoneyFa(result.summary.totalDeductions)} تومان
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-[var(--radius-lg)] p-6 border"
                      style={{
                        background:
                          'linear-gradient(135deg, rgb(var(--color-success-rgb) / 0.2), rgb(var(--color-success-rgb) / 0.3))',
                        borderColor: 'rgb(var(--color-success-rgb) / 0.4)',
                      }}
                    >
                      <div
                        className="text-sm font-bold mb-2"
                        style={{ color: colors.status.success }}
                      >
                        حقوق خالص
                      </div>
                      <div className="text-2xl font-black" style={{ color: colors.status.success }}>
                        {formatMoneyFa(result.netSalary)} تومان
                      </div>
                    </motion.div>
                  </div>
                </AnimatedCard>
              </div>
            </FadeIn>
          )}
        </AnimatePresence>

        {/* Minimum Wage Results */}
        <AnimatePresence>
          {minimumWageResult && (
            <FadeIn delay={0.3}>
              <div className="max-w-6xl mx-auto">
                <AnimatedCard className="p-8">
                  <h2 className="text-2xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-success-rgb)/0.12)] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[var(--color-success)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    نتیجه محاسبه حداقل دستمزد
                  </h2>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[rgb(var(--color-success-rgb)/0.12)] flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-[var(--color-success)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        جزئیات حقوق
                      </h3>
                      <div className="space-y-3 bg-[var(--bg-subtle)] rounded-[var(--radius-md)] p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--text-secondary)]">حقوق پایه:</span>
                          <span className="text-sm font-bold">
                            {formatMoneyFa(minimumWageResult.baseSalary)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--text-secondary)]">
                            کمک هزینه مسکن:
                          </span>
                          <span className="text-sm font-bold">
                            {formatMoneyFa(minimumWageResult.housingAllowance)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--text-secondary)]">
                            کمک هزینه غذا:
                          </span>
                          <span className="text-sm font-bold">
                            {formatMoneyFa(minimumWageResult.foodAllowance)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--text-secondary)]">حق اولاد:</span>
                          <span className="text-sm font-bold">
                            {formatMoneyFa(minimumWageResult.familyAllowance)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--text-secondary)]">پاداش سابقه:</span>
                          <span className="text-sm font-bold">
                            {formatMoneyFa(minimumWageResult.experienceBonus)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm font-bold">مجموع حقوق ناخالص:</span>
                          <span className="text-sm font-bold text-[var(--color-success)]">
                            {formatMoneyFa(minimumWageResult.totalGross)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[rgb(var(--color-success-rgb)/0.12)] flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-[var(--color-success)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        کسورات و خالص
                      </h3>
                      <div className="space-y-3 bg-[var(--bg-subtle)] rounded-[var(--radius-md)] p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--text-secondary)]">بیمه:</span>
                          <span className="text-sm font-bold">
                            {formatMoneyFa(minimumWageResult.insuranceAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--text-secondary)]">مالیات:</span>
                          <span className="text-sm font-bold">
                            {formatMoneyFa(minimumWageResult.taxAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm font-bold text-[var(--color-success)]">
                            حقوق خالص:
                          </span>
                          <span className="text-sm font-bold text-[var(--color-success)]">
                            {formatMoneyFa(minimumWageResult.netSalary)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </FadeIn>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
