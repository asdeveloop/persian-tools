/* eslint-disable spaced-comment */
/// <reference lib="webworker" />
/* eslint-env worker */
/* global DedicatedWorkerGlobalScope */

export {};

import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

type MergeRequest = {
  id: string;
  type: 'merge';
  files: ArrayBuffer[];
};

type SplitRequest = {
  id: string;
  type: 'split';
  file: ArrayBuffer;
  pages: number[];
};

type CompressRequest = {
  id: string;
  type: 'compress';
  file: ArrayBuffer;
};

type WatermarkRequest = {
  id: string;
  type: 'watermark';
  file: ArrayBuffer;
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

type CountPagesRequest = {
  id: string;
  type: 'count-pages';
  file: ArrayBuffer;
};

type WorkerRequest =
  | MergeRequest
  | SplitRequest
  | CompressRequest
  | WatermarkRequest
  | CountPagesRequest;

type WorkerResponse =
  | { id: string; type: 'progress'; progress: number }
  | { id: string; type: 'result'; buffer: ArrayBuffer }
  | { id: string; type: 'pages'; totalPages: number }
  | { id: string; type: 'error'; message: string };

const ctx: DedicatedWorkerGlobalScope = self as DedicatedWorkerGlobalScope;

const postProgress = (id: string, progress: number) => {
  const message: WorkerResponse = { id, type: 'progress', progress };
  ctx.postMessage(message);
};

const toArrayBuffer = (bytes: Uint8Array) =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);

const resolvePosition = (
  position: WatermarkRequest['position'],
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  textHeight: number,
) => {
  const margin = 32;
  switch (position) {
    case 'top-left':
      return { x: margin, y: pageHeight - textHeight - margin };
    case 'top-right':
      return { x: pageWidth - textWidth - margin, y: pageHeight - textHeight - margin };
    case 'bottom-left':
      return { x: margin, y: margin };
    case 'bottom-right':
      return { x: pageWidth - textWidth - margin, y: margin };
    case 'center':
    default:
      return { x: (pageWidth - textWidth) / 2, y: (pageHeight - textHeight) / 2 };
  }
};

ctx.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const payload = event.data;

  try {
    switch (payload.type) {
      case 'count-pages': {
        const doc = await PDFDocument.load(payload.file);
        const response: WorkerResponse = {
          id: payload.id,
          type: 'pages',
          totalPages: doc.getPageCount(),
        };
        ctx.postMessage(response);
        return;
      }
      case 'merge': {
        const mergedPdf = await PDFDocument.create();
        for (let i = 0; i < payload.files.length; i += 1) {
          const pdf = await PDFDocument.load(payload.files[i]);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          postProgress(payload.id, (i + 1) / payload.files.length);
        }
        const bytes = await mergedPdf.save();
        const buffer = toArrayBuffer(bytes);
        const response: WorkerResponse = { id: payload.id, type: 'result', buffer };
        ctx.postMessage(response, [buffer]);
        return;
      }
      case 'split': {
        postProgress(payload.id, 0.2);
        const sourcePdf = await PDFDocument.load(payload.file);
        const resultPdf = await PDFDocument.create();
        const copiedPages = await resultPdf.copyPages(sourcePdf, payload.pages);
        copiedPages.forEach((page) => resultPdf.addPage(page));
        const bytes = await resultPdf.save();
        const buffer = toArrayBuffer(bytes);
        postProgress(payload.id, 1);
        const response: WorkerResponse = { id: payload.id, type: 'result', buffer };
        ctx.postMessage(response, [buffer]);
        return;
      }
      case 'compress': {
        postProgress(payload.id, 0.2);
        const sourcePdf = await PDFDocument.load(payload.file);
        const compressedPdf = await PDFDocument.create();
        const copiedPages = await compressedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach((page) => compressedPdf.addPage(page));
        const bytes = await compressedPdf.save({ useObjectStreams: true, addDefaultPage: false });
        const buffer = toArrayBuffer(bytes);
        postProgress(payload.id, 1);
        const response: WorkerResponse = { id: payload.id, type: 'result', buffer };
        ctx.postMessage(response, [buffer]);
        return;
      }
      case 'watermark': {
        postProgress(payload.id, 0.2);
        const pdfDoc = await PDFDocument.load(payload.file, { ignoreEncryption: false });
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(payload.text, payload.fontSize);
          const textHeight = payload.fontSize;
          const { x, y } = resolvePosition(payload.position, width, height, textWidth, textHeight);
          page.drawText(payload.text, {
            x,
            y,
            size: payload.fontSize,
            font,
            color: rgb(0, 0, 0),
            opacity: payload.opacity,
            rotate: degrees(payload.rotation),
          });
        });
        const bytes = await pdfDoc.save();
        const buffer = toArrayBuffer(bytes);
        postProgress(payload.id, 1);
        const response: WorkerResponse = { id: payload.id, type: 'result', buffer };
        ctx.postMessage(response, [buffer]);
        return;
      }
      default:
        return;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'خطای نامشخص در پردازش PDF.';
    const response: WorkerResponse = { id: payload.id, type: 'error', message };
    ctx.postMessage(response);
  }
};
