// استانداردهای UI/UX پروژه جعبه ابزار فارسی

export const UI_STANDARDS = {
  // رنگ‌های اصلی
  colors: {
    primary: '#000000',
    primaryDark: '#171717',
    primaryLight: '#404040',
    secondary: '#0070f3',
    secondaryDark: '#0060d0',
    accent: '#ff6b6b',
    accentDark: '#ff5252',
    success: '#10b981',
    successDark: '#059669',
    warning: '#f59e0b',
    warningDark: '#d97706',
    danger: '#ef4444',
    dangerDark: '#dc2626',
    info: '#3b82f6',
    infoDark: '#2563eb',
    
    // رنگ‌های خاکستری
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    }
  },
  
  // سایه‌ها
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: '0 0 20px rgb(0 112 243 / 0.3)',
  },
  
  // گوشه‌ها
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  
  // فاصله‌ها
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // تایپوگرافی
  typography: {
    fontFamily: '"IRANSansX", ui-sans-serif, system-ui',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      thin: '100',
      light: '300',
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
  },
  
  // انیمیشن‌ها
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  // نقاطه شکست ریسپانسیو
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // زون‌ها
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// استانداردهای کامپوننت‌ها
export const COMPONENT_STANDARDS = {
  // دکمه‌ها
  button: {
    variants: {
      primary: 'text-black bg-white border border-black hover:bg-gray-100',
      secondary: 'text-white bg-black border border-black hover:bg-gray-900',
      accent: 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700',
      success: 'text-white bg-green-600 border border-green-600 hover:bg-green-700',
      warning: 'text-white bg-amber-600 border border-amber-600 hover:bg-amber-700',
      danger: 'text-white bg-red-600 border border-red-600 hover:bg-red-700',
    },
    sizes: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-3 text-base',
    },
    base: 'inline-flex items-center justify-center font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md rounded-full',
  },
  
  // کارت‌ها
  card: {
    variants: {
      default: 'bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-xl',
      glass: 'bg-white/60 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-3xl',
      elevated: 'bg-white shadow-xl hover:shadow-2xl',
    },
    base: 'rounded-2xl transition-all duration-300',
  },
  
  // ورودی‌ها
  input: {
    variants: {
      default: 'bg-white/50 backdrop-blur-sm border border-gray-300/50 focus:border-black focus:ring-black',
      error: 'bg-red-50/50 backdrop-blur-sm border border-red-300/50 focus:border-red-500 focus:ring-red-500',
      success: 'bg-green-50/50 backdrop-blur-sm border border-green-300/50 focus:border-green-500 focus:ring-green-500',
    },
    base: 'w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 placeholder-opacity-60 focus:outline-none focus:ring-2 transition-all duration-200',
  },
  
  // ناوبری
  navigation: {
    header: 'sticky top-0 z-50 glass-strong border-b border-white/20 shadow-lg',
    dropdown: 'absolute top-full left-0 mt-2 w-80 glass-strong rounded-2xl shadow-2xl border border-white/20 py-4 overflow-hidden',
    mobileMenu: 'lg:hidden border-t border-white/20 glass-strong',
  },
  
  // فرم‌ها
  form: {
    fieldset: 'space-y-6',
    legend: 'text-xl font-black text-black mb-6',
    label: 'block text-sm font-bold text-gray-700 mb-2',
    helper: 'text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg',
    error: 'text-sm text-red-600 bg-red-50 px-6 py-3 rounded-xl border border-red-200',
  },
  
  // نتایج
  result: {
    card: 'bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 shadow-lg',
    success: 'bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 shadow-lg',
    warning: 'bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl border border-amber-200 shadow-lg',
    danger: 'bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border border-red-200 shadow-lg',
  },
} as const;

// استانداردهای انیمیشن
export const ANIMATION_STANDARDS = {
  // انیمیشن‌های ورود
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
  },
  
  // انیمیشن‌های hover
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  
  lift: {
    y: -5,
    transition: { duration: 0.3 },
  },
  
  // انیمیشن‌های loading
  shimmer: {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200px 100%',
    animation: 'shimmer 1.5s infinite',
  },
  
  pulse: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  
  // انیمیشن‌های floating
  float: {
    animation: 'float 3s ease-in-out infinite',
  },
} as const;

// استانداردهای دسترسی‌پذیری (Accessibility)
export const A11Y_STANDARDS = {
  // ARIA labels
  button: {
    'aria-label': 'required for icon-only buttons',
    'aria-describedby': 'for additional context',
    'aria-expanded': 'for toggle buttons',
  },
  
  // Keyboard navigation
  keyboard: {
    'tabIndex': '0 for focusable elements',
    'onKeyDown': 'handle keyboard events',
    'role': 'appropriate semantic roles',
  },
  
  // Screen readers
  screenReader: {
    'aria-live': 'polite for dynamic content',
    'aria-atomic': 'true for important updates',
    'aria-busy': 'true for loading states',
  },
  
  // Color contrast
  contrast: {
    'text': 'minimum 4.5:1 ratio',
    'large-text': 'minimum 3:1 ratio',
    'ui-components': 'minimum 3:1 ratio',
  },
  
  // Focus management
  focus: {
    'outline': '2px solid currentColor',
    'outline-offset': '2px',
    'focus-visible': 'only show outline on keyboard focus',
  },
} as const;

// استانداردهای عملکرد (Performance)
export const PERFORMANCE_STANDARDS = {
  // Lazy loading
  lazy: {
    'threshold': '0.1',
    'rootMargin': '50px',
    'triggerOnce': 'true',
  },
  
  // Image optimization
  images: {
    'loading': 'lazy',
    'decoding': 'async',
    'sizes': 'responsive',
    'srcSet': 'multiple resolutions',
  },
  
  // Bundle optimization
  bundle: {
    'codeSplitting': 'route-based',
    'treeShaking': 'remove unused code',
    'minification': 'production builds',
  },
  
  // Runtime performance
  runtime: {
    'memo': 'for expensive components',
    'useCallback': 'for expensive functions',
    'useMemo': 'for expensive calculations',
    'debounce': 'for search inputs',
  },
} as const;

export default {
  UI_STANDARDS,
  COMPONENT_STANDARDS,
  ANIMATION_STANDARDS,
  A11Y_STANDARDS,
  PERFORMANCE_STANDARDS,
};
