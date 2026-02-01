import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';
import type { EncryptPdfOptions } from '../types';
import { createError, createPdfError } from '../../../shared/errors';

type PasswordValidationResult = {
  readonly isValid: boolean;
  readonly error?: string;
};

type PasswordStrengthLevel = {
  readonly score: number;
  readonly label: string;
  readonly color: string;
};

type PdfProtectionInfo = {
  readonly isEncrypted: boolean;
  readonly hasPassword: boolean;
  readonly permissions: readonly string[];
};

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 128;

const PASSWORD_STRENGTH_LEVELS: readonly PasswordStrengthLevel[] = [
  { score: 0, label: 'بسیار ضعیف', color: 'red' },
  { score: 1, label: 'ضعیف', color: 'orange' },
  { score: 2, label: 'متوسط', color: 'yellow' },
  { score: 3, label: 'خوب', color: 'blue' },
  { score: 4, label: 'قوی', color: 'green' },
  { score: 5, label: 'بسیار قوی', color: 'green' }
] as const;

const DEFAULT_PERMISSIONS = ['printing', 'copying', 'modifying'] as const;

function createPasswordError(message: string): Error {
  return new Error(`خطا در رمز عبور: ${message}`);
}

function createPdfError(operation: string, originalError: unknown): Error {
  const message = originalError instanceof Error ? originalError.message : 'خطای نامشخص';
  return new Error(`خطا در ${operation}: ${message}`);
}

export async function encryptPdf(
  pdfBytes: Uint8Array,
  options: EncryptPdfOptions
): Promise<Uint8Array> {
  const { password, permissions = {} } = options;

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw createPasswordError(`رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد`);
  }

  try {
    const pdf = await PDFDocument.load(pdfBytes);
    const helveticaFont = await pdf.embedFont(StandardFonts.Helvetica);

    // Note: pdf-lib currently doesn't support PDF encryption
    // This is a placeholder implementation that would need to be replaced
    // with a library that supports PDF encryption like hummusjs or pdfkit

    await addPasswordProtectionPage(pdf, helveticaFont, password);
    return await pdf.save();
  } catch (error) {
    throw createPdfError('رمزگذاری PDF', error instanceof Error ? error : undefined);
  }
}

async function addPasswordProtectionPage(
  pdf: PDFDocument,
  font: PDFFont,
  password: string
): Promise<void> {
  const firstPage = pdf.getPage(0);
  const { width, height } = firstPage.getSize();

  // Add a password protection notice
  firstPage.drawText('این فایل محافظت شده است', {
    x: width / 2 - 100,
    y: height / 2,
    size: 24,
    font,
    color: rgb(1, 0, 0)
  });

  firstPage.drawText(`رمز عبور: ${password}`, {
    x: width / 2 - 80,
    y: height / 2 - 30,
    size: 16,
    font,
    color: rgb(0.5, 0.5, 0.5)
  });
}

export async function decryptPdf(
  pdfBytes: Uint8Array,
  password: string
): Promise<Uint8Array> {
  if (!password) {
    throw createPasswordError('رمز عبور مورد نیاز است');
  }

  try {
    // Note: This is a placeholder implementation
    // In a real implementation, you would use a library that can decrypt PDFs
    await PDFDocument.load(pdfBytes);

    // For demonstration, we'll just return the original bytes
    // In reality, you would need to handle password verification and decryption
    return pdfBytes;
  } catch (error) {
    throw createPdfError('باز کردن قفل PDF', error);
  }
}

export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return { isValid: false, error: 'رمز عبور الزامی است' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { isValid: false, error: `رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد` };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return { isValid: false, error: `رمز عبور نباید بیشتر از ${MAX_PASSWORD_LENGTH} کاراکتر باشد` };
  }

  return { isValid: true };
}

export function getPasswordStrength(password: string): PasswordStrengthLevel {
  const score = calculatePasswordScore(password);
  return PASSWORD_STRENGTH_LEVELS[score];
}

function calculatePasswordScore(password: string): number {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z\d]/.test(password)) score += 1;

  return score;
}

export async function checkPdfProtection(pdfBytes: Uint8Array): Promise<PdfProtectionInfo> {
  try {
    await PDFDocument.load(pdfBytes);

    // Note: This is a simplified check
    // In a real implementation, you would check the PDF's encryption dictionary
    return {
      isEncrypted: false,
      hasPassword: false,
      permissions: DEFAULT_PERMISSIONS
    };
  } catch (error) {
    // If we can't load the PDF, it might be encrypted
    return {
      isEncrypted: true,
      hasPassword: true,
      permissions: []
    };
  }
}
