import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4">
        <h1 className="text-lg font-bold">ابزارهای نسخه ۱</h1>
        <p className="mt-2 text-sm text-slate-700">
          این پروژه بدون ثبت‌نام و بدون ذخیره‌سازی دائمی است. با بستن تب مرورگر، داده‌ها از بین می‌روند.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Link to="/loan" className="rounded-lg bg-white p-4 hover:bg-slate-50">
          <div className="font-semibold">محاسبه‌گر وام</div>
          <div className="mt-1 text-sm text-slate-700">قسط ماهانه، سود کل، پرداخت کل</div>
        </Link>
        <Link to="/salary" className="rounded-lg bg-white p-4 hover:bg-slate-50">
          <div className="font-semibold">محاسبه‌گر حقوق ساده</div>
          <div className="mt-1 text-sm text-slate-700">محاسبه حقوق خالص از ورودی‌ها</div>
        </Link>
        <Link to="/image-to-pdf" className="rounded-lg bg-white p-4 hover:bg-slate-50">
          <div className="font-semibold">تبدیل عکس به PDF</div>
          <div className="mt-1 text-sm text-slate-700">کاملاً کلاینتی و بدون ارسال فایل</div>
        </Link>
        <Link to="/image-compress" className="rounded-lg bg-white p-4 hover:bg-slate-50">
          <div className="font-semibold">فشرده‌سازی عکس</div>
          <div className="mt-1 text-sm text-slate-700">کاهش حجم با سه سطح پیشنهادی</div>
        </Link>
      </div>
    </div>
  );
}
