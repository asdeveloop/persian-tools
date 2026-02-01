import { useState, useRef } from 'react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import { encryptPdf, validatePassword, getPasswordStrength, type EncryptPdfOptions } from './encrypt-pdf.logic';

type SelectedFile = {
  file: File;
  url: string;
};

export default function EncryptPdfPage() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [permissions, setPermissions] = useState({
    printing: true,
    copying: true,
    modifying: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canEncrypt = selectedFile !== null && !busy && password && password === confirmPassword;

  const handleFileSelect = async (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('فقط فایل‌های PDF قابل انتخاب هستند.');
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile({ file, url });
  };

  const onEncrypt = async () => {
    if (!selectedFile || !password) return;

    setError(null);
    setBusy(true);
    setProgress(0);

    try {
      const validation = validatePassword(password);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      if (password !== confirmPassword) {
        throw new Error('رمز عبور و تکرار آن یکسان نیستند.');
      }

      const buffer = await selectedFile.file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      const options: EncryptPdfOptions = {
        password,
        permissions
      };

      setProgress(30);
      const encryptedBytes = await encryptPdf(pdfBytes, options);
      setProgress(80);
      
      const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `encrypted-${selectedFile.file.name}`;
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

  const passwordStrength = getPasswordStrength(password);

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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">رمزگذاری PDF</h1>
          <p className="text-lg text-slate-600">روی فایل PDF رمز عبور قرار دهید و دسترسی‌ها را محدود کنید</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900 mb-2">
                    فایل PDF خود را برای رمزگذاری آپلود کنید
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
                    setPassword('');
                    setConfirmPassword('');
                  }}
                >
                  تغییر فایل
                </Button>
              </div>
            </Card>

            {/* Password Settings */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">تنظیمات رمز عبور</h2>
              
              <div className="space-y-6">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="رمز عبور مورد نظر را وارد کنید"
                  />
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600">قدرت رمز عبور:</span>
                        <span className={`text-sm font-medium text-${passwordStrength.color}-600`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`bg-${passwordStrength.color}-500 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    تکرار رمز عبور
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="رمز عبور را مجددا وارد کنید"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">رمز عبور و تکرار آن یکسان نیستند.</p>
                  )}
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    مجوزهای دسترسی
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permissions.printing}
                        onChange={(e) => setPermissions({...permissions, printing: e.target.checked})}
                        className="ml-2 border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">اجازه چاپ</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permissions.copying}
                        onChange={(e) => setPermissions({...permissions, copying: e.target.checked})}
                        className="ml-2 border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">اجازه کپی کردن متن</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permissions.modifying}
                        onChange={(e) => setPermissions({...permissions, modifying: e.target.checked})}
                        className="ml-2 border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-slate-700">اجازه ویرایش</span>
                    </label>
                  </div>
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
                    onClick={onEncrypt}
                    disabled={!canEncrypt}
                    className="px-8 py-3"
                  >
                    {busy ? 'در حال رمزگذاری...' : 'رمزگذاری PDF'}
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
              <p className="text-lg font-semibold text-slate-900 mb-4">در حال رمزگذاری PDF...</p>
              
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
                 progress < 80 ? `در حال اعمال رمز عبور (${Math.round(progress)}%)` :
                 `در حال آماده‌سازی دانلود (${Math.round(progress)}%)`}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
