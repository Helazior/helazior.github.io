// Étape 4 — le marais des papillons.
//
// La chauve-souris sort de la grotte et découvre un marais. Cinq chenilles
// ont faim : il faut poser chacune sur sa plante hôte, en la faisant glisser
// ou en touchant la plante. Bonne plante : elle mange, se transforme, et le
// papillon s'envole. Mauvaise plante : elle refuse, gentiment. Après deux
// erreurs, une devinette et la bonne plante qui luit : jamais coincée.
//
// Deux chiffres du code : le 3e sur le panneau du marais (bien visible),
// le 4e sur l'aile du machaon, la dernière chenille.
//
// Pour les essais :  ?etape=4&debug=vite  (tout va 4 fois plus vite).

import { CODE } from '../code.js';
import { chauveSouris } from '../dessin.js';
import * as M from './marais-dessins.js';

/* ======================================================= Textes à modifier */

const TEXTES = {
  intro: 'Aide chaque chenille à trouver sa plante : fais-la glisser dessus, ou touche la plante.',
  faim: 'J’ai faim !',
  deviendrai: (qui) => `Je deviendrai ${qui}.`,
  toujoursFaim: 'J’ai toujours faim…',
  refus: ['Non merci !', 'Pas pour moi…', 'Ça ne se mange pas, ça !', 'Bof…'],
  refusMachaon: 'Pas question !',
  bravo: 'Bravo !',
  aile: 'Le machaon a quelque chose sur l’aile…',
  continuer: 'Continuer',
  versCafe: 'Le machaon s’envole… On dirait qu’il sait où aller.',
};

// Dans l'ordre du jeu ; le machaon doit rester le dernier (il porte le 4e chiffre).
const CHENILLES = [
  {
    cle: 'paon', deviendrai: 'un paon du jour', plante: 'ortie',
    fait: 'Les chenilles du paon du jour vivent en groupe sur les orties.',
    indice: 'Indice : ma plante pique quand on la touche.',
  },
  {
    cle: 'aurore', deviendrai: 'une aurore', plante: 'cardamine',
    fait: 'La chenille de l’aurore se cache en imitant les fruits de la cardamine.',
    indice: 'Indice : ma plante a quatre pétales lilas, en croix.',
  },
  {
    cle: 'cuivre', deviendrai: 'un cuivré des marais', plante: 'patience',
    fait: 'Le cuivré des marais pond sur les patiences, au bord de l’eau.',
    indice: 'Indice : ma plante a de grandes feuilles et des grappes rousses.',
  },
  {
    cle: 'azure', deviendrai: 'un azuré des mouillères', plante: 'gentiane',
    fait: 'Après la gentiane, des fourmis adoptent la chenille de l’azuré et l’élèvent dans leur nid !',
    indice: 'Indice : ma plante a des fleurs bleues en trompette.',
  },
  {
    cle: 'machaon', deviendrai: 'un machaon', plante: 'carotte',
    fait: 'Dérangée, la chenille du machaon sort deux petites cornes orange qui sentent fort.',
    indice: 'Indice : ma plante a des fleurs en ombrelle.',
  },
];

// Rang du haut (4 plantes) puis rang du bas (3 plantes), de gauche à droite.
const PLANTES = [
  { cle: 'ortie', lignes: ['Grande ortie'] },
  { cle: 'iris', lignes: ['Iris', 'des marais'] },
  { cle: 'gentiane', lignes: ['Gentiane', 'pneumonanthe'] },
  { cle: 'patience', lignes: ['Patience', 'd’eau'] },
  { cle: 'carotte', lignes: ['Carotte', 'sauvage'] },
  { cle: 'menthe', lignes: ['Menthe', 'aquatique'] },
  { cle: 'cardamine', lignes: ['Cardamine', 'des prés'] },
];

/* ============================================================== La partie */

const RANGS = [{ y: 362, xs: [62, 154, 246, 338] }, { y: 512, xs: [108, 200, 292] }];
const PLACES = RANGS.flatMap((r) => r.xs.map((x) => ({ x, y: r.y })));
const DEPART = { x: 196, y: 238 };
const CIEL = { x0: 30, x1: 370, y0: 40, y1: 172 };
const NS = 'http://www.w3.org/2000/svg';

function demarrer({ scene, son, fx, suivante, debug }) {
  const V = debug === 'vite' ? 4 : 1;
  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let vivant = true;
  let etat = 'intro';
  const minuteurs = new Set();
  let boucleErrance = 0;

  const racine = document.createElement('div');
  racine.className = 'e4';
  racine.innerHTML = `
    <div class="e4-scene"><svg class="e4-svg" role="img" aria-label="Un marais au soleil" preserveAspectRatio="xMidYMid meet"></svg></div>
    <div class="e4-bas"><div class="e4-panneau"><p class="e4-texte" aria-live="polite"></p><div class="e4-boutons"></div></div></div>`;
  scene.append(racine);
  const $ = (s) => racine.querySelector(s);
  const svg = $('.e4-svg');

  const plantes = PLANTES.map((p, i) => ({ ...p, ...PLACES[i] }));
  svg.innerHTML = `${M.defs()}
    <g class="e4-fond">${M.decor()}${M.panneau(CODE[2])}</g>
    <g class="e4-guide"></g>
    <g class="e4-plantes">${plantes.map((p) => `
      <g class="e4-plante" data-e4="plante-${p.cle}" role="button" tabindex="0" aria-label="${p.lignes.join(' ')}" transform="translate(${p.x} ${p.y})">
        <rect x="-44" y="-124" width="88" height="170" fill="transparent"/>
        <g class="e4-plante-corps">${M.plante(p.cle)}</g>
        <g transform="translate(0 8)">${M.etiquette(p.lignes)}</g>
      </g>`).join('')}
    </g>
    <g transform="translate(${DEPART.x} ${DEPART.y + 2})">${M.feuilleDepart()}</g>
    <g class="e4-fourmis"></g>
    <g class="e4-chrysalides"></g>
    <g class="e4-calque-chenille"></g>
    <g class="e4-papillons"></g>
    <g class="e4-bulles"></g>`;
  plantes.forEach((p) => { p.el = svg.querySelector(`[data-e4="plante-${p.cle}"]`); });

  const calques = {
    guide: $('.e4-guide'),
    fourmis: $('.e4-fourmis'),
    chrysalides: $('.e4-chrysalides'),
    chenille: $('.e4-calque-chenille'),
    papillons: $('.e4-papillons'),
    bulles: $('.e4-bulles'),
  };

  /* --------------------------------------------------------------- Outils */

  const bip = (...a) => { if (vivant) son.bip(...a); };

  function dormir(ms) {
    return new Promise((r) => {
      const id = setTimeout(() => { minuteurs.delete(id); r(); }, ms / V);
      minuteurs.add(id);
    });
  }

  async function animer(el, images, { duree, easing = 'ease', garder = true } = {}) {
    const a = el.animate(images, { duration: duree / V, easing, fill: 'both' });
    try { await a.finished; } catch { return; }
    if (garder) { try { a.commitStyles(); } catch { /* élément retiré entre-temps */ } }
    a.cancel();
  }

  function svgEl(nom, attributs = {}, parent = null) {
    const e = document.createElementNS(NS, nom);
    for (const [k, v] of Object.entries(attributs)) e.setAttribute(k, v);
    if (parent) parent.append(e);
    return e;
  }

  const positions = new WeakMap();
  function placer(g, x, y) {
    positions.set(g, { x, y });
    g.style.transform = `translate(${x}px, ${y}px)`;
  }
  function aller(g, x, y, duree, easing = 'ease-in-out') {
    const de = positions.get(g) || { x, y };
    positions.set(g, { x, y });
    return animer(g, [{ transform: `translate(${de.x}px, ${de.y}px)` }, { transform: `translate(${x}px, ${y}px)` }], { duree, easing });
  }
  function voler(g, x, y, duree, { hauteur = 24, ondule = 0 } = {}) {
    const de = positions.get(g) || { x, y };
    positions.set(g, { x, y });
    const images = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const e = t * t * (3 - 2 * t);
      const cloche = Math.sin(Math.PI * t);
      const px = de.x + (x - de.x) * e;
      const py = de.y + (y - de.y) * e - cloche * hauteur + Math.sin(t * Math.PI * 6) * ondule * cloche;
      images.push({ transform: `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)` });
    }
    return animer(g, images, { duree, easing: 'linear' });
  }

  function versEcran(x, y) {
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(x, y).matrixTransform(m);
    const r = racine.getBoundingClientRect();
    return { x: p.x - r.left, y: p.y - r.top };
  }
  function versScene(e) {
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }
  function etincelles(x, y, n, couleur, force) {
    if (!vivant) return;
    const p = versEcran(x, y);
    fx.etincelles(p.x, p.y, n, couleur, force);
  }
  function relancer(el, classe) {
    el.classList.remove(classe);
    void el.getBoundingClientRect();
    el.classList.add(classe);
  }

  /* ---------------------------------------------------- Cadrage de la scène */

  const zone = $('.e4-scene');
  function cadrer() {
    const l = zone.clientWidth;
    const h = zone.clientHeight;
    if (!l || !h) return;
    const k = Math.min(l / M.LARGEUR, h / M.HAUTEUR);
    const vl = l / k;
    const vh = h / k;
    svg.setAttribute('viewBox', `${((M.LARGEUR - vl) / 2).toFixed(1)} ${((M.HAUTEUR - vh) / 2).toFixed(1)} ${vl.toFixed(1)} ${vh.toFixed(1)}`);
  }
  const observateur = new ResizeObserver(cadrer);
  observateur.observe(zone);
  cadrer();

  /* ------------------------------------------------------------- Panneau */

  const texte = $('.e4-texte');
  const zoneBoutons = $('.e4-boutons');
  function dire(t) {
    texte.textContent = t;
    animer($('.e4-panneau'), [{ transform: 'translateY(3px)', opacity: 0.55 }, { transform: 'none', opacity: 1 }], { duree: 240, garder: false });
  }

  /* ---------------------------------------------- Transition : la sortie */

  // La caméra est dans la grotte : la chauve-souris file vers l'ouverture
  // lumineuse, qui s'agrandit jusqu'à révéler le marais.
  async function transition() {
    const toile = document.createElement('canvas');
    toile.className = 'e4-transition';
    racine.append(toile);
    const ctx = toile.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = racine.clientWidth;
    const H = racine.clientHeight;
    toile.width = Math.round(W * dpr);
    toile.height = Math.round(H * dpr);
    const total = (calme ? 1600 : 3800) / V;
    const cx = W / 2;
    const cy = H * 0.42;
    const r0 = Math.min(W, H) * 0.16;
    const rMax = Math.hypot(W, H) * 0.8;
    bip('vol');
    await new Promise((resolve) => {
      const debut = performance.now();
      let avant = debut;
      let ailes = 0;
      let lumiere = false;
      const pas = (t) => {
        if (!vivant) { resolve(); return; }
        const dt = Math.min(0.05, (t - avant) / 1000);
        avant = t;
        const p = Math.min(1, (t - debut) / total);
        let r = r0 * (1 + p * 0.5);
        if (p > 0.55) {
          const q = Math.min(1, (p - 0.55) / 0.35);
          r = r0 * 1.275 + (rMax - r0 * 1.275) * q * q * q;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#05030a';
        ctx.fillRect(0, 0, W, H);
        // la lumière du dehors éclaire un peu la roche autour de l'ouverture
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1.15, 1);
        const roche = ctx.createRadialGradient(0, 0, r * 0.8, 0, 0, r * 2.4);
        roche.addColorStop(0, 'rgba(70, 52, 96, .9)');
        roche.addColorStop(0.35, 'rgba(38, 26, 56, .7)');
        roche.addColorStop(1, 'rgba(5, 3, 10, 0)');
        ctx.fillStyle = roche;
        ctx.fillRect(-W, -H, W * 2, H * 2);
        ctx.restore();
        // l'ouverture laisse voir le marais, avec un bord doux
        ctx.globalCompositeOperation = 'destination-out';
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1.15, 1);
        const g = ctx.createRadialGradient(0, 0, r * 0.7, 0, 0, r);
        g.addColorStop(0, 'rgba(0,0,0,1)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
        // la chauve-souris s'éloigne vers la lumière
        const q = Math.min(1, p / 0.72);
        const e = q * q * (3 - 2 * q);
        const bx = cx + W * 0.2 * (1 - e) + Math.sin(q * Math.PI * 2) * W * 0.04;
        const by = H * 0.96 + (cy - H * 0.96) * e - Math.sin(q * Math.PI) * H * 0.06;
        const env = Math.min(W, H) * (0.56 * (1 - e) + 0.05);
        const alpha = p < 0.72 ? 1 : Math.max(0, 1 - (p - 0.72) / 0.12);
        ailes += dt * 15;
        chauveSouris(ctx, bx, by, env, ailes, '#8f5cf7', alpha);
        if (!lumiere && p > 0.55) { lumiere = true; bip('sortie'); }
        if (p < 1) requestAnimationFrame(pas); else resolve();
      };
      requestAnimationFrame(pas);
    });
    await animer(toile, [{ opacity: 1 }, { opacity: 0 }], { duree: 250, garder: false });
    toile.remove();
  }

  function revelerPanneau() {
    bip('chiffre');
    etincelles(46, 178, calme ? 10 : 26, '#d9b8ff', 150);
  }

  /* ------------------------------------------------------------- Chenilles */

  let bulleCourante = null;
  function montrerBulle(c, lignes) {
    cacherBulle();
    const p = positions.get(c.g);
    bulleCourante = svgEl('g', {}, calques.bulles);
    bulleCourante.innerHTML = `<g class="e5-pop">${M.bulle(lignes)}</g>`;
    placer(bulleCourante, p.x + 8, p.y - 26);
  }
  function cacherBulle() {
    if (bulleCourante) bulleCourante.remove();
    bulleCourante = null;
  }

  function creerChenille(ch) {
    const g = svgEl('g', { class: 'e4-chenille', role: 'img', 'aria-label': `Chenille qui deviendra ${ch.deviendrai}`, 'data-e4': 'chenille' }, calques.chenille);
    g.style.opacity = '0';
    const echelle = svgEl('g', { transform: 'scale(1.5)' }, g);
    svgEl('rect', { x: -30, y: -24, width: 60, height: 30, fill: 'transparent' }, echelle);
    const corps = svgEl('g', { class: 'e4-corps' }, echelle);
    corps.innerHTML = M.chenille(ch.cle);
    placer(g, DEPART.x, DEPART.y);
    return { g, corps, ch };
  }

  const perche = (p) => ({ x: p.x + 4, y: p.y - 60 });

  function planteSous(pt) {
    let meilleure = null;
    let distance = Infinity;
    for (const p of plantes) {
      if (pt.x < p.x - 44 || pt.x > p.x + 44 || pt.y < p.y - 124 || pt.y > p.y + 46) continue;
      const d = Math.hypot(pt.x - p.x, pt.y - (p.y - 50));
      if (d < distance) { distance = d; meilleure = p; }
    }
    return meilleure;
  }

  let survolee = null;
  function survoler(p) {
    if (p === survolee) return;
    if (survolee) survolee.el.classList.remove('e4-survol');
    survolee = p;
    if (p) p.el.classList.add('e4-survol');
  }

  async function tortiller(c) {
    c.corps.classList.add('e4-rampe');
    bip('clic', 0.3);
    await dormir(600);
    c.corps.classList.remove('e4-rampe');
  }

  // Attend que la chenille soit posée sur une plante (glissée) ou qu'on
  // touche une plante. Si on la lâche ailleurs, elle revient sur sa feuille.
  function attendreChoix(c) {
    return new Promise((resolve) => {
      let prise = null;
      const fin = (plante, glissee) => {
        c.g.removeEventListener('pointerdown', surDown);
        c.g.removeEventListener('pointermove', surMove);
        c.g.removeEventListener('pointerup', surUp);
        c.g.removeEventListener('pointercancel', surUp);
        for (const p of plantes) {
          p.el.removeEventListener('click', p.surChoix);
          p.el.removeEventListener('keydown', p.surChoix);
        }
        resolve({ plante, glissee });
      };
      function surDown(e) {
        if (e.button > 0 || etat !== 'attente') return;
        e.preventDefault();
        const p = versScene(e);
        prise = { id: e.pointerId, x0: p.x, y0: p.y, bouge: false };
        try { c.g.setPointerCapture(e.pointerId); } catch { /* sans gravité */ }
        c.corps.classList.add('e4-souleve');
      }
      function surMove(e) {
        if (!prise || e.pointerId !== prise.id) return;
        const p = versScene(e);
        if (!prise.bouge && Math.hypot(p.x - prise.x0, p.y - prise.y0) > 6) {
          prise.bouge = true;
          cacherBulle();
          c.corps.classList.add('e4-rampe');
        }
        if (prise.bouge) {
          placer(c.g, p.x, p.y - 24);
          survoler(planteSous(p));
        }
      }
      async function surUp(e) {
        if (!prise || e.pointerId !== prise.id) return;
        const bouge = prise.bouge;
        prise = null;
        c.corps.classList.remove('e4-souleve', 'e4-rampe');
        survoler(null);
        if (!bouge) { tortiller(c); return; }
        const plante = planteSous(versScene(e));
        if (plante) { fin(plante, true); return; }
        etat = 'retour';
        await revenir(c);
        montrerBulle(c, [TEXTES.faim, TEXTES.deviendrai(c.ch.deviendrai)]);
        etat = 'attente';
      }
      c.g.addEventListener('pointerdown', surDown);
      c.g.addEventListener('pointermove', surMove);
      c.g.addEventListener('pointerup', surUp);
      c.g.addEventListener('pointercancel', surUp);
      for (const p of plantes) {
        p.surChoix = (e) => {
          if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
          if (etat !== 'attente' || prise) return;
          e.preventDefault();
          fin(p, false);
        };
        p.el.addEventListener('click', p.surChoix);
        p.el.addEventListener('keydown', p.surChoix);
      }
    });
  }

  async function allerSurPlante(c, plante, glissee) {
    const cible = perche(plante);
    c.corps.classList.add('e4-rampe');
    if (glissee) await aller(c.g, cible.x, cible.y, 260, 'ease-out');
    else await voler(c.g, cible.x, cible.y, 750, { hauteur: 30 });
    c.corps.classList.remove('e4-rampe');
  }

  async function revenir(c) {
    c.corps.classList.add('e4-rampe');
    await voler(c.g, DEPART.x, DEPART.y, 650, { hauteur: 26 });
    c.corps.classList.remove('e4-rampe');
  }

  let refusVus = 0;
  async function refuser(c, plante) {
    const machaon = c.ch.cle === 'machaon';
    relancer(plante.el, 'e4-secoue-plante');
    c.corps.classList.add('e4-non');
    if (machaon) c.corps.classList.add('e4-fache');
    bip(machaon ? 'beurk' : 'non');
    const ligne = machaon ? TEXTES.refusMachaon : TEXTES.refus[refusVus++ % TEXTES.refus.length];
    montrerBulle(c, [ligne]);
    await dormir(1400);
    cacherBulle();
    c.corps.classList.remove('e4-non', 'e4-fache');
  }

  let lueur = null;
  function indice(ch) {
    dire(ch.indice);
    if (lueur) return;
    const p = plantes.find((q) => q.cle === ch.plante);
    lueur = svgEl('g', {}, calques.guide);
    lueur.innerHTML = `
      <ellipse cx="0" cy="-56" rx="50" ry="74" fill="url(#e4-lueur)"/>
      <ellipse class="e4-halo-anim" cx="0" cy="-56" rx="46" ry="68" fill="none" stroke="#f2c14e" stroke-width="3"/>`;
    lueur.setAttribute('transform', `translate(${p.x} ${p.y})`);
  }
  function cacherIndice() {
    if (lueur) lueur.remove();
    lueur = null;
  }

  /* -------------------------------------------------------- Métamorphose */

  async function manger(c, point) {
    c.corps.classList.add('e4-mange');
    for (let i = 0; i < 3; i++) {
      bip('croque');
      etincelles(point.x + 20, point.y - 8, calme ? 4 : 9, '#7fbf5a', 90);
      await dormir(430);
    }
    c.corps.classList.remove('e4-mange');
  }

  async function chrysalide(c, point) {
    const g = svgEl('g', {}, calques.chrysalides);
    const tremble = svgEl('g', { class: 'e4-chrysalide' }, g);
    const pop = svgEl('g', { class: 'e5-pop' }, tremble);
    pop.innerHTML = M.chrysalide(c.ch.cle);
    placer(g, point.x + 10, c.ch.cle === 'paon' ? point.y - 28 : point.y + 4);
    await animer(c.g, [{ opacity: 1 }, { opacity: 0 }], { duree: 380 });
    c.g.remove();
    await dormir(800);
    relancer(tremble, 'e4-tremble');
    bip('clic', 0.2);
    await dormir(700);
    const ici = c.ch.cle === 'paon' ? { x: point.x + 10, y: point.y - 12 } : { x: point.x + 10, y: point.y - 12 };
    animer(g, [{ opacity: 1 }, { opacity: 0 }], { duree: 500 }).then(() => g.remove());
    return ici;
  }

  // L'azuré : la chenille se laisse tomber, deux fourmis l'emportent dans
  // leur nid, et le papillon sortira de la fourmilière.
  async function fourmis(c, plante) {
    const nid = { x: plante.x + 34, y: plante.y - 2 };
    const fourmiliere = svgEl('g', {}, calques.fourmis);
    fourmiliere.innerHTML = `<g class="e5-pop">${M.fourmiliere()}</g>`;
    placer(fourmiliere, nid.x, nid.y);
    c.corps.classList.add('e4-rampe');
    await aller(c.g, plante.x - 4, plante.y - 2, 450, 'cubic-bezier(.5,0,1,.5)');
    c.corps.classList.remove('e4-rampe');
    const creer = (dx) => {
      const g = svgEl('g', { class: 'e4-marche-fourmi' }, calques.fourmis);
      const sens = svgEl('g', { transform: 'scale(-1.6 1.6)' }, g);
      svgEl('g', { class: 'e4-fourmi' }, sens).innerHTML = M.fourmi();
      placer(g, nid.x + dx, nid.y - 1);
      return { g, sens };
    };
    const a = creer(-6);
    const b = creer(4);
    await Promise.all([aller(a.g, plante.x + 8, plante.y - 1, 900, 'linear'), aller(b.g, plante.x - 16, plante.y - 1, 1100, 'linear')]);
    a.sens.setAttribute('transform', 'scale(1.6 1.6)');
    b.sens.setAttribute('transform', 'scale(1.6 1.6)');
    await dormir(250);
    await Promise.all([
      aller(c.g, nid.x, nid.y - 6, 1300, 'linear'),
      aller(a.g, nid.x + 10, nid.y - 1, 1300, 'linear'),
      aller(b.g, nid.x - 12, nid.y - 1, 1300, 'linear'),
    ]);
    await Promise.all([c.g, a.g, b.g].map((el) => animer(el, [{ opacity: 1 }, { opacity: 0 }], { duree: 350 })));
    c.g.remove();
    a.g.remove();
    b.g.remove();
    await dormir(700);
    return { x: nid.x, y: nid.y - 24 };
  }

  function creerPapillon(cle, point, options = {}) {
    const g = svgEl('g', { class: 'e4-papillon', 'data-e4': `papillon-${cle}` }, calques.papillons);
    const zoom = svgEl('g', { class: 'e4-zoom' }, g);
    const taille = svgEl('g', { transform: 'scale(.8)' }, zoom);
    svgEl('g', { class: 'e4-eclot' }, taille).innerHTML = M.papillon(cle, options);
    placer(g, point.x, point.y);
    bip('eclosion');
    etincelles(point.x, point.y, calme ? 6 : 16, '#fff3a8', 130);
    return g;
  }

  const ciel = () => ({
    x: CIEL.x0 + Math.random() * (CIEL.x1 - CIEL.x0),
    y: CIEL.y0 + Math.random() * (CIEL.y1 - CIEL.y0),
  });

  // Les papillons libérés volettent dans le ciel jusqu'à la fin de l'étape.
  const errants = [];
  function errer(g) {
    const p = positions.get(g);
    errants.push({ g, x: p.x, y: p.y, cible: ciel(), vitesse: 24 + Math.random() * 18, phase: Math.random() * 6 });
    if (boucleErrance) return;
    let avant = performance.now();
    const pas = (t) => {
      if (!vivant) return;
      const dt = Math.min(0.05, (t - avant) / 1000) * V;
      avant = t;
      for (const e of errants) {
        const dx = e.cible.x - e.x;
        const dy = e.cible.y - e.y;
        const d = Math.hypot(dx, dy);
        if (d < 6) e.cible = ciel();
        else {
          const k = Math.min(1, (e.vitesse * dt) / d);
          e.x += dx * k;
          e.y += dy * k;
        }
        e.g.style.transform = `translate(${e.x.toFixed(1)}px, ${(e.y + Math.sin(t / 260 + e.phase) * 3).toFixed(1)}px)`;
      }
      boucleErrance = requestAnimationFrame(pas);
    };
    boucleErrance = requestAnimationFrame(pas);
  }

  /* ----------------------------------------------------------- Une chenille */

  async function jouerChenille(ch) {
    const c = creerChenille(ch);
    await animer(c.g, [{ opacity: 0 }, { opacity: 1 }], { duree: 350 });
    let erreurs = 0;
    let plante = null;
    for (;;) {
      montrerBulle(c, erreurs ? [TEXTES.toujoursFaim, TEXTES.deviendrai(ch.deviendrai)] : [TEXTES.faim, TEXTES.deviendrai(ch.deviendrai)]);
      etat = 'attente';
      const choix = await attendreChoix(c);
      plante = choix.plante;
      etat = 'occupe';
      cacherBulle();
      await allerSurPlante(c, plante, choix.glissee);
      if (plante.cle === ch.plante) break;
      erreurs++;
      await refuser(c, plante);
      await revenir(c);
      if (erreurs >= 2) indice(ch);
    }
    cacherIndice();
    relancer(plante.el, 'e4-content');
    dire(`${TEXTES.bravo} ${ch.fait}`);
    const point = perche(plante);
    await manger(c, point);
    const naissance = ch.cle === 'azure' ? await fourmis(c, plante) : await chrysalide(c, point);
    const p = creerPapillon(ch.cle, naissance, ch.cle === 'machaon' ? { chiffre: CODE[3] } : {});
    await dormir(600);
    if (ch.cle === 'machaon') return p;
    p.classList.add('e4-vite');
    const cible = ciel();
    bip('vol');
    await voler(p, cible.x, cible.y, 1600, { hauteur: 40, ondule: 8 });
    p.classList.remove('e4-vite');
    errer(p);
    return p;
  }

  async function finale(machaon) {
    machaon.classList.add('e4-vite');
    bip('vol');
    await voler(machaon, 200, 230, 1400, { hauteur: 30, ondule: 6 });
    machaon.classList.remove('e4-vite');
    machaon.classList.add('e4-lent');
    await animer(machaon.querySelector('.e4-zoom'), [{ transform: 'scale(1)' }, { transform: 'scale(2.3)' }], { duree: 750, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    const chiffre = machaon.querySelector('.e4-chiffre-aile');
    if (chiffre && vivant) {
      const r = chiffre.getBoundingClientRect();
      const base = racine.getBoundingClientRect();
      fx.etincelles(r.left + r.width / 2 - base.left, r.top + r.height / 2 - base.top, calme ? 10 : 24, '#d9b8ff', 140);
    }
    bip('chiffre');
    dire(TEXTES.aile);
    await dormir(1300);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'e4-principal';
    b.dataset.e4 = 'continuer';
    b.textContent = TEXTES.continuer;
    b.addEventListener('click', () => { bip('clic', 0.5); versLeCafe(machaon); }, { once: true });
    zoneBoutons.append(b);
    b.focus({ preventScroll: true });
  }

  // Transition vers le café : tous les papillons s'envolent, le machaon en
  // tête, et l'écran se teinte des couleurs de l'écran d'accueil du café.
  async function versLeCafe(machaon) {
    zoneBoutons.replaceChildren();
    dire(TEXTES.versCafe);
    cancelAnimationFrame(boucleErrance);
    boucleErrance = 0;
    bip('vol');
    const envols = errants.map((e, i) => {
      positions.set(e.g, { x: e.x, y: e.y });
      e.g.classList.add('e4-vite');
      return dormir(150 + i * 120).then(() => voler(e.g, 470 + i * 20, -60 - i * 15, 1500, { hauteur: 40, ondule: 8 }));
    });
    machaon.classList.remove('e4-lent');
    machaon.classList.add('e4-vite');
    const zoom = machaon.querySelector('.e4-zoom');
    await Promise.all([
      voler(machaon, 470, -80, 1900, { hauteur: 70, ondule: 12 }),
      animer(zoom, [{ transform: 'scale(2.3)' }, { transform: 'scale(.7)' }], { duree: 1900, easing: 'ease-in' }),
      ...envols,
    ]);
    const voile = document.createElement('div');
    voile.className = 'e4-voile';
    racine.append(voile);
    await animer(voile, [{ opacity: 0 }, { opacity: 1 }], { duree: 700, easing: 'ease-in' });
    suivante();
  }

  async function scenario() {
    dire('');
    await transition();
    revelerPanneau();
    dire(TEXTES.intro);
    await dormir(700);
    let dernier = null;
    for (const ch of CHENILLES) dernier = await jouerChenille(ch);
    etat = 'fin';
    await finale(dernier);
  }

  scenario().catch((e) => { if (vivant) console.error(e); });
  if (debug !== null) window.__e4 = { get etat() { return etat; } };

  return () => {
    vivant = false;
    for (const id of minuteurs) clearTimeout(id);
    cancelAnimationFrame(boucleErrance);
    observateur.disconnect();
    delete window.__e4;
  };
}

export default {
  fond: 'clair',
  ambiance: 'sons/etape-4.mp3',
  demarrer,
};
