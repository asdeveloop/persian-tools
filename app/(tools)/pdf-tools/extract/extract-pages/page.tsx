import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const ExtractPagesPage = dynamic(() => import('@/features/pdf-tools/extract/extract-pages'), {
  ssr: false,
});

export const metadata = buildMetadata({
  title: 'استخراج صفحات PDF - جعبه ابزار فارسی',
  description: 'استخراج صفحات دلخواه از فایل PDF',
  path: '/pdf-tools/extract/extract-pages',
});

export default function ExtractPagesRoute() {
  return <ExtractPagesPage />;
}
