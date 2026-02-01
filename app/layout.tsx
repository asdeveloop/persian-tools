import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'جعبه ابزار فارسی - ابزارهای آنلاین برای کار و زندگی',
  description: 'مجموعه کامل و رایگان ابزارهای آنلاین برای کاربران فارسی‌زبان شامل ابزارهای PDF، محاسبات مالی، پردازش تصویر و ابزارهای کاربردی دیگر',
  keywords: [
    'ابزارهای فارسی',
    'ابزار آنلاین فارسی',
    'تبدیل PDF',
    'محاسبه وام',
    'فشرده سازی عکس',
    'ابزارهای رایگان',
    'پردازش آفلاین',
    'ابزارهای کاربردی',
    'persian tools',
    'farsi tools',
  ],
  authors: [{ name: 'Persian Tools Team' }],
  openGraph: {
    title: 'جعبه ابزار فارسی - ابزارهای آنلاین برای کار و زندگی',
    description: 'مجموعه کامل و رایگان ابزارهای آنلاین برای کاربران فارسی‌زبان',
    type: 'website',
    locale: 'fa_IR',
    siteName: 'جعبه ابزار فارسی',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جعبه ابزار فارسی',
    description: 'ابزارهای آنلاین رایگان برای کاربران فارسی‌زبان',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)]">
        {children}
      </body>
    </html>
  );
}
