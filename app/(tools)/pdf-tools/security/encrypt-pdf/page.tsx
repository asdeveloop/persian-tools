import { Metadata } from 'next';
import EncryptPdfPage from '@/features/pdf-tools/security/encrypt-pdf';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'رمزگذاری PDF - جعبه ابزار فارسی',
  description: 'اضافه کردن رمز عبور روی فایل PDF',
  openGraph: {
    title: 'رمزگذاری PDF - جعبه ابزار فارسی',
    description: 'اضافه کردن رمز عبور روی فایل PDF',
  },
};

export default function EncryptPdfRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <EncryptPdfPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
