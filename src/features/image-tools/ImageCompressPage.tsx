import { useState, useRef } from 'react';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';

export default function ImageCompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file || !file.type.startsWith('image/')) {
      setError('فقط فایل‌های تصویری قابل انتخاب هستند.');
      return;
    }

    setSelectedFile(file);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">فشرده‌سازی تصویر</h1>
          <p className="text-lg text-slate-600">حجم تصاویر را بدون افت کیفیت قابل توجه کاهش دهید</p>
        </div>

        {!selectedFile ? (
          <Card className="max-w-2xl mx-auto">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center hover:border-blue-300 hover:bg-slate-50 transition-all duration-200">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-6">
                <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900 mb-2">
                    تصویر خود را برای فشرده‌سازی آپلود کنید
                  </p>
                  <p className="text-lg text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                    انتخاب تصویر
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    فرمت‌های مجاز: JPG, PNG, WebP
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedFile.name}</h3>
                  <p className="text-sm text-slate-600">
                    حجم: {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                >
                  تغییر فایل
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  {selectedFile.name} • {formatFileSize(selectedFile.size)}
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
                    onClick={() => {}}
                    disabled={busy}
                    className="px-8 py-3"
                  >
                    {busy ? 'در حال فشرده‌سازی...' : 'فشرده‌سازی تصویر'}
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
      </div>
    </div>
  );
}
