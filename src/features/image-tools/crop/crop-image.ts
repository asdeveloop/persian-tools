import sharp from 'sharp';
import type { CropOptions, ImageProcessingError } from '../types';

export async function cropImage(
  image: Buffer,
  options: CropOptions,
): Promise<Buffer> {
  const { top, left, width, height } = options;

  // Validate input parameters
  if (typeof top !== 'number' || typeof left !== 'number' ||
      typeof width !== 'number' || typeof height !== 'number') {
    const error: ImageProcessingError = {
      code: 'INVALID_INPUT',
      message: 'تمام پارامترهای برش باید از نوع عدد باشند',
    };
    throw new Error(error.message);
  }

  if (width <= 0 || height <= 0) {
    const error: ImageProcessingError = {
      code: 'INVALID_INPUT',
      message: 'عرض و ارتفاع برش باید بزرگتر از صفر باشند',
    };
    throw new Error(error.message);
  }

  if (top < 0 || left < 0) {
    const error: ImageProcessingError = {
      code: 'INVALID_INPUT',
      message: 'مختصات برش نمی‌توانند منفی باشند',
    };
    throw new Error(error.message);
  }

  try {
    // Get image metadata to validate crop dimensions
    const metadata = await sharp(image).metadata();

    if (!metadata.width || !metadata.height) {
      const error: ImageProcessingError = {
        code: 'PROCESSING_FAILED',
        message: 'نمی‌توان ابعاد تصویر را تشخیص داد',
      };
      throw new Error(error.message);
    }

    // Validate crop area is within image bounds
    if (left + width > metadata.width || top + height > metadata.height) {
      const error: ImageProcessingError = {
        code: 'INVALID_INPUT',
        message: 'ناحیه برش خارج از ابعاد تصویر است',
      };
      throw new Error(error.message);
    }

    return await sharp(image)
      .extract({
        left: Math.round(left),
        top: Math.round(top),
        width: Math.round(width),
        height: Math.round(height),
      })
      .toBuffer();

  } catch (error) {
    const processingError: ImageProcessingError = {
      code: 'PROCESSING_FAILED',
      message: error instanceof Error ? error.message : 'خطا در برش تصویر',
    };
    throw new Error(processingError.message);
  }
}
