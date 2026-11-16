// Étape 5 — le café de Cyriel.
//
// Un petit jeu de café, en hommage à celui qu'elle adorait :
//   1. connexion : le mot de passe est le code à 4 chiffres trouvé en chemin ;
//   2. le marché : acheter les ingrédients de la carte du soir ;
//   3. la cuisine : préparer un chocolat chaud au fourneau ;
//   4. le service : Pipistrelle, la serveuse, sert trois clients ;
//   5. un client très spécial (un machaon) commande le gâteau rhubarbe et
//      crème de marron, puis laisse le mot de Clément et le cadeau.
//
// Les aliments qu'elle déteste sont vendus au marché, hors liste. Si elle en
// achète, elle peut en ajouter à une recette : les clients trouvent ça
// affreux, comme elle. On ne peut jamais perdre.
//
// Tous les textes sont regroupés juste en dessous. Le mot et le cadeau
// sont à écrire par Clément : TEXTES.lettre et TEXTES.cadeau.
//
// Pour les essais :  ?etape=5&debug=vite  (tout va 4 fois plus vite).

import { CODE } from '../code.js';
import * as D from './cafe-dessins.js';

/* ======================================================= Textes à modifier */

const TEXTES = {
  nomCafe: 'Café de Cyriel',
  nomMarche: 'Marché',
  pieces: 'Pièces',
  ramasser: 'Ramasser les pièces',
  ferme: 'Fermé',
  ouvert: 'Ouvert',

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
  versMarche: 'Le frigo est vide. Allons au marché acheter de quoi préparer la carte du soir.',
  marche: 'Touche les ingrédients de ta liste pour les acheter.',
  intrus: 'Ça, ce n’est pas sur la liste.',
  horsListe: 'Ce n’est pas sur ta liste… Je le prends quand même, on ne sait jamais.',
  coursesFinies: 'Tout y est ! On rentre au café.',
  frigo: 'Je range les courses au frigo…',
  choco: 'Les premiers clients arrivent ! Touche le fourneau pour préparer un chocolat chaud.',
  cuissonChoco: 'Le chocolat chauffe… Les clients s’installent.',
  pretChoco: 'C’est prêt ! Touche le fourneau pour poser les tasses sur le comptoir.',
  service: 'Je m’occupe du service ! Touche les pièces laissées sur les tables pour les ramasser.',
  calme: 'Ouf, tout le monde est servi.',
  special: 'Oh ! Un client très spécial… Il voudrait un gâteau rhubarbe et crème de marron.',
  gateau: 'Touche le fourneau pour le préparer.',
  cuissonGateau: 'Le gâteau cuit… Ça sent bon la rhubarbe et la crème de marron.',
  pretGateau: 'Il est prêt ! Touche le fourneau pour le poser sur le comptoir.',
  serviceGateau: 'Je le lui apporte !',
  cadeauLaisse: 'Il a laissé quelque chose pour toi sur la table…',
  fin: 'Le café est à toi, cheffe. Reviens quand tu veux !',

  // Les aliments détestés : la question au fourneau, puis la réaction des clients.
  enPlus: 'Tu veux ajouter un ingrédient en plus ?',
  audacieux: 'Audacieux…',
  reactions: ['Beurk !', 'Pouah !', 'Affreux !'],   // ce que dit chaque client
  reactionMachaon: 'Beurk…',
  reaction: [
    (client, aliment) => `${client} déteste ${aliment}… comme toi !`,
    (client, aliment) => `${client} déteste aussi ${aliment} !`,
    (client, aliment) => `${client} ne supporte pas ${aliment} non plus.`,
  ],
  reactionSpeciale: (aliment) => `Même le machaon déteste ${aliment}… Mais il a laissé quelque chose pour toi sur la table.`,

  ariaEnveloppe: 'Enveloppe laissée par le client',
  ariaCadeau: 'Cadeau laissé par le client',

  fourneau: {
    toucher: 'Touche le fourneau',
    cuisson: 'Cuisson…',
    pret: 'C’est prêt !',
    enPlus: 'Un ingrédient en plus ?',
    choisis: 'Choisis en bas',
    ajoute: 'Ajouté !',
  },

  boutons: {
    intro: 'Bonjour Pipistrelle !',
    marche: 'Aller au marché',
    retour: 'Retour au café',
    relire: 'Relire le mot',
    rejouer: 'Rejouer',
    ouvrirCadeau: 'Ouvrir le cadeau',
    relireMot: 'Relire le mot',
    fermer: 'Fermer',
    nonMerci: 'Non merci',
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

const RECETTES = {
  chocolat: {
    plat: 'tasse', court: 'Chocolat chaud', portions: 3, cuisson: 6, four: false,
    etapes: [
      { texte: 'Chauffer le lait', ingredients: ['lait'] },
      { texte: 'Ajouter le chocolat', ingredients: ['chocolat'] },
      { texte: 'Remuer', geste: 'remuer' },
    ],
  },
  gateau: {
    plat: 'gateau', court: 'Gâteau', portions: 1, cuisson: 15, four: true,
    etapes: [
      { texte: 'Couper la rhubarbe', ingredients: ['rhubarbe'] },
      { texte: 'Mélanger farine, œufs, sucre', ingredients: ['farine', 'oeufs', 'sucre'] },
      { texte: 'Ajouter la crème de marron', ingredients: ['marron'] },
      { texte: 'Enfourner', geste: 'enfourner' },
    ],
  },
};

// La liste de courses : tous les ingrédients des recettes, sans doublon.
const LISTE = [...new Set(Object.values(RECETTES).flatMap((r) => r.etapes.flatMap((e) => e.ingredients || [])))];

// Les aliments que Cyriel n'aime pas : vendus au marché, hors liste.
const DETESTES = ['poivron', 'aubergine', 'gingembre', 'coriandre', 'balsamique', 'vin', 'champagne', 'huitres'];

const MARCHE = [
  { nom: 'Primeur', couleur: '#f06fa4', fond: '#fde8f1', articles: ['poivron', 'rhubarbe', 'aubergine', 'coriandre', 'gingembre'] },
  { nom: 'Épicerie', couleur: '#8f5cf7', fond: '#efe6ff', articles: ['farine', 'balsamique', 'chocolat', 'sucre', 'marron'] },
  { nom: 'Halles', couleur: '#5bb36a', fond: '#e8f6e9', articles: ['huitres', 'oeufs', 'vin', 'lait', 'champagne'] },
];

const CLIENTS = [
  { sorte: 'herisson', table: 1 },
  { sorte: 'grenouille', table: 0 },
  { sorte: 'loutre', table: 2 },
];

const PRIX = 2;
const PIECES_DEPART = 30;
const POURBOIRE = 5;
const VITESSE_MARCHE = 95;   // pixels du décor par seconde
const NS = 'http://www.w3.org/2000/svg';
const L = D.LIEUX;

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function gabarit() {
  const T = TEXTES;
  return `
  <div class="e5-jeu">
    <header class="e5-haut">
      <div class="e5-pieces" role="status" aria-label="${esc(T.pieces)}">
        <svg viewBox="-12 -12 24 24" aria-hidden="true">${D.pieceSeule()}</svg><span>${PIECES_DEPART}</span>
      </div>
      <p class="e5-nom">${esc(T.nomCafe)}</p>
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
          <div class="e5-liste" hidden></div>
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
    <g class="e5-vue" data-vue="marche" style="display:none">
      ${D.fondMarche()}
      ${MARCHE.map((e, i) => D.etal(e, i, PRIX)).join('')}
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
  const liste = $('.e5-liste');
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

  const vues = { cafe: $('[data-vue="cafe"]'), marche: $('[data-vue="marche"]') };
  const voile = $('.e5-voile');
  const titre = $('.e5-nom');
  async function changerVue(nom) {
    await animer(voile, [{ opacity: 0 }, { opacity: 1 }], { duree: 260 });
    for (const [k, v] of Object.entries(vues)) v.style.display = k === nom ? '' : 'none';
    titre.textContent = nom === 'marche' ? TEXTES.nomMarche : TEXTES.nomCafe;
    await animer(voile, [{ opacity: 1 }, { opacity: 0 }], { duree: 320 });
  }

  const pipi = svgEl('g', { class: 'e5-pipi' }, calques.volants);
  pipi.innerHTML = `<g class="e5-flotte">${D.pipistrelle()}</g>`;
  placer(pipi, L.pipi.x, L.pipi.y);
  const pipiPlat = pipi.querySelector('.e5-pipi-plat');
  let pipiLibre = Promise.resolve();

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
    const pancarte = $('[data-e5="pancarte"]');
    pancarte.textContent = TEXTES.ouvert;
    animer($('.e5-pancarte'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duree: 320, garder: false });
  }

  /* ------------------------------------------------------------ Le marché */

  const extras = new Set();           // aliments détestés achetés en plus
  const extrasUtilises = new Set();
  let marcheOuvert = false;

  function acheter(article) {
    article.classList.add('e5-achete');
    article.setAttribute('aria-disabled', 'true');
    ajouterPieces(-PRIX);
    bip('piece');
  }

  // Résolue quand tout ce qui est sur la liste est acheté ; on peut encore
  // acheter des extras tant qu'on n'a pas quitté le marché.
  async function courses() {
    const besoin = new Set(LISTE);
    const achete = new Set();
    liste.innerHTML = LISTE.map((k) => `
      <span class="e5-puce" data-cle="${k}"><svg viewBox="-24 -24 48 48" aria-hidden="true">${D.ARTICLES[k].dessin()}</svg>${esc(D.ARTICLES[k].nom)}</span>`).join('');
    liste.hidden = false;
    marcheOuvert = true;
    dire(TEXTES.marche);
    let toutAchete;
    const fini = new Promise((r) => { toutAchete = r; });
    for (const article of racine.querySelectorAll('.e5-article')) {
      const k = article.dataset.cle;
      const choisir = (e) => {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        if (!marcheOuvert || achete.has(k) || extras.has(k)) return;
        const de = versEcran(+article.dataset.x, +article.dataset.y);
        if (besoin.has(k)) {
          achete.add(k);
          acheter(article);
          const puce = liste.querySelector(`[data-cle="${k}"]`);
          envolee(D.ARTICLES[k].dessin(), de, centre(puce.querySelector('svg'))).then(() => puce.classList.add('e5-ok'));
          if (achete.size === besoin.size) dormir(700).then(toutAchete);
        } else if (DETESTES.includes(k)) {
          extras.add(k);
          acheter(article);
          const puce = document.createElement('span');
          puce.className = 'e5-puce e5-extra';
          puce.dataset.cle = k;
          puce.innerHTML = `<svg viewBox="-24 -24 48 48" aria-hidden="true">${D.ARTICLES[k].dessin()}</svg>${esc(D.ARTICLES[k].nom)}`;
          liste.append(puce);
          envolee(D.ARTICLES[k].dessin(), de, centre(puce.querySelector('svg')));
          direUnInstant(TEXTES.horsListe, 2600);
        } else {
          secouer(article.querySelector('.e5-article-icone'));
          bip('non');
          direUnInstant(TEXTES.intrus, 1800);
        }
      };
      article.addEventListener('click', choisir);
      article.addEventListener('keydown', choisir);
    }
    await fini;
  }

  async function rangerCourses() {
    dire(TEXTES.frigo);
    const porteFrigo = $('[data-e5="frigo-porte"]');
    await animer(porteFrigo, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.15)' }], { duree: 320, easing: 'ease-out' });
    const vers = versEcran(L.frigo.x, L.frigo.y);
    const puces = [...liste.children];
    await Promise.all(puces.map((p, i) => dormir(i * 110).then(() => {
      const de = centre(p.querySelector('svg'));
      p.style.visibility = 'hidden';
      return envolee(D.ARTICLES[p.dataset.cle].dessin(), de, vers, { duree: 600 });
    })));
    bip('plouf');
    await animer(porteFrigo, [{ transform: 'scaleX(.15)' }, { transform: 'scaleX(1)' }], { duree: 300, easing: 'ease-in' });
    liste.hidden = true;
    liste.replaceChildren();
  }

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
    const [titreB, sous, jauge, barre, minuteur, arc, sec] = ['.e5-bf-titre', '.e5-bf-sous', '.e5-bf-jauge', '.e5-bf-barre', '.e5-bf-minuteur', '.e5-bf-arc', '.e5-bf-sec'].map(q);
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
      minuter(secondes, nom) {
        afficher(TEXTES.fourneau.cuisson, nom, { avecMinuteur: true });
        const total = (secondes * 1000) / V;
        const debut = performance.now();
        return new Promise((resolve) => {
          const pas = (t) => {
            if (!vivant) return;
            const p = Math.min(1, (t - debut) / total);
            arc.setAttribute('stroke-dashoffset', (69.1 * (1 - p)).toFixed(2));
            sec.textContent = String(Math.ceil(secondes * (1 - p)));
            if (p < 1) requestAnimationFrame(pas); else resolve();
          };
          requestAnimationFrame(pas);
        });
      },
      pret() { afficher(TEXTES.fourneau.pret, TEXTES.fourneau.toucher); },
      question(t, s) { afficher(t, s); },
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

  async function geste(e) {
    if (e.ingredients) {
      await Promise.all(e.ingredients.map((k, j) => tomber(k, j * 160)));
      bip('plouf');
      animer(casserole, [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(0)' }], { duree: 380, garder: false });
    } else if (e.geste === 'remuer') {
      const g = svgEl('g', {}, calques.volants);
      g.innerHTML = `<g class="e5-touille">${D.cuillere()}</g>`;
      placer(g, L.casserole.x + 2, L.casserole.y - 2);
      bip('plouf');
      await dormir(900);
      g.remove();
    } else if (e.geste === 'enfourner') {
      four.classList.add('e5-four-chaud');
      bip('feu');
      await dormir(400);
    }
  }

  let plateau = { plat: null, n: 0 };
  function dessinerPlateau() {
    calques.plateau.replaceChildren();
    const ecarts = { 1: [0], 2: [-14, 14], 3: [-28, 0, 28] }[plateau.n] || [];
    for (const dx of ecarts) {
      const g = svgEl('g', { transform: `translate(${L.plateau.x + dx} ${L.plateau.y})` }, calques.plateau);
      g.innerHTML = D.PLATS[plateau.plat]({ vapeur: 'blanc' });
    }
  }
  function remplirPlateau(plat, n) { plateau = { plat, n }; dessinerPlateau(); }
  function prendrePortion() { plateau.n = Math.max(0, plateau.n - 1); dessinerPlateau(); }

  async function platVersComptoir(r) {
    const g = svgEl('g', {}, calques.volants);
    g.innerHTML = D.PLATS[r.plat]({ vapeur: false });
    if (r.four) placer(g, 126, 188); else placer(g, L.casserole.x, L.casserole.y - 6);
    await voler(g, L.plateau.x, L.plateau.y, 650, { hauteur: 36 });
    g.remove();
    bip('plouf');
    remplirPlateau(r.plat, r.portions);
  }

  async function cuisiner(r, texteDebut) {
    dire(texteDebut);
    montrer(L.fourneau.x, L.fourneau.y, L.fourneau.r, false);
    for (let i = 0; i < r.etapes.length; i++) {
      const e = r.etapes[i];
      bulleFour.etape(e.texte, `${TEXTES.fourneau.toucher} (${i + 1}/${r.etapes.length})`);
      await toucher(four);
      bip('clic', (i + 1) / r.etapes.length);
      await Promise.all([geste(e), bulleFour.remplir(800)]);
    }
    cacherGuide();

    // Un ingrédient en plus ? Seulement si elle a acheté des aliments détestés.
    let extra = null;
    const dispo = [...extras].filter((k) => !extrasUtilises.has(k));
    if (dispo.length) {
      bulleFour.question(TEXTES.fourneau.enPlus, TEXTES.fourneau.choisis);
      const choix = await dire(TEXTES.enPlus, [...dispo.map((k) => D.ARTICLES[k].nom), TEXTES.boutons.nonMerci]);
      if (choix < dispo.length) {
        extra = dispo[choix];
        extrasUtilises.add(extra);
        bulleFour.question(D.ARTICLES[extra].nom, TEXTES.fourneau.ajoute);
        await tomber(extra, 0);
        bip('plouf');
        dire(TEXTES.audacieux);
        await dormir(1100);
      }
    }

    dire(r.four ? TEXTES.cuissonGateau : TEXTES.cuissonChoco);
    four.classList.add(r.four ? 'e5-four-chaud' : 'e5-feu');
    bip('feu');
    await bulleFour.minuter(r.cuisson, r.court);
    four.classList.remove('e5-four-chaud', 'e5-feu');
    bip('ding');
    bulleFour.pret();
    montrer(L.fourneau.x, L.fourneau.y, L.fourneau.r, false);
    dire(r.four ? TEXTES.pretGateau : TEXTES.pretChoco);
    await toucher(four);
    cacherGuide();
    bulleFour.cacher();
    bip('clic', 1);
    await platVersComptoir(r);
    return extra;
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

  function commande(x, y, plat) {
    const g = svgEl('g', {}, calques.bulles);
    g.innerHTML = `<g class="e5-pop">${D.bulleCommande(D.PLATS[plat]({ vapeur: 'lilas' }))}</g>`;
    placer(g, x, y);
    return g;
  }

  async function entrer(c, plat) {
    ouvrirPorte();
    bip('sonnette');
    animer(c.g, [{ opacity: 0 }, { opacity: 1 }], { duree: 350 });
    await marcher(c, [[L.porte.x, L.couloir], [c.x, L.couloir], [c.x, L.assis]]);
    c.bulle = commande(c.x, L.assis + c.haut - 4, plat);
    bip('clic', 0.5);
  }

  // Pipistrelle va chercher une portion au comptoir et la pose devant le
  // client. Renvoie une promesse tenue quand le plat est sur la table.
  function servir(c, plat) {
    let poser;
    const surTable = new Promise((r) => { poser = r; });
    pipiLibre = pipiLibre.then(async () => {
      pipi.classList.add('e5-vole');
      await voler(pipi, L.plateau.x, L.plateau.y - 34, 650, { hauteur: 16 });
      prendrePortion();
      pipiPlat.innerHTML = D.PLATS[plat]({ vapeur: false });
      bip('clic', 0.7);
      await voler(pipi, c.x + 26, L.assis - 44, 900, { hauteur: 34 });
      pipiPlat.replaceChildren();
      const g = svgEl('g', {}, calques.tables);
      g.innerHTML = `<g class="e5-pose e5-pop">${D.PLATS[plat]()}</g>`;
      placer(g, c.x + 2, L.assis - 9);
      c.assiette = g;
      if (c.bulle) { c.bulle.remove(); c.bulle = null; }
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
    g.addEventListener('click', ramasser);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ramasser(); }
    });
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

  async function mangerEtPartir(c, extra, rang) {
    await dormir(350);
    if (extra) {
      await animer(c.assiette.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(.8)' }], { duree: 450 });
      const phrase = TEXTES.reaction[Math.min(rang, TEXTES.reaction.length - 1)];
      dire(phrase(c.nom, D.ARTICLES[extra].defini));
      await degouter(c, L.assis, TEXTES.reactions[rang % TEXTES.reactions.length]);
      c.assiette.remove();
      poserPieces(c.x - 24, L.assis - 5, 1);
    } else {
      const p = versEcran(c.x, L.assis + c.haut + 8);
      coeurs(p.x, p.y, 4);
      bip('miam');
      c.corps.classList.add('e5-content');
      await animer(c.assiette.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(0)' }], { duree: 2200, easing: 'ease-in' });
      c.assiette.remove();
      c.corps.classList.remove('e5-content');
      poserPieces(c.x - 24, L.assis - 5, POURBOIRE);
    }
    await dormir(400);
    await marcher(c, [[c.x, L.couloir], [L.porte.x, L.couloir], [L.porte.x, L.porte.y]]);
    ouvrirPorte();
    await animer(c.g, [{ opacity: 1 }, { opacity: 0 }], { duree: 320 });
    c.g.remove();
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
    c.bulle = commande(c.x, L.perchoir - 52, 'gateau');
    bip('clic', 0.8);
    return c;
  }

  function objetSurTable(dessin, x, y, nom, etiquette) {
    const g = svgEl('g', { role: 'button', tabindex: '0', 'aria-label': etiquette, 'data-e5': nom }, calques.tables);
    g.innerHTML = `<circle r="20" fill="transparent"/><g class="e5-pop">${dessin}</g>`;
    placer(g, x, y);
    return g;
  }

  async function mangerSpecial(c, extra) {
    await dormir(400);
    if (extra) {
      await animer(c.assiette.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(.85)' }], { duree: 450 });
      await degouter(c, L.perchoir, TEXTES.reactionMachaon);
    } else {
      const p = versEcran(c.x, L.perchoir - 30);
      coeurs(p.x, p.y, 10);
      bip('miam');
      await animer(c.assiette.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(0)' }], { duree: 2600, easing: 'ease-in' });
    }
    c.assiette.remove();
    await dormir(400);
    const enveloppe = objetSurTable(D.enveloppe(), c.x - 16, L.assis - 6, 'enveloppe', TEXTES.ariaEnveloppe);
    bip('papier');
    await dormir(300);
    const cadeau = objetSurTable(D.cadeau(), c.x + 22, L.assis - 9, 'cadeau', TEXTES.ariaCadeau);
    bip('chiffre');
    const q = versEcran(c.x + 4, L.assis - 10);
    if (vivant) fx.etincelles(q.x, q.y, 16, '#d7b3ff', 140);
    await dormir(900);
    c.ailes.classList.add('e5-vite');
    ouvrirPorte();
    await voler(c.g, L.porte.x, L.porte.y - 40, 2400, { hauteur: 60, ondule: 12 });
    await animer(c.g, [{ opacity: 1 }, { opacity: 0 }], { duree: 400 });
    c.g.remove();
    return [enveloppe, cadeau];
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
      <p class="e5-pourcent">0 %</p>`;
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
        pourcent.textContent = `${n} %`;
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
    await dire(TEXTES.versMarche, [TEXTES.boutons.marche]);
    await changerVue('marche');
    await courses();
    await dire(TEXTES.coursesFinies, [TEXTES.boutons.retour]);
    marcheOuvert = false;
    await changerVue('cafe');
    await rangerCourses();
    ouvrirCafe();

    // Le chocolat chaud, pendant que les premiers clients s'installent.
    const clients = CLIENTS.map(creerClient);
    const installes = clients.map((c, i) => dormir(1200 + i * 3600).then(() => entrer(c, 'tasse')));
    const extraChoco = await cuisiner(RECETTES.chocolat, TEXTES.choco);
    dire(TEXTES.service);
    const departs = [];
    for (let i = 0; i < clients.length; i++) {
      await installes[i];
      await servir(clients[i], 'tasse');
      departs.push(mangerEtPartir(clients[i], extraChoco, i));
    }
    await Promise.all(departs);
    await pipiLibre;
    await dormir(600);
    toutRamasser();
    dire(TEXTES.calme);
    await dormir(1800);

    // Le client très spécial.
    const special = await entreeSpeciale();
    const extraGateau = await cuisiner(RECETTES.gateau, `${TEXTES.special} ${TEXTES.gateau}`);
    dire(TEXTES.serviceGateau);
    await servir(special, 'gateau');
    const objets = await mangerSpecial(special, extraGateau);
    dire(extraGateau ? TEXTES.reactionSpeciale(D.ARTICLES[extraGateau].defini) : TEXTES.cadeauLaisse);
    montrer(special.x - 16, L.assis - 6, 22, true);
    await toucher(...objets);
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
  if (debug !== null) window.__e5 = { get pieces() { return pieces; } };

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
