/* Sinyal Haritası — uygulamanın kendisi çevrimdışı da açılsın diye küçük bir
   service worker. Ölçüm istekleri (farklı origin) hiç dokunulmadan geçer. */
const CACHE = "sinyal-haritasi-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-180.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  // Yalnızca uygulama kabuğuna karış. Ölçüm trafiği (payload.bin, ping.txt)
  // dokunulmadan geçmeli: önbelleğe alınırsa ölçüm anlamsızlaşır, ayrıca
  // kısmi (206) yanıtlar Cache API'ye konulamaz.
  if (e.request.headers.has("range")) return;
  const shell = SHELL.map(x => new URL(x, self.registration.scope).pathname);
  if (!shell.includes(url.pathname)) return;

  // Ağ önce, ama kısa süreli: telefon şebekeye bağlı olup veri akıtmadığında
  // (kapsama kenarı) sayfa dakikalarca beyaz kalmasın, önbellekten açılsın.
  const fromCache = () => caches.match(e.request).then(r => r || caches.match("./index.html"));
  const network = fetch(e.request).then(res => {
    // Yalnızca başarılı yanıtı sakla: 404/5xx önbelleğe yazılırsa kabuk bozulur.
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
    }
    return res;
  });
  const slow = new Promise(resolve => setTimeout(() => resolve(fromCache().then(r => r || network)), 3500));
  e.respondWith(Promise.race([network.catch(fromCache), slow]));
});
