'use client';

import { Card } from '@/components/ui';

export default function EncryptPdfPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">رمزگذاری PDF</h1>
          <p className="text-lg text-slate-600">افزودن رمز عبور به فایل PDF</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            در حال حاضر رمزگذاری PDF در مرورگر با کتابخانه های فعلی پشتیبانی نمی شود.
          </div>
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              برای حفظ حریم خصوصی، پردازش ها باید به صورت محلی انجام شوند و استفاده از سرویس خارجی مجاز نیست.
            </p>
            <p>
              در فاز بعدی، راهکار جایگزین یا کتابخانه سازگار با رمزگذاری اضافه خواهد شد.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
