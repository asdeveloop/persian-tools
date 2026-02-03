import ButtonLink from '@/shared/ui/ButtonLink';
import ToolCard from '@/shared/ui/ToolCard';
import {
  IconCalculator,
  IconCalendar,
  IconImage,
  IconMoney,
  IconPdf,
  IconShield,
  IconZap,
} from '@/shared/ui/icons';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section
        className="relative overflow-hidden section-surface p-6 md:p-10 lg:p-14"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgb(var(--color-primary-rgb)/0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgb(var(--color-success-rgb)/0.18),_transparent_60%)]"></div>
        <div className="absolute -left-24 top-24 h-56 w-56 rounded-full bg-[rgb(var(--color-primary-rgb)/0.14)] blur-3xl"></div>
        <div className="absolute -right-16 bottom-8 h-48 w-48 rounded-full bg-[rgb(var(--color-warning-rgb)/0.18)] blur-3xl"></div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface-1)]/75 px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
              پردازش کاملاً محلی
              <span className="h-2 w-2 rounded-full bg-[var(--color-info)]"></span>
              بدون ثبت‌نام
              <span className="h-2 w-2 rounded-full bg-[var(--color-warning)]"></span>
              کاملاً رایگان
            </div>

            <div className="space-y-4">
              <h1
                id="hero-heading"
                className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl"
              >
                ابزارهای فارسی که
                <span className="text-gradient block">کارها را سریع‌تر می‌کنند</span>
              </h1>
              <p className="text-lg text-[var(--text-secondary)] md:text-xl">
                مجموعه‌ای یکپارچه از ابزارهای PDF، محاسبات مالی و پردازش تصویر — امن، سریع و بدون
                وابستگی خارجی.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/pdf-tools" size="lg" className="px-6">
                شروع سریع با PDF
              </ButtonLink>
              <ButtonLink href="/image-tools" variant="secondary" size="lg" className="px-6">
                ابزارهای تصویر
              </ButtonLink>
              <ButtonLink href="/loan" variant="tertiary" size="lg" className="px-6">
                محاسبه‌گر وام
              </ButtonLink>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: '۲۱+', label: 'ابزار کاربردی' },
                { value: '۳ ثانیه', label: 'میانگین آماده‌سازی' },
                { value: '۱۰۰٪', label: 'پردازش محلی' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/75 px-4 py-4 text-center shadow-[var(--shadow-subtle)]"
                >
                  <div className="text-2xl font-black text-[var(--text-primary)]">{item.value}</div>
                  <div className="text-xs font-semibold text-[var(--text-muted)]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/85 p-6 shadow-[var(--shadow-strong)]">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
                <span>داشبورد ابزارها</span>
                <span>نسخه ۱.۰</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  {
                    title: 'ادغام PDF',
                    caption: 'فایل‌های PDF را با هم یکی کنید',
                    tone: 'bg-[rgb(var(--color-danger-rgb)/0.1)] text-[var(--color-danger)]',
                  },
                  {
                    title: 'فشرده‌سازی تصویر',
                    caption: 'کاهش حجم با حفظ کیفیت',
                    tone: 'bg-[rgb(var(--color-info-rgb)/0.12)] text-[var(--color-info)]',
                  },
                  {
                    title: 'محاسبه حقوق',
                    caption: 'خروجی خالص و جزئیات کسورات',
                    tone: 'bg-[rgb(var(--color-success-rgb)/0.14)] text-[var(--color-success)]',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/75 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">
                        {item.title}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{item.caption}</div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                      آماده
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--border-medium)] bg-[var(--bg-subtle)]/70 px-4 py-4 text-sm text-[var(--text-muted)]">
                ابزار جدید پیشنهاد دارید؟ به ما بگویید.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8" aria-labelledby="tools-heading">
        <div className="flex flex-col gap-3 text-center">
          <h2 id="tools-heading" className="text-3xl font-black text-[var(--text-primary)]">
            دسته‌بندی ابزارها
          </h2>
          <p className="text-lg text-[var(--text-muted)]">
            سریع‌ترین مسیر به ابزار موردنیاز شما، همه چیز مرتب و آماده است.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ToolCard
            href="/pdf-tools"
            title="ابزارهای PDF"
            meta="۷ ابزار"
            description="تبدیل، فشرده‌سازی، ادغام، تقسیم، رمزگذاری و واترمارک"
            icon={<IconPdf className="h-7 w-7 text-[var(--color-danger)]" />}
            iconWrapClassName="bg-[rgb(var(--color-danger-rgb)/0.1)]"
            className="hover:border-[var(--color-danger)] hover:bg-[rgb(var(--color-danger-rgb)/0.06)]"
          />
          <ToolCard
            href="/image-tools"
            title="ابزارهای تصویر"
            meta="۳ ابزار"
            description="فشرده‌سازی و بهینه‌سازی تصاویر با کنترل کیفیت و ابعاد"
            icon={<IconImage className="h-7 w-7 text-[var(--color-info)]" />}
            iconWrapClassName="bg-[rgb(var(--color-info-rgb)/0.12)]"
            className="hover:border-[var(--color-info)] hover:bg-[rgb(var(--color-info-rgb)/0.06)]"
          />
          <ToolCard
            href="/loan"
            title="محاسبه‌گر وام"
            meta="محبوب"
            description="محاسبه اقساط ماهانه، سود کل و برنامه بازپرداخت"
            icon={<IconCalculator className="h-7 w-7 text-[var(--color-primary)]" />}
            iconWrapClassName="bg-[rgb(var(--color-primary-rgb)/0.12)]"
            className="hover:border-[var(--color-primary)] hover:bg-[rgb(var(--color-primary-rgb)/0.06)]"
          />
          <ToolCard
            href="/salary"
            title="محاسبه‌گر حقوق"
            meta="جدید"
            description="حقوق خالص، بیمه و مالیات را سریع محاسبه کنید"
            icon={<IconMoney className="h-7 w-7 text-[var(--color-success)]" />}
            iconWrapClassName="bg-[rgb(var(--color-success-rgb)/0.12)]"
            className="hover:border-[var(--color-success)] hover:bg-[rgb(var(--color-success-rgb)/0.06)]"
          />
          <ToolCard
            href="/date-tools"
            title="ابزارهای تاریخ"
            meta="۴ ابزار"
            description="تبدیل شمسی/میلادی، محاسبه سن و اختلاف تاریخ"
            icon={<IconCalendar className="h-7 w-7 text-[var(--color-warning)]" />}
            iconWrapClassName="bg-[rgb(var(--color-warning-rgb)/0.14)]"
            className="hover:border-[var(--color-warning)] hover:bg-[rgb(var(--color-warning-rgb)/0.08)]"
          />
          <ToolCard
            href="/text-tools"
            title="ابزارهای متنی"
            meta="۳ ابزار"
            description="تبدیل تاریخ، عدد به حروف و شمارش کلمات"
            icon={<IconZap className="h-7 w-7 text-[var(--color-info)]" />}
            iconWrapClassName="bg-[rgb(var(--color-info-rgb)/0.14)]"
            className="hover:border-[var(--color-info)] hover:bg-[rgb(var(--color-info-rgb)/0.08)]"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="flow-heading">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/75 p-8 shadow-[var(--shadow-medium)]">
          <h3 id="flow-heading" className="text-2xl font-black text-[var(--text-primary)]">
            روند استفاده در سه قدم
          </h3>
          <div className="mt-6 space-y-5">
            {[
              {
                step: '۱',
                title: 'انتخاب ابزار',
                desc: 'ابزار مناسب را از دسته‌بندی‌ها انتخاب کنید.',
              },
              {
                step: '۲',
                title: 'بارگذاری فایل',
                desc: 'فایل را بدون نیاز به ثبت‌نام اضافه کنید.',
              },
              { step: '۳', title: 'دریافت خروجی', desc: 'خروجی آماده را همان‌جا دانلود کنید.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white font-bold">
                  {item.step}
                </div>
                <div>
                  <div className="text-base font-bold text-[var(--text-primary)]">{item.title}</div>
                  <div className="text-sm text-[var(--text-muted)]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-2)]/75 p-8 shadow-[var(--shadow-medium)]">
          <div className="flex items-center gap-3 text-[var(--text-primary)]">
            <IconShield className="h-6 w-6 text-[var(--color-success)]" />
            <h3 className="text-2xl font-black">حریم خصوصی واقعی</h3>
          </div>
          <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed">
            تمام پردازش‌ها در مرورگر شما انجام می‌شود. هیچ فایلی آپلود نمی‌شود و هیچ داده‌ای ذخیره
            نخواهد شد. این یعنی کنترل کامل در اختیار شماست.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            {[
              'بدون استفاده از API خارجی',
              'پشتیبانی کامل از RTL و فارسی',
              'سرعت بالا حتی در اینترنت ضعیف',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[var(--text-secondary)]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface p-10 text-center">
        <h3 className="text-3xl font-black text-[var(--text-primary)]">آماده‌ای شروع کنیم؟</h3>
        <p className="mt-3 text-base text-[var(--text-muted)]">
          از همین حالا اولین ابزار را امتحان کن و تجربه‌ای سریع و امن داشته باش.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/pdf-tools" size="lg" className="px-8">
            شروع با PDF
          </ButtonLink>
          <ButtonLink href="/image-tools" variant="secondary" size="lg" className="px-8">
            ابزارهای تصویر
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
