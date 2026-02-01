import sharp from 'sharp';
import type { ImageProcessingError } from '../types';

export async function convertToPng(image: Buffer): Promise<Buffer> {
  try {
    return await sharp(image)
      .png({ progressive: true })
      .toBuffer();
  } catch (error) {
    const processingError: ImageProcessingError = {
      code: 'PROCESSING_FAILED',
      message: error instanceof Error ? error.message : 'خطا در تبدیل به PNG'
    };
    throw new Error(processingError.message);
  }
}
