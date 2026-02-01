import { describe, expect, it } from 'vitest';
import {
  encryptPdf,
  validatePassword,
  getPasswordStrength,
  checkPdfProtection,
} from './encrypt-pdf.logic';

describe('encryptPdf', () => {
  it('should throw when password is too short', async () => {
    const pdfBytes = new Uint8Array([1, 2, 3, 4, 5]);

    await expect(encryptPdf(pdfBytes, { password: '123' }))
      .rejects.toThrow('خطا در رمز عبور: رمز عبور باید حداقل 4 کاراکتر باشد');
  });

  it('should handle PDF loading errors', async () => {
    const invalidPdfBytes = new Uint8Array([1, 2, 3, 4, 5]);

    await expect(encryptPdf(invalidPdfBytes, { password: 'valid123' }))
      .rejects.toThrow('خطا در رمزگذاری PDF');
  });
});

describe('validatePassword', () => {
  it('should reject empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('رمز عبور الزامی است');
  });

  it('should reject short password', () => {
    const result = validatePassword('123');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('رمز عبور باید حداقل 4 کاراکتر باشد');
  });

  it('should reject long password', () => {
    const longPassword = 'a'.repeat(129);
    const result = validatePassword(longPassword);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('رمز عبور نباید بیشتر از 128 کاراکتر باشد');
  });

  it('should accept valid password', () => {
    const result = validatePassword('valid123');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept minimum length password', () => {
    const result = validatePassword('1234');
    expect(result.isValid).toBe(true);
  });

  it('should accept maximum length password', () => {
    const maxPassword = 'a'.repeat(128);
    const result = validatePassword(maxPassword);
    expect(result.isValid).toBe(true);
  });
});

describe('getPasswordStrength', () => {
  it('should return very weak for short passwords', () => {
    const strength = getPasswordStrength('abc');
    expect(strength.score).toBe(0);
    expect(strength.label).toBe('بسیار ضعیف');
    expect(strength.color).toBe('red');
  });

  it('should return weak for simple passwords', () => {
    const strength = getPasswordStrength('abcdefgh');
    expect(strength.score).toBe(1);
    expect(strength.label).toBe('ضعیف');
    expect(strength.color).toBe('orange');
  });

  it('should return medium for passwords with numbers', () => {
    const strength = getPasswordStrength('abcdefgh123');
    expect(strength.score).toBe(2);
    expect(strength.label).toBe('متوسط');
    expect(strength.color).toBe('yellow');
  });

  it('should return good for passwords with mixed case', () => {
    const strength = getPasswordStrength('Abcdefgh');
    expect(strength.score).toBe(2);
    expect(strength.label).toBe('متوسط');
    expect(strength.color).toBe('yellow');
  });

  it('should return strong for complex passwords', () => {
    const strength = getPasswordStrength('Abc123!@#');
    expect(strength.score).toBe(4);
    expect(strength.label).toBe('قوی');
    expect(strength.color).toBe('green');
  });

  it('should return very strong for long complex passwords', () => {
    const strength = getPasswordStrength('VeryComplexPassword123!@#');
    expect(strength.score).toBe(5);
    expect(strength.label).toBe('بسیار قوی');
    expect(strength.color).toBe('green');
  });
});

describe('checkPdfProtection', () => {
  it('should return encrypted for invalid PDF bytes', async () => {
    const pdfBytes = new Uint8Array([1, 2, 3, 4, 5]);

    const protection = await checkPdfProtection(pdfBytes);

    expect(protection.isEncrypted).toBe(true);
    expect(protection.hasPassword).toBe(true);
    expect(protection.permissions).toEqual([]);
  });

  it('should return encrypted for empty PDF bytes', async () => {
    const emptyPdfBytes = new Uint8Array();

    const protection = await checkPdfProtection(emptyPdfBytes);

    expect(protection.isEncrypted).toBe(true);
    expect(protection.hasPassword).toBe(true);
    expect(protection.permissions).toEqual([]);
  });
});
