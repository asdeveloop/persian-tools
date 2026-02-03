import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const DeletePagesPage = dynamic(() => import('@/features/pdf-tools/edit/delete-pages'), {
  ssr: false,
});

export const metadata = buildMetadata({
  title: 'حذف صفحات PDF - جعبه ابزار فارسی',
  description: 'حذف صفحات انتخابی از فایل PDF',
  path: '/pdf-tools/edit/delete-pages',
});

export default function DeletePagesRoute() {
  return <DeletePagesPage />;
}
