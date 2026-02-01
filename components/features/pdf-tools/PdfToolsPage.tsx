'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import type { PdfToolItem } from '@/features/pdf-tools/types';

const pdfTools: PdfToolItem[] = [
  // Convert tools
  {
    id: 'image-to-pdf',
    title: 'تبدیل عکس به PDF',
    description: 'چندین تصویر را به یک فایل PDF تبدیل کنید',
    icon: '🖼️',
    path: '/pdf-tools/convert/image-to-pdf',
    category: 'convert',
  },
  {
    id: 'pdf-to-image',
    title: 'تبدیل PDF به عکس',
    description: 'صفحات PDF را به تصاویر JPG یا PNG تبدیل کنید',
    icon: '📷',
    path: '/pdf-tools/convert/pdf-to-image',
    category: 'convert',
  },
  {
    id: 'pdf-to-text',
    title: 'استخراج متن از PDF',
    description: 'متن را از فایل PDF استخراج کنید',
    icon: '📝',
    path: '/pdf-tools/convert/pdf-to-text',
    category: 'convert',
  },
  {
    id: 'word-to-pdf',
    title: 'تبدیل Word به PDF',
    description: 'فایل‌های Word را به PDF تبدیل کنید',
    icon: '📄',
    path: '/pdf-tools/convert/word-to-pdf',
    category: 'convert',
  },

  // Compress tools
  {
    id: 'compress-pdf',
    title: 'فشرده‌سازی PDF',
    description: 'حجم فایل PDF را بدون افت کیفیت کاهش دهید',
    icon: '🗜️',
    path: '/pdf-tools/compress/compress-pdf',
    category: 'compress',
  },

  // Merge tools
  {
    id: 'merge-pdf',
    title: 'ادغام PDF',
    description: 'چندین فایل PDF را در یک فایل واحد ادغام کنید',
    icon: '➕',
    path: '/pdf-tools/merge/merge-pdf',
    category: 'merge',
  },

  // Split tools
  {
    id: 'split-pdf',
    title: 'تقسیم PDF',
    description: 'فایل PDF را به صفحات جداگانه تقسیم کنید',
    icon: '✂️',
    path: '/pdf-tools/split/split-pdf',
    category: 'split',
  },

  // Security tools
  {
    id: 'encrypt-pdf',
    title: 'رمزگذاری PDF',
    description: 'روی فایل PDF رمز عبور قرار دهید',
    icon: '🔐',
    path: '/pdf-tools/security/encrypt-pdf',
    category: 'security',
  },
  {
    id: 'decrypt-pdf',
    title: 'حذف رمز PDF',
    description: 'رمز عبور فایل PDF را حذف کنید',
    icon: '🔓',
    path: '/pdf-tools/security/decrypt-pdf',
    category: 'security',
  },

  // Watermark tools
  {
    id: 'add-watermark',
    title: 'افزودن واترمارک',
    description: 'متن یا لوگو به صفحات PDF اضافه کنید',
    icon: '🖋️',
    path: '/pdf-tools/watermark/add-watermark',
    category: 'watermark',
  },

  // Paginate tools
  {
    id: 'add-page-numbers',
    title: 'شماره صفحه',
    description: 'به صفحات PDF شماره اضافه کنید',
    icon: '🔢',
    path: '/pdf-tools/paginate/add-page-numbers',
    category: 'paginate',
  },

  // Extract tools
  {
    id: 'extract-pages',
    title: 'استخراج صفحات',
    description: 'صفحات خاصی را از PDF استخراج کنید',
    icon: '📑',
    path: '/pdf-tools/extract/extract-pages',
    category: 'extract',
  },
  {
    id: 'extract-text',
    title: 'استخراج متن',
    description: 'متن کامل را از فایل PDF استخراج کنید',
    icon: '📋',
    path: '/pdf-tools/extract/extract-text',
    category: 'extract',
  },
];

const categories = [
  { id: 'all', name: 'همه ابزارها', icon: '🛠️' },
  { id: 'convert', name: 'تبدیل', icon: '🔄' },
  { id: 'compress', name: 'فشرده‌سازی', icon: '🗜️' },
  { id: 'merge', name: 'ادغام', icon: '➕' },
  { id: 'split', name: 'تقسیم', icon: '✂️' },
  { id: 'security', name: 'امنیت', icon: '🔒' },
  { id: 'watermark', name: 'واترمارک', icon: '🖋️' },
  { id: 'paginate', name: 'صفحه‌بندی', icon: '🔢' },
  { id: 'extract', name: 'استخراج', icon: '📤' },
];

export default function PdfToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = pdfTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.title.includes(searchTerm) ||
                         tool.description.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">ابزارهای PDF آنلاین</h1>
            <p className="text-lg text-slate-600">مجموعه کامل ابزارهای کاربردی برای مدیریت فایل‌های PDF</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="جستجوی ابزار مورد نظر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span className="ml-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map(tool => (
            <Card key={tool.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
              <Link href={tool.path} className="block p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-red-600 font-medium text-sm group-hover:text-red-700">
                      شروع کنید
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">ابزاری یافت نشد</h3>
            <p className="text-slate-600">متن جستجو را تغییر دهید یا دسته بندی دیگری را انتخاب کنید</p>
          </Card>
        )}

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">چرا از ابزارهای PDF ما استفاده کنید؟</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center p-6">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">سریع و کارآمد</h3>
              <p className="text-slate-600">پردازش سریع فایل‌ها با بهترین کیفیت ممکن</p>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">امن و محرمانه</h3>
              <p className="text-slate-600">فایل‌های شما به صورت محلی پردازش می‌شوند</p>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl mb-4">💎</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">رایگان و نامحدود</h3>
              <p className="text-slate-600">بدون محدودیت در تعداد و حجم فایل‌ها</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
