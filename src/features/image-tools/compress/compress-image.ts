import sharp from 'sharp';
import type { CompressionOptions, CompressionResult, ImageProcessingError } from '../types';

export async function compressImage(
  image: Buffer,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    quality = 80,
    maxWidth,
    maxHeight,
    format = 'jpeg',
    stripMetadata = true
  } = options;

  try {
    let pipeline = sharp(image);

    const originalSize = image.length;

    // Resize if dimensions are specified
    if (maxWidth || maxHeight) {
      pipeline = pipeline.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Configure format-specific options
    switch (format) {
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality, progressive: true });
        break;
      case 'png':
        pipeline = pipeline.png({ 
          quality: Math.round(quality / 10), // PNG quality is 0-9
          progressive: true 
        });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality });
        break;
      default:
        const error: ImageProcessingError = {
          code: 'UNSUPPORTED_FORMAT',
          message: `فرمت ${format} پشتیبانی نمی‌شود`
        };
        throw new Error(error.message);
    }

    // Strip metadata if requested
    if (stripMetadata) {
      // Note: withMetadata(false) may not be supported in all Sharp versions
      // This is a placeholder for metadata stripping functionality
    }

    const buffer = await pipeline.toBuffer();
    const compressedSize = buffer.length;
    const compressionRatio = originalSize > 0 ? (originalSize - compressedSize) / originalSize : 0;

    return {
      buffer,
      originalSize,
      compressedSize,
      compressionRatio,
      format
    };

  } catch (error) {
    const processingError: ImageProcessingError = {
      code: 'PROCESSING_FAILED',
      message: error instanceof Error ? error.message : 'خطا در پردازش تصویر'
    };
    throw new Error(processingError.message);
  }
}
