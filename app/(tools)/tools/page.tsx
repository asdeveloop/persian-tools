import ToolsDashboardPage from '@/components/features/tools-dashboard/ToolsDashboardPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'داشبورد ابزارها - جعبه ابزار فارسی',
  description: 'همه ابزارها، جست‌وجو و مسیرهای پیشنهادی در یک صفحه',
  path: '/tools',
});

export default function ToolsDashboardRoute() {
  return <ToolsDashboardPage />;
}
