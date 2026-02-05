import { test, expect } from '@playwright/test';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import os from 'os';
import path from 'path';

const createTempPdf = async (label: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 200]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const text = `Persian Tools ${label}`;
  page.drawText(text, { x: 40, y: 120, size: 18, font });
  const bytes = await pdfDoc.save();
  const filePath = path.join(os.tmpdir(), `pt-${label}-${Date.now()}.pdf`);
  fs.writeFileSync(filePath, Buffer.from(bytes));
  return filePath;
};

const createTempPng = () => {
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
  const filePath = path.join(os.tmpdir(), `pt-img-${Date.now()}.png`);
  fs.writeFileSync(filePath, Buffer.from(pngBase64, 'base64'));
  return filePath;
};

test.describe('Happy-path flows', () => {
  test('PDF merge produces downloadable file', async ({ page }) => {
    const fileA = await createTempPdf('A');
    const fileB = await createTempPdf('B');

    await page.goto('/pdf-tools/merge/merge-pdf');
    await page.setInputFiles('#merge-pdf-files', [fileA, fileB]);

    await page.getByRole('button', { name: 'ادغام PDF' }).click();

    const downloadLink = page.getByRole('link', { name: 'دانلود فایل' });
    await expect(downloadLink).toBeVisible({ timeout: 20000 });
  });

  test('Image compress generates output and download link', async ({ page }) => {
    const imagePath = createTempPng();

    await page.goto('/image-tools');
    await page.setInputFiles('input[type="file"]', imagePath);

    // اولین کارت تصویر پس از آپلود
    const processButton = page.getByRole('button', { name: 'پردازش' }).first();
    await expect(processButton).toBeVisible({ timeout: 10000 });
    await processButton.click();

    const downloadLink = page.getByRole('link', { name: 'دانلود فایل' }).first();
    await expect(downloadLink).toBeVisible({ timeout: 20000 });
  });
});
