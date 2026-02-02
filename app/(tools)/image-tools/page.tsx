import ImageToolsPage from '@/features/image-tools/image-tools';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ابزارهای تصویر - جعبه ابزار فارسی',
  description:
    'فشرده‌سازی و بهینه‌سازی تصاویر با کنترل کیفیت، اندازه و فرمت خروجی - پردازش کاملاً آفلاین',
  keywords: [
    'ابزار تصویر',
    'فشرده سازی عکس',
    'کاهش حجم عکس',
    'بهینه سازی تصویر',
    'فشرده ساز JPG',
    'فشرده ساز PNG',
    'فشرده ساز WebP',
    'کاهش حجم تصویر',
  ],
  path: '/image-tools',
});

export default function ImageToolsRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <ImageToolsPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
