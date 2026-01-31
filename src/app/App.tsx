import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LoanPage from '../features/loan/LoanPage';
import SalaryPage from '../features/salary/SalaryPage';
import ImageToPdfPage from '../features/image-to-pdf/ImageToPdfPage';

export default function App() {
  return (
    <div className="min-h-dvh">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-slate-900">
            جعبه ابزار فارسی
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="text-slate-700 hover:text-slate-900" to="/loan">
              وام
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/salary">
              حقوق
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/image-to-pdf">
              عکس به PDF
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loan" element={<LoanPage />} />
          <Route path="/salary" element={<SalaryPage />} />
          <Route path="/image-to-pdf" element={<ImageToPdfPage />} />
          <Route path="*" element={<div className="rounded-lg bg-white p-4">صفحه پیدا نشد.</div>} />
        </Routes>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 text-xs text-slate-600">
          پردازش‌ها کاملاً روی دستگاه شما انجام می‌شود و چیزی به سرور ارسال نمی‌گردد.
        </div>
      </footer>
    </div>
  );
}
