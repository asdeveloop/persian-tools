'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui';
import Input from '@/shared/ui/Input';
import {
  isValidCardNumber,
  isValidIranianMobile,
  isValidIranianPlate,
  isValidIranianPostalCode,
  isValidIranianSheba,
  isValidNationalId,
  normalizeIranianMobile,
} from '@/shared/utils/validation';

const ResultBadge = ({ ok, text }: { ok: boolean; text: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
      ok
        ? 'bg-[rgb(var(--color-success-rgb)/0.16)] text-[var(--color-success)]'
        : 'bg-[rgb(var(--color-danger-rgb)/0.12)] text-[var(--color-danger)]'
    }`}
  >
    {text}
  </span>
);

export default function ValidationToolsPage() {
  const [nationalId, setNationalId] = useState('');
  const [mobile, setMobile] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [sheba, setSheba] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [plate, setPlate] = useState('');

  const nationalOk = useMemo(
    () => (nationalId ? isValidNationalId(nationalId) : false),
    [nationalId],
  );
  const mobileNormalized = useMemo(() => normalizeIranianMobile(mobile), [mobile]);
  const mobileOk = useMemo(() => (mobile ? isValidIranianMobile(mobile) : false), [mobile]);
  const cardOk = useMemo(() => (cardNumber ? isValidCardNumber(cardNumber) : false), [cardNumber]);
  const shebaOk = useMemo(() => (sheba ? isValidIranianSheba(sheba) : false), [sheba]);
  const postalOk = useMemo(
    () => (postalCode ? isValidIranianPostalCode(postalCode) : false),
    [postalCode],
  );
  const plateOk = useMemo(() => (plate ? isValidIranianPlate(plate) : false), [plate]);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
          ابزارهای اعتبارسنجی - کاملاً آفلاین
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">
          اعتبارسنجی داده‌های ایرانی
        </h1>
        <p className="text-[var(--text-secondary)]">
          کد ملی، موبایل، کارت بانکی، شبا، کدپستی و پلاک خودرو را سریع بررسی کنید.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[var(--text-primary)]">کد ملی</div>
            {nationalId && <ResultBadge ok={nationalOk} text={nationalOk ? 'معتبر' : 'نامعتبر'} />}
          </div>
          <Input
            label="کد ملی ۱۰ رقمی"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            dir="ltr"
            placeholder="0010350829"
          />
        </Card>

        <Card className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[var(--text-primary)]">شماره موبایل</div>
            {mobile && <ResultBadge ok={mobileOk} text={mobileOk ? 'معتبر' : 'نامعتبر'} />}
          </div>
          <Input
            label="موبایل ایران"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            dir="ltr"
            placeholder="09123456789 یا +989123456789"
          />
          {mobileNormalized && (
            <div className="text-xs text-[var(--text-muted)]">
              نرمال‌شده: <span dir="ltr">{mobileNormalized}</span>
            </div>
          )}
        </Card>

        <Card className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[var(--text-primary)]">کارت بانکی</div>
            {cardNumber && <ResultBadge ok={cardOk} text={cardOk ? 'معتبر' : 'نامعتبر'} />}
          </div>
          <Input
            label="شماره کارت ۱۶ رقمی"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            dir="ltr"
            placeholder="6037-9918-9412-3456"
          />
        </Card>

        <Card className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[var(--text-primary)]">شماره شبا</div>
            {sheba && <ResultBadge ok={shebaOk} text={shebaOk ? 'معتبر' : 'نامعتبر'} />}
          </div>
          <Input
            label="شبا (IR)"
            value={sheba}
            onChange={(e) => setSheba(e.target.value)}
            dir="ltr"
            placeholder="IR062960000000100324200001"
          />
        </Card>

        <Card className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[var(--text-primary)]">کد پستی</div>
            {postalCode && <ResultBadge ok={postalOk} text={postalOk ? 'معتبر' : 'نامعتبر'} />}
          </div>
          <Input
            label="کدپستی ۱۰ رقمی"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            dir="ltr"
            placeholder="1234567890"
          />
        </Card>

        <Card className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[var(--text-primary)]">پلاک خودرو</div>
            {plate && <ResultBadge ok={plateOk} text={plateOk ? 'معتبر' : 'نامعتبر'} />}
          </div>
          <Input
            label="فرمت پلاک ایران"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            dir="ltr"
            placeholder="12ب34567"
          />
        </Card>
      </div>
    </div>
  );
}
