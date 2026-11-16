// Clins d'œil : Cyriel et Clément, dessinés d'après leurs photos, à glisser
// dans les décors du jeu. Placés : duoSpeleo (grotte, salle des mammouths),
// cyrielChapeau et duoCamargue (marais, au bord de l'étang), cyrielClin (photo
// sur le frigo du café), duoSpeleo et cyrielChapeau (cadres du café, écran
// large), cyrielNatte (marché). Libres : cyrielColRoule.
//
// Chaque fonction renvoie un morceau de SVG (texte), origine aux pieds, pour
// un personnage d'environ 20 × 50 :
//   duoSpeleo()       tous les deux en combinaison, casque et lampe frontale
//                     (pour la grotte) ; { lueur: true } ajoute le halo des lampes
//   cyrielChapeau()   son bob à fleurs et sa chemise violette (pour l'étang)
//   duoCamargue()     en sortie nature : bandeau, jumelles, appareil photo
//   cyrielClin()      clin d'œil, la main sur la joue (pour le café)
//   cyrielNatte()     sa natte sur l'épaule et sa polaire
//   cyrielColRoule()  chignon, col roulé et regard en coin
//
// Pour en placer un :  `<g transform="translate(x y) scale(1.4)">${cyrielChapeau()}</g>`

const ENCRE = '#1a1026';
const PEAU = '#f4d3bf';
const OMBRE = '#e0a688';
const CHEVEUX = '#4a3024';
const REFLET = '#70493a';
const OR = '#e0b44c';
const MONTURE = '#dcae84';

/* ------------------------------------------------------------ Morceaux */

const jambes = (bas, chaussures) => `
  <rect x="-5.5" y="-10" width="4.4" height="9" rx="2" fill="${bas}"/><rect x="1.1" y="-10" width="4.4" height="9" rx="2" fill="${bas}"/>
  <ellipse cx="-3.4" cy="-1" rx="3.4" ry="2" fill="${chaussures}"/><ellipse cx="3.4" cy="-1" rx="3.4" ry="2" fill="${chaussures}"/>`;

const tronc = (c) => `<path d="M-8 -9 Q-9 -21 -6 -23 H6 Q9 -21 8 -9 Z" fill="${c}"/>`;

const brasBas = (c, cote, main = PEAU) => `
  <path d="M${cote * 7.5} -19 Q${cote * 10} -15 ${cote * 9.5} -11" stroke="${c}" stroke-width="4.4" stroke-linecap="round" fill="none"/>
  <circle cx="${cote * 9.4}" cy="-10.3" r="2.4" fill="${main}"/>`;

const hexagone = (cx, cy, r) => {
  const p = [0, 1, 2, 3, 4, 5].map((k) => {
    const t = (Math.PI / 3) * k + Math.PI / 6;
    return `${(cx + r * Math.cos(t)).toFixed(2)} ${(cy + r * 0.94 * Math.sin(t)).toFixed(2)}`;
  });
  return `M${p.join(' L')} Z`;
};

// Ses lunettes fines, dorées, à six côtés.
const lunettes = () => `
  <path d="${hexagone(-4.1, -33.3, 3.5)} ${hexagone(4.1, -33.3, 3.5)}" fill="#fff" fill-opacity=".16" stroke="${MONTURE}" stroke-width=".5" stroke-linejoin="round"/>
  <path d="M-1.1 -34 Q0 -34.8 1.1 -34 M-7.2 -34.2 L-9.6 -34.8 M7.2 -34.2 L9.6 -34.8" stroke="${MONTURE}" stroke-width=".5" fill="none" stroke-linecap="round"/>`;

const lunettesSoleil = () => `
  <rect x="-7.6" y="-36" width="6.6" height="5" rx="2.2" fill="#2a2330" stroke="#5a3d2a" stroke-width=".7"/>
  <rect x="1" y="-36" width="6.6" height="5" rx="2.2" fill="#2a2330" stroke="#5a3d2a" stroke-width=".7"/>
  <path d="M-1 -34.4 Q0 -35 1 -34.4 M-7.6 -34.6 L-9.6 -35 M7.6 -34.6 L9.6 -35" stroke="#5a3d2a" stroke-width=".8" fill="none"/>
  <path d="M-6.4 -35 l1.6 0 M2.2 -35 l1.6 0" stroke="#fff" stroke-opacity=".5" stroke-width=".7" stroke-linecap="round"/>`;

const oeil = (x, dx = 0) => `
  <circle cx="${x + dx}" cy="-33.3" r="1.5" fill="#6b4630" stroke="${ENCRE}" stroke-width=".7"/><circle cx="${x + dx}" cy="-33.3" r=".65" fill="${ENCRE}"/>
  <circle cx="${x + dx + 0.6}" cy="-33.9" r=".42" fill="#fff"/>`;
const oeilFerme = (x) => `<path d="M${x - 1.7} -33 Q${x} -34.8 ${x + 1.7} -33" stroke="${ENCRE}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;

function yeux(expression) {
  switch (expression) {
    case 'clin': return oeil(-4.1) + oeilFerme(4.1);
    case 'rieur': return oeilFerme(-4.1) + oeilFerme(4.1);
    case 'coin': return `<ellipse cx="-4.1" cy="-33.3" rx="2.1" ry="1.8" fill="#fff"/><ellipse cx="4.1" cy="-33.3" rx="2.1" ry="1.8" fill="#fff"/>${oeil(-4.1, 0.8)}${oeil(4.1, 0.8)}`;
    case 'aucun': return '';
    default: return oeil(-4.1) + oeil(4.1);
  }
}

function bouche(expression) {
  if (expression === 'coin') return `<path d="M-2.8 -27 Q0.8 -25.2 3.6 -27.8" stroke="#a8384a" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M3.4 -28.6 q.9 .5 .5 1.5" stroke="${OMBRE}" stroke-width=".6" fill="none"/>`;
  if (expression === 'doux') return `<path d="M-2.8 -27.2 Q0 -25.2 2.8 -27.2" stroke="#a8384a" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  return `<path d="M-3.8 -28.2 Q0 -27.5 3.8 -28.2 Q3 -24.4 0 -24.2 Q-3 -24.4 -3.8 -28.2 Z" fill="#a8384a"/>
    <path d="M-3.4 -28 Q0 -27.4 3.4 -28 L3.1 -26.8 Q0 -26.4 -3.1 -26.8 Z" fill="#fff"/>`;
}

// Le visage de Cyriel : front haut, sourcils bruns, créoles dorées.
function visageCyriel({ expression = 'sourire', verres = 'vue', sourcils = true } = {}) {
  return `
    <circle cx="-9.8" cy="-32.4" r="2.1" fill="${PEAU}"/><circle cx="9.8" cy="-32.4" r="2.1" fill="${PEAU}"/>
    <circle cx="-10.1" cy="-29" r="1.5" fill="none" stroke="${OR}" stroke-width=".9"/><circle cx="10.1" cy="-29" r="1.5" fill="none" stroke="${OR}" stroke-width=".9"/>
    <ellipse cx="0" cy="-33.4" rx="9.6" ry="11.4" fill="${PEAU}"/>
    ${sourcils ? `<path d="M-6.4 -37.6 Q-4.2 -38.9 -2 -37.9 M2 -37.9 Q4.2 -38.9 6.4 -37.6" stroke="${CHEVEUX}" stroke-width="1.05" fill="none" stroke-linecap="round"/>` : ''}
    ${verres === 'soleil' ? '' : yeux(expression === 'sourire' || expression === 'doux' ? 'ouverts' : expression)}
    <path d="M0.3 -31.6 Q1.3 -29.8 0 -29.3" stroke="${OMBRE}" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <ellipse cx="-6.6" cy="-29" rx="1.9" ry="1.1" fill="#ff9cb0" opacity=".5"/><ellipse cx="6.6" cy="-29" rx="1.9" ry="1.1" fill="#ff9cb0" opacity=".5"/>
    ${bouche(expression === 'clin' || expression === 'rieur' ? 'sourire' : expression)}
    ${verres === 'soleil' ? lunettesSoleil() : verres === 'vue' ? lunettes() : ''}`;
}

// Cheveux tirés en arrière, raie au milieu.
const cheveuxDessus = () => `
  <path d="M-9.3 -36 C-10 -42.6 -6.2 -46.2 0 -46.4 C6.2 -46.2 10 -42.6 9.3 -36 C8.4 -40.2 5.4 -43 0.5 -43.8 L0 -42.6 L-0.5 -43.8 C-5.4 -43 -8.4 -40.2 -9.3 -36 Z" fill="${CHEVEUX}"/>
  <path d="M-6.6 -43.2 C-4.6 -45 -2 -45.6 -0.5 -45.4 M6.6 -43.2 C4.6 -45 2 -45.6 0.5 -45.4" stroke="${REFLET}" stroke-width=".7" fill="none" stroke-linecap="round"/>`;

// Cheveux longs : la masse derrière le corps, puis deux mèches devant.
const cheveuxLongsDerriere = () => `<path d="M-12 -13 C-14.6 -26 -13.6 -40 -6.6 -45 C-2 -47.8 4 -47.6 8.6 -44.6 C14 -40.4 14.6 -26 12 -13 C10.6 -11 8.2 -11.6 7.4 -14.4 L-7.4 -14.4 C-8.2 -11.6 -10.6 -11 -12 -13 Z" fill="${CHEVEUX}"/>`;
const meches = () => `
  <path d="M-9.5 -31 C-11.4 -25 -10.6 -17 -7.4 -11.6 C-6.6 -17 -6.9 -24 -7.9 -30 Z" fill="${CHEVEUX}"/>
  <path d="M9.5 -31 C11.4 -25 10.6 -17 7.4 -11.6 C6.6 -17 6.9 -24 7.9 -30 Z" fill="${CHEVEUX}"/>
  <path d="M-9.6 -24 C-9.6 -19.6 -8.6 -15.6 -7.6 -13.2 M9.6 -24 C9.6 -19.6 8.6 -15.6 7.6 -13.2" stroke="${REFLET}" stroke-width=".7" fill="none" stroke-linecap="round"/>`;

function natte(cote = 1) {
  let d = '';
  for (let k = 0; k < 6; k++) {
    const x = cote * (9 - k * 0.55);
    const y = -27 + k * 3;
    d += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.3" ry="1.9" fill="${CHEVEUX}" stroke="#2f1d15" stroke-width=".6" transform="rotate(${(k % 2 ? 24 : -24) * cote} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  const x = cote * 5.9;
  return `${d}<rect x="${(x - 1.4).toFixed(1)}" y="-10" width="2.8" height="1.5" rx=".7" fill="#efe3cf"/><path d="M${(x - 1.3).toFixed(1)} -8.5 Q${x.toFixed(1)} -5 ${(x + 1.3).toFixed(1)} -8.5 Z" fill="${CHEVEUX}"/>`;
}

// Casque de spéléo avec sa lampe frontale et sa jugulaire.
const casque = (couleur) => `
  <path d="M-9.6 -35 L-6.2 -24.6 M9.6 -35 L6.2 -24.6" stroke="#23232b" stroke-width=".8" fill="none"/>
  <path d="M-10.9 -35.4 C-11.8 -47.8 11.8 -47.8 10.9 -35.4 Q0 -39.6 -10.9 -35.4 Z" fill="${couleur}" stroke="${ENCRE}" stroke-width=".8" stroke-linejoin="round"/>
  <path d="M-10.6 -38 Q0 -42 10.6 -38" stroke="#23232b" stroke-width="1.5" fill="none"/>
  <rect x="-3.2" y="-44.2" width="6.4" height="4.4" rx="1.2" fill="#23232b"/><circle cx="0" cy="-42" r="1.5" fill="#fff4c2"/>
  <path d="M-7.4 -44 Q-5 -45.8 -2.4 -46.2" stroke="#fff" stroke-opacity=".55" stroke-width=".9" fill="none" stroke-linecap="round"/>`;

// Combinaison néoprène, baudrier et longe rouge.
function combinaison({ ouverte = false } = {}) {
  const noir = '#23232b';
  const bleu = '#2f4a55';
  return `
    <rect x="-5.5" y="-10" width="4.4" height="9" rx="2" fill="${bleu}"/><rect x="1.1" y="-10" width="4.4" height="9" rx="2" fill="${bleu}"/>
    <rect x="-5.5" y="-10" width="4.4" height="3.4" rx="1.4" fill="${noir}"/><rect x="1.1" y="-10" width="4.4" height="3.4" rx="1.4" fill="${noir}"/>
    <ellipse cx="-3.4" cy="-1" rx="3.4" ry="2" fill="#2a2a30"/><ellipse cx="3.4" cy="-1" rx="3.4" ry="2" fill="#2a2a30"/>
    <path d="M-6.4 -0.6 h2.4 M4 -0.6 h2.4" stroke="#8fd16a" stroke-width=".8"/>
    ${brasBas(noir, -1)}${brasBas(noir, 1)}
    ${tronc(noir)}
    <path d="M-8.2 -12 Q-8.6 -18 -7.4 -21.4 L-6 -21 Q-6.8 -17 -6.4 -12 Z M8.2 -12 Q8.6 -18 7.4 -21.4 L6 -21 Q6.8 -17 6.4 -12 Z" fill="${bleu}"/>
    ${ouverte
      ? `<path d="M-1.8 -23 L0 -15.6 L1.8 -23 Z" fill="#f2cbae"/><path d="M0 -15.6 V-12.6" stroke="#8b8b98" stroke-width=".7"/>`
      : `<rect x="-3.4" y="-25" width="6.8" height="3" rx="1.2" fill="${noir}"/><path d="M0 -22 V-12.6" stroke="#44444e" stroke-width=".6"/>`}
    <circle cx="3.6" cy="-19.4" r="1" fill="none" stroke="#e8e6ee" stroke-width=".6"/>
    <rect x="-8.1" y="-12.6" width="16.2" height="2" rx="1" fill="#9aa3ad"/>
    <path d="M-5.6 -10.6 Q-4.8 -7.6 -2 -8 M5.6 -10.6 Q4.8 -7.6 2 -8" stroke="#9aa3ad" stroke-width="1" fill="none"/>
    <path d="M-2.6 -11.6 C-5.4 -9 -4.6 -5.4 -2.6 -5.6 C-1 -5.8 -1.4 -9 -0.4 -11.6 M1 -11.6 C3 -10.6 5 -10.8 6.6 -12" stroke="#e2574c" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
}

// La tête de Clément (voir aussi le marché du café).
function teteClement({ couvert = false, regard = 0 } = {}) {
  const peau = '#f2cbae';
  const ombre = '#d99c7c';
  const cheveux = '#3b2a20';
  return `
    <circle cx="-10.3" cy="-32" r="2.3" fill="${peau}"/><circle cx="10.3" cy="-32" r="2.3" fill="${peau}"/>
    <ellipse cx="0" cy="-33" rx="10.3" ry="11.2" fill="${peau}"/>
    ${couvert ? '' : `
    <path d="M-10.5 -32.4 C-10.8 -36.4 -9.6 -39 -7.6 -40.4 L-8.4 -34.4 C-9.2 -33.6 -9.9 -33 -10.5 -32.4 Z M10.5 -32.4 C10.8 -36.4 9.6 -39 7.6 -40.4 L8.4 -34.4 C9.2 -33.6 9.9 -33 10.5 -32.4 Z" fill="${cheveux}"/>
    <path d="M-9.8 -36 C-10.4 -42 -6.8 -46.4 -1.6 -47.4 C2.4 -49.4 7.4 -48.8 9.6 -45.6 C11 -43.6 11 -40.8 10.2 -38.6 C10.3 -37.7 10.2 -36.8 9.9 -36 C8.4 -38.9 5.2 -40.6 1.4 -40.8 C-3.2 -41 -7.2 -39.2 -9.8 -36 Z" fill="${cheveux}"/>
    <path d="M-2.6 -46.8 C-3.6 -49.2 -0.6 -50.6 2.4 -49.6 C0.9 -49.2 -0.2 -48.4 -0.4 -47.4 Z" fill="${cheveux}"/>
    <path d="M-6.4 -41.8 C-4.2 -45 0.8 -46.6 5.6 -45.6" stroke="#5c4434" stroke-width="1.1" fill="none" stroke-linecap="round"/>`}
    <path d="M-6.9 -37.2 Q-4.5 -38.7 -1.9 -37.5 M1.9 -37.5 Q4.5 -38.7 6.9 -37.2" stroke="${cheveux}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <circle cx="${-4 + regard}" cy="-33.6" r="1.75" fill="#2f9e9a" stroke="${ENCRE}" stroke-width=".7"/><circle cx="${4 + regard}" cy="-33.6" r="1.75" fill="#2f9e9a" stroke="${ENCRE}" stroke-width=".7"/>
    <circle cx="${-4 + regard}" cy="-33.6" r=".7" fill="${ENCRE}"/><circle cx="${4 + regard}" cy="-33.6" r=".7" fill="${ENCRE}"/>
    <circle cx="${-3.4 + regard}" cy="-34.3" r=".5" fill="#fff"/><circle cx="${4.6 + regard}" cy="-34.3" r=".5" fill="#fff"/>
    <path d="M0.3 -31.8 Q1.3 -30.2 0 -29.7" stroke="${ombre}" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <ellipse cx="-7.2" cy="-29.2" rx="1.8" ry="1.1" fill="#ff9cc8" opacity=".45"/><ellipse cx="7.2" cy="-29.2" rx="1.8" ry="1.1" fill="#ff9cc8" opacity=".45"/>
    <path d="M-4.4 -28.4 Q0 -27.7 4.4 -28.4 Q3.6 -23.6 0 -23.4 Q-3.6 -23.6 -4.4 -28.4 Z" fill="#8a2f3a"/>
    <path d="M-4 -28.2 Q0 -27.6 4 -28.2 L3.7 -26.8 Q0 -26.3 -3.7 -26.8 Z" fill="#fff"/>`;
}

const ombreSol = (rx = 10) => `<ellipse cx="0" cy="0" rx="${rx}" ry="3.6" fill="#2a1745" opacity=".16"/>`;

/* --------------------------------------------------------- Les dessins */

/** Clément en spéléo (origine aux pieds) : combinaison, casque et frontale. */
export function speleoClement({ lueur = false } = {}) {
  const halo = lueur ? '<circle cx="0" cy="-42" r="13" fill="#fff4c2" opacity=".22"/>' : '';
  return `
    ${ombreSol()}
    <g transform="rotate(3 0 -10) scale(1.1)">
      ${combinaison({ ouverte: true })}
      ${teteClement({ couvert: true })}
      ${casque('#d8434b')}
      ${halo}
    </g>`;
}

/** Cyriel en spéléo (origine aux pieds). */
export function speleoCyriel({ lueur = false } = {}) {
  const halo = lueur ? '<circle cx="0" cy="-42" r="13" fill="#fff4c2" opacity=".22"/>' : '';
  return `
    ${ombreSol()}
    <g transform="rotate(-3 0 -10)">
      ${combinaison()}
      <path d="M-9.4 -33.4 C-10.6 -31 -10.4 -28.6 -9.4 -27.4 M9.4 -33.4 C10.6 -31 10.4 -28.6 9.4 -27.4" stroke="${CHEVEUX}" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${visageCyriel({ expression: 'sourire' })}
      ${casque('#f3f1ea')}
      ${halo}
    </g>`;
}

/** Tous les deux en spéléo : combinaison, baudrier, casque et frontale. */
export function duoSpeleo(options = {}) {
  return `
  <g transform="translate(-10 0)">${speleoClement(options)}</g>
  <g transform="translate(10 0)">${speleoCyriel(options)}</g>`;
}

/** Cyriel avec son bob à fleurs et sa chemise violette à feuilles blanches. */
export function cyrielChapeau() {
  const violet = '#6a3d9c';
  const gris = '#4b5466';
  const fleur = (x, y) => `<g transform="translate(${x} ${y})"><circle cx="0" cy="-1" r=".8"/><circle cx=".95" cy="-.3" r=".8"/><circle cx=".6" cy=".8" r=".8"/><circle cx="-.6" cy=".8" r=".8"/><circle cx="-.95" cy="-.3" r=".8"/></g>`;
  return `
  ${ombreSol()}
  ${cheveuxLongsDerriere()}
  ${jambes('#3a4664', '#f4f1ea')}
  ${brasBas(violet, -1)}${brasBas(violet, 1)}
  ${tronc(violet)}
  <path d="M-6.4 -20 l3 -1.6 M-6.8 -16.4 l3.6 -2 M-6.6 -12.6 l3.6 -2 M6.4 -20 l-3 -1.6 M6.8 -16.4 l-3.6 -2 M6.6 -12.6 l-3.6 -2 M-9 -16 l1.6 -1 M9 -16 l-1.6 -1" stroke="#f3ecff" stroke-width=".9" stroke-linecap="round"/>
  <path d="M-2.6 -23 L0 -18.6 L2.6 -23 Z" fill="${PEAU}"/>
  <path d="M-5.6 -23.4 L-2.6 -23 L0 -18.6 L-3.4 -19.4 Z M5.6 -23.4 L2.6 -23 L0 -18.6 L3.4 -19.4 Z" fill="#f3ecff" stroke="${violet}" stroke-width=".6" stroke-linejoin="round"/>
  ${meches()}
  ${visageCyriel({ expression: 'clin', sourcils: false })}
  <path d="M-10 -38.6 C-10.4 -45.6 -6 -49 0 -49 C6 -49 10.4 -45.6 10 -38.6 Z" fill="${gris}"/>
  <path d="M-15 -36.6 C-12 -41 -6 -42.2 0 -42.2 C6 -42.2 12 -41 15 -36.6 C10 -38.6 5 -39.2 0 -39.2 C-5 -39.2 -10 -38.6 -15 -36.6 Z" fill="#596377" stroke="#3a4252" stroke-width=".6" stroke-linejoin="round"/>
  <g fill="#e9edf5">${fleur(-5.4, -44.4)}${fleur(0.4, -46.2)}${fleur(5.8, -44)}${fleur(-9.6, -39.4)}${fleur(9.8, -39.4)}${fleur(-2.6, -41)}${fleur(3.6, -41)}</g>
  <g fill="#f5d33f"><circle cx="-5.4" cy="-44.4" r=".45"/><circle cx=".4" cy="-46.2" r=".45"/><circle cx="5.8" cy="-44" r=".45"/></g>`;
}

/** En sortie nature : elle avec bandeau et jumelles, lui avec son appareil photo. */
export function duoCamargue() {
  const marine = '#27345c';
  const bleu = '#2f4fae';
  return `
  <g transform="translate(-10 0)">
    ${ombreSol()}
    ${jambes('#3c4048', '#e2483c')}
    ${brasBas(marine, -1)}${brasBas(marine, 1)}
    <path d="M-8.4 -6.4 Q-9.4 -21 -6 -23 H6 Q9.4 -21 8.4 -6.4 Z" fill="${marine}"/>
    <path d="M0 -22 V-6.6" stroke="#18213f" stroke-width=".7"/>
    <path d="M-4.8 -23 L-5.6 -12 M4.8 -23 L5.6 -12" stroke="#151a2b" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="-3.6" y="-25" width="7.2" height="3.4" rx="1.4" fill="#3c8f8a"/>
    <path d="M-2.4 -22 L-1.6 -16.4 M2.4 -22 L1.6 -16.4" stroke="#151a2b" stroke-width=".6"/>
    <rect x="-3.4" y="-17" width="3" height="4.6" rx="1.2" fill="#23232b"/><rect x="0.4" y="-17" width="3" height="4.6" rx="1.2" fill="#23232b"/>
    <circle cx="-1.9" cy="-12.8" r="1.1" fill="#5d6b7d"/><circle cx="1.9" cy="-12.8" r="1.1" fill="#5d6b7d"/>
    <circle cx="0" cy="-47" r="3.4" fill="${CHEVEUX}"/>
    ${visageCyriel({ expression: 'doux', verres: 'soleil', sourcils: false })}
    <path d="M-9.8 -36.6 C-10.6 -43.6 -6 -46.4 0 -46.4 C6 -46.4 10.6 -43.6 9.8 -36.6 Q0 -40 -9.8 -36.6 Z" fill="#8f7bc4"/>
    <path d="M-8.6 -40 Q0 -43.4 8.6 -40 M-6.6 -43.2 Q0 -45.6 6.6 -43.2" stroke="#7562ad" stroke-width=".7" fill="none"/>
  </g>
  <g transform="translate(11 0)">
    ${ombreSol()}
    <g transform="scale(1.1)">
      ${jambes('#23232b', '#2a2a30')}
      ${brasBas(bleu, -1)}
      <path d="M7.5 -19 Q10 -15 9.5 -11" stroke="${bleu}" stroke-width="4.4" stroke-linecap="round" fill="none"/>
      <rect x="6.6" y="-11.6" width="6.4" height="4.6" rx="1" fill="#23232b"/><circle cx="9.8" cy="-9.3" r="1.6" fill="#5d6b7d" stroke="#0f0f14" stroke-width=".6"/><rect x="7.4" y="-12.6" width="2.4" height="1.2" fill="#23232b"/>
      <circle cx="9.2" cy="-11.2" r="2" fill="#f2cbae"/>
      <path d="M-8.2 -8 Q-9.2 -21 -6 -23 H6 Q9.2 -21 8.2 -8 Z" fill="${bleu}"/>
      <path d="M-7.6 -21 L1 -21.6 L4.6 -15.4 L-8.4 -14.4 Q-8.4 -18.6 -7.6 -21 Z" fill="#f1f3f8"/>
      <path d="M1.6 -22 V-8.2" stroke="#1f3684" stroke-width=".7"/>
      <rect x="-4" y="-25.4" width="8" height="3.8" rx="1.8" fill="#f4f1ea" stroke="#d9d4c6" stroke-width=".5"/>
      ${teteClement({ regard: 0.9 })}
    </g>
  </g>`;
}

/** Cyriel qui fait un clin d'œil, la main sur la joue, en chemise rayée. */
export function cyrielClin() {
  const chemise = '#e4ecf9';
  const rayures = [-6, -4, -2, 0, 2, 4, 6].map((x) => `M${x} -22.4 V-9.6`).join(' ');
  return `
  ${ombreSol()}
  ${cheveuxLongsDerriere()}
  ${jambes('#27345c', '#f4f1ea')}
  ${brasBas(chemise, -1)}
  ${tronc(chemise)}
  <path d="${rayures}" stroke="#8aa7d6" stroke-width=".55"/>
  <path d="M-2.6 -23 L0 -18.6 L2.6 -23 Z" fill="${PEAU}"/>
  <path d="M-5.6 -23.4 L-2.6 -23 L0 -18.6 L-3.4 -19.4 Z M5.6 -23.4 L2.6 -23 L0 -18.6 L3.4 -19.4 Z" fill="${chemise}" stroke="#8aa7d6" stroke-width=".6" stroke-linejoin="round"/>
  ${meches()}
  <g transform="rotate(7 0 -24)">
    ${visageCyriel({ expression: 'clin' })}
    ${cheveuxDessus()}
  </g>
  <path d="M7.4 -18.6 Q11.6 -19 10.4 -24" stroke="${chemise}" stroke-width="4.2" stroke-linecap="round" fill="none"/>
  <path d="M9.8 -25.4 Q9.2 -28.4 7.8 -30.4" stroke="${PEAU}" stroke-width="3.6" stroke-linecap="round" fill="none"/>
  <path d="M8.6 -29.6 l-.6 -2.4 M10 -28.8 l.2 -2.6" stroke="${PEAU}" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M8 -27.6 Q8.9 -27 9.8 -27.6" stroke="${OMBRE}" stroke-width=".6" fill="none"/>`;
}

/** Cyriel avec sa natte sur l'épaule et sa polaire bleu nuit. */
export function cyrielNatte() {
  const polaire = '#2b3350';
  return `
  ${ombreSol()}
  ${jambes('#3a3f55', '#3b2a52')}
  ${brasBas(polaire, -1)}${brasBas(polaire, 1)}
  ${tronc(polaire)}
  <rect x="-3.8" y="-25" width="7.6" height="3.4" rx="1.5" fill="#222943"/>
  <path d="M0 -21.6 V-16" stroke="#8b93b3" stroke-width=".7"/>
  ${visageCyriel({ expression: 'rieur' })}
  ${cheveuxDessus()}
  ${natte(1)}`;
}

/** Cyriel en col roulé gris, chignon, regard en coin et petit sourire. */
export function cyrielColRoule() {
  const gris = '#4c4c55';
  return `
  ${ombreSol()}
  <circle cx="2" cy="-47.4" r="4.4" fill="${CHEVEUX}"/><path d="M-0.6 -49 Q2 -51 4.6 -49" stroke="${REFLET}" stroke-width=".7" fill="none"/>
  ${jambes('#2e3142', '#3b2a52')}
  ${brasBas(gris, -1)}${brasBas(gris, 1)}
  ${tronc(gris)}
  <rect x="-4.2" y="-26" width="8.4" height="4.4" rx="2" fill="#5a5a64"/>
  <path d="M-3 -24.6 H3 M-3 -23 H3" stroke="#44444d" stroke-width=".5"/>
  ${visageCyriel({ expression: 'coin' })}
  ${cheveuxDessus()}`;
}

export const CLINS = { duoSpeleo, cyrielChapeau, duoCamargue, cyrielClin, cyrielNatte, cyrielColRoule };
