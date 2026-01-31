import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LoanPage from '../features/loan/LoanPage';
import SalaryPage from '../features/salary/SalaryPage';
import ImageToPdfPage from '../features/image-to-pdf/ImageToPdfPage';
import ImageCompressPage from '../features/image-compress/ImageCompressPage';
import Container from '../shared/ui/Container';

export default function App() {
  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
          <Link to="/" className="flex items-center gap-2 text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5322d] text-white">
              <span className="text-sm font-bold">P</span>
            </span>
            <span className="text-base font-extrabold">جعبه ابزار فارسی</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-3 text-xs sm:text-sm">
            <Link className="text-slate-700 hover:text-slate-900" to="/loan">
              وام
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/salary">
              حقوق
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/image-to-pdf">
              عکس به PDF
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/image-compress">
              فشرده‌سازی عکس
            </Link>
          </nav>
        </Container>
      </header>

      <main>
        <Container className="py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loan" element={<LoanPage />} />
            <Route path="/salary" element={<SalaryPage />} />
            <Route path="/image-to-pdf" element={<ImageToPdfPage />} />
            <Route path="/image-compress" element={<ImageCompressPage />} />
            <Route path="*" element={<div className="rounded-lg bg-white p-4">صفحه پیدا نشد.</div>} />
          </Routes>
        </Container>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <Container className="py-5 text-xs text-slate-600">
          پردازش‌ها کاملاً روی دستگاه شما انجام می‌شود و چیزی به سرور ارسال نمی‌گردد.
        </Container>
      </footer>
    </div>
  );
}
