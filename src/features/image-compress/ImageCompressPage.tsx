import { useEffect, useMemo, useState } from 'react';
import { getSessionJson, setSessionJson } from '../../shared/storage/sessionStorage';
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
        preset: 'very_low'
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

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4">
        <h1 className="text-lg font-bold">فشرده‌سازی عکس</h1>
        <p className="mt-2 text-sm text-slate-700">
          پردازش کاملاً روی دستگاه شما انجام می‌شود. هدف این ابزار کاهش حجم با حداقل افت محسوس است؛ رسیدن دقیق به یک
          حجم مشخص همیشه ممکن نیست.
        </p>
      </div>

      <div className="rounded-lg bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium" htmlFor="file">
              انتخاب عکس
            </label>
            <input
              id="file"
              className="mt-2 block w-full text-sm"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="mt-2 text-sm text-slate-700">
                حجم ورودی: <span className="font-semibold">{formatBytesFa(file.size)}</span>
              </div>
            ) : null}
          </div>

          <fieldset>
            <legend className="block text-sm font-medium">انتخاب سطح فشرده‌سازی</legend>
            <div className="mt-2 space-y-2">
              {(['very_low', 'medium', 'high'] as const).map((p) => (
                <label key={p} className="flex items-start gap-2 text-sm">
                  <input
                    type="radio"
                    name="preset"
                    value={p}
                    checked={preset === p}
                    onChange={() => setPreset(p)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium">{presetLabelFa(p)}</span>
                    <span className="block text-xs text-slate-600" dir="ltr">
                      {Math.round(presetRanges[p].minBytes / 1024)}KB - {Math.round(presetRanges[p].maxBytes / 1024)}KB
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            disabled={busy}
            onClick={onCompress}
          >
            {busy ? 'در حال فشرده‌سازی...' : 'فشرده‌سازی'}
          </button>

          <button
            type="button"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm"
            onClick={reset}
            disabled={busy}
          >
            پاک‌کردن
          </button>

          {error ? <div className="text-sm text-red-700">{error}</div> : null}
        </div>
      </div>

      {previewUrl ? (
        <div className="rounded-lg bg-white p-4">
          <h2 className="text-base font-bold">پیش‌نمایش ورودی</h2>
          <img className="mt-3 max-h-[420px] w-full rounded object-contain" src={previewUrl} alt="پیش‌نمایش ورودی" />
        </div>
      ) : null}

      {result && outputUrl ? (
        <div className="rounded-lg bg-white p-4">
          <h2 className="text-base font-bold">خروجی</h2>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-xs text-slate-600">حجم خروجی</div>
              <div className="mt-1 text-lg font-bold">{formatBytesFa(result.outputBytes)}</div>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-xs text-slate-600">ابعاد خروجی</div>
              <div className="mt-1 text-lg font-bold" dir="ltr">
                {result.outputWidth}×{result.outputHeight}
              </div>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <div className="text-xs text-slate-600">فرمت</div>
              <div className="mt-1 text-lg font-bold" dir="ltr">
                {result.outputMimeType}
              </div>
            </div>
          </div>

          {result.noteFa ? <div className="mt-3 text-sm text-amber-700">{result.noteFa}</div> : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              href={outputUrl}
              download="compressed-image"
            >
              دانلود فایل خروجی
            </a>
          </div>

          <img className="mt-4 max-h-[420px] w-full rounded object-contain" src={outputUrl} alt="پیش‌نمایش خروجی" />
        </div>
      ) : null}
    </div>
  );
}
