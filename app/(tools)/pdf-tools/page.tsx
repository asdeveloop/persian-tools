import PdfToolsPage from '@/components/features/pdf-tools/PdfToolsPage';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ابزارهای PDF - جعبه ابزار فارسی',
  description:
    'مجموعه کامل ابزارهای PDF: تبدیل، فشرده‌سازی، ادغام، تقسیم، رمزگذاری و واترمارک - رایگان و آفلاین',
  keywords: [
    'ابزار PDF',
    'تبدیل PDF',
    'فشرده سازی PDF',
    'ادغام PDF',
    'تقسیم PDF',
    'واترمارک PDF',
    'رمزگذاری PDF',
    'PDF فارسی',
  ],
  path: '/pdf-tools',
});

export default function PdfToolsRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <PdfToolsPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
