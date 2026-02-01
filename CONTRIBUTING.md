# 🤝 راهنمای مشارکت در جعبه ابزار فارسی

از علاقه شما به مشارکت در پروژه جعبه ابزار فارسی بسیار خوشحالیم! این راهنما به شما کمک می‌کند تا فرآیند مشارکت را به درستی طی کنید.

---

## 📋 محتویات

- [🎯 اهداف پروژه](#-اهداف-پروژه)
- [📝 نحوه مشارکت](#-نحوه-مشارکت)
- [🛠️ راه‌اندازی محیط توسعه](#️-راهاندازی-محیط-توسعه)
- [📋 استانداردهای کدنویسی](#-استانداردهای-کدنویسی)
- [🧪 تست‌ها](#-تستها)
- [📤 ارسال Pull Request](#-ارسال-pull-request)
- [🐖 شیوه Commit](#-شیوه-commit)
- [💬 نحوه گزارش اشکال](#-نحوه-گزارش-اشکال)

---

## 🎯 اهداف پروژه

- ارائه ابزارهای آنلاین رایگان برای کاربران فارسی‌زبان
- حفظ حریم خصوصی کاربران (پردازش آفلاین)
- رابط کاربری ساده و کارآمد
- پشتیبانی کامل از زبان فارسی و RTL

---

## 📝 نحوه مشارکت

### ۱. 🍴 Fork کردن پروژه

1. به صفحه اصلی پروژه بروید
2. روی دکمه "Fork" کلیک کنید
3. پروژه را به حساب خود کپی کنید

### ۲. 🌿 Clone و تنظیم

```bash
# کلون کردن پروژه fork شده
git clone https://github.com/YOUR-USERNAME/persian-tools.git
cd persian-tools

# اضافه کردن upstream اصلی
git remote add upstream https://github.com/original-owner/persian-tools.git
```

### ۳. 🌿 ایجاد شاخه جدید

```bash
# همگام‌سازی با اصلی
git fetch upstream
git checkout main
git merge upstream/main

# ایجاد شاخه جدید برای ویژگی خود
git checkout -b feature/your-feature-name
```

---

## 🛠️ راه‌اندازی محیط توسعه

```bash
# نصب وابستگی‌ها
pnpm install

# اجرای سرور توسعه
pnpm dev

# اجرای تست‌ها
pnpm test

# بررسی نوع‌ها
pnpm typecheck

# فرمت‌بندی کد
pnpm format

# بررسی ESLint
pnpm lint
```

---

## 📋 استانداردهای کدنویسی

### 🎨 TypeScript

- همیشه از TypeScript با حالت strict استفاده کنید
- از نوع `any` اجتناب کنید، به جای آن از `unknown` استفاده کنید
- برای آبجکت‌های عمومی از `interface` و برای union ها از `type` استفاده کنید

```typescript
// ✅ خوب
interface User {
  id: string;
  name: string;
}

type Status = 'pending' | 'completed' | 'failed';

// ❌ بد
const user: any = {};
```

### 🏗️ ساختار کامپوننت‌ها

```typescript
// کامپوننت‌های React
export default function ComponentName({ 
  prop1, 
  prop2 
}: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState<Type>();
  
  // 2. Event handlers
  const handleClick = useCallback(() => {
    // logic
  }, []);
  
  // 3. Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // 4. Render
  return (
    <div className="component-wrapper">
      {/* JSX */}
    </div>
  );
}
```

### 🎯 نام‌گذاری

- **کامپوننت‌ها**: PascalCase (`UserProfile.tsx`)
- **توابع و متغیرها**: camelCase (`calculateLoan`)
- **ثابت‌ها**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **فایل‌ها**: kebab-case (`user-profile.tsx`)

### 🎨 استایل‌دهی

- از Tailwind CSS استفاده کنید
- از کلاس‌های utility به جای CSS سفارشی استفاده کنید
- برای تم‌ها از متغیرهای CSS استفاده کنید

```tsx
// ✅ خوب
<div className="p-4 bg-[var(--surface-1)] rounded-lg">
  <h2 className="text-xl font-bold text-[var(--text-primary)]">
    {title}
  </h2>
</div>

// ❌ بد
<div style={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
    {title}
  </h2>
</div>
```

---

## 🧪 تست‌ها

### نوشتن تست

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  it('should handle click events', async () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### اجرای تست‌ها

```bash
# اجرای همه تست‌ها
pnpm test

# اجرای تست‌ها با coverage
pnpm test:coverage

# اجرای تست‌ها در حالت watch
pnpm test --watch
```

---

## 📤 ارسال Pull Request

### قبل از ارسال

1. **تست‌ها را اجرا کنید**:
   ```bash
   pnpm test
   pnpm typecheck
   pnpm lint
   ```

2. **کد را فرمت کنید**:
   ```bash
   pnpm format
   ```

3. **تغییرات را commit کنید**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push کنید**:
   ```bash
   git push origin feature/your-feature-name
   ```

### قالب Pull Request

```markdown
## 📝 توضیح تغییرات

توضیح کوتاهی درباره آنچه تغییر کرده است.

## 🔄 نوع تغییر

- [ ] 🎉 ویژگی جدید (New feature)
- [ ] 🐛 رفع اشکال (Bug fix)
- [ ] 📝 مستندات (Documentation)
- [ ] 🎨 استایل (Style)
- [ ] ♻️ بازآرایی (Refactoring)
- [ ] ⚡ عملکرد (Performance)
- [ ] ✅ تست (Test)

## 🧪 تست

- [ ] تست‌های جدید اضافه شده است
- [ ] همه تست‌ها پاس می‌شوند

## 📸 اسکرین‌شات (در صورت نیاز)

اسکرین‌شات‌های قبل و بعد از تغییرات را اینجا قرار دهید.

## 🔗 لینک‌های مرتبط

- Issue مربوطه: #123
```

---

## 🐖 شیوه Commit

ما از [Conventional Commits](https://www.conventionalcommits.org/fa/v1.0.0/) استفاده می‌کنیم:

```bash
# ویژگی جدید
git commit -m "feat: add PDF compression tool"

# رفع اشکال
git commit -m "fix: resolve RTL layout issue in mobile view"

# مستندات
git commit -m "docs: update installation guide"

# استایل
git commit -m "style: fix button hover state"

# بازآرایی
git commit -m "refactor: extract PDF processing logic"

# عملکرد
git commit -m "perf: optimize image processing speed"

# تست
git commit -m "test: add unit tests for loan calculator"
```

---

## 💬 نحوه گزارش اشکال

### گزارش Bug

1. **جستجو کنید**: ابتدا بررسی کنید که آیا این اشکال قبلاً گزارش شده است
2. **ایجاد Issue جدید**: با استفاده از قالب Bug Report
3. **اطلاعات کامل**: شامل موارد زیر:
   - مرورگر و نسخه
   - سیستم‌عامل
   - مراحل reproduce
   - اسکرین‌شوت (در صورت امکان)
   - رفتار مورد انتظار در مقابل رفتار فعلی

### درخواست ویژگی

1. **جستجو کنید**: بررسی کنید که آیا این ویژگی قبلاً درخواست شده است
2. **ایجاد Issue جدید**: با استفاده از قالب Feature Request
3. **توضیح کامل**: شامل موارد زیر:
   - توضیح ویژگی مورد نظر
   - کاربرد و مزیت آن
   - مثال‌های استفاده

---

## 🎉 تشکر

از وقتی که برای بهبود این پروژه می‌گذارید، سپاسگزاریم! هر نوع مشارکتی، چه کوچک و چه بزرگ، برای ما ارزشمند است.

---

## 📞 تماس

اگر سوالی دارید، می‌توانید از طریق موارد زیر با ما در تماس باشید:

- 💬 [GitHub Discussions](https://github.com/your-username/persian-tools/discussions)
- 🐛 [GitHub Issues](https://github.com/your-username/persian-tools/issues)
- 📧 ایمیل: info@persian-tools.ir

---

<div align="center">

**با ❤️ ساخته شده برای جامعه فارسی‌زبان**

</div>
