// Service Worker for caching and offline support
// NOTE: Keep caching conservative to avoid serving stale JS bundles (can break React hooks).

const CACHE_VERSION = "v2";
const CACHE_NAME = `nieuwblik-${CACHE_VERSION}`;
const RUNTIME_CACHE = `nieuwblik-runtime-${CACHE_VERSION}`;

// Assets to cache on install (keep this list small + always available)
const PRECACHE_ASSETS = ["/", "/index.html", "/favicon.png", "/og-image.webp", "/robots.txt", "/sitemap.xml"];

const isSameOrigin = (request) => {
  try {
    const url = new URL(request.url);
    return url.origin === self.location.origin;
  } catch {
    return false;
  }
};

const shouldBypassCache = (request) => {
  const url = new URL(request.url);

  // Never cache Vite dev/preview modules or internal endpoints
  if (
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/node_modules/") ||
    url.pathname.includes("/__vite")
  ) {
    return true;
  }

  // Never cache JS; stale JS can cause React to load twice
  if (request.destination === "script") return true;

  return false;
};

const networkFirst = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || (await caches.match("/index.html"));
  }
};

const cacheFirst = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
};

// Install event - cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Only handle same-origin requests
  if (!isSameOrigin(event.request)) return;

  if (shouldBypassCache(event.request)) return;

  // Always network-first for navigations (HTML)
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Cache-first for images/fonts/styles
  if (["image", "font", "style"].includes(event.request.destination)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Default: network-first (API-like or other requests)
  event.respondWith(networkFirst(event.request));
});

