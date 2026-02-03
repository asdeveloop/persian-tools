import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';
const SplitPdfPage = dynamic(() => import('@/features/pdf-tools/split/split-pdf'), { ssr: false });

export const metadata = buildMetadata({
  title: 'تقسیم PDF - جعبه ابزار فارسی',
  description: 'تقسیم فایل PDF به صفحات جداگانه',
  path: '/pdf-tools/split/split-pdf',
});

export default function SplitPdfRoute() {
  return <SplitPdfPage />;
}
