const assets = [
  '/',
  '/src',
  '/src/lib',
  'sw-register.js',
  'https://fonts.gstatic.com/s/bangers/v20/FeVQS0BTqb0h60ACH55Q2A.woff2',
  'https://fonts.gstatic.com/s/opensans/v28/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('assets').then((cache) => {
      cache.addAll(assets);
    })
  );
});

// Stale while revalidate strategy

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async function () {
      const cache = await caches.open('assets');
      const cachedResponse = await cache.match(event.request);
      const networkResponse = await fetch(event.request);

      if (networkResponse) {
        cache.put(event.request, networkResponse.clone());
      }

      return cachedResponse || networkResponse;
    })()
  );
});
