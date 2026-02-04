# 📚 مرجع API (خلاصه)

> آخرین به‌روزرسانی: 2026-02-03

این فایل خلاصه‌ای از API عمومی است. برای مستندات کامل می‌توانید از Typedoc استفاده کنید:

```bash
pnpm docs:api
```

خروجی Typedoc در مسیر `docs/api/` ساخته می‌شود.

---

## ماژول‌ها و خروجی‌ها

### Numbers

- `toEnglishDigits(input: string): string`
- `parseLooseNumber(input: string): number | null`
- `formatNumberFa(n: number): string`
- `formatMoneyFa(n: number): string`
- `numberToWordsFa(input: number): string`

### Localization (Persian)

- `toPersianNumbers(input: string | number): string`
- `formatPersianNumber(num: number): string`
- `formatPersianCurrency(amount: number, currency?: string): string`
- `rtlAttributes(): { dir: 'rtl'; 'aria-orientation': 'horizontal' }`
- `isPersianText(text: string): boolean`
- `formatPersianDate(date: Date | number): string`
- `fixPersianSpacing(text: string): string`
- `normalizePersianChars(text: string): string`
- `stripPersianDiacritics(text: string): string`
- `cleanPersianText(text: string): string`
- `slugifyPersian(text: string): string`

### Date Tools

- `convertDate(input: { date: { year: number; month: number; day: number }; from: 'jalali' | 'gregorian'; to: 'jalali' | 'gregorian' }): ToolResult<{ year: number; month: number; day: number }>`
- `formatPersianDate(date: Date | number): string`

### Finance

- `calculateTax(amount: number, ratePercent: number): { baseAmount: number; ratePercent: number; taxAmount: number; totalWithTax: number }`
- `calculateCompoundInterest(input: { principal: number; annualRatePercent: number; years: number; timesPerYear?: number }): { principal: number; total: number; interest: number; annualRatePercent: number; years: number; timesPerYear: number }`
- `convertRialToToman(amountRial: number): number`
- `convertTomanToRial(amountToman: number): number`

### Validation

- `normalizeIranianMobile(input: string): string | null`
- `isValidIranianMobile(input: string): boolean`
- `isValidNationalId(input: string): boolean`
- `isValidCardNumber(input: string): boolean`
- `isValidIranianSheba(input: string): boolean`
- `isValidIranianPostalCode(input: string): boolean`
- `isValidIranianPlate(input: string): boolean`

### Result

- `ok<T>(data: T): ToolResult<T>`
- `fail(message: string, code?: string, details?: unknown): ToolResult<never>`
- `fromError(error: unknown, fallbackMessage?: string, code?: string): ToolResult<never>`

---

## نکات پایداری API

- API عمومی از مسیر `shared/utils` صادر می‌شود.
- تغییرات ناسازگار باید با نسخه MAJOR منتشر شوند.
- در صورت نیاز به عملکرد سنگین، از lazy-load استفاده کنید.
