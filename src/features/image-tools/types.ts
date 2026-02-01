export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export type CompressionOptions = {
  quality?: number; // 0–100
  maxWidth?: number;
  maxHeight?: number;
  format?: ImageFormat;
  stripMetadata?: boolean;
};

export type CompressionResult = {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: string;
};

export type ResizeOptions = {
  width?: number;
  height?: number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
};

export type RotateOptions = {
  angle: number; // degrees
};

export type CropOptions = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ImageProcessingError = {
  code: 'INVALID_INPUT' | 'PROCESSING_FAILED' | 'UNSUPPORTED_FORMAT';
  message: string;
};
