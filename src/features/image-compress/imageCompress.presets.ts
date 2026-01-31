export type ImageCompressPreset = 'very_low' | 'medium' | 'high';

export type ByteRange = {
  minBytes: number;
  maxBytes: number;
};

export const presetRanges: Record<ImageCompressPreset, ByteRange> = {
  very_low: { minBytes: 0, maxBytes: 150 * 1024 },
  medium: { minBytes: 150 * 1024, maxBytes: 250 * 1024 },
  high: { minBytes: 250 * 1024, maxBytes: 400 * 1024 }
};

export function presetLabelFa(preset: ImageCompressPreset): string {
  switch (preset) {
    case 'very_low':
      return 'حجم خیلی کم (کمتر از ۱۵۰ کیلوبایت)';
    case 'medium':
      return 'حجم متوسط (۱۵۰ تا ۲۵۰ کیلوبایت)';
    case 'high':
      return 'حجم بالا (۲۵۰ تا ۴۰۰ کیلوبایت)';
  }
}
