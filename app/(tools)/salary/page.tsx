import SalaryPage from '@/components/features/salary/SalaryPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
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
  path: '/salary',
});

export default function SalaryRoute() {
  return <SalaryPage />;
}
