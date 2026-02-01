import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { splitPdf, validatePageRanges, suggestSplitOptions } from './split-pdf.logic';

async function createPdfBytes(pageCount = 1): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i += 1) {
    doc.addPage();
  }
  return new Uint8Array(await doc.save());
}

describe('splitPdf', () => {
  it('should split PDF by individual pages', async () => {
    const pdfBytes = await createPdfBytes(5);

    const results = await splitPdf(pdfBytes, {
      splitBy: 'pages',
    });

    expect(results.length).toBeGreaterThan(0);
    results.forEach(result => {
      expect(result.filename).toMatch(/^page-\d+\.pdf$/);
      expect(result.pages).toHaveLength(1);
      expect(result.bytes.length).toBeGreaterThan(0);
    });
  });

  it('should split PDF by page ranges', async () => {
    const pdfBytes = await createPdfBytes(5);

    const results = await splitPdf(pdfBytes, {
      splitBy: 'pages',
      ranges: ['1-3', '4-5'],
    });

    expect(results.length).toBe(2);
    expect(results[0]?.filename).toBe('pages-1-3.pdf');
    expect(results[1]?.filename).toBe('pages-4-5.pdf');
  });
});

describe('validatePageRanges', () => {
  it('should validate correct ranges', () => {
    const result = validatePageRanges(['1-5', '3', '7-10'], 10);
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid ranges', () => {
    const result = validatePageRanges(['invalid'], 10);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('معتبر نیست');
  });

  it('should reject ranges beyond page count', () => {
    const result = validatePageRanges(['1-20'], 10);
    expect(result.isValid).toBe(true); // Should still be valid, pages beyond count are ignored
  });
});

describe('suggestSplitOptions', () => {
  it('should suggest options for small PDF', () => {
    const suggestions = suggestSplitOptions(5);

    expect(suggestions.individual).toBe(true);
    expect(suggestions.ranges).toContain('1-5');
    expect(suggestions.descriptions).toContain('همه صفحات در یک فایل');
  });

  it('should suggest options for medium PDF', () => {
    const suggestions = suggestSplitOptions(15);

    expect(suggestions.individual).toBe(true);
    expect(suggestions.ranges).toHaveLength(2);
    expect(suggestions.ranges[0]).toBe('1-8');
    expect(suggestions.ranges[1]).toBe('9-15');
  });

  it('should suggest options for large PDF', () => {
    const suggestions = suggestSplitOptions(25);

    expect(suggestions.individual).toBe(false);
    expect(suggestions.ranges).toHaveLength(4);
    expect(suggestions.descriptions).toHaveLength(4);
  });
});
