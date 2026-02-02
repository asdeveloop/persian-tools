import LoanPage from '@/components/features/loan/LoanPage';
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
  return <LoanPage />;
}
