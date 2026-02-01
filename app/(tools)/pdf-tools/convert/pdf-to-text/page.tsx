import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'استخراج متن از PDF - جعبه ابزار فارسی',
  description: 'استخراج متن از فایل‌های PDF برای استفاده و ویرایش',
  openGraph: {
    title: 'استخراج متن از PDF - جعبه ابزار فارسی',
    description: 'استخراج متن از فایل‌های PDF برای استفاده و ویرایش',
  },
};

export default function PdfToTextRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">استخراج متن از PDF</h1>
            <p className="mt-3 text-slate-600">این ابزار در حال توسعه است و به‌زودی فعال می‌شود.</p>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
