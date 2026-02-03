import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';
const AddWatermarkPage = dynamic(() => import('@/features/pdf-tools/watermark/add-watermark'), {
  ssr: false,
});

export const metadata = buildMetadata({
  title: 'افزودن واترمارک - جعبه ابزار فارسی',
  description: 'اضافه کردن متن واترمارک به صفحات PDF',
  path: '/pdf-tools/watermark/add-watermark',
});

export default function AddWatermarkRoute() {
  return <AddWatermarkPage />;
}
