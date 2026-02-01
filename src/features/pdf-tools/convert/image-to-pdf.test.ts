import { describe, expect, it } from 'vitest';
import { imagesToPdfBytes, type ImageToPdfOptions } from './imageToPdf.logic';

const oneByOnePngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAOq9Z5kAAAAASUVORK5CYII=';

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

describe('imagesToPdfBytes', () => {
  it('should throw when empty', async () => {
    await expect(imagesToPdfBytes([])).rejects.toThrow();
  });

  it('should create a PDF for PNG images', async () => {
    const out = await imagesToPdfBytes([
      { name: 'a.png', mimeType: 'image/png', bytes: b64ToBytes(oneByOnePngBase64) },
    ]);
    expect(out.length).toBeGreaterThan(100);
    expect(String.fromCharCode(out[0] ?? 0)).toBe('%');
  });

  it('should reject unsupported mime type', async () => {
    await expect(
      imagesToPdfBytes([{ name: 'a.gif', mimeType: 'image/gif', bytes: new Uint8Array([1, 2, 3]) }]),
    ).rejects.toThrow();
  });

  it('should create PDF with portrait orientation', async () => {
    const options: ImageToPdfOptions = { orientation: 'portrait' };
    const out = await imagesToPdfBytes([
      { name: 'a.png', mimeType: 'image/png', bytes: b64ToBytes(oneByOnePngBase64) },
    ], options);
    expect(out.length).toBeGreaterThan(100);
    expect(String.fromCharCode(out[0] ?? 0)).toBe('%');
  });

  it('should create PDF with landscape orientation', async () => {
    const options: ImageToPdfOptions = { orientation: 'landscape' };
    const out = await imagesToPdfBytes([
      { name: 'a.png', mimeType: 'image/png', bytes: b64ToBytes(oneByOnePngBase64) },
    ], options);
    expect(out.length).toBeGreaterThan(100);
    expect(String.fromCharCode(out[0] ?? 0)).toBe('%');
  });

  it('should create PDF with different margins', async () => {
    const marginOptions: ImageToPdfOptions[] = [
      { margin: 'none' },
      { margin: 'small' },
      { margin: 'big' }
    ];

    for (const options of marginOptions) {
      const out = await imagesToPdfBytes([
        { name: 'a.png', mimeType: 'image/png', bytes: b64ToBytes(oneByOnePngBase64) },
      ], options);
      expect(out.length).toBeGreaterThan(100);
      expect(String.fromCharCode(out[0] ?? 0)).toBe('%');
    }
  });

  it('should create PDF with A4 page size', async () => {
    const options: ImageToPdfOptions = { pageSize: 'a4' };
    const out = await imagesToPdfBytes([
      { name: 'a.png', mimeType: 'image/png', bytes: b64ToBytes(oneByOnePngBase64) },
    ], options);
    expect(out.length).toBeGreaterThan(100);
    expect(String.fromCharCode(out[0] ?? 0)).toBe('%');
  });

  it('should create PDF with Letter page size', async () => {
    const options: ImageToPdfOptions = { pageSize: 'letter' };
    const out = await imagesToPdfBytes([
      { name: 'a.png', mimeType: 'image/png', bytes: b64ToBytes(oneByOnePngBase64) },
    ], options);
    expect(out.length).toBeGreaterThan(100);
    expect(String.fromCharCode(out[0] ?? 0)).toBe('%');
  });

  it('should create PDF with quality setting', async () => {
    const options: ImageToPdfOptions = { quality: 0.5 };
    const out = await imagesToPdfBytes([
      { name: 'a.png', mimeType: 'image/png', bytes: b64ToBytes(oneByOnePngBase64) },
    ], options);
    expect(out.length).toBeGreaterThan(100);
    expect(String.fromCharCode(out[0] ?? 0)).toBe('%');
  });

  it('should handle multiple images with different options', async () => {
    const options: ImageToPdfOptions = {
      orientation: 'landscape',
      margin: 'big',
      pageSize: 'a4',
      quality: 0.9
    };
    const out = await imagesToPdfBytes([
      { name: 'a.png', mimeType: 'image/png', bytes: b64ToBytes(oneByOnePngBase64) },
      { name: 'b.png', mimeType: 'image/png', bytes: b64ToBytes(oneByOnePngBase64) },
    ], options);
    expect(out.length).toBeGreaterThan(200);
    expect(String.fromCharCode(out[0] ?? 0)).toBe('%');
  });
});
