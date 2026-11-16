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
import { creerGrotte, MONDE, DEPART, SORTIE, CHIFFRE, MOUSTIQUES } from './grotte.js';
import { peindreParois } from './peintures.js';
import { duoSpeleo } from './clins-doeil.js';

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

const VIOLET = '#8f5cf7';
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
  await dessinerSvg(m, duoSpeleo(), 230, 1147, 1.5);   // clin d'œil : Cyriel et Clément en spéléo
  m.drawImage(cRoche, 0, 0);
  cFond.width = cFond.height = cRoche.width = cRoche.height = 1;   // libère la mémoire

  return { grotte, monde, q };
}

// Dessine un morceau de SVG (origine aux pieds) sur la toile, à l'échelle k.
async function dessinerSvg(ctx, dessin, x, y, k) {
  const l = 80;
  const h = 90;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -84 ${l} ${h}" width="${l * k * 2}" height="${h * k * 2}">${dessin}</svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    ctx.drawImage(img, x - 40 * k, y - 84 * k, l * k, h * k);
  } catch {
    // pas grave : la grotte reste sans le clin d'œil
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

  function jouer({ grotte, monde, q }) {
    // Ce qui a déjà été révélé : une image, et une grille grossière pour les tests.
    // On y dessine toujours en mode « éclaircir » : chaque pixel garde sa
    // valeur la plus claire, donc repasser au même endroit ne change rien et
    // une onde lointaine n'assombrit jamais ce qu'une autre a mieux éclairé.
    const revele = toile(monde.width, monde.height);
    const r = revele.getContext('2d');
    r.fillStyle = '#000';
    r.fillRect(0, 0, revele.width, revele.height);
    r.globalCompositeOperation = 'lighten';
    const vuCols = Math.ceil(MONDE.l / CASE_VU);
    const vuRangs = Math.ceil(MONDE.h / CASE_VU);
    const vu = new Uint8Array(vuCols * vuRangs);
    const marquer = (x, y) => {
      const i = (x / CASE_VU) | 0;
      const j = (y / CASE_VU) | 0;
      if (i >= 0 && j >= 0 && i < vuCols && j < vuRangs) vu[j * vuCols + i] = 1;
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
      vu.fill(1);
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

    function avancer(dt) {
      temps += dt;

      for (const o of ondes) avancerOnde(o, dt);
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
        c.drawImage(revele, x0 * q, y0 * q, (x1 - x0) * q, (y1 - y0) * q,
          (x0 - cam.x) * k, (y0 - cam.y) * k, (x1 - x0) * k, (y1 - y0) * k);
      }

      // à partir d'ici, on dessine en coordonnées du monde
      c.setTransform(k, 0, 0, k, -cam.x * k, -cam.y * k);

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
        if (!m.vivant || !estVu(m.x, m.y)) continue;
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

      // étincelles
      for (const p of etincelles) {
        c.globalAlpha = 1 - p.age / p.duree;
        c.fillStyle = p.couleur;
        c.beginPath();
        c.arc(p.x, p.y, 1.9 * (1 - 0.5 * p.age / p.duree), 0, TAU);
        c.fill();
      }
      c.globalAlpha = 1;

      // la chauve-souris
      const tremble = bat.secousse > 0 ? Math.sin(temps * 70) * bat.secousse * 9 : 0;
      const bx = bat.x + tremble;
      const by = bat.y + (bat.vol ? 0 : Math.sin(temps * 3) * 2.2);
      const apparition = Math.min(1, temps / 1.2);

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
        estVu,
        versEcran: (x, y) => ({ x: (x - cam.x) * z, y: (y - cam.y) * z }),
      };
    }
  }

  return () => {
    vivant = false;
    cancelAnimationFrame(image);
    for (const [cible, nom, f, opt] of ecouteurs) cible.removeEventListener(nom, f, opt);
    delete window.__e2;
  };
}

export default {
  fond: 'sombre',
  ambiance: 'sons/etape-2.mp3',
  preparer,
  demarrer,
};
