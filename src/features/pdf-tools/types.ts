export type Orientation = 'portrait' | 'landscape';
export type Margin = 'none' | 'small' | 'big';
export type PageSize = 'a4' | 'letter' | 'original';

export interface ImageToPdfOptions {
  orientation?: Orientation;
  margin?: Margin;
  pageSize?: PageSize;
  quality?: number;
}

export interface PdfToImageOptions {
  format?: 'png' | 'jpeg';
  quality?: number;
  dpi?: number;
}

export interface CompressPdfOptions {
  quality?: number;
  removeImages?: boolean;
  removeAnnotations?: boolean;
}

export interface MergePdfOptions {
  preserveBookmarks?: boolean;
  preserveForms?: boolean;
}

export interface SplitPdfOptions {
  ranges?: string[];
  splitBy?: 'pages' | 'size' | 'bookmarks';
}

export interface EncryptPdfOptions {
  password: string;
  permissions?: {
    printing?: boolean;
    copying?: boolean;
    modifying?: boolean;
  };
}

export interface WatermarkOptions {
  type: 'text' | 'image';
  content: string | Uint8Array;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
  rotation?: number;
  size?: number;
}

export interface PaginateOptions {
  position?: 'top' | 'bottom' | 'both';
  alignment?: 'left' | 'center' | 'right';
  startNumber?: number;
  format?: string;
}

export interface ExtractOptions {
  type: 'pages' | 'text' | 'images';
  ranges?: string[];
}

export interface PdfToolItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: 'convert' | 'compress' | 'merge' | 'split' | 'security' | 'watermark' | 'paginate' | 'extract';
}
