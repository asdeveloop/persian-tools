import { test, expect, type Locator, type Page } from '@playwright/test';

const clickAndExpectAlert = async (button: Locator, page: Page, message: string) => {
  const alert = page.getByRole('alert').filter({ hasText: message }).first();

  await button.click({ force: true });
  try {
    await expect(alert).toBeVisible({ timeout: 4000 });
    return;
  } catch {
    await page.waitForTimeout(200);
  }

  await button.click({ force: true });
  await expect(alert).toBeVisible();
};

const waitForUiReady = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(200);
};

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

    const input = page.getByRole('textbox', { name: 'تاریخ ورودی (YYYY/MM/DD)' });
    const gregOutput = page.getByRole('textbox', { name: 'خروجی میلادی' });

    await input.fill('1403/01/01');

    await expect(gregOutput).toHaveValue(/\d{4}\/\d{2}\/\d{2}/);
  });

  test('pdf compress should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/compress/compress-pdf');
    await waitForUiReady(page);

    const button = page.getByRole('button', { name: 'فشرده سازی PDF' });
    await expect(button).toBeVisible();
    await clickAndExpectAlert(button, page, 'ابتدا فایل PDF را انتخاب کنید.');
  });

  test('pdf split should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/split/split-pdf');
    await waitForUiReady(page);

    const button = page.getByRole('button', { name: 'استخراج صفحات' });
    await expect(button).toBeVisible();
    await clickAndExpectAlert(button, page, 'ابتدا فایل PDF را انتخاب کنید.');
  });

  test('pdf extract pages should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/extract/extract-pages');
    await waitForUiReady(page);

    const button = page.getByRole('button', { name: 'استخراج صفحات' });
    await expect(button).toBeVisible();
    await clickAndExpectAlert(button, page, 'ابتدا فایل PDF را انتخاب کنید.');
  });

  test('pdf delete pages should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/edit/delete-pages');
    await waitForUiReady(page);

    const button = page.getByRole('button', { name: 'حذف صفحات' });
    await expect(button).toBeVisible();
    await clickAndExpectAlert(button, page, 'ابتدا فایل PDF را انتخاب کنید.');
  });

  test('pdf rotate pages should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/edit/rotate-pages');
    await waitForUiReady(page);

    const button = page.getByRole('button', { name: 'چرخش صفحات' });
    await expect(button).toBeVisible();
    await clickAndExpectAlert(button, page, 'ابتدا فایل PDF را انتخاب کنید.');
  });

  test('pdf reorder pages should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/edit/reorder-pages');
    await waitForUiReady(page);

    const button = page.getByRole('button', { name: 'جابجایی صفحات' });
    await expect(button).toBeVisible();
    await clickAndExpectAlert(button, page, 'ابتدا فایل PDF را انتخاب کنید.');
  });

  test('pdf merge should show error when less than two files selected', async ({ page }) => {
    await page.goto('/pdf-tools/merge/merge-pdf');
    await waitForUiReady(page);

    const button = page.getByRole('button', { name: 'ادغام PDF' });
    await expect(button).toBeVisible();
    await clickAndExpectAlert(button, page, 'حداقل دو فایل برای ادغام لازم است.');
  });

  test('pdf to image should show error when no file selected', async ({ page }) => {
    await page.goto('/pdf-tools/convert/pdf-to-image');
    await waitForUiReady(page);

    const convertButton = page.getByRole('button', { name: 'تبدیل به تصویر' });
    await expect(convertButton).toBeVisible();
    await clickAndExpectAlert(convertButton, page, 'ابتدا فایل PDF را انتخاب کنید.');
  });

  test('image to pdf should show error when no images selected', async ({ page }) => {
    await page.goto('/pdf-tools/convert/image-to-pdf');
    await waitForUiReady(page);

    const convertButton = page.getByRole('button', { name: 'تبدیل به PDF' });
    await expect(convertButton).toBeVisible();
    await clickAndExpectAlert(convertButton, page, 'حداقل یک تصویر انتخاب کنید.');
  });
});
