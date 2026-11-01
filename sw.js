// Service worker: застосунок працює без інтернету.
// Сторінка — спершу з мережі (щоб одразу отримувати оновлення), а без мережі чи при повільній — з кешу.
// Фото та іконки — з кешу. Якщо змінюєш або додаєш фото чи іконки, збільш STATIC_CACHE_VERSION.
const STATIC_CACHE_VERSION = 1;
const STATIC_CACHE = `gym-tracker-static-v${STATIC_CACHE_VERSION}`;
const PAGE_CACHE = 'gym-tracker-page';
const NETWORK_TIMEOUT_MS = 3000;

const EXERCISE_IDS = [
  'cable-curl', 'chest-press', 'chest-supported-row', 'face-pull', 'hammer-curl', 'incline-chest-press',
  'lat-pulldown', 'lateral-raise', 'machine-curl', 'neutral-lat-pulldown', 'pec-deck', 'preacher-curl',
  'reverse-pec-deck', 'rope-pushdown', 'seated-cable-row', 'shoulder-press', 'triceps-extension', 'triceps-pushdown',
];
const STATIC_ASSETS = [
  'manifest.json',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  ...EXERCISE_IDS.flatMap((id) => [`photos/${id}-1.jpg`, `photos/${id}-2.jpg`]),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
      caches.open(PAGE_CACHE).then((cache) => cache.add('./')),
    ]).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC_CACHE && k !== PAGE_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(request.mode === 'navigate' ? pageFirstFromNetwork(request) : staticFromCache(request));
});

async function pageFirstFromNetwork(request) {
  const cache = await caches.open(PAGE_CACHE);
  const network = fetch(request).then((response) => {
    if (response.ok) cache.put('./', response.clone());
    return response;
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS));
  try {
    const response = await Promise.race([network, timeout]);
    if (response) return response;
  } catch (e) {
    // Немає мережі — віддаємо збережену сторінку.
  }
  return (await cache.match('./')) || network;
}

async function staticFromCache(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(STATIC_CACHE)).put(request, response.clone());
  return response;
}
