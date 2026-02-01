import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
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
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">استخراج صفحات PDF</h1>
            <p className="mt-3 text-slate-600">این ابزار در حال توسعه است و به‌زودی فعال می‌شود.</p>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
