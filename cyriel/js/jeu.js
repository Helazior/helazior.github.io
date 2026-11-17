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
import etape4 from './etapes/etape4.js';
import course from './etapes/etape-course.js';
import cafe from './etapes/cafe.js';

const ETAPES = [
  etape1,
  etape2,
  etape3,
  etape4,
  course,
  cafe,
];   // étape n° = position + 1

const CLE_ETAPE = 'cyriel.etape';
const CLE_MAX = 'cyriel.etape-max';   // l'étape la plus loin déjà atteinte sur cet appareil

// Le code secret (?cle=…) : sans lui, l'adresse ne permet ni de sauter à une
// étape pas encore atteinte, ni d'activer les aides d'essai (?debug). Seule
// son empreinte est gardée ici. Pour le changer : outils/cle.mjs.
const EMPREINTE_CLE = 1546458228;
function empreinte(texte) {
  let x = 2166136261;
  for (const o of new TextEncoder().encode(texte)) x = Math.imul(x ^ o, 16777619) >>> 0;
  return x;
}
const scene = document.getElementById('scene');
const theme = document.querySelector('meta[name="theme-color"]');
const params = new URLSearchParams(location.search);
const enLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
const cleBonne = enLocal || empreinte((params.get('cle') || '').trim().toLowerCase()) === EMPREINTE_CLE;

function etapeMax() {
  try {
    return Math.max(1, parseInt(localStorage.getItem(CLE_MAX), 10) || 0, parseInt(localStorage.getItem(CLE_ETAPE), 10) || 0);
  } catch { return 1; }
}

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
  try {
    const max = etapeMax();
    localStorage.setItem(CLE_ETAPE, String(n));
    localStorage.setItem(CLE_MAX, String(Math.max(max, n)));
  } catch { /* navigation privée */ }

  // L'adresse suit la progression (pour reprendre ailleurs, il faut le code).
  const p = new URLSearchParams(location.search);
  if (n > 1) p.set('etape', String(n)); else p.delete('etape');
  const suite = p.toString();
  history.replaceState(null, '', location.pathname + (suite ? '?' + suite : ''));

  nettoyer = etape.demarrer({
    scene, son, fx, memoire, fond,
    debug: cleBonne ? params.get('debug') : null,   // null, '', 'carte' ou 'vite'
    suivante: () => aller(numero + 1),
    derniere: n === ETAPES.length,
    numero: n,
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
  depart = borner(parseInt(params.get('etape'), 10));
  // Sans le code, on ne va pas plus loin que l'étape déjà atteinte.
  if (!cleBonne) depart = Math.min(depart, etapeMax());
} else {
  try { depart = parseInt(localStorage.getItem(CLE_ETAPE), 10) || 1; } catch { depart = 1; }
}
aller(depart);
