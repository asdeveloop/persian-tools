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
              className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white shadow-xl mb-6"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h1 className="text-4xl font-black text-black mb-4">
              محاسبه‌گر حقوق و دستمزد پیشرفته
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {'محاسبه حقوق و مالیات بر اساس قوانین سال '}
              {laws.year}
              {' با پشتیبانی از معافیت‌های قانونی و نرخ‌های تصاعدی.'}
              {' '}
              {'شامل بیمه تامین اجتماعی، مزایا و کسورات مختلف.'}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              حداقل دستمزد: {formatMoneyFa(laws.minimumWage)} تومان |
              معافیت مالیات: {formatMoneyFa(laws.taxExemption)} تومان ماهانه
            </div>
          </div>
        </FadeIn>

        {error && (
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        {/* Input Form */}
        <FadeIn delay={0.15}>
          <div className="max-w-6xl mx-auto">
            <AnimatedCard className="p-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {(['gross-to-net', 'net-to-gross', 'minimum-wage'] as CalculationMode[]).map((mode) => (
                  <motion.button
                    key={mode}
                    onClick={() => setForm((s) => ({ ...s, mode }))}
                    className={[
                      'p-4 rounded-2xl border-2 text-right transition-all duration-300',
                      form.mode === mode
                        ? 'border-opacity-100 shadow-lg text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                    ].join(' ')}
                    style={form.mode === mode ? { backgroundColor: toolCategories.financial.primary, borderColor: toolCategories.financial.primary } : {}}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-bold mb-1">
                      {mode === 'gross-to-net' && 'حقوق ناخالص به خالص'}
                      {mode === 'net-to-gross' && 'حقوق خالص به ناخالص'}
                      {mode === 'minimum-wage' && 'حداقل دستمزد'}
                    </div>
                    <div className={`text-xs ${form.mode === mode ? 'text-gray-200' : 'text-gray-500'}`}>
                      {mode === 'gross-to-net' && 'محاسبه حقوق خالص بر اساس حقوق پایه'}
                      {mode === 'net-to-gross' && 'محاسبه حقوق پایه از خالص'}
                      {mode === 'minimum-wage' && 'محاسبه حداقل دستمزد قانونی'}
                    </div>
                  </motion.button>
                ))}
              </div>

              {form.mode !== 'minimum-wage' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {form.mode === 'gross-to-net' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700">حقوق پایه (تومان)</label>
                      <input
                        type="text"
                        value={form.baseSalaryText}
                        onChange={(e) => setForm((s) => ({ ...s, baseSalaryText: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  )}
                  {form.mode === 'net-to-gross' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700">حقوق خالص (تومان)</label>
                      <input
                        type="text"
                        value={form.netSalaryText}
                        onChange={(e) => setForm((s) => ({ ...s, netSalaryText: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">روزهای کاری</label>
                    <input
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
                  <label className="text-sm font-semibold text-slate-700">سابقه کار (سال)</label>
                  <input
                    type="text"
                    value={form.workExperienceYearsText}
                    onChange={(e) => setForm((s) => ({ ...s, workExperienceYearsText: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">ساعات اضافه کاری</label>
                  <input
                    type="text"
                    value={form.overtimeHoursText}
                    onChange={(e) => setForm((s) => ({ ...s, overtimeHoursText: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">اضافه کاری شب</label>
                  <input
                    type="text"
                    value={form.nightOvertimeHoursText}
                    onChange={(e) => setForm((s) => ({ ...s, nightOvertimeHoursText: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">اضافه کاری تعطیل</label>
                  <input
                    type="text"
                    value={form.holidayOvertimeHoursText}
                    onChange={(e) => setForm((s) => ({ ...s, holidayOvertimeHoursText: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">روزهای ماموریت</label>
                  <input
                    type="text"
                    value={form.missionDaysText}
                    onChange={(e) => setForm((s) => ({ ...s, missionDaysText: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">تعداد فرزند</label>
                  <input
                    type="text"
                    value={form.numberOfChildrenText}
                    onChange={(e) => setForm((s) => ({ ...s, numberOfChildrenText: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isMarried}
                    onChange={(e) => setForm((s) => ({ ...s, isMarried: e.target.checked }))}
                  />
                  متاهل هستم
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.hasWorkerCoupon}
                    onChange={(e) => setForm((s) => ({ ...s, hasWorkerCoupon: e.target.checked }))}
                  />
                  بن کارگری
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.hasTransportation}
                    onChange={(e) => setForm((s) => ({ ...s, hasTransportation: e.target.checked }))}
                  />
                  کمک هزینه حمل و نقل
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isDevelopmentZone}
                    onChange={(e) => setForm((s) => ({ ...s, isDevelopmentZone: e.target.checked }))}
                  />
                  منطقه توسعه یافته
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">سایر مزایا (تومان)</label>
                  <input
                    type="text"
                    value={form.otherBenefitsText}
                    onChange={(e) => setForm((s) => ({ ...s, otherBenefitsText: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">سایر کسورات (تومان)</label>
                  <input
                    type="text"
                    value={form.otherDeductionsText}
                    onChange={(e) => setForm((s) => ({ ...s, otherDeductionsText: e.target.value }))}
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
                    <h2 className="text-2xl font-black text-black flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-financial-rgb) / 0.1)' }}>
                        <svg className="w-5 h-5" style={{ color: toolCategories.financial.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                      className="rounded-2xl p-6 border"
                      style={{
                        background: [
                          'linear-gradient(135deg,',
                          `${colors.primary[50]},`,
                          `${colors.primary[100]})`,
                        ].join(' '),
                        borderColor: colors.primary[200],
                      }}
                    >
                      <div className="text-sm font-bold mb-2" style={{ color: colors.primary[600] }}>حقوق ناخالص</div>
                      <div className="text-2xl font-black" style={{ color: colors.primary[800] }}>
                        {formatMoneyFa(result.grossSalary)} تومان
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-2xl p-6 border"
                      style={{
                        background: 'linear-gradient(135deg, rgb(var(--color-danger-rgb) / 0.2), rgb(var(--color-danger-rgb) / 0.3))',
                        borderColor: 'rgb(var(--color-danger-rgb) / 0.4)',
                      }}
                    >
                      <div className="text-sm font-bold mb-2" style={{ color: colors.status.error }}>مجموع کسورات</div>
                      <div className="text-2xl font-black" style={{ color: colors.status.error }}>
                        {formatMoneyFa(result.summary.totalDeductions)} تومان
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-2xl p-6 border"
                      style={{
                        background: 'linear-gradient(135deg, rgb(var(--color-success-rgb) / 0.2), rgb(var(--color-success-rgb) / 0.3))',
                        borderColor: 'rgb(var(--color-success-rgb) / 0.4)',
                      }}
                    >
                      <div className="text-sm font-bold mb-2" style={{ color: colors.status.success }}>حقوق خالص</div>
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
                  <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    نتیجه محاسبه حداقل دستمزد
                  </h2>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-600/10 flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        جزئیات حقوق
                      </h3>
                      <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">حقوق پایه:</span>
                          <span className="text-sm font-bold">{formatMoneyFa(minimumWageResult.baseSalary)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">کمک هزینه مسکن:</span>
                          <span className="text-sm font-bold">{formatMoneyFa(minimumWageResult.housingAllowance)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">کمک هزینه غذا:</span>
                          <span className="text-sm font-bold">{formatMoneyFa(minimumWageResult.foodAllowance)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">حق اولاد:</span>
                          <span className="text-sm font-bold">{formatMoneyFa(minimumWageResult.familyAllowance)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">پاداش سابقه:</span>
                          <span className="text-sm font-bold">{formatMoneyFa(minimumWageResult.experienceBonus)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm font-bold">مجموع حقوق ناخالص:</span>
                          <span className="text-sm font-bold text-green-600">{formatMoneyFa(minimumWageResult.totalGross)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-600/10 flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        کسورات و خالص
                      </h3>
                      <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">بیمه:</span>
                          <span className="text-sm font-bold">{formatMoneyFa(minimumWageResult.insuranceAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">مالیات:</span>
                          <span className="text-sm font-bold">{formatMoneyFa(minimumWageResult.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm font-bold text-green-600">حقوق خالص:</span>
                          <span className="text-sm font-bold text-green-600">{formatMoneyFa(minimumWageResult.netSalary)}</span>
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
