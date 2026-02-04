import Link from 'next/link';
import ButtonLink from '@/shared/ui/ButtonLink';
import ToolCard from '@/shared/ui/ToolCard';
import PopularTools from '@/components/home/PopularTools';
import TrustStats from '@/components/home/TrustStats';
import { siteUrl } from '@/lib/seo';
import { getCategories, getToolsByCategory } from '@/lib/tools-registry';
import {
  IconCalculator,
  IconCalendar,
  IconChevronDown,
  IconImage,
  IconMoney,
  IconPdf,
  IconShield,
  IconZap,
} from '@/shared/ui/icons';

export default function HomePage() {
  const categories = getCategories();
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'جعبه ابزار فارسی - صفحه اصلی',
        description: 'ابزارهای PDF، محاسبات مالی و پردازش تصویر - همه در یک مکان، رایگان و آسان',
        url: siteUrl,
        inLanguage: 'fa-IR',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'صفحه اصلی',
            item: siteUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'دسته‌بندی ابزارها',
        itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: categories.map((category, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: category.name,
          url: new URL(category.path, siteUrl).toString(),
          item: {
            '@type': 'ItemList',
            name: category.name,
            itemListOrder: 'https://schema.org/ItemListUnordered',
            itemListElement: getToolsByCategory(category.id).map((tool, toolIndex) => ({
              '@type': 'ListItem',
              position: toolIndex + 1,
              name: tool.title.replace(' - جعبه ابزار فارسی', ''),
              url: new URL(tool.path, siteUrl).toString(),
            })),
          },
        })),
      },
    ],
  };
  const quickTasks = [
    {
      title: 'ادغام PDF',
      description: 'چند فایل را در یک خروجی منسجم ترکیب کنید.',
      href: '/pdf-tools/merge/merge-pdf',
      icon: <IconPdf className="h-5 w-5 text-[var(--color-danger)]" />,
      tone: 'bg-[rgb(var(--color-danger-rgb)/0.12)]',
    },
    {
      title: 'فشرده‌سازی تصویر',
      description: 'حجم کمتر با کیفیت قابل کنترل.',
      href: '/image-tools',
      icon: <IconImage className="h-5 w-5 text-[var(--color-info)]" />,
      tone: 'bg-[rgb(var(--color-info-rgb)/0.12)]',
    },
    {
      title: 'محاسبه اقساط وام',
      description: 'اقساط ماهانه و سود کل را ببینید.',
      href: '/loan',
      icon: <IconCalculator className="h-5 w-5 text-[var(--color-primary)]" />,
      tone: 'bg-[rgb(var(--color-primary-rgb)/0.12)]',
    },
    {
      title: 'اعتبارسنجی سریع',
      description: 'کد ملی، موبایل و کارت بانکی را بررسی کنید.',
      href: '/validation-tools',
      icon: <IconShield className="h-5 w-5 text-[var(--color-success)]" />,
      tone: 'bg-[rgb(var(--color-success-rgb)/0.12)]',
    },
  ];

  const quickSearches = [
    { label: 'ادغام PDF', query: 'ادغام', category: 'pdf' },
    { label: 'فشرده‌سازی', query: 'فشرده', category: 'pdf' },
    { label: 'تبدیل تصویر', query: 'تبدیل', category: 'image' },
  ];

  return (
    <div className="space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <section
        className="relative overflow-hidden section-surface p-6 md:p-10 lg:p-14"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgb(var(--color-primary-rgb)/0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgb(var(--color-success-rgb)/0.18),_transparent_60%)]"></div>
        <div className="absolute -left-24 top-24 h-48 w-48 rounded-full bg-[rgb(var(--color-primary-rgb)/0.14)] blur-3xl"></div>
        <div className="absolute -right-16 bottom-8 h-40 w-40 rounded-full bg-[rgb(var(--color-warning-rgb)/0.18)] blur-3xl"></div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-7">
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
                PDF، تصویر و محاسبات روزمره را سریع و امن انجام دهید. همه چیز در مرورگر شماست.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/pdf-tools" size="lg" className="px-6">
                شروع سریع با PDF
              </ButtonLink>
              <ButtonLink href="/image-tools" variant="tertiary" size="lg" className="px-6">
                ابزارهای تصویر
              </ButtonLink>
              <ButtonLink href="/tools" variant="tertiary" size="lg" className="px-6">
                همه ابزارها
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
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/80 p-6 shadow-[var(--shadow-strong)]">
            <div className="text-xs font-semibold text-[var(--text-muted)]">چرا Persian Tools</div>
            <div className="mt-5 grid gap-4">
              {[
                {
                  title: 'حریم خصوصی کامل',
                  desc: 'هیچ فایلی آپلود نمی‌شود.',
                  icon: <IconShield className="h-5 w-5 text-[var(--color-success)]" />,
                },
                {
                  title: 'بدون نصب و ثبت‌نام',
                  desc: 'همه چیز در مرورگر آماده است.',
                  icon: <IconZap className="h-5 w-5 text-[var(--color-info)]" />,
                },
                {
                  title: 'مسیرهای سریع',
                  desc: 'کارهای پرتکرار در چند کلیک.',
                  icon: <IconPdf className="h-5 w-5 text-[var(--color-danger)]" />,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)]/70 px-4 py-3"
                >
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">{item.title}</div>
                    <div className="text-xs text-[var(--text-muted)]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PopularTools
        title="ابزارهای محبوب"
        subtitle="نمایش پویا بر اساس استفاده اخیر"
        limit={6}
        gridClassName="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      />

      <section
        className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
        aria-labelledby="quick-start-heading"
      >
        <div className="relative overflow-hidden section-surface p-8">
          <div className="absolute -left-20 top-10 h-44 w-44 rounded-full bg-[rgb(var(--color-primary-rgb)/0.08)] blur-3xl"></div>
          <div className="absolute -right-16 bottom-8 h-40 w-40 rounded-full bg-[rgb(var(--color-success-rgb)/0.1)] blur-3xl"></div>

          <div className="relative z-10">
            <h2 id="quick-start-heading" className="text-2xl font-black text-[var(--text-primary)]">
              مسیرهای سریع
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              مسیرهای آماده برای کارهای روزمره، بدون دردسر.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {quickTasks.map((task) => (
                <Link
                  key={task.title}
                  href={task.href}
                  className="group rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/85 p-4 transition-all duration-[var(--motion-fast)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-strong)]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${task.tone}`}
                    >
                      {task.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">
                        {task.title}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{task.description}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs font-semibold text-[var(--color-primary)]">شروع</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden section-surface p-8">
          <div className="absolute -right-12 top-6 h-32 w-32 rounded-full bg-[rgb(var(--color-warning-rgb)/0.15)] blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            <div>
              <h3 className="text-2xl font-black text-[var(--text-primary)]">جست‌وجوی ابزار</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                نام ابزار یا نیازتان را بنویسید و مستقیم نتیجه بگیرید.
              </p>
            </div>

            <form action="/tools" method="get" className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-2">
                  <label htmlFor="home-tool-query" className="text-xs font-semibold">
                    جست‌وجو
                  </label>
                  <input
                    id="home-tool-query"
                    name="query"
                    type="search"
                    placeholder="مثلاً ادغام PDF"
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="home-tool-category" className="text-xs font-semibold">
                    دسته‌بندی
                  </label>
                  <div className="relative">
                    <select
                      id="home-tool-category"
                      name="category"
                      defaultValue="all"
                      className="input-field appearance-none pr-10"
                    >
                      <option value="all">همه ابزارها</option>
                      <option value="pdf">PDF</option>
                      <option value="image">تصویر</option>
                      <option value="date">تاریخ</option>
                      <option value="text">متن</option>
                      <option value="validation">اعتبارسنجی</option>
                      <option value="finance">محاسبات مالی</option>
                    </select>
                    <IconChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-lg btn-primary w-full md:w-auto">
                نمایش نتایج
              </button>
            </form>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-[var(--text-muted)]">
                جست‌وجوهای پیشنهادی
              </div>
              <div className="flex flex-wrap gap-2">
                {quickSearches.map((item) => (
                  <Link
                    key={item.label}
                    href={`/tools?query=${encodeURIComponent(item.query)}&category=${item.category}`}
                    className="rounded-full border border-[var(--border-light)] bg-[var(--surface-1)]/80 px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-[var(--motion-fast)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6" aria-labelledby="features-heading">
        <div className="text-center space-y-2">
          <h2 id="features-heading" className="text-3xl font-black text-[var(--text-primary)]">
            قابلیت‌های کلیدی
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            ساده، سریع و دقیق — تمرکز روی مهم‌ترین نیازها
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: 'مدیریت PDF',
              desc: 'ادغام، تقسیم، حذف صفحات و فشرده‌سازی در چند ثانیه.',
              icon: <IconPdf className="h-6 w-6 text-[var(--color-danger)]" />,
              tone: 'bg-[rgb(var(--color-danger-rgb)/0.12)]',
            },
            {
              title: 'تبدیل و بهینه‌سازی تصویر',
              desc: 'کاهش حجم و تبدیل سریع به فرمت‌های رایج.',
              icon: <IconImage className="h-6 w-6 text-[var(--color-info)]" />,
              tone: 'bg-[rgb(var(--color-info-rgb)/0.12)]',
            },
            {
              title: 'محاسبات مالی',
              desc: 'اقساط وام، حقوق خالص و برنامه پرداخت.',
              icon: <IconMoney className="h-6 w-6 text-[var(--color-success)]" />,
              tone: 'bg-[rgb(var(--color-success-rgb)/0.12)]',
            },
            {
              title: 'تبدیل تاریخ',
              desc: 'شمسی، میلادی و قمری را بدون خطا تبدیل کنید.',
              icon: <IconCalendar className="h-6 w-6 text-[var(--color-warning)]" />,
              tone: 'bg-[rgb(var(--color-warning-rgb)/0.12)]',
            },
            {
              title: 'ابزارهای متنی',
              desc: 'تبدیل عدد به حروف و شمارش کلمات.',
              icon: <IconZap className="h-6 w-6 text-[var(--color-info)]" />,
              tone: 'bg-[rgb(var(--color-info-rgb)/0.12)]',
            },
            {
              title: 'اعتبارسنجی داده‌ها',
              desc: 'کد ملی، کارت بانکی و شبا را بررسی کنید.',
              icon: <IconShield className="h-6 w-6 text-[var(--color-success)]" />,
              tone: 'bg-[rgb(var(--color-success-rgb)/0.12)]',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/80 p-5 transition-all duration-[var(--motion-fast)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-strong)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${item.tone}`}
                >
                  {item.icon}
                </div>
                <div className="text-base font-bold text-[var(--text-primary)]">{item.title}</div>
              </div>
              <p className="mt-3 text-sm text-[var(--text-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustStats />

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
          <ToolCard
            href="/validation-tools"
            title="اعتبارسنجی داده‌ها"
            meta="۶ ابزار"
            description="کد ملی، موبایل، کارت بانکی، شبا، کدپستی و پلاک"
            icon={<IconShield className="h-7 w-7 text-[var(--color-success)]" />}
            iconWrapClassName="bg-[rgb(var(--color-success-rgb)/0.12)]"
            className="hover:border-[var(--color-success)] hover:bg-[rgb(var(--color-success-rgb)/0.06)]"
          />
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
          <ButtonLink href="/image-tools" variant="tertiary" size="lg" className="px-8">
            ابزارهای تصویر
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
