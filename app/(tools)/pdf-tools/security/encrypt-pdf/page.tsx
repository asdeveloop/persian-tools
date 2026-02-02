import EncryptPdfPage from '@/features/pdf-tools/security/encrypt-pdf';
import { buildMetadata } from '@/lib/seo';

export const metadata = {
  ...buildMetadata({
    title: 'رمزگذاری PDF - جعبه ابزار فارسی',
    description: 'اضافه کردن رمز عبور روی فایل PDF',
    path: '/pdf-tools/security/encrypt-pdf',
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function EncryptPdfRoute() {
  return <EncryptPdfPage />;
}
