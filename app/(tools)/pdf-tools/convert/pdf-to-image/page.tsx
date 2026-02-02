import PdfToImagePage from '@/features/pdf-tools/convert/pdf-to-image';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'تبدیل PDF به عکس - جعبه ابزار فارسی',
  description: 'تبدیل صفحات PDF به تصاویر PNG یا JPG با تنظیمات کیفیت',
  path: '/pdf-tools/convert/pdf-to-image',
});

export default function PdfToImageRoute() {
  return <PdfToImagePage />;
}
