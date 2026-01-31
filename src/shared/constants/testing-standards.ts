// استانداردهای تست برای پروژه جعبه ابزار فارسی

export const TESTING_STANDARDS = {
  // پوشش تست (Coverage)
  coverage: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
  
  // استانداردهای نام‌گذاری تست‌ها
  naming: {
    describe: 'should describe what is being tested',
    test: 'should describe the expected behavior',
    it: 'should describe the specific scenario',
  },
  
  // ساختار تست (AAA Pattern)
  structure: {
    arrange: 'set up the test data and conditions',
    act: 'perform the action being tested',
    assert: 'verify the expected outcome',
  },
  
  // استانداردهای تست کامپوننت‌ها
  component: {
    render: 'should render without crashing',
    props: 'should handle different props correctly',
    state: 'should handle state changes',
    events: 'should handle user interactions',
    accessibility: 'should be accessible',
  },
  
  // استانداردهای تست منطق کسب‌وکار
  business: {
    calculations: 'should perform calculations correctly',
    edgeCases: 'should handle edge cases',
    errors: 'should handle errors gracefully',
    validation: 'should validate input correctly',
  },
  
  // استانداردهای تست یکپارچگی (Integration)
  integration: {
    userFlow: 'should complete user workflows',
    api: 'should handle API interactions',
    navigation: 'should handle navigation correctly',
    dataFlow: 'should handle data flow correctly',
  },
} as const;

// استانداردهای mocking
export const MOCKING_STANDARDS = {
  // Mock کردن API
  api: {
    useRealApi: 'false for unit tests',
    mockResponses: 'consistent mock responses',
    mockErrors: 'realistic error scenarios',
  },
  
  // Mock کردن کامپوننت‌ها
  components: {
    shallow: 'for unit tests',
    mount: 'for integration tests',
    render: 'for component tests',
  },
  
  // Mock کردن داده‌ها
  data: {
    realistic: 'use realistic test data',
    edgeCases: 'include edge cases',
    boundaries: 'test boundary conditions',
  },
  
  // Mock کردن زمان
  time: {
    fakeTimers: 'for time-dependent tests',
    mockDates: 'consistent date mocking',
    mockIntervals: 'for interval-based tests',
  },
} as const;

// استانداردهای تست دسترسی‌پذیری (A11Y Testing)
export const A11Y_TESTING_STANDARDS = {
  // تست‌های کلیدی
  keyboard: {
    navigation: 'should be navigable by keyboard',
    focus: 'should manage focus correctly',
    shortcuts: 'should support keyboard shortcuts',
  },
  
  // تست‌های screen reader
  screenReader: {
    labels: 'should have proper labels',
    announcements: 'should announce important changes',
    structure: 'should have proper semantic structure',
  },
  
  // تست‌های رنگ و کنتراست
  contrast: {
    text: 'should have sufficient color contrast',
    ui: 'should have sufficient UI contrast',
    icons: 'should have sufficient icon contrast',
  },
  
  // تست‌های سایز و ریسپانسیو
  responsive: {
    mobile: 'should work on mobile devices',
    tablet: 'should work on tablet devices',
    desktop: 'should work on desktop devices',
  },
} as const;

// استانداردهای تست عملکرد (Performance Testing)
export const PERFORMANCE_TESTING_STANDARDS = {
  // تست‌های سرعت
  speed: {
    render: 'should render quickly',
    interaction: 'should respond quickly to interactions',
    navigation: 'should navigate quickly',
  },
  
  // تست‌های حافظه
  memory: {
    leaks: 'should not have memory leaks',
    usage: 'should use memory efficiently',
    cleanup: 'should clean up properly',
  },
  
  // تست‌های باندل
  bundle: {
    size: 'should have reasonable bundle size',
    loading: 'should load quickly',
    parsing: 'should parse quickly',
  },
} as const;

// استانداردهای تست امنیت
export const SECURITY_TESTING_STANDARDS = {
  // تست‌های XSS
  xss: {
    injection: 'should prevent XSS attacks',
    sanitization: 'should sanitize user input',
    encoding: 'should encode output properly',
  },
  
  // تست‌های احراز هویت
  auth: {
    authorization: 'should check authorization',
    authentication: 'should handle authentication',
    permissions: 'should check permissions',
  },
  
  // تست‌های داده
  data: {
    validation: 'should validate input data',
    sanitization: 'should sanitize data',
    encryption: 'should encrypt sensitive data',
  },
} as const;

// استانداردهای گزارش‌دهی تست
export const REPORTING_STANDARDS = {
  // گزارش‌دهی نتایج تست
  results: {
    pass: 'clear indication of passing tests',
    fail: 'clear indication of failing tests',
    coverage: 'coverage reports for all tests',
  },
  
  // گزارش‌دهی پوشش
  coverage: {
    html: 'HTML coverage reports',
    json: 'JSON coverage data',
    lcov: 'LCOV format for CI/CD',
  },
  
  // گزارش‌دهی عملکرد
  performance: {
    metrics: 'performance metrics reporting',
    benchmarks: 'benchmark comparisons',
    monitoring: 'continuous monitoring',
  },
} as const;

// استانداردهای CI/CD
export const CICD_STANDARDS = {
  // تست‌های CI
  ci: {
    lint: 'run linting in CI',
    test: 'run all tests in CI',
    build: 'run build in CI',
    typecheck: 'run type checking in CI',
  },
  
  // تست‌های CD
  cd: {
    deploy: 'deploy only on passing tests',
    rollback: 'rollback on failure',
    monitoring: 'monitor after deployment',
  },
  
  // کیفیت کد
  quality: {
    coverage: 'minimum coverage requirements',
    performance: 'performance benchmarks',
    security: 'security scans',
  },
} as const;

export default {
  TESTING_STANDARDS,
  MOCKING_STANDARDS,
  A11Y_TESTING_STANDARDS,
  PERFORMANCE_TESTING_STANDARDS,
  SECURITY_TESTING_STANDARDS,
  REPORTING_STANDARDS,
  CICD_STANDARDS,
};
