# 🤝 راهنمای مشارکت در Persian Tools

> آخرین به‌روزرسانی: 2026-02-03

## سلام! 👋

اگر می‌خواهید در این پروژه مشارکت کنید، از شما متشکریم! لطفاً این راهنما را بخوانید.

### 📋 پیش‌نیازها

- Node.js 20+ و pnpm 9+
- Git
- VS Code (توصیه شده)
- Essential extensions:
  - ESLint
  - Prettier
  - TypeScript

### 🚀 شروع سریع

```bash
# 1. Fork کنید
# 2. Clone کنید
git clone https://github.com/YOUR_USERNAME/persian-tools.git
cd persian-tools

# 3. نصب وابستگی‌ها
pnpm install

# 4. Husky setup
pnpm prepare

# 5. اجرا در development
pnpm dev
```

### 📝 Commit Convention

ما از **Conventional Commits** استفاده می‌کنیم:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- feat: ویژگی جدید
- fix: رفع اشکال
- docs: مستندات
- style: قالب (spaces, semicolons, etc.)
- refactor: بازنویسی بدون تغییر عملکرد
- perf: بهبود عملکرد
- test: تست‌های جدید
- chore: تغییرات ابزاری

**مثال:**

```
feat(pdf-tools): add watermark functionality

- Implement watermark overlay
- Support custom text and opacity
- Add position customization

Closes #123
```

### 🧪 تست‌نویسی

قبل از ارسال PR:

```bash
# Run lint + typecheck + format
pnpm check

# Run specific test
pnpm test -- utils.test.ts

# Run with coverage (CI mode)
pnpm test:ci

# E2E tests
pnpm test:e2e
```

**Coverage requirement:** 100% برای ماژول‌های هسته (shared/utils و منطق‌های اصلی)

#### ✅ راهنمای تست Workerها (PDF/Image)

- برای Workerها از mock استفاده کنید (نمونه: mock کلاس `Worker` در Vitest).
- پیام‌های `progress/result/error` را شبیه‌سازی و سناریوهای موفق/ناموفق را تست کنید.
- فایل‌های نمونه باید بسیار کوچک باشند تا CI سریع بماند.

#### ✅ استاندارد داده تست

- از فایل‌های کوچک (حداکثر چند KB) استفاده شود.
- نام فایل‌ها واضح و هدفمند باشد (مثال: `sample-1page.pdf`).
- فایل‌ها حاوی داده حساس نباشند.

### 📦 نامگذاری فایل‌ها

- Components: PascalCase - Button.tsx
- Utils: camelCase - formatCurrency.ts
- Types: PascalCase - User.ts
- Tests: [name].test.ts یا [name].spec.ts

### 🎨 Code Style

```bash
# Automatic formatting
pnpm format

# Check formatting
pnpm format:check

# ESLint
pnpm lint:fix
```

### 📚 مستندات و API

```bash
# Generate API docs
pnpm docs:api
```

اسناد پروژه در مسیر `docs/` نگهداری می‌شوند. قبل از ارسال PR، این موارد را بررسی کنید:

- `docs/README.md` — فهرست مستندات
- `docs/api.md` — خلاصه API عمومی
- `docs/api/` — خروجی Typedoc (در صورت اجرای `pnpm docs:api`)

### 🚀 انتشار

انتشار به صورت خودکار با **semantic-release** انجام می‌شود. لطفاً از **Conventional Commits** استفاده کنید تا نسخه‌گذاری و CHANGELOG به‌درستی تولید شوند.

### ✅ Checklist قبل از PR

- [ ] TypeScript بدون خطا می‌شود
- [ ] ESLint پاس می‌شود
- [ ] Prettier پاس می‌شود
- [ ] تست‌ها موفق هستند
- [ ] Coverage کم نشده است
- [ ] Documentation به‌روز شده است
- [ ] RTL و فارسی درست کار می‌کند

### ✅ تعریف Done (DoD)

- [ ] هیچ وابستگی خارجی در runtime اضافه نشده باشد
- [ ] RTL/فونت فارسی در تمام مسیرها بررسی شده باشد
- [ ] تست‌های واحد و E2E مرتبط به‌روزرسانی شده باشند
- [ ] اگر Worker جدید اضافه شد، تست mock‌شده آن وجود داشته باشد
- [ ] مستندات README/CHANGELOG به‌روز باشند

### 🐞 الگوی گزارش باگ (PDF/Image)

```
عنوان:
نسخه:
مرورگر/سیستم‌عامل:
ابزار (PDF/Image):
گام‌های بازتولید:
انتظار:
نتیجه واقعی:
فایل نمونه (در صورت امکان):
```

### 📚 مستندات

- [docs/project-standards.md](./docs/project-standards.md) - استانداردهای طراحی
- [docs/README.md](./docs/README.md) - راهنمای مستندات
- [docs/api.md](./docs/api.md) - خلاصه API عمومی
- [README.md](./README.md) - معرفی پروژه

---

شکریا برای مشارکتتان! 💜
