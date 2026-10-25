const CACHE='naturadex-v202610252244';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(ASSETS.map(a=>c.add(new Request(a,{cache:'reload'}))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* Même origine : le cache répond d'abord (fonctionne sans réseau), le réseau rafraîchit en arrière-plan pour la prochaine ouverture. */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(cached=>{
    const net=fetch(e.request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c))}return r}).catch(()=>null);
    if(cached){net.catch(()=>{});return cached}
    return net.then(r=>r||caches.match('./index.html'));
  }));
});
