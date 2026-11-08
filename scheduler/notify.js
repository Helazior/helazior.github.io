// NOTIFICATIONS DU NAVIGATEUR (08/11/2026 : « fais les alertes quand l'onglet est
// ouvert, puis les notifications »). Le pont entre l'app (Kotlin, js et wasm) et
// les API du navigateur : Kotlin n'échange avec lui QUE des chaînes, la même
// interop pour les deux cibles (voir webMain/WebNotify.kt).
//
//  - Les alertes passent par le SERVICE WORKER (sw.js) dès qu'il est prêt :
//    `registration.showNotification` porte des boutons (Fait · Reporter) et
//    partage les ÉTIQUETTES (`tag`) avec les notifications push — une alerte
//    locale et la même alerte venue du serveur se remplacent au lieu de se doubler.
//    Sans service worker (navigation privée, vieux navigateur) : `new Notification`.
//  - Un bouton touché, une notification touchée ou balayée remontent à l'app par
//    une FILE (`take()`), relue par l'app chaque seconde : un message du service
//    worker ou une ouverture de page par `#notif=…` (l'app était fermée).
//  - L'abonnement PUSH (Web Push, clé VAPID publique) est demandé par l'app une
//    fois la permission accordée ; `subscription()` en rend le JSON, que l'app
//    enregistre sur le serveur (Supabase, table push_subscriptions).
(function () {
    var queue = [];
    var fallback = {};      // tag → Notification (sans service worker)
    var reg = null;
    var sub = '';           // JSON de l'abonnement push, '' tant qu'il n'y en a pas
    var subscribing = false;
    var SEEN_CACHE = 'scheduler-notif-seen';

    function supported() { return typeof Notification !== 'undefined'; }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function (r) {
            reg = r;
            return navigator.serviceWorker.ready;
        }).then(function (r) {
            reg = r;
            return r.pushManager ? r.pushManager.getSubscription() : null;
        }).then(function (s) {
            if (s) sub = JSON.stringify(s.toJSON());
        }).catch(function () { });
        navigator.serviceWorker.addEventListener('message', function (e) {
            if (e.data && e.data.type === 'scheduler-notif') queue.push(JSON.stringify(e.data));
        });
    }
    // Ouverte par un toucher sur une notification alors qu'aucun onglet n'existait.
    try {
        var m = location.hash.match(/notif=([^&]+)/);
        if (m) {
            queue.push(decodeURIComponent(m[1]));
            history.replaceState(null, '', location.pathname + location.search);
        }
    } catch (e) { }

    // Ce que l'app a montré elle-même : le service worker ne le remontre pas quand
    // le serveur envoie la même alerte (titre + texte identiques).
    function remember(tag, title, body) {
        if (!('caches' in window)) return;
        caches.open(SEEN_CACHE).then(function (c) {
            return c.put('/seen/' + encodeURIComponent(tag + '|' + title + '|' + body), new Response('1'));
        }).catch(function () { });
    }

    function b64ToBytes(b64) {
        var pad = '='.repeat((4 - b64.length % 4) % 4);
        var raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
        var out = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
        return out;
    }

    window.SchedulerNotify = {
        /** 'granted' · 'denied' · 'default' · 'unsupported' */
        permission: function () { return supported() ? Notification.permission : 'unsupported'; },

        /** Demande la permission (dans le geste de l'utilisateur, sinon refusée). */
        request: function () {
            if (!supported() || Notification.permission !== 'default') return;
            try { Notification.requestPermission(); } catch (e) { }
        },

        /**
         * Montre (ou remplace : même `tag`) une notification.
         * @param optionsJson {body, actions:[{action,title}], data, renotify, sticky, silent}
         */
        show: function (tag, title, optionsJson) {
            if (!supported() || Notification.permission !== 'granted') return;
            var o = {};
            try { o = JSON.parse(optionsJson); } catch (e) { }
            var opts = {
                body: o.body || '', tag: tag, data: o.data || {}, icon: 'icon-192.png', badge: 'icon-192.png',
                renotify: !!o.renotify, requireInteraction: !!o.sticky, silent: !!o.silent
            };
            if (!o.silent) remember(tag, title, opts.body);
            if (reg && reg.showNotification) {
                if (o.actions) opts.actions = o.actions;
                reg.showNotification(title, opts).catch(function () { });
                return;
            }
            try {
                if (fallback[tag]) fallback[tag].close();
                delete opts.renotify;
                var n = new Notification(title, opts);
                fallback[tag] = n;
                n.onclick = function () {
                    window.focus();
                    queue.push(JSON.stringify({ type: 'scheduler-notif', action: 'open', key: tag, data: opts.data }));
                    n.close();
                };
                n.onclose = function () {
                    if (fallback[tag] === n) delete fallback[tag];
                };
            } catch (e) { }
        },

        close: function (tag) {
            if (fallback[tag]) { fallback[tag].close(); delete fallback[tag]; }
            if (reg && reg.getNotifications) {
                reg.getNotifications({ tag: tag }).then(function (list) {
                    list.forEach(function (n) { n.close(); });
                }).catch(function () { });
            }
        },

        /** Le prochain événement venu d'une notification (JSON), '' s'il n'y en a pas. */
        take: function () { return queue.length ? queue.shift() : ''; },

        /** Abonne ce navigateur au push (clé VAPID publique en base64url). Sans effet si déjà fait. */
        subscribe: function (vapidKey) {
            if (sub || subscribing || !vapidKey || !supported() || Notification.permission !== 'granted') return;
            if (!('serviceWorker' in navigator)) return;
            subscribing = true;
            navigator.serviceWorker.ready.then(function (r) {
                if (!r.pushManager) return null;
                return r.pushManager.getSubscription().then(function (s) {
                    return s || r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(vapidKey) });
                });
            }).then(function (s) {
                if (s) sub = JSON.stringify(s.toJSON());
            }).catch(function () { }).then(function () { subscribing = false; });
        },

        /** L'abonnement push : {"endpoint":…, "keys":{"p256dh":…, "auth":…}} ou ''. */
        subscription: function () { return sub; },

        userAgent: function () { return navigator.userAgent || ''; }
    };
})();
