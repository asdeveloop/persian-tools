import { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'جعبه ابزار فارسی - صفحه اصلی',
  description: 'ابزارهای PDF، محاسبات مالی و پردازش تصویر - همه در یک مکان، رایگان و آسان',
  openGraph: {
    title: 'جعبه ابزار فارسی - صفحه اصلی',
    description: 'ابزارهای PDF، محاسبات مالی و پردازش تصویر - همه در یک مکان، رایگان و آسان',
  },
};

export default function RootPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <HomePage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
