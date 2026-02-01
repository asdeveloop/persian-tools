import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMoneyFa, parseLooseNumber } from '../../shared/utils/number';
import { getSessionJson, setSessionJson } from '../../shared/storage/sessionStorage';
import { 
  calculateSalary, 
  calculateMinimumWage, 
  calculateGrossFromNet,
  getSalaryLaws 
} from './index';
import type { SalaryInput, SalaryOutput, MinimumWageOutput } from './salary.types';
import { AnimatedCard, StaggerContainer, StaggerItem, FadeIn } from '../../shared/ui/AnimatedComponents';
import { colors, toolCategories } from '../../shared/ui/theme';

type CalculationMode = 'gross-to-net' | 'net-to-gross' | 'minimum-wage';

type SalaryFormState = {
  mode: CalculationMode;
  // اطلاعات پایه
  baseSalaryText: string;
  netSalaryText: string;
  workingDaysText: string;
  workExperienceYearsText: string;
  
  // اضافه‌کاری
  overtimeHoursText: string;
  nightOvertimeHoursText: string;
  holidayOvertimeHoursText: string;
  
  // مأموریت
  missionDaysText: string;
  
  // اطلاعات خانوادگی
  isMarried: boolean;
  numberOfChildrenText: string;
  
  // مزایا و کسورات
  hasWorkerCoupon: boolean;
  hasTransportation: boolean;
  otherBenefitsText: string;
  otherDeductionsText: string;
  
  // اطلاعات منطقه‌ای
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
        isDevelopmentZone: false
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

  function onCalculate() {
    setError(null);
    setResult(null);
    setMinimumWageResult(null);

    try {
      if (form.mode === 'minimum-wage') {
        const workExperienceYears = parseLooseNumber(form.workExperienceYearsText) || 0;
        const numberOfChildren = parseLooseNumber(form.numberOfChildrenText) || 0;
        const otherDeductions = parseLooseNumber(form.otherDeductionsText) || 0;
        
        const minWageResult = calculateMinimumWage({
          workExperienceYears,
          isMarried: form.isMarried,
          numberOfChildren,
          isDevelopmentZone: form.isDevelopmentZone,
          otherDeductions
        });
        
        setMinimumWageResult(minWageResult);
      } else if (form.mode === 'net-to-gross') {
        const netSalary = parseLooseNumber(form.netSalaryText);
        if (netSalary === null) return setError('لطفاً حقوق خالص را به‌صورت عدد وارد کنید.');
        
        const input: Omit<SalaryInput, 'baseSalary'> = {
          workingDays: parseLooseNumber(form.workingDaysText) || 30,
          workExperienceYears: parseLooseNumber(form.workExperienceYearsText) || 0,
          overtimeHours: parseLooseNumber(form.overtimeHoursText) || 0,
          nightOvertimeHours: parseLooseNumber(form.nightOvertimeHoursText) || 0,
          holidayOvertimeHours: parseLooseNumber(form.holidayOvertimeHoursText) || 0,
          missionDays: parseLooseNumber(form.missionDaysText) || 0,
          isMarried: form.isMarried,
          numberOfChildren: parseLooseNumber(form.numberOfChildrenText) || 0,
          hasWorkerCoupon: form.hasWorkerCoupon,
          hasTransportation: form.hasTransportation,
          otherBenefits: parseLooseNumber(form.otherBenefitsText) || 0,
          otherDeductions: parseLooseNumber(form.otherDeductionsText) || 0,
          isDevelopmentZone: form.isDevelopmentZone
        };

        const calculationResult = calculateGrossFromNet(netSalary, input);
        setResult(calculationResult);
      } else {
        const baseSalary = parseLooseNumber(form.baseSalaryText);
        if (baseSalary === null) return setError('لطفاً حقوق پایه را به‌صورت عدد وارد کنید.');

        const input: SalaryInput = {
          baseSalary,
          workingDays: parseLooseNumber(form.workingDaysText) || 30,
          workExperienceYears: parseLooseNumber(form.workExperienceYearsText) || 0,
          overtimeHours: parseLooseNumber(form.overtimeHoursText) || 0,
          nightOvertimeHours: parseLooseNumber(form.nightOvertimeHoursText) || 0,
          holidayOvertimeHours: parseLooseNumber(form.holidayOvertimeHoursText) || 0,
          missionDays: parseLooseNumber(form.missionDaysText) || 0,
          isMarried: form.isMarried,
          numberOfChildren: parseLooseNumber(form.numberOfChildrenText) || 0,
          hasWorkerCoupon: form.hasWorkerCoupon,
          hasTransportation: form.hasTransportation,
          otherBenefits: parseLooseNumber(form.otherBenefitsText) || 0,
          otherDeductions: parseLooseNumber(form.otherDeductionsText) || 0,
          isDevelopmentZone: form.isDevelopmentZone
        };

        const calculationResult = calculateSalary(input);
        setResult(calculationResult);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    }
  }

  const laws = getSalaryLaws();

  const getCalculationModeLabel = (mode: CalculationMode) => {
    switch (mode) {
      case 'gross-to-net': return 'حقوق ناخالص به خالص';
      case 'net-to-gross': return 'حقوق خالص به ناخالص';
      case 'minimum-wage': return 'حداقل دستمزد';
    }
  };

  const getCalculationModeDescription = (mode: CalculationMode) => {
    switch (mode) {
      case 'gross-to-net': return 'محاسبه حقوق دریافتی از حقوق پایه';
      case 'net-to-gross': return 'محاسبه حقوق پیشنهادی به کارفرما';
      case 'minimum-wage': return 'بر اساس سابقه و شرایط خانوادگی';
    }
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
              محاسبه‌گر حقوق و دستمزد پیشرفته
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              محاسبه حقوق و مالیات بر اساس قوانین سال {laws.year} با پشتیبانی از معافیت‌های قانونی و نرخ‌های تصاعدی.
              شامل بیمه تامین اجتماعی، مزایا و کسورات مختلف.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              حداقل دستمزد: {formatMoneyFa(laws.minimumWage)} تومان | 
              معافیت مالیات: {formatMoneyFa(laws.taxExemption)} تومان ماهانه
            </div>
          </div>
        </FadeIn>

        {/* Calculation Type Selection */}
        <FadeIn delay={0.1}>
          <div className="max-w-6xl mx-auto">
            <AnimatedCard className="p-8">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${toolCategories.financial.primary}10` }}>
                  <svg className="w-5 h-5" style={{ color: toolCategories.financial.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M9 11h.01M12 11h.01M15 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                نوع محاسبه را انتخاب کنید
              </h2>
              <StaggerContainer staggerDelay={0.05}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['gross-to-net', 'net-to-gross', 'minimum-wage'] as CalculationMode[]).map((mode) => (
                    <StaggerItem key={mode}>
                      <motion.button
                        onClick={() => setForm(s => ({ ...s, mode }))}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-right ${
                          form.mode === mode
                            ? 'border-opacity-100 shadow-lg text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        style={form.mode === mode ? {
                          backgroundColor: toolCategories.financial.primary,
                          borderColor: toolCategories.financial.primary
                        } : {}}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-lg font-bold mb-2">{getCalculationModeLabel(mode)}</div>
                        <div className={`text-sm ${form.mode === mode ? 'text-green-100' : 'text-gray-500'}`}>
                          {getCalculationModeDescription(mode)}
                        </div>
                      </motion.button>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </AnimatedCard>
          </div>
        </FadeIn>

        {/* Main Form */}
        <FadeIn delay={0.2}>
          <div className="max-w-6xl mx-auto">
            <AnimatedCard className="p-8">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${toolCategories.financial.primary}10` }}>
                  <svg className="w-5 h-5" style={{ color: toolCategories.financial.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                اطلاعات حقوق
              </h2>
              
              {form.mode === 'gross-to-net' && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="baseSalary">
                    حقوق پایه ماهانه (تومان)
                  </label>
                  <input
                    id="baseSalary"
                    inputMode="numeric"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    value={form.baseSalaryText}
                    onChange={(e) => setForm((s) => ({ ...s, baseSalaryText: e.target.value }))}
                    placeholder="مثال: ۱۵,۰۰۰,۰۰۰"
                  />
                </div>
              )}
              
              {form.mode === 'net-to-gross' && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="netSalary">
                    حقوق خالص مورد نظر (تومان)
                  </label>
                  <input
                    id="netSalary"
                    inputMode="numeric"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    value={form.netSalaryText}
                    onChange={(e) => setForm((s) => ({ ...s, netSalaryText: e.target.value }))}
                    placeholder="مثال: ۱۲,۰۰۰,۰۰۰"
                  />
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {form.mode !== 'minimum-wage' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="workingDays">
                        تعداد روزهای کاری
                      </label>
                      <input
                        id="workingDays"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.workingDaysText}
                        onChange={(e) => setForm((s) => ({ ...s, workingDaysText: e.target.value }))}
                        placeholder="مثال: ۳۰"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="workExperience">
                        سابقه کار (سال)
                      </label>
                      <input
                        id="workExperience"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.workExperienceYearsText}
                        onChange={(e) => setForm((s) => ({ ...s, workExperienceYearsText: e.target.value }))}
                        placeholder="مثال: ۵"
                      />
                    </div>
                  </>
                )}

                {form.mode === 'minimum-wage' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="experience">
                        سابقه کار (سال)
                      </label>
                      <input
                        id="experience"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.workExperienceYearsText}
                        onChange={(e) => setForm((s) => ({ ...s, workExperienceYearsText: e.target.value }))}
                        placeholder="مثال: ۳"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="children">
                        تعداد فرزندان
                      </label>
                      <input
                        id="children"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.numberOfChildrenText}
                        onChange={(e) => setForm((s) => ({ ...s, numberOfChildrenText: e.target.value }))}
                        placeholder="مثال: ۲"
                      />
                    </div>
                  </>
                )}
              </div>

              {form.mode !== 'minimum-wage' && (
                <>
                  <h3 className="text-lg font-bold text-black mt-8 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-600/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    اضافه‌کاری
                  </h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="overtime">
                        اضافه‌کاری عادی (ساعت)
                      </label>
                      <input
                        id="overtime"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.overtimeHoursText}
                        onChange={(e) => setForm((s) => ({ ...s, overtimeHoursText: e.target.value }))}
                        placeholder="مثال: ۱۰"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="nightOvertime">
                        اضافه‌کاری شب (ساعت)
                      </label>
                      <input
                        id="nightOvertime"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.nightOvertimeHoursText}
                        onChange={(e) => setForm((s) => ({ ...s, nightOvertimeHoursText: e.target.value }))}
                        placeholder="مثال: ۵"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="holidayOvertime">
                        اضافه‌کاری تعطیلات (ساعت)
                      </label>
                      <input
                        id="holidayOvertime"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.holidayOvertimeHoursText}
                        onChange={(e) => setForm((s) => ({ ...s, holidayOvertimeHoursText: e.target.value }))}
                        placeholder="مثال: ۳"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-black mt-8 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-600/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    مزایا و کسورات
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="missionDays">
                        روزهای مأموریت
                      </label>
                      <input
                        id="missionDays"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.missionDaysText}
                        onChange={(e) => setForm((s) => ({ ...s, missionDaysText: e.target.value }))}
                        placeholder="مثال: ۲"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="otherBenefits">
                        سایر مزایا (تومان)
                      </label>
                      <input
                        id="otherBenefits"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.otherBenefitsText}
                        onChange={(e) => setForm((s) => ({ ...s, otherBenefitsText: e.target.value }))}
                        placeholder="مثال: ۵۰۰,۰۰۰"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="numberOfChildren">
                        تعداد فرزندان
                      </label>
                      <input
                        id="numberOfChildren"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.numberOfChildrenText}
                        onChange={(e) => setForm((s) => ({ ...s, numberOfChildrenText: e.target.value }))}
                        placeholder="مثال: ۲"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="otherDeductions">
                        سایر کسورات (تومان)
                      </label>
                      <input
                        id="otherDeductions"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={form.otherDeductionsText}
                        onChange={(e) => setForm((s) => ({ ...s, otherDeductionsText: e.target.value }))}
                        placeholder="مثال: ۲۰۰,۰۰۰"
                      />
                    </div>
                  </div>
                </>
              )}

              <h3 className="text-lg font-bold text-black mt-8 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-600/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                شرایط خاص
              </h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="ml-3 w-5 h-5 border-gray-300 rounded focus:ring-blue-500"
                    style={{ accentColor: toolCategories.financial.primary }}
                    checked={form.isMarried}
                    onChange={(e) => setForm((s) => ({ ...s, isMarried: e.target.checked }))}
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-700">متاهل</span>
                    <p className="text-xs text-gray-500">شامل حق اولاد همسر می‌شود</p>
                  </div>
                </label>
                
                {form.mode !== 'minimum-wage' && (
                  <>
                    <label className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        className="ml-3 w-5 h-5 border-gray-300 rounded focus:ring-blue-500"
                        style={{ accentColor: toolCategories.financial.primary }}
                        checked={form.hasWorkerCoupon}
                        onChange={(e) => setForm((s) => ({ ...s, hasWorkerCoupon: e.target.checked }))}
                      />
                      <div>
                        <span className="text-sm font-bold text-gray-700">دریافت بن کارگری</span>
                        <p className="text-xs text-gray-500">ماهانه ۱۰۰,۰۰۰ تومان</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        className="ml-3 w-5 h-5 border-gray-300 rounded focus:ring-blue-500"
                        style={{ accentColor: toolCategories.financial.primary }}
                        checked={form.hasTransportation}
                        onChange={(e) => setForm((s) => ({ ...s, hasTransportation: e.target.checked }))}
                      />
                      <div>
                        <span className="text-sm font-bold text-gray-700">دریافت کمک هزینه ایاب‌وذهاب</span>
                        <p className="text-xs text-gray-500">ماهانه ۱۵۰,۰۰۰ تومان</p>
                      </div>
                    </label>
                  </>
                )}
                
                <label className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="ml-3 w-5 h-5 border-gray-300 rounded focus:ring-blue-500"
                    style={{ accentColor: toolCategories.financial.primary }}
                    checked={form.isDevelopmentZone}
                    onChange={(e) => setForm((s) => ({ ...s, isDevelopmentZone: e.target.checked }))}
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-700">اشتغال در منطقه کمتر توسعه‌یافته</span>
                    <p className="text-xs text-gray-500">۵۰٪ تخفیف مالیات</p>
                  </div>
                </label>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                  style={{ backgroundColor: toolCategories.financial.primary }}
                  onClick={onCalculate}
                >
                  محاسبه حقوق
                </motion.button>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </AnimatedCard>
          </div>
        </FadeIn>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <FadeIn delay={0.3}>
              <div className="max-w-6xl mx-auto">
                <AnimatedCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-black flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${toolCategories.financial.primary}10` }}>
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
                        background: `linear-gradient(135deg, ${colors.primary[50]}, ${colors.primary[100]})`,
                        borderColor: colors.primary[200]
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
                        background: `linear-gradient(135deg, ${colors.status.error}20, ${colors.status.error}30)`,
                        borderColor: `${colors.status.error}40`
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
                        background: `linear-gradient(135deg, ${colors.status.success}20, ${colors.status.success}30)`,
                        borderColor: `${colors.status.success}40`
                      }}
                    >
                      <div className="text-sm font-bold mb-2" style={{ color: colors.status.success }}>حقوق خالص</div>
                      <div className="text-2xl font-black" style={{ color: colors.status.success }}>
                        {formatMoneyFa(result.netSalary)} تومان
                      </div>
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8 space-y-6 border-t pt-6 overflow-hidden"
                      >
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-600/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              جزئیات حقوق پایه
                            </h3>
                            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">حقوق پایه محاسبه شده:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.base.calculated)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">پاداش سابقه کار:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.base.experienceBonus)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-600/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              اضافه‌کاری
                            </h3>
                            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">عادی:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.overtime.normal)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">شب:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.overtime.night)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">تعطیلات:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.overtime.holiday)}</span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-bold">مجموع اضافه‌کاری:</span>
                                <span className="text-sm font-bold text-green-600">{formatMoneyFa(result.details.overtime.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-600/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              مزایا
                            </h3>
                            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">حق مسکن:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.allowances.housing)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">کمک هزینه غذا:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.allowances.food)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">حق اولاد:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.allowances.child)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">بن کارگری:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.allowances.coupon)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">مأموریت:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.allowances.mission)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">ایاب‌وذهاب:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.allowances.transportation)}</span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-bold">مجموع مزایا:</span>
                                <span className="text-sm font-bold text-green-600">{formatMoneyFa(result.details.allowances.total)}</span>
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
                              کسورات
                            </h3>
                            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">بیمه سهم کارگر ({result.details.insurance.rate}%):</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.insurance.workerShare)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">مالیات:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.tax.final)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">سایر کسورات:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.details.deductions.other)}</span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-bold">مجموع کسورات:</span>
                                <span className="text-sm font-bold text-red-600">{formatMoneyFa(result.details.deductions.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-600/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              اطلاعات مالیات
                            </h3>
                            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">درآمد مشمول مالیات ماهانه:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.summary.monthlyTaxableIncome)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">درآمد مشمول مالیات سالانه:</span>
                                <span className="text-sm font-bold">{formatMoneyFa(result.summary.annualTaxableIncome)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">نرخ مؤثر مالیات:</span>
                                <span className="text-sm font-bold">{result.summary.effectiveTaxRate.toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-600/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </div>
                              خلاصه
                            </h3>
                            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">نرخ مؤثر بیمه:</span>
                                <span className="text-sm font-bold">{result.summary.effectiveInsuranceRate.toFixed(2)}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">درصد خالص به ناخالص:</span>
                                <span className="text-sm font-bold">{((result.netSalary / result.grossSalary) * 100).toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
