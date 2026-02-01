'use client';

import { useEffect, useMemo, useState } from 'react';
import JSZip from 'jszip';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import { Button, Card } from '@/components/ui';
import { toEnglishDigits } from '@/shared/utils/number';

type OutputImage = {
  page: number;
  url: string;
  size: number;
  blob: Blob;
};

type OutputFormat = 'png' | 'jpeg';

type ScaleOption = 1 | 1.5 | 2;

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(2)} ${units[index]}`;
}

function parsePageRanges(input: string, totalPages: number): number[] {
  const normalized = toEnglishDigits(input).replaceAll(' ', '').toLowerCase();
  if (normalized.length === 0 || normalized === 'all') {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const result = new Set<number>();
  const parts = normalized.split(',').filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startRaw, endRaw] = part.split('-');
      const start = Number(startRaw);
      const end = Number(endRaw);
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        throw new Error('فرمت بازه صفحات صحیح نیست.');
      }
      if (start < 1 || end < 1 || start > totalPages || end > totalPages) {
        throw new Error('شماره صفحات باید داخل محدوده فایل باشد.');
      }
      const from = Math.min(start, end);
      const to = Math.max(start, end);
      for (let i = from; i <= to; i += 1) {
        result.add(i);
      }
    } else {
      const page = Number(part);
      if (!Number.isFinite(page)) {
        throw new Error('شماره صفحه نامعتبر است.');
      }
      if (page < 1 || page > totalPages) {
        throw new Error('شماره صفحات باید داخل محدوده فایل باشد.');
      }
      result.add(page);
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

async function renderPageToImage(
  page: PDFPageProxy,
  format: OutputFormat,
  scale: ScaleOption,
  quality: number,
): Promise<{ blob: Blob; width: number; height: number }> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    throw new Error('مرورگر از پردازش تصویر پشتیبانی نمی کند.');
  }

  await page.render({ canvasContext: context, viewport }).promise;

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, format === 'png' ? 'image/png' : 'image/jpeg', quality);
  });

  if (!blob) {
    throw new Error('تبدیل صفحه ناموفق بود.');
  }

  return { blob, width: canvas.width, height: canvas.height };
}

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pagesInput, setPagesInput] = useState('all');
  const [format, setFormat] = useState<OutputFormat>('png');
  const [scale, setScale] = useState<ScaleOption>(1.5);
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<OutputImage[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);

  useEffect(() => {
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString();
  }, []);

  useEffect(() => {
    return () => {
      outputs.forEach((item) => URL.revokeObjectURL(item.url));
      if (zipUrl) {
        URL.revokeObjectURL(zipUrl);
      }
    };
  }, [outputs, zipUrl]);

  const totalOutputSize = useMemo(() => outputs.reduce((sum, item) => sum + item.size, 0), [outputs]);

  const onSelectFile = async (fileList: FileList | null) => {
    setError(null);
    setOutputs([]);
    setTotalPages(null);
    setZipUrl(null);

    if (!fileList || fileList.length === 0) {
      return;
    }

    const selected = fileList[0];
    if (!selected || selected.type !== 'application/pdf') {
      setError('فقط فایل PDF قابل انتخاب است.');
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise;
      setTotalPages(pdf.numPages);
      setFile(selected);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    }
  };

  const onConvert = async () => {
    setError(null);
    if (!file) {
      setError('ابتدا فایل PDF را انتخاب کنید.');
      return;
    }
    if (!totalPages) {
      setError('تعداد صفحات فایل مشخص نیست.');
      return;
    }

    setBusy(true);
    try {
      const pages = parsePageRanges(pagesInput, totalPages);
      const buffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise;
      const results: OutputImage[] = [];

      for (const pageNumber of pages) {
        const page = await pdf.getPage(pageNumber);
        const { blob } = await renderPageToImage(page, format, scale, quality);
        const url = URL.createObjectURL(blob);
        results.push({ page: pageNumber, url, size: blob.size, blob });
      }

      outputs.forEach((item) => URL.revokeObjectURL(item.url));
      setOutputs(results);
      setZipUrl(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const onDownloadAll = async () => {
    setError(null);
    if (outputs.length === 0) {
      setError('ابتدا خروجی ایجاد کنید.');
      return;
    }
    setZipBusy(true);
    try {
      const zip = new JSZip();
      outputs.forEach((item) => {
        zip.file(`page-${item.page}.${format}`, item.blob);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      if (zipUrl) {
        URL.revokeObjectURL(zipUrl);
      }
      setZipUrl(URL.createObjectURL(blob));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setZipBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">تبدیل PDF به عکس</h1>
          <p className="text-lg text-slate-600">صفحات PDF را به تصویر PNG یا JPG تبدیل کنید</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700">انتخاب فایل PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => onSelectFile(e.target.files)}
              className="input-field"
            />
          </div>

          {file && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              {file.name} | تعداد صفحات: {totalPages ?? '-'}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">صفحات مورد نظر</label>
              <input
                type="text"
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                placeholder="all یا 1-3,5"
                className="input-field"
              />
              <div className="text-xs text-slate-500">
                برای همه صفحات مقدار all را وارد کنید.
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">فرمت خروجی</label>
                <select
                  className="input-field"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPG</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">کیفیت</label>
                <select
                  className="input-field"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value) as ScaleOption)}
                >
                  <option value={1}>عادی</option>
                  <option value={1.5}>بالا</option>
                  <option value={2}>خیلی بالا</option>
                </select>
              </div>
            </div>
          </div>

          {format === 'jpeg' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">فشرده سازی JPG</label>
              <input
                type="range"
                min={0.5}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
              <div className="text-xs text-slate-500">کیفیت: {(quality * 100).toFixed(0)}%</div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button type="button" variant="secondary" onClick={() => setFile(null)} disabled={busy || !file}>
              تغییر فایل
            </Button>
            <Button type="button" onClick={onConvert} disabled={busy}>
              {busy ? 'در حال تبدیل...' : 'تبدیل به تصویر'}
            </Button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </Card>

        {outputs.length > 0 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div>تعداد خروجی: {outputs.length}</div>
              <div>حجم کل: {formatBytes(totalOutputSize)}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button type="button" variant="secondary" onClick={onDownloadAll} disabled={zipBusy}>
                {zipBusy ? 'در حال آماده سازی...' : 'دانلود همه (ZIP)'}
              </Button>
              {zipUrl && (
                <a className="text-sm font-semibold underline text-emerald-700" href={zipUrl} download={`pdf-pages-${Date.now()}.zip`}>
                  دانلود فایل ZIP
                </a>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {outputs.map((item) => (
                <div key={item.url} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="text-sm font-semibold text-slate-700">صفحه {item.page}</div>
                  <img src={item.url} alt={`page-${item.page}`} className="w-full rounded-lg border" />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div>{formatBytes(item.size)}</div>
                    <a className="font-semibold underline" href={item.url} download={`page-${item.page}.${format}`}>
                      دانلود
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
