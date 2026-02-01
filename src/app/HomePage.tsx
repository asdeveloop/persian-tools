import { Link } from 'react-router-dom';
import Button from '../shared/ui/Button';
import ToolCard from '../shared/ui/ToolCard';
import { IconCalculator, IconImage, IconMoney, IconPdf } from '../shared/ui/icons';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] text-[var(--text-inverted)]" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-hover)]/20 to-transparent"></div>
        <div className="relative px-6 py-16 md:px-12 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 id="hero-heading" className="text-4xl font-bold md:text-5xl lg:text-6xl">
              ابزارهای فارسی برای کار و زندگی
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[var(--text-inverted)]/80">
              ابزارهای PDF، محاسبات مالی و پردازش تصویر - همه در یک مکان، رایگان و آسان
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/pdf-tools">
                <Button
                  variant="tertiary"
                  size="lg"
                  className="bg-[var(--text-inverted)] text-[var(--color-primary)] hover:bg-[var(--bg-subtle)] font-semibold"
                >
                  شروع با ابزار PDF
                </Button>
              </Link>
              <Link to="/loan">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-[var(--text-inverted)] text-[var(--text-inverted)] hover:bg-[var(--text-inverted)]/10 font-semibold"
                >
                  محاسبه وام
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="space-y-6" aria-labelledby="tools-heading">
        <div className="text-center">
          <h2 id="tools-heading" className="text-3xl font-bold text-[var(--text-primary)]">ابزارهای کاربردی</h2>
          <p className="mt-2 text-lg text-[var(--text-muted)]">
            ابزارهای مورد نیاز خود را برای کار با فایل‌ها انتخاب کنید
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ToolCard
            to="/pdf-tools"
            title="ابزارهای PDF"
            description="مجموعه کامل ابزارهای PDF: تبدیل، فشرده‌سازی، ادغام، تقسیم، رمزگذاری و واترمارک"
            icon={<IconPdf className="h-8 w-8 text-[var(--color-danger)]" />}
            className="hover:border-[var(--color-danger)] hover:bg-[var(--color-danger)]/5 group"
          />
          <ToolCard
            to="/loan"
            title="محاسبه‌گر وام"
            description="محاسبه قسط ماهانه، سود کل و پرداخت کل وام‌های مختلف"
            icon={<IconCalculator className="h-8 w-8 text-[var(--color-info)]" />}
            className="hover:border-[var(--color-info)] hover:bg-[var(--color-info)]/5 group"
          />
          <ToolCard
            to="/salary"
            title="محاسبه‌گر حقوق"
            description="محاسبه حقوق خالص و بیمه از ورودی‌های حقوقی"
            icon={<IconMoney className="h-8 w-8 text-[var(--color-success)]" />}
            className="hover:border-[var(--color-success)] hover:bg-[var(--color-success)]/5 group"
          />
          <ToolCard
            to="/image-compress"
            title="فشرده‌سازی عکس"
            description="کاهش حجم عکس‌ها با سه سطح کیفیت پیشنهادی"
            icon={<IconImage className="h-8 w-8 text-purple-600" />}
            className="hover:border-purple-300 hover:bg-purple-50 group"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[var(--surface-1)] rounded-2xl p-8" aria-labelledby="features-heading">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-[var(--color-danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">امن و خصوصی</h3>
            <p className="text-sm text-[var(--text-muted)]">فایل‌ها فقط روی دستگاه شما پردازش می‌شوند و به هیچ‌جا ارسال نمی‌شوند</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">سریع و کارآمد</h3>
            <p className="text-sm text-[var(--text-muted)]">پردازش سریع فایل‌ها با بهترین الگوریتم‌های ممکن</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[var(--color-info)]/10 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-[var(--color-info)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">کاملاً رایگان</h3>
            <p className="text-sm text-[var(--text-muted)]">تمام ابزارها بدون هزینه و محدودیت استفاده در دسترس هستند</p>
          </div>
        </div>
      </section>
    </div>
  );
}
