// Étape 5 — le café de Cyriel.
//
// Un petit jeu de café, en hommage à celui qu'elle adorait :
//   1. connexion : le mot de passe est le code à 4 chiffres trouvé en chemin ;
//   2. le livre de recettes dit quoi acheter ; au marché, on touche un étal
//      pour ouvrir sa vitrine et acheter à l'unité (tout va au frigo) ;
//   3. les clients s'installent et commandent, chacun avec son exigence
//      (« double chocolat », « sans sucre »…) ;
//   4. au fourneau, le livre s'ouvre : on choisit la commande, on met dans la
//      casserole les bons ingrédients du frigo, puis on prépare et on cuit.
//      Il y a trois fourneaux : pendant qu'un plat cuit, on en lance un autre
//      (chacun a sa carte en bas de l'écran, avec son minuteur et son 60x) ;
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
// Pour les essais :  ?etape=6&debug=vite  (tout va 4 fois plus vite).

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
  // fontaine, Chachoux qui se promène, Estel sur le banc, Gaston et Bichette
  // (visibles seulement sur écran large), puis Angelounette et Rachou.
  joueurs: ['Clément', 'Xx-Chachoux-xX', 'Estelou du Luxou', 'Gaston_du_43', 'Bichette', 'Angelounette', 'Rachou'],

  connexion: {
    pseudo: 'Pseudo',
    pseudoValeur: 'Cyriel',
    motDePasse: 'Mot de passe',
    jouer: 'Jouer',
    erreur: 'Mauvais mot de passe.',
    oubli: 'Mot de passe oublié ?',
    indice: '4 chiffres violets qui apparaissent dans le jeu.',
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
  premiereCommande: 'Un client s’est installé ! Touche un fourneau : le livre de recettes te dira ce qu’il veut.',
  commandeSuivante: 'Touche un fourneau libre pour préparer une autre commande.',
  enParallele: 'Pendant que ça cuit, lance la commande suivante sur un autre fourneau : tu en as trois !',
  cuissonEnCours: 'Ça cuit… En bas, le bouton jaune 60x accélère chaque plat.',
  rienAPreparer: 'Aucune autre commande pour l’instant.',
  astuce60x: 'Pour aller plus vite : le bouton jaune 60x, en bas.',
  attenteClient: 'On attend le prochain client…',
  preparation: 'Tout est dans la casserole. Au travail !',
  vraiTemps: 'Comme dans le vrai jeu, la cuisson prend du vrai temps ! Pour ne pas attendre, touche le bouton jaune 60x, en bas.',
  pret: (n) => `C’est prêt sur le fourneau ${n} ! Touche-le pour poser le plat sur le comptoir.`,
  pretSpecial: (n) => `Le gâteau est prêt sur le fourneau ${n} ! Touche-le pour le sortir du four.`,
  service: 'Je l’apporte !',
  calme: 'Ouf, tout le monde est servi.',
  special: 'Oh ! Un client très spécial… Il commande la spécialité de la maison. Sa recette vient d’apparaître dans le livre !',
  commandeSpeciale: 'Touche un fourneau pour préparer la spécialité.',

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
    portions: 'Portions : 1',
    pret: (min) => `Prête en : ${min} min`,
    parPortion: (n) => `${n} par portion`,
    inconnu: 'Prête en : ???',
    commande: 'La commande',
    totalFrigo: (n) => `Au frigo : <b>${n}</b>`,
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
  // Les cartes des trois fourneaux, en bas de l'écran.
  feux: {
    nom: (n) => `Fourneau ${n}`,
    libre: 'Libre',
    aToi: 'À toi !',
    pret: 'Prêt !',
    auMarche: 'Les fourneaux t’attendent au café : rentre pour cuisiner.',
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

// Les sons de fond du café (dans sons/) et leur volume (1 = normal) : le
// piano de la salle, doucement, et les oiseaux et la fontaine du marché.
const SONS = {
  salle: { fichier: 'sons/cafe-salle.mp3', volume: 0.14 },
  marche: { fichier: 'sons/cafe-marche.mp3', volume: 1 },
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
const ICONE_FRIGO = `<svg viewBox="-12 -12 24 24" aria-hidden="true">${D.iconeFrigo()}</svg>`;
const ICONE_PANIER = `<svg viewBox="-12 -12 24 24" aria-hidden="true"><path d="M-9 -6 H-6 L-3.6 4 H6.4 L8.6 -3.4 H-5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-2" cy="7.6" r="1.8" fill="#fff"/><circle cx="5" cy="7.6" r="1.8" fill="#fff"/></svg>`;

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
      <div class="e5-feux" hidden>${[0, 1, 2].map((k) => `
        <div class="e5-feu-carte" data-k="${k}" data-etat="libre">
          <button type="button" class="e5-feu-bouton" data-e5="feu-${k}">
            <svg class="e5-feu-icone" viewBox="-24 -24 48 48" aria-hidden="true"></svg>
            <span class="e5-feu-texte"></span>
          </button>
          <span class="e5-feu-num" aria-hidden="true">${k + 1}</span>
          <button type="button" class="e5-feu-vite" data-e5="vitesse-${k}" aria-pressed="false" hidden>
            <svg viewBox="0 0 16 12" aria-hidden="true"><path d="M1 1 L7.5 6 L1 11 Z M8.5 1 L15 6 L8.5 11 Z"/></svg><span>60x</span>
          </button>
          <span class="e5-feu-barre" aria-hidden="true"><span></span></span>
        </div>`).join('')}
      </div>
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
  // Le son de fond : 'salle', 'marche' ou null (silence).
  const ambiance = (nom) => { if (vivant) son.ambiance(nom ? SONS[nom].fichier : null, nom ? SONS[nom].volume : 1); };

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
  // Chaque vue a son cadre (la salle du café, la place du marché) : il tient
  // toujours en entier à l'écran, le décor déborde autour.
  const CADRES = { cafe: D.CADRE_CAFE, marche: { x: 0, y: 0, l: D.LARGEUR, h: D.HAUTEUR } };
  let cadreCourant = CADRES.cafe;
  function cadrer() {
    const l = zone.clientWidth;
    const h = zone.clientHeight;
    if (!l || !h) return;
    const c = cadreCourant;
    const k = Math.min(l / c.l, h / c.h);
    const vl = l / k;
    const vh = h / k;
    svg.setAttribute('viewBox', `${(c.x + (c.l - vl) / 2).toFixed(1)} ${(c.y + (c.h - vh) / 2).toFixed(1)} ${vl.toFixed(1)} ${vh.toFixed(1)}`);
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
  let ephemereActif = false;

  // Pipistrelle parle ; avec des choix, renvoie l'indice du bouton touché.
  function dire(t, choix = []) {
    const tour = ++parole;
    texte.textContent = t;
    texteDeFond = t;
    ephemereActif = false;
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
    ephemereActif = true;
    texte.textContent = t;
    dormir(ms).then(() => {
      if (jeton !== ephemere) return;
      ephemereActif = false;
      if (tour === parole) texte.textContent = texteDeFond;
    });
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
  pipi.innerHTML = `<g class="e5-flotte"><g transform="scale(.78)">${D.pipistrelle()}</g></g>`;
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
    cadreCourant = CADRES[nom];
    cadrer();
    vue = nom;
    ambiance(nom === 'marche' ? 'marche' : 'salle');
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
  function fenetre({ titre: t, couleur, genre, classe = '', corps = '', pied = '', sousTitre = '' }) {
    fermerFenetre();
    const f = document.createElement('div');
    f.className = `e5-fenetre ${classe}`;
    f.innerHTML = `
      <div class="e5-cadre" role="dialog" aria-modal="true" aria-label="${esc(t)}" style="--couleur:${couleur}" tabindex="-1">
        <header class="e5-cadre-tete"><div class="e5-titres"><h2>${esc(t)}</h2>${sousTitre ? `<p class="e5-sous-titre">${sousTitre}</p>` : ''}</div><button type="button" class="e5-croix" aria-label="${esc(TEXTES.boutons.fermer)}">×</button></header>
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
    const total = presents.reduce((x, k) => x + nb(k), 0);
    return fenetre({ titre: TEXTES.frigo.titre, couleur: '#4aa3df', genre: 'frigo', classe: 'e5-boutique e5-fen-frigo', corps, sousTitre: TEXTES.livreTexte.totalFrigo(total) });
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
    const aide = avecRecette && cmd.erreurs >= 2
      ? `<div class="e5-aide"><span>${esc(TEXTES.verif.aide)}</span><div class="e5-ings">${puces(besoins(cmd), { toujours: true })}</div></div>` : '';
    return `
      <section class="e5-demande">
        ${visageSvg(cmd.sorte)}
        <div class="e5-demande-texte">
          <p class="e5-qui">${esc(nomClient(cmd))}</p>
          <p class="e5-citation">« ${esc(TEXTES.commandes[cmd.sorte])} »</p>
          ${aide}
        </div>
      </section>`;
  }

  // Une recette comme dans le livre du jeu : titre, plat, portions, temps,
  // prix, et les ingrédients dans leurs cases.
  function emplacements(map, { min = 4 } = {}) {
    const cases = [...map].map(([k, n]) => `<span class="e5-empl" title="${esc(D.ARTICLES[k].nom)}">${icone(k)}<b>×${n}</b></span>`);
    while (cases.length < min) cases.push('<span class="e5-empl e5-empl-vide"></span>');
    return `<div class="e5-emplacements">${cases.join('')}</div>`;
  }

  function recetteHtml(cle) {
    const r = recette(cle);
    const T = TEXTES.livreTexte;
    if (r.secret && !secrets.has(cle)) {
      return `
      <article class="e5-recette e5-secrete">
        <h4>${esc(T.secretTitre)}</h4>
        <div class="e5-recette-haut">
          <div class="e5-assiette"><svg viewBox="-24 -24 48 48" aria-hidden="true"><path d="M-17 8 Q-17 -12 0 -12 Q17 -12 17 8 Z" fill="#d8ccef" stroke="#1a1026" stroke-width="1.6"/><circle cy="-14" r="2.6" fill="#b48cff" stroke="#1a1026" stroke-width="1.4"/><rect x="-21" y="7" width="42" height="4" rx="2" fill="#b48cff" stroke="#1a1026" stroke-width="1.4"/><text y="3" text-anchor="middle" font-size="14" font-weight="700" fill="#7a3cf0">?</text></svg></div>
          <ul class="e5-infos"><li>${esc(T.portions)}</li><li>${esc(T.inconnu)}</li><li class="e5-note">${esc(T.secret)}</li></ul>
        </div>
        <div class="e5-emplacements">${'<span class="e5-empl e5-empl-vide">?</span>'.repeat(4)}</div>
      </article>`;
    }
    return `
      <article class="e5-recette">
        <h4>${esc(r.nom)}</h4>
        <div class="e5-recette-haut">
          <div class="e5-assiette"><svg viewBox="-24 -24 48 48" aria-hidden="true">${D.PLATS[r.plat]({ vapeur: false })}</svg></div>
          <ul class="e5-infos"><li>${esc(T.portions)}</li><li>${esc(T.pret(r.cuisson))}</li><li class="e5-par-portion">${ICONE_PIECE}<span>${esc(T.parPortion(PAIEMENT))}</span></li></ul>
        </div>
        ${emplacements(new Map(Object.entries(r.ingredients)))}
      </article>`;
  }

  const livreHtml = (gauche, droite) => `<div class="e5-pages"><div class="e5-page e5-page-g">${gauche}</div><div class="e5-page e5-page-d">${droite}</div></div>`;

  // Le livre en lecture : commandes en cours et toutes les recettes.
  function livreConsultation() {
    const enCours = commandes.filter((c) => c.etat === 'assise');
    const [a, b, c2, d] = Object.keys(RECETTES).map(recetteHtml);
    const corps = `${livreHtml(a + b, c2 + d)}
      ${enCours.length ? `<section class="e5-pense-bete"><h3>${esc(TEXTES.livreTexte.commandes)}</h3>${enCours.map((c) => demandeHtml(c)).join('')}</section>` : ''}`;
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
      const hauts = [...f.corps.querySelectorAll('.e5-page')].map((p) => p.scrollTop);
      const dispo = ORDRE.filter((k) => nb(k) > 0);
      const gauche = `
        <h3 class="e5-titre-page">${esc(TEXTES.livreTexte.commande)}</h3>
        ${pretes.length > 1 ? `
        <div class="e5-onglets" role="tablist" aria-label="${esc(TEXTES.livreTexte.pourQui)}">
          ${pretes.map((c, i) => `<button type="button" role="tab" class="e5-onglet" data-i="${i}" data-e5="onglet-${c.sorte}" aria-selected="${c === cmd}">${visageSvg(c.sorte, 'e5-mini')}<span>${esc(recette(c.recette).nom)}</span></button>`).join('')}
        </div>` : ''}
        ${demandeHtml(cmd, { avecRecette: true })}
        ${recetteHtml(cmd.recette)}`;
      const droite = `
        <section class="e5-section">
          <h3 class="e5-titre-page">${esc(TEXTES.livreTexte.frigo)}</h3>
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
      f.corps.innerHTML = livreHtml(gauche, droite);
      f.corps.querySelectorAll('.e5-page').forEach((p, k) => { p.scrollTop = hauts[k] || 0; });
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
        <p class="e5-produit-nom">${esc(D.ARTICLES[k].nom)}</p>
        <div class="e5-assiette">${icone(k)}</div>
        <p class="e5-stock" title="${esc(TEXTES.boutique.auFrigo)}"><b>${nb(k)}</b>${ICONE_FRIGO}</p>
        <div class="e5-achat">
          <p class="e5-prix">${ICONE_PIECE}<span>${PRIX[k]}</span></p>
          <button type="button" class="e5-acheter" data-e5="acheter-${k}" aria-label="${esc(TEXTES.boutique.acheter)} : ${esc(D.ARTICLES[k].nom)}" title="${esc(TEXTES.boutique.acheter)}">${ICONE_PANIER}</button>
        </div>
      </div>`).join('')}</div>`;
    const total = () => [...frigo.values()].reduce((x, y) => x + y, 0);
    const f = fenetre({ titre: e.nom, couleur: e.couleur, genre: 'boutique', classe: 'e5-boutique', corps, sousTitre: TEXTES.livreTexte.totalFrigo(total()) });
    f.majTotal = () => { const b = f.el.querySelector('.e5-sous-titre b'); if (b) b.textContent = String(total()); };
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
    fenetreCourante?.majTotal?.();
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
    plateauFeux.hidden = false;
    $('[data-e5="pancarte"]').textContent = TEXTES.ouvert;
    animer($('.e5-pancarte'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duree: 320, garder: false });
  }

  surToucher($('[data-e5="frigo"]'), () => {
    if (vue === 'cafe' && !fenetreCourante && !enTransition && !outils.hidden) { bip('clic', 0.5); fenetreFrigo(); }
  });

  /* -------------------------------------------------------- Les fourneaux */

  // Trois fourneaux : on lance un plat sur l'un pendant que d'autres cuisent.
  // Chacun a sa carte en bas de l'écran : ce qui cuit, le minuteur, le 60x.
  // Un fourneau est « libre », en « gestes » (on prépare), en « cuisson »,
  // ou « pret » (on touche pour poser le plat sur le comptoir).
  const plateauFeux = $('.e5-feux');
  const feux = L.feux.map((lieu, k) => {
    const el = $(`[data-e5="fourneau-${k}"]`);
    const carte = plateauFeux.querySelector(`[data-k="${k}"]`);
    return {
      k, lieu, el,
      casserole: el.querySelector('.e5-casserole'),
      carte,
      bouton: carte.querySelector('.e5-feu-bouton'),
      vite: carte.querySelector('.e5-feu-vite'),
      icone: carte.querySelector('.e5-feu-icone'),
      texte: carte.querySelector('.e5-feu-texte'),
      barre: carte.querySelector('.e5-feu-barre span'),
      etat: 'libre', cmd: null, r: null, extra: null,
      fait: 0, total: 0, vitesse: 1, signe: null, vu: {},
    };
  });

  // « 4:59 », ou « 1:04:59 » au-delà d'une heure.
  const duree = (s) => {
    const t = Math.max(0, Math.ceil(s));
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const ss = String(t % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
  };

  // Met la carte d'un fourneau à jour (sans retoucher ce qui n'a pas changé).
  function majCarte(f) {
    const T = TEXTES.feux;
    const n = f.k + 1;
    const icone = f.r ? `p-${f.r.plat}` : 'casserole';
    const texte = { libre: T.libre, gestes: T.aToi, cuisson: duree(f.total - f.fait), pret: T.pret }[f.etat];
    const aria = f.etat === 'libre' ? `${T.nom(n)} : ${T.libre}`
      : f.etat === 'cuisson' ? `${T.nom(n)} : ${f.r.nom}, ${texte}`
        : f.etat === 'pret' ? `${T.nom(n)} : ${f.r.nom}, ${T.pret}` : `${T.nom(n)} : ${f.r.nom}`;
    const v = f.vu;
    if (v.etat !== f.etat) { f.carte.dataset.etat = f.etat; v.etat = f.etat; }
    if (v.icone !== icone) {
      // le plat en gros plan ; la casserole vide, un peu plus loin
      f.icone.setAttribute('viewBox', f.r ? '-19 -18 38 34' : '-24 -24 48 48');
      f.icone.innerHTML = f.r ? D.PLATS[f.r.plat]({ vapeur: false }) : `<g transform="translate(0 -1) scale(.9)">${D.iconeCasserole()}</g>`;
      v.icone = icone;
    }
    if (v.texte !== texte) { f.texte.textContent = texte; v.texte = texte; }
    if (v.aria !== aria) { f.bouton.setAttribute('aria-label', aria); v.aria = aria; }
    const vite = f.etat === 'cuisson';
    if (v.vite !== vite) { f.vite.hidden = !vite; v.vite = vite; }
    const presse = String(f.vitesse > 1);
    if (v.presse !== presse) { f.vite.setAttribute('aria-pressed', presse); v.presse = presse; }
    const p = f.etat === 'cuisson' && f.total ? Math.round((f.fait / f.total) * 100) : 0;
    if (v.p !== p) { f.barre.style.width = `${p}%`; v.p = p; }
  }
  feux.forEach(majCarte);

  // Le bouton 60x de chaque fourneau : accélère (ou ralentit) ce plat-là,
  // même depuis le marché. Chaque plat démarre à vitesse normale.
  for (const f of feux) {
    f.vite.setAttribute('aria-label', TEXTES.fourneau.accelerer);
    f.vite.addEventListener('click', () => {
      if (f.etat !== 'cuisson') return;
      f.vitesse = f.vitesse > 1 ? 1 : ACCELERATION;
      bip(f.vitesse > 1 ? 'vol' : 'clic', 0.6);
      majCarte(f);
    });
    // Au marché, les cartes rappellent où sont les fourneaux.
    f.bouton.addEventListener('click', () => { if (vue !== 'cafe') direUnInstant(TEXTES.feux.auMarche, 2600); });
  }

  // Une seule horloge pour tous les plats en cuisson.
  let horloge = 0;
  function lancerHorloge() {
    if (horloge) return;
    let avant = performance.now();
    const pas = (t) => {
      if (!vivant) return;
      const dt = Math.min(0.25, (t - avant) / 1000);
      avant = t;
      let encore = false;
      for (const f of feux) {
        if (f.etat !== 'cuisson') continue;
        f.fait = Math.min(f.total, f.fait + dt * f.vitesse * V);
        if (f.fait >= f.total) platPret(f); else encore = true;
        majCarte(f);
      }
      horloge = encore ? requestAnimationFrame(pas) : 0;
    };
    horloge = requestAnimationFrame(pas);
  }

  // Quelque chose a changé (un client s'installe, un plat est prêt…) : le
  // service regarde à nouveau ce qu'il y a à faire.
  const signaux = [];
  const signaler = () => signaux.splice(0).forEach((r) => r());
  const unChangement = () => new Promise((r) => signaux.push(r));

  function platPret(f) {
    f.etat = 'pret';
    f.el.classList.remove('e5-four-chaud', 'e5-feu');
    f.el.classList.add('e5-fourneau-pret');
    bip('ding');
    f.signe = svgEl('g', { 'pointer-events': 'none' }, calques.bulles);
    f.signe.innerHTML = `<g class="e5-pret-saute">${D.signePret(D.PLATS[f.r.plat]({ vapeur: false }))}</g>`;
    placer(f.signe, f.lieu.casserole.x, f.lieu.casserole.y - 30);
    majCarte(f);
    signaler();
  }

  // Attend qu'on touche un fourneau, dans la salle ou par sa carte en bas.
  // annuler() retire l'attente (elle donne alors null).
  function attendreFeu() {
    let finir = () => {};
    const promesse = new Promise((resolve) => {
      const ecoutes = [];
      finir = (f) => {
        for (const [el, type, h] of ecoutes) el.removeEventListener(type, h);
        for (const x of feux) x.el.classList.remove('e5-touchable');
        resolve(f);
      };
      for (const f of feux) {
        const h = (e) => {
          if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
          if (vue !== 'cafe' || enTransition || fenetreCourante) return;
          e.preventDefault();
          finir(f);
        };
        for (const [el, type] of [[f.el, 'click'], [f.el, 'keydown'], [f.bouton, 'click']]) {
          el.addEventListener(type, h);
          ecoutes.push([el, type, h]);
        }
        f.el.classList.add('e5-touchable');
      }
    });
    return { promesse, annuler: () => finir(null) };
  }

  // La bulle des gestes, au-dessus du fourneau où l'on prépare.
  const bulleFour = (() => {
    const g = svgEl('g', { class: 'e5-bulle-four', 'pointer-events': 'none' }, calques.bulles);
    g.style.display = 'none';
    g.innerHTML = D.bulleFourneau();
    const pop = g.firstElementChild;
    const q = (s) => g.querySelector(s);
    const [titreB, sous, jauge, barre, minuteur] = ['.e5-bf-titre', '.e5-bf-sous', '.e5-bf-jauge', '.e5-bf-barre', '.e5-bf-minuteur'].map(q);
    minuteur.style.display = 'none';
    return {
      sur(f) { placer(g, f.lieu.bulle.x, f.lieu.bulle.y); },
      etape(t, s) {
        if (g.style.display === 'none') {
          g.style.display = '';
          pop.classList.remove('e5-pop');
          void pop.getBoundingClientRect();
          pop.classList.add('e5-pop');
        }
        jauge.style.display = '';
        titreB.textContent = t;
        sous.textContent = s;
        barre.style.transform = 'scaleX(0)';
      },
      remplir(ms) {
        return animer(barre, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duree: ms, easing: 'ease-in-out' });
      },
      cacher() { g.style.display = 'none'; },
    };
  })();

  async function tomber(f, k, delai) {
    await dormir(delai);
    const c = f.lieu.casserole;
    const g = svgEl('g', {}, calques.volants);
    g.innerHTML = `<g transform="scale(.62)">${D.ARTICLES[k].dessin()}</g>`;
    placer(g, c.x + (Math.random() - 0.5) * 10, c.y - 30);
    await aller(g, c.x, c.y - 2, 460, 'cubic-bezier(.55,0,1,.45)');
    g.remove();
  }

  const secouerCasserole = (f) => animer(f.casserole, [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(0)' }], { duree: 380, garder: false });

  async function geste(f, type) {
    const c = f.lieu.casserole;
    if (type === 'remuer' || type === 'melanger') {
      const g = svgEl('g', {}, calques.volants);
      g.innerHTML = `<g class="e5-touille">${D.cuillere()}</g>`;
      placer(g, c.x + 2, c.y - 2);
      bip('plouf');
      await dormir(900);
      g.remove();
    } else if (type === 'enfourner') {
      f.el.classList.add('e5-four-chaud');
      bip('feu');
      await dormir(500);
    } else if (type === 'retourner') {
      const g = svgEl('g', {}, calques.volants);
      const crepe = svgEl('g', { class: 'e5-crepe-volante' }, g);
      crepe.innerHTML = '<ellipse rx="13" ry="4.5" fill="#f6cf8c" stroke="#dea457" stroke-width="1.2"/><ellipse cx="-3" cy="-1" rx="2" ry="1" fill="#dea457"/>';
      placer(g, c.x, c.y - 4);
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
      await secouerCasserole(f);
    }
  }

  // Le comptoir : chaque plat prêt attend Pipistrelle à sa place.
  const occupees = new Set();
  const PLAT = 0.8;   // taille des plats dans la salle

  async function platVersComptoir(r, cmd, f) {
    let n = L.comptoir.findIndex((_, k) => !occupees.has(k));
    if (n < 0) n = 0;
    occupees.add(n);
    const place = L.comptoir[n];
    const g = svgEl('g', {}, calques.volants);
    g.innerHTML = `<g transform="scale(${PLAT})">${D.PLATS[r.plat]({ vapeur: false })}</g>`;
    const de = r.four ? f.lieu.four : f.lieu.casserole;
    placer(g, de.x, de.y - 6);
    await voler(g, place.x, place.y - 7, 650, { hauteur: 30 });
    g.remove();
    bip('plouf');
    const pose = svgEl('g', { transform: `translate(${place.x} ${place.y - 7}) scale(${PLAT})` }, calques.plateau);
    pose.innerHTML = D.PLATS[r.plat]({ vapeur: 'blanc' });
    cmd.surComptoir = { n, x: place.x, y: place.y, g: pose };
  }

  // Le contenu de la casserole va sur le fourneau f ; on fait les gestes,
  // puis la cuisson démarre et on est libre de lancer autre chose.
  let premiereCuisson = true;
  async function preparer(f, { cmd, extra }) {
    const r = recette(cmd.recette);
    cmd.etat = 'cuisine';
    Object.assign(f, { etat: 'gestes', cmd, r, extra, fait: 0, total: r.cuisson * 60, vitesse: 1 });
    majCarte(f);
    const contenu = [...pot].flatMap(([k, n]) => Array(n).fill(k));
    for (const [k, n] of pot) frigo.set(k, nb(k) - n);
    for (const k of [...frigo.keys()]) if (!nb(k)) frigo.delete(k);
    pot.clear();
    majBadge();

    dire(TEXTES.preparation);
    await Promise.all(contenu.map((k, j) => tomber(f, k, j * 150)));
    bip('plouf');
    secouerCasserole(f);

    bulleFour.sur(f);
    montrer(f.lieu.halo.x, f.lieu.halo.y, f.lieu.halo.r, false);
    for (let i = 0; i < r.gestes.length; i++) {
      bulleFour.etape(TEXTES.gestes[r.gestes[i]], `${TEXTES.fourneau.toucher} (${i + 1}/${r.gestes.length})`);
      await toucher(f.el, f.bouton);
      bip('clic', (i + 1) / r.gestes.length);
      await Promise.all([geste(f, r.gestes[i]), bulleFour.remplir(700)]);
    }
    cacherGuide();
    bulleFour.cacher();

    f.etat = 'cuisson';
    f.el.classList.add(r.four ? 'e5-four-chaud' : 'e5-feu');
    bip('feu');
    majCarte(f);
    lancerHorloge();
    if (premiereCuisson) {
      premiereCuisson = false;
      direUnInstant(TEXTES.vraiTemps, 6500);
    } else {
      direUnInstant(r.cuit, 2400);
    }
  }

  // On touche un fourneau où le plat est prêt : il part au comptoir (ou, pour
  // la spécialité, la fête commence).
  async function sortirPlat(f, enFond) {
    const { cmd, r, extra } = f;
    bip('clic', 1);
    if (f.signe) { f.signe.remove(); f.signe = null; }
    f.el.classList.remove('e5-fourneau-pret');
    Object.assign(f, { etat: 'libre', cmd: null, r: null, extra: null, vitesse: 1 });
    majCarte(f);
    if (cmd.special) {
      cmd.objets = await fete(cmd, f);
      cmd.etat = 'partie';
      return;
    }
    await platVersComptoir(r, cmd, f);
    cmd.etat = 'comptoir';
    enFond.push(servir(cmd).then(async () => {
      await mangerEtPartir(cmd.client, extra);
      cmd.etat = 'partie';
      signaler();
    }));
  }

  /* ------------------------------------------------------------ Le service */

  function creerClient({ sorte, table }) {
    const perso = D.PERSONNAGES[sorte];
    const k = L.echelle;
    const g = svgEl('g', { class: 'e5-client' }, calques.clients);
    g.style.opacity = '0';
    const corps = svgEl('g', { class: 'e5-corps' }, g);
    corps.innerHTML = `<g transform="scale(${k})">${perso.dessin()}</g>`;
    placer(g, L.porte.x, L.porte.y);
    const siege = L.sieges[table];
    return {
      g, corps, x: siege.x, y: siege.y, table: L.tables[table], chemin: L.chemins[table],
      haut: perso.haut * k, tete: perso.tete * k, nom: perso.nom, bulle: null, assiette: null,
    };
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
    await marcher(c, c.chemin.map((p) => [p.x, p.y]));
    c.bulle = bulleDeCommande(c.x, c.y + c.haut - 4, RECETTES[cmd.recette].plat);
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
      const { n, x, y, g } = cmd.surComptoir;
      await voler(pipi, x, y - 30, 650, { hauteur: 16 });
      g.remove();
      occupees.delete(n);
      pipiPlat.innerHTML = D.PLATS[plat]({ vapeur: false });
      bip('clic', 0.7);
      await voler(pipi, c.table.x + 20, c.table.y - L.dessus - 34, 900, { hauteur: 34 });
      pipiPlat.replaceChildren();
      const a = svgEl('g', {}, calques.tables);
      a.innerHTML = `<g class="e5-pose e5-pop"><g transform="scale(${PLAT})">${D.PLATS[plat]()}</g></g>`;
      placer(a, c.table.x, c.table.y - L.dessus - 7);
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
      await degouter(c, c.y, TEXTES.reactions[rang % TEXTES.reactions.length]);
      c.assiette.remove();
      poserPieces(c.table.x + 14, c.table.y - L.dessus - 4, PAIEMENT_BEURK);
    } else {
      const p = versEcran(c.x, c.y + c.haut + 6);
      coeurs(p.x, p.y, 4);
      bip('miam');
      c.corps.classList.add('e5-content');
      await animer(c.assiette.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(0)' }], { duree: 2200, easing: 'ease-in' });
      c.assiette.remove();
      c.corps.classList.remove('e5-content');
      poserPieces(c.table.x + 14, c.table.y - L.dessus - 4, PAIEMENT);
    }
    await dormir(400);
    await marcher(c, [...c.chemin].reverse().map((p) => [p.x, p.y]));
    ouvrirPorte();
    await animer(c.g, [{ opacity: 1 }, { opacity: 0 }], { duree: 320 });
    c.g.remove();
  }

  function lancerArrivees(cmds) {
    return (async () => {
      for (let i = 0; i < cmds.length; i++) {
        await dormir(ARRIVEES[i] ?? 3000);
        await enCafe();
        await entrer(cmds[i]);
        cmds[i].etat = 'assise';
        signaler();
      }
    })();
  }

  // Ce que dit Pipistrelle pendant le service, sans répéter ce qui est déjà
  // affiché ; une remarque passagère reste le temps d'être lue.
  function conseiller(t) {
    if (texteDeFond === t) return;
    if (ephemereActif) { texteDeFond = t; return; }
    dire(t);
  }

  // Le livre s'ouvre au fourneau f : on choisit la commande, on remplit la
  // casserole, et on peut filer au marché. Renvoie true si un plat est lancé.
  async function ouvrirLivre(f, cmds) {
    let choisie = null;
    for (;;) {
      const pretes = cmds.filter((c) => c.etat === 'assise');
      if (!pretes.length) return false;
      const res = await livreCuisine(pretes, choisie);
      if (!res) return false;
      if (res.action === 'marche') {
        choisie = res.cmd;
        await allerAuMarche();
        continue;
      }
      await preparer(f, res);
      return true;
    }
  }

  // La boucle du service, comme dans le jeu : on touche un fourneau libre
  // pour lancer une commande, un fourneau prêt pour poser le plat au
  // comptoir. Jusqu'à trois plats cuisent en même temps ; Pipistrelle sert.
  let paralleleDit = false;
  async function service(cmds, { premierTexte, texte }) {
    const enFond = [];
    let premier = true;
    for (;;) {
      const enAttente = cmds.filter((c) => c.etat === 'assise');
      const occupes = feux.filter((f) => f.etat !== 'libre');
      const prets = feux.filter((f) => f.etat === 'pret');
      const libres = feux.filter((f) => f.etat === 'libre');
      if (!enAttente.length && !occupes.length && !cmds.some((c) => c.etat === 'dehors')) break;

      if (prets.length) {
        const f = prets[0];
        conseiller(f.cmd.special ? TEXTES.pretSpecial(f.k + 1) : TEXTES.pret(f.k + 1));
        montrer(f.lieu.halo.x, f.lieu.halo.y, f.lieu.halo.r, false);
      } else if (enAttente.length && libres.length) {
        if (premier) conseiller(premierTexte);
        else if (occupes.length && !paralleleDit) { paralleleDit = true; conseiller(TEXTES.enParallele); }
        else conseiller(texte);
        const f = libres[0];
        montrer(f.lieu.halo.x, f.lieu.halo.y, f.lieu.halo.r, false);
      } else {
        conseiller(occupes.length ? TEXTES.cuissonEnCours : TEXTES.attenteClient);
        cacherGuide();
      }

      const attente = attendreFeu();
      const f = await Promise.race([attente.promesse, unChangement().then(() => null)]);
      attente.annuler();
      if (!f) continue;
      cacherGuide();
      if (f.etat === 'pret') {
        await sortirPlat(f, enFond);
      } else if (f.etat === 'cuisson') {
        bip('clic', 0.3);
        direUnInstant(f.vitesse > 1 ? f.r.cuit : `${f.r.cuit} ${TEXTES.astuce60x}`, 3200);
      } else if (f.etat === 'libre') {
        if (!enAttente.length) {
          bip('non');
          direUnInstant(occupes.length ? TEXTES.rienAPreparer : TEXTES.attenteClient, 2400);
          continue;
        }
        bip('clic', 0.5);
        if (await ouvrirLivre(f, cmds)) premier = false;
      }
    }
    cacherGuide();
    await Promise.all(enFond);
  }

  /* ------------------------------------------------------ Le client spécial */

  async function entreeSpeciale() {
    const g = svgEl('g', { class: 'e5-client' }, calques.clients);
    g.style.opacity = '0';
    const corps = svgEl('g', { class: 'e5-flotte' }, g);
    corps.innerHTML = `<g transform="scale(${L.echelle})">${D.machaon()}</g>`;
    const ailes = corps.querySelector('.e5-ailes-machaon');
    placer(g, L.porte.x, L.porte.y - 30);
    ouvrirPorte();
    bip('sonnette');
    ailes.classList.add('e5-vite');
    animer(g, [{ opacity: 0 }, { opacity: 1 }], { duree: 400 });
    await voler(g, L.perchoir.x, L.perchoir.y, 2800, { hauteur: 50, ondule: 12 });
    ailes.classList.remove('e5-vite');
    const k = L.echelle;
    const c = { g, corps, ailes, x: L.perchoir.x, y: L.perchoir.y, haut: D.MACHAON.haut * k, tete: D.MACHAON.tete * k, nom: D.MACHAON.nom, bulle: null, assiette: null };
    c.bulle = bulleDeCommande(c.x, c.y - 40, 'gateau');
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
  async function fete(cmd, f) {
    const T = TEXTES.fete;
    const sp = cmd.client;
    if (sp.bulle) { sp.bulle.remove(); sp.bulle = null; }
    const C = { x: 200, y: 370 };   // pied du présentoir

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
    banniere.innerHTML = T.banniere.map((l, i) => `<text x="${C.x}" y="${126 + i * 40}" text-anchor="middle" font-size="${i ? 38 : 26}" font-weight="700" fill="#fff4c2" stroke="#4a1fa8" stroke-width="6" stroke-linejoin="round" paint-order="stroke">${esc(l)}</text>`).join('');
    calque.append(sp.g, pipi);

    // Le gâteau sort du four et vient au centre, en grand.
    dire(T.attends);
    plateauFeux.hidden = true;
    ambiance(null);   // la musique se tait : place à la chanson
    placer(support, f.lieu.casserole.x, f.lieu.casserole.y);
    await Promise.all([
      animer(nuit, [{ opacity: 0 }, { opacity: 0.64 }], { duree: 1000 }),
      aller(support, C.x, C.y, 1200, 'cubic-bezier(.3,.8,.3,1)'),
      animer(gateau, [{ transform: 'scale(.18)' }, { transform: 'scale(1)' }], { duree: 1200, easing: 'cubic-bezier(.3,.8,.3,1)' }),
    ]);
    sp.ailes.classList.add('e5-vite');
    await voler(sp.g, 338, 226, 1300, { hauteur: 30, ondule: 8 });
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
    await voler(pipi, 64, 214, 700, { hauteur: 20 });
    pipi.classList.remove('e5-vole');
    animer(lueur, [{ opacity: 0 }, { opacity: 1 }], { duree: 900 });

    // Les clients du soir reviennent pour la fête.
    for (const [sorte, x, y] of [['herisson', 52, 398], ['grenouille', 96, 408], ['loutre', 346, 400]]) {
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
    await voler(sp.g, 338, 226, 1100, { hauteur: 30, ondule: 8 });
    sp.ailes.classList.remove('e5-vite');
    calque.append(sp.g, pipi);
    ambiance('salle');
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

  ambiance('salle');
  scenario().catch((e) => { if (vivant) console.error(e); });
  if (debug !== null) {
    window.__e5 = {
      get pieces() { return pieces; },
      get frigo() { return Object.fromEntries(frigo); },
      get pot() { return Object.fromEntries(pot); },
      get commandes() { return commandes.map((c) => ({ sorte: c.sorte, etat: c.etat, erreurs: c.erreurs })); },
      get vue() { return vue; },
      get son() { return son.ambianceCourante ? son.ambianceCourante() : null; },
      get feux() { return feux.map((f) => ({ etat: f.etat, recette: f.cmd && f.cmd.recette, reste: Math.ceil(f.total - f.fait) })); },
      besoins: (sorte) => Object.fromEntries(besoins(commandes.find((c) => c.sorte === sorte))),
    };
  }

  return () => {
    vivant = false;
    for (const id of minuteurs) clearTimeout(id);
    cancelAnimationFrame(horloge);
    observateur.disconnect();
    delete window.__e5;
  };
}

export default {
  fond: 'clair',
  ambiance: SONS.salle.fichier,
  demarrer,
};
