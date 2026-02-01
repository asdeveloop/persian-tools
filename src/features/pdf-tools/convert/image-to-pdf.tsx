'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import type { DragEvent } from 'react';
import Image from 'next/image';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import { imagesToPdfBytes, type ImageToPdfOptions, type Orientation, type Margin, type PageSize } from './imageToPdf.logic';

type SelectedImage = {
  id: string;
  file: File;
  url: string;
};

function uid(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [margin, setMargin] = useState<Margin>('small');
  const [pageSize, setPageSize] = useState<PageSize>('original');
  const [quality, setQuality] = useState(0.8);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canConvert = images.length > 0 && !busy;

  useEffect(() => {
    return () => {
      for (const img of images) {
        URL.revokeObjectURL(img.url);
      }
    };
  }, [images]);

  const accept = useMemo(() => 'image/png,image/jpeg', []);

  function onPickFiles(files: FileList | null) {
    setError(null);
    if (!files || files.length === 0) {
      return;
    }

    const next: SelectedImage[] = [];
    for (const f of Array.from(files)) {
      if (f.type !== 'image/png' && f.type !== 'image/jpeg') {
        setError('فقط فایل‌های PNG و JPG قابل انتخاب هستند.');
        continue;
      }
      next.push({ id: uid(), file: f, url: URL.createObjectURL(f) });
    }

    setImages((prev) => [...prev, ...next]);
  }

  function remove(id: string) {
    setImages((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item) {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter((x) => x.id !== id);
    });
  }

  async function onConvert() {
    setError(null);
    setBusy(true);
    setProgress(0);

    try {
      const items: Array<{ name: string; mimeType: string; bytes: Uint8Array }> = [];

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img) {
          continue;
        }
        const buf = await img.file.arrayBuffer();
        items.push({ name: img.file.name, mimeType: img.file.type, bytes: new Uint8Array(buf) });
        setProgress(((i + 1) / images.length) * 50);
      }

      const options: ImageToPdfOptions = {
        orientation,
        margin,
        pageSize,
        quality,
      };

      setProgress(50);
      const pdfBytes = await imagesToPdfBytes(items, options);
      setProgress(90);

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
      setProgress(100);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onPickFiles(e.dataTransfer.files);
  };

  const handleDragStart = (e: DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleImageDrop = (e: DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) {
      return;
    }

    const draggedIndex = images.findIndex(img => img.id === draggedItem);
    const targetIndex = images.findIndex(img => img.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];
      if (draggedImage) {
        newImages.splice(draggedIndex, 1);
        newImages.splice(targetIndex, 0, draggedImage);
        setImages(newImages);
      }
    }

    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">JPG به PDF</h1>
          <p className="text-lg text-slate-600">تبدیل عکس‌های JPG به PDF در چند ثانیه. به راحتی جهت‌گیری و حاشیه‌ها را تنظیم کنید.</p>
        </div>

        {images.length === 0 ? (
          /* Initial Upload State */
          <Card className="max-w-2xl mx-auto">
            <div
              className={`
                relative border-2 border-dashed rounded-xl p-16 text-center transition-all duration-200
                ${isDragging
            ? 'border-red-400 bg-red-50'
            : 'border-slate-300 hover:border-red-300 hover:bg-slate-50'
          }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple
                onChange={(e) => onPickFiles(e.target.files)}
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
                    فایل خود را آپلود کنید و آن را تبدیل کنید.
                  </p>
                  <p className="text-lg text-red-600 font-medium cursor-pointer hover:text-red-700">
                    عکس‌های JPG را انتخاب کنید
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    از کامپیوتر آپلود کنید.
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
                  {/* Orientation */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-sm font-medium text-slate-700">جهت‌گیری:</span>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setOrientation('portrait')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          orientation === 'portrait'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        عمودی
                      </button>
                      <button
                        onClick={() => setOrientation('landscape')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          orientation === 'landscape'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        افقی
                      </button>
                    </div>
                  </div>

                  {/* Margin */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-sm font-medium text-slate-700">حاشیه:</span>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setMargin('none')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          margin === 'none'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        بدون حاشیه
                      </button>
                      <button
                        onClick={() => setMargin('small')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          margin === 'small'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        کوچک
                      </button>
                      <button
                        onClick={() => setMargin('big')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          margin === 'big'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        بزرگ
                      </button>
                    </div>
                  </div>

                  {/* Page Size */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-sm font-medium text-slate-700">اندازه صفحه:</span>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setPageSize('original')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          pageSize === 'original'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        اصلی
                      </button>
                      <button
                        onClick={() => setPageSize('a4')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          pageSize === 'a4'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        A4
                      </button>
                      <button
                        onClick={() => setPageSize('letter')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          pageSize === 'letter'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Letter
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
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm"
                  >
                    افزودن فایل بیشتر
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onConvert}
                    disabled={!canConvert}
                    className="px-6 py-2 text-sm"
                  >
                    تبدیل به PDF
                  </Button>
                </div>
              </div>
            </Card>

            {/* Files Grid */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                فایل‌های انتخاب شده ({images.length})
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className={`group relative border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-move ${
                      draggedItem === img.id ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, img.id)}
                    onDragOver={handleImageDragOver}
                    onDrop={(e) => handleImageDrop(e, img.id)}
                  >
                    <div className="aspect-square bg-slate-100 relative">
                      <Image
                        src={img.url}
                        alt={img.file.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => remove(img.id)}
                          className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                          title="حذف"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-sm font-medium text-slate-900 truncate" title={img.file.name}>
                        {img.file.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {(img.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Files Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 space-x-reverse text-red-600 hover:text-red-700 font-medium"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>افزودن فایل‌های بیشتر</span>
                </button>
              </div>
            </Card>

            {/* Action Bar */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  {images.length} فایل انتخاب شده • حجم کل: {(images.reduce((acc, img) => acc + img.file.size, 0) / 1024 / 1024).toFixed(2)} MB
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setImages([])}
                    disabled={busy}
                  >
                    پاک کردن همه
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onConvert}
                    disabled={!canConvert}
                    className="px-8 py-3"
                  >
                    {busy ? 'در حال تبدیل...' : 'تبدیل به PDF'}
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
              <p className="text-lg font-semibold text-slate-900 mb-4">در حال تبدیل عکس‌ها به PDF...</p>

              {progress > 0 && (
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              <p className="text-sm text-slate-600">
                {progress < 50 ? `در حال پردازش تصاویر (${Math.round(progress)}%)` :
                  progress < 90 ? `در حال ساخت PDF (${Math.round(progress)}%)` :
                    `در حال آماده‌سازی دانلود (${Math.round(progress)}%)`}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
