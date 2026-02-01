import sharp from 'sharp';
import type { RotateOptions, ImageProcessingError } from '../types';

export async function rotateImage(
  image: Buffer,
  options: RotateOptions,
): Promise<Buffer> {
  const { angle } = options;

  if (typeof angle !== 'number' || angle % 90 !== 0) {
    const error: ImageProcessingError = {
      code: 'INVALID_INPUT',
      message: 'زاویه چرخش باید مضربی از ۹۰ درجه باشد',
    };
    throw new Error(error.message);
  }

  try {
    return await sharp(image)
      .rotate(angle)
      .toBuffer();
  } catch (error) {
    const processingError: ImageProcessingError = {
      code: 'PROCESSING_FAILED',
      message: error instanceof Error ? error.message : 'خطا در چرخش تصویر',
    };
    throw new Error(processingError.message);
  }
}
