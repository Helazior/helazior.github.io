// Chef d'orchestre : une seule page, une étape à la fois.
//
// Pour ajouter une étape : créer js/etapes/etapeN.js sur le modèle des
// autres, puis l'ajouter à la liste ETAPES ci-dessous, à sa place.
//
// Une étape est un objet :
//   fond      'clair' ou 'sombre' (couleur de fond de la page)
//   ambiance  chemin du fichier son de fond, ou null
//   preparer  (facultatif) précalcule ce qui est long, pendant l'étape d'avant
//   demarrer  reçoit le contexte ci-dessous, renvoie une fonction de nettoyage

import * as son from './son.js';
import * as fx from './fx.js';
import etape1 from './etapes/etape1.js';
import etape2 from './etapes/etape2.js';
import etape3 from './etapes/etape3.js';
import aVenir from './etapes/a-venir.js';

const ETAPES = [etape1, etape2, etape3, aVenir];   // étape n° = position + 1

const CLE_ETAPE = 'cyriel.etape';
const scene = document.getElementById('scene');
const theme = document.querySelector('meta[name="theme-color"]');
const params = new URLSearchParams(location.search);

/** Petite mémoire qui survit à la fermeture de la page (sur un même appareil). */
const memoire = {
  lire(cle, defaut = null) {
    try {
      const v = localStorage.getItem('cyriel.' + cle);
      return v === null ? defaut : JSON.parse(v);
    } catch { return defaut; }
  },
  ecrire(cle, valeur) {
    try { localStorage.setItem('cyriel.' + cle, JSON.stringify(valeur)); } catch { /* navigation privée */ }
  },
};

let numero = 0;
let nettoyer = null;

function fond(nom) {
  document.body.dataset.fond = nom;
  if (theme) theme.content = nom === 'sombre' ? '#000000' : '#fbf8ff';
}

function borner(n) {
  return Math.min(ETAPES.length, Math.max(1, Math.round(n) || 1));
}

function aller(n) {
  n = borner(n);
  if (typeof nettoyer === 'function') nettoyer();
  nettoyer = null;
  scene.replaceChildren();
  numero = n;

  const etape = ETAPES[n - 1];
  fond(etape.fond);
  son.ambiance(etape.ambiance || null);
  try { localStorage.setItem(CLE_ETAPE, String(n)); } catch { /* navigation privée */ }

  // L'adresse suit la progression : ?etape=4 permet de reprendre ailleurs.
  const p = new URLSearchParams(location.search);
  if (n > 1) p.set('etape', String(n)); else p.delete('etape');
  const suite = p.toString();
  history.replaceState(null, '', location.pathname + (suite ? '?' + suite : ''));

  nettoyer = etape.demarrer({
    scene, son, fx, memoire, fond,
    debug: params.get('debug'),   // null, '' ou 'carte'
    suivante: () => aller(numero + 1),
    aller,
  });

  // On prépare l'étape d'après pendant que celle-ci se joue.
  const prochaine = ETAPES[n];
  if (prochaine && prochaine.preparer) {
    const plusTard = window.requestIdleCallback || ((f) => setTimeout(f, 300));
    plusTard(() => prochaine.preparer());
  }
}

/* --------------------------------------------------- Bouton du son */

const boutonSon = document.getElementById('son');
function peindreBoutonSon() {
  const coupe = son.estCoupe();
  boutonSon.setAttribute('aria-pressed', String(coupe));
  boutonSon.setAttribute('aria-label', coupe ? 'Remettre le son' : 'Couper le son');
}
boutonSon.addEventListener('click', (e) => {
  e.stopPropagation();
  son.eveiller();
  son.basculer();
  peindreBoutonSon();
});
peindreBoutonSon();

// Le son ne peut démarrer qu'après un premier geste.
for (const geste of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) {
  window.addEventListener(geste, () => son.eveiller(), { capture: true, passive: true });
}

/* ------------------------------------------------------- Départ */

let depart = 1;
if (params.has('etape')) {
  depart = parseInt(params.get('etape'), 10);
} else {
  try { depart = parseInt(localStorage.getItem(CLE_ETAPE), 10) || 1; } catch { depart = 1; }
}
aller(depart);
