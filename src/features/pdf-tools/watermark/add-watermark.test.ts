import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { addWatermark, validateWatermarkOptions } from './add-watermark.logic';

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

async function createPdfBytes(pageCount = 1): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i += 1) {
    doc.addPage();
  }
  return new Uint8Array(await doc.save());
}

describe('addWatermark', () => {
  it('should throw when no content provided', async () => {
    const pdfBytes = await createPdfBytes(1);

    await expect(addWatermark(pdfBytes, {
      type: 'text',
      content: '',
    })).rejects.toThrow('محتوای واترمارک الزامی است.');
  });

  it('should add text watermark', async () => {
    const pdfBytes = await createPdfBytes(1);

    const watermarked = await addWatermark(pdfBytes, {
      type: 'text',
      content: 'Test Watermark',
      position: 'center',
      opacity: 0.5,
      rotation: 45,
      size: 50,
    });

    expect(watermarked.length).toBeGreaterThan(0);
  });

  it('should add image watermark', async () => {
    const pdfBytes = await createPdfBytes(1);
    const imageBytes = b64ToBytes(oneByOnePngBase64);

    const watermarked = await addWatermark(pdfBytes, {
      type: 'image',
      content: imageBytes,
      position: 'top-right',
      opacity: 0.7,
      rotation: 0,
      size: 100,
    });

    expect(watermarked.length).toBeGreaterThan(0);
  });
});

describe('validateWatermarkOptions', () => {
  it('should reject invalid type', () => {
    const result = validateWatermarkOptions({
      type: 'invalid' as any,
      content: 'test',
    });

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('نوع واترمارک باید متن یا تصویر باشد.');
  });

  it('should reject empty content', () => {
    const result = validateWatermarkOptions({
      type: 'text',
      content: '',
    });

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('محتوای واترمارک الزامی است.');
  });

  it('should reject invalid content type for text', () => {
    const result = validateWatermarkOptions({
      type: 'text',
      content: new Uint8Array() as any,
    });

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('محتوای واترمارک متنی باید رشته باشد.');
  });

  it('should reject invalid content type for image', () => {
    const result = validateWatermarkOptions({
      type: 'image',
      content: 'not bytes' as any,
    });

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('محتوای واترمارک تصویری باید آرایه بایت باشد.');
  });

  it('should reject invalid opacity', () => {
    const result = validateWatermarkOptions({
      type: 'text',
      content: 'test',
      opacity: 1.5,
    });

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('شفافیت باید بین 0 و 1 باشد.');
  });

  it('should reject invalid rotation', () => {
    const result = validateWatermarkOptions({
      type: 'text',
      content: 'test',
      rotation: 400,
    });

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('چرخش باید بین -360 و 360 درجه باشد.');
  });

  it('should reject invalid size', () => {
    const result = validateWatermarkOptions({
      type: 'text',
      content: 'test',
      size: 5,
    });

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('اندازه باید بین 10 و 500 پیکسل باشد.');
  });

  it('should accept valid options', () => {
    const result = validateWatermarkOptions({
      type: 'text',
      content: 'Valid watermark',
      position: 'center',
      opacity: 0.5,
      rotation: 45,
      size: 50,
    });

    expect(result.isValid).toBe(true);
  });
});
