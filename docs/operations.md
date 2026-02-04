# راهنمای عملیاتی (Self-hosted)

> آخرین به‌روزرسانی: 2026-02-04

این سند برای اجرای عملیاتی و نگهداری Persian Tools در محیط‌های self-host است.

## پیش‌نیازها

- Node.js 20+
- pnpm 9+
- PostgreSQL 14+ (برای اشتراک و تاریخچه)
- Prisma CLI (از طریق `pnpm`)

## اجرا

```bash
pnpm install
pnpm build
pnpm start
```

## پایگاه داده (اشتراک و تاریخچه)

- مقداردهی اولیه دیتابیس:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

- متغیر محیطی `DATABASE_URL` باید در محیط اجرا تنظیم شود.
  - مثال: `postgresql://user:password@localhost:5432/persian_tools?schema=public`

- Seed اختیاری (در صورت نیاز به کاربر اولیه):

```bash
pnpm prisma:seed
```

- برای seed متغیرهای `SEED_ADMIN_EMAIL` و `SEED_ADMIN_PASSWORD` را تنظیم کنید.

### ریست Seed

برای حذف کاربران seed:

```bash
pnpm prisma:seed:reset
```

## Prisma Studio

برای بررسی دیتابیس به‌صورت بصری:

```bash
pnpm prisma:studio
```

## داشبورد استفاده

- مسیر: `/dashboard`
- داده‌ها فقط محلی و روی همان دستگاه ذخیره می‌شوند.
- برای ریست آمار از دکمه «پاک‌سازی داده‌ها» استفاده کنید.

## PWA و آفلاین

- Service Worker در `/sw.js` ثبت می‌شود.
- صفحه آفلاین در مسیر `/offline` در دسترس است.
- برای تست آفلاین: صفحه را یکبار آنلاین باز کنید، سپس حالت Offline مرورگر را فعال کنید.

## نکات نگهداری

- هر بروزرسانی نسخه PWA بهتر است با افزایش `CACHE_VERSION` در `public/sw.js` انجام شود.
- تغییرات مسیرهای کلیدی را در تست‌های E2E پوشش دهید.
- در صورت نیاز به پاک‌سازی کامل کش در کلاینت، پیام `CLEAR_CACHES` به Service Worker ارسال کنید.
