import { decryptPdf, checkPdfProtection } from './encrypt-pdf.logic';

export { decryptPdf, checkPdfProtection };

export async function verifyPassword(
  pdfBytes: Uint8Array,
  password: string,
): Promise<boolean> {
  try {
    await decryptPdf(pdfBytes, password);
    return true;
  } catch (error) {
    return false;
  }
}
