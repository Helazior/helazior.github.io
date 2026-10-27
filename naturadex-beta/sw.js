const CACHE='naturadex-v202610271400';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(ASSETS.map(a=>c.add(new Request(a,{cache:'reload'}))))).then(()=>self.skipWaiting()))});
const IMG='naturadex-img-v2'; /* photos Wikipédia : gardées après le premier affichage, pour le hors connexion. v2 : requête CORS pour voir le vrai statut, et seules les réponses réussies sont gardées (une 429 de Wikimedia restait en cache pour toujours) */
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==IMG).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* Même origine : le cache répond d'abord (fonctionne sans réseau), le réseau rafraîchit en arrière-plan pour la prochaine ouverture. */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(/\.(wikimedia|wikipedia)\.org$/.test(u.hostname)){e.respondWith(caches.open(IMG).then(async c=>{const hit=await c.match(u.href);if(hit) return hit;
    const r=await fetch(u.href,{mode:'cors',credentials:'omit'});if(r.ok) c.put(u.href,r.clone());return r}).catch(()=>fetch(e.request)));return}
  if(u.origin!==location.origin) return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(cached=>{
    const net=fetch(e.request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c))}return r}).catch(()=>null);
    if(cached){net.catch(()=>{});return cached}
    return net.then(r=>r||caches.match('./index.html'));
  }));
});
