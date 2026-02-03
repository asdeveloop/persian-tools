export type PdfToolCategory =
  | 'convert'
  | 'compress'
  | 'merge'
  | 'split'
  | 'security'
  | 'watermark'
  | 'paginate'
  | 'extract';

export type PdfToolItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: PdfToolCategory;
  status?: 'ready' | 'coming-soon';
};
