let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;
let pdfLibPromise: Promise<typeof import('pdf-lib')> | null = null;
import type JSZip from 'jszip';

let jszipPromise: Promise<typeof JSZip> | null = null;

export async function loadPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist');
  }
  return pdfjsPromise;
}

export async function loadPdfLib() {
  if (!pdfLibPromise) {
    pdfLibPromise = import('pdf-lib');
  }
  return pdfLibPromise;
}

export async function loadJsZip() {
  if (!jszipPromise) {
    jszipPromise = import('jszip').then((mod) => mod.default);
  }
  return jszipPromise;
}
