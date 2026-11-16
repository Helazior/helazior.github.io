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

// Le jeu : réglé pour rester facile (durées en millisecondes).
const REGLES = {
  vies: 5,
  arrivees: 2000,            // une femelle toutes les 2 secondes
  patience: 12000,           // avant qu'une mésange fonde sur une femelle qui attend
  danger: 6000,              // pour réagir à un danger dans une loupe
  oeuf: 1800,
  chrysalide: 1600,
  entreDangers: [1500, 3500],
};

const TEXTES = {
  intro: 'Cinq femelles arrivent coup sur coup, et tout se passe en même temps : pendant que tu places les unes sur leur plante, les œufs des autres éclosent dans les loupes en haut. Quand une loupe clignote en rouge, touche-la ! Tu as 5 vies.',
  demarrer: 'C’est parti !',
  consigne: 'Touche une femelle, puis sa plante. Vite, les mésanges rôdent !',
  choisie: (nom) => `${nom} : sur quelle plante ?`,
  troplongue: (nom) => `Une mésange a fondu sur la femelle ${nom.toLowerCase()} ! Ne la fais pas trop attendre.`,
  choisisDabord: 'Touche d’abord une femelle.',
  occupeCourt: 'Déjà un œuf orange sur la cardamine : les jeunes chenilles d’aurore se mangent entre elles ! Essaie l’autre plante à fleurs blanches.',
  pasCelleLa: 'Pas celle-là : il lui faut une Myrmica, la fourmi rousse !',
  gagne: 'Les cinq papillons sont nés ! Bravo, naturaliste !',
  perdu: 'Le marais était un peu trop agité… Pas grave, on recommence !',
  recommencer: 'Recommencer',
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
    court: 'Paon',
    jeu: {
      ponte: 'Paon du jour : tout un paquet d’œufs sur l’ortie !',
      dangers: [],
      adulte: { menace: 'mesange', texte: 'Une mésange ! Touche la loupe du paon : il ouvre ses ailes !', bravo: 'Ses grands « yeux » font fuir la mésange !', rate: 'Trop tard : la mésange a bousculé le paon…' },
      envol: 'Un paon du jour s’envole !',
    },
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
    court: 'Aurore',
    jeu: {
      ponte: 'Aurore : un seul œuf, qui vire à l’orange.',
      dangers: [{ menace: 'mesange', texte: 'Un oiseau cherche la chenille d’aurore ! Touche sa loupe : elle se cache contre une silique.', bravo: 'Bien cachée : on dirait un fruit de la plante !', rate: 'Repérée ! L’oiseau l’a fait tomber…' }],
      envol: 'Une aurore s’envole !',
    },
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
    court: 'Cuivré',
    jeu: {
      ponte: 'Cuivré des marais : des œufs blancs sur la patience.',
      dangers: [{ menace: 'crue', touches: 3, duree: 6500, texte: 'Crue d’hiver ! Touche trois fois la loupe du cuivré pour que la chenille grimpe au sec.', bravo: 'Au sec ! Elle passera l’hiver tranquille.', rate: 'Glou… elle est restée trop longtemps sous l’eau.' }],
      envol: 'Un cuivré des marais s’envole !',
    },
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
    court: 'Azuré',
    jeu: {
      ponte: 'Azuré des mouillères : des œufs blancs sur les boutons de la gentiane.',
      dangers: [
        { menace: 'fourmis', texte: 'La chenille d’azuré est tombée au sol : touche la fourmi qui doit l’adopter !', bravo: 'Adoptée par les Myrmica !', rate: 'Personne ne l’a adoptée à temps…' },
        { menace: 'faim', touches: 2, texte: 'Dans la fourmilière, elle réclame à manger : touche deux fois sa loupe !', bravo: 'Nourrie au bouche-à-bouche par les fourmis !', rate: 'Elle a eu faim…' },
      ],
      envol: 'Un azuré sort de la fourmilière et s’envole !',
    },
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
    court: 'Machaon',
    jeu: {
      ponte: 'Machaon : un œuf sur la carotte sauvage.',
      dangers: [
        { menace: 'fourmi', texte: 'Une fourmi approche la chenille du machaon : touche sa loupe pour sortir ses cornes !', bravo: 'Pschitt ! Les cornes orange repoussent la fourmi.', rate: 'La fourmi l’a embêtée…' },
        { menace: 'fourmi', texte: 'Encore une fourmi sur le machaon ! Touche sa loupe !', bravo: 'Encore repoussée !', rate: 'Aïe, la fourmi l’a embêtée…' },
      ],
      envol: 'Le machaon s’envole !',
    },
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
const CIEL = { x0: 30, x1: 370, y0: 150, y1: 205 };
const LOUPE = { x: 200, y: 300, r: M.RAYON_LOUPE };
const NS = 'http://www.w3.org/2000/svg';
const RYTHME = 1.7;   // passages automatiques 1,7 fois plus rapides

// Dans la loupe : les chenilles du paon sur les feuilles d'ortie [x, y, sens].
const COLONIE = [[-38, -26, 1], [-16, -30, 1], [18, -36, -1], [40, -30, -1], [-30, -78, 1], [-10, -80, 1], [12, -86, -1], [32, -84, -1], [-40, 30, 1], [36, 24, -1]];

const ICONE_CARNET = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="15" height="18" rx="2.5" fill="#f6ecd2" stroke="currentColor" stroke-width="1.8"/>
  <path d="M8 3v18" stroke="currentColor" stroke-width="1.8"/><path d="M11 8h5M11 11.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M19 6h1.5M19 10h1.5M19 14h1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

function demarrer({ scene, son, fx, suivante, aller: allerEtape, debug }) {
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
    <g class="e4-loupes"></g>
    <g class="e4-bulles"></g>
    <defs><clipPath id="e4-clip-mini"><circle r="34"/></clipPath></defs>
    <g class="e4-calque-loupe"></g>`;
  plantes.forEach((p) => { p.el = svg.querySelector(`[data-e4="plante-${p.cle}"]`); });
  const planteDe = (cle) => plantes.find((p) => p.cle === cle);

  const calques = {
    guide: $('.e4-guide'),
    dessus: $('.e4-dessus'),
    papillons: $('.e4-papillons'),
    bulles: $('.e4-bulles'),
    loupe: $('.e4-calque-loupe'),
    loupes: $('.e4-loupes'),
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

  // Une page de plus dans le carnet, sans interrompre le jeu.
  function ajouterPage(e) {
    pages.push(e);
    majHud(true);
    bip('papier');
    if (pages.length === ESPECES.length) {
      hud.classList.add('e4-hud-complet');
      const r = hud.getBoundingClientRect();
      const base = racine.getBoundingClientRect();
      fx.etincelles(r.left + r.width / 2 - base.left, r.top + r.height / 2 - base.top, calme ? 6 : 16, '#f2c14e', 110);
    }
  }

  hud.addEventListener('click', () => {
    if (!pages.length || racine.querySelector('.e4-carnet')) return;
    bip('papier');
    ouvrirCarnet(pages.length - 1);
  });

  /* ----------------------------------------------------- Le marais en folie */

  // Une femelle arrive toutes les 2 secondes : on la touche, puis on touche sa
  // plante. Si elle attend trop, une mésange fond sur elle : une vie de moins.
  // Chaque ponte ouvre une petite loupe en haut, où la vie continue : œuf,
  // chenille, dangers (mésange, crue, fourmis…), chrysalide, papillon. Un
  // danger qu'on laisse filer coûte une vie. Plus de vies : on recommence.

  const vraiment = (ms) => dormir(ms * RYTHME);   // durées en vraies millisecondes
  const sommet = (p) => ({ x: p.x + 2, y: p.y - p.haut - 4 });
  const PLACES_ATTENTE = [96, 160, 224, 288, 352].map((x) => ({ x, y: 196 }));
  const PLACES_LOUPES = [48, 124, 200, 276, 352].map((x) => ({ x, y: 66 }));
  let enJeu = false;
  let vies = REGLES.vies;
  let selection = null;
  const femelles = [];          // { e, g, place, attente, choisie, occupee, erreurs, anneau }
  const comptes = [];           // dangers en cours dans les loupes : { reste, total, anneau, echec }
  let papillonMachaon = null;
  let finis = 0;

  // Les vies, en haut de l'écran.
  const zoneVies = document.createElement('div');
  zoneVies.className = 'e4-vies';
  zoneVies.hidden = true;
  zoneVies.innerHTML = Array.from({ length: REGLES.vies }, () => `<svg class="e4-coeur" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21 C5 15 1 11.5 1 7 C1 3.6 3.6 1 7 1 C9.1 1 11 2.1 12 3.8 C13 2.1 14.9 1 17 1 C20.4 1 23 3.6 23 7 C23 11.5 19 15 12 21 Z"/></svg>`).join('');
  zoneScene().append(zoneVies);
  function zoneScene() { return $('.e4-scene'); }
  function majVies() {
    zoneVies.setAttribute('aria-label', `Vies : ${vies} sur ${REGLES.vies}`);
    zoneVies.querySelectorAll('.e4-coeur').forEach((c, i) => c.classList.toggle('e4-coeur-perdu', i >= vies));
  }
  majVies();

  function perdreVie(x, y, pourquoi) {
    if (!enJeu) return;
    vies--;
    majVies();
    bip('non');
    relancer(zoneVies, 'e4-vies-touche');
    relancer(racine, 'e4-secousse');
    flotter(calques.bulles, x, y, '−1 ♥', '#d6336c');
    if (pourquoi) dire(pourquoi);
    if (vies <= 0) perdu();
  }

  function perdu() {
    enJeu = false;
    etat = 'perdu';
    const fond = document.createElement('div');
    fond.className = 'e4-perdu';
    fond.setAttribute('role', 'dialog');
    fond.innerHTML = `<div class="e4-perdu-boite"><p>${TEXTES.perdu}</p><button type="button" class="e4-principal" data-e4="recommencer">${TEXTES.recommencer}</button></div>`;
    racine.append(fond);
    const b = fond.querySelector('button');
    b.addEventListener('click', () => { bip('clic', 0.5); allerEtape(4); }, { once: true });
    b.focus({ preventScroll: true });
  }

  /* ---- Les femelles qui attendent */

  function creerFemelle(e) {
    const g = svgEl('g', { class: 'e4-papillon e4-vite e4-femelle', 'data-e4': `femelle-${e.cle}`, role: 'button', tabindex: 0, 'aria-label': `Femelle ${e.nom.toLowerCase()} : touche-la, puis sa plante` }, calques.papillons);
    svgEl('circle', { r: 30, fill: 'transparent' }, g);
    const anneau = svgEl('circle', { class: 'e4-patience', r: 27, fill: 'none', stroke: '#8f5cf7', 'stroke-width': 3.5, 'stroke-linecap': 'round', transform: 'rotate(-90)', 'stroke-dasharray': `${(2 * Math.PI * 27).toFixed(1)} 999` }, g);
    const zoom = svgEl('g', { class: 'e4-zoom' }, g);
    const taille = svgEl('g', { transform: 'scale(.78)' }, zoom);
    svgEl('g', { class: 'e4-tambour' }, taille).innerHTML = M.papillon(e.cle, { femelle: true });
    placer(g, 430, 150);
    const f = { e, g, anneau, place: null, attente: false, patience: REGLES.patience, erreurs: 0 };
    const choisir = (ev) => {
      if (ev.type === 'keydown' && ev.key !== 'Enter' && ev.key !== ' ') return;
      ev.preventDefault();
      if (!enJeu || !f.attente) return;
      selectionner(f);
    };
    g.addEventListener('pointerdown', choisir);
    g.addEventListener('keydown', choisir);
    return f;
  }

  function selectionner(f) {
    if (selection) selection.g.classList.remove('e4-choisie');
    selection = f;
    if (f) {
      f.g.classList.add('e4-choisie');
      bip('clic', 0.6);
      dire(TEXTES.choisie(f.e.nom));
    }
  }

  async function arriver(f, place) {
    f.place = place;
    bip('vol');
    await voler(f.g, place.x, place.y, 900, { hauteur: 30, ondule: 6 });
    f.g.classList.remove('e4-vite');
    f.attente = true;
  }

  // Elle a trop attendu : une mésange fond sur elle (elle s'en sort, mais on
  // perd une vie) et sa patience repart.
  async function attaqueMesange(f) {
    f.patience = REGLES.patience;
    const p = positions.get(f.g);
    const oiseau = svgEl('g', { 'pointer-events': 'none' }, calques.bulles);
    const corps = svgEl('g', { class: 'e4-oiseau e4-vole' }, svgEl('g', { transform: 'scale(.9)' }, oiseau));
    corps.innerHTML = M.mesange();
    placer(oiseau, p.x - 120, p.y - 70);
    bip('vol');
    await voler(oiseau, p.x - 6, p.y, 420 * R, { hauteur: 8 });   // vitesse réelle : un vrai piqué
    relancer(f.g, 'e4-secoue-plante');
    perdreVie(p.x, p.y - 30, TEXTES.troplongue(f.e.nom));
    await voler(oiseau, p.x + 140, p.y - 110, 500 * R, { hauteur: 10 });
    oiseau.remove();
  }

  // On touche une plante : la femelle choisie (ou celle qui attend depuis le
  // plus longtemps) va la goûter.
  async function essayerPlante(p) {
    let f = selection || femelles.filter((x) => x.attente).sort((a, b) => a.patience - b.patience)[0];
    if (!f || !f.attente) { dire(TEXTES.choisisDabord); return; }
    selectionner(null);
    f.attente = false;
    const s = sommet(p);
    f.g.classList.add('e4-vite');
    bip('vol');
    await voler(f.g, s.x, s.y, 650, { hauteur: 22 });
    f.g.classList.remove('e4-vite');
    await tambouriner(f.g);
    if (!enJeu) return;
    if (f.e.plantes.includes(p.cle)) {
      relancer(p.el, 'e4-content');
      await pondre(f.g);
      flotter(calques.bulles, s.x, s.y - 26, TEXTES.merci, '#7a3cf0');
      if (p.cle === 'alliaire' && oeufPris) { oeufPris.remove(); oeufPris = null; }
      if (f.place) f.place.libre = true;
      f.g.classList.add('e4-vite');
      voler(f.g, 470, 30, 1200, { hauteur: 40, ondule: 8 }).then(() => f.g.remove());
      femelles.splice(femelles.indexOf(f), 1);
      cycle(f.e, p);
      return;
    }
    relancer(p.el, 'e4-secoue-plante');
    if (p.cle === f.e.occupee) {
      bip('non');
      flotter(calques.bulles, s.x, s.y - 26, f.e.textes.dejaPris, '#d6336c');
      montrerOeufPris(p.cle, 3000);
      dire(TEXTES.occupeCourt);
    } else {
      f.erreurs++;
      bip(f.e.cle === 'machaon' ? 'beurk' : 'non');
      flotter(calques.bulles, s.x, s.y - 26, f.e.cle === 'machaon' ? TEXTES.refusMachaon : TEXTES.refus[refusVus++ % TEXTES.refus.length], '#d6336c');
      dire(premierRefus ? TEXTES.premierRefus : `${f.e.indice}`);
      premierRefus = false;
      if (f.erreurs >= 2) montrerPlante(f.e);
    }
    f.g.classList.add('e4-vite');
    await voler(f.g, f.place.x, f.place.y, 600, { hauteur: 16 });
    f.g.classList.remove('e4-vite');
    if (enJeu) f.attente = true;
  }

  const lueurs = new Map();
  function montrerPlante(e) {
    if (lueurs.has(e.cle)) return;
    const p = planteDe(e.plantes[0]);
    const g = svgEl('g', { transform: `translate(${p.x} ${p.y})` }, calques.guide);
    g.innerHTML = `<ellipse cx="0" cy="-56" rx="50" ry="74" fill="url(#e4-lueur)"/>
      <ellipse class="e4-halo-anim" cx="0" cy="-56" rx="46" ry="68" fill="none" stroke="#f2c14e" stroke-width="3"/>`;
    lueurs.set(e.cle, g);
  }

  async function tambouriner(g) {
    const t = g.querySelector('.e4-tambour');
    t.classList.add('e4-tambourine');
    for (let i = 0; i < 2; i++) { bip('clic', 0.1 + i * 0.15); await dormir(170); }
    t.classList.remove('e4-tambourine');
  }
  async function pondre(g) {
    const t = g.querySelector('.e4-tambour');
    await animer(t, [{ transform: 'translateY(0)' }, { transform: 'translateY(6px)' }, { transform: 'translateY(0)' }], { duree: 360, garder: false });
    bip('poc');
  }

  // Pour l'aurore : un œuf orange déjà pondu sur la cardamine.
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

  plantes.forEach((p) => {
    const h = (ev) => {
      if (ev.type === 'keydown' && ev.key !== 'Enter' && ev.key !== ' ') return;
      ev.preventDefault();
      if (enJeu) essayerPlante(p);
    };
    p.el.addEventListener('pointerdown', h);
    p.el.addEventListener('keydown', h);
  });

  /* ---- Les loupes : la vie de chaque ponte */

  const ANNEAU_LOUPE = 2 * Math.PI * 36;

  function creerLoupe(e, i) {
    const pl = PLACES_LOUPES[i];
    const g = svgEl('g', { class: 'e4-mini', 'data-e4': `loupe-${e.cle}`, role: 'button', tabindex: 0, 'aria-label': `Loupe : ${e.nom}`, transform: `translate(${pl.x} ${pl.y})` }, calques.loupes);
    const pop = svgEl('g', { class: 'e4-mini-pop' }, g);
    pop.innerHTML = `
      <circle class="e4-mini-bord" r="38" fill="#5a32a0" stroke="#5a32a0" stroke-width="2"/>
      <g clip-path="url(#e4-clip-mini)">
        <circle r="34" fill="url(#e4-fond-loupe)"/>
        <path d="M-34 22 Q0 16 34 22 V40 H-34 Z" fill="#9ccc72"/>
        <g class="e4-mini-scene"></g>
        <g class="e4-mini-menace"></g>
        <g class="e4-mini-eau"></g>
      </g>
      <circle class="e4-mini-compte" r="36" fill="none" stroke="#e04a2a" stroke-width="4.5" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="0 999"/>
      <circle r="34" fill="none" stroke="#c9b3ff" stroke-width="1.5"/>
      <g transform="translate(0 44)">${M.etiquette([e.court])}</g>`;
    const q = (s) => pop.querySelector(s);
    const L = { e, g, pop, scene: q('.e4-mini-scene'), menace: q('.e4-mini-menace'), eau: q('.e4-mini-eau'), compte: q('.e4-mini-compte'), x: pl.x, y: pl.y, attenteTouche: null };
    const toucher = (ev) => {
      if (ev.type === 'keydown' && ev.key !== 'Enter' && ev.key !== ' ') return;
      ev.preventDefault();
      if (!enJeu || !L.attenteTouche) return;
      const cote = ev.target.closest('[data-cote]');
      L.attenteTouche(cote ? cote.dataset.cote : null, ev);
    };
    g.addEventListener('pointerdown', toucher);
    g.addEventListener('keydown', toucher);
    bip('onde');
    return L;
  }

  function stade(L, contenu) {
    L.scene.innerHTML = `<g class="e5-pop">${contenu}</g>`;
  }

  const DESSINS = {
    oeuf: {
      paon: `<g transform="translate(0 12) scale(.7)">${M.oeufsPaon()}</g>`,
      aurore: `<g transform="translate(0 20) scale(1.7)">${M.oeufAurore('#f28c28')}</g>`,
      cuivre: `<g transform="translate(-4 12) scale(1.5)">${M.oeufsCuivre()}</g>`,
      azure: `<g transform="translate(0 12) scale(1.5)">${[-6, 0, 6].map((x) => `<g transform="translate(${x} ${x ? 0 : -4})">${M.oeufAzure()}</g>`).join('')}</g>`,
      machaon: `<g transform="translate(0 12) scale(1.8)">${M.oeufMachaon()}</g>`,
    },
    chenille: (cle) => cle === 'paon'
      ? [[-12, 20, 1], [6, 14, -1], [12, 24, -1]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s * 0.55} .55)"><g class="e4-corps e4-rampe">${M.chenille('paon')}</g></g>`).join('')
      : `<g transform="translate(0 20) scale(.95)"><g class="e4-corps e4-rampe">${M.chenille(cle)}</g></g>`,
    chrysalide: (cle) => `<g transform="translate(0 ${cle === 'paon' ? -10 : 20}) scale(1.35)"><g class="e4-chrysalide">${M.chrysalide(cle)}</g></g>`,
  };

  // Un danger dans une loupe. type : 'tap' (n touchers), ou 'choix' (toucher
  // le bon côté). Renvoie true si on l'a évité à temps.
  function danger(L, { duree = REGLES.danger, touches = 1, choix = null, menace = '', texte, bravo, rate, surTouche }) {
    return new Promise((resolve) => {
      L.menace.innerHTML = menace;
      L.g.classList.add('e4-mini-alerte');
      bip('sonnette');
      dire(texte);
      let n = 0;
      const c = { reste: duree, total: duree, L };
      const finir = (ok) => {
        comptes.splice(comptes.indexOf(c), 1);
        L.attenteTouche = null;
        L.g.classList.remove('e4-mini-alerte');
        L.compte.setAttribute('stroke-dasharray', '0 999');
        if (ok) {
          bip('chiffre');
          etincelles(L.x, L.y, 10, '#fff3a8', 70);
          if (bravo) dire(bravo);
        } else perdreVie(L.x, L.y + 10, rate);
        resolve(ok);
      };
      c.echec = () => finir(false);
      comptes.push(c);
      L.attenteTouche = (cote) => {
        if (choix) {
          if (cote === choix) finir(true);
          else if (cote) { bip('non'); dire(TEXTES.pasCelleLa); }
          return;
        }
        n++;
        bip('clic', Math.min(1, 0.3 + n * 0.25));
        if (surTouche) surTouche(n);
        if (n >= touches) finir(true);
      };
    });
  }

  // La vie d'une ponte, de l'œuf au papillon, dans sa loupe.
  async function cycle(e, p) {
    const i = ESPECES.indexOf(e);
    const L = creerLoupe(e, i);
    const T = e.jeu;
    stade(L, DESSINS.oeuf[e.cle]);
    dire(T.ponte);
    await vraiment(REGLES.oeuf);
    if (!enJeu) return;
    bip('eclosion');
    stade(L, DESSINS.chenille(e.cle));
    for (const d of T.dangers) {
      await vraiment(REGLES.entreDangers[0] + Math.random() * (REGLES.entreDangers[1] - REGLES.entreDangers[0]));
      if (!enJeu) return;
      await jouerDanger(L, e, d);
      if (!enJeu) return;
      L.menace.innerHTML = '';
      L.eau.innerHTML = '';
    }
    await dormir(900);
    if (!enJeu) return;
    stade(L, DESSINS.chrysalide(e.cle));
    await vraiment(REGLES.chrysalide);
    if (!enJeu) return;
    if (T.adulte) {
      stade(L, `<g transform="translate(2 22) scale(.6)">${M.paonFerme()}</g>`);
      await dormir(700);
      await jouerDanger(L, e, T.adulte);
      if (!enJeu) return;
      stade(L, `<g transform="translate(0 2) scale(.72)"><g class="e4-lent">${M.papillon('paon')}</g></g>`);
      L.menace.innerHTML = '';
      await dormir(700);
    }
    // le papillon s'envole de sa plante
    L.scene.innerHTML = '<g class="e5-pop"><circle r="13" fill="#7fbf5a"/><path d="M-6 0 L-1.5 5 L7 -5" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>';
    L.g.classList.add('e4-mini-fini');
    const point = e.cle === 'azure' ? await sortieFourmiliere(p) : (() => { const s = sommet(p); return { x: s.x, y: s.y + 6 }; })();
    const pap = creerPapillon(e.cle, point, e.cle === 'machaon' ? { chiffre: CODE[3] } : {});
    if (e.cle === 'machaon') papillonMachaon = pap;
    pap.classList.add('e4-vite');
    const c = ciel();
    voler(pap, c.x, c.y, 1400, { hauteur: 40, ondule: 8 }).then(() => { pap.classList.remove('e4-vite'); errer(pap); });
    dire(T.envol);
    ajouterPage(e);
    finis++;
    signaler();
  }

  async function jouerDanger(L, e, d) {
    const M2 = MENACES[d.menace](L);
    const ok = await danger(L, { ...d, ...M2, choix: M2.choix ?? d.choix });
    if (ok && d.menace === 'fourmi') {
      // les cornes orange : la fourmi s'en va
      const corps = L.scene.querySelector('.e4-corps');
      if (corps) { corps.classList.add('e4-fache'); plusTard(900, () => corps.classList.remove('e4-fache')); }
      bip('pschitt');
    }
    return ok;
  }

  // Les dangers dessinés dans les loupes.
  const MENACES = {
    mesange: () => ({ menace: `<g class="e4-mini-arrive"><g transform="translate(-20 -2) scale(.55)">${M.mesange()}</g></g>` }),
    fourmi: () => ({
      menace: `<g class="e4-mini-arrive"><g transform="translate(-22 22) scale(2)"><g class="e4-marche-fourmi"><g class="e4-fourmi">${M.fourmi()}</g></g></g></g>`,
    }),
    crue: (L) => {
      L.eau.innerHTML = '<g class="e4-mini-crue"><rect x="-40" y="0" width="80" height="60" fill="#5aa6d6" opacity=".6"/><path d="M-40 0 q10 -4 20 0 t20 0 t20 0 t20 0" stroke="#e8f6fc" stroke-width="2" fill="none"/></g>';
      const corps = L.scene.querySelector('.e5-pop');
      return { surTouche: (n) => { corps.style.transform = `translateY(${-n * 9}px)`; corps.style.transition = 'transform .2s'; } };
    },
    fourmis: () => {
      const gauche = Math.random() < 0.5 ? 'myrmica' : 'lasius';
      const droite = gauche === 'myrmica' ? 'lasius' : 'myrmica';
      const fourmiG = (sorte, x, s) => `<g transform="translate(${x} 22) scale(${s * 1.8} 1.8)">${M.fourmi(sorte)}</g>`;
      return {
        choix: 'myrmica',
        menace: `${fourmiG(gauche, -18, 1)}${fourmiG(droite, 18, -1)}
          <rect data-cote="${gauche}" data-e4="fourmi-${gauche}" x="-38" y="-38" width="38" height="76" fill="transparent"/>
          <rect data-cote="${droite}" data-e4="fourmi-${droite}" x="0" y="-38" width="38" height="76" fill="transparent"/>`,
      };
    },
    faim: () => ({ menace: `<g transform="translate(-20 20) scale(-1.8 1.8)">${M.fourmi('myrmica')}</g><circle class="e4-mini-goutte" cx="-8" cy="12" r="2.6" fill="#f7df7a"/>` }),
  };

  // Le jeu du marais : les arrivées, l'horloge des patiences et des dangers.
  const signaux = [];
  const signaler = () => signaux.splice(0).forEach((r) => r());

  let horloge = 0;
  function lancerHorloge() {
    let avant = performance.now();
    const pas = (t) => {
      if (!vivant) return;
      const dt = Math.min(0.1, (t - avant) / 1000) * V * 1000;
      avant = t;
      if (enJeu) {
        for (const f of femelles) {
          if (!f.attente) continue;
          f.patience -= dt;
          const k = Math.max(0, f.patience / REGLES.patience);
          f.anneau.setAttribute('stroke-dasharray', `${(k * 2 * Math.PI * 27).toFixed(1)} 999`);
          f.anneau.setAttribute('stroke', k < 0.35 ? '#e04a2a' : '#8f5cf7');
          if (f.patience <= 0) attaqueMesange(f);
        }
        for (const c of [...comptes]) {
          c.reste -= dt;
          const k = Math.max(0, c.reste / c.total);
          c.L.compte.setAttribute('stroke-dasharray', `${(k * ANNEAU_LOUPE).toFixed(1)} 999`);
          if (c.reste <= 0) c.echec();
        }
      }
      horloge = requestAnimationFrame(pas);
    };
    horloge = requestAnimationFrame(pas);
  }

  async function jeu() {
    enJeu = true;
    etat = 'jeu';
    zoneVies.hidden = false;
    lancerHorloge();
    dire(TEXTES.consigne);
    poserOeufPris('cardamine');
    for (let i = 0; i < ESPECES.length; i++) {
      if (!enJeu) return null;
      const f = creerFemelle(ESPECES[i]);
      femelles.push(f);
      arriver(f, PLACES_ATTENTE[i]);
      if (i < ESPECES.length - 1) await vraiment(REGLES.arrivees);
    }
    while (enJeu && finis < ESPECES.length) await new Promise((r) => signaux.push(r));
    if (!enJeu) return null;
    enJeu = false;
    etat = 'gagne';
    for (const g of lueurs.values()) g.remove();
    for (const g of [...calques.loupes.children]) disparaitre(g, 600);
    zoneVies.hidden = true;
    dire(TEXTES.gagne);
    await dormir(1600);
    return papillonMachaon;
  }

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
    etat = 'intro';
    await new Promise((r) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'e4-principal';
      b.dataset.e4 = 'demarrer';
      b.textContent = TEXTES.demarrer;
      b.addEventListener('click', () => { bip('clic', 0.6); zoneBoutons.replaceChildren(); r(); }, { once: true });
      zoneBoutons.append(b);
      b.focus({ preventScroll: true });
    });
    const machaon = await jeu();
    if (!machaon) return;
    etat = 'fin';
    await finale(machaon);
  }

  majHud(false);
  scenario().catch((e) => { if (vivant) console.error(e); });
  if (debug !== null) {
    window.__e4 = {
      get etat() { return etat; },
      get espece() { return especeCourante; },
      get pages() { return pages.length; },
      get vies() { return vies; },
      get attente() { return femelles.filter((f) => f.attente).map((f) => f.e.cle); },
      get dangers() { return comptes.map((c) => c.L.e.cle); },
    };
  }

  return () => {
    vivant = false;
    for (const id of minuteurs) clearTimeout(id);
    cancelAnimationFrame(boucleErrance);
    cancelAnimationFrame(boucleEau);
    cancelAnimationFrame(horloge);
    observateur.disconnect();
    delete window.__e4;
  };
}

export default {
  fond: 'clair',
  ambiance: 'sons/etape-4.mp3',
  demarrer,
};
