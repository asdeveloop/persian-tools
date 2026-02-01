import Link from 'next/link';
import Container from '@/shared/ui/Container';
import {
  IconPdf,
  IconImage,
  IconCalculator,
  IconShield,
  IconZap,
  IconHeart,
} from '@/shared/ui/icons';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="border-b border-slate-800">
        <Container className="py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5322d] text-white">
                  <span className="text-lg font-bold">P</span>
                </span>
                <span className="text-xl font-extrabold">جعبه ابزار فارسی</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                مجموعه‌ای کامل از ابزارهای آنلاین برای کار با فایل‌ها، محاسبات مالی و تبدیل فرمت‌ها.
                تمام ابزارها کاملاً رایگان و امن هستند.
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                    <IconShield className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">امن و خصوصی</div>
                    <div className="text-sm text-slate-400">پردازش فقط روی دستگاه شما</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                    <IconZap className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">سریع و کارآمد</div>
                    <div className="text-sm text-slate-400">پردازش سریع با بهترین الگوریتم‌ها</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                    <IconHeart className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">کاملاً رایگان</div>
                    <div className="text-sm text-slate-400">بدون هزینه و محدودیت</div>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Tools */}
            <div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <IconPdf className="h-5 w-5 text-red-400" />
                ابزارهای PDF
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/pdf-tools"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    همه ابزارهای PDF
                  </Link>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">تبدیل عکس به PDF</span>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">فشرده‌سازی PDF</span>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">ادغام و تقسیم PDF</span>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">رمزگذاری و واترمارک</span>
                </li>
              </ul>
            </div>

            {/* Image Tools */}
            <div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <IconImage className="h-5 w-5 text-purple-400" />
                ابزارهای تصویر
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/image-compress"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    فشرده‌سازی عکس
                  </Link>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">تغییر اندازه عکس (به زودی)</span>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">تبدیل فرمت (به زودی)</span>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">برش عکس (به زودی)</span>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">افزودن واترمارک (به زودی)</span>
                </li>
              </ul>
            </div>

            {/* Financial Tools */}
            <div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <IconCalculator className="h-5 w-5 text-blue-400" />
                ابزارهای مالی
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/loan"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    محاسبه‌گر وام
                  </Link>
                </li>
                <li>
                  <Link
                    href="/salary"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    محاسبه‌گر حقوق
                  </Link>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">محاسبه‌گر سود (به زودی)</span>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">تبدیل ارز (به زودی)</span>
                </li>
                <li>
                  <span className="text-slate-600 text-sm">محاسبه‌گر مالیات (به زودی)</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Footer */}
      <div className="bg-slate-950">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-400">
              © {new Date().getFullYear()} جعبه ابزار فارسی. تمام حقوق محفوظ است.
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className="text-slate-500">
                ساخته شده با ❤️ برای کاربران فارسی‌زبان
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <IconShield className="h-3 w-3" />
                پردازش‌ها کاملاً روی دستگاه شما انجام می‌شود و چیزی به سرور ارسال نمی‌گردد.
              </span>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
