import MergePdfPage from '@/features/pdf-tools/merge/merge-pdf';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ادغام PDF - جعبه ابزار فارسی',
  description: 'ادغام چند فایل PDF در یک فایل واحد',
  path: '/pdf-tools/merge/merge-pdf',
});

export default function MergePdfRoute() {
  return <MergePdfPage />;
}
