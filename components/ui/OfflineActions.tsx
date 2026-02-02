'use client';

import { useCallback } from 'react';

export default function OfflineActions() {
  const onRetry = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button type="button" onClick={onRetry} className="btn-primary px-6 py-2 text-sm">
        تلاش مجدد
      </button>
      <a href="/" className="btn-secondary px-6 py-2 text-sm">
        بازگشت به خانه
      </a>
    </div>
  );
}
