import PdfToImagePage from '@/features/pdf-tools/convert/pdf-to-image';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'تبدیل PDF به عکس - جعبه ابزار فارسی',
  description: 'تبدیل صفحات PDF به تصاویر PNG یا JPG با تنظیمات کیفیت',
  path: '/pdf-tools/convert/pdf-to-image',
});

export default function PdfToImageRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <PdfToImagePage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
