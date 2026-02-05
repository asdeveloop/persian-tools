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

  test('should cache static assets for offline use', async ({ page, context }) => {
    await page.goto('/');

    await page.waitForFunction(() => 'serviceWorker' in navigator);
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: 'SKIP_WAITING' });
    });
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

    // Wait for initial caching
    await page.waitForTimeout(1000);

    // Go offline
    await context.setOffline(true);

    // Navigate to a tool page - should work from cache
    try {
      await page.goto('/date-tools', { waitUntil: 'domcontentloaded' });
    } catch {
      // Navigation might fail in offline but page should show cached content
    }

    // Check that page loaded from cache
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    await context.setOffline(false);
  });

  test('should handle service worker update flow', async ({ page }) => {
    await page.goto('/');

    await page.waitForFunction(() => 'serviceWorker' in navigator);

    // Register SW and wait for activation
    const swState = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      return {
        active: !!registration.active,
        installing: !!registration.installing,
        waiting: !!registration.waiting,
      };
    });

    expect(swState.active || swState.installing).toBeTruthy();
  });

  test('should show offline page for uncached routes', async ({ page, context }) => {
    await page.goto('/');

    await page.waitForFunction(() => 'serviceWorker' in navigator);
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: 'SKIP_WAITING' });
    });
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

    await context.setOffline(true);

    // Try to access a route that might not be cached
    try {
      await page.goto('/non-existent-page', { waitUntil: 'domcontentloaded' });
    } catch {
      // Expected in offline
    }

    // Should show offline page
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/(آفلاین|صفحه یافت نشد)/);

    await context.setOffline(false);
  });

  test('should clear caches when requested', async ({ page }) => {
    await page.goto('/offline');

    await page.waitForFunction(() => 'serviceWorker' in navigator);
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: 'SKIP_WAITING' });
    });
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

    // Clear caches via message
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: 'CLEAR_CACHES' });
      // Wait a bit for operation to complete
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // Verify caches are cleared
    const cacheNames = await page.evaluate(async () => {
      return await caches.keys();
    });

    expect(cacheNames).toHaveLength(0);
  });

  test('should show update prompt when service worker reports update', async ({ page }) => {
    await page.goto('/');

    await page.waitForFunction(() => 'serviceWorker' in navigator);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: 'DEBUG_FORCE_UPDATE' });
    });

    const banner = page.getByText('نسخه جدید جعبه‌ابزار آماده است.');
    await expect(banner).toBeVisible();

    const updateButton = page.getByRole('button', { name: 'بروزرسانی و بارگذاری مجدد' });
    await updateButton.click();

    await expect(banner).toBeHidden({ timeout: 5000 });
  });
});
