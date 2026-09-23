/* Service Worker: macht Voltage installierbar und offline startbar.
   Netz zuerst (Updates kommen sofort an), bei fehlendem Netz der Cache.
   Anfragen an andere Server (z.B. Firebase) werden nie zwischengespeichert. */
const CACHE = "voltage-v1";
const DATEIEN = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon.svg", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((schluessel) => Promise.all(schluessel.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((antwort) => {
        if (antwort.ok) { const kopie = antwort.clone(); caches.open(CACHE).then((c) => c.put(e.request, kopie)); }
        return antwort;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("./index.html")))
  );
});
