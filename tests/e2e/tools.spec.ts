import { test, expect } from '@playwright/test';

test.describe('Tool flows', () => {
  test('loan calculator should show results for a basic scenario', async ({ page }) => {
    await page.goto('/loan');

    const principalInput = page.getByLabel('مبلغ وام (تومان)');
    const rateInput = page.getByLabel('نرخ سود سالانه (درصد)');
    const monthsInput = page.getByLabel('مدت بازپرداخت (ماه)');

    await principalInput.click({ force: true });
    await principalInput.press('Control+A');
    await principalInput.type('20000000');
    await rateInput.click({ force: true });
    await rateInput.press('Control+A');
    await rateInput.type('18');
    await monthsInput.click({ force: true });
    await monthsInput.press('Control+A');
    await monthsInput.type('24');

    await expect(principalInput).toHaveValue('20000000');
    await expect(rateInput).toHaveValue('18');
    await expect(monthsInput).toHaveValue('24');

    const calcButton = page.getByRole('button', { name: 'محاسبه کن' });
    await calcButton.scrollIntoViewIfNeeded();
    await calcButton.click({ force: true });

    const resultHeading = page.getByRole('heading', { name: /نتیجه محاسبه - وام/ });
    await expect(resultHeading).toBeVisible({ timeout: 15000 });
    await expect(
      resultHeading.locator('..').getByText('قسط ماهانه', { exact: true }),
    ).toBeVisible();
  });

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

    const jalaliInput = page.getByLabel('تاریخ شمسی (YYYY/MM/DD)');
    const gregOutput = page.getByLabel('خروجی میلادی');

    await jalaliInput.click({ force: true });
    await jalaliInput.press('Control+A');
    await jalaliInput.type('1403/01/02');
    await expect(jalaliInput).toHaveValue('1403/01/02');
    await page.getByRole('button', { name: 'تبدیل دوطرفه' }).click();

    await expect(gregOutput).toHaveValue('2024/03/21');
  });

  test('text tools should render number to words output', async ({ page }) => {
    await page.goto('/text-tools');

    const numberInput = page.getByLabel('عدد');
    await numberInput.click({ force: true });
    await numberInput.press('Control+A');
    await numberInput.type('12345');
    await expect(numberInput).toHaveValue('12345');
    await page.getByRole('button', { name: 'تبدیل' }).nth(1).click();

    await expect(page.getByText('دوازده هزار و سیصد و چهل و پنج')).toBeVisible();
  });
});
