// Étape 5 — la petite course entre le marais et le café.
//
// Une étape à part entière, pour pouvoir y aller directement :
//   ?etape=5  (et ?etape=5&debug=vite pour aller 4 fois plus vite).
// Le jeu lui-même est dans course.js.

import { course } from './course.js';

function demarrer({ scene, son, fx, suivante, debug }) {
  const V = debug === 'vite' ? 4 : 1;
  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const racine = document.createElement('div');
  racine.className = 'e4';
  scene.append(racine);
  let vivant = true;

  (async () => {
    await course(racine, { son, fx, V, calme, debug });
    if (!vivant) return;
    // L'écran passe aux couleurs du café.
    const voile = document.createElement('div');
    voile.className = 'e4-voile';
    racine.append(voile);
    await voile.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700 / V, easing: 'ease-in', fill: 'forwards' }).finished;
    if (vivant) suivante();
  })();

  return () => {
    vivant = false;
    racine.remove();
    delete window.__course;
  };
}

export default {
  fond: 'clair',
  ambiance: 'sons/etape-4.mp3',
  demarrer,
};
