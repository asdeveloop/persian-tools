import { Metadata } from 'next';
import CompressPdfPage from '@/features/pdf-tools/compress/compress-pdf';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'فشرده‌سازی PDF - جعبه ابزار فارسی',
  description: 'کاهش حجم فایل PDF بدون افت کیفیت قابل توجه',
  openGraph: {
    title: 'فشرده‌سازی PDF - جعبه ابزار فارسی',
    description: 'کاهش حجم فایل PDF بدون افت کیفیت قابل توجه',
  },
};

export default function CompressPdfRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <CompressPdfPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
