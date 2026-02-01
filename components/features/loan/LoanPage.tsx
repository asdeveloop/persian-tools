'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMoneyFa, parseLooseNumber } from '@/shared/utils/number';
import { getSessionJson, setSessionJson } from '@/shared/storage/sessionStorage';
import { calculateLoan } from '@/features/loan/loan.logic';
import type { LoanResult, LoanType, CalculationType } from '@/features/loan/loan.types';
import { AnimatedCard, StaggerContainer, StaggerItem, FadeIn } from '@/shared/ui/AnimatedComponents';
import { toolCategories } from '@/shared/ui/theme';

type LoanFormState = {
  calculationType: CalculationType;
  loanType: LoanType;
  principalText: string;
  annualRateText: string;
  monthsText: string;
  monthlyPaymentText: string;
  stepMonthsText: string;
  stepRateIncreaseText: string;
};

const sessionKey = 'loan.form.v3';

export default function LoanPage() {
  const initial = useMemo<LoanFormState>(() => {
    return (
      getSessionJson<LoanFormState>(sessionKey) ?? {
        calculationType: 'installment',
        loanType: 'regular',
        principalText: '',
        annualRateText: '',
        monthsText: '',
        monthlyPaymentText: '',
        stepMonthsText: '',
        stepRateIncreaseText: '',
      }
    );
  }, []);

  const [form, setForm] = useState<LoanFormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LoanResult | null>(null);

  useEffect(() => {
    setSessionJson(sessionKey, form);
  }, [form]);

  function onCalculate() {
    setError(null);
    setResult(null);

    const principal = parseLooseNumber(form.principalText);
    const annualRate = parseLooseNumber(form.annualRateText);
    const months = parseLooseNumber(form.monthsText);
    const monthlyPayment = parseLooseNumber(form.monthlyPaymentText);
    const stepMonths = parseLooseNumber(form.stepMonthsText);
    const stepRateIncrease = parseLooseNumber(form.stepRateIncreaseText);

    try {
      const r = calculateLoan({
        principal: principal ?? 0,
        annualInterestRatePercent: annualRate ?? 0,
        months: Math.trunc(months ?? 0),
        loanType: form.loanType,
        calculationType: form.calculationType,
        ...(monthlyPayment !== null ? { monthlyPayment } : {}),
        stepMonths: form.loanType === 'stepped' ? Math.trunc(stepMonths ?? 0) : 0,
        stepRateIncrease: form.loanType === 'stepped' ? (stepRateIncrease ?? 0) : 0,
      });
      setResult(r);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    }
  }

  const getCalculationTypeLabel = (type: CalculationType) => {
    switch (type) {
      case 'installment': return 'محاسبه قسط ماهانه';
      case 'rate': return 'محاسبه نرخ سود';
      case 'principal': return 'محاسبه مبلغ وام';
      case 'months': return 'محاسبه مدت بازپرداخت';
      default: return type;
    }
  };

  const getLoanTypeLabel = (type: LoanType) => {
    switch (type) {
      case 'regular': return 'عادی';
      case 'qarzolhasaneh': return 'قرض‌الحسنه';
      case 'stepped': return 'اقساط پلکانی';
      default: return type;
    }
  };

  const getLoanTypeDescription = (type: LoanType) => {
    switch (type) {
      case 'regular': return 'وام با اقساط مساوی و نرخ سود ثابت';
      case 'qarzolhasaneh': return 'وام با نرخ سود بسیار پایین (حداکثر 4%)';
      case 'stepped': return 'وام با اقساط متغیر و نرخ سود افزایشی';
      default: return '';
    }
  };

  const getPlaceholder = (field: string) => {
    switch (field) {
      case 'principal': return 'مثال: ۲۰,۰۰۰,۰۰۰';
      case 'annualRate': return 'مثال: ۲۳';
      case 'months': return 'مثال: ۳۶';
      case 'monthlyPayment': return 'مثال: ۵,۰۰۰,۰۰۰';
      case 'stepMonths': return 'مثال: ۱۲';
      case 'stepRateIncrease': return 'مثال: ۲';
      default: return '';
    }
  };

  const getInputFields = () => {
    const fields = [];

    switch (form.calculationType) {
      case 'installment':
        fields.push(
          {
            id: 'principal',
            label: 'مبلغ وام (تومان)',
            value: form.principalText,
            onChange: (value: string) => setForm(s => ({ ...s, principalText: value })),
            placeholder: getPlaceholder('principal'),
            required: true,
          },
          {
            id: 'annualRate',
            label: 'نرخ سود سالانه (درصد)',
            value: form.annualRateText,
            onChange: (value: string) => setForm(s => ({ ...s, annualRateText: value })),
            placeholder: getPlaceholder('annualRate'),
            required: true,
            max: form.loanType === 'qarzolhasaneh' ? '4' : undefined,
            note: form.loanType === 'qarzolhasaneh' ? 'حداکثر 4%' : undefined,
          },
          {
            id: 'months',
            label: 'مدت بازپرداخت (ماه)',
            value: form.monthsText,
            onChange: (value: string) => setForm(s => ({ ...s, monthsText: value })),
            placeholder: getPlaceholder('months'),
            required: true,
          },
        );
        break;

      case 'rate':
        fields.push(
          {
            id: 'principal',
            label: 'مبلغ وام (تومان)',
            value: form.principalText,
            onChange: (value: string) => setForm(s => ({ ...s, principalText: value })),
            placeholder: getPlaceholder('principal'),
            required: true,
          },
          {
            id: 'monthlyPayment',
            label: 'قسط ماهانه (تومان)',
            value: form.monthlyPaymentText,
            onChange: (value: string) => setForm(s => ({ ...s, monthlyPaymentText: value })),
            placeholder: getPlaceholder('monthlyPayment'),
            required: true,
          },
          {
            id: 'months',
            label: 'مدت بازپرداخت (ماه)',
            value: form.monthsText,
            onChange: (value: string) => setForm(s => ({ ...s, monthsText: value })),
            placeholder: getPlaceholder('months'),
            required: true,
          },
        );
        break;

      case 'principal':
        fields.push(
          {
            id: 'monthlyPayment',
            label: 'قسط ماهانه (تومان)',
            value: form.monthlyPaymentText,
            onChange: (value: string) => setForm(s => ({ ...s, monthlyPaymentText: value })),
            placeholder: getPlaceholder('monthlyPayment'),
            required: true,
          },
          {
            id: 'annualRate',
            label: 'نرخ سود سالانه (درصد)',
            value: form.annualRateText,
            onChange: (value: string) => setForm(s => ({ ...s, annualRateText: value })),
            placeholder: getPlaceholder('annualRate'),
            required: true,
            max: form.loanType === 'qarzolhasaneh' ? '4' : undefined,
            note: form.loanType === 'qarzolhasaneh' ? 'حداکثر 4%' : undefined,
          },
          {
            id: 'months',
            label: 'مدت بازپرداخت (ماه)',
            value: form.monthsText,
            onChange: (value: string) => setForm(s => ({ ...s, monthsText: value })),
            placeholder: getPlaceholder('months'),
            required: true,
          },
        );
        break;

      case 'months':
        fields.push(
          {
            id: 'principal',
            label: 'مبلغ وام (تومان)',
            value: form.principalText,
            onChange: (value: string) => setForm(s => ({ ...s, principalText: value })),
            placeholder: getPlaceholder('principal'),
            required: true,
          },
          {
            id: 'annualRate',
            label: 'نرخ سود سالانه (درصد)',
            value: form.annualRateText,
            onChange: (value: string) => setForm(s => ({ ...s, annualRateText: value })),
            placeholder: getPlaceholder('annualRate'),
            required: true,
            max: form.loanType === 'qarzolhasaneh' ? '4' : undefined,
            note: form.loanType === 'qarzolhasaneh' ? 'حداکثر 4%' : undefined,
          },
          {
            id: 'monthlyPayment',
            label: 'قسط ماهانه (تومان)',
            value: form.monthlyPaymentText,
            onChange: (value: string) => setForm(s => ({ ...s, monthlyPaymentText: value })),
            placeholder: getPlaceholder('monthlyPayment'),
            required: true,
          },
        );
        break;
    }

    // Add stepped loan specific fields
    if (form.loanType === 'stepped' && form.calculationType === 'installment') {
      fields.push(
        {
          id: 'stepMonths',
          label: 'تعداد ماه هر مرحله',
          value: form.stepMonthsText,
          onChange: (value: string) => setForm(s => ({ ...s, stepMonthsText: value })),
          placeholder: getPlaceholder('stepMonths'),
          required: true,
          note: 'تعداد ماه‌های هر مرحله از اقساط پلکانی',
        },
        {
          id: 'stepRateIncrease',
          label: 'افزایش نرخ هر مرحله (درصد)',
          value: form.stepRateIncreaseText,
          onChange: (value: string) => setForm(s => ({ ...s, stepRateIncreaseText: value })),
          placeholder: getPlaceholder('stepRateIncrease'),
          required: true,
          note: 'افزایش نرخ سود در هر مرحله',
        },
      );
    }

    return fields;
  };

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
              محاسبه‌گر اقساط و سود وام بانکی
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {'این محاسبه‌گر بر اساس فرمول‌های جدید بانک مرکزی عمل می‌کند '}
              {'و برای انواع وام‌های بانکی مناسب است.'}
              {' '}
              {'دامنه محاسبات شامل وام‌های عادی، قرض‌الحسنه '}
              {'و وام با اقساط پلکانی می‌باشد.'}
            </p>
          </div>
        </FadeIn>

        {/* Calculation Type Selection */}
        <FadeIn delay={0.1}>
          <div className="max-w-6xl mx-auto">
            <AnimatedCard className="p-8">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-financial-rgb) / 0.1)' }}>
                  <svg className="w-5 h-5" style={{ color: toolCategories.financial.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M9 11h.01M12 11h.01M15 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                نوع محاسبه را انتخاب کنید
              </h2>
              <StaggerContainer staggerDelay={0.05}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(['installment', 'rate', 'principal', 'months'] as CalculationType[]).map((type) => (
                    <StaggerItem key={type}>
                      <motion.button
                        onClick={() => setForm((s) => ({ ...s, calculationType: type }))}
                        className={[
                          'p-6 rounded-2xl border-2 transition-all duration-300 text-right',
                          form.calculationType === type
                            ? 'border-opacity-100 shadow-lg text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                        ].join(' ')}
                        style={form.calculationType === type ? {
                          backgroundColor: toolCategories.financial.primary,
                          borderColor: toolCategories.financial.primary,
                        } : {}}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-lg font-bold mb-2">{getCalculationTypeLabel(type)}</div>
                        <div
                          className={`text-sm ${
                            form.calculationType === type ? 'text-gray-200' : 'text-gray-500'
                          }`}
                        >
                          {type === 'installment' && 'محاسبه بر اساس مبلغ وام'}
                          {type === 'rate' && 'محاسبه بر اساس قسط ماهانه'}
                          {type === 'principal' && 'محاسبه بر اساس قسط و نرخ'}
                          {type === 'months' && 'محاسبه بر اساس اقساط'}
                        </div>
                      </motion.button>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </AnimatedCard>
          </div>
        </FadeIn>

        {/* Loan Type Selection */}
        <FadeIn delay={0.2}>
          <div className="max-w-6xl mx-auto">
            <AnimatedCard className="p-8">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                نوع وام را انتخاب کنید
              </h2>
              <StaggerContainer staggerDelay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['regular', 'qarzolhasaneh', 'stepped'] as LoanType[]).map((type) => (
                    <StaggerItem key={type}>
                      <motion.button
                        onClick={() => setForm((s) => ({ ...s, loanType: type }))}
                        className={[
                          'p-6 rounded-2xl border-2 transition-all duration-300 text-right',
                          form.loanType === type
                            ? 'border-black bg-black text-white shadow-lg'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                        ].join(' ')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-bold text-lg mb-3">{getLoanTypeLabel(type)}</div>
                        <div
                          className={`text-sm leading-relaxed ${
                            form.loanType === type ? 'text-gray-200' : 'text-gray-500'
                          }`}
                        >
                          {getLoanTypeDescription(type)}
                        </div>
                      </motion.button>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </AnimatedCard>
          </div>
        </FadeIn>

        {/* Input Form */}
        <FadeIn delay={0.3}>
          <div className="max-w-6xl mx-auto">
            <AnimatedCard className="p-8">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                مقادیر مورد نظر را وارد کنید
              </h2>
              <StaggerContainer staggerDelay={0.05}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getInputFields().map((field) => (
                    <StaggerItem key={field.id}>
                      <div className="space-y-3">
                        <label
                          htmlFor={field.id}
                          className="block text-sm font-bold text-gray-700"
                        >
                          {field.label}
                          {field.required && <span className="text-red-500 mr-1">*</span>}
                        </label>
                        <motion.input
                          id={field.id}
                          type="text"
                          inputMode="numeric"
                          className="input-field"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={field.placeholder}
                          max={field.max}
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        />
                        {field.note && (
                          <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">{field.note}</p>
                        )}
                      </div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>

              <div className="mt-8 flex items-center justify-between">
                <motion.button
                  type="button"
                  onClick={onCalculate}
                  className="btn-primary text-lg px-10 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M9 11h.01M12 11h.01M15 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    محاسبه کن
                  </span>
                </motion.button>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="text-sm text-red-600 bg-red-50 px-6 py-3 rounded-xl border border-red-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedCard>
          </div>
        </FadeIn>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-6xl mx-auto">
                <AnimatedCard className="p-8">
                  <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    نتیجه محاسبه - وام {getLoanTypeLabel(form.loanType)}
                  </h2>

                  <StaggerContainer staggerDelay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <StaggerItem>
                        <motion.div
                          className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 shadow-lg"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-blue-600 text-sm font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            قسط ماهانه
                          </div>
                          <div className="text-3xl font-black text-blue-900">
                            {formatMoneyFa(result.monthlyPayment)} تومان
                          </div>
                        </motion.div>
                      </StaggerItem>

                      <StaggerItem>
                        <motion.div
                          className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 shadow-lg"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-green-600 text-sm font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            مبلغ کل
                          </div>
                          <div className="text-3xl font-black text-green-900">
                            {formatMoneyFa(result.totalPayment)} تومان
                          </div>
                        </motion.div>
                      </StaggerItem>

                      <StaggerItem>
                        <motion.div
                          className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl border border-amber-200 shadow-lg"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-amber-600 text-sm font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            سود کل
                          </div>
                          <div className="text-3xl font-black text-amber-900">
                            {formatMoneyFa(result.totalInterest)} تومان
                          </div>
                        </motion.div>
                      </StaggerItem>
                    </div>
                  </StaggerContainer>

                  <AnimatePresence>
                    {result.effectiveRate !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 mb-8 shadow-lg"
                      >
                        <div className="text-purple-600 text-sm font-bold mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          نرخ موثر سالانه
                        </div>
                        <div className="text-2xl font-black text-purple-900">
                          {result.effectiveRate.toFixed(2)}%
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {result.stepDetails && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-gray-50 p-8 rounded-2xl border border-gray-200"
                      >
                        <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          جزئیات اقساط پلکانی
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-right pb-4 text-sm font-bold text-gray-700">مرحله</th>
                                <th className="text-right pb-4 text-sm font-bold text-gray-700">تعداد ماه</th>
                                <th className="text-right pb-4 text-sm font-bold text-gray-700">نرخ سود</th>
                                <th className="text-right pb-4 text-sm font-bold text-gray-700">قسط ماهانه</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.stepDetails.map((step, index) => (
                                <motion.tr
                                  key={step.step}
                                  className="border-b border-gray-100 hover:bg-gray-100 transition-colors"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                >
                                  <td className="py-4 text-sm font-semibold">{step.step}</td>
                                  <td className="py-4 text-sm">{step.months}</td>
                                  <td className="py-4 text-sm font-bold">{step.rate.toFixed(1)}%</td>
                                  <td className="py-4 text-sm font-bold">{formatMoneyFa(step.monthlyPayment)}</td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AnimatedCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
