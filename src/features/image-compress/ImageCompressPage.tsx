import { useEffect, useMemo, useState, useRef } from 'react';
import { getSessionJson, setSessionJson } from '../../shared/storage/sessionStorage';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';
import type { ImageCompressPreset } from './imageCompress.presets';
import { presetLabelFa, presetRanges } from './imageCompress.presets';
import { compressImageToPreset, formatBytesFa, type ImageCompressResult } from './imageCompress.logic';

type ImageCompressFormState = {
  preset: ImageCompressPreset;
};

const sessionKey = 'image-compress.form.v1';

type Props = {
  compress?: (file: File, preset: ImageCompressPreset) => Promise<ImageCompressResult>;
};

export default function ImageCompressPage(props: Props) {
  const compress = props.compress ?? compressImageToPreset;

  const initial = useMemo<ImageCompressFormState>(() => {
    return (
      getSessionJson<ImageCompressFormState>(sessionKey) ?? {
        preset: 'medium'
      }
    );
  }, []);

  const [preset, setPreset] = useState<ImageCompressPreset>(initial.preset);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImageCompressResult | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canCompress = file && !busy;

  useEffect(() => {
    setSessionJson(sessionKey, { preset });
  }, [preset]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  async function onCompress() {
    setError(null);
    setResult(null);

    if (!file) {
      setError('لطفاً یک عکس انتخاب کنید.');
      return;
    }

    setBusy(true);
    try {
      const out = await compress(file, preset);
      setResult(out);

      if (outputUrl) URL.revokeObjectURL(outputUrl);
      const url = URL.createObjectURL(out.outputBlob);
      setOutputUrl(url);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setError(null);
    setResult(null);
    setFile(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
  }

  function onPickFile(selectedFile: File | null) {
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      setError('فقط فایل‌های تصویری قابل انتخاب هستند.');
      return;
    }
    setFile(selectedFile);
    setError(null);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    onPickFile(droppedFile);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">فشرده‌سازی عکس</h1>
          <p className="text-lg text-slate-600">کاهش حجم عکس‌ها با کیفیت بالا. پردازش کاملاً روی دستگاه شما انجام می‌شود.</p>
        </div>

        {!file ? (
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
                accept="image/*"
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="انتخاب عکس"
              />
              
              <div className="space-y-6">
                <div className="mx-auto h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900 mb-2">
                    عکس خود را برای فشرده‌سازی آپلود کنید
                  </p>
                  <p className="text-lg text-red-600 font-medium cursor-pointer hover:text-red-700">
                    عکس را انتخاب کنید
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    از کامپیوتر آپلود کنید. (PNG, JPG, WEBP)
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
                  {/* Compression Level */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-sm font-medium text-slate-700">سطح فشرده‌سازی:</span>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                      {(['very_low', 'medium', 'high'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPreset(p)}
                          className={`px-4 py-2 text-sm font-medium transition-colors ${
                            preset === p
                              ? 'bg-red-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {p === 'very_low' ? 'خیلی کم' : p === 'medium' ? 'متوسط' : 'بالا'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="text-sm text-slate-600">
                    حجم ورودی: <span className="font-semibold">{formatBytesFa(file.size)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm"
                  >
                    تغییر عکس
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onCompress}
                    disabled={!canCompress}
                    className="px-6 py-2"
                  >
                    فشرده‌سازی
                  </Button>
                </div>
              </div>
            </Card>

            {/* File Preview */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                عکس انتخاب شده
              </h2>
              
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Original Image */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">عکس اصلی</h3>
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      src={previewUrl!} 
                      alt="عکس اصلی" 
                    />
                  </div>
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600">حجم فایل</div>
                    <div className="text-lg font-semibold text-slate-900">{formatBytesFa(file.size)}</div>
                  </div>
                </div>

                {/* Compression Info */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">اطلاعات فشرده‌سازی</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">سطح فشرده‌سازی</div>
                      <div className="text-lg font-semibold text-slate-900">{presetLabelFa(preset)}</div>
                      <div className="text-sm text-slate-500 mt-1" dir="ltr">
                        هدف: {Math.round(presetRanges[preset].minBytes / 1024)}KB - {Math.round(presetRanges[preset].maxBytes / 1024)}KB
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>نکته:</strong> این ابزار برای کاهش حجم با حداقل افت کیفیت طراحی شده است. 
                        رسیدن دقیق به حجم مشخص همیشه ممکن نیست.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add More Files Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 space-x-reverse text-red-600 hover:text-red-700 font-medium"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>تغییر عکس</span>
                </button>
              </div>
            </Card>

            {/* Action Bar */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  عکس آماده فشرده‌سازی • حجم: {formatBytesFa(file.size)}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={reset}
                    disabled={busy}
                  >
                    پاک کردن
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onCompress}
                    disabled={!canCompress}
                    className="px-8 py-3"
                  >
                    {busy ? 'در حال فشرده‌سازی...' : 'فشرده‌سازی عکس'}
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

        {/* Result Section */}
        {result && outputUrl && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">نتیجه فشرده‌سازی</h2>
            
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Compressed Image */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">عکس فشرده شده</h3>
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                  <img 
                    className="w-full h-full object-cover" 
                    src={outputUrl} 
                    alt="عکس فشرده شده" 
                  />
                </div>
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">حجم فایل</div>
                  <div className="text-lg font-semibold text-green-900">{formatBytesFa(result.outputBytes)}</div>
                  <div className="text-sm text-green-600 mt-1">
                    کاهش حجم: {file ? Math.round((1 - result.outputBytes / file.size) * 100) : 0}%
                  </div>
                </div>
              </div>

              {/* Result Details */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">جزئیات خروجی</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600">ابعاد خروجی</div>
                    <div className="text-lg font-semibold text-slate-900" dir="ltr">
                      {result.outputWidth}×{result.outputHeight}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600">فرمت فایل</div>
                    <div className="text-lg font-semibold text-slate-900" dir="ltr">
                      {result.outputMimeType}
                    </div>
                  </div>

                  {result.noteFa && (
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <div className="text-sm text-amber-800">{result.noteFa}</div>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <div className="mt-6">
                  <a
                    className="inline-flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold rounded-lg transition-colors"
                    href={outputUrl}
                    download="compressed-image"
                  >
                    <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    دانلود عکس فشرده شده
                  </a>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {busy && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-slate-900">در حال فشرده‌سازی عکس...</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
