import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';
const PdfToImagePage = dynamic(() => import('@/features/pdf-tools/convert/pdf-to-image'), {
  ssr: false,
});

export const metadata = buildMetadata({
  title: 'تبدیل PDF به عکس - جعبه ابزار فارسی',
  description: 'تبدیل صفحات PDF به تصاویر PNG یا JPG با تنظیمات کیفیت',
  path: '/pdf-tools/convert/pdf-to-image',
});

export default function PdfToImageRoute() {
  return <PdfToImagePage />;
}
