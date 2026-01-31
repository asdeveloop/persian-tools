import { useEffect, useMemo, useState } from 'react';
import { formatMoneyFa, parseLooseNumber } from '../../shared/utils/number';
import { getSessionJson, setSessionJson } from '../../shared/storage/sessionStorage';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';
import { calculateLoan } from './loan.logic';
import type { LoanResult } from './loan.types';

type LoanFormState = {
  principalText: string;
  annualRateText: string;
  monthsText: string;
};

const sessionKey = 'loan.form.v1';

export default function LoanPage() {
  const initial = useMemo<LoanFormState>(() => {
    return (
      getSessionJson<LoanFormState>(sessionKey) ?? {
        principalText: '100000000',
        annualRateText: '23',
        monthsText: '36'
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

    if (principal === null) return setError('لطفاً مبلغ وام را به‌صورت عدد وارد کنید.');
    if (annualRate === null) return setError('لطفاً نرخ سود سالانه را به‌صورت عدد وارد کنید.');
    if (months === null) return setError('لطفاً مدت وام (ماه) را به‌صورت عدد وارد کنید.');

    try {
      const r = calculateLoan({
        principal,
        annualInterestRatePercent: annualRate,
        months: Math.trunc(months)
      });
      setResult(r);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 md:p-6">
        <h1 className="text-lg font-extrabold">محاسبه‌گر وام</h1>
        <p className="mt-2 text-sm text-slate-700">
          این محاسبه‌گر صرفاً برای برآورد است و ممکن است با شرایط بانک/موسسه تفاوت داشته باشد.
        </p>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium" htmlFor="principal">
              مبلغ وام (تومان)
            </label>
            <input
              id="principal"
              inputMode="numeric"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.principalText}
              onChange={(e) => setForm((s) => ({ ...s, principalText: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="annualRate">
              نرخ سود سالانه (درصد)
            </label>
            <input
              id="annualRate"
              inputMode="decimal"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.annualRateText}
              onChange={(e) => setForm((s) => ({ ...s, annualRateText: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="months">
              مدت (ماه)
            </label>
            <input
              id="months"
              inputMode="numeric"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.monthsText}
              onChange={(e) => setForm((s) => ({ ...s, monthsText: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button type="button" onClick={onCalculate}>
            محاسبه
          </Button>

          {error ? <div className="text-sm text-red-700">{error}</div> : null}
        </div>
      </Card>

      {result ? (
        <Card className="p-4 md:p-6">
          <h2 className="text-base font-extrabold">نتیجه</h2>
          <dl className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs text-slate-600">قسط ماهانه</dt>
              <dd className="mt-1 text-lg font-bold">{formatMoneyFa(result.monthlyPayment)} تومان</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs text-slate-600">پرداخت کل</dt>
              <dd className="mt-1 text-lg font-bold">{formatMoneyFa(result.totalPayment)} تومان</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs text-slate-600">سود کل</dt>
              <dd className="mt-1 text-lg font-bold">{formatMoneyFa(result.totalInterest)} تومان</dd>
            </div>
          </dl>
        </Card>
      ) : null}
    </div>
  );
}
