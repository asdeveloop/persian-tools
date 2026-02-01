import { PDFDocument } from 'pdf-lib';
import type { SplitPdfOptions } from '../types';

export type { SplitPdfOptions } from '../types';

export interface SplitPdfResult {
  filename: string;
  bytes: Uint8Array;
  pages: number[];
}

export async function splitPdf(
  pdfBytes: Uint8Array,
  options: SplitPdfOptions = {}
): Promise<SplitPdfResult[]> {
  const { ranges = [], splitBy = 'pages' } = options;

  try {
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    const results: SplitPdfResult[] = [];

    if (splitBy === 'pages') {
      // Split by individual pages
      if (ranges.length === 0) {
        // Split all pages individually
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(page);
          
          const newBytes = await newPdf.save();
          results.push({
            filename: `page-${i + 1}.pdf`,
            bytes: newBytes,
            pages: [i + 1]
          });
        }
      } else {
        // Split by specified ranges
        for (const range of ranges) {
          const pageNumbers = parsePageRange(range, pageCount);
          if (pageNumbers.length === 0) continue;

          const newPdf = await PDFDocument.create();
          const pagesToCopy = pageNumbers.map(p => p - 1); // Convert to 0-based index
          const copiedPages = await newPdf.copyPages(pdf, pagesToCopy);
          copiedPages.forEach(page => newPdf.addPage(page));
          
          const newBytes = await newPdf.save();
          results.push({
            filename: `pages-${range}.pdf`,
            bytes: newBytes,
            pages: pageNumbers
          });
        }
      }
    } else if (splitBy === 'size') {
      // Split by file size (not implemented in this basic version)
      throw new Error('تقسیم بر اساس حجم هنوز پیاده‌سازی نشده است.');
    } else if (splitBy === 'bookmarks') {
      // Split by bookmarks (not implemented in this basic version)
      throw new Error('تقسیم بر اساس نشانک‌ها هنوز پیاده‌سازی نشده است.');
    }

    return results;
  } catch (error) {
    throw new Error('خطا در تقسیم فایل PDF: ' + (error instanceof Error ? error.message : 'خطای نامشخص'));
  }
}

function parsePageRange(range: string, totalPages: number): number[] {
  const pages: number[] = [];
  const parts = range.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    
    if (trimmed.includes('-')) {
      // Range like "1-5" or "3-7"
      const [start, end] = trimmed.split('-').map(p => parseInt(p.trim()));
      if (start !== undefined && end !== undefined && !isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) {
            pages.push(i);
          }
        }
      }
    } else {
      // Single page like "3"
      const page = parseInt(trimmed);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        pages.push(page);
      }
    }
  }
  
  return [...new Set(pages)].sort((a, b) => a - b);
}

export async function splitPdfWithProgress(
  pdfBytes: Uint8Array,
  options: SplitPdfOptions = {},
  onProgress?: (progress: number) => void
): Promise<SplitPdfResult[]> {
  const { ranges = [], splitBy = 'pages' } = options;

  try {
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    const results: SplitPdfResult[] = [];

    if (splitBy === 'pages') {
      if (ranges.length === 0) {
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(page);
          
          const newBytes = await newPdf.save();
          results.push({
            filename: `page-${i + 1}.pdf`,
            bytes: newBytes,
            pages: [i + 1]
          });

          if (onProgress) {
            onProgress(((i + 1) / pageCount) * 100);
          }
        }
      } else {
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          if (!range) continue;
          
          const pageNumbers = parsePageRange(range, pageCount);
          if (pageNumbers.length === 0) continue;

          const newPdf = await PDFDocument.create();
          const pagesToCopy = pageNumbers.map(p => p - 1);
          const copiedPages = await newPdf.copyPages(pdf, pagesToCopy);
          copiedPages.forEach(page => newPdf.addPage(page));
          
          const newBytes = await newPdf.save();
          results.push({
            filename: `pages-${range}.pdf`,
            bytes: newBytes,
            pages: pageNumbers
          });

          if (onProgress) {
            onProgress(((i + 1) / ranges.length) * 100);
          }
        }
      }
    }

    return results;
  } catch (error) {
    throw new Error('خطا در تقسیم فایل PDF: ' + (error instanceof Error ? error.message : 'خطای نامشخص'));
  }
}

export function validatePageRanges(ranges: string[], totalPages: number): { isValid: boolean; error?: string } {
  for (const range of ranges) {
    const pages = parsePageRange(range, totalPages);
    if (pages.length === 0) {
      return { isValid: false, error: `محدوده صفحات "${range}" معتبر نیست.` };
    }
  }
  return { isValid: true };
}

export function suggestSplitOptions(pageCount: number): {
  individual: boolean;
  ranges: string[];
  descriptions: string[];
} {
  const suggestions = {
    individual: pageCount <= 20,
    ranges: [] as string[],
    descriptions: [] as string[]
  };

  if (pageCount <= 10) {
    suggestions.ranges = ['1-' + pageCount];
    suggestions.descriptions = ['همه صفحات در یک فایل'];
  } else if (pageCount <= 20) {
    const half = Math.ceil(pageCount / 2);
    suggestions.ranges = [`1-${half}`, `${half + 1}-${pageCount}`];
    suggestions.descriptions = ['نیمه اول', 'نیمه دوم'];
  } else {
    const quarter = Math.ceil(pageCount / 4);
    suggestions.ranges = [
      `1-${quarter}`,
      `${quarter + 1}-${quarter * 2}`,
      `${quarter * 2 + 1}-${quarter * 3}`,
      `${quarter * 3 + 1}-${pageCount}`
    ];
    suggestions.descriptions = ['یک چهارم اول', 'یک چهارم دوم', 'یک چهارم سوم', 'یک چهارم چهارم'];
  }

  return suggestions;
}
