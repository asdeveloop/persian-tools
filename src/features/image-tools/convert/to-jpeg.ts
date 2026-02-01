import sharp from 'sharp';
import type { ImageProcessingError } from '../types';

export async function convertToJpeg(image: Buffer): Promise<Buffer> {
  try {
    return await sharp(image)
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();
  } catch (error) {
    const processingError: ImageProcessingError = {
      code: 'PROCESSING_FAILED',
      message: error instanceof Error ? error.message : 'خطا در تبدیل به JPEG'
    };
    throw new Error(processingError.message);
  }
}
