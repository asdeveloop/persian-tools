const CACHE_VERSION = 'v3-2026-02-03';
const SHELL_CACHE = `persian-tools-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `persian-tools-runtime-${CACHE_VERSION}`;

const OFFLINE_URL = '/offline';
const SHELL_ASSETS = ['/', OFFLINE_URL, '/manifest.webmanifest'];
const STATIC_CACHE_PATHS = ['/_next/static/', '/icons/', '/images/'];
const STATIC_FILE_EXTENSIONS = ['.css', '.js', '.woff2', '.png', '.jpg', '.jpeg', '.svg', '.webp'];

const isStaticAsset = (url) => {
  if (STATIC_CACHE_PATHS.some((path) => url.pathname.startsWith(path))) {
    return true;
  }
  return STATIC_FILE_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
};

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
    );
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(SHELL_ASSETS).catch(() => {
        // Ignore cache failures to avoid blocking install.
      }),
    ),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![SHELL_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))),
    );
    return;
  }

  if (url.origin === self.location.origin) {
    if (isStaticAsset(url)) {
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) {
            return cached;
          }
          return fetch(request)
            .then((response) => {
              const clone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
              return response;
            })
            .catch(() => cached);
        }),
      );
      return;
    }
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      }),
    );
  }
});
