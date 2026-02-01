'use client';

import { useState, useRef } from 'react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import { decryptPdf, verifyPassword, checkPdfProtection } from './decrypt-pdf.logic';

type SelectedFile = {
  file: File;
  url: string;
  isProtected?: boolean;
};

export default function DecryptPdfPage() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canDecrypt = selectedFile !== null && !busy && password;

  const handleFileSelect = async (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('فقط فایل‌های PDF قابل انتخاب هستند.');
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      setSelectedFile({ file, url });
      setPassword('');
      
      // Check if file is protected
      setIsChecking(true);
      const buffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);
      const protection = await checkPdfProtection(pdfBytes);
      
      setSelectedFile({ file, url, isProtected: protection.isEncrypted });
      setIsChecking(false);
      
      if (!protection.isEncrypted) {
        setError('این فایل PDF رمزگذاری نشده است.');
      }
    } catch (e) {
      setError('خطا در خواندن فایل PDF');
      setIsChecking(false);
    }
  };

  const onDecrypt = async () => {
    if (!selectedFile || !password) return;

    setError(null);
    setBusy(true);
    setProgress(0);

    try {
      const buffer = await selectedFile.file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      setProgress(30);
      
      // First verify password
      const isValid = await verifyPassword(pdfBytes, password);
      if (!isValid) {
        throw new Error('رمز عبور اشتباه است.');
      }

      setProgress(60);
      const decryptedBytes = await decryptPdf(pdfBytes, password);
      setProgress(90);
      
      const blob = new Blob([decryptedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `decrypted-${selectedFile.file.name}`;
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">حذف رمز PDF</h1>
          <p className="text-lg text-slate-600">رمز عبور فایل PDF را حذف کرده و به آن دسترسی پیدا کنید</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900 mb-2">
                    فایل PDF رمزگذاری شده را آپلود کنید
                  </p>
                  <p className="text-lg text-red-600 font-medium cursor-pointer hover:text-red-700">
                    انتخاب فایل PDF
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    فایل‌های رمزگذاری شده را برای حذف رمز عبور آپلود کنید
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
                    {selectedFile.isProtected !== undefined && (
                      <span className="mr-2">
                        • وضعیت: {selectedFile.isProtected ? 
                          <span className="text-red-600 font-medium">رمزگذاری شده</span> : 
                          <span className="text-green-600 font-medium">بدون رمز عبور</span>
                        }
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedFile(null);
                    setPassword('');
                  }}
                  disabled={busy}
                >
                  تغییر فایل
                </Button>
              </div>
            </Card>

            {/* Password Input */}
            {selectedFile.isProtected && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">رمز عبور</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      رمز عبور فایل PDF را وارد کنید
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="رمز عبور را وارد کنید"
                      disabled={busy}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="h-5 w-5 text-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">نکات مهم:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                          <li>رمز عبور را به دقت وارد کنید</li>
                          <li>رمز عبور به بزرگی و کوچکی حروف حساس است</li>
                          <li>در صورت فراموشی رمز عبور، امکان بازیابی وجود ندارد</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
                  {selectedFile.isProtected && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={onDecrypt}
                      disabled={!canDecrypt}
                      className="px-8 py-3"
                    >
                      {busy ? 'در حال باز کردن قفل...' : 'حذف رمز عبور'}
                    </Button>
                  )}
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
              <p className="text-lg font-semibold text-slate-900 mb-4">در حال باز کردن قفل PDF...</p>
              
              {progress > 0 && (
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
              
              <p className="text-sm text-slate-600">
                {progress < 40 ? `در حال تایید رمز عبور (${Math.round(progress)}%)` :
                 progress < 80 ? `در حال حذف رمز عبور (${Math.round(progress)}%)` :
                 `در حال آماده‌سازی دانلود (${Math.round(progress)}%)`}
              </p>
            </Card>
          </div>
        )}

        {/* Checking State */}
        {isChecking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 text-center max-w-sm w-full mx-4">
              <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-slate-900">در حال بررسی وضعیت فایل...</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
