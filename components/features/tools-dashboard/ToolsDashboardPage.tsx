'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import ToolCard from '@/shared/ui/ToolCard';
import { EmptyState } from '@/components/ui';
import {
  IconPdf,
  IconImage,
  IconCalendar,
  IconZap,
  IconShield,
  IconCalculator,
  IconMoney,
} from '@/shared/ui/icons';

type ToolCategory = 'all' | 'pdf' | 'image' | 'date' | 'text' | 'validation' | 'finance';

type ToolItem = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: ToolCategory;
  meta?: string;
  icon: ReactNode;
  iconWrapClassName?: string;
};

const tools: ToolItem[] = [
  {
    id: 'pdf',
    title: 'ابزارهای PDF',
    description: 'تبدیل، فشرده‌سازی، ادغام، استخراج و ویرایش صفحات',
    path: '/pdf-tools',
    category: 'pdf',
    meta: '۱۲ ابزار',
    icon: <IconPdf className="h-7 w-7 text-[var(--color-danger)]" />,
    iconWrapClassName: 'bg-[rgb(var(--color-danger-rgb)/0.12)]',
  },
  {
    id: 'image',
    title: 'ابزارهای تصویر',
    description: 'فشرده‌سازی و تبدیل تصاویر با کنترل کیفیت',
    path: '/image-tools',
    category: 'image',
    meta: '۳ ابزار',
    icon: <IconImage className="h-7 w-7 text-[var(--color-info)]" />,
    iconWrapClassName: 'bg-[rgb(var(--color-info-rgb)/0.12)]',
  },
  {
    id: 'date',
    title: 'ابزارهای تاریخ',
    description: 'تبدیل شمسی/میلادی/قمری، سن و اختلاف تاریخ',
    path: '/date-tools',
    category: 'date',
    meta: '۵ ابزار',
    icon: <IconCalendar className="h-7 w-7 text-[var(--color-warning)]" />,
    iconWrapClassName: 'bg-[rgb(var(--color-warning-rgb)/0.14)]',
  },
  {
    id: 'text',
    title: 'ابزارهای متنی',
    description: 'عدد به حروف، شمارش کلمات، نرمال‌سازی و اسلاگ',
    path: '/text-tools',
    category: 'text',
    meta: '۴ ابزار',
    icon: <IconZap className="h-7 w-7 text-[var(--color-info)]" />,
    iconWrapClassName: 'bg-[rgb(var(--color-info-rgb)/0.14)]',
  },
  {
    id: 'validation',
    title: 'اعتبارسنجی داده‌ها',
    description: 'کد ملی، موبایل، کارت بانکی، شبا، کدپستی و پلاک',
    path: '/validation-tools',
    category: 'validation',
    meta: '۶ ابزار',
    icon: <IconShield className="h-7 w-7 text-[var(--color-success)]" />,
    iconWrapClassName: 'bg-[rgb(var(--color-success-rgb)/0.12)]',
  },
  {
    id: 'loan',
    title: 'محاسبه‌گر وام',
    description: 'محاسبه اقساط ماهانه، سود کل و برنامه بازپرداخت',
    path: '/loan',
    category: 'finance',
    meta: 'پرکاربرد',
    icon: <IconCalculator className="h-7 w-7 text-[var(--color-primary)]" />,
    iconWrapClassName: 'bg-[rgb(var(--color-primary-rgb)/0.12)]',
  },
  {
    id: 'salary',
    title: 'محاسبه‌گر حقوق',
    description: 'حقوق خالص، بیمه و مالیات را سریع محاسبه کنید',
    path: '/salary',
    category: 'finance',
    meta: 'جدید',
    icon: <IconMoney className="h-7 w-7 text-[var(--color-success)]" />,
    iconWrapClassName: 'bg-[rgb(var(--color-success-rgb)/0.12)]',
  },
];

const categories: Array<{ id: ToolCategory; label: string }> = [
  { id: 'all', label: 'همه ابزارها' },
  { id: 'pdf', label: 'PDF' },
  { id: 'image', label: 'تصویر' },
  { id: 'date', label: 'تاریخ' },
  { id: 'text', label: 'متن' },
  { id: 'validation', label: 'اعتبارسنجی' },
  { id: 'finance', label: 'محاسبات مالی' },
];

const flows = [
  {
    title: 'PDF → استخراج صفحات',
    description: 'صفحات دلخواه را جدا کنید و خروجی آماده بگیرید.',
    path: '/pdf-tools/extract/extract-pages',
  },
  {
    title: 'PDF → چرخش صفحات',
    description: 'چرخاندن صفحات انتخابی برای خوانایی بهتر.',
    path: '/pdf-tools/edit/rotate-pages',
  },
  {
    title: 'متن → نرمال‌سازی → اسلاگ',
    description: 'اصلاح نگارشی و تولید اسلاگ سازگار با URL.',
    path: '/text-tools',
  },
  {
    title: 'اعتبارسنجی فرم',
    description: 'کد ملی، موبایل و کارت بانکی را یکجا بررسی کنید.',
    path: '/validation-tools',
  },
];

export default function ToolsDashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = useMemo(() => {
    const term = searchTerm.trim();
    return tools.filter((tool) => {
      const inCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      if (!inCategory) {
        return false;
      }
      if (!term) {
        return true;
      }
      return tool.title.includes(term) || tool.description.includes(term);
    });
  }, [searchTerm, selectedCategory]);

  const hasResults = filteredTools.length > 0;

  return (
    <div className="space-y-10">
      <section className="section-surface p-6 md:p-8 rounded-[var(--radius-lg)] border border-[var(--border-light)]">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-info)]"></span>
            داشبورد ابزارها
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">
            همه ابزارها در یک صفحه
          </h1>
          <p className="text-[var(--text-secondary)]">
            جست‌وجو، فیلتر و مسیرهای پیشنهادی را یکجا ببینید و سریع به ابزار مناسب برسید.
          </p>
        </div>
      </section>

      <CardPanel>
        <div className="space-y-2">
          <label htmlFor="tools-search" className="sr-only">
            جستجوی ابزارها
          </label>
          <input
            id="tools-search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی ابزار..."
            className="input-field"
            aria-describedby="tools-search-hint"
          />
          <p id="tools-search-hint" className="text-xs text-[var(--text-muted)]">
            می‌توانید بر اساس عنوان یا توضیح ابزار جست‌وجو کنید.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              aria-pressed={selectedCategory === category.id}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-[var(--motion-fast)] ${
                selectedCategory === category.id
                  ? 'bg-[var(--color-primary)] text-[var(--text-inverted)] shadow-[var(--shadow-medium)]'
                  : 'bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--border-light)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </CardPanel>

      {hasResults ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              href={tool.path}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              {...(tool.meta ? { meta: tool.meta } : {})}
              {...(tool.iconWrapClassName ? { iconWrapClassName: tool.iconWrapClassName } : {})}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔎"
          title="ابزاری پیدا نشد"
          description="عبارت جستجو یا دسته‌بندی را تغییر دهید تا ابزارهای بیشتری نمایش داده شود."
          action={{
            label: 'بازنشانی فیلترها',
            onClick: () => {
              setSearchTerm('');
              setSelectedCategory('all');
            },
          }}
        />
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-black text-[var(--text-primary)]">مسیرهای پیشنهادی</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {flows.map((flow) => (
            <a
              key={flow.title}
              href={flow.path}
              className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/85 p-5 transition-all duration-[var(--motion-fast)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-strong)]"
            >
              <div className="text-sm font-bold text-[var(--text-primary)]">{flow.title}</div>
              <div className="mt-2 text-sm text-[var(--text-muted)]">{flow.description}</div>
              <div className="mt-3 text-xs font-semibold text-[var(--color-primary)]">
                شروع مسیر
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function CardPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/90 p-5 space-y-4">
      {children}
    </div>
  );
}
