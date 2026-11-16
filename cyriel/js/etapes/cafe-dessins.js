// Dessins du café (étape 5), faits à la main en SVG.
//
// Chaque fonction renvoie un morceau de SVG sous forme de texte. Sauf
// mention contraire, (0, 0) est le centre du dessin, qui tient dans un
// carré d'environ 48 × 48. Les personnages ont leur origine aux pieds.
// Le café est dessiné dans un cadre de 400 × 560 ; le décor déborde
// largement pour remplir les écrans plus larges ou plus hauts.

import { cheminChiffre } from '../chiffres.js';
import { duoSpeleo, cyrielChapeau, cyrielClin, cyrielNatte } from './clins-doeil.js';

export const LARGEUR = 400;
export const HAUTEUR = 560;


const ENCRE = '#1a1026';

/* ============================================================== Aliments */

function rhubarbe() {
  return `
  <path d="M-9 19 L-13 -4" stroke="#d6335d" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M0 20 L0 -6" stroke="#e8456f" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M9 19 L13 -3" stroke="#f06b8f" stroke-width="6" stroke-linecap="round"/>
  <path d="M-10.5 17 L-14 -2 M-1.5 18 L-1.5 -4 M7.5 17 L11 -1" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M-19 -5 C-24 -17 -11 -25 -3 -18 C1 -27 17 -25 20 -14 C23 -6 16 -1 9 -3 C3 1 -4 1 -9 -3 C-13 -1 -18 -1 -19 -5 Z" fill="#5bb36a"/>
  <path d="M0 -4 L-1 -18 M-0.5 -9 L-9 -14 M-0.5 -9 L9 -15" stroke="#3f8a4c" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
}


function pomme() {
  return `
  <path d="M0 -6 C-6 -12 -17 -9 -16 3 C-15 14 -7 19 0 16 C7 19 15 14 16 3 C17 -9 6 -12 0 -6 Z" fill="#e5484d"/>
  <ellipse cx="-7" cy="1" rx="3" ry="5" fill="#fff" opacity=".35"/>
  <path d="M0 -6 Q1 -12 3 -15" stroke="#6b4a2b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M3 -12 C8 -17 14 -15 15 -12 C11 -9 6 -9 3 -12 Z" fill="#5bb36a"/>`;
}


function farine() {
  const grains = [-1, 3, 7].map((y) => `
    <ellipse cx="-3" cy="${y}" rx="2.6" ry="1.5" transform="rotate(-35 -3 ${y})"/>
    <ellipse cx="3" cy="${y}" rx="2.6" ry="1.5" transform="rotate(35 3 ${y})"/>`).join('');
  return `
  <path d="M-13 -11 Q0 -15 13 -11 L15 16 Q0 20 -15 16 Z" fill="#efe3c8" stroke="#d6c49f" stroke-width="1.5"/>
  <path d="M-10 -11 Q0 -20 10 -11" fill="#e6d7b5" stroke="#d6c49f" stroke-width="1.5"/>
  <rect x="-9" y="-13" width="18" height="3.5" rx="1.7" fill="#b48cff"/>
  <path d="M0 13 L0 -3" stroke="#c99a3c" stroke-width="1.5"/>
  <g fill="#d9a441">${grains}<ellipse cx="0" cy="-4" rx="1.6" ry="2.6"/></g>`;
}

function cube(x, y, s) {
  return `<g transform="translate(${x} ${y})">
    <path d="M0 ${-s} L${s} ${-s / 2} L0 0 L${-s} ${-s / 2} Z" fill="#ffffff" stroke="#cfc8e0" stroke-width="1"/>
    <path d="M${-s} ${-s / 2} L0 0 L0 ${s} L${-s} ${s / 2} Z" fill="#ece8f4" stroke="#cfc8e0" stroke-width="1"/>
    <path d="M${s} ${-s / 2} L0 0 L0 ${s} L${s} ${s / 2} Z" fill="#dcd6e8" stroke="#cfc8e0" stroke-width="1"/>
  </g>`;
}

function sucre() {
  return cube(-8, 9, 8) + cube(8, 9, 8) + cube(0, -3, 8);
}

function marron() {
  return `
  <rect x="-12" y="-10" width="24" height="27" rx="5" fill="#f3e9dc" stroke="#d9c8a8" stroke-width="1.5"/>
  <path d="M-10.5 -3 H10.5 V12 Q10.5 15.5 7 15.5 H-7 Q-10.5 15.5 -10.5 12 Z" fill="#7b4a2d"/>
  <rect x="-14" y="-17" width="28" height="8" rx="3" fill="#8f5cf7"/>
  <rect x="-9" y="1" width="18" height="10" rx="2" fill="#fffaf2"/>
  <path d="M0 3 C-4 3 -5 7 -3 9 Q0 11 3 9 C5 7 4 3 0 3 Z" fill="#8a5a3b"/>
  <path d="M-3 4.5 Q0 2.5 3 4.5" stroke="#c9a27a" stroke-width="1.2" fill="none"/>`;
}

function chocolat() {
  return `
  <g transform="rotate(-12)">
    <rect x="-12" y="-17" width="24" height="34" rx="2.5" fill="#6b3f22"/>
    <path d="M-12 -6 H12 M-12 5 H12 M0 -17 V17" stroke="#8a5a3b" stroke-width="1.5"/>
    <rect x="-13" y="4" width="26" height="14" rx="2" fill="#7a3cf0"/>
    <path d="M-13 4 L-9 1.5 L-5 4 L-1 1.5 L3 4 L7 1.5 L11 4 L13 3" fill="#d7d3e0" stroke="#d7d3e0" stroke-width="1"/>
    <path d="M-6 11 h12" stroke="#b48cff" stroke-width="2" stroke-linecap="round"/>
  </g>`;
}

function oeufs() {
  return `
  <ellipse cx="7" cy="1" rx="8.5" ry="11" fill="#fbf1e2" stroke="#e2cfb3" stroke-width="1.4"/>
  <ellipse cx="-6" cy="5" rx="8.5" ry="11" fill="#f6e8d4" stroke="#e2cfb3" stroke-width="1.4"/>
  <ellipse cx="-9" cy="0" rx="2.2" ry="3.4" fill="#fff" opacity=".85"/>`;
}

function lait() {
  return `
  <path d="M-5 -16 H5 V-10 Q12 -6 12 0 V15 Q12 18 9 18 H-9 Q-12 18 -12 15 V0 Q-12 -6 -5 -10 Z" fill="#ffffff" stroke="#c4cfe3" stroke-width="1.5"/>
  <rect x="-11.2" y="3" width="22.4" height="9" fill="#e3ecfb"/>
  <path d="M-6 7.5 q2 -2 4 0 q2 2 4 0" stroke="#4a7bd8" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <rect x="-6" y="-21" width="12" height="6" rx="2" fill="#4a7bd8"/>`;
}



function poivron() {
  return `
  <path d="M0 -9 C-9 -13 -17 -7 -16 4 C-15 14 -9 19 -4 17 C-2 19.5 2 19.5 4 17 C9 19 15 14 16 4 C17 -7 9 -13 0 -9 Z" fill="#e5302f"/>
  <path d="M-5 -7 C-7 1 -6 10 -4 16 M5 -7 C7 1 6 10 4 16" stroke="#b81f22" stroke-width="1.4" fill="none"/>
  <ellipse cx="-10" cy="1" rx="2.4" ry="5" fill="#fff" opacity=".35"/>
  <path d="M-7 -10 Q0 -15 7 -10 Q3 -8 0 -8.5 Q-3 -8 -7 -10 Z" fill="#3f8a4c"/>
  <path d="M0 -11 Q1 -17 5 -19" stroke="#3f8a4c" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}

function aubergine() {
  return `
  <g transform="rotate(-30)">
    <path d="M0 -15 C6 -15 7.5 -8 8.5 -2 C10.5 8 8.5 18 0 19.5 C-8.5 18 -10.5 8 -8.5 -2 C-7.5 -8 -6 -15 0 -15 Z" fill="#5b2a86"/>
    <ellipse cx="-4" cy="4" rx="2" ry="7" fill="#fff" opacity=".22"/>
    <path d="M-7.5 -12 Q0 -19 7.5 -12 L4.5 -9.5 L2 -13 L0 -9 L-2 -13 L-4.5 -9.5 Z" fill="#4f9a5a"/>
    <path d="M0 -16 V-22" stroke="#4f9a5a" stroke-width="3" stroke-linecap="round"/>
  </g>`;
}

function gingembre() {
  return `
  <path d="M-17 4 C-19 -3 -12 -7 -8 -4 C-6 -11 1 -13 3 -7 C6 -13 14 -11 13 -4 C18 -4 20 3 16 6 C18 12 12 16 8 12 C5 17 -2 17 -4 12 C-9 16 -16 11 -17 4 Z" fill="#e3c08a" stroke="#c99a5c" stroke-width="1.4"/>
  <path d="M-9 -1 Q-6 2 -9 6 M3 -3 Q5 1 2 5 M11 2 Q13 5 10 9" stroke="#c99a5c" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="M-13 3 h2 M-2 9 h2 M7 -1 h2" stroke="#b98a4c" stroke-width="1" stroke-linecap="round"/>`;
}

function coriandre() {
  const feuille = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><circle cx="-2.6" cy="0" r="3.1"/><circle cx="2.6" cy="0" r="3.1"/><circle cx="0" cy="-3.2" r="3.1"/></g>`;
  return `
  <path d="M0 20 L-6 -2 M0 20 L-1 -9 M0 20 L6 -3 M0 20 L11 4 M0 20 L-11 5" stroke="#4f9a5a" stroke-width="1.6" stroke-linecap="round"/>
  <g fill="#5bb36a">${feuille(-7, -4)}${feuille(-1, -12)}${feuille(7, -5)}${feuille(-12, 3, 0.85)}${feuille(12, 2, 0.85)}${feuille(1, -3, 0.9)}</g>
  <g fill="#6cc27a">${feuille(-4, -8, 0.6)}${feuille(5, -10, 0.6)}</g>
  <rect x="-4" y="11" width="8" height="4" rx="1.5" fill="#e8456f"/>`;
}

function balsamique() {
  return `
  <path d="M-3 -19 H3 V-10 Q9 -7 9 0 V17 Q9 19.5 6.5 19.5 H-6.5 Q-9 19.5 -9 17 V0 Q-9 -7 -3 -10 Z" fill="#2b1a1a"/>
  <rect x="-3.8" y="-22" width="7.6" height="4.5" rx="1" fill="#c9932a"/>
  <rect x="-7" y="2" width="14" height="10" rx="1.5" fill="#f4ead8"/>
  <path d="M-4 5.5 h8 M-3 8.5 h6" stroke="#7b2d2d" stroke-width="1.3" stroke-linecap="round"/>
  <ellipse cx="-5.5" cy="-3" rx="1.4" ry="4" fill="#fff" opacity=".22"/>`;
}

function vin() {
  return `
  <g transform="translate(-5 0)">
    <path d="M-3 -21 H3 V-11 Q8 -8 8 -2 V17 Q8 19.5 5.5 19.5 H-5.5 Q-8 19.5 -8 17 V-2 Q-8 -8 -3 -11 Z" fill="#3b1a2a"/>
    <rect x="-3.4" y="-23" width="6.8" height="5" rx="1" fill="#8a1c34"/>
    <rect x="-6.5" y="2" width="13" height="10" rx="1.5" fill="#fffaf2"/>
    <path d="M-3 5.5 h6 M-2 8.5 h4" stroke="#8a1c34" stroke-width="1.3" stroke-linecap="round"/>
  </g>
  <g transform="translate(12 7)">
    <path d="M-5.5 -11 H5.5 Q5.5 -2 0 -1 Q-5.5 -2 -5.5 -11 Z" fill="#ffffff" fill-opacity=".7" stroke="#c4bdd6" stroke-width="1"/>
    <path d="M-5 -6.5 H5 Q4.5 -2 0 -1.6 Q-4.5 -2 -5 -6.5 Z" fill="#8a1c34"/>
    <path d="M0 -1 V9 M-4 9.5 H4" stroke="#c4bdd6" stroke-width="1.5" stroke-linecap="round"/>
  </g>`;
}

function champagne() {
  return `
  <path d="M-3 -15 H3 V-9 Q9 -6 9 0 V17 Q9 19.5 6.5 19.5 H-6.5 Q-9 19.5 -9 17 V0 Q-9 -6 -3 -9 Z" fill="#2f5a3a"/>
  <path d="M-3.6 -17 H3.6 V-8 Q0 -6 -3.6 -8 Z" fill="#e3b04b"/>
  <ellipse cx="0" cy="-19" rx="3.6" ry="2.6" fill="#c9a27a"/>
  <rect x="-7" y="2" width="14" height="9" rx="1.5" fill="#fffaf2"/>
  <path d="M-3.5 6.5 h7" stroke="#c9932a" stroke-width="1.6" stroke-linecap="round"/>
  <ellipse cx="-5.5" cy="-2" rx="1.4" ry="4" fill="#fff" opacity=".25"/>
  <g fill="none" stroke="#e3b04b" stroke-width="1"><circle cx="12" cy="-14" r="1.8"/><circle cx="15" cy="-7" r="1.3"/><circle cx="11" cy="-3" r="1"/></g>`;
}

function huitres() {
  return `
  <path d="M-19 5 C-17 -8 -4 -14 8 -12 C17 -10 20 -2 17 6 C13 15 -11 17 -19 5 Z" fill="#8f8a99"/>
  <path d="M-15 4 C-13 -6 -3 -10 7 -9 C13 -7 15 -2 13 4 C10 10 -9 11 -15 4 Z" fill="#efebf4"/>
  <path d="M-9 2 C-7 -3 0 -5 5 -4 C8.5 -3 9 0 7 3 C5 6 -5 6 -9 2 Z" fill="#d8cfc0"/>
  <path d="M-7 1.5 C-4 -1 2 -2 5 -1" stroke="#bfb3a0" stroke-width="1" fill="none"/>
  <path d="M-19 5 C-15 1 -17 -3 -13 -6 M-6 -12 C-4 -9 -2 -11 2 -12 M12 -10 C12 -7 15 -6 17 -3" stroke="#6f6a7a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M-12 12 C-2 17 10 15 15 9" stroke="#6f6a7a" stroke-width="1.2" fill="none"/>
  <path d="M10 8 L18 2 L20 7 Z" fill="#f5d33f"/>`;
}

function beurre() {
  return `
  <path d="M-18 4 L-3 11.5 L18 1 L18 7 L-3 17.5 L-18 10 Z" fill="#e8f0fb" stroke="#bcd0ee" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M-14 -1 L-3 4.5 L14 -4 L3 -9.5 Z" fill="#fff1a0"/>
  <path d="M-14 -1 L-3 4.5 L-3 11.5 L-14 6 Z" fill="#f4da6a"/>
  <path d="M-3 4.5 L14 -4 L14 3 L-3 11.5 Z" fill="#e9cb55"/>
  <path d="M-14 3.5 L-3 9 L14 0.5 L14 3 L-3 11.5 L-14 6 Z" fill="#ffffff"/>
  <path d="M-12 5.6 L-3 10.1 L12 2.6" stroke="#4a7bd8" stroke-width="1.1" fill="none"/>
  <path d="M-7 -1.6 Q-3 -5 2 -4.4" stroke="#fff" stroke-opacity=".8" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
}

// defini, partitif, de : le nom dans les phrases (« Le beurre ne va pas
// dans… », « Il manque du beurre », « Il y a trop de beurre »).
export const ARTICLES = {
  rhubarbe: { nom: 'Rhubarbe', defini: 'la rhubarbe', partitif: 'de la rhubarbe', de: 'de rhubarbe', dessin: rhubarbe },
  farine: { nom: 'Farine', defini: 'la farine', partitif: 'de la farine', de: 'de farine', dessin: farine },
  sucre: { nom: 'Sucre', defini: 'le sucre', partitif: 'du sucre', de: 'de sucre', dessin: sucre },
  marron: { nom: 'Crème de marron', defini: 'la crème de marron', partitif: 'de la crème de marron', de: 'de crème de marron', dessin: marron },
  chocolat: { nom: 'Chocolat', defini: 'le chocolat', partitif: 'du chocolat', de: 'de chocolat', dessin: chocolat },
  oeufs: { nom: 'Œufs', defini: 'les œufs', partitif: 'des œufs', de: 'd’œufs', pluriel: true, dessin: oeufs },
  lait: { nom: 'Lait', defini: 'le lait', partitif: 'du lait', de: 'de lait', dessin: lait },
  beurre: { nom: 'Beurre', defini: 'le beurre', partitif: 'du beurre', de: 'de beurre', dessin: beurre },
  poivron: { nom: 'Poivrons', defini: 'les poivrons', partitif: 'des poivrons', de: 'de poivrons', pluriel: true, dessin: poivron },
  aubergine: { nom: 'Aubergine', defini: 'l’aubergine', partitif: 'de l’aubergine', de: 'd’aubergine', dessin: aubergine },
  gingembre: { nom: 'Gingembre', defini: 'le gingembre', partitif: 'du gingembre', de: 'de gingembre', dessin: gingembre },
  coriandre: { nom: 'Coriandre', defini: 'la coriandre', partitif: 'de la coriandre', de: 'de coriandre', dessin: coriandre },
  balsamique: { nom: 'Vinaigre balsamique', defini: 'le vinaigre balsamique', partitif: 'du vinaigre balsamique', de: 'de vinaigre balsamique', dessin: balsamique },
  vin: { nom: 'Vin rouge', defini: 'le vin rouge', partitif: 'du vin rouge', de: 'de vin rouge', dessin: vin },
  champagne: { nom: 'Champagne', defini: 'le champagne', partitif: 'du champagne', de: 'de champagne', dessin: champagne },
  huitres: { nom: 'Huîtres', defini: 'les huîtres', partitif: 'des huîtres', de: 'd’huîtres', pluriel: true, dessin: huitres },
};

/* ================================================================= Plats */

/** Chocolat chaud. vapeur : 'blanc', 'lilas' ou false. */
export function tasse({ vapeur = 'blanc' } = {}) {
  const couleur = vapeur === 'lilas' ? '#b48cff' : '#ffffff';
  const fumee = vapeur ? `
  <g class="e5-vapeur" stroke="${couleur}" stroke-width="1.8" fill="none" stroke-linecap="round">
    <path d="M-3.5 -11 q-2 -3 0 -6 q2 -3 0 -6"/>
    <path d="M3.5 -11 q-2 -3 0 -6 q2 -3 0 -6" style="animation-delay:-.9s"/>
  </g>` : '';
  return `${fumee}
  <ellipse cx="1.5" cy="11.5" rx="13.5" ry="2.8" fill="#e9dcff" stroke="#c9b3f2" stroke-width="1"/>
  <path d="M-9 -7 H9 V5 Q9 11 3 11 H-3 Q-9 11 -9 5 Z" fill="#8f5cf7"/>
  <path d="M9 -3 Q15.5 -3 15.5 2 Q15.5 7 9 7" stroke="#8f5cf7" stroke-width="2.6" fill="none"/>
  <ellipse cx="0" cy="-7" rx="9" ry="2.6" fill="#6b3f22"/>
  <path d="M-6 -1 V4" stroke="#fff" stroke-opacity=".45" stroke-width="1.8" stroke-linecap="round"/>`;
}

/** Part de gâteau rhubarbe et crème de marron, sur son assiette. */
export function gateau() {
  return `
  <ellipse cx="0" cy="10.5" rx="17" ry="3.6" fill="#ffffff" stroke="#e3d6c2" stroke-width="1.2"/>
  <path d="M-13 -5 L13 -5 L2 -12 Z" fill="#9a6845"/>
  <rect x="-13" y="-5" width="26" height="15" fill="#f2cf93"/>
  <rect x="-13" y="-5" width="26" height="4" fill="#7b4a2d"/>
  <rect x="-13" y="2" width="26" height="3.2" fill="#f07aa0"/>
  <path d="M-11 -1.2 q1 3.4 2 0 Z M-3 -1.2 q1 4.4 2 0 Z M6 -1.2 q1 3.4 2 0 Z" fill="#7b4a2d"/>
  <rect x="-3.5" y="-15" width="10" height="3.4" rx="1.7" fill="#e8456f" transform="rotate(-18 1.5 -13.3)"/>
  <circle cx="-3.5" cy="-9.5" r="2.4" fill="#fffaf2"/>`;
}

/** Tarte à la rhubarbe entière, croisillons dorés, sur son assiette. */
export function tarte() {
  return `
  <ellipse cx="0" cy="10" rx="18" ry="4" fill="#ffffff" stroke="#e3d6c2" stroke-width="1.2"/>
  <path d="M-15.5 0 V5 A15.5 5.6 0 0 0 15.5 5 V0 Z" fill="#cf9550"/>
  <path d="M-15.5 2 q2.6 2.4 5.2 0 q2.6 2.6 5.2 0.4 q2.6 2.6 5.2 0.4 q2.6 2.6 5.2 0 q2.6 2.4 5.2 -0.4" stroke="#b97d3c" stroke-width="1" fill="none"/>
  <ellipse cx="0" cy="0" rx="15.5" ry="5.6" fill="#e8b46e"/>
  <ellipse cx="0" cy="0" rx="12.4" ry="4.2" fill="#ec6f97"/>
  <ellipse cx="-4" cy="-1" rx="3" ry="1" fill="#f7a3bf"/>
  <g stroke="#f6cf8f" stroke-width="1.7" stroke-linecap="round">
    <path d="M-8.5 -3 L-3.5 3.6 M-2.5 -4 L3 3.9 M3.5 -3.8 L8.5 2.6"/>
    <path d="M-9 2.4 L-4 -3.6 M-3 3.9 L2.5 -4 M3.6 3.4 L8.8 -2.4"/>
  </g>`;
}

/** Crêpes pliées, nappées de crème de marron. */
export function crepes() {
  return `
  <ellipse cx="0" cy="10" rx="18" ry="4" fill="#ffffff" stroke="#e3d6c2" stroke-width="1.2"/>
  <path d="M-16 7 Q-15 -4 -1 -6 Q13 -6 16 6 Q0 10 -16 7 Z" fill="#e9b265"/>
  <path d="M-13 4 Q-11 -9 3 -10 Q14 -9 14 2 Q0 7 -13 4 Z" fill="#f6cf8c" stroke="#dea457" stroke-width="1"/>
  <ellipse cx="-6" cy="0" rx="1.6" ry=".9" fill="#dea457"/><ellipse cx="8" cy="-3" rx="1.3" ry=".8" fill="#dea457"/><ellipse cx="2" cy="2.4" rx="1.4" ry=".8" fill="#dea457"/>
  <path d="M-8 -5 q3 -3.4 6 0 q3 3.4 6 0 q2 -2.4 4 -0.6" stroke="#7b4a2d" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M-1 -9.5 C-4 -10 -4 -13 -1 -13.4 C2 -13.8 3.4 -11 1 -9.6 Z" fill="#8a5a3b"/>`;
}

export const PLATS = { tasse, gateau, tarte, crepes };

/** Petite pile de pièces laissée sur une table. */
export function piece() {
  return `
  <ellipse cx="-2" cy="5" rx="9" ry="3.4" fill="#c9932a"/>
  <ellipse cx="-2" cy="3.2" rx="9" ry="3.4" fill="#f2c14e" stroke="#c9932a" stroke-width="1"/>
  <ellipse cx="2" cy="-0.5" rx="9" ry="3.4" fill="#c9932a"/>
  <ellipse cx="2" cy="-2.3" rx="9" ry="3.4" fill="#f2c14e" stroke="#c9932a" stroke-width="1"/>
  <ellipse cx="2" cy="-2.3" rx="4.6" ry="1.5" fill="none" stroke="#e0a92a" stroke-width="1"/>
  <path class="e5-brille" d="M-7 -8 l1.2 -3 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 Z" fill="#fff"/>`;
}

/** Une pièce vue de face (rayon 10). */
export function pieceSeule() {
  return `
  <circle r="10" fill="#f2c14e" stroke="#c9932a" stroke-width="1.6"/>
  <circle r="6.6" fill="none" stroke="#e0a92a" stroke-width="1.2"/>
  <path d="M0 3.6 C-2.8 1.4 -3.4 -0.6 -1.8 -1.4 C-0.9 -1.8 -0.3 -1.3 0 -0.8 C0.3 -1.3 0.9 -1.8 1.8 -1.4 C3.4 -0.6 2.8 1.4 0 3.6 Z" fill="#c9932a"/>`;
}

export function enveloppe() {
  return `
  <rect x="-15" y="-10" width="30" height="21" rx="2.5" fill="#fffaf2" stroke="#b9a2ea" stroke-width="1.5"/>
  <path d="M-15 -9 L0 3 L15 -9" fill="none" stroke="#b9a2ea" stroke-width="1.5"/>
  <path d="M0 6.5 C-4 3 -5 0 -2.6 -1 C-1.4 -1.4 -0.4 -0.8 0 0 C0.4 -0.8 1.4 -1.4 2.6 -1 C5 0 4 3 0 6.5 Z" fill="#7a3cf0"/>`;
}

export function cadeau() {
  return `
  <rect x="-12" y="-6" width="24" height="18" rx="2" fill="#8f5cf7"/>
  <rect x="-2.5" y="-6" width="5" height="18" fill="#ff9cc8"/>
  <g class="e5-couvercle">
    <rect x="-14" y="-12" width="28" height="7" rx="2" fill="#7a3cf0"/>
    <rect x="-2.5" y="-12" width="5" height="7" fill="#ff7ab8"/>
    <path d="M0 -12 C-6 -20 -13 -16 -8 -12 Z M0 -12 C6 -20 13 -16 8 -12 Z" fill="none" stroke="#ff7ab8" stroke-width="2.2" stroke-linejoin="round"/>
  </g>`;
}

export function cuillere() {
  return `
  <path d="M2 0 L12 -30" stroke="#a86f3f" stroke-width="3.2" stroke-linecap="round"/>
  <ellipse cx="0" cy="2" rx="4" ry="6" transform="rotate(18)" fill="#a86f3f"/>`;
}

/* =========================================================== Personnages */

// Couronne de piquants : alternance de pointes (rayon extérieur) et de creux.
function epines(cx, cy, rxExt, ryExt, rxInt, ryInt, n, de, a) {
  const pts = [];
  for (let i = 0; i <= n * 2; i++) {
    const t = ((de + ((a - de) * i) / (n * 2)) * Math.PI) / 180;
    const ext = i % 2 === 1;
    pts.push(`${(cx + Math.cos(t) * (ext ? rxExt : rxInt)).toFixed(1)},${(cy + Math.sin(t) * (ext ? ryExt : ryInt)).toFixed(1)}`);
  }
  return pts.join(' ');
}

function yeux(x, y, r = 2.3) {
  return `
  <circle cx="${-x}" cy="${y}" r="${r}" fill="${ENCRE}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${ENCRE}"/>
  <circle cx="${-x + 0.7}" cy="${y - 0.8}" r=".75" fill="#fff"/><circle cx="${x + 0.7}" cy="${y - 0.8}" r=".75" fill="#fff"/>`;
}

function joues(x, y) {
  return `<ellipse cx="${-x}" cy="${y}" rx="2.7" ry="1.6" fill="#ff9cc8" opacity=".85"/><ellipse cx="${x}" cy="${y}" rx="2.7" ry="1.6" fill="#ff9cc8" opacity=".85"/>`;
}

function herisson() {
  return `
  <ellipse cx="-6" cy="-1" rx="4.5" ry="2.4" fill="#7a5134"/><ellipse cx="6" cy="-1" rx="4.5" ry="2.4" fill="#7a5134"/>
  <polygon points="${epines(0, -28, 26, 25, 18, 17, 11, 160, 380)}" fill="#7a5134"/>
  <polygon points="${epines(0, -27, 21, 20, 15, 14, 9, 168, 372)}" fill="#946640"/>
  <ellipse cx="0" cy="-10" rx="13" ry="10" fill="#e6c49a"/>
  <ellipse cx="-13" cy="-10" rx="4.5" ry="5.5" fill="#e6c49a"/><ellipse cx="13" cy="-10" rx="4.5" ry="5.5" fill="#e6c49a"/>
  <ellipse cx="0" cy="-25" rx="15" ry="13" fill="#efd5ae"/>
  ${yeux(6, -28)}
  ${joues(10.5, -23)}
  <ellipse cx="0" cy="-22" rx="3" ry="2.3" fill="${ENCRE}"/>
  <path d="M-2.4 -18.4 Q0 -16.4 2.4 -18.4" stroke="${ENCRE}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
}

function grenouille() {
  return `
  <ellipse cx="-8" cy="-2" rx="7" ry="3" fill="#4fa83a"/><ellipse cx="8" cy="-2" rx="7" ry="3" fill="#4fa83a"/>
  <ellipse cx="0" cy="-19" rx="20" ry="16" fill="#6cc24a"/>
  <ellipse cx="0" cy="-12" rx="12" ry="8.5" fill="#cdeea0"/>
  <circle cx="-10" cy="-33" r="8" fill="#6cc24a"/><circle cx="10" cy="-33" r="8" fill="#6cc24a"/>
  <circle cx="-10" cy="-33" r="5.4" fill="#fff"/><circle cx="10" cy="-33" r="5.4" fill="#fff"/>
  <circle cx="-9.4" cy="-32.4" r="2.8" fill="${ENCRE}"/><circle cx="10.6" cy="-32.4" r="2.8" fill="${ENCRE}"/>
  <circle cx="-8.6" cy="-33.4" r=".9" fill="#fff"/><circle cx="11.4" cy="-33.4" r=".9" fill="#fff"/>
  <path d="M-10 -22 Q0 -14 10 -22" stroke="#2f6b2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  ${joues(14, -21)}
  <ellipse cx="-17" cy="-10" rx="4" ry="5" fill="#5bb43f"/><ellipse cx="17" cy="-10" rx="4" ry="5" fill="#5bb43f"/>`;
}

function loutre() {
  return `
  <ellipse cx="-6" cy="-1" rx="5" ry="2.6" fill="#6f452b"/><ellipse cx="6" cy="-1" rx="5" ry="2.6" fill="#6f452b"/>
  <path d="M13 -6 Q26 -8 24 -20" stroke="#7a4d31" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-14" rx="15" ry="14" fill="#8a5a3b"/>
  <ellipse cx="0" cy="-12" rx="9" ry="9.5" fill="#c9a27a"/>
  <circle cx="-12" cy="-46" r="4" fill="#6f452b"/><circle cx="12" cy="-46" r="4" fill="#6f452b"/>
  <ellipse cx="0" cy="-36" rx="15" ry="13" fill="#8a5a3b"/>
  <ellipse cx="0" cy="-31" rx="9.5" ry="7" fill="#ecd7bb"/>
  ${yeux(6, -39, 2.2)}
  <ellipse cx="0" cy="-34" rx="3" ry="2.1" fill="${ENCRE}"/>
  <path d="M-2.4 -30.6 Q0 -28.8 2.4 -30.6" stroke="${ENCRE}" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="M-4 -32 L-13 -33 M-4 -30.5 L-13 -29 M4 -32 L13 -33 M4 -30.5 L13 -29" stroke="#5a3a26" stroke-width=".8"/>
  <ellipse cx="-11" cy="-15" rx="4" ry="5" fill="#7a4d31"/><ellipse cx="11" cy="-15" rx="4" ry="5" fill="#7a4d31"/>`;
}

// haut : sommet de la tête par rapport aux pieds ; tete : centre de la tête.
export const PERSONNAGES = {
  herisson: { dessin: herisson, haut: -54, tete: -26, nom: 'Le hérisson' },
  grenouille: { dessin: grenouille, haut: -42, tete: -26, nom: 'La grenouille' },
  loutre: { dessin: loutre, haut: -50, tete: -36, nom: 'La loutre' },
};

export const MACHAON = { nom: 'Le machaon', haut: -50, tete: -31 };

/** Le machaon, ailes ouvertes, vu de face. Origine sous le corps. */
export function machaon() {
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
  return `
  <g class="e5-ailes-machaon">${aile}<g transform="scale(-1 1)">${aile}</g></g>
  <ellipse cx="0" cy="-18" rx="2.8" ry="12" fill="${ENCRE}"/>
  <path d="M-1.3 -26 V-10 M1.3 -26 V-10" stroke="#f5d33f" stroke-width=".7"/>
  <circle cx="0" cy="-31" r="3.3" fill="${ENCRE}"/>
  <circle cx="-1.2" cy="-31.8" r=".8" fill="#fff"/><circle cx="1.2" cy="-31.8" r=".8" fill="#fff"/>
  <path d="M-1 -33.5 Q-4 -40 -7.5 -45 M1 -33.5 Q4 -40 7.5 -45" stroke="${ENCRE}" stroke-width="1" fill="none"/>
  <circle cx="-7.5" cy="-45" r="1.5" fill="${ENCRE}"/><circle cx="7.5" cy="-45" r="1.5" fill="${ENCRE}"/>`;
}

/** Pipistrelle, la chauve-souris serveuse. Origine au centre du corps. */
export function pipistrelle({ plat = '' } = {}) {
  return `
  <g class="e5-aile e5-aile-g"><path d="M-9 -6 C-18 -20 -33 -19 -38 -8 C-33 -8 -31 -3 -31 1 C-27 -3 -23 -1 -21 3 C-18 -1 -13 -1 -10 3 Z" fill="#6d3fd8"/></g>
  <g class="e5-aile e5-aile-d"><path d="M9 -6 C18 -20 33 -19 38 -8 C33 -8 31 -3 31 1 C27 -3 23 -1 21 3 C18 -1 13 -1 10 3 Z" fill="#6d3fd8"/></g>
  <path d="M-11 -10 L-13 -25 L-3 -15 Z M11 -10 L13 -25 L3 -15 Z" fill="#8f5cf7"/>
  <path d="M-9.5 -13 L-11 -21 L-5.5 -15.5 Z M9.5 -13 L11 -21 L5.5 -15.5 Z" fill="#ff9cc8"/>
  <ellipse cx="0" cy="1" rx="14" ry="16" fill="#8f5cf7"/>
  <path d="M-9 6 Q-9 4 -7 4 H7 Q9 4 9 6 V13 Q9 17 5 17 H-5 Q-9 17 -9 13 Z" fill="#fff"/>
  <path d="M0 13.5 C-3 11 -3.6 9 -2 8.4 C-1 8 -0.3 8.6 0 9.1 C0.3 8.6 1 8 2 8.4 C3.6 9 3 11 0 13.5 Z" fill="#ff7ab8"/>
  <circle cx="-5" cy="-5" r="4.4" fill="#fff"/><circle cx="5" cy="-5" r="4.4" fill="#fff"/>
  <circle cx="-4.4" cy="-4.2" r="2.4" fill="${ENCRE}"/><circle cx="5.6" cy="-4.2" r="2.4" fill="${ENCRE}"/>
  <circle cx="-3.6" cy="-5.2" r=".8" fill="#fff"/><circle cx="6.4" cy="-5.2" r=".8" fill="#fff"/>
  ${joues(9.5, 0.5)}
  <path d="M-2.6 1.4 Q0 3.6 2.6 1.4" stroke="${ENCRE}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M-1.8 2.2 l.6 1.6 l.6 -1.4 Z M1.8 2.2 l-.6 1.6 l-.6 -1.4 Z" fill="#fff"/>
  <g class="e5-pipi-plat" transform="translate(0 27)">${plat}</g>`;
}

/** Le visage d'un client, pour le livre de recettes : { boite, dessin }. */
export function visage(sorte) {
  if (sorte === 'machaon') return { boite: '-42 -54 84 66', dessin: machaon() };
  const p = PERSONNAGES[sorte];
  return { boite: `-25 ${p.tete - 25} 50 50`, dessin: p.dessin() };
}

/* ================================================================ Icônes */

export function iconeLivre() {
  return `
  <rect x="-9" y="-10.5" width="18" height="21" rx="2.5" fill="#8f5cf7" stroke="${ENCRE}" stroke-width="1.6"/>
  <path d="M-9 6.5 H9" stroke="#fffaf2" stroke-width="2.4"/>
  <path d="M-5.6 -10.5 V5.5" stroke="#6a3fd0" stroke-width="1.4"/>
  <path d="M1.5 -0.6 C-1.6 -3 -2.2 -5 -0.6 -5.6 C0.4 -6 1.1 -5.4 1.5 -4.9 C1.9 -5.4 2.6 -6 3.6 -5.6 C5.2 -5 4.6 -3 1.5 -0.6 Z" fill="#fffaf2"/>`;
}

export function iconeFrigo() {
  return `
  <rect x="-8" y="-11" width="16" height="22" rx="3" fill="#fdfaf1" stroke="${ENCRE}" stroke-width="1.6"/>
  <path d="M-8 -3 H8" stroke="${ENCRE}" stroke-width="1.4"/>
  <path d="M4.4 -8.4 V-5.4 M4.4 0 V5.6" stroke="#8f5cf7" stroke-width="2" stroke-linecap="round"/>`;
}

export function iconeCasserole() {
  return `
  <path d="M-15 -6 H15 V8 Q15 14 9 14 H-9 Q-15 14 -15 8 Z" fill="#cfcadd" stroke="${ENCRE}" stroke-width="1.6"/>
  <rect x="-17" y="-9" width="34" height="5" rx="2.5" fill="#b9b3cb" stroke="${ENCRE}" stroke-width="1.6"/>
  <path d="M-17 -2 H-22 M17 -2 H22" stroke="${ENCRE}" stroke-width="3" stroke-linecap="round"/>
  <path d="M-10 0 V8" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>`;
}

/* ================================================================ Bulles */

/** Bulle de commande au-dessus d'un client. Origine à la pointe de la bulle. */
export function bulleCommande(icone) {
  return `<g transform="translate(0 -22)">
    <path d="M-20 -18 H20 Q24 -18 24 -14 V10 Q24 14 20 14 H6 L0 22 L-6 14 H-20 Q-24 14 -24 10 V-14 Q-24 -18 -20 -18 Z" fill="#fff" stroke="${ENCRE}" stroke-width="2"/>
    <g transform="translate(0 -2) scale(.9)">${icone}</g>
  </g>`;
}

const echapper = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

/** Bulle de dégoût (« Beurk ! »). Origine à la pointe de la bulle. */
export function bulleReaction(texte) {
  const d = Math.round(10 + texte.length * 3.9);
  return `<g transform="translate(0 -20)">
    <path d="M${-d + 4} -15 H${d - 4} Q${d} -15 ${d} -11 V7 Q${d} 11 ${d - 4} 11 H6 L0 19 L-6 11 H${-d + 4} Q${-d} 11 ${-d} 7 V-11 Q${-d} -15 ${-d + 4} -15 Z" fill="#e8f6e9" stroke="${ENCRE}" stroke-width="2"/>
    <text y="2.8" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2f6b2a">${echapper(texte)}</text>
  </g>`;
}

/** Vagues de nausée et goutte de sueur, autour d'une tête centrée en (0, 0). */
export function degout() {
  return `
  <g stroke="#4f9a5a" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M-29 -5 q3 -3 6 0 q3 3 6 0"/><path d="M-29 3 q3 -3 6 0 q3 3 6 0"/>
    <path d="M17 -5 q3 -3 6 0 q3 3 6 0"/><path d="M17 3 q3 -3 6 0 q3 3 6 0"/>
  </g>
  <path d="M20 -17 q3.5 5.5 0 8 q-3.5 -2.5 0 -8 Z" fill="#8fc9ff" stroke="#5a9be0" stroke-width=".8"/>`;
}

/** Bulle du fourneau : consignes, jauge et minuteur. */
export function bulleFourneau() {
  return `<g class="e5-pop">
    <path d="M-92 -24 H92 Q98 -24 98 -18 V16 Q98 22 92 22 H-4 L-12 32 L-20 22 H-92 Q-98 22 -98 16 V-18 Q-98 -24 -92 -24 Z" fill="#fff" stroke="${ENCRE}" stroke-width="2"/>
    <text class="e5-bf-titre" x="0" y="-5" text-anchor="middle" font-size="12.5" font-weight="600"></text>
    <text class="e5-bf-sous" x="0" y="9" text-anchor="middle" font-size="9.5" fill="#6b5a88"></text>
    <g class="e5-bf-jauge">
      <rect x="-80" y="13" width="160" height="4" rx="2" fill="#efe6ff"/>
      <rect class="e5-bf-barre" x="-80" y="13" width="160" height="4" rx="2" fill="#8f5cf7"/>
    </g>
    <g class="e5-bf-minuteur" style="display:none">
      <circle cx="-72" cy="0" r="11" fill="none" stroke="#efe6ff" stroke-width="4"/>
      <circle class="e5-bf-arc" cx="-72" cy="0" r="11" fill="none" stroke="#8f5cf7" stroke-width="4" stroke-linecap="round" stroke-dasharray="69.1" stroke-dashoffset="69.1" transform="rotate(-90 -72 0)"/>
      <path d="M-72 -5.5 V0 L-68 2.4" stroke="#4a1fa8" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <g transform="translate(62 41)">
      <g class="e5-bf-vitesse" data-e5="vitesse" role="button" tabindex="0" aria-pressed="false" style="display:none">
        <rect x="-42" y="-20" width="84" height="42" fill="transparent"/>
        <rect x="-34" y="-11" width="68" height="27" rx="13.5" fill="${ENCRE}"/>
        <g class="e5-vitesse-corps">
          <rect class="e5-vitesse-fond" x="-34" y="-14" width="68" height="27" rx="13.5" fill="#ffd23f" stroke="${ENCRE}" stroke-width="2"/>
          <path class="e5-vitesse-texte" d="M-24 -6.5 L-16 -0.5 L-24 5.5 Z M-15 -6.5 L-7 -0.5 L-15 5.5 Z" fill="${ENCRE}"/>
          <text class="e5-vitesse-texte" x="11" y="4.4" text-anchor="middle" font-size="13.5" font-weight="700" fill="${ENCRE}">60x</text>
        </g>
      </g>
    </g>
  </g>`;
}

/* ===================================================== Gâteau d'anniversaire */

// Le gâteau de la fin, en grand : rhubarbe et crème de marron, son prénom
// dessus, et des bougies. age : bougies en chiffres (24 → « 2 » et « 4 ») ;
// sans âge, cinq bougies classiques. Origine au pied du présentoir.
// Chaque bougie : <g class="e5-bougie" data-i> avec une flamme cachée
// (.e5-flamme-bougie) que le jeu allume. bougiesGateau() donne leur position.

const GF = { R: 78, Y0: -10, H: 70 };   // rayon, bas et hauteur du gâteau

export function bougiesGateau(age) {
  const yHaut = GF.Y0 - GF.H;
  if (age) {
    const chiffres = String(age).split('');
    const pas = 50;
    return chiffres.map((c, i) => ({ chiffre: +c, x: (i - (chiffres.length - 1) / 2) * pas, y: yHaut - 12 }));
  }
  return [210, 240, 270, 300, 330].map((a) => {
    const t = (a * Math.PI) / 180;
    return { x: 52 * Math.cos(t), y: yHaut + 11 * Math.sin(t) };
  }).sort((p, q) => p.y - q.y);
}

function flammeBougie(x, y) {
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="e5-flamme-bougie" style="display:none">
    <circle cy="-9" r="14" fill="#ffd27a" opacity=".4"/>
    <path d="M0 0 C-6 -3 -6 -10 0 -19 C6 -10 6 -3 0 0 Z" fill="#ffad2e"/>
    <path d="M0 -2 C-2.8 -3.6 -2.8 -7.6 0 -12 C2.8 -7.6 2.8 -3.6 0 -2 Z" fill="#fff4c2"/>
  </g></g>`;
}

export function gateauFete(age, prenom) {
  const { R, Y0, H } = GF;
  const yt = Y0 - H;
  const bande = (y, h, c) => `<path d="M${-R} ${y} A${R} 20 0 0 0 ${R} ${y} V${y + h} A${R} 20 0 0 1 ${-R} ${y + h} Z" fill="${c}"/>`;
  const surArc = (t, dy = 0) => [R * Math.cos(t), yt + 20 * Math.sin(t) + dy];
  const coulures = [0.12, 0.24, 0.36, 0.5, 0.62, 0.76, 0.88].map((u, i) => {
    const [x, y] = surArc(Math.PI * u);
    const l = [12, 20, 9, 16, 22, 11, 17][i];
    return `<path d="M${(x - 5.5).toFixed(1)} ${(y - 2).toFixed(1)} V${(y + l - 5).toFixed(1)} Q${(x - 5.5).toFixed(1)} ${(y + l).toFixed(1)} ${x.toFixed(1)} ${(y + l).toFixed(1)} Q${(x + 5.5).toFixed(1)} ${(y + l).toFixed(1)} ${(x + 5.5).toFixed(1)} ${(y + l - 5).toFixed(1)} V${(y - 2).toFixed(1)} Z" fill="#7b4a2d"/>`;
  }).join('');
  const chantilly = [0.06, 0.19, 0.31, 0.44, 0.56, 0.69, 0.81, 0.94].map((u, i) => {
    const [x, y] = surArc(Math.PI * u, -2);
    const rhubarbe = i % 2 ? '' : `<rect x="${(x - 2.5).toFixed(1)}" y="${(y - 11).toFixed(1)}" width="5" height="9" rx="2.4" fill="#e8456f" transform="rotate(${-20 + i * 6} ${x.toFixed(1)} ${(y - 6).toFixed(1)})"/>`;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.6" fill="#fffaf2"/><circle cx="${(x - 1.6).toFixed(1)}" cy="${(y - 1.8).toFixed(1)}" r="2" fill="#fff"/>${rhubarbe}`;
  }).join('');
  const bougies = bougiesGateau(age).map((b, i) => {
    if (b.chiffre !== undefined) {
      const l = 30;
      const h = 46;
      const d = cheminChiffre(b.chiffre, b.x - l / 2, b.y - h, l, h);
      const [sx, sy] = [b.x + (b.chiffre === 4 ? 0.16 * l : 0), b.y - h];
      return `<g class="e5-bougie" data-i="${i}">
        <rect x="${b.x - 26}" y="${b.y - h - 34}" width="52" height="${h + 40}" fill="transparent"/>
        <ellipse cx="${b.x}" cy="${b.y + 1}" rx="17" ry="4" fill="#5e3a22" opacity=".45"/>
        <path d="${d}" fill="none" stroke="${ENCRE}" stroke-width="12.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${d}" fill="none" stroke="#b48cff" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${d}" fill="none" stroke="#fffaf2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 6"/>
        <path d="M${sx.toFixed(1)} ${(sy - 5).toFixed(1)} v-6" stroke="${ENCRE}" stroke-width="1.6" stroke-linecap="round"/>
        ${flammeBougie(sx, sy - 11)}
      </g>`;
    }
    return `<g class="e5-bougie" data-i="${i}">
      <rect x="${(b.x - 11).toFixed(1)}" y="${(b.y - 66).toFixed(1)}" width="22" height="70" fill="transparent"/>
      <rect x="${(b.x - 3.5).toFixed(1)}" y="${(b.y - 34).toFixed(1)}" width="7" height="34" rx="2" fill="#c9a8ff" stroke="${ENCRE}" stroke-width="1.4"/>
      <path d="M${(b.x - 3.5).toFixed(1)} ${(b.y - 24).toFixed(1)} l7 -5 M${(b.x - 3.5).toFixed(1)} ${(b.y - 14).toFixed(1)} l7 -5 M${(b.x - 3.5).toFixed(1)} ${(b.y - 4).toFixed(1)} l7 -5" stroke="#fffaf2" stroke-width="2"/>
      <path d="M${b.x.toFixed(1)} ${(b.y - 34).toFixed(1)} v-5" stroke="${ENCRE}" stroke-width="1.4"/>
      ${flammeBougie(b.x, b.y - 39)}
    </g>`;
  }).join('');
  const papillon = `<g transform="translate(46 ${Y0 - 30}) rotate(-12)">
    <path d="M0 0 C3 -9 12 -11 13 -4 C13 1 6 2 0 0 Z M0 0 C-3 -9 -12 -11 -13 -4 C-13 1 -6 2 0 0 Z" fill="#9a63ff" stroke="#6a3fd0" stroke-width="1"/>
    <path d="M0 0 C5 1 9 5 6 8 C3 10 1 5 0 0 Z M0 0 C-5 1 -9 5 -6 8 C-3 10 -1 5 0 0 Z" fill="#c9a8ff" stroke="#6a3fd0" stroke-width="1"/>
    <ellipse cx="0" cy="1" rx="1.3" ry="5" fill="#4a1fa8"/>
  </g>`;
  return `
  <ellipse cx="0" cy="26" rx="58" ry="10" fill="#1a1026" opacity=".2"/>
  <ellipse cx="0" cy="22" rx="42" ry="8" fill="#b9a6e6"/>
  <path d="M-15 2 L-26 21 H26 L15 2 Z" fill="#d8ccef"/>
  <path d="M5 2 L13 21 H26 L15 2 Z" fill="#c4b4ea"/>
  <ellipse cx="0" cy="0" rx="100" ry="23" fill="#c9b8ef"/>
  <ellipse cx="0" cy="-3" rx="96" ry="21" fill="#f7f2ff"/>
  <path d="M${-R} ${yt} V${Y0} A${R} 20 0 0 0 ${R} ${Y0} V${yt} Z" fill="#f2cf93"/>
  ${bande(yt + 26, 7, '#7b4a2d')}
  ${bande(yt + 44, 6, '#f07aa0')}
  <path d="M${R - 18} ${yt + 14} V${Y0 + 12} A${R} 20 0 0 0 ${R} ${Y0} V${yt} Z" fill="#d9a865" opacity=".55"/>
  <path d="M${-R + 9} ${yt + 18} V${Y0 + 2}" stroke="#fff" stroke-opacity=".4" stroke-width="6" stroke-linecap="round"/>
  ${papillon}
  ${coulures}
  <ellipse cx="0" cy="${yt}" rx="${R}" ry="20" fill="#8a5a3b"/>
  <ellipse cx="-22" cy="${yt - 6}" rx="28" ry="5.5" fill="#a87650"/>
  ${chantilly}
  <text transform="translate(0 ${yt + 17}) scale(1 .55)" text-anchor="middle" font-size="27" font-weight="700" fill="#fffaf2" stroke="#5e3a22" stroke-width="1" paint-order="stroke">${prenom}</text>
  ${bougies}`;
}

/* ================================================================== Café */

export function defs() {
  return `<defs>
    <pattern id="e5-papier" width="26" height="26" patternUnits="userSpaceOnUse">
      <rect width="26" height="26" fill="#ecdffd"/><rect width="13" height="26" fill="#e6d7fc"/>
      <circle cx="6.5" cy="13" r="1.3" fill="#d8c5fa"/>
    </pattern>
    <pattern id="e5-parquet" width="72" height="22" patternUnits="userSpaceOnUse">
      <rect width="72" height="22" fill="#c88d57"/><rect y="11" width="72" height="11" fill="#c08450"/>
      <path d="M0 .5 H72 M0 11.5 H72 M26 0 V11 M62 11 V22" stroke="#9a6438" stroke-width="1"/>
    </pattern>
    <pattern id="e5-faience" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill="#6c4bb5"/><path d="M0 .5 H12 M.5 0 V12" stroke="#8466c9" stroke-width="1"/>
    </pattern>
    <pattern id="e5-dalles" width="28" height="14" patternUnits="userSpaceOnUse" x="4" y="2">
      <rect width="28" height="14" fill="#eadfca"/>
      <path d="M14 1 L26 7 L14 13 L2 7 Z" fill="#e1d3b8"/>
      <path d="M0 7 L14 0 L28 7 L14 14 Z" fill="none" stroke="#d0bf9f" stroke-width="1"/>
      <path d="M10 5.4 L13 4" stroke="#f4ecdc" stroke-width="1" stroke-linecap="round"/>
    </pattern>
    <pattern id="e5-herbe" width="44" height="26" patternUnits="userSpaceOnUse">
      <rect width="44" height="26" fill="#a6d78d"/>
      <path d="M6 9 l2 -4 l2 4 M28 21 l2 -4 l2 4 M36 6 l1.6 -3 l1.6 3" stroke="#8bc574" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    </pattern>
    <linearGradient id="e5-ombre-sol" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1745" stop-opacity=".3"/><stop offset="1" stop-color="#2a1745" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="e5-nuit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b2550"/><stop offset="1" stop-color="#34497f"/>
    </linearGradient>
    <clipPath id="e5-vitre"><rect x="274" y="52" width="52" height="86" rx="3"/></clipPath>
    <radialGradient id="e5-lueur-fete">
      <stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/>
      <stop offset=".55" stop-color="#ffb35c" stop-opacity=".18"/>
      <stop offset="1" stop-color="#ffb35c" stop-opacity="0"/>
    </radialGradient>
  </defs>`;
}

function plante(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="-11" cy="-44" rx="7" ry="17" transform="rotate(-32 -11 -44)" fill="#4f9a5a"/>
    <ellipse cx="11" cy="-46" rx="7" ry="18" transform="rotate(30 11 -46)" fill="#5bb36a"/>
    <ellipse cx="0" cy="-52" rx="7" ry="19" fill="#6cc27a"/>
    <ellipse cx="-17" cy="-30" rx="6" ry="13" transform="rotate(-62 -17 -30)" fill="#5bb36a"/>
    <ellipse cx="17" cy="-31" rx="6" ry="13" transform="rotate(60 17 -31)" fill="#4f9a5a"/>
    <path d="M-14 -22 L14 -22 L11 0 L-11 0 Z" fill="#c9774a"/>
    <rect x="-16" y="-26" width="32" height="6" rx="2" fill="#b4643a"/>
  </g>`;
}

// Un portrait recadré (clin d'œil) dans une fenêtre l × h.
function portrait(dessin, x, y, l, h, boite, fond = '#e9dcff') {
  return `<svg x="${x}" y="${y}" width="${l}" height="${h}" viewBox="${boite}" preserveAspectRatio="xMidYMid slice"><rect x="-200" y="-200" width="400" height="400" fill="${fond}"/>${dessin}</svg>`;
}

/* ===================================================== Le café, en isométrique */

// La salle vue de trois quarts comme dans le jeu d'origine : murs bleus,
// parquet, coin cuisine carrelé avec la rangée de fourneaux le long du mur
// de gauche, le comptoir bleu et blanc où attendent les plats, et les tables
// blanches côté salle. Repère : i le long du mur de droite, j le long du mur
// de gauche, z vers le haut ; (0, 0) est le coin du fond.

const CA = { x: 200, y: 190, a: 15, b: 7.5, n: 12, h: 112 };
const qx = (i, j) => CA.x + (i - j) * CA.a;
const qy = (i, j, z = 0) => CA.y + (i + j) * CA.b - z;
const Q = (i, j, z = 0) => `${qx(i, j).toFixed(1)} ${qy(i, j, z).toFixed(1)}`;
const qf = (pts, fill, extra = '') => `<path d="M${pts.map((p) => Q(...p)).join(' L')} Z" fill="${fill}"${extra}/>`;
const pt = (i, j, z = 0) => ({ x: +qx(i, j).toFixed(1), y: +qy(i, j, z).toFixed(1) });
// Plan du mur de gauche (i constant) ou de droite (j constant) : on dessine à
// plat (u vers la droite, v vers le bas, en pixels) puis on incline.
const murGauche = (i = 0) => `matrix(1 -.5 0 1 ${qx(i, 0)} ${qy(i, 0)})`;   // u = -15 j, v = -z
const murDroit = (j = 0) => `matrix(1 .5 0 1 ${qx(0, j)} ${qy(0, j)})`;     // u = 15 i, v = -z

function qboite(i0, j0, I, J, z0, H, c) {
  const z1 = z0 + H;
  return qf([[i0, j0 + J, z0], [i0 + I, j0 + J, z0], [i0 + I, j0 + J, z1], [i0, j0 + J, z1]], c.devant)
    + qf([[i0 + I, j0, z0], [i0 + I, j0 + J, z0], [i0 + I, j0 + J, z1], [i0 + I, j0, z1]], c.cote)
    + qf([[i0, j0, z1], [i0 + I, j0, z1], [i0 + I, j0 + J, z1], [i0, j0 + J, z1]], c.dessus);
}
const qpied = (i, j, h, couleur, l = 2.4) => `<path d="M${Q(i, j, 0)} L${Q(i, j, h)}" stroke="${couleur}" stroke-width="${l}" stroke-linecap="round"/>`;

const TABLES_J = [3.4, 7.0, 10.6];
const TABLE_I = 8.6;
const SIEGE_I = 7.2;
const HAUT_TABLE = 16;

// Le cadre de la vue du café : la salle entière, toujours visible.
export const CADRE_CAFE = { x: 4, y: 64, l: 392, h: 352 };

// Les quatre fourneaux le long du mur de gauche (j de départ de chacun) :
// les trois premiers servent, le dernier est pour le décor.
const FEUX_J = [2.2, 3.9, 5.6, 7.3];
export const NB_FEUX = 3;
function lieuxFeu(j0) {
  const j = j0 + 0.8;
  const c = pt(0.95, j, 15);
  return {
    casserole: c,                                        // la casserole posée dessus
    four: pt(1.9, j, 8),                                 // la porte du four
    halo: { x: c.x, y: c.y - 4, r: 24 },                 // le cercle « touche ici »
    bulle: { x: +(c.x - 4).toFixed(1), y: +(c.y - 81).toFixed(1) },   // la bulle des gestes
  };
}

export const LIEUX = {
  echelle: 0.72,                                   // taille des personnages dans la salle
  tables: TABLES_J.map((j) => pt(TABLE_I, j)),     // centre de chaque table, au sol
  dessus: HAUT_TABLE,                              // hauteur du plateau des tables
  sieges: TABLES_J.map((j) => pt(SIEGE_I, j)),     // pieds d'un client assis (cachés par la table)
  chemins: TABLES_J.map((j) => [pt(0.6, 11.4), pt(6, 11.4), pt(6, j), pt(SIEGE_I, j)]),
  porte: pt(0.5, 11.4),
  perchoir: pt(SIEGE_I - 0.3, TABLES_J[1], 26),    // le machaon se pose sur le dossier
  pipi: pt(5.4, 1.6, 46),                          // Pipistrelle au repos
  comptoir: [pt(4.2, 6, 14), pt(4.2, 4, 14), pt(4.2, 8, 14)],   // places des plats prêts
  feux: FEUX_J.slice(0, NB_FEUX).map(lieuxFeu),     // les fourneaux où l'on cuisine
  frigo: pt(1.6, 1.05, 26),
};

function rue() {
  const ligne = (a, b) => `<path d="M${Q(...a)} L${Q(...b)}" stroke="#c3beb5" stroke-width="2.4" stroke-linecap="round"/>`;
  const tirets = [-9, -6, -3, 0, 3, 6, 9, 12, 15, 18].map((i) => `<path d="M${Q(i, -6.5)} L${Q(i + 1.4, -6.5)}" stroke="#f4f2ee" stroke-width="3"/>`).join('')
    + [-9, -6, -3, 0, 3, 6, 9, 12, 15, 18].map((j) => `<path d="M${Q(-6.5, j)} L${Q(-6.5, j + 1.4)}" stroke="#f4f2ee" stroke-width="3"/>`).join('');
  return `
  <rect x="-1400" y="-1400" width="3200" height="3400" fill="#c9c5bd"/>
  ${qf([[-3.2, -3.2], [40, -3.2], [40, 40], [-3.2, 40]], '#dcd8d0')}
  ${tirets}
  ${qf([[14.5, -3.2], [40, -3.2], [40, 40], [14.5, 40]], '#bfe07e')}
  ${qf([[-3.2, 14.5], [14.5, 14.5], [14.5, 40], [-3.2, 40]], '#bfe07e')}
  ${ligne([14.5, -3.2], [14.5, 14.5])}${ligne([-3.2, 14.5], [14.5, 14.5])}
  ${ligne([-3.2, -3.2], [40, -3.2])}${ligne([-3.2, -3.2], [-3.2, 40])}`;
}

function sol() {
  const n = CA.n;
  const lattes = Array.from({ length: 20 }, (_, k) => {
    const j = 0.6 * (k + 1);
    return `<path d="M${Q(5.4, j)} L${Q(n, j)}" stroke="#c38a54" stroke-width=".9"/>`;
  }).join('') + Array.from({ length: 20 }, (_, k) => {
    const j = 0.6 * k + 0.05;
    const i = 5.4 + ((k * 2.3) % 6);
    return `<path d="M${Q(i, j)} L${Q(i, j + 0.6)}" stroke="#c38a54" stroke-width=".8"/>`;
  }).join('');
  const carreaux = Array.from({ length: 6 }, (_, k) => `<path d="M${Q(0.9 * (k + 1), 0)} L${Q(0.9 * (k + 1), 9.9)}" stroke="#868691" stroke-width=".8"/>`).join('')
    + Array.from({ length: 11 }, (_, k) => `<path d="M${Q(0, 0.9 * (k + 1))} L${Q(5.4, 0.9 * (k + 1))}" stroke="#868691" stroke-width=".8"/>`).join('');
  return `
  ${qf([[0, 0], [n, 0], [n, n], [0, n]], '#d7a26c')}
  ${lattes}
  ${qf([[0, 0], [5.4, 0], [5.4, 9.9], [0, 9.9]], '#a2a2ad')}
  ${carreaux}
  ${qf([[0, 0], [n, 0], [n, 0.5], [0, 0.5]], '#1a1026', ' opacity=".08"')}
  ${qf([[0, 0], [0.5, 0], [0.5, n], [0, n]], '#1a1026', ' opacity=".06"')}`;
}

function murs() {
  const { n, h } = CA;
  return `
  ${qf([[0, n, 0], [0, 0, 0], [0, 0, h], [0, n, h]], '#86b9da')}
  ${qf([[0, 0, 0], [n, 0, 0], [n, 0, h], [0, 0, h]], '#72a7cb')}
  ${qf([[0, n, 0], [0, 0, 0], [0, 0, 6], [0, n, 6]], '#eef3f8')}
  ${qf([[0, 0, 0], [n, 0, 0], [n, 0, 6], [0, 0, 6]], '#e2eaf1')}
  ${qf([[-0.5, n, h], [-0.5, -0.5, h], [0, 0, h], [0, n, h]], '#eaf0f5')}
  ${qf([[-0.5, -0.5, h], [n, -0.5, h], [n, 0, h], [0, 0, h]], '#dfe7ee')}
  ${qf([[-0.5, n, 0], [0, n, 0], [0, n, h], [-0.5, n, h]], '#b5c6d2')}
  ${qf([[n, -0.5, 0], [n, 0, 0], [n, 0, h], [n, -0.5, h]], '#a6bccb')}`;
}

// Le mur de droite : l'ardoise du soir et deux fenêtres sous la pluie.
function murDroitDecor() {
  const gouttes = (u0) => Array.from({ length: 9 }, (_, k) => {
    const x = u0 + 3 + ((k * 17) % 22);
    const y = -88 + ((k * 23) % 40);
    const duree = (0.55 + ((k * 7) % 5) * 0.08).toFixed(2);
    return `<line x1="${x}" y1="${y}" x2="${x - 2}" y2="${y + 8}" style="animation-duration:${duree}s;animation-delay:-${((k * 13) % 10) / 10}s"/>`;
  }).join('');
  const fenetre = (u0, id) => `
    <clipPath id="${id}"><rect x="${u0}" y="-92" width="27" height="50"/></clipPath>
    <rect x="${u0 - 3}" y="-95" width="33" height="56" rx="2" fill="#fbfdff"/>
    <rect x="${u0}" y="-92" width="27" height="50" fill="url(#e5-nuit)"/>
    <g clip-path="url(#${id})"><g class="e5-pluie" stroke="#a9bdf0" stroke-width="1.1" stroke-linecap="round" opacity=".85">${gouttes(u0)}</g></g>
    <path d="M${u0 + 13.5} -92 V-42 M${u0} -67 H${u0 + 27}" stroke="#fbfdff" stroke-width="2.4"/>
    <rect x="${u0 - 5}" y="-40" width="37" height="4" rx="1.5" fill="#e9eef3"/>`;
  return `
  <g transform="${murDroit()}">
    <rect x="22" y="-108" width="50" height="62" rx="3" fill="#8a5a3b"/>
    <rect x="26" y="-104" width="42" height="54" rx="2" fill="#2f2c38"/>
    <text x="47" y="-92" text-anchor="middle" font-size="8.5" font-weight="600" fill="#f3f0ff">Ce soir</text>
    <path d="M31 -88 H63" stroke="#f3f0ff" stroke-opacity=".4" stroke-width=".8" stroke-dasharray="2 2"/>
    <g transform="translate(35 -77) scale(.42)">${tasse({ vapeur: false })}</g>
    <g transform="translate(47 -77) scale(.42)">${tarte()}</g>
    <g transform="translate(59 -77) scale(.42)">${crepes()}</g>
    <text x="47" y="-58" text-anchor="middle" font-size="6" fill="#f3f0ff" fill-opacity=".8">+ une surprise</text>
    ${fenetre(88, 'e5-vitre-1')}
    ${fenetre(134, 'e5-vitre-2')}
  </g>`;
}

// Le mur de gauche : ustensiles, deux photos (clins d'œil) et la porte.
function murGaucheDecor() {
  return `
  <g transform="${murGauche()}">
    <rect x="-64" y="-78" width="30" height="2.4" rx="1" fill="#8b8b98"/>
    <path d="M-60 -76 V-62 M-60 -62 a3 3 0 1 0 0.1 0" stroke="#9aa3ad" stroke-width="1.4" fill="none"/>
    <path d="M-51 -76 V-66" stroke="#9aa3ad" stroke-width="1.4"/><ellipse cx="-51" cy="-62" rx="2.6" ry="4.4" fill="none" stroke="#9aa3ad" stroke-width="1.1"/>
    <path d="M-42 -76 V-72" stroke="#9aa3ad" stroke-width="1.2"/><path d="M-46 -72 h8 v9 q0 4 -4 4 q-4 0 -4 -4 Z" fill="#f2a0c0"/>
    <rect x="-112" y="-98" width="38" height="30" rx="2" fill="#8a5a3b"/>
    ${portrait(duoSpeleo(), -109, -95, 32, 24, '-30 -54 60 45', '#2a2140')}
    <g transform="rotate(-4 -130 -84)">
      <rect x="-142" y="-100" width="24" height="29" fill="#fffaf2" stroke="#d9c8a8" stroke-width=".8"/>
      ${portrait(cyrielChapeau(), -140, -98, 20, 21, '-15 -52 30 31', '#cfe7f5')}
    </g>
    <rect x="-180" y="-63" width="30" height="63" fill="#fbfdff"/>
    <rect x="-177" y="-60" width="24" height="60" fill="#1d1530"/>
    <g class="e5-porte" data-e5="porte">
      <rect x="-177" y="-60" width="24" height="60" fill="#9a6438"/>
      <rect x="-174" y="-56" width="18" height="20" rx="1.5" fill="url(#e5-nuit)"/>
      <rect x="-174" y="-26" width="18" height="22" rx="1.5" fill="none" stroke="#86552e" stroke-width="1.2"/>
      <circle cx="-156.5" cy="-30" r="1.5" fill="#e3b04b"/>
      <g class="e5-pancarte">
        <rect x="-176" y="-35" width="22" height="8" rx="2" fill="#fffaf2" stroke="#e3b04b" stroke-width=".7"/>
        <text data-e5="pancarte" x="-165" y="-29.2" text-anchor="middle" font-size="5.4" font-weight="600" fill="#7a3cf0">Fermé</text>
      </g>
    </g>
  </g>`;
}

function frigoIso() {
  const I = 1.6;
  const j0 = 0.15;
  const J = 1.85;
  const H = 56;
  // Façade (plan i = 1.6) : à plat, u = -15 j, v = -z.
  const u0 = -15 * (j0 + J);
  const u1 = -15 * j0;
  return `
  <g data-e5="frigo">
    ${qf([[0, j0, 0], [I, j0, 0], [I, j0 + J, 0], [0, j0 + J, 0]], '#1a1026', ' opacity=".12"')}
    ${qboite(0, j0, I, J, 0, H, { devant: '#dcd8d2', cote: '#efebe6', dessus: '#fbfaf8' })}
    <g transform="${murGauche(I)}">
      <rect x="${u0}" y="${-H}" width="${u1 - u0}" height="${H}" fill="#fdfaf1"/>
      <path d="M${u0} -40 H${u1} M${u0} -24 H${u1}" stroke="#e3dccd" stroke-width="1.4"/>
      <g transform="translate(${u0 + 7} -45) scale(.3)">${lait()}</g>
      <g transform="translate(${u0 + 18} -45) scale(.28)">${oeufs()}</g>
      <g transform="translate(${u0 + 10} -29) scale(.28)">${marron()}</g>
      <g transform="translate(${u0 + 19} -13) scale(.28)">${pomme()}</g>
      <g class="e5-porte-frigo" data-e5="frigo-porte">
        <rect x="${u0}" y="${-H}" width="${u1 - u0}" height="${H}" rx="2" fill="#f7f5f1" stroke="#d6d0c6" stroke-width="1.2"/>
        <path d="M${u0} -36 H${u1}" stroke="#d6d0c6" stroke-width="1.2"/>
        <rect x="${u1 - 5}" y="-50" width="2.4" height="10" rx="1.2" fill="#b9b2a6"/>
        <rect x="${u1 - 5}" y="-31" width="2.4" height="16" rx="1.2" fill="#b9b2a6"/>
        <path d="M${u0 + 8} -47 c-2.4 -2 -2.8 -3.4 -1.6 -3.9 c.7 -.3 1.3 .1 1.6 .5 c.3 -.4 .9 -.8 1.6 -.5 c1.2 .5 .8 1.9 -1.6 3.9 Z" fill="#8f5cf7"/>
        <g transform="translate(${u0 + 10} -24) rotate(-6)">
          <rect x="-6.5" y="-7.5" width="13" height="15" fill="#fff" stroke="#e3dccd" stroke-width=".6"/>
          ${portrait(cyrielClin(), -5, -6, 10, 9, '-13 -49 26 23', '#ffe3ef')}
        </g>
      </g>
    </g>
  </g>`;
}

function fourneauxIso() {
  const blanc = { devant: '#d9dbe1', cote: '#f5f6f8', dessus: '#3b3b45' };
  return FEUX_J.map((j0, k) => {
    const J = 1.6;
    const u0 = -15 * (j0 + J);
    const u1 = -15 * j0;
    const actif = k < NB_FEUX;
    const brule = (i, j) => `<ellipse cx="${qx(i, j).toFixed(1)}" cy="${qy(i, j, 15).toFixed(1)}" rx="5.4" ry="2.7" fill="none" stroke="#5a5a66" stroke-width="1.4"/>`;
    const poele = (i, j, plein) => `<g transform="translate(${qx(i, j).toFixed(1)} ${qy(i, j, 15).toFixed(1)})">
      <ellipse cx="0" cy="-1" rx="6.6" ry="3.3" fill="#c9cdd6"/><ellipse cx="0" cy="-2.2" rx="5.6" ry="2.6" fill="${plein ? '#f2cf5a' : '#aeb3bd'}"/>
      <path d="M5 -1.6 L11 1.4" stroke="#7d8696" stroke-width="2" stroke-linecap="round"/></g>`;
    const corps = `
      ${qboite(0, j0, 1.9, J, 0, 15, blanc)}
      ${brule(0.55, j0 + 0.45)}${brule(1.3, j0 + 1.15)}
      ${actif ? '' : poele(0.55, j0 + 0.45, true) + poele(1.3, j0 + 1.15, true)}
      <g transform="${murGauche(1.9)}">
        <rect x="${u0 + 2.5}" y="-12" width="${u1 - u0 - 5}" height="9" rx="1.5" fill="#e7e9ee" stroke="#c4c8d1" stroke-width=".7"/>
        <rect ${actif ? 'data-e5="four-vitre"' : ''} x="${u0 + 5}" y="-10.5" width="${u1 - u0 - 10}" height="6" rx="1" fill="#3a3a46"/>
        <rect x="${u0 + 5}" y="-14" width="${u1 - u0 - 10}" height="1.4" rx=".7" fill="#9aa3ad"/>
        <circle cx="${u0 + 6}" cy="-1.8" r="1" fill="#9aa3ad"/><circle cx="${u1 - 6}" cy="-1.8" r="1" fill="#9aa3ad"/>
      </g>`;
    if (!actif) return corps;
    const c = lieuxFeu(j0).casserole;
    const flammes = [-6, -3, 0, 3, 6].map((dx, n) => `
        <path class="e5-flamme" d="M${(c.x + dx - 1.8).toFixed(1)} ${(c.y + 4).toFixed(1)} Q${(c.x + dx).toFixed(1)} ${(c.y - 3).toFixed(1)} ${(c.x + dx + 1.8).toFixed(1)} ${(c.y + 4).toFixed(1)} Z" fill="${n % 2 ? '#ffd36b' : '#ff8a2a'}" style="animation-delay:-${(n * 0.07).toFixed(2)}s"/>`).join('');
    // Le numéro du fourneau, comme une plaque au mur, au-dessus de la vapeur.
    const u = -15 * (j0 + 0.55);
    return `
    <g class="e5-fourneau" data-e5="fourneau-${k}" role="button" tabindex="0" aria-label="Fourneau ${k + 1}">
      <path d="M${Q(0, j0, 0)} L${Q(2.2, j0, 0)} L${Q(2.2, j0 + 1.7, 0)} L${Q(0, j0 + 1.7, 0)} L${Q(0, j0 + 1.7, 62)} L${Q(0, j0, 62)} Z" fill="transparent"/>
      <g transform="${murGauche(0)}">
        <circle cx="${u.toFixed(1)}" cy="-52" r="6.6" fill="#fff" stroke="#7a3cf0" stroke-width="1.6"/>
        <text x="${u.toFixed(1)}" y="-48.8" text-anchor="middle" font-size="9" font-weight="700" fill="#7a3cf0">${k + 1}</text>
      </g>
      ${corps}
      <g class="e5-flammes">${flammes}</g>
      <g class="e5-casserole" data-e5="casserole-${k}">
        <rect x="${c.x - 10}" y="${c.y - 12}" width="20" height="12" rx="3" fill="#cfcadd"/>
        <rect x="${c.x - 11.5}" y="${c.y - 13.5}" width="23" height="3" rx="1.5" fill="#b9b3cb"/>
        <path d="M${c.x + 11.5} ${c.y - 9} H${c.x + 18}" stroke="#9e98b3" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M${c.x - 6} ${c.y - 9} V${c.y - 4}" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>
      </g>
      <g class="e5-vapeur-four e5-vapeur" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M${c.x - 5} ${c.y - 16} q-3 -4 0 -8 q3 -4 0 -8"/>
        <path d="M${c.x + 1} ${c.y - 18} q-3 -4 0 -8 q3 -4 0 -8" style="animation-delay:-.6s"/>
        <path d="M${c.x + 7} ${c.y - 16} q-3 -4 0 -8 q3 -4 0 -8" style="animation-delay:-1.2s"/>
      </g>
    </g>`;
  }).join('');
}

/** Le plat prêt qui sautille au-dessus de son fourneau. */
export function signePret(plat) {
  return `<circle r="13" fill="#fff4c2" stroke="${ENCRE}" stroke-width="2"/>
    <g transform="translate(0 1.5) scale(.46)">${plat}</g>`;
}

function comptoirIso() {
  const bleu = { devant: '#5a8fc6', cote: '#4a7fb8', dessus: '#4a7fb8' };
  const plateau = { devant: '#e9eef4', cote: '#f7f9fc', dessus: '#ffffff' };
  return `
  ${qf([[3.4, 2.6], [5.0, 2.6], [5.0, 9.0], [3.4, 9.0]], '#1a1026', ' opacity=".12"')}
  ${qboite(3.6, 2.8, 1.2, 6, 0, 11, bleu)}
  <path d="M${Q(4.8, 2.8, 5.5)} L${Q(4.8, 8.8, 5.5)} M${Q(3.6, 8.8, 5.5)} L${Q(4.8, 8.8, 5.5)}" stroke="#d6e6f6" stroke-width="2.2"/>
  ${qboite(3.5, 2.7, 1.4, 6.2, 11, 3, plateau)}
  <g transform="translate(${qx(4.2, 3.3).toFixed(1)} ${qy(4.2, 3.3, 14).toFixed(1)})">
    <rect x="-7" y="-14" width="14" height="14" rx="4" fill="#ffffff" fill-opacity=".6" stroke="#c9b8ef" stroke-width="1.2"/>
    <rect x="-7.6" y="-16.6" width="15.2" height="3.4" rx="1.7" fill="#8f5cf7"/>
    <circle cx="-2.4" cy="-4.4" r="2.6" fill="#d9a441"/><circle cx="2.4" cy="-7.6" r="2.6" fill="#c98d3a"/>
  </g>`;
}

function chaiseIso(j) {
  const i0 = SIEGE_I - 0.35;
  const blanc = { devant: '#e4e7ec', cote: '#f6f7f9', dessus: '#ffffff' };
  return `
  ${qf([[i0, j - 0.4], [i0 + 0.8, j - 0.4], [i0 + 0.8, j + 0.4], [i0, j + 0.4]], '#1a1026', ' opacity=".1"')}
  ${qpied(i0 + 0.1, j - 0.3, 8, '#c9ccd3', 1.6)}${qpied(i0 + 0.7, j - 0.3, 8, '#c9ccd3', 1.6)}
  ${qpied(i0 + 0.1, j + 0.3, 8, '#c9ccd3', 1.6)}${qpied(i0 + 0.7, j + 0.3, 8, '#c9ccd3', 1.6)}
  ${qboite(i0, j - 0.35, 0.18, 0.7, 8, 18, blanc)}
  ${qboite(i0, j - 0.35, 0.8, 0.7, 8, 2, blanc)}`;
}

function plantePot(i, j, s = 1) {
  return `<g transform="translate(${qx(i, j).toFixed(1)} ${qy(i, j).toFixed(1)}) scale(${s})">
    <ellipse cx="0" cy="1" rx="11" ry="4.4" fill="#1a1026" opacity=".14"/>
    <path d="M-8 -14 L8 -14 L6 0 L-6 0 Z" fill="#c9774a"/><rect x="-9" y="-16" width="18" height="4" rx="1.6" fill="#b5653d"/>
    <ellipse cx="-7" cy="-26" rx="4.4" ry="10" transform="rotate(-28 -7 -26)" fill="#5bb36a"/>
    <ellipse cx="7" cy="-27" rx="4.4" ry="10" transform="rotate(26 7 -27)" fill="#4f9a5a"/>
    <ellipse cx="0" cy="-31" rx="4.6" ry="12" fill="#6cc27a"/>
  </g>`;
}

export function fondCafe() {
  return `
  ${rue()}
  ${sol()}
  ${murs()}
  ${murDroitDecor()}
  ${murGaucheDecor()}
  ${frigoIso()}
  ${fourneauxIso()}
  ${comptoirIso()}
  ${TABLES_J.map(chaiseIso).join('')}`;
}

export function tables() {
  const blanc = { devant: '#e3e6eb', cote: '#f3f5f8', dessus: '#ffffff' };
  return TABLES_J.map((j) => {
    const i0 = TABLE_I - 0.85;
    const j0 = j - 1.35;
    return `
  <g>
    ${qf([[i0 - 0.2, j0 - 0.2], [i0 + 1.9, j0 - 0.2], [i0 + 1.9, j0 + 2.9], [i0 - 0.2, j0 + 2.9]], '#1a1026', ' opacity=".12"')}
    ${qpied(i0 + 0.15, j0 + 0.15, 14, '#7b4a2d')}${qpied(i0 + 1.55, j0 + 0.15, 14, '#7b4a2d')}
    ${qpied(i0 + 0.15, j0 + 2.55, 14, '#7b4a2d')}${qpied(i0 + 1.55, j0 + 2.55, 14, '#7b4a2d')}
    ${qboite(i0, j0, 1.7, 2.7, 13.5, 2.5, blanc)}
  </g>`;
  }).join('');
}

export function decorAvant() {
  return `${plantePot(11.2, 0.9, 0.9)}${plantePot(1.2, 11.2, 0.85)}`;
}

/* ================================================================ Marché */

// La place du marché, en vue isométrique comme dans le jeu d'origine : une
// grande place pavée en losange, quatre étals à auvent rayé, une fontaine,
// des arbres et des joueurs qui flânent avec leur pseudo. Les étals de
// gauche sont dessinés en miroir pour se tourner vers la fontaine.

export const MARCHE = {
  centre: { x: 200, y: 300 },
  demi: { l: 480, h: 240 },          // demi-diagonales de la place
  etals: [
    { x: 100, y: 176, miroir: true },
    { x: 300, y: 176, miroir: false },
    { x: 100, y: 420, miroir: true },
    { x: 300, y: 420, miroir: false },
  ],
  versCafe: { x: 200, y: 550 },
};

const ISO_A = 14;
const ISO_B = 7;
const iso = (i, j, z = 0) => [(i - j) * ISO_A, (i + j) * ISO_B - z];
const P = (i, j, z = 0) => iso(i, j, z).map((n) => n.toFixed(1)).join(' ');
const face = (pts, fill, extra = '') => `<path d="M${pts.map((p) => P(...p)).join(' L')} Z" fill="${fill}"${extra}/>`;

// Pavé droit : base au point (i0, j0, z0), dimensions I × J × H.
function boite(i0, j0, I, J, z0, H, c) {
  const z1 = z0 + H;
  return face([[i0, j0 + J, z0], [i0 + I, j0 + J, z0], [i0 + I, j0 + J, z1], [i0, j0 + J, z1]], c.devant)
    + face([[i0 + I, j0, z0], [i0 + I, j0 + J, z0], [i0 + I, j0 + J, z1], [i0 + I, j0, z1]], c.cote)
    + face([[i0, j0, z1], [i0 + I, j0, z1], [i0 + I, j0 + J, z1], [i0, j0 + J, z1]], c.dessus);
}

function poteau(i, j, haut, couleur = '#8a5a3b', largeur = 3.4) {
  const [x, y0] = iso(i, j, 0);
  const [, y1] = iso(i, j, haut);
  return `<path d="M${x.toFixed(1)} ${y0.toFixed(1)} V${y1.toFixed(1)}" stroke="${couleur}" stroke-width="${largeur}" stroke-linecap="round"/>`;
}

// Étal : comptoir I × J, auvent rayé incliné de l'arrière (ZA) vers l'avant (ZB).
const E = { I: 4.4, J: 1.7, H: 15, I0: -0.4, I1: 4.8, J0: -0.7, J1: 2.0, ZA: 74, ZB: 62 };
const ETAL_DECALAGE = { x: 15, y: 10 };   // du centre visuel de l'étal à son origine

function etal(e, { x, y, miroir }) {
  const { I, J, H, I0, I1, J0, J1, ZA, ZB } = E;
  const n = 6;
  const w = (I1 - I0) / n;
  const bandes = [];
  const festons = [];
  for (let k = 0; k < n; k++) {
    const a = I0 + k * w;
    const b = a + w;
    const c = k % 2 ? '#fffaf2' : e.couleur;
    bandes.push(face([[a, J0, ZA], [b, J0, ZA], [b, J1, ZB], [a, J1, ZB]], c));
    festons.push(`<path d="M${P(a, J1, ZB)} L${P(b, J1, ZB)} L${P(b, J1, ZB - 5)} Q${P((a + b) / 2, J1, ZB - 14)} ${P(a, J1, ZB - 5)} Z" fill="${c}" stroke="${e.fonce}" stroke-width=".8" stroke-linejoin="round"/>`);
  }
  const sens = miroir ? -1 : 1;
  const montres = e.articles.slice(0, 4).map((k, m) => {
    const [px, py] = iso(0.65 + m * 1.02, 0.85, H);
    return `<g transform="translate(${px.toFixed(1)} ${(py - 6).toFixed(1)}) scale(${0.46 * sens} .46)">${ARTICLES[k].dessin()}</g>`;
  }).join('');
  const caisse = e.articles[4] ? (() => {
    const [cx, cy] = iso(I + 0.15, J + 0.55, 6);
    return `${boite(I - 0.75, J + 0.15, 0.9, 0.85, 0, 6, { devant: '#c98d55', cote: '#a86f3f', dessus: '#e2b47c' })}
      <g transform="translate(${cx.toFixed(1)} ${(cy - 5).toFixed(1)}) scale(${0.4 * sens} .4)">${ARTICLES[e.articles[4]].dessin()}</g>`;
  })() : '';
  const corps = `
    ${face([[-0.9, -1.1, 0], [5.3, -1.1, 0], [5.3, 3.4, 0], [-0.9, 3.4, 0]], '#2a1745', ' opacity=".1"')}
    ${poteau(-0.2, J0 + 0.15, ZA - 2)}${poteau(I1 - 0.2, J0 + 0.15, ZA - 2)}
    ${boite(0, 0, I, J, 0, H, { devant: e.couleur, cote: e.fonce, dessus: '#e2b47c' })}
    <path d="M${P(0, J, 5)} L${P(I, J, 5)} M${P(0, J, 10)} L${P(I, J, 10)}" stroke="${e.fonce}" stroke-width="1" opacity=".55"/>
    <path d="M${P(0, J, H)} L${P(I, J, H)}" stroke="#fff" stroke-opacity=".55" stroke-width="1.4"/>
    ${montres}
    ${caisse}
    ${poteau(-0.2, J1 - 0.1, ZB)}${poteau(I1 - 0.2, J1 - 0.1, ZB)}
    ${bandes.join('')}
    ${face([[I1, J0, ZA], [I1, J1, ZB], [I1, J1, ZB - 5], [I1, J0, ZA - 5]], e.fonce)}
    ${festons.join('')}
    <path d="M${P(I0, J0, ZA)} L${P(I1, J0, ZA)}" stroke="${e.fonce}" stroke-width="2" stroke-linecap="round"/>`;
  const [sx, sy] = iso((I0 + I1) / 2, J0, ZA);
  const largeur = Math.round(24 + e.nom.length * 6.6);
  const ox = x + (miroir ? ETAL_DECALAGE.x : -ETAL_DECALAGE.x);
  const oy = y + ETAL_DECALAGE.y;
  return `
  <g class="e5-etal" data-e5="etal-${e.cle}" data-cle="${e.cle}" role="button" tabindex="0" aria-label="${e.nom}">
    <g transform="translate(${ox} ${oy})${miroir ? ' scale(-1 1)' : ''}">
      <rect x="-50" y="-86" width="132" height="148" fill="transparent"/>
      ${corps}
    </g>
    <g transform="translate(${(ox + sx * sens).toFixed(1)} ${(oy + sy - 11).toFixed(1)})">
      <path d="M-14 6 V12 M14 6 V12" stroke="#8a5a3b" stroke-width="2.6"/>
      <rect x="${-largeur / 2}" y="-10" width="${largeur}" height="20" rx="7" fill="#fffaf2" stroke="${e.fonce}" stroke-width="2.2"/>
      <text y="4.4" text-anchor="middle" font-size="12.5" font-weight="700" fill="${e.fonce}">${e.nom}</text>
    </g>
  </g>`;
}

function fontaine() {
  return `
  <ellipse cx="0" cy="9" rx="62" ry="29" fill="#2a1745" opacity=".1"/>
  <path d="M-52 0 V12 A52 26 0 0 0 52 12 V0 Z" fill="#a898c9"/>
  <path d="M-52 6 A52 26 0 0 0 52 6" fill="none" stroke="#8c7bb3" stroke-width="1.4"/>
  <ellipse rx="52" ry="26" fill="#e2d8f5"/>
  <ellipse rx="44" ry="21.5" fill="#79bfe8"/>
  <path d="M-44 0 A44 21.5 0 0 1 44 0 A44 18 0 0 0 -44 0 Z" fill="#5aa6d6"/>
  <g fill="#f2c14e" stroke="#c9932a" stroke-width=".6"><ellipse cx="-22" cy="9" rx="3" ry="1.4"/><ellipse cx="19" cy="12" rx="3" ry="1.4"/><ellipse cx="27" cy="4" rx="3" ry="1.4"/></g>
  <g class="e5-ronds" fill="none" stroke="#e6f6ff" stroke-width="1.4">
    <ellipse cx="-14" cy="6" rx="12" ry="5.5"/><ellipse cx="16" cy="-4" rx="10" ry="4.6" style="animation-delay:-1.1s"/><ellipse cx="4" cy="12" rx="9" ry="4" style="animation-delay:-.5s"/>
  </g>
  <rect x="-7" y="-40" width="14" height="40" fill="#cbbfe6"/><rect x="2" y="-40" width="5" height="40" fill="#b3a5d6"/>
  <path d="M-23 -40 V-35 A23 11.5 0 0 0 23 -35 V-40 Z" fill="#a898c9"/>
  <ellipse cy="-40" rx="23" ry="11.5" fill="#e2d8f5"/>
  <ellipse cy="-40" rx="18" ry="8.5" fill="#79bfe8"/>
  <rect x="-3.5" y="-57" width="7" height="17" fill="#cbbfe6"/>
  <circle cy="-59" r="5.5" fill="#e2d8f5"/>
  <g class="e5-jets" fill="none" stroke="#c9ecff" stroke-width="2.6" stroke-linecap="round">
    <path d="M0 -63 Q-12 -76 -19 -43"/><path d="M0 -63 Q12 -76 19 -43" style="animation-delay:-.3s"/>
    <path d="M-23 -36 Q-33 -32 -35 -8"/><path d="M23 -36 Q33 -32 35 -8" style="animation-delay:-.2s"/>
    <path d="M-9 -30 Q-14 -24 -15 -6" style="animation-delay:-.4s"/><path d="M9 -30 Q14 -24 15 -6" style="animation-delay:-.1s"/>
  </g>`;
}

function arbre(x, y, s = 1, fruits = false) {
  const f = fruits ? `<g fill="#ff7ab8"><circle cx="-14" cy="-66" r="3"/><circle cx="9" cy="-78" r="3"/><circle cx="17" cy="-55" r="3"/><circle cx="-5" cy="-50" r="3"/><circle cx="-22" cy="-45" r="2.6"/></g>` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="2" rx="30" ry="12" fill="#2a1745" opacity=".13"/>
    <path d="M-5 2 L-4 -36 L4 -36 L5 2 Z" fill="#8a5a3b"/><path d="M1 0 L1.6 -34 L4 -34 L5 0 Z" fill="#74482d"/>
    <circle cx="0" cy="-62" r="29" fill="#5ea957"/>
    <circle cx="-17" cy="-50" r="19" fill="#579f51"/>
    <circle cx="18" cy="-48" r="20" fill="#4f9449"/>
    <circle cx="-6" cy="-72" r="20" fill="#72bd63"/>
    <circle cx="10" cy="-66" r="14" fill="#7fc76e"/>
    ${f}
  </g>`;
}

function buisson(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="2" rx="22" ry="7" fill="#2a1745" opacity=".1"/>
    <circle cx="-11" cy="-8" r="11" fill="#579f51"/><circle cx="11" cy="-8" r="11" fill="#4f9449"/><circle cx="0" cy="-14" r="13" fill="#6cb85f"/>
    <g fill="#e9a3ff"><circle cx="-8" cy="-16" r="2.2"/><circle cx="6" cy="-20" r="2.2"/><circle cx="12" cy="-9" r="2.2"/><circle cx="-13" cy="-5" r="2"/></g>
  </g>`;
}

function fleurs(x, y) {
  const fleur = (dx, dy, c) => `<g transform="translate(${dx} ${dy})"><path d="M0 0 V8" stroke="#4f9a5a" stroke-width="1.4"/><circle cx="-2.4" cy="0" r="2.2" fill="${c}"/><circle cx="2.4" cy="0" r="2.2" fill="${c}"/><circle cx="0" cy="-2.4" r="2.2" fill="${c}"/><circle cx="0" cy="2.4" r="2.2" fill="${c}"/><circle r="1.3" fill="#f5d33f"/></g>`;
  return `<g transform="translate(${x} ${y})">${fleur(-12, -2, '#b48cff')}${fleur(0, -7, '#ff9cc8')}${fleur(11, -1, '#8f5cf7')}${fleur(-4, 4, '#fffaf2')}${fleur(7, 7, '#c9a8ff')}</g>`;
}

function lampadaire(x, y) {
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="1" rx="8" ry="3.4" fill="#2a1745" opacity=".14"/>
    <path d="M-4 0 H4 L2.4 -6 H-2.4 Z" fill="#3b2a52"/>
    <rect x="-1.6" y="-66" width="3.2" height="62" fill="#3b2a52"/>
    <path d="M-7 -66 H7 L5 -80 H-5 Z" fill="#fff4c2" stroke="#3b2a52" stroke-width="2" stroke-linejoin="round"/>
    <path d="M-8 -80 H8 L0 -87 Z" fill="#3b2a52" stroke="#3b2a52" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="0" cy="-73" r="10" fill="#fff4c2" opacity=".35"/>
  </g>`;
}

function banc(x, y) {
  return `<g transform="translate(${x} ${y})">
    ${face([[-0.3, -0.3, 0], [3.5, -0.3, 0], [3.5, 1.4, 0], [-0.3, 1.4, 0]], '#2a1745', ' opacity=".1"')}
    ${poteau(0.2, 0.15, 18, '#4a3a66', 2.6)}${poteau(3, 0.15, 18, '#4a3a66', 2.6)}
    ${face([[0, 0.15, 11], [3.2, 0.15, 11], [3.2, 0.15, 19], [0, 0.15, 19]], '#c98d55', ' stroke="#8a5a3b" stroke-width="1"')}
    ${poteau(0.2, 1.0, 7, '#4a3a66', 2.6)}${poteau(3, 1.0, 7, '#4a3a66', 2.6)}
    ${boite(0, 0.2, 3.2, 1.0, 6, 2.2, { devant: '#a86f3f', cote: '#8a5a3b', dessus: '#d9a066' })}
  </g>`;
}

function tableau(x, y) {
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="1" rx="40" ry="7" fill="#2a1745" opacity=".1"/>
    <path d="M-28 0 V-50 M28 0 V-50" stroke="#8a5a3b" stroke-width="4" stroke-linecap="round"/>
    <rect x="-36" y="-60" width="72" height="44" rx="4" fill="#9a6438"/>
    <rect x="-32" y="-56" width="64" height="36" rx="2" fill="#e3c08a"/>
    <g transform="rotate(-6 -18 -40)"><rect x="-27" y="-52" width="18" height="22" fill="#fffaf2"/><path d="M-24 -46 h12 M-24 -42 h12 M-24 -38 h8" stroke="#c9b8ef" stroke-width="1.4"/></g>
    <g transform="rotate(4 4 -38)"><rect x="-6" y="-51" width="20" height="18" fill="#efe6ff"/><path d="M4 -37 C0 -40 -0.6 -42.6 1.4 -43.4 C2.6 -43.9 3.6 -43.2 4 -42.5 C4.4 -43.2 5.4 -43.9 6.6 -43.4 C8.6 -42.6 8 -40 4 -37 Z" fill="#8f5cf7"/></g>
    <g transform="rotate(-3 22 -38)"><rect x="15" y="-53" width="14" height="24" fill="#fff4c2"/><path d="M22 -44 C19 -48 16.6 -46 17.6 -43.6 C18.6 -41.6 21 -42.4 22 -41 C23 -42.4 25.4 -41.6 26.4 -43.6 C27.4 -46 25 -48 22 -44 Z" fill="#4a3a66"/></g>
    <circle cx="-18" cy="-51" r="1.6" fill="#e5484d"/><circle cx="4" cy="-50" r="1.6" fill="#4a7bd8"/><circle cx="22" cy="-52" r="1.6" fill="#5bb36a"/>
  </g>`;
}

function poteauCafe(x, y, texte) {
  const l = Math.round(30 + texte.length * 6.4);
  return `<g class="e5-vers-cafe" data-e5="vers-cafe" role="button" tabindex="0" aria-label="${texte}">
    <g transform="translate(${x} ${y})">
      <rect x="${-l / 2 - 10}" y="-62" width="${l + 22}" height="66" fill="transparent"/>
      <ellipse cx="0" cy="1" rx="10" ry="4" fill="#2a1745" opacity=".14"/>
      <rect x="-2.5" y="-50" width="5" height="50" rx="2" fill="#8a5a3b"/>
      <path d="M${-l / 2} -54 H${l / 2} V-34 H${-l / 2} L${-l / 2 - 10} -44 Z" fill="#fffaf2" stroke="#7a3cf0" stroke-width="2.4" stroke-linejoin="round"/>
      <g transform="translate(${-l / 2 + 9} -44) scale(.42)">${tasse({ vapeur: false })}</g>
      <text x="${8}" y="-39.6" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4a1fa8">${texte}</text>
    </g>
  </g>`;
}

const LOOKS = [
  { clement: true },   // Clément, dessiné à part : corpsClement()
  null,                // (ancienne Mamie_Confiture, remplacée par Cyriel)
  { chachoux: true },  // Chachoux, dessinée à part : corpsChachoux()
  { estel: true },     // Estel, dessinée à part : corpsEstel()
  { peau: '#e8b48f', cheveux: '#8a1c34', haut: '#f5d33f', bas: '#3b3550', coiffe: 'courts' },
  { peau: '#8f5a3c', cheveux: '#1a1026', haut: '#e5484d', bas: '#4a7bd8', coiffe: 'chignon' },
  { angeloune: true },
  { rachou: true },
];

function coiffure(c, couleur) {
  switch (c) {
    case 'chignon': return `<circle cx="0" cy="-46" r="6" fill="${couleur}"/><path d="M-11 -32 C-12 -45 12 -45 11 -32 C8 -38 -8 -38 -11 -32 Z" fill="${couleur}"/>`;
    case 'bonnet': return `<path d="M-11.5 -33 C-12 -47 12 -47 11.5 -33 Z" fill="#f5d33f"/><rect x="-12.5" y="-36" width="25" height="5" rx="2.5" fill="#e3b04b"/><circle cx="0" cy="-46" r="3.6" fill="#fffaf2"/>`;
    case 'couettes': return `<path d="M-11 -31 C-12 -46 12 -46 11 -31 C7 -37 -7 -37 -11 -31 Z" fill="${couleur}"/><ellipse cx="-13.5" cy="-30" rx="4" ry="6" fill="${couleur}"/><ellipse cx="13.5" cy="-30" rx="4" ry="6" fill="${couleur}"/><circle cx="-11" cy="-35" r="1.8" fill="#f06fa4"/><circle cx="11" cy="-35" r="1.8" fill="#f06fa4"/>`;
    default: return `<path d="M-11.2 -31 C-12 -45 10 -47 11.4 -33 C7 -37 1 -36 -2 -39 C-4 -35 -8 -34 -11.2 -31 Z" fill="${couleur}"/>`;
  }
}

// Clément, d'après sa photo : cheveux brun foncé relevés devant, côtés
// courts, sourcils marqués, yeux bleu-vert, grand sourire ; tenue de trail
// (gilet d'hydratation et ses deux flasques, short, montre) sur ses abdos.
/** Clément en tenue de trail, debout (origine aux pieds). */
export const clementTrail = () => corpsClement(false);

function corpsClement(coucou) {
  const peau = '#f2cbae';
  const ombre = '#d99c7c';
  const cheveux = '#3b2a20';
  const gilet = '#24222b';
  const brasD = coucou
    ? `<g class="e5-coucou"><path d="M7 -19.5 Q12 -24 13 -31" stroke="${peau}" stroke-width="4" stroke-linecap="round" fill="none"/>
        <circle cx="12" cy="-28" r="1.9" fill="#16151b"/><circle cx="12" cy="-28" r=".8" fill="#9aa3ad"/>
        <circle cx="13" cy="-32.6" r="2.5" fill="${peau}"/></g>`
    : `<path d="M7.5 -19.5 Q10 -15 9.5 -11" stroke="${peau}" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="9.4" cy="-10.4" r="2.4" fill="${peau}"/>`;
  const abdos = [0, 1, 2].map((r) => {
    const y = (-17.4 + r * 3.1).toFixed(1);
    return `<rect x="-4.3" y="${y}" width="3.8" height="2.6" rx="1.1" fill="#e6b392"/><rect x="0.5" y="${y}" width="3.8" height="2.6" rx="1.1" fill="#e6b392"/>`;
  }).join('');
  return `
      <rect x="1" y="-28.5" width="15" height="4" rx="2" fill="#d8c3a0" transform="rotate(-10 8.5 -26.5)"/>
      <path d="M-7 -10 H7 L6.6 -4.4 H0.8 L0 -6.2 L-0.8 -4.4 H-6.6 Z" fill="#2c2c36"/>
      <rect x="-5.3" y="-5" width="3.7" height="4" rx="1.4" fill="${peau}"/><rect x="1.6" y="-5" width="3.7" height="4" rx="1.4" fill="${peau}"/>
      <ellipse cx="-3.5" cy="-1" rx="3.5" ry="2" fill="#4a4a58"/><ellipse cx="3.5" cy="-1" rx="3.5" ry="2" fill="#4a4a58"/>
      <path d="M-6.6 -0.2 H-0.6 M0.6 -0.2 H6.6" stroke="#e8e6ee" stroke-width=".9"/>
      <path d="M-7.5 -19.5 Q-10 -15 -9.5 -11" stroke="${peau}" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="-9.4" cy="-10.4" r="2.4" fill="${peau}"/>
      <path d="M-8 -9.5 Q-9 -21 -6 -23 H6 Q9 -21 8 -9.5 Z" fill="${peau}"/>
      ${abdos}
      <path d="M-8.2 -14.6 Q-9 -21 -6 -23 H-3 L-3.5 -14.6 Z" fill="${gilet}"/>
      <path d="M8.2 -14.6 Q9 -21 6 -23 H3 L3.5 -14.6 Z" fill="${gilet}"/>
      <rect x="-6.9" y="-22.4" width="2.8" height="6" rx="1.2" fill="#eef1f5"/><rect x="-6.5" y="-24.2" width="2" height="2" rx=".5" fill="#a3abb5"/>
      <rect x="4.1" y="-22.4" width="2.8" height="6" rx="1.2" fill="#eef1f5"/><rect x="4.5" y="-24.2" width="2" height="2" rx=".5" fill="#a3abb5"/>
      <path d="M-3.3 -21 L3.3 -19.5 L-3.3 -18 L3.3 -16.5" stroke="#8b8b98" stroke-width=".7" fill="none"/>
      <rect x="-8" y="-11" width="16" height="1.7" rx=".8" fill="${gilet}"/>
      ${brasD}
      <circle cx="-10.3" cy="-32" r="2.3" fill="${peau}"/><circle cx="10.3" cy="-32" r="2.3" fill="${peau}"/>
      <path d="M-10.6 -33 Q-11.4 -32 -10.5 -30.9 M10.6 -33 Q11.4 -32 10.5 -30.9" stroke="${ombre}" stroke-width=".7" fill="none"/>
      <ellipse cx="0" cy="-33" rx="10.3" ry="11.2" fill="${peau}"/>
      <path d="M-10.5 -32.4 C-10.8 -36.4 -9.6 -39 -7.6 -40.4 L-8.4 -34.4 C-9.2 -33.6 -9.9 -33 -10.5 -32.4 Z" fill="${cheveux}"/>
      <path d="M10.5 -32.4 C10.8 -36.4 9.6 -39 7.6 -40.4 L8.4 -34.4 C9.2 -33.6 9.9 -33 10.5 -32.4 Z" fill="${cheveux}"/>
      <path d="M-9.8 -36 C-10.4 -42 -6.8 -46.4 -1.6 -47.4 C2.4 -49.4 7.4 -48.8 9.6 -45.6 C11 -43.6 11 -40.8 10.2 -38.6 C10.3 -37.7 10.2 -36.8 9.9 -36 C8.4 -38.9 5.2 -40.6 1.4 -40.8 C-3.2 -41 -7.2 -39.2 -9.8 -36 Z" fill="${cheveux}"/>
      <path d="M-2.6 -46.8 C-3.6 -49.2 -0.6 -50.6 2.4 -49.6 C0.9 -49.2 -0.2 -48.4 -0.4 -47.4 Z" fill="${cheveux}"/>
      <path d="M-6.4 -41.8 C-4.2 -45 0.8 -46.6 5.6 -45.6 M-1.2 -47 C1.4 -48.2 4.8 -48 7.6 -46.4" stroke="#5c4434" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      <path d="M-6.9 -37.2 Q-4.5 -38.7 -1.9 -37.5 M1.9 -37.5 Q4.5 -38.7 6.9 -37.2" stroke="${cheveux}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <circle cx="-4" cy="-33.6" r="1.75" fill="#2f9e9a" stroke="${ENCRE}" stroke-width=".7"/><circle cx="4" cy="-33.6" r="1.75" fill="#2f9e9a" stroke="${ENCRE}" stroke-width=".7"/>
      <circle cx="-4" cy="-33.6" r=".7" fill="${ENCRE}"/><circle cx="4" cy="-33.6" r=".7" fill="${ENCRE}"/>
      <circle cx="-3.4" cy="-34.3" r=".5" fill="#fff"/><circle cx="4.6" cy="-34.3" r=".5" fill="#fff"/>
      <path d="M-6.1 -31.7 Q-4 -30.8 -1.9 -31.7 M1.9 -31.7 Q4 -30.8 6.1 -31.7" stroke="${ombre}" stroke-width=".75" fill="none" stroke-linecap="round"/>
      <path d="M0.3 -31.8 Q1.3 -30.2 0 -29.7" stroke="${ombre}" stroke-width=".8" fill="none" stroke-linecap="round"/>
      <path d="M-6.7 -29.4 Q-6.3 -27.6 -5.5 -26.6 M6.7 -29.4 Q6.3 -27.6 5.5 -26.6" stroke="#e3ad8f" stroke-width=".6" fill="none" stroke-linecap="round"/>
      <ellipse cx="-7.2" cy="-29.2" rx="1.8" ry="1.1" fill="#ff9cc8" opacity=".45"/><ellipse cx="7.2" cy="-29.2" rx="1.8" ry="1.1" fill="#ff9cc8" opacity=".45"/>
      <path d="M-4.4 -28.4 Q0 -27.7 4.4 -28.4 Q3.6 -23.6 0 -23.4 Q-3.6 -23.6 -4.4 -28.4 Z" fill="#8a2f3a"/>
      <path d="M-4 -28.2 Q0 -27.6 4 -28.2 L3.7 -26.8 Q0 -26.3 -3.7 -26.8 Z" fill="#fff"/>
      <path d="M-1.8 -24.4 Q0 -25.4 1.8 -24.4" stroke="#e0607a" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
}

// Estel, d'après sa photo : cheveux blond vénitien aux épaules, raie sur le
// côté, grand sourire, créoles et collier dorés, chemisier bleu à petits
// motifs clairs.
function corpsEstel(assis) {
  const peau = '#f6d3bd';
  const cheveux = '#e2a868';
  const reflet = '#f3c992';
  const bleu = '#3d5cb5';
  const motif = '#b9d0f5';
  const or = '#e0b44c';
  const jambes = assis
    ? `<ellipse cx="-4" cy="-8" rx="4.4" ry="3" fill="#2f3a5c"/><ellipse cx="4" cy="-8" rx="4.4" ry="3" fill="#2f3a5c"/><ellipse cx="-6" cy="-5" rx="3" ry="2" fill="#3b2a52"/><ellipse cx="6" cy="-5" rx="3" ry="2" fill="#3b2a52"/>`
    : `<rect x="-5.5" y="-10" width="4.4" height="9" rx="2" fill="#2f3a5c"/><rect x="1.1" y="-10" width="4.4" height="9" rx="2" fill="#2f3a5c"/><ellipse cx="-3.4" cy="-1" rx="3.4" ry="2" fill="#3b2a52"/><ellipse cx="3.4" cy="-1" rx="3.4" ry="2" fill="#3b2a52"/>`;
  const tirets = [[-6, -19.5], [-3.4, -14], [-6.2, -12], [4.6, -19], [2.4, -15.6], [5.6, -13], [-1, -11.2], [1.6, -20.4]]
    .map(([x, y]) => `M${x} ${y} l1.4 -.9`).join(' ');
  return `
      <path d="M-12.6 -23.6 C-14.2 -32 -13 -42 -6 -45.4 C-1 -47.6 6 -46.8 10.6 -43 C14.2 -39.6 14 -31 12.8 -23.6 C11 -22.2 8.6 -22.4 7.6 -24 L-7.6 -24 C-8.6 -22.4 -11 -22.2 -12.6 -23.6 Z" fill="${cheveux}"/>
      ${jambes}
      <path d="M-8 -9 Q-9 -21 -6 -23 H6 Q9 -21 8 -9 Z" fill="${bleu}"/>
      <path d="M-3.6 -23 L0 -17.4 L3.6 -23 Z" fill="${peau}"/>
      <path d="M-3.1 -22.7 Q0 -18.6 3.1 -22.7" stroke="${or}" stroke-width=".6" fill="none"/><circle cx="0" cy="-19.1" r=".85" fill="${or}"/>
      <path d="${tirets}" stroke="${motif}" stroke-width=".8" stroke-linecap="round"/>
      <path d="M-7.5 -19 Q-10 -15 -9.5 -11" stroke="${bleu}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="-9.4" cy="-10.4" r="2.4" fill="${peau}"/>
      <path d="M7.5 -19 Q10 -15 9.5 -11" stroke="${bleu}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="9.4" cy="-10.4" r="2.4" fill="${peau}"/>
      <path d="M-8.6 -17.6 l1.2 -.8 M8 -14.6 l1.2 -.8" stroke="${motif}" stroke-width=".8" stroke-linecap="round"/>
      <ellipse cx="0" cy="-33" rx="10.3" ry="11" fill="${peau}"/>
      <path d="M-8 -40.6 C-5 -45.8 3 -46.8 8.6 -42.8 C10.6 -41 11 -38.2 10.5 -35.6 C8.6 -38.8 4.6 -40.9 -1 -40.6 C-3.6 -40.4 -5.9 -40.2 -8 -40.6 Z" fill="${cheveux}"/>
      <path d="M-10.5 -38 C-11.2 -33 -10.8 -28 -9.3 -24.8 L-8.1 -25.2 C-8.9 -29 -9.1 -34 -8 -40.6 Z" fill="${cheveux}"/>
      <path d="M10.5 -36 C11.1 -31 10.7 -27 9.5 -24.6 L8.3 -25 C9.1 -28.6 9.5 -32.6 9.7 -36.4 Z" fill="${cheveux}"/>
      <path d="M-4 -43.6 C0 -45.4 5 -44.8 8 -42.4 M-9.6 -35 C-9.9 -31 -9.6 -28.4 -8.9 -26.4" stroke="${reflet}" stroke-width="1" fill="none" stroke-linecap="round"/>
      <circle cx="-10.3" cy="-27.6" r="1.6" fill="none" stroke="${or}" stroke-width=".9"/><circle cx="10.3" cy="-27.6" r="1.6" fill="none" stroke="${or}" stroke-width=".9"/>
      <path d="M-6.4 -37 Q-4.4 -38 -2.4 -37.3 M2.4 -37.3 Q4.4 -38 6.4 -37" stroke="#c98c55" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path d="M-5.8 -33.2 Q-4 -35.2 -2.2 -33.2 M2.2 -33.2 Q4 -35.2 5.8 -33.2" stroke="${ENCRE}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M0.2 -31.6 Q1.1 -30.2 0 -29.8" stroke="#e0a688" stroke-width=".8" fill="none" stroke-linecap="round"/>
      <ellipse cx="-6.8" cy="-29.4" rx="2" ry="1.2" fill="#ff9cb0" opacity=".55"/><ellipse cx="6.8" cy="-29.4" rx="2" ry="1.2" fill="#ff9cb0" opacity=".55"/>
      <path d="M-3.9 -28.6 Q0 -27.9 3.9 -28.6 Q3.1 -24.6 0 -24.4 Q-3.1 -24.6 -3.9 -28.6 Z" fill="#a8384a"/>
      <path d="M-3.5 -28.4 Q0 -27.8 3.5 -28.4 L3.2 -27.2 Q0 -26.8 -3.2 -27.2 Z" fill="#fff"/>`;
}

// Chachoux, d'après sa photo : longs cheveux châtain clair, raie au milieu,
// coiffés derrière les oreilles, yeux clairs, grand sourire, boucles
// pendantes, chemise crème à fleurs bleu marine.
function corpsChachoux(assis) {
  const peau = '#f4d4bf';
  const cheveux = '#a8794e';
  const reflet = '#c79a68';
  const creme = '#efe3cf';
  const marine = '#2e3a6b';
  const jambes = assis
    ? `<ellipse cx="-4" cy="-8" rx="4.4" ry="3" fill="#2f3a5c"/><ellipse cx="4" cy="-8" rx="4.4" ry="3" fill="#2f3a5c"/><ellipse cx="-6" cy="-5" rx="3" ry="2" fill="#3b2a52"/><ellipse cx="6" cy="-5" rx="3" ry="2" fill="#3b2a52"/>`
    : `<rect x="-5.5" y="-10" width="4.4" height="9" rx="2" fill="#3a3550"/><rect x="1.1" y="-10" width="4.4" height="9" rx="2" fill="#3a3550"/><ellipse cx="-3.4" cy="-1" rx="3.4" ry="2" fill="#2a2433"/><ellipse cx="3.4" cy="-1" rx="3.4" ry="2" fill="#2a2433"/>`;
  const fleur = (x, y) => `<circle cx="${x}" cy="${y}" r="1.25" fill="${marine}"/><circle cx="${x + 1.3}" cy="${y + 0.9}" r=".75" fill="${marine}"/><circle cx="${x - 1.1}" cy="${y + 1}" r=".7" fill="${marine}"/>`;
  const fleurs = [[-5.6, -19.6], [-2.8, -14.4], [-6, -12.4], [4.4, -18.8], [2.2, -15.6], [5.4, -12.6], [0.6, -11.6]].map(([x, y]) => fleur(x, y)).join('');
  return `
      <path d="M-12 -16 C-14 -26 -13.6 -40 -6.6 -45 C-2 -47.8 4 -47.6 8.6 -44.6 C14 -40.4 14 -26 12 -16 C10.4 -14.2 8 -14.4 7.4 -16.6 L-7.4 -16.6 C-8 -14.4 -10.4 -14.2 -12 -16 Z" fill="${cheveux}"/>
      <path d="M-11 -18 C-12.4 -26 -12.2 -34 -10.4 -38 M11 -18 C12.4 -26 12.2 -34 10.4 -38" stroke="${reflet}" stroke-width="1" fill="none" stroke-linecap="round"/>
      ${jambes}
      <path d="M-7.5 -19 Q-10 -15 -9.5 -11" stroke="${peau}" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="-9.4" cy="-10.4" r="2.4" fill="${peau}"/>
      <path d="M7.5 -19 Q10 -15 9.5 -11" stroke="${peau}" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="9.4" cy="-10.4" r="2.4" fill="${peau}"/>
      <path d="M-8 -9 Q-9 -21 -6 -23 H6 Q9 -21 8 -9 Z" fill="${creme}"/>
      ${fleurs}
      <path d="M-2.6 -23 L0 -19 L2.6 -23 Z" fill="${peau}"/>
      <path d="M-5.6 -23.4 L-2.6 -23 L0 -19 L-3.2 -19.6 Z M5.6 -23.4 L2.6 -23 L0 -19 L3.2 -19.6 Z" fill="${creme}" stroke="${marine}" stroke-width=".6" stroke-linejoin="round"/>
      <path d="M0 -18.6 V-9.6" stroke="#d6c6ab" stroke-width=".7"/>
      <circle cx="0" cy="-16.4" r=".55" fill="#b8a586"/><circle cx="0" cy="-13.2" r=".55" fill="#b8a586"/>
      <circle cx="-10.3" cy="-32.2" r="2.2" fill="${peau}"/><circle cx="10.3" cy="-32.2" r="2.2" fill="${peau}"/>
      <path d="M-10.4 -30.4 V-29 M10.4 -30.4 V-29" stroke="#c9a56a" stroke-width=".6"/>
      <path d="M-10.4 -29 C-11.6 -27.6 -11.4 -25.6 -10.4 -24.6 C-9.4 -25.6 -9.2 -27.6 -10.4 -29 Z M10.4 -29 C9.2 -27.6 9.4 -25.6 10.4 -24.6 C11.4 -25.6 11.6 -27.6 10.4 -29 Z" fill="#253556"/>
      <ellipse cx="0" cy="-33" rx="10" ry="11.3" fill="${peau}"/>
      <path d="M-9.4 -35.6 C-10 -41.4 -6.4 -45.4 0 -45.6 C6.4 -45.4 10 -41.4 9.4 -35.6 C8.6 -39.2 5.4 -41.6 0.6 -42.2 L0 -40.6 L-0.6 -42.2 C-5.4 -41.6 -8.6 -39.2 -9.4 -35.6 Z" fill="${cheveux}"/>
      <path d="M-5.6 -43.2 C-3.6 -44.4 -1.6 -44.6 -0.4 -44.2 M5.6 -43.2 C3.6 -44.4 1.6 -44.6 0.4 -44.2" stroke="${reflet}" stroke-width=".9" fill="none" stroke-linecap="round"/>
      <path d="M-6.4 -37 Q-4.2 -38.2 -2 -37.4 M2 -37.4 Q4.2 -38.2 6.4 -37" stroke="#8a6040" stroke-width="1" fill="none" stroke-linecap="round"/>
      <circle cx="-3.9" cy="-33.4" r="1.6" fill="#7fa3c4" stroke="${ENCRE}" stroke-width=".7"/><circle cx="3.9" cy="-33.4" r="1.6" fill="#7fa3c4" stroke="${ENCRE}" stroke-width=".7"/>
      <circle cx="-3.9" cy="-33.4" r=".65" fill="${ENCRE}"/><circle cx="3.9" cy="-33.4" r=".65" fill="${ENCRE}"/>
      <circle cx="-3.3" cy="-34" r=".45" fill="#fff"/><circle cx="4.5" cy="-34" r=".45" fill="#fff"/>
      <path d="M0.3 -31.8 Q1.2 -30.2 0 -29.6" stroke="#e0a688" stroke-width=".8" fill="none" stroke-linecap="round"/>
      <ellipse cx="-6.8" cy="-29.4" rx="1.9" ry="1.1" fill="#ff9cb0" opacity=".5"/><ellipse cx="6.8" cy="-29.4" rx="1.9" ry="1.1" fill="#ff9cb0" opacity=".5"/>
      <path d="M-3.7 -28.4 Q0 -27.8 3.7 -28.4 Q3 -24.8 0 -24.6 Q-3 -24.8 -3.7 -28.4 Z" fill="#a8384a"/>
      <path d="M-3.3 -28.2 Q0 -27.7 3.3 -28.2 L3 -27.1 Q0 -26.7 -3 -27.1 Z" fill="#fff"/>`;
}

// Angelouné, d'après sa photo : foulard blanc noué sous le menton, lunettes
// de soleil rondes en écaille, petit sourire, chemise à fines rayures bleues,
// sac en bandoulière marron, et les doigts en V.
// Pas encore placée au marché : ajouter { angeloune: true } dans LOOKS.
export function corpsAngeloune(assis = false) {
  const peau = '#f3d2bd';
  const blanc = '#fbfbff';
  const pli = '#d5d9ea';
  const chemise = '#e4ecf9';
  const rayure = '#8aa7d6';
  const jambes = assis
    ? `<ellipse cx="-4" cy="-8" rx="4.4" ry="3" fill="#2f3a5c"/><ellipse cx="4" cy="-8" rx="4.4" ry="3" fill="#2f3a5c"/><ellipse cx="-6" cy="-5" rx="3" ry="2" fill="#3b2a52"/><ellipse cx="6" cy="-5" rx="3" ry="2" fill="#3b2a52"/>`
    : `<rect x="-5.5" y="-10" width="4.4" height="9" rx="2" fill="#2f3a5c"/><rect x="1.1" y="-10" width="4.4" height="9" rx="2" fill="#2f3a5c"/><ellipse cx="-3.4" cy="-1" rx="3.4" ry="2" fill="#f4f1ea"/><ellipse cx="3.4" cy="-1" rx="3.4" ry="2" fill="#f4f1ea"/>`;
  const rayures = [-6, -4, -2, 0, 2, 4, 6].map((x) => `M${x} -22.4 V-9.6`).join(' ');
  return `
      ${jambes}
      <path d="M-7.5 -19 Q-10 -15 -9.5 -11" stroke="${chemise}" stroke-width="4.4" stroke-linecap="round" fill="none"/>
      <path d="M-8.3 -17.6 Q-10.3 -14.6 -9.9 -11.6 M-7.2 -18.2 Q-9 -15 -8.7 -11.4" stroke="${rayure}" stroke-width=".55" fill="none"/>
      <circle cx="-9.4" cy="-10.2" r="2.4" fill="${peau}"/>
      <path d="M-8 -9 Q-9 -21 -6 -23 H6 Q9 -21 8 -9 Z" fill="${chemise}"/>
      <path d="${rayures}" stroke="${rayure}" stroke-width=".6"/>
      <path d="M-6.2 -22.8 L-7.4 -9.4" stroke="#a8623a" stroke-width="1.9" stroke-linecap="round"/>
      <path d="M-10.8 -31 C-11.6 -41 -6.5 -46.8 0 -46.8 C6.5 -46.8 11.6 -41 10.8 -31 C10.6 -27 9.8 -24.2 8.6 -22.4 L3.2 -13.6 Q0 -11.2 -3.2 -13.6 L-8.6 -22.4 C-9.8 -24.2 -10.6 -27 -10.8 -31 Z" fill="${blanc}" stroke="${pli}" stroke-width=".7" stroke-linejoin="round"/>
      <path d="M-5 -24 Q-2 -19 -0.6 -13 M5 -24 Q2 -19 0.6 -13 M-8.6 -27 Q-7 -23.6 -5 -21.6 M8.6 -27 Q7 -23.6 5 -21.6" stroke="${pli}" stroke-width=".7" fill="none" stroke-linecap="round"/>
      <ellipse cx="0" cy="-22.6" rx="2.2" ry="1.5" fill="${blanc}" stroke="${pli}" stroke-width=".7"/>
      <ellipse cx="0" cy="-33" rx="7.7" ry="8.9" fill="${peau}"/>
      <path d="M-7.6 -34 C-7.4 -40 -4 -42.4 0 -42.4 C4 -42.4 7.4 -40 7.6 -34 C6 -38.4 3.4 -40.2 0 -40.2 C-3.4 -40.2 -6 -38.4 -7.6 -34 Z" fill="#eceef8"/>
      <path d="M-1.2 -34.4 Q0 -35.4 1.2 -34.4" stroke="#8a5a34" stroke-width="1" fill="none"/>
      <circle cx="-3.9" cy="-33.8" r="2.9" fill="#3a2a22" stroke="#9a6638" stroke-width="1"/><circle cx="3.9" cy="-33.8" r="2.9" fill="#3a2a22" stroke="#9a6638" stroke-width="1"/>
      <path d="M-5.6 -35 Q-4.6 -36 -3.4 -35.8 M2.2 -35 Q3.2 -36 4.4 -35.8" stroke="#fff" stroke-opacity=".55" stroke-width=".8" fill="none" stroke-linecap="round"/>
      <path d="M0.2 -31 Q0.9 -29.8 0 -29.4" stroke="#e0a688" stroke-width=".7" fill="none" stroke-linecap="round"/>
      <ellipse cx="-5" cy="-29" rx="1.5" ry=".9" fill="#ff9cb0" opacity=".45"/><ellipse cx="5" cy="-29" rx="1.5" ry=".9" fill="#ff9cb0" opacity=".45"/>
      <path d="M-2.2 -27.4 Q0.2 -25.9 2.6 -27.8" stroke="#b5475a" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path d="M7.2 -18.6 Q10.4 -18.4 11.2 -22" stroke="${chemise}" stroke-width="4.4" stroke-linecap="round" fill="none"/>
      <path d="M8 -17 Q11.4 -17.4 12.6 -20.6" stroke="${rayure}" stroke-width=".55" fill="none"/>
      <path d="M10.6 -24.6 L9.5 -29 M12.2 -24.6 L13.6 -28.8" stroke="${peau}" stroke-width="1.7" stroke-linecap="round"/>
      <circle cx="11.4" cy="-23.6" r="2.4" fill="${peau}"/>
      <path d="M10.2 -23 Q11.4 -22 12.6 -23" stroke="#e0a688" stroke-width=".6" fill="none"/>`;
}

// Rachou, d'après sa photo : cheveux bruns courts et ébouriffés, lunettes de
// soleil posées sur la tête, créoles dorées, chemise rose saumon à col.
// Pas encore placée au marché : ajouter { rachou: true } dans LOOKS.
export function corpsRachou(assis = false) {
  const peau = '#eec4a6';
  const cheveux = '#4a3226';
  const reflet = '#7d553a';
  const rose = '#f0918a';
  const roseFonce = '#d9736e';
  const or = '#e0b44c';
  const jambes = assis
    ? `<ellipse cx="-4" cy="-8" rx="4.4" ry="3" fill="#39415f"/><ellipse cx="4" cy="-8" rx="4.4" ry="3" fill="#39415f"/><ellipse cx="-6" cy="-5" rx="3" ry="2" fill="#3b2a52"/><ellipse cx="6" cy="-5" rx="3" ry="2" fill="#3b2a52"/>`
    : `<rect x="-5.5" y="-10" width="4.4" height="9" rx="2" fill="#39415f"/><rect x="1.1" y="-10" width="4.4" height="9" rx="2" fill="#39415f"/><ellipse cx="-3.4" cy="-1" rx="3.4" ry="2" fill="#f4f1ea"/><ellipse cx="3.4" cy="-1" rx="3.4" ry="2" fill="#f4f1ea"/>`;
  return `
      ${jambes}
      <path d="M-7.5 -19 Q-10 -15 -9.5 -11" stroke="${rose}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="-9.4" cy="-10.4" r="2.4" fill="${peau}"/>
      <path d="M7.5 -19 Q10 -15 9.5 -11" stroke="${rose}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="9.4" cy="-10.4" r="2.4" fill="${peau}"/>
      <path d="M-8 -9 Q-9 -21 -6 -23 H6 Q9 -21 8 -9 Z" fill="${rose}"/>
      <path d="M-2.8 -23 L0 -18.4 L2.8 -23 Z" fill="${peau}"/>
      <path d="M-6 -23.6 L-2.8 -23 L0 -18.4 L-3.6 -19.2 Z M6 -23.6 L2.8 -23 L0 -18.4 L3.6 -19.2 Z" fill="${rose}" stroke="${roseFonce}" stroke-width=".7" stroke-linejoin="round"/>
      <path d="M0 -18 V-9.6" stroke="${roseFonce}" stroke-width=".7"/>
      <circle cx="0" cy="-15.6" r=".55" fill="#fff"/><circle cx="0" cy="-12.4" r=".55" fill="#fff"/>
      <circle cx="-10.1" cy="-32" r="2.2" fill="${peau}"/><circle cx="10.1" cy="-32" r="2.2" fill="${peau}"/>
      <circle cx="-10.4" cy="-28.4" r="1.7" fill="none" stroke="${or}" stroke-width=".95"/><circle cx="10.4" cy="-28.4" r="1.7" fill="none" stroke="${or}" stroke-width=".95"/>
      <ellipse cx="0" cy="-33" rx="10" ry="11" fill="${peau}"/>
      <path d="M-10.6 -31.4 C-12.6 -36 -12 -42 -8.4 -44.6 C-8.6 -47 -5.6 -48.6 -3.2 -47.4 C-1.6 -49.8 2.6 -50 4.4 -47.8 C7.2 -48.8 10 -46.8 9.8 -44 C12.6 -41.6 12.6 -36 10.6 -31.4 C10.4 -34.4 9.4 -36.6 7.8 -38 C5.4 -39.8 2.4 -39 0 -40.4 C-2.6 -39 -5.8 -39.8 -7.8 -37.6 C-9.4 -36.2 -10.4 -34.2 -10.6 -31.4 Z" fill="${cheveux}"/>
      <path d="M-9 -40 C-7 -43.4 -3.6 -44.6 -0.6 -44 M2 -45.6 C4.6 -45.8 7 -44.4 8.4 -42.2 M-10.2 -36.4 C-9.8 -38 -9 -39.2 -8 -40" stroke="${reflet}" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path d="M-11.4 -36.6 l-1.6 -.8 M11.4 -36.6 l1.6 -.8 M-11 -39.4 l-1.4 -1.2 M11 -39.4 l1.4 -1.2" stroke="${cheveux}" stroke-width="1.2" stroke-linecap="round"/>
      <g transform="rotate(-6 0 -44.6)">
        <rect x="-7.4" y="-46.8" width="6" height="4.2" rx="2" fill="#5d6b7d" stroke="#c9ccd4" stroke-width=".8"/>
        <rect x="1.4" y="-46.8" width="6" height="4.2" rx="2" fill="#5d6b7d" stroke="#c9ccd4" stroke-width=".8"/>
        <path d="M-1.4 -45 Q0 -45.8 1.4 -45 M-7.4 -44.8 L-10 -42.6 M7.4 -44.8 L10 -42.6" stroke="#c9ccd4" stroke-width=".8" fill="none" stroke-linecap="round"/>
        <path d="M-6.2 -45.8 L-4.6 -45.8 M2.6 -45.8 L4.2 -45.8" stroke="#fff" stroke-opacity=".6" stroke-width=".7" stroke-linecap="round"/>
      </g>
      <path d="M-6.6 -36.4 Q-4.4 -37.8 -2.2 -36.8 M2.2 -36.8 Q4.4 -37.8 6.6 -36.4" stroke="${cheveux}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <circle cx="-4" cy="-33" r="1.6" fill="#6b4a32" stroke="${ENCRE}" stroke-width=".7"/><circle cx="4" cy="-33" r="1.6" fill="#6b4a32" stroke="${ENCRE}" stroke-width=".7"/>
      <circle cx="-4" cy="-33" r=".7" fill="${ENCRE}"/><circle cx="4" cy="-33" r=".7" fill="${ENCRE}"/>
      <circle cx="-3.4" cy="-33.6" r=".45" fill="#fff"/><circle cx="4.6" cy="-33.6" r=".45" fill="#fff"/>
      <path d="M0.3 -31.4 Q1.3 -29.6 0 -29.2" stroke="#d99c7c" stroke-width=".8" fill="none" stroke-linecap="round"/>
      <ellipse cx="-6.8" cy="-28.8" rx="1.9" ry="1.1" fill="#ff9cb0" opacity=".5"/><ellipse cx="6.8" cy="-28.8" rx="1.9" ry="1.1" fill="#ff9cb0" opacity=".5"/>
      <path d="M-3 -26.8 Q0 -24.6 3 -26.8" stroke="#a8384a" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
}

/** Un joueur du marché, origine aux pieds, avec son pseudo au-dessus. */
function joueur(nom, look, { x, y, assis = false, coucou = false, flane = false, coeur = false }) {
  const { peau, cheveux, haut, bas, coiffe } = look;
  const jambes = assis
    ? `<ellipse cx="-4" cy="-8" rx="4.4" ry="3" fill="${bas}"/><ellipse cx="4" cy="-8" rx="4.4" ry="3" fill="${bas}"/><ellipse cx="-6" cy="-5" rx="3" ry="2" fill="#3b2a52"/><ellipse cx="6" cy="-5" rx="3" ry="2" fill="#3b2a52"/>`
    : `<rect x="-5.5" y="-10" width="4.4" height="9" rx="2" fill="${bas}"/><rect x="1.1" y="-10" width="4.4" height="9" rx="2" fill="${bas}"/><ellipse cx="-3.4" cy="-1" rx="3.4" ry="2" fill="#3b2a52"/><ellipse cx="3.4" cy="-1" rx="3.4" ry="2" fill="#3b2a52"/>`;
  const brasD = coucou
    ? `<g class="e5-coucou"><path d="M7 -19 Q12 -24 13 -31" stroke="${haut}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="13" cy="-32.5" r="2.7" fill="${peau}"/></g>`
    : `<path d="M7.5 -19 Q10 -15 9.5 -11" stroke="${haut}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="9.4" cy="-10.4" r="2.5" fill="${peau}"/>`;
  const l = Math.round(16 + nom.length * 5.6);
  const corps = look.clement ? `<g transform="scale(1.1)">${corpsClement(coucou)}</g>` : look.estel ? corpsEstel(assis) : look.chachoux ? corpsChachoux(assis) : look.angeloune ? corpsAngeloune(assis) : look.rachou ? corpsRachou(assis) : `
      ${jambes}
      <path d="M-8 -9 Q-9 -21 -6 -23 H6 Q9 -21 8 -9 Z" fill="${haut}"/>
      <path d="M-7.5 -19 Q-10 -15 -9.5 -11" stroke="${haut}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="-9.4" cy="-10.4" r="2.5" fill="${peau}"/>
      ${brasD}
      <circle cx="0" cy="-33" r="11" fill="${peau}"/>
      ${coiffure(coiffe, cheveux)}
      <circle cx="-3.8" cy="-32" r="1.5" fill="${ENCRE}"/><circle cx="3.8" cy="-32" r="1.5" fill="${ENCRE}"/>
      <ellipse cx="-6.8" cy="-28.6" rx="2" ry="1.2" fill="#ff9cc8" opacity=".8"/><ellipse cx="6.8" cy="-28.6" rx="2" ry="1.2" fill="#ff9cc8" opacity=".8"/>
      <path d="M-2 -27.6 Q0 -26 2 -27.6" stroke="${ENCRE}" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  const hautTag = assis ? -54 : look.clement ? -66 : -56;
  const petitCoeur = coeur ? `<g transform="translate(${l / 2 + 6} ${hautTag - 2})"><g class="e5-petit-coeur"><path d="M0 4 C-4 1 -5 -1.6 -3.2 -2.6 C-1.8 -3.2 -0.6 -2.4 0 -1.6 C0.6 -2.4 1.8 -3.2 3.2 -2.6 C5 -1.6 4 1 0 4 Z" fill="#ff7ab8"/></g></g>` : '';
  return `
  <g transform="translate(${x} ${y})">
    <g class="${flane ? 'e5-flane' : ''}">
      <ellipse cx="0" cy="0" rx="10" ry="3.6" fill="#2a1745" opacity=".16"/>
      <g class="e5-joueur${assis ? '' : ' e5-respire'}">${corps}</g>
      <g transform="translate(0 ${hautTag})">
        <rect x="${-l / 2}" y="-8" width="${l}" height="15" rx="7.5" fill="#1a1026" fill-opacity=".72"/>
        <text y="3.2" text-anchor="middle" font-size="9.5" font-weight="600" fill="#fff">${nom}</text>
      </g>
      ${petitCoeur}
    </g>
  </g>`;
}

function tonneau(x, y) {
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="2" rx="14" ry="6" fill="#2a1745" opacity=".12"/>
    <path d="M-11 -2 Q-13 -13 -11 -24 H11 Q13 -13 11 -2 A11 5 0 0 1 -11 -2 Z" fill="#a86f3f"/>
    <path d="M-12.4 -8 A12.4 5 0 0 0 12.4 -8 M-12.4 -18 A12.4 5 0 0 0 12.4 -18" stroke="#5a3a26" stroke-width="2" fill="none"/>
    <ellipse cx="0" cy="-24" rx="11" ry="5" fill="#c98d55" stroke="#5a3a26" stroke-width="1.6"/>
  </g>`;
}

function caisses(x, y, k1, k2) {
  const c = { devant: '#c98d55', cote: '#a86f3f', dessus: '#e2b47c' };
  const [ax, ay] = iso(0.55, 0.5, 10);
  const [bx, by] = iso(1.75, 0.5, 10);
  return `<g transform="translate(${x} ${y})">
    ${face([[-0.2, -0.2, 0], [2.5, -0.2, 0], [2.5, 1.3, 0], [-0.2, 1.3, 0]], '#2a1745', ' opacity=".1"')}
    ${boite(0, 0, 1.1, 1.0, 0, 10, c)}${boite(1.2, 0, 1.1, 1.0, 0, 10, c)}
    <g transform="translate(${ax} ${ay - 6}) scale(.44)">${ARTICLES[k1].dessin()}</g>
    <g transform="translate(${bx} ${by - 6}) scale(.44)">${ARTICLES[k2].dessin()}</g>
  </g>`;
}

function papillonVolant(x, y, couleur, delai) {
  const aile = `<path d="M0 0 C3 -8 10 -9 10 -3 C10 1 5 2 0 0 Z" fill="${couleur}"/><path d="M0 0 C4 1 8 4 6 7 C4 9 1 6 0 0 Z" fill="${couleur}" opacity=".85"/>`;
  return `<g transform="translate(${x} ${y})"><g class="e5-vol-papillon" style="animation-delay:${delai}s">
    <g class="e5-battement">${aile}<g transform="scale(-1 1)">${aile}</g></g>
    <ellipse cx="0" cy="1" rx="1.2" ry="4" fill="${ENCRE}"/>
  </g></g>`;
}

/** La place du marché. etals : [{ cle, nom, couleur, fonce, articles }]. */
export function marche(etals, joueurs, texteCafe) {
  const { centre: c, demi } = MARCHE;
  const place = `M${c.x} ${c.y - demi.h} L${c.x + demi.l} ${c.y} L${c.x} ${c.y + demi.h} L${c.x - demi.l} ${c.y} Z`;
  const [n1, n3, n4, n5, n6, n7, n8] = joueurs;
  return `
  <rect x="-1400" y="-1400" width="3200" height="3360" fill="url(#e5-herbe)"/>
  <path d="${place}" fill="#cdbb98" stroke="#cdbb98" stroke-width="16" stroke-linejoin="round"/>
  <path d="${place}" fill="url(#e5-dalles)" stroke="#e9dcc3" stroke-width="3" stroke-linejoin="round"/>
  ${fleurs(-150, 150)}${fleurs(560, 160)}${fleurs(-120, 470)}${fleurs(540, 450)}${fleurs(30, 70)}${fleurs(372, 530)}
  ${buisson(-40, 120)}${buisson(450, 118, 1.1)}${buisson(-60, 500)}${buisson(470, 520)}
  ${arbre(18, 92, 0.95, true)}${arbre(384, 88)}${arbre(-120, 250, 1.1)}${arbre(-200, 400)}${arbre(530, 260, 1.05, true)}${arbre(610, 400)}
  ${arbre(-30, 600)}${arbre(440, 610, 1.05)}${arbre(-280, 140, 0.9)}${arbre(680, 150, 0.9)}${arbre(-320, 560)}${arbre(720, 560, 0.95)}
  ${arbre(200, -10, 0.9)}${arbre(80, -40, 0.85, true)}${arbre(320, -36, 0.85)}${arbre(200, 660, 0.95)}
  ${tableau(200, 108)}
  ${papillonVolant(40, 64, '#b48cff', 0)}${papillonVolant(360, 552, '#ff9cc8', -2.4)}${papillonVolant(-100, 440, '#8f5cf7', -1.2)}
  ${MARCHE.etals.slice(0, 2).map((p, i) => etal(etals[i], p)).join('')}
  ${lampadaire(36, 312)}${lampadaire(364, 312)}
  ${caisses(-118, 296, 'rhubarbe', 'oeufs')}${tonneau(-60, 360)}${tonneau(-40, 372)}
  ${caisses(470, 250, 'lait', 'farine')}${tonneau(500, 352)}
  ${joueur(n5 || '', LOOKS[4], { x: -70, y: 236, flane: true })}
  ${joueur(n6 || '', LOOKS[5], { x: 430, y: 330 })}
  <g transform="translate(126 298)"><ellipse rx="10" ry="3.6" fill="#2a1745" opacity=".16"/><g class="e5-respire">${cyrielNatte()}</g>
    <g transform="translate(0 -58)"><rect x="-46" y="-8" width="92" height="15" rx="7.5" fill="#7a3cf0" fill-opacity=".85"/><text y="3.2" text-anchor="middle" font-size="9.5" font-weight="600" fill="#fff">Cycy la famille</text></g></g>
  <g transform="translate(${c.x} ${c.y})">${fontaine()}</g>
  ${joueur(n3 || '', LOOKS[2], { x: 332, y: 292, flane: true })}
  ${joueur(n1 || '', LOOKS[0], { x: 246, y: 348, coucou: true, coeur: true })}
  ${joueur(n7 || '', LOOKS[6], { x: 74, y: 340 })}
  ${joueur(n8 || '', LOOKS[7], { x: 318, y: 336 })}
  ${MARCHE.etals.slice(2).map((p, i) => etal(etals[i + 2], p)).join('')}
  ${banc(178, 446)}
  ${joueur(n4 || '', LOOKS[3], { x: 202, y: 460, assis: true })}
  ${poteauCafe(MARCHE.versCafe.x, MARCHE.versCafe.y, texteCafe)}`;
}

/* ======================================================= Écran d'accueil */

export function affiche() {
  return `
  <ellipse cx="6" cy="50" rx="132" ry="8" fill="#2a1745" opacity=".1"/>
  <g transform="translate(58 8) scale(3.4)">${tasse({ vapeur: false })}</g>
  <path d="M58 -22 C52 -28 50 -34 54 -38 C59 -43 54 -49 58 -55" fill="none" stroke="#b48cff" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 -60 C46 -72 44 -90 56 -93 C61 -94 63 -90 63 -87 C64 -90 67 -94 72 -93 C84 -90 80 -72 60 -60 Z" fill="none" stroke="#b48cff" stroke-width="3" stroke-linejoin="round"/>
  <g transform="translate(-68 -24) scale(1.8)"><g class="e5-flotte">${pipistrelle({ plat: gateau() })}</g></g>`;
}
