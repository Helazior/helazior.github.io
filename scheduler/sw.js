// SERVICE WORKER DE SCHEDULER (08/11/2026). Il ne met RIEN en cache (le site se
// recharge normalement) : il ne sert qu'aux notifications.
//  - push : une alerte envoyée par le serveur (fonction Supabase `send-alerts`,
//    quand l'onglet est fermé). Si l'app l'a déjà montrée elle-même (même
//    étiquette, même titre, même texte — voir notify.js), on ne la remontre pas.
//  - notificationclick / notificationclose : remontent à l'app (bouton Fait,
//    Reporter, Étape faite ; toucher = ouvrir ; balayer = l'alerte est vue).
var SEEN_CACHE = 'scheduler-notif-seen';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

function seenKey(tag, title, body) {
    return '/seen/' + encodeURIComponent(tag + '|' + title + '|' + body);
}

self.addEventListener('push', function (e) {
    var d = {};
    try { d = e.data ? e.data.json() : {}; } catch (err) { }
    var title = d.title || 'Scheduler';
    var body = d.body || '';
    var tag = d.tag || 'scheduler-push';
    e.waitUntil(caches.open(SEEN_CACHE).then(function (c) {
        return c.match(seenKey(tag, title, body)).then(function (hit) {
            if (hit) return null;
            c.put(seenKey(tag, title, body), new Response('1'));
            var opts = {
                body: body, tag: tag, data: d.data || {}, icon: 'icon-192.png', badge: 'icon-192.png',
                renotify: !!d.renotify, requireInteraction: !!d.sticky
            };
            if (d.actions) opts.actions = d.actions;
            return self.registration.showNotification(title, opts);
        });
    }).catch(function () {
        return self.registration.showNotification(title, { body: body, tag: tag, data: d.data || {} });
    }));
});

function tell(msg) {
    return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
        if (list.length) {
            list[0].postMessage(msg);
            return list[0];
        }
        return null;
    });
}

self.addEventListener('notificationclick', function (e) {
    var n = e.notification;
    n.close();
    var msg = { type: 'scheduler-notif', action: e.action || 'open', key: n.tag, data: n.data || {} };
    e.waitUntil(tell(msg).then(function (client) {
        if (client) return client.focus ? client.focus() : null;
        return self.clients.openWindow(self.registration.scope + '#notif=' + encodeURIComponent(JSON.stringify(msg)));
    }));
});

self.addEventListener('notificationclose', function (e) {
    var n = e.notification;
    e.waitUntil(tell({ type: 'scheduler-notif', action: 'dismissed', key: n.tag, data: n.data || {} }));
});
