'use client';

import { useState, useRef } from 'react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import { pdfToImages, type PdfToImageOptions, type PdfToImageItem } from './pdf-to-image.logic';

type SelectedFile = {
  file: File;
  url: string;
};

export default function PdfToImagePage() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<PdfToImageItem[]>([]);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(0.8);
  const [dpi, setDpi] = useState(150);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canConvert = selectedFile !== null && !busy;

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
    setImages([]);
  };

  const onConvert = async () => {
    if (!selectedFile) {
      return;
    }

    setError(null);
    setBusy(true);
    setProgress(0);

    try {
      const buffer = await selectedFile.file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      const options: PdfToImageOptions = {
        format,
        quality,
        dpi,
      };

      setProgress(20);
      const convertedImages = await pdfToImages(pdfBytes, options);
      setProgress(80);

      setImages(convertedImages);
      setProgress(100);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const downloadImage = async (image: PdfToImageItem) => {
    try {
      // Create a blob from the image data
      const blob = new Blob([image.imageData], { type: 'image/png' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `page-${image.pageNumber}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (e) {
      setError('خطا در دانلود تصویر');
    }
  };

  const downloadAllImages = async () => {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (image) {
        await downloadImage(image);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">PDF به تصویر</h1>
          <p className="text-lg text-slate-600">تبدیل صفحات PDF به تصاویر با کیفیت بالا</p>
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
                    فایل PDF خود را آپلود کنید
                  </p>
                  <p className="text-lg text-red-600 font-medium cursor-pointer hover:text-red-700">
                    انتخاب فایل PDF
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    از کامپیوتر آپلود کنید
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
                  {/* Format */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-sm font-medium text-slate-700">فرمت:</span>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setFormat('png')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          format === 'png'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        PNG
                      </button>
                      <button
                        onClick={() => setFormat('jpeg')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          format === 'jpeg'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        JPEG
                      </button>
                    </div>
                  </div>

                  {/* Quality */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-sm font-medium text-slate-700">کیفیت:</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-sm text-slate-600 w-10">{Math.round(quality * 100)}%</span>
                    </div>
                  </div>

                  {/* DPI */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-sm font-medium text-slate-700">DPI:</span>
                    <select
                      value={dpi}
                      onChange={(e) => setDpi(Number(e.target.value))}
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value={96}>96 (وب)</option>
                      <option value={150}>150 (استاندارد)</option>
                      <option value={300}>300 (چاپ)</option>
                    </select>
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
                    onClick={onConvert}
                    disabled={!canConvert}
                    className="px-6 py-2 text-sm"
                  >
                    تبدیل به تصویر
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
                    حجم: {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedFile(null);
                    setImages([]);
                  }}
                >
                  حذف فایل
                </Button>
              </div>
            </Card>

            {/* Results */}
            {images.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    تصاویر تبدیل شده ({images.length})
                  </h2>
                  <Button
                    type="button"
                    onClick={downloadAllImages}
                    className="text-sm"
                  >
                    دانلود همه
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="aspect-video bg-slate-100 rounded mb-3 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📄</div>
                          <p className="text-sm text-slate-600">صفحه {image.pageNumber}</p>
                          <p className="text-xs text-slate-500">
                            {Math.round(image.width)} × {Math.round(image.height)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-900">
                          صفحه {image.pageNumber}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => downloadImage(image)}
                        >
                          دانلود
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Bar */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  {selectedFile.file.name} • {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
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
                    onClick={onConvert}
                    disabled={!canConvert}
                    className="px-8 py-3"
                  >
                    {busy ? 'در حال تبدیل...' : 'تبدیل به تصویر'}
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
              <p className="text-lg font-semibold text-slate-900 mb-4">در حال تبدیل PDF به تصویر...</p>

              {progress > 0 && (
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              <p className="text-sm text-slate-600">
                {progress < 50 ? `در حال پردازش PDF (${Math.round(progress)}%)` :
                  progress < 80 ? `در حال تبدیل صفحات (${Math.round(progress)}%)` :
                    `در حال آماده‌سازی دانلود (${Math.round(progress)}%)`}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
