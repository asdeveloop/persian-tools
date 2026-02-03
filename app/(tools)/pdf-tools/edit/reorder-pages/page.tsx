import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const ReorderPagesPage = dynamic(() => import('@/features/pdf-tools/edit/reorder-pages'), {
  ssr: false,
});

export const metadata = buildMetadata({
  title: 'جابجایی صفحات PDF - جعبه ابزار فارسی',
  description: 'تغییر ترتیب صفحات PDF به شکل دلخواه',
  path: '/pdf-tools/edit/reorder-pages',
});

export default function ReorderPagesRoute() {
  return <ReorderPagesPage />;
}
