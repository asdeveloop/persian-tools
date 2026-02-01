import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { mergePdfs, getPdfInfo, reorderItems } from './merge-pdf.logic';

async function createPdfBytes(pageCount = 1): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i += 1) {
    doc.addPage();
  }
  return new Uint8Array(await doc.save());
}

describe('mergePdfs', () => {
  it('should throw when empty array', async () => {
    await expect(mergePdfs([])).rejects.toThrow('هیچ فایل PDF برای ادغام انتخاب نشده است.');
  });

  it('should merge PDFs with default options', async () => {
    const items = [
      { name: 'test1.pdf', bytes: await createPdfBytes(1), order: 0 },
      { name: 'test2.pdf', bytes: await createPdfBytes(2), order: 1 },
    ];

    const merged = await mergePdfs(items);
    expect(merged.length).toBeGreaterThan(0);
  });

  it('should merge PDFs with custom options', async () => {
    const items = [
      { name: 'test1.pdf', bytes: await createPdfBytes(1), order: 0 },
      { name: 'test2.pdf', bytes: await createPdfBytes(2), order: 1 },
    ];

    const merged = await mergePdfs(items, {
      preserveBookmarks: false,
      preserveForms: false,
    });

    expect(merged.length).toBeGreaterThan(0);
  });
});

describe('getPdfInfo', () => {
  it('should get PDF info', async () => {
    const pdfBytes = await createPdfBytes(3);

    const info = await getPdfInfo(pdfBytes);

    expect(info.pageCount).toBeGreaterThan(0);
  });
});

describe('reorderItems', () => {
  it('should reorder items correctly', () => {
    const items = [
      { name: 'test1.pdf', bytes: new Uint8Array([1]), order: 0 },
      { name: 'test2.pdf', bytes: new Uint8Array([2]), order: 1 },
      { name: 'test3.pdf', bytes: new Uint8Array([3]), order: 2 },
    ];

    const reordered = reorderItems(items, 0, 2);

    expect(reordered[0]?.name).toBe('test2.pdf');
    expect(reordered[1]?.name).toBe('test3.pdf');
    expect(reordered[2]?.name).toBe('test1.pdf');
  });

  it('should handle same index', () => {
    const items = [
      { name: 'test1.pdf', bytes: new Uint8Array([1]), order: 0 },
      { name: 'test2.pdf', bytes: new Uint8Array([2]), order: 1 },
    ];

    const reordered = reorderItems(items, 0, 0);

    expect(reordered).toEqual(items);
  });
});
