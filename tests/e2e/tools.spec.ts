import { test, expect } from '@playwright/test';

test.describe('Tool flows', () => {
  test('salary calculator should render results by default', async ({ page }) => {
    await page.goto('/salary');

    const salaryHeading = page.getByRole('heading', { name: 'نتیجه محاسبه حقوق' });
    await expect(salaryHeading).toBeVisible();
    await expect(
      salaryHeading.locator('..').locator('..').getByText('حقوق خالص', { exact: true }),
    ).toBeVisible();
  });

  test('date tools conversion should update Gregorian output', async ({ page }) => {
    await page.goto('/date-tools');
    await page.waitForTimeout(300);

    const gregOutput = page.getByRole('textbox', { name: 'خروجی میلادی' });

    await page.getByRole('button', { name: 'تبدیل دوطرفه' }).click();

    await expect(gregOutput).toHaveValue(/\d{4}\/\d{2}\/\d{2}/);
  });

  test('pdf compress should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/compress/compress-pdf');

    await page.getByRole('button', { name: 'فشرده سازی PDF' }).click();
    const alert = page
      .locator('[role="alert"]')
      .filter({ hasText: 'ابتدا فایل PDF را انتخاب کنید.' });
    await expect(alert).toBeVisible();
  });

  test('pdf split should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/split/split-pdf');

    await page.getByRole('button', { name: 'استخراج صفحات' }).click();
    const alert = page
      .locator('[role="alert"]')
      .filter({ hasText: 'ابتدا فایل PDF را انتخاب کنید.' });
    await expect(alert).toBeVisible();
  });

  test('pdf merge should show error when less than two files selected', async ({ page }) => {
    await page.goto('/pdf-tools/merge/merge-pdf');

    await page.getByRole('button', { name: 'ادغام PDF' }).click({ force: true });
    const alert = page
      .locator('[role="alert"]')
      .filter({ hasText: 'حداقل دو فایل برای ادغام لازم است.' });
    await expect(alert).toBeVisible();
  });

  test('pdf to image should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/convert/pdf-to-image');

    await page.getByRole('button', { name: 'تبدیل به تصویر' }).click();
    const alert = page
      .locator('[role="alert"]')
      .filter({ hasText: 'ابتدا فایل PDF را انتخاب کنید.' });
    await expect(alert).toBeVisible();
  });

  test('image to pdf should show error when no images selected', async ({ page }) => {
    await page.goto('/pdf-tools/convert/image-to-pdf');

    await page.getByRole('button', { name: 'تبدیل به PDF' }).click();
    const alert = page.locator('[role="alert"]').filter({ hasText: 'حداقل یک تصویر انتخاب کنید.' });
    await expect(alert).toBeVisible();
  });
});
