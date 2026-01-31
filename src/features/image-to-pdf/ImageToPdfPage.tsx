import { useEffect, useMemo, useState } from 'react';
import { imagesToPdfBytes, type ImageToPdfItem } from './imageToPdf.logic';

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
    if (!files || files.length === 0) return;

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
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((x) => x.id !== id);
    });
  }

  async function onConvert() {
    setError(null);
    setBusy(true);

    try {
      const items: ImageToPdfItem[] = [];
      for (const img of images) {
        const buf = await img.file.arrayBuffer();
        items.push({ name: img.file.name, mimeType: img.file.type, bytes: new Uint8Array(buf) });
      }

      const pdfBytes = await imagesToPdfBytes(items);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'خطای نامشخص رخ داد.';
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4">
        <h1 className="text-lg font-bold">تبدیل عکس به PDF</h1>
        <p className="mt-2 text-sm text-slate-700">فایل‌ها فقط روی دستگاه شما پردازش می‌شوند و به جایی ارسال نمی‌شوند.</p>
      </div>

      <div className="rounded-lg bg-white p-4">
        <label className="block text-sm font-medium" htmlFor="images">
          انتخاب عکس‌ها (PNG / JPG)
        </label>
        <input
          id="images"
          className="mt-2 block w-full text-sm"
          type="file"
          accept={accept}
          multiple
          onChange={(e) => onPickFiles(e.target.files)}
        />

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            onClick={onConvert}
            disabled={!canConvert}
          >
            {busy ? 'در حال ساخت PDF...' : 'ساخت PDF و دانلود'}
          </button>
          {error ? <div className="text-sm text-red-700">{error}</div> : null}
        </div>
      </div>

      {images.length > 0 ? (
        <div className="rounded-lg bg-white p-4">
          <h2 className="text-base font-bold">فایل‌های انتخاب‌شده</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="rounded-md border border-slate-200 p-2">
                <img className="h-40 w-full rounded object-cover" src={img.url} alt={img.file.name} />
                <div className="mt-2 text-xs text-slate-700" dir="ltr">
                  {img.file.name}
                </div>
                <button
                  type="button"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                  onClick={() => remove(img.id)}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
