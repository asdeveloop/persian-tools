import { Metadata } from 'next';
import ImageCompressPage from '@/components/features/image-tools/ImageCompressPage';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'فشرده‌سازی عکس - جعبه ابزار فارسی',
  description: 'کاهش حجم عکس‌ها با سه سطح کیفیت پیشنهادی - پشتیبانی از فرمت‌های JPG, PNG, WebP',
  keywords: [
    'فشرده سازی عکس',
    'کاهش حجم عکس',
    'بهینه سازی تصویر',
    'فشرده ساز JPG',
    'فشرده ساز PNG',
    'کاهش حجم تصویر',
    'ابزار عکس',
    'بهینه سازی عکس'
  ],
  openGraph: {
    title: 'فشرده‌سازی عکس - جعبه ابزار فارسی',
    description: 'کاهش حجم عکس‌ها با سه سطح کیفیت پیشنهادی',
  },
};

export default function ImageCompressRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <ImageCompressPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
