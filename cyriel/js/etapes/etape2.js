// Étape 2 — la grotte en écholocation.
//
// Tout est noir : on ne voit que deux yeux minuscules.
//   - un clic sur la chauve-souris envoie une onde qui révèle la grotte
//     (ce qui est révélé reste visible) ;
//   - un clic ailleurs la fait voler en ligne droite vers ce point ; elle
//     s'arrête contre la roche s'il y a un obstacle sur le chemin ;
//   - la caméra la suit ; le but est de trouver la sortie lumineuse.
// Des moustiques sont à gober au passage, et l'une des peintures porte le
// premier chiffre du code.
//
// Pour les essais :  ?etape=2&debug=carte  révèle toute la grotte.

import { chauveSouris, yeux } from '../dessin.js';
import { creerGrotte, MONDE, DEPART, SORTIE, CHIFFRE, MOUSTIQUES, RAYON_CORPS } from './grotte.js';
import { peindreParois } from './peintures.js';
import { speleoClement, speleoCyriel } from './clins-doeil.js';

const TAU = Math.PI * 2;

const PORTEE = 430;          // portée d'une onde (px du monde)
const VITESSE_ONDE = 540;    // px par seconde
const RAYONS = 480;          // nombre de rayons lancés par onde
const PENETRATION = 16;      // l'onde éclaire un peu la surface de la roche
const PAUSE_ONDE = 0.3;      // secondes entre deux ondes

const ENVERGURE = 40;
const RAYON_CLIC = 42;       // zone de clic autour de la chauve-souris
const VITESSE_VOL = 430;
const GOBE = 26;             // distance à laquelle un moustique est gobé

const PORTEE_LUEUR = 300;    // jusqu'où porte la lumière de la sortie
const CASE_VU = 16;          // maille de la grille « déjà révélé »
const NOIR_APRES = 3;        // secondes de lumière après le passage d'une onde…
const NOIR_DUREE = 3;        // …puis l'obscurité revient petit à petit
const NOIR_MAX = 0.9;        // un souvenir très faible de la roche reste

const VIOLET = '#8f5cf7';

// Le passage vers les spéléos (galerie D → F) : des stalactites et des
// pierres se décrochent du plafond, chacune à son rythme. Elles tremblent
// (avec un petit craquement) avant de tomber. La chauve-souris a des cœurs :
// 1 au départ, +1 par moustique gobé, 3 au plus. Touchée, elle en perd un ;
// à zéro, elle repart du début du passage avec 1 cœur.
const COEURS = { depart: 1, max: 3, invulnerable: 1.4 };
const CHUTES = [
  // x : colonne de chute ; periode et decalage en secondes ; genre
  { x: 742, periode: 1.6, decalage: 0.0, genre: 'stalactite' },
  { x: 792, periode: 1.25, decalage: 0.55, genre: 'pierre' },
  { x: 846, periode: 1.8, decalage: 1.1, genre: 'stalactite' },
  { x: 952, periode: 1.45, decalage: 0.3, genre: 'stalactite' },
  { x: 1000, periode: 1.15, decalage: 0.85, genre: 'pierre' },
  { x: 1050, periode: 1.7, decalage: 1.35, genre: 'stalactite' },
];
const CHUTE_ALERTE = 0.5;     // secondes de tremblement avant la chute
const GRAVITE = 900;          // px du monde par seconde²
const REPRISE = { x: 650, y: 400 };   // le début du passage
const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const borner = (v, a, b) => Math.min(b, Math.max(a, v));
const pause = () => new Promise((r) => setTimeout(r, 0));

function toile(l, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(l));
  c.height = Math.max(1, Math.round(h));
  return c;
}

function zoomEcran() {
  return borner(Math.min(window.innerWidth, window.innerHeight) / 560, 1, 1.8);
}

/* ============================================================
   Préparation : calcul de la grotte et de son image.
   Fait une seule fois, par petites tranches, pendant l'étape 1.
   ============================================================ */

let pret = null;

function preparer() {
  if (!pret) pret = construire();
  return pret;
}

async function construire() {
  const grotte = creerGrotte();
  const { l, h } = MONDE;

  // Finesse de l'image de la grotte : assez pour l'écran, sans saturer la mémoire.
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const q = borner(Math.min(dpr * zoomEcran(), Math.sqrt(6e6 / (l * h))), 1, 2);

  const fond = new ImageData(l, h);
  const roche = new ImageData(l, h);
  const F = fond.data;
  const R = roche.data;
  let s = 12345;
  let dernier = performance.now();

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < l; x++) {
      const g = grotte.valeur(x, y);
      const n = grotte.texture(x, y);
      s = (Math.imul(s, 1664525) + 1013904223) | 0;
      const grain = ((s >>> 24) / 255 - 0.5) * 0.14;
      const k = (y * l + x) * 4;

      // paroi du fond, plus sombre au pied de la roche
      const ombre = 0.45 + 0.55 * borner(-g / 46, 0, 1);
      const lum = (0.62 + 0.75 * n + grain) * ombre;
      F[k] = 46 * lum;
      F[k + 1] = 37 * lum;
      F[k + 2] = 56 * lum;
      F[k + 3] = 255;

      // roche : liseré clair au bord, sombre en profondeur
      if (g > -1.5) {
        let t = borner(g / 20, 0, 1);
        t = t * t * (3 - 2 * t);
        const strate = 0.86 + 0.14 * Math.sin(y * 0.085 + n * 9);
        const m = (0.74 + 0.5 * n + grain) * strate;
        R[k] = (172 + (30 - 172) * t) * m;
        R[k + 1] = (150 + (22 - 150) * t) * m;
        R[k + 2] = (236 + (52 - 236) * t) * m;
        R[k + 3] = borner((g + 1.5) / 3, 0, 1) * 255;
      }
    }
    // on rend la main régulièrement pour ne pas saccader l'étape en cours
    if ((y & 15) === 15 && performance.now() - dernier > 10) {
      await pause();
      dernier = performance.now();
    }
  }

  const cFond = toile(l, h);
  cFond.getContext('2d').putImageData(fond, 0, 0);
  const cRoche = toile(l, h);
  cRoche.getContext('2d').putImageData(roche, 0, 0);
  await pause();

  const monde = toile(l * q, h * q);
  const m = monde.getContext('2d');
  m.imageSmoothingQuality = 'high';
  m.scale(q, q);
  m.drawImage(cFond, 0, 0);
  peindreParois(m);
  m.drawImage(cRoche, 0, 0);
  cFond.width = cFond.height = cRoche.width = cRoche.height = 1;   // libère la mémoire

  // Clin d'œil : Cyriel et Clément en spéléo, dans la salle des mammouths.
  // Ils sont dessinés à part, pour bouger un peu une fois découverts.
  const speleos = (await Promise.all([speleoClement(), speleoCyriel()].map((d) => imageSvg(d, SPELEO.k * q * 2))));
  return { grotte, monde, q, speleos };
}

// Où se tiennent les deux spéléos (pieds au sol), et leur taille.
const SPELEO = { x: 1204, y: 591, k: 1.5, ecart: 10 };

// Un morceau de SVG (origine aux pieds, dans un cadre de 80 × 90) en image,
// à l'échelle k ; null s'il ne se charge pas (la grotte reste sans eux).
async function imageSvg(dessin, k) {
  const l = 80;
  const h = 90;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -84 ${l} ${h}" width="${Math.round(l * k)}" height="${Math.round(h * k)}">${dessin}</svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ============================================================
   Le jeu
   ============================================================ */

function demarrer({ scene, son, fond, memoire, suivante, debug }) {
  const ecran = toile(1, 1);
  ecran.className = 'e2';
  ecran.setAttribute('role', 'img');
  ecran.setAttribute('aria-label', 'Une grotte plongée dans le noir');
  scene.append(ecran);
  const c = ecran.getContext('2d');

  let vivant = true;
  let image = 0;
  const ecouteurs = [];
  const ecouter = (cible, nom, f, opt) => { cible.addEventListener(nom, f, opt); ecouteurs.push([cible, nom, f, opt]); };

  // dimensions de l'écran
  let dpr = 1;
  let z = 1;        // zoom : pixels d'écran par pixel du monde
  let vl = 0;       // largeur de la vue, en pixels d'écran
  let vh = 0;
  function ajuster() {
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    z = zoomEcran();
    vl = window.innerWidth;
    vh = window.innerHeight;
    ecran.width = Math.round(vl * dpr);
    ecran.height = Math.round(vh * dpr);
  }
  ajuster();
  ecouter(window, 'resize', ajuster);
  c.fillStyle = '#000';
  c.fillRect(0, 0, ecran.width, ecran.height);

  preparer().then((m) => { if (vivant) jouer(m); });

  function jouer({ grotte, monde, q, speleos }) {
    // Ce qui a déjà été révélé : une image, et une grille grossière pour les tests.
    // On y dessine toujours en mode « éclaircir » : chaque pixel garde sa
    // valeur la plus claire, donc repasser au même endroit ne change rien et
    // une onde lointaine n'assombrit jamais ce qu'une autre a mieux éclairé.
    const revele = toile(monde.width, monde.height);
    const r = revele.getContext('2d');
    r.fillStyle = '#000';
    r.fillRect(0, 0, revele.width, revele.height);
    r.globalCompositeOperation = 'lighten';
    // Ce qu'on affiche : la même image, où les mailles retombées dans le noir
    // sont déjà assombries (« figées »), pour ne plus avoir à les voiler à
    // chaque image.
    const affiche = toile(monde.width, monde.height);
    const ra = affiche.getContext('2d');
    ra.fillStyle = '#000';
    ra.fillRect(0, 0, affiche.width, affiche.height);
    ra.globalCompositeOperation = 'lighten';
    const vuCols = Math.ceil(MONDE.l / CASE_VU);
    const vuRangs = Math.ceil(MONDE.h / CASE_VU);
    const vu = new Uint8Array(vuCols * vuRangs);
    const eclaire = new Float32Array(vuCols * vuRangs).fill(-1e9);   // dernier passage d'une onde
    const figee = new Uint8Array(vuCols * vuRangs);        // maille déjà assombrie dans « affiche »
    const sombre = new Float32Array(vuCols * vuRangs).fill(1);   // 0 en lumière … 1 dans le noir
    const ALPHA_NOIR = Math.round(255 * NOIR_MAX);
    const bordCase = (i) => Math.round(i * CASE_VU * q);
    // Une onde éclaire la maille (i, j) : elle et ses voisines, si elles
    // étaient figées dans le noir, retrouvent l'image d'origine.
    function allumer(i, j) {
      const n = j * vuCols + i;
      if (temps - eclaire[n] > NOIR_APRES) {
        for (let jj = Math.max(0, j - 1); jj <= Math.min(vuRangs - 1, j + 1); jj++) {
          for (let ii = Math.max(0, i - 1); ii <= Math.min(vuCols - 1, i + 1); ii++) {
            const m = jj * vuCols + ii;
            if (!figee[m]) continue;
            figee[m] = 0;
            const x = bordCase(ii);
            const y = bordCase(jj);
            const l = bordCase(ii + 1) - x;
            const h = bordCase(jj + 1) - y;
            ra.globalCompositeOperation = 'source-over';
            ra.drawImage(revele, x, y, l, h, x, y, l, h);
            ra.globalCompositeOperation = 'lighten';
          }
        }
      }
      eclaire[n] = temps;
      sombre[n] = 0;
    }
    const marquer = (x, y) => {
      const i = (x / CASE_VU) | 0;
      const j = (y / CASE_VU) | 0;
      if (i >= 0 && j >= 0 && i < vuCols && j < vuRangs) { vu[j * vuCols + i] = 1; allumer(i, j); }
    };
    // la roche éclairée un peu au-delà de ce qui compte comme « vu »
    const eclairer = (x, y) => {
      const i = (x / CASE_VU) | 0;
      const j = (y / CASE_VU) | 0;
      if (i >= 0 && j >= 0 && i < vuCols && j < vuRangs) allumer(i, j);
    };
    // Le voile qui ramène l'obscurité : une case par maille, agrandie et
    // adoucie au dessin. On ne le dessine que là où il change encore ; une
    // maille entièrement retombée dans le noir (elle et ses voisines) est
    // assombrie une fois pour toutes dans « affiche ».
    const nuit = toile(vuCols, vuRangs);
    const nc = nuit.getContext('2d');
    const nuitImg = nc.createImageData(vuCols, vuRangs);
    nuitImg.data.fill(0);
    for (let n = 0; n < vu.length; n++) nuitImg.data[n * 4 + 3] = ALPHA_NOIR;
    nc.putImageData(nuitImg, 0, 0);
    let voile = null;          // zone à voiler à cette image (ou null)
    const noirAutour = (i, j) => {
      for (let jj = j - 1; jj <= j + 1; jj++) {
        for (let ii = i - 1; ii <= i + 1; ii++) {
          if (ii < 0 || jj < 0 || ii >= vuCols || jj >= vuRangs) continue;
          if (sombre[jj * vuCols + ii] < 1) return false;
        }
      }
      return true;
    };
    const lumiereAutour = (i, j) => {
      for (let jj = j - 1; jj <= j + 1; jj++) {
        for (let ii = i - 1; ii <= i + 1; ii++) {
          if (ii < 0 || jj < 0 || ii >= vuCols || jj >= vuRangs) continue;
          if (sombre[jj * vuCols + ii] > 0) return false;
        }
      }
      return true;
    };
    function majNuit() {
      const d = nuitImg.data;
      let change = false;
      for (let n = 0; n < vu.length; n++) {
        if (figee[n]) continue;
        const a = Math.min(1, Math.max(0, (temps - eclaire[n] - NOIR_APRES) / NOIR_DUREE));
        sombre[n] = a;
        const v = Math.round(255 * NOIR_MAX * a * a * (3 - 2 * a));
        if (d[n * 4 + 3] !== v) { d[n * 4 + 3] = v; change = true; }
      }
      if (change) nc.putImageData(nuitImg, 0, 0);
      // fige ce qui est tout à fait noir ; repère ce qui reste à voiler
      const chemin = new Path2D();
      const marge = 1 / q;
      let aVoiler = false;
      let aFiger = false;
      ra.globalCompositeOperation = 'source-over';
      ra.fillStyle = `rgba(0, 0, 0, ${ALPHA_NOIR / 255})`;
      ra.beginPath();
      for (let j = 0; j < vuRangs; j++) {
        let debut = -1;
        for (let i = 0; i <= vuCols; i++) {
          const n = j * vuCols + i;
          let actif = false;
          if (i < vuCols && !figee[n]) {
            if (noirAutour(i, j)) {
              figee[n] = 1;
              aFiger = true;
              const x = bordCase(i);
              const y = bordCase(j);
              ra.rect(x, y, bordCase(i + 1) - x, bordCase(j + 1) - y);
            } else actif = !lumiereAutour(i, j);
          }
          if (actif && debut < 0) debut = i;
          if (!actif && debut >= 0) {
            chemin.rect(debut * CASE_VU - marge, j * CASE_VU - marge, (i - debut) * CASE_VU + 2 * marge, CASE_VU + 2 * marge);
            aVoiler = true;
            debut = -1;
          }
        }
      }
      if (aFiger) ra.fill();
      ra.globalCompositeOperation = 'lighten';
      voile = aVoiler ? chemin : null;
    }
    // 1 en pleine lumière, presque 0 une fois l'obscurité revenue.
    const lumiere = (x, y) => {
      const i = (x / CASE_VU) | 0;
      const j = (y / CASE_VU) | 0;
      if (!(i >= 0 && j >= 0 && i < vuCols && j < vuRangs) || !vu[j * vuCols + i]) return 0;
      const a = Math.min(1, Math.max(0, (temps - eclaire[j * vuCols + i] - NOIR_APRES) / NOIR_DUREE));
      return 1 - a;
    };
    const estVu = (x, y) => {
      const i = (x / CASE_VU) | 0;
      const j = (y / CASE_VU) | 0;
      return i >= 0 && j >= 0 && i < vuCols && j < vuRangs && vu[j * vuCols + i] === 1;
    };

    const bat = { x: DEPART.x, y: DEPART.y, vol: null, phase: 0, corps: 0, secousse: 0, joie: 0, penche: 0 };
    const cam = { x: 0, y: 0 };
    const ondes = [];
    const echos = [];        // petits points brillants là où l'onde touche la roche
    const etincelles = [];
    const moustiques = MOUSTIQUES.map((m, i) => ({ ...m, vivant: true, phase: i * 1.7 }));

    // Les chutes : plafond et sol de chaque colonne, calculés une fois.
    const chutes = CHUTES.map((def) => {
      // un point dans l'air de la galerie, à cette abscisse
      let y0 = 330;
      for (let y = 250; y < 420; y += 4) if (!grotte.bloque(def.x, y)) { y0 = y + 20; break; }
      const haut = y0 - grotte.rayon(def.x, y0, 0, -1, 200).d;
      const bas = y0 + grotte.rayon(def.x, y0, 0, 1, 200).d;
      const plafond = haut + 6;
      const longueur = def.genre === 'stalactite' ? 24 : 9;
      const sol = bas - (def.genre === 'stalactite' ? 2 : 7);
      const duree = Math.sqrt((2 * Math.max(10, sol - plafond - longueur)) / GRAVITE);
      return { ...def, plafond, sol, longueur, largeur: def.genre === 'stalactite' ? 7 : 8, duree, tau: 0, y: plafond, tombe: false, tremble: 0 };
    });
    const poussieres = [];   // grains qui tombent pendant le tremblement (décor)
    let coeurs = COEURS.depart;
    let invulnerable = 0;
    let reprise = -10;       // instant du dernier retour au début du passage

    // Les cœurs, en haut à gauche.
    const zoneCoeurs = document.createElement('div');
    zoneCoeurs.className = 'e2-coeurs';
    zoneCoeurs.setAttribute('aria-label', 'Cœurs');
    const COEUR_SVG = '<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 20.5 C5 15.5 1.5 12 1.5 7.4 C1.5 4.2 4 1.8 7 1.8 C9.2 1.8 11 3.1 12 4.9 C13 3.1 14.8 1.8 17 1.8 C20 1.8 22.5 4.2 22.5 7.4 C22.5 12 19 15.5 12 20.5 Z"/></svg>';
    for (let i = 0; i < COEURS.max; i++) {
      const s = document.createElement('span');
      s.className = 'e2-coeur';
      s.innerHTML = COEUR_SVG;
      zoneCoeurs.append(s);
    }
    scene.append(zoneCoeurs);
    function majCoeurs(effet = null) {
      zoneCoeurs.querySelectorAll('.e2-coeur').forEach((el, i) => {
        el.classList.toggle('e2-coeur-plein', i < coeurs);
        if (effet === 'gagne' && i === coeurs - 1) { el.classList.remove('e2-coeur-pop'); void el.offsetWidth; el.classList.add('e2-coeur-pop'); }
      });
      zoneCoeurs.setAttribute('aria-label', `${coeurs} cœur${coeurs > 1 ? 's' : ''} sur ${COEURS.max}`);
      if (effet === 'perd') { zoneCoeurs.classList.remove('e2-coeurs-touche'); void zoneCoeurs.offsetWidth; zoneCoeurs.classList.add('e2-coeurs-touche'); }
    }
    majCoeurs();

    function touchee(ch) {
      coeurs--;
      invulnerable = COEURS.invulnerable;
      bat.secousse = 0.35;
      son.bip('aie');
      for (let i = 0; i < 10; i++) eclat(bat.x, bat.y, '#ffb3c8', 120, 0.6);
      ch.tombe = false;
      ch.y = ch.sol + 100;   // la pierre éclate sur elle
      majCoeurs('perd');
      if (coeurs <= 0) {
        // retour au début du passage
        coeurs = COEURS.depart;
        reprise = temps;
        bat.vol = null;
        bat.x = REPRISE.x;
        bat.y = REPRISE.y;
        invulnerable = 2;
        son.bip('non');
        setTimeout(() => majCoeurs(), 350);
      }
    }

    function avancerChutes(dt) {
      for (const ch of chutes) {
        const avantTau = ch.tau;
        ch.tau = (temps + ch.decalage) % ch.periode;
        const debutChute = ch.periode - ch.duree;
        const debutAlerte = debutChute - CHUTE_ALERTE;
        const proche = Math.abs(bat.x - ch.x) < 360 && Math.abs(bat.y - ch.sol) < 300;
        // elle commence à trembler
        if (avantTau < debutAlerte && ch.tau >= debutAlerte && proche) {
          son.bip('craque', Math.max(0.15, 1 - Math.abs(bat.x - ch.x) / 360));
        }
        ch.tremble = ch.tau >= debutAlerte && ch.tau < debutChute ? 1 : 0;
        if (ch.tremble && poussieres.length < 40 && Math.random() < dt * 14) {
          poussieres.push({ x: ch.x + (Math.random() - 0.5) * 10, y: ch.plafond + 2, vy: 30, age: 0 });
        }
        // elle tombe
        if (ch.tau >= debutChute) {
          const t = ch.tau - debutChute;
          if (!ch.tombe && avantTau < debutChute) ch.tombe = true;
          if (ch.tombe) ch.y = ch.plafond + 0.5 * GRAVITE * t * t;
        } else ch.y = ch.plafond;
        // elle s'écrase au sol (le cycle recommence)
        if (ch.tau < avantTau) {
          if (ch.tombe) {
            for (let i = 0; i < 6; i++) eclat(ch.x, ch.sol, '#b9a6e8', 80, 0.45);
            if (proche) son.bip('caillou', Math.max(0.15, 1 - Math.abs(bat.x - ch.x) / 360));
          }
          ch.tombe = false;
          ch.y = ch.plafond;
        }
        // la chauve-souris est-elle touchée ?
        if (ch.tombe && invulnerable <= 0 && victoire < 0) {
          const dy = bat.y < ch.y - ch.longueur ? ch.y - ch.longueur - bat.y : bat.y > ch.y ? bat.y - ch.y : 0;
          const dx = Math.abs(bat.x - ch.x);
          if (dx < ch.largeur + RAYON_CORPS && dy < RAYON_CORPS) touchee(ch);
        }
      }
      for (let i = poussieres.length - 1; i >= 0; i--) {
        const p = poussieres[i];
        p.age += dt;
        p.vy += GRAVITE * 0.5 * dt;
        p.y += p.vy * dt;
        if (p.age > 0.6) poussieres.splice(i, 1);
      }
      invulnerable = Math.max(0, invulnerable - dt);
    }

    function dessinerChutes() {
      const vx0 = cam.x - 30;
      const vx1 = cam.x + vl / z + 30;
      for (const ch of chutes) {
        if (ch.x < vx0 || ch.x > vx1) continue;   // hors de l'écran
        // visible surtout là où une onde vient de passer
        const lu = debug === 'carte' ? 1 : lumiere(ch.x, ch.tombe ? ch.y : ch.plafond + 8);
        const a = 0.16 + 0.84 * lu;
        // repousse en haut après une chute
        const pousse = ch.tombe ? 1 : Math.min(1, ch.tau / 0.35);
        if (pousse <= 0.02) continue;
        const tx = ch.tremble ? Math.sin(temps * 90 + ch.x) * 1.4 : 0;
        const x = ch.x + tx;
        const y = ch.y;
        c.globalAlpha = a;
        c.fillStyle = '#5d4a82';
        c.strokeStyle = '#d2c3fa';
        c.lineWidth = 1.4;
        c.beginPath();
        if (ch.genre === 'stalactite') {
          const l = ch.longueur * pousse;
          const w = ch.largeur * pousse;
          const haut = ch.tombe ? y - ch.longueur : ch.plafond - 4;
          const bas = ch.tombe ? y : ch.plafond - 4 + l;
          c.moveTo(x - w, haut);
          c.quadraticCurveTo(x - w * 0.4, (haut + bas) / 2, x, bas);
          c.quadraticCurveTo(x + w * 0.4, (haut + bas) / 2, x + w, haut);
          c.closePath();
        } else {
          const r = ch.largeur * pousse;
          const cy = ch.tombe ? y - r : ch.plafond + r * 0.4;
          c.moveTo(x + r, cy);
          c.ellipse(x, cy, r, r * 0.82, 0.3, 0, TAU);
        }
        c.fill();
        c.stroke();
      }
      if (poussieres.length) {
        c.fillStyle = '#b9a6e8';
        for (const p of poussieres) {
          c.globalAlpha = 0.5 * (1 - p.age / 0.6);
          c.fillRect(p.x - 0.8, p.y - 0.8, 1.6, 1.6);
        }
      }
      c.globalAlpha = 1;
    }
    const centreChiffre = { x: CHIFFRE.x + CHIFFRE.l / 2, y: CHIFFRE.y + CHIFFRE.h / 2 };

    let temps = 0;
    let avant = performance.now();
    let derniereOnde = -10;
    let nbOndes = 0;
    let chiffreVu = -1;      // instant où le chiffre a été découvert
    let victoire = -1;
    let gobes = 0;
    let termine = false;

    /* ------------------------------------------ Visibilité depuis un point */

    function visibilite(ox, oy, portee) {
      const d = new Float32Array(RAYONS);
      const touche = new Uint8Array(RAYONS);
      for (let i = 0; i < RAYONS; i++) {
        const a = (i / RAYONS) * TAU;
        const res = grotte.rayon(ox, oy, Math.cos(a), Math.sin(a), portee);
        d[i] = res.d;
        touche[i] = res.touche ? 1 : 0;
      }
      return { d, touche };
    }

    // Image de tout ce qu'une source placée en (ox, oy) peut éclairer,
    // avec un bord qui s'estompe en fin de portée.
    function imageVisible(ox, oy, vis, portee) {
      const rt = portee + PENETRATION;
      const x0 = Math.round((ox - rt) * q);
      const y0 = Math.round((oy - rt) * q);
      const cote = Math.ceil(rt * 2 * q) + 2;
      const t = toile(cote, cote);
      const tc = t.getContext('2d');
      tc.save();
      tc.beginPath();
      for (let i = 0; i < RAYONS; i++) {
        const a = (i / RAYONS) * TAU;
        const d = vis.d[i] + (vis.touche[i] ? PENETRATION : 0);
        const px = (ox + Math.cos(a) * d) * q - x0;
        const py = (oy + Math.sin(a) * d) * q - y0;
        if (i === 0) tc.moveTo(px, py); else tc.lineTo(px, py);
      }
      tc.closePath();
      tc.clip();
      // portion du monde correspondante (bornée aux limites de l'image)
      const sx = Math.max(0, x0);
      const sy = Math.max(0, y0);
      const sl = Math.min(monde.width, x0 + cote) - sx;
      const sh = Math.min(monde.height, y0 + cote) - sy;
      if (sl > 0 && sh > 0) tc.drawImage(monde, sx, sy, sl, sh, sx - x0, sy - y0, sl, sh);
      tc.restore();
      // l'image s'assombrit jusqu'au noir en bout de portée
      tc.globalCompositeOperation = 'source-atop';
      const cx = ox * q - x0;
      const cy = oy * q - y0;
      const g = tc.createRadialGradient(cx, cy, 0, cx, cy, rt * q);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.68, 'rgba(0,0,0,0)');
      g.addColorStop(1, '#000');
      tc.fillStyle = g;
      tc.fillRect(0, 0, cote, cote);
      return { t, x0, y0 };
    }

    /* ---------------------------------------------------------- Ondes */

    function emettre() {
      if (temps - derniereOnde < PAUSE_ONDE || victoire >= 0) return;
      derniereOnde = temps;
      nbOndes++;
      const vis = visibilite(bat.x, bat.y, PORTEE);
      const img = imageVisible(bat.x, bat.y, vis, PORTEE);
      ondes.push({ x: bat.x, y: bat.y, r: 0, rAvant: 0, vis, img });
      bat.joie = 0.25;
      son.bip('onde');
    }

    function avancerOnde(o, dt) {
      o.rAvant = o.r;
      o.r = Math.min(PORTEE + PENETRATION, o.r + VITESSE_ONDE * dt);

      // révèle l'anneau que le front vient de parcourir
      r.save();
      r.beginPath();
      r.arc(o.x * q, o.y * q, o.r * q, 0, TAU);
      r.arc(o.x * q, o.y * q, Math.max(0, o.rAvant - 3) * q, 0, TAU, true);
      r.clip('evenodd');
      r.drawImage(o.img.t, o.img.x0, o.img.y0);
      r.restore();
      ra.save();
      ra.beginPath();
      ra.arc(o.x * q, o.y * q, o.r * q, 0, TAU);
      ra.arc(o.x * q, o.y * q, Math.max(0, o.rAvant - 3) * q, 0, TAU, true);
      ra.clip('evenodd');
      ra.drawImage(o.img.t, o.img.x0, o.img.y0);
      ra.restore();

      const limiteVu = PORTEE * 0.86;
      for (let i = 0; i < RAYONS; i++) {
        const a = (i / RAYONS) * TAU;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const d = o.vis.d[i];
        // l'onde vient de toucher la roche : un écho
        if (o.vis.touche[i] && d > o.rAvant && d <= o.r && (i & 1) === 0) {
          echos.push({ x: o.x + ca * d, y: o.y + sa * d, age: 0 });
        }
        const fin = Math.min(o.r, d + 6, limiteVu);
        for (let p = Math.max(0, o.rAvant - CASE_VU); p <= fin; p += 8) marquer(o.x + ca * p, o.y + sa * p);
        const finRoche = Math.min(o.r, d + PENETRATION + CASE_VU);
        for (let p = Math.max(fin, o.rAvant - CASE_VU); p <= finRoche; p += 8) eclairer(o.x + ca * p, o.y + sa * p);
      }
    }

    function finirOnde(o) {
      o.img.t.width = o.img.t.height = 1;   // libère la mémoire
    }

    /* ------------------------------------------------------------ Vol */

    function voler(mx, my) {
      if (victoire >= 0) return;
      const dx = mx - bat.x;
      const dy = my - bat.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) return;
      const ux = dx / dist;
      const uy = dy / dist;
      let libre = 0;
      for (let p = 3; p <= dist; p += 3) {
        if (grotte.bloque(bat.x + ux * p, bat.y + uy * p)) break;
        libre = p;
      }
      const heurte = libre < dist - 3;
      if (libre < 5) {            // collée à la roche dans cette direction
        bat.secousse = 0.22;
        son.bip('poc');
        return;
      }
      bat.vol = {
        x0: bat.x, y0: bat.y, x1: bat.x + ux * libre, y1: bat.y + uy * libre,
        t: 0, duree: Math.max(0.2, libre / VITESSE_VOL), heurte, ux,
      };
      son.bip('vol');
    }

    function avancerVol(dt) {
      const v = bat.vol;
      if (!v) { bat.penche *= Math.exp(-dt * 8); return; }
      v.t += dt;
      const p = Math.min(1, v.t / v.duree);
      // en douceur à l'arrivée ; sans freiner si elle va heurter la roche
      const e = v.heurte ? p * (0.55 + 0.45 * p) : p * p * (3 - 2 * p);
      bat.x = v.x0 + (v.x1 - v.x0) * e;
      bat.y = v.y0 + (v.y1 - v.y0) * e;
      bat.penche = v.ux * 0.28 * Math.sin(p * Math.PI);
      if (p >= 1) {
        if (v.heurte) {
          bat.secousse = 0.28;
          son.bip('poc');
          for (let i = 0; i < 7; i++) eclat(bat.x, bat.y, '#cdbdf2', 90);
        }
        bat.vol = null;
      }
    }

    function eclat(x, y, couleur, force = 120, duree = 0.7) {
      const a = Math.random() * TAU;
      const v = force * (0.3 + Math.random() * 0.7);
      etincelles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, age: 0, duree: duree * (0.6 + Math.random() * 0.6), couleur });
    }

    /* -------------------------------------------------------- Lumière */

    // La sortie éclaire les parois autour d'elle, sans avoir besoin d'onde.
    const visSortie = visibilite(SORTIE.x, SORTIE.y, PORTEE_LUEUR);
    {
      const img = imageVisible(SORTIE.x, SORTIE.y, visSortie, PORTEE_LUEUR);
      r.drawImage(img.t, img.x0, img.y0);
      img.t.width = img.t.height = 1;
      for (let i = 0; i < RAYONS; i++) {
        const a = (i / RAYONS) * TAU;
        for (let p = 0; p <= Math.min(visSortie.d[i], PORTEE_LUEUR * 0.8); p += 8) {
          marquer(SORTIE.x + Math.cos(a) * p, SORTIE.y + Math.sin(a) * p);
        }
      }
    }
    // Le halo lui-même, dessiné une fois pour toutes.
    const lueur = toile(PORTEE_LUEUR * 2, PORTEE_LUEUR * 2);
    {
      const lc = lueur.getContext('2d');
      lc.beginPath();
      for (let i = 0; i < RAYONS; i++) {
        const a = (i / RAYONS) * TAU;
        const d = visSortie.d[i] + 4;
        const px = PORTEE_LUEUR + Math.cos(a) * d;
        const py = PORTEE_LUEUR + Math.sin(a) * d;
        if (i === 0) lc.moveTo(px, py); else lc.lineTo(px, py);
      }
      lc.closePath();
      lc.clip();
      const g = lc.createRadialGradient(PORTEE_LUEUR, PORTEE_LUEUR, 0, PORTEE_LUEUR, PORTEE_LUEUR, PORTEE_LUEUR);
      g.addColorStop(0, 'rgba(255, 250, 225, 1)');
      g.addColorStop(0.16, 'rgba(255, 240, 190, 0.85)');
      g.addColorStop(0.45, 'rgba(255, 222, 150, 0.3)');
      g.addColorStop(1, 'rgba(255, 210, 130, 0)');
      lc.fillStyle = g;
      lc.fillRect(0, 0, lueur.width, lueur.height);
    }

    if (debug === 'carte') {
      r.globalCompositeOperation = 'source-over';
      r.drawImage(monde, 0, 0);
      r.globalCompositeOperation = 'lighten';
      ra.globalCompositeOperation = 'source-over';
      ra.drawImage(monde, 0, 0);
      vu.fill(1);
      eclaire.fill(Infinity);
    }

    /* --------------------------------------------------------- Caméra */

    function cibleCamera() {
      const l = vl / z;
      const h = vh / z;
      return {
        x: l >= MONDE.l ? (MONDE.l - l) / 2 : borner(bat.x - l / 2, 0, MONDE.l - l),
        y: h >= MONDE.h ? (MONDE.h - h) / 2 : borner(bat.y - h / 2, 0, MONDE.h - h),
      };
    }
    Object.assign(cam, cibleCamera());

    /* --------------------------------------------------------- Entrées */

    ecouter(ecran, 'pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      const b = ecran.getBoundingClientRect();
      const mx = cam.x + (e.clientX - b.left) / z;
      const my = cam.y + (e.clientY - b.top) / z;
      if (Math.hypot(mx - bat.x, my - bat.y) <= RAYON_CLIC) emettre();
      else voler(mx, my);
    });
    ecouter(window, 'keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); emettre(); }
    });

    /* ----------------------------------------------------------- Boucle */

    let eclatSpeleo = 0;
    // les spéléos, assombris une fois pour toutes : ils restent dans le fond
    const ombres = speleos.map((img) => {
      if (!img) return null;
      const t = toile(img.width, img.height);
      const tc = t.getContext('2d');
      tc.drawImage(img, 0, 0);
      tc.globalCompositeOperation = 'source-atop';
      tc.fillStyle = 'rgba(20, 10, 36, .5)';
      tc.fillRect(0, 0, t.width, t.height);
      return t;
    });

    function avancer(dt) {
      temps += dt;

      for (const o of ondes) avancerOnde(o, dt);
      // les spéléos s'éclairent quand une onde passe sur eux, puis retournent
      // doucement dans l'ombre au bout de quelques secondes
      eclatSpeleo *= Math.exp(-dt / 1.8);
      for (const o of ondes) {
        const dS = Math.hypot(o.x - SPELEO.x, o.y - (SPELEO.y - 30));
        if (dS > o.rAvant && dS <= o.r && o.r < PORTEE) eclatSpeleo = 1;
      }
      for (let i = ondes.length - 1; i >= 0; i--) {
        if (ondes[i].r >= PORTEE + PENETRATION) { finirOnde(ondes[i]); ondes.splice(i, 1); }
      }
      for (let i = echos.length - 1; i >= 0; i--) { echos[i].age += dt; if (echos[i].age > 0.7) echos.splice(i, 1); }
      for (let i = etincelles.length - 1; i >= 0; i--) {
        const p = etincelles[i];
        p.age += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= Math.exp(-dt * 2.5);
        p.vy *= Math.exp(-dt * 2.5);
        if (p.age > p.duree) etincelles.splice(i, 1);
      }

      avancerVol(dt);
      avancerChutes(dt);
      bat.phase += dt * (bat.vol ? 24 : 9.5 + bat.joie * 40);
      bat.secousse = Math.max(0, bat.secousse - dt);
      bat.joie = Math.max(0, bat.joie - dt);
      const visible = estVu(bat.x, bat.y) ? 1 : 0;
      bat.corps += (visible - bat.corps) * (1 - Math.exp(-dt * 5));

      // moustiques
      for (const m of moustiques) {
        if (!m.vivant) continue;
        const mx = m.x + Math.cos(temps * 2.3 + m.phase) * 9;
        const my = m.y + Math.sin(temps * 3.1 + m.phase * 1.3) * 6;
        if (Math.hypot(mx - bat.x, my - bat.y) < GOBE) {
          m.vivant = false;
          gobes++;
          memoire.ecrire('moustiques', gobes);
          if (coeurs < COEURS.max) { coeurs++; majCoeurs('gagne'); }
          bat.joie = 0.5;
          son.bip('miam');
          for (let i = 0; i < 9; i++) eclat(mx, my, '#e9dcff', 110, 0.5);
        }
      }

      // le chiffre vient d'être éclairé pour la première fois
      if (chiffreVu < 0 && estVu(centreChiffre.x, centreChiffre.y) && debug !== 'carte') {
        chiffreVu = temps;
        son.bip('chiffre');
        for (let i = 0; i < (calme ? 10 : 34); i++) {
          eclat(CHIFFRE.x + Math.random() * CHIFFRE.l, CHIFFRE.y + Math.random() * CHIFFRE.h, i % 3 ? '#d9b8ff' : '#ffffff', 150, 1.1);
        }
      }

      // la sortie
      if (victoire < 0 && Math.hypot(bat.x - SORTIE.x, bat.y - SORTIE.y) < SORTIE.rayon) {
        victoire = temps;
        son.bip('sortie');
      }

      const but = cibleCamera();
      const k = 1 - Math.exp(-dt * 5.5);
      cam.x += (but.x - cam.x) * k;
      cam.y += (but.y - cam.y) * k;
    }

    function dessiner() {
      const L = ecran.width;
      const H = ecran.height;
      const k = z * dpr;                 // pixels de la toile par pixel du monde

      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
      c.fillStyle = '#000';
      c.fillRect(0, 0, L, H);

      // la grotte déjà révélée (portion visible, bornée aux limites du monde)
      const x0 = Math.max(0, cam.x);
      const y0 = Math.max(0, cam.y);
      const x1 = Math.min(MONDE.l, cam.x + vl / z);
      const y1 = Math.min(MONDE.h, cam.y + vh / z);
      if (x1 > x0 && y1 > y0) {
        c.drawImage(affiche, x0 * q, y0 * q, (x1 - x0) * q, (y1 - y0) * q,
          (x0 - cam.x) * k, (y0 - cam.y) * k, (x1 - x0) * k, (y1 - y0) * k);
      }

      // à partir d'ici, on dessine en coordonnées du monde
      c.setTransform(k, 0, 0, k, -cam.x * k, -cam.y * k);

      // l'obscurité revient sur ce qu'aucune onde n'a éclairé depuis un moment
      if (debug !== 'carte') {
        majNuit();
        if (voile) {
          c.save();
          c.clip(voile);
          c.imageSmoothingEnabled = true;
          c.drawImage(nuit, 0, 0, vuCols * CASE_VU, vuRangs * CASE_VU);
          c.restore();
        }
      }

      // les deux spéléos, une fois découverts : ils se balancent, respirent,
      // et leurs frontales tremblotent un peu dans le noir
      if (estVu(SPELEO.x, SPELEO.y - 30) || debug === 'carte') {
        const lum = 0.32 + 0.4 * eclatSpeleo;
        ombres.forEach((img, i) => {
          if (!img) return;
          const sens = i ? 1 : -1;
          const t = temps * (i ? 1.9 : 1.6) + i * 2.1;
          const sautille = i ? Math.max(0, Math.sin(temps * 0.9)) ** 12 * 4 : 0;   // elle sautille de temps en temps
          c.save();
          c.translate(SPELEO.x + sens * SPELEO.ecart * SPELEO.k, SPELEO.y - Math.abs(Math.sin(t)) * 1.2 - sautille);
          c.rotate(Math.sin(t * 0.8) * 0.06);
          c.scale(1, 1 + Math.sin(t * 2) * 0.012);
          c.globalAlpha = lum;
          c.drawImage(img, -40 * SPELEO.k, -84 * SPELEO.k, 80 * SPELEO.k, 90 * SPELEO.k);
          // la frontale
          c.globalCompositeOperation = 'lighter';
          c.globalAlpha = (0.08 + 0.04 * Math.sin(temps * 7 + i * 3)) * (0.6 + eclatSpeleo);
          const g = c.createRadialGradient(0, -44 * SPELEO.k, 0, 0, -44 * SPELEO.k, 16 * SPELEO.k);
          g.addColorStop(0, '#fff4c2');
          g.addColorStop(1, 'rgba(255, 244, 194, 0)');
          c.fillStyle = g;
          c.fillRect(-16 * SPELEO.k, -60 * SPELEO.k, 32 * SPELEO.k, 32 * SPELEO.k);
          c.restore();
        });
        c.globalAlpha = 1;
        c.globalCompositeOperation = 'source-over';
      }

      // lumière de la sortie
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = 0.86 + 0.14 * Math.sin(temps * 1.7);
      c.drawImage(lueur, SORTIE.x - PORTEE_LUEUR, SORTIE.y - PORTEE_LUEUR);
      c.globalAlpha = 1;

      // le chiffre palpite doucement une fois découvert
      if (chiffreVu >= 0 || debug === 'carte') {
        const a = 0.2 + 0.14 * Math.sin(temps * 2.6);
        const g = c.createRadialGradient(centreChiffre.x, centreChiffre.y, 4, centreChiffre.x, centreChiffre.y, 82);
        g.addColorStop(0, `rgba(190, 130, 255, ${a})`);
        g.addColorStop(1, 'rgba(190, 130, 255, 0)');
        c.fillStyle = g;
        c.fillRect(centreChiffre.x - 82, centreChiffre.y - 82, 164, 164);
      }

      // échos sur la roche
      c.fillStyle = '#e8d6ff';
      for (const e of echos) {
        c.globalAlpha = 0.9 * (1 - e.age / 0.7);
        c.beginPath();
        c.arc(e.x, e.y, 1.7, 0, TAU);
        c.fill();
      }

      // fronts d'onde : des arcs, interrompus là où la roche les arrête
      c.lineCap = 'round';
      for (const o of ondes) {
        const force = Math.pow(Math.max(0, 1 - o.r / PORTEE), 0.6);
        for (let anneau = 0; anneau < 3; anneau++) {
          const rr = o.r - anneau * 16;
          if (rr <= 4) continue;
          c.globalAlpha = force * [0.95, 0.45, 0.2][anneau];
          c.strokeStyle = anneau === 0 ? '#e3ccff' : '#a877ff';
          c.lineWidth = [2.4, 1.8, 1.4][anneau];
          c.beginPath();
          let ouvert = false;
          for (let i = 0; i <= RAYONS; i++) {
            const j = i % RAYONS;
            if (o.vis.d[j] > rr) {
              const a = (j / RAYONS) * TAU;
              const px = o.x + Math.cos(a) * rr;
              const py = o.y + Math.sin(a) * rr;
              if (ouvert) c.lineTo(px, py); else { c.moveTo(px, py); ouvert = true; }
            } else ouvert = false;
          }
          c.stroke();
        }
      }
      c.globalAlpha = 1;
      c.globalCompositeOperation = 'source-over';

      // moustiques (seulement là où la grotte a été révélée)
      for (const m of moustiques) {
        const lm = debug === 'carte' ? 1 : lumiere(m.x, m.y);
        if (!m.vivant || lm <= 0.02) continue;
        c.globalAlpha = Math.min(1, 0.15 + lm);
        const mx = m.x + Math.cos(temps * 2.3 + m.phase) * 9;
        const my = m.y + Math.sin(temps * 3.1 + m.phase * 1.3) * 6;
        const aile = 3.6 + Math.sin(temps * 60 + m.phase) * 1.2;
        c.fillStyle = 'rgba(226, 214, 245, 0.5)';
        c.beginPath();
        c.ellipse(mx - 2.6, my - 2.4, aile, 1.5, -0.5, 0, TAU);
        c.ellipse(mx + 2.6, my - 2.4, aile, 1.5, 0.5, 0, TAU);
        c.fill();
        c.fillStyle = '#efe6ff';
        c.beginPath();
        c.ellipse(mx, my, 1.5, 3.2, 0.25, 0, TAU);
        c.fill();
      }
      c.globalAlpha = 1;

      // étincelles
      for (const p of etincelles) {
        c.globalAlpha = 1 - p.age / p.duree;
        c.fillStyle = p.couleur;
        c.beginPath();
        c.arc(p.x, p.y, 1.9 * (1 - 0.5 * p.age / p.duree), 0, TAU);
        c.fill();
      }
      c.globalAlpha = 1;

      dessinerChutes();

      // la chauve-souris
      const tremble = bat.secousse > 0 ? Math.sin(temps * 70) * bat.secousse * 9 : 0;
      const bx = bat.x + tremble;
      const by = bat.y + (bat.vol ? 0 : Math.sin(temps * 3) * 2.2);
      // clignote après un coup ; réapparaît en douceur au début du passage
      const clignote = invulnerable > 0 && Math.floor(invulnerable * 12) % 2 === 0 ? 0.35 : 1;
      const apparition = Math.min(1, temps / 1.2, Math.max(0, (temps - reprise) / 0.6)) * clignote;

      // petite invitation, tant qu'aucune onde n'a été envoyée
      if (nbOndes === 0 && temps > 6 && !bat.vol) {
        const p = (temps % 2.2) / 2.2;
        c.globalAlpha = 0.3 * (1 - p);
        c.strokeStyle = '#b48cff';
        c.lineWidth = 1.2;
        c.beginPath();
        c.arc(bx, by - 4, 8 + p * 22, 0, TAU);
        c.stroke();
        c.globalAlpha = 1;
      }

      c.save();
      c.translate(bx, by);
      c.rotate(bat.penche);
      chauveSouris(c, 0, 0, ENVERGURE, bat.phase, VIOLET, bat.corps * apparition);
      // les yeux, seuls visibles dans le noir
      const cligne = (temps + 0.8) % 3.7 < 0.13;
      if (!cligne) {
        const o = yeux(ENVERGURE);
        c.globalAlpha = apparition;
        c.fillStyle = '#f4ebff';
        c.shadowColor = '#b48cff';
        c.shadowBlur = 5 * k;
        c.beginPath();
        c.arc(-o.dx - 0.9, o.y, 1.55, 0, TAU);
        c.arc(o.dx + 0.9, o.y, 1.55, 0, TAU);
        c.fill();
      }
      c.restore();

      // sortie : tout devient lumière
      if (victoire >= 0) {
        const a = Math.min(1, (temps - victoire) / 1.3);
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.globalAlpha = a * a;
        c.fillStyle = '#fbf8ff';
        c.fillRect(0, 0, L, H);
        c.globalAlpha = 1;
        if (a >= 1 && !termine) {
          termine = true;
          fond('clair');
          setTimeout(() => { if (vivant) suivante(); }, 350);
        }
      }
    }

    function boucle(t) {
      if (!vivant) return;
      const dt = Math.min(0.05, (t - avant) / 1000);
      avant = t;
      avancer(dt);
      dessiner();
      image = requestAnimationFrame(boucle);
    }
    avant = performance.now();
    image = requestAnimationFrame(boucle);

    if (debug !== null) {
      window.__e2 = {
        bat, cam, ondes, moustiques, MONDE, SORTIE, CHIFFRE, monde, revele,
        get zoom() { return z; },
        get chiffreVu() { return chiffreVu >= 0; },
        get gobes() { return gobes; },
        get coeurs() { return coeurs; },
        get invulnerable() { return invulnerable; },
        chutes,
        estVu,
        versEcran: (x, y) => ({ x: (x - cam.x) * z, y: (y - cam.y) * z }),
      };
    }
  }

  return () => {
    vivant = false;
    cancelAnimationFrame(image);
    for (const [cible, nom, f, opt] of ecouteurs) cible.removeEventListener(nom, f, opt);
    scene.querySelector('.e2-coeurs')?.remove();
    delete window.__e2;
  };
}

export default {
  fond: 'sombre',
  ambiance: 'sons/etape-2.mp3',
  preparer,
  demarrer,
};
