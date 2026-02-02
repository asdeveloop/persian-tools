import SplitPdfPage from '@/features/pdf-tools/split/split-pdf';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'تقسیم PDF - جعبه ابزار فارسی',
  description: 'تقسیم فایل PDF به صفحات جداگانه',
  path: '/pdf-tools/split/split-pdf',
});

export default function SplitPdfRoute() {
  return <SplitPdfPage />;
}
