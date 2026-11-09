// LE DÉMARRAGE DE LA PAGE (08/11/2026 : sorti de index.html pour la politique de
// sécurité du contenu — aucun script en ligne n'est permis, voir la balise CSP).
// Une page affichée DANS UN CADRE d'un autre site (piège à clics) se libère : la
// balise CSP ne peut pas interdire les cadres (frame-ancestors n'y vaut rien) et
// GitHub Pages ne laisse poser aucun en-tête.
if (window.top !== window.self) {
    try { window.top.location = window.self.location.href; } catch (e) { document.documentElement.style.display = 'none'; }
}
    // Les raccourcis de zoom de l'APP (Ctrl + molette, Ctrl + / −) sont aussi ceux du
    // navigateur : sans ceci, Firefox et Chrome agrandissaient la page EN MÊME TEMPS que
    // le calendrier (vu : la fenêtre passait à 133 %). preventDefault laisse l'événement
    // arriver à Compose, il ne retire que l'effet du navigateur. Rien d'autre n'est
    // intercepté : les champs de texte gardent toutes leurs touches.
    // LE CLAVIER DÈS L'OUVERTURE : Compose n'écoute les touches que sur son canevas
    // (dans l'ombre du <body>), et personne ne lui donne le focus avant un premier
    // clic — F1, « ? », les flèches restaient lettre morte jusque-là. Un focus posé
    // une fois à sa naissance ne tenait pas (vérifié : relu nul 3 s plus tard) ; on
    // le lui rend donc tant que RIEN dans la page ne l'a — et seulement si la page
    // elle-même a le focus, pour ne jamais le voler à la barre d'adresse.
    setInterval(function () {
        if (!document.hasFocus()) return;
        var root = document.body && document.body.shadowRoot;
        if (!root || root.activeElement) return;
        var canvas = root.querySelector('canvas');
        if (canvas) canvas.focus();
    }, 250);
    // UN CHAMP QUI DISPARAÎT EMPORTE LE FOCUS : Compose crée un <textarea> caché pour
    // la saisie et le retire à la fermeture de la pilule ou d'une page — plus rien
    // n'a le focus, le canevas n'entend plus les touches (mesuré : activeElement nul
    // après Échap). Le retrait d'un champ de l'ombre du <body> est OBSERVÉ (un élément
    // retiré ne signale pas toujours qu'il perd le focus), et le canevas reprend le
    // focus si plus rien ne l'a. Un clic dans la barre d'adresse ne retire rien.
    (function () {
        var observing = null;
        function refocusIfOrphan(root) {
            if (root.activeElement) return;
            var canvas = root.querySelector('canvas');
            if (canvas) canvas.focus();
        }
        function isField(node) {
            return node && node.nodeType === 1 && (node.tagName === 'TEXTAREA' || node.tagName === 'INPUT' || (node.querySelector && node.querySelector('textarea,input')));
        }
        setInterval(function () {
            var root = document.body && document.body.shadowRoot;
            if (!root || observing === root) return;
            observing = root;
            new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    var removed = mutations[i].removedNodes;
                    for (var j = 0; j < removed.length; j++) {
                        if (isField(removed[j])) { setTimeout(function () { refocusIfOrphan(root); }, 0); return; }
                    }
                }
            }).observe(root, { childList: true, subtree: true });
            root.addEventListener('focusout', function (e) {
                var target = e.composedPath ? e.composedPath()[0] : e.target;
                setTimeout(function () { if (target && !target.isConnected) refocusIfOrphan(root); }, 0);
            }, true);
        }, 200);
    })();
    window.addEventListener('wheel', function (e) {
        if (e.ctrlKey || e.metaKey) e.preventDefault();
    }, { passive: false, capture: true });
    window.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '_' || e.key === 'k' || e.key === 'K' || e.key === 'f' || e.key === 'F')) e.preventDefault();
    }, { capture: true });
// LE RETOUR DU NAVIGATEUR RESTE DANS L'APP (09/11/2026 : « quand je fais retour
// arrière dans un onglet, je veux que ça revienne en arrière et non que ça quitte
// la page web »). Une entrée d'historique « piège » est posée au-dessus de la page :
// le Retour la consomme (popstate), l'app reçoit un « Retour » (page, pilule, mois,
// puis l'onglet d'avant), et le piège est reposé. Quand l'app n'a plus rien à
// défaire (`canBack` faux, tenu à jour par l'app), le Retour quitte vraiment la
// page. Aucune donnée ne passe par l'adresse : l'URL ne change pas.
// Chrome ignore au Retour une entrée posée sans geste de l'utilisateur : le piège
// est (re)posé au premier toucher, clic ou touche s'il manque.
window.SchedulerBack = (function () {
    var armed = false, canBack = false, pending = 0;
    function arm() {
        if (armed) return;
        try { history.pushState({ schedulerTrap: true }, ''); armed = true; } catch (e) {}
    }
    window.addEventListener('pointerdown', arm, true);
    window.addEventListener('keydown', arm, true);
    window.addEventListener('popstate', function () {
        armed = false;
        if (canBack) { pending++; arm(); }
        else { history.back(); }
    });
    return {
        setCanBack: function (v) { canBack = !!v; },
        take: function () { var n = pending; pending = 0; return n; }
    };
})();
