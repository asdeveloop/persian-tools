import ImageToPdfPage from '@/features/pdf-tools/convert/image-to-pdf';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'تبدیل عکس به PDF - جعبه ابزار فارسی',
  description: 'تبدیل چند تصویر به یک فایل PDF با تنظیمات کیفیت و اندازه صفحه',
  path: '/pdf-tools/convert/image-to-pdf',
});

export default function ImageToPdfRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <ImageToPdfPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
