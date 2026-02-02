/**
 * Utilities for Persian language support including number formatting and RTL helpers
 * Following PROJECT_STANDARDS.md requirements for Persian/RTL support
 */

/**
 * Converts English numbers to Persian numbers
 * @param input - String or number to convert
 * @returns String with Persian numerals
 */
export function toPersianNumbers(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const str = input.toString();
  let result = str;

  for (let i = 0; i < englishDigits.length; i++) {
    const englishDigit = englishDigits[i];
    const persianDigit = persianDigits[i];
    if (englishDigit && persianDigit) {
      const regex = new RegExp(englishDigit, 'g');
      result = result.replace(regex, persianDigit);
    }
  }

  return result;
}

/**
 * Formats a number with Persian thousands separator
 * @param num - Number to format
 * @returns Formatted Persian number string
 */
export function formatPersianNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

/**
 * Formats currency in Persian format
 * @param amount - Amount in Toman/Rial
 * @param currency - Currency symbol (default: 'تومان')
 * @returns Formatted currency string
 */
export function formatPersianCurrency(amount: number, currency = 'تومان'): string {
  return `${formatPersianNumber(amount)} ${currency}`;
}

/**
 * Adds proper RTL attributes for components
 * @returns Object with dir and aria attributes
 */
export function rtlAttributes() {
  return {
    dir: 'rtl' as const,
    'aria-orientation': 'horizontal' as const,
  };
}

/**
 * Checks if a string contains Persian characters
 * @param text - Text to check
 * @returns True if contains Persian characters
 */
export function isPersianText(text: string): boolean {
  const persianRegex = /[\u0600-\u06FF]/;
  return persianRegex.test(text);
}

/**
 * Converts a date to Persian (Jalali) format
 * @param date - Date object or timestamp
 * @returns Persian formatted date string
 */
export function formatPersianDate(date: Date | number): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(d);
  } catch {
    return new Intl.DateTimeFormat('fa-IR', options).format(d);
  }
}

/**
 * Adds proper spacing for Persian text (using half-space for suffixes)
 * @param text - Text to process
 * @returns Text with proper spacing
 */
export function fixPersianSpacing(text: string): string {
  // Replace common suffixes with half-space
  const suffixes = ['ترین', 'تر', 'های', 'ها', 'ی', 'ام', 'ای', 'است'];
  const pattern = new RegExp(
    `([\\u0600-\\u06FF]+)(\\u200C)?(${suffixes.join('|')})(?![\\u0600-\\u06FF])`,
    'g',
  );
  return text.replace(pattern, (match, stem, zwnj, suffix) => {
    if (zwnj) {
      return match;
    }
    return `${stem}\u200C${suffix}`;
  });
}
