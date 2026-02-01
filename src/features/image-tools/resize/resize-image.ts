import sharp from 'sharp';
import type { ResizeOptions, ImageProcessingError } from '../types';

export async function resizeImage(
  image: Buffer,
  options: ResizeOptions
): Promise<Buffer> {
  const { width, height, fit = 'cover' } = options;

  if (!width && !height) {
    const error: ImageProcessingError = {
      code: 'INVALID_INPUT',
      message: 'حداقل یکی از پارامترهای width یا height باید مشخص شود'
    };
    throw new Error(error.message);
  }

  try {
    const pipeline = sharp(image)
      .resize(width, height, {
        fit,
        withoutEnlargement: true
      });

    return await pipeline.toBuffer();

  } catch (error) {
    const processingError: ImageProcessingError = {
      code: 'PROCESSING_FAILED',
      message: error instanceof Error ? error.message : 'خطا در تغییر اندازه تصویر'
    };
    throw new Error(processingError.message);
  }
}
