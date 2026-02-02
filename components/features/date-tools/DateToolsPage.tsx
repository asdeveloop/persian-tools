'use client';

import { useMemo, useState } from 'react';
import { Button, Card } from '@/components/ui';
import Input from '@/shared/ui/Input';
import {
  addDays,
  compareDateParts,
  differenceInDays,
  differenceInYmd,
  gregorianToJalali,
  isValidGregorianDate,
  isValidJalaliDate,
  jalaliToGregorian,
  normalizeToGregorian,
  type CalendarType,
  type DateParts,
  getWeekdayName,
} from '@/features/date-tools/date-tools.logic';
import { toEnglishDigits } from '@/shared/utils/number';

type ParseResult = { ok: true; date: DateParts } | { ok: false; error: string };

const pad = (n: number) => n.toString().padStart(2, '0');

const formatGregorian = (d: DateParts) => `${d.year}/${pad(d.month)}/${pad(d.day)}`;
const formatJalali = (d: DateParts) => {
  const j = gregorianToJalali(d.year, d.month, d.day);
  return `${j.year}/${pad(j.month)}/${pad(j.day)}`;
};

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

const CalendarToggle = ({
  value,
  onChange,
}: {
  value: CalendarType;
  onChange: (v: CalendarType) => void;
}) => {
  const options: CalendarType[] = ['jalali', 'gregorian'];
  return (
    <div className="inline-flex rounded-full border border-[var(--border-medium)] bg-[var(--surface-1)] p-1 text-xs">
      {options.map((item) => (
        <button
          key={item}
          type="button"
          className={`px-3 py-2 rounded-full font-bold transition-all duration-[var(--motion-fast)] ${
            value === item
              ? 'bg-[var(--color-primary)] text-[var(--text-inverted)] shadow-[var(--shadow-subtle)]'
              : 'text-[var(--text-primary)]'
          }`}
          onClick={() => onChange(item)}
        >
          {item === 'jalali' ? 'شمسی' : 'میلادی'}
        </button>
      ))}
    </div>
  );
};

export default function DateToolsPage() {
  const today = useMemo<DateParts>(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }, []);

  // Conversion states
  const [jalaliInput, setJalaliInput] = useState('1403/01/01');
  const [gregInput, setGregInput] = useState('2024/03/20');
  const [convertError, setConvertError] = useState<string | null>(null);

  // Age states
  const [ageDateInput, setAgeDateInput] = useState('1375/06/01');
  const [ageCalendar, setAgeCalendar] = useState<CalendarType>('jalali');
  const [customNowInput, setCustomNowInput] = useState('');
  const [customNowCal, setCustomNowCal] = useState<CalendarType>('gregorian');
  const [useCustomNow, setUseCustomNow] = useState(false);

  // Difference states
  const [startInput, setStartInput] = useState('1402/12/29');
  const [startCal, setStartCal] = useState<CalendarType>('jalali');
  const [endInput, setEndInput] = useState('1403/01/05');
  const [endCal, setEndCal] = useState<CalendarType>('jalali');

  // Weekday / offset
  const [weekdayInput, setWeekdayInput] = useState('2024/03/20');
  const [weekdayCal, setWeekdayCal] = useState<CalendarType>('gregorian');
  const [offsetText, setOffsetText] = useState('0');

  const handleConvert = () => {
    const jalaliParsed = parseDateInput(jalaliInput);
    const gregParsed = parseDateInput(gregInput);
    if (!jalaliParsed.ok) {
      setConvertError(jalaliParsed.error);
      return;
    }
    if (!gregParsed.ok) {
      setConvertError(gregParsed.error);
      return;
    }
    if (!isValidJalaliDate(jalaliParsed.date)) {
      setConvertError('تاریخ شمسی معتبر نیست.');
      return;
    }
    if (!isValidGregorianDate(gregParsed.date)) {
      setConvertError('تاریخ میلادی معتبر نیست.');
      return;
    }
    setGregInput(
      formatGregorian(
        jalaliToGregorian(jalaliParsed.date.year, jalaliParsed.date.month, jalaliParsed.date.day),
      ),
    );
    const gToJ = gregorianToJalali(
      gregParsed.date.year,
      gregParsed.date.month,
      gregParsed.date.day,
    );
    setJalaliInput(`${gToJ.year}/${pad(gToJ.month)}/${pad(gToJ.day)}`);
    setConvertError(null);
  };

  const ageState = useMemo(() => {
    const dobParsed = parseDateInput(ageDateInput);
    if (!dobParsed.ok) {
      return { result: null, error: dobParsed.error };
    }
    const dobGregorian = normalizeToGregorian(dobParsed.date, ageCalendar);
    if (!dobGregorian) {
      return { result: null, error: 'تاریخ تولد معتبر نیست.' };
    }

    let referenceParts: DateParts | null = today;
    if (useCustomNow) {
      const parsed = parseDateInput(customNowInput || formatGregorian(today));
      if (!parsed.ok) {
        referenceParts = null;
      } else {
        referenceParts = normalizeToGregorian(parsed.date, customNowCal);
      }
    }

    if (!referenceParts) {
      return { result: null, error: 'تاریخ مرجع معتبر نیست.' };
    }
    if (compareDateParts(referenceParts, dobGregorian) < 0) {
      return { result: null, error: 'تاریخ تولد نباید بعد از تاریخ مرجع باشد.' };
    }
    const ymd = differenceInYmd(dobGregorian, referenceParts);
    const days = differenceInDays(dobGregorian, referenceParts);
    return { result: { ymd, days, reference: referenceParts }, error: null };
  }, [ageDateInput, ageCalendar, useCustomNow, customNowInput, customNowCal, today]);

  const diffState = useMemo(() => {
    const sParsed = parseDateInput(startInput);
    const eParsed = parseDateInput(endInput);
    if (!sParsed.ok) {
      return { result: null, error: sParsed.error };
    }
    if (!eParsed.ok) {
      return { result: null, error: eParsed.error };
    }
    const s = normalizeToGregorian(sParsed.date, startCal);
    const e = normalizeToGregorian(eParsed.date, endCal);
    if (!s || !e) {
      return { result: null, error: 'یکی از تاریخ‌ها معتبر نیست.' };
    }
    const days = differenceInDays(s, e);
    const ymd = differenceInYmd(s, e);
    return { result: { days, ymd, s, e }, error: null };
  }, [startInput, endInput, startCal, endCal]);

  const weekdayState = useMemo(() => {
    const parsed = parseDateInput(weekdayInput);
    if (!parsed.ok) {
      return { result: null, error: parsed.error };
    }
    const base = normalizeToGregorian(parsed.date, weekdayCal);
    if (!base) {
      return { result: null, error: 'تاریخ واردشده معتبر نیست.' };
    }
    const offset = Number(toEnglishDigits(offsetText || '0'));
    if (Number.isNaN(offset)) {
      return { result: null, error: 'افست روز باید عدد باشد.' };
    }
    const shifted = addDays(base, offset);
    return { result: { base, shifted }, error: null };
  }, [weekdayInput, weekdayCal, offsetText]);

  const ageResult = ageState.result;
  const diffResult = diffState.result;
  const weekdayResult = weekdayState.result;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-info)]"></span>
          ابزارهای تاریخ - کاملاً آفلاین
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">ابزارهای تاریخ</h1>
        <p className="text-[var(--text-secondary)]">
          تبدیل تاریخ شمسی و میلادی، محاسبه سن، اختلاف تاریخ و پیدا کردن روز هفته با دقت بالا.
        </p>
      </header>

      {/* Conversion */}
      <Card className="p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm font-bold text-[var(--text-primary)]">تبدیل تاریخ</div>
            <div className="text-xs text-[var(--text-muted)]">شمسی ↔ میلادی</div>
          </div>
          <Button size="sm" variant="secondary" onClick={handleConvert}>
            تبدیل دوطرفه
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="تاریخ شمسی (YYYY/MM/DD)"
            value={jalaliInput}
            onChange={(e) => setJalaliInput(e.target.value)}
            dir="ltr"
            placeholder="1403/01/01"
          />
          <div className="space-y-2">
            <Input
              label="خروجی میلادی"
              value={gregInput}
              onChange={(e) => setGregInput(e.target.value)}
              dir="ltr"
              placeholder="2024/03/20"
            />
            <div className="text-xs text-[var(--text-muted)]">
              هر بار روی «تبدیل دوطرفه» بزنید تا هر دو مقدار با هم همگام شوند.
            </div>
          </div>
        </div>
        {convertError && (
          <div className="text-sm text-[var(--color-danger)]" role="alert" aria-live="assertive">
            {convertError}
          </div>
        )}
      </Card>

      {/* Age */}
      <Card className="p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm font-bold text-[var(--text-primary)]">محاسبه سن</div>
            <div className="text-xs text-[var(--text-muted)]">بر اساس تاریخ تولد</div>
          </div>
          <CalendarToggle value={ageCalendar} onChange={setAgeCalendar} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="تاریخ تولد"
            value={ageDateInput}
            onChange={(e) => setAgeDateInput(e.target.value)}
            dir="ltr"
            placeholder={ageCalendar === 'jalali' ? '1375/06/01' : '1996/08/22'}
          />
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
              <input
                type="checkbox"
                checked={useCustomNow}
                onChange={(e) => setUseCustomNow(e.target.checked)}
              />
              محاسبه تا تاریخ دلخواه
            </label>
            {useCustomNow && (
              <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                <Input
                  label="تاریخ مرجع"
                  value={customNowInput}
                  onChange={(e) => setCustomNowInput(e.target.value)}
                  dir="ltr"
                  placeholder={customNowCal === 'jalali' ? '1403/01/01' : '2024/03/20'}
                />
                <div className="flex items-end">
                  <CalendarToggle value={customNowCal} onChange={setCustomNowCal} />
                </div>
              </div>
            )}
          </div>
        </div>
        {ageState.error && (
          <div className="text-sm text-[var(--color-danger)]" role="alert" aria-live="assertive">
            {ageState.error}
          </div>
        )}
        {ageResult && (
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/60 p-4">
              <div className="text-xs text-[var(--text-muted)]">سن دقیق</div>
              <div className="text-lg font-black text-[var(--text-primary)]">
                {ageResult.ymd.years} سال و {ageResult.ymd.months} ماه و {ageResult.ymd.days} روز
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/60 p-4">
              <div className="text-xs text-[var(--text-muted)]">کل روزها</div>
              <div className="text-lg font-black text-[var(--text-primary)]">
                {ageResult.days.toLocaleString('fa-IR')} روز
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/60 p-4">
              <div className="text-xs text-[var(--text-muted)]">تاریخ مرجع</div>
              <div className="text-base font-bold text-[var(--text-primary)]">
                میلادی: {formatGregorian(ageResult.reference)} <br />
                شمسی: {formatJalali(ageResult.reference)}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Difference */}
      <Card className="p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm font-bold text-[var(--text-primary)]">فاصله دو تاریخ</div>
            <div className="text-xs text-[var(--text-muted)]">تعداد روز و سال/ماه/روز</div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">تاریخ شروع</span>
              <CalendarToggle value={startCal} onChange={setStartCal} />
            </div>
            <Input
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              dir="ltr"
              placeholder={startCal === 'jalali' ? '1402/12/29' : '2024/03/19'}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">تاریخ پایان</span>
              <CalendarToggle value={endCal} onChange={setEndCal} />
            </div>
            <Input
              value={endInput}
              onChange={(e) => setEndInput(e.target.value)}
              dir="ltr"
              placeholder={endCal === 'jalali' ? '1403/01/05' : '2024/03/24'}
            />
          </div>
        </div>
        {diffState.error && (
          <div className="text-sm text-[var(--color-danger)]" role="alert" aria-live="assertive">
            {diffState.error}
          </div>
        )}
        {diffResult && (
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/60 p-4">
              <div className="text-xs text-[var(--text-muted)]">تعداد روز</div>
              <div className="text-lg font-black text-[var(--text-primary)]">
                {diffResult.days.toLocaleString('fa-IR')} روز
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/60 p-4">
              <div className="text-xs text-[var(--text-muted)]">بر حسب سال/ماه/روز</div>
              <div className="text-lg font-black text-[var(--text-primary)]">
                {diffResult.ymd.years} سال، {diffResult.ymd.months} ماه، {diffResult.ymd.days} روز
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/60 p-4 space-y-2">
              <div className="text-xs text-[var(--text-muted)]">نمایش دو تقویم</div>
              <div className="text-[var(--text-primary)] font-medium">
                شروع: میلادی {formatGregorian(diffResult.s)} | شمسی {formatJalali(diffResult.s)}
              </div>
              <div className="text-[var(--text-primary)] font-medium">
                پایان: میلادی {formatGregorian(diffResult.e)} | شمسی {formatJalali(diffResult.e)}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Weekday & offset */}
      <Card className="p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm font-bold text-[var(--text-primary)]">روز هفته + جابجایی</div>
            <div className="text-xs text-[var(--text-muted)]">
              پیدا کردن نام روز و تاریخ بعد/قبل
            </div>
          </div>
          <CalendarToggle value={weekdayCal} onChange={setWeekdayCal} />
        </div>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Input
            label="تاریخ مبنا"
            value={weekdayInput}
            onChange={(e) => setWeekdayInput(e.target.value)}
            dir="ltr"
            placeholder={weekdayCal === 'jalali' ? '1403/01/01' : '2024/03/20'}
          />
          <Input
            label="جابجایی (روز)"
            value={offsetText}
            onChange={(e) => setOffsetText(e.target.value)}
            dir="ltr"
            placeholder="0"
          />
        </div>
        {weekdayState.error && (
          <div className="text-sm text-[var(--color-danger)]" role="alert" aria-live="assertive">
            {weekdayState.error}
          </div>
        )}
        {weekdayResult && (
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/60 p-4">
              <div className="text-xs text-[var(--text-muted)]">روز هفته</div>
              <div className="text-lg font-black text-[var(--text-primary)]">
                {getWeekdayName(weekdayResult.shifted)}
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/60 p-4">
              <div className="text-xs text-[var(--text-muted)]">تاریخ نهایی (میلادی)</div>
              <div className="text-lg font-black text-[var(--text-primary)]">
                {formatGregorian(weekdayResult.shifted)}
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/60 p-4">
              <div className="text-xs text-[var(--text-muted)]">تاریخ نهایی (شمسی)</div>
              <div className="text-lg font-black text-[var(--text-primary)]">
                {formatJalali(weekdayResult.shifted)}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
