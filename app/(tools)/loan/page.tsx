import LoanPage from '@/components/features/loan/LoanPage';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'محاسبه‌گر وام - جعبه ابزار فارسی',
  description:
    'محاسبه قسط ماهانه، سود کل و پرداخت کل وام‌های مختلف (مسکن، خودرو، شخصی) - رایگان و دقیق',
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
  path: '/loan',
});

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
