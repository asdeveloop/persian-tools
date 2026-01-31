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
    css: true
  }
});
