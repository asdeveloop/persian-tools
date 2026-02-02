'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Button, Card } from '@/components/ui';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const QUALITY_MIN = 0.4;
const QUALITY_MAX = 0.95;

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(2)} ${units[index]}`;
};

type WorkerProgressHandler = (progress: number) => void;

type CompressResult = {
  buffer: ArrayBuffer;
  mimeType: string;
  width: number;
  height: number;
};

type PendingRequest = {
  resolve: (value: CompressResult) => void;
  reject: (reason?: unknown) => void;
  onProgress?: WorkerProgressHandler;
};

const createRequestId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function ImageCompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState(0.8);
  const [outputFormat, setOutputFormat] = useState<
    'auto' | 'image/jpeg' | 'image/webp' | 'image/png'
  >('auto');
  const [maxDimension, setMaxDimension] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultInfo, setResultInfo] = useState<CompressResult | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<string, PendingRequest>>(new Map());

  useEffect(() => {
    const worker = new Worker(new URL('./workers/image-compress.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;
    const pending = pendingRef.current;

    worker.onmessage = (event: MessageEvent) => {
      const message = event.data as {
        id: string;
        type: string;
        progress?: number;
        buffer?: ArrayBuffer;
        mimeType?: string;
        width?: number;
        height?: number;
        message?: string;
      };
      const pending = pendingRef.current.get(message.id);
      if (!pending) {
        return;
      }

      if (message.type === 'progress' && typeof message.progress === 'number') {
        pending.onProgress?.(message.progress);
        return;
      }

      if (message.type === 'error') {
        pendingRef.current.delete(message.id);
        pending.reject(new Error(message.message ?? 'خطای نامشخص رخ داد.'));
        return;
      }

      if (message.type === 'result' && message.buffer) {
        pendingRef.current.delete(message.id);
        pending.resolve({
          buffer: message.buffer,
          mimeType: message.mimeType ?? 'image/jpeg',
          width: message.width ?? 0,
          height: message.height ?? 0,
        });
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
      pending.clear();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      if (originalUrl) {
        URL.revokeObjectURL(originalUrl);
      }
    };
  }, [resultUrl, originalUrl]);

  useEffect(() => {
    if (!originalUrl) {
      setOriginalDimensions(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = originalUrl;

    return () => {
      img.onload = null;
    };
  }, [originalUrl]);

  const originalSize = selectedFile?.size ?? 0;
  const compressedSize = resultInfo?.buffer.byteLength ?? 0;
  const savings =
    compressedSize > 0 ? Math.max(0, ((originalSize - compressedSize) / originalSize) * 100) : 0;

  const outputMimeType = useMemo(() => {
    if (!selectedFile) {
      return 'image/jpeg';
    }
    if (outputFormat === 'auto') {
      if (selectedFile.type === 'image/png') {
        return 'image/png';
      }
      return 'image/webp';
    }
    return outputFormat;
  }, [selectedFile, outputFormat]);

  const clearSelection = () => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    setSelectedFile(null);
    setResultInfo(null);
    setResultUrl(null);
    setOriginalUrl(null);
    setProgress(0);
    setError(null);
  };

  const handleFileSelect = async (files: FileList | null) => {
    setError(null);
    setResultInfo(null);
    setProgress(0);

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('فقط فایل های JPG، PNG یا WebP قابل انتخاب هستند.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('حجم فایل بیش از حد مجاز است. حداکثر 20 مگابایت.');
      return;
    }

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }

    setSelectedFile(file);
    setOriginalUrl(URL.createObjectURL(file));
  };

  const requestCompression = (buffer: ArrayBuffer, onProgress?: WorkerProgressHandler) => {
    const worker = workerRef.current;
    if (!worker) {
      return Promise.reject(new Error('پردازشگر آماده نیست.'));
    }

    const id = createRequestId();
    return new Promise<CompressResult>((resolve, reject) => {
      pendingRef.current.set(id, { resolve, reject, onProgress });
      worker.postMessage(
        {
          id,
          type: 'compress',
          buffer,
          mimeType: selectedFile?.type ?? 'image/jpeg',
          outputType: outputMimeType,
          quality,
          maxWidth: maxDimension > 0 ? maxDimension : undefined,
          maxHeight: maxDimension > 0 ? maxDimension : undefined,
        },
        [buffer],
      );
    });
  };

  const onCompress = async () => {
    setError(null);
    setResultInfo(null);
    setProgress(0);

    if (!selectedFile) {
      setError('ابتدا تصویر را انتخاب کنید.');
      return;
    }

    setBusy(true);
    try {
      const buffer = await selectedFile.arrayBuffer();
      const result = await requestCompression(buffer, (value) =>
        setProgress(Math.round(value * 100)),
      );
      const blob = new Blob([result.buffer], { type: result.mimeType });
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
      setResultUrl(URL.createObjectURL(blob));
      setResultInfo(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">فشرده سازی تصویر</h1>
          <p className="text-lg text-[var(--text-secondary)]">
            فشرده سازی آفلاین با حفظ کیفیت و کنترل کامل
          </p>
        </div>

        {!selectedFile ? (
          <Card className="max-w-3xl mx-auto">
            <div className="border-2 border-dashed border-[var(--border-medium)] rounded-[var(--radius-lg)] p-16 text-center hover:border-[var(--color-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-[var(--motion-medium)]">
              <input
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="space-y-6">
                <div className="mx-auto h-20 w-20 rounded-full bg-[color-mix(in srgb, var(--color-primary) 15%, transparent)] flex items-center justify-center">
                  <svg
                    className="h-10 w-10 text-[var(--color-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    تصویر خود را برای فشرده سازی آپلود کنید
                  </p>
                  <p className="text-lg text-[var(--color-primary)] font-medium cursor-pointer">
                    انتخاب تصویر
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mt-2">
                    فرمت های مجاز: JPG، PNG، WebP | حداکثر 20 مگابایت
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {selectedFile.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    حجم: {formatBytes(originalSize)}
                  </p>
                </div>
                <Button type="button" variant="secondary" onClick={clearSelection}>
                  تغییر فایل
                </Button>
              </div>
            </Card>

            <Card className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="image-output-format"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    فرمت خروجی
                  </label>
                  <select
                    id="image-output-format"
                    className="input-field"
                    value={outputFormat}
                    onChange={(e) =>
                      setOutputFormat(
                        e.target.value as 'auto' | 'image/jpeg' | 'image/webp' | 'image/png',
                      )
                    }
                  >
                    <option value="auto">خودکار (پیشنهادی)</option>
                    <option value="image/webp">WebP</option>
                    <option value="image/jpeg">JPG</option>
                    <option value="image/png">PNG</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="image-quality"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    کیفیت
                  </label>
                  <input
                    id="image-quality"
                    type="range"
                    min={QUALITY_MIN}
                    max={QUALITY_MAX}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                  />
                  <div className="text-xs text-[var(--text-muted)]">
                    {Math.round(quality * 100)}%
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="image-max-dimension"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    حداکثر ضلع (اختیاری)
                  </label>
                  <input
                    id="image-max-dimension"
                    type="number"
                    min={0}
                    max={8000}
                    value={maxDimension}
                    onChange={(e) => setMaxDimension(Number(e.target.value))}
                    className="input-field"
                    placeholder="مثال: 1600"
                  />
                  <div className="text-xs text-[var(--text-muted)]">صفر یعنی بدون تغییر اندازه</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-[var(--text-muted)]">
                  فرمت خروجی: {outputMimeType.replace('image/', '').toUpperCase()}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={clearSelection}
                    disabled={busy}
                  >
                    انتخاب فایل دیگر
                  </Button>
                  <Button type="button" onClick={onCompress} disabled={busy}>
                    {busy ? 'در حال فشرده سازی...' : 'شروع فشرده سازی'}
                  </Button>
                </div>
              </div>

              {busy && (
                <div className="space-y-2">
                  <div className="w-full h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{progress}%</div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700" role="alert">
                    {error}
                  </p>
                </div>
              )}
            </Card>

            {originalUrl && resultUrl && resultInfo && (
              <Card className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                      قبل از فشرده سازی
                    </div>
                    <Image
                      src={originalUrl}
                      alt="تصویر اصلی"
                      width={Math.max(1, originalDimensions?.width ?? resultInfo.width)}
                      height={Math.max(1, originalDimensions?.height ?? resultInfo.height)}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                      className="w-full h-auto rounded-2xl border border-[var(--border-primary)]"
                    />
                    <div className="mt-2 text-xs text-[var(--text-muted)]">
                      {formatBytes(originalSize)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                      بعد از فشرده سازی
                    </div>
                    <Image
                      src={resultUrl}
                      alt="تصویر فشرده شده"
                      width={Math.max(1, resultInfo.width)}
                      height={Math.max(1, resultInfo.height)}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                      className="w-full h-auto rounded-2xl border border-[var(--border-primary)]"
                    />
                    <div className="mt-2 text-xs text-[var(--text-muted)]">
                      {formatBytes(compressedSize)} | صرفه جویی: {savings.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
                  <div>
                    ابعاد خروجی: {resultInfo.width}×{resultInfo.height}
                  </div>
                  <a
                    className="font-semibold underline"
                    href={resultUrl}
                    download={`compressed.${outputMimeType.split('/')[1]}`}
                  >
                    دانلود فایل
                  </a>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
