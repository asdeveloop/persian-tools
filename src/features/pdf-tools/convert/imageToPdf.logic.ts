import { PDFDocument } from 'pdf-lib';
import type { ImageToPdfOptions } from '../types';

export type { ImageToPdfOptions, Orientation, Margin, PageSize } from '../types';

export interface ImageToPdfItem {
  id: string;
  file: File;
  url: string;
  width?: number;
  height?: number;
  bytes?: Uint8Array;
  mimeType?: string;
}

export interface ImageData {
  name: string;
  mimeType: string;
  bytes: Uint8Array;
}

export async function imagesToPdfBytes(
  images: ImageData[],
  options: ImageToPdfOptions = {},
): Promise<Uint8Array> {
  if (images.length === 0) {
    throw new Error('هیچ عکسی انتخاب نشده است.');
  }
  return await convertImagesToPdf(images.map(img => ({
    id: img.name,
    file: new File([img.bytes], img.name, { type: img.mimeType }),
    url: '',
    bytes: img.bytes,
    mimeType: img.mimeType,
  })), options);
}

export async function convertImagesToPdf(
  images: ImageToPdfItem[],
  options: ImageToPdfOptions = {},
): Promise<Uint8Array> {
  try {
    void options;
    const pdfDoc = await PDFDocument.create();

    for (const image of images) {
      const imageBytes = image.bytes ?? new Uint8Array(await image.file.arrayBuffer());
      const mimeType = image.mimeType ?? image.file.type;

      let pdfImage;
      if (mimeType === 'image/jpeg') {
        pdfImage = await pdfDoc.embedJpg(imageBytes);
      } else if (mimeType === 'image/png') {
        pdfImage = await pdfDoc.embedPng(imageBytes);
      } else {
        throw new Error('Unsupported image format');
      }

      const page = pdfDoc.addPage();
      const { width, height } = pdfImage.scale(1);

      // Fit image to page
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();
      const scale = Math.min(pageWidth / width, pageHeight / height) * 0.9;

      const scaledWidth = width * scale;
      const scaledHeight = height * scale;

      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      page.drawImage(pdfImage, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });
    }

    return await pdfDoc.save();
  } catch (error) {
    throw new Error(`خطا در تبدیل عکس به PDF: ${ error instanceof Error ? error.message : 'خطای نامشخص'}`);
  }
}
