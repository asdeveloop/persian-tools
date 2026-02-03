import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';
const DecryptPdfPage = dynamic(() => import('@/features/pdf-tools/security/decrypt-pdf'), {
  ssr: false,
});

export const metadata = buildMetadata({
  title: 'حذف رمز PDF - جعبه ابزار فارسی',
  description: 'حذف رمز عبور از فایل PDF',
  path: '/pdf-tools/security/decrypt-pdf',
});

export default function DecryptPdfRoute() {
  return <DecryptPdfPage />;
}
