import { Metadata } from 'next';
import MergePdfPage from '@/features/pdf-tools/merge/merge-pdf';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'ادغام PDF - جعبه ابزار فارسی',
  description: 'ادغام چند فایل PDF در یک فایل واحد',
  openGraph: {
    title: 'ادغام PDF - جعبه ابزار فارسی',
    description: 'ادغام چند فایل PDF در یک فایل واحد',
  },
};

export default function MergePdfRoute() {
  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Container className="py-6">
          <MergePdfPage />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
