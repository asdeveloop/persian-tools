import ImageToPdfPage from '@/features/pdf-tools/convert/image-to-pdf';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'تبدیل عکس به PDF - جعبه ابزار فارسی',
  description: 'تبدیل چند تصویر به یک فایل PDF با تنظیمات کیفیت و اندازه صفحه',
  path: '/pdf-tools/convert/image-to-pdf',
});

export default function ImageToPdfRoute() {
  return <ImageToPdfPage />;
}
