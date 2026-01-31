import { useEffect, useMemo, useState } from 'react';
import { formatMoneyFa, parseLooseNumber } from '../../shared/utils/number';
import { getSessionJson, setSessionJson } from '../../shared/storage/sessionStorage';
import { calculateSalary } from './salary.logic';
import type { SalaryResult } from './salary.types';

type SalaryFormState = {
  grossText: string;
  insurancePercentText: string;
  taxPercentText: string;
  otherDeductionsText: string;
};

const sessionKey = 'salary.form.v1';

export default function SalaryPage() {
  const initial = useMemo<SalaryFormState>(() => {
    return (
      getSessionJson<SalaryFormState>(sessionKey) ?? {
        grossText: '30000000',
        insurancePercentText: '7',
        taxPercentText: '10',
        otherDeductionsText: '0'
      }
    );
  }, []);

  const [form, setForm] = useState<SalaryFormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SalaryResult | null>(null);

  useEffect(() => {
    setSessionJson(sessionKey, form);
  }, [form]);

  function onCalculate() {
    setError(null);
    setResult(null);

    const gross = parseLooseNumber(form.grossText);
    const insurancePercent = parseLooseNumber(form.insurancePercentText);
    const taxPercent = parseLooseNumber(form.taxPercentText);
    const other = parseLooseNumber(form.otherDeductionsText);

    if (gross === null) return setError('لطفاً حقوق ناخالص را به‌صورت عدد وارد کنید.');
    if (insurancePercent === null) return setError('لطفاً درصد بیمه را به‌صورت عدد وارد کنید.');
    if (taxPercent === null) return setError('لطفاً درصد مالیات را به‌صورت عدد وارد کنید.');
    if (other === null) return setError('لطفاً کسورات دیگر را به‌صورت عدد وارد کنید.');

    try {
      const r = calculateSalary({
        grossMonthlySalary: gross,
        insurancePercent,
        taxPercent,
        otherDeductions: other
      });
      setResult(r);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4">
        <h1 className="text-lg font-bold">محاسبه‌گر حقوق ساده</h1>
        <p className="mt-2 text-sm text-slate-700">
          این ابزار یک مدل ساده است و جایگزین محاسبه‌گر رسمی مالیات/بیمه نیست.
        </p>
      </div>

      <div className="rounded-lg bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium" htmlFor="gross">
              حقوق ناخالص ماهانه (تومان)
            </label>
            <input
              id="gross"
              inputMode="numeric"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.grossText}
              onChange={(e) => setForm((s) => ({ ...s, grossText: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="insurance">
              درصد بیمه
            </label>
            <input
              id="insurance"
              inputMode="decimal"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.insurancePercentText}
              onChange={(e) => setForm((s) => ({ ...s, insurancePercentText: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="tax">
              درصد مالیات
            </label>
            <input
              id="tax"
              inputMode="decimal"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.taxPercentText}
              onChange={(e) => setForm((s) => ({ ...s, taxPercentText: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="other">
              کسورات دیگر (تومان)
            </label>
            <input
              id="other"
              inputMode="numeric"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.otherDeductionsText}
              onChange={(e) => setForm((s) => ({ ...s, otherDeductionsText: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={onCalculate}
          >
            محاسبه
          </button>

          {error ? <div className="text-sm text-red-700">{error}</div> : null}
        </div>
      </div>

      {result ? (
        <div className="rounded-lg bg-white p-4">
          <h2 className="text-base font-bold">نتیجه</h2>
          <dl className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs text-slate-600">مبلغ بیمه</dt>
              <dd className="mt-1 text-lg font-bold">{formatMoneyFa(result.insuranceAmount)} تومان</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs text-slate-600">مبلغ مالیات</dt>
              <dd className="mt-1 text-lg font-bold">{formatMoneyFa(result.taxAmount)} تومان</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs text-slate-600">حقوق خالص</dt>
              <dd className="mt-1 text-lg font-bold">{formatMoneyFa(result.netSalary)} تومان</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
