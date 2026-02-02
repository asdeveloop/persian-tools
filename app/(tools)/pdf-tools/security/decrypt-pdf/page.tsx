import DecryptPdfPage from '@/features/pdf-tools/security/decrypt-pdf';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'حذف رمز PDF - جعبه ابزار فارسی',
  description: 'حذف رمز عبور از فایل PDF',
  path: '/pdf-tools/security/decrypt-pdf',
});

export default function DecryptPdfRoute() {
  return <DecryptPdfPage />;
}
