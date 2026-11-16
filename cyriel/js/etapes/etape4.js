// Étape 4 — le marais des papillons.
//
// La chauve-souris sort de la grotte et découvre un marais. Cinq femelles
// papillons viennent pondre, l'une après l'autre. Il faut d'abord trouver la
// plante qui nourrira leurs chenilles (les papillons goûtent les plantes avec
// leurs pattes !), puis suivre les petits à la loupe, avec chaque fois un
// petit jeu tiré de leur vraie vie :
//   paon du jour          nourrir la colonie, puis faire peur à une mésange
//   aurore                une fleur déjà prise, puis retrouver la chenille
//                         cachée parmi les siliques ; la chrysalide passe l'hiver
//   cuivré des marais     grimper au-dessus de l'eau pendant la crue d'hiver
//   azuré des mouillères  choisir la fourmi qui l'adopte, puis réclamer à manger
//   machaon               la chenille déguisée en fiente, puis ses cornes orange
// Chaque papillon ajoute une page au carnet de terrain. Jamais coincée :
// indices après deux erreurs, ou après un moment sans rien faire.
//
// Deux chiffres du code : le 3e sur le panneau du marais (bien visible),
// le 4e sur l'aile du machaon, à la fin.
//
// Les faits ont été vérifiés (sources dans le README).
// Pour les essais :  ?etape=4&debug=vite  (tout va 4 fois plus vite).

import { CODE } from '../code.js';
import { chauveSouris } from '../dessin.js';
import * as M from './marais-dessins.js';
import { course } from './course.js';

/* ======================================================= Textes à modifier */

const TEXTES = {
  intro: 'Cinq papillons viennent pondre dans le marais. Aide chaque femelle à choisir sa plante, puis suis ses petits à la loupe !',
  ou: 'Où vais-je pondre ?',
  refus: ['Pas pour mes petits !', 'Beurk, pas le bon goût…', 'Non, pas ici.'],
  refusMachaon: 'Pas question !',
  premierRefus: 'Elle a tambouriné sur la feuille : les papillons goûtent les plantes avec leurs pattes. Ce n’est pas la bonne !',
  autreRefus: 'Elle goûte avec ses pattes… pas celle-là.',
  merci: 'Merci !',
  coucou: 'Coucou !',
  miam: 'Miam !',
  carnet: {
    titre: 'Carnet de terrain',
    plante: 'Plante hôte :',
    tampon: 'Observé !',
    continuer: 'Continuer',
    fermer: 'Fermer',
    avant: 'Page précédente',
    apres: 'Page suivante',
  },
  aile: 'Le machaon a quelque chose sur l’aile…',
  continuer: 'Continuer',
  versCafe: 'Le machaon s’envole… On dirait qu’il sait où aller.',
};

// Les cinq papillons, dans l'ordre du jeu. Le machaon reste le dernier : il
// porte le 4e chiffre. « plantes » : où la femelle accepte de pondre.
const ESPECES = [
  {
    cle: 'paon', nom: 'Paon du jour', latin: 'Aglais io',
    plantes: ['ortie'], hote: 'grande ortie',
    arrivee: 'Une femelle paon du jour cherche où pondre. Touche la plante qui nourrira ses chenilles !',
    indice: 'Indice : sa plante pique quand on la frôle.',
    carnet: 'Ses chenilles noires vivent en groupe dans une toile de soie. L’hiver, l’adulte se cache parfois au fond des grottes, comme les chauves-souris !',
    textes: {
      ponte: 'Elle pond tout un paquet d’œufs sur une feuille : jusqu’à 400 d’un coup !',
      eclosion: 'Les chenilles vivent ensemble dans une toile de soie. Touche l’ortie pour les nourrir !',
      grandes: 'Bien nourries ! Elles se dispersent pour se transformer.',
      chrysalide: 'Une chrysalide pend sous une feuille…',
      ferme: 'Ailes fermées, il ressemble à une feuille morte.',
      mesange: 'Une mésange ! Touche le paon pour qu’il ouvre ses ailes.',
      peur: 'Ses grands « yeux », et le chuintement de ses ailes, font fuir la mésange !',
    },
  },
  {
    cle: 'aurore', nom: 'Aurore', latin: 'Anthocharis cardamines',
    plantes: ['alliaire'], occupee: 'cardamine', hote: 'cardamine des prés, alliaire officinale',
    arrivee: 'Une aurore… sans orange au bout des ailes : c’est une femelle ! Où va-t-elle pondre ?',
    indice: 'Indice : sa plante a de petites fleurs blanches et sent l’ail quand on froisse ses feuilles.',
    carnet: 'La femelle évite les fleurs où une autre a déjà pondu : les jeunes chenilles se mangent entre elles ! La chrysalide passe tout l’hiver.',
    textes: {
      dejaPris: 'Déjà un œuf ici !',
      occupe: 'Une autre aurore a déjà pondu sur cette cardamine : regarde l’œuf orange. Ses jeunes chenilles se mangent entre elles, alors la femelle cherche une autre plante.',
      bienVu: 'Bien vu ! L’alliaire lui convient aussi… et la cardamine était déjà prise : regarde l’œuf orange.',
      ponte: 'Un seul œuf, sur la tige d’une fleur. Pâle au début, il devient orange.',
      eclosion: 'La petite chenille sort… et commence par manger sa coquille ! Ensuite, elle se nourrit des siliques, les fruits de la plante.',
      cache: 'Elle a grandi… et ressemble à s’y méprendre à une silique ! Où se cache-t-elle ?',
      pasCa: 'Ça, c’est une silique.',
      trouvee: 'Trouvée ! Avec sa ligne blanche, elle se fond dans les fruits.',
      hiver: 'Devenue chrysalide, elle passe tout l’hiver accrochée à sa tige…',
      printemps: 'Printemps ! Et c’est un mâle : le bout de ses ailes est orange.',
    },
  },
  {
    cle: 'cuivre', nom: 'Cuivré des marais', latin: 'Lycaena dispar',
    plantes: ['patience'], hote: 'patience d’eau et autres grandes patiences',
    arrivee: 'Une femelle cuivré des marais, orange tachetée de noir. Où va-t-elle pondre ?',
    indice: 'Indice : une grande plante du bord de l’eau, aux grappes rousses.',
    carnet: 'Sa chenille passe l’hiver au pied de la plante et supporte des semaines sous l’eau. Une espèce protégée en France.',
    textes: {
      ponte: 'Elle pond ses œufs blancs sur les feuilles de la patience.',
      fenetres: 'La petite chenille grignote le dessous des feuilles et laisse des « fenêtres » transparentes.',
      automne: 'En automne, encore petite, elle s’endort au pied de la plante, entre les feuilles fanées.',
      crue: 'L’hiver, le marais déborde ! Touche la chenille pour l’aider à grimper au sec.',
      noyee: 'Elle peut tenir des semaines sous l’eau… mais au sec, c’est mieux. Grimpe !',
      sauvee: 'Ouf ! Les chenilles qui grimpent au-dessus de l’eau passent l’hiver aussi bien qu’au sec.',
      printemps: 'Au printemps, elle reprend son repas, puis se transforme…',
      adulte: 'Un mâle, brillant comme un sou neuf !',
    },
  },
  {
    cle: 'azure', nom: 'Azuré des mouillères', latin: 'Phengaris alcon',
    plantes: ['gentiane'], hote: 'gentiane pneumonanthe… et des fourmis Myrmica',
    arrivee: 'Voici une femelle azuré des mouillères : brune, poudrée de bleu. Quelle plante choisira-t-elle ?',
    indice: 'Indice : des fleurs bleues en trompette.',
    carnet: 'Sa chenille se fait passer pour une larve de fourmi Myrmica : nourrie dans la fourmilière, elle y grandit près d’un an. Une espèce protégée en France.',
    textes: {
      ponte: 'Elle pond ses œufs blancs sur les boutons de la gentiane. Les naturalistes les comptent pour suivre l’espèce.',
      fleur: 'La chenille grandit cachée dans la fleur…',
      tombe: '…puis elle se laisse tomber au sol et attend. Quelle fourmi doit l’adopter ?',
      mauvaiseFourmi: 'Pas celle-là : dans son nid, la chenille ne survivrait pas.',
      indiceFourmi: 'Indice : elle sent comme les larves de Myrmica.',
      adoptee: 'Une Myrmica la ramasse et l’emporte dans son nid, avec ses propres larves !',
      reclame: 'Les fourmis la prennent pour une de leurs larves. Touche-la pour qu’elle réclame à manger !',
      nourrie: 'Nourrie au bouche-à-bouche par les fourmis… pendant près d’un an !',
      sortie: 'L’été suivant, le papillon sort de la fourmilière.',
    },
  },
  {
    cle: 'machaon', nom: 'Machaon', latin: 'Papilio machaon',
    plantes: ['carotte'], hote: 'carotte sauvage, fenouil et autres ombellifères',
    arrivee: 'Et voici une femelle machaon ! Où va-t-elle pondre ?',
    indice: 'Indice : des fleurs blanches en ombrelle.',
    carnet: 'Jeune, sa chenille se déguise en fiente d’oiseau. Dérangée, elle sort des cornes orange qui sentent fort et repoussent les fourmis.',
    textes: {
      ponte: 'Un œuf par-ci, un œuf par-là, sur les ombellifères.',
      fiente: 'Quelques jours plus tard… la jeune chenille se déguise en fiente d’oiseau ! Laquelle est-ce ?',
      vraieFiente: 'Beurk, une vraie fiente !',
      trouvee: 'Bien vu ! Touche-la pour qu’elle mange.',
      mue: 'Après quelques mues, elle prend ses couleurs.',
      fourmi: 'Une fourmi ! Touche la chenille pour qu’elle sorte ses cornes.',
      cornes: 'Ses cornes orange sentent fort : ça repousse les fourmis… mais pas les oiseaux !',
      encore: 'Une autre ! Touche la chenille.',
      chrysalide: 'Sa chrysalide peut être verte ou brune.',
    },
  },
];

// Rang du haut puis rang du bas, de gauche à droite. haut : hauteur de la
// plante, là où la femelle se pose.
const PLANTES = [
  { cle: 'ortie', lignes: ['Grande ortie'], haut: 112 },
  { cle: 'iris', lignes: ['Iris', 'des marais'], haut: 110 },
  { cle: 'gentiane', lignes: ['Gentiane', 'pneumonanthe'], haut: 94 },
  { cle: 'patience', lignes: ['Patience', 'd’eau'], haut: 110 },
  { cle: 'carotte', lignes: ['Carotte', 'sauvage'], haut: 110 },
  { cle: 'menthe', lignes: ['Menthe', 'aquatique'], haut: 108 },
  { cle: 'cardamine', lignes: ['Cardamine', 'des prés'], haut: 112 },
  { cle: 'alliaire', lignes: ['Alliaire', 'officinale'], haut: 116 },
];

/* ============================================================== La partie */

const RANGS = [{ y: 362, xs: [62, 154, 246, 338] }, { y: 512, xs: [62, 154, 246, 338] }];
const PLACES = RANGS.flatMap((r) => r.xs.map((x) => ({ x, y: r.y })));
const ATTENTE = { x: 200, y: 150 };          // là où la femelle attend qu'on choisisse
const CIEL = { x0: 30, x1: 370, y0: 40, y1: 172 };
const LOUPE = { x: 200, y: 300, r: M.RAYON_LOUPE };
const NS = 'http://www.w3.org/2000/svg';
const RYTHME = 1.7;   // passages automatiques 1,7 fois plus rapides

// Dans la loupe : les chenilles du paon sur les feuilles d'ortie [x, y, sens].
const COLONIE = [[-38, -26, 1], [-16, -30, 1], [18, -36, -1], [40, -30, -1], [-30, -78, 1], [-10, -80, 1], [12, -86, -1], [32, -84, -1], [-40, 30, 1], [36, 24, -1]];

const ICONE_CARNET = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="15" height="18" rx="2.5" fill="#f6ecd2" stroke="currentColor" stroke-width="1.8"/>
  <path d="M8 3v18" stroke="currentColor" stroke-width="1.8"/><path d="M11 8h5M11 11.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M19 6h1.5M19 10h1.5M19 14h1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

function demarrer({ scene, son, fx, suivante, debug }) {
  const V = debug === 'vite' ? 4 : 1;
  // Le rythme des passages automatiques (vols, loupe, pauses) : plus grand =
  // plus rapide. Les jeux eux-mêmes (la crue, la course) n'en dépendent pas.
  const R = V * RYTHME;
  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let vivant = true;
  let etat = 'intro';
  let especeCourante = null;
  const minuteurs = new Set();
  let boucleErrance = 0;
  let boucleEau = 0;

  const racine = document.createElement('div');
  racine.className = 'e4';
  racine.innerHTML = `
    <div class="e4-scene">
      <svg class="e4-svg" role="img" aria-label="Un marais au soleil" preserveAspectRatio="xMidYMid meet"></svg>
      <button type="button" class="e4-hud-carnet" data-e4="carnet" hidden>${ICONE_CARNET}<span class="e4-hud-compte"></span></button>
    </div>
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
    <g class="e4-dessus"></g>
    <g class="e4-papillons"></g>
    <g class="e4-bulles"></g>
    <g class="e4-calque-loupe"></g>`;
  plantes.forEach((p) => { p.el = svg.querySelector(`[data-e4="plante-${p.cle}"]`); });
  const planteDe = (cle) => plantes.find((p) => p.cle === cle);

  const calques = {
    guide: $('.e4-guide'),
    dessus: $('.e4-dessus'),
    papillons: $('.e4-papillons'),
    bulles: $('.e4-bulles'),
    loupe: $('.e4-calque-loupe'),
  };

  /* --------------------------------------------------------------- Outils */

  const bip = (...a) => { if (vivant) son.bip(...a); };

  function dormir(ms) {
    return new Promise((r) => {
      const id = setTimeout(() => { minuteurs.delete(id); r(); }, ms / R);
      minuteurs.add(id);
    });
  }

  function plusTard(ms, fn) {
    const id = setTimeout(() => { minuteurs.delete(id); if (vivant) fn(); }, ms / R);
    minuteurs.add(id);
    return id;
  }
  function annuler(id) {
    clearTimeout(id);
    minuteurs.delete(id);
  }

  async function animer(el, images, { duree, easing = 'ease', garder = true } = {}) {
    const a = el.animate(images, { duration: duree / R, easing, fill: 'both' });
    try { await a.finished; } catch { return; }
    if (garder) {
      try { a.commitStyles(); } catch {
        // élément retiré entre-temps : on recopie au moins la dernière image
        const fin = images[images.length - 1];
        for (const [k, v] of Object.entries(fin)) if (k !== 'offset' && k !== 'easing') el.style[k] = v;
      }
    }
    a.cancel();
  }
  const apparaitre = (el, duree = 350) => animer(el, [{ opacity: 0 }, { opacity: 1 }], { duree });
  const disparaitre = async (el, duree = 350) => { await animer(el, [{ opacity: 1 }, { opacity: 0 }], { duree }); el.remove(); };

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
  // Coordonnées dans la loupe (centre du verre en 0, 0).
  const etincellesLoupe = (x, y, n, couleur, force) => etincelles(LOUPE.x + x, LOUPE.y + y, calme ? Math.ceil(n / 3) : n, couleur, force);

  function relancer(el, classe) {
    el.classList.remove(classe);
    void el.getBoundingClientRect();
    el.classList.add(classe);
  }

  function touchable(el, label, cle) {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', label);
    if (cle) el.dataset.e4 = cle;
    el.classList.add('e4-touchable');
    return el;
  }

  // Attend qu'on touche l'une des cibles (doigt, souris, Entrée ou Espace).
  // Renvoie la cible, et le point touché en coordonnées de la loupe.
  // inactif / quandInactif : un coup de pouce si rien ne se passe.
  function attendreTouche(cibles, { inactif = 0, quandInactif = null, type = 'pointerdown' } = {}) {
    return new Promise((resolve) => {
      const id = inactif && quandInactif ? plusTard(inactif, quandInactif) : 0;
      const ecouteurs = cibles.map((c) => {
        const f = (e) => {
          if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
          if (e.type === 'pointerdown' && e.button > 0) return;
          e.preventDefault();
          e.stopPropagation();
          annuler(id);
          for (const [cc, ff] of ecouteurs) {
            cc.removeEventListener(type, ff);
            cc.removeEventListener('keydown', ff);
          }
          let x = null;
          let y = null;
          if (e.type !== 'keydown' && e.clientX !== undefined) {
            const p = versScene(e);
            x = p.x - LOUPE.x;
            y = p.y - LOUPE.y;
          }
          resolve({ el: c, x, y });
        };
        c.addEventListener(type, f);
        c.addEventListener('keydown', f);
        return [c, f];
      });
    });
  }

  function halo(parent, x, y, rx, ry) {
    const g = svgEl('g', { transform: `translate(${x} ${y})`, class: 'e4-halo' }, parent);
    g.innerHTML = `<ellipse rx="${rx + 6}" ry="${ry + 6}" fill="url(#e4-lueur)"/>
      <ellipse class="e4-halo-anim" rx="${rx}" ry="${ry}" fill="none" stroke="#f2c14e" stroke-width="3"/>`;
    return g;
  }

  function flotter(parent, x, y, texte, couleur = '#3f7a2c') {
    const g = svgEl('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, parent);
    const t = svgEl('text', { class: 'e4-flotte', 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: couleur, stroke: '#fff', 'stroke-width': 3, 'paint-order': 'stroke' }, g);
    t.textContent = texte;
    plusTard(900, () => g.remove());
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
    if (texte.textContent === t) return;
    texte.textContent = t;
    animer($('.e4-panneau'), [{ transform: 'translateY(3px)', opacity: 0.55 }, { transform: 'none', opacity: 1 }], { duree: 240, garder: false });
  }
  // Affiche un texte et laisse le temps de le lire avant la suite.
  async function raconter(t, min = 1800) {
    dire(t);
    await dormir(Math.max(min, t.length * 55));
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
    const total = (calme ? 1600 : 3800) / R;
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

  /* ---------------------------------------------------------------- Bulles */

  let bulleCourante = null;
  function montrerBulle(x, y, lignes, parent = calques.bulles) {
    cacherBulle();
    const l = Math.max(...lignes.map((t) => t.length)) * 6 + 22;
    const bord = parent === calques.bulles ? [l / 2 + 4, M.LARGEUR - l / 2 - 4] : [-LOUPE.r - 20 + l / 2, LOUPE.r + 20 - l / 2];
    bulleCourante = svgEl('g', { class: 'e4-bulle' }, parent);
    bulleCourante.innerHTML = `<g class="e5-pop">${M.bulle(lignes)}</g>`;
    placer(bulleCourante, Math.min(bord[1], Math.max(bord[0], x)), y);
    return bulleCourante;
  }
  function cacherBulle() {
    if (bulleCourante) bulleCourante.remove();
    bulleCourante = null;
  }

  /* -------------------------------------------------------- Carnet de terrain */

  const pages = [];
  const hud = $('.e4-hud-carnet');
  function majHud(saute) {
    hud.hidden = pages.length === 0;
    $('.e4-hud-compte').textContent = `${pages.length}/${ESPECES.length}`;
    hud.setAttribute('aria-label', `${TEXTES.carnet.titre} : ${pages.length} page${pages.length > 1 ? 's' : ''} sur ${ESPECES.length}`);
    if (saute) relancer(hud, 'e4-hud-saute');
  }

  function pageHtml(e, i) {
    const C = TEXTES.carnet;
    return `
      <header class="e4-page-tete"><span>${C.titre}</span><span>n° ${i + 1} / ${ESPECES.length}</span></header>
      <svg class="e4-page-dessin" viewBox="-46 -34 92 70" aria-hidden="true">${M.papillon(e.cle)}</svg>
      <h2 class="e4-page-nom">${e.nom}</h2>
      <p class="e4-page-latin">${e.latin}</p>
      <p class="e4-page-hote"><b>${C.plante}</b> ${e.hote}</p>
      <p class="e4-page-fait">${e.carnet}</p>
      <div class="e4-tampon" aria-hidden="true">${C.tampon}</div>`;
  }

  // Ouvre le carnet à la page « depart ». nouvelle : la page vient d'être
  // gagnée (coup de tampon) et on referme avec « Continuer ».
  function ouvrirCarnet(depart, { nouvelle = false } = {}) {
    return new Promise((resolve) => {
      const C = TEXTES.carnet;
      let i = depart;
      const fond = document.createElement('div');
      fond.className = 'e4-carnet';
      fond.setAttribute('role', 'dialog');
      fond.setAttribute('aria-modal', 'true');
      fond.setAttribute('aria-label', C.titre);
      fond.innerHTML = `
        <div class="e4-carnet-boite">
          <article class="e4-page"></article>
          <div class="e4-carnet-boutons">
            <button type="button" class="e4-fleche" data-e4="carnet-avant" aria-label="${C.avant}">‹</button>
            <button type="button" class="e4-fleche" data-e4="carnet-apres" aria-label="${C.apres}">›</button>
            <button type="button" class="e4-principal" data-e4="carnet-ok">${nouvelle ? C.continuer : C.fermer}</button>
          </div>
        </div>`;
      racine.append(fond);
      const page = fond.querySelector('.e4-page');
      const avant = fond.querySelector('[data-e4="carnet-avant"]');
      const apres = fond.querySelector('[data-e4="carnet-apres"]');
      const ok = fond.querySelector('[data-e4="carnet-ok"]');
      const rendre = (tampon) => {
        page.innerHTML = pageHtml(pages[i], i);
        avant.disabled = i === 0;
        apres.disabled = i === pages.length - 1;
        avant.hidden = apres.hidden = pages.length < 2;
        if (tampon) {
          const t = page.querySelector('.e4-tampon');
          t.classList.add('e4-tampon-frappe');
          plusTard(330, () => bip('tampon'));
        }
      };
      rendre(nouvelle);
      animer(fond.firstElementChild, [{ transform: 'translateY(24px) scale(.96)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duree: 320, easing: 'cubic-bezier(.3,1.3,.5,1)', garder: false });
      const fermer = () => {
        document.removeEventListener('keydown', clavier);
        bip('clic', 0.5);
        fond.remove();
        hud.focus({ preventScroll: true });
        resolve();
      };
      const tourner = (d) => {
        const j = Math.min(pages.length - 1, Math.max(0, i + d));
        if (j === i) return;
        i = j;
        bip('papier');
        rendre(false);
      };
      const clavier = (e) => {
        if (e.key === 'Escape') fermer();
        else if (e.key === 'ArrowLeft') tourner(-1);
        else if (e.key === 'ArrowRight') tourner(1);
      };
      document.addEventListener('keydown', clavier);
      avant.addEventListener('click', () => tourner(-1));
      apres.addEventListener('click', () => tourner(1));
      ok.addEventListener('click', fermer, { once: true });
      ok.focus({ preventScroll: true });
    });
  }

  async function ajouterPage(e) {
    pages.push(e);
    majHud(true);
    bip('papier');
    const avant = etat;
    etat = 'carnet';
    await ouvrirCarnet(pages.length - 1, { nouvelle: true });
    if (pages.length === ESPECES.length) {
      // les cinq pages : le carnet est complet
      hud.classList.add('e4-hud-complet');
      const r = hud.getBoundingClientRect();
      const base = racine.getBoundingClientRect();
      fx.etincelles(r.left + r.width / 2 - base.left, r.top + r.height / 2 - base.top, calme ? 6 : 16, '#f2c14e', 110);
    }
    etat = avant;
  }

  hud.addEventListener('click', () => {
    if (!pages.length || racine.querySelector('.e4-carnet')) return;
    bip('papier');
    ouvrirCarnet(pages.length - 1);
  });

  /* ----------------------------------------------------- Femelles et plantes */

  const sommet = (p) => ({ x: p.x + 2, y: p.y - p.haut - 4 });

  function creerFemelle(e) {
    const g = svgEl('g', { class: 'e4-papillon e4-vite', 'data-e4': 'femelle', role: 'img', 'aria-label': `Femelle ${e.nom.toLowerCase()}` }, calques.papillons);
    const zoom = svgEl('g', { class: 'e4-zoom' }, g);
    const taille = svgEl('g', { transform: 'scale(.8)' }, zoom);
    svgEl('g', { class: 'e4-tambour' }, taille).innerHTML = M.papillon(e.cle, { femelle: true });
    placer(g, -70, 110);
    return g;
  }

  // La femelle goûte la plante en tambourinant avec ses pattes.
  async function tambouriner(f) {
    const t = f.querySelector('.e4-tambour');
    t.classList.add('e4-tambourine');
    for (let i = 0; i < 3; i++) {
      bip('clic', 0.1 + i * 0.12);
      await dormir(190);
    }
    t.classList.remove('e4-tambourine');
  }

  async function pondre(f) {
    const t = f.querySelector('.e4-tambour');
    for (let i = 0; i < 2; i++) {
      await animer(t, [{ transform: 'translateY(0)' }, { transform: 'translateY(6px)' }, { transform: 'translateY(0)' }], { duree: 380, garder: false });
      bip('poc');
    }
  }

  // Attend qu'on touche (ou valide au clavier) une plante.
  function attendrePlante() {
    return attendreTouche(plantes.map((p) => p.el), { type: 'click' }).then(({ el }) => plantes.find((p) => p.el === el));
  }

  let lueur = null;
  function indice(e) {
    dire(e.indice);
    if (lueur) return;
    const p = planteDe(e.plantes[0]);
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

  // Pour l'aurore : un œuf orange déjà pondu sur la cardamine.
  // (sur la tige d'une fleur, sous le bouquet : la femelle posée ne le cache pas)
  const OEUF_PRIS = { x: -6, y: -80 };
  let oeufPris = null;
  function poserOeufPris(cle) {
    const p = planteDe(cle);
    oeufPris = svgEl('g', { transform: `translate(${OEUF_PRIS.x} ${OEUF_PRIS.y}) rotate(-20) scale(1.25)` }, p.el.querySelector('.e4-plante-corps'));
    oeufPris.innerHTML = M.oeufAurore('#f28c28');
  }
  function montrerOeufPris(cle, ms) {
    const p = planteDe(cle);
    const h = halo(calques.guide, p.x + OEUF_PRIS.x, p.y + OEUF_PRIS.y - 6, 10, 13);
    plusTard(ms, () => h.remove());
  }

  let refusVus = 0;
  let premierRefus = true;

  // La femelle essaie les plantes qu'on lui montre, jusqu'à la bonne.
  async function choisirPlante(e, f) {
    let erreurs = 0;
    let occupeeVue = false;
    for (;;) {
      etat = 'choix-plante';
      const rappel = plusTard(25000, () => dire(e.indice));
      const p = await attendrePlante();
      annuler(rappel);
      etat = 'occupe';
      cacherBulle();
      const s = sommet(p);
      f.classList.add('e4-vite');
      bip('vol');
      await voler(f, s.x, s.y, 700, { hauteur: 26 });
      f.classList.remove('e4-vite');
      await tambouriner(f);
      if (e.plantes.includes(p.cle)) {
        cacherIndice();
        return { plante: p, occupeeVue };
      }
      relancer(p.el, 'e4-secoue-plante');
      if (p.cle === e.occupee) {
        occupeeVue = true;
        bip('non');
        montrerBulle(s.x, s.y - 26, [e.textes.dejaPris]);
        montrerOeufPris(p.cle, 3600);
        dire(e.textes.occupe);
        await dormir(3000);
      } else {
        erreurs++;
        const machaon = e.cle === 'machaon';
        bip(machaon ? 'beurk' : 'non');
        montrerBulle(s.x, s.y - 26, [machaon ? TEXTES.refusMachaon : TEXTES.refus[refusVus++ % TEXTES.refus.length]]);
        dire(premierRefus ? TEXTES.premierRefus : TEXTES.autreRefus);
        premierRefus = false;
        await dormir(1500);
        if (erreurs >= 2) indice(e);
      }
      cacherBulle();
      f.classList.add('e4-vite');
      await voler(f, ATTENTE.x, ATTENTE.y, 700, { hauteur: 18 });
      f.classList.remove('e4-vite');
      montrerBulle(ATTENTE.x, ATTENTE.y - 26, [TEXTES.ou]);
    }
  }

  /* ----------------------------------------------------------------- Loupe */

  async function ouvrirLoupe(p) {
    calques.loupe.replaceChildren();
    const voile = svgEl('rect', { x: -3000, y: -3000, width: 6400, height: 6400, fill: '#1a1026', class: 'e4-assombri' }, calques.loupe);
    const g = svgEl('g', { class: 'e4-loupe' }, calques.loupe);
    const verre = svgEl('g', { 'clip-path': 'url(#e4-clip-loupe)' }, g);
    svgEl('circle', { r: LOUPE.r, fill: 'url(#e4-fond-loupe)' }, verre);
    verre.insertAdjacentHTML('beforeend', M.bokeh());
    const contenu = svgEl('g', { class: 'e4-loupe-contenu' }, verre);
    const effets = svgEl('g', { 'pointer-events': 'none' }, verre);     // eau, neige… : on touche à travers
    svgEl('g', { class: 'e4-loupe-cadre', 'pointer-events': 'none' }, g).innerHTML = M.cadreLoupe(LOUPE.r);
    const bulles = svgEl('g', { 'pointer-events': 'none' }, g);
    const de = { x: p.x, y: p.y - 60 };
    const depart = `translate(${de.x}px, ${de.y}px) scale(.16)`;
    g.style.transform = depart;
    g.style.opacity = '0';
    voile.style.opacity = '0';
    bip('onde');
    await Promise.all([
      animer(g, [{ transform: depart, opacity: 0 }, { transform: `translate(${LOUPE.x}px, ${LOUPE.y}px) scale(1)`, opacity: 1 }], { duree: 620, easing: 'cubic-bezier(.3,1.2,.5,1)' }),
      animer(voile, [{ opacity: 0 }, { opacity: 0.35 }], { duree: 500 }),
    ]);
    return { g, contenu, effets, bulles, voile, depart };
  }

  async function fermerLoupe(L) {
    cacherBulle();
    await Promise.all([
      animer(L.g, [{ transform: `translate(${LOUPE.x}px, ${LOUPE.y}px) scale(1)`, opacity: 1 }, { transform: L.depart, opacity: 0 }], { duree: 480, easing: 'cubic-bezier(.5,0,.8,.4)' }),
      animer(L.voile, [{ opacity: 0.35 }, { opacity: 0 }], { duree: 480 }),
    ]);
    calques.loupe.replaceChildren();
  }

  // Une chenille dans la loupe : g (déplacé), tourne (attribut), grandit
  // (échelle animée en CSS), corps (le dessin).
  function creerChenille(parent, cle, { x = 0, y = 0, k = 1, rotation = 0, dessin = null } = {}) {
    const g = svgEl('g', {}, parent);
    const tourne = svgEl('g', { transform: `rotate(${rotation})` }, g);
    const grandit = svgEl('g', { class: 'e4-croissance' }, tourne);
    const corps = svgEl('g', { class: 'e4-corps' }, grandit);
    corps.innerHTML = dessin || M.chenille(cle);
    grandit.style.transform = `scale(${k})`;
    placer(g, x, y);
    return { g, tourne, grandit, corps, k };
  }
  function grandir(c, k) {
    c.k = k;
    c.grandit.style.transform = `scale(${k.toFixed(2)})`;
  }

  function chrysalideLoupe(parent, cle, x, y, k, rotation = 0) {
    const g = svgEl('g', { transform: `translate(${x} ${y}) rotate(${rotation}) scale(${k})` }, parent);
    const tremble = svgEl('g', { class: 'e4-chrysalide' }, g);
    svgEl('g', { class: 'e5-pop' }, tremble).innerHTML = M.chrysalide(cle);
    return { g, tremble };
  }

  async function eclore(chrys) {
    relancer(chrys.tremble, 'e4-tremble');
    bip('clic', 0.2);
    await dormir(850);
    disparaitre(chrys.g, 400);
  }

  function papillonLoupe(parent, cle, x, y, k) {
    const g = svgEl('g', { transform: `translate(${x} ${y}) scale(${k})` }, parent);
    svgEl('g', { class: 'e4-eclot e4-lent' }, g).innerHTML = M.papillon(cle);
    bip('eclosion');
    etincellesLoupe(x, y, 14, '#fff3a8', 120);
    return g;
  }

  function zzz(parent, x, y) {
    const g = svgEl('g', { transform: `translate(${x} ${y})` }, parent);
    g.innerHTML = [0, 1, 2].map((i) => `<text class="e4-zzz" style="animation-delay:${(-i * 0.6).toFixed(1)}s" x="${i * 7}" y="${-i * 8}" font-size="${12 + i * 3}" font-weight="700" fill="#5a4a8a">z</text>`).join('');
    return g;
  }

  function odeur(parent, x, y) {
    const g = svgEl('g', { transform: `translate(${x} ${y})` }, parent);
    g.innerHTML = [0, 1, 2].map((i) => `<path class="e4-odeur" style="animation-delay:${(i * 0.12).toFixed(2)}s" d="M${-8 + i * 9} 0 q-4 -6 0 -12 t0 -12" stroke="#f28c28" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('');
    plusTard(1300, () => g.remove());
  }

  async function hiver(L, duree) {
    const voile = svgEl('rect', { x: -LOUPE.r, y: -LOUPE.r, width: LOUPE.r * 2, height: LOUPE.r * 2, fill: '#e9f0ff' }, L.effets);
    voile.style.opacity = '0';
    const neige = svgEl('g', {}, L.effets);
    for (let i = 0; i < (calme ? 0 : 28); i++) {
      const fl = svgEl('circle', { cx: (-150 + Math.random() * 300).toFixed(1), cy: -LOUPE.r - 10, r: (1.8 + Math.random() * 2.6).toFixed(1), fill: '#fff', class: 'e4-flocon' }, neige);
      fl.style.animationDuration = `${((2.2 + Math.random() * 1.6) / R).toFixed(2)}s`;
      fl.style.animationDelay = `${((-Math.random() * 3) / R).toFixed(2)}s`;
    }
    await animer(voile, [{ opacity: 0 }, { opacity: 0.6 }], { duree: 700 });
    await dormir(duree);
    await Promise.all([disparaitre(voile, 800), disparaitre(neige, 800)]);
  }

  /* -------------------------------------------------------- Le paon du jour */

  async function jeuPaon(L, e) {
    const T = e.textes;
    L.contenu.innerHTML = `
      <path d="M-200 26 C-160 16 -120 8 -60 0 M-128 12 l-16 -18 M-100 7 l9 -15" stroke="#7a5232" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="e4-plante-loupe" transform="translate(0 150) scale(2.4)">${M.plante('ortie')}</g>
      <g transform="translate(0 -46)"><g class="e4-toile">${M.toileSoie()}</g></g>
      <g class="e4-colonie"></g>
      <g transform="translate(-30 40)"><g class="e4-oeufs e5-pop">${M.oeufsPaon()}</g></g>`;
    const toile = L.contenu.querySelector('.e4-toile');
    toile.style.opacity = '0';
    const feuilles = [...L.contenu.querySelectorAll('.e4-plante-loupe polygon')];
    for (const fe of feuilles) fe.classList.add('e4-feuille');
    await raconter(T.ponte, 2600);

    // Éclosion : une colonie de petites chenilles noires dans leur toile.
    bip('eclosion');
    disparaitre(L.contenu.querySelector('.e4-oeufs').parentNode, 300);
    const colonieG = L.contenu.querySelector('.e4-colonie');
    const colonie = COLONIE.map(([x, y, sens]) => {
      const g = svgEl('g', { transform: `translate(${x} ${y}) scale(${sens} 1)` }, colonieG);
      return creerChenille(g, 'paon', { k: 0.3 });
    });
    for (const c of colonie) c.corps.classList.add('e4-rampe');
    apparaitre(toile, 700);
    dire(T.eclosion);
    const zoneTouche = touchable(svgEl('circle', { r: LOUPE.r, fill: 'transparent' }, L.contenu), 'Nourrir les chenilles', 'nourrir');
    etat = 'nourrir';
    const N = 8;
    for (let i = 1; i <= N; i++) {
      const t = await attendreTouche([zoneTouche], { inactif: 7000, quandInactif: () => dire(T.eclosion) });
      const x = t.x ?? 0;
      const y = t.y ?? -40;
      bip('croque');
      etincellesLoupe(x, y, 7, '#7fbf5a', 80);
      flotter(L.contenu, x, y - 12, TEXTES.miam);
      const fe = feuilles[feuilles.length - i];
      if (fe) fe.classList.add('e4-mangee');
      for (const c of colonie) {
        grandir(c, 0.3 + (0.65 * i) / N);
        c.corps.classList.add('e4-mange');
      }
      plusTard(380, () => { for (const c of colonie) c.corps.classList.remove('e4-mange'); });
      if (i === 3 || i === 6) {
        // une mue : la vieille peau craque
        plusTard(200, () => { bip('eclosion'); for (const [cx, cy] of COLONIE) etincellesLoupe(cx, cy - 6, 2, '#ffffff', 40); });
      }
    }
    zoneTouche.remove();
    etat = 'occupe';
    await raconter(T.grandes, 1600);
    await Promise.all([disparaitre(colonieG, 700), disparaitre(toile, 700)]);

    // Une chrysalide pend sous une feuille, puis l'adulte, ailes fermées.
    const chrys = chrysalideLoupe(L.contenu, 'paon', 30, -22, 2.2);
    dire(T.chrysalide);
    await dormir(1500);
    await eclore(chrys);
    const adulte = svgEl('g', { transform: 'translate(32 26)' }, L.contenu);
    svgEl('rect', { x: -50, y: -96, width: 104, height: 112, fill: 'transparent' }, adulte);
    const ferme = svgEl('g', { transform: 'scale(1.5)' }, adulte);
    svgEl('g', { class: 'e5-pop' }, ferme).innerHTML = M.paonFerme();
    bip('eclosion');
    dire(T.ferme);
    await dormir(2000);

    // La mésange arrive.
    const oiseau = svgEl('g', {}, L.contenu);
    const sens = svgEl('g', { transform: 'scale(1.25)' }, oiseau);
    const corpsOiseau = svgEl('g', { class: 'e4-oiseau e4-vole' }, sens);
    corpsOiseau.innerHTML = M.mesange();
    placer(oiseau, -240, -120);
    bip('vol');
    await voler(oiseau, -96, -22, 1200, { hauteur: 26 });
    corpsOiseau.classList.remove('e4-vole');
    await dormir(350);
    await voler(oiseau, -78, -24, 320, { hauteur: 10 });
    touchable(adulte, 'Le paon du jour, ailes fermées', 'paon-adulte');
    etat = 'mesange';
    dire(T.mesange);
    let h = null;
    await attendreTouche([adulte], { inactif: 5000, quandInactif: () => { h = halo(L.contenu, 32, -12, 44, 52); } });
    if (h) h.remove();
    etat = 'occupe';

    // Il ouvre ses ailes : les ocelles !
    ferme.remove();
    const ouvert = svgEl('g', { transform: 'translate(0 -22) scale(2.1)' }, adulte);
    svgEl('g', { class: 'e4-eclot e4-lent' }, ouvert).innerHTML = M.papillon('paon');
    bip('ocelles');
    etincellesLoupe(32, -22, 14, '#f2c14e', 120);
    const surprise = svgEl('g', { transform: 'translate(-72 -62)' }, L.contenu);
    surprise.innerHTML = '<text class="e5-pop" text-anchor="middle" font-size="36" font-weight="700" fill="#e04a2a" stroke="#fff" stroke-width="4" paint-order="stroke">!</text>';
    await dormir(500);
    surprise.remove();
    sens.setAttribute('transform', 'scale(-1.25 1.25)');
    corpsOiseau.classList.add('e4-vole');
    bip('vol');
    await voler(oiseau, -250, -200, 900, { hauteur: 20 });
    oiseau.remove();
    dire(T.peur);
    await dormir(2400);
  }

  /* ------------------------------------------------------------- L'aurore */

  async function jeuAurore(L, e) {
    const T = e.textes;
    const DY = 16;      // tout le gros plan un peu plus bas, pour voir les fleurs
    L.contenu.innerHTML = `<g transform="translate(0 ${DY})">${M.alliaireLoupe()}<g class="e4-siliques"></g>${M.fleursAlliaireLoupe()}
      <g transform="translate(16 -116) scale(2)"><g class="e4-oeuf e5-pop">${M.oeufAurore()}</g></g></g>`;
    const groupe = L.contenu.querySelector('.e4-siliques');
    const siliques = M.SILIQUES.map(([y, a, l]) => {
      const g = svgEl('g', { transform: `translate(0 ${y}) rotate(${a})` }, groupe);
      const s = svgEl('g', { class: 'e4-silique' }, g);
      s.innerHTML = M.silique(l);
      return { s, g, y: y + DY, a, l };
    });
    dire(T.ponte);
    await dormir(1000);
    await animer(L.contenu.querySelector('.e4-coque'), [{ fill: '#f6f1d6' }, { fill: '#f28c28' }], { duree: 2000 });
    await dormir(800);

    // Éclosion : elle mange sa coquille.
    bip('eclosion');
    const bebe = creerChenille(L.contenu, 'aurore', { x: 8, y: -112 + DY, k: 0.7 });
    bebe.corps.classList.add('e4-mange');
    disparaitre(L.contenu.querySelector('.e4-oeuf').parentNode, 1200);
    await raconter(T.eclosion, 3600);
    await disparaitre(bebe.g, 500);

    // Cache-cache : elle s'est allongée contre une silique.
    const cache = 1 + Math.floor(Math.random() * 5);
    const sc = siliques[cache];
    sc.s.innerHTML = M.chenilleSilique(sc.l);
    groupe.append(sc.g);    // par-dessus les autres : là où elles se croisent, c'est elle qu'on touche
    siliques.forEach(({ s, l }, i) => {
      svgEl('path', { d: `M0 -12 V${-l - 6}`, stroke: 'transparent', 'stroke-width': 20, 'stroke-linecap': 'round' }, s);
      touchable(s, `Fruit n° ${i + 1}`, i === cache ? 'chenille-aurore' : `silique-${i}`);
    });
    dire(T.cache);
    etat = 'cherche-chenille';
    let rates = 0;
    const trahir = () => sc.s.classList.add('e4-gigote');
    for (;;) {
      const t = await attendreTouche(siliques.map((q) => q.s), { inactif: 12000, quandInactif: trahir });
      if (t.el === sc.s) break;
      rates++;
      relancer(t.el, 'e4-secoue-petit');
      bip('non');
      montrerBulle(t.x ?? 0, (t.y ?? 0) - 14, [T.pasCa], L.bulles);
      plusTard(1400, cacherBulle);
      if (rates >= 2) trahir();
    }
    etat = 'occupe';
    sc.s.classList.remove('e4-gigote');
    const r = (sc.a * Math.PI) / 180;
    const tete = { x: Math.sin(r) * (sc.l - 4), y: sc.y - Math.cos(r) * (sc.l - 4) };
    bip('miam');
    etincellesLoupe(tete.x, tete.y, 12, '#fff3a8', 100);
    montrerBulle(tete.x, tete.y - 12, [TEXTES.coucou], L.bulles);
    dire(T.trouvee);
    await dormir(2600);
    cacherBulle();

    // Chrysalide, puis l'hiver passe.
    await disparaitre(sc.s, 500);
    const chrys = chrysalideLoupe(L.contenu, 'aurore', 10, 40 + DY, 2.4, 14);
    dire(T.hiver);
    await dormir(1000);
    await hiver(L, 2800);
    await eclore(chrys);
    papillonLoupe(L.contenu, 'aurore', 4, -6, 2.2);
    dire(T.printemps);
    await dormir(3000);
  }

  /* ---------------------------------------------------- Le cuivré des marais */

  async function jeuCuivre(L, e) {
    const T = e.textes;
    L.contenu.innerHTML = `
      <g class="e4-plante-loupe" transform="translate(0 150) scale(2.4)">${M.plante('patience')}</g>
      <g class="e4-fenetres"></g>
      <g transform="translate(-34 104) rotate(-32) scale(1.6)"><g class="e4-oeufs e5-pop">${M.oeufsCuivre()}</g></g>`;
    for (const fe of L.contenu.querySelectorAll('.e4-plante-loupe ellipse')) fe.classList.add('e4-feuille-saison');
    dire(T.ponte);
    await dormir(2200);

    // La petite chenille et ses « fenêtres ».
    bip('eclosion');
    disparaitre(L.contenu.querySelector('.e4-oeufs').parentNode, 400);
    const c = creerChenille(L.contenu, 'cuivre', { x: -14, y: 122, k: 0.55 });
    dire(T.fenetres);
    const fenetres = L.contenu.querySelector('.e4-fenetres');
    for (const [x, y] of [[-23, 113], [-35, 94], [-47, 75]]) {
      c.corps.classList.add('e4-rampe');
      await aller(c.g, x + 10, y + 8, 520);
      c.corps.classList.remove('e4-rampe');
      c.corps.classList.add('e4-mange');
      bip('croque');
      const fe = svgEl('g', { transform: `translate(${x} ${y}) rotate(-32)` }, fenetres);
      svgEl('ellipse', { rx: 8.5, ry: 4.8, fill: '#e8f5d6', stroke: '#c5e0a6', 'stroke-width': 1, class: 'e5-pop' }, fe);
      await dormir(700);
      c.corps.classList.remove('e4-mange');
    }
    grandir(c, 0.8);
    await dormir(1300);

    // L'automne : elle s'endort au pied de la plante.
    dire(T.automne);
    L.contenu.classList.add('e4-automne');
    c.corps.classList.add('e4-rampe');
    await aller(c.g, 18, 146, 1300);
    c.corps.classList.remove('e4-rampe');
    const dodo = zzz(L.contenu, 34, 124);
    await dormir(2900);
    dodo.remove();

    // La crue : l'eau monte, il faut grimper.
    const MARCHES = [146, 112, 78, 44, 10, -24, -58];
    const NIVEAU_HAUT = 6;
    c.tourne.setAttribute('transform', 'rotate(-90)');
    placer(c.g, 8, MARCHES[0]);
    svgEl('rect', { x: -26, y: -34, width: 44, height: 62, fill: 'transparent' }, c.g);
    touchable(c.g, 'La chenille du cuivré', 'chenille-cuivre');
    const eauG = svgEl('g', {}, L.effets);
    eauG.innerHTML = M.eau(LOUPE.r);
    let niveau = LOUPE.r + 24;
    placer(eauG, 0, niveau);
    let marche = 0;
    let sousLEau = false;
    let ditNoyee = false;
    const sous = () => niveau < MARCHES[marche] - 22;
    // l'eau monte toute seule, image après image
    let avant = performance.now();
    const monter = (t) => {
      if (!vivant) return;
      const dt = Math.min(0.05, (t - avant) / 1000) * V;
      avant = t;
      if (niveau > NIVEAU_HAUT) niveau = Math.max(NIVEAU_HAUT, niveau - 16 * dt);
      eauG.style.transform = `translate(0px, ${niveau.toFixed(1)}px)`;
      if (!sousLEau && sous()) {
        sousLEau = true;
        bip('bulles');
        const b = svgEl('g', { transform: `translate(8 ${MARCHES[marche] - 26})` }, L.effets);
        b.innerHTML = [0, 1, 2].map((i) => `<circle class="e4-bulle-eau" style="animation-delay:${(i * 0.25).toFixed(2)}s" cx="${-4 + i * 5}" cy="0" r="${2 + i}" fill="none" stroke="#fff" stroke-width="1.4"/>`).join('');
        plusTard(1600, () => b.remove());
        if (!ditNoyee) { ditNoyee = true; dire(T.noyee); }
      }
      boucleEau = requestAnimationFrame(monter);
    };
    boucleEau = requestAnimationFrame(monter);
    bip('plouf');
    dire(T.crue);
    etat = 'crue';
    while (marche < MARCHES.length - 1) {
      let h = null;
      await attendreTouche([c.g], { inactif: 4500, quandInactif: () => { h = halo(L.contenu, 8, MARCHES[marche] - 4, 24, 30); } });
      if (h) h.remove();
      marche++;
      if (sousLEau && !sous()) sousLEau = false;
      bip('clic', 0.15 + marche * 0.1);
      c.corps.classList.add('e4-rampe');
      aller(c.g, 8, MARCHES[marche], 240, 'ease-out').then(() => c.corps.classList.remove('e4-rampe'));
    }
    etat = 'occupe';
    await dormir(400);
    cancelAnimationFrame(boucleEau);
    bip('miam');
    etincellesLoupe(8, MARCHES[marche] - 10, 12, '#fff3a8', 100);
    await raconter(T.sauvee, 2600);

    // La décrue, le printemps, la métamorphose.
    await animer(eauG, [{ transform: `translate(0px, ${niveau.toFixed(1)}px)` }, { transform: `translate(0px, ${LOUPE.r + 40}px)` }], { duree: 1600, easing: 'ease-in' });
    eauG.remove();
    L.contenu.classList.remove('e4-automne');
    dire(T.printemps);
    grandir(c, 1.05);
    c.corps.classList.add('e4-mange');
    bip('croque');
    await dormir(1300);
    c.corps.classList.remove('e4-mange');
    const chrys = chrysalideLoupe(L.contenu, 'cuivre', 16, -46, 2.4);
    await disparaitre(c.g, 450);
    await dormir(900);
    await eclore(chrys);
    papillonLoupe(L.contenu, 'cuivre', 10, -64, 2.1);
    dire(T.adulte);
    await dormir(2600);
  }

  /* -------------------------------------------------- L'azuré des mouillères */

  async function jeuAzure(L, e) {
    const T = e.textes;
    const SOL = 72;
    const touffes = [-150, -118, -60, 40, 118, 150].map((x) => `<path d="M${x} ${SOL + 2} q2 -10 -1 -18 M${x + 6} ${SOL + 2} q-1 -12 3 -20" stroke="#7fb35a" stroke-width="2.2" fill="none" stroke-linecap="round"/>`).join('');
    L.contenu.innerHTML = `
      <path d="M-200 ${SOL} Q-80 ${SOL - 8} 0 ${SOL - 2} T200 ${SOL - 4} V240 H-200 Z" fill="#9b6b40"/>
      <path d="M-200 ${SOL} Q-80 ${SOL - 8} 0 ${SOL - 2} T200 ${SOL - 4}" stroke="#7a5230" stroke-width="3" fill="none"/>
      ${touffes}
      <g class="e4-plante-loupe" transform="translate(0 80) scale(1.9)">${M.plante('gentiane')}</g>
      <g class="e4-oeufs"></g>`;
    const oeufs = L.contenu.querySelector('.e4-oeufs');
    dire(T.ponte);
    for (const [x, y] of [[-22, -64], [-26, -55], [25, -77], [5, -42]]) {
      svgEl('g', { transform: `translate(${x} ${y}) scale(1.3)` }, oeufs).innerHTML = `<g class="e5-pop">${M.oeufAzure()}</g>`;
      bip('poc');
      await dormir(380);
    }
    await dormir(3200);

    // Cachée dans une fleur, puis elle se laisse tomber.
    const c = creerChenille(L.contenu, 'azure', { x: -22, y: -116, k: 0.7 });
    apparaitre(c.g, 400);
    c.corps.classList.add('e4-mange');
    dire(T.fleur);
    await dormir(2400);
    c.corps.classList.remove('e4-mange');
    bip('vol');
    await aller(c.g, -34, SOL + 6, 650, 'cubic-bezier(.5,0,1,.6)');
    bip('poc');
    grandir(c, 0.9);
    dire(T.tombe);

    // Trois fourmis passent : laquelle l'adoptera ?
    const sortes = [
      { cle: 'lasius', de: [-230, SOL + 12], a: [-98, SOL + 12], sens: 1 },
      { cle: 'myrmica', de: [230, SOL + 14], a: [92, SOL + 14], sens: -1 },
      { cle: 'formica', de: [230, SOL + 42], a: [30, SOL + 42], sens: -1 },
    ];
    const fourmis = sortes.map((s) => {
      const g = svgEl('g', { class: 'e4-marche-fourmi' }, L.contenu);
      const sensG = svgEl('g', { transform: `scale(${s.sens * 3} 3)` }, g);
      svgEl('g', { class: 'e4-fourmi' }, sensG).innerHTML = M.fourmi(s.cle);
      const etiquette = svgEl('g', { transform: 'translate(0 7)' }, g);
      etiquette.innerHTML = M.etiquette([M.FOURMIS[s.cle].nom]);
      svgEl('rect', { x: -36, y: -28, width: 72, height: 58, fill: 'transparent' }, g);
      placer(g, ...s.de);
      return { ...s, g, sensG, etiquette };
    });
    await Promise.all(fourmis.map((f, i) => dormir(i * 300).then(() => aller(f.g, ...f.a, 1400, 'ease-out'))));
    for (const f of fourmis) {
      f.g.classList.remove('e4-marche-fourmi');
      touchable(f.g, `Fourmi ${M.FOURMIS[f.cle].nom}`, `fourmi-${f.cle}`);
    }
    etat = 'fourmi';
    let restantes = [...fourmis];
    let erreurs = 0;
    for (;;) {
      const t = await attendreTouche(restantes.map((f) => f.g), { inactif: 15000, quandInactif: () => dire(T.indiceFourmi) });
      const choisie = restantes.find((f) => f.g === t.el);
      if (choisie.cle === 'myrmica') break;
      erreurs++;
      etat = 'occupe';
      // elle vient renifler la chenille… et repart
      choisie.g.classList.add('e4-marche-fourmi');
      const pres = positions.get(c.g).x + (choisie.a[0] < positions.get(c.g).x ? -30 : 30);
      await aller(choisie.g, pres, choisie.a[1], 650);
      choisie.g.classList.remove('e4-marche-fourmi');
      bip('non');
      dire(erreurs === 1 ? `${T.mauvaiseFourmi} ${T.indiceFourmi}` : T.mauvaiseFourmi);
      await dormir(700);
      choisie.sensG.setAttribute('transform', `scale(${(pres < positions.get(c.g).x ? -3 : 3)} 3)`);
      choisie.g.classList.add('e4-marche-fourmi');
      await aller(choisie.g, pres < positions.get(c.g).x ? -240 : 240, choisie.a[1], 1100, 'ease-in');
      choisie.g.remove();
      restantes = restantes.filter((f) => f !== choisie);
      etat = 'fourmi';
    }

    // La bonne : une Myrmica l'emporte.
    etat = 'occupe';
    const myr = restantes.find((f) => f.cle === 'myrmica');
    for (const f of restantes) if (f !== myr) disparaitre(f.g, 400);
    disparaitre(myr.etiquette, 300);
    bip('miam');
    myr.g.classList.add('e4-marche-fourmi');
    const ici = positions.get(c.g);
    await aller(myr.g, ici.x + 34, ici.y + 6, 900);
    myr.g.classList.remove('e4-marche-fourmi');
    dire(T.adoptee);
    await dormir(900);
    myr.sensG.setAttribute('transform', 'scale(3 3)');
    myr.g.classList.add('e4-marche-fourmi');
    await aller(c.g, ici.x + 54, ici.y - 4, 300);
    await Promise.all([aller(myr.g, 250, ici.y + 6, 1700, 'ease-in'), aller(c.g, 270, ici.y - 4, 1700, 'ease-in')]);

    // Dans la fourmilière.
    await animer(L.contenu, [{ opacity: 1 }, { opacity: 0 }], { duree: 400 });
    L.contenu.innerHTML = M.fourmiliereCoupe();
    const nourrices = [{ x: -86, y: 50, sens: 1 }, { x: 14, y: 52, sens: -1 }].map((n) => {
      const g = svgEl('g', {}, L.contenu);
      svgEl('g', { class: 'e4-fourmi' }, svgEl('g', { transform: `scale(${n.sens * 2.6} 2.6)` }, g)).innerHTML = M.fourmi('myrmica');
      placer(g, n.x, n.y);
      return { ...n, g };
    });
    const larve = creerChenille(L.contenu, 'azure', { x: -36, y: 46, k: 1.2 });
    svgEl('rect', { x: -30, y: -30, width: 60, height: 40, fill: 'transparent' }, larve.g);
    await animer(L.contenu, [{ opacity: 0 }, { opacity: 1 }], { duree: 400 });
    touchable(larve.g, 'La chenille de l’azuré', 'chenille-azure');
    dire(T.reclame);
    etat = 'reclame';
    for (let i = 0; i < 4; i++) {
      let h = null;
      await attendreTouche([larve.g], { inactif: 6000, quandInactif: () => { h = halo(L.contenu, -36, 38, 30, 20); } });
      if (h) h.remove();
      const n = nourrices[i % 2];
      bip('clic', 0.5);
      relancer(larve.corps, 'e4-gigote-court');
      await aller(n.g, n.sens > 0 ? -66 : -6, n.y, 280);
      const goutte = svgEl('circle', { cx: n.sens > 0 ? -54 : -18, cy: n.y - 9, r: 3.2, fill: '#f7df7a', class: 'e5-pop' }, L.contenu);
      bip('miam');
      grandir(larve, 1.2 + 0.12 * (i + 1));
      flotter(L.contenu, -36, 14, TEXTES.miam, '#8a5a2a');
      plusTard(500, () => goutte.remove());
      aller(n.g, n.x, n.y, 380);
    }
    etat = 'occupe';
    dire(T.nourrie);
    await dormir(2600);

    // Près d'un an plus tard : la chrysalide, puis le papillon sort du nid.
    const chrys = chrysalideLoupe(L.contenu, 'azure', -36, 50, 2.4);
    await disparaitre(larve.g, 450);
    await dormir(700);
    await eclore(chrys);
    const papillon = svgEl('g', {}, L.contenu);
    const pk = svgEl('g', { transform: 'scale(1.5)' }, papillon);
    svgEl('g', { class: 'e4-eclot e4-lent' }, pk).innerHTML = M.papillon('azure');
    placer(papillon, -36, 30);
    bip('eclosion');
    dire(T.sortie);
    await dormir(900);
    await aller(papillon, 50, -16, 1100);
    await aller(papillon, 76, -92, 900);
    await aller(papillon, 76, -200, 700, 'ease-in');
    await dormir(500);
  }

  /* ------------------------------------------------------------- Le machaon */

  async function jeuMachaon(L, e) {
    const T = e.textes;
    L.contenu.innerHTML = `
      <g class="e4-plante-loupe" transform="translate(0 140) scale(2.2)">${M.plante('carotte')}</g>
      <g transform="translate(24 12) scale(2)"><g class="e4-oeuf e5-pop">${M.oeufMachaon()}</g></g>`;
    dire(T.ponte);
    await dormir(2400);
    bip('eclosion');
    await disparaitre(L.contenu.querySelector('.e4-oeuf').parentNode, 400);

    // Laquelle de ces « fientes » est la chenille ?
    const SPOTS = [[-26, 34], [48, 92], [26, 12]];
    const vraie = Math.floor(Math.random() * SPOTS.length);
    const spots = SPOTS.map(([x, y], i) => {
      const g = svgEl('g', {}, L.contenu);
      const k = svgEl('g', { transform: `scale(${i === vraie ? 1.5 : 1.9})` }, g);
      const grand = svgEl('g', { class: 'e4-croissance' }, k);
      const corps = svgEl('g', { class: i === vraie ? 'e4-corps' : 'e4-fiente' }, grand);
      corps.innerHTML = i === vraie ? M.chenilleMachaonJeune() : M.fiente(i);
      svgEl('rect', { x: -22, y: -18, width: 44, height: 28, fill: 'transparent' }, k);
      placer(g, x, y);
      touchable(g, `Petite chose noire et blanche n° ${i + 1}`, i === vraie ? 'chenille-machaon' : `fiente-${i}`);
      return { g, grand, corps, x, y };
    });
    for (const s of spots) apparaitre(s.g, 400);
    dire(T.fiente);
    etat = 'fiente';
    let rates = 0;
    const trahir = () => spots[vraie].corps.classList.add('e4-rampe');
    for (;;) {
      const t = await attendreTouche(spots.map((s) => s.g), { inactif: 12000, quandInactif: trahir });
      const i = spots.findIndex((s) => s.g === t.el);
      if (i === vraie) break;
      rates++;
      bip('beurk');
      relancer(spots[i].corps, 'e4-secoue-petit');
      montrerBulle(spots[i].x, spots[i].y - 22, [T.vraieFiente], L.bulles);
      plusTard(1500, cacherBulle);
      if (rates >= 2) trahir();
    }
    etat = 'occupe';
    cacherBulle();
    const s = spots[vraie];
    s.corps.classList.remove('e4-rampe');
    spots.forEach((q, i) => { if (i !== vraie) disparaitre(q.g, 400); });
    bip('miam');
    montrerBulle(s.x, s.y - 24, [TEXTES.coucou], L.bulles);
    dire(T.trouvee);
    await dormir(1200);
    cacherBulle();

    // Elle mange, grandit, mue.
    etat = 'manger';
    for (let i = 1; i <= 4; i++) {
      await attendreTouche([s.g], { inactif: 6000, quandInactif: () => dire(T.trouvee) });
      bip('croque');
      s.corps.classList.add('e4-mange');
      etincellesLoupe(s.x + 24, s.y - 6, 6, '#7fbf5a', 80);
      flotter(L.contenu, s.x, s.y - 22, TEXTES.miam);
      s.grand.style.transform = `scale(${(1 + i * 0.1).toFixed(2)})`;
      plusTard(400, () => s.corps.classList.remove('e4-mange'));
    }
    etat = 'occupe';
    await dormir(500);
    bip('eclosion');
    etincellesLoupe(s.x, s.y - 8, 14, '#ffffff', 90);
    s.corps.innerHTML = M.chenille('machaon');
    s.grand.style.transform = 'scale(1.15)';
    dire(T.mue);
    await dormir(1200);
    s.corps.classList.add('e4-rampe');
    await aller(s.g, 14, 48, 1000);
    s.corps.classList.remove('e4-rampe');
    s.x = 14;
    s.y = 48;
    await dormir(600);

    // Les fourmis : les cornes orange !
    const venues = [{ de: [2, 200], a: [2, 86], angle: -90 }, { de: [2, -200], a: [2, 10], angle: 90 }];
    for (let v = 0; v < venues.length; v++) {
      const f = venues[v];
      const fourmi = svgEl('g', { class: 'e4-marche-fourmi' }, L.contenu);
      const tourne = svgEl('g', { transform: `rotate(${f.angle}) scale(3)` }, fourmi);
      svgEl('g', { class: 'e4-fourmi' }, tourne).innerHTML = M.fourmi();
      placer(fourmi, ...f.de);
      await aller(fourmi, ...f.a, 1700, 'ease-out');
      fourmi.classList.remove('e4-marche-fourmi');
      etat = 'cornes';
      dire(v === 0 ? T.fourmi : T.encore);
      let h = null;
      await attendreTouche([s.g], { inactif: 5000, quandInactif: () => { h = halo(L.contenu, s.x + 20, s.y - 10, 46, 26); } });
      if (h) h.remove();
      etat = 'occupe';
      s.corps.classList.add('e4-fache');
      bip('pschitt');
      odeur(L.contenu, s.x + 44, s.y - 30);
      await dormir(450);
      tourne.setAttribute('transform', `rotate(${-f.angle}) scale(3)`);
      fourmi.classList.add('e4-marche-fourmi');
      await aller(fourmi, ...f.de, 900, 'ease-in');
      fourmi.remove();
      s.corps.classList.remove('e4-fache');
      if (v === 0) {
        dire(T.cornes);
        await dormir(3000);
      }
    }

    // La chrysalide.
    const chrys = chrysalideLoupe(L.contenu, 'machaon', 12, 56, 2.4, 8);
    await disparaitre(s.g, 450);
    dire(T.chrysalide);
    await dormir(2200);
    relancer(chrys.tremble, 'e4-tremble');
    bip('clic', 0.2);
    await dormir(900);
  }

  const JEUX = { paon: jeuPaon, aurore: jeuAurore, cuivre: jeuCuivre, azure: jeuAzure, machaon: jeuMachaon };

  /* ------------------------------------------------------------- Les adultes */

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

  // L'azuré sort d'une fourmilière, au pied de la gentiane.
  async function sortieFourmiliere(p) {
    const nid = { x: p.x + 30, y: p.y - 2 };
    const g = svgEl('g', {}, calques.dessus);
    g.innerHTML = `<g class="e5-pop">${M.fourmiliere()}</g>`;
    placer(g, nid.x, nid.y);
    await dormir(600);
    return { x: nid.x, y: nid.y - 26 };
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

  /* ----------------------------------------------------------- Une espèce */

  async function jouerEspece(e) {
    especeCourante = e.cle;
    const f = creerFemelle(e);
    if (e.occupee) poserOeufPris(e.occupee);
    bip('vol');
    await voler(f, ATTENTE.x, ATTENTE.y, 1500, { hauteur: 30, ondule: 8 });
    f.classList.remove('e4-vite');
    dire(e.arrivee);
    montrerBulle(ATTENTE.x, ATTENTE.y - 26, [TEXTES.ou]);
    const { plante, occupeeVue } = await choisirPlante(e, f);

    // La bonne plante : elle pond et s'en va.
    relancer(plante.el, 'e4-content');
    const s = sommet(plante);
    montrerBulle(s.x, s.y - 26, [TEXTES.merci]);
    if (e.occupee && !occupeeVue) {
      dire(e.textes.bienVu);
      montrerOeufPris(e.occupee, 3200);
    }
    await pondre(f);
    await dormir(e.occupee && !occupeeVue ? 3800 : 500);
    cacherBulle();
    f.classList.add('e4-vite');
    bip('vol');
    voler(f, 480, 30, 1400, { hauteur: 40, ondule: 8 }).then(() => f.remove());
    await dormir(450);
    if (oeufPris) { oeufPris.remove(); oeufPris = null; }

    // À la loupe.
    const L = await ouvrirLoupe(plante);
    await JEUX[e.cle](L, e);
    await fermerLoupe(L);

    // Le papillon adulte.
    const point = e.cle === 'azure' ? await sortieFourmiliere(plante) : { x: s.x, y: s.y + 6 };
    const p = creerPapillon(e.cle, point, e.cle === 'machaon' ? { chiffre: CODE[3] } : {});
    await dormir(700);
    if (e.cle !== 'machaon') {
      p.classList.add('e4-vite');
      bip('vol');
      const c = ciel();
      voler(p, c.x, c.y, 1600, { hauteur: 40, ondule: 8 }).then(() => { p.classList.remove('e4-vite'); errer(p); });
      await dormir(500);
    }
    await ajouterPage(e);
    return p;
  }

  /* --------------------------------------------------------------- La fin */

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
    // La petite course jusqu'au café, puis l'écran passe aux couleurs du café.
    etat = 'course';
    await course(racine, { son, fx, V, calme, debug });
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
    await dormir(3400);
    let dernier = null;
    for (const e of ESPECES) dernier = await jouerEspece(e);
    etat = 'fin';
    especeCourante = null;
    await finale(dernier);
  }

  majHud(false);
  scenario().catch((e) => { if (vivant) console.error(e); });
  if (debug !== null) {
    window.__e4 = {
      get etat() { return etat; },
      get espece() { return especeCourante; },
      get pages() { return pages.length; },
    };
  }

  return () => {
    vivant = false;
    for (const id of minuteurs) clearTimeout(id);
    cancelAnimationFrame(boucleErrance);
    cancelAnimationFrame(boucleEau);
    observateur.disconnect();
    delete window.__e4;
  };
}

export default {
  fond: 'clair',
  ambiance: 'sons/etape-4.mp3',
  demarrer,
};
