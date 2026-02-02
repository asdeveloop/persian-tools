import PdfToolsPage from '@/components/features/pdf-tools/PdfToolsPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ابزارهای PDF - جعبه ابزار فارسی',
  description:
    'مجموعه کامل ابزارهای PDF: تبدیل، فشرده‌سازی، ادغام، تقسیم، رمزگذاری و واترمارک - رایگان و آفلاین',
  keywords: [
    'ابزار PDF',
    'تبدیل PDF',
    'فشرده سازی PDF',
    'ادغام PDF',
    'تقسیم PDF',
    'واترمارک PDF',
    'رمزگذاری PDF',
    'PDF فارسی',
  ],
  path: '/pdf-tools',
});

export default function PdfToolsRoute() {
  return <PdfToolsPage />;
}
