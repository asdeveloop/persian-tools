import { describe, expect, it } from 'vitest';
import { addWatermark, validateWatermarkOptions } from './add-watermark.logic';

describe('addWatermark', () => {
  it('should throw when no content provided', async () => {
    const pdfBytes = new Uint8Array([1, 2, 3, 4, 5]);

    await expect(addWatermark(pdfBytes, {
      type: 'text',
      content: '',
    })).rejects.toThrow('محتوای واترمارک الزامی است.');
  });

  it('should add text watermark', async () => {
    const pdfBytes = new Uint8Array([1, 2, 3, 4, 5]);

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
    const pdfBytes = new Uint8Array([1, 2, 3, 4, 5]);
    const imageBytes = new Uint8Array([10, 20, 30, 40, 50]);

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
