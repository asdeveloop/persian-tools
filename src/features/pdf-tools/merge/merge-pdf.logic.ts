import { PDFDocument } from 'pdf-lib';
import type { MergePdfOptions } from '../types';

export type { MergePdfOptions } from '../types';

export interface MergePdfItem {
  name: string;
  bytes: Uint8Array;
  order: number;
}

export async function mergePdfs(
  pdfItems: MergePdfItem[],
  options: MergePdfOptions = {},
): Promise<Uint8Array> {
  if (pdfItems.length === 0) {
    throw new Error('هیچ فایل PDF برای ادغام انتخاب نشده است.');
  }

  try {
    void options;
    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    // Sort items by order
    const sortedItems = [...pdfItems].sort((a, b) => a.order - b.order);

    // Process each PDF
    for (const item of sortedItems) {
      const pdf = await PDFDocument.load(item.bytes);

      // Copy all pages from the current PDF to the merged PDF
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));

      // Note: Bookmark and form preservation would require more advanced PDF manipulation
      // This is a basic implementation that merges pages
    }

    // Save the merged PDF
    const mergedBytes = await mergedPdf.save();
    return mergedBytes;
  } catch (error) {
    throw new Error(`خطا در ادغام فایل‌های PDF: ${ error instanceof Error ? error.message : 'خطای نامشخص'}`);
  }
}

export async function getPdfInfo(pdfBytes: Uint8Array): Promise<{
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
}> {
  try {
    const pdf = await PDFDocument.load(pdfBytes);

    return {
      pageCount: pdf.getPageCount(),
      // Note: Getting metadata would require more advanced PDF manipulation
      // This is a basic implementation
    };
  } catch (error) {
    throw new Error(`خطا در خواندن اطلاعات PDF: ${ error instanceof Error ? error.message : 'خطای نامشخص'}`);
  }
}

export function reorderItems(items: MergePdfItem[], fromIndex: number, toIndex: number): MergePdfItem[] {
  const result = [...items];
  const removed = result[fromIndex];
  if (removed) {
    result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
  }

  // Update order values
  return result.map((item, index) => ({
    ...item,
    order: index,
  }));
}

export async function mergePdfsWithProgress(
  pdfItems: MergePdfItem[],
  options: MergePdfOptions = {},
  onProgress?: (progress: number) => void,
): Promise<Uint8Array> {

  if (pdfItems.length === 0) {
    throw new Error('هیچ فایل PDF برای ادغام انتخاب نشده است.');
  }

  try {
    void options;
    const mergedPdf = await PDFDocument.create();
    const sortedItems = [...pdfItems].sort((a, b) => a.order - b.order);

    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      if (!item) {
        continue;
      }
      const pdf = await PDFDocument.load(item.bytes);

      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));

      // Report progress
      if (onProgress) {
        onProgress(((i + 1) / sortedItems.length) * 100);
      }
    }

    return await mergedPdf.save();
  } catch (error) {
    throw new Error(`خطا در ادغام فایل‌های PDF: ${ error instanceof Error ? error.message : 'خطای نامشخص'}`);
  }
}
