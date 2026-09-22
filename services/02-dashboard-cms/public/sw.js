// HeroCMS Studio - Service Worker Auto-Retirement & Cache Invalidation
// This self-destructing script automatically clears all stale CacheStorage and unregisters itself.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[PWA] Purging obsolete cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        return self.registration.unregister();
      })
      .then(() => {
        return self.clients.matchAll({ type: 'window' });
      })
      .then((clients) => {
        // Claim clients and ensure clean network state
        for (const client of clients) {
          if (client.url && 'navigate' in client) {
            client.navigate(client.url);
          }
        }
      })
  );
});
