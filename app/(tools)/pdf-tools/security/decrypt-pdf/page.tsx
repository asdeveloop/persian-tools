import { Metadata } from 'next';
import DecryptPdfPage from '@/features/pdf-tools/security/decrypt-pdf';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'حذف رمز PDF - جعبه ابزار فارسی',
  description: 'حذف رمز عبور از فایل PDF',
  openGraph: {
    title: 'حذف رمز PDF - جعبه ابزار فارسی',
    description: 'حذف رمز عبور از فایل PDF',
  },
};

export default function DecryptPdfRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <DecryptPdfPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
