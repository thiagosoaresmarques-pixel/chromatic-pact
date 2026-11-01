const CACHE_VERSION = 'chromatic-pact-v16';
const ASSET_CACHE = `${CACHE_VERSION}-assets`;

const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.ico?v=11',
  '/icons/brand-coroa-prisma.png',
  '/icons/favicon-32.png?v=12',
  '/icons/favicon-64.png?v=12',
  '/icons/icon-192.png?v=12',
  '/icons/icon-256.png?v=12',
  '/icons/icon-512.png?v=12',
  '/icons/icon-maskable-512.png?v=12',
  '/icons/apple-touch-icon.png?v=11',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(ASSET_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => undefined)
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('chromatic-pact-') && key !== ASSET_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never cache real-time multiplayer SSE/API calls
  if (url.pathname.startsWith('/api/')) return;

  // HTML / Document navigation & Web App Manifest:
  // Strict Network-First (bypassing HTTP disk cache via 'no-store') so returning users
  // ALWAYS receive the newest deployed JS/CSS bundle hashes immediately!
  if (
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    url.pathname.endsWith('.webmanifest')
  ) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Immutable content-hashed Vite JS/CSS bundles (/assets/index-XYZ.js): Cache-First
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            if (res && res.status === 200) {
              cache.put(req, res.clone());
            }
            return res;
          });
        })
      )
    );
    return;
  }

  // Static artwork, maps, tabletops, icons: Stale-While-Revalidate
  const isCacheableArt =
    url.pathname.startsWith('/cards/') ||
    url.pathname.startsWith('/map/') ||
    url.pathname.startsWith('/tabletops/') ||
    url.pathname.startsWith('/icons/');

  if (isCacheableArt) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const networkFetch = fetch(req)
            .then((res) => {
              if (res && res.status === 200) {
                cache.put(req, res.clone());
              }
              return res;
            })
            .catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
  }
});
