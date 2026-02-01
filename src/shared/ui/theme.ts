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
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // رنگ اصلی - آبی
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
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
    primary: '#171717', // متن اصلی - مشکی
    secondary: '#525252', // متن ثانویه
    tertiary: '#737373', // متن کم‌اهمیت
    inverse: '#ffffff', // متن روی پس‌زمینه تیره
  },

  // رنگ‌های پس‌زمینه
  background: {
    primary: '#ffffff', // پس‌زمینه اصلی - سفید
    secondary: '#fafafa', // پس‌زمینه ثانویه
    tertiary: '#f5f5f5', // پس‌زمینه کم‌اهمیت
    accent: '#0ea5e9', // پس‌زمینه تاکیدی
  },

  // رنگ‌های مرزی
  border: {
    primary: '#e5e5e5', // حاشیه اصلی
    secondary: '#d4d4d4', // حاشیه ثانویه
    focus: '#0ea5e9', // حاشیه فوکوس
  },

  // رنگ‌های وضعیت
  status: {
    success: '#10b981', // موفقیت - سبز
    warning: '#f59e0b', // هشدار - نارنجی
    error: '#ef4444', // خطا - قرمز
    info: '#3b82f6', // اطلاعات - آبی
  },
};

// =================================
// دسته‌بندی ابزارها بر اساس رنگ
// =================================

export const toolCategories = {
  financial: {
    primary: '#10b981', // سبز برای ابزارهای مالی
    name: 'مالی',
    icon: '💰',
  },
  document: {
    primary: '#3b82f6', // آبی برای ابزارهای مستندات
    name: 'مستندات',
    icon: '📄',
  },
  image: {
    primary: '#8b5cf6', // بنفش برای ابزارهای تصویر
    name: 'تصویر',
    icon: '🖼️',
  },
  utility: {
    primary: '#f59e0b', // نارنجی برای ابزارهای کاربردی
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
    sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
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
        `text-white bg-${colors.primary[500]}`,
        `border border-${colors.primary[500]}`,
        `hover:bg-${colors.primary[600]}`,
        `focus:ring-${colors.primary[500]}`,
      ].join(' '),
      secondary: [
        'text-black bg-white border border-black',
        'hover:bg-gray-100 focus:ring-black',
      ].join(' '),
      success: [
        `text-white bg-${colors.status.success}`,
        `border border-${colors.status.success}`,
        'hover:bg-green-700 focus:ring-green-500',
      ].join(' '),
      warning: [
        `text-white bg-${colors.status.warning}`,
        `border border-${colors.status.warning}`,
        'hover:bg-amber-700 focus:ring-amber-500',
      ].join(' '),
      danger: [
        `text-white bg-${colors.status.error}`,
        `border border-${colors.status.error}`,
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
  '--color-primary-50': colors.primary[50],
  '--color-primary-500': colors.primary[500],
  '--color-primary-600': colors.primary[600],
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-bg-primary': colors.background.primary,
  '--color-bg-secondary': colors.background.secondary,
  '--color-border-primary': colors.border.primary,
  '--color-success': colors.status.success,
  '--color-warning': colors.status.warning,
  '--color-error': colors.status.error,
  '--color-info': colors.status.info,
  '--color-financial': toolCategories.financial.primary,
  '--color-document': toolCategories.document.primary,
  '--color-image': toolCategories.image.primary,
  '--color-utility': toolCategories.utility.primary,
};

export default {
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
