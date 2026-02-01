import { Metadata } from 'next';
import AddWatermarkPage from '@/features/pdf-tools/watermark/add-watermark';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'افزودن واترمارک - جعبه ابزار فارسی',
  description: 'اضافه کردن متن یا تصویر واترمارک به صفحات PDF',
  openGraph: {
    title: 'افزودن واترمارک - جعبه ابزار فارسی',
    description: 'اضافه کردن متن یا تصویر واترمارک به صفحات PDF',
  },
};

export default function AddWatermarkRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <AddWatermarkPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
