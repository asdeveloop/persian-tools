import type { ByteRange, ImageCompressPreset } from './imageCompress.presets';
import { presetRanges } from './imageCompress.presets';

export type ImageCompressResult = {
  outputBlob: Blob;
  outputMimeType: string;
  outputBytes: number;
  outputWidth: number;
  outputHeight: number;
  noteFa: string | null;
};

export type ImageCompressEnv = {
  createImageBitmap: (file: Blob) => Promise<ImageBitmap>;
  createCanvas: () => HTMLCanvasElement;
};

const defaultEnv: ImageCompressEnv = {
  createImageBitmap: (file) => globalThis.createImageBitmap(file),
  createCanvas: () => document.createElement('canvas')
};

function isWithinRange(bytes: number, range: ByteRange): boolean {
  return bytes >= range.minBytes && bytes <= range.maxBytes;
}

async function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('ساخت فایل خروجی ناموفق بود.'));
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

async function detectBestMimeType(canvas: HTMLCanvasElement): Promise<string> {
  try {
    const b = await canvasToBlob(canvas, 'image/webp', 0.92);
    if (b.size > 0) return 'image/webp';
  } catch {
    return 'image/jpeg';
  }
  return 'image/jpeg';
}

function drawToCanvas(canvas: HTMLCanvasElement, bitmap: ImageBitmap, scale: number): {
  width: number;
  height: number;
} {
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('مرورگر شما از Canvas پشتیبانی نمی‌کند.');

  // پس‌زمینه سفید برای تصاویر دارای شفافیت (در خروجی JPEG)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);

  return { width: w, height: h };
}

export async function compressImageToPreset(
  file: File,
  preset: ImageCompressPreset,
  env: ImageCompressEnv = defaultEnv
): Promise<ImageCompressResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('لطفاً یک فایل تصویر انتخاب کنید.');
  }

  const range = presetRanges[preset];
  const bitmap = await env.createImageBitmap(file);
  const canvas = env.createCanvas();

  let scale = 1;
  let lastBlob: Blob | null = null;
  let lastMime = 'image/jpeg';
  let lastW = bitmap.width;
  let lastH = bitmap.height;

  for (let scaleStep = 0; scaleStep < 8; scaleStep += 1) {
    const { width, height } = drawToCanvas(canvas, bitmap, scale);
    lastW = width;
    lastH = height;

    const mimeType = await detectBestMimeType(canvas);
    lastMime = mimeType;

    let lowQ = 0.5;
    let highQ = 0.98;
    let bestBlob: Blob | null = null;

    for (let i = 0; i < 10; i += 1) {
      const q = (lowQ + highQ) / 2;
      const blob = await canvasToBlob(canvas, mimeType, q);

      if (isWithinRange(blob.size, range)) {
        bestBlob = blob;
        break;
      }

      // اگر بزرگ‌تر از سقف بود، کیفیت را کم می‌کنیم
      if (blob.size > range.maxBytes) {
        highQ = q;
      } else {
        // اگر کوچک‌تر از کف بود، کیفیت را زیاد می‌کنیم
        lowQ = q;
        bestBlob = blob;
      }
    }

    lastBlob = bestBlob;
    if (lastBlob && isWithinRange(lastBlob.size, range)) {
      return {
        outputBlob: lastBlob,
        outputMimeType: lastMime,
        outputBytes: lastBlob.size,
        outputWidth: lastW,
        outputHeight: lastH,
        noteFa: null
      };
    }

    // اگر هنوز بزرگ است، scale را کم می‌کنیم.
    if (lastBlob && lastBlob.size > range.maxBytes) {
      scale = Math.max(0.25, scale * 0.88);
      continue;
    }

    // اگر خیلی کوچک است، دیگر کاری نمی‌شود کرد (نمی‌خواهیم بزرگ‌نمایی کنیم)
    if (lastBlob && lastBlob.size < range.minBytes) {
      return {
        outputBlob: lastBlob,
        outputMimeType: lastMime,
        outputBytes: lastBlob.size,
        outputWidth: lastW,
        outputHeight: lastH,
        noteFa: 'حجم تصویر خروجی کمتر از بازه‌ی انتخاب‌شده شد (تصویر ورودی کوچک بوده است).'
      };
    }

    // fallback: یک مرحله scale کمتر و ادامه
    scale = Math.max(0.25, scale * 0.88);
  }

  if (!lastBlob) {
    throw new Error('فشرده‌سازی ناموفق بود.');
  }

  return {
    outputBlob: lastBlob,
    outputMimeType: lastMime,
    outputBytes: lastBlob.size,
    outputWidth: lastW,
    outputHeight: lastH,
    noteFa: 'به بازه‌ی دقیق نرسیدیم، اما بهترین نتیجه‌ی ممکن تولید شد.'
  };
}

export function formatBytesFa(bytes: number): string {
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(kb)} کیلوبایت`;
  }
  const mb = kb / 1024;
  return `${new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(mb)} مگابایت`;
}
