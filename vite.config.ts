import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp',
    transformIndexHtml(html, ctx) {
      if (ctx.server) return html;

      const csp = [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "script-src 'self'",
        "style-src 'self'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "worker-src 'self' blob:",
        "manifest-src 'self'"
      ].join('; ');

      const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
      return html.replace('</head>', `${meta}\n</head>`);
    }
  };
}

export default defineConfig({
  plugins: [react(), cspPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '<rootDir>/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    benchmark: {
      include: ['src/**/*.{bench,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion'],
          utils: ['date-fns', 'lodash-es'],
        },
      },
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
