'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordPageView } from '@/shared/analytics/localUsage';

export default function UsageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }
    recordPageView(pathname);
  }, [pathname]);

  return null;
}
