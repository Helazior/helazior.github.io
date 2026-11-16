// Étape 5 — le café de Cyriel.
//
// Un petit jeu de café, en hommage à celui qu'elle adorait :
//   1. connexion : le mot de passe est le code à 4 chiffres trouvé en chemin ;
//   2. le livre de recettes dit quoi acheter ; au marché, on touche un étal
//      pour ouvrir sa vitrine et acheter à l'unité (tout va au frigo) ;
//   3. les clients s'installent et commandent, chacun avec son exigence
//      (« double chocolat », « sans sucre »…) ;
//   4. au fourneau, le livre s'ouvre : on choisit la commande, on met dans la
//      casserole les bons ingrédients du frigo, puis on prépare et on cuit ;
//   5. Pipistrelle sert. Un client très spécial (un machaon) commande la
//      spécialité, puis laisse le mot de Clément et le cadeau.
//
// Les aliments qu'elle déteste sont vendus au marché. Si elle en met dans la
// casserole, le plat part quand même et le client trouve ça affreux, comme
// elle. Il manque un ingrédient ? Retour au marché. On ne peut jamais perdre :
// après deux essais ratés, le livre donne la liste exacte.
//
// Tous les textes sont regroupés juste en dessous. Le mot et le cadeau
// sont à écrire par Clément : TEXTES.lettre et TEXTES.cadeau.
//
// Pour les essais :  ?etape=5&debug=vite  (tout va 4 fois plus vite).

import { CODE } from '../code.js';
import * as D from './cafe-dessins.js';

/* ======================================================= Textes à modifier */

const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const TEXTES = {
  nomCafe: 'Café de Cyriel',
  nomMarche: 'Marché',
  pieces: 'Pièces',
  ramasser: 'Ramasser les pièces',
  ouvert: 'Ouvert',
  panneauCafe: 'Café',

  // Les pseudos des joueurs qui flânent au marché : Clément près de la
  // fontaine, Estel sur le banc (les deux derniers ne se voient que sur un
  // écran large).
  joueurs: ['Clément', 'Mamie_Confiture', 'xX_Hibou_Xx', 'Estel', 'Gaston_du_43', 'Bichette'],

  connexion: {
    pseudo: 'Pseudo',
    pseudoValeur: 'Cyriel',
    motDePasse: 'Mot de passe',
    jouer: 'Jouer',
    erreur: 'Mauvais mot de passe.',
    oubli: 'Mot de passe oublié ?',
    indice: 'Ton mot de passe, ce sont les 4 chiffres trouvés en chemin : le premier dans la grotte, le deuxième sur ta peinture, le troisième sur le panneau du marais et le dernier sur l’aile du machaon.',
    coupDePouce: 'Coup de pouce :',
    chargement: 'Chargement du café…',
    version: 'Version 23.11',
  },

  // Ce que dit Pipistrelle, la serveuse.
  retour: 'Te revoilà, cheffe ! Tu veux relire ton mot, ou rejouer une partie ?',
  intro: 'Bienvenue dans ton café, cheffe Cyriel ! Moi, c’est Pipistrelle, ta serveuse. Ce soir, on rouvre.',
  livre: 'Le frigo est vide… Regarde d’abord le livre de recettes, pour savoir quoi acheter.',
  versMarche: 'Allons au marché faire les courses !',
  marche: 'Touche un étal pour voir ce qu’il vend. Le livre et le frigo sont en haut, si besoin.',
  astuceMarche: 'Le livre de recettes, en haut, dit tout ce qu’il faut acheter.',
  achatDeteste: (a) => `${cap(a.partitif)} ? Tu es sûre ? Bon… c’est toi la cheffe.`,
  avance: 'Plus assez de pièces ? Je t’avance mes pourboires !',
  manqueEncore: (liste) => `Il manque encore ${liste}. On rentre quand même ?`,
  rangement: 'Je range les courses au frigo…',
  ouverture: 'On ouvre ! Les premiers clients arrivent.',
  premiereCommande: 'Un client s’est installé ! Touche le fourneau : le livre de recettes te dira ce qu’il veut.',
  commandeSuivante: 'Touche le fourneau pour préparer une autre commande.',
  attenteClient: 'On attend le prochain client…',
  preparation: 'Tout est dans la casserole. Au travail !',
  vraiTemps: 'Comme dans le vrai jeu, la cuisson prend du vrai temps ! Pour ne pas attendre, touche le bouton jaune 60x.',
  pret: 'C’est prêt ! Touche le fourneau pour poser le plat sur le comptoir.',
  pretSpecial: 'Le gâteau est prêt ! Touche le fourneau pour le sortir du four.',
  service: 'Je l’apporte !',
  calme: 'Ouf, tout le monde est servi.',
  special: 'Oh ! Un client très spécial… Il commande la spécialité de la maison. Sa recette vient d’apparaître dans le livre !',
  commandeSpeciale: 'Touche le fourneau pour préparer la spécialité.',

  // La fin : le gâteau est pour elle, avec ses bougies.
  fete: {
    age: 24,   // les bougies en chiffres ; null pour cinq bougies classiques
    attends: 'Attends… le machaon me chuchote quelque chose à l’oreille.',
    surprise: 'Surprise ! Ce gâteau, le machaon ne l’a pas commandé pour lui… Il est pour toi !',
    pourMoi: 'Pour moi ?!',
    allumer: 'Je m’occupe des bougies…',
    souffler: 'Joyeux anniversaire, Cyriel ! Fais un vœu, puis souffle tes bougies : touche les flammes.',
    bravo: 'Bravo ! Et ce n’est pas fini : le machaon t’a apporté autre chose…',
    objets: 'Une enveloppe et un cadeau, rien que pour toi.',
    banniere: ['Joyeux anniversaire', 'Cyriel !'],
    ariaGateau: 'Ton gâteau d’anniversaire : touche les bougies pour les souffler',
  },
  fin: 'Le café est à toi, cheffe. Reviens quand tu veux !',

  // Les commandes, avec l'exigence de chaque client.
  commandes: {
    herisson: 'Un chocolat chaud, avec double chocolat : je suis très gourmand !',
    grenouille: 'Une tarte à la rhubarbe, mais sans sucre : je surveille ma ligne.',
    loutre: 'Des crêpes à la crème de marron… avec du chocolat en plus !',
    machaon: 'La spécialité de la maison, s’il te plaît : le gâteau rhubarbe et crème de marron.',
  },
  // Quand un ingrédient interdit est dans la casserole.
  rappels: {
    grenouille: 'La grenouille a bien dit : sans sucre !',
  },

  recettes: {
    chocolat: { nom: 'Chocolat chaud', dans: 'un chocolat chaud', cuit: 'Le chocolat chauffe…' },
    tarte: { nom: 'Tarte à la rhubarbe', dans: 'une tarte à la rhubarbe', cuit: 'La tarte dore au four…' },
    crepes: { nom: 'Crêpes à la crème de marron', dans: 'des crêpes', cuit: 'Les crêpes dorent dans la poêle…' },
    gateau: { nom: 'Gâteau rhubarbe et crème de marron', dans: 'ce gâteau', cuit: 'Le gâteau cuit… Ça sent bon la rhubarbe et la crème de marron.' },
  },
  gestes: {
    remuer: 'Remuer', etaler: 'Étaler la pâte', enfourner: 'Enfourner',
    verser: 'Verser la pâte', retourner: 'Retourner la crêpe', melanger: 'Mélanger',
  },

  // La vérification de la casserole.
  verif: {
    vide: 'La casserole est vide : touche les ingrédients du frigo pour les ajouter.',
    sans: (a) => `Pas ${a.de} dans cette commande !`,
    intrus: (a, r) => `${cap(a.defini)} ${a.pluriel ? 'ne vont' : 'ne va'} pas dans ${r.dans}.`,
    trop: (a) => `Il y a trop ${a.de}.`,
    manque: 'Il manque quelque chose… Relis bien la recette et la commande.',
    manqueFrigoFlou: 'Il manque quelque chose, et le frigo n’a pas tout ce qu’il faut. Relis bien la commande, puis va au marché !',
    manqueFrigo: (liste) => `Il manque ${liste}, et le frigo n’en a plus : direction le marché !`,
    detesteSpecial: (a) => `${cap(a.defini)} dans la spécialité de la maison ? Sûrement pas : elle doit être parfaite !`,
    aide: 'Coup de pouce : il faut exactement',
  },
  audacieux: 'Audacieux…',

  // Les aliments détestés : la réaction des clients.
  reactions: ['Beurk !', 'Pouah !', 'Affreux !'],   // ce que dit chaque client
  reaction: [
    (client, aliment) => `${client} déteste ${aliment}… comme toi !`,
    (client, aliment) => `${client} déteste aussi ${aliment} !`,
    (client, aliment) => `${client} ne supporte pas ${aliment} non plus.`,
  ],

  livreTexte: {
    titre: 'Livre de recettes',
    pourQui: 'Pour qui ?',
    recette: 'Recette',
    casseroleVide: 'La casserole est vide.',
    frigo: 'Ton frigo',
    frigoVide: 'Le frigo est vide : les courses se font au marché.',
    toucher: 'Touche un ingrédient pour le mettre dans la casserole (et dans la casserole pour l’enlever).',
    commandes: 'Commandes en cours',
    recettes: 'Les recettes',
    secretTitre: 'Spécialité de la maison',
    secret: 'Recette réservée à un client très spécial…',
    cuisson: (min) => `Cuisson : ${min} min`,
    reste: (n) => `${n} au frigo`,
  },
  frigo: { titre: 'Frigo', vide: 'Le frigo est vide. Les courses se font au marché !' },
  boutique: { acheter: 'Acheter', auFrigo: 'Au frigo :' },
  hud: { recettes: 'Recettes', frigo: 'Frigo' },

  ariaEnveloppe: 'Enveloppe laissée par le client',
  ariaCadeau: 'Cadeau laissé par le client',

  fourneau: {
    toucher: 'Touche le fourneau',
    pret: 'C’est prêt !',
    accelerer: 'Accélérer la cuisson 60 fois',
  },

  boutons: {
    intro: 'Bonjour Pipistrelle !',
    voirLivre: 'Ouvrir le livre',
    marche: 'Aller au marché',
    retour: 'Retour au café',
    rester: 'Je reste',
    rentrer: 'On rentre',
    cuisiner: 'Cuisiner',
    relire: 'Relire le mot',
    rejouer: 'Rejouer',
    ouvrirCadeau: 'Ouvrir le cadeau',
    relireMot: 'Relire le mot',
    fermer: 'Fermer',
  },

  // À ÉCRIRE PAR CLÉMENT : chaque élément de « paragraphes » devient un paragraphe.
  lettre: {
    titre: 'Pour Cyriel',
    paragraphes: [
      '(Ton mot pour Cyriel, à écrire ici, dans js/etapes/cafe.js.)',
    ],
    signature: 'Clément',
  },

  // À ÉCRIRE PAR CLÉMENT : ce qui s'affiche quand elle ouvre le cadeau.
  cadeau: {
    titre: 'Ton cadeau',
    lignes: [
      '(Ce que tu lui offres, à écrire ici. Par exemple : « Tu peux ouvrir ton colis ! »)',
    ],
  },
};

/* ============================================================== La partie */

// gestes : ce qu'on fait au fourneau, un toucher par geste.
// cuisson : en vraies minutes, comme dans le jeu d'origine ; le bouton 60x
// la fait passer en autant de secondes.
const RECETTES = {
  chocolat: { plat: 'tasse', ingredients: { lait: 1, chocolat: 1 }, gestes: ['remuer'], cuisson: 5 },
  tarte: { plat: 'tarte', ingredients: { farine: 1, beurre: 1, sucre: 1, rhubarbe: 1 }, gestes: ['etaler', 'enfourner'], cuisson: 12, four: true },
  crepes: { plat: 'crepes', ingredients: { farine: 1, oeufs: 1, lait: 1, marron: 1 }, gestes: ['verser', 'retourner'], cuisson: 8 },
  gateau: { plat: 'gateau', ingredients: { rhubarbe: 1, farine: 1, oeufs: 1, sucre: 1, marron: 1 }, gestes: ['melanger', 'enfourner'], cuisson: 15, four: true, secret: true },
};
const ACCELERATION = 60;

// Les clients, leur table et leur commande : plus = en plus de la recette,
// sans = à ne surtout pas mettre.
const CLIENTS = [
  { sorte: 'herisson', table: 1, recette: 'chocolat', plus: { chocolat: 1 } },
  { sorte: 'grenouille', table: 0, recette: 'tarte', sans: ['sucre'] },
  { sorte: 'loutre', table: 2, recette: 'crepes', plus: { chocolat: 1 } },
];
const ARRIVEES = [600, 5200, 6400];   // millisecondes avant chaque arrivée

// Les aliments que Cyriel n'aime pas : vendus au marché comme les autres.
const DETESTES = ['poivron', 'aubergine', 'gingembre', 'coriandre', 'balsamique', 'vin', 'champagne', 'huitres'];

const ETALS = [
  { cle: 'primeur', nom: 'Primeur', couleur: '#f06fa4', fonce: '#c64c82', articles: ['rhubarbe', 'poivron', 'aubergine', 'coriandre', 'gingembre'] },
  { cle: 'epicerie', nom: 'Épicerie', couleur: '#8f5cf7', fonce: '#6a3fd0', articles: ['farine', 'sucre', 'chocolat', 'marron', 'balsamique'] },
  { cle: 'cremerie', nom: 'Crèmerie', couleur: '#4aa3df', fonce: '#2f7fb8', articles: ['lait', 'oeufs', 'beurre'] },
  { cle: 'cave', nom: 'Cave et marée', couleur: '#3fae8c', fonce: '#2b8a6c', articles: ['vin', 'champagne', 'huitres'] },
];

const PRIX = {
  rhubarbe: 3, farine: 1, sucre: 1, marron: 4, chocolat: 3, oeufs: 2, lait: 1, beurre: 2,
  poivron: 2, aubergine: 2, gingembre: 2, coriandre: 1, balsamique: 4, vin: 5, champagne: 9, huitres: 6,
};

const PIECES_DEPART = 40;
const PAIEMENT = 10;        // ce que laisse un client content
const PAIEMENT_BEURK = 2;   // … et un client dégoûté
const AVANCE = 20;          // ce que Pipistrelle avance quand la bourse est vide
const VITESSE_MARCHE = 95;  // pixels du décor par seconde
const NS = 'http://www.w3.org/2000/svg';
const L = D.LIEUX;
const ORDRE = Object.keys(D.ARTICLES);

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const recette = (cle) => ({ ...RECETTES[cle], ...TEXTES.recettes[cle] });
const icone = (k) => `<svg viewBox="-24 -24 48 48" aria-hidden="true">${D.ARTICLES[k].dessin()}</svg>`;
const ICONE_PIECE = `<svg viewBox="-12 -12 24 24" aria-hidden="true">${D.pieceSeule()}</svg>`;

// « du beurre, du sucre et de la rhubarbe »
function listeNoms(cles) {
  const noms = cles.map((k) => D.ARTICLES[k].partitif);
  return noms.length < 2 ? noms.join('') : `${noms.slice(0, -1).join(', ')} et ${noms[noms.length - 1]}`;
}

// Ce qu'il faut exactement pour une commande : la recette, plus et sans.
function besoins(cmd) {
  const m = new Map(Object.entries(RECETTES[cmd.recette].ingredients));
  for (const [k, n] of Object.entries(cmd.plus || {})) m.set(k, (m.get(k) || 0) + n);
  for (const k of cmd.sans || []) m.delete(k);
  return m;
}

// Vérifie la casserole. Les aliments détestés sont toujours acceptés : le
// client les goûtera…
function verifier(cmd, pot) {
  const b = besoins(cmd);
  // La spécialité doit être parfaite : pas d'aliment détesté.
  const deteste = cmd.special && [...pot.keys()].find((k) => DETESTES.includes(k));
  if (deteste) return { ok: false, type: 'deteste', k: deteste };
  for (const k of cmd.sans || []) if (pot.get(k)) return { ok: false, type: 'sans', k };
  for (const k of pot.keys()) if (!DETESTES.includes(k) && !b.has(k)) return { ok: false, type: 'intrus', k };
  for (const [k, n] of pot) if (b.has(k) && n > b.get(k)) return { ok: false, type: 'trop', k };
  const manque = [...b].filter(([k, n]) => (pot.get(k) || 0) < n);
  if (manque.length) return { ok: false, type: 'manque', manque };
  return { ok: true, extra: [...pot.keys()].find((k) => DETESTES.includes(k)) || null };
}

const puces = (map, { toujours = false } = {}) => [...map].map(([k, n]) => `
  <span class="e5-ing">${icone(k)}<span>${esc(D.ARTICLES[k].nom)}</span>${n > 1 || toujours ? `<b>×${n}</b>` : ''}</span>`).join('');

function gabarit() {
  const T = TEXTES;
  return `
  <div class="e5-jeu">
    <header class="e5-haut">
      <div class="e5-pieces" role="status" aria-label="${esc(T.pieces)}">${ICONE_PIECE}<span>${PIECES_DEPART}</span></div>
      <p class="e5-nom">${esc(T.nomCafe)}</p>
      <div class="e5-outils" hidden>
        <button type="button" class="e5-outil" data-e5="hud-recettes"><svg viewBox="-12 -12 24 24" aria-hidden="true">${D.iconeLivre()}</svg><span>${esc(T.hud.recettes)}</span></button>
        <button type="button" class="e5-outil" data-e5="hud-frigo"><svg viewBox="-12 -12 24 24" aria-hidden="true">${D.iconeFrigo()}</svg><span>${esc(T.hud.frigo)}</span><b class="e5-badge" hidden>0</b></button>
      </div>
    </header>
    <div class="e5-scene">
      <svg class="e5-svg" role="img" aria-label="${esc(T.nomCafe)}" preserveAspectRatio="xMidYMid meet"></svg>
      <div class="e5-voile"></div>
    </div>
    <footer class="e5-bas">
      <div class="e5-guide">
        <svg class="e5-avatar" viewBox="-27 -29 54 54" aria-hidden="true">${D.pipistrelle()}</svg>
        <div class="e5-bulle" aria-live="polite">
          <p class="e5-texte"></p>
          <div class="e5-boutons"></div>
        </div>
      </div>
    </footer>
  </div>
  <div class="e5-login">
    <div class="e5-login-tete">
      <svg class="e5-login-art" viewBox="-150 -104 300 162" aria-hidden="true">${D.affiche()}</svg>
      <h1 class="e5-titre">${esc(T.nomCafe)}</h1>
    </div>
    <form class="e5-carte" novalidate autocomplete="off">
      <label class="e5-champ"><span>${esc(T.connexion.pseudo)}</span>
        <input type="text" value="${esc(T.connexion.pseudoValeur)}" readonly tabindex="-1"></label>
      <label class="e5-champ"><span>${esc(T.connexion.motDePasse)}</span>
        <input class="e5-mdp" type="text" inputmode="numeric" maxlength="4" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-describedby="e5-erreur"></label>
      <p class="e5-erreur" id="e5-erreur" role="alert"></p>
      <button type="submit" class="e5-jouer">${esc(T.connexion.jouer)}</button>
      <button type="button" class="e5-oubli" hidden>${esc(T.connexion.oubli)}</button>
      <p class="e5-indice" hidden></p>
    </form>
    <p class="e5-version">${esc(T.connexion.version)}</p>
  </div>`;
}

function demarrer({ scene, son, fx, memoire, debug }) {
  const V = debug === 'vite' ? 4 : 1;
  let vivant = true;
  const minuteurs = new Set();

  const racine = document.createElement('div');
  racine.className = 'e5';
  racine.innerHTML = gabarit();
  scene.append(racine);
  const $ = (s) => racine.querySelector(s);

  const svg = $('.e5-svg');
  svg.innerHTML = `${D.defs()}
    <g class="e5-vue" data-vue="cafe">
      ${D.fondCafe()}
      <g class="e5-calque-plateau"></g>
      <g class="e5-calque-clients"></g>
      ${D.tables()}
      <g class="e5-calque-tables"></g>
      ${D.decorAvant()}
      <g class="e5-calque-volants"></g>
      <g class="e5-calque-bulles"></g>
    </g>
    <g class="e5-vue" data-vue="marche" style="visibility:hidden">
      ${D.marche(ETALS, TEXTES.joueurs, TEXTES.panneauCafe)}
    </g>
    <g class="e5-guidage" pointer-events="none">
      <g class="e5-halo" style="display:none"><ellipse class="e5-halo-anim" rx="40" ry="32" fill="none" stroke="#9b6bff" stroke-width="3"/></g>
      <g class="e5-fleche" style="display:none"><path class="e5-fleche-anim" d="M-8 -18 H8 V-7 H15 L0 7 L-15 -7 H-8 Z" fill="#7a3cf0" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></g>
    </g>`;

  const calques = {
    plateau: $('.e5-calque-plateau'),
    clients: $('.e5-calque-clients'),
    tables: $('.e5-calque-tables'),
    volants: $('.e5-calque-volants'),
    bulles: $('.e5-calque-bulles'),
  };

  /* --------------------------------------------------------------- Outils */

  const bip = (...a) => { if (vivant) son.bip(...a); };
  const coeurs = (x, y, n) => { if (vivant) fx.coeurs(x, y, n); };

  function dormir(ms) {
    return new Promise((r) => {
      const id = setTimeout(() => { minuteurs.delete(id); r(); }, ms / V);
      minuteurs.add(id);
    });
  }

  // Anime un élément ; à la fin, l'état final est gardé (sauf garder: false).
  async function animer(el, images, { duree, easing = 'ease', garder = true } = {}) {
    const a = el.animate(images, { duration: duree / V, easing, fill: 'both' });
    try { await a.finished; } catch { return; }
    if (garder) {
      try {
        a.commitStyles();
      } catch {
        // Élément caché ou retiré : on recopie la dernière image à la main.
        const fin = images[images.length - 1];
        for (const [k, v] of Object.entries(fin)) if (k !== 'offset' && k !== 'easing') el.style[k] = v;
      }
    }
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
  // Vol en cloche, avec une ondulation possible (papillon).
  function voler(g, x, y, duree, { hauteur = 24, ondule = 0 } = {}) {
    const de = positions.get(g) || { x, y };
    positions.set(g, { x, y });
    const images = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const e = t * t * (3 - 2 * t);
      const cloche = Math.sin(Math.PI * t);
      const px = de.x + (x - de.x) * e;
      const py = de.y + (y - de.y) * e - cloche * hauteur + Math.sin(t * Math.PI * 7) * ondule * cloche;
      images.push({ transform: `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)` });
    }
    return animer(g, images, { duree, easing: 'linear' });
  }

  function versEcran(x, y) {
    const m = svg.getScreenCTM();
    const r = racine.getBoundingClientRect();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(x, y).matrixTransform(m);
    return { x: p.x - r.left, y: p.y - r.top };
  }
  function centre(el) {
    const a = el.getBoundingClientRect();
    const r = racine.getBoundingClientRect();
    return { x: a.left + a.width / 2 - r.left, y: a.top + a.height / 2 - r.top };
  }

  // Un dessin qui s'envole d'un point de l'écran à un autre.
  function envolee(dessin, de, vers, { duree = 650, taille = 36, boite = '-24 -24 48 48' } = {}) {
    const d = document.createElement('div');
    d.className = 'e5-envol';
    d.innerHTML = `<svg viewBox="${boite}" width="${taille}" height="${taille}" aria-hidden="true">${dessin}</svg>`;
    racine.append(d);
    const m = taille / 2;
    return animer(d, [
      { transform: `translate(${de.x - m}px, ${de.y - m}px) scale(1.1)` },
      { transform: `translate(${(de.x + vers.x) / 2 - m}px, ${Math.min(de.y, vers.y) - 40 - m}px) scale(1)`, offset: 0.45 },
      { transform: `translate(${vers.x - m}px, ${vers.y - m}px) scale(.55)` },
    ], { duree, easing: 'ease-in-out', garder: false }).then(() => d.remove());
  }

  function secouer(el) {
    el.classList.remove('e5-secoue');
    void el.getBoundingClientRect();
    el.classList.add('e5-secoue');
  }
  function rebondir(el) {
    animer(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duree: 260, garder: false });
  }

  // Attend qu'on touche (ou valide au clavier) l'une des cibles.
  function toucher(...cibles) {
    return new Promise((resolve) => {
      const fin = (e) => {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        for (const c of cibles) {
          c.removeEventListener('click', fin);
          c.removeEventListener('keydown', fin);
          c.classList.remove('e5-touchable');
        }
        resolve(e.currentTarget);
      };
      for (const c of cibles) {
        c.addEventListener('click', fin);
        c.addEventListener('keydown', fin);
        c.classList.add('e5-touchable');
      }
    });
  }

  // Écouteur permanent (clic ou Entrée / Espace).
  function surToucher(el, f) {
    el.addEventListener('click', (e) => f(e));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(e); }
    });
  }

  /* ---------------------------------------------------- Cadrage de la scène */

  const zone = $('.e5-scene');
  function cadrer() {
    const l = zone.clientWidth;
    const h = zone.clientHeight;
    if (!l || !h) return;
    const k = Math.min(l / D.LARGEUR, h / D.HAUTEUR);
    const vl = l / k;
    const vh = h / k;
    svg.setAttribute('viewBox', `${((D.LARGEUR - vl) / 2).toFixed(1)} ${((D.HAUTEUR - vh) / 2).toFixed(1)} ${vl.toFixed(1)} ${vh.toFixed(1)}`);
  }
  const observateur = new ResizeObserver(cadrer);
  observateur.observe(zone);
  cadrer();

  /* ------------------------------------------------- Guidage et Pipistrelle */

  const halo = $('.e5-halo');
  const haloForme = halo.firstElementChild;
  const fleche = $('.e5-fleche');
  function montrer(x, y, r = 30, avecFleche = true) {
    placer(halo, x, y);
    haloForme.setAttribute('rx', r);
    haloForme.setAttribute('ry', r * 0.8);
    halo.style.display = '';
    fleche.style.display = avecFleche ? '' : 'none';
    if (avecFleche) placer(fleche, x, y - r * 0.8 - 14);
  }
  function cacherGuide() {
    halo.style.display = 'none';
    fleche.style.display = 'none';
  }

  const bulleGuide = $('.e5-bulle');
  const texte = $('.e5-texte');
  const zoneBoutons = $('.e5-boutons');
  let parole = 0;
  let texteDeFond = '';
  let ephemere = 0;

  // Pipistrelle parle ; avec des choix, renvoie l'indice du bouton touché.
  function dire(t, choix = []) {
    const tour = ++parole;
    texte.textContent = t;
    texteDeFond = t;
    zoneBoutons.replaceChildren();
    animer(bulleGuide, [{ transform: 'translateY(3px)', opacity: 0.55 }, { transform: 'none', opacity: 1 }], { duree: 240, garder: false });
    if (!choix.length) return Promise.resolve(-1);
    return new Promise((resolve) => {
      choix.forEach((libelle, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = libelle;
        if (i === choix.length - 1) b.classList.add('e5-principal');
        b.addEventListener('click', () => {
          if (tour !== parole) return;
          bip('clic', 0.4);
          zoneBoutons.replaceChildren();
          resolve(i);
        });
        zoneBoutons.append(b);
      });
    });
  }
  // Remarque passagère : le texte revient ensuite, les boutons restent.
  function direUnInstant(t, ms) {
    const jeton = ++ephemere;
    const tour = parole;
    texte.textContent = t;
    dormir(ms).then(() => { if (jeton === ephemere && tour === parole) texte.textContent = texteDeFond; });
  }

  let pieces = PIECES_DEPART;
  const bourse = $('.e5-pieces');
  const compteur = bourse.querySelector('span');
  function ajouterPieces(n) {
    pieces += n;
    compteur.textContent = String(pieces);
    animer(bourse, [{ transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duree: 260, garder: false });
  }

  const pipi = svgEl('g', { class: 'e5-pipi' }, calques.volants);
  pipi.innerHTML = `<g class="e5-flotte">${D.pipistrelle()}</g>`;
  placer(pipi, L.pipi.x, L.pipi.y);
  const pipiPlat = pipi.querySelector('.e5-pipi-plat');
  let pipiLibre = Promise.resolve();

  /* -------------------------------------------------------------- Les vues */

  const vues = { cafe: $('[data-vue="cafe"]'), marche: $('[data-vue="marche"]') };
  const voile = $('.e5-voile');
  const titre = $('.e5-nom');
  let vue = 'cafe';
  let enTransition = false;
  const attenteCafe = [];
  async function changerVue(nom) {
    fermerFenetre();
    enTransition = true;
    await animer(voile, [{ opacity: 0 }, { opacity: 1 }], { duree: 260 });
    for (const [k, v] of Object.entries(vues)) v.style.visibility = k === nom ? '' : 'hidden';
    vue = nom;
    titre.textContent = nom === 'marche' ? TEXTES.nomMarche : TEXTES.nomCafe;
    await animer(voile, [{ opacity: 1 }, { opacity: 0 }], { duree: 320 });
    enTransition = false;
    if (nom === 'cafe') attenteCafe.splice(0).forEach((r) => r());
  }
  const enCafe = () => (vue === 'cafe' ? Promise.resolve() : new Promise((r) => attenteCafe.push(r)));

  /* -------------------------------------------------------------- Le frigo */

  const frigo = new Map();
  const nb = (k) => frigo.get(k) || 0;
  const pot = new Map();               // la casserole, posée sur le fourneau
  const outils = $('.e5-outils');
  const boutonRecettes = $('[data-e5="hud-recettes"]');
  const boutonFrigo = $('[data-e5="hud-frigo"]');
  const badge = $('.e5-badge');
  function majBadge() {
    const total = [...frigo.values()].reduce((a, b) => a + b, 0);
    badge.textContent = String(total);
    badge.hidden = !total;
  }

  /* ------------------------------------------------------------ Fenêtres */

  let fenetreCourante = null;
  function fenetre({ titre: t, couleur, genre, classe = '', corps = '', pied = '' }) {
    fermerFenetre();
    const f = document.createElement('div');
    f.className = `e5-fenetre ${classe}`;
    f.innerHTML = `
      <div class="e5-cadre" role="dialog" aria-modal="true" aria-label="${esc(t)}" style="--couleur:${couleur}" tabindex="-1">
        <header class="e5-cadre-tete"><h2>${esc(t)}</h2><button type="button" class="e5-croix" aria-label="${esc(TEXTES.boutons.fermer)}">×</button></header>
        <div class="e5-cadre-corps">${corps}</div>
        ${pied ? `<footer class="e5-cadre-pied">${pied}</footer>` : ''}
      </div>`;
    zone.append(f);
    const cadre = f.firstElementChild;
    let resoudre;
    const ctrl = {
      genre,
      el: f,
      cadre,
      corps: f.querySelector('.e5-cadre-corps'),
      resultat: new Promise((r) => { resoudre = r; }),
      ferme: false,
      fermer(valeur = null) {
        if (ctrl.ferme) return;
        ctrl.ferme = true;
        if (fenetreCourante === ctrl) fenetreCourante = null;
        animer(f, [{ opacity: 1 }, { opacity: 0 }], { duree: 160, garder: false }).then(() => f.remove());
        f.style.pointerEvents = 'none';
        resoudre(valeur);
      },
    };
    f.querySelector('.e5-croix').addEventListener('click', () => { bip('clic', 0.3); ctrl.fermer(null); });
    f.addEventListener('click', (e) => { if (e.target === f) ctrl.fermer(null); });
    f.addEventListener('keydown', (e) => { if (e.key === 'Escape') ctrl.fermer(null); });
    animer(f, [{ opacity: 0 }, { opacity: 1 }], { duree: 160, garder: false });
    animer(cadre, [{ transform: 'translateY(10px) scale(.94)' }, { transform: 'none' }], { duree: 260, easing: 'cubic-bezier(.3,1.4,.5,1)', garder: false });
    fenetreCourante = ctrl;
    cadre.focus({ preventScroll: true });
    return ctrl;
  }
  function fermerFenetre() { if (fenetreCourante) fenetreCourante.fermer(null); }

  function fenetreFrigo() {
    const presents = ORDRE.filter((k) => nb(k) > 0);
    const corps = presents.length
      ? `<div class="e5-grille">${presents.map((k) => `
          <div class="e5-case" role="img" aria-label="${esc(D.ARTICLES[k].nom)} : ${nb(k)}">${icone(k)}<b>${nb(k)}</b><span>${esc(D.ARTICLES[k].nom)}</span></div>`).join('')}</div>`
      : `<p class="e5-vide">${esc(TEXTES.frigo.vide)}</p>`;
    return fenetre({ titre: TEXTES.frigo.titre, couleur: '#4aa3df', genre: 'frigo', classe: 'e5-fen-frigo', corps });
  }

  // Les boutons du haut (livre et frigo) : consultables à tout moment, sauf
  // pendant qu'on remplit la casserole.
  function boutonHaut(genre, ouvrir) {
    return () => {
      if (enTransition) return;
      if (fenetreCourante?.genre === 'cuisine') return;
      bip('clic', 0.5);
      if (fenetreCourante?.genre === genre) { fermerFenetre(); return; }
      ouvrir();
    };
  }
  boutonRecettes.addEventListener('click', boutonHaut('livre', () => livreConsultation()));
  boutonFrigo.addEventListener('click', boutonHaut('frigo', fenetreFrigo));

  /* --------------------------------------------------- Le livre de recettes */

  const secrets = new Set();            // spécialités révélées
  let commandes = [];

  function visageSvg(sorte, cls = 'e5-visage') {
    const v = D.visage(sorte);
    return `<svg class="${cls}" viewBox="${v.boite}" aria-hidden="true">${v.dessin}</svg>`;
  }
  const nomClient = (cmd) => (cmd.special ? D.MACHAON.nom : D.PERSONNAGES[cmd.sorte].nom);

  function demandeHtml(cmd, { avecRecette = false } = {}) {
    const r = recette(cmd.recette);
    const aide = avecRecette && cmd.erreurs >= 2
      ? `<div class="e5-aide"><span>${esc(TEXTES.verif.aide)}</span><div class="e5-ings">${puces(besoins(cmd), { toujours: true })}</div></div>` : '';
    return `
      <section class="e5-demande">
        ${visageSvg(cmd.sorte)}
        <div class="e5-demande-texte">
          <p class="e5-qui">${esc(nomClient(cmd))}</p>
          <p class="e5-citation">« ${esc(TEXTES.commandes[cmd.sorte])} »</p>
          ${avecRecette ? `
          <div class="e5-ligne-recette">
            <span class="e5-etiquette">${esc(TEXTES.livreTexte.recette)} · ${esc(r.nom)}</span>
            <div class="e5-ings">${puces(new Map(Object.entries(r.ingredients)))}</div>
          </div>` : ''}
          ${aide}
        </div>
      </section>`;
  }

  function recetteHtml(cle) {
    const r = recette(cle);
    if (r.secret && !secrets.has(cle)) {
      return `
      <article class="e5-recette e5-secrete">
        <svg class="e5-plat" viewBox="-24 -24 48 48" aria-hidden="true"><path d="M-17 8 Q-17 -12 0 -12 Q17 -12 17 8 Z" fill="#d8ccef" stroke="#1a1026" stroke-width="1.6"/><circle cy="-14" r="2.6" fill="#b48cff" stroke="#1a1026" stroke-width="1.4"/><rect x="-21" y="7" width="42" height="4" rx="2" fill="#b48cff" stroke="#1a1026" stroke-width="1.4"/><text y="3" text-anchor="middle" font-size="14" font-weight="700" fill="#7a3cf0">?</text></svg>
        <div><h4>${esc(TEXTES.livreTexte.secretTitre)}</h4><p class="e5-note">${esc(TEXTES.livreTexte.secret)}</p></div>
      </article>`;
    }
    return `
      <article class="e5-recette">
        <svg class="e5-plat" viewBox="-24 -24 48 48" aria-hidden="true">${D.PLATS[r.plat]({ vapeur: false })}</svg>
        <div>
          <h4>${esc(r.nom)}</h4>
          <div class="e5-ings">${puces(new Map(Object.entries(r.ingredients)))}</div>
          <p class="e5-note">${esc(TEXTES.livreTexte.cuisson(r.cuisson))}</p>
        </div>
      </article>`;
  }

  // Le livre en lecture : commandes en cours et toutes les recettes.
  function livreConsultation() {
    const enCours = commandes.filter((c) => c.etat === 'assise');
    const corps = `
      ${enCours.length ? `<section class="e5-section"><h3>${esc(TEXTES.livreTexte.commandes)}</h3>${enCours.map((c) => demandeHtml(c)).join('')}</section>` : ''}
      <section class="e5-section"><h3>${esc(TEXTES.livreTexte.recettes)}</h3>
        <div class="e5-recettes">${Object.keys(RECETTES).map(recetteHtml).join('')}</div>
      </section>`;
    return fenetre({ titre: TEXTES.livreTexte.titre, couleur: '#a86f3f', genre: 'livre', classe: 'e5-livre', corps }).resultat;
  }

  // Le livre au fourneau : choisir la commande et remplir la casserole.
  // Renvoie { action: 'cuisiner' | 'marche', cmd, extra } ou null (fermé).
  function livreCuisine(pretes, choisie) {
    let cmd = pretes.includes(choisie) ? choisie : pretes[0];
    let alerte = '';
    let marcheConseille = false;
    const f = fenetre({
      titre: TEXTES.livreTexte.titre,
      couleur: '#a86f3f',
      genre: 'cuisine',
      classe: 'e5-livre e5-cuisine',
      pied: `
        <button type="button" class="e5-bouton" data-e5="livre-marche">${esc(TEXTES.boutons.marche)}</button>
        <button type="button" class="e5-bouton e5-principal" data-e5="livre-cuisiner">${esc(TEXTES.boutons.cuisiner)}</button>`,
    });

    function rendre() {
      const haut = f.corps.scrollTop;
      const dispo = ORDRE.filter((k) => nb(k) > 0);
      f.corps.innerHTML = `
        ${pretes.length > 1 ? `
        <div class="e5-onglets" role="tablist" aria-label="${esc(TEXTES.livreTexte.pourQui)}">
          ${pretes.map((c, i) => `<button type="button" role="tab" class="e5-onglet" data-i="${i}" data-e5="onglet-${c.sorte}" aria-selected="${c === cmd}">${visageSvg(c.sorte, 'e5-mini')}<span>${esc(recette(c.recette).nom)}</span></button>`).join('')}
        </div>` : ''}
        ${demandeHtml(cmd, { avecRecette: true })}
        <section class="e5-section">
          <h3>${esc(TEXTES.livreTexte.frigo)}</h3>
          ${dispo.length ? `<p class="e5-note">${esc(TEXTES.livreTexte.toucher)}</p>
          <div class="e5-grille">${dispo.map((k) => {
            const reste = nb(k) - (pot.get(k) || 0);
            return `<button type="button" class="e5-case" data-cle="${k}" data-e5="frigo-${k}" ${reste ? '' : 'disabled'} aria-label="${esc(D.ARTICLES[k].nom)}, ${esc(TEXTES.livreTexte.reste(reste))}">${icone(k)}<b>${reste}</b><span>${esc(D.ARTICLES[k].nom)}</span></button>`;
          }).join('')}</div>` : `<p class="e5-note">${esc(TEXTES.livreTexte.frigoVide)}</p>`}
        </section>
        <div class="e5-plan-travail">
          <p class="e5-alerte" role="status">${esc(alerte)}</p>
          <section class="e5-pot" aria-live="polite">
            <svg class="e5-pot-icone" viewBox="-24 -14 48 30" aria-hidden="true">${D.iconeCasserole()}</svg>
            <div class="e5-pot-contenu">${pot.size
              ? [...pot].map(([k, n]) => `<button type="button" class="e5-ing e5-dans" data-cle="${k}" data-e5="pot-${k}" aria-label="${esc(D.ARTICLES[k].nom)} (${n})">${icone(k)}<span>${esc(D.ARTICLES[k].nom)}</span>${n > 1 ? `<b>×${n}</b>` : ''}</button>`).join('')
              : `<p class="e5-note">${esc(TEXTES.livreTexte.casseroleVide)}</p>`}</div>
          </section>
        </div>`;
      f.corps.scrollTop = haut;
      f.el.querySelector('[data-e5="livre-marche"]').classList.toggle('e5-clignote', marcheConseille);
    }
    rendre();

    const potEl = () => f.corps.querySelector('.e5-pot');
    f.corps.addEventListener('click', (e) => {
      const onglet = e.target.closest('.e5-onglet');
      const caseFrigo = e.target.closest('.e5-case');
      const dans = e.target.closest('.e5-dans');
      if (onglet) {
        cmd = pretes[+onglet.dataset.i];
        alerte = '';
        marcheConseille = false;
        bip('clic', 0.5);
        rendre();
      } else if (caseFrigo && !caseFrigo.disabled) {
        const k = caseFrigo.dataset.cle;
        pot.set(k, (pot.get(k) || 0) + 1);
        alerte = '';
        bip('plouf');
        rendre();
        rebondir(potEl());
        if (DETESTES.includes(k)) direUnInstant(TEXTES.audacieux, 2200);
      } else if (dans) {
        const k = dans.dataset.cle;
        const n = (pot.get(k) || 0) - 1;
        if (n > 0) pot.set(k, n); else pot.delete(k);
        bip('clic', 0.3);
        rendre();
      }
    });

    f.el.querySelector('[data-e5="livre-marche"]').addEventListener('click', () => {
      bip('clic', 0.5);
      f.fermer({ action: 'marche', cmd });
    });
    f.el.querySelector('[data-e5="livre-cuisiner"]').addEventListener('click', () => {
      if (!pot.size) {
        alerte = TEXTES.verif.vide;
        bip('non');
        rendre();
        secouer(potEl());
        return;
      }
      const v = verifier(cmd, pot);
      if (v.ok) {
        bip('clic', 1);
        f.fermer({ action: 'cuisiner', cmd, extra: v.extra });
        return;
      }
      cmd.erreurs = (cmd.erreurs || 0) + 1;
      marcheConseille = false;
      const a = (k) => D.ARTICLES[k];
      if (v.type === 'deteste') alerte = TEXTES.verif.detesteSpecial(a(v.k));
      else if (v.type === 'sans') alerte = TEXTES.rappels[cmd.sorte] || TEXTES.verif.sans(a(v.k));
      else if (v.type === 'intrus') alerte = TEXTES.verif.intrus(a(v.k), recette(cmd.recette));
      else if (v.type === 'trop') alerte = TEXTES.verif.trop(a(v.k));
      else {
        const absents = v.manque.filter(([k, n]) => nb(k) < n).map(([k]) => k);
        if (absents.length) {
          // Au premier essai on laisse chercher ; ensuite on dit ce qui manque.
          alerte = cmd.erreurs >= 2 ? TEXTES.verif.manqueFrigo(listeNoms(absents)) : TEXTES.verif.manqueFrigoFlou;
          marcheConseille = true;
        } else {
          alerte = TEXTES.verif.manque;
        }
      }
      bip('non');
      rendre();
      secouer(potEl());
    });

    return f.resultat;
  }

  /* ------------------------------------------------------------ Le marché */

  let achats = null;                    // ce qui est acheté pendant la sortie en cours
  const commentes = new Set();

  function boutique(e) {
    const corps = `<div class="e5-produits">${e.articles.map((k) => `
      <div class="e5-produit" data-cle="${k}">
        ${icone(k)}
        <p class="e5-produit-nom">${esc(D.ARTICLES[k].nom)}</p>
        <p class="e5-prix">${ICONE_PIECE}<span>${PRIX[k]}</span></p>
        <p class="e5-stock">${esc(TEXTES.boutique.auFrigo)} <b>${nb(k)}</b></p>
        <button type="button" class="e5-acheter" data-e5="acheter-${k}" aria-label="${esc(TEXTES.boutique.acheter)} : ${esc(D.ARTICLES[k].nom)}">${esc(TEXTES.boutique.acheter)}</button>
      </div>`).join('')}</div>`;
    const f = fenetre({ titre: e.nom, couleur: e.couleur, genre: 'boutique', classe: 'e5-boutique', corps });
    f.corps.addEventListener('click', (ev) => {
      const b = ev.target.closest('.e5-acheter');
      if (b) acheter(b.closest('.e5-produit'));
    });
  }

  function acheter(carte) {
    const k = carte.dataset.cle;
    if (pieces < PRIX[k]) {
      ajouterPieces(AVANCE);
      direUnInstant(TEXTES.avance, 3200);
    }
    ajouterPieces(-PRIX[k]);
    frigo.set(k, nb(k) + 1);
    majBadge();
    if (achats) achats.push(k);
    carte.querySelector('.e5-stock b').textContent = String(nb(k));
    bip('piece');
    const icon = carte.querySelector('svg');
    rebondir(icon);
    envolee(D.ARTICLES[k].dessin(), centre(icon), centre(boutonFrigo.querySelector('svg')), { duree: 620, taille: 34 })
      .then(() => rebondir(boutonFrigo));
    if (DETESTES.includes(k) && !commentes.has(k)) {
      commentes.add(k);
      direUnInstant(TEXTES.achatDeteste(D.ARTICLES[k]), 3400);
    }
  }

  for (const e of ETALS) {
    const g = $(`[data-e5="etal-${e.cle}"]`);
    surToucher(g, () => {
      if (vue !== 'marche' || enTransition) return;
      bip('clic', 0.6);
      rebondir(g);
      boutique(e);
    });
  }
  let rentrer = null;                   // le panneau « Café » ramène au café
  surToucher($('[data-e5="vers-cafe"]'), () => {
    if (vue === 'marche' && rentrer) { bip('clic', 0.4); rentrer(); }
  });

  // Ce qui manque au frigo pour les commandes à venir (la recette de base
  // pour les clients pas encore installés).
  function manquePourLaSuite() {
    const total = new Map();
    for (const c of commandes) {
      if (c.etat !== 'dehors' && c.etat !== 'assise') continue;
      const b = c.etat === 'assise' ? besoins(c) : new Map(Object.entries(RECETTES[c.recette].ingredients));
      for (const [k, n] of b) total.set(k, (total.get(k) || 0) + n);
    }
    return [...total].filter(([k, n]) => nb(k) < n).map(([k]) => k);
  }

  async function allerAuMarche() {
    achats = [];
    await changerVue('marche');
    const sortie = achats;
    dormir(22000).then(() => { if (vivant && vue === 'marche' && achats === sortie && !sortie.length) direUnInstant(TEXTES.astuceMarche, 4500); });
    for (;;) {
      await Promise.race([
        dire(TEXTES.marche, [TEXTES.boutons.retour]),
        new Promise((r) => { rentrer = r; }),
      ]);
      rentrer = null;
      fermerFenetre();
      const manque = manquePourLaSuite();
      if (!manque.length) break;
      const choix = await dire(TEXTES.manqueEncore(listeNoms(manque)), [TEXTES.boutons.rester, TEXTES.boutons.rentrer]);
      if (choix === 1) break;
    }
    achats = null;
    await changerVue('cafe');
    if (sortie.length) await rangerCourses(sortie);
  }

  async function rangerCourses(liste) {
    dire(TEXTES.rangement);
    const porteFrigo = $('[data-e5="frigo-porte"]');
    await animer(porteFrigo, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.15)' }], { duree: 300, easing: 'ease-out' });
    const vers = versEcran(L.frigo.x, L.frigo.y);
    const de = centre($('.e5-avatar'));
    const montres = [...new Set(liste)].slice(0, 9);
    await Promise.all(montres.map((k, i) => dormir(i * 110).then(() => envolee(D.ARTICLES[k].dessin(), de, vers, { duree: 600 }))));
    bip('plouf');
    await animer(porteFrigo, [{ transform: 'scaleX(.15)' }, { transform: 'scaleX(1)' }], { duree: 280, easing: 'ease-in' });
  }

  /* ------------------------------------------------------- Porte et café */

  const porte = $('[data-e5="porte"]');
  let porteOuverte = false;
  let porteMinuteur = 0;
  function ouvrirPorte() {
    if (!porteOuverte) {
      porteOuverte = true;
      animer(porte, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.22)' }], { duree: 280, easing: 'ease-out' });
    }
    clearTimeout(porteMinuteur);
    minuteurs.delete(porteMinuteur);
    porteMinuteur = setTimeout(() => {
      porteOuverte = false;
      animer(porte, [{ transform: 'scaleX(.22)' }, { transform: 'scaleX(1)' }], { duree: 340, easing: 'ease-in' });
    }, 1400 / V);
    minuteurs.add(porteMinuteur);
  }

  function ouvrirCafe() {
    $('[data-e5="pancarte"]').textContent = TEXTES.ouvert;
    animer($('.e5-pancarte'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duree: 320, garder: false });
  }

  surToucher($('[data-e5="frigo"]'), () => {
    if (vue === 'cafe' && !fenetreCourante && !enTransition && !outils.hidden) { bip('clic', 0.5); fenetreFrigo(); }
  });

  /* ---------------------------------------------------------- Le fourneau */

  const four = $('[data-e5="fourneau"]');
  const casserole = $('[data-e5="casserole"]');

  const bulleFour = (() => {
    const g = svgEl('g', { class: 'e5-bulle-four' }, calques.bulles);
    g.style.display = 'none';
    g.innerHTML = D.bulleFourneau();
    placer(g, L.bulleFour.x, L.bulleFour.y);
    const pop = g.firstElementChild;
    const q = (s) => g.querySelector(s);
    const [titreB, sous, jauge, barre, minuteur, arc, vitesseB] = ['.e5-bf-titre', '.e5-bf-sous', '.e5-bf-jauge', '.e5-bf-barre', '.e5-bf-minuteur', '.e5-bf-arc', '.e5-bf-vitesse'].map(q);
    vitesseB.setAttribute('aria-label', TEXTES.fourneau.accelerer);
    let vitesse = 1;
    const majVitesse = () => vitesseB.setAttribute('aria-pressed', String(vitesse > 1));
    surToucher(vitesseB, () => {
      vitesse = vitesse > 1 ? 1 : ACCELERATION;
      majVitesse();
      bip(vitesse > 1 ? 'vol' : 'clic', 0.6);
    });
    // « 4:59 », ou « 1:04:59 » au-delà d'une heure.
    const duree = (s) => {
      const t = Math.max(0, Math.ceil(s));
      const h = Math.floor(t / 3600);
      const m = Math.floor((t % 3600) / 60);
      const ss = String(t % 60).padStart(2, '0');
      return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
    };
    function afficher(t, s, { avecJauge = false, avecMinuteur = false } = {}) {
      if (g.style.display === 'none') {
        g.style.display = '';
        pop.classList.remove('e5-pop');
        void pop.getBoundingClientRect();
        pop.classList.add('e5-pop');
      }
      jauge.style.display = avecJauge ? '' : 'none';
      minuteur.style.display = avecMinuteur ? '' : 'none';
      const x = avecMinuteur ? 14 : 0;
      titreB.setAttribute('x', x);
      sous.setAttribute('x', x);
      titreB.textContent = t;
      sous.textContent = s;
    }
    return {
      etape(t, s) {
        afficher(t, s, { avecJauge: true });
        barre.style.transform = 'scaleX(0)';
      },
      remplir(ms) {
        return animer(barre, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duree: ms, easing: 'ease-in-out' });
      },
      // Cuisson en vraies minutes ; le bouton 60x accélère (ou ralentit à
      // nouveau) à tout moment. Chaque plat repart à vitesse normale.
      minuter(minutes, nom) {
        const total = minutes * 60;
        afficher(duree(total), nom, { avecMinuteur: true });
        vitesse = 1;
        majVitesse();
        vitesseB.style.display = '';
        let fait = 0;
        let avant = performance.now();
        return new Promise((resolve) => {
          const pas = (t) => {
            if (!vivant) return;
            fait += ((t - avant) / 1000) * vitesse * V;
            avant = t;
            const p = Math.min(1, fait / total);
            arc.setAttribute('stroke-dashoffset', (69.1 * (1 - p)).toFixed(2));
            titreB.textContent = duree(total - fait);
            if (p < 1) { requestAnimationFrame(pas); return; }
            vitesseB.style.display = 'none';
            if (document.activeElement === vitesseB) vitesseB.blur();
            resolve();
          };
          requestAnimationFrame(pas);
        });
      },
      pret() { afficher(TEXTES.fourneau.pret, TEXTES.fourneau.toucher); },
      cacher() { g.style.display = 'none'; },
    };
  })();

  async function tomber(k, delai) {
    await dormir(delai);
    const g = svgEl('g', {}, calques.volants);
    g.innerHTML = `<g transform="scale(.62)">${D.ARTICLES[k].dessin()}</g>`;
    placer(g, L.casserole.x + (Math.random() - 0.5) * 10, L.casserole.y - 30);
    await aller(g, L.casserole.x, L.casserole.y - 2, 460, 'cubic-bezier(.55,0,1,.45)');
    g.remove();
  }

  const secouerCasserole = () => animer(casserole, [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(0)' }], { duree: 380, garder: false });

  async function geste(type) {
    if (type === 'remuer' || type === 'melanger') {
      const g = svgEl('g', {}, calques.volants);
      g.innerHTML = `<g class="e5-touille">${D.cuillere()}</g>`;
      placer(g, L.casserole.x + 2, L.casserole.y - 2);
      bip('plouf');
      await dormir(900);
      g.remove();
    } else if (type === 'enfourner') {
      four.classList.add('e5-four-chaud');
      bip('feu');
      await dormir(500);
    } else if (type === 'retourner') {
      const g = svgEl('g', {}, calques.volants);
      const crepe = svgEl('g', { class: 'e5-crepe-volante' }, g);
      crepe.innerHTML = '<ellipse rx="13" ry="4.5" fill="#f6cf8c" stroke="#dea457" stroke-width="1.2"/><ellipse cx="-3" cy="-1" rx="2" ry="1" fill="#dea457"/>';
      placer(g, L.casserole.x, L.casserole.y - 4);
      bip('vol');
      await animer(crepe, [
        { transform: 'translateY(0) rotate(0)' },
        { transform: 'translateY(-38px) rotate(200deg)', offset: 0.5 },
        { transform: 'translateY(0) rotate(360deg)' },
      ], { duree: 800, easing: 'ease-in-out', garder: false });
      g.remove();
      bip('plouf');
    } else {
      bip('plouf');
      await secouerCasserole();
    }
  }

  // Le comptoir : chaque plat prêt attend Pipistrelle à sa place.
  const placesComptoir = [L.plateau.x, L.plateau.x - 34, L.plateau.x + 34];
  const occupees = new Set();

  async function platVersComptoir(r, cmd) {
    const x = placesComptoir.find((p) => !occupees.has(p)) ?? L.plateau.x;
    occupees.add(x);
    const g = svgEl('g', {}, calques.volants);
    g.innerHTML = D.PLATS[r.plat]({ vapeur: false });
    if (r.four) placer(g, 126, 188); else placer(g, L.casserole.x, L.casserole.y - 6);
    await voler(g, x, L.plateau.y, 650, { hauteur: 36 });
    g.remove();
    bip('plouf');
    const pose = svgEl('g', { transform: `translate(${x} ${L.plateau.y})` }, calques.plateau);
    pose.innerHTML = D.PLATS[r.plat]({ vapeur: 'blanc' });
    cmd.surComptoir = { x, g: pose };
  }

  let premiereCuisson = true;
  async function cuisiner(cmd) {
    const r = recette(cmd.recette);
    cmd.etat = 'cuisine';
    const contenu = [...pot].flatMap(([k, n]) => Array(n).fill(k));
    for (const [k, n] of pot) frigo.set(k, nb(k) - n);
    for (const k of [...frigo.keys()]) if (!nb(k)) frigo.delete(k);
    pot.clear();
    majBadge();

    dire(TEXTES.preparation);
    await Promise.all(contenu.map((k, j) => tomber(k, j * 150)));
    bip('plouf');
    secouerCasserole();

    montrer(L.fourneau.x, L.fourneau.y, L.fourneau.r, false);
    for (let i = 0; i < r.gestes.length; i++) {
      bulleFour.etape(TEXTES.gestes[r.gestes[i]], `${TEXTES.fourneau.toucher} (${i + 1}/${r.gestes.length})`);
      await toucher(four);
      bip('clic', (i + 1) / r.gestes.length);
      await Promise.all([geste(r.gestes[i]), bulleFour.remplir(700)]);
    }
    cacherGuide();

    dire(premiereCuisson ? TEXTES.vraiTemps : r.cuit);
    premiereCuisson = false;
    four.classList.add(r.four ? 'e5-four-chaud' : 'e5-feu');
    bip('feu');
    await bulleFour.minuter(r.cuisson, r.nom);
    four.classList.remove('e5-four-chaud', 'e5-feu');
    bip('ding');
    bulleFour.pret();
    montrer(L.fourneau.x, L.fourneau.y, L.fourneau.r, false);
    dire(cmd.special ? TEXTES.pretSpecial : TEXTES.pret);
    await toucher(four);
    cacherGuide();
    bulleFour.cacher();
    bip('clic', 1);
    if (cmd.special) return;
    await platVersComptoir(r, cmd);
    cmd.etat = 'comptoir';
  }

  /* ------------------------------------------------------------ Le service */

  function creerClient({ sorte, table }) {
    const perso = D.PERSONNAGES[sorte];
    const g = svgEl('g', { class: 'e5-client' }, calques.clients);
    g.style.opacity = '0';
    const corps = svgEl('g', { class: 'e5-corps' }, g);
    corps.innerHTML = perso.dessin();
    placer(g, L.porte.x, L.porte.y);
    return { g, corps, x: L.tables[table], haut: perso.haut, tete: perso.tete, nom: perso.nom, bulle: null, assiette: null };
  }

  async function marcher(c, points) {
    c.corps.classList.add('e5-marche');
    for (const [x, y] of points) {
      const de = positions.get(c.g);
      const d = Math.hypot(x - de.x, y - de.y);
      if (d > 1) await aller(c.g, x, y, (d / VITESSE_MARCHE) * 1000, 'linear');
    }
    c.corps.classList.remove('e5-marche');
  }

  function bulleDeCommande(x, y, plat) {
    const g = svgEl('g', { role: 'button', tabindex: '0' }, calques.bulles);
    g.innerHTML = `<g class="e5-pop">${D.bulleCommande(D.PLATS[plat]({ vapeur: 'lilas' }))}</g>`;
    placer(g, x, y);
    return g;
  }

  // Toucher un client installé (ou sa bulle) : Pipistrelle répète sa commande.
  function rendreBavard(cmd, ...cibles) {
    const f = () => {
      if (cmd.etat !== 'assise' && cmd.etat !== 'cuisine') return;
      bip('clic', 0.6);
      direUnInstant(`${nomClient(cmd)} : « ${TEXTES.commandes[cmd.sorte]} »`, 4200);
    };
    for (const c of cibles) {
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.setAttribute('aria-label', nomClient(cmd));
      c.classList.add('e5-bavard');
      surToucher(c, f);
    }
  }

  async function entrer(cmd) {
    const c = cmd.client;
    ouvrirPorte();
    bip('sonnette');
    animer(c.g, [{ opacity: 0 }, { opacity: 1 }], { duree: 350 });
    await marcher(c, [[L.porte.x, L.couloir], [c.x, L.couloir], [c.x, L.assis]]);
    c.bulle = bulleDeCommande(c.x, L.assis + c.haut - 4, RECETTES[cmd.recette].plat);
    rendreBavard(cmd, c.g, c.bulle);
    bip('clic', 0.5);
  }

  // Pipistrelle va chercher le plat au comptoir et le pose devant le client.
  // Renvoie une promesse tenue quand le plat est sur la table.
  function servir(cmd) {
    const c = cmd.client;
    const plat = RECETTES[cmd.recette].plat;
    let poser;
    const surTable = new Promise((r) => { poser = r; });
    pipiLibre = pipiLibre.then(async () => {
      direUnInstant(TEXTES.service, 1800);
      pipi.classList.add('e5-vole');
      const { x, g } = cmd.surComptoir;
      await voler(pipi, x, L.plateau.y - 34, 650, { hauteur: 16 });
      g.remove();
      occupees.delete(x);
      pipiPlat.innerHTML = D.PLATS[plat]({ vapeur: false });
      bip('clic', 0.7);
      await voler(pipi, c.x + 26, L.assis - 44, 900, { hauteur: 34 });
      pipiPlat.replaceChildren();
      const a = svgEl('g', {}, calques.tables);
      a.innerHTML = `<g class="e5-pose e5-pop">${D.PLATS[plat]()}</g>`;
      placer(a, c.x + 2, L.assis - 9);
      c.assiette = a;
      if (c.bulle) { c.bulle.remove(); c.bulle = null; }
      cmd.etat = 'servie';
      bip('plouf');
      poser();
      await voler(pipi, L.pipi.x, L.pipi.y, 850, { hauteur: 26 });
      pipi.classList.remove('e5-vole');
    });
    return surTable;
  }

  const ramasseurs = new Set();
  function poserPieces(x, y, n) {
    const g = svgEl('g', { class: 'e5-pieces-table', role: 'button', tabindex: '0', 'aria-label': `${TEXTES.ramasser} (${n})`, 'data-e5': 'piece' }, calques.tables);
    g.innerHTML = `<circle r="22" fill="transparent"/><g class="e5-pop">${D.piece()}</g>`;
    placer(g, x, y);
    bip('piece');
    const ramasser = () => {
      if (!ramasseurs.has(ramasser)) return;
      ramasseurs.delete(ramasser);
      const de = versEcran(x, y);
      g.remove();
      envolee(D.pieceSeule(), de, centre(bourse.querySelector('svg')), { taille: 28, boite: '-12 -12 24 24', duree: 600 })
        .then(() => { ajouterPieces(n); bip('piece'); });
    };
    ramasseurs.add(ramasser);
    surToucher(g, ramasser);
  }
  const toutRamasser = () => [...ramasseurs].forEach((f) => f());

  // Le client goûte un plat qui contient un aliment détesté.
  async function degouter(c, yPieds, texteBulle) {
    bip('beurk');
    c.corps.classList.add('e5-beurk');
    const effet = svgEl('g', {}, calques.bulles);
    effet.innerHTML = `<g class="e5-pop">${D.degout()}</g>`;
    placer(effet, c.x, yPieds + c.tete);
    const bulle = svgEl('g', { 'data-e5': 'reaction' }, calques.bulles);
    bulle.innerHTML = `<g class="e5-pop">${D.bulleReaction(texteBulle)}</g>`;
    placer(bulle, c.x, yPieds + c.haut - 4);
    await dormir(2100);
    effet.remove();
    bulle.remove();
    c.corps.classList.remove('e5-beurk');
  }

  let rangBeurk = 0;
  async function mangerEtPartir(c, extra) {
    await dormir(350);
    if (extra) {
      const rang = rangBeurk++;
      await animer(c.assiette.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(.8)' }], { duree: 450 });
      const phrase = TEXTES.reaction[Math.min(rang, TEXTES.reaction.length - 1)];
      direUnInstant(phrase(c.nom, D.ARTICLES[extra].defini), 3800);
      await degouter(c, L.assis, TEXTES.reactions[rang % TEXTES.reactions.length]);
      c.assiette.remove();
      poserPieces(c.x - 24, L.assis - 5, PAIEMENT_BEURK);
    } else {
      const p = versEcran(c.x, L.assis + c.haut + 8);
      coeurs(p.x, p.y, 4);
      bip('miam');
      c.corps.classList.add('e5-content');
      await animer(c.assiette.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(0)' }], { duree: 2200, easing: 'ease-in' });
      c.assiette.remove();
      c.corps.classList.remove('e5-content');
      poserPieces(c.x - 24, L.assis - 5, PAIEMENT);
    }
    await dormir(400);
    await marcher(c, [[c.x, L.couloir], [L.porte.x, L.couloir], [L.porte.x, L.porte.y]]);
    ouvrirPorte();
    await animer(c.g, [{ opacity: 1 }, { opacity: 0 }], { duree: 320 });
    c.g.remove();
  }

  // Attendre qu'un client s'installe.
  const attentes = [];
  const prevenir = () => attentes.splice(0).forEach((r) => r());
  const unClientSInstalle = () => new Promise((r) => attentes.push(r));

  function lancerArrivees(cmds) {
    return (async () => {
      for (let i = 0; i < cmds.length; i++) {
        await dormir(ARRIVEES[i] ?? 3000);
        await enCafe();
        await entrer(cmds[i]);
        cmds[i].etat = 'assise';
        prevenir();
      }
    })();
  }

  // La boucle du service : toucher le fourneau, choisir la commande, remplir
  // la casserole, cuisiner ; Pipistrelle sert pendant qu'on continue.
  async function service(cmds, { premierTexte, texte }) {
    const enFond = [];
    let choisie = null;
    let rouvrir = false;
    let premier = true;
    for (;;) {
      if (!cmds.some((c) => c.etat === 'dehors' || c.etat === 'assise')) break;
      const pretes = cmds.filter((c) => c.etat === 'assise');
      if (!pretes.length) {
        dire(TEXTES.attenteClient);
        await unClientSInstalle();
        continue;
      }
      if (!rouvrir) {
        dire(premier ? premierTexte : texte);
        montrer(L.fourneau.x, L.fourneau.y, L.fourneau.r, false);
        await toucher(four);
        cacherGuide();
        bip('clic', 0.5);
      }
      rouvrir = false;
      const res = await livreCuisine(pretes, choisie);
      if (!res) continue;
      choisie = res.cmd;
      if (res.action === 'marche') {
        await allerAuMarche();
        rouvrir = true;
        continue;
      }
      premier = false;
      choisie = null;
      await cuisiner(res.cmd);
      const cmd = res.cmd;
      if (cmd.special) {
        cmd.objets = await fete(cmd);
        cmd.etat = 'partie';
        continue;
      }
      enFond.push(servir(cmd).then(async () => {
        await mangerEtPartir(cmd.client, res.extra);
        cmd.etat = 'partie';
      }));
    }
    await Promise.all(enFond);
  }

  /* ------------------------------------------------------ Le client spécial */

  async function entreeSpeciale() {
    const g = svgEl('g', { class: 'e5-client' }, calques.clients);
    g.style.opacity = '0';
    const corps = svgEl('g', { class: 'e5-flotte' }, g);
    corps.innerHTML = D.machaon();
    const ailes = corps.querySelector('.e5-ailes-machaon');
    placer(g, L.porte.x, L.porte.y - 40);
    ouvrirPorte();
    bip('sonnette');
    ailes.classList.add('e5-vite');
    animer(g, [{ opacity: 0 }, { opacity: 1 }], { duree: 400 });
    await voler(g, L.tables[1], L.perchoir, 2800, { hauteur: 50, ondule: 12 });
    ailes.classList.remove('e5-vite');
    const c = { g, corps, ailes, x: L.tables[1], haut: D.MACHAON.haut, tete: D.MACHAON.tete, nom: D.MACHAON.nom, bulle: null, assiette: null };
    c.bulle = bulleDeCommande(c.x, L.perchoir - 52, 'gateau');
    bip('clic', 0.8);
    return c;
  }

  function objetSurTable(dessin, x, y, nom, etiquette, parent = calques.tables) {
    const g = svgEl('g', { role: 'button', tabindex: '0', 'aria-label': etiquette, 'data-e5': nom }, parent);
    g.innerHTML = `<circle r="20" fill="transparent"/><g class="e5-pop">${dessin}</g>`;
    placer(g, x, y);
    return g;
  }

  /* ------------------------------------------------ La fête d'anniversaire */

  // Le gâteau du machaon était pour elle : lumières tamisées, bougies, la
  // chanson, les clients qui reviennent ; elle souffle, puis le machaon
  // dépose le mot et le cadeau.
  async function fete(cmd) {
    const T = TEXTES.fete;
    const sp = cmd.client;
    if (sp.bulle) { sp.bulle.remove(); sp.bulle = null; }
    const C = { x: 200, y: 434 };   // pied du présentoir

    const calque = svgEl('g', { class: 'e5-fete' }, vues.cafe);
    const nuit = svgEl('rect', { x: -1400, y: -1400, width: 3200, height: 3360, fill: '#140a24' }, calque);
    nuit.style.opacity = '0';
    const lueur = svgEl('ellipse', { cx: C.x, cy: C.y - 130, rx: 240, ry: 210, fill: 'url(#e5-lueur-fete)' }, calque);
    lueur.style.opacity = '0';
    const invites = svgEl('g', {}, calque);
    const support = svgEl('g', {}, calque);
    const gateau = svgEl('g', { class: 'e5-gateau-fete', 'data-e5': 'gateau-fete', 'aria-label': T.ariaGateau }, support);
    gateau.innerHTML = D.gateauFete(T.age, TEXTES.connexion.pseudoValeur);
    const bougies = [...gateau.querySelectorAll('.e5-bougie')];
    for (const b of bougies) b.style.opacity = '0';
    const banniere = svgEl('g', { class: 'e5-banniere' }, calque);
    banniere.style.display = 'none';
    banniere.innerHTML = T.banniere.map((l, i) => `<text x="${C.x}" y="${204 + i * 42}" text-anchor="middle" font-size="${i ? 38 : 26}" font-weight="700" fill="#fff4c2" stroke="#4a1fa8" stroke-width="6" stroke-linejoin="round" paint-order="stroke">${esc(l)}</text>`).join('');
    calque.append(sp.g, pipi);

    // Le gâteau sort du four et vient au centre, en grand.
    dire(T.attends);
    placer(support, L.fourneau.x, 210);
    await Promise.all([
      animer(nuit, [{ opacity: 0 }, { opacity: 0.64 }], { duree: 1000 }),
      aller(support, C.x, C.y, 1200, 'cubic-bezier(.3,.8,.3,1)'),
      animer(gateau, [{ transform: 'scale(.18)' }, { transform: 'scale(1)' }], { duree: 1200, easing: 'cubic-bezier(.3,.8,.3,1)' }),
    ]);
    sp.ailes.classList.add('e5-vite');
    await voler(sp.g, 342, 292, 1300, { hauteur: 30, ondule: 8 });
    sp.ailes.classList.remove('e5-vite');
    await dire(T.surprise, [T.pourMoi]);

    // Les bougies, puis Pipistrelle les allume.
    for (const b of bougies) {
      bip('poc');
      animer(b, [{ opacity: 0, transform: 'translateY(-16px)' }, { opacity: 1, transform: 'none' }], { duree: 320, easing: 'cubic-bezier(.3,1.4,.5,1)' });
      await dormir(320);
    }
    dire(T.allumer);
    pipi.classList.add('e5-vole');
    for (const b of bougies) {
      const flamme = b.querySelector('.e5-flamme-bougie');
      const bb = b.getBBox();
      await voler(pipi, C.x + bb.x + bb.width / 2 + 26, C.y + bb.y + 16, 520, { hauteur: 16 });
      flamme.style.display = '';
      bip('allume');
      const e = centre(flamme);
      if (vivant) fx.etincelles(e.x, e.y, 8, '#ffd27a', 60);
      await dormir(200);
    }
    await voler(pipi, 82, 262, 700, { hauteur: 20 });
    pipi.classList.remove('e5-vole');
    animer(lueur, [{ opacity: 0 }, { opacity: 1 }], { duree: 900 });

    // Les clients du soir reviennent pour la fête.
    for (const [sorte, x, y] of [['herisson', 62, 512], ['grenouille', 124, 532], ['loutre', 338, 512]]) {
      const g = svgEl('g', {}, invites);
      g.innerHTML = `<g class="e5-invite">${D.PERSONNAGES[sorte].dessin()}</g>`;
      placer(g, x, y);
      bip('poc');
      animer(g.firstElementChild, [{ opacity: 0, transform: 'translateY(18px) scale(.7)' }, { opacity: 1, transform: 'none' }], { duree: 420, easing: 'cubic-bezier(.3,1.5,.5,1)' });
      await dormir(260);
    }
    banniere.style.display = '';
    animer(banniere, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }], { duree: 520, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    bip('anniversaire');
    dire(T.souffler);

    // Elle souffle les bougies, une flamme par toucher.
    gateau.setAttribute('role', 'button');
    gateau.setAttribute('tabindex', '0');
    await new Promise((resolve) => {
      let restantes = bougies.length;
      surToucher(gateau, (e) => {
        const visee = e.target.closest && e.target.closest('.e5-bougie');
        const b = visee && !visee.dataset.eteinte ? visee : bougies.find((x) => !x.dataset.eteinte);
        if (!b) return;
        b.dataset.eteinte = '1';
        const flamme = b.querySelector('.e5-flamme-bougie');
        flamme.style.display = 'none';
        const fumee = svgEl('path', { class: 'e5-fumee', d: 'M0 -2 C-5 -8 5 -13 0 -19 C-5 -25 4 -30 0 -36', fill: 'none', stroke: '#e6dcf7', 'stroke-width': '2.6', 'stroke-linecap': 'round' }, flamme.parentNode);
        dormir(1600).then(() => fumee.remove());
        bip('souffle');
        restantes -= 1;
        lueur.style.opacity = String(restantes / bougies.length);
        if (!restantes) resolve();
      });
    });
    gateau.removeAttribute('tabindex');

    // Bravo : la lumière revient, tout le monde saute de joie.
    await dormir(500);
    bip('chiffre');
    const c = centre(gateau);
    coeurs(c.x, c.y - 30, 20);
    if (vivant) fx.etincelles(c.x, c.y - 60, 24, '#d7b3ff', 170);
    animer(nuit, [{ opacity: 0.64 }, { opacity: 0 }], { duree: 1200 });
    for (const g of invites.children) {
      animer(g.firstElementChild, [{ transform: 'none' }, { transform: 'translateY(-14px)' }, { transform: 'none' }, { transform: 'translateY(-9px)' }, { transform: 'none' }], { duree: 900, easing: 'ease-out', garder: false });
    }
    dire(T.bravo);
    await dormir(1500);

    // Le machaon dépose l'enveloppe et le cadeau sur le présentoir.
    const E = { x: C.x - 66, y: C.y + 12 };
    const K = { x: C.x + 68, y: C.y + 8 };
    sp.ailes.classList.add('e5-vite');
    await voler(sp.g, E.x, E.y - 34, 1100, { hauteur: 24, ondule: 6 });
    const enveloppe = objetSurTable(D.enveloppe(), E.x, E.y, 'enveloppe', TEXTES.ariaEnveloppe, calque);
    bip('papier');
    await voler(sp.g, K.x, K.y - 38, 800, { hauteur: 18, ondule: 6 });
    const cadeau = objetSurTable(D.cadeau(), K.x, K.y, 'cadeau', TEXTES.ariaCadeau, calque);
    bip('chiffre');
    const q = versEcran(K.x, K.y - 8);
    if (vivant) fx.etincelles(q.x, q.y, 16, '#d7b3ff', 140);
    await voler(sp.g, 342, 292, 1100, { hauteur: 30, ondule: 8 });
    sp.ailes.classList.remove('e5-vite');
    calque.append(sp.g, pipi);
    return { enveloppe, cadeau, x: E.x, y: E.y };
  }

  /* ------------------------------------------------- Le mot et le cadeau */

  function finale() {
    return new Promise((resolve) => {
      const T = TEXTES;
      const f = document.createElement('div');
      f.className = 'e5-finale';
      f.setAttribute('role', 'dialog');
      f.setAttribute('aria-modal', 'true');
      f.setAttribute('aria-label', T.lettre.titre);
      f.innerHTML = `
        <div class="e5-feuille">
          <article class="e5-lettre">
            <h2>${esc(T.lettre.titre)}</h2>
            ${T.lettre.paragraphes.map((p) => `<p>${esc(p)}</p>`).join('')}
            <p class="e5-signature">${esc(T.lettre.signature)}</p>
          </article>
          <section class="e5-surprise" hidden>
            <svg class="e5-boite" viewBox="-36 -50 72 76" aria-hidden="true"><g transform="scale(2)">${D.cadeau()}</g></svg>
            <h2>${esc(T.cadeau.titre)}</h2>
            ${T.cadeau.lignes.map((p) => `<p>${esc(p)}</p>`).join('')}
          </section>
        </div>
        <div class="e5-finale-boutons">
          <button type="button" class="e5-fermer">${esc(T.boutons.fermer)}</button>
          <button type="button" class="e5-bascule e5-principal">${esc(T.boutons.ouvrirCadeau)}</button>
        </div>`;
      racine.append(f);
      const feuille = f.querySelector('.e5-feuille');
      const lettre = f.querySelector('.e5-lettre');
      const surprise = f.querySelector('.e5-surprise');
      const boite = f.querySelector('.e5-boite');
      const bascule = f.querySelector('.e5-bascule');
      animer(f, [{ opacity: 0 }, { opacity: 1 }], { duree: 300 });
      animer(feuille, [{ transform: 'translateY(18px) rotate(-1deg) scale(.96)' }, { transform: 'translateY(0) rotate(-1deg) scale(1)' }], { duree: 420, easing: 'cubic-bezier(.2,.9,.3,1.1)', garder: false });
      let surCadeau = false;
      let ouvert = false;
      bascule.addEventListener('click', () => {
        surCadeau = !surCadeau;
        lettre.hidden = surCadeau;
        surprise.hidden = !surCadeau;
        bascule.textContent = surCadeau ? T.boutons.relireMot : T.boutons.ouvrirCadeau;
        feuille.scrollTop = 0;
        if (surCadeau && !ouvert) {
          ouvert = true;
          bip('sortie');
          requestAnimationFrame(() => {
            boite.classList.add('e5-ouverte');
            const c = centre(boite);
            coeurs(c.x, c.y, 16);
          });
        }
      });
      let ferme = false;
      const fermer = async () => {
        if (ferme) return;
        ferme = true;
        await animer(f, [{ opacity: 1 }, { opacity: 0 }], { duree: 250 });
        f.remove();
        resolve();
      };
      f.querySelector('.e5-fermer').addEventListener('click', fermer);
      f.addEventListener('keydown', (e) => { if (e.key === 'Escape') fermer(); });
      bascule.focus({ preventScroll: true });
    });
  }

  /* ------------------------------------------------------------ Connexion */

  async function chargement(carte) {
    carte.innerHTML = `
      <p class="e5-charge-texte">${esc(TEXTES.connexion.chargement)}</p>
      <div class="e5-barre"><div></div></div>
      <p class="e5-pourcent">0 %</p>`;
    const barre = carte.querySelector('.e5-barre div');
    const pourcent = carte.querySelector('.e5-pourcent');
    const total = 1600 / V;
    const debut = performance.now();
    await new Promise((r) => {
      const pas = (t) => {
        if (!vivant) return;
        const p = Math.min(1, (t - debut) / total);
        const avance = p < 0.6 ? p * 1.2 : 0.72 + (p - 0.6) * 0.7;   // ralentit sur la fin
        const n = Math.round(Math.min(1, avance) * 100);
        barre.style.width = `${n}%`;
        pourcent.textContent = `${n} %`;
        if (p < 1) requestAnimationFrame(pas); else r();
      };
      requestAnimationFrame(pas);
    });
    await dormir(250);
  }

  function connexion() {
    const ecran = $('.e5-login');
    const carte = $('.e5-carte');
    const champ = $('.e5-mdp');
    const erreur = $('.e5-erreur');
    const oubli = $('.e5-oubli');
    const indice = $('.e5-indice');
    let echecs = 0;
    const majIndice = () => {
      const n = Math.max(0, echecs - 3);   // à partir du 4e échec, un chiffre de plus par échec
      const pouce = n ? ` ${TEXTES.connexion.coupDePouce} ${CODE.map((c, i) => (i < n ? c : '_')).join(' ')}` : '';
      indice.textContent = TEXTES.connexion.indice + pouce;
    };
    champ.addEventListener('input', () => {
      champ.value = champ.value.replace(/\D/g, '').slice(0, 4);
      erreur.textContent = '';
    });
    oubli.addEventListener('click', () => {
      majIndice();
      indice.hidden = false;
      oubli.hidden = true;
    });
    return new Promise((resolve) => {
      carte.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (carte.dataset.ok) return;
        if (champ.value === CODE.join('')) {
          carte.dataset.ok = '1';
          bip('chiffre');
          champ.blur();
          await chargement(carte);
          await animer(ecran, [{ opacity: 1 }, { opacity: 0 }], { duree: 450 });
          ecran.remove();
          resolve();
          return;
        }
        echecs++;
        bip('non');
        erreur.textContent = TEXTES.connexion.erreur;
        secouer(carte);
        if (echecs >= 2 && indice.hidden) oubli.hidden = false;
        if (echecs >= 4) {
          majIndice();
          indice.hidden = false;
          oubli.hidden = true;
        }
        champ.select();
      });
    });
  }

  /* ------------------------------------------------------------- La partie */

  async function scenario() {
    await connexion();

    if (memoire.lire('cafe-fini', false)) {
      for (;;) {
        const choix = await dire(TEXTES.retour, [TEXTES.boutons.relire, TEXTES.boutons.rejouer]);
        if (choix === 1) break;
        await finale();
      }
    }

    await dire(TEXTES.intro, [TEXTES.boutons.intro]);
    outils.hidden = false;
    await dire(TEXTES.livre, [TEXTES.boutons.voirLivre]);
    await livreConsultation();
    await dire(TEXTES.versMarche, [TEXTES.boutons.marche]);

    commandes = CLIENTS.map((c) => ({ ...c, etat: 'dehors', erreurs: 0, client: creerClient(c) }));
    await allerAuMarche();
    ouvrirCafe();
    dire(TEXTES.ouverture);
    const arrivees = lancerArrivees(commandes);
    await service(commandes, { premierTexte: TEXTES.premiereCommande, texte: TEXTES.commandeSuivante });
    await arrivees;
    await pipiLibre;
    await dormir(500);
    toutRamasser();
    dire(TEXTES.calme);
    await dormir(1800);

    // Le client très spécial.
    const special = await entreeSpeciale();
    secrets.add('gateau');
    const cmdSpeciale = { sorte: 'machaon', recette: 'gateau', special: true, etat: 'assise', erreurs: 0, client: special };
    commandes = [cmdSpeciale];
    rendreBavard(cmdSpeciale, special.g, special.bulle);
    bip('eclat');
    await service(commandes, { premierTexte: TEXTES.special, texte: TEXTES.commandeSpeciale });
    const { enveloppe, cadeau, x, y } = cmdSpeciale.objets;
    dire(TEXTES.fete.objets);
    montrer(x, y, 24, true);
    await toucher(enveloppe, cadeau);
    cacherGuide();
    bip('papier');
    memoire.ecrire('cafe-fini', true);
    await finale();
    for (;;) {
      await dire(TEXTES.fin, [TEXTES.boutons.relire]);
      await finale();
    }
  }

  scenario().catch((e) => { if (vivant) console.error(e); });
  if (debug !== null) {
    window.__e5 = {
      get pieces() { return pieces; },
      get frigo() { return Object.fromEntries(frigo); },
      get pot() { return Object.fromEntries(pot); },
      get commandes() { return commandes.map((c) => ({ sorte: c.sorte, etat: c.etat, erreurs: c.erreurs })); },
      get vue() { return vue; },
      besoins: (sorte) => Object.fromEntries(besoins(commandes.find((c) => c.sorte === sorte))),
    };
  }

  return () => {
    vivant = false;
    for (const id of minuteurs) clearTimeout(id);
    observateur.disconnect();
    delete window.__e5;
  };
}

export default {
  fond: 'clair',
  ambiance: 'sons/etape-5.mp3',
  demarrer,
};
