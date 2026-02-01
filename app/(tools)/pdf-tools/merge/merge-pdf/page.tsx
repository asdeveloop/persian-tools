import MergePdfPage from '@/features/pdf-tools/merge/merge-pdf';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ادغام PDF - جعبه ابزار فارسی',
  description: 'ادغام چند فایل PDF در یک فایل واحد',
  path: '/pdf-tools/merge/merge-pdf',
});

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
