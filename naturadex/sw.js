const CACHE='naturadex-v202610261721';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(ASSETS.map(a=>c.add(new Request(a,{cache:'reload'}))))).then(()=>self.skipWaiting()))});
const IMG='naturadex-img'; /* photos Wikipédia des espèces découvertes : gardées après le premier affichage, pour le hors connexion */
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==IMG).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* Même origine : le cache répond d'abord (fonctionne sans réseau), le réseau rafraîchit en arrière-plan pour la prochaine ouverture. */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.hostname==='upload.wikimedia.org'){e.respondWith(caches.open(IMG).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque')) c.put(e.request,r.clone());return r}))));return}
  if(u.origin!==location.origin) return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(cached=>{
    const net=fetch(e.request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c))}return r}).catch(()=>null);
    if(cached){net.catch(()=>{});return cached}
    return net.then(r=>r||caches.match('./index.html'));
  }));
});
