import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { compressPdf, getCompressionInfo } from './compress-pdf.logic';

async function createPdfBytes(pageCount = 1): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i += 1) {
    doc.addPage();
  }
  return new Uint8Array(await doc.save());
}

describe('compressPdf', () => {
  it('should throw when empty', async () => {
    await expect(compressPdf(new Uint8Array())).rejects.toThrow();
  });

  it('should compress PDF with default options', async () => {
    const pdfBytes = await createPdfBytes(1);

    const compressed = await compressPdf(pdfBytes);
    expect(compressed.length).toBeGreaterThan(0);
  });

  it('should compress PDF with custom options', async () => {
    const pdfBytes = await createPdfBytes(2);

    const compressed = await compressPdf(pdfBytes, {
      quality: 0.6,
      removeImages: true,
      removeAnnotations: true,
    });

    expect(compressed.length).toBeGreaterThan(0);
  });
});

describe('getCompressionInfo', () => {
  it('should calculate compression info correctly', () => {
    const original = new Uint8Array([1, 2, 3, 4, 5]);
    const compressed = new Uint8Array([1, 2, 3]);

    const info = getCompressionInfo(original, compressed);

    expect(info.originalSize).toBe(5);
    expect(info.compressedSize).toBe(3);
    expect(info.compressionRatio).toBe(40);
    expect(info.spaceSaved).toBe(2);
  });

  it('should handle same size files', () => {
    const original = new Uint8Array([1, 2, 3]);
    const compressed = new Uint8Array([1, 2, 3]);

    const info = getCompressionInfo(original, compressed);

    expect(info.compressionRatio).toBe(0);
    expect(info.spaceSaved).toBe(0);
  });
});
