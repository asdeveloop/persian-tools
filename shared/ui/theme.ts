/**
 * سیستم طراحی یکپارچه برای جعبه ابزار فارسی
 * نسخه: 1.0.0
 */

// =================================
// پالت رنگی اصلی
// =================================

export const colors = {
  // رنگ‌های اصلی
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    200: 'var(--color-primary-200)',
    300: 'var(--color-primary-300)',
    400: 'var(--color-primary-400)',
    500: 'var(--color-primary-500)',
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
    800: 'var(--color-primary-800)',
    900: 'var(--color-primary-900)',
  },

  // رنگ‌های خنثی
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // رنگ‌های متن
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-muted)',
    inverse: 'var(--text-inverted)',
  },

  // رنگ‌های پس‌زمینه
  background: {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-subtle)',
    accent: 'var(--color-primary)',
  },

  // رنگ‌های مرزی
  border: {
    primary: 'var(--border-primary)',
    secondary: 'var(--border-medium)',
    focus: 'var(--color-primary)',
  },

  // رنگ‌های وضعیت
  status: {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-danger)',
    info: 'var(--color-info)',
  },
};

// =================================
// دسته‌بندی ابزارها بر اساس رنگ
// =================================

export const toolCategories = {
  financial: {
    primary: 'var(--color-financial)',
    name: 'مالی',
    icon: '💰',
  },
  document: {
    primary: 'var(--color-document)',
    name: 'مستندات',
    icon: '📄',
  },
  image: {
    primary: 'var(--color-image)',
    name: 'تصویر',
    icon: '🖼️',
  },
  utility: {
    primary: 'var(--color-utility)',
    name: 'کاربردی',
    icon: '🛠️',
  },
};

// =================================
// سایزها و فاصله‌گذاری
// =================================

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
};

export const borderRadius = {
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

// =================================
// تایپوگرافی
// =================================

export const typography = {
  fontFamily: {
    sans: ['var(--font-family-sans)', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// =================================
// سایه‌ها
// =================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};

// =================================
// انیمیشن‌ها
// =================================

export const animations = {
  transition: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    ease: [0.25, 0.1, 0.25, 1.0],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
  },
};

// =================================
// کامپوننت‌های استاندارد
// =================================

export const components = {
  // دکمه‌ها
  button: {
    base: [
      'inline-flex items-center justify-center px-8 py-3 text-sm font-bold',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transition-all duration-200 shadow-sm hover:shadow-md rounded-full',
    ].join(' '),
    variants: {
      primary: [
        'text-white bg-[var(--color-primary-500)]',
        'border border-[var(--color-primary-500)]',
        'hover:bg-[var(--color-primary-600)]',
        'focus:ring-[var(--color-primary-500)]',
      ].join(' '),
      secondary: [
        'text-black bg-white border border-black',
        'hover:bg-gray-100 focus:ring-black',
      ].join(' '),
      success: [
        'text-white bg-[var(--color-success)]',
        'border border-[var(--color-success)]',
        'hover:bg-green-700 focus:ring-green-500',
      ].join(' '),
      warning: [
        'text-white bg-[var(--color-warning)]',
        'border border-[var(--color-warning)]',
        'hover:bg-amber-700 focus:ring-amber-500',
      ].join(' '),
      danger: [
        'text-white bg-[var(--color-danger)]',
        'border border-[var(--color-danger)]',
        'hover:bg-red-700 focus:ring-red-500',
      ].join(' '),
    },
  },

  // کارت‌ها
  card: {
    base: 'rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200',
    elevated: 'rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-200',
    glass: 'rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md shadow-lg',
  },

  // فرم‌ها
  input: {
    base: [
      'w-full px-4 py-3 rounded-xl border border-gray-200',
      'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
      'transition-all duration-200',
    ].join(' '),
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
  },

  // نتایج
  result: {
    success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    error: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
    info: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    warning: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
  },
};

// =================================
// توابع کمکی
// =================================

export function getToolColor(toolType: keyof typeof toolCategories) {
  return toolCategories[toolType]?.primary || colors.primary[500];
}

export function getStatusColor(status: keyof typeof colors.status) {
  return colors.status[status];
}

export function getGradientColors(type: 'primary' | 'success' | 'error' | 'warning' | 'info') {
  const gradients = {
    primary: 'from-blue-50 to-blue-100',
    success: 'from-green-50 to-green-100',
    error: 'from-red-50 to-red-100',
    warning: 'from-amber-50 to-amber-100',
    info: 'from-blue-50 to-blue-100',
  };
  return gradients[type];
}

// =================================
// CSS Variables برای استفاده در Tailwind
// =================================

export const cssVariables = {
  '--color-primary-50': 'var(--color-primary-50)',
  '--color-primary-500': 'var(--color-primary-500)',
  '--color-primary-600': 'var(--color-primary-600)',
  '--color-text-primary': 'var(--text-primary)',
  '--color-text-secondary': 'var(--text-secondary)',
  '--color-bg-primary': 'var(--bg-primary)',
  '--color-bg-secondary': 'var(--bg-secondary)',
  '--color-border-primary': 'var(--border-primary)',
  '--color-success': 'var(--color-success)',
  '--color-warning': 'var(--color-warning)',
  '--color-error': 'var(--color-danger)',
  '--color-info': 'var(--color-info)',
  '--color-financial': 'var(--color-financial)',
  '--color-document': 'var(--color-document)',
  '--color-image': 'var(--color-image)',
  '--color-utility': 'var(--color-utility)',
};

const theme = {
  colors,
  toolCategories,
  spacing,
  borderRadius,
  typography,
  shadows,
  animations,
  components,
  getToolColor,
  getStatusColor,
  getGradientColors,
  cssVariables,
};

export default theme;
