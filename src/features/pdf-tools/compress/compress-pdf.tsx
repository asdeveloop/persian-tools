'use client';

import { useState, useRef } from 'react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import { compressPdf, getCompressionInfo, type CompressPdfOptions } from './compress-pdf.logic';

type SelectedFile = {
  file: File;
  url: string;
};

type CompressionResult = {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  spaceSaved: number;
  compressedBlob: Blob;
};

export default function CompressPdfPage() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [removeImages, setRemoveImages] = useState(false);
  const [removeAnnotations, setRemoveAnnotations] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canCompress = selectedFile !== null && !busy;

  const handleFileSelect = async (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('فقط فایل‌های PDF قابل انتخاب هستند.');
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile({ file, url });
    setResult(null);
  };

  const onCompress = async () => {
    if (!selectedFile) {
      return;
    }

    setError(null);
    setBusy(true);
    setProgress(0);

    try {
      const buffer = await selectedFile.file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      const options: CompressPdfOptions = {
        quality,
        removeImages,
        removeAnnotations,
      };

      setProgress(30);
      const compressedBytes = await compressPdf(pdfBytes, options);
      setProgress(70);

      const compressionInfo = await getCompressionInfo(pdfBytes, compressedBytes);
      const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });

      setResult({
        ...compressionInfo,
        compressedBlob,
      });

      setProgress(100);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const downloadCompressed = () => {
    if (!result) {
      return;
    }

    const url = URL.createObjectURL(result.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-${selectedFile?.file.name ?? 'document.pdf'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2)) } ${ sizes[i]}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">فشرده‌سازی PDF</h1>
          <p className="text-lg text-slate-600">کاهش حجم فایل PDF بدون افت کیفیت قابل توجه</p>
        </div>

        {!selectedFile ? (
          /* Initial Upload State */
          <Card className="max-w-2xl mx-auto">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center hover:border-red-300 hover:bg-slate-50 transition-all duration-200">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="space-y-6">
                <div className="mx-auto h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900 mb-2">
                    فایل PDF خود را برای فشرده‌سازی آپلود کنید
                  </p>
                  <p className="text-lg text-red-600 font-medium cursor-pointer hover:text-red-700">
                    انتخاب فایل PDF
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    حداکثر حجم: 50 مگابایت
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          /* File Management State */
          <div className="space-y-6">
            {/* Settings Bar */}
            <Card className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6 space-x-reverse">
                  {/* Quality */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-sm font-medium text-slate-700">سطح فشرده‌سازی:</span>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setQuality(0.6)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          quality === 0.6
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        بالا
                      </button>
                      <button
                        onClick={() => setQuality(0.8)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          quality === 0.8
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        متوسط
                      </button>
                      <button
                        onClick={() => setQuality(0.95)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          quality === 0.95
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        کم
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={removeImages}
                        onChange={(e) => setRemoveImages(e.target.checked)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">حذف تصاویر</span>
                    </label>

                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={removeAnnotations}
                        onChange={(e) => setRemoveAnnotations(e.target.checked)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">حذف حاشیه‌نویسی‌ها</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm"
                  >
                    تغییر فایل
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onCompress}
                    disabled={!canCompress}
                    className="px-6 py-2 text-sm"
                  >
                    فشرده‌سازی
                  </Button>
                </div>
              </div>
            </Card>

            {/* File Info */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedFile.file.name}</h3>
                  <p className="text-sm text-slate-600">
                    حجم اصلی: {formatFileSize(selectedFile.file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedFile(null);
                    setResult(null);
                  }}
                >
                  حذف فایل
                </Button>
              </div>
            </Card>

            {/* Results */}
            {result && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">نتیجه فشرده‌سازی</h2>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">
                      {formatFileSize(result.originalSize)}
                    </div>
                    <div className="text-sm text-slate-600">حجم اصلی</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatFileSize(result.compressedSize)}
                    </div>
                    <div className="text-sm text-slate-600">حجم فشرده</div>
                  </div>

                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {result.compressionRatio.toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-600">کاهش حجم</div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    onClick={downloadCompressed}
                    className="px-8 py-3"
                  >
                    دانلود فایل فشرده
                  </Button>
                </div>
              </Card>
            )}

            {/* Action Bar */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  {selectedFile.file.name} • {formatFileSize(selectedFile.file.size)}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={busy}
                  >
                    انتخاب فایل دیگر
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onCompress}
                    disabled={!canCompress}
                    className="px-8 py-3"
                  >
                    {busy ? 'در حال فشرده‌سازی...' : 'فشرده‌سازی PDF'}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Loading State */}
        {busy && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 text-center max-w-sm w-full mx-4">
              <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-slate-900 mb-4">در حال فشرده‌سازی PDF...</p>

              {progress > 0 && (
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              <p className="text-sm text-slate-600">
                {progress < 50 ? `در حال پردازش فایل (${Math.round(progress)}%)` :
                  progress < 80 ? `در حال فشرده‌سازی (${Math.round(progress)}%)` :
                    `در حال آماده‌سازی دانلود (${Math.round(progress)}%)`}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
