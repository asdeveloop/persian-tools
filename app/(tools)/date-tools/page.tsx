import DateToolsPage from '@/components/features/date-tools/DateToolsPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ابزارهای تاریخ - جعبه ابزار فارسی',
  description:
    'تبدیل تاریخ شمسی، میلادی و قمری، محاسبه سن، فاصله بین دو تاریخ و ابزارهای کاربردی تاریخ - کاملاً آفلاین',
  keywords: [
    'تبدیل تاریخ شمسی به میلادی',
    'تبدیل تاریخ میلادی به شمسی',
    'تبدیل تاریخ قمری',
    'تبدیل تاریخ شمسی به قمری',
    'تبدیل تاریخ قمری به شمسی',
    'محاسبه سن',
    'فاصله بین دو تاریخ',
    'ابزار تاریخ',
    'تاریخ شمسی',
    'تاریخ میلادی',
    'تاریخ قمری',
  ],
  path: '/date-tools',
});

export default function DateToolsRoute() {
  return <DateToolsPage />;
}
