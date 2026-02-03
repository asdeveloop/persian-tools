import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';
const CompressPdfPage = dynamic(() => import('@/features/pdf-tools/compress/compress-pdf'), {
  ssr: false,
});

export const metadata = buildMetadata({
  title: 'فشرده‌سازی PDF - جعبه ابزار فارسی',
  description: 'کاهش حجم فایل PDF بدون افت کیفیت قابل توجه',
  path: '/pdf-tools/compress/compress-pdf',
});

export default function CompressPdfRoute() {
  return <CompressPdfPage />;
}
