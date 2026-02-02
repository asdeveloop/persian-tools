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

  if (normalized.length === 0) {
    return null;
  }
  if (!/^-?\d*(?:\.\d+)?$/.test(normalized)) {
    return null;
  }

  const n = Number(normalized);
  if (!Number.isFinite(n)) {
    return null;
  }
  return n;
}

export function formatNumberFa(n: number): string {
  return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(n);
}

export function formatMoneyFa(n: number): string {
  return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(n);
}

const faOnes = ['صفر', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'] as const;

const faTeens = [
  'ده',
  'یازده',
  'دوازده',
  'سیزده',
  'چهارده',
  'پانزده',
  'شانزده',
  'هفده',
  'هجده',
  'نوزده',
] as const;

const faTens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'] as const;

const faHundreds = [
  '',
  'صد',
  'دویست',
  'سیصد',
  'چهارصد',
  'پانصد',
  'ششصد',
  'هفتصد',
  'هشتصد',
  'نهصد',
] as const;

const faScales = [
  { value: 1_000_000_000, label: 'میلیارد' },
  { value: 1_000_000, label: 'میلیون' },
  { value: 1_000, label: 'هزار' },
] as const;

function threeDigitToWords(n: number): string {
  const parts: string[] = [];
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  if (hundreds > 0) {
    const word = faHundreds[hundreds];
    if (word) {
      parts.push(word);
    }
  }
  if (remainder > 0) {
    if (remainder < 10) {
      const word = faOnes[remainder];
      if (word) {
        parts.push(word);
      }
    } else if (remainder < 20) {
      const word = faTeens[remainder - 10];
      if (word) {
        parts.push(word);
      }
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      const tensWord = faTens[tens];
      if (tensWord) {
        parts.push(tensWord);
      }
      if (ones > 0) {
        const onesWord = faOnes[ones];
        if (onesWord) {
          parts.push(onesWord);
        }
      }
    }
  }
  return parts.join(' و ');
}

export function numberToWordsFa(input: number): string {
  if (!Number.isFinite(input)) {
    return '';
  }
  if (input === 0) {
    return faOnes[0];
  }

  const negative = input < 0;
  const absolute = Math.abs(input);
  const integerPart = Math.trunc(absolute);
  const fractionRaw = absolute - integerPart;
  const integerWords: string[] = [];

  let remainder = integerPart;
  for (const scale of faScales) {
    if (remainder >= scale.value) {
      const chunk = Math.floor(remainder / scale.value);
      remainder %= scale.value;
      const chunkWords = threeDigitToWords(chunk);
      if (chunkWords) {
        integerWords.push(`${chunkWords} ${scale.label}`);
      }
    }
  }

  if (remainder > 0) {
    integerWords.push(threeDigitToWords(remainder));
  }

  const integerText = integerWords.join(' و ');
  if (fractionRaw <= 0) {
    return negative ? `منفی ${integerText}` : integerText;
  }

  const fractionDigits = fractionRaw.toFixed(6).split('.')[1]?.replace(/0+$/, '');
  if (!fractionDigits) {
    return negative ? `منفی ${integerText}` : integerText;
  }

  const fractionWords = fractionDigits
    .split('')
    .map((digit) => faOnes[Number(digit)])
    .join(' ');

  const result = `${integerText} ممیز ${fractionWords}`;
  return negative ? `منفی ${result}` : result;
}
