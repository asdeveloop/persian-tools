import ImageToolsPage from '@/features/image-tools/image-tools';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ابزارهای تصویر - جعبه ابزار فارسی',
  description:
    'فشرده‌سازی و بهینه‌سازی تصاویر با کنترل کیفیت، اندازه و فرمت خروجی - پردازش کاملاً آفلاین',
  keywords: [
    'ابزار تصویر',
    'فشرده سازی عکس',
    'کاهش حجم عکس',
    'بهینه سازی تصویر',
    'فشرده ساز JPG',
    'فشرده ساز PNG',
    'فشرده ساز WebP',
    'کاهش حجم تصویر',
  ],
  path: '/image-tools',
});

export default function ImageToolsRoute() {
  return <ImageToolsPage />;
}
