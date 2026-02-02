import type { ReactNode } from 'react';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import Container from '@/components/ui/Container';

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col page-shell">
      <Navigation />
      <main className="flex-1">
        <Container className="py-10">{children}</Container>
      </main>
      <Footer />
    </div>
  );
}
