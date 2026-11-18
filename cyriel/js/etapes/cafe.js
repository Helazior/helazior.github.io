// Étape 6 — le café de Cyriel.
//
// Un petit jeu de café, en hommage à celui qu'elle adorait :
//   1. connexion : l'écran est l'image images/connexion-cafe.webp, avec les
//      vrais champs posés par-dessus ; le mot de passe est le code à 4
//      chiffres trouvé en chemin ; l'écran apparaît ligne par ligne ;
//   2. le livre de recettes dit quoi acheter ; au marché, on touche un étal
//      pour ouvrir sa vitrine et acheter à l'unité (tout va au panier, puis
//      au frigo) ;
//   3. les clients (les joueurs du marché) s'installent et commandent,
//      chacun une recette du livre ;
//   4. on touche un fourneau : le livre s'ouvre, la photo du client est sur
//      sa recette. « Cuisiner » lance la recette (s'il manque un ingrédient,
//      le bouton est le panier : la boutique d'ingrédients s'ouvre dans le
//      café). La bulle du fourneau montre chaque ingrédient puis chaque geste :
//      on la touche, Cyriel le fait (on peut en toucher plusieurs d'affilée).
//      La cuisson démarre ; on touche le fourneau pour voir où elle en est.
//      Il y a trois fourneaux : pendant qu'un plat cuit, on en lance un autre ;
//   5. prêt, on touche le plat : Cyriel le pose sur le comptoir bleu, avec
//      ses portions ; le fourneau sale se nettoie d'un toucher. La serveuse
//      sert les clients, ils paient (au compteur), lèvent le pouce et partent ;
//      elle débarrasse. Le dernier client, Clément, commande la spécialité,
//      puis laisse son mot.
//
// La roue de la fortune (au marché) et le camion du chef pâtissier (à droite
// du café) font gagner des billets ou des ingrédients : de quoi se débloquer.
//
// Les aliments qu'elle déteste sont vendus au marché (Pipistrelle s'étonne
// si elle en achète). L'argent (les billets) est compté : sans assez
// d'argent, on ne peut plus rien acheter (les clients paient en partant) ; si
// elle ne peut vraiment plus finir les commandes, Pipistrelle propose de
// recommencer la partie.
//
// L'écran du restaurant reprend la maquette de Clément : les menus sont
// découpés dans images/hud/ et posés aux mêmes places (voir HUD plus bas).
// Pipistrelle parle dans le Café chat, en bas à gauche.
//
// Tous les textes sont regroupés juste en dessous. Le mot de Clément est
// dans TEXTES.lettre.
//
// Pour les essais :  ?etape=6&debug=vite  (tout va 4 fois plus vite).

import { CODE } from '../code.js';
import * as D from './cafe-dessins.js';

/* ======================================================= Textes à modifier */

const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const TEXTES = {
  joueuse: 'Cyriel',   // le nom dans le bandeau, en haut
  nomCafe: 'Café de Cyriel',
  ouvert: 'Ouvert',
  panneauCafe: 'Café',

  // Les pseudos des joueurs : au marché, Clément près de la fontaine,
  // Chachoux qui se promène, Estel sur le banc, Angelounette et Rachou ;
  // Maximeunpeudifferent et Inesquiressemblepas ne viennent qu'au café, pour manger.
  joueurs: ['Clément', 'Xx-Chachoux-xX', 'Esteloux', 'Maximeunpeudifferent', 'Inesquiressemblepas', 'Angelounette', 'Rachou'],
  // Les clients de passage (ils mangent ce qu'il y a sur le comptoir).
  passants: ['Tom_63', 'Lulu', 'Mimi_Crêpe', 'Jojo', 'Nina42', 'Léo'],

  // L'écran de connexion : l'image de Clément (images/connexion-cafe.webp),
  // avec les vrais champs posés exactement sur ceux du dessin. Les textes
  // ci-dessous servent aux lecteurs d'écran et aux messages.
  connexion: {
    image: 'images/connexion-cafe.webp',
    titre: 'GoodCyriel Café',
    jouerMaintenant: 'Jouer maintenant !',
    pseudo: 'Nom d’utilisateur / E-mail',
    pseudoValeur: 'Cyriel',
    motDePasse: 'Mot de passe',
    souvenir: 'Se souvenir de moi',
    jouer: 'Connexion',
    erreur: 'Mauvais mot de passe.',
    dAbord: 'Entre d’abord ton mot de passe, juste en dessous.',
    oubli: 'Mot de passe oublié ?',
    indice: '4 chiffres violets qui apparaissent dans le jeu.',
    coupDePouce: 'Coup de pouce :',
    serveur: 'Connexion au serveur…',
    connecte: 'Connectée !',
    transfert: (p) => `Téléchargement de l’écran d’accueil… ${p} %`,
    chargement: 'Chargement du café…',
  },

  // Ce que dit Pipistrelle, qui conseille la cheffe.
  retour: 'Te revoilà, cheffe ! Tu veux relire ton mot, ou rejouer une partie ?',
  intro: 'Bienvenue dans ton café, cheffe Cyriel ! Moi, c’est Pipistrelle : je te donnerai des conseils. Ce soir, on rouvre.',
  livre: (plats) => `Le frigo est vide… Ce soir, il va y avoir du monde ! Les premiers clients mangeront ce qu’il y a sur le comptoir ; ensuite, certains ont réservé ${plats}. Regarde dans le livre de recettes ce qu’il faut acheter !`,
  versMarche: 'Allons au marché faire les courses !',
  marche: 'Touche un étal pour voir ce qu’il vend. Le livre de recettes et le panier (ton frigo) sont en bas à droite.',
  astuceMarche: 'Le livre de recettes, en bas à droite, dit tout ce qu’il faut acheter.',
  achatDeteste: (a) => `${cap(a.partitif)} ? Tu es sûre ? Bon… c’est toi la cheffe.`,
  pasAssez: 'Plus assez d’argent ! Sers d’abord des clients (ils paient en partant), ou tente ta chance à la roue de la fortune.',
  bloquee: 'Oh non… il ne reste plus assez d’argent pour finir les commandes. Tente ta chance à la roue de la fortune, au marché, ou au camion du chef pâtissier, à droite du café ! Sinon, on peut recommencer la partie.',
  astuceRoue: 'Psst ! La roue de la fortune, à droite du marché, fait gagner de l’argent et des ingrédients.',
  astuceCamion: 'Tiens, le camion du chef pâtissier est garé à droite du café : touche-le pour jouer à « Trouve la garniture » !',
  manqueEncore: (liste) => `Il manque encore ${liste}. On rentre quand même ?`,
  rangement: 'Je range les courses au frigo…',
  ouverture: 'On ouvre ! Les premiers clients arrivent.',
  premierPassant: 'Un client s’est installé ! Il mangera ce qu’il y a sur le comptoir : touche un fourneau, puis « Cuisiner » sur une recette (une salade fait 10 portions).',
  premiereCommande: 'Un client s’est installé ! Touche un fourneau pour ouvrir le livre, puis « Cuisiner » sur la recette qu’il a commandée.',
  commandeSuivante: 'Touche un fourneau libre pour préparer une autre commande.',
  enParallele: 'Pendant que ça cuit, lance la commande suivante sur un autre fourneau : tu en as trois !',
  cuissonEnCours: 'Ça cuit… Le bouton jaune 60x, au-dessus du fourneau, accélère le plat.',
  parti: (nom) => `${nom} en a eu assez d’attendre… Il est parti sans manger.`,
  cyOccupee: 'Cyriel s’active aux fourneaux…',
  rienAPreparer: 'Aucune autre commande pour l’instant.',
  astuce60x: 'Pour aller plus vite : le bouton jaune 60x, au-dessus du fourneau.',
  attenteClient: 'On attend le prochain client…',
  preparation: 'Touche la bulle au-dessus du fourneau : Cyriel y va. Tu peux en toucher plusieurs d’affilée, elle les fait dans l’ordre !',
  vraiTemps: 'Comme dans le vrai jeu, la cuisson prend du vrai temps ! Pour ne pas attendre, touche le bouton jaune 60x, au-dessus du fourneau.',
  pret: (n) => `C’est prêt sur le fourneau ${n} ! Touche-le : Cyriel pose le plat sur le comptoir bleu.`,
  auComptoir: (r, n) => `${cap(r.dans)} sur le comptoir : ${n} portions ! La serveuse les apporte aux clients qui l’ont commandé.`,
  sale: 'Le fourneau est sale : touche-le pour que Cyriel le nettoie.',
  pretSpecial: (n) => `Le gâteau est prêt sur le fourneau ${n} ! Touche-le pour le sortir du four.`,
  service: 'Bon appétit !',
  calme: 'Ouf, tout le monde est servi.',
  special: 'Oh ! Regarde qui arrive : Clément ! Il commande la spécialité de la maison. Sa recette vient d’apparaître dans le livre !',
  commandeSpeciale: 'Touche un fourneau pour préparer la spécialité.',

  // La fin : le gâteau est pour elle, avec ses bougies.
  fete: {
    age: 24,   // les bougies en chiffres ; null pour cinq bougies classiques
    attends: 'Attends… Clément me chuchote quelque chose à l’oreille.',
    surprise: 'Surprise ! Ce gâteau, Clément ne l’a pas commandé pour lui… Il est pour toi !',
    pourMoi: 'Pour moi ?!',
    allumer: 'Je m’occupe des bougies…',
    souffler: 'Joyeux anniversaire, Cyriel ! Fais un vœu, puis souffle tes bougies : touche les flammes.',
    bravo: 'Bravo ! Et ce n’est pas fini : Clément t’a laissé un mot…',
    objets: 'Une enveloppe, rien que pour toi.',
    banniere: ['Joyeux anniversaire', 'Cyriel !'],
    ariaGateau: 'Ton gâteau d’anniversaire : touche les bougies pour les souffler',
  },
  fin: 'Le café est à toi, cheffe. Reviens quand tu veux !',

  // Les commandes des joueurs du marché (leurs pseudos sont dans joueurs,
  // plus haut).
  commandes: {
    bichette: 'Une omelette bien baveuse, s’il te plaît : j’ai une faim de loup !',
    chachoux: 'Des crêpes à la crème de marron, stp !',
    estel: 'Une salade du jardin, s’il te plaît : j’ai un rendez-vous juste après !',
    gaston: 'Une soupe à la tomate bien chaude : il fait froid en Haute-Loire !',
    angeloune: 'Une mousse au chocolat, comme celle de ma grand-mère !',
    rachou: 'Une tarte à la rhubarbe, s’il te plaît.',
    clement: 'La spécialité de la maison, s’il te plaît : le gâteau rhubarbe et crème de marron.',
  },
  // Quand un ingrédient interdit est dans la casserole (si une commande en
  // a un : sans: [...] dans CLIENTS).
  rappels: {},

  recettes: {
    salade: { nom: 'Salade du jardin', dans: 'une salade du jardin', etape: 'La salade marine', cuit: 'La salade se prépare…' },
    soupe: { nom: 'Soupe à la tomate', dans: 'une soupe à la tomate', etape: 'La soupe mijote', cuit: 'La soupe mijote…' },
    omelette: { nom: 'Omelette', dans: 'une omelette', etape: 'L’omelette dore', cuit: 'L’omelette dore dans la poêle…' },
    mousse: { nom: 'Mousse au chocolat', dans: 'une mousse au chocolat', etape: 'La mousse prend au frais', cuit: 'La mousse prend au frais… pendant trois heures ! Touche le fourneau pour la finir tout de suite.' },
    chocolat: { nom: 'Chocolat chaud', dans: 'un chocolat chaud', etape: 'Le chocolat chauffe', cuit: 'Le chocolat chauffe…' },
    tarte: { nom: 'Tarte à la rhubarbe', dans: 'une tarte à la rhubarbe', etape: 'La tarte dore au four', cuit: 'La tarte dore au four…' },
    crepes: { nom: 'Crêpes à la crème de marron', dans: 'des crêpes', etape: 'Les crêpes dorent', cuit: 'Les crêpes dorent dans la poêle…' },
    gateau: { nom: 'Gâteau rhubarbe et crème de marron', dans: 'ce gâteau', etape: 'Le gâteau cuit', cuit: 'Le gâteau cuit… Ça sent bon la rhubarbe et la crème de marron.' },
  },
  // Les étapes au fourneau : le nom sous la barre qui se remplit.
  gestes: {
    ingredients: 'Ajouter les ingrédients',
    ingredient: (a) => `+ ${a.nom}`,
    nettoyer: 'Nettoyer',
    remuer: 'Remuer', etaler: 'Étaler la pâte', enfourner: 'Enfourner',
    verser: 'Verser la pâte', retourner: 'Retourner la crêpe', melanger: 'Mélanger',
    couper: 'Couper les légumes', battre: 'Battre les œufs', plier: 'Plier l’omelette', fondre: 'Faire fondre le chocolat',
  },


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
    portions: (n) => `Portions : ${n}`,
    portionsSecret: 'Portions : 1',
    pret: (t) => `Prête en : ${t}`,
    parPortion: (n) => `${n} par portion`,
    inconnu: 'Prête en : ???',
    epice: (a) => `Épice (facultative) : ${a.nom}`,
    etoiles: (n) => (n ? `Servie ${n} fois ce soir` : 'Pas encore servie ce soir'),
    toutLa: 'Tout est au frigo : touche un fourneau pour cuisiner !',
    cuisiner: 'Cuisiner',
    marche: 'Boutique',
    auComptoir: (n) => `Au comptoir : ${n}`,
    enRoute: 'Au fourneau',
    personne: (r) => `Personne n’a commandé ${r.dans} pour l’instant.`,
    commandePar: (noms) => `Commandée par ${noms.join(', ')}`,
    manque: 'Il manque des ingrédients : touche le panier au fourneau, ou va au marché !',
    avant: 'Page précédente',
    apres: 'Page suivante',
    page: (n, total) => `${n} / ${total}`,
    commande: 'La commande',
    totalFrigo: (n) => `Au frigo : <b>${n}</b>`,
    reste: (n) => `${n} au frigo`,
  },
  frigo: { titre: 'Frigo', vide: 'Le frigo est vide. Les courses se font au marché !' },
  boutique: { acheter: 'Acheter', vendre: 'Revendre', auFrigo: 'Au frigo :', bourse: 'Ton argent', etals: 'Les étals du marché', vitrine: 'La vitrine', cadeau: 'Cadeau', titreCafe: 'Boutique d’ingrédients' },

  // Le Café chat, en bas à gauche.
  chat: {
    canal: 'Café chat',
    bienvenue: 'Bienvenue !',
    pipistrelle: 'Pipistrelle',
    saisie: 'Ton message…',
    reponses: ['Hihi !', 'Message reçu, cheffe !', 'Je note, je note !'],   // Pipistrelle répond, à tour de rôle
    niveau: (qui, n) => `${qui} passe au niveau ${n} !`,
  },
  // Le niveau dans la tasse, en haut à gauche : il passe à « fin » quand
  // elle souffle ses bougies. L'expérience monte à chaque client servi.
  niveau: { depart: 23, fin: 24, xp: 510, xpMax: 684, xpSuivant: 760 },

  // Les menus. Les boutons du décor font répondre Pipistrelle (messages).
  hud: {
    recettes: 'Livre de recettes',
    frigo: 'Frigo',
    fouet: 'Cuisiner',
    dejaMarche: 'On est déjà au marché ! Le panneau « Café » ramène au café.',
    marchePlusTard: 'Le marché, c’est juste après : écoute d’abord Pipistrelle.',
    niveau: (n) => `Niveau ${n}`,
    xp: 'Expérience',
    pieces: 'Argent',
    popularite: 'Popularité du café',
    sonCouper: 'Couper le son',
    sonRemettre: 'Remettre le son',
    aide: 'Aide',
    plein: 'Plein écran',
    chatHaut: 'Remonter le chat',
    chatBas: 'Descendre le chat',
    envoyer: 'Envoyer',
    etiquettes: {
      carte: 'Carte', reglages: 'Réglages', porte: 'Quitter',
      cadeau: 'Cadeaux', marche: 'Aller au marché', marmite: 'Cuisine', noeud: 'Serveuse', toque: 'Cheffe',
      onglets: ['Café chat', 'Amis', 'Cuisine', 'Ustensiles'],
    },
    messages: {
      carte: 'Une carte du quartier ? Ce soir, tout se passe ici, au café !',
      reglages: 'Les réglages ? Tout est déjà parfait, cheffe.',
      porte: 'Tu pars déjà ? Pas avant la fin du service !',
      cadeau: 'Les cadeaux ? Patience… une surprise t’attend à la fin de la soirée.',
      marmite: 'Pour cuisiner, touche un fourneau.',
      noeud: 'Le nœud papillon, c’est ma petite touche chic !',
      toque: 'La toque de cheffe, c’est toi qui la portes !',
      onglets: ['', 'Tes amis cuisiniers sont en congé ce soir.', 'Ce soir, la cuisine est rien qu’à toi.', 'Tous les ustensiles sont déjà au fourneau !'],
    },
    aideVide: 'Je suis là si tu as besoin, cheffe !',
    pleinIndispo: 'Pas de plein écran sur cet appareil, désolée !',
    fouetFerme: 'Le café n’a pas encore ouvert !',
    fouetMarche: 'Les fourneaux sont au café : rentre pour cuisiner.',
    fouetRien: 'Rien à cuisiner pour l’instant.',
  },

  // Les fenêtres faites d'après les maquettes de Clément (images/fenetres/).
  // La roue de la fortune : le stand aux ballons PLAY, au marché.
  roue: {
    aria: 'Roue de la fortune',
    titre: 'Roue de la fortune !',
    sousTitre: 'Fais tourner la roue et gagne de super prix !',
    gratuit: 'Le premier tour est gratuit !',
    offert: 'Caisse vide ? Ce tour est offert !',
    prix: 'Un tour coûte 10 billets.',
    bouton: 'Faire tourner !',
    libre: 'gratuit',
  },
  // La carte des prix gagnés.
  hourra: {
    titre: 'Hourra !',
    bravo: 'Félicitations !',
    frigo: 'Ton prix se trouve dans ton frigo !',
    bourse: 'Les billets sont dans ta caisse !',
    ok: 'OK',
  },
  // Relever un plat avec son épice (celle du livre : vanille, persil…),
  // si elle est au frigo : le client laisse quelques pièces de plus, et
  // l'expérience monte un peu plus vite.
  epice: {
    question: (a) => `Veux-tu relever ce plat avec ${a.partitif} ?`,
    oui: 'oui',
    non: 'non',
    xp: 3,
    pieces: 10,
    miam: (client, a) => `${client} adore la touche ${a.de} !`,
  },
  // Cuisiner tout de suite : on touche un fourneau qui cuit.
  express: {
    question: 'Cuisiner tout de suite ?',
    encore: (n) => `Encore possible ${n} fois !`,
    fini: 'Plus possible ce soir !',
    pasAssez: 'Il te faut 10 billets !',
    utiliser: 'Cuisiner tout de suite pour 10 billets',
    non: 'non',
    fois: 25,
  },
  // Le tableau noir du marché (pour le décor : rien n'y est touchable).
  tableau: { aria: 'Tableau noir : permis de travail', titre: 'Permis de travail', compte: '4 sur 5', recharger: 'Recharger les permis' },
  // Le petit jeu du camion du chef pâtissier, garé à droite du café.
  garniture: {
    aria: 'Camion du chef pâtissier : Trouve la garniture !',
    titre: 'Trouve la garniture !',
    consigne: 'Le chef a caché de la confiture dans un seul de ses cupcakes. Touche une flèche pour choisir !',
    partie: 'Une partie :',
    offerte: 'Caisse vide : partie offerte !',
    gagne: 'Miam, délicieux ! Tu as trouvé la garniture ! Réessaie tout de suite.',
    rate: 'Raté ! Réessaie !',
    pieces: 'Ton argent',
    cout: 10,
    prix: 30,
    cupcake: (n) => `Cupcake ${n} : choisir`,
  },

  ariaEnveloppe: 'Enveloppe laissée par le client',

  fourneau: {
    toucher: 'touche le fourneau',
    arrive: 'Cyriel arrive…',
    dejaDemande: 'Cyriel s’en occupe !',
    accelerer: 'Accélérer la cuisson 60 fois',
  },
  // Ce qui s'affiche au-dessus des fourneaux (pour les lecteurs d'écran).
  feux: {
    nom: (n) => `Fourneau ${n}`,
    pret: 'prêt !',
    sale: 'à nettoyer',
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
    recommencer: 'Recommencer la partie',
    continuer: 'Continuer',
    fermer: 'Fermer',
  },

  // Le mot de Clément : chaque élément de « paragraphes » devient un paragraphe.
  lettre: {
    titre: 'Pour Cyriel',
    paragraphes: [
      'Bon anniversaire ma caille, ma poulette, ma dinde, ma tourterelle turque, ma grande aigrette que je ne raigrette pas.',
      'Cette année va être belle et radieuse comme le soleil que tu es.',
      'J’ai hâte de te revoir,',
    ],
    signature: 'Clément',
  },
};

/* ============================================================== La partie */

// gestes : ce qu'on fait au fourneau, un toucher par geste.
// cuisson : en vraies minutes, comme dans le jeu d'origine ; le bouton 60x
// la fait passer en autant de secondes.
// prix : ce que laisse le client (par portion) ; xp : l'expérience gagnée ;
// epice : facultative, elle relève le plat (voir TEXTES.epice).
// Les quatre premières viennent de la maquette du livre de Clément.
// La couleur du plat dans la casserole (dessus, bord), une fois mélangé.
const COULEURS_CASSEROLE = {
  salade: ['#8fcf5a', '#5c9a2c'], soupe: ['#e2553e', '#a8301f'], omelette: ['#f6d24c', '#d6a828'],
  mousse: ['#7a4728', '#4f2a14'], chocolat: ['#8a5530', '#5a3218'], tarte: ['#e9b85e', '#b97f30'],
  crepes: ['#f2cf8a', '#cf9a4c'], gateau: ['#d9a06a', '#a46a38'],
};

const RECETTES = {
  salade: { plat: 'saladier', categorie: 'feuille', ingredients: { tomates: 1, oignon: 1, salade: 1 }, gestes: ['couper', 'melanger'], cuisson: 3, prix: 24, xp: 5, portions: 10, epice: 'persil' },
  soupe: { plat: 'soupe', categorie: 'louche', ingredients: { tomates: 1, oignon: 1, creme: 1 }, gestes: ['couper', 'remuer'], cuisson: 10, prix: 14, xp: 17, portions: 12, epice: 'basilic' },
  omelette: { plat: 'omelette', categorie: 'plat', ingredients: { oeufs: 1 }, gestes: ['battre', 'plier'], cuisson: 1, prix: 100, xp: 2, portions: 5, epice: 'piment' },
  mousse: { plat: 'mousse', categorie: 'dessert', ingredients: { oeufs: 1, chocolat: 1, creme: 1 }, gestes: ['fondre', 'battre'], cuisson: 180, prix: 40, xp: 25, portions: 12, epice: 'vanille' },
  chocolat: { plat: 'tasse', categorie: 'boisson', ingredients: { lait: 1, chocolat: 1 }, gestes: ['remuer'], cuisson: 5, prix: 30, xp: 6, portions: 8, epice: 'vanille' },
  tarte: { plat: 'tarte', categorie: 'dessert', ingredients: { farine: 1, beurre: 1, sucre: 1, rhubarbe: 1 }, gestes: ['etaler', 'enfourner'], cuisson: 12, four: true, prix: 45, xp: 12, portions: 8, epice: 'vanille' },
  crepes: { plat: 'crepes', categorie: 'dessert', ingredients: { farine: 1, oeufs: 1, lait: 1, marron: 1 }, gestes: ['verser', 'retourner'], cuisson: 8, prix: 35, xp: 10, portions: 10, epice: 'vanille' },
  gateau: { plat: 'gateau', categorie: 'dessert', ingredients: { rhubarbe: 1, farine: 1, oeufs: 1, sucre: 1, marron: 1 }, gestes: ['melanger', 'enfourner'], cuisson: 15, four: true, prix: 0, xp: 0, portions: 1, secret: true },
};
const ACCELERATION = 60;

// Les clients (les joueurs du marché), leur table et leur commande : la
// recette du livre, telle quelle (on pourrait ajouter plus: { oeufs: 1 } ou
// sans: ['sucre'], le jeu sait encore les gérer). Quatre tables : les deux
// derniers attendent qu'une table se libère (et soit débarrassée).
const CLIENTS = [
  { sorte: 'bichette', table: 1, recette: 'omelette' },
  { sorte: 'chachoux', table: 0, recette: 'crepes' },
  { sorte: 'estel', table: 2, recette: 'salade' },
  { sorte: 'gaston', table: 3, recette: 'soupe' },
  { sorte: 'angeloune', table: 1, recette: 'mousse' },
  { sorte: 'rachou', table: 2, recette: 'tarte' },
];
// Avant eux, beaucoup de clients de passage qui ne demandent rien de précis :
// la serveuse leur apporte ce qu'il y a sur le comptoir.
const PASSANTS = ['passant0', 'passant1', 'passant2', 'passant3', 'passant4', 'passant5'];
const NB_LIBRES = 14;
const CLIENTS_LIBRES = Array.from({ length: NB_LIBRES }, (_, i) => ({ sorte: PASSANTS[(i * 5) % PASSANTS.length], recette: null }));
const SOIREE = [...CLIENTS_LIBRES, ...CLIENTS];
const ARRIVEES = (i) => (i === 0 ? 600 : i < NB_LIBRES ? 3600 : 4200);   // millisecondes avant chaque arrivée
// Les joueurs du marché, dans l'ordre de TEXTES.joueurs (pour leurs pseudos).
const SORTES = ['clement', 'chachoux', 'estel', 'gaston', 'bichette', 'angeloune', 'rachou'];

// Les aliments que Cyriel n'aime pas : vendus au marché comme les autres.
const DETESTES = ['poivron', 'aubergine', 'gingembre', 'coriandre', 'balsamique', 'vin', 'champagne', 'huitres'];
// Les épices (à l'épicerie, ou gagnées à la roue) : l'épice d'une recette
// relève le plat (voir RECETTES). On peut la mettre dans la casserole, ou
// dire oui quand Pipistrelle la propose au moment de cuisiner : vanille,
// persil, basilic, piment.

// Les cases de la roue de la fortune (k : 'pieces' ou un aliment, n : combien).
const SEGMENTS_ROUE = [
  { k: 'pieces', n: 50 }, { k: 'chocolat', n: 1 }, { k: 'vanille', n: 1 }, { k: 'tomates', n: 2 },
  { k: 'pieces', n: 100 }, { k: 'oeufs', n: 2 }, { k: 'persil', n: 1 }, { k: 'pieces', n: 50 },
  { k: 'creme', n: 1 }, { k: 'marron', n: 1 }, { k: 'basilic', n: 1 }, { k: 'farine', n: 2 },
  { k: 'pieces', n: 200 }, { k: 'piment', n: 1 }, { k: 'vanille', n: 1 }, { k: 'rhubarbe', n: 1 },
];

// Chaque étal a son dessin au marché (cabane, cagettes, panneau, kiosque) ;
// couleur : son store et le haut de sa vitrine, fonce : son enseigne.
const ETALS = [
  { cle: 'primeur', nom: 'Primeur', couleur: '#e8553a', fonce: '#b33a20', articles: ['tomates', 'oignon', 'salade', 'rhubarbe', 'poivron', 'aubergine', 'coriandre', 'gingembre'] },
  { cle: 'epicerie', nom: 'Épicerie', couleur: '#8f5cf7', fonce: '#6a3fd0', articles: ['farine', 'sucre', 'chocolat', 'marron', 'vanille', 'persil', 'basilic', 'piment', 'balsamique'] },
  { cle: 'cremerie', nom: 'Crèmerie', couleur: '#3ea6c9', fonce: '#1f7896', articles: ['lait', 'oeufs', 'beurre', 'creme'] },
  { cle: 'cave', nom: 'Cave et marée', couleur: '#e39b2d', fonce: '#a8641a', articles: ['vin', 'champagne', 'huitres'] },
];

// Les prix, en billets (comme dans le jeu : la salade 30, l'oignon 60, les tomates 90).
const PRIX = {
  rhubarbe: 60, farine: 30, sucre: 30, marron: 90, chocolat: 70, oeufs: 40, lait: 30, beurre: 50,
  tomates: 90, oignon: 60, salade: 30, creme: 50, vanille: 80, persil: 30, basilic: 30, piment: 30,
  poivron: 60, aubergine: 60, gingembre: 50, coriandre: 30, balsamique: 100, vin: 150, champagne: 300, huitres: 200,
};

// Les sons de fond du café (dans sons/) et leur volume (1 = normal) : la
// musique du jeu d'origine dans la salle, et les oiseaux et la fontaine du
// marché.
const SONS = {
  salle: { fichier: 'sons/cafe-salle.mp3', volume: 0.12, auMarche: 0.05 },   // auMarche : son volume au marché
  marche: { fichier: 'sons/cafe-marche.mp3', volume: 1 },
};

// L'argent, en billets. Toutes les recettes du soir coûtent environ 1 200
// billets d'ingrédients ; les clients paient en partant (le prix d'une
// portion), et il reste de la marge pour une erreur ou deux (et la roue, le
// camion, si ça coince).
const PIECES_DEPART = 1200;
const PAIEMENT_BEURK = 5;
const PRIX_TOUR = 10;        // un tour de roue
const PRIX_EXPRESS = 10;     // cuisiner tout de suite
const PATIENCE = { horloge: 120000, depart: 360000 };   // ms d'attente : l'horloge, puis il s'en va
const POPULARITE = 19.9;   // la popularité du café au départ (+0,1 par client content)   // ce que laisse un client dégoûté
const VITESSE_MARCHE = 95;  // pixels du décor par seconde
const NS = 'http://www.w3.org/2000/svg';
const L = D.LIEUX;
const ORDRE = Object.keys(D.ARTICLES);

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// … et les espaces avant ! ? : ; » (et après «) deviennent insécables.
const fr = (t) => esc(t).replace(/ ([!?:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
const recette = (cle) => ({ ...RECETTES[cle], ...TEXTES.recettes[cle] });
const nomDe = (sorte) => (sorte.startsWith('passant') ? TEXTES.passants[+sorte.slice(7)] : TEXTES.joueurs[SORTES.indexOf(sorte)]);
const icone = (k) => `<svg viewBox="-24 -24 48 48" aria-hidden="true">${D.ARTICLES[k].dessin()}</svg>`;
const ICONE_PIECE = `<svg viewBox="-12 -12 24 24" aria-hidden="true">${D.billet()}</svg>`;
// Les icônes de la boutique et du livre, comme dans les maquettes.
const ICONE_CHARIOT = `<svg viewBox="-12 -12 24 24" aria-hidden="true"><path d="M-10 -7 H-6.6 L-3.8 5 H6.8 L9.2 -3.6 H-5.4" fill="none" stroke="#5a2a0e" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M-10 -7 H-6.6 L-3.8 5 H6.8 L9.2 -3.6 H-5.4" fill="none" stroke="#f2832e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M-4.6 -0.6 H8" stroke="#f2832e" stroke-width="1.4"/><circle cx="-2.2" cy="8.4" r="2" fill="#f2832e" stroke="#5a2a0e" stroke-width="1"/><circle cx="5.6" cy="8.4" r="2" fill="#f2832e" stroke="#5a2a0e" stroke-width="1"/></svg>`;
const ICONE_CAISSE = `<svg viewBox="-12 -12 24 24" aria-hidden="true"><rect x="-6.4" y="-10" width="12.8" height="7.6" rx="1.2" fill="#fffdf6" stroke="#5a3a1a" stroke-width="1.3"/><path d="M-3.6 -6.2 H3.6" stroke="#5a3a1a" stroke-width="1.2"/><path d="M-10 -1.6 H10 L9 9 H-9 Z" fill="#fffdf6" stroke="#5a3a1a" stroke-width="1.3" stroke-linejoin="round"/><path d="M-6 2 H-2.4 M1 2 H6 M-6 5.4 H-2.4 M1 5.4 H6" stroke="#5a3a1a" stroke-width="1.3" stroke-linecap="round"/></svg>`;
const ICONE_FRIGO_BLEU = `<svg viewBox="-12 -12 24 24" aria-hidden="true"><rect x="-7.4" y="-11" width="14.8" height="22" rx="2.6" fill="#e3edf5" stroke="#6f8aa0" stroke-width="1.3"/><path d="M-7.4 -3.4 H7.4" stroke="#6f8aa0" stroke-width="1.1"/><path d="M4.2 -8.4 V-5.6 M4.2 -0.4 V5" stroke="#6f8aa0" stroke-width="1.5" stroke-linecap="round"/><path d="M-5 -9 V9" stroke="#fff" stroke-width="1.6" opacity=".85"/></svg>`;
const ICONE_FOUET = `<svg viewBox="-12 -12 24 24" aria-hidden="true"><path d="M7 7 L-2 -3" stroke="#5a3a1a" stroke-width="4.6" stroke-linecap="round"/><path d="M7 7 L-2 -3" stroke="#c98a4e" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="-5" cy="-6" rx="5.4" ry="3.6" transform="rotate(45 -5 -6)" fill="#d9a066" stroke="#5a3a1a" stroke-width="1.2"/><path d="M-11 0 Q-14 -8 -8 -12 M11 -2 Q13 -9 7 -11" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".9"/></svg>`;
const ICONE_BOUTIQUE = `<svg viewBox="-30 -27 60 52" aria-hidden="true">
  <defs><radialGradient id="e5-halo-boutique"><stop offset=".55" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="1" cy="1" rx="29" ry="25" fill="url(#e5-halo-boutique)"/>
  <path d="M-15 -8 H17 V9 Q17 16 9 16 H-7 Q-15 16 -15 9 Z" fill="#c4c8cd" stroke="#6f747c" stroke-width="1.4"/>
  <path d="M17 -2 Q23 -2 23 3 Q23 8 17 8" fill="none" stroke="#6f747c" stroke-width="2.4"/>
  <path d="M-11 -6 V10" stroke="#e8ebee" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M-17 -8 Q1 -22 19 -8 Z" fill="#d6d9dd" stroke="#6f747c" stroke-width="1.4" stroke-linejoin="round"/>
  <ellipse cx="1" cy="-17" rx="4.2" ry="3" fill="#d6d9dd" stroke="#6f747c" stroke-width="1.2"/>
  <path d="M-23 -1 H-17 V-7 H-11 V-1 H-5 V5 H-11 V11 H-17 V5 H-23 Z" fill="#e8453c" stroke="#a8261e" stroke-width="1.2" stroke-linejoin="round"/>
  <g transform="rotate(-14 9 7)"><rect x="0" y="0" width="17" height="10" rx="1.2" fill="#b6dd5a" stroke="#6f9a2a" stroke-width="1.1"/><circle cx="8.5" cy="5" r="2.6" fill="none" stroke="#6f9a2a" stroke-width="1"/></g>
  <g fill="#f2c94c" stroke="#b9862a" stroke-width="1"><ellipse cx="-3" cy="17" rx="7.4" ry="2.6"/><ellipse cx="-3" cy="13.6" rx="7.4" ry="2.6"/><ellipse cx="-2" cy="10.2" rx="7.4" ry="2.6"/><ellipse cx="7" cy="12" rx="2.8" ry="7"/></g>
</svg>`;

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

const puces = (map, { toujours = false } = {}) => [...map].map(([k, n]) => `
  <span class="e5-ing">${icone(k)}<span>${esc(D.ARTICLES[k].nom)}</span>${n > 1 || toujours ? `<b>×${n}</b>` : ''}</span>`).join('');

/* ================================================================ Menus */

// Les menus sont découpés dans la maquette de Clément (912 × 1724 pixels) :
// images/hud/gauche, centre, droite, chat et actions. Debout, chaque bloc
// garde sa place de la maquette (les plateaux d'actions par-dessus le coin
// du chat) ; couché (paysage), le chat va dans le coin en bas à gauche et
// les plateaux dans le coin en bas à droite, comme dans le jeu d'origine.
// Tout est mis à l'échelle de l'écran par --u (un pixel de la maquette,
// calculé par cadrer()). Les zones se donnent en pixels de la maquette :
// [x0, y0, x1, y1].
const HUD = {
  gauche: { x: 0, y: 0 },
  centre: { x: 250, y: 2 },
  droite: { x: 630, y: 16 },
  chat: { x: 0, y: 1072 },
  actions: { x: 398, y: 1384 },
};
const ZONES = {
  droite: {
    carte: [634, 22, 682, 84], son: [682, 22, 726, 84], reglages: [726, 22, 774, 84],
    aide: [774, 22, 818, 84], plein: [818, 22, 864, 86], porte: [864, 22, 910, 86],
  },
  chat: {
    'onglet-0': [18, 1076, 96, 1178], 'onglet-1': [98, 1092, 172, 1182],
    'onglet-2': [173, 1078, 248, 1178], 'onglet-3': [248, 1076, 322, 1178],
    'chat-haut': [430, 1200, 476, 1244], 'chat-bas': [430, 1396, 476, 1456], envoyer: [414, 1458, 474, 1514],
  },
  actions: {
    recettes: [604, 1398, 708, 1496], fouet: [708, 1394, 798, 1502], frigo: [798, 1390, 910, 1496],
    cadeau: [426, 1520, 562, 1646], marche: [562, 1524, 650, 1646], marmite: [650, 1530, 730, 1630],
    noeud: [730, 1530, 826, 1630], toque: [826, 1514, 908, 1650],
  },
};
const place = (bloc, [x0, y0, x1, y1]) => `--x:${x0 - bloc.x};--y:${y0 - bloc.y};--l:${x1 - x0};--h:${y1 - y0}`;

function hudHtml() {
  const H = TEXTES.hud;
  const E = H.etiquettes;
  const NOMS = {
    carte: E.carte, son: H.sonCouper, reglages: E.reglages, aide: H.aide, plein: H.plein, porte: E.porte,
    'chat-haut': H.chatHaut, 'chat-bas': H.chatBas, envoyer: H.envoyer,
    recettes: H.recettes, fouet: H.fouet, frigo: H.frigo,
    cadeau: E.cadeau, marche: E.marche, marmite: E.marmite, noeud: E.noeud, toque: E.toque,
  };
  const etiquette = (nom) => NOMS[nom] ?? E.onglets[+nom.split('-')[1]];
  const zones = (bloc) => Object.entries(ZONES[bloc]).map(([nom, r]) => `
        <button type="button" class="e5-zone e5-z" data-hud="${nom}" style="${place(HUD[bloc], r)}" aria-label="${esc(etiquette(nom))}">${nom === 'frigo' ? '<b class="e5-badge" hidden>0</b>' : ''}${nom === 'marche' ? `<svg class="e5-cabane" viewBox="-44 -60 88 120" aria-hidden="true">${D.cabaneMarche()}</svg>` : ''}</button>`).join('');
  const G = HUD.gauche;
  const CH = HUD.chat;
  const A = HUD.actions;
  return `
    <div class="e5-hud">
      <div class="e5-bloc e5-bloc-gauche">
        <span class="e5-bloqueur e5-z" style="${place(G, [0, 0, 256, 150])}"></span>
        <span class="e5-bloqueur e5-z" style="${place(G, [10, 180, 232, 406])}"></span>
        <img class="e5-bloc-img" src="images/hud/gauche.webp" alt="" draggable="false">
        <svg class="e5-niveau e5-z" style="${place(G, [86, 38, 150, 86])}" viewBox="0 0 64 48" role="img"><text x="32" y="36" text-anchor="middle"></text></svg>
        <div class="e5-xp e5-z" style="${place(G, [31, 107, 241, 135])}" role="progressbar" aria-label="${esc(H.xp)}" aria-valuemin="0"><span class="e5-xp-plein"></span><span class="e5-xp-texte"></span></div>
        <span class="e5-pieces-icone e5-z" style="${place(G, [14, 182, 92, 248])}" aria-hidden="true"></span>
        <div class="e5-pieces e5-z" style="${place(G, [92, 202, 222, 238])}" role="status" aria-label="${esc(H.pieces)}"><span>${PIECES_DEPART}</span></div>
        <div class="e5-pieces e5-pieces-or e5-z" style="${place(G, [92, 262, 210, 296])}" aria-hidden="true"><span>0</span></div>
      </div>
      <div class="e5-bloc e5-bloc-centre">
        <img class="e5-bloc-img" src="images/hud/centre.webp" alt="" draggable="false">
        <p class="e5-joueuse e5-z" style="${place(HUD.centre, [270, 16, 612, 64])}">${esc(TEXTES.joueuse)}</p>
        <p class="e5-popularite e5-z" style="${place(HUD.centre, [268, 92, 364, 128])}" role="status" aria-label="${esc(H.popularite)}">${POPULARITE.toFixed(1)}</p>
      </div>
      <div class="e5-bloc e5-bloc-droite">
        <img class="e5-bloc-img" src="images/hud/droite.webp" alt="" draggable="false">${zones('droite')}
      </div>
      <div class="e5-rallonge" aria-hidden="true"></div>
      <div class="e5-bloc e5-bloc-chat">
        <span class="e5-bloqueur e5-z" data-b="chat" style="${place(CH, [0, 1140, 548, 1556])}"></span>
        <span class="e5-bloqueur e5-z" style="${place(CH, [16, 1074, 324, 1182])}"></span>
        <img class="e5-bloc-img" src="images/hud/chat.webp" alt="" draggable="false">
        <div class="e5-chat e5-z" style="${place(CH, [34, 1190, 428, 1436])}" role="log" aria-live="polite" aria-label="${esc(TEXTES.chat.canal)}" tabindex="0"><div class="e5-fil"></div></div>
        <form class="e5-saisie e5-z" style="${place(CH, [40, 1478, 404, 1518])}" autocomplete="off"><input type="text" maxlength="80" enterkeyhint="send" autocomplete="off" placeholder="${esc(TEXTES.chat.saisie)}" aria-label="${esc(TEXTES.chat.saisie)}"></form>${zones('chat')}
      </div>
      <div class="e5-bloc e5-bloc-actions">
        <span class="e5-repere e5-z" data-b="plateaux" style="${place(A, [420, 1388, 912, 1668])}"></span>
        <span class="e5-bloqueur e5-z" style="${place(A, [600, 1388, 912, 1516])}"></span>
        <span class="e5-bloqueur e5-z" style="${place(A, [420, 1516, 912, 1668])}"></span>
        <img class="e5-bloc-img" src="images/hud/actions.webp" alt="" draggable="false">
        <img class="e5-panier e5-z" src="images/hud/panier.webp" style="${place(A, [796, 1394, 910, 1498])}" alt="" draggable="false">${zones('actions')}
      </div>
    </div>`;
}

// Au-dessus de chaque fourneau : la bulle parchemin (ce que le fourneau
// demande, ou le plat prêt) et la barre à segments (une étape en cours, ou
// la cuisson avec son minuteur et son bouton 60x).
const SEGMENTS = 6;
const POINTE = '<svg class="e5-sf-pointe" viewBox="0 0 18 12" aria-hidden="true"><path d="M1 0 L9 11 L17 0"/></svg>';
const surFeuHtml = (k) => `
      <div class="e5-sf" data-k="${k}" data-etat="libre">
        <button type="button" class="e5-sf-bulle"><span class="e5-sf-icones"></span>${POINTE}</button>
        <div class="e5-sf-minuteur">
          <p class="e5-sf-titre"></p>
          <div class="e5-sf-jauge"><div class="e5-sf-barre" aria-hidden="true">${'<span><i></i></span>'.repeat(SEGMENTS)}</div><b class="e5-sf-pourcent"></b></div>
          <div class="e5-sf-pied">
            <span class="e5-sf-legende"></span>
            <span class="e5-sf-temps"></span>
            <button type="button" class="e5-sf-vite" aria-pressed="false" hidden><svg viewBox="0 0 16 12" aria-hidden="true"><path d="M1 1 L7.5 6 L1 11 Z M8.5 1 L15 6 L8.5 11 Z"/></svg><span>60x</span></button>
          </div>${POINTE}
        </div>
        <span class="e5-sf-tige" aria-hidden="true"></span>
      </div>`;

function gabarit() {
  const C = TEXTES.connexion;
  return `
  <div class="e5-jeu">
    <div class="e5-scene">
      <svg class="e5-svg" role="img" aria-label="${esc(TEXTES.nomCafe)}" preserveAspectRatio="xMidYMid meet"></svg>
      <div class="e5-surfeux" hidden>${Array.from({ length: D.NB_FEUX }, (_, k) => surFeuHtml(k)).join('')}
      </div>
      <div class="e5-voile"></div>
    </div>${hudHtml()}
  </div>
  <div class="e5-login gc gc-en-charge">
    <img class="gc-flou" src="${esc(C.image)}" alt="" aria-hidden="true">
    <div class="gc-cadre">
      <img class="gc-image" src="${esc(C.image)}" alt="" decoding="async">
      <div class="gc-contenu">
        <h1 class="gc-cache">${esc(C.titre)}</h1>
        <span class="gc-affiche" aria-hidden="true"></span>
        <button type="button" class="gc-zone gc-jouer" data-e5="jouer-maintenant" aria-label="${esc(C.jouerMaintenant)}"></button>
        <form class="e5-carte gc-panneau" novalidate autocomplete="off">
          <input class="gc-champ gc-pseudo" type="text" placeholder=" " readonly tabindex="-1" aria-label="${esc(C.pseudo)}">
          <input class="gc-champ e5-mdp" type="text" placeholder=" " inputmode="numeric" maxlength="4" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="${esc(C.motDePasse)}" aria-describedby="e5-erreur">
          <label class="gc-zone gc-souvenir"><input type="checkbox" aria-label="${esc(C.souvenir)}"><span class="gc-coche" aria-hidden="true"></span></label>
          <button type="submit" class="gc-zone e5-jouer gc-connexion" aria-label="${esc(C.jouer)}"></button>
          <button type="button" class="gc-zone e5-oubli" aria-label="${esc(C.oubli)}"></button>
          <div class="gc-messages">
            <p class="e5-erreur" id="e5-erreur" role="alert"></p>
            <p class="e5-indice" hidden></p>
          </div>
        </form>
      </div>
    </div>
    <div class="gc-rideau" aria-hidden="true">
      <div class="gc-serveur">
        <p class="gc-serveur-texte">${esc(C.serveur)}</p>
        <div class="e5-barre"><div></div></div>
        <p class="e5-pourcent">0 %</p>
      </div>
      <p class="gc-statut"></p>
    </div>
  </div>`;
}

function demarrer({ scene, son, fx, memoire, debug, aller: allerEtape, numero }) {
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
      <g class="e5-calque-cuisine"></g>
      ${D.comptoir()}
      <g class="e5-calque-plateau"></g>
      <g class="e5-calque-clients"></g>
      ${D.tables()}
      <g class="e5-calque-tables"></g>
      ${D.decorAvant()}
      ${D.camion(TEXTES.garniture.aria, L.camion.x, L.camion.y)}
      <g class="e5-calque-volants"></g>
      <g class="e5-calque-bulles"></g>
    </g>
    <g class="e5-vue" data-vue="marche" style="visibility:hidden">
      ${D.marche(ETALS, TEXTES.joueurs, TEXTES.panneauCafe, TEXTES.roue.aria, TEXTES.tableau.aria)}
    </g>
    <g class="e5-guidage" pointer-events="none">
      <g class="e5-halo" style="display:none"><ellipse class="e5-halo-anim" rx="40" ry="32" fill="none" stroke="#9b6bff" stroke-width="3"/></g>
      <g class="e5-fleche" style="display:none"><path class="e5-fleche-anim" d="M-8 -18 H8 V-7 H15 L0 7 L-15 -7 H-8 Z" fill="#7a3cf0" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></g>
    </g>`;

  const arreterPromeneurs = D.animerPromeneurs(svg.querySelector('[data-vue="marche"]'));
  const calques = {
    cuisine: $('.e5-calque-cuisine'),
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
  // Au marché, la musique de la salle continue, plus doucement, sous les
  // oiseaux et la fontaine.
  const ambiance = (nom) => {
    if (!vivant) return;
    if (nom === 'marche') son.ambiance([{ url: SONS.marche.fichier, volume: SONS.marche.volume }, { url: SONS.salle.fichier, volume: SONS.salle.auMarche }]);
    else son.ambiance(nom ? SONS[nom].fichier : null, nom ? SONS[nom].volume : 1);
  };

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
  const surfeux = $('.e5-surfeux');     // bulles et minuteurs au-dessus des fourneaux
  let feux = [];
  // Chaque vue a son cadre (la salle du café, la place du marché) : il tient
  // toujours en entier dans l'espace libre entre les menus ; le décor
  // déborde autour, sous les menus.
  const CADRES = { cafe: D.CADRE_CAFE, marche: D.CADRE_MARCHE };
  let cadreCourant = CADRES.cafe;
  const blocCentre = $('.e5-bloc-centre');
  const repereChat = $('[data-b="chat"]');
  const reperePlateaux = $('[data-b="plateaux"]');
  function cadrer() {
    const l = zone.clientWidth;
    const h = zone.clientHeight;
    if (!l || !h) return;
    // Couché (paysage) ou debout : les menus changent de place (voir HUD),
    // et leur taille suit la hauteur ou la largeur de l'écran.
    const paysage = l > h;
    racine.dataset.mise = paysage ? 'paysage' : 'portrait';
    const u = paysage ? Math.max(0.34, Math.min(h / 1050, 0.62)) : Math.max(0.3, Math.min(l / 912, h / 1724, 0.62));
    racine.style.setProperty('--u', `${u.toFixed(4)}px`);
    racine.style.setProperty('--zl', `${l}px`);
    racine.style.setProperty('--zh', `${h}px`);
    // L'espace libre pour la salle : sous le bandeau, et au choix au-dessus
    // des menus du bas, entre le chat et les plateaux, ou au-dessus des
    // plateaux en laissant le chat de côté. On garde celui où elle est la
    // plus grande.
    const r = zone.getBoundingClientRect();
    const boite = (el) => {
      const b = el.getBoundingClientRect();
      return { x0: b.left - r.left, y0: b.top - r.top, x1: b.right - r.left, y1: b.bottom - r.top };
    };
    const m = 6;
    const haut = boite(blocCentre).y1 + m;
    const chat = boite(repereChat);
    const plat = boite(reperePlateaux);
    let c = cadreCourant;
    // Couché, la salle prend toute la hauteur de l'écran, comme dans le jeu :
    // les menus se posent par-dessus ses coins.
    if (paysage && cadreCourant === CADRES.cafe) {
      c = D.CADRE_CAFE_PAYSAGE;
      const kp = Math.min(l / c.l, h / c.h);
      const vxp = c.x + c.l / 2 - l / 2 / kp;
      const vyp = c.y + c.h / 2 - h / 2 / kp;
      svg.setAttribute('viewBox', `${vxp.toFixed(1)} ${vyp.toFixed(1)} ${(l / kp).toFixed(1)} ${(h / kp).toFixed(1)}`);
      surfeux.style.setProperty('--z', Math.min(1.5, Math.max(0.8, kp)).toFixed(3));
      placerSurFeux();
      return;
    }
    const espaces = [
      { x0: 0, x1: l, y0: haut, y1: Math.min(chat.y0, plat.y0) - m },
      { x0: chat.x1 + m, x1: plat.x0 - m, y0: haut, y1: h - m },
      { x0: chat.x1 + m, x1: l - chat.x1 - m, y0: haut, y1: plat.y0 - m },
    ];
    let e = null;
    let k = 0;
    for (const x of espaces) {
      const kx = Math.min((x.x1 - x.x0) / c.l, (x.y1 - x.y0) / c.h);
      if (kx > k) { k = kx; e = x; }
    }
    if (!e || k < 0.2) {                 // écran minuscule : tant pis pour les menus
      e = { x0: 0, x1: l, y0: 0, y1: h };
      k = Math.min(l / c.l, h / c.h);
    }
    const vx = c.x + c.l / 2 - (e.x0 + e.x1) / 2 / k;
    const vy = c.y + c.h / 2 - (e.y0 + e.y1) / 2 / k;
    svg.setAttribute('viewBox', `${vx.toFixed(1)} ${vy.toFixed(1)} ${(l / k).toFixed(1)} ${(h / k).toFixed(1)}`);
    surfeux.style.setProperty('--z', Math.min(1.5, Math.max(0.8, k)).toFixed(3));
    placerSurFeux();
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

  // Pipistrelle parle dans le Café chat, en bas à gauche ; ses questions
  // s'affichent en boutons sous son message.
  const CH = TEXTES.chat;
  const chat = $('.e5-chat');
  const fil = $('.e5-fil');
  const zoneChoix = document.createElement('div');
  zoneChoix.className = 'e5-choix';
  let parole = 0;
  let texteDeFond = '';

  const defiler = () => requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
  function derniereLigne() {
    const l = fil.lastElementChild;
    return l === zoneChoix ? l.previousElementSibling : l;
  }
  // Une ligne du chat. La même ligne deux fois de suite clignote au lieu de
  // se répéter ; les boutons de réponse restent toujours en dessous.
  function ligne(qui, t, classe = 'e5-de-pipi') {
    const der = derniereLigne();
    if (der && der.dataset.qui === qui && der.dataset.texte === t) {
      der.classList.remove('e5-flash');
      void der.offsetWidth;
      der.classList.add('e5-flash');
      defiler();
      return der;
    }
    const p = document.createElement('p');
    p.className = `e5-ligne ${classe}`;
    p.dataset.qui = qui;
    p.dataset.texte = t;
    const nom = document.createElement('b');
    nom.textContent = `${qui} :`;
    p.append(nom, ` ${t}`);
    fil.insertBefore(p, zoneChoix.parentNode === fil ? zoneChoix : null);
    while (fil.childElementCount > 60 && fil.firstElementChild !== zoneChoix) fil.firstElementChild.remove();
    defiler();
    return p;
  }
  ligne(CH.canal, CH.bienvenue, 'e5-systeme');

  // Pipistrelle parle ; avec des choix, renvoie l'indice du bouton touché.
  function dire(t, choix = []) {
    const tour = ++parole;
    texteDeFond = t;
    zoneChoix.replaceChildren();
    zoneChoix.remove();
    ligne(CH.pipistrelle, t);
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
          zoneChoix.replaceChildren();
          zoneChoix.remove();
          resolve(i);
        });
        zoneChoix.append(b);
      });
      fil.append(zoneChoix);
      defiler();
    });
  }
  // Remarque passagère : une ligne de plus (les boutons restent en dessous).
  function direUnInstant(t) {
    ligne(CH.pipistrelle, t);
  }

  // Ce qu'elle écrit apparaît aussi dans une bulle au-dessus de sa tête,
  // comme dans le jeu, et la suit quand elle se déplace.
  let bulleCy = null;
  let finBulle = 0;
  function parler(t) {
    bulleCy?.remove();
    clearTimeout(finBulle);
    bulleCy = svgEl('g', { class: 'e5-parole', 'aria-hidden': 'true' }, cy.g);
    bulleCy.innerHTML = `<g transform="translate(0 ${CY_HAUT})"><g class="e5-pop">${D.bulleParole(t)}</g></g>`;
    const b = bulleCy;
    finBulle = setTimeout(() => {
      animer(b, [{ opacity: 1 }, { opacity: 0 }], { duree: 300, garder: false }).then(() => b.remove());
      if (bulleCy === b) bulleCy = null;
    }, 2500 + t.length * 60);
    minuteurs.add(finBulle);
  }

  // Elle peut écrire aussi ; Pipistrelle répond.
  const saisie = $('.e5-saisie');
  const champ = saisie.querySelector('input');
  let reponse = 0;
  saisie.addEventListener('submit', (e) => {
    e.preventDefault();
    const t = champ.value.trim();
    if (!t) return;
    champ.value = '';
    bip('clic', 0.4);
    ligne(TEXTES.joueuse, t, 'e5-de-moi');
    parler(t);
    const r = CH.reponses.length ? CH.reponses[reponse++ % CH.reponses.length] : '';
    if (r) dormir(900).then(() => { if (vivant) ligne(CH.pipistrelle, r); });
  });

  let pieces = PIECES_DEPART;
  const bourse = $('.e5-pieces');
  const compteur = bourse.querySelector('span');
  const bourseIcone = $('.e5-pieces-icone');
  function ajouterPieces(n) {
    pieces += n;
    compteur.textContent = pieces.toLocaleString('fr-FR');
    animer(bourse, [{ transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duree: 260, garder: false });
  }

  // Le niveau dans la tasse et la barre d'expérience.
  const N = TEXTES.niveau;
  // Chaque partie commence au niveau 23 : le gâteau de la fin fait passer 24.
  let niveau = N.depart;
  let xp = N.xp;
  let xpMax = N.xpMax;
  const blocNiveau = $('.e5-niveau');
  const xpBarre = $('.e5-xp');
  function majXp() {
    blocNiveau.querySelector('text').textContent = String(niveau);
    blocNiveau.setAttribute('aria-label', TEXTES.hud.niveau(niveau));
    xpBarre.querySelector('.e5-xp-plein').style.width = `${Math.round((xp / xpMax) * 1000) / 10}%`;
    xpBarre.querySelector('.e5-xp-texte').textContent = `${xp} / ${xpMax}`;
    xpBarre.setAttribute('aria-valuenow', String(xp));
    xpBarre.setAttribute('aria-valuemax', String(xpMax));
  }
  majXp();
  function gagnerXp(n) {
    xp = Math.min(xpMax, xp + n);
    majXp();
    animer(xpBarre, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duree: 420, garder: false });
  }
  // Elle souffle ses bougies : la barre se remplit, elle passe au niveau suivant.
  async function monterNiveau() {
    if (niveau >= N.fin) return;
    gagnerXp(xpMax - xp);
    await dormir(800);
    if (!vivant) return;
    niveau = N.fin;
    xp = 0;
    xpMax = N.xpSuivant;
    majXp();
    bip('eclat');
    animer(blocNiveau, [{ transform: 'scale(1)' }, { transform: 'scale(1.7) rotate(-8deg)' }, { transform: 'scale(1)' }], { duree: 750, easing: 'cubic-bezier(.3,1.5,.5,1)', garder: false });
    const c = centre(blocNiveau);
    coeurs(c.x, c.y, 10);
    ligne(CH.canal, CH.niveau(TEXTES.joueuse, niveau), 'e5-systeme');
  }

  const pipi = svgEl('g', { class: 'e5-pipi' }, calques.volants);
  pipi.innerHTML = `<g class="e5-flotte"><g transform="scale(.78)">${D.pipistrelle()}</g></g>`;
  placer(pipi, L.pipi.x, L.pipi.y);

  // Cyriel, en cheffe : elle passe d'un fourneau à l'autre et sert les plats.
  // En cuisine, elle est derrière le comptoir ; dans la salle, avec les clients.
  const cy = { g: svgEl('g', { class: 'e5-cyriel' }, calques.cuisine) };
  cy.corps = svgEl('g', { class: 'e5-corps' }, cy.g);
  cy.corps.innerHTML = `<g transform="scale(${L.echelle})">${D.cheffe()}</g>`;
  const cyPlat = cy.corps.querySelector('.e5-cy-plat');
  const CY_HAUT = -86 * L.echelle;      // le haut de sa toque, au-dessus de ses pieds
  placer(cy.g, L.cyriel.x, L.cyriel.y);
  let cyLibre = Promise.resolve();


  /* -------------------------------------------------------------- Les vues */

  const vues = { cafe: $('[data-vue="cafe"]'), marche: $('[data-vue="marche"]') };
  racine.dataset.vue = 'cafe';
  const voile = $('.e5-voile');
  let vue = 'cafe';
  let enTransition = false;
  const attenteCafe = [];
  async function changerVue(nom) {
    fermerFenetre();
    enTransition = true;
    await animer(voile, [{ opacity: 0 }, { opacity: 1 }], { duree: 260 });
    for (const [k, v] of Object.entries(vues)) v.style.visibility = k === nom ? '' : 'hidden';
    racine.dataset.vue = nom;
    cadreCourant = CADRES[nom];
    cadrer();
    vue = nom;
    ambiance(nom === 'marche' ? 'marche' : 'salle');
    montrerSurFeux();
    await animer(voile, [{ opacity: 1 }, { opacity: 0 }], { duree: 320 });
    enTransition = false;
    if (nom === 'cafe') attenteCafe.splice(0).forEach((r) => r());
  }
  const enCafe = () => (vue === 'cafe' ? Promise.resolve() : new Promise((r) => attenteCafe.push(r)));

  /* -------------------------------------------------------------- Le frigo */

  const frigo = new Map();
  const nb = (k) => frigo.get(k) || 0;
  const pot = new Map();               // la casserole, posée sur le fourneau
  let outilsPrets = false;              // le livre et le frigo, après les présentations
  const boutonRecettes = $('[data-hud="recettes"]');
  const boutonFrigo = $('[data-hud="frigo"]');
  const panier = $('.e5-panier');
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

  /* ----------------------------------- Les fenêtres d'après les maquettes */

  // L'image de chaque fenêtre (images/fenetres/, sans ses textes tchèques) et,
  // par-dessus, les textes en français et les boutons, placés en pixels de
  // l'image : [x0, y0, x1, y1]. --t : la taille du texte, en % de la largeur.
  const MAQ = {
    roue: { l: 539, h: 588 },
    hourra: { l: 415, h: 407 },
    epice: { l: 432, h: 419, image: 'vanille' },
    express: { l: 432, h: 288 },
    garniture: { l: 532, h: 588 },
  };
  const ici = (m, [x0, y0, x1, y1], t = 0) => `left:${((x0 / m.l) * 100).toFixed(2)}%;top:${((y0 / m.h) * 100).toFixed(2)}%;width:${(((x1 - x0) / m.l) * 100).toFixed(2)}%;height:${(((y1 - y0) / m.h) * 100).toFixed(2)}%${t ? `;--t:${t}` : ''}`;

  // dessus : la fenêtre s'ouvre par-dessus la fenêtre en cours (le « Hourra ! »
  // sur la roue), sans la fermer. ctrl.bloque : on ne peut pas la fermer
  // (la roue qui tourne).
  function maquette(nom, { genre = nom, aria, html, dessus = false }) {
    const m = MAQ[nom];
    if (!dessus) fermerFenetre();
    const f = document.createElement('div');
    f.className = `e5-fenetre e5-fen-maq e5-fen-${nom}${dessus ? ' e5-sur' : ''}`;
    f.innerHTML = `
      <div class="e5-maq" role="dialog" aria-modal="true" aria-label="${esc(aria)}" tabindex="-1" style="--l:${m.l};--h:${m.h}">
        <img class="e5-maq-fond" src="images/fenetres/${m.image || nom}.webp" alt="" draggable="false">
        ${html}
      </div>`;
    zone.append(f);
    const cadre = f.firstElementChild;
    let resoudre;
    const avant = document.activeElement;
    const ctrl = {
      genre,
      el: f,
      cadre,
      m,
      resultat: new Promise((r) => { resoudre = r; }),
      ferme: false,
      bloque: false,
      fermer(valeur = null) {
        if (ctrl.ferme) return;
        ctrl.ferme = true;
        if (fenetreCourante === ctrl) fenetreCourante = null;
        animer(f, [{ opacity: 1 }, { opacity: 0 }], { duree: 160, garder: false }).then(() => f.remove());
        f.style.pointerEvents = 'none';
        if (dessus) {
          const retour = avant && avant.isConnected && avant !== document.body && !avant.disabled ? avant : fenetreCourante?.cadre;
          retour?.focus({ preventScroll: true });
        }
        resoudre(valeur);
      },
    };
    const fermer = () => { if (!ctrl.bloque) ctrl.fermer(null); };
    for (const b of f.querySelectorAll('.e5-mcroix')) b.addEventListener('click', () => { if (!ctrl.bloque) bip('clic', 0.3); fermer(); });
    f.addEventListener('click', (e) => { if (e.target === f) fermer(); });
    f.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); fermer(); } });
    animer(f, [{ opacity: 0 }, { opacity: 1 }], { duree: 160, garder: false });
    animer(cadre, [{ transform: 'translateY(10px) scale(.92)' }, { transform: 'none' }], { duree: 280, easing: 'cubic-bezier(.3,1.4,.5,1)', garder: false });
    if (!dessus) fenetreCourante = ctrl;
    cadre.focus({ preventScroll: true });
    return ctrl;
  }
  const croix = (m, b) => `<button type="button" class="e5-m e5-mcroix" style="${ici(m, b)}" aria-label="${esc(TEXTES.boutons.fermer)}"></button>`;

  // Un dessin d'aliment ou de pièce, pour les fenêtres et les envols.
  const dessinPrix = (k) => (k === 'pieces' ? { dessin: D.billet(), boite: '-12 -12 24 24' } : { dessin: D.ARTICLES[k].dessin(), boite: '-24 -24 48 48' });

  // « Hourra ! » : le prix gagné (à la roue, au camion du chef).
  function hourra(k, n, message) {
    const m = MAQ.hourra;
    const H = TEXTES.hourra;
    const p = dessinPrix(k);
    const f = maquette('hourra', {
      dessus: true,
      aria: `${H.titre} ${message}`,
      html: `
        <p class="e5-m e5-mtitre e5-rouge" style="${ici(m, [92, 20, 324, 74], 11.5)}">${fr(H.titre)}</p>
        <p class="e5-m e5-mtexte" style="${ici(m, [100, 82, 316, 108], 4.4)}">${fr(H.bravo)}</p>
        <p class="e5-m e5-mtexte" style="${ici(m, [80, 110, 336, 180], 4.4)}">${fr(message)}</p>
        <svg class="e5-m e5-mprix" style="${ici(m, [163, 200, 247, 284])}" viewBox="${p.boite}" aria-hidden="true">${p.dessin}</svg>
        <p class="e5-m e5-mtitre" style="${ici(m, [146, 292, 266, 328], 6.6)}">× ${n}</p>
        <button type="button" class="e5-m e5-mbouton" data-e5="hourra-ok" style="${ici(m, [151, 347, 255, 383], 5)}">${esc(H.ok)}</button>`,
    });
    f.el.querySelector('[data-e5="hourra-ok"]').addEventListener('click', () => { bip('clic', 0.5); f.fermer(true); });
    animer(f.el.querySelector('.e5-mprix'), [{ transform: 'scale(.2) rotate(-30deg)' }, { transform: 'scale(1.15) rotate(6deg)', offset: 0.7 }, { transform: 'none' }], { duree: 620, easing: 'ease-out', garder: false });
    bip('eclat');
    return f.resultat;
  }

  // Le prix arrive : les pièces dans la bourse, les aliments au frigo.
  function encaisser(k, n, de) {
    if (k === 'pieces') {
      return envolee(D.billet(), de, centre(bourseIcone), { taille: 30, boite: '-12 -12 24 24', duree: 650 })
        .then(() => { ajouterPieces(n); bip('piece'); });
    }
    frigo.set(k, nb(k) + n);
    majBadge();
    if (achats) for (let i = 0; i < n; i++) achats.push(k);
    return envolee(D.ARTICLES[k].dessin(), de, centre(panier), { duree: 650, taille: 36 }).then(() => rebondir(panier));
  }

  /* ---------------------------------------------- La roue de la fortune */

  // Le stand aux ballons PLAY, au marché. Le premier tour est gratuit, puis
  // un tour coûte une pièce, sauf si la bourse est vide : il est offert,
  // pour pouvoir se débloquer.
  let toursDeRoue = 0;
  let angleRoue = 0;
  const N_ROUE = SEGMENTS_ROUE.length;
  function roueSvg() {
    const pas = 360 / N_ROUE;
    const R = 158;
    const rad = (a) => ((a - 90) * Math.PI) / 180;
    const pt = (a, r) => `${(Math.cos(rad(a)) * r).toFixed(1)} ${(Math.sin(rad(a)) * r).toFixed(1)}`;
    const quartiers = SEGMENTS_ROUE.map((s, i) => {
      const a0 = (i - 0.5) * pas;
      const a1 = (i + 0.5) * pas;
      const couleur = i % (N_ROUE / 4) === 0 && i % (N_ROUE / 2) !== 0 ? '#e2412d' : i % 2 ? '#fde58c' : '#f07a2a';
      const p = dessinPrix(s.k);
      const taille = s.k === 'pieces' ? 26 : 34;
      const nombre = s.k === 'pieces' || s.n > 1 ? `<text y="${taille / 2 + 11}" text-anchor="middle" font-size="12" font-weight="700" fill="#5a2a12" stroke="#fff6dc" stroke-width="2.6" paint-order="stroke">${s.k === 'pieces' ? s.n : `×${s.n}`}</text>` : '';
      return `<g data-i="${i}">
        <path class="e5-roue-part" d="M0 0 L${pt(a0, R)} A${R} ${R} 0 0 1 ${pt(a1, R)} Z" fill="${couleur}"/>
        <g transform="rotate(${(i * pas).toFixed(2)}) translate(0 -112)">
          <svg x="${-taille / 2}" y="${-taille / 2}" width="${taille}" height="${taille}" viewBox="${p.boite}" overflow="visible">${p.dessin}</svg>${nombre}
        </g>
      </g>`;
    }).join('');
    return `
      <g class="e5-roue-disque">
        <circle r="${R + 1}" fill="#fff5d6"/>
        ${quartiers}
        <circle r="${R}" fill="none" stroke="#c9b48a" stroke-width="2"/>
        <circle r="13" fill="#4a4a52"/><circle r="13" fill="url(#e5-moyeu)"/><circle cx="-4" cy="-5" r="3.4" fill="#fff" opacity=".55"/>
      </g>
      <defs><radialGradient id="e5-moyeu" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#9a9aa6"/><stop offset="1" stop-color="#2a2a30"/></radialGradient></defs>
      <g class="e5-roue-aiguille">
        <path d="M0 -146 L-9 -168 Q-10 -180 0 -184 Q10 -180 9 -168 Z" fill="#e8ebef" stroke="#6f747c" stroke-width="2" stroke-linejoin="round"/>
        <path d="M-3 -174 Q-2 -179 2 -180" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>`;
  }

  function fenetreRoue() {
    const m = MAQ.roue;
    const T = TEXTES.roue;
    const f = maquette('roue', {
      genre: 'roue',
      aria: T.titre,
      html: `
        <p class="e5-m e5-mtitre" style="${ici(m, [70, 8, 444, 50], 6.4)}">${fr(T.titre)}</p>
        ${croix(m, [480, 4, 534, 58])}
        <p class="e5-m e5-mtexte e5-gras" style="${ici(m, [52, 84, 486, 124], 3.4)}">${fr(T.sousTitre)}</p>
        <svg class="e5-m e5-roue" style="${ici(m, [99, 162, 439, 502])}" viewBox="-170 -170 340 340" role="img" aria-label="${esc(T.aria)}">${roueSvg()}</svg>
        <p class="e5-m e5-mnote" style="${ici(m, [14, 494, 178, 566], 3.5)}"></p>
        <button type="button" class="e5-m e5-mbouton" data-e5="roue-tourner" style="${ici(m, [190, 518, 348, 556], 3.7)}">${fr(T.bouton)}</button>`,
    });
    const disque = f.el.querySelector('.e5-roue-disque');
    const note = f.el.querySelector('.e5-mnote');
    const bouton = f.el.querySelector('[data-e5="roue-tourner"]');
    disque.style.transform = `rotate(${angleRoue}deg)`;
    const prixTour = () => (toursDeRoue === 0 || pieces < PRIX_TOUR ? 0 : PRIX_TOUR);
    const majNote = () => { note.innerHTML = fr(toursDeRoue === 0 ? T.gratuit : pieces < PRIX_TOUR ? T.offert : T.prix); };
    majNote();

    async function tourner() {
      if (f.bloque || f.ferme) return;
      const cout = prixTour();
      if (cout > pieces) { bip('non'); secouer(bourse); return; }
      f.bloque = true;
      bouton.disabled = true;
      if (cout) ajouterPieces(-cout);
      toursDeRoue += 1;
      bip('clic', 0.7);
      // Un peu d'aide quand la bourse est presque vide : plus de chances de
      // tomber sur des pièces.
      const aPieces = SEGMENTS_ROUE.map((s, i) => [s, i]).filter(([s]) => s.k === 'pieces').map(([, i]) => i);
      const gagnant = pieces < 5 && Math.random() < 0.6
        ? aPieces[Math.floor(Math.random() * aPieces.length)]
        : Math.floor(Math.random() * N_ROUE);
      const pas = 360 / N_ROUE;
      const depart = angleRoue;
      const vise = -gagnant * pas + (Math.random() - 0.5) * pas * 0.6;
      const arrivee = depart - (((depart - vise) % 360) + 360) % 360 + 360 * 5;
      const duree = 4300 / V;
      const a = disque.animate([{ transform: `rotate(${depart}deg)` }, { transform: `rotate(${arrivee}deg)` }], { duration: duree, easing: 'cubic-bezier(.15,.75,.2,1)', fill: 'forwards' });
      // le cliquetis de l'aiguille à chaque case
      let derniere = Math.floor((depart + pas / 2) / pas);
      const cliquetis = () => {
        if (!vivant || a.playState === 'finished') return;
        const t = Math.min(1, (a.currentTime || 0) / duree);
        const e = 1 - (1 - t) ** 3;
        const ang = depart + (arrivee - depart) * e;
        const c = Math.floor((ang + pas / 2) / pas);
        if (c !== derniere) { derniere = c; bip('tic'); }
        requestAnimationFrame(cliquetis);
      };
      requestAnimationFrame(cliquetis);
      try { await a.finished; } catch { /* fenêtre fermée */ }
      angleRoue = ((arrivee % 360) + 360) % 360;
      disque.style.transform = `rotate(${angleRoue}deg)`;
      a.cancel();
      if (!vivant) return;
      const s = SEGMENTS_ROUE[gagnant];
      const part = disque.querySelector(`[data-i="${gagnant}"] .e5-roue-part`);
      part.classList.add('e5-gagnant');
      bip('ding');
      await dormir(700);
      await hourra(s.k, s.n, s.k === 'pieces' ? TEXTES.hourra.bourse : TEXTES.hourra.frigo);
      part.classList.remove('e5-gagnant');
      await encaisser(s.k, s.n, centre(f.el.querySelector('.e5-roue')));
      f.bloque = false;
      bouton.disabled = false;
      if (!f.el.contains(document.activeElement)) bouton.focus({ preventScroll: true });
      majNote();
      fenetreCourante?.majTotal?.();
    }
    bouton.addEventListener('click', tourner);
    surToucher(f.el.querySelector('.e5-roue'), tourner);
    return f.resultat;
  }

  /* ------------------------------------- Relever le plat avec son épice */

  function proposerEpice(k) {
    const m = MAQ.epice;
    const T = TEXTES.epice;
    const a = D.ARTICLES[k];
    const f = maquette('epice', {
      aria: T.question(a),
      html: `
        ${croix(m, [384, 0, 432, 48])}
        <p class="e5-m e5-mtitre" style="${ici(m, [50, 40, 366, 138], 6.2)}">${fr(T.question(a))}</p>
        ${k === 'vanille' ? '' : `<div class="e5-m e5-mplaque" style="${ici(m, [161, 172, 248, 236])}"><svg viewBox="-24 -24 48 48" aria-hidden="true">${a.dessin()}</svg></div>`}
        <p class="e5-m e5-mgain" style="${ici(m, [184, 252, 270, 282], 4.4)}">+ ${T.xp}</p>
        <svg class="e5-m" style="${ici(m, [145, 286, 173, 314])}" viewBox="-12 -12 24 24" aria-hidden="true">${D.billet()}</svg>
        <p class="e5-m e5-mgain" style="${ici(m, [184, 286, 270, 314], 4.4)}">+ ${T.pieces}</p>
        <button type="button" class="e5-m e5-mbouton" data-e5="epice-oui" style="${ici(m, [62, 362, 162, 396], 4.4)}">${esc(T.oui)}</button>
        <button type="button" class="e5-m e5-mbouton e5-orange" data-e5="epice-non" style="${ici(m, [250, 362, 352, 396], 4.4)}">${esc(T.non)}</button>`,
    });
    f.el.querySelector('[data-e5="epice-oui"]').addEventListener('click', () => { bip('clic', 0.7); f.fermer(true); });
    f.el.querySelector('[data-e5="epice-non"]').addEventListener('click', () => { bip('clic', 0.3); f.fermer(false); });
    return f.resultat.then((v) => v === true);
  }

  /* ------------------------------------------ Cuisiner tout de suite */

  let expressRestant = TEXTES.express.fois;
  function proposerExpress(feu) {
    const m = MAQ.express;
    const T = TEXTES.express;
    const f = maquette('express', {
      aria: T.question,
      html: `
        ${croix(m, [384, 0, 432, 48])}
        <p class="e5-m e5-mtitre" style="${ici(m, [50, 46, 382, 104], 6.4)}">${fr(T.question)}</p>
        <p class="e5-m e5-mtitre e5-mencore" style="${ici(m, [50, 124, 382, 182], 6.4)}">${fr(T.encore(expressRestant))}</p>
        <button type="button" class="e5-m e5-mtoque" data-e5="express-oui" style="${ici(m, [56, 198, 138, 268])}" aria-label="${esc(T.utiliser)}"></button>
        <p class="e5-m e5-mfois" style="${ici(m, [138, 200, 176, 222], 3.6)}" aria-hidden="true">×1</p>
        <button type="button" class="e5-m e5-mbouton e5-orange" data-e5="express-non" style="${ici(m, [252, 226, 354, 258], 4.2)}">${esc(T.non)}</button>`,
    });
    f.el.querySelector('[data-e5="express-non"]').addEventListener('click', () => { bip('clic', 0.3); f.fermer(false); });
    f.el.querySelector('[data-e5="express-oui"]').addEventListener('click', () => {
      if (feu.etat !== 'cuisson') { f.fermer(false); return; }
      if (pieces < PRIX_EXPRESS) {
        bip('non');
        secouer(bourse);
        const l = f.el.querySelector('.e5-mencore');
        l.innerHTML = fr(T.pasAssez);
        secouer(l);
        return;
      }
      ajouterPieces(-PRIX_EXPRESS);
      expressRestant -= 1;
      feu.fait = feu.total;
      bip('eclat');
      const c = versEcran(feu.lieu.casserole.x, feu.lieu.casserole.y - 10);
      if (vivant) fx.etincelles(c.x, c.y, 14, '#ffd27a', 90);
      f.fermer(true);
    });
    return f.resultat;
  }

  /* -------------------------------- Le camion : « Trouve la garniture » */

  // Le chef pâtissier a caché de la confiture dans un de ses trois cupcakes.
  // Une partie coûte une pièce (offerte si la bourse est vide) ; trouver la
  // garniture en rapporte trois.
  const CUPCAKES = [120, 267, 414];   // le milieu de chaque cupcake, dans l'image
  const FONDS_CUPCAKES = ['#fcf6f0', '#ffffff', '#b4d9cf'];   // ce qu'il y a derrière leur côté droit
  // La morsure, en haut à droite du dôme : des marques de dents qui
  // entament le chocolat, la mie autour, et la confiture si c'était le bon.
  const MORSURE = (() => {
    const dome = [[316, -21, 21], [320, -28, 29], [324, -34, 35], [328, -39, 40], [332, -43, 44], [336, -47, 48], [340, -51, 51], [344, -54, 54], [348, -56, 56], [352, -58, 58], [356, -59, 59], [360, -61, 60], [368, -61, 60], [372, -60, 59], [376, -55, 56], [380, -51, 50]];
    const pts = [...dome.map(([y, , d]) => [d + 2, y]), ...dome.slice().reverse().map(([y, g]) => [g - 2, y])];
    const cx = 50, cy = 314, R = 31, n = 8, a0 = Math.PI * 0.32, a1 = Math.PI * 1.62;
    const P = (a, r) => [cx + r * Math.cos(a), cy + r * Math.sin(a)].map((v) => v.toFixed(1)).join(' ');
    let trou = `M${P(a0, R)}`;
    for (let i = 1; i <= n; i++) trou += ` Q${P(a0 + (a1 - a0) * (i - 0.5) / n, R + 9)} ${P(a0 + (a1 - a0) * i / n, R)}`;
    trou += ` L${P(a1, R + 40)} L${cx + 60} ${cy - 60} L${P(a0, R + 40)} Z`;
    // La confiture : un croissant le long de la morsure, et deux coulures.
    let arc = `M${P(Math.PI * 0.72, R + 7)}`;
    for (let k = 1; k <= 8; k++) arc += ` L${P(Math.PI * (0.72 + 0.4 * k / 8), R + 7)}`;
    const [bx, by] = [cx + (R + 7) * Math.cos(Math.PI * 0.8), cy + (R + 7) * Math.sin(Math.PI * 0.8)];
    const coulures = `M${(bx - 2).toFixed(1)} ${by.toFixed(1)} q-1 10 1 16 q2 5 4 0 q1 -7 -1 -14 Z M${(bx + 9).toFixed(1)} ${(by + 3).toFixed(1)} q0 6 1.5 9 q2 3 3 -1 q0 -4 -2 -8 Z`;
    return { dome: `M${pts.map((p) => p.join(' ')).join(' L')} L0 310 Z`, trou, arc, coulures, ox: cx, oy: cy };
  })();
  function fenetreGarniture() {
    const m = MAQ.garniture;
    const T = TEXTES.garniture;
    const fleche = (x, i) => `
      <g class="e5-gfleche" style="--i:${i}" transform="translate(${x} 289)"><g class="e5-gsaut">
        <path d="M-7.5 -47 Q-7.5 -51 -3.5 -51 H3.5 Q7.5 -51 7.5 -47 V-23 H14.5 Q18 -23 15.6 -19.6 L1.8 -2.2 Q0 0 -1.8 -2.2 L-15.6 -19.6 Q-18 -23 -14.5 -23 H-7.5 Z" fill="#f4bb4f" stroke="#a46d27" stroke-width="2" stroke-linejoin="round"/>
        <path d="M0 -44 V-27" stroke="#fde6a6" stroke-width="2.6" stroke-dasharray="2.6 4.2" stroke-linecap="round"/>
        <path d="M0 0 V12" stroke="#4e3a2c" stroke-width="1.6"/>
      </g></g>`;
    const confiture = (x, i) => `
      <g class="e5-gconfiture" data-i="${i}" transform="translate(${x} 318)"><g class="e5-gcoule">
        <path d="M-25 2 C-22 -8 -12 -12 0 -12 C12 -12 22 -8 25 2 C26 8 22 10 20 16 C18 24 13 25 12 17 C11 11 7 11 6 20 C5 31 -2 31 -2 21 C-2 13 -7 12 -9 18 C-11 25 -17 24 -17 16 C-17 10 -26 9 -25 2 Z" fill="#d42a3d" stroke="#97142a" stroke-width="1.6"/>
        <path d="M-14 -5 Q-5 -9 6 -7" stroke="#ff8c9a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="13" cy="-2" r="2" fill="#ff8c9a"/>
      </g></g>`;
    const morsure = (x, i) => `
      <g class="e5-gmorsure" data-i="${i}" transform="translate(${x} 0)">
        <clipPath id="e5-gdome-${i}"><path d="${MORSURE.dome}"/></clipPath>
        <g clip-path="url(#e5-gdome-${i})"><g class="e5-gcroc" style="transform-origin:${x + MORSURE.ox}px ${MORSURE.oy}px">
          <path d="${MORSURE.trou}" fill="#c98a52" stroke="#c98a52" stroke-width="18" stroke-linejoin="round"/>
          <path d="${MORSURE.trou}" fill="none" stroke="#e2a86e" stroke-width="7" stroke-linejoin="round"/>
          <path d="${MORSURE.trou}" fill="${FONDS_CUPCAKES[i]}" stroke="#5a2f17" stroke-width="1.6" stroke-linejoin="round"/>
        </g></g>
        <g class="e5-gmiettes" fill="#c98a52"><circle cx="40" cy="352" r="1.8"/><circle cx="52" cy="366" r="1.4"/><circle cx="46" cy="384" r="1.6"/></g>
        <g class="e5-gdedans" clip-path="url(#e5-gdome-${i})"><g class="e5-gcoule">
          <path d="${MORSURE.arc}" fill="none" stroke="#97142a" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="${MORSURE.arc}" fill="none" stroke="#d42a3d" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="${MORSURE.coulures}" fill="#d42a3d" stroke="#97142a" stroke-width="1.2"/>
          <path d="${MORSURE.arc}" fill="none" stroke="#ff8c9a" stroke-width="1.6" stroke-dasharray="4 9" stroke-linecap="round" transform="translate(-1.5 -1.5)"/>
        </g></g>
      </g>`;
    const f = maquette('garniture', {
      genre: 'garniture',
      aria: T.titre,
      html: `
        <p class="e5-m e5-mtitre" style="${ici(m, [104, 12, 420, 46], 4.6)}">${fr(T.titre)}</p>
        ${croix(m, [474, 20, 530, 74])}
        <p class="e5-m e5-mcompte" style="${ici(m, [66, 109, 136, 131], 3.4)}" aria-label="${esc(T.pieces)}"></p>
        <svg class="e5-m e5-gscene" style="${ici(m, [0, 0, 532, 588])}" viewBox="0 0 532 588" aria-hidden="true">
          ${CUPCAKES.map(morsure).join('')}${CUPCAKES.map(confiture).join('')}${CUPCAKES.map(fleche).join('')}
        </svg>
        ${CUPCAKES.map((x, i) => `<button type="button" class="e5-m e5-gchoix" data-i="${i}" data-e5="cupcake-${i}" style="${ici(m, [x - 62, 232, x + 62, 434])}" aria-label="${esc(T.cupcake(i + 1))}"></button>`).join('')}
        <p class="e5-m e5-mtexte e5-gras e5-gprix" style="${ici(m, [92, 446, 350, 506], 4)}"></p>`,
    });
    const compte = f.el.querySelector('.e5-mcompte');
    const prix = f.el.querySelector('.e5-gprix');
    const confitures = [...f.el.querySelectorAll('.e5-gconfiture')];
    const morsures = [...f.el.querySelectorAll('.e5-gmorsure')];
    const scene = f.el.querySelector('.e5-gscene');
    const majPrix = () => {
      compte.textContent = String(pieces);
      prix.innerHTML = pieces < T.cout ? fr(T.offerte) : `${fr(T.partie)} <b>${T.cout}</b> ${ICONE_PIECE}`;
    };
    majPrix();
    direUnInstant(T.consigne);

    async function choisir(i) {
      if (f.bloque || f.ferme) return;
      const cout = pieces < T.cout ? 0 : T.cout;
      f.bloque = true;
      scene.classList.add('e5-gjoue');
      if (cout) ajouterPieces(-cout);
      majPrix();
      bip('clic', 0.6);
      const bonne = Math.floor(Math.random() * 3);
      const btn = f.el.querySelector(`.e5-gchoix[data-i="${i}"]`);
      btn.classList.add('e5-choisi');
      await dormir(300);
      // On croque dans le cupcake choisi.
      morsures[i].classList.add('e5-croque');
      bip('croque');
      await dormir(450);
      if (i === bonne) morsures[i].classList.add('e5-fourre');
      else confitures[bonne].classList.add('e5-montre');
      if (i === bonne) {
        bip('miam');
        const c = centre(btn);
        coeurs(c.x, c.y - 20, 8);
        await dormir(700);
        await hourra('pieces', T.prix, T.gagne);
        await encaisser('pieces', T.prix, centre(btn));
      } else {
        bip('non');
        prix.innerHTML = fr(T.rate);
        await dormir(1500);
      }
      if (!vivant) return;
      confitures[bonne].classList.remove('e5-montre');
      morsures[i].classList.remove('e5-croque', 'e5-fourre');
      btn.classList.remove('e5-choisi');
      scene.classList.remove('e5-gjoue');
      f.bloque = false;
      majPrix();
    }
    for (const b of f.el.querySelectorAll('.e5-gchoix')) b.addEventListener('click', () => choisir(+b.dataset.i));
    return f.resultat;
  }

  // Le frigo (bouton du panier, ou le frigo de la salle) : la vitrine de la
  // boutique, sur l'onglet du frigo.
  function fenetreFrigo() {
    return fenetreBoutique(null);
  }

  // Le livre et le panier (le frigo), en bas à droite : consultables à tout
  // moment.
  function boutonHaut(genre, ouvrir) {
    return () => {
      if (enTransition) return;
      if (fenetreCourante?.bloque) return;
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
  const nomClient = (cmd) => nomDe(cmd.sorte);

  function demandeHtml(cmd, { avecRecette = false } = {}) {
    const aide = '';
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

  // Une recette comme dans le livre du jeu (maquette de Clément) : les trois
  // étoiles (une de plus à chaque plat servi), le titre, le plat et sa
  // famille, les portions, le temps, le prix et l'expérience, les
  // ingrédients dans leurs cases (grisés s'il en manque au frigo), l'épice
  // facultative dans sa case fleurie, et le bouton : le panier s'il manque
  // quelque chose (direction le marché), le fouet si tout est là.
  const servis = new Map();             // combien de fois chaque recette a été servie
  const dureeLivre = (min) => {
    const h = Math.floor(min / 60);
    const m = String(min % 60).padStart(2, '0');
    return h ? `${h}:${m}:00` : `${m}:00`;
  };
  const ETOILE = 'M0 -9 L2.6 -3.2 L8.8 -2.8 L4 1.2 L5.6 7.4 L0 4 L-5.6 7.4 L-4 1.2 L-8.8 -2.8 L-2.6 -3.2 Z';
  const CATEGORIES = {
    feuille: '<path d="M-6 6 C-8 -2 -2 -8 7 -7 C8 2 2 8 -6 6 Z M-6 6 L4 -4" fill="none" stroke="#6b5640" stroke-width="1.6" stroke-linejoin="round"/>',
    louche: '<path d="M4 -9 L-1 3" stroke="#6b5640" stroke-width="1.8" stroke-linecap="round"/><path d="M-7 2 Q-7 8 -2 8 Q3 8 3 3 Z" fill="none" stroke="#6b5640" stroke-width="1.6"/>',
    plat: '<path d="M-8 1 Q-8 -7 0 -7 Q8 -7 8 1 Z" fill="none" stroke="#6b5640" stroke-width="1.6"/><path d="M-9 3 H9 M-7 6 H7" stroke="#6b5640" stroke-width="1.6" stroke-linecap="round"/>',
    dessert: '<path d="M-3 9 V-3 Q-3 -8 1.5 -8 Q6 -8 6 -3" fill="none" stroke="#6b5640" stroke-width="2" stroke-linecap="round"/><path d="M-3 6 L-1 4 M-3 1 L-1 -1 M0 -6 L1 -4 M4 -7 L3 -5" stroke="#d6334a" stroke-width="1.3" stroke-linecap="round"/>',
    boisson: '<path d="M-6 -4 H5 V3 Q5 7 1 7 H-2 Q-6 7 -6 3 Z" fill="none" stroke="#6b5640" stroke-width="1.6"/><path d="M5 -2 Q9 -2 9 1 Q9 4 5 4" fill="none" stroke="#6b5640" stroke-width="1.4"/>',
  };
  const icoXp = '<i class="e5-xp-ico" aria-hidden="true">XP</i>';

  function carteRecette(cle, { bouton = true, manque = true, actif = false, pour = [] } = {}) {
    const r = recette(cle);
    const T = TEXTES.livreTexte;
    const n = servis.get(cle) || 0;
    const etoiles = [0, 1, 2].map((i) => `<svg viewBox="-10 -10 20 20" aria-hidden="true"><path d="${ETOILE}" class="${n > i ? ['e5-bronze', 'e5-argent', 'e5-or'][i] : ''}"/></svg>`).join('');
    if (r.secret && !secrets.has(cle)) {
      return `
      <article class="e5-rcarte e5-rsecrete">
        <div class="e5-retoiles">${etoiles}</div>
        <h4>${fr(T.secretTitre)}</h4>
        <div class="e5-rmilieu">
          <div class="e5-rplat"><b class="e5-rquestion">?</b></div>
          <ul class="e5-rinfos"><li>${fr(T.portionsSecret)}</li><li>${fr(T.inconnu)}</li><li class="e5-rnote">${fr(T.secret)}</li></ul>
        </div>
        <div class="e5-rbas"><div class="e5-ringr">${'<span class="e5-ri e5-ri-vide">?</span>'.repeat(5)}<span class="e5-ri e5-ri-vide e5-ri-epice">?</span></div>${bouton ? '<span class="e5-rbouton e5-rbouton-vide"></span>' : ''}</div>
      </article>`;
    }
    const ings = Object.entries(r.ingredients);
    const tout = ings.every(([k, q]) => nb(k) >= q);
    const cases = ings.map(([k, q]) => `<span class="e5-ri${manque && nb(k) < q ? ' e5-manque' : ''}" title="${esc(D.ARTICLES[k].nom)}">${icone(k)}<b>×${q}</b></span>`);
    while (cases.length < 5) cases.push('<span class="e5-ri e5-ri-vide"></span>');
    const epice = r.epice
      ? `<span class="e5-ri e5-ri-epice${manque && !nb(r.epice) ? ' e5-manque' : ''}" title="${esc(T.epice(D.ARTICLES[r.epice]))}">${icone(r.epice)}<b>×1</b></span>`
      : '<span class="e5-ri e5-ri-vide e5-ri-epice"></span>';
    const qui = pour.length
      ? `<span class="e5-rpour" title="${esc(T.commandePar(pour.map(nomClient)))}">${pour.map((c) => visageSvg(c.sorte, 'e5-mini')).join('')}</span>` : '';
    const libelle = tout ? T.cuisiner : T.marche;
    // Au fourneau : ce qui est déjà au comptoir ou en route pour cette recette.
    const auComptoir = actif ? portionsDispo(cle) : 0;
    const enRoute = actif ? feux.filter((f) => f.cle === cle && ['gestes', 'cuisson', 'pret', 'prise'].includes(f.etat)).length : 0;
    const statut = actif && (auComptoir || enRoute)
      ? `<p class="e5-rstatut">${[auComptoir ? T.auComptoir(auComptoir) : '', enRoute ? T.enRoute : ''].filter(Boolean).map(fr).join(' · ')}</p>` : '';
    const btn = actif
      ? `<button type="button" class="e5-rbouton e5-ractif ${tout ? 'e5-rfouet' : 'e5-rpanier'}" data-cle="${cle}" data-e5="${tout ? 'cuisiner' : 'marche'}-${cle}" aria-label="${esc(`${libelle} : ${r.nom}`)}">${tout ? ICONE_FOUET : '<img src="images/hud/panier.webp" alt="">'}<span>${esc(libelle)}</span></button>`
      : `<span class="e5-rbouton ${tout ? 'e5-rfouet' : 'e5-rpanier'}" role="img" aria-label="${esc(tout ? T.toutLa : T.manque)}" title="${esc(tout ? T.toutLa : T.manque)}">${tout ? ICONE_FOUET : '<img src="images/hud/panier.webp" alt="">'}</span>`;
    return `
      <article class="e5-rcarte${pour.length ? ' e5-rcommandee' : ''}" data-avenir="${actif ? portionsAVenir(cle) : ''}">
        <div class="e5-retoiles" title="${esc(T.etoiles(n))}">${etoiles}</div>${qui}${statut}
        <h4>${fr(r.nom)}</h4>
        <div class="e5-rmilieu">
          <div class="e5-rplat"><svg viewBox="-22 -22 44 44" aria-hidden="true">${D.PLATS[r.plat]({ vapeur: false })}</svg><span class="e5-rcat"><svg viewBox="-11 -11 22 22" aria-hidden="true">${CATEGORIES[r.categorie] || ''}</svg></span></div>
          <ul class="e5-rinfos">
            <li>${fr(T.portions(r.portions))}</li>
            <li>${fr(T.pret(dureeLivre(r.cuisson)))}</li>
            <li class="e5-rgain">${ICONE_PIECE}<span>${fr(T.parPortion(r.prix))}</span></li>
            <li class="e5-rgain">${icoXp}<span>${r.xp}</span></li>
          </ul>
        </div>
        <div class="e5-rbas">
          <div class="e5-ringr">${cases.join('')}${epice}</div>
          ${bouton ? btn : ''}
        </div>
      </article>`;
  }

  // Les pages du livre ouvert : deux cartes par page ; deux pages côte à côte
  // quand il y a la place (sinon une), et une seule carte par page quand la
  // hauteur manque (téléphone couché).
  function miseEnPage() {
    const l = zone.clientWidth;
    const h = zone.clientHeight;
    const parPage = h < 560 ? 1 : 2;
    const pagesParVue = l >= 640 ? 2 : 1;
    return { parPage, pagesParVue };
  }

  // Le livre en lecture : toutes les recettes, et les commandes en cours.
  // Ouvert depuis un fourneau (cuisine : les commandes du service), chaque
  // recette a son bouton, comme dans le jeu : « Cuisiner » si tout est au
  // frigo, « Marché » s'il manque quelque chose. Il donne alors
  // { action: 'cuisiner', cmd } ou { action: 'marche' } (null : fermé).
  function livreConsultation({ cuisine = null } = {}) {
    const T = TEXTES.livreTexte;
    const enCours = (cuisine || commandes).filter((c) => c.etat === 'assise' && c.recette);
    const f = fenetre({ titre: T.titre, couleur: '#a86f3f', genre: 'livre', classe: `e5-livre e5-gglivre${cuisine ? ' e5-au-feu' : ''}` });
    const cles = Object.keys(RECETTES);
    const pour = (k) => (cuisine ? enCours.filter((c) => c.recette === k) : []);
    // Au fourneau, le livre s'ouvre sur la première recette commandée.
    const cible = cuisine ? Math.max(0, cles.findIndex((k) => pour(k).length)) : 0;
    let premiere = null;                // la première page visible
    function rendre() {
      const { parPage, pagesParVue } = miseEnPage();
      if (premiere === null) premiere = Math.floor(cible / parPage);
      const pages = [];
      for (let i = 0; i < cles.length; i += parPage) pages.push(cles.slice(i, i + parPage));
      premiere = Math.max(0, Math.min(premiere - (premiere % pagesParVue), pages.length - 1));
      const visibles = pages.slice(premiere, premiere + pagesParVue);
      f.corps.innerHTML = `
        <div class="e5-gl" style="--pages:${pagesParVue};--cartes:${parPage}">
          <div class="e5-gl-pages">${visibles.map((pg, i) => `<section class="e5-gl-page${i ? ' e5-gl-droite' : ''}">${pg.map((k) => carteRecette(k, { actif: !!cuisine, pour: pour(k) })).join('')}</section>`).join('')}</div>
          ${premiere > 0 ? `<button type="button" class="e5-gl-fleche e5-gl-avant" data-e5="livre-avant" aria-label="${esc(T.avant)}"></button>` : ''}
          ${premiere + pagesParVue < pages.length ? `<button type="button" class="e5-gl-fleche e5-gl-apres" data-e5="livre-apres" aria-label="${esc(T.apres)}"></button>` : ''}
          <p class="e5-gl-num">${T.page(Math.floor(premiere / pagesParVue) + 1, Math.ceil(pages.length / pagesParVue))}</p>
          ${enCours.length ? `<section class="e5-pense-bete"><h3>${fr(T.commandes)}</h3>${enCours.map((c) => demandeHtml(c)).join('')}</section>` : ''}
        </div>`;
      f.pagesParVue = pagesParVue;
      f.el.classList.toggle('e5-deux-pages', pagesParVue === 2);
    }
    rendre();
    f.corps.addEventListener('click', (e) => {
      const action = e.target.closest('.e5-ractif');
      if (action) {
        const k = action.dataset.cle;
        if (action.classList.contains('e5-rpanier')) {
          bip('clic', 0.5);
          f.fermer({ action: 'marche', cle: k });
          return;
        }
        bip('clic', 1);
        f.fermer({ action: 'cuisiner', cle: k });
        return;
      }
      const b = e.target.closest('.e5-gl-fleche');
      if (!b) return;
      bip('papier');
      premiere += (b.classList.contains('e5-gl-apres') ? 1 : -1) * f.pagesParVue;
      rendre();
    });
    return f.resultat;
  }

  /* ------------------------------------------------------------ Le marché */

  let achats = null;                    // ce qui est acheté pendant la sortie en cours
  const commentes = new Set();

  // La boutique d'un étal, comme dans le jeu d'origine (maquette « obchod s
  // přísadami ») : en haut la bourse, le titre et ce qu'il y a au frigo ;
  // les onglets des étals (au marché), et à droite la vitrine ou le frigo ;
  // dessous, les cartes des aliments : le prix, ce qu'il en reste au frigo,
  // acheter, et revendre (au même prix, si on s'est trompée).
  // e : l'étal ouvert, ou null pour le frigo.
  function fenetreBoutique(e, { cafe = false } = {}) {
    const B = TEXTES.boutique;
    const auMarche = vue === 'marche';
    const onglets = auMarche || cafe;     // les étals en onglets, comme les rayons du jeu
    let etal = e;
    const total = () => [...frigo.values()].reduce((x, y) => x + y, 0);
    const libre = (k) => nb(k) - (pot.get(k) || 0);   // ce qui n'est pas déjà dans la casserole
    const f = fenetre({ titre: e ? e.nom : TEXTES.frigo.titre, couleur: '#a86f3f', genre: e ? 'boutique' : 'frigo', classe: 'e5-livre e5-ggboutique' });

    function carte(k) {
      const vendable = auMarche && PRIX[k] !== undefined;
      return `
        <div class="e5-gb-carte" data-cle="${k}">
          <p class="e5-gb-nom">${esc(D.ARTICLES[k].nom)}</p>
          <div class="e5-gb-plat">${icone(k)}</div>
          <p class="e5-gb-stock" title="${esc(B.auFrigo)}"><b>${nb(k)}</b>${ICONE_FRIGO_BLEU}</p>
          ${PRIX[k] !== undefined ? `<p class="e5-gb-prix">${ICONE_PIECE}<span>${PRIX[k]}</span></p>` : `<p class="e5-gb-prix e5-gb-cadeau">${esc(B.cadeau)}</p>`}
          <div class="e5-gb-boutons">
            ${etal ? `<button type="button" class="e5-gb-acheter" data-e5="acheter-${k}" aria-label="${esc(B.acheter)} : ${esc(D.ARTICLES[k].nom)}" title="${esc(B.acheter)}">${ICONE_CHARIOT}</button>` : ''}
            ${vendable ? `<button type="button" class="e5-gb-vendre" data-e5="vendre-${k}" aria-label="${esc(B.vendre)} : ${esc(D.ARTICLES[k].nom)}" title="${esc(B.vendre)}" ${libre(k) > 0 ? '' : 'disabled'}>${ICONE_CAISSE}</button>` : ''}
          </div>
        </div>`;
    }

    function rendre() {
      const articles = etal ? etal.articles : ORDRE.filter((k) => nb(k) > 0);
      const rayons = onglets ? `
          <div class="e5-gb-etals" role="tablist" aria-label="${esc(B.etals)}">${ETALS.map((x) => `
            <button type="button" role="tab" class="e5-gb-etal" data-etal="${x.cle}" aria-selected="${x === etal}" aria-label="${esc(x.nom)}" title="${esc(x.nom)}">${x.articles.slice(0, 3).map((k, i) => `<span style="--i:${i}">${icone(k)}</span>`).join('')}</button>`).join('')}
          </div>` : '<div class="e5-gb-etals"></div>';
      const titre = cafe && etal ? B.titreCafe : (etal ? etal.nom : TEXTES.frigo.titre);
      f.corps.innerHTML = `
        <div class="e5-gb">
          <header class="e5-gb-tete">
            <p class="e5-gb-bourse" aria-label="${esc(B.bourse)}">${ICONE_PIECE}<b>${pieces}</b></p>
            <span class="e5-gb-icone">${ICONE_BOUTIQUE}</span>
            <div class="e5-gb-titres">
              <h3>${fr(titre)}</h3>
              <p>${esc(B.auFrigo)} <b>${total()}</b></p>
            </div>
          </header>
          <nav class="e5-gb-onglets">
            ${rayons}
            <div class="e5-gb-vues">
              ${onglets ? `<button type="button" class="e5-gb-vue" data-vue="vitrine" aria-pressed="${!!etal}" aria-label="${esc(B.vitrine)}" title="${esc(B.vitrine)}"><img src="images/hud/panier.webp" alt=""></button>` : ''}
              <button type="button" class="e5-gb-vue" data-vue="frigo" aria-pressed="${!etal}" aria-label="${esc(TEXTES.frigo.titre)}" title="${esc(TEXTES.frigo.titre)}">${ICONE_FRIGO_BLEU}</button>
            </div>
          </nav>
          <div class="e5-gb-etagere">
            ${articles.length ? `<div class="e5-gb-grille">${articles.map(carte).join('')}</div>` : `<p class="e5-gb-vide">${fr(TEXTES.frigo.vide)}</p>`}
          </div>
        </div>`;
    }
    rendre();
    f.majTotal = () => {
      const b = f.corps.querySelector('.e5-gb-titres b');
      if (b) b.textContent = String(total());
      const p = f.corps.querySelector('.e5-gb-bourse b');
      if (p) p.textContent = String(pieces);
    };
    f.corps.addEventListener('click', (ev) => {
      const ong = ev.target.closest('.e5-gb-etal');
      const vueB = ev.target.closest('.e5-gb-vue');
      const achat = ev.target.closest('.e5-gb-acheter');
      const vente = ev.target.closest('.e5-gb-vendre');
      if (ong) {
        const x = ETALS.find((y) => y.cle === ong.dataset.etal);
        if (x !== etal) { bip('clic', 0.5); etal = x; rendre(); }
      } else if (vueB) {
        const veut = vueB.dataset.vue === 'frigo' ? null : (etal || e || ETALS[0]);
        if (veut !== etal) { bip('clic', 0.5); etal = veut; rendre(); }
      } else if (achat) {
        acheter(achat.closest('.e5-gb-carte'));
      } else if (vente && !vente.disabled) {
        revendre(vente.closest('.e5-gb-carte'), libre);
      }
    });
    return f;
  }
  const boutique = (e) => fenetreBoutique(e);

  function majCarte(carte) {
    const k = carte.dataset.cle;
    carte.querySelector('.e5-gb-stock b').textContent = String(nb(k));
    const v = carte.querySelector('.e5-gb-vendre');
    if (v) v.disabled = nb(k) - (pot.get(k) || 0) <= 0;
    fenetreCourante?.majTotal?.();
  }

  function acheter(carte) {
    const k = carte.dataset.cle;
    if (pieces < PRIX[k]) {
      bip('non');
      secouer(bourse);
      secouer(carte);
      if (bloquee()) proposerRecommencer();
      else direUnInstant(TEXTES.pasAssez, 3600);
      return;
    }
    ajouterPieces(-PRIX[k]);
    frigo.set(k, nb(k) + 1);
    majBadge();
    if (achats) achats.push(k);
    majCarte(carte);
    bip('piece');
    const icon = carte.querySelector('.e5-gb-plat svg');
    rebondir(icon);
    envolee(D.ARTICLES[k].dessin(), centre(icon), centre(panier), { duree: 620, taille: 34 })
      .then(() => rebondir(panier));
    if (DETESTES.includes(k) && !commentes.has(k)) {
      commentes.add(k);
      direUnInstant(TEXTES.achatDeteste(D.ARTICLES[k]), 3400);
    }
  }

  // Revendre un aliment au prix d'achat (une erreur de courses, ou un prix
  // de la roue dont on n'a pas besoin).
  function revendre(carte, libre) {
    const k = carte.dataset.cle;
    if (libre(k) <= 0 || PRIX[k] === undefined) return;
    frigo.set(k, nb(k) - 1);
    if (!nb(k)) frigo.delete(k);
    majBadge();
    if (achats) { const i = achats.lastIndexOf(k); if (i >= 0) achats.splice(i, 1); }
    bip('clic', 0.5);
    const icon = carte.querySelector('.e5-gb-plat svg');
    envolee(D.billet(), centre(icon), centre(bourseIcone), { taille: 26, boite: '-12 -12 24 24', duree: 560 })
      .then(() => { ajouterPieces(PRIX[k]); bip('piece'); fenetreCourante?.majTotal?.(); });
    majCarte(carte);
  }

  // Plus assez de pièces pour finir une seule des commandes restantes, et
  // rien qui puisse en rapporter (pas de pièces sur les tables, pas de plat
  // en route) : elle est coincée.
  function bloquee() {
    if (feux.some((f) => ['gestes', 'cuisson', 'pret', 'prise'].includes(f.etat))) return false;
    if (commandes.some((c) => c.etat === 'enService' || c.etat === 'servie')) return false;
    const restantes = commandes.filter((c) => (c.etat === 'dehors' || c.etat === 'assise') && (c.recette ? !portionsDispo(c.recette) : ![...stock.values()].some((e) => e.n > 0)));
    if (!restantes.length) return false;
    const coutRecette = (r) => Object.entries(RECETTES[r].ingredients).reduce((t, [k, n]) => t + Math.max(0, n - nb(k)) * PRIX[k], 0);
    const cout = (c) => (c.recette ? coutRecette(c.recette) : Math.min(...Object.keys(RECETTES).filter((k) => k !== 'gateau').map(coutRecette)));
    return Math.min(...restantes.map(cout)) > pieces;
  }

  // Pipistrelle propose de recommencer la partie (sans repasser par la
  // connexion).
  function proposerRecommencer() {
    if (racine.querySelector('.e5-relance')) return;
    const el = document.createElement('div');
    el.className = 'e5-relance';
    el.innerHTML = `
      <div class="e5-relance-boite" role="dialog" aria-modal="true" aria-labelledby="e5-relance-texte">
        <svg class="e5-relance-avatar" viewBox="-40 -29 80 58" aria-hidden="true">${D.pipistrelle()}</svg>
        <p id="e5-relance-texte">${esc(TEXTES.bloquee)}</p>
        <div class="e5-relance-boutons">
          <button type="button" data-e5="continuer">${esc(TEXTES.boutons.continuer)}</button>
          <button type="button" class="e5-principal" data-e5="recommencer">${esc(TEXTES.boutons.recommencer)}</button>
        </div>
      </div>`;
    racine.append(el);
    el.querySelector('[data-e5="continuer"]').addEventListener('click', () => { bip('clic', 0.4); el.remove(); });
    const oui = el.querySelector('[data-e5="recommencer"]');
    oui.addEventListener('click', () => {
      bip('clic', 0.6);
      memoire.ecrire('cafe-relance', true);
      allerEtape(numero);
    });
    oui.focus({ preventScroll: true });
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
  // Le stand aux ballons PLAY : la roue de la fortune.
  const kiosque = $('[data-e5="roue"]');
  surToucher(kiosque, () => {
    if (vue !== 'marche' || enTransition || fenetreCourante) return;
    bip('clic', 0.6);
    rebondir(kiosque);
    fenetreRoue();
  });
  // Le tableau noir, près de l'épicerie : sa fenêtre est un décor (seule
  // la croix la ferme).
  const tableau = $('[data-e5="tableau"]');
  surToucher(tableau, () => {
    if (vue !== 'marche' || enTransition || fenetreCourante) return;
    bip('clic', 0.6);
    rebondir(tableau);
    const T = TEXTES.tableau;
    fenetre({
      titre: T.titre, couleur: '#3f4a45', genre: 'tableau', classe: 'e5-ardoise',
      corps: `<svg class="e5-ardoise-dessin" viewBox="0 0 320 300" aria-hidden="true">${D.ardoisePermis(T)}</svg>`,
    });
  });

  let rentrer = null;                   // le panneau « Café » ramène au café
  surToucher($('[data-e5="vers-cafe"]'), () => {
    if (vue === 'marche' && rentrer) { bip('clic', 0.4); rentrer(); }
  });

  // Ce qui manque au frigo pour les commandes à venir (la recette de base
  // pour les clients pas encore installés).
  function manquePourLaSuite() {
    const total = new Map();
    const prochaines = commandes.filter((c) => c.recette && !c.libre && (c.etat === 'dehors' || c.etat === 'assise')).slice(0, L.tables.length);
    for (const c of prochaines) {
      const b = c.etat === 'assise' ? besoins(c) : new Map(Object.entries(RECETTES[c.recette].ingredients));
      for (const [k, n] of b) total.set(k, (total.get(k) || 0) + n);
    }
    return [...total].filter(([k, n]) => nb(k) < n).map(([k]) => k);
  }

  let visitesMarche = 0;
  async function allerAuMarche() {
    achats = [];
    await changerVue('marche');
    visitesMarche += 1;
    if (visitesMarche === 2) dormir(2200).then(() => { if (vivant && vue === 'marche') direUnInstant(TEXTES.astuceRoue); });
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
    const de = centre(panier);
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

  let cafeOuvert = false;
  function ouvrirCafe() {
    cafeOuvert = true;
    montrerSurFeux();
    $('[data-e5="pancarte"]').textContent = TEXTES.ouvert;
    animer($('.e5-pancarte'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duree: 320, garder: false });
  }

  surToucher($('[data-e5="frigo"]'), () => {
    if (vue === 'cafe' && !fenetreCourante && !enTransition && outilsPrets) { bip('clic', 0.5); fenetreFrigo(); }
  });

  // Le camion du chef pâtissier, garé à droite du café : « Trouve la garniture ».
  const camion = $('[data-e5="camion"]');
  surToucher(camion, () => {
    if (vue !== 'cafe' || fenetreCourante || enTransition || !outilsPrets || enFete) return;
    bip('clic', 0.6);
    rebondir(camion);
    fenetreGarniture();
  });

  /* -------------------------------------------------------- Les fourneaux */

  // Trois fourneaux : on lance un plat sur l'un pendant que d'autres cuisent.
  // Au-dessus de chacun, comme dans le jeu d'origine : une bulle parchemin
  // quand il demande quelque chose (les ingrédients, une étape, ou le plat
  // prêt à sortir), une barre à segments pendant une étape et pendant la
  // cuisson, avec le minuteur et le bouton 60x.
  // Un fourneau est « libre », en « gestes » (on prépare), en « cuisson »,
  // ou « pret » (on touche pour poser le plat sur le comptoir).
  feux = L.feux.map((lieu, k) => {
    const el = $(`[data-e5="fourneau-${k}"]`);
    const ui = surfeux.querySelector(`[data-k="${k}"]`);
    return {
      k, lieu, el, ui,
      casserole: el.querySelector('.e5-casserole'),
      contenu: el.querySelector('.e5-contenu'),
      bulle: ui.querySelector('.e5-sf-bulle'),
      icones: ui.querySelector('.e5-sf-icones'),
      legende: ui.querySelector('.e5-sf-legende'),
      titre: ui.querySelector('.e5-sf-titre'),
      pourcent: ui.querySelector('.e5-sf-pourcent'),
      temps: ui.querySelector('.e5-sf-temps'),
      vite: ui.querySelector('.e5-sf-vite'),
      tige: ui.querySelector('.e5-sf-tige'),
      segments: [...ui.querySelectorAll('.e5-sf-barre i')],
      anims: [],
      etat: 'libre', cmd: null, r: null, extra: null,
      fait: 0, total: 0, vitesse: 1, vu: {},
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

  // Ce qui s'affiche au-dessus d'un fourneau : rien ('libre'), la bulle
  // ('demande', 'pret') ou la barre ('action', 'cuisson').
  function etatUI(f, etat) {
    if (f.ui.dataset.etat === etat) return;
    f.ui.dataset.etat = etat;
    f.vu = {};
    for (const a of f.anims) a.cancel();
    f.anims = [];
    if (etat !== 'cuisson') for (const s of f.segments) s.style.width = '0%';
    f.vite.hidden = etat !== 'cuisson';
    placerSurFeux();
  }
  function remplirBulle(f, dessins, n, aria) {
    f.icones.innerHTML = dessins;
    f.icones.style.setProperty('--n', String(Math.min(3, n)));
    f.icones.classList.toggle('e5-sf-une', n === 1);
    f.bulle.setAttribute('aria-label', aria);
  }
  // La bulle demande quelque chose : on touche le fourneau (ou la bulle).
  function demander(f, dessins, n, aria) {
    remplirBulle(f, dessins, n, aria);
    f.ui.dataset.etat = '';
    etatUI(f, 'demande');
    f.bulle.classList.remove('e5-sf-pop');
    void f.bulle.offsetWidth;
    f.bulle.classList.add('e5-sf-pop');
  }
  // La barre se remplit, segment après segment, avec le nom de l'étape dessous.
  function agir(f, legende, ms) {
    f.legende.textContent = legende;
    etatUI(f, 'action');
    const d = ms / V / SEGMENTS;
    f.anims = f.segments.map((s, i) => s.animate([{ width: '0%' }, { width: '100%' }], { duration: d, delay: i * d, fill: 'both', easing: 'linear' }));
    return f.anims[f.anims.length - 1].finished.catch(() => {});
  }

  // Met l'affichage d'un fourneau à jour (sans retoucher ce qui n'a pas changé).
  // Pendant les gestes, c'est preparer() qui mène la bulle et la barre.
  function majFeu(f) {
    const T = TEXTES.feux;
    if (['libre', 'sale', 'prise', 'pret'].includes(f.etat)) {
      etatUI(f, 'libre');
      f.el.setAttribute('aria-label', f.etat === 'pret' ? `${T.nom(f.k + 1)} : ${f.r.nom}, ${T.pret}` : f.etat === 'sale' ? `${T.nom(f.k + 1)} : ${T.sale}` : T.nom(f.k + 1));
      return;
    }
    if (f.etat !== 'cuisson') return;
    if (f.ui.dataset.etat !== 'cuisson') {
      etatUI(f, 'cuisson');
      f.titre.textContent = f.r.nom;
      f.legende.textContent = f.r.etape || f.r.cuit;
    }
    const v = f.vu;
    const texte = duree(f.total - f.fait);
    if (v.texte !== texte) { f.temps.textContent = texte; v.texte = texte; }
    const pc = `${Math.floor((f.total ? f.fait / f.total : 0) * 100)} %`;
    if (v.pc !== pc) { f.pourcent.textContent = pc; v.pc = pc; }
    const q = Math.round((f.total ? f.fait / f.total : 0) * SEGMENTS * 100);   // en centièmes de segment
    if (v.q !== q) {
      f.segments.forEach((s, i) => { s.style.width = `${Math.max(0, Math.min(100, q - i * 100))}%`; });
      v.q = q;
    }
    const presse = String(f.vitesse > 1);
    if (v.presse !== presse) { f.vite.setAttribute('aria-pressed', presse); v.presse = presse; }
  }

  // Les bulles et les barres se placent au-dessus de leur fourneau, la pointe
  // sur la casserole. Si elles se gênent (fourneaux voisins), celle du fond
  // monte au-dessus de celle de devant, reliée à son fourneau par un trait.
  let enFete = false;
  function montrerSurFeux() {
    surfeux.hidden = !(cafeOuvert && vue === 'cafe' && !enFete);
    placerSurFeux();
  }
  function placerSurFeux() {
    if (surfeux.hidden || !feux.length) return;
    const lz = zone.clientWidth;
    const places = [];
    for (const f of [...feux].reverse()) {          // du fourneau de devant à celui du fond
      if (f.ui.dataset.etat === 'libre' || !f.ui.dataset.etat) continue;
      const boite = f.ui.getBoundingClientRect();
      const pointe = [...f.ui.querySelectorAll('.e5-sf-pointe')].find((x) => x.getClientRects().length);
      if (!pointe) continue;
      const pr = pointe.getBoundingClientRect();
      const px = pr.left + pr.width / 2 - boite.left;   // la pointe, dans la bulle
      const py = pr.bottom - boite.top;
      const w = boite.width;
      const c = versEcran(f.lieu.casserole.x, f.lieu.casserole.y - 15);
      const x = Math.max(4, Math.min(c.x - px, lz - w - 4));
      let y = c.y - py;
      let tige = 0;
      const gene = () => places.some((q) => x < q.x1 + 3 && x + w > q.x0 - 3 && y < q.y1 + 3 && y + py > q.y0 - 3);
      while (tige < 260 && gene()) { y -= 4; tige += 4; }
      f.ui.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      f.tige.style.cssText = tige ? `display:block;left:${(px - 1).toFixed(1)}px;top:${py.toFixed(1)}px;height:${tige}px` : '';
      places.push({ x0: x, y0: y, x1: x + w, y1: y + py });
      if (tige) places.push({ x0: x + px - 3, x1: x + px + 3, y0: y + py, y1: y + py + tige });
    }
  }

  // Le bouton 60x de chaque fourneau : accélère (ou ralentit) ce plat-là.
  // Chaque plat démarre à vitesse normale.
  for (const f of feux) {
    f.vite.setAttribute('aria-label', TEXTES.fourneau.accelerer);
    f.vite.addEventListener('click', (e) => {
      e.stopPropagation();
      if (f.etat !== 'cuisson') return;
      f.vitesse = f.vitesse > 1 ? 1 : ACCELERATION;
      bip(f.vitesse > 1 ? 'vol' : 'clic', 0.6);
      majFeu(f);
      montrerCuisson(f);
    });
  }

  // Pendant la cuisson, rien au-dessus du fourneau : on le touche pour voir
  // la bulle (nom du plat, barre en %, ce qui se passe, temps restant, 60x),
  // qui se referme toute seule.
  function montrerCuisson(f) {
    clearTimeout(f.finInfo);
    f.ui.dataset.info = '1';
    majFeu(f);
    placerSurFeux();
    f.bulleInfo = true;
    f.finInfo = setTimeout(() => cacherCuisson(f), 4500);
    minuteurs.add(f.finInfo);
  }
  function cacherCuisson(f) {
    clearTimeout(f.finInfo);
    delete f.ui.dataset.info;
    placerSurFeux();
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
        majFeu(f);
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
    cacherCuisson(f);
    f.etat = 'pret';
    f.el.classList.remove('e5-four-chaud', 'e5-feu');
    f.el.classList.add('e5-fourneau-pret');
    bip('ding');
    majContenu(f);
    majFeu(f);
    signaler();
  }

  // Attend qu'on touche un fourneau, dans la salle ou par sa bulle.
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
          if (e.target.closest && e.target.closest('.e5-sf-vite')) return;
          if (vue !== 'cafe' || enTransition || fenetreCourante) return;
          e.preventDefault();
          finir(f);
        };
        for (const [el, type] of [[f.el, 'click'], [f.el, 'keydown'], [f.ui, 'click']]) {
          el.addEventListener(type, h);
          ecoutes.push([el, type, h]);
        }
        f.el.classList.add('e5-touchable');
      }
    });
    return { promesse, annuler: () => finir(null) };
  }

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
    if (['remuer', 'melanger', 'battre', 'fondre'].includes(type)) {
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
    } else if (type === 'retourner' || type === 'plier') {
      const g = svgEl('g', {}, calques.volants);
      const crepe = svgEl('g', { class: 'e5-crepe-volante' }, g);
      crepe.innerHTML = type === 'plier'
        ? '<ellipse rx="12" ry="4.2" fill="#f2c94c" stroke="#d9a72a" stroke-width="1.2"/><ellipse cx="-3" cy="-1" rx="2" ry="1" fill="#fbe08a"/>'
        : '<ellipse rx="13" ry="4.5" fill="#f6cf8c" stroke="#dea457" stroke-width="1.2"/><ellipse cx="-3" cy="-1" rx="2" ry="1" fill="#dea457"/>';
      placer(g, c.x, c.y - 4);
      bip('vol');
      await animer(crepe, [
        { transform: 'translateY(0) rotate(0)' },
        { transform: 'translateY(-38px) rotate(200deg)', offset: 0.5 },
        { transform: 'translateY(0) rotate(360deg)' },
      ], { duree: 800, easing: 'ease-in-out', garder: false });
      g.remove();
      bip('plouf');
    } else if (type === 'couper') {
      bip('croque');
      await secouerCasserole(f);
    } else {
      bip('plouf');
      await secouerCasserole(f);
    }
  }

  // Le comptoir : chaque plat prêt attend Cyriel à sa place.
  const occupees = new Set();
  const PLAT = 1;     // taille des plats dans la salle

  // Le comptoir bleu : les plats prêts, avec leurs portions. Le même plat
  // cuisiné plusieurs fois s'additionne (trois salades : 30 portions).
  const stock = new Map();             // recette → { n, place, g, badge, epice }
  function placeLibre() {
    const n = L.comptoir.findIndex((_, k) => !occupees.has(k));
    return n < 0 ? occupees.size % L.comptoir.length : n;
  }
  function majStock(e) {
    e.badge.textContent = `×${e.n}`;
  }
  function poserAuComptoir(cle, epice) {
    const r = RECETTES[cle];
    let e = stock.get(cle);
    if (e) {
      e.n += r.portions;
      e.epice = e.epice || epice;
      e.g.firstElementChild.classList.remove('e5-pop');
      void e.g.firstElementChild.getBoundingClientRect();
      e.g.firstElementChild.classList.add('e5-pop');
    } else {
      const place = placeLibre();
      occupees.add(place);
      const p = L.comptoir[place];
      const g = svgEl('g', { class: 'e5-stock', 'data-e5': `stock-${cle}` }, calques.plateau);
      g.innerHTML = `<g class="e5-pop"><g transform="scale(${PLAT})">${D.PLATS[r.plat]({ vapeur: 'blanc' })}</g>
        <g transform="translate(16 -14)"><rect x="-11" y="-7" width="22" height="13" rx="6.5" fill="#fffaf0" stroke="#4b3a28" stroke-width="1.4"/>
        <text class="e5-stock-n" y="3.4" text-anchor="middle" font-size="9.5" font-weight="700" fill="#4b3a28"></text></g></g>`;
      placer(g, p.x, p.y - 7);
      e = { n: r.portions, place, g, badge: g.querySelector('.e5-stock-n'), epice };
      stock.set(cle, e);
    }
    majStock(e);
    bip('plouf');
    signaler();
  }
  // La serveuse prend une portion (réservée à l'avance) ; le plat quitte le
  // comptoir avec sa dernière portion.
  function prendrePortion(cle) {
    const e = stock.get(cle);
    if (!e) return;
    e.pris = (e.pris || 0) + 1;
    if (e.n <= 0 && e.pris >= (e.reserve || 0)) {
      e.g.remove();
      occupees.delete(e.place);
      stock.delete(cle);
    }
  }
  const portionsDispo = (cle) => stock.get(cle)?.n || 0;
  // Les portions qui arrivent : au comptoir, et dans les fourneaux.
  const portionsAVenir = (cle) => portionsDispo(cle)
    + feux.filter((f) => f.cle === cle && ['gestes', 'cuisson', 'pret', 'prise'].includes(f.etat)).length * RECETTES[cle].portions;


  // Le contenu de la casserole va sur le fourneau f. Comme dans le jeu, la
  // bulle montre la prochaine étape : un ingrédient, puis chaque geste. La
  // toucher l'ajoute à la liste de Cyriel, qui va au fourneau et la fait
  // (la barre se remplit). On peut en toucher plusieurs d'affilée, sur
  // plusieurs fourneaux : elle les fait dans l'ordre. Quand tout est fait,
  // la cuisson démarre. Rien n'attend ici : le service continue.
  let premiereCuisson = true;
  let preparationDite = false;
  function preparer(f, { cle, epice = null }) {
    const r = recette(cle);
    const contenu = [...pot];
    for (const [k, n] of pot) frigo.set(k, nb(k) - n);
    if (epice) { contenu.push([epice, 1]); frigo.set(epice, nb(epice) - 1); }
    for (const k of [...frigo.keys()]) if (!nb(k)) frigo.delete(k);
    pot.clear();
    majBadge();
    Object.assign(f, {
      etat: 'gestes', cle, r, epice, fait: 0, total: r.cuisson * 60, vitesse: 1,
      etapes: [...contenu.map(([k, n]) => ({ ing: k, n })), ...r.gestes.map((g) => ({ geste: g }))],
      demandee: 0, faites: 0, enCours: null, dans: [], melange: false,
    });
    f.el.classList.add('e5-actif');
    majContenu(f);
    majEtapes(f);
    signaler();
    if (!preparationDite) { preparationDite = true; dire(TEXTES.preparation); }
  }

  const legendeEtape = (e) => (e.ing ? TEXTES.gestes.ingredient(D.ARTICLES[e.ing]) : TEXTES.gestes[e.geste]);
  const dessinEtape = (e) => (e.ing
    ? icone(e.ing).repeat(Math.min(3, e.n))
    : `<svg viewBox="-24 -24 48 48" aria-hidden="true">${D.ICONES_GESTES[e.geste]()}</svg>`);

  // Ce que montre un fourneau en préparation : la barre de l'étape en cours
  // (avec, au-dessus, la bulle de la suivante si elle n'est pas encore
  // demandée), ou seulement la bulle, ou la barre vide pendant que Cyriel
  // arrive.
  function majEtapes(f) {
    if (f.etat !== 'gestes') return;
    const suite = f.etapes[f.demandee];
    const aria = suite ? `${TEXTES.feux.nom(f.k + 1)} : ${TEXTES.fourneau.toucher} (${legendeEtape(suite)})` : '';
    if (f.enCours || f.demandee > f.faites) {
      if (!f.enCours) {
        etatUI(f, 'action');
        f.legende.textContent = TEXTES.fourneau.arrive;
      }
      if (suite) {
        const nouvelle = f.ui.dataset.suite !== String(f.demandee);
        remplirBulle(f, dessinEtape(suite), Math.min(3, suite.n || 1), aria);
        f.ui.dataset.suite = String(f.demandee);
        if (nouvelle) pop(f);
      } else delete f.ui.dataset.suite;
      placerSurFeux();
      return;
    }
    delete f.ui.dataset.suite;
    demander(f, dessinEtape(suite), Math.min(3, suite.n || 1), aria);
  }
  function pop(f) {
    f.bulle.classList.remove('e5-sf-pop');
    void f.bulle.offsetWidth;
    f.bulle.classList.add('e5-sf-pop');
  }

  // On a touché un fourneau en préparation : sa prochaine étape va sur la
  // liste de Cyriel.
  function enfiler(f) {
    if (f.demandee >= f.etapes.length) {
      bip('clic', 0.2);
      direUnInstant(TEXTES.fourneau.dejaDemande, 1800);
      return;
    }
    const e = f.etapes[f.demandee];
    f.demandee += 1;
    bip('clic', 0.4 + 0.6 * (f.demandee / f.etapes.length));
    majEtapes(f);
    cyLibre = cyLibre.then(() => faireEtape(f, e));
  }

  async function faireEtape(f, e) {
    if (!vivant) return;
    await revenirEnCuisine();
    const p = L.devantFeu[f.k];
    await marcher(cy, [[p.x, p.y]]);
    if (!vivant) return;
    f.enCours = e;
    const legende = legendeEtape(e);
    if (e.ing) {
      const action = agir(f, legende, 650 + e.n * 200);
      majEtapes(f);
      await Promise.all([action, ...Array.from({ length: e.n }, (_, j) => tomber(f, e.ing, 150 + j * 200))]);
      for (let j = 0; j < e.n; j++) f.dans.push(e.ing);
      bip('plouf');
      majContenu(f);
      secouerCasserole(f);
    } else {
      const action = agir(f, legende, 900);
      majEtapes(f);
      await Promise.all([geste(f, e.geste), action]);
      f.melange = true;
      majContenu(f);
    }
    f.enCours = null;
    f.faites += 1;
    if (f.faites === f.etapes.length) lancerCuisson(f);
    else majEtapes(f);
    signaler();
  }

  function lancerCuisson(f) {
    const r = f.r;
    delete f.ui.dataset.suite;
    f.etat = 'cuisson';
    f.melange = true;
    majContenu(f);
    f.el.classList.add(r.four ? 'e5-four-chaud' : 'e5-feu');
    bip('feu');
    majFeu(f);
    lancerHorloge();
    if (premiereCuisson) {
      premiereCuisson = false;
      direUnInstant(TEXTES.vraiTemps);
    } else {
      direUnInstant(r.cuit);
    }
  }

  // Ce qu'on voit dans la casserole : les ingrédients qui dépassent, puis,
  // une fois mélangés, le plat qui cuit (sa couleur, quelques morceaux).
  function majContenu(f) {
    const g = f.contenu;
    if (!g) return;
    if (!['gestes', 'cuisson', 'pret'].includes(f.etat) || !f.r) { g.innerHTML = ''; return; }
    if (f.etat === 'pret') {      // le plat a pris sa forme définitive
      g.innerHTML = `<g transform="translate(0 -6) scale(.75)">${D.PLATS[f.r.plat]({ vapeur: 'blanc' })}</g>`;
      return;
    }
    const surface = COULEURS_CASSEROLE[f.cle] || ['#e8c27a', '#c99a4e'];
    const morceaux = f.dans.slice(-6);
    const icones = morceaux.map((k, i) => {
      const x = (i - (morceaux.length - 1) / 2) * 5.2;
      return `<g transform="translate(${x.toFixed(1)} ${(i % 2 ? -3.6 : -1.4)}) scale(.27) rotate(${(i * 37) % 40 - 20})">${D.ARTICLES[k].dessin()}</g>`;
    }).join('');
    if (!f.melange) {
      g.innerHTML = f.dans.length ? `<ellipse cx="0" cy=".4" rx="10.6" ry="4.2" fill="${surface[0]}" opacity=".5"/>${icones}` : '';
      return;
    }
    const bulles = f.etat === 'cuisson' ? `<g class="e5-bouillon"><circle cx="-5" cy="-.6" r="1.3" fill="${surface[1]}"/><circle cx="4" cy=".4" r="1.1" fill="${surface[1]}"/><circle cx="0" cy="-1.6" r=".9" fill="#fff" opacity=".6"/></g>` : '';
    g.innerHTML = `
      <ellipse cx="0" cy=".2" rx="11" ry="4.6" fill="${surface[0]}" stroke="${surface[1]}" stroke-width=".8"/>
      <path d="M-6 -1.6 Q-2 -3.4 2.4 -3" stroke="#fff" stroke-opacity=".55" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      <g opacity=".85">${icones}</g>${bulles}`;
  }

  let camionDit = false;
  // On touche un fourneau où le plat est prêt : il part au comptoir (ou, pour
  // la spécialité, la fête commence).
  async function sortirPlat(f, cmds) {
    bip('clic', 1);
    f.el.classList.remove('e5-fourneau-pret');
    // La spécialité de la maison : c'est la fête.
    const special = f.cle === 'gateau' && cmds.find((c) => c.special && c.etat === 'assise');
    if (special) {
      Object.assign(f, { etat: 'libre', cle: null, r: null, vitesse: 1, dans: [], melange: false });
      f.el.classList.remove('e5-actif');
      majContenu(f);
      majFeu(f);
      special.etat = 'servie';
      special.objets = await fete(special, f);
      special.etat = 'partie';
      return;
    }
    // Cyriel prend le plat et le pose sur le comptoir ; le fourneau reste sale.
    const { cle, epice, r } = f;
    f.etat = 'prise';
    majFeu(f);
    cyLibre = cyLibre.then(async () => {
      if (!vivant) return;
      await revenirEnCuisine();
      const p = L.devantFeu[f.k];
      await marcher(cy, [[p.x, p.y]]);
      Object.assign(f, { etat: 'sale', cle: null, r: null, vitesse: 1, dans: [], melange: false });
      f.el.classList.remove('e5-actif');
      f.el.classList.add('e5-sale');
      majContenu(f);
      majFeu(f);
      cyPlat.innerHTML = `<g transform="scale(${PLAT / L.echelle})">${D.PLATS[r.plat]({ vapeur: false })}</g>`;
      bip('clic', 0.7);
      const e = stock.get(cle);
      const place = e ? e.place : placeLibre();
      const q = L.derriereComptoir[place];
      await marcher(cy, [[q.x, q.y]]);
      cyPlat.replaceChildren();
      poserAuComptoir(cle, epice);
      if (!comptoirDit) { comptoirDit = true; direUnInstant(TEXTES.auComptoir(r, RECETTES[cle].portions)); }
      if (!saleDit) { saleDit = true; direUnInstant(TEXTES.sale); }
      signaler();
    });
  }
  let comptoirDit = false;
  let saleDit = false;

  // Un fourneau sale : on le touche, Cyriel le nettoie (une seconde).
  function nettoyer(f) {
    f.etat = 'nettoyage';
    f.ui.dataset.etat = '';
    etatUI(f, 'action');
    f.legende.textContent = TEXTES.fourneau.arrive;
    bip('clic', 0.4);
    cyLibre = cyLibre.then(async () => {
      if (!vivant) return;
      await revenirEnCuisine();
      const p = L.devantFeu[f.k];
      await marcher(cy, [[p.x, p.y]]);
      bip('pschitt');
      await agir(f, TEXTES.gestes.nettoyer, 1000);
      f.el.classList.remove('e5-sale');
      f.etat = 'libre';
      majFeu(f);
      signaler();
    });
  }
  // Cyriel reste en cuisine (elle ne sert plus en salle) : rien à faire ici,
  // sauf si elle a été déplacée (la fête).
  async function revenirEnCuisine() {
    if (cy.g.parentNode !== calques.cuisine) calques.cuisine.append(cy.g);
  }

  // La serveuse : elle attend devant le comptoir ; dès qu'un client installé
  // a son plat au comptoir, elle prend une portion et la lui apporte.
  const sv = { g: svgEl('g', { class: 'e5-serveuse' }, calques.clients) };
  sv.corps = svgEl('g', { class: 'e5-corps' }, sv.g);
  sv.corps.innerHTML = `<g transform="scale(${L.echelle})">${D.serveuse()}</g>`;
  const svPlat = sv.corps.querySelector('.e5-sv-plat');
  placer(sv.g, L.serveuse.x, L.serveuse.y);
  let svOccupee = false;
  async function serveuse(cmds, fini) {
    for (;;) {
      if (!vivant || (fini() && !salles.size)) return;
      const plusFourni = () => [...stock].filter(([k, e]) => e.n > 0 && k !== 'gateau').sort((a, b) => b[1].n - a[1].n)[0]?.[0];
      const cmd = cmds.find((c) => c.etat === 'assise' && !c.special && (c.recette ? portionsDispo(c.recette) > 0 : !!plusFourni()));
      if (cmd && !cmd.recette) { cmd.recette = plusFourni(); cmd.libre = true; }
      if (!cmd) {
        // rien à servir : elle débarrasse une table
        const [table, assiette] = salles.entries().next().value || [];
        if (table && !salles.get(table).prise) {
          assiette.prise = true;
          svOccupee = true;
          await debarrasser(table, assiette);
          svOccupee = false;
          salles.delete(table);
          signaler();
          continue;
        }
        await unChangement();
        continue;
      }
      const e = stock.get(cmd.recette);
      e.n -= 1;
      e.reserve = (e.reserve || 0) + 1;
      majStock(e);
      cmd.etat = 'enService';
      cmd.epice = e.epice;
      svOccupee = true;
      await servirClient(cmd, e.place);
      svOccupee = false;
      signaler();
    }
  }
  async function servirClient(cmd, place) {
    const c = cmd.client;
    const plat = RECETTES[cmd.recette].plat;
    const t = L.tables.indexOf(c.table);
    const q = L.devantComptoir[place];
    await marcher(sv, [[q.x, q.y]]);
    prendrePortion(cmd.recette);
    svPlat.innerHTML = `<g transform="scale(${PLAT / L.echelle})">${D.PLATS[plat]({ vapeur: false })}</g>`;
    bip('clic', 0.7);
    const chemin = L.servir[t];
    await marcher(sv, chemin.map((p) => [p.x, p.y]));
    svPlat.replaceChildren();
    const a = svgEl('g', {}, calques.tables);
    a.innerHTML = `<g class="e5-pose e5-pop"><g transform="scale(${PLAT})">${D.PLATS[plat]()}</g></g>`;
    placer(a, c.table.x, c.table.y - L.dessus - 7);
    c.assiette = a;
    if (c.bulle) { c.bulle.remove(); c.bulle = null; }
    cmd.etat = 'servie';
    servis.set(cmd.recette, (servis.get(cmd.recette) || 0) + 1);
    bip('plouf');
    direUnInstant(TEXTES.service, 1800);
    gagnerXp(RECETTES[cmd.recette].xp + (cmd.epice ? TEXTES.epice.xp : 0));
    repas.push(mangerEtPartir(c, null, cmd.epice, RECETTES[cmd.recette].prix).then(() => {
      cmd.etat = 'partie';
      signaler();
      if (!camionDit) { camionDit = true; direUnInstant(TEXTES.astuceCamion); }
    }));
    // retour devant le comptoir, par le même chemin
    const retour = [...chemin].reverse().slice(1).map((p) => [p.x, p.y]);
    await marcher(sv, [...retour, [L.serveuse.x, L.serveuse.y]]);
  }
  const repas = [];
  // Les assiettes vides sur les tables, en attendant la serveuse.
  const salles = new Map();            // table → assiette
  async function debarrasser(table, assiette) {
    const t = L.tables.indexOf(table);
    const chemin = L.servir[t];
    await marcher(sv, chemin.map((p) => [p.x, p.y]));
    const inner = assiette.querySelector('.e5-pose > g');
    if (inner) {
      inner.setAttribute('transform', `scale(${PLAT / L.echelle})`);
      svPlat.replaceChildren(inner);
    }
    assiette.remove();
    bip('clic', 0.4);
    const retour = [...chemin].reverse().slice(1).map((p) => [p.x, p.y]);
    const q = L.devantComptoir[L.devantComptoir.length - 1];
    await marcher(sv, [...retour, [q.x, q.y]]);
    // l'assiette disparaît dans sa main, au comptoir
    await animer(svPlat, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.4)' }], { duree: 260, garder: false });
    svPlat.replaceChildren();
    await marcher(sv, [[L.serveuse.x, L.serveuse.y]]);
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
      haut: perso.haut * k, tete: perso.tete * k, nom: nomDe(sorte), bulle: null, assiette: null,
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
      if (cmd.etat !== 'assise' && cmd.etat !== 'enService') return;
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
    if (cmd.recette) {
      c.bulle = bulleDeCommande(c.x, c.y + c.haut - 4, RECETTES[cmd.recette].plat);
      rendreBavard(cmd, c.g, c.bulle);
    }
    bip('clic', 0.5);
  }



  // Le client paie en partant : l'argent arrive directement au compteur, en
  // haut à gauche (rien à ramasser sur la table).
  const ramasseurs = new Set();
  function payer(n) {
    ajouterPieces(n);
    bip('piece');
    fenetreCourante?.majTotal?.();
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
  // Le plat se vide bouchée après bouchée (de droite à gauche, avec des
  // marques de dents), jusqu'à l'assiette vide.
  let bouchees = 0;
  async function manger(assiette) {
    const mets = assiette.querySelector('.e5-mets');
    if (!mets) return;
    const id = `e5-bouchees-${++bouchees}`;
    const clip = svgEl('clipPath', { id }, mets.parentNode);
    const forme = svgEl('path', {}, clip);
    const bord = (x) => {
      let d = `M-40 -40 H${x}`;
      for (let y = -40; y < 30; y += 7) d += ` Q${x - 4.5} ${y + 3.5} ${x} ${y + 7}`;
      return `${d} H-40 Z`;
    };
    forme.setAttribute('d', bord(60));
    mets.setAttribute('clip-path', `url(#${id})`);
    const etapes = [9, 1, -7, -40];
    for (const x of etapes) {
      await dormir(750 / V);
      if (!vivant) return;
      forme.setAttribute('d', bord(x));
      bip('croque', 0.3);
    }
  }

  // Le client content lève le pouce en se levant : la popularité du café
  // (en haut, au milieu) monte de 0,1.
  let popularite = POPULARITE;
  const blocPopularite = $('.e5-popularite');
  function pouceVert(c, content = true) {
    const g = svgEl('g', { 'aria-hidden': 'true' }, calques.bulles);
    g.innerHTML = `<g class="e5-pouce">${D.pouce(content)}</g>`;
    placer(g, c.x, c.y + c.haut - 6);
    dormir(1700).then(() => g.remove());
    dormir(350).then(() => {
      if (!vivant) return;
      popularite = Math.max(0, Math.round((popularite + (content ? 0.1 : -0.1)) * 10) / 10);
      blocPopularite.textContent = popularite.toFixed(1);
      blocPopularite.classList.remove('e5-monte');
      void blocPopularite.offsetWidth;
      blocPopularite.classList.add('e5-monte');
      bip('ding', 0.4);
    });
  }

  // La patience d'un client installé : au bout d'un moment, une horloge
  // au-dessus de sa tête ; s'il attend vraiment trop, pouce rouge, et il
  // s'en va sans manger. (Clément, lui, attend toujours.)
  async function patience(cmd) {
    if (cmd.special) return;
    const c = cmd.client;
    const attend = () => vivant && cmd.etat === 'assise';
    const debut = performance.now();
    const ecoule = () => (performance.now() - debut) * V;
    while (attend() && ecoule() < PATIENCE.horloge) await dormir(1000);
    if (!attend()) return;
    const h = svgEl('g', { class: 'e5-horloge', 'aria-hidden': 'true' }, calques.bulles);
    h.innerHTML = `<g class="e5-horloge-in">${D.horloge()}</g>`;
    placer(h, c.x - 26, c.y + c.haut - 10);
    const aiguille = h.querySelector('.e5-aiguille');
    while (attend() && ecoule() < PATIENCE.depart) {
      const f = (ecoule() - PATIENCE.horloge) / (PATIENCE.depart - PATIENCE.horloge);
      aiguille.setAttribute('transform', `rotate(${(f * 360).toFixed(0)})`);
      h.firstElementChild.classList.toggle('e5-presse', f > 0.75);
      await dormir(500);
    }
    h.remove();
    if (!attend()) return;
    cmd.etat = 'fachee';
    if (c.bulle) { c.bulle.remove(); c.bulle = null; }
    bip('non');
    pouceVert(c, false);
    direUnInstant(TEXTES.parti(c.nom), 3000);
    await dormir(900);
    await marcher(c, [...c.chemin].reverse().map((p) => [p.x, p.y]));
    ouvrirPorte();
    await animer(c.g, [{ opacity: 1 }, { opacity: 0 }], { duree: 320 });
    c.g.remove();
    cmd.etat = 'partie';
    signaler();
  }

  async function mangerEtPartir(c, extra, epice, prix) {
    await dormir(350);
    if (extra) {
      const rang = rangBeurk++;
      await animer(c.assiette.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(.8)' }], { duree: 450 });
      const phrase = TEXTES.reaction[Math.min(rang, TEXTES.reaction.length - 1)];
      direUnInstant(phrase(c.nom, D.ARTICLES[extra].defini), 3800);
      await degouter(c, c.y, TEXTES.reactions[rang % TEXTES.reactions.length]);
      c.assiette.remove();
      payer(PAIEMENT_BEURK);
    } else {
      const p = versEcran(c.x, c.y + c.haut + 6);
      coeurs(p.x, p.y, 4);
      bip('miam');
      c.corps.classList.add('e5-content');
      if (epice) direUnInstant(TEXTES.epice.miam(c.nom, D.ARTICLES[epice]));
      await manger(c.assiette);
      // l'assiette vide reste : la serveuse viendra la débarrasser
      salles.set(c.table, c.assiette);
      c.assiette = null;
      c.corps.classList.remove('e5-content');
      payer(prix + (epice ? TEXTES.epice.pieces : 0));
      pouceVert(c);
    }
    await dormir(400);
    await marcher(c, [...c.chemin].reverse().map((p) => [p.x, p.y]));
    ouvrirPorte();
    await animer(c.g, [{ opacity: 1 }, { opacity: 0 }], { duree: 320 });
    c.g.remove();
  }

  // Le client attend que sa table se libère (le client d'avant est parti).
  // La première table libre et débarrassée (on attend s'il n'y en a pas).
  async function tableLibre(cmd, cmds) {
    const libre = () => L.tables.findIndex((T, t) => !salles.has(T)
      && !cmds.some((c) => c !== cmd && c.client && c.table === t && ['assise', 'enService', 'servie', 'fachee'].includes(c.etat)));
    while (vivant && libre() < 0) await unChangement();
    return Math.max(0, libre());
  }


  function lancerArrivees(cmds) {
    return (async () => {
      for (let i = 0; i < cmds.length; i++) {
        await dormir(ARRIVEES(i));
        const t = await tableLibre(cmds[i], cmds);
        await enCafe();
        cmds[i].table = t;
        cmds[i].client = creerClient(cmds[i]);
        await entrer(cmds[i]);
        cmds[i].etat = 'assise';
        patience(cmds[i]);
        signaler();
      }
    })();
  }

  // Ce que dit Pipistrelle pendant le service, sans répéter son dernier conseil.
  function conseiller(t) {
    if (vue !== 'cafe') return;          // au marché, on garde ses boutons
    if (texteDeFond !== t) dire(t);
  }

  // Le livre s'ouvre au fourneau f : on choisit la commande, on remplit la
  // casserole, et on peut filer au marché. Renvoie true si un plat est lancé.
  async function ouvrirLivre(f, cmds) {
    for (;;) {
      const res = await livreConsultation({ cuisine: cmds });
      if (!res) return false;
      if (res.action === 'marche') {
        // La boutique d'ingrédients s'ouvre dans le café, sur l'étal du
        // premier ingrédient qui manque ; en la fermant, on revient au livre.
        const manque = Object.entries(RECETTES[res.cle].ingredients).find(([k, n]) => nb(k) < n);
        const etal = ETALS.find((e) => manque && e.articles.includes(manque[0])) || ETALS[0];
        await fenetreBoutique(etal, { cafe: true }).resultat;
        continue;
      }
      // La casserole se remplit toute seule avec la recette ; si son épice
      // est au frigo, on propose de relever le plat.
      pot.clear();
      for (const [k, n] of Object.entries(RECETTES[res.cle].ingredients)) pot.set(k, n);
      const ep = recette(res.cle).epice;
      const epice = ep && nb(ep) > 0 && await proposerEpice(ep) ? ep : null;
      preparer(f, { cle: res.cle, epice });
      return true;
    }
  }

  // La boucle du service, comme dans le jeu : un fourneau libre ouvre le
  // livre (on lance une recette), un fourneau en préparation fait avancer
  // Cyriel d'une étape, un plat prêt part sur le comptoir, un fourneau sale
  // se nettoie. La serveuse sert les clients depuis le comptoir.
  let paralleleDit = false;
  async function service(cmds, { premierTexte, texte }) {
    let premier = true;
    const fini = () => !cmds.some((c) => ['dehors', 'assise', 'enService', 'fachee'].includes(c.etat));
    const travail = serveuse(cmds, fini);
    for (;;) {
      if (fini()) break;
      const enAttente = cmds.filter((c) => c.etat === 'assise');
      // les commandes qui n'ont encore ni portion au comptoir, ni plat en route
      const attendues = (k) => enAttente.filter((x) => x.recette === k).length;
      const libres = enAttente.filter((c) => !c.recette);
      const toutAVenir = Object.keys(RECETTES).filter((k) => k !== 'gateau').reduce((t, k) => t + portionsAVenir(k), 0);
      const aCuisiner = [...enAttente.filter((c) => c.recette && portionsAVenir(c.recette) < attendues(c.recette)),
        ...(libres.length > toutAVenir ? libres : [])];
      const occupes = feux.filter((f) => f.etat !== 'libre' && f.etat !== 'sale');
      const prets = feux.filter((f) => f.etat === 'pret');
      const feuxLibres = feux.filter((f) => f.etat === 'libre');
      const sales = feux.filter((f) => f.etat === 'sale');
      const aDemander = feux.filter((f) => f.etat === 'gestes' && f.demandee < f.etapes.length);
      const cyOccupee = feux.some((f) => (f.etat === 'gestes' && f.demandee > f.faites) || f.etat === 'prise' || f.etat === 'nettoyage');

      if (prets.length) {
        const f = prets[0];
        conseiller(f.cle === 'gateau' ? TEXTES.pretSpecial(f.k + 1) : TEXTES.pret(f.k + 1));
        montrer(f.lieu.halo.x, f.lieu.halo.y, f.lieu.halo.r, false);
      } else if (aDemander.length && !cyOccupee) {
        const f = aDemander[0];
        conseiller(TEXTES.preparation);
        montrer(f.lieu.halo.x, f.lieu.halo.y, f.lieu.halo.r, false);
      } else if (aCuisiner.length && feuxLibres.length) {
        if (premier) conseiller(aCuisiner.some((c) => !c.recette) ? TEXTES.premierPassant : premierTexte);
        else if (occupes.length && !paralleleDit) { paralleleDit = true; conseiller(TEXTES.enParallele); }
        else conseiller(texte);
        const f = feuxLibres[0];
        montrer(f.lieu.halo.x, f.lieu.halo.y, f.lieu.halo.r, false);
      } else if (aCuisiner.length && sales.length) {
        conseiller(TEXTES.sale);
        const f = sales[0];
        montrer(f.lieu.halo.x, f.lieu.halo.y, f.lieu.halo.r, false);
      } else {
        conseiller(feux.some((x) => x.etat === 'cuisson') ? TEXTES.cuissonEnCours
          : occupes.length ? TEXTES.cyOccupee : TEXTES.attenteClient);
        cacherGuide();
      }

      const attente = attendreFeu();
      const f = await Promise.race([attente.promesse, unChangement().then(() => null)]);
      attente.annuler();
      if (!f) continue;
      cacherGuide();
      if (f.etat === 'pret') {
        if (f.cle === 'gateau') await sortirPlat(f, cmds);
        else sortirPlat(f, cmds);
      } else if (f.etat === 'gestes') {
        enfiler(f);
        premier = false;
      } else if (f.etat === 'cuisson') {
        bip('clic', 0.3);
        // Premier toucher : la bulle de la cuisson (nom, barre, temps) ;
        // second toucher, bulle ouverte : cuisiner tout de suite.
        if (!f.ui.dataset.info) montrerCuisson(f);
        else if (expressRestant > 0) { cacherCuisson(f); await proposerExpress(f); }
        else direUnInstant(f.vitesse > 1 ? f.r.cuit : `${f.r.cuit} ${TEXTES.astuce60x}`, 3200);
      } else if (f.etat === 'sale') {
        nettoyer(f);
      } else if (f.etat === 'libre') {
        bip('clic', 0.5);
        if (await ouvrirLivre(f, cmds)) premier = false;
      } else {
        bip('clic', 0.2);
        direUnInstant(TEXTES.fourneau.dejaDemande, 1800);
      }
    }
    cacherGuide();
    await travail;
    while (repas.length) await repas.shift();   // (de nouveaux repas s'ajoutent en route)
  }

  /* ------------------------------------------------------ Le client spécial */

  // Le dernier client : Clément, qui entre comme les autres et s'installe.
  async function entreeSpeciale() {
    const cmd = { sorte: 'clement', table: 1, recette: 'gateau', special: true, etat: 'dehors', erreurs: 0 };
    cmd.client = creerClient(cmd);
    // le machaon de l'étape 4 l'accompagne, posé sur son épaule
    const papillon = svgEl('g', { transform: `translate(${(9 * L.echelle).toFixed(1)} ${(-50 * L.echelle).toFixed(1)}) scale(.3)` }, cmd.client.g);
    papillon.innerHTML = `<g class="e5-flotte">${D.machaon()}</g>`;
    await entrer(cmd);
    cmd.etat = 'assise';
    const p = versEcran(cmd.client.x, cmd.client.y + cmd.client.tete);
    coeurs(p.x, p.y, 6);
    return cmd;
  }

  function objetSurTable(dessin, x, y, nom, etiquette, parent = calques.tables) {
    const g = svgEl('g', { role: 'button', tabindex: '0', 'aria-label': etiquette, 'data-e5': nom }, parent);
    g.innerHTML = `<circle r="20" fill="transparent"/><g class="e5-pop">${dessin}</g>`;
    placer(g, x, y);
    return g;
  }

  /* ------------------------------------------------ La fête d'anniversaire */

  // Le gâteau de Clément était pour elle : lumières tamisées, bougies, la
  // chanson, les clients qui reviennent ; elle souffle, puis Clément dépose
  // son mot.
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
    enFete = true;
    montrerSurFeux();
    ambiance(null);   // la musique se tait : place à la chanson
    placer(support, f.lieu.casserole.x, f.lieu.casserole.y);
    await Promise.all([
      animer(nuit, [{ opacity: 0 }, { opacity: 0.64 }], { duree: 1000 }),
      aller(support, C.x, C.y, 1200, 'cubic-bezier(.3,.8,.3,1)'),
      animer(gateau, [{ transform: 'scale(.18)' }, { transform: 'scale(1)' }], { duree: 1200, easing: 'cubic-bezier(.3,.8,.3,1)' }),
    ]);
    const S = { x: C.x + 82, y: C.y + 4 };   // la place de Clément, à côté du gâteau
    // Cyriel quitte ses fourneaux et vient de l'autre côté du gâteau.
    cyLibre = cyLibre.then(async () => {
      if (cy.g.parentNode === calques.cuisine) await marcher(cy, [[L.sortieCuisine.x, L.sortieCuisine.y]]);
      calque.append(cy.g);
      await marcher(cy, [[C.x - 82, C.y + 4]]);
    });
    await Promise.all([marcher(sp, [[S.x, sp.y], [S.x, S.y]]), cyLibre]);
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
    for (const [sorte, x, y] of [['bichette', 34, 392], ['chachoux', 68, 404], ['estel', 102, 414], ['gaston', 314, 416], ['angeloune', 344, 404], ['rachou', 374, 392]]) {
      const g = svgEl('g', {}, invites);
      g.innerHTML = `<g class="e5-invite"><g transform="scale(.9)">${D.PERSONNAGES[sorte].dessin()}</g></g>`;
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
    monterNiveau();
    await dormir(1500);

    // Clément dépose son mot au pied du gâteau.
    const E = { x: C.x + 62, y: C.y + 12 };
    await marcher(sp, [[S.x, S.y + 22], [E.x + 14, S.y + 22], [E.x + 14, E.y + 10]]);
    const enveloppe = objetSurTable(D.enveloppe(), E.x, E.y, 'enveloppe', TEXTES.ariaEnveloppe, calque);
    bip('papier');
    const q = versEcran(E.x, E.y - 8);
    if (vivant) fx.etincelles(q.x, q.y, 16, '#d7b3ff', 140);
    await marcher(sp, [[S.x, S.y]]);
    calque.append(cy.g, sp.g, pipi);
    ambiance('salle');
    return { enveloppe, x: E.x, y: E.y };
  }

  /* ---------------------------------------------------------- Le mot */

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
        </div>
        <div class="e5-finale-boutons">
          <button type="button" class="e5-fermer e5-principal">${esc(T.boutons.fermer)}</button>
        </div>`;
      racine.append(f);
      const feuille = f.querySelector('.e5-feuille');
      animer(f, [{ opacity: 0 }, { opacity: 1 }], { duree: 300 });
      animer(feuille, [{ transform: 'translateY(18px) rotate(-1deg) scale(.96)' }, { transform: 'translateY(0) rotate(-1deg) scale(1)' }], { duree: 420, easing: 'cubic-bezier(.2,.9,.3,1.1)', garder: false });
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
      f.querySelector('.e5-fermer').focus({ preventScroll: true });
    });
  }

  /* ------------------------------------------------------------ Connexion */

  async function chargement(carte) {
    // un parchemin posé sur le panneau du dessin, avec la barre de chargement
    const boite = document.createElement('div');
    boite.className = 'gc-charge';
    boite.innerHTML = `
      <p class="e5-charge-texte">${esc(TEXTES.connexion.chargement)}</p>
      <div class="e5-barre"><div></div></div>
      <p class="e5-pourcent">0 %</p>`;
    carte.append(boite);
    const barre = boite.querySelector('.e5-barre div');
    const pourcent = boite.querySelector('.e5-pourcent');
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

  // L'écran de connexion apparaît comme sur une vieille connexion : d'abord
  // le serveur, puis l'image qui se dessine ligne par ligne, de haut en bas,
  // avec deux arrêts juste avant le nom du café (le temps de deviner).
  async function apparition(ecran) {
    const contenu = ecran.querySelector('.gc-contenu');
    const rideau = ecran.querySelector('.gc-rideau');
    const serveur = rideau.querySelector('.gc-serveur');
    const barre = serveur.querySelector('.e5-barre div');
    const pourcent = serveur.querySelector('.e5-pourcent');
    const statut = rideau.querySelector('.gc-statut');
    const C = TEXTES.connexion;
    // plus court les fois suivantes, ou si les animations sont réduites
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const f = (memoire.lire('cafe-login-vu', false) ? 0.35 : 1) * (reduit ? 0.6 : 1);
    contenu.inert = true;
    const image = ecran.querySelector('.gc-image');
    const imagePrete = image.decode().catch(() => {});

    // 1. La connexion au serveur.
    const total = 2300 * f;
    let fait = 0;
    while (fait < total && vivant) {
      const pas = 60 + Math.random() * 120;
      await dormir(pas * (Math.random() < 0.12 ? 4 : 1));
      fait += pas;
      const n = Math.min(100, Math.round((fait / total) * 100));
      barre.style.width = `${n}%`;
      pourcent.textContent = `${n} %`;
    }
    await imagePrete;   // l'image doit être là avant de se dessiner
    serveur.querySelector('.gc-serveur-texte').textContent = C.connecte;
    bip('ding');
    await dormir(450 * f);
    await animer(serveur, [{ opacity: 1 }, { opacity: 0 }], { duree: 250 });
    serveur.remove();

    // 2. L'image, ligne par ligne.
    rideau.classList.add('gc-balayage');
    const H = ecran.clientHeight || 1;
    const haut = ecran.getBoundingClientRect().top;
    const a = ecran.querySelector('.gc-affiche').getBoundingClientRect();
    const auNiveau = (fraction) => ((a.top - haut + a.height * fraction) / H) * 100;
    const arrets = [
      { a: auNiveau(0.02), ms: 1000 },   // juste avant « GoodCyriel »
      { a: auNiveau(0.43), ms: 1300 },   // juste avant « Café »
    ];
    let p = 0;
    while (p < 100 && vivant) {
      let suivant = Math.min(100, p + 1.2 + Math.random() * 3.4);
      const arret = arrets.find((x) => !x.fait && suivant >= x.a && p < x.a);
      if (arret) suivant = Math.max(p, arret.a - 0.4);
      p = suivant;
      rideau.style.top = `${p.toFixed(2)}%`;
      statut.textContent = C.transfert(Math.round(p));
      await dormir((55 + Math.random() * 130) * (Math.random() < 0.1 ? 3 : 1) * f);
      if (arret) { arret.fait = true; await dormir(arret.ms * f); }
    }
    rideau.remove();
    ecran.classList.remove('gc-en-charge');
    contenu.inert = false;
    memoire.ecrire('cafe-login-vu', true);
    // le pseudo se remplit tout seul, comme un navigateur qui s'en souvient
    await dormir(350 * f);
    const pseudo = ecran.querySelector('.gc-pseudo');
    for (const lettre of C.pseudoValeur) {
      if (!vivant) return;
      pseudo.value += lettre;
      await dormir(70);
    }
    if (window.matchMedia('(hover: hover)').matches) ecran.querySelector('.e5-mdp').focus({ preventScroll: true });
  }

  function connexion() {
    const ecran = $('.e5-login');
    const carte = $('.e5-carte');
    const champ = $('.e5-mdp');
    const erreur = $('.e5-erreur');
    const oubli = $('.e5-oubli');
    const indice = $('.e5-indice');
    let echecs = 0;
    apparition(ecran);
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
      bip('clic', 0.4);
      majIndice();
      indice.hidden = false;
      oubli.hidden = true;
    });
    // Les deux gros boutons : ils ramènent au mot de passe.
    const info = (t) => {
      bip('clic', 0.3);
      erreur.textContent = t;
      erreur.classList.add('gc-info');
      champ.focus({ preventScroll: false });
    };
    $('[data-e5="jouer-maintenant"]').addEventListener('click', () => {
      if (champ.value.length === 4) carte.requestSubmit();
      else info(TEXTES.connexion.dAbord);
    });
    champ.addEventListener('input', () => erreur.classList.remove('gc-info'));
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
        erreur.classList.remove('gc-info');
        erreur.textContent = TEXTES.connexion.erreur;
        secouer(carte);
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
    if (memoire.lire('cafe-relance', false)) {
      // une partie recommencée : pas besoin de se reconnecter
      memoire.ecrire('cafe-relance', false);
      $('.e5-login').remove();
    } else await connexion();
    document.body.classList.add('e5-en-jeu');   // le bouton du son passe dans les menus

    if (memoire.lire('cafe-fini', false)) {
      for (;;) {
        const choix = await dire(TEXTES.retour, [TEXTES.boutons.relire, TEXTES.boutons.rejouer]);
        if (choix === 1) break;
        await finale();
      }
    }

    await dire(TEXTES.intro, [TEXTES.boutons.intro]);
    outilsPrets = true;
    const premiers = CLIENTS.slice(0, 4).map((c) => TEXTES.recettes[c.recette].dans);
    await dire(TEXTES.livre(`${premiers.slice(0, -1).join(', ')} et ${premiers[premiers.length - 1]}`), [TEXTES.boutons.voirLivre]);
    await livreConsultation();
    await dire(TEXTES.versMarche, [TEXTES.boutons.marche]);

    commandes = SOIREE.map((c) => ({ ...c, etat: 'dehors', erreurs: 0, client: null }));
    await allerAuMarche();
    ouvrirCafe();
    dire(TEXTES.ouverture);
    const arrivees = lancerArrivees(commandes);
    await service(commandes, { premierTexte: TEXTES.premiereCommande, texte: TEXTES.commandeSuivante });
    await arrivees;
    await cyLibre;
    await dormir(500);
    toutRamasser();
    dire(TEXTES.calme);
    await dormir(1800);

    // Le client très spécial.
    secrets.add('gateau');
    const cmdSpeciale = await entreeSpeciale();
    commandes = [cmdSpeciale];
    bip('eclat');
    await service(commandes, { premierTexte: TEXTES.special, texte: TEXTES.commandeSpeciale });
    const { enveloppe, x, y } = cmdSpeciale.objets;
    dire(TEXTES.fete.objets);
    montrer(x, y, 24, true);
    await toucher(enveloppe);
    cacherGuide();
    bip('papier');
    memoire.ecrire('cafe-fini', true);
    await finale();
    for (;;) {
      await dire(TEXTES.fin, [TEXTES.boutons.relire]);
      await finale();
    }
  }

  /* ------------------------------------------------------------ Les menus */

  const H = TEXTES.hud;
  const surMenu = (nom, f) => {
    const b = $(`[data-hud="${nom}"]`);
    if (b) b.addEventListener('click', (e) => { e.stopPropagation(); f(b); });
  };

  // Les boutons du décor : Pipistrelle répond.
  for (const nom of ['carte', 'reglages', 'porte', 'cadeau', 'marmite', 'noeud', 'toque']) {
    surMenu(nom, () => { bip('clic', 0.4); direUnInstant(H.messages[nom]); });
  }
  // Les onglets du chat : le premier, c'est le Café chat.
  for (let i = 0; i < 4; i++) {
    surMenu(`onglet-${i}`, () => {
      bip('clic', 0.4);
      if (i === 0) defiler(); else direUnInstant(H.messages.onglets[i]);
    });
  }
  const pas = () => chat.clientHeight * 0.6;
  surMenu('chat-haut', () => chat.scrollBy({ top: -pas(), behavior: 'smooth' }));
  surMenu('chat-bas', () => chat.scrollBy({ top: pas(), behavior: 'smooth' }));
  surMenu('envoyer', () => saisie.requestSubmit());

  // « ? » : Pipistrelle répète son dernier conseil.
  surMenu('aide', () => { bip('clic', 0.4); ligne(CH.pipistrelle, texteDeFond || H.aideVide); });

  // La note de musique coupe ou remet le son (comme le bouton des autres étapes).
  const zoneSon = $('[data-hud="son"]');
  function majSon() {
    const coupe = typeof son.estCoupe === 'function' && son.estCoupe();
    zoneSon.setAttribute('aria-pressed', String(coupe));
    zoneSon.setAttribute('aria-label', coupe ? H.sonRemettre : H.sonCouper);
  }
  surMenu('son', () => {
    const global = document.getElementById('son');
    if (global) global.click();
    else { son.eveiller(); son.basculer(); }
    majSon();
  });
  majSon();

  surMenu('plein', () => {
    bip('clic', 0.4);
    const d = document;
    if (d.fullscreenElement) { d.exitFullscreen().catch(() => {}); return; }
    const el = d.documentElement;
    if (d.fullscreenEnabled && el.requestFullscreen) el.requestFullscreen().catch(() => direUnInstant(H.pleinIndispo));
    else direUnInstant(H.pleinIndispo);
  });

  // La cabane : direction le marché, à tout moment une fois le café ouvert
  // (avant, elle fait comme le bouton « Aller au marché » de Pipistrelle).
  surMenu('marche', () => {
    if (vue === 'marche') { bip('clic', 0.3); direUnInstant(H.dejaMarche); return; }
    const versMarche = [...zoneChoix.querySelectorAll('button')].find((x) => x.textContent === TEXTES.boutons.marche);
    if (versMarche) { versMarche.click(); return; }
    if (!cafeOuvert) { bip('non'); direUnInstant(H.marchePlusTard); return; }
    if (fenetreCourante || enTransition) return;
    bip('clic', 0.5);
    allerAuMarche().catch((e) => { if (vivant) console.error(e); });
  });

  // Le fouet : comme toucher le bon fourneau (le plat prêt d'abord, puis
  // l'étape en attente, puis un fourneau libre s'il y a une commande).
  surMenu('fouet', () => {
    if (vue !== 'cafe') { direUnInstant(H.fouetMarche); return; }
    if (!cafeOuvert) { direUnInstant(H.fouetFerme); return; }
    if (fenetreCourante || enTransition) return;
    const f = feux.find((x) => x.etat === 'pret')
      || feux.find((x) => x.etat === 'gestes' && x.demandee < x.etapes.length)
      || feux.find((x) => x.etat === 'sale')
      || (commandes.some((c) => c.etat === 'assise') && feux.find((x) => x.etat === 'libre'))
      || null;
    if (!f) {
      bip('non');
      direUnInstant(feux.some((x) => x.etat === 'cuisson') ? TEXTES.cuissonEnCours : H.fouetRien);
      return;
    }
    f.el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });

  ambiance('salle');
  scenario().catch((e) => { if (vivant) console.error(e); });
  if (debug !== null) {
    window.__e5 = {
      get pieces() { return pieces; },
      get frigo() { return Object.fromEntries(frigo); },
      recette: (k) => ({ ...RECETTES[k].ingredients }),
      get stock() { return Object.fromEntries([...stock].map(([k, e]) => [k, e.n])); },
      get pot() { return Object.fromEntries(pot); },
      get commandes() { return commandes.map((c) => ({ sorte: c.sorte, etat: c.etat, recette: c.libre ? null : c.recette })); },
      get vue() { return vue; },
      get son() { return son.ambianceCourante ? son.ambianceCourante() : null; },
      get feux() { return feux.map((f) => ({ etat: f.etat, recette: f.cle || null, reste: Math.ceil(f.total - f.fait), etapes: f.etapes?.length, demandee: f.demandee, faites: f.faites })); },
      besoins: (sorte) => Object.fromEntries(besoins(commandes.find((c) => c.sorte === sorte))),
      // pour les essais : ouvrir directement les fenêtres d'après les maquettes
      fenetres: {
        roue: () => fenetreRoue(),
        garniture: () => fenetreGarniture(),
        epice: (k = 'vanille') => proposerEpice(k),
        express: () => proposerExpress(feux[0]),
        hourra: (k = 'chocolat', n = 1) => hourra(k, n, TEXTES.hourra.frigo),
      },
      ajouter: (k, n = 1) => { frigo.set(k, nb(k) + n); majBadge(); },
      pieces0: () => ajouterPieces(-pieces),
    };
  }

  return () => {
    vivant = false;
    for (const id of minuteurs) clearTimeout(id);
    cancelAnimationFrame(horloge);
    observateur.disconnect();
    arreterPromeneurs();
    document.body.classList.remove('e5-en-jeu');
    delete window.__e5;
  };
}

export default {
  fond: 'clair',
  ambiance: SONS.salle.fichier,
  demarrer,
};
