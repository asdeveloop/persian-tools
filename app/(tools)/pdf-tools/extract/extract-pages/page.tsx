import { buildMetadata } from '@/lib/seo';

export const metadata = {
  ...buildMetadata({
    title: 'استخراج صفحات PDF - جعبه ابزار فارسی',
    description: 'استخراج صفحات دلخواه از فایل PDF',
    path: '/pdf-tools/extract/extract-pages',
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExtractPagesRoute() {
  return (
    <div className="max-w-3xl mx-auto section-surface p-8 text-center">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">استخراج صفحات PDF</h1>
      <p className="mt-3 text-[var(--text-muted)]">
        این ابزار در حال توسعه است و به‌زودی فعال می‌شود.
      </p>
    </div>
  );
}
