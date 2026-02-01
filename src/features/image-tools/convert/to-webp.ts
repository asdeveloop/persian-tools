import sharp from 'sharp';
import type { ImageProcessingError } from '../types';

export async function convertToWebp(image: Buffer): Promise<Buffer> {
  try {
    return await sharp(image)
      .webp({ quality: 80 })
      .toBuffer();
  } catch (error) {
    const processingError: ImageProcessingError = {
      code: 'PROCESSING_FAILED',
      message: error instanceof Error ? error.message : 'خطا در تبدیل به WebP'
    };
    throw new Error(processingError.message);
  }
}
