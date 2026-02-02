import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

const routes = [
  '/',
  '/pdf-tools',
  '/pdf-tools/compress/compress-pdf',
  '/pdf-tools/convert/image-to-pdf',
  '/pdf-tools/convert/pdf-to-image',
  '/pdf-tools/security/decrypt-pdf',
  '/pdf-tools/merge/merge-pdf',
  '/pdf-tools/watermark/add-watermark',
  '/pdf-tools/split/split-pdf',
  '/image-tools',
  '/loan',
  '/salary',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified,
  }));
}
