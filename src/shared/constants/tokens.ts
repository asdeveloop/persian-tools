/**
 * Persian Tools Design System Tokens
 * Based on PROJECT_STANDARDS.md requirements
 */

export const tokens = {
  // Typography
  font: {
    family: {
      sans: '"IRANSansX", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial',
    },
    size: {
      xs: '12px',   // توضیحات ریز/متا
      sm: '14px',   // متن ثانویه
      md: '16px',   // متن اصلی
      lg: '18px',   // تیتر کوچک
      xl: '20px',   // تیتر صفحه
    },
    lineHeight: {
      tight: '1.2',    // تیترها
      normal: '1.4',   // تیترها
      relaxed: '1.8',  // متن‌های طولانی
    },
  },

  // Spacing (4px scale)
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
  },

  // Colors - Semantic naming
  color: {
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
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
    },
  },

  // Border Radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },

  // Shadow
  shadow: {
    subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },

  // Motion
  motion: {
    duration: {
      fast: '150ms',      // Micro interactions
      medium: '240ms',    // Transition صفحه/بخش
      modal: '210ms',     // Modal enter/exit (avg of 180-240ms)
    },
    easing: {
      ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
  },

  // Breakpoints
  breakpoint: {
    sm: '360px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Container padding
  container: {
    padding: {
      mobile: '16px',
      tablet: '24px',
      desktop: '32px',
    },
    maxWidth: '1200px',
  },
} as const;

// Type definitions for tokens
export type TokenKeys = typeof tokens;
export type ColorToken = keyof typeof tokens.color;
export type SpaceToken = keyof typeof tokens.space;
export type RadiusToken = keyof typeof tokens.radius;

// Helper functions for runtime access
export const getToken = {
  color: (name: ColorToken) => tokens.color[name],
  space: (name: SpaceToken) => tokens.space[name],
  radius: (name: RadiusToken) => tokens.radius[name],
  motion: (duration: keyof typeof tokens.motion.duration) => tokens.motion.duration[duration],
};

// CSS Variable names (matching index.css)
export const cssVars = {
  fontFamily: '--font-family-sans',
  color: {
    background: '--bg-primary',
    text: '--text-primary',
    border: '--border-primary',
    primary: '--color-primary',
  },
  space: {
    1: '--space-1',
    2: '--space-2',
    3: '--space-3',
    4: '--space-4',
    6: '--space-6',
    8: '--space-8',
  },
  radius: {
    sm: '--radius-sm',
    md: '--radius-md',
    lg: '--radius-lg',
  },
  motion: {
    fast: '--motion-fast',
    medium: '--motion-medium',
    ease: '--motion-ease',
  },
} as const;
