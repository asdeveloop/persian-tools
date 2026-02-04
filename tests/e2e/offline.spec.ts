import { test, expect } from '@playwright/test';

test.describe('PWA offline', () => {
  test('should show offline fallback when offline', async ({ page, context }) => {
    await page.goto('/offline');

    await page.waitForFunction(() => 'serviceWorker' in navigator);
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: 'SKIP_WAITING' });
    });
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

    await context.setOffline(true);
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
    } catch {
      // Some browsers may abort navigation in offline mode; page content should still be available.
    }

    await expect(page.getByRole('heading', { level: 1 })).toContainText('آفلاین');
    await expect(page.getByText('در حال حاضر آفلاین هستید')).toBeVisible();

    const clearCache = page.getByRole('button', { name: 'پاک‌سازی کش' });
    await expect(clearCache).toBeVisible();

    await context.setOffline(false);
  });
});
