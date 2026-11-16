// Dessins de l'étape 4 (le marais), faits à la main en SVG.
//
// Origines : plantes, chenilles et chrysalides à leur point d'appui (le haut
// en y négatif) ; papillons au centre du thorax, ailes ouvertes vues de
// dessus. Le décor tient dans un cadre de 400 × 560 et déborde largement
// pour remplir les écrans plus larges ou plus hauts.

import { chiffreNeon } from '../chiffres.js';
import { cyrielChapeau, duoCamargue } from './clins-doeil.js';

export const LARGEUR = 400;
export const HAUTEUR = 560;
const ENCRE = '#1a1026';

const f = (n) => +n.toFixed(1);
const echapper = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

/* ================================================================ Plantes */

// Feuille au bord denté : ellipse dont le contour alterne creux et pointes.
function feuilleDentelee(cx, cy, rx, ry, angle, dents, couleur, nervure = '') {
  const pts = [];
  const n = dents * 2;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const k = i % 2 ? 0.84 : 1;
    pts.push(`${f(Math.cos(t) * rx * k)},${f(Math.sin(t) * ry * k)}`);
  }
  const trait = nervure ? `<path d="M${f(-rx * 0.85)} 0 H${f(rx * 0.85)}" stroke="${nervure}" stroke-width=".9"/>` : '';
  return `<g transform="translate(${cx} ${cy}) rotate(${angle})"><polygon points="${pts.join(' ')}" fill="${couleur}"/>${trait}</g>`;
}

function ortie() {
  const paires = [[-26, 15, 9], [-50, 14, 8.5], [-74, 12, 7.5], [-95, 9.5, 6]];
  let feuilles = '';
  for (const [y, rx, ry] of paires) {
    feuilles += feuilleDentelee(-rx + 1, y, rx, ry, 25, 9, '#5f9a3f', '#4a7f30');
    feuilles += feuilleDentelee(rx - 1, y - 2, rx, ry, -25, 9, '#6aa84a', '#4a7f30');
  }
  const chatons = [[-3, -38, -1], [3, -62, 1], [-3, -84, -1]].map(([x, y, s]) =>
    `<path d="M${x} ${y} q${6 * s} 6 ${9 * s} 17" stroke="#9cbf6a" stroke-width="1.8" fill="none" stroke-dasharray="1.6 1.3" stroke-linecap="round"/>`).join('');
  return `
  <path d="M0 0 L0 -108" stroke="#5c8a3c" stroke-width="3" stroke-linecap="round"/>
  ${chatons}${feuilles}
  <path d="M0 -106 l-3 -7 M0 -106 l3 -7" stroke="#5c8a3c" stroke-width="2" stroke-linecap="round"/>`;
}

function cardamine() {
  const fleur = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    ${[45, 135, 225, 315].map((a) => `<ellipse cx="0" cy="-3.6" rx="2.6" ry="3.7" transform="rotate(${a})" fill="#e6d3f7" stroke="#c4a3e6" stroke-width=".5"/>`).join('')}
    <circle r="1.3" fill="#d6c64a"/></g>`;
  const foliole = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})">
    <path d="M0 0 H17" stroke="#6f9a4a" stroke-width="1.2"/>
    ${[5, 10, 15].map((d) => `<circle cx="${d}" cy="-1.9" r="1.9" fill="#7fae55"/><circle cx="${d}" cy="1.9" r="1.9" fill="#7fae55"/>`).join('')}
    <circle cx="18.5" cy="0" r="2.5" fill="#7fae55"/></g>`;
  return `
  ${foliole(0, -2, -160)}${foliole(0, -2, -20)}${foliole(0, -3, -125)}${foliole(0, -3, -55)}
  <path d="M0 0 C-2 -40 2 -70 0 -96" stroke="#6f9a4a" stroke-width="2" fill="none"/>
  <path d="M0 -48 l-8 -5 M0 -68 l7 -5" stroke="#6f9a4a" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M0 -92 l-9 -6 M0 -94 l8 -8 M0 -96 l-2 -10" stroke="#6f9a4a" stroke-width="1.2"/>
  ${fleur(-12, -90, 0.95)}${fleur(11, -94, 0.95)}${fleur(-9, -100, 1.1)}${fleur(8, -104, 1.1)}${fleur(-1, -110, 1.15)}`;
}

function patience() {
  const feuille = (a, l) => `<g transform="rotate(${a})">
    <ellipse cx="0" cy="${-l / 2}" rx="${f(l * 0.17)}" ry="${l / 2}" fill="#6aa84f"/>
    <path d="M0 0 V${f(-l * 0.94)}" stroke="#4f8a3a" stroke-width="1.2"/></g>`;
  const grappe = (x, y, n) => Array.from({ length: n }, (_, i) =>
    `<circle cx="${f(x + Math.sin(i * 2.3) * 3)}" cy="${y - i * 4}" r="2" fill="${i % 2 ? '#a0522d' : '#8b3a2a'}"/>`).join('');
  return `
  ${feuille(-60, 44)}${feuille(60, 44)}${feuille(-32, 54)}${feuille(32, 52)}${feuille(-8, 48)}
  <path d="M0 0 L0 -112 M0 -76 L-14 -96 M0 -88 L13 -104" stroke="#8a5a3b" stroke-width="2.2" stroke-linecap="round"/>
  ${grappe(0, -82, 8)}${grappe(-14, -92, 5)}${grappe(13, -100, 5)}${grappe(-5, -66, 3)}`;
}

function gentiane() {
  const trompette = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})">
    <path d="M-3 0 C-3.5 -8 -7 -14 -7.5 -19 L-4.5 -16.5 L-2.5 -20 L0 -17 L2.5 -20 L4.5 -16.5 L7.5 -19 C7 -14 3.5 -8 3 0 Z" fill="#2a55c9"/>
    <path d="M-1.4 -2 L-3.4 -15 M1.4 -2 L3.4 -15" stroke="#3d8b5a" stroke-width=".9" opacity=".8"/>
    <path d="M-3 0 h6" stroke="#4f8a3a" stroke-width="2"/></g>`;
  const feuille = (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="7.5" transform="rotate(${a} ${x} ${y})" fill="#4f8a3a"/>`;
  return `
  <path d="M0 0 C-2 -30 -6 -60 -10 -88" stroke="#4f8a3a" stroke-width="2" fill="none"/>
  <path d="M0 0 C2 -30 8 -56 12 -80" stroke="#4f8a3a" stroke-width="2" fill="none"/>
  <path d="M0 0 C0 -26 1 -48 1 -62" stroke="#4f8a3a" stroke-width="1.8" fill="none"/>
  ${feuille(-6, -24, -40)}${feuille(4, -26, 40)}${feuille(-8, -50, -45)}${feuille(8, -46, 45)}${feuille(-4, -70, -35)}${feuille(14, -62, 50)}
  ${trompette(-10, -88, -8)}${trompette(12, -80, 10)}${trompette(1, -62, 0)}
  <ellipse cx="-12" cy="-74" rx="2.6" ry="5" transform="rotate(-30 -12 -74)" fill="#3a5fb8"/>`;
}

function carotte() {
  const rayons = Array.from({ length: 9 }, (_, i) => {
    const x = -24 + i * 6;
    return `<path d="M0 -84 L${x} ${f(-104 + Math.abs(x) * 0.12)}" stroke="#7fae55" stroke-width=".9"/>`;
  }).join('');
  const fleurs = Array.from({ length: 46 }, (_, i) => {
    const r = Math.sqrt(i / 46);
    const a = i * 2.39996;
    return `<circle cx="${f(Math.cos(a) * r * 25)}" cy="${f(-107 + Math.sin(a) * r * 6)}" r="2"/>`;
  }).join('');
  const fronde = (x, y, a, s) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">
    <path d="M0 0 L0 -26 M0 -6 l-5 -4 M0 -6 l5 -4 M0 -12 l-5 -4 M0 -12 l5 -4 M0 -18 l-4 -4 M0 -18 l4 -4 M0 -24 l-3 -3 M0 -24 l3 -3" stroke="#7fae55" stroke-width="1.1" stroke-linecap="round" fill="none"/></g>`;
  return `
  ${fronde(-2, -2, -50, 1)}${fronde(2, -2, 48, 1)}${fronde(0, -30, -30, 0.8)}${fronde(0, -40, 34, 0.75)}
  <path d="M0 0 C1 -30 -1 -60 0 -84" stroke="#6f9a4a" stroke-width="2.2" fill="none"/>
  ${rayons}
  <g fill="#fffdf5" stroke="#d9d2c0" stroke-width=".4">${fleurs}</g>
  <circle cx="0" cy="-107.5" r="2.3" fill="#4b1f6e"/>`;
}

function menthe() {
  const pompon = (x, y, r) => `<g transform="translate(${x} ${y})">${Array.from({ length: 14 }, (_, i) => {
    const a = i * 2.4;
    const rr = Math.sqrt(i / 14) * r;
    return `<circle cx="${f(Math.cos(a) * rr)}" cy="${f(Math.sin(a) * rr)}" r="${f(r * 0.34)}" fill="${i % 3 ? '#c99be3' : '#b585d6'}"/>`;
  }).join('')}</g>`;
  let feuilles = '';
  for (const [y, rx] of [[-28, 10], [-54, 9], [-78, 7.5]]) {
    feuilles += feuilleDentelee(-rx, y, rx, rx * 0.6, 18, 7, '#5f9a55');
    feuilles += feuilleDentelee(rx, y, rx, rx * 0.6, -18, 7, '#6aa860');
  }
  return `
  <path d="M0 0 L0 -96" stroke="#6b4f7a" stroke-width="2.4" stroke-linecap="round"/>
  ${feuilles}
  ${pompon(-7, -66, 5.5)}${pompon(7, -66, 5.5)}${pompon(0, -101, 9)}`;
}

function iris() {
  return `
  <path d="M-3 0 C-6 -40 -10 -80 -17 -110 C-8 -80 -2 -40 3 0 Z" fill="#5f9a4a"/>
  <path d="M3 0 C6 -40 12 -76 19 -104 C9 -76 3 -40 -2 0 Z" fill="#6aa84a"/>
  <path d="M-2 0 C-3 -40 -2 -80 0 -116 C2 -80 3 -40 2 0 Z" fill="#78b356"/>
  <path d="M1 0 C2 -30 4 -60 5 -86" stroke="#5f9a4a" stroke-width="2" fill="none"/>
  <g transform="translate(5 -92)">
    <ellipse cx="-1" cy="-10" rx="2.6" ry="6.5" transform="rotate(-14 -1 -10)" fill="#f7df5c"/>
    <ellipse cx="4" cy="-10" rx="2.6" ry="6.5" transform="rotate(14 4 -10)" fill="#f7df5c"/>
    <ellipse cx="-8" cy="0" rx="8" ry="4.4" transform="rotate(28 -8 0)" fill="#f5d33f"/>
    <ellipse cx="10" cy="0" rx="8" ry="4.4" transform="rotate(-28 10 0)" fill="#f5d33f"/>
    <ellipse cx="1.5" cy="4" rx="4.4" ry="7.5" fill="#f5d33f"/>
    <path d="M-8 0 l-4 2 M10 0 l4 2 M1.5 4 v5" stroke="#8a5a2b" stroke-width=".9" stroke-linecap="round"/>
  </g>`;
}

// Feuille en cœur dentée (alliaire), pointe vers le haut, attache en (0, 0).
// Le cœur classique x = 16 sin³t, y = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t,
// une dent sur deux rentrée vers le centre.
function coeurDentele(L, couleur, nervure) {
  const k = L / 22;
  const pts = [];
  const N = 34;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    let x = 16 * Math.sin(t) ** 3;
    let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t) - 5;
    if (i % 2) { x *= 0.9; y = -10 + (y + 10) * 0.9; }
    pts.push(`${f(x * k)},${f(y * k)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${couleur}"/>
    <path d="M0 0 V${f(-19 * k)} M0 ${f(-7 * k)} l${f(-6 * k)} ${f(-4 * k)} M0 ${f(-7 * k)} l${f(6 * k)} ${f(-4 * k)}" stroke="${nervure}" stroke-width="${f(Math.max(0.8, k * 0.9))}" fill="none"/>`;
}

function feuilleCoeur(x, y, L, angle, couleur, nervure) {
  const p = f(L * 0.16);
  return `<g transform="translate(${x} ${y}) rotate(${angle})">
    <path d="M0 0 V${-p}" stroke="${nervure}" stroke-width="${f(Math.max(1, L * 0.06))}" stroke-linecap="round"/>
    <g transform="translate(0 ${-p})">${coeurDentele(L, couleur, nervure)}</g></g>`;
}

const fleurAlliaire = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 90, 180, 270].map((a) =>
  `<ellipse cx="0" cy="-2.3" rx="1.6" ry="2.3" transform="rotate(${a + 45})" fill="#fffdf8" stroke="#d8d2c4" stroke-width=".4"/>`).join('')}<circle r=".8" fill="#e8d86a"/></g>`;

// Alliaire officinale : feuilles en cœur dentées, petites fleurs blanches en
// croix, et les siliques (fruits longs et fins) qui montent sous les fleurs.
function alliaire() {
  const feuilles = [[-1, -8, 17, -66], [1, -11, 16, 64], [-1, -34, 14, -58], [1, -40, 13, 60], [0, -60, 10.5, -50], [0, -66, 9.5, 52]]
    .map(([x, y, L, a], i) => feuilleCoeur(x, y, L, a, i % 2 ? '#6aa84a' : '#5f9a3f', '#4a7f30')).join('');
  const siliques = [[-78, -32, 24], [-81, 28, 25], [-87, -18, 21], [-89, 16, 20], [-94, -7, 15]].map(([y, a, l]) => {
    const r = (a * Math.PI) / 180;
    return `<path d="M0 ${y} l${f(Math.sin(r) * l)} ${f(-Math.cos(r) * l)}" stroke="#7fae55" stroke-width="1.7" stroke-linecap="round"/>`;
  }).join('');
  return `
  <path d="M0 0 C-1 -40 1 -80 0 -104" stroke="#5c8a3c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${feuilles}${siliques}
  ${fleurAlliaire(-5, -103)}${fleurAlliaire(5, -105)}${fleurAlliaire(-2, -110)}${fleurAlliaire(5, -112)}${fleurAlliaire(-6, -113)}${fleurAlliaire(1, -117)}`;
}

const PLANTES = { ortie, cardamine, patience, gentiane, carotte, menthe, iris, alliaire };

export function plante(cle) {
  return PLANTES[cle]();
}

/** Étiquette sous une plante, sur une ou deux lignes. Origine en haut au centre. */
export function etiquette(lignes) {
  const l = Math.max(...lignes.map((t) => t.length)) * 5.9 + 14;
  const h = lignes.length * 12 + 8;
  return `<rect x="${f(-l / 2)}" y="0" width="${f(l)}" height="${h}" rx="6" fill="#fffaf2" stroke="#a86f3f" stroke-width="1.5"/>
    ${lignes.map((t, i) => `<text x="0" y="${12 + i * 12}" text-anchor="middle" font-size="10.5" font-weight="600" fill="#4a2f1a">${echapper(t)}</text>`).join('')}`;
}

/* =============================================================== Chenilles */

function oeil(x, y, k = 1) {
  return `<circle cx="${x}" cy="${y}" r="${f(1.9 * k)}" fill="#fff"/><circle cx="${f(x + 0.5 * k)}" cy="${f(y + 0.2 * k)}" r="${f(1.05 * k)}" fill="${ENCRE}"/>`;
}

// Anneaux de la queue (à gauche) vers la tête (à droite) ; chacun ondule
// avec un léger retard quand la chenille rampe.
function anneaux(n, x0, x1, dessin) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = f(x0 + ((x1 - x0) * i) / (n - 1));
    s += `<g class="e4-seg" style="animation-delay:${(-(n - i) * 0.08).toFixed(2)}s">${dessin(x, i)}</g>`;
  }
  return s;
}

function chenillePaon() {
  return anneaux(8, -21, 15, (x) => `
    <path d="M${x} -11 l-2.4 -5.5 M${x} -11 l0 -6.5 M${x} -11 l2.4 -5.5" stroke="#231c27" stroke-width="1.1" stroke-linecap="round"/>
    <circle cx="${x}" cy="-6" r="5.4" fill="#231c27"/>
    <circle cx="${f(x - 1.6)}" cy="-7.5" r=".85" fill="#fff"/><circle cx="${f(x + 1.4)}" cy="-4.4" r=".7" fill="#fff"/><circle cx="${f(x + 2)}" cy="-8.4" r=".55" fill="#fff"/>
    <ellipse cx="${x}" cy="-.8" rx="1.5" ry="1.1" fill="#3a2f3f"/>`)
    + `<g class="e4-tete"><circle cx="21" cy="-7" r="6" fill="#231c27"/><circle cx="19" cy="-9.6" r="1.4" fill="#fff" opacity=".35"/>${oeil(23, -8.5)}</g>`;
}

function chenilleAurore() {
  return anneaux(9, -22, 15, (x) => `
    <circle cx="${x}" cy="-4.6" r="4.4" fill="#8fc4a5"/>
    <path d="M${f(x - 4.2)} -3.4 H${f(x + 4.2)}" stroke="#fff" stroke-width="1.3" opacity=".9"/>
    <ellipse cx="${x}" cy="-.6" rx="1.3" ry="1" fill="#6f9f86"/>`)
    + `<g class="e4-tete"><circle cx="20" cy="-5" r="4.8" fill="#9fd0b2"/>${oeil(21.8, -6.2, 0.9)}</g>`;
}

function chenilleMachaon() {
  return `<g class="e4-cornes"><path d="M21 -11 Q22 -19 18 -23 M21 -11 Q25 -18 28 -21" stroke="#ff8a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`
    + anneaux(8, -21, 14, (x) => `
    <circle cx="${x}" cy="-6" r="5.8" fill="#a6d96a"/>
    <ellipse cx="${f(x + 0.5)}" cy="-6" rx="1.5" ry="5.6" fill="#1f1f1f"/>
    <circle cx="${f(x + 0.5)}" cy="-9" r="1.1" fill="#f28c28"/><circle cx="${f(x + 0.5)}" cy="-4" r="1" fill="#f28c28"/>
    <ellipse cx="${x}" cy="-.7" rx="1.5" ry="1.1" fill="#7fae4a"/>`)
    + `<g class="e4-tete"><circle cx="20" cy="-6.5" r="5.8" fill="#a6d96a"/><path d="M17 -11 Q20 -6 17 -1.5" stroke="#1f1f1f" stroke-width="1.4" fill="none"/>${oeil(22, -8)}</g>`;
}

function chenilleCuivre() {
  const plis = [-12, -6, 0, 6, 12].map((x) => `<path d="M${x} -12.5 Q${x + 1.5} -7 ${x} -1" stroke="#7fb34a" stroke-width="1" fill="none"/>`).join('');
  const poils = Array.from({ length: 12 }, (_, i) => {
    const x = f(-17 + i * 3.1);
    return `<path d="M${x} ${f(-12.6 + Math.abs(x) * 0.13)} l0 -1.8" stroke="#e6f2cf" stroke-width=".7"/>`;
  }).join('');
  return `<g class="e4-limace"><ellipse cx="0" cy="-6.5" rx="19" ry="6.8" fill="#94c95a"/>
    <path d="M-16 -9 Q0 -14 16 -9" stroke="#7fb34a" stroke-width="1.2" fill="none"/>${plis}${poils}</g>
    <g class="e4-tete"><circle cx="17.5" cy="-3" r="3" fill="#6b5a2a"/>${oeil(18.6, -3.6, 0.7)}</g>`;
}

function chenilleAzure() {
  const plis = [-8, -3, 2, 7].map((x) => `<path d="M${x} -10 Q${x + 1.2} -5.5 ${x} -1" stroke="#c99089" stroke-width=".9" fill="none"/>`).join('');
  return `<g class="e4-limace"><ellipse cx="0" cy="-5.2" rx="14" ry="5.4" fill="#dba6a0"/>
    <path d="M-12 -7 Q0 -11 12 -7" stroke="#b97f7a" stroke-width="1.1" fill="none"/>${plis}</g>
    <g class="e4-tete"><circle cx="13" cy="-2.6" r="2.6" fill="#6b4a3a"/>${oeil(14, -3, 0.65)}</g>`;
}

const CHENILLES = { paon: chenillePaon, aurore: chenilleAurore, cuivre: chenilleCuivre, azure: chenilleAzure, machaon: chenilleMachaon };

export function chenille(cle) {
  return CHENILLES[cle]();
}

/** Chrysalide accrochée en (0, 0) : suspendue (paon du jour) ou dressée. */
export function chrysalide(cle) {
  switch (cle) {
    case 'paon':
      return `
      <path d="M0 0 V5" stroke="#cfc8b8" stroke-width="1"/>
      <path d="M0 4 C7 6 8 18 3 28 C1 31 -1 31 -3 28 C-8 18 -7 6 0 4 Z" fill="#8f8a6e"/>
      <path d="M-3 10 C-1 14 -1 20 -2 26 M3 10 C2 15 2 20 1 25" stroke="#6f6a52" stroke-width=".9" fill="none"/>
      <circle cx="-2.4" cy="12" r="1.2" fill="#e3b04b"/><circle cx="2.4" cy="12" r="1.2" fill="#e3b04b"/><circle cx="0" cy="16" r="1" fill="#e3b04b"/>`;
    case 'aurore':
      return `
      <path d="M0 0 C5 -6 6 -16 1 -30 C-1 -32 -2 -30 -3 -26 C-6 -16 -5 -6 0 0 Z" fill="#c9c38a"/>
      <path d="M-4 -12 Q0 -10 4 -12" stroke="#ece6c4" stroke-width="1" fill="none"/>
      <path d="M-2 -4 C0 -12 0 -20 0 -27" stroke="#a9a26a" stroke-width=".8" fill="none"/>`;
    case 'azure':
      return `
      <ellipse cx="0" cy="-7" rx="4.6" ry="7.2" fill="#b98b5c"/>
      <path d="M-3.4 -9 Q0 -7 3.4 -9" stroke="#e2c9a4" stroke-width=".9" fill="none"/>
      <circle cx="-1.4" cy="-4" r=".7" fill="#7f5b36"/><circle cx="1.6" cy="-11" r=".7" fill="#7f5b36"/>`;
    case 'cuivre':
      return `
      <ellipse cx="0" cy="-8" rx="5.5" ry="8.5" fill="#c79a5b"/>
      <path d="M-4 -10 Q0 -8 4 -10" stroke="#e8d0a8" stroke-width="1" fill="none"/>
      <circle cx="-1.6" cy="-4" r=".8" fill="#8a6a3a"/><circle cx="1.8" cy="-7" r=".8" fill="#8a6a3a"/><circle cx="-0.5" cy="-12" r=".7" fill="#8a6a3a"/>`;
    default: // machaon
      return `
      <path d="M0 0 C6 -4 7 -14 5 -24 L2 -30 L-2 -30 L-5 -24 C-7 -14 -6 -4 0 0 Z" fill="#9ccc65"/>
      <path d="M-3 -24 L0 -6 L3 -24" stroke="#7fae4a" stroke-width=".9" fill="none"/>
      <path d="M-7 -14 Q0 -11 7 -14" stroke="#e6e0cc" stroke-width="1" fill="none"/>`;
  }
}

/* ============================================================== Papillons */

const AILES = {
  paon: `
    <path d="M2 -4 C6 -18 20 -30 33 -31 C35 -27 34 -24 32 -22 C33 -18 31 -12 27 -8 C22 -3 12 -1 3 -1 Z" fill="#b33a2e" stroke="#3b1f1f" stroke-width="1"/>
    <path d="M8 -15 L11 -21 M13 -18 L16 -24 M18 -21 L21 -27" stroke="#3b1f1f" stroke-width="2" stroke-linecap="round"/>
    <circle cx="25" cy="-22" r="6.2" fill="#f2c14e"/>
    <circle cx="25.5" cy="-21.5" r="4.8" fill="#2a2030"/>
    <circle cx="24" cy="-23" r="1.2" fill="#8fb0ff"/><circle cx="27" cy="-20.5" r="1" fill="#8fb0ff"/><circle cx="26.5" cy="-24" r=".8" fill="#fff"/>
    <path d="M3 0 C12 0 25 3 28 10 C30 16 27 21 22 22 C20 25 15 26 12 24 C8 22 5 14 3 4 Z" fill="#a83428" stroke="#3b1f1f" stroke-width="1"/>
    <path d="M27 12 C28 18 24 22 18 23" stroke="#4a2a2a" stroke-width="3" fill="none"/>
    <circle cx="17" cy="13" r="6" fill="#2a2030" stroke="#cfc8c0" stroke-width="1.2"/>
    <circle cx="15.5" cy="12" r="1.3" fill="#6f95ff"/><circle cx="18.5" cy="14.5" r="1.1" fill="#6f95ff"/><circle cx="17" cy="10.6" r=".9" fill="#6f95ff"/>`,
  aurore: `
    <path d="M2 -4 C6 -18 18 -28 31 -29 C34 -24 33 -14 28 -7 C22 -2 12 -1 3 -1 Z" fill="#fbfbf7" stroke="#bdbdb5" stroke-width=".9"/>
    <path d="M17 -26 C24 -29 30 -30 31 -29 C34 -24 33 -14 28 -7 C25 -5 22 -5 20 -6 C18 -12 17 -19 17 -26 Z" fill="#f28c28"/>
    <path d="M27 -29 C29.5 -30 31 -29.5 31 -29 C33 -26.5 33.6 -23 33.2 -20.5 C31 -23 29 -26 27 -29 Z" fill="#5b5b66"/>
    <circle cx="14" cy="-14" r="1.6" fill="#2a2a2a"/>
    <path d="M3 0 C12 0 24 3 26 10 C27 17 21 22 14 22 C9 22 5 14 3 4 Z" fill="#fbfbf7" stroke="#bdbdb5" stroke-width=".9"/>
    <ellipse cx="13" cy="9" rx="5" ry="3.5" fill="#dbe7c8" opacity=".9"/><ellipse cx="20" cy="14" rx="3.5" ry="2.5" fill="#dbe7c8" opacity=".9"/>`,
  cuivre: `
    <path d="M2 -4 C7 -18 19 -27 31 -27 C33 -21 31 -12 27 -6 C21 -2 11 -1 3 -1 Z" fill="#f07b1e" stroke="#4a2412" stroke-width="1.7"/>
    <path d="M13 -15 l2 3" stroke="#3a1a0c" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="18" cy="-17" rx="7" ry="3" fill="#fff" opacity=".18" transform="rotate(-30 18 -17)"/>
    <path d="M3 0 C12 0 23 3 25 10 C26 16 21 21 14 21 C9 21 5 14 3 4 Z" fill="#f07b1e" stroke="#4a2412" stroke-width="1.7"/>
    <path d="M24 11 C24 16 20 19.5 14 19.5" stroke="#c2551a" stroke-width="2.4" fill="none"/>`,
  azure: `
    <path d="M2 -4 C7 -18 19 -27 31 -27 C33 -21 31 -12 27 -6 C21 -2 11 -1 3 -1 Z" fill="#7b89dc" stroke="#2e3266" stroke-width="2"/>
    <path d="M31 -27 C33 -21 31 -12 27 -6" stroke="#fff" stroke-width=".8" fill="none" transform="translate(1.2 .4)"/>
    <ellipse cx="17" cy="-16" rx="7" ry="3" fill="#fff" opacity=".2" transform="rotate(-30 17 -16)"/>
    <path d="M3 0 C12 0 23 3 25 10 C26 16 21 21 14 21 C9 21 5 14 3 4 Z" fill="#7b89dc" stroke="#2e3266" stroke-width="2"/>`,
};

// Les femelles qui ne ressemblent pas aux mâles. Aurore : pas d'orange au
// bout des ailes. Cuivré : taches noires, ailes postérieures brunes bordées
// d'orange. Azuré des mouillères : brun-noir, poudré de bleu près du corps.
const AILES_FEMELLE = {
  aurore: `
    <path d="M2 -4 C6 -18 18 -28 31 -29 C34 -24 33 -14 28 -7 C22 -2 12 -1 3 -1 Z" fill="#fbfbf7" stroke="#bdbdb5" stroke-width=".9"/>
    <path d="M23 -28.2 C26.5 -29.6 30 -29.7 31 -29 C33.6 -25.4 34 -20.5 33 -16.5 C30 -19.5 26 -24 23 -28.2 Z" fill="#5b5b66"/>
    <circle cx="16" cy="-15" r="2" fill="#2a2a2a"/>
    <path d="M3 0 C12 0 24 3 26 10 C27 17 21 22 14 22 C9 22 5 14 3 4 Z" fill="#fbfbf7" stroke="#bdbdb5" stroke-width=".9"/>
    <ellipse cx="13" cy="9" rx="5" ry="3.5" fill="#dbe7c8" opacity=".9"/><ellipse cx="20" cy="14" rx="3.5" ry="2.5" fill="#dbe7c8" opacity=".9"/>`,
  cuivre: `
    <path d="M2 -4 C7 -18 19 -27 31 -27 C33 -21 31 -12 27 -6 C21 -2 11 -1 3 -1 Z" fill="#f07b1e" stroke="#4a2412" stroke-width="2.4"/>
    <circle cx="11" cy="-13" r="1.5" fill="#2a1208"/><circle cx="17" cy="-18" r="1.7" fill="#2a1208"/><circle cx="21.5" cy="-11" r="1.6" fill="#2a1208"/>
    <circle cx="25.5" cy="-17.5" r="1.4" fill="#2a1208"/><circle cx="15.5" cy="-7.5" r="1.3" fill="#2a1208"/>
    <path d="M3 0 C12 0 23 3 25 10 C26 16 21 21 14 21 C9 21 5 14 3 4 Z" fill="#4a2a1a" stroke="#2e170c" stroke-width="1.4"/>
    <path d="M23.2 9.5 C24 15 20 19 13 19.5" stroke="#f07b1e" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  azure: `
    <path d="M2 -4 C7 -18 19 -27 31 -27 C33 -21 31 -12 27 -6 C21 -2 11 -1 3 -1 Z" fill="#3b2f3a" stroke="#241a24" stroke-width="1.4"/>
    <path d="M3 -3 C7 -12 13 -17 19 -18 C18 -12 15 -6 9 -2 Z" fill="#4f6ad0" opacity=".75"/>
    <path d="M3 0 C12 0 23 3 25 10 C26 16 21 21 14 21 C9 21 5 14 3 4 Z" fill="#3b2f3a" stroke="#241a24" stroke-width="1.4"/>
    <path d="M3 1 C9 2 14 5 15 9 C11 10 6 8 3 4 Z" fill="#4f6ad0" opacity=".7"/>`,
};

const CORPS = { paon: '#2a1f22', aurore: '#4b4b55', cuivre: '#3a1f12', azure: '#2e3266' };

function machaon(chiffre) {
  const aile = `
    <path d="M2 -28 C10 -40 26 -49 37 -46 C40 -39 37 -31 31 -26 C23 -20 11 -19 3 -21 Z" fill="#f5d33f" stroke="${ENCRE}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M30 -45 C36 -40 35 -32 29 -27" fill="none" stroke="${ENCRE}" stroke-width="4"/>
    <path d="M2 -28 C6 -31 10 -28 9 -21 L3 -21 Z" fill="${ENCRE}"/>
    <path d="M6 -24 L33 -41 M7 -22 L33 -33 M9 -21 L27 -24" stroke="${ENCRE}" stroke-width=".9" fill="none"/>
    <path d="M14 -40 L17 -31 M21 -44 L23 -36" stroke="${ENCRE}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="33" cy="-41" r="1" fill="#f5d33f"/><circle cx="33.5" cy="-35" r="1" fill="#f5d33f"/><circle cx="30.5" cy="-30" r="1" fill="#f5d33f"/>
    <path d="M3 -20 C12 -20 24 -18 27 -10 C29 -3 25 2 20 3 L21 13 L17 4 C12 4 7 0 3 -12 Z" fill="#f5d33f" stroke="${ENCRE}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M26 -11 C27 -4 24 1 18 2.5" fill="none" stroke="${ENCRE}" stroke-width="4.2"/>
    <ellipse cx="24.5" cy="-6" rx="1.8" ry="1.3" fill="#4a7bd8"/><ellipse cx="21" cy="0" rx="1.8" ry="1.3" fill="#4a7bd8"/>
    <circle cx="8" cy="-1" r="2.6" fill="#e04a2a" stroke="${ENCRE}" stroke-width=".8"/>
    <path d="M5.6 -2.8 A3 3 0 0 1 10.4 -2.8" stroke="#4a7bd8" stroke-width="1" fill="none"/>`;
  const marque = chiffre === null ? '' : `<g class="e4-chiffre-aile">${chiffreNeon(chiffre, 17, -41.5, 9, 13)}</g>`;
  return `<g transform="translate(0 20)">
    <g class="e4-ailes">${aile}<g transform="scale(-1 1)">${aile}</g>${marque}</g>
    <ellipse cx="0" cy="-18" rx="2.8" ry="12" fill="${ENCRE}"/>
    <path d="M-1.3 -26 V-10 M1.3 -26 V-10" stroke="#f5d33f" stroke-width=".7"/>
    <circle cx="0" cy="-31" r="3.3" fill="${ENCRE}"/>
    <path d="M-1 -33.5 Q-4 -40 -7.5 -45 M1 -33.5 Q4 -40 7.5 -45" stroke="${ENCRE}" stroke-width="1" fill="none"/>
    <circle cx="-7.5" cy="-45" r="1.5" fill="${ENCRE}"/><circle cx="7.5" cy="-45" r="1.5" fill="${ENCRE}"/>
  </g>`;
}

/**
 * Papillon ailes ouvertes. Pour le machaon, chiffre : le chiffre peint sur
 * l'aile. femelle : la femelle, quand elle ne ressemble pas au mâle.
 */
export function papillon(cle, { chiffre = null, femelle = false } = {}) {
  if (cle === 'machaon') return machaon(chiffre);
  const aile = (femelle && AILES_FEMELLE[cle]) || AILES[cle];
  const c = CORPS[cle];
  return `
  <g class="e4-ailes">${aile}<g transform="scale(-1 1)">${aile}</g></g>
  <ellipse cx="0" cy="3" rx="2.3" ry="10" fill="${c}"/>
  <circle cx="0" cy="-8.5" r="2.7" fill="${c}"/>
  <path d="M-1 -10.5 Q-4 -17 -7 -21 M1 -10.5 Q4 -17 7 -21" stroke="${c}" stroke-width=".9" fill="none"/>
  <circle cx="-7" cy="-21" r="1.3" fill="${c}"/><circle cx="7" cy="-21" r="1.3" fill="${c}"/>`;
}

/* ================================================================ Fourmis */

export function fourmiliere() {
  return `
  <path d="M-24 0 C-17 -15 -6 -21 0 -21 C6 -21 17 -15 24 0 Z" fill="#b08350"/>
  <path d="M-13 -6 q2 -2 4 0 M5 -10 q2 -2 4 0 M-3 -14 q2 -2 4 0 M12 -4 q2 -2 4 0" stroke="#8a6238" stroke-width="1" fill="none"/>
  <ellipse cx="0" cy="-19.5" rx="3.4" ry="2" fill="#4a2f18"/>`;
}

// Trois fourmis des prairies humides. Myrmica : rousse, deux épines dans le
// dos (c'est elle qui adopte l'azuré des mouillères). Lasius : petite et
// noire. Formica rufa : grande, tête et thorax roux, abdomen noir.
export const FOURMIS = {
  myrmica: { nom: 'Myrmica', tete: '#a3462a', thorax: '#ad5030', gastre: '#7e3319', k: 1.1, epines: true },
  lasius: { nom: 'Lasius', tete: '#2a1d1d', thorax: '#2a1d1d', gastre: '#231717', k: 0.95 },
  formica: { nom: 'Formica', tete: '#c25a30', thorax: '#c25a30', gastre: '#2a1d1d', k: 1.4 },
};

/** Fourmi de profil, tête vers la droite, pattes au sol en y = 0. */
export function fourmi(sorte = null) {
  const c = FOURMIS[sorte] || { tete: '#2a1d1d', thorax: '#2a1d1d', gastre: '#2a1d1d', k: 1 };
  const corps = `
  <ellipse cx="-5" cy="-3" rx="3.2" ry="2.4" fill="${c.gastre}"/>
  <ellipse cx="0" cy="-3.2" rx="2" ry="1.6" fill="${c.thorax}"/>
  ${c.epines ? `<path d="M-1.4 -4.4 l-1.4 -2" stroke="${c.thorax}" stroke-width=".8" stroke-linecap="round"/>` : ''}
  <circle cx="4" cy="-3.6" r="2.1" fill="${c.tete}"/>
  <path class="e4-pattes" d="M-3 -2 l-2 3 M0 -2 l0 3 M2 -2 l2 3" stroke="${c.thorax}" stroke-width=".9" stroke-linecap="round"/>
  <path d="M5 -5.4 q2 -3 4.4 -3" stroke="${c.tete}" stroke-width=".8" fill="none"/>`;
  return c.k === 1 ? corps : `<g transform="scale(${c.k})">${corps}</g>`;
}

/* ================================================================== Bulles */

/** Bulle de parole d'une chenille. Origine à la pointe de la bulle. */
export function bulle(lignes) {
  const l = Math.max(...lignes.map((t) => t.length)) * 6 + 22;
  const h = lignes.length * 14 + 12;
  const d = f(l / 2);
  return `<g transform="translate(0 ${-h - 8})">
    <path d="M${f(-d + 8)} 0 H${f(d - 8)} Q${d} 0 ${d} 8 V${h - 8} Q${d} ${h} ${f(d - 8)} ${h} H7 L0 ${h + 8} L-7 ${h} H${f(-d + 8)} Q${-d} ${h} ${-d} ${h - 8} V8 Q${-d} 0 ${f(-d + 8)} 0 Z" fill="#fff" stroke="${ENCRE}" stroke-width="2"/>
    ${lignes.map((t, i) => `<text x="0" y="${17 + i * 14}" text-anchor="middle" font-size="11.5" font-weight="${i === 0 ? 700 : 500}" fill="${ENCRE}">${echapper(t)}</text>`).join('')}
  </g>`;
}

/* ================================================================== Décor */

export function defs() {
  return `<defs>
    <linearGradient id="e4-ciel" gradientUnits="userSpaceOnUse" x1="0" y1="-80" x2="0" y2="215">
      <stop offset="0" stop-color="#b9dcff"/><stop offset="1" stop-color="#eef7ff"/>
    </linearGradient>
    <linearGradient id="e4-eau" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8ccbe6"/><stop offset="1" stop-color="#6aaed2"/>
    </linearGradient>
    <radialGradient id="e4-lueur">
      <stop offset="0" stop-color="#fff6a8" stop-opacity=".8"/><stop offset="1" stop-color="#fff6a8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="e4-fond-loupe" cx="50%" cy="38%" r="68%">
      <stop offset="0" stop-color="#f3faea"/><stop offset="1" stop-color="#bfe0a2"/>
    </radialGradient>
    <linearGradient id="e4-terre" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8f5f36"/><stop offset="1" stop-color="#5a3519"/>
    </linearGradient>
    <linearGradient id="e4-eau-crue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#86c8e6"/><stop offset="1" stop-color="#3d82b5"/>
    </linearGradient>
    <clipPath id="e4-clip-loupe"><circle r="${RAYON_LOUPE}"/></clipPath>
  </defs>`;
}

/* ================================================================== Loupe */

/** Rayon du verre de la loupe, dans les unités de la scène. */
export const RAYON_LOUPE = 160;

/** Monture de la loupe (violette, manche en bois), centrée en (0, 0). */
export function cadreLoupe(r = RAYON_LOUPE) {
  return `
  <g transform="rotate(45)">
    <rect x="${r + 6}" y="-10" width="24" height="20" rx="4" fill="#4b2a85"/>
    <rect x="${r + 28}" y="-12" width="76" height="24" rx="12" fill="#7b4a2a"/>
    <rect x="${r + 36}" y="-8" width="60" height="5" rx="2.5" fill="#a3734b" opacity=".8"/>
  </g>
  <circle r="${r + 6}" fill="none" stroke="#5a32a0" stroke-width="13"/>
  <circle r="${r + 12}" fill="none" stroke="#2f1a57" stroke-width="2"/>
  <circle r="${r + 1}" fill="none" stroke="#c9b3ff" stroke-width="2"/>
  <path d="M${f(-r * 0.74)} ${f(-r * 0.3)} A${f(r * 0.8)} ${f(r * 0.8)} 0 0 1 ${f(-r * 0.3)} ${f(-r * 0.74)}" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".5"/>`;
}

/** Taches floues de lumière au fond de la loupe. */
export function bokeh() {
  return `<g fill="#fff" opacity=".3">${[[-92, -84, 30], [104, -48, 22], [-70, 96, 26], [88, 94, 34], [6, -128, 18], [-120, 20, 16]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
}

/* ===================================================== Œufs et petits */

/** Paquet d'œufs du paon du jour : vert olive, côtelés. */
export function oeufsPaon() {
  let s = '';
  [4, 5, 6, 5, 4].forEach((n, j) => {
    for (let i = 0; i < n; i++) {
      const x = f((i - (n - 1) / 2) * 5.6);
      const y = f((j - 2) * 4.8);
      s += `<circle cx="${x}" cy="${y}" r="2.7" fill="#8b9a46" stroke="#6f7d34" stroke-width=".5"/><path d="M${x} ${f(y - 2.3)} V${f(y + 2.3)}" stroke="#b3c26a" stroke-width=".6"/>`;
    }
  });
  return s;
}

/** Œuf d'aurore, en fuseau, posé en (0, 0). La couleur change (pâle, puis orange). */
export function oeufAurore(couleur = '#f6f1d6') {
  return `<path class="e4-coque" d="M0 0 C2.7 -2 2.9 -8 0 -12.5 C-2.9 -8 -2.7 -2 0 0 Z" style="fill:${couleur}" stroke="#b98f50" stroke-width=".5"/>
    <path d="M-1.1 -2 V-10.5 M1.1 -2 V-10.5" stroke="#fff" stroke-width=".5" opacity=".45"/>`;
}

/** Trois œufs de cuivré : petits disques blancs, sculptés. */
export function oeufsCuivre() {
  return [[0, 0], [7.5, -2], [3, 6]].map(([x, y]) =>
    `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2.5" fill="#f5f2ea" stroke="#d6cfbf" stroke-width=".6"/><circle cx="${x}" cy="${y}" r=".9" fill="#d9d1c0"/>`).join('');
}

/** Un œuf blanc d'azuré (finement réticulé). */
export function oeufAzure() {
  return `<circle r="2.6" fill="#fbfaf5" stroke="#d6d2c6" stroke-width=".6"/><circle cx="-.7" cy="-.7" r=".8" fill="#fff"/>`;
}

/** L'œuf du machaon : une petite perle jaune pâle. */
export function oeufMachaon() {
  return `<circle r="4" fill="#f2e6a0" stroke="#d8c873" stroke-width=".6"/><circle cx="-1.3" cy="-1.4" r="1.3" fill="#fffbe0"/>`;
}

/** Toile de soie lâche des chenilles du paon du jour. */
export function toileSoie() {
  return `<path d="M-66 8 C-72 -30 -42 -68 0 -72 C42 -70 74 -34 64 6 C52 32 -48 34 -66 8 Z" fill="#fff" opacity=".3"/>
    <path d="M-60 0 C-30 -20 30 -22 58 0 M-52 -36 C-20 -10 20 -12 54 -34 M-30 -62 C-10 -30 10 -30 30 -62 M-64 -12 L62 -18 M-40 22 C-10 -40 10 -40 42 22 M-62 -26 C-30 4 30 2 60 -24"
      stroke="#fff" stroke-width="1.1" fill="none" opacity=".75"/>`;
}

/** Jeune chenille de machaon : noire avec une selle blanche, comme une fiente. */
export function chenilleMachaonJeune() {
  return anneaux(8, -16, 12, (x, i) => {
    const blanc = i === 3 || i === 4;
    return `<path d="M${x} -9 l-1.6 -3.4 M${x} -9 l1.6 -3.4" stroke="${blanc ? '#cfc7b8' : '#5a463a'}" stroke-width=".9" stroke-linecap="round"/>
      <circle cx="${x}" cy="-5" r="4.7" fill="${blanc ? '#efe9dd' : '#2e221c'}"/>
      <circle cx="${f(x - 1.4)}" cy="-6.6" r=".8" fill="${blanc ? '#fff' : '#7a5e4e'}"/>`;
  }) + `<g class="e4-tete"><circle cx="16" cy="-5.4" r="4.4" fill="#2e221c"/>${oeil(17.6, -6.4, 0.75)}</g>`;
}

/** Une vraie fiente d'oiseau (beurk). */
export function fiente(k = 0) {
  const formes = [
    'M-13 2 C-16 -3 -10 -7 -5 -6 C-3 -10 4 -10 6 -5 C11 -6 16 0 11 4 C7 7 -8 7 -13 2 Z',
    'M-14 1 C-15 -4 -7 -6 -2 -5 C3 -9 12 -7 14 -1 C15 4 7 6 1 5 C-6 7 -14 6 -14 1 Z',
  ];
  return `<path d="${formes[k % 2]}" fill="#f4f1ea" stroke="#cfc8bb" stroke-width=".7"/>
    <path d="M-5 -1 C-3 -4 2 -4 3 -1 C3 2 -3 3 -5 -1 Z" fill="#3a3330"/><circle cx="7" cy="1" r="1.4" fill="#5a524c"/>`;
}

/* ============================================ Gros plans pour la loupe */

// Siliques de l'alliaire dans la loupe : [hauteur d'attache sur la tige,
// angle depuis la verticale, longueur].
export const SILIQUES = [[60, -36, 96], [40, 32, 100], [16, -26, 92], [-6, 24, 92], [-30, -16, 84], [-50, 14, 78], [-70, -6, 64]];

/** Une silique (fruit long et fin de l'alliaire), vers le haut depuis (0, 0). */
export function silique(l) {
  return `<path d="M0 0 V${-l}" stroke="#93bf86" stroke-width="6.5" stroke-linecap="round"/>
    <path d="M0 -6 V${-(l - 6)}" stroke="#acd49e" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>`;
}

/** La chenille d'aurore allongée contre une silique : même vert, une ligne blanche. */
export function chenilleSilique(l) {
  const plis = Array.from({ length: Math.floor((l - 14) / 7) }, (_, i) =>
    `<path d="M-3.4 ${-8 - i * 7} h6.8" stroke="#79ad92" stroke-width=".8"/>`).join('');
  return `<path d="M0 0 V${-l + 6}" stroke="#8fc4a5" stroke-width="7.6" stroke-linecap="round"/>
    ${plis}
    <path d="M2.6 -3 V${-l + 9}" stroke="#fbfff8" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="0" cy="${-l + 4}" r="4.3" fill="#a3d3b6"/><circle cx="1.5" cy="${-l + 2.8}" r="1.1" fill="${ENCRE}"/>`;
}

/** Le haut d'une alliaire vu à la loupe : tige et feuilles (les siliques à part). */
export function alliaireLoupe() {
  return `
  <path d="M0 176 C-3 100 3 0 0 -126" stroke="#5c8a3c" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${feuilleCoeur(-3, 124, 74, -64, '#5f9a3f', '#4a7f30')}
  ${feuilleCoeur(3, 100, 58, 62, '#6aa84a', '#4a7f30')}`;
}

/** Le bouquet de fleurs blanches en haut de l'alliaire, à la loupe. */
export function fleursAlliaireLoupe() {
  return [[-14, -124], [12, -128], [-4, -138], [14, -142], [-16, -142], [2, -150]]
    .map(([x, y]) => fleurAlliaire(x, y, 2.5)).join('');
}

/** Paon du jour posé, ailes fermées : le revers sombre, comme une feuille morte. */
export function paonFerme() {
  return `
  <path d="M-4 -2 C-18 -2 -32 -10 -34 -22 C-28 -28 -14 -27 -3 -18 Z" fill="#221a1e"/>
  <path d="M-4 -2 C-10 -10 -22 -30 -24 -48 C-17 -51 -5 -49 3 -42 C10 -32 11 -16 4 -4 Z" fill="#2c2327"/>
  <path d="M-20 -44 C-14 -36 -10 -28 -10 -18 M-14 -46 C-8 -38 -5 -28 -6 -16 M-29 -20 C-21 -18 -13 -14 -7 -8 M-22 -40 l4 2 l-2 4 l5 1"
    stroke="#4d3d38" stroke-width="1.2" fill="none"/>
  <path d="M-6 -30 l3 -2 l1 3" stroke="#6b5a50" stroke-width=".9" fill="none"/>
  <ellipse cx="3" cy="-3" rx="9" ry="2.8" fill="#2a1f22"/>
  <circle cx="12" cy="-4" r="2.8" fill="#2a1f22"/>
  <path d="M13 -6 Q17 -14 20 -18 M12 -6.5 Q14 -14 15 -19" stroke="#2a1f22" stroke-width=".9" fill="none"/>
  <circle cx="20" cy="-18" r=".9" fill="#2a1f22"/><circle cx="15" cy="-19" r=".9" fill="#2a1f22"/>
  <path d="M0 -1 l-3 4 M4 -1 l0 4 M8 -1 l3 4" stroke="#2a1f22" stroke-width=".9"/>`;
}

/** Mésange bleue de profil, tournée vers la droite, pattes en (0, 18). */
export function mesange() {
  return `
  <path d="M-15 -3 L-35 -9 L-34 2 L-15 4 Z" fill="#3f7fc4"/>
  <ellipse cx="0" cy="0" rx="17" ry="13" fill="#f2d64b"/>
  <path d="M-16 -3 C-12 -14 4 -16 12 -10 C6 -6 -6 -4 -16 -3 Z" fill="#94b05e"/>
  <g class="e4-aile-oiseau"><path d="M-13 -4 C-7 -13 8 -11 10 -4 C4 2 -7 2 -13 -4 Z" fill="#3f7fc4"/><path d="M-7 -4 H6" stroke="#fff" stroke-width="1.7"/></g>
  <circle cx="13" cy="-11" r="9" fill="#fff"/>
  <path d="M4.5 -13 C6 -21 18 -23 21.5 -15 C16 -17.5 10 -17 4.5 -13 Z" fill="#3a8ad6"/>
  <path d="M6 -9.5 L22 -12" stroke="#1d2a44" stroke-width="2" stroke-linecap="round"/>
  <path d="M5 -6 C9 -2 16 -2 20 -6" stroke="#1d2a44" stroke-width="1.6" fill="none"/>
  <circle cx="16" cy="-11.6" r="1.7" fill="#111"/>
  <path d="M21.5 -10.4 L27 -9.4 L21.5 -8 Z" fill="#333"/>
  <path d="M-2 12 v6 l-3 2 M4 12 v6 l3 2" stroke="#6b6f7a" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
}

/** Fourmilière en coupe (pour l'azuré) ; la surface du sol vers y = -88. */
export function fourmiliereCoupe() {
  const larves = [[-66, 32], [-52, 44], [-10, 46], [-4, 34], [-74, 44]].map(([x, y]) =>
    `<g transform="translate(${x} ${y})"><ellipse rx="5.4" ry="3.4" fill="#fbf6ea"/><path d="M-2 -3 V3 M1 -3 V3" stroke="#e2d8c4" stroke-width=".7"/></g>`).join('');
  const brins = Array.from({ length: 22 }, (_, i) => {
    const x = -200 + i * 19;
    return `<path d="M${x} -88 q2 -9 -1 -16 M${x + 6} -88 q-1 -11 2 -18" stroke="#7fb35a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }).join('');
  return `
  <rect x="-200" y="-220" width="400" height="140" fill="#d4ecbc"/>
  <path d="M-200 -86 Q-110 -94 -30 -88 T130 -90 T200 -86 V220 H-200 Z" fill="url(#e4-terre)"/>
  ${brins}
  <path d="M76 -92 C68 -60 86 -40 52 -14 C32 2 -10 8 -30 28 M-30 28 C-50 50 -20 80 12 102" stroke="#47290f" stroke-width="18" fill="none" stroke-linecap="round"/>
  <ellipse cx="52" cy="-14" rx="40" ry="18" fill="#47290f"/>
  <ellipse cx="-38" cy="38" rx="58" ry="25" fill="#47290f"/>
  <ellipse cx="14" cy="104" rx="44" ry="18" fill="#47290f"/>
  <ellipse cx="76" cy="-92" rx="12" ry="4" fill="#47290f"/>
  ${larves}
  <g fill="#a57c52">${[[-130, -40], [120, 40], [-110, 110], [90, 130], [-150, 60], [140, -50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>`;
}

/** Eau de la crue : la surface en y = 0, l'eau en dessous. */
export function eau(r = RAYON_LOUPE) {
  const l = r + 40;
  let d = `M${-l} 0`;
  for (let x = -l; x < l; x += 40) d += ' q10 -7 20 0 t20 0';
  return `<path d="${d} V${2 * r + 60} H${-l} Z" fill="url(#e4-eau-crue)" opacity=".62"/>
    <path d="${d}" stroke="#e8f6fc" stroke-width="2.6" fill="none" opacity=".9"/>`;
}

function massette(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-6 0 C-8 -18 -12 -34 -16 -46 M6 0 C8 -20 12 -36 17 -44 M0 0 C1 -20 -2 -40 -4 -56 M3 0 C4 -16 7 -30 9 -38" stroke="#6f9a4a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M-2 0 C-1 -24 0 -44 1 -60" stroke="#7fa95a" stroke-width="1.6" fill="none"/>
    <rect x="-1.6" y="-62" width="5.2" height="16" rx="2.6" fill="#7a4d31"/>
    <path d="M1 -62 V-68" stroke="#7a4d31" stroke-width="1.2"/>
  </g>`;
}

function touffe(x, y, s = 1) {
  return `<path d="M${x - 6 * s} ${y} q${2 * s} ${-8 * s} ${-1 * s} ${-14 * s} M${x} ${y} q${-1 * s} ${-10 * s} ${1 * s} ${-16 * s} M${x + 6 * s} ${y} q${-2 * s} ${-8 * s} ${2 * s} ${-13 * s}" stroke="#8fc46d" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
}

export function decor() {
  const arbres = Array.from({ length: 30 }, (_, i) => {
    const x = -620 + i * 58 + ((i * 37) % 20);
    const r = 20 + ((i * 13) % 12);
    return `<circle cx="${x}" cy="${f(196 - r * 0.4)}" r="${r}" fill="${i % 3 ? '#86bf72' : '#74b062'}"/>`;
  }).join('');
  const touffes = [[30, 300], [120, 288], [215, 300], [310, 290], [380, 304], [60, 440], [150, 455], [250, 448], [350, 440],
    [20, 545], [380, 548], [-60, 320], [-140, 420], [460, 330], [540, 430], [-80, 520], [480, 540]]
    .map(([x, y]) => touffe(x, y, 1)).join('');
  const fleurettes = [[44, 276, '#fff'], [98, 300, '#f6e27a'], [176, 286, '#fff'], [270, 296, '#e6d3f7'], [356, 282, '#fff'],
    [22, 420, '#f6e27a'], [130, 430, '#fff'], [226, 424, '#e6d3f7'], [330, 426, '#fff'], [390, 470, '#f6e27a'],
    [-40, 380, '#fff'], [440, 390, '#e6d3f7'], [-110, 480, '#f6e27a'], [520, 500, '#fff']]
    .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${c}"/><circle cx="${x}" cy="${y}" r=".8" fill="#e3b04b"/>`).join('');
  return `
  <rect x="-1200" y="-1200" width="2800" height="1420" fill="url(#e4-ciel)"/>
  <circle cx="72" cy="58" r="34" fill="#fff6c4" opacity=".45"/>
  <circle cx="72" cy="58" r="21" fill="#fff6c4"/>
  <g fill="#fff" opacity=".88">
    <ellipse cx="200" cy="72" rx="26" ry="9"/><ellipse cx="216" cy="64" rx="16" ry="9"/>
    <ellipse cx="322" cy="44" rx="22" ry="7"/><ellipse cx="336" cy="38" rx="12" ry="7"/>
    <ellipse cx="-120" cy="90" rx="30" ry="9"/><ellipse cx="520" cy="80" rx="28" ry="8"/>
  </g>
  <path d="M-1200 206 C-600 150 -200 196 100 176 C300 162 500 190 1600 170 V240 H-1200 Z" fill="#b8dc9a"/>
  ${arbres}
  <rect x="-1200" y="212" width="2800" height="1400" fill="#b5dc8f"/>
  <path d="M-1200 213 H1600" stroke="#a3cf7c" stroke-width="3"/>
  <ellipse cx="300" cy="226" rx="98" ry="22" fill="#8fbf6b"/>
  <ellipse cx="300" cy="225" rx="94" ry="19.5" fill="url(#e4-eau)"/>
  <path d="M262 221 q8 -3 16 0 M314 230 q8 -3 16 0 M282 234 q6 -2 12 0 M338 220 q6 -2 12 0" stroke="#d6f0fb" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <g fill="#5fa45a">
    <path d="M246 228 a7 3.2 0 1 0 1 -3 l-4 1.5 Z"/>
    <path d="M354 232 a6 2.8 0 1 0 1 -2.6 l-3.5 1.3 Z"/>
    <path d="M330 217 a5 2.4 0 1 0 1 -2.2 l-3 1.1 Z"/>
  </g>
  <circle cx="249" cy="226" r="2.4" fill="#ffb3d1"/><circle cx="249" cy="226" r="1" fill="#f6e27a"/>
  <g transform="translate(372 216) scale(.62)">${cyrielChapeau()}</g>
  <g transform="translate(126 213) scale(.5)">${duoCamargue()}</g>
  ${massette(212, 232, 0.95)}${massette(390, 230, 1.05)}${massette(-40, 236, 1.1)}${massette(470, 240, 1.15)}${massette(-130, 250, 0.9)}${massette(540, 250, 0.95)}
  ${touffes}${fleurettes}`;
}

/** Le panneau en bois à l'entrée du marais, avec un chiffre au néon. */
export function panneau(chiffre) {
  return `
  <rect x="42.5" y="198" width="7" height="54" rx="2" fill="#86552e"/>
  <rect x="6" y="136" width="80" height="66" rx="6" fill="#b47a46" stroke="#86552e" stroke-width="2.5"/>
  <path d="M11 159 H81 M11 181 H81" stroke="#a06a3b" stroke-width="1"/>
  <text x="46" y="153" text-anchor="middle" font-size="12" font-weight="600" fill="#fffaf2">Marais</text>
  <g class="e4-chiffre-panneau">${chiffreNeon(chiffre, 35, 161, 22, 34)}</g>`;
}

/** La grande feuille où attendent les chenilles. */
export function feuilleDepart() {
  return `
  <ellipse cx="0" cy="3" rx="40" ry="5" fill="#2a1745" opacity=".12"/>
  <path d="M-40 0 C-30 -12 20 -14 42 -2 C24 8 -24 9 -40 0 Z" fill="#6fb35a"/>
  <path d="M-38 0 C-10 -3 20 -3 40 -2" stroke="#4f8f3f" stroke-width="1.4" fill="none"/>
  <path d="M-20 -1 l-6 -5 M-4 -2 l-5 -6 M12 -2 l-4 -6 M-20 0 l-6 4 M-4 -1 l-5 5 M12 -1 l-4 5" stroke="#4f8f3f" stroke-width="1"/>`;
}
