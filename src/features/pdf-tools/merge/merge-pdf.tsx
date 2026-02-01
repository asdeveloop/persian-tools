import { useState, useRef } from 'react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import { mergePdfs, getPdfInfo, reorderItems, type MergePdfItem, type MergePdfOptions } from './merge-pdf.logic';

type SelectedFile = {
  id: string;
  file: File;
  url: string;
  order: number;
  pageCount?: number;
};

function uid(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function MergePdfPage() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [preserveBookmarks, setPreserveBookmarks] = useState(true);
  const [preserveForms, setPreserveForms] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canMerge = files.length > 1 && !busy;

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    setError(null);
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: SelectedFile[] = [];

    for (const file of Array.from(selectedFiles)) {
      if (file.type !== 'application/pdf') {
        setError(`فایل ${file.name} یک فایل PDF معتبر نیست.`);
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(buffer);
        const info = await getPdfInfo(pdfBytes);

        newFiles.push({
          id: uid(),
          file,
          url: URL.createObjectURL(file),
          order: files.length + newFiles.length,
          pageCount: info.pageCount
        });
      } catch (e) {
        setError(`خطا در خواندن فایل ${file.name}`);
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const item = prev.find(f => f.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter(f => f.id !== id).map((f, index) => ({ ...f, order: index }));
    });
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = files.findIndex(f => f.id === draggedItem);
    const targetIndex = files.findIndex(f => f.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      setFiles(prev => {
        const result = [...prev];
        const [draggedFile] = result.splice(draggedIndex, 1);
        result.splice(targetIndex, 0, draggedFile);
        return result.map((f, index) => ({ ...f, order: index }));
      });
    }

    setDraggedItem(null);
  };

  const onMerge = async () => {
    setError(null);
    setBusy(true);
    setProgress(0);

    try {
      const pdfItems: MergePdfItem[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await file.file.arrayBuffer();
        pdfItems.push({
          name: file.file.name,
          bytes: new Uint8Array(buffer),
          order: file.order
        });
        setProgress(((i + 1) / files.length) * 30);
      }

      const options: MergePdfOptions = {
        preserveBookmarks,
        preserveForms
      };

      setProgress(40);
      const mergedBytes = await mergePdfs(pdfItems, options);
      setProgress(90);
      
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">ادغام PDF</h1>
          <p className="text-lg text-slate-600">چندین فایل PDF را در یک فایل واحد ادغام کنید</p>
        </div>

        {files.length === 0 ? (
          /* Initial Upload State */
          <Card className="max-w-2xl mx-auto">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center hover:border-red-300 hover:bg-slate-50 transition-all duration-200">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
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
                    فایل‌های PDF خود را برای ادغام آپلود کنید
                  </p>
                  <p className="text-lg text-red-600 font-medium cursor-pointer hover:text-red-700">
                    انتخاب چندین فایل PDF
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    می‌توانید چندین فایل را همزمان انتخاب کنید
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
                  {/* Options */}
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={preserveBookmarks}
                        onChange={(e) => setPreserveBookmarks(e.target.checked)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">حفظ نشانک‌ها</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={preserveForms}
                        onChange={(e) => setPreserveForms(e.target.checked)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">حفظ فرم‌ها</span>
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
                    افزودن فایل بیشتر
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onMerge}
                    disabled={!canMerge}
                    className="px-6 py-2 text-sm"
                  >
                    ادغام فایل‌ها
                  </Button>
                </div>
              </div>
            </Card>

            {/* Files List */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                فایل‌های انتخاب شده ({files.length})
              </h2>
              
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-move hover:shadow-md transition-all duration-200 ${
                      draggedItem === file.id ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, file.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, file.id)}
                  >
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="text-lg font-medium text-slate-900 w-8">
                        {index + 1}
                      </div>
                      <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{file.file.name}</p>
                        <p className="text-sm text-slate-600">
                          {formatFileSize(file.file.size)} • {file.pageCount || 0} صفحه
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        حذف
                      </Button>
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
                  {files.length} فایل انتخاب شده • مجموع صفحات: {files.reduce((sum, f) => sum + (f.pageCount || 0), 0)}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      files.forEach(f => URL.revokeObjectURL(f.url));
                      setFiles([]);
                    }}
                    disabled={busy}
                  >
                    پاک کردن همه
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onMerge}
                    disabled={!canMerge}
                    className="px-8 py-3"
                  >
                    {busy ? 'در حال ادغام...' : 'ادغام فایل‌ها'}
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
              <p className="text-lg font-semibold text-slate-900 mb-4">در حال ادغام فایل‌های PDF...</p>
              
              {progress > 0 && (
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
              
              <p className="text-sm text-slate-600">
                {progress < 40 ? `در حال خواندن فایل‌ها (${Math.round(progress)}%)` :
                 progress < 90 ? `در حال ادغام (${Math.round(progress)}%)` :
                 `در حال آماده‌سازی دانلود (${Math.round(progress)}%)`}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
