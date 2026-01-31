import { PDFDocument } from 'pdf-lib';

export type ImageToPdfItem = {
  name: string;
  mimeType: string;
  bytes: Uint8Array;
};

export async function imagesToPdfBytes(items: ImageToPdfItem[]): Promise<Uint8Array> {
  if (items.length === 0) {
    throw new Error('هیچ عکسی انتخاب نشده است.');
  }

  const pdf = await PDFDocument.create();

  for (const item of items) {
    const { mimeType, bytes } = item;

    if (mimeType === 'image/jpeg') {
      const img = await pdf.embedJpg(bytes);
      const { width, height } = img.scale(1);
      const page = pdf.addPage([width, height]);
      page.drawImage(img, { x: 0, y: 0, width, height });
    } else if (mimeType === 'image/png') {
      const img = await pdf.embedPng(bytes);
      const { width, height } = img.scale(1);
      const page = pdf.addPage([width, height]);
      page.drawImage(img, { x: 0, y: 0, width, height });
    } else {
      throw new Error('فقط فرمت‌های JPG و PNG پشتیبانی می‌شوند.');
    }
  }

  const out = await pdf.save();
  return out;
}
