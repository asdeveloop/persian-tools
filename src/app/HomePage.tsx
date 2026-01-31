import { Link } from 'react-router-dom';
import Button from '../shared/ui/Button';
import ToolCard from '../shared/ui/ToolCard';
import { IconCalculator, IconImage, IconMoney, IconPdf } from '../shared/ui/icons';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent"></div>
        <div className="relative px-6 py-16 md:px-12 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              همه ابزارهایی که نیاز دارید اینجاست
            </h1>
            <p className="mt-6 text-lg md:text-xl text-red-100">
              تمام ابزارهای لازم در یک مکان. رایگان و آسان برای استفاده!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/image-to-pdf">
                <Button
                  type="button"
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3 text-lg"
                >
                  شروع با ابزار PDF
                </Button>
              </Link>
              <Link to="/loan">
                <Button
                  type="button"
                  variant="secondary"
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg"
                >
                  محاسبه وام
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">ابزارهای کاربردی</h2>
          <p className="mt-2 text-lg text-slate-600">
            ابزارهای مورد نیاز خود را برای کار با فایل‌ها انتخاب کنید
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ToolCard
            to="/image-to-pdf"
            title="JPG به PDF"
            description="تبدیل عکس‌ها به PDF در چند ثانیه. تنظیم جهت‌گیری و حاشیه‌ها به راحتی."
            icon={<IconPdf className="h-8 w-8 text-red-600" />}
            className="hover:border-red-300 hover:bg-red-50 group"
          />
          <ToolCard
            to="/loan"
            title="محاسبه‌گر وام"
            description="محاسبه قسط ماهانه، سود کل و پرداخت کل وام‌های مختلف"
            icon={<IconCalculator className="h-8 w-8 text-blue-600" />}
            className="hover:border-blue-300 hover:bg-blue-50 group"
          />
          <ToolCard
            to="/salary"
            title="محاسبه‌گر حقوق"
            description="محاسبه حقوق خالص و بیمه از ورودی‌های حقوقی"
            icon={<IconMoney className="h-8 w-8 text-green-600" />}
            className="hover:border-green-300 hover:bg-green-50 group"
          />
          <ToolCard
            to="/image-compress"
            title="فشرده‌سازی عکس"
            description="کاهش حجم عکس‌ها با سه سطح کیفیت پیشنهادی"
            icon={<IconImage className="h-8 w-8 text-purple-600" />}
            className="hover:border-purple-300 hover:bg-purple-50 group"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-50 rounded-2xl p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">امن و خصوصی</h3>
            <p className="text-sm text-slate-600">فایل‌ها فقط روی دستگاه شما پردازش می‌شوند و به هیچ‌جا ارسال نمی‌شوند</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">سریع و کارآمد</h3>
            <p className="text-sm text-slate-600">پردازش سریع فایل‌ها با بهترین الگوریتم‌های ممکن</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">کاملاً رایگان</h3>
            <p className="text-sm text-slate-600">تمام ابزارها بدون هزینه و محدودیت استفاده در دسترس هستند</p>
          </div>
        </div>
      </div>
    </div>
  );
}
