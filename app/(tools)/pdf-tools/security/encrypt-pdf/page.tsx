import EncryptPdfPage from '@/features/pdf-tools/security/encrypt-pdf';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = {
  ...buildMetadata({
    title: 'رمزگذاری PDF - جعبه ابزار فارسی',
    description: 'اضافه کردن رمز عبور روی فایل PDF',
    path: '/pdf-tools/security/encrypt-pdf',
  }),
  robots: {
    index: false,
    follow: false,
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
