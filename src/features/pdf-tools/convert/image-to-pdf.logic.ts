import { PDFDocument } from 'pdf-lib';

export type ImageToPdfItem = {
  name: string;
  mimeType: string;
  bytes: Uint8Array;
};

export type Orientation = 'portrait' | 'landscape';
export type Margin = 'none' | 'small' | 'big';
export type PageSize = 'a4' | 'letter' | 'original';

export type ImageToPdfOptions = {
  orientation?: Orientation;
  margin?: Margin;
  pageSize?: PageSize;
  quality?: number;
};

const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const MARGIN_SIZES = {
  none: 0,
  small: 20,
  big: 40,
};

function getMarginValue(margin: Margin): number {
  return MARGIN_SIZES[margin];
}

function getPageSize(size: PageSize, imageWidth: number, imageHeight: number) {
  if (size === 'original') {
    return { width: imageWidth, height: imageHeight };
  }
  return PAGE_SIZES[size];
}

function fitImageToPage(
  imageWidth: number,
  imageHeight: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
): { width: number; height: number; x: number; y: number } {
  const availableWidth = pageWidth - 2 * margin;
  const availableHeight = pageHeight - 2 * margin;
  
  const imageAspectRatio = imageWidth / imageHeight;
  const pageAspectRatio = availableWidth / availableHeight;
  
  let fitWidth: number;
  let fitHeight: number;
  
  if (imageAspectRatio > pageAspectRatio) {
    fitWidth = availableWidth;
    fitHeight = availableWidth / imageAspectRatio;
  } else {
    fitHeight = availableHeight;
    fitWidth = availableHeight * imageAspectRatio;
  }
  
  const x = (pageWidth - fitWidth) / 2;
  const y = (pageHeight - fitHeight) / 2;
  
  return { width: fitWidth, height: fitHeight, x, y };
}

export async function imagesToPdfBytes(
  items: ImageToPdfItem[],
  options: ImageToPdfOptions = {}
): Promise<Uint8Array> {
  if (items.length === 0) {
    throw new Error('هیچ عکسی انتخاب نشده است.');
  }

  const {
    orientation = 'portrait',
    margin = 'small',
    pageSize = 'original',
    quality: _quality = 0.8
  } = options;

  const pdf = await PDFDocument.create();
  const marginValue = getMarginValue(margin);

  for (const item of items) {
    const { mimeType, bytes } = item;
    let img;
    let imageWidth: number;
    let imageHeight: number;

    if (mimeType === 'image/jpeg') {
      img = await pdf.embedJpg(bytes);
      const dims = img.scale(1);
      imageWidth = dims.width;
      imageHeight = dims.height;
    } else if (mimeType === 'image/png') {
      img = await pdf.embedPng(bytes);
      const dims = img.scale(1);
      imageWidth = dims.width;
      imageHeight = dims.height;
    } else {
      throw new Error('فقط فرمت‌های JPG و PNG پشتیبانی می‌شوند.');
    }

    let pageWidth = imageWidth;
    let pageHeight = imageHeight;
    
    if (pageSize !== 'original') {
      const size = getPageSize(pageSize, imageWidth, imageHeight);
      pageWidth = size.width;
      pageHeight = size.height;
    }

    if (orientation === 'landscape' && pageSize !== 'original') {
      [pageWidth, pageHeight] = [pageHeight, pageWidth];
    }

    const page = pdf.addPage([pageWidth, pageHeight]);
    
    const { width: fitWidth, height: fitHeight, x, y } = fitImageToPage(
      imageWidth,
      imageHeight,
      pageWidth,
      pageHeight,
      marginValue
    );

    page.drawImage(img, { x, y, width: fitWidth, height: fitHeight });
  }

  const out = await pdf.save();
  return out;
}
