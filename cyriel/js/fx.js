// Calque de particules plein écran : cœurs violets, envol de chauves-souris,
// étincelles. Il ne tourne que lorsqu'il y a quelque chose à dessiner.

import { tracerCoeur, chauveSouris } from './dessin.js';

const VIOLETS = ['#7a3cf0', '#9b6bff', '#5b21b6', '#b48cff', '#6d28d9'];
const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const toile = document.getElementById('fx');
const ctx = toile.getContext('2d');
let particules = [];
let enCours = false;
let avant = 0;
let dpr = 1;

function ajuster() {
  dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  toile.width = Math.round(window.innerWidth * dpr);
  toile.height = Math.round(window.innerHeight * dpr);
}
ajuster();
window.addEventListener('resize', ajuster);

const hasard = (a, b) => a + Math.random() * (b - a);
const choisir = (t) => t[(Math.random() * t.length) | 0];

function lancer() {
  if (enCours) return;
  enCours = true;
  avant = performance.now();
  requestAnimationFrame(boucle);
}

function boucle(t) {
  const dt = Math.min(0.05, (t - avant) / 1000);
  avant = t;
  const L = window.innerWidth;
  const H = window.innerHeight;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, L, H);

  particules = particules.filter((p) => {
    p.age += dt;
    if (p.age < 0) return true;              // départ différé
    p.vy += p.g * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    const vie = p.age / p.duree;
    if (vie >= 1) return false;

    if (p.genre === 'bat') {
      const marge = p.taille;
      if (p.x < -marge || p.x > L + marge || p.y < -marge || p.y > H + marge) return false;
      const y = p.y + Math.sin(p.age * 7 + p.phase) * 6;
      chauveSouris(ctx, p.x, y, p.taille, p.age * p.battement + p.phase, p.couleur, Math.min(1, p.age * 8));
      return true;
    }

    const alpha = vie < 0.7 ? 1 : 1 - (vie - 0.7) / 0.3;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.couleur;
    if (p.genre === 'coeur') {
      const s = Math.min(1, p.age * 9);       // petit « pop » à l'apparition
      ctx.scale(s, s);
      tracerCoeur(ctx, p.taille);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.taille * (1 - vie * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return true;
  });

  if (particules.length) requestAnimationFrame(boucle);
  else { enCours = false; ctx.clearRect(0, 0, L, H); }
}

/** Quelques cœurs violets qui jaillissent du point (x, y). */
export function coeurs(x, y, n = 7) {
  if (calme) n = Math.ceil(n / 2);
  for (let i = 0; i < n; i++) {
    const angle = hasard(-Math.PI * 0.95, -Math.PI * 0.05);
    const v = hasard(160, 420);
    particules.push({
      genre: 'coeur', x, y, age: 0, duree: hasard(0.7, 1.1),
      vx: Math.cos(angle) * v, vy: Math.sin(angle) * v, g: 620,
      rot: hasard(-0.5, 0.5), vr: hasard(-2.5, 2.5),
      taille: hasard(12, 26), couleur: choisir(VIOLETS),
    });
  }
  lancer();
}

/** Un envol de chauves-souris violettes depuis le point (x, y). */
export function chauvesSouris(x, y, n = 44) {
  if (calme) n = Math.ceil(n / 3);
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + hasard(-0.25, 0.25);
    const v = hasard(260, 760);
    particules.push({
      genre: 'bat', x: x + Math.cos(angle) * 12, y: y + Math.sin(angle) * 12,
      age: -hasard(0, 0.12), duree: 6,
      vx: Math.cos(angle) * v, vy: Math.sin(angle) * v - 60, g: -40,
      rot: 0, vr: 0, phase: hasard(0, 6.28), battement: hasard(16, 26),
      taille: hasard(26, 78), couleur: choisir(VIOLETS),
    });
  }
  lancer();
}

/** Petites étincelles rondes (en coordonnées écran). */
export function etincelles(x, y, n = 10, couleur = '#d7b3ff', force = 160) {
  if (calme) n = Math.ceil(n / 2);
  for (let i = 0; i < n; i++) {
    const angle = hasard(0, Math.PI * 2);
    const v = hasard(force * 0.3, force);
    particules.push({
      genre: 'point', x, y, age: 0, duree: hasard(0.4, 0.9),
      vx: Math.cos(angle) * v, vy: Math.sin(angle) * v, g: 120,
      rot: 0, vr: 0, taille: hasard(1.5, 3.5), couleur,
    });
  }
  lancer();
}

/** Efface tout de suite toutes les particules. */
export function vider() { particules = []; }
