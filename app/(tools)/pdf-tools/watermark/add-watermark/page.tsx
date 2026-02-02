import AddWatermarkPage from '@/features/pdf-tools/watermark/add-watermark';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'افزودن واترمارک - جعبه ابزار فارسی',
  description: 'اضافه کردن متن واترمارک به صفحات PDF',
  path: '/pdf-tools/watermark/add-watermark',
});

export default function AddWatermarkRoute() {
  return <AddWatermarkPage />;
}
