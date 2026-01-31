const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const;

export function toEnglishDigits(input: string): string {
  let out = input;
  faDigits.forEach((digit, i) => {
    out = out.replaceAll(digit, String(i));
  });

  out = out.replaceAll('٬', ',');
  out = out.replaceAll('٫', '.');
  return out;
}

export function parseLooseNumber(input: string): number | null {
  const normalized = toEnglishDigits(input)
    .trim()
    .replaceAll(',', '')
    .replaceAll(' ', '')
    .replaceAll('\u200f', '')
    .replaceAll('\u200e', '');

  if (normalized.length === 0) return null;
  if (!/^-?\d*(?:\.\d+)?$/.test(normalized)) return null;

  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function formatNumberFa(n: number): string {
  return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(n);
}

export function formatMoneyFa(n: number): string {
  return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(n);
}
