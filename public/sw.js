const CACHE_VERSION = 3;
const CACHE_NAME = `festie-guide-v${CACHE_VERSION}`;

// Pages to pre-cache on install
const PRECACHE_URLS = [
  "/guide/coachella",
  "/guide/coachella/schedule",
  "/guide/coachella/map",
  "/guide/coachella/faq",
  "/guide/coachella/my-schedule",
  "/guide/coachella/ai",
  "/ai-worker.js",
  "/manifest.json",
];

// Patterns to cache on first fetch (fonts, images, JS/CSS chunks)
const CACHEABLE_PATTERNS = [
  /\/_next\/static\//,
  /\/fonts\//,
  /\/icons\//,
  /\/models\//,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip API routes — always go to network
  if (url.pathname.startsWith("/api/")) return;

  // Static assets: cache-first
  const isCacheableAsset = CACHEABLE_PATTERNS.some((p) => p.test(url.pathname));
  if (isCacheableAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Guide pages: network-first with cache fallback (so users get fresh content when online)
  if (url.pathname.startsWith("/guide/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match("/guide/coachella");
          });
        })
    );
    return;
  }

  // Everything else: network with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && url.pathname.startsWith("/guide/")) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match("/guide/coachella");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});
