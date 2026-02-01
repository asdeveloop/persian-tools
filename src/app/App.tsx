import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LoanPage from '../features/loan/LoanPage';
import SalaryPage from '../features/salary/SalaryPage';
import ImageToPdfPage from '../features/image-to-pdf/ImageToPdfPage';
import ImageCompressPage from '../features/image-compress/ImageCompressPage';
import Container from '../shared/ui/Container';
import Navigation from '../shared/ui/Navigation';
import Footer from '../shared/ui/Footer';

export default function App() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col" dir="rtl">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loan" element={<LoanPage />} />
            <Route path="/salary" element={<SalaryPage />} />
            <Route path="/image-to-pdf" element={<ImageToPdfPage />} />
            <Route path="/image-compress" element={<ImageCompressPage />} />
            <Route path="*" element={
              <div className="card p-6 text-center rtl-fix">
                صفحه‌ای پیدا نشد
              </div>
            } />
          </Routes>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
