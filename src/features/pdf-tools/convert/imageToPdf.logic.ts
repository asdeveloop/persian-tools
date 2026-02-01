import { PDFDocument } from 'pdf-lib';
import type { ImageToPdfOptions, Orientation, Margin, PageSize } from '../types';

export type { ImageToPdfOptions, Orientation, Margin, PageSize } from '../types';

export interface ImageToPdfItem {
  id: string;
  file: File;
  url: string;
  width?: number;
  height?: number;
}

export interface ImageData {
  name: string;
  mimeType: string;
  bytes: Uint8Array;
}

export async function imagesToPdfBytes(
  images: ImageData[],
  options: ImageToPdfOptions = {}
): Promise<Uint8Array> {
  return await convertImagesToPdf(images.map(img => ({
    id: img.name,
    file: new File([img.bytes], img.name, { type: img.mimeType }),
    url: '',
    width: undefined,
    height: undefined
  })), options);
}

export async function convertImagesToPdf(
  images: ImageToPdfItem[],
  _options: ImageToPdfOptions = {}
): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.create();
    
    for (const image of images) {
      const imageBytes = await image.file.arrayBuffer();
      
      let pdfImage;
      if (image.file.type === 'image/jpeg') {
        pdfImage = await pdfDoc.embedJpg(imageBytes);
      } else if (image.file.type === 'image/png') {
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
        height: scaledHeight
      });
    }

    return await pdfDoc.save();
  } catch (error) {
    throw new Error('خطا در تبدیل عکس به PDF: ' + (error instanceof Error ? error.message : 'خطای نامشخص'));
  }
}
