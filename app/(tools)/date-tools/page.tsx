import DateToolsPage from '@/components/features/date-tools/DateToolsPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ابزارهای تاریخ - جعبه ابزار فارسی',
  description:
    'تبدیل تاریخ شمسی و میلادی، محاسبه سن، فاصله بین دو تاریخ و ابزارهای کاربردی تاریخ - کاملاً آفلاین',
  keywords: [
    'تبدیل تاریخ شمسی به میلادی',
    'تبدیل تاریخ میلادی به شمسی',
    'محاسبه سن',
    'فاصله بین دو تاریخ',
    'ابزار تاریخ',
    'تاریخ شمسی',
    'تاریخ میلادی',
  ],
  path: '/date-tools',
});

export default function DateToolsRoute() {
  return <DateToolsPage />;
}
