'use client';

import { useMemo, useState } from 'react';
import { Card, Button } from '@/components/ui';
import Input from '@/shared/ui/Input';
import {
  gregorianToJalali,
  isValidGregorianDate,
  isValidJalaliDate,
  jalaliToGregorian,
} from '@/features/date-tools/date-tools.logic';
import { numberToWordsFa, parseLooseNumber, toEnglishDigits } from '@/shared/utils/number';

type CalendarType = 'jalali' | 'gregorian';

type ParseResult =
  | { ok: true; date: { year: number; month: number; day: number } }
  | { ok: false; error: string };

const pad = (n: number) => n.toString().padStart(2, '0');

const parseDateInput = (value: string): ParseResult => {
  const normalized = toEnglishDigits(value)
    .replaceAll('-', '/')
    .replaceAll('.', '/')
    .replace(/\s+/g, '')
    .trim();

  const parts = normalized.split('/');
  if (parts.length !== 3) {
    return { ok: false, error: 'فرمت تاریخ باید به صورت سال/ماه/روز باشد.' };
  }
  const year = Number(parts[0] ?? '');
  const month = Number(parts[1] ?? '');
  const day = Number(parts[2] ?? '');
  if ([year, month, day].some((n) => Number.isNaN(n))) {
    return { ok: false, error: 'لطفاً فقط عدد وارد کنید.' };
  }
  return { ok: true, date: { year, month, day } };
};

export default function TextToolsPage() {
  const [calendarInput, setCalendarInput] = useState('1403/01/01');
  const [calendarType, setCalendarType] = useState<CalendarType>('jalali');
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [calendarOutput, setCalendarOutput] = useState('');

  const [numberInput, setNumberInput] = useState('123456');
  const [numberError, setNumberError] = useState<string | null>(null);

  const [textInput, setTextInput] = useState('');

  const wordStats = useMemo(() => {
    const trimmed = textInput.trim();
    const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).filter(Boolean).length;
    const characters = textInput.length;
    const charactersNoSpaces = textInput.replace(/\s/g, '').length;
    return { words, characters, charactersNoSpaces };
  }, [textInput]);

  const handleDateConvert = () => {
    const parsed = parseDateInput(calendarInput);
    if (!parsed.ok) {
      setCalendarError(parsed.error);
      setCalendarOutput('');
      return;
    }

    if (calendarType === 'jalali') {
      if (!isValidJalaliDate(parsed.date)) {
        setCalendarError('تاریخ شمسی معتبر نیست.');
        setCalendarOutput('');
        return;
      }
      const g = jalaliToGregorian(parsed.date.year, parsed.date.month, parsed.date.day);
      setCalendarOutput(`${g.year}/${pad(g.month)}/${pad(g.day)}`);
      setCalendarError(null);
      return;
    }

    if (!isValidGregorianDate(parsed.date)) {
      setCalendarError('تاریخ میلادی معتبر نیست.');
      setCalendarOutput('');
      return;
    }
    const j = gregorianToJalali(parsed.date.year, parsed.date.month, parsed.date.day);
    setCalendarOutput(`${j.year}/${pad(j.month)}/${pad(j.day)}`);
    setCalendarError(null);
  };

  const numberWords = useMemo(() => {
    const parsed = parseLooseNumber(numberInput);
    if (parsed === null) {
      return '';
    }
    return numberToWordsFa(parsed);
  }, [numberInput]);

  const handleNumberConvert = () => {
    const parsed = parseLooseNumber(numberInput);
    if (parsed === null) {
      setNumberError('لطفاً عدد معتبر وارد کنید.');
      return;
    }
    setNumberError(null);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
          ابزارهای متنی - کاملاً آفلاین
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">ابزارهای متنی</h1>
        <p className="text-[var(--text-secondary)]">
          تبدیل تاریخ، تبدیل عدد به حروف و شمارش کلمات برای متن‌های فارسی و انگلیسی.
        </p>
      </header>

      <Card className="p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm font-bold text-[var(--text-primary)]">تبدیل تاریخ</div>
            <div className="text-xs text-[var(--text-muted)]">شمسی ↔ میلادی</div>
          </div>
          <div className="inline-flex rounded-full border border-[var(--border-medium)] bg-[var(--surface-1)] p-1 text-xs">
            <button
              type="button"
              className={`px-3 py-2 rounded-full font-bold transition-all duration-[var(--motion-fast)] ${
                calendarType === 'jalali'
                  ? 'bg-[var(--color-primary)] text-[var(--text-inverted)] shadow-[var(--shadow-subtle)]'
                  : 'text-[var(--text-primary)]'
              }`}
              onClick={() => setCalendarType('jalali')}
              aria-pressed={calendarType === 'jalali'}
            >
              شمسی
            </button>
            <button
              type="button"
              className={`px-3 py-2 rounded-full font-bold transition-all duration-[var(--motion-fast)] ${
                calendarType === 'gregorian'
                  ? 'bg-[var(--color-primary)] text-[var(--text-inverted)] shadow-[var(--shadow-subtle)]'
                  : 'text-[var(--text-primary)]'
              }`}
              onClick={() => setCalendarType('gregorian')}
              aria-pressed={calendarType === 'gregorian'}
            >
              میلادی
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-end">
          <Input
            label={
              calendarType === 'jalali' ? 'تاریخ شمسی (YYYY/MM/DD)' : 'تاریخ میلادی (YYYY/MM/DD)'
            }
            value={calendarInput}
            onChange={(e) => setCalendarInput(e.target.value)}
            placeholder="1403/01/01"
          />
          <Button type="button" variant="secondary" onClick={handleDateConvert}>
            تبدیل
          </Button>
          <Input label="خروجی" value={calendarOutput} readOnly placeholder="----/--/--" />
        </div>
        {calendarError && (
          <div className="text-sm text-[var(--color-danger)]" role="alert" aria-live="assertive">
            {calendarError}
          </div>
        )}
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <div>
          <div className="text-sm font-bold text-[var(--text-primary)]">تبدیل عدد به حروف</div>
          <div className="text-xs text-[var(--text-muted)]">
            خروجی فارسی برای اعداد صحیح و اعشاری
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
          <Input
            label="عدد"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            placeholder="123456"
          />
          <Button type="button" variant="secondary" onClick={handleNumberConvert}>
            تبدیل
          </Button>
        </div>
        {numberError && (
          <div className="text-sm text-[var(--color-danger)]" role="alert" aria-live="assertive">
            {numberError}
          </div>
        )}
        <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          {numberWords || 'خروجی اینجا نمایش داده می‌شود.'}
        </div>
      </Card>

      <Card className="p-5 md:p-6 space-y-4">
        <div>
          <div className="text-sm font-bold text-[var(--text-primary)]">شمارش کلمات</div>
          <div className="text-xs text-[var(--text-muted)]">تعداد کلمات و کاراکترها</div>
        </div>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={6}
          className="input-field"
          placeholder="متن خود را وارد کنید..."
        />
        <div className="grid gap-3 sm:grid-cols-3 text-sm text-[var(--text-secondary)]">
          <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3">
            کلمات: {wordStats.words}
          </div>
          <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3">
            کاراکترها: {wordStats.characters}
          </div>
          <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3">
            بدون فاصله: {wordStats.charactersNoSpaces}
          </div>
        </div>
      </Card>
    </div>
  );
}
