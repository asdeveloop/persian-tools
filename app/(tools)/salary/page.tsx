import { Metadata } from 'next';
import SalaryPage from '@/components/features/salary/SalaryPage';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'محاسبه‌گر حقوق - جعبه ابزار فارسی',
  description: 'محاسبه حقوق خالص و بیمه از ورودی‌های حقوقی - محاسبه دقیق سهم کارمند و کارفرما',
  keywords: [
    'محاسبه حقوق',
    'حقوق خالص',
    'محاسبه بیمه',
    'حقوق و دستمزد',
    'محاسبه گر حقوق',
    'کسر بیمه از حقوق',
    'حقوق کارمند',
    'بیمه تامین اجتماعی',
  ],
  openGraph: {
    title: 'محاسبه‌گر حقوق - جعبه ابزار فارسی',
    description: 'محاسبه حقوق خالص و بیمه از ورودی‌های حقوقی',
  },
};

export default function SalaryRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <SalaryPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
