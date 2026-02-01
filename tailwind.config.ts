import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Persian Design System Tokens
      fontFamily: {
        sans: ['IRANSansX', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Noto Sans', 'Helvetica Neue', 'Arial'],
      },
      colors: {
        // Semantic color tokens based on PROJECT_STANDARDS.md
        background: {
          DEFAULT: 'rgba(255, 255, 255, 0.95)',
          subtle: 'rgba(250, 250, 250, 0.8)',
        },
        surface: {
          1: 'rgba(244, 244, 245, 0.7)',
          2: 'rgba(255, 255, 255, 0.8)',
          3: 'rgba(255, 255, 255, 0.6)',
        },
        text: {
          DEFAULT: '#000000',
          muted: '#71717a',
          inverted: '#ffffff',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.1)',
          strong: 'rgba(0, 0, 0, 0.2)',
        },
        primary: {
          DEFAULT: '#000000',
          hover: '#171717',
          pressed: '#404040',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      spacing: {
        // 4px scale as specified in standards
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'medium': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'medium': '240ms',
      },
      transitionTimingFunction: {
        'ease': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      screens: {
        'sm': '360px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
} satisfies Config;
