import { describe, expect, it } from 'vitest';
import { imagesToPdfBytes } from './imageToPdf.logic';

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
});
