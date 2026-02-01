'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { toEnglishDigits } from '@/shared/utils/number';
import { createPdfWorkerClient, type PdfWorkerClient } from '@/features/pdf-tools/workerClient';

function parsePageRanges(input: string, totalPages: number): number[] {
  const normalized = toEnglishDigits(input).replaceAll(' ', '');
  if (normalized.length === 0) {
    throw new Error('لطفا شماره صفحات را وارد کنید.');
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
        result.add(i - 1);
      }
    } else {
      const page = Number(part);
      if (!Number.isFinite(page)) {
        throw new Error('شماره صفحه نامعتبر است.');
      }
      if (page < 1 || page > totalPages) {
        throw new Error('شماره صفحات باید داخل محدوده فایل باشد.');
      }
      result.add(page - 1);
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pagesInput, setPagesInput] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const workerRef = useRef<PdfWorkerClient | null>(null);

  useEffect(() => {
    workerRef.current = createPdfWorkerClient();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const onSelectFile = async (fileList: FileList | null) => {
    setError(null);
    setTotalPages(null);
    setDownloadUrl(null);

    if (!fileList || fileList.length === 0) {
      return;
    }

    const selected = fileList[0];
    if (!selected || selected.type !== 'application/pdf') {
      setError('فقط فایل PDF قابل انتخاب است.');
      return;
    }

    try {
      const worker = workerRef.current;
      if (!worker) {
        throw new Error('پردازشگر PDF آماده نیست.');
      }
      const buffer = await selected.arrayBuffer();
      const pages = await worker.countPages({ file: buffer });
      setTotalPages(pages);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
      return;
    }

    setFile(selected);
  };

  const onSplit = async () => {
    setError(null);
    setProgress(0);
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
      const buffer = await file.arrayBuffer();
      const pages = parsePageRanges(pagesInput, totalPages);
      if (pages.length === 0) {
        throw new Error('هیچ صفحه ای انتخاب نشده است.');
      }

      const worker = workerRef.current;
      if (!worker) {
        throw new Error('پردازشگر PDF آماده نیست.');
      }
      const result = await worker.request({ type: 'split', file: buffer, pages }, (value) => setProgress(Math.round(value * 100)));
      const blob = new Blob([result.buffer], { type: 'application/pdf' });

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">تقسیم PDF</h1>
          <p className="text-lg text-slate-600">صفحات دلخواه را از فایل PDF جدا کنید</p>
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

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700">صفحات مورد نظر</label>
            <input
              type="text"
              value={pagesInput}
              onChange={(e) => setPagesInput(e.target.value)}
              placeholder="مثال: 1-3,5,8"
              className="input-field"
            />
            <div className="text-xs text-slate-500">
              می توانید از بازه استفاده کنید (1-3) یا صفحات جداگانه را با کاما جدا کنید.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button type="button" variant="secondary" onClick={() => setFile(null)} disabled={busy || !file}>
              تغییر فایل
            </Button>
            <Button type="button" onClick={onSplit} disabled={busy}>
              {busy ? 'در حال استخراج...' : 'استخراج صفحات'}
            </Button>
          </div>

          {busy && (
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-slate-500">{progress}%</div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {downloadUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              فایل آماده است.{' '}
              <a className="font-semibold underline" href={downloadUrl} download="split.pdf">
                دانلود فایل
              </a>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
