# 🛠️ جعبه ابزار فارسی (Persian Tools)

> آخرین به‌روزرسانی: 2026-02-04

<div align="center">

![Persian Tools](https://img.shields.io/badge/پارسی-ابزارهای%20فارسی-blue?style=for-the-badge)
![License](https://img.shields.io/badge/لایسنس-MIT-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

[🚀 شروع سریع](#-شروع-سریع) • [🧩 استفاده](#-استفاده-به-عنوان-کتابخانه) • [📚 API](#-مرجع-api) • [🤝 مشارکت](#-مشارکت)

</div>

## 📖 معرفی پروژه

**Persian Tools** یک مجموعه کامل از ابزارهای آنلاین فارسی‌زبان برای PDF، محاسبات مالی، پردازش متن و تصویر است. همه پردازش‌ها در مرورگر انجام می‌شوند تا **حریم خصوصی** و **امنیت داده‌ها** حفظ شود.

برای استانداردهای طراحی و فنی پروژه، سند `docs/project-standards.md` را مطالعه کنید.

### خلاصه استانداردها

- بدون وابستگی خارجی در runtime
- UI فارسی، RTL و فونت داخلی
- TypeScript strict + تست برای قابلیت‌های اصلی
- رعایت دسترسی‌پذیری پایه (WCAG AA حداقلی)

---

## ✨ ویژگی‌ها

- 📄 **ابزارهای PDF**: ادغام، تقسیم، فشرده‌سازی، واترمارک، رمزگذاری، تبدیل
- 💰 **محاسبات مالی**: وام و حقوق
- 📅 **ابزارهای تاریخ**: تبدیل شمسی/میلادی، محاسبه سن، فاصله تاریخی
- 📝 **ابزارهای متنی**: تبدیل عدد به حروف، شمارش کلمات
- 🖼️ **ابزارهای تصویر**: فشرده‌سازی و پردازش در مرورگر

---

## 🧭 نقشه ویژگی‌ها

| دسته  | قابلیت‌ها                                                 | وضعیت |
| ----- | --------------------------------------------------------- | ----- |
| PDF   | ادغام، تقسیم، فشرده‌سازی، واترمارک، رمزگذاری، استخراج متن | کامل  |
| تصویر | فشرده‌سازی، تغییر اندازه، خروجی فرمت‌های رایج             | کامل  |
| تاریخ | تبدیل شمسی/میلادی، سن، اختلاف تاریخ، تعطیلات ثابت         | کامل  |
| متن   | تبدیل عدد به حروف، شمارش کلمات، نرمال‌سازی فارسی          | کامل  |
| مالی  | وام، حقوق، مالیات ساده، سود مرکب، تبدیل ریال/تومان        | کامل  |

---

## 🔒 حریم خصوصی و پردازش محلی

- تمام پردازش‌ها **در مرورگر** انجام می‌شوند و فایل‌ها از دستگاه خارج نمی‌شوند.
- هیچ سرویس خارجی برای عملکرد اصلی استفاده نمی‌شود.
- تحلیل‌گر فقط در صورت فعال‌سازی **self-host** اجرا می‌شود (`NEXT_PUBLIC_ANALYTICS_ID`).

---

## ⚠️ محدودیت‌ها

- OCR و تشخیص متن از تصویر در حال حاضر **پشتیبانی نمی‌شود**.
- فایل‌های بسیار بزرگ ممکن است به حافظه بیشتری نیاز داشته باشند.
- تعطیلات به صورت **داده‌های ثابت شمسی** ارائه می‌شوند (رویدادهای قمری در این نسخه لحاظ نشده‌اند).

---

## 🚀 شروع سریع

```bash
# نصب وابستگی‌ها
pnpm install

# اجرای محیط توسعه
pnpm dev

# ساخت نسخه تولیدی
pnpm build
```

---

## 🧭 نقشه‌راه توسعه

نقشه‌راه استاندارد و اجرایی پروژه در فایل `docs/roadmap.md` قرار دارد. خلاصه فازها:

- فاز 1: تثبیت کیفیت و زیرساخت
- فاز 2: تکمیل ابزارها و بهبود تجربه کاربری
- فاز 3: تثبیت کتابخانه و API داخلی
- فاز 4: پایداری عملیاتی و PWA
- فاز 5: مستندات و رشد مشارکت

---

## 💰 درآمدزایی و پایداری

- استراتژی درآمدزایی و اصول حریم خصوصی در `docs/monetization-strategy.md`
- نسخه کوتاه و اجرایی در `docs/monetization-roadmap.md`
- برنامه اجرایی مرحله‌ای در `docs/monetization-task-plan.md`

---

## 📴 استفاده آفلاین / PWA

- این پروژه از Service Worker برای حالت آفلاین استفاده می‌کند.
- برای نصب روی موبایل یا دسکتاپ، گزینه **Add to Home Screen** را در مرورگر انتخاب کنید.
- فایل `public/sw.js` و `app/manifest.ts` مسیرهای اصلی PWA هستند.

---

## 🔍 SEO و OG Assets

- صفحات موضوعی و Pillar در مسیر `/topics` قرار دارند.
- تصاویر OpenGraph ابزارهای مهم به‌صورت خودکار تولید می‌شوند:

```bash
pnpm generate:og
```

- در `pnpm build`، تولید OG به‌صورت خودکار اجرا می‌شود.

---

## 🧩 استفاده به عنوان کتابخانه

این پروژه علاوه بر اپلیکیشن، یک **کتابخانه TypeScript** برای ابزارهای عددی و فارسی‌سازی ارائه می‌دهد.

### نصب

```bash
pnpm add persian-tools
```

### مثال (Node.js)

```ts
import { parseLooseNumber, numberToWordsFa } from 'persian-tools';

const parsed = parseLooseNumber('۱۲٬۳۴۵٫۶۷');
const words = numberToWordsFa(parsed ?? 0);

console.log(parsed); // 12345.67
console.log(words); // دوازده هزار و سیصد و چهل و پنج ممیز شش هفت
```

### مثال (Browser - ESM)

```ts
import { toPersianNumbers, formatPersianDate } from 'persian-tools';

console.log(toPersianNumbers('Invoice 2024')); // Invoice ۲۰۲۴
console.log(formatPersianDate(new Date()));
```

### مثال (تاریخ و نرمال‌سازی متن)

```ts
import { convertDate, cleanPersianText } from 'persian-tools';

const result = convertDate({
  from: 'jalali',
  to: 'gregorian',
  date: { year: 1403, month: 1, day: 1 },
});

if (result.ok) {
  console.log(result.data);
}

console.log(cleanPersianText('  كتابها  ')); // کتاب‌ها
```

### مثال (مالی)

```ts
import { calculateCompoundInterest, convertTomanToRial } from 'persian-tools';

const r = calculateCompoundInterest({
  principal: 1_000_000,
  annualRatePercent: 18,
  years: 2,
  timesPerYear: 12,
});

console.log(r.total);
console.log(convertTomanToRial(150_000));
```

---

## 📚 مرجع API

ماژول‌های عمومی از مسیر `shared/utils` صادر می‌شوند. خلاصه مستندات در `docs/api.md` و خروجی کامل Typedoc در `docs/api/` قرار دارد. امضاها:

```ts
// numbers
export function toEnglishDigits(input: string): string;
export function parseLooseNumber(input: string): number | null;
export function formatNumberFa(n: number): string;
export function formatMoneyFa(n: number): string;
export function numberToWordsFa(input: number): string;

// localization (Persian)
export function toPersianNumbers(input: string | number): string;
export function formatPersianNumber(num: number): string;
export function formatPersianCurrency(amount: number, currency?: string): string;
export function rtlAttributes(): { dir: 'rtl'; 'aria-orientation': 'horizontal' };
export function isPersianText(text: string): boolean;
export function formatPersianDate(date: Date | number): string;
export function fixPersianSpacing(text: string): string;
export function normalizePersianChars(text: string): string;
export function stripPersianDiacritics(text: string): string;
export function cleanPersianText(text: string): string;
export function convertDate(input: {
  date: { year: number; month: number; day: number };
  from: 'jalali' | 'gregorian';
  to: 'jalali' | 'gregorian';
}):
  | { ok: true; data: { year: number; month: number; day: number } }
  | { ok: false; error: { code: string; message: string } };
export type ToolResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; details?: unknown } };

// finance
export function calculateTax(
  amount: number,
  ratePercent: number,
): {
  baseAmount: number;
  ratePercent: number;
  taxAmount: number;
  totalWithTax: number;
};
export function calculateCompoundInterest(input: {
  principal: number;
  annualRatePercent: number;
  years: number;
  timesPerYear?: number;
}): {
  principal: number;
  total: number;
  interest: number;
  annualRatePercent: number;
  years: number;
  timesPerYear: number;
};
export function convertRialToToman(amountRial: number): number;
export function convertTomanToRial(amountToman: number): number;
```

### مستندات خودکار

```bash
pnpm docs:api
```

خروجی در مسیر `docs/api` تولید می‌شود.

---

## 🧪 تست‌ها و کیفیت

```bash
pnpm lint
pnpm typecheck
pnpm test:ci
```

---

## 🧠 معماری پروژه

- `app/` مسیرهای اپلیکیشن (Next.js App Router)
- `features/` منطق و UI ابزارها
- `shared/` ماژول‌های عمومی (utilities، UI، خطاها)
- `examples/` نمونه‌های کاربردی

---

## 🤝 مشارکت

لطفاً [CONTRIBUTING.md](CONTRIBUTING.md) را مطالعه کنید.

---

## 📄 لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده است.
