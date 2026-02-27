const CACHE_NAME = 'paris-plans-v1';
const STATIC_ASSETS = [
  './index.html',
  './plans.json',
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Spectral:wght@300;400;600&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Toujours récupérer plans.json depuis le réseau (pour mises à jour sans republier)
  if (url.includes('plans.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first pour les tuiles cartographiques
  if (url.includes('/tuile/') || url.includes('tile.openstreetmap') || url.includes('wxs.ign.fr')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME + '-tiles').then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Network-first pour le reste
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
