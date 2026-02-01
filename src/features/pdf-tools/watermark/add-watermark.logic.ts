import { PDFDocument, PDFPage, StandardFonts, rgb } from 'pdf-lib';
import type { WatermarkOptions } from '../types';

export type { WatermarkOptions } from '../types';

export async function addWatermark(
  pdfBytes: Uint8Array,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const {
    type,
    content,
    position = 'center',
    opacity = 0.5,
    rotation = 45,
    size = 50
  } = options;

  if (!content) {
    throw new Error('محتوای واترمارک الزامی است.');
  }

  try {
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();

      if (type === 'text') {
        await addTextWatermark(page, content as string, {
          position,
          opacity,
          rotation,
          size,
          pageWidth: width,
          pageHeight: height
        });
      } else if (type === 'image') {
        await addImageWatermark(page, content as Uint8Array, {
          position,
          opacity,
          rotation,
          size,
          pageWidth: width,
          pageHeight: height
        });
      }
    }

    return await pdf.save();
  } catch (error) {
    throw new Error('خطا در افزودن واترمارک: ' + (error instanceof Error ? error.message : 'خطای نامشخص'));
  }
}

async function addTextWatermark(
  page: PDFPage,
  text: string,
  options: {
    position: string;
    opacity: number;
    rotation: number;
    size: number;
    pageWidth: number;
    pageHeight: number;
  }
) {
  const { position, opacity, rotation, size, pageWidth, pageHeight } = options;
  
  const font = await page.doc.embedFont(StandardFonts.Helvetica);
  const textWidth = font.widthOfTextAtSize(text, size);
  const textHeight = size;

  const { x, y } = calculatePosition(
    position,
    textWidth,
    textHeight,
    pageWidth,
    pageHeight
  );

  page.drawText(text, {
    x,
    y,
    size,
    font,
    color: rgb(0.5, 0.5, 0.5),
    opacity,
    rotate: { type: 'degrees' as const, angle: rotation }
  });
}

async function addImageWatermark(
  page: PDFPage,
  imageBytes: Uint8Array,
  options: {
    position: string;
    opacity: number;
    rotation: number;
    size: number;
    pageWidth: number;
    pageHeight: number;
  }
) {
  const { position, opacity, rotation, size, pageWidth, pageHeight } = options;
  
  try {
    // Try to embed as PNG first
    let image;
    try {
      image = await page.doc.embedPng(imageBytes);
    } catch {
      // If PNG fails, try JPEG
      image = await page.doc.embedJpg(imageBytes);
    }

    const { width: imgWidth, height: imgHeight } = image.scale(1);
    const scale = Math.min(size / imgWidth, size / imgHeight);
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    const { x, y } = calculatePosition(
      position,
      scaledWidth,
      scaledHeight,
      pageWidth,
      pageHeight
    );

    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
      opacity,
      rotate: { type: 'degrees' as const, angle: rotation }
    });
  } catch (error) {
    throw new Error('خطا در پردازش تصویر واترمارک');
  }
}

function calculatePosition(
  position: string,
  contentWidth: number,
  contentHeight: number,
  pageWidth: number,
  pageHeight: number
): { x: number; y: number } {
  const margin = 50;

  switch (position) {
    case 'top-left':
      return { x: margin, y: pageHeight - margin - contentHeight };
    case 'top-right':
      return { x: pageWidth - margin - contentWidth, y: pageHeight - margin - contentHeight };
    case 'bottom-left':
      return { x: margin, y: margin };
    case 'bottom-right':
      return { x: pageWidth - margin - contentWidth, y: margin };
    case 'center':
    default:
      return {
        x: (pageWidth - contentWidth) / 2,
        y: (pageHeight - contentHeight) / 2
      };
  }
}

export function validateWatermarkOptions(options: WatermarkOptions): { isValid: boolean; error?: string } {
  if (!options.type || !['text', 'image'].includes(options.type)) {
    return { isValid: false, error: 'نوع واترمارک باید متن یا تصویر باشد.' };
  }

  if (!options.content) {
    return { isValid: false, error: 'محتوای واترمارک الزامی است.' };
  }

  if (options.type === 'text' && typeof options.content !== 'string') {
    return { isValid: false, error: 'محتوای واترمارک متنی باید رشته باشد.' };
  }

  if (options.type === 'image' && !(options.content instanceof Uint8Array)) {
    return { isValid: false, error: 'محتوای واترمارک تصویری باید آرایه بایت باشد.' };
  }

  if (options.opacity !== undefined && (options.opacity < 0 || options.opacity > 1)) {
    return { isValid: false, error: 'شفافیت باید بین 0 و 1 باشد.' };
  }

  if (options.rotation !== undefined && (options.rotation < -360 || options.rotation > 360)) {
    return { isValid: false, error: 'چرخش باید بین -360 و 360 درجه باشد.' };
  }

  if (options.size !== undefined && (options.size < 10 || options.size > 500)) {
    return { isValid: false, error: 'اندازه باید بین 10 و 500 پیکسل باشد.' };
  }

  return { isValid: true };
}

export async function addWatermarkWithProgress(
  pdfBytes: Uint8Array,
  options: WatermarkOptions,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const validation = validateWatermarkOptions(options);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();

      if (options.type === 'text') {
        await addTextWatermark(page, options.content as string, {
          position: options.position || 'center',
          opacity: options.opacity || 0.5,
          rotation: options.rotation || 45,
          size: options.size || 50,
          pageWidth: width,
          pageHeight: height
        });
      } else if (options.type === 'image') {
        await addImageWatermark(page, options.content as Uint8Array, {
          position: options.position || 'center',
          opacity: options.opacity || 0.5,
          rotation: options.rotation || 45,
          size: options.size || 50,
          pageWidth: width,
          pageHeight: height
        });
      }

      if (onProgress) {
        onProgress(((i + 1) / pageCount) * 100);
      }
    }

    return await pdf.save();
  } catch (error) {
    throw new Error('خطا در افزودن واترمارک: ' + (error instanceof Error ? error.message : 'خطای نامشخص'));
  }
}
