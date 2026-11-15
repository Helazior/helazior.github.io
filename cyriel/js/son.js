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
let voulue = null;       // ambiance demandée par l'étape en cours
let courante = null;     // ambiance qui joue réellement

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

/** Demande l'ambiance d'une étape (chemin d'un fichier, ou null pour le silence). */
export function ambiance(url) {
  voulue = url || null;
  if (ctx) appliquerAmbiance();
}

function appliquerAmbiance() {
  if ((courante ? courante.url : null) === voulue) return;

  if (courante) {
    const ancienne = courante;
    rampe(ancienne.gain, 0);
    setTimeout(() => { ancienne.audio.pause(); ancienne.audio.src = ''; }, FONDU * 1000 + 200);
    courante = null;
  }
  if (!voulue) return;

  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'auto';
  audio.src = voulue;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  try {
    ctx.createMediaElementSource(audio).connect(gain);
    gain.connect(busAmbiance);
  } catch { /* le fichier jouera quand même, sans fondu */ }
  // Fichier absent (les musiques seront ajoutées plus tard) : on reste en silence.
  audio.addEventListener('error', () => {}, { once: true });
  audio.play().catch(() => {});
  rampe(gain, 1);
  courante = { url: voulue, audio, gain };
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
    case 'sortie':
      [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        ton({ de: f, duree: 2.0, volume: 0.1, attaque: 0.5, retard: i * 0.09 });
      });
      break;
  }
}
