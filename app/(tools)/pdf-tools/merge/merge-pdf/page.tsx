import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';
const MergePdfPage = dynamic(() => import('@/features/pdf-tools/merge/merge-pdf'), { ssr: false });

export const metadata = buildMetadata({
  title: 'ادغام PDF - جعبه ابزار فارسی',
  description: 'ادغام چند فایل PDF در یک فایل واحد',
  path: '/pdf-tools/merge/merge-pdf',
});

export default function MergePdfRoute() {
  return <MergePdfPage />;
}
