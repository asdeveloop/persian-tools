import { Metadata } from 'next';
import LoanPage from '@/components/features/loan/LoanPage';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'محاسبه‌گر وام - جعبه ابزار فارسی',
  description: 'محاسبه قسط ماهانه، سود کل و پرداخت کل وام‌های مختلف (مسکن، خودرو، شخصی) - رایگان و دقیق',
  keywords: [
    'محاسبه وام',
    'محاسبه قسط',
    'محاسبه سود وام',
    'وام مسکن',
    'وام خودرو',
    'وام شخصی',
    'محاسبه گر وام',
    'اقساط وام',
  ],
  openGraph: {
    title: 'محاسبه‌گر وام - جعبه ابزار فارسی',
    description: 'محاسبه قسط ماهانه، سود کل و پرداخت کل وام‌های مختلف',
  },
};

export default function LoanRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <LoanPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
