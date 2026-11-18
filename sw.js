/* Service worker mínimo para que la app se pueda instalar y abra offline.
   Estrategia: red primero; si no hay conexión, usa la última versión guardada. */
const CACHE = 'amedel-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Supabase y CDNs van siempre por red
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('./', c)); return r; })
        .catch(() => caches.match('./'))
    );
    return;
  }
  e.respondWith(
    fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })
      .catch(() => caches.match(req))
  );
});
