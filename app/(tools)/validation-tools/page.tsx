import ValidationToolsPage from '@/components/features/validation-tools/ValidationToolsPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'اعتبارسنجی داده‌های ایرانی - جعبه ابزار فارسی',
  description: 'اعتبارسنجی کد ملی، موبایل، کارت بانکی، شبا، کدپستی و پلاک خودرو',
  keywords: [
    'اعتبارسنجی کد ملی',
    'اعتبارسنجی موبایل',
    'اعتبارسنجی کارت بانکی',
    'اعتبارسنجی شبا',
    'اعتبارسنجی کد پستی',
    'اعتبارسنجی پلاک',
  ],
  path: '/validation-tools',
});

export default function ValidationToolsRoute() {
  return <ValidationToolsPage />;
}
