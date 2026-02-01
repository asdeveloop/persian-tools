import { PDFDocument } from 'pdf-lib';
import type { PdfToImageOptions } from '../types';

export type { PdfToImageOptions } from '../types';

export interface PdfToImageItem {
  pageNumber: number;
  imageData: Uint8Array;
  width: number;
  height: number;
}

export async function pdfToImages(
  pdfBytes: Uint8Array,
  _options: PdfToImageOptions = {}
): Promise<PdfToImageItem[]> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();
    const images: PdfToImageItem[] = [];

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();

      // Scale page based on DPI
      const scale = dpi / 72;
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;

      // Create a new PDF document with just this page
      const singlePagePdf = await PDFDocument.create();
      const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i]);
      singlePagePdf.addPage(copiedPage);

      // Save the single page as PDF bytes
      const pagePdfBytes = await singlePagePdf.save();

      // For now, we'll return the PDF page as "image data"
      // In a real implementation, you would use a library like pdf2pic or canvas
      // to render the PDF page to actual image data
      images.push({
        pageNumber: i + 1,
        imageData: pagePdfBytes,
        width: scaledWidth,
        height: scaledHeight
      });
    }

    return images;
  } catch (error) {
    throw new Error('خطا در تبدیل PDF به تصویر: ' + (error instanceof Error ? error.message : 'خطای نامشخص'));
  }
}

export async function pdfPageToImage(
  pdfBytes: Uint8Array,
  pageNumber: number,
  options: PdfToImageOptions = {}
): Promise<PdfToImageItem> {
  const images = await pdfToImages(pdfBytes, options);
  const image = images.find(img => img.pageNumber === pageNumber);
  
  if (!image) {
    throw new Error(`صفحه ${pageNumber} یافت نشد`);
  }
  
  return image;
}

// Helper function to convert PDF page to canvas (for browser environments)
export async function renderPdfPageToCanvas(
  pdfBytes: Uint8Array,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  options: PdfToImageOptions = {}
): Promise<void> {
  const { dpi = 150 } = options;
  
  try {
    // This would typically use PDF.js in a browser environment
    // For now, we'll provide a placeholder implementation
    const pdfjsLib = (window as unknown as { pdfjsLib: { getDocument: (options: { data: Uint8Array }) => { promise: Promise<{ getPage: (num: number) => Promise<{ getViewport: (options: { scale: number }) => { width: number; height: number } }> }>} } }).pdfjsLib;
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageNumber);
    
    const viewport = page.getViewport({ scale: dpi / 72 });
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context not available');
    }
    
    // Note: page.render is part of PDF.js, not pdf-lib
    // This is a placeholder for the actual PDF.js implementation
    console.log('Rendering page with PDF.js (placeholder)');
  } catch (error) {
    throw new Error('خطا در رندر صفحه PDF: ' + (error instanceof Error ? error.message : 'خطای نامشخص'));
  }
}
