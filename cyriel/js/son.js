// Son du jeu : une ambiance par étape (fichiers dans sons/), avec fondu
// enchaîné, et de petits bruitages fabriqués en direct par le navigateur.
//
// Les navigateurs interdisent tout son avant le premier geste de la
// joueuse : rien ne démarre avant l'appel à eveiller().

const CLE_COUPE = 'cyriel.son.coupe';
const FONDU = 1.8; // secondes

let ctx = null;
let maitre = null;       // volume général (coupé / ouvert)
let busAmbiance = null;
let busBruitages = null;
let coupe = lire();
let voulue = null;       // ambiance demandée : { url, volume }, ou null
let courante = null;     // piste qui joue réellement
const pistes = new Map(); // pistes déjà ouvertes : elles reprennent où elles en étaient

function lire() {
  try { return localStorage.getItem(CLE_COUPE) === '1'; } catch { return false; }
}

export function estCoupe() { return coupe; }

export function basculer() {
  coupe = !coupe;
  try { localStorage.setItem(CLE_COUPE, coupe ? '1' : '0'); } catch { /* tant pis */ }
  if (maitre) maitre.gain.setTargetAtTime(coupe ? 0 : 1, ctx.currentTime, 0.05);
  return coupe;
}

/** À appeler sur un vrai geste (clic, toucher) : ouvre le son. */
export function eveiller() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    ctx = new Ctx();
    maitre = ctx.createGain();
    maitre.gain.value = coupe ? 0 : 1;
    maitre.connect(ctx.destination);
    busAmbiance = ctx.createGain();
    busAmbiance.gain.value = 0.55;
    busAmbiance.connect(maitre);
    busBruitages = ctx.createGain();
    busBruitages.gain.value = 0.9;
    busBruitages.connect(maitre);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  appliquerAmbiance();
}

/* ------------------------------------------------------------ Ambiance */

/**
 * Demande une ambiance : chemin d'un fichier (ou null pour le silence), et
 * son volume (1 = normal). Changer de fichier fait un fondu enchaîné ; une
 * piste déjà entendue reprend là où elle s'était arrêtée.
 */
export function ambiance(url, volume = 1) {
  voulue = url ? { url, volume } : null;
  if (ctx) appliquerAmbiance();
}

/** L'ambiance qui joue (pour les essais) : chemin et volume visé, ou null. */
export function ambianceCourante() {
  return courante && voulue ? { url: courante.url, volume: voulue.volume, pause: courante.audio.paused } : null;
}

function appliquerAmbiance() {
  const cible = voulue ? voulue.url : null;
  if (courante && courante.url === cible) {      // même piste : seul le volume change
    rampe(courante.gain, voulue.volume);
    return;
  }
  if (courante) {
    const ancienne = courante;
    rampe(ancienne.gain, 0);
    clearTimeout(ancienne.arret);
    ancienne.arret = setTimeout(() => { if (courante !== ancienne) ancienne.audio.pause(); }, FONDU * 1000 + 200);
    courante = null;
  }
  if (!cible) return;

  let piste = pistes.get(cible);
  if (!piste) {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.src = cible;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    try {
      ctx.createMediaElementSource(audio).connect(gain);
      gain.connect(busAmbiance);
    } catch { /* le fichier jouera quand même, sans fondu */ }
    // Fichier absent (les musiques seront ajoutées plus tard) : on reste en silence.
    audio.addEventListener('error', () => {}, { once: true });
    piste = { url: cible, audio, gain, arret: 0 };
    pistes.set(cible, piste);
  }
  clearTimeout(piste.arret);
  piste.audio.play().catch(() => {});
  rampe(piste.gain, voulue.volume);
  courante = piste;
}

function rampe(gain, cible) {
  const t = ctx.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(gain.gain.value, t);
  gain.gain.linearRampToValueAtTime(cible, t + FONDU);
}

/* ----------------------------------------------------------- Bruitages */

function ton({ type = 'sine', de, a = de, duree, volume = 0.2, attaque = 0.006, retard = 0 }) {
  const t0 = ctx.currentTime + retard;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(de, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, a), t0 + duree);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(volume, t0 + attaque);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
  osc.connect(g).connect(busBruitages);
  osc.start(t0);
  osc.stop(t0 + duree + 0.05);
}

let tamponBruit = null;
function bruit({ duree, volume = 0.2, filtre = 'lowpass', de = 800, a = de, q = 0.8, retard = 0 }) {
  if (!tamponBruit) {
    tamponBruit = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = tamponBruit.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t0 = ctx.currentTime + retard;
  const src = ctx.createBufferSource();
  src.buffer = tamponBruit;
  const f = ctx.createBiquadFilter();
  f.type = filtre;
  f.Q.value = q;
  f.frequency.setValueAtTime(de, t0);
  f.frequency.exponentialRampToValueAtTime(Math.max(20, a), t0 + duree);
  const g = ctx.createGain();
  g.gain.setValueAtTime(volume, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
  src.connect(f).connect(g).connect(busBruitages);
  src.start(t0, Math.random() * 0.5);
  src.stop(t0 + duree + 0.05);
}

/**
 * Joue un bruitage. `p` (0 à 1) fait varier certains sons, par exemple la
 * hauteur du « pop » qui monte à chaque clic de l'étape 1.
 */
export function bip(nom, p = 0) {
  if (!ctx || coupe) return;
  switch (nom) {
    case 'clic': {
      const f = 330 * Math.pow(2, p * 1.1);
      ton({ type: 'triangle', de: f * 0.75, a: f * 1.6, duree: 0.11, volume: 0.28 });
      break;
    }
    case 'non':
      ton({ type: 'triangle', de: 560, a: 170, duree: 0.2, volume: 0.22 });
      ton({ type: 'sine', de: 230, a: 300, duree: 0.09, volume: 0.14, retard: 0.17 });
      break;
    case 'eclat':
      bruit({ duree: 0.45, volume: 0.5, filtre: 'bandpass', de: 1800, a: 160, q: 0.6 });
      ton({ type: 'sine', de: 140, a: 45, duree: 0.3, volume: 0.4 });
      for (let i = 0; i < 9; i++) {
        const f = 2400 + Math.random() * 2600;
        ton({ de: f, a: f * 0.7, duree: 0.06, volume: 0.06, retard: 0.08 + i * 0.07 + Math.random() * 0.04 });
      }
      break;
    case 'onde':
      for (let i = 0; i < 3; i++) {
        ton({ de: 1900, a: 950, duree: 0.5, volume: 0.2 / (1 + i * 2.2), retard: i * 0.21 });
      }
      break;
    case 'vol':
      bruit({ duree: 0.09, volume: 0.1, de: 620, a: 240 });
      bruit({ duree: 0.09, volume: 0.08, de: 560, a: 220, retard: 0.13 });
      break;
    case 'poc':
      ton({ de: 170, a: 62, duree: 0.13, volume: 0.42 });
      bruit({ duree: 0.035, volume: 0.16, filtre: 'highpass', de: 1400 });
      break;
    case 'craque':      // une stalactite tremble (p : proximité)
      for (let i = 0; i < 3; i++) bruit({ duree: 0.04, volume: 0.09 * p, filtre: 'highpass', de: 2400 + i * 500, retard: i * 0.07 });
      break;
    case 'caillou':     // elle s'écrase au sol
      ton({ de: 210, a: 70, duree: 0.12, volume: 0.25 * p });
      bruit({ duree: 0.12, volume: 0.12 * p, filtre: 'bandpass', de: 1500, a: 500, q: 0.7 });
      break;
    case 'aie':
      ton({ type: 'triangle', de: 700, a: 300, duree: 0.18, volume: 0.26 });
      bruit({ duree: 0.1, volume: 0.18, filtre: 'bandpass', de: 1200, a: 400, q: 0.8 });
      break;
    case 'miam':
      ton({ type: 'triangle', de: 620, a: 930, duree: 0.07, volume: 0.2 });
      ton({ type: 'triangle', de: 930, a: 1400, duree: 0.09, volume: 0.2, retard: 0.08 });
      break;
    case 'chiffre':
      [880, 1108.7, 1318.5, 1760, 2217.5].forEach((f, i) => {
        ton({ de: f, duree: 0.5, volume: 0.13, retard: i * 0.075 });
        ton({ de: f * 2.005, duree: 0.3, volume: 0.04, retard: i * 0.075 });
      });
      break;
    case 'piece':
      ton({ type: 'square', de: 988, duree: 0.07, volume: 0.06 });
      ton({ type: 'square', de: 1319, duree: 0.24, volume: 0.06, retard: 0.07 });
      break;
    case 'sonnette':
      [0, 0.17].forEach((r) => {
        ton({ de: 1568, duree: 0.9, volume: 0.12, retard: r });
        ton({ de: 3145, duree: 0.5, volume: 0.04, retard: r });
      });
      break;
    case 'ding':
      ton({ de: 1046.5, duree: 1.2, volume: 0.16 });
      ton({ de: 2093, duree: 0.8, volume: 0.06 });
      ton({ de: 2637, duree: 0.6, volume: 0.035 });
      break;
    case 'plouf':
      ton({ de: 700, a: 180, duree: 0.16, volume: 0.22 });
      bruit({ duree: 0.08, volume: 0.06, filtre: 'highpass', de: 2000, retard: 0.02 });
      break;
    case 'feu':
      bruit({ duree: 0.6, volume: 0.16, filtre: 'lowpass', de: 900, a: 300 });
      break;
    case 'beurk':
      ton({ type: 'sawtooth', de: 330, a: 140, duree: 0.45, volume: 0.08 });
      ton({ type: 'triangle', de: 260, a: 105, duree: 0.55, volume: 0.12, retard: 0.05 });
      break;
    case 'croque':
      [0, 0.12, 0.24].forEach((r) => bruit({ duree: 0.07, volume: 0.24, filtre: 'bandpass', de: 2600, a: 1300, q: 1.4, retard: r }));
      break;
    case 'eclosion':
      [784, 988, 1175, 1568].forEach((f, i) => ton({ de: f, duree: 0.35, volume: 0.09, retard: i * 0.06 }));
      bruit({ duree: 0.3, volume: 0.05, filtre: 'highpass', de: 4000, retard: 0.05 });
      break;
    case 'papier':
      bruit({ duree: 0.25, volume: 0.12, filtre: 'bandpass', de: 3000, a: 1200, q: 1.2 });
      break;
    case 'sortie':
      [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        ton({ de: f, duree: 2.0, volume: 0.1, attaque: 0.5, retard: i * 0.09 });
      });
      break;
    case 'ocelles':
      // les ailes s'ouvrent d'un coup
      bruit({ duree: 0.2, volume: 0.24, filtre: 'bandpass', de: 900, a: 2800, q: 0.7 });
      ton({ type: 'triangle', de: 320, a: 980, duree: 0.18, volume: 0.12 });
      break;
    case 'tampon':
      ton({ de: 150, a: 70, duree: 0.14, volume: 0.38 });
      bruit({ duree: 0.06, volume: 0.2, filtre: 'lowpass', de: 900 });
      break;
    case 'pschitt':
      bruit({ duree: 0.4, volume: 0.2, filtre: 'highpass', de: 3200, a: 1400 });
      ton({ type: 'sawtooth', de: 240, a: 180, duree: 0.25, volume: 0.04 });
      break;
    case 'bulles':
      for (let i = 0; i < 4; i++) {
        const f = 480 + Math.random() * 380;
        ton({ de: f, a: f * 1.8, duree: 0.07, volume: 0.09, retard: i * 0.1 });
      }
      break;
    case 'allume':
      bruit({ duree: 0.12, volume: 0.14, filtre: 'highpass', de: 2600 });
      ton({ de: 1760, a: 2400, duree: 0.12, volume: 0.05 });
      break;
    case 'souffle':
      bruit({ duree: 0.55, volume: 0.28, filtre: 'bandpass', de: 1100, a: 380, q: 0.5 });
      break;
    case 'anniversaire': {
      // « Joyeux anniversaire » (air du domaine public), en boîte à musique.
      const N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
      const air = [
        ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
        ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
        ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
        ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
      ];
      const temps = 0.42;
      let t = 0;
      for (const [n, d] of air) {
        ton({ de: N[n], duree: Math.max(0.4, d * temps * 1.6), volume: 0.13, retard: t });
        ton({ de: N[n] * 2, duree: 0.3, volume: 0.035, retard: t });
        t += d * temps;
      }
      break;
    }
  }
}
