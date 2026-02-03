import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const RotatePagesPage = dynamic(() => import('@/features/pdf-tools/edit/rotate-pages'), {
  ssr: false,
});

export const metadata = buildMetadata({
  title: 'چرخش صفحات PDF - جعبه ابزار فارسی',
  description: 'چرخاندن صفحات انتخابی در فایل PDF',
  path: '/pdf-tools/edit/rotate-pages',
});

export default function RotatePagesRoute() {
  return <RotatePagesPage />;
}
