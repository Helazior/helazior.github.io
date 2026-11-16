// Étape 3 — peindre sur la paroi, comme un Homo sapiens.
//
// Deux dessins du Pech Merle à faire à la suite : le mammouth, puis la
// femme. Chaque modèle reste affiché ; après quelques secondes, un bouton
// « Reproduire » apparaît. Le toucher efface le modèle, et elle le refait
// de mémoire, au doigt, à l'ocre rouge.
//   - n'importe quel dessin est accepté : elle valide quand elle veut ;
//   - pas de gomme : on ne peut que recommencer le dessin en cours ;
//   - la lumière est celle d'une lampe à graisse qui suit le doigt, donc
//     elle ne voit jamais son dessin en entier ;
//   - à la fin, la lumière monte : ses deux figures apparaissent ensemble,
//     avec un chiffre du code.
//
// Ses dessins sont gardés en mémoire (clé « dessins ») pour la finale.

import { CODE } from '../code.js';
import { nuage } from './grotte.js';
import { mammouth, trait, OCRE_ROUGE } from './peintures.js';

/* ---- Réglages et textes (à modifier librement) ---- */

const CHIFFRE = CODE[1];           // 2e chiffre du code, révélé à la fin (voir js/code.js)

const TEXTES = {
  retiens: ['Retiens ce mammouth', 'Retiens cette femme'],
  reproduire: 'Reproduire',
  peins: ['À toi : peins-le de mémoire, avec ton doigt', 'Peins-la à côté de ton mammouth'],
  fin: 'Ton panneau du Pech Merle',
  recommencer: 'Recommencer',
  valider: 'Valider',
  continuer: 'Continuer',
};

// En secondes : apparition du modèle, délai avant « Reproduire », effacement.
const MONTRE = { entree: 0.8, avantBouton: 3, sortie: 0.6 };
const NOIR = 0.965;                // opacité de l'obscurité pendant qu'elle peint
const EPAISSEUR = 6.5;             // épaisseur du trait au doigt (px)

const TAU = Math.PI * 2;
const borner = (v, a, b) => Math.min(b, Math.max(a, v));

function toile(l, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(l));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/* ---- Les deux modèles ---- */

// Silhouette de femme penchée en avant, de profil (boîte 150 × 190) :
// poitrine lourde, fesses rondes bien détachées du dos et des jambes.
function femme(ctx, couleur) {
  trait(ctx, [[34, 30], [30, 20], [38, 13], [47, 18], [47, 30], [40, 34], [34, 30]], couleur, 2.8);           // tête
  trait(ctx, [[48, 32], [64, 38], [80, 48], [90, 60], [95, 76]], couleur, 3.4);                               // dos
  trait(ctx, [[95, 76], [104, 70], [119, 75], [129, 90], [130, 108], [121, 122], [105, 127]], couleur, 3.6);  // fesses
  trait(ctx, [[105, 127], [100, 143], [94, 162], [91, 182]], couleur, 3.2);                                   // jambe arrière
  trait(ctx, [[42, 36], [40, 48], [32, 60], [22, 76], [21, 90], [31, 97], [43, 90], [47, 79]], couleur, 3.2); // poitrine
  trait(ctx, [[47, 79], [45, 97], [50, 113], [62, 124], [78, 128]], couleur, 3.2);                            // ventre
  trait(ctx, [[78, 128], [80, 148], [81, 166], [83, 182]], couleur, 3);                                      // jambe avant
  trait(ctx, [[56, 44], [51, 57], [47, 66]], couleur, 2.6);                                                   // bras
}

const MODELES = [
  { l: 220, h: 175, dessin: (c) => mammouth(c, OCRE_ROUGE) },
  { l: 150, h: 190, dessin: (c) => femme(c, OCRE_ROUGE) },
];

function demarrer({ scene, son, memoire, suivante, debug }) {
  const racine = document.createElement('div');
  racine.className = 'e3';
  const ecran = toile(1, 1);
  ecran.setAttribute('role', 'img');
  ecran.setAttribute('aria-label', 'Une paroi de grotte éclairée à la lampe');
  const consigne = document.createElement('p');
  consigne.className = 'e3-consigne';
  const actions = document.createElement('div');
  actions.className = 'e3-actions';
  const bouton = (texte) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = texte;
    b.hidden = true;
    actions.append(b);
    return b;
  };
  const bReproduire = bouton(TEXTES.reproduire);
  const bRecommencer = bouton(TEXTES.recommencer);
  const bValider = bouton(TEXTES.valider);
  const bContinuer = bouton(TEXTES.continuer);
  racine.append(ecran, consigne, actions);
  scene.append(racine);
  const c = ecran.getContext('2d');

  let vivant = true;
  let image = 0;
  let dpr = 1;
  let vl = 0;
  let vh = 0;
  let mur = null;                 // texture de la paroi
  const peint = [null, null];     // une toile par dessin
  const modeles = [null, null];
  const traits = [[], []];        // traits[i] = liste de traits ; un trait = liste de [x, y] depuis le centre
  let enCours = null;             // trait en train d'être tracé

  let phase = 'montre';           // 'montre' → 'peint' → (2 fois) → 'fin'
  let index = 0;
  let tPhase = 0;
  let temps = 0;
  let avant = performance.now();
  let chiffreSonne = false;

  const lampe = { x: 0, y: 0, r: 100, noir: 1, cx: 0, cy: 0 };   // (cx, cy) = cible

  /* ------------------------------------------------- Mise en page */

  function zone(i) {
    const paysage = vl > vh * 1.1;
    const cx = paysage ? vl * (i ? 0.7 : 0.3) : vl * 0.5;
    const cy = paysage ? vh * 0.5 : vh * (i ? 0.69 : 0.31);
    const m = MODELES[i];
    const place = paysage ? { l: vl * 0.36, h: vh * 0.56 } : { l: vl * 0.78, h: vh * 0.28 };
    const e = Math.min(place.l / m.l, place.h / m.h, 2.2);
    return { cx, cy, e };
  }
  const rayonLampe = () => borner(Math.min(vl, vh) * 0.2, 70, 125);

  function fabriquerMur() {
    const pas = 3;
    const l = Math.ceil(vl / pas);
    const h = Math.ceil(vh / pas);
    const img = new ImageData(l, h);
    const d = img.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < l; x++) {
        const n = nuage(x * pas / 150, y * pas / 150, 501);
        const f = nuage(x * pas / 26, y * pas / 26, 777);
        const lum = 0.74 + 0.36 * n + 0.14 * f + (Math.random() - 0.5) * 0.05;
        const k = (y * l + x) * 4;
        d[k] = 186 * lum;
        d[k + 1] = 160 * lum;
        d[k + 2] = 122 * lum;
        d[k + 3] = 255;
      }
    }
    mur = toile(l, h);
    mur.getContext('2d').putImageData(img, 0, 0);
  }

  function fabriquerModeles() {
    MODELES.forEach((m, i) => {
      const k = zone(i).e * dpr;
      const t = toile(m.l * k, m.h * k);
      const tc = t.getContext('2d');
      tc.scale(k, k);
      m.dessin(tc);
      modeles[i] = t;
    });
  }

  /* ------------------------------------------------------ Peinture */

  function contextePeinture(i) {
    const p = peint[i].getContext('2d');
    p.setTransform(dpr, 0, 0, dpr, (vl / 2) * dpr, (vh / 2) * dpr);
    p.lineCap = 'round';
    p.strokeStyle = OCRE_ROUGE;
    p.fillStyle = OCRE_ROUGE;
    return p;
  }

  function peindreSegment(p, a, b) {
    p.globalAlpha = 0.86;
    p.lineWidth = EPAISSEUR * (0.82 + Math.random() * 0.36);
    p.beginPath();
    p.moveTo(a[0], a[1]);
    p.lineTo(b[0], b[1] + (a[0] === b[0] && a[1] === b[1] ? 0.01 : 0));
    p.stroke();
    // quelques grains de pigment autour du trait
    p.globalAlpha = 0.5;
    for (let n = 0; n < 2; n++) {
      p.beginPath();
      p.arc(b[0] + (Math.random() - 0.5) * EPAISSEUR * 1.9, b[1] + (Math.random() - 0.5) * EPAISSEUR * 1.9, 0.5 + Math.random() * 0.9, 0, TAU);
      p.fill();
    }
  }

  function repeindre(i) {
    peint[i] = toile(vl * dpr, vh * dpr);
    const p = contextePeinture(i);
    for (const t of traits[i]) {
      peindreSegment(p, t[0], t[0]);
      for (let n = 1; n < t.length; n++) peindreSegment(p, t[n - 1], t[n]);
    }
  }

  function ajuster() {
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    vl = racine.clientWidth;
    vh = racine.clientHeight;
    ecran.width = Math.round(vl * dpr);
    ecran.height = Math.round(vh * dpr);
    fabriquerMur();
    fabriquerModeles();
    repeindre(0);
    repeindre(1);
    viser();
  }

  /* -------------------------------------------------------- Phases */

  function viser() {
    const z = zone(Math.min(index, 1));
    lampe.cx = z.cx;
    lampe.cy = z.cy;
  }

  function entrer(nouvelle) {
    phase = nouvelle;
    tPhase = 0;
    bRecommencer.hidden = bValider.hidden = bReproduire.hidden = true;
    if (phase === 'montre') { consigne.textContent = TEXTES.retiens[index]; viser(); }
    if (phase === 'peint') { consigne.textContent = TEXTES.peins[index]; majBoutons(); }
    if (phase === 'fin') {
      consigne.textContent = TEXTES.fin;
      memoire.ecrire('dessins', traits.map((d) => d.map((t) => t.map(([x, y]) => [Math.round(x), Math.round(y)]))));
    }
  }

  function majBoutons() {
    const peut = phase === 'peint' && traits[index].length > 0;
    bRecommencer.hidden = bValider.hidden = !peut;
  }

  bRecommencer.addEventListener('click', () => {
    if (phase !== 'peint') return;
    son.bip('non');
    traits[index] = [];
    repeindre(index);
    majBoutons();
  });

  bValider.addEventListener('click', () => {
    if (phase !== 'peint' || !traits[index].length) return;
    son.bip('miam');
    if (index === 0) { index = 1; entrer('montre'); } else entrer('fin');
  });

  bContinuer.addEventListener('click', () => { son.bip('clic', 0.5); suivante(); });

  bReproduire.addEventListener('click', () => {
    if (phase !== 'montre') return;
    son.bip('clic', 0.6);
    entrer('efface');
  });

  /* ------------------------------------------------------- Pointeur */

  function point(e) {
    const b = ecran.getBoundingClientRect();
    return [e.clientX - b.left, e.clientY - b.top];
  }

  ecran.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    e.preventDefault();
    const [x, y] = point(e);
    if (phase !== 'peint') return;
    lampe.cx = x;
    lampe.cy = y;
    try { ecran.setPointerCapture(e.pointerId); } catch { /* sans gravité */ }
    enCours = [[x - vl / 2, y - vh / 2]];
    traits[index].push(enCours);
    peindreSegment(contextePeinture(index), enCours[0], enCours[0]);
    majBoutons();
  });

  ecran.addEventListener('pointermove', (e) => {
    if (phase !== 'peint') return;
    const [x, y] = point(e);
    lampe.cx = x;
    lampe.cy = y;
    if (!enCours) return;
    const p = [x - vl / 2, y - vh / 2];
    const d = enCours[enCours.length - 1];
    if (Math.hypot(p[0] - d[0], p[1] - d[1]) < 1.5) return;
    peindreSegment(contextePeinture(index), d, p);
    enCours.push(p);
  });

  const lever = () => { enCours = null; };
  ecran.addEventListener('pointerup', lever);
  ecran.addEventListener('pointercancel', lever);

  /* --------------------------------------------------------- Boucle */

  function alphaModele() {
    if (phase === 'montre') return Math.min(1, tPhase / MONTRE.entree);
    if (phase === 'efface') return Math.max(0, 1 - tPhase / MONTRE.sortie);
    return 0;
  }

  function avancer(dt) {
    temps += dt;
    tPhase += dt;
    if (phase === 'montre' && bReproduire.hidden && tPhase >= MONTRE.entree + MONTRE.avantBouton) bReproduire.hidden = false;
    if (phase === 'efface' && tPhase >= MONTRE.sortie) entrer('peint');

    // la lampe : large pour montrer le modèle, petite pour peindre, grande ouverte à la fin
    const petit = rayonLampe();
    let rCible = petit;
    let noirCible = NOIR;
    if (phase === 'montre' || phase === 'efface') {
      const z = zone(index);
      rCible = petit + (Math.max(MODELES[index].l, MODELES[index].h) * z.e * 0.95 - petit) * alphaModele();
    } else if (phase === 'fin') {
      rCible = Math.hypot(vl, vh);
      noirCible = 0.1;
      lampe.cx = vl / 2;
      lampe.cy = vh / 2;
    }
    const k = 1 - Math.exp(-dt * (phase === 'fin' ? 1.4 : 9));
    lampe.x += (lampe.cx - lampe.x) * (1 - Math.exp(-dt * 16));
    lampe.y += (lampe.cy - lampe.y) * (1 - Math.exp(-dt * 16));
    lampe.r += (rCible - lampe.r) * k;
    lampe.noir += (noirCible - lampe.noir) * k;

    if (phase === 'fin') {
      if (tPhase > 1.6 && !chiffreSonne) { chiffreSonne = true; son.bip('chiffre'); }
      if (tPhase > 3.2 && bContinuer.hidden) bContinuer.hidden = false;
    }
  }

  function dessiner() {
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.imageSmoothingQuality = 'high';
    c.drawImage(mur, 0, 0, ecran.width, ecran.height);

    // le modèle
    const a = alphaModele();
    if (a > 0) {
      const z = zone(index);
      const m = MODELES[index];
      c.globalAlpha = a;
      c.drawImage(modeles[index], (z.cx - (m.l * z.e) / 2) * dpr, (z.cy - (m.h * z.e) / 2) * dpr);
      c.globalAlpha = 1;
    }

    // ses dessins
    c.drawImage(peint[0], 0, 0);
    c.drawImage(peint[1], 0, 0);

    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    // le chiffre, révélé avec la lumière
    if (phase === 'fin' && tPhase > 1.6) {
      const t = Math.min(1, (tPhase - 1.6) / 0.8);
      const taille = borner(Math.min(vl, vh) * 0.17, 54, 96);
      c.save();
      c.globalAlpha = t * (0.9 + 0.1 * Math.sin(temps * 2.6));
      c.font = `700 ${taille}px DynaPuff, sans-serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.shadowColor = '#b06bff';
      c.shadowBlur = 26;
      c.fillStyle = '#9a45ff';
      const cx = Math.max(taille * 0.7, vl * 0.14);
      const cy = Math.max(taille * 0.75 + 44, vh * 0.15);
      c.fillText(String(CHIFFRE), cx, cy);
      c.shadowBlur = 0;
      c.lineWidth = 2;
      c.strokeStyle = '#ecd9ff';
      c.strokeText(String(CHIFFRE), cx, cy);
      c.restore();
    }

    // l'obscurité, trouée par la lampe à graisse qui vacille
    const vacille = 1 + 0.035 * Math.sin(temps * 11) + 0.025 * Math.sin(temps * 23.7 + 1);
    const r = lampe.r * vacille;
    const n = lampe.noir;
    const lueur = c.createRadialGradient(lampe.x, lampe.y, 0, lampe.x, lampe.y, r);
    lueur.addColorStop(0, `rgba(255, 170, 70, ${0.16 * n})`);
    lueur.addColorStop(1, 'rgba(255, 150, 50, 0)');
    c.fillStyle = lueur;
    c.fillRect(0, 0, vl, vh);
    const ombre = c.createRadialGradient(lampe.x, lampe.y, r * 0.12, lampe.x, lampe.y, r);
    ombre.addColorStop(0, 'rgba(0, 0, 0, 0)');
    ombre.addColorStop(0.5, `rgba(0, 0, 0, ${n * 0.5})`);
    ombre.addColorStop(1, `rgba(0, 0, 0, ${n})`);
    c.fillStyle = ombre;
    c.fillRect(0, 0, vl, vh);
  }

  function boucle(t) {
    if (!vivant) return;
    const dt = Math.min(0.05, (t - avant) / 1000);
    avant = t;
    avancer(dt);
    dessiner();
    image = requestAnimationFrame(boucle);
  }

  ajuster();
  lampe.x = lampe.cx;
  lampe.y = lampe.cy;
  entrer('montre');
  window.addEventListener('resize', ajuster);
  // le chiffre utilise la police du jeu : on s'assure qu'elle est chargée
  if (document.fonts && document.fonts.load) document.fonts.load('700 60px DynaPuff').catch(() => {});
  image = requestAnimationFrame(boucle);

  if (debug !== null) {
    window.__e3 = { get phase() { return phase; }, get index() { return index; }, traits, zone };
  }

  return () => {
    vivant = false;
    cancelAnimationFrame(image);
    window.removeEventListener('resize', ajuster);
    delete window.__e3;
  };
}

export default {
  fond: 'sombre',
  ambiance: 'sons/etape-2.mp3',   // la même que la grotte
  demarrer,
};
