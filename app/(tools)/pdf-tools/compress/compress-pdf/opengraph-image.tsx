import { ImageResponse } from 'next/og';
import { siteName } from '@/lib/seo';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const title = 'فشرده‌سازی PDF';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b1325',
        backgroundImage: 'linear-gradient(140deg, #0b1325 0%, #1e293b 50%, #0ea5e9 100%)',
        color: '#f8fafc',
        fontSize: 64,
        fontWeight: 700,
        textAlign: 'center',
        padding: '60px',
      }}
    >
      {title} | {siteName}
    </div>,
    size,
  );
}
