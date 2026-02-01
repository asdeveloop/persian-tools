'use client';

import { useState, useRef } from 'react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import { 
  splitPdf, 
  validatePageRanges, 
  suggestSplitOptions, 
  type SplitPdfOptions, 
  type SplitPdfResult 
} from './split-pdf.logic';

type SelectedFile = {
  file: File;
  url: string;
  pageCount?: number;
};

export default function SplitPdfPage() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SplitPdfResult[]>([]);
  const [splitMode, setSplitMode] = useState<'individual' | 'ranges'>('individual');
  const [pageRanges, setPageRanges] = useState<string[]>(['1-5', '6-10']);
  const [newRange, setNewRange] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSplit = selectedFile !== null && !busy;

  const handleFileSelect = async (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('فقط فایل‌های PDF قابل انتخاب هستند.');
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const pageCount = 10; // Placeholder
      
      setSelectedFile({ file, url, pageCount });
      setResults([]);
      
      // Suggest split options
      const suggestions = suggestSplitOptions(pageCount);
      if (suggestions.ranges.length > 0) {
        setPageRanges(suggestions.ranges);
      }
    } catch (e) {
      setError('خطا در خواندن فایل PDF');
    }
  };

  const addRange = () => {
    if (newRange.trim() && !pageRanges.includes(newRange.trim())) {
      setPageRanges([...pageRanges, newRange.trim()]);
      setNewRange('');
    }
  };

  const removeRange = (index: number) => {
    setPageRanges(pageRanges.filter((_, i) => i !== index));
  };

  const onSplit = async () => {
    if (!selectedFile) return;

    setError(null);
    setBusy(true);
    setProgress(0);

    try {
      const buffer = await selectedFile.file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      let options: SplitPdfOptions = {
        splitBy: 'pages'
      };

      if (splitMode === 'ranges') {
        const validation = validatePageRanges(pageRanges, selectedFile.pageCount || 0);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        options.ranges = pageRanges;
      }

      setProgress(20);
      const splitResults = await splitPdf(pdfBytes, options);
      setProgress(90);
      
      setResults(splitResults);
      setProgress(100);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const downloadResult = (result: SplitPdfResult) => {
    const blob = new Blob([result.bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    URL.revokeObjectURL(url);
  };

  const downloadAllResults = async () => {
    for (const result of results) {
      downloadResult(result);
      await new Promise(resolve => setTimeout(resolve, 100));
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">تقسیم PDF</h1>
          <p className="text-lg text-slate-600">فایل PDF را به صفحات یا بخش‌های جداگانه تقسیم کنید</p>
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
                    فایل PDF خود را برای تقسیم آپلود کنید
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
                    حجم: {formatFileSize(selectedFile.file.size)} • {selectedFile.pageCount || 0} صفحه
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedFile(null);
                    setResults([]);
                  }}
                >
                  تغییر فایل
                </Button>
              </div>
            </Card>

            {/* Split Options */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">گزینه‌های تقسیم</h2>
              
              <div className="space-y-6">
                {/* Split Mode */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">نوع تقسیم:</label>
                  <div className="flex space-x-4 space-x-reverse">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="individual"
                        checked={splitMode === 'individual'}
                        onChange={(e) => setSplitMode(e.target.value as 'individual')}
                        className="ml-2 border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">تقسیم هر صفحه به صورت جداگانه</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="ranges"
                        checked={splitMode === 'ranges'}
                        onChange={(e) => setSplitMode(e.target.value as 'ranges')}
                        className="ml-2 border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">تقسیم بر اساس محدوده صفحات</span>
                    </label>
                  </div>
                </div>

                {/* Page Ranges */}
                {splitMode === 'ranges' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">محدوده صفحات:</label>
                    <div className="space-y-3">
                      {pageRanges.map((range, index) => (
                        <div key={index} className="flex items-center space-x-2 space-x-reverse">
                          <span className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-mono">
                            {range}
                          </span>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => removeRange(index)}
                          >
                            حذف
                          </Button>
                        </div>
                      ))}
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="text"
                          value={newRange}
                          onChange={(e) => setNewRange(e.target.value)}
                          placeholder="مثال: 1-5 یا 3,7,10-15"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <Button
                          type="button"
                          onClick={addRange}
                          disabled={!newRange.trim()}
                        >
                          افزودن
                        </Button>
                      </div>
                      
                      <p className="text-xs text-slate-500">
                        می‌توانید از فرمت‌های زیر استفاده کنید: 1-5 (صفحات 1 تا 5)، 3,7,10 (صفحات 3، 7 و 10)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Results */}
            {results.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    فایل‌های تقسیم شده ({results.length})
                  </h2>
                  <Button
                    type="button"
                    onClick={downloadAllResults}
                    className="text-sm"
                  >
                    دانلود همه
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((result, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="aspect-video bg-slate-100 rounded mb-3 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📄</div>
                          <p className="text-sm text-slate-600">{result.pages.length} صفحه</p>
                          <p className="text-xs text-slate-500">
                            صفحات: {result.pages.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-900 truncate">
                          {result.filename}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => downloadResult(result)}
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
                    onClick={onSplit}
                    disabled={!canSplit}
                    className="px-8 py-3"
                  >
                    {busy ? 'در حال تقسیم...' : 'تقسیم PDF'}
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
              <p className="text-lg font-semibold text-slate-900 mb-4">در حال تقسیم PDF...</p>
              
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
                 progress < 90 ? `در حال تقسیم صفحات (${Math.round(progress)}%)` :
                 `در حال آماده‌سازی دانلود (${Math.round(progress)}%)`}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
