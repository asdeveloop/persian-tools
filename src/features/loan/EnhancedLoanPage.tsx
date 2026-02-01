import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMoneyFa, parseLooseNumber } from '../../shared/utils/number';
import { getSessionJson, setSessionJson } from '../../shared/storage/sessionStorage';
import { calculateEnhancedLoan } from './loan.logic';
import type { LoanOutput, RepaymentType, PaymentFrequency } from './loan.types';
import { AnimatedCard, StaggerContainer, StaggerItem, FadeIn } from '../../shared/ui/AnimatedComponents';
import { toolCategories } from '../../shared/ui/theme';

type EnhancedLoanFormState = {
  amountText: string;
  durationMonthsText: string;
  annualInterestRateText: string;
  repaymentType: RepaymentType;
  paymentFrequency: PaymentFrequency;
  gracePeriodMonthsText: string;
  steppedRateText: string;
  startDateText?: string;
  lateMonthsText: string;
  latePenaltyRateText: string;
  feeFlatText: string;
  feePercentText: string;
};

const sessionKey = 'loan.enhanced.form.v1';

export default function EnhancedLoanPage() {
  const initial = useMemo<EnhancedLoanFormState>(() => {
    // @ts-expect-error: exactOptionalPropertyTypes issue with startDateText
    return (
      getSessionJson<EnhancedLoanFormState>(sessionKey) ?? {
        amountText: '',
        durationMonthsText: '',
        annualInterestRateText: '',
        repaymentType: 'annuity',
        paymentFrequency: 'monthly',
        gracePeriodMonthsText: '',
        steppedRateText: '',
        startDateText: undefined,
        lateMonthsText: '',
        latePenaltyRateText: '',
        feeFlatText: '',
        feePercentText: ''
      }
    );
  }, []);

  const [form, setForm] = useState<EnhancedLoanFormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LoanOutput | null>(null);

  useEffect(() => {
    setSessionJson(sessionKey, form);
  }, [form]);

  function onCalculate() {
    setError(null);
    setResult(null);

    const amount = parseLooseNumber(form.amountText);
    const durationMonths = parseLooseNumber(form.durationMonthsText);
    const annualInterestRate = parseLooseNumber(form.annualInterestRateText);
    const gracePeriodMonths = parseLooseNumber(form.gracePeriodMonthsText);
    const steppedRate = parseLooseNumber(form.steppedRateText);
    const startDate = form.startDateText ? new Date(form.startDateText) : new Date();
    const lateMonths = parseLooseNumber(form.lateMonthsText);
    const latePenaltyRate = parseLooseNumber(form.latePenaltyRateText);
    const feeFlat = parseLooseNumber(form.feeFlatText);
    const feePercent = parseLooseNumber(form.feePercentText);

    try {
      const r = calculateEnhancedLoan({
        amount: amount || 0,
        durationMonths: Math.trunc(durationMonths || 0),
        annualInterestRate: annualInterestRate || 0,
        repaymentType: form.repaymentType,
        paymentFrequency: form.paymentFrequency,
        gracePeriodMonths: gracePeriodMonths ? Math.trunc(gracePeriodMonths) : 0,
        steppedRate: steppedRate ?? undefined, // @ts-expect-error: exactOptionalPropertyTypes issue
        startDate,
        lateMonths: lateMonths ? Math.trunc(lateMonths) : 0,
        latePenaltyRate: latePenaltyRate || 0,
        feeFlat: feeFlat || undefined,
        feePercent: feePercent || undefined
      });
      setResult(r);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    }
  }

  const getRepaymentTypeLabel = (type: RepaymentType) => {
    switch (type) {
      case 'annuity': return 'اقساط مساوی (آنوئیته)';
      case 'simple': return 'اقساط ساده';
      case 'stepped': return 'اقساط پلکانی';
      case 'grace': return 'دوره مرجوعی';
      default: return type;
    }
  };

  const getPaymentFrequencyLabel = (frequency: PaymentFrequency) => {
    switch (frequency) {
      case 'monthly': return 'ماهانه';
      case 'quarterly': return 'فصلی';
      case 'yearly': return 'سالانه';
      default: return frequency;
    }
  };

  const getRepaymentTypeDescription = (type: RepaymentType) => {
    switch (type) {
      case 'annuity': return 'اقساط مساوی در طول دوره وام';
      case 'simple': return 'محاسبه سود ساده و تقسیم بر اقساط';
      case 'stepped': return 'اقساط با نرخ افزایشی در طول زمان';
      case 'grace': return 'دوره اول فقط پرداخت سود';
      default: return '';
    }
  };

  const getPlaceholder = (field: string) => {
    switch (field) {
      case 'amount': return 'مثال: ۲۰۰,۰۰۰,۰۰۰';
      case 'durationMonths': return 'مثال: ۲۴';
      case 'annualInterestRate': return 'مثال: ۱۸';
      case 'gracePeriodMonths': return 'مثال: ۶';
      case 'steppedRate': return 'مثال: ۲';
      case 'lateMonths': return 'مثال: ۲';
      case 'latePenaltyRate': return 'مثال: ۲';
      case 'feeFlat': return 'مثال: ۵۰۰,۰۰۰';
      case 'feePercent': return 'مثال: ۱.۵';
      default: return '';
    }
  };

  type FormField = {
    id: string;
    label: string;
    value: string | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
    required: boolean;
    type?: string;
    note?: string;
  };

  const getInputFields = (): FormField[] => {
    const fields = [
      {
        id: 'amount',
        label: 'مبلغ وام (تومان)',
        value: form.amountText,
        onChange: (value: string) => setForm(s => ({ ...s, amountText: value })),
        placeholder: getPlaceholder('amount'),
        required: true
      },
      {
        id: 'durationMonths',
        label: 'مدت وام (ماه)',
        value: form.durationMonthsText,
        onChange: (value: string) => setForm(s => ({ ...s, durationMonthsText: value })),
        placeholder: getPlaceholder('durationMonths'),
        required: true
      },
      {
        id: 'annualInterestRate',
        label: 'نرخ سود سالانه (درصد)',
        value: form.annualInterestRateText,
        onChange: (value: string) => setForm(s => ({ ...s, annualInterestRateText: value })),
        placeholder: getPlaceholder('annualInterestRate'),
        required: true
      },
      {
        id: 'startDate',
        label: 'تاریخ شروع',
        value: form.startDateText,
        onChange: (value: string) => setForm(s => ({ ...s, startDateText: value })),
        type: 'date',
        required: false
      }
    ];

    // Add conditional fields based on repayment type
    if (form.repaymentType === 'grace') {
      fields.push({
        id: 'gracePeriodMonths',
        label: 'دوره مرجوعی (ماه)',
        value: form.gracePeriodMonthsText,
        onChange: (value: string) => setForm(s => ({ ...s, gracePeriodMonthsText: value })),
        placeholder: getPlaceholder('gracePeriodMonths'),
        required: false,
        note: 'تعداد ماه‌هایی که فقط سود پرداخت می‌شود'
      });
    }

    if (form.repaymentType === 'stepped') {
      fields.push({
        id: 'steppedRate',
        label: 'افزایش نرخ هر مرحله (درصد)',
        value: form.steppedRateText,
        onChange: (value: string) => setForm(s => ({ ...s, steppedRateText: value })),
        placeholder: getPlaceholder('steppedRate'),
        required: false,
        note: 'افزایش نرخ سود در هر مرحله'
      });
    }

    // Add penalty and fees fields
    fields.push(
      {
        id: 'lateMonths',
        label: 'ماه‌های تأخیر',
        value: form.lateMonthsText,
        onChange: (value: string) => setForm(s => ({ ...s, lateMonthsText: value })),
        placeholder: getPlaceholder('lateMonths'),
        required: false,
        note: 'تعداد ماه‌های تأخیر در پرداخت'
      },
      {
        id: 'latePenaltyRate',
        label: 'نرخ جریمه دیرکرد (درصد ماهانه)',
        value: form.latePenaltyRateText,
        onChange: (value: string) => setForm(s => ({ ...s, latePenaltyRateText: value })),
        placeholder: getPlaceholder('latePenaltyRate'),
        required: false,
        note: 'درصد جریمه از قسط معوق'
      },
      {
        id: 'feeFlat',
        label: 'کارمزد ثابت (تومان)',
        value: form.feeFlatText,
        onChange: (value: string) => setForm(s => ({ ...s, feeFlatText: value })),
        placeholder: getPlaceholder('feeFlat'),
        required: false,
        note: 'مبلغ ثابت کارمزد'
      },
      {
        id: 'feePercent',
        label: 'کارمزد درصدی (درصد)',
        value: form.feePercentText,
        onChange: (value: string) => setForm(s => ({ ...s, feePercentText: value })),
        placeholder: getPlaceholder('feePercent'),
        required: false,
        note: 'درصد کارمزد از مبلغ وام'
      }
    );

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
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h1 className="text-4xl font-black text-black mb-4">
              محاسبه‌گر پیشرفته وام بانکی
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              ابزار کامل و حرفه‌ای برای محاسبه انواع وام‌های بانکی با قابلیت‌های پیشرفته
              شامل پرداخت فصلی، جریمه دیرکرد، کارمزد و جدول اقساط کامل.
            </p>
          </div>
        </FadeIn>

        {/* Repayment Type Selection */}
        <FadeIn delay={0.1}>
          <div className="max-w-6xl mx-auto">
            <AnimatedCard className="p-8">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${toolCategories.financial.primary}10` }}>
                  <svg className="w-5 h-5" style={{ color: toolCategories.financial.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M9 11h.01M12 11h.01M15 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                نوع بازپرداخت را انتخاب کنید
              </h2>
              <StaggerContainer staggerDelay={0.05}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(['annuity', 'simple', 'stepped', 'grace'] as RepaymentType[]).map((type) => (
                    <StaggerItem key={type}>
                      <motion.button
                        onClick={() => setForm(s => ({ ...s, repaymentType: type }))}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-right ${
                          form.repaymentType === type
                            ? 'border-opacity-100 shadow-lg text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        style={form.repaymentType === type ? {
                          backgroundColor: toolCategories.financial.primary,
                          borderColor: toolCategories.financial.primary
                        } : {}}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-lg font-bold mb-2">{getRepaymentTypeLabel(type)}</div>
                        <div className={`text-sm ${form.repaymentType === type ? 'text-gray-200' : 'text-gray-500'}`}>
                          {getRepaymentTypeDescription(type)}
                        </div>
                      </motion.button>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </AnimatedCard>
          </div>
        </FadeIn>

        {/* Payment Frequency Selection */}
        <FadeIn delay={0.2}>
          <div className="max-w-6xl mx-auto">
            <AnimatedCard className="p-8">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                فاصله پرداخت را انتخاب کنید
              </h2>
              <StaggerContainer staggerDelay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['monthly', 'quarterly', 'yearly'] as PaymentFrequency[]).map((frequency) => (
                    <StaggerItem key={frequency}>
                      <motion.button
                        onClick={() => setForm(s => ({ ...s, paymentFrequency: frequency }))}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-right ${
                          form.paymentFrequency === frequency
                            ? 'border-black bg-black text-white shadow-lg'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-bold text-lg mb-3">{getPaymentFrequencyLabel(frequency)}</div>
                        <div className={`text-sm leading-relaxed ${form.paymentFrequency === frequency ? 'text-gray-200' : 'text-gray-500'}`}>
                          {frequency === 'monthly' && 'پرداخت هر ماه'}
                          {frequency === 'quarterly' && 'پرداخت هر ۳ ماه'}
                          {frequency === 'yearly' && 'پرداخت هر سال'}
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
                          type={field.type || 'text'}
                          inputMode={field.type === 'date' ? undefined : 'numeric'}
                          className="input-field"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={field.placeholder}
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
                    نتیجه محاسبه - {getRepaymentTypeLabel(form.repaymentType)}
                  </h2>
                  
                  <StaggerContainer staggerDelay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <StaggerItem>
                        <motion.div 
                          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-blue-600 text-sm font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            قسط {getPaymentFrequencyLabel(form.paymentFrequency)}
                          </div>
                          <div className="text-2xl font-black text-blue-900">
                            {formatMoneyFa(result.monthlyInstallment)} تومان
                          </div>
                        </motion.div>
                      </StaggerItem>
                      
                      <StaggerItem>
                        <motion.div 
                          className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-green-600 text-sm font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            مجموع بازپرداخت
                          </div>
                          <div className="text-2xl font-black text-green-900">
                            {formatMoneyFa(result.totalRepayment)} تومان
                          </div>
                        </motion.div>
                      </StaggerItem>
                      
                      <StaggerItem>
                        <motion.div 
                          className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200 shadow-lg"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-amber-600 text-sm font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            سود کل
                          </div>
                          <div className="text-2xl font-black text-amber-900">
                            {formatMoneyFa(result.totalInterest)} تومان
                          </div>
                        </motion.div>
                      </StaggerItem>

                      <StaggerItem>
                        <motion.div 
                          className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-purple-600 text-sm font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            مبلغ نهایی قابل پرداخت
                          </div>
                          <div className="text-2xl font-black text-purple-900">
                            {formatMoneyFa(result.finalPayableAmount)} تومان
                          </div>
                        </motion.div>
                      </StaggerItem>
                    </div>
                  </StaggerContainer>

                  {/* Additional Costs */}
                  <AnimatePresence>
                    {(result.totalLatePenalty || result.totalFees) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                      >
                        {result.totalLatePenalty && (
                          <motion.div
                            className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="text-red-600 text-sm font-bold mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              جریمه دیرکرد
                            </div>
                            <div className="text-xl font-black text-red-900">
                              {formatMoneyFa(result.totalLatePenalty)} تومان
                            </div>
                          </motion.div>
                        )}
                        
                        {result.totalFees && (
                          <motion.div
                            className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200 shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="text-indigo-600 text-sm font-bold mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              کارمزد
                            </div>
                            <div className="text-xl font-black text-indigo-900">
                              {formatMoneyFa(result.totalFees)} تومان
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Payment Schedule */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gray-50 p-8 rounded-2xl border border-gray-200"
                  >
                    <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      جدول اقساط
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-right pb-4 text-sm font-bold text-gray-700">دوره</th>
                            <th className="text-right pb-4 text-sm font-bold text-gray-700">تاریخ</th>
                            <th className="text-right pb-4 text-sm font-bold text-gray-700">اصل</th>
                            <th className="text-right pb-4 text-sm font-bold text-gray-700">سود</th>
                            <th className="text-right pb-4 text-sm font-bold text-gray-700">قسط</th>
                            <th className="text-right pb-4 text-sm font-bold text-gray-700">مانده</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.schedule.slice(0, 12).map((payment, index) => (
                            <motion.tr 
                              key={payment.period}
                              className="border-b border-gray-100 hover:bg-gray-100 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                            >
                              <td className="py-4 text-sm font-semibold">{payment.period}</td>
                              <td className="py-4 text-sm">{payment.date}</td>
                              <td className="py-4 text-sm">{formatMoneyFa(payment.principal)}</td>
                              <td className="py-4 text-sm">{formatMoneyFa(payment.interest)}</td>
                              <td className="py-4 text-sm font-bold">{formatMoneyFa(payment.installment)}</td>
                              <td className="py-4 text-sm">{formatMoneyFa(payment.remaining)}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                      {result.schedule.length > 12 && (
                        <div className="text-center mt-4 text-sm text-gray-500">
                          نمایش ۱۲ دوره اول از مجموع {result.schedule.length} دوره
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatedCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
