import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    section: 'section',
    article: 'article',
    header: 'header',
    footer: 'footer',
    nav: 'nav',
    main: 'main',
    aside: 'aside',
    figure: 'figure',
    figcaption: 'figcaption',
    ul: 'ul',
    li: 'li',
    ol: 'ol',
    a: 'a',
    img: 'img',
    form: 'form',
    input: 'input',
    label: 'label',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    table: 'table',
    thead: 'thead',
    tbody: 'tbody',
    tr: 'tr',
    th: 'th',
    td: 'td',
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.resizeTo
Object.defineProperty(window, 'resizeTo', {
  writable: true,
  value: vi.fn(),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock IntersectionObserver
type GlobalWithMocks = typeof globalThis & {
  IntersectionObserver: typeof IntersectionObserver;
  ResizeObserver: typeof ResizeObserver;
  FileReader: typeof FileReader;
  crypto: Crypto;
  Blob: typeof Blob;
  performance: Performance;
  requestAnimationFrame: typeof requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
  getComputedStyle: typeof getComputedStyle;
  localStorage: Storage;
  sessionStorage: Storage;
  console: Console;
  testUtils: {
    createMockFile: (name?: string, type?: string, size?: number) => File;
    createMockBlob: (data?: string, type?: string) => Blob;
    waitFor: (ms?: number) => Promise<void>;
    createMockCanvas: (width?: number, height?: number) => HTMLCanvasElement;
    createMockImage: (src?: string) => HTMLImageElement;
  };
};

const global = globalThis as GlobalWithMocks;

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.FileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  readAsText: vi.fn(),
  readAsArrayBuffer: vi.fn(),
  readAsBinaryString: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  result: null,
  error: null,
  onload: null,
  onerror: null,
})) as unknown as typeof FileReader;

// Mock HTMLCanvas for image processing
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
    width: 1,
    height: 1,
  })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
}));

// Mock canvas.toBlob
HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
  callback(new Blob(['mock-canvas-data']));
});

// Mock crypto.subtle for PDF generation
Object.defineProperty(global.crypto, 'subtle', {
  value: {
    digest: vi.fn().mockResolvedValue(
      new ArrayBuffer(8),
    ),
  },
  writable: true,
});

// Mock Blob
const OriginalBlob = globalThis.Blob;
global.Blob = OriginalBlob;

// Mock URL.createObjectURL
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = vi.fn(() => 'blob:mock');
}

// Mock URL.revokeObjectURL
if (typeof URL.revokeObjectURL !== 'function') {
  URL.revokeObjectURL = vi.fn();
}

// Mock performance.now for animations
global.performance.now = vi.fn(() => Date.now());

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  return window.setTimeout(() => callback(Date.now()), 16);
});

// Mock cancelAnimationFrame
global.cancelAnimationFrame = vi.fn();

// Mock getComputedStyle
global.getComputedStyle = vi.fn(() => ({
  getPropertyValue: () => '',
}) as unknown as CSSStyleDeclaration) as unknown as typeof getComputedStyle;

// Mock localStorage
const localStorageMock = {
  length: 0,
  key: vi.fn(() => null),
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
} as unknown as Storage;
global.localStorage = localStorageMock;
global.sessionStorage = localStorageMock;

// Mock console methods for testing
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

// Setup test environment
beforeEach(() => {
  vi.clearAllMocks();
});

// Global test utilities
global.testUtils = {
  // Helper for creating mock files
  createMockFile: (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
    const content = new Uint8Array(size).fill(0);
    return new File([content], name, { type });
  },

  // Helper for creating mock blobs
  createMockBlob: (data = 'test', type = 'text/plain') => {
    return new Blob([data], { type });
  },

  // Helper for waiting for async operations
  waitFor: (ms = 0) => new Promise<void>(resolve => setTimeout(resolve, ms)),

  // Helper for creating mock canvas
  createMockCanvas: (width = 100, height = 100) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },

  // Helper for creating mock image
  createMockImage: (src = 'test.jpg') => {
    const img = new Image();
    img.src = src;
    return img;
  },
};

export default global.testUtils;
