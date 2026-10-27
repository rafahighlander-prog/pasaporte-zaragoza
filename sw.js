const VERSION = 'v3';
const APP = `pasaporte-zgz-app-${VERSION}`;
const TILES = 'pasaporte-zgz-tiles';
const MAX_TILES = 500;

const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'css/styles.css', 'js/data.js', 'js/share.js', 'js/app.js',
  'vendor/leaflet.js', 'vendor/leaflet.css', 'vendor/montserrat.woff2',
  'img/logo-ministerio.jpg',
  'img/equipo/rafael.jpg', 'img/equipo/leonardo.jpg', 'img/equipo/ramon.jpg', 'img/equipo/alfonso.jpg',
  'img/hitos/1.jpg', 'img/hitos/2.jpg', 'img/hitos/3.jpg', 'img/hitos/4.jpg', 'img/hitos/5.jpg', 'img/hitos/6.jpg', 'img/hitos/7.jpg',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(APP).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== APP && k !== TILES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function recortar(cache) {
  const ks = await cache.keys();
  if (ks.length > MAX_TILES) await Promise.all(ks.slice(0, ks.length - MAX_TILES).map((k) => cache.delete(k)));
}

// Devuelve la copia en caché al instante y la refresca en segundo plano.
async function cachearYRefrescar(req, nombre, limitar) {
  const cache = await caches.open(nombre);
  const guardado = await cache.match(req, { ignoreSearch: false });
  const red = fetch(req).then((res) => {
    if (res.ok || res.type === 'opaque') {
      cache.put(req, res.clone()).then(() => limitar && recortar(cache));
    }
    return res;
  });
  if (guardado) { red.catch(() => {}); return guardado; }
  return red;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.hostname === 'tile.openstreetmap.org') {
    e.respondWith(cachearYRefrescar(req, TILES, true).catch(() => Response.error()));
    return;
  }
  if (url.origin === location.origin) {
    e.respondWith(
      cachearYRefrescar(req, APP, false).catch(() => (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))
    );
  }
});
