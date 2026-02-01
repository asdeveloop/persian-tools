import SplitPdfPage from '@/features/pdf-tools/split/split-pdf';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'تقسیم PDF - جعبه ابزار فارسی',
  description: 'تقسیم فایل PDF به صفحات جداگانه',
  path: '/pdf-tools/split/split-pdf',
});

export default function SplitPdfRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <SplitPdfPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
