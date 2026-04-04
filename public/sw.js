const CACHE_NAME = "festie-guide-v1";
const OFFLINE_URLS = [
  "/guide/coachella",
  "/guide/coachella/schedule",
  "/guide/coachella/map",
  "/guide/coachella/faq",
  "/guide/coachella/my-schedule",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
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
  // Only handle same-origin navigation and asset requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Cache successful GET responses
          if (response.ok && event.request.method === "GET") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // If offline and not cached, return the main guide page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/guide/coachella");
          }
          return new Response("Offline", { status: 503 });
        });
    })
  );
});
