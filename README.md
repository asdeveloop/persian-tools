# 🛠️ جعبه ابزار فارسی (Persian Tools)

<div align="center">

![Persian Tools](https://img.shields.io/badge/پارسی-ابزارهای%20فارسی-blue?style=for-the-badge)
![License](https://img.shields.io/badge/لایسنس-MIT-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

[🚀 شروع سریع](#-شروع-سریع) • [🧩 استفاده](#-استفاده-به-عنوان-کتابخانه) • [📚 API](#-مرجع-api) • [🤝 مشارکت](#-مشارکت)

</div>

## 📖 معرفی پروژه

**Persian Tools** یک مجموعه کامل از ابزارهای آنلاین فارسی‌زبان برای PDF، محاسبات مالی، پردازش متن و تصویر است. همه پردازش‌ها در مرورگر انجام می‌شوند تا **حریم خصوصی** و **امنیت داده‌ها** حفظ شود.

برای استانداردهای طراحی و فنی پروژه، سند `PROJECT_STANDARDS.md` را مطالعه کنید.

---

## ✨ ویژگی‌ها

- 📄 **ابزارهای PDF**: ادغام، تقسیم، فشرده‌سازی، واترمارک، رمزگذاری، تبدیل
- 💰 **محاسبات مالی**: وام و حقوق
- 📅 **ابزارهای تاریخ**: تبدیل شمسی/میلادی، محاسبه سن، فاصله تاریخی
- 📝 **ابزارهای متنی**: تبدیل عدد به حروف، شمارش کلمات
- 🖼️ **ابزارهای تصویر**: فشرده‌سازی و پردازش در مرورگر

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

---

## 📚 مرجع API

ماژول‌های عمومی از مسیر `shared/utils` صادر می‌شوند. امضاها:

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
