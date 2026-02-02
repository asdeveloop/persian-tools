import TextToolsPage from '@/components/features/text-tools/TextToolsPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ابزارهای متنی - جعبه ابزار فارسی',
  description: 'تبدیل تاریخ، تبدیل عدد به حروف و شمارش کلمات برای متن‌های فارسی و انگلیسی',
  keywords: ['ابزارهای متنی', 'تبدیل عدد به حروف', 'شمارش کلمات', 'تبدیل تاریخ', 'ابزار متن فارسی'],
  path: '/text-tools',
});

export default function TextToolsRoute() {
  return <TextToolsPage />;
}
