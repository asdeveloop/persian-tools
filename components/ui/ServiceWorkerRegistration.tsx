'use client';

import { useEffect, useRef } from 'react';

export default function ServiceWorkerRegistration() {
  const didReload = useRef(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) {
            return;
          }
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              installing.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (didReload.current) {
            return;
          }
          didReload.current = true;
          window.location.reload();
        });
      } catch {
        // Silent fail to avoid blocking UX in unsupported environments
      }
    };

    register();
  }, []);

  return null;
}
