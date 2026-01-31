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
    <div className="min-h-dvh bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loan" element={<LoanPage />} />
            <Route path="/salary" element={<SalaryPage />} />
            <Route path="/image-to-pdf" element={<ImageToPdfPage />} />
            <Route path="/image-compress" element={<ImageCompressPage />} />
            <Route path="*" element={<div className="card-glass p-6 text-center">صفحه پیدا نشد.</div>} />
          </Routes>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
