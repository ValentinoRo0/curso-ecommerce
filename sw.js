/* Service worker: guarda la app para usarla sin conexión.
   Si publicas una versión nueva, cambia el número de VERSION. */
const VERSION = 'curso-v3';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => {
    const red = fetch(e.request).then(r => {
      if (r && r.status === 200 && new URL(e.request.url).origin === location.origin) {
        const copia = r.clone();
        caches.open(VERSION).then(c => c.put(e.request, copia));
      }
      return r;
    }).catch(() => hit);
    return hit || red;
  }));
});
