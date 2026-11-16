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

const PLANTES = { ortie, cardamine, patience, gentiane, carotte, menthe, iris };

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
    s += `<g class="e4-seg" style="animation-delay:${(-(n - i) * 0.08).toFixed(2)}s">${dessin(x)}</g>`;
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

/** Papillon ailes ouvertes. Pour le machaon, chiffre : le chiffre peint sur l'aile. */
export function papillon(cle, { chiffre = null } = {}) {
  if (cle === 'machaon') return machaon(chiffre);
  const aile = AILES[cle];
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

export function fourmi() {
  return `
  <ellipse cx="-5" cy="-3" rx="3.2" ry="2.4" fill="#2a1d1d"/>
  <ellipse cx="0" cy="-3.2" rx="2" ry="1.6" fill="#2a1d1d"/>
  <circle cx="4" cy="-3.6" r="2.1" fill="#2a1d1d"/>
  <path class="e4-pattes" d="M-3 -2 l-2 3 M0 -2 l0 3 M2 -2 l2 3" stroke="#2a1d1d" stroke-width=".9" stroke-linecap="round"/>
  <path d="M5 -5.4 q2 -3 4.4 -3" stroke="#2a1d1d" stroke-width=".8" fill="none"/>`;
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
  </defs>`;
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
