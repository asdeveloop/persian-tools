# 🤝 راهنمای مشارکت در Persian Tools

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

### 📚 مستندات

- [PROJECT_STANDARDS.md](./PROJECT_STANDARDS.md) - استانداردهای طراحی
- [README.md](./README.md) - معرفی پروژه

---

شکریا برای مشارکتتان! 💜
