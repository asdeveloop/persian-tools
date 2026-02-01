import { useState, useRef } from 'react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import { addWatermark, validateWatermarkOptions, type WatermarkOptions } from './add-watermark.logic';

type SelectedFile = {
  file: File;
  url: string;
};

type WatermarkImage = {
  file: File;
  url: string;
  bytes: Uint8Array;
};

export default function AddWatermarkPage() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<WatermarkImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkText, setWatermarkText] = useState('محافظت شده');
  const [position, setPosition] = useState<'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('center');
  const [opacity, setOpacity] = useState(0.5);
  const [rotation, setRotation] = useState(45);
  const [size, setSize] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const canAddWatermark = selectedFile !== null && !busy && 
    (watermarkType === 'text' ? watermarkText.trim() : watermarkImage);

  const handleFileSelect = async (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('فقط فایل‌های PDF قابل انتخاب هستند.');
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile({ file, url });
  };

  const handleWatermarkImageSelect = async (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file || !file.type.startsWith('image/')) {
      setError('فقط فایل‌های تصویری قابل انتخاب هستند.');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const url = URL.createObjectURL(file);
      setWatermarkImage({ file, url, bytes });
    } catch (e) {
      setError('خطا در خواندن تصویر واترمارک');
    }
  };

  const onAddWatermark = async () => {
    if (!selectedFile) return;

    setError(null);
    setBusy(true);
    setProgress(0);

    try {
      const buffer = await selectedFile.file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      let content: string | Uint8Array;
      if (watermarkType === 'text') {
        content = watermarkText.trim();
      } else {
        content = watermarkImage!.bytes;
      }

      const options: WatermarkOptions = {
        type: watermarkType,
        content,
        position,
        opacity,
        rotation,
        size
      };

      const validation = validateWatermarkOptions(options);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      setProgress(30);
      const watermarkedBytes = await addWatermark(pdfBytes, options);
      setProgress(90);
      
      const blob = new Blob([watermarkedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked-${selectedFile.file.name}`;
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
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">افزودن واترمارک</h1>
          <p className="text-lg text-slate-600">متن یا لوگو را به صفحات PDF اضافه کنید</p>
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
                    فایل PDF خود را برای افزودن واترمارک آپلود کنید
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
            {/* File Info */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedFile.file.name}</h3>
                  <p className="text-sm text-slate-600">
                    حجم: {formatFileSize(selectedFile.file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedFile(null);
                    setWatermarkImage(null);
                  }}
                  disabled={busy}
                >
                  تغییر فایل
                </Button>
              </div>
            </Card>

            {/* Watermark Settings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">تنظیمات واترمارک</h2>
              
              <div className="space-y-6">
                {/* Watermark Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">نوع واترمارک:</label>
                  <div className="flex space-x-4 space-x-reverse">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="text"
                        checked={watermarkType === 'text'}
                        onChange={(e) => setWatermarkType(e.target.value as 'text')}
                        className="ml-2 border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">متن</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="image"
                        checked={watermarkType === 'image'}
                        onChange={(e) => setWatermarkType(e.target.value as 'image')}
                        className="ml-2 border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">تصویر</span>
                    </label>
                  </div>
                </div>

                {/* Content */}
                {watermarkType === 'text' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      متن واترمارک
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="متن واترمارک را وارد کنید"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      تصویر واترمارک
                    </label>
                    {watermarkImage ? (
                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <img 
                            src={watermarkImage.url} 
                            alt="Watermark" 
                            className="h-12 w-12 object-cover rounded"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{watermarkImage.file.name}</p>
                            <p className="text-xs text-slate-600">{formatFileSize(watermarkImage.file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setWatermarkImage(null)}
                        >
                          تغییر
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-red-300 hover:bg-slate-50 transition-all duration-200">
                        <input
                          ref={watermarkInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleWatermarkImageSelect(e.target.files)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-2">
                          <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-slate-600">انتخاب تصویر واترمارک</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">موقعیت:</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="center">مرکز</option>
                    <option value="top-left">بالا چپ</option>
                    <option value="top-right">بالا راست</option>
                    <option value="bottom-left">پایین چپ</option>
                    <option value="bottom-right">پایین راست</option>
                  </select>
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    شفافیت: {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    چرخش: {rotation}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="15"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    اندازه: {size}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="10"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>

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
                    onClick={onAddWatermark}
                    disabled={!canAddWatermark}
                    className="px-8 py-3"
                  >
                    {busy ? 'در حال افزودن واترمارک...' : 'افزودن واترمارک'}
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
              <p className="text-lg font-semibold text-slate-900 mb-4">در حال افزودن واترمارک...</p>
              
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
                 progress < 90 ? `در حال افزودن واترمارک (${Math.round(progress)}%)` :
                 `در حال آماده‌سازی دانلود (${Math.round(progress)}%)`}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
