// Dessins du café (étape 5), faits à la main en SVG.
//
// Chaque fonction renvoie un morceau de SVG sous forme de texte. Sauf
// mention contraire, (0, 0) est le centre du dessin, qui tient dans un
// carré d'environ 48 × 48. Les personnages ont leur origine aux pieds.
// La salle et le marché ont chacun leur cadre (CADRE_CAFE, CADRE_MARCHE),
// qui tient toujours à l'écran ; le décor déborde largement autour.

import { cheminChiffre } from '../chiffres.js';
import { duoSpeleo, cyrielChapeau, cyrielClin, cyrielNatte } from './clins-doeil.js';


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
function vanille() {
  const fleur = [0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6.4" rx="4.2" ry="6.6" transform="rotate(${a})" fill="#fffdf6" stroke="#e2d6bb" stroke-width=".8"/>`).join('');
  return `
  <path d="M-18 13 C-9 1 4 -10 18 -16" stroke="#4a2a14" stroke-width="4.4" fill="none" stroke-linecap="round"/>
  <path d="M-16 17 C-5 7 8 -2 19 -6" stroke="#5c361b" stroke-width="3.8" fill="none" stroke-linecap="round"/>
  <path d="M-13 10 C-5 2 4 -6 13 -11" stroke="#8a5a32" stroke-width="1" fill="none" opacity=".7"/>
  <g transform="translate(5 3)">${fleur}<circle r="2.9" fill="#f5c842"/></g>`;
}

// Les ingrédients des recettes de la maquette du livre (salade du jardin,
// soupe à la tomate, omelette, mousse au chocolat) et leurs épices.
function tomates() {
  return `
  <circle cx="-5" cy="3" r="11.5" fill="#e8402e"/>
  <path d="M-12 -2 Q-13 6 -7 11" stroke="#fff" stroke-opacity=".3" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M-5 -8.4 L-8.6 -12 L-5.4 -10.4 L-4.6 -14 L-3 -10.2 L0.4 -12.2 L-2 -8.4 Z" fill="#3f8a4c"/>
  <circle cx="9" cy="8" r="9.6" fill="#f0503b" stroke="#c8301f" stroke-width="1"/>
  <circle cx="9" cy="8" r="7.4" fill="#ff8a6e"/>
  <path d="M9 8 L9 1.4 M9 8 L15.2 10.4 M9 8 L3 11.4" stroke="#f0503b" stroke-width="1.6"/>
  <g fill="#ffe2a8"><ellipse cx="6.4" cy="4.6" rx="1" ry="1.5"/><ellipse cx="12.4" cy="6" rx="1.4" ry="1"/><ellipse cx="9.4" cy="12.2" rx="1.4" ry="1"/></g>`;
}

function oignon() {
  return `
  <path d="M-4 -16 Q-6 -10 -12 -6 Q-19 0 -15 10 Q-11 18 -3 18 Q5 18 8 10 Q11 1 4 -6 Q-1 -10 -2 -16 Z" fill="#e8b54e" stroke="#b9862a" stroke-width="1.2"/>
  <path d="M-3 -16 Q-2 -20 0 -21" stroke="#9a7a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M-3 -10 Q-9 0 -6 17 M-3 -10 Q2 0 0 17" stroke="#c9952f" stroke-width="1" fill="none"/>
  <path d="M-11 -2 Q-13 5 -10 10" stroke="#fff" stroke-opacity=".4" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="12" cy="10" rx="8.4" ry="7.4" fill="#f4dc9c" stroke="#b9862a" stroke-width="1.1"/>
  <ellipse cx="12" cy="10" rx="5.6" ry="4.8" fill="none" stroke="#e2bf6a" stroke-width="1"/>
  <ellipse cx="12" cy="10" rx="2.6" ry="2.2" fill="none" stroke="#e2bf6a" stroke-width="1"/>`;
}

function salade() {
  return `
  <path d="M-16 14 C-22 2 -16 -12 -4 -18 C2 -21 10 -19 14 -13 C20 -6 19 4 13 11 C7 17 -4 19 -16 14 Z" fill="#7cc54b"/>
  <path d="M-16 14 C-12 4 -11 -6 -4 -18 M-9 9 C-6 2 -1 -4 4 -9 M-5 15 C1 9 7 3 12 -5" stroke="#4f9a2c" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M-16 14 Q-12 12 -9 9 Q-4 4 -2 -3" stroke="#e7f6c9" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M-4 -18 Q-1 -14 4 -15 Q7 -11 11 -12 Q13 -8 17 -7" stroke="#a7dc72" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
}

function creme() {
  return `
  <path d="M-13 -6 L-11 15 Q-11 18 -8 18 H8 Q11 18 11 15 L13 -6 Z" fill="#fdfcf8" stroke="#c4cfe3" stroke-width="1.5"/>
  <rect x="-12.2" y="0" width="24.4" height="9" fill="#5b8fd8"/>
  <path d="M-7 4.4 H7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M-13 -6 Q-13 -11 -6 -11 Q-4 -17 2 -15 Q8 -16 8 -11 Q14 -11 13 -6 Z" fill="#fffef9" stroke="#e2dccd" stroke-width="1.2"/>
  <path d="M-2 -15 Q2 -21 4 -17" stroke="#e2dccd" stroke-width="1.2" fill="#fffef9"/>`;
}

function persil() {
  const feuille = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 C-5 -2 -6 -8 -2 -10 C-1 -14 4 -14 4 -10 C8 -9 8 -3 4 -1 C3 1 1 1 0 0 Z" fill="#4fae3e" stroke="#2f7d26" stroke-width=".8"/></g>`;
  return `
  <path d="M-10 18 Q-6 4 -2 -6 M-10 18 Q-4 6 6 -2 M-10 18 Q-12 4 -12 -4" stroke="#5a9a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  ${feuille(-2, -6, -10)}${feuille(6, -2, 30)}${feuille(-12, -4, -40)}${feuille(4, -14, 5)}${feuille(-8, -14, -25)}`;
}

function basilic() {
  const feuille = (x, y, r, c) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 12 C-9 6 -9 -6 0 -14 C9 -6 9 6 0 12 Z" fill="${c}" stroke="#2d7a2a" stroke-width="1"/><path d="M0 11 V-12 M0 2 L-4 -2 M0 -4 L4 -8 M0 6 L4 2" stroke="#2d7a2a" stroke-width=".8" fill="none"/></g>`;
  return `${feuille(-8, 3, -35, '#57b84a')}${feuille(8, 3, 35, '#4caa40')}${feuille(0, -3, 0, '#66c657')}
  <path d="M0 18 V9" stroke="#3f8a2c" stroke-width="2" stroke-linecap="round"/>`;
}

function piment() {
  return `
  <path d="M-15 12 C-10 15 0 14 8 6 C13 1 15 -6 13 -11 C10 -13 7 -11 6 -7 C4 0 -2 6 -9 7 C-13 8 -17 9 -15 12 Z" fill="#e5302f" stroke="#a81c1f" stroke-width="1"/>
  <path d="M-10 10 C-3 9 4 4 8 -4" stroke="#fff" stroke-opacity=".35" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M6 -8 Q9 -12 13 -11 Q15 -9 14 -7" fill="#3f8a4c"/>
  <path d="M11 -11 Q12 -17 16 -19" stroke="#3f8a4c" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
}

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
  tomates: { nom: 'Tomates', defini: 'les tomates', partitif: 'des tomates', de: 'de tomates', pluriel: true, dessin: tomates },
  oignon: { nom: 'Oignon', defini: 'l’oignon', partitif: 'de l’oignon', de: 'd’oignon', dessin: oignon },
  salade: { nom: 'Salade', defini: 'la salade', partitif: 'de la salade', de: 'de salade', dessin: salade },
  creme: { nom: 'Crème fraîche', defini: 'la crème fraîche', partitif: 'de la crème fraîche', de: 'de crème fraîche', dessin: creme },
  vanille: { nom: 'Vanille', defini: 'la vanille', partitif: 'de la vanille', de: 'de vanille', dessin: vanille },
  persil: { nom: 'Persil', defini: 'le persil', partitif: 'du persil', de: 'de persil', dessin: persil },
  basilic: { nom: 'Basilic', defini: 'le basilic', partitif: 'du basilic', de: 'de basilic', dessin: basilic },
  piment: { nom: 'Piment', defini: 'le piment', partitif: 'du piment', de: 'de piment', dessin: piment },
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

/** Salade du jardin, dans son saladier en verre. */
export function saladier() {
  return `
  <ellipse cx="0" cy="11" rx="16" ry="3.4" fill="#2a1745" opacity=".1"/>
  <path d="M-17 -2 Q-16 11 0 12 Q16 11 17 -2 Z" fill="#d9f0f7" stroke="#9ccbe0" stroke-width="1.2"/>
  <path d="M-15 -3 C-15 -10 -8 -13 -3 -10 C0 -15 9 -14 10 -9 C15 -10 18 -6 16 -2 Z" fill="#7cc54b"/>
  <path d="M-9 -9 Q-6 -5 -2 -8 M4 -11 Q6 -6 11 -8" stroke="#4f9a2c" stroke-width="1.2" fill="none"/>
  <path d="M-11 -3 L-6 -8 L-3 -3 Z" fill="#f0503b"/><path d="M2 -3 L7 -9 L10 -3 Z" fill="#e8402e"/>
  <ellipse cx="-1" cy="-4" rx="3" ry="2" fill="#f4dc9c"/>
  <path d="M-12 2 Q-10 7 -5 9" stroke="#fff" stroke-opacity=".7" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}

/** Soupe à la tomate, avec sa spirale de crème et une feuille de basilic. */
export function soupe({ vapeur = 'blanc' } = {}) {
  const couleur = vapeur === 'lilas' ? '#b48cff' : '#ffffff';
  const fumee = vapeur ? `
  <g class="e5-vapeur" stroke="${couleur}" stroke-width="1.8" fill="none" stroke-linecap="round">
    <path d="M-4 -9 q-2 -3 0 -6 q2 -3 0 -6"/>
    <path d="M4 -9 q-2 -3 0 -6 q2 -3 0 -6" style="animation-delay:-.9s"/>
  </g>` : '';
  return `${fumee}
  <ellipse cx="0" cy="11" rx="17" ry="3.6" fill="#ffffff" stroke="#e3d6c2" stroke-width="1.2"/>
  <path d="M-15 -3 Q-14 10 0 10.6 Q14 10 15 -3 Z" fill="#7fb35a"/>
  <path d="M-11 4 Q-6 8 0 8" stroke="#a8d27f" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-3" rx="15" ry="4.6" fill="#99c870"/>
  <ellipse cx="0" cy="-3" rx="12.4" ry="3.4" fill="#d9362a"/>
  <path d="M-6 -3 Q-2 -6 2 -4 Q4 -2 0 -1.6 Q-3 -1.4 -2 -3" stroke="#fff6ee" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M5 -4 C7 -7 11 -6 11 -4 C9 -2 7 -2 5 -4 Z" fill="#3f9a3a"/>`;
}

/** Omelette pliée, avec un brin de persil. */
export function omelette() {
  return `
  <ellipse cx="0" cy="9" rx="18" ry="4.6" fill="#ffffff" stroke="#c9d8e8" stroke-width="1.2"/>
  <ellipse cx="0" cy="9" rx="13" ry="3" fill="none" stroke="#dbe7f2" stroke-width="1"/>
  <path d="M-14 6 Q-13 -6 0 -7 Q13 -7 14 5 Q0 9 -14 6 Z" fill="#f2c94c" stroke="#d9a72a" stroke-width="1"/>
  <path d="M-10 4 Q-8 -3 1 -4 Q10 -4 11 3" stroke="#e0b23a" stroke-width="1" fill="none"/>
  <ellipse cx="-5" cy="-2" rx="2.2" ry="1" fill="#fbe08a"/>
  <path d="M7 -5 C9 -8 12 -7 12 -5 C10 -3 8 -3 7 -5 Z M10 -6 C11 -9 14 -9 14 -7" fill="#4fae3e"/>`;
}

/** Mousse au chocolat dans sa coupe, avec chantilly et cerise. */
export function mousse() {
  return `
  <ellipse cx="0" cy="12" rx="15" ry="3.4" fill="#ffffff" stroke="#c9d8e8" stroke-width="1.2"/>
  <path d="M-8 11.6 Q-2 9.8 0 5 Q2 9.8 8 11.6 Z" fill="#dff0f8" stroke="#9ccbe0" stroke-width="1"/>
  <path d="M0 5 V-1" stroke="#9ccbe0" stroke-width="2.2"/>
  <path d="M-13 -9 Q-12 2 0 2 Q12 2 13 -9 Z" fill="#dff0f8" stroke="#9ccbe0" stroke-width="1.2"/>
  <path d="M-12 -9 Q-11 0 0 0.4 Q11 0 12 -9 Z" fill="#6b3d22"/>
  <path d="M-13 -9 C-13 -15 -7 -16 -4 -13 C-2 -18 5 -18 6 -13 C10 -16 15 -13 13 -9 Z" fill="#7b4a2d"/>
  <path d="M-6 -13 C-7 -18 -1 -20 1 -17 C3 -21 9 -18 7 -14 Z" fill="#fffaf2" stroke="#e8dcc8" stroke-width=".8"/>
  <path d="M2 -20 Q4 -25 8 -25" stroke="#4f9a2c" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <circle cx="1.5" cy="-19.6" r="3" fill="#e5304f"/><circle cx="0.6" cy="-20.6" r=".9" fill="#ff9aa8"/>
  <path d="M-9 -6 Q-9 -2 -6 -1" stroke="#fff" stroke-opacity=".6" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
}

export const PLATS = { tasse, gateau, tarte, crepes, saladier, soupe, omelette, mousse };

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

/* ============================================ Étapes au fourneau (icônes) */

// Ce que demande la bulle au-dessus du fourneau, une étape après l'autre
// (viewBox -24 -24 48 48, comme les ingrédients).

const bol = (contenu) => `
  <path d="M-18 -2 H18 Q17 15 0 15 Q-17 15 -18 -2 Z" fill="#f4f1fb" stroke="${ENCRE}" stroke-width="2"/>
  <ellipse cx="0" cy="-2" rx="18" ry="4.4" fill="${contenu}" stroke="${ENCRE}" stroke-width="2"/>
  <path d="M-12 3 Q-10 10 -4 12" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`;
const tourne = (d, pointe) => `
  <path d="${d}" stroke="#7a3cf0" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="${pointe}" stroke="#7a3cf0" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const poele = `
  <ellipse cx="-1" cy="13" rx="15" ry="5" fill="#3b3b45" stroke="${ENCRE}" stroke-width="2"/>
  <ellipse cx="-1" cy="12" rx="10.5" ry="3" fill="#56565f"/>
  <path d="M13 14 L22 19" stroke="${ENCRE}" stroke-width="3.6" stroke-linecap="round"/>`;

export const ICONES_GESTES = {
  remuer: () => `${bol('#7b4a2d')}
    <path d="M2 -4 L12 -21" stroke="#a86f3f" stroke-width="3.6" stroke-linecap="round"/>
    <ellipse cx="1" cy="-3" rx="4.6" ry="2.6" fill="#a86f3f"/>
    ${tourne('M-16 -12 A15 7 0 0 1 -4 -16', 'M-7 -19 L-3.6 -16 L-7.4 -13.4')}`,
  melanger: () => `${bol('#f2cf93')}
    <g transform="rotate(18 3 -4)">
      <path d="M3 -6 V-24" stroke="#a86f3f" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M3 -6 C-7 -4 -5 9 3 9 C11 9 13 -4 3 -6 Z M3 -6 C-2 -4 -1 8 3 9 C7 8 8 -4 3 -6 Z" fill="none" stroke="#8d97a3" stroke-width="1.8"/>
    </g>
    ${tourne('M-17 -11 A15 7 0 0 1 -6 -16', 'M-9 -19 L-5.6 -16 L-9.4 -13.4')}`,
  etaler: () => `
    <ellipse cx="0" cy="9" rx="20" ry="7.5" fill="#f3d9a4" stroke="${ENCRE}" stroke-width="2"/>
    <ellipse cx="-5" cy="8" rx="6" ry="2" fill="#fbe9c4"/>
    <g transform="rotate(-16 0 -3)">
      <rect x="-12" y="-8" width="24" height="10" rx="5" fill="#d9a066" stroke="${ENCRE}" stroke-width="2"/>
      <path d="M-12 -3 H-20 M12 -3 H20" stroke="${ENCRE}" stroke-width="3.8" stroke-linecap="round"/>
      <path d="M-7 -5.4 H5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>
    </g>`,
  enfourner: () => `
    <rect x="-18" y="-18" width="36" height="35" rx="5" fill="#e7e9ee" stroke="${ENCRE}" stroke-width="2"/>
    <rect x="-13" y="-6" width="26" height="17" rx="3" fill="#ff9a3c" stroke="${ENCRE}" stroke-width="1.8"/>
    <path d="M-8 10 Q-6 1 -3 6 Q0 -3 3 6 Q6 1 8 10 Z" fill="#ffd36b"/>
    <rect x="-12" y="-14" width="24" height="3.4" rx="1.7" fill="#9aa3ad"/>
    <circle cx="-11" cy="-21.5" r="0"/>`,
  verser: () => `${poele}
    <ellipse cx="-1" cy="11.6" rx="7" ry="2.2" fill="#f6cf8c"/>
    <path d="M-6 -1 Q-3 5 -1 10" stroke="#f6cf8c" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M-16 -11 Q-14 -1 -6 -2 Q2 -3 0 -11 Z" fill="#cfcadd" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M0 -11 L14 -23" stroke="#9e98b3" stroke-width="3.6" stroke-linecap="round"/>`,
  couper: () => `
    <path d="M-20 6 L2 -6 L20 4 L-2 16 Z" fill="#e7c08a" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="-4" cy="5" r="4.4" fill="#e8402e"/><circle cx="5" cy="1" r="3.6" fill="#f0503b"/><path d="M7 1 h4" stroke="#ff8a6e" stroke-width="3"/>
    <g transform="rotate(-38 4 -8)"><rect x="-6" y="-11" width="20" height="6" rx="1.6" fill="#dfe4ea" stroke="${ENCRE}" stroke-width="1.6"/><rect x="14" y="-11.6" width="9" height="7.2" rx="2" fill="#7b4a2d" stroke="${ENCRE}" stroke-width="1.6"/></g>`,
  retourner: () => `${poele}
    <ellipse cx="0" cy="-9" rx="12" ry="4.4" transform="rotate(-16 0 -9)" fill="#f6cf8c" stroke="#dea457" stroke-width="1.8"/>
    <ellipse cx="-3" cy="-9.6" rx="2" ry="1" fill="#dea457"/>
    ${tourne('M-17 6 A17 17 0 0 1 -13 -15', 'M-16.6 -11.4 L-13 -15.4 L-9 -13.6')}`,
};
// Les mêmes dessins pour des gestes voisins.
ICONES_GESTES.battre = ICONES_GESTES.melanger;
ICONES_GESTES.fondre = ICONES_GESTES.remuer;
ICONES_GESTES.plier = ICONES_GESTES.retourner;

/* =========================================================== Personnages */

function joues(x, y) {
  return `<ellipse cx="${-x}" cy="${y}" rx="2.7" ry="1.6" fill="#ff9cc8" opacity=".85"/><ellipse cx="${x}" cy="${y}" rx="2.7" ry="1.6" fill="#ff9cc8" opacity=".85"/>`;
}

/** Le machaon de l'étape 4, ailes ouvertes, vu de face : il accompagne
 *  Clément au café (il savait où aller). Origine sous le corps. */
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

/* ================================================================ Icônes */

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
    <pattern id="e5-herbe" width="64" height="34" patternUnits="userSpaceOnUse">
      <rect width="64" height="34" fill="#b4df4a"/>
      <path d="M8 12 l2 -5 l2 5 M40 28 l2 -5 l2 5 M52 9 l1.6 -4 l1.6 4 M24 22 l1.4 -3.4 l1.4 3.4" stroke="#9ccc3a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <circle cx="30" cy="8" r="1" fill="#c8ea6a"/><circle cx="58" cy="24" r="1" fill="#c8ea6a"/>
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
  };
}

export const LIEUX = {
  echelle: 0.72,                                   // taille des personnages dans la salle
  tables: TABLES_J.map((j) => pt(TABLE_I, j)),     // centre de chaque table, au sol
  dessus: HAUT_TABLE,                              // hauteur du plateau des tables
  sieges: TABLES_J.map((j) => pt(SIEGE_I, j)),     // pieds d'un client assis (cachés par la table)
  chemins: TABLES_J.map((j) => [pt(0.6, 11.4), pt(6, 11.4), pt(6, j), pt(SIEGE_I, j)]),
  porte: pt(0.5, 11.4),
  pipi: pt(5.4, 1.6, 46),                          // Pipistrelle au repos
  comptoir: [pt(4.2, 6, 14), pt(4.2, 4, 14), pt(4.2, 8, 14)],   // places des plats prêts
  feux: FEUX_J.slice(0, NB_FEUX).map(lieuxFeu),     // les fourneaux où l'on cuisine
  frigo: pt(1.6, 1.05, 26),
};

// Autour du café, comme sur la maquette de Clément (et le jeu d'origine) :
// l'herbe partout, la dalle claire sous la salle (avec sa tranche devant),
// les trottoirs dallés, et les deux rues qui se croisent derrière le coin du
// fond (bordures arrondies, tirets blancs). Devant à droite, la dalle
// s'agrandit en terrasse : le camion du chef pâtissier y est garé.
function rue() {
  const n = CA.n;
  const R0 = -9.4;
  const R1 = -3.6;           // la chaussée, de R0 à R1 (derrière chaque mur)
  const T0 = -10.8;          // le trottoir d'en face s'arrête là
  const C = (R0 + R1) / 2;   // l'axe des rues
  const L = 60;
  const r = 1.8;             // l'arrondi des coins de trottoir
  const ASPHALTE = '#c2b6a6';
  const TROTTOIR = '#e3dacc';
  const JOINT = '#cfc2ae';
  const BORD = '#ad9f8c';
  const DALLE = '#e6ddd1';
  const TRANCHE = '#cdc2b2';
  const TRANCHE2 = '#c2b6a5';
  const herbe = 'url(#e5-herbe)';
  const arc = (ci, cj, a0, a1) => Array.from({ length: 7 }, (_, k) => {
    const a = ((a0 + ((a1 - a0) * k) / 6) * Math.PI) / 180;
    return [ci + Math.cos(a) * r, cj + Math.sin(a) * r];
  });
  // la chaussée en croix, coins intérieurs arrondis
  const croix = [
    [R1, L], ...arc(R1 + r, R1 + r, 180, 270), [L, R1], [L, R0],
    ...arc(R1 + r, R0 - r, 90, 180), [R1, -L], [R0, -L],
    ...arc(R0 - r, R0 - r, 0, 90), [-L, R0], [-L, R1],
    ...arc(R0 - r, R1 + r, 270, 360), [R0, L],
  ];
  const ligne = (a, b, c = JOINT, w = 1) => `<path d="M${Q(...a)} L${Q(...b)}" stroke="${c}" stroke-width="${w}"/>`;
  // les joints des dalles du trottoir, en travers et dans la longueur
  let joints = '';
  for (let k = -24; k <= 24; k++) {
    const u = k * 1.5;
    if (u > R0 - r - 0.2 && u < R1 + r + 0.2) continue;   // pas dans le carrefour
    joints += ligne([T0, u], [R0, u]) + ligne([u, T0], [u, R0]);
    if (u < -0.6 || u > n + 1.2) joints += ligne([R1, u], [-0.6, u]) + ligne([u, R1], [u, -0.6]);
  }
  joints += ligne([-2.1, -L], [-2.1, R0 - r]) + ligne([-2.1, R1 + r], [-2.1, -0.6]) + ligne([-2.1, n + 1.2], [-2.1, L]);
  joints += ligne([-L, -2.1], [R0 - r, -2.1]) + ligne([R1 + r, -2.1], [-0.6, -2.1]) + ligne([n + 1.2, -2.1], [L, -2.1]);
  // les tirets blancs, au milieu des rues (pas dans le carrefour)
  const tirets = [-30, -27, -24, -21, -18, -15, -12, -1, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29]
    .map((u) => ligne([C, u], [C, u + 1.6], '#faf7f1', 3) + ligne([u, C], [u + 1.6, C], '#faf7f1', 3)).join('');
  // la terrasse du camion, devant à droite
  const t = { i0: n + 1.2, i1: n + 10.5, j0: 5.4, j1: n + 1.2 };
  let dallesTerrasse = '';
  for (let u = t.i0 + 1.5; u < t.i1; u += 1.5) dallesTerrasse += ligne([u, t.j0], [u, t.j1]);
  for (let v = t.j0 + 1.5; v < t.j1; v += 1.5) dallesTerrasse += ligne([t.i0, v], [t.i1, v]);
  return `
  <rect x="-1400" y="-1400" width="3200" height="3400" fill="${herbe}"/>
  ${qf([[T0, -L], [-0.6, -L], [-0.6, L], [T0, L]], TROTTOIR)}
  ${qf([[-L, T0], [L, T0], [L, -0.6], [-L, -0.6]], TROTTOIR)}
  ${qf(croix, ASPHALTE)}
  <path d="M${croix.map((q) => Q(...q)).join(' L')} Z" fill="none" stroke="${BORD}" stroke-width="1.4" stroke-linejoin="round"/>
  ${joints}${tirets}
  ${qf([[t.i0 - 0.1, t.j0], [t.i1, t.j0], [t.i1, t.j1 + 0.01], [t.i0 - 0.1, t.j1 + 0.01]], DALLE)}
  ${dallesTerrasse}
  ${qf([[t.i1, t.j0, 0], [t.i1, t.j1, 0], [t.i1, t.j1, -4], [t.i1, t.j0, -4]], TRANCHE)}
  ${qf([[t.i0, t.j1, 0], [t.i1, t.j1, 0], [t.i1, t.j1, -4], [t.i0, t.j1, -4]], TRANCHE2)}
  ${qf([[-0.6, -0.6], [n + 1.2, -0.6], [n + 1.2, n + 1.2], [-0.6, n + 1.2]], DALLE)}
  ${qf([[n + 1.2, -0.6, 0], [n + 1.2, n + 1.2, 0], [n + 1.2, n + 1.2, -4], [n + 1.2, -0.6, -4]], TRANCHE)}
  ${qf([[-0.6, n + 1.2, 0], [n + 1.2, n + 1.2, 0], [n + 1.2, n + 1.2, -4], [-0.6, n + 1.2, -4]], TRANCHE2)}`;
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
    <g transform="translate(35 -80) scale(.34)">${omelette()}</g>
    <g transform="translate(47 -80) scale(.34)">${crepes()}</g>
    <g transform="translate(59 -80) scale(.34)">${saladier()}</g>
    <g transform="translate(35 -67) scale(.34)">${soupe({ vapeur: false })}</g>
    <g transform="translate(47 -67) scale(.34)">${mousse()}</g>
    <g transform="translate(59 -67) scale(.34)">${tarte()}</g>
    <text x="47" y="-54" text-anchor="middle" font-size="6" fill="#f3f0ff" fill-opacity=".8">+ une surprise</text>
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

// La place du marché, d'après la capture du jeu d'origine : un grand pré en
// losange vu en isométrique, des murets de pierre aux deux coins, une
// fontaine à statue au milieu de sa haie, des pas japonais et des coins
// d'herbe usée. Quatre étals : la cabane de la crèmerie (store bleu et
// jaune), les cagettes du primeur (store rouge et orange), le panneau
// lumineux de l'épicerie (store violet, guirlande et ballons) et le kiosque
// de la cave (toit rouge et fanions). Autour : la girouette, la borne à
// incendie, le tableau d'affichage et son oiseau, le banc, l'oranger, et les
// joueurs, qui se promènent (voir animerPromeneurs).
// Repère isométrique : i vers le bas à droite, j vers le bas à gauche, z
// vers le haut. Les étals sont dessinés face à +j, et en miroir face à +i.

export const MARCHE = {
  centre: { x: 200, y: 292 },        // la fontaine, au centre de la place
  R: 13,                             // demi-côté de la place, en cases
  etals: {
    cremerie: { x: 58, y: 212, miroir: true },
    primeur: { x: 342, y: 212, miroir: false },
    cave: { x: 60, y: 378, miroir: true },
    epicerie: { x: 200, y: 180, miroir: false },
  },
  roue: { x: 346, y: 380 },          // le stand de la roue de la fortune (ballons PLAY)
  versCafe: { x: 200, y: 438 },
};
// Le cadre de la vue : les quatre étals, la roue, leurs enseignes et le
// panneau du café tiennent toujours à l'écran ; le pré déborde autour.
export const CADRE_MARCHE = { x: -14, y: 72, l: 428, h: 376 };

const ISO_A = 14;
const ISO_B = 7;
const iso = (i, j, z = 0) => [(i - j) * ISO_A, (i + j) * ISO_B - z];
const P = (i, j, z = 0) => iso(i, j, z).map((n) => n.toFixed(1)).join(' ');
const face = (pts, fill, extra = '') => `<path d="M${pts.map((p) => P(...p)).join(' L')} Z" fill="${fill}"${extra}/>`;
const OMBRE = '#2c5212';

// Pavé droit : base au point (i0, j0, z0), dimensions I × J × H.
function boite(i0, j0, I, J, z0, H, c, trait = '') {
  const z1 = z0 + H;
  const t = trait ? ` stroke="${trait}" stroke-width=".8" stroke-linejoin="round"` : '';
  return face([[i0, j0 + J, z0], [i0 + I, j0 + J, z0], [i0 + I, j0 + J, z1], [i0, j0 + J, z1]], c.devant, t)
    + face([[i0 + I, j0, z0], [i0 + I, j0 + J, z0], [i0 + I, j0 + J, z1], [i0 + I, j0, z1]], c.cote, t)
    + face([[i0, j0, z1], [i0 + I, j0, z1], [i0 + I, j0 + J, z1], [i0, j0 + J, z1]], c.dessus, t);
}

const poteau = (i, j, z0, z1, couleur, largeur = 3) => `<path d="M${P(i, j, z0)} L${P(i, j, z1)}" stroke="${couleur}" stroke-width="${largeur}" stroke-linecap="round"/>`;
const ombre = (i0, j0, i1, j1) => face([[i0, j0], [i1, j0], [i1, j1], [i0, j1]], OMBRE, ' opacity=".16"');

// Une face verticale en planches, le long de i (j fixe) ou de j (i fixe).
function planches(axe, fixe, a, b, z0, z1, couleur, trait, n) {
  const pt = (u, z) => (axe === 'i' ? [u, fixe, z] : [fixe, u, z]);
  let lignes = '';
  for (let k = 1; k < n; k++) {
    const u = a + ((b - a) * k) / n;
    lignes += `M${P(...pt(u, z0))} L${P(...pt(u, z1))} `;
  }
  return face([pt(a, z0), pt(b, z0), pt(b, z1), pt(a, z1)], couleur, ` stroke="${trait}" stroke-width=".9" stroke-linejoin="round"`)
    + (lignes ? `<path d="${lignes}" stroke="${trait}" stroke-width=".7" opacity=".55"/>` : '');
}

// Un store rayé, le long de i : de l'arrière (jb, zb) à l'avant (jf, zf),
// avec ses festons arrondis qui pendent devant.
function store({ a, b, jb, zb, jf, zf, n, c1, c2, trait }) {
  const w = (b - a) / n;
  let bandes = '';
  let festons = '';
  for (let k = 0; k < n; k++) {
    const u0 = a + k * w;
    const u1 = u0 + w;
    const c = k % 2 ? c2 : c1;
    bandes += face([[u0, jb, zb], [u1, jb, zb], [u1, jf, zf], [u0, jf, zf]], c);
    festons += `<path d="M${P(u0, jf, zf)} L${P(u1, jf, zf)} L${P(u1, jf, zf - 3)} Q${P((u0 + u1) / 2, jf, zf - 12)} ${P(u0, jf, zf - 3)} Z" fill="${c}" stroke="${trait}" stroke-width=".9" stroke-linejoin="round"/>`;
  }
  return `${bandes}
    ${face([[b, jb, zb], [b, jf, zf], [b, jf, zf - 4], [b, jb, zb - 4]], c1, ` stroke="${trait}" stroke-width=".9" stroke-linejoin="round"`)}
    <path d="M${P(a, jb, zb)} L${P(b, jb, zb)} L${P(b, jf, zf)} L${P(a, jf, zf)} Z" fill="none" stroke="${trait}" stroke-width="1.3" stroke-linejoin="round"/>
    ${festons}`;
}

// Un aliment posé sur un comptoir. sens : -1 dans un étal en miroir (le
// dessin reste à l'endroit).
function etalage(k, i, j, z, s, sens) {
  const [x, y] = iso(i, j, z);
  return `<g transform="translate(${x.toFixed(1)} ${(y - 5).toFixed(1)}) scale(${(s * sens).toFixed(2)} ${s})">${ARTICLES[k].dessin()}</g>`;
}

const BOIS = { devant: '#d9a352', cote: '#b98140', dessus: '#ecc47e' };
const BOIS_TRAIT = '#7a5226';

// La cabane de la crèmerie : murs en planches, fenêtres, comptoir et store.
function cabane(e, sens) {
  const a = -2.6;
  const b = 2.6;
  const j0 = -1.2;
  const j1 = 1.2;
  const [k1, k2, k3] = e.articles;
  const lignesComptoir = [-1.3, 0, 1.3].map((i) => `M${P(i, j1, 0)} L${P(i, j1, 18)}`).join(' ');
  return `
    ${ombre(a - 0.5, j0 - 0.4, b + 0.7, j1 + 1.2)}
    ${planches('i', j0, a, b, 0, 62, '#c08a43', BOIS_TRAIT, 8)}
    ${face([[a + 0.8, j0, 32], [b - 0.8, j0, 32], [b - 0.8, j0, 52], [a + 0.8, j0, 52]], '#a8dcef', ` stroke="${BOIS_TRAIT}" stroke-width="1.2"`)}
    <path d="M${P(0, j0, 32)} L${P(0, j0, 52)} M${P(a + 0.8, j0, 42)} L${P(b - 0.8, j0, 42)}" stroke="${BOIS_TRAIT}" stroke-width="1.1"/>
    ${planches('j', b, j0, j1, 0, 62, '#b37a37', BOIS_TRAIT, 3)}
    ${face([[b, j0 + 0.45, 30], [b, j1 - 0.45, 30], [b, j1 - 0.45, 48], [b, j0 + 0.45, 48]], '#94d0e8', ` stroke="${BOIS_TRAIT}" stroke-width="1.1"`)}
    ${boite(a, j1 - 0.9, b - a, 0.9, 0, 18, BOIS, BOIS_TRAIT)}
    <path d="${lignesComptoir}" stroke="${BOIS_TRAIT}" stroke-width=".8" opacity=".6"/>
    <g>
      ${face([[a + 0.25, j1 - 0.3, 18], [a + 0.95, j1 - 0.3, 18], [a + 0.95, j1 - 0.3, 31], [a + 0.25, j1 - 0.3, 31]], '#fffdf6', ' stroke="#b8a888" stroke-width=".6"')}
      <path d="M${P(a + 0.38, j1 - 0.3, 28)} L${P(a + 0.82, j1 - 0.3, 28)} M${P(a + 0.38, j1 - 0.3, 25)} L${P(a + 0.82, j1 - 0.3, 25)} M${P(a + 0.38, j1 - 0.3, 22)} L${P(a + 0.7, j1 - 0.3, 22)}" stroke="#9aa3ad" stroke-width=".8"/>
    </g>
    ${etalage(k1, -1.3, j1 - 0.45, 18, 0.42, sens)}${etalage(k2, 0.25, j1 - 0.45, 18, 0.42, sens)}${etalage(k3, 1.7, j1 - 0.45, 18, 0.42, sens)}
    ${poteau(a, j1, 18, 60, BOIS_TRAIT, 3.4)}${poteau(b, j1, 18, 60, BOIS_TRAIT, 3.4)}
    ${store({ a: a - 0.35, b: b + 0.35, jb: j0 - 0.25, zb: 67, jf: j1 + 0.85, zf: 56, n: 7, c1: e.couleur, c2: '#f6dc84', trait: e.fonce })}`;
}

// Une cagette en lattes, pleine d'un aliment.
function cagette(i0, j0, I, J, z0, H, k, sens) {
  const c = { devant: '#d39a55', cote: '#b07a3b', dessus: '#7c4f25' };
  const lattes = [z0 + H * 0.38, z0 + H * 0.72].map((z) => `M${P(i0, j0 + J, z)} L${P(i0 + I, j0 + J, z)}`).join(' ');
  return `${boite(i0, j0, I, J, z0, H, c, BOIS_TRAIT)}
    <path d="${lattes}" stroke="${BOIS_TRAIT}" stroke-width=".8" opacity=".7"/>
    ${etalage(k, i0 + I * 0.3, j0 + J * 0.5, z0 + H + 1, 0.34, sens)}${etalage(k, i0 + I * 0.72, j0 + J * 0.55, z0 + H + 1, 0.34, sens)}`;
}

// L'étal du primeur : des cagettes de légumes sous un store rouge et orange.
function etalPrimeur(e, sens) {
  const a = -2.8;
  const b = 2.8;
  const j0 = -1.3;
  const j1 = 1.3;
  const [k1, k2, k3, k4, k5] = e.articles;
  const piquet = '#6e4522';
  return `
    ${ombre(a - 0.5, j0 - 0.4, b + 0.7, j1 + 1.2)}
    ${poteau(a, j0, 0, 71, piquet, 2.8)}${poteau(b, j0, 0, 71, piquet, 2.8)}
    ${boite(a + 0.2, j0 + 0.1, b - a - 0.4, 1.2, 0, 12, BOIS, BOIS_TRAIT)}
    ${cagette(-2.5, j0 + 0.25, 1.6, 0.9, 12, 9, k1, sens)}${cagette(-0.8, j0 + 0.25, 1.6, 0.9, 12, 9, k2, sens)}${cagette(0.9, j0 + 0.25, 1.6, 0.9, 12, 9, k3, sens)}
    ${cagette(-2.3, j1 - 1.0, 1.75, 0.95, 0, 10, k4, sens)}${cagette(0.3, j1 - 1.0, 1.75, 0.95, 0, 10, k5, sens)}
    ${poteau(a, j1, 0, 63, piquet, 2.8)}${poteau(b, j1, 0, 63, piquet, 2.8)}
    ${store({ a: a - 0.3, b: b + 0.3, jb: j0 - 0.2, zb: 72, jf: j1 + 0.8, zf: 58, n: 6, c1: e.couleur, c2: '#fde2b2', trait: e.fonce })}`;
}

// L'épicerie : une étagère de bocaux et de sachets derrière un comptoir,
// sous un store violet et blanc.
function etagereEpicerie(e, sens) {
  const a = -2.4;
  const b = 2.4;
  const j0 = -1.1;
  const j1 = 1.1;
  const [k1, k2, k3, k4, k5] = e.articles;
  const planche = (z) => boite(a + 0.15, j0, b - a - 0.3, 0.6, z, 2.2, BOIS, BOIS_TRAIT);
  const bande = face([[a, j1, 9], [b, j1, 9], [b, j1, 13], [a, j1, 13]], e.couleur);
  return `
    ${ombre(a - 0.5, j0 - 0.4, b + 0.7, j1 + 1.1)}
    ${planches('i', j0, a, b, 0, 60, '#b98140', BOIS_TRAIT, 6)}
    ${planches('j', b, j0, j0 + 0.6, 0, 60, '#9a6634', BOIS_TRAIT, 1)}
    ${planche(24)}${planche(43)}
    ${etalage(k1, -1.45, j0 + 0.3, 45.2, 0.38, sens)}${etalage(k2, 0, j0 + 0.3, 45.2, 0.38, sens)}${etalage(k3, 1.45, j0 + 0.3, 45.2, 0.36, sens)}
    ${etalage(k4, -0.8, j0 + 0.3, 26.2, 0.38, sens)}${etalage(k5, 0.85, j0 + 0.3, 26.2, 0.38, sens)}
    ${boite(a, j1 - 0.9, b - a, 0.9, 0, 16, BOIS, BOIS_TRAIT)}
    ${bande}
    ${poteau(a, j1, 16, 58, BOIS_TRAIT, 3.2)}${poteau(b, j1, 16, 58, BOIS_TRAIT, 3.2)}
    ${store({ a: a - 0.3, b: b + 0.3, jb: j0 - 0.2, zb: 66, jf: j1 + 0.8, zf: 55, n: 7, c1: e.couleur, c2: '#fffaf2', trait: e.fonce })}`;
}

// Le stand de la roue de la fortune, comme dans le jeu d'origine : un grand
// panneau avec sa roue, entre deux poteaux, sous un store violet et jaune,
// avec une guirlande lumineuse et les ballons PLAY.
function panneauRoue() {
  const ia = -2.3;
  const ib = 2.3;
  const COULEURS = ['#ff7ab8', '#ffd23f', '#6fd3ff', '#8ef06a'];
  const points = [];
  for (let z = 78; z >= 22; z -= 8) points.push([ia - 0.12, 0.15, z]);
  for (let i = ia + 0.45; i < ib - 0.2; i += 0.5) points.push([i, 0.15, 17 - Math.sin(((i - ia) / (ib - ia)) * Math.PI) * 4]);
  for (let z = 22; z <= 78; z += 8) points.push([ib + 0.12, 0.15, z]);
  const fil = `<path d="M${points.map((p) => P(...p)).join(' L')}" fill="none" stroke="#3b2a52" stroke-width=".8" opacity=".55"/>`;
  const lumieres = points.map(([i, j, z], n) => {
    const [x, y] = iso(i, j, z);
    return `<circle class="e5-lumiere" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="${COULEURS[n % 4]}" style="animation-delay:-${((n * 0.37) % 1.6).toFixed(2)}s"/>`;
  }).join('');
  // La roue, dans le plan du panneau (j = 0) : u = 14 i, v = -z.
  const n = 12;
  const R = 24;
  const cz = 50;
  let quartiers = '';
  for (let k = 0; k < n; k++) {
    const a0 = ((k - 0.5) / n) * Math.PI * 2;
    const a1 = ((k + 0.5) / n) * Math.PI * 2;
    const c = k % 4 === 0 ? '#e1472d' : k % 2 ? '#fde48c' : '#f3842c';
    quartiers += `<path d="M0 ${-cz} L${(Math.sin(a0) * R).toFixed(1)} ${(-cz - Math.cos(a0) * R).toFixed(1)} A${R} ${R} 0 0 1 ${(Math.sin(a1) * R).toFixed(1)} ${(-cz - Math.cos(a1) * R).toFixed(1)} Z" fill="${c}"/>`;
  }
  const roue = `<g transform="matrix(1 .5 0 1 0 0)">
      <circle cx="0" cy="${-cz}" r="${R + 3.2}" fill="#d9dce2" stroke="#7d828a" stroke-width="1"/>
      ${quartiers}
      <circle cx="0" cy="${-cz}" r="3.2" fill="#3b3b45"/>
      <path d="M-3.4 ${-cz - R - 6.5} L3.4 ${-cz - R - 6.5} L0 ${-cz - R + 1.5} Z" fill="#eef0f4" stroke="#7d828a" stroke-width=".8" stroke-linejoin="round"/>
    </g>`;
  const lettres = [['P', -1.7, 106, '#e85aa8', 0], ['L', -0.6, 113, '#f7a332', -0.7], ['A', 0.5, 108, '#e8483a', -1.4], ['Y', 1.6, 115, '#5aaeef', -2.1]];
  const ballons = lettres.map(([t, i, z, c, d]) => {
    const [x, y] = iso(i, -0.3, z);
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="e5-ballon" style="animation-delay:${d}s">
      <path d="M0 6 Q2.5 14 -1 24" stroke="#7a6a8f" stroke-width=".8" fill="none"/>
      <text y="6" text-anchor="middle" font-size="20" font-weight="700" fill="${c}" stroke="#fff" stroke-width="1.3" paint-order="stroke">${t}</text>
      <ellipse cx="-3.2" cy="-5" rx="1.5" ry="2.6" fill="#fff" opacity=".6"/></g></g>`;
  }).join('');
  return `
    ${ombre(ia - 0.6, -0.5, ib + 0.8, 1.2)}
    ${face([[ia, 0, 18], [ib, 0, 18], [ib, 0, 82], [ia, 0, 82]], '#9a6634', ` stroke="${BOIS_TRAIT}" stroke-width="1"`)}
    ${face([[ia + 0.25, 0, 22], [ib - 0.25, 0, 22], [ib - 0.25, 0, 78], [ia + 0.25, 0, 78]], '#efd9ad')}
    ${roue}
    ${poteau(ia - 0.12, 0, 0, 90, '#6a3fd0', 3.4)}${poteau(ib + 0.12, 0, 0, 90, '#6a3fd0', 3.4)}
    ${fil}${lumieres}
    ${store({ a: ia - 0.5, b: ib + 0.5, jb: -0.6, zb: 96, jf: 0.9, zf: 87, n: 7, c1: '#8f3fa8', c2: '#f7d76a', trait: '#5e2470' })}
    ${ballons}`;
}

function kiosqueRoue(etiquette) {
  const { x, y } = MARCHE.roue;
  return `
  <g class="e5-etal" data-e5="roue" role="button" tabindex="0" aria-label="${etiquette}">
    <rect x="${x - 60}" y="${y - 132}" width="122" height="152" fill="transparent"/>
    <g transform="translate(${x} ${y})">${panneauRoue()}</g>
  </g>`;
}

// Les fanions qui pendent le long d'une ligne brisée (du toit du kiosque).
function fanions(pts, couleurs = ['#8f5cf7', '#ff7ab8', '#ffd23f', '#6fd3b0']) {
  let s = '';
  let n = 0;
  for (let k = 0; k < pts.length - 1; k++) {
    const [i0, j0, z0] = pts[k];
    const [i1, j1, z1] = pts[k + 1];
    const m = Math.max(2, Math.round(Math.hypot(i1 - i0, j1 - j0) / 0.55));
    const p = (t) => [i0 + (i1 - i0) * t, j0 + (j1 - j0) * t, z0 + (z1 - z0) * t - 3 * Math.sin(Math.PI * t) - 1];
    for (let q = 0; q < m; q++) {
      const A = p(q / m);
      const B = p((q + 1) / m);
      const M = p((q + 0.5) / m);
      s += `<path d="M${P(...A)} L${P(...B)} L${P(M[0], M[1], M[2] - 6)} Z" fill="${couleurs[n++ % couleurs.length]}" stroke="#7a2e14" stroke-width=".5" stroke-linejoin="round"/>`;
    }
  }
  return s;
}

/** Un petit oiseau jaune, origine aux pattes. */
function oiseau() {
  return `<g class="e5-oiseau">
    <path d="M-4 -5 Q-10 -9 -9 -2 Z" fill="#f2b81f"/>
    <ellipse cx="0" cy="-5" rx="5.4" ry="4.4" fill="#ffd23f"/>
    <circle cx="4" cy="-9" r="3.2" fill="#ffd23f"/>
    <path d="M6.6 -9.6 L9.8 -8.6 L6.6 -7.6 Z" fill="#f08a24"/>
    <circle cx="4.7" cy="-9.9" r=".85" fill="${ENCRE}"/>
    <path d="M-2 -5 Q1 -2 3 -5" stroke="#f2b81f" stroke-width="1.2" fill="none"/>
    <path d="M-1 -1 V1 M2 -1 V1" stroke="#f08a24" stroke-width="1"/>
  </g>`;
}

// Le kiosque de la cave : planches jaunes, guichet et ses bouteilles, toit
// rouge, fanions et, sur le toit, un nid et son oiseau.
function kiosque(e, sens) {
  const [k1, k2, k3] = e.articles;
  const r = 1.4;
  const t = r + 0.45;
  const [nx, ny] = iso(-0.9, 1.0, 68);
  return `
    ${ombre(-r - 0.4, -r - 0.4, r + 0.9, r + 0.9)}
    ${planches('i', r, -r, r, 0, 62, '#f1c35a', '#b98a2e', 5)}
    ${planches('j', r, -r, r, 0, 62, '#d6a23e', '#a87a24', 5)}
    ${face([[-0.95, r, 26], [0.95, r, 26], [0.95, r, 50], [-0.95, r, 50]], '#5a3d26', ' stroke="#8a6020" stroke-width="1.1"')}
    ${face([[r, -0.6, 30], [r, 0.6, 30], [r, 0.6, 44], [r, -0.6, 44]], '#fffdf6', ' stroke="#b8a888" stroke-width=".7"')}
    <path d="M${P(r, -0.35, 39)} L${P(r, 0.35, 39)} M${P(r, -0.35, 35)} L${P(r, 0.2, 35)}" stroke="#9aa3ad" stroke-width=".9"/>
    ${boite(-1.05, r, 2.1, 0.5, 23, 3, BOIS, BOIS_TRAIT)}
    ${etalage(k1, -0.62, r + 0.25, 26, 0.34, sens)}${etalage(k2, 0.05, r + 0.25, 26, 0.34, sens)}${etalage(k3, 0.7, r + 0.27, 26, 0.3, sens)}
    ${boite(-t, -t, 2 * t, 2 * t, 62, 6, { devant: '#c9542c', cote: '#a8401f', dessus: '#e2683a' }, '#7a2e14')}
    ${fanions([[-t, t, 62], [t, t, 62], [t, -t, 62]])}
    <g transform="translate(${nx.toFixed(1)} ${ny.toFixed(1)})">
      <ellipse cx="0" cy="0" rx="9" ry="4" fill="#8a5a2b"/>
      <path d="M-9 -1 Q0 -6 9 -1 M-8 1 Q0 -3 8 1" stroke="#6e4522" stroke-width="1" fill="none"/>
      <g transform="translate(1 -2) scale(${sens} 1)">${oiseau()}</g>
    </g>`;
}

// L'enseigne au nom de l'étal (jamais en miroir).
function enseigne(nom, couleur, x, y) {
  const l = Math.round(26 + nom.length * 7.6);
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
    <rect x="${-l / 2 + 1.5}" y="-9.5" width="${l}" height="23" rx="8" fill="${OMBRE}" opacity=".18"/>
    <rect x="${-l / 2}" y="-11" width="${l}" height="22" rx="8" fill="#fffaf2" stroke="${couleur}" stroke-width="2.4"/>
    <text y="5" text-anchor="middle" font-size="14" font-weight="700" fill="${couleur}">${nom}</text>
  </g>`;
}

// Un étal complet : son dessin, sa zone à toucher et son enseigne.
const FORMES = {
  cremerie: { dessin: cabane, haut: [0, -1.5, 67], boite: [-60, -86, 120, 116] },
  primeur: { dessin: etalPrimeur, haut: [0, -1.5, 72], boite: [-64, -90, 128, 122] },
  epicerie: { dessin: etagereEpicerie, haut: [0, -1.3, 66], boite: [-60, -86, 120, 116] },
  cave: { dessin: kiosque, haut: [0, 0, 68], boite: [-44, -82, 88, 108] },
};
function etal(e) {
  const p = MARCHE.etals[e.cle];
  const f = FORMES[e.cle];
  const sens = p.miroir ? -1 : 1;
  const [hx, hy] = iso(...f.haut);
  const [bx, by, bl, bh] = f.boite;
  return `
  <g class="e5-etal" data-e5="etal-${e.cle}" data-cle="${e.cle}" role="button" tabindex="0" aria-label="${e.nom}">
    <rect x="${p.x + bx}" y="${p.y + by}" width="${bl}" height="${bh}" fill="transparent"/>
    <g transform="translate(${p.x} ${p.y})${p.miroir ? ' scale(-1 1)' : ''}">${f.dessin(e, sens)}</g>
    ${enseigne(e.nom, e.fonce, p.x + hx * sens, p.y + hy - 18)}
  </g>`;
}

// La fontaine : une haie ronde, un bassin de pierre et sa statue (un
// monsieur au chapeau melon, un gros poisson sous le bras, qui crache l'eau).
function fontaineStatue() {
  const touffes = (avant) => {
    let s = '';
    for (let k = 0; k < 30; k++) {
      const t = (k / 30) * Math.PI * 2;
      const sy = Math.sin(t);
      if ((sy >= 0) !== avant) continue;
      const x = Math.cos(t) * 76;
      const y = sy * 37;
      s += `<circle cx="${x.toFixed(1)}" cy="${(y - 3).toFixed(1)}" r="${(10.5 + (k % 3) * 1.8).toFixed(1)}" fill="${k % 2 ? '#78c843' : '#66b638'}"/>`;
    }
    return s;
  };
  const pierre = { clair: '#dedbd2', moyen: '#bdb9ae', fonce: '#9d998e' };
  const statue = { clair: '#b9bdc2', moyen: '#a2a7ad', fonce: '#868b92', trait: '#62676e' };
  return `
  <ellipse cx="0" cy="12" rx="92" ry="44" fill="${OMBRE}" opacity=".14"/>
  <ellipse cx="0" cy="6" rx="84" ry="41" fill="#4f9a2c"/>
  ${touffes(false)}
  <path d="M-58 -6 V6 A58 29 0 0 0 58 6 V-6 Z" fill="${pierre.fonce}"/>
  <ellipse cx="0" cy="-6" rx="58" ry="29" fill="${pierre.clair}"/>
  <ellipse cx="0" cy="-6" rx="49" ry="24" fill="${pierre.moyen}"/>
  <ellipse cx="0" cy="-5" rx="47" ry="22.6" fill="#6cc7ea"/>
  <path d="M-47 -5 A47 22.6 0 0 1 47 -5 A47 19 0 0 0 -47 -5 Z" fill="#4fb0d9"/>
  <g class="e5-ronds" fill="none" stroke="#e6f8ff" stroke-width="1.3">
    <ellipse cx="-30" cy="4" rx="9" ry="4"/><ellipse cx="22" cy="2" rx="10" ry="4.4" style="animation-delay:-1.1s"/><ellipse cx="2" cy="10" rx="8" ry="3.6" style="animation-delay:-.6s"/>
  </g>
  <path d="M-12 -12 V-24 A12 6 0 0 0 12 -24 V-12 A12 6 0 0 1 -12 -12 Z" fill="${pierre.moyen}"/>
  <ellipse cx="0" cy="-24" rx="12" ry="6" fill="${pierre.clair}"/>
  <g stroke="${statue.trait}" stroke-width=".9" stroke-linejoin="round">
    <path d="M-6 -24 L-5 -39 H-1 L-.6 -24 Z M.6 -24 L1 -39 H5 L6 -24 Z" fill="${statue.fonce}"/>
    <path d="M-10 -35 Q-12 -52 -6 -58 H6 Q12 -52 10 -35 Z" fill="${statue.moyen}"/>
    <path d="M2 -58 H6 Q12 -52 10 -35 H4 Q7 -48 2 -58 Z" fill="${statue.fonce}" stroke="none"/>
    <path d="M10 -51 Q-3 -61 -15 -51 Q-19 -47 -17 -43 Q-6 -40 5 -45 L13 -40 L14 -52 Z" fill="${statue.clair}"/>
    <path d="M13 -40 L19 -36 L18 -47 L14 -52" fill="${statue.moyen}"/>
    <path d="M6 -56 Q12 -50 5 -45" fill="none" stroke-width="4" stroke="${statue.moyen}"/>
    <circle cx="0" cy="-64" r="6.6" fill="${statue.clair}"/>
    <path d="M-7.5 -67 Q-7.5 -76 0 -76 Q7.5 -76 7.5 -67 Z" fill="${statue.fonce}"/>
    <ellipse cx="0" cy="-67" rx="10.5" ry="2.6" fill="${statue.fonce}"/>
  </g>
  <circle cx="-10.5" cy="-49" r="1.1" fill="${statue.trait}"/>
  <path d="M-3 -63 Q-1 -61 1 -63" stroke="${statue.trait}" stroke-width=".9" fill="none"/>
  <g class="e5-jets" fill="none" stroke="#c9eeff" stroke-linecap="round">
    <path d="M-17 -45 Q-30 -46 -33 -12" stroke-width="3"/>
    <path d="M-17 -44 Q-27 -43 -29 -12" stroke-width="1.6" style="animation-delay:-.25s"/>
  </g>
  <g class="e5-ronds" fill="none" stroke="#e6f8ff" stroke-width="1.2"><ellipse cx="-31" cy="-10" rx="6" ry="2.6" style="animation-delay:-.3s"/></g>
  ${touffes(true)}`;
}

// Un muret de pierres sèches le long de i (j fixe) ou de j (i fixe), en
// coordonnées de la place.
function muret(axe, fixe, a, b) {
  const H = 13;
  const T = 0.9;
  const PIERRE = { devant: '#cbc6b8', cote: '#b2ac9c', dessus: '#e3dfd4' };
  const n = Math.max(1, Math.round(Math.abs(b - a) / 1.7));
  const lo = Math.min(a, b);
  const len = Math.abs(b - a) / n;
  let s = '';
  for (let k = 0; k < n; k++) {
    const u = lo + k * len;
    const h = H - (k % 3) * 1.1;
    s += axe === 'i'
      ? boite(u, fixe - T / 2, len - 0.06, T, 0, h, PIERRE, '#8f8a7b')
      : boite(fixe - T / 2, u, T, len - 0.06, 0, h, PIERRE, '#8f8a7b');
  }
  return s;
}

function girouette(x, y) {
  const coq = `
    <path d="M-2 2 C-8 0 -11 -6 -9 -12 C-7 -8 -5 -6 -3 -5 C-6 -9 -6 -14 -3 -17 C-2 -11 0 -8 2 -6 Z"/>
    <path d="M-3 2 C-3 -4 2 -6 6 -5 C7 -9 9 -11 11 -10 C12 -9 13 -8 14 -7 L12 -6 C12 -3 10 1 6 3 Z"/>
    <path d="M9 -11 Q10 -14 11 -12 Q12 -14 13 -11 Z"/>
    <path d="M2 3 V7 M5 3 V7" stroke="#3b3b45" stroke-width="1.4"/>
    <path d="M-15 10 H15 M11 7 L15 10 L11 13 M-15 7 L-12 10 L-15 13" stroke="#3b3b45" stroke-width="1.6" fill="none"/>`;
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="1" rx="10" ry="4" fill="${OMBRE}" opacity=".16"/>
    <path d="M-8 0 L8 0 L4 -7 L-4 -7 Z" fill="#e8553a"/>
    <rect x="-1.4" y="-90" width="2.8" height="84" fill="#4b4b55"/>
    <path d="M-17 -60 L17 -51 M11 -64 L-11 -47" stroke="#4b4b55" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="0" cy="-56" r="2.6" fill="#4b4b55"/>
    <g transform="translate(1.4 -70)"><g class="e5-fanion">
      <path d="M0 0 L24 6 L0 12 Z" fill="#8f5cf7" stroke="#5a32b0" stroke-width=".8" stroke-linejoin="round"/>
      <path d="M9 9.2 c-2.4 -1.9 -3 -3.5 -1.9 -4.3 c.8 -.5 1.6 -.1 1.9 .4 c.3 -.5 1.1 -.9 1.9 -.4 c1.1 .8 .5 2.4 -1.9 4.3 z" fill="#fff"/>
    </g></g>
    <g transform="translate(0 -104)"><g class="e5-girouette" fill="#3b3b45">${coq}</g></g>
  </g>`;
}

function borneIncendie(x, y) {
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="1" rx="9" ry="3.6" fill="${OMBRE}" opacity=".16"/>
    <rect x="-7" y="-4" width="14" height="4" rx="1.5" fill="#c23a2c"/>
    <path d="M-5 -4 V-18 Q-5 -24 0 -24 Q5 -24 5 -18 V-4 Z" fill="#e8483a"/>
    <rect x="-8.5" y="-15" width="17" height="4.4" rx="2" fill="#c23a2c"/>
    <circle cx="0" cy="-25" r="2.4" fill="#c23a2c"/>
    <path d="M-2.6 -20 V-7" stroke="#ff9a8a" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
  </g>`;
}

function arbre(x, y, s = 1, fruits = false) {
  const f = fruits ? `<g fill="#ff7ab8"><circle cx="-14" cy="-66" r="3"/><circle cx="9" cy="-78" r="3"/><circle cx="17" cy="-55" r="3"/><circle cx="-5" cy="-50" r="3"/><circle cx="-22" cy="-45" r="2.6"/></g>` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="2" rx="32" ry="12" fill="${OMBRE}" opacity=".16"/>
    <path d="M-5 2 L-4 -36 L4 -36 L5 2 Z" fill="#8a5a3b"/><path d="M1 0 L1.6 -34 L4 -34 L5 0 Z" fill="#74482d"/>
    <circle cx="0" cy="-62" r="30" fill="#6db53b"/>
    <circle cx="-18" cy="-50" r="20" fill="#66ad37"/>
    <circle cx="19" cy="-48" r="20" fill="#5aa331"/>
    <circle cx="-6" cy="-73" r="21" fill="#82c94a"/>
    <circle cx="11" cy="-67" r="15" fill="#92d456"/>
    ${f}
  </g>`;
}

function oranger(x, y) {
  const fruits = [[-22, -62], [-6, -82], [12, -70], [24, -54], [-14, -46], [4, -52], [-28, -78], [18, -88], [30, -72]];
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="2" rx="30" ry="11" fill="${OMBRE}" opacity=".15"/>
    <path d="M-4 2 L-3 -34 L3 -34 L4 2 Z" fill="#8a5a3b"/>
    <path d="M0 -30 L-10 -42 M1 -32 L12 -44" stroke="#8a5a3b" stroke-width="3" stroke-linecap="round"/>
    <circle cx="0" cy="-64" r="34" fill="#4f9a39"/>
    <circle cx="-16" cy="-52" r="22" fill="#55a33d"/><circle cx="18" cy="-52" r="22" fill="#4c9436"/>
    <circle cx="-8" cy="-76" r="22" fill="#63b447"/><circle cx="12" cy="-72" r="16" fill="#6fbe50"/>
    ${fruits.map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4.4" fill="#f59a2b"/><circle cx="${a - 1.3}" cy="${b - 1.5}" r="1.3" fill="#ffd08a"/>`).join('')}
  </g>`;
}

function corbeille(x, y) {
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="1" rx="9" ry="3.4" fill="${OMBRE}" opacity=".14"/>
    <path d="M-8 -17 L-6 0 H6 L8 -17" fill="none" stroke="#7f858d" stroke-width="1.4"/>
    <ellipse cx="0" cy="-17" rx="8" ry="3" fill="none" stroke="#7f858d" stroke-width="1.6"/>
    <path d="M-4.4 -16 L-3.2 0 M0 -15 V0 M4.4 -16 L3.2 0 M-7.2 -9 H7.2" stroke="#9aa0a8" stroke-width=".9"/>
  </g>`;
}

function poubelle(x, y) {
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="1" rx="8" ry="3" fill="${OMBRE}" opacity=".14"/>
    <path d="M4 0 V-30" stroke="#9aa0a8" stroke-width="2"/>
    <path d="M-6 -24 L-5 -10 H5 L6 -24 Z" fill="#ef7d3b"/>
    <ellipse cx="0" cy="-24" rx="6" ry="2" fill="#c85f22"/>
    <path d="M-4.5 -18 H4.5" stroke="#ffb07a" stroke-width="1.2"/>
  </g>`;
}

// Le banc, le long de i : lattes de bois, pieds et accoudoirs en fonte.
function banc(x, y) {
  const fer = '#3e3e46';
  const latte = (z) => face([[-1.9, -0.45, z], [1.9, -0.45, z], [1.9, -0.45, z + 2.6], [-1.9, -0.45, z + 2.6]], '#c9974e', ' stroke="#8a5f2c" stroke-width=".6"');
  const assise = (j) => face([[-1.9, j, 11], [1.9, j, 11], [1.9, j + 0.3, 11], [-1.9, j + 0.3, 11]], '#dcab5e', ' stroke="#8a5f2c" stroke-width=".6"');
  const fonte = (i) => `<path d="M${P(i, 0.55, 0)} L${P(i, 0.45, 11)} M${P(i, -0.45, 0)} L${P(i, -0.45, 25)} M${P(i, -0.45, 16)} Q${P(i, 0.35, 19)} ${P(i, 0.6, 12)}" stroke="${fer}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y})">
    ${face([[-2.1, -0.7, 0], [2.1, -0.7, 0], [2.1, 1.0, 0], [-2.1, 1.0, 0]], OMBRE, ' opacity=".14"')}
    ${fonte(-1.7)}
    ${latte(15.5)}${latte(19)}${latte(22.5)}
    ${assise(-0.4)}${assise(-0.05)}${assise(0.3)}
    ${fonte(1.7)}
  </g>`;
}

// Le tableau d'affichage sur son chevalet, avec ses affiches, ses dessins
// à la craie et son oiseau.
function chevalet(x, y) {
  const a = -2;
  const b = 2;
  const ardoise = face([[a, 0, 24], [b, 0, 24], [b, 0, 60], [a, 0, 60]], '#3f4a45', ' stroke="#c98d2e" stroke-width="3" stroke-linejoin="round"');
  const papier = (i0, i1, z0, z1, c, r) => face([[i0, 0.02, z0], [i1, 0.02, z0 + r], [i1, 0.02, z1 + r], [i0, 0.02, z1]], c, ' stroke="#b8a888" stroke-width=".5"');
  const [tx, ty] = iso(0, 0, 60);
  const [cx, cy] = iso(0.95, 0.02, 36);
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="3" rx="36" ry="9" fill="${OMBRE}" opacity=".14"/>
    <path d="M${P(a + 0.3, 0.9, 0)} L${P(a + 0.4, 0, 58)} M${P(b - 0.3, 0.9, 0)} L${P(b - 0.4, 0, 58)}" stroke="#d9a043" stroke-width="4" stroke-linecap="round"/>
    <path d="M${P(0, -1.2, 0)} L${P(0, 0, 50)}" stroke="#b98432" stroke-width="3" stroke-linecap="round"/>
    ${ardoise}
    ${papier(-1.7, -0.6, 36, 54, '#fffdf6', 0.6)}${papier(-0.4, 0.6, 40, 55, '#fff4a8', -0.6)}
    <path d="M${P(-1.5, 0.02, 49)} L${P(-0.8, 0.02, 49.4)} M${P(-1.5, 0.02, 45)} L${P(-0.8, 0.02, 45.4)} M${P(-1.5, 0.02, 41)} L${P(-1, 0.02, 41.3)}" stroke="#9aa3ad" stroke-width=".8"/>
    <g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})" fill="none" stroke="#f4f1e8" stroke-width="1.2" stroke-linecap="round">
      <path d="M-4 -2 h7 v4 q0 3 -3.5 3 q-3.5 0 -3.5 -3 z M3 -1 q3 0 3 2 q0 2 -3 2"/>
      <path d="M-2 -5 q-1 -2 0 -3 M1 -5 q-1 -2 0 -3"/>
    </g>
    <path d="M${P(0.8, 0.02, 53)} c-1.6 -1.3 -2 -2.4 -1.3 -2.9 c.6 -.4 1.1 0 1.3 .3 c.2 -.3 .7 -.7 1.3 -.3 c.7 .5 .3 1.6 -1.3 2.9 z" fill="#ff9cc8"/>
    <g transform="translate(${tx.toFixed(1)} ${(ty - 1).toFixed(1)})">${oiseau()}</g>
  </g>`;
}

// Le panneau qui ramène au café : une flèche en bois.
function poteauCafe(x, y, texte) {
  const l = Math.round(44 + texte.length * 7.2);
  return `<g class="e5-vers-cafe" data-e5="vers-cafe" role="button" tabindex="0" aria-label="${texte}">
    <g transform="translate(${x} ${y})">
      <rect x="${-l / 2 - 14}" y="-66" width="${l + 28}" height="72" fill="transparent"/>
      <ellipse cx="0" cy="1" rx="11" ry="4" fill="${OMBRE}" opacity=".16"/>
      <rect x="-2.6" y="-46" width="5.2" height="46" rx="2" fill="#8a5a3b"/>
      <path d="M${-l / 2 + 2} -58 H${l / 2} V-36 H${-l / 2 + 2} L${-l / 2 - 10} -47 Z" fill="#e2b061" stroke="#7a5226" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M${-l / 2 + 4} -52 H${l / 2 - 4}" stroke="#f3d08e" stroke-width="1.6" stroke-linecap="round"/>
      <g transform="translate(${-l / 2 + 13} -47) scale(.42)">${tasse({ vapeur: false })}</g>
      <text x="${10}" y="-41.8" text-anchor="middle" font-size="14" font-weight="700" fill="#5a3412">${texte}</text>
    </g>
  </g>`;
}

const fleurette = (x, y, c = '#ffe14a') => `<g transform="translate(${x} ${y})" fill="${c}"><circle cx="-1.8" cy="0" r="1.5"/><circle cx="1.8" cy="0" r="1.5"/><circle cx="0" cy="-1.6" r="1.5"/><circle cx="0" cy="1.6" r="1.5"/><circle r="1" fill="#f2a62e"/></g>`;
const touffe = (x, y) => `<path d="M${x - 4} ${y} q1 -5 -1 -9 M${x} ${y} q0 -6 1 -10 M${x + 4} ${y} q-1 -5 2 -8" stroke="#86bb34" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
const terre = (x, y, rx, ry) => `<g transform="translate(${x} ${y})" opacity=".6"><ellipse rx="${rx}" ry="${ry}" fill="#c6cf58"/><ellipse cx="${(rx * 0.25).toFixed(1)}" cy="${(ry * 0.1).toFixed(1)}" rx="${(rx * 0.68).toFixed(1)}" ry="${(ry * 0.62).toFixed(1)}" fill="#cfd463"/></g>`;
const buisson = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="2" rx="22" ry="7" fill="${OMBRE}" opacity=".14"/>
    <circle cx="-11" cy="-8" r="11" fill="#66ad37"/><circle cx="11" cy="-8" r="11" fill="#5aa331"/><circle cx="0" cy="-14" r="13" fill="#7cc444"/>
    <g fill="#fff3a0"><circle cx="-8" cy="-16" r="2"/><circle cx="6" cy="-20" r="2"/><circle cx="12" cy="-9" r="2"/></g>
  </g>`;

// Une dalle des pas japonais.
function dalle(x, y, s) {
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})">
    <ellipse cx=".6" cy="1.8" rx="9.4" ry="4.6" fill="#a8a293"/>
    <ellipse rx="9.4" ry="4.6" fill="#d6d2c6"/>
    <ellipse cx="-2.4" cy="-1.1" rx="4" ry="1.4" fill="#e7e4db"/>
  </g>`;
}
// Des pas japonais le long d'une ligne brisée (un peu de désordre, toujours
// le même grâce à la graine).
function pasJaponais(points, graine) {
  let s = graine;
  const alea = () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5;
  let out = '';
  for (let k = 0; k < points.length - 1; k++) {
    const [x0, y0] = points[k];
    const [x1, y1] = points[k + 1];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, (y1 - y0) * 2) / 26));
    for (let q = 0; q < n; q++) {
      const t = (q + 0.5) / n;
      out += dalle(x0 + (x1 - x0) * t + alea() * 8, y0 + (y1 - y0) * t + alea() * 4, 0.85 + alea() * 0.4);
    }
  }
  return out;
}

function papillonVolant(x, y, couleur, delai) {
  const aile = `<path d="M0 0 C3 -8 10 -9 10 -3 C10 1 5 2 0 0 Z" fill="${couleur}"/><path d="M0 0 C4 1 8 4 6 7 C4 9 1 6 0 0 Z" fill="${couleur}" opacity=".85"/>`;
  return `<g transform="translate(${x} ${y})"><g class="e5-vol-papillon" style="animation-delay:${delai}s">
    <g class="e5-battement">${aile}<g transform="scale(-1 1)">${aile}</g></g>
    <ellipse cx="0" cy="1" rx="1.2" ry="4" fill="${ENCRE}"/>
  </g></g>`;
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

/** Le corps d'un joueur du marché, origine aux pieds (aussi pour les
 *  clients du café). */
export function corpsJoueur(look, { assis = false, coucou = false } = {}) {
  if (look.cyriel) return cyrielNatte();
  if (look.clement) return `<g transform="scale(1.1)">${corpsClement(coucou)}</g>`;
  if (look.estel) return corpsEstel(assis);
  if (look.chachoux) return corpsChachoux(assis);
  if (look.angeloune) return corpsAngeloune(assis);
  if (look.rachou) return corpsRachou(assis);
  const { peau, cheveux, haut, bas, coiffe } = look;
  const jambes = assis
    ? `<ellipse cx="-4" cy="-8" rx="4.4" ry="3" fill="${bas}"/><ellipse cx="4" cy="-8" rx="4.4" ry="3" fill="${bas}"/><ellipse cx="-6" cy="-5" rx="3" ry="2" fill="#3b2a52"/><ellipse cx="6" cy="-5" rx="3" ry="2" fill="#3b2a52"/>`
    : `<rect x="-5.5" y="-10" width="4.4" height="9" rx="2" fill="${bas}"/><rect x="1.1" y="-10" width="4.4" height="9" rx="2" fill="${bas}"/><ellipse cx="-3.4" cy="-1" rx="3.4" ry="2" fill="#3b2a52"/><ellipse cx="3.4" cy="-1" rx="3.4" ry="2" fill="#3b2a52"/>`;
  const brasD = coucou
    ? `<g class="e5-coucou"><path d="M7 -19 Q12 -24 13 -31" stroke="${haut}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="13" cy="-32.5" r="2.7" fill="${peau}"/></g>`
    : `<path d="M7.5 -19 Q10 -15 9.5 -11" stroke="${haut}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="9.4" cy="-10.4" r="2.5" fill="${peau}"/>`;
  return `
      ${jambes}
      <path d="M-8 -9 Q-9 -21 -6 -23 H6 Q9 -21 8 -9 Z" fill="${haut}"/>
      <path d="M-7.5 -19 Q-10 -15 -9.5 -11" stroke="${haut}" stroke-width="4.4" stroke-linecap="round" fill="none"/><circle cx="-9.4" cy="-10.4" r="2.5" fill="${peau}"/>
      ${brasD}
      <circle cx="0" cy="-33" r="11" fill="${peau}"/>
      ${coiffure(coiffe, cheveux)}
      <circle cx="-3.8" cy="-32" r="1.5" fill="${ENCRE}"/><circle cx="3.8" cy="-32" r="1.5" fill="${ENCRE}"/>
      <ellipse cx="-6.8" cy="-28.6" rx="2" ry="1.2" fill="#ff9cc8" opacity=".8"/><ellipse cx="6.8" cy="-28.6" rx="2" ry="1.2" fill="#ff9cc8" opacity=".8"/>
      <path d="M-2 -27.6 Q0 -26 2 -27.6" stroke="${ENCRE}" stroke-width="1" fill="none" stroke-linecap="round"/>`;
}

/** Les clients du café : les joueurs du marché, et Clément pour le dernier.
 *  haut : sommet de la tête par rapport aux pieds ; tete : centre de la tête. */
export const PERSONNAGES = {
  bichette: { look: LOOKS[5] },
  chachoux: { look: LOOKS[2] },
  estel: { look: LOOKS[3] },
  gaston: { look: LOOKS[4] },
  angeloune: { look: LOOKS[6] },
  rachou: { look: LOOKS[7] },
  clement: { look: LOOKS[0] },
};
for (const p of Object.values(PERSONNAGES)) {
  const k = p.look.clement ? 1.1 : 1;
  Object.assign(p, { haut: -50 * k, tete: -33 * k, dessin: (o) => corpsJoueur(p.look, o) });
}

/** Le visage d'un client, pour le livre de recettes : { boite, dessin }. */
export function visage(sorte) {
  const p = PERSONNAGES[sorte];
  return { boite: `-17 ${(p.tete - 17).toFixed(1)} 34 34`, dessin: p.dessin() };
}

/** Un joueur du marché, origine aux pieds, avec son pseudo au-dessus.
 *  parcours : sa promenade, en points relatifs « dx,dy,pause » séparés par
 *  des espaces (pause en secondes) ; animerPromeneurs() la fait vivre.
 *  saute : il sautille sur place de temps en temps. */
function joueur(nom, look, { x, y, assis = false, coucou = false, coeur = false, parcours = '', saute = false, fond = '#1a1026', opacite = 0.72 }) {
  const l = Math.round(16 + nom.length * 5.6);
  const corps = corpsJoueur(look, { assis, coucou });
  const hautTag = assis ? -54 : look.clement ? -66 : -58;
  const petitCoeur = coeur ? `<g transform="translate(${l / 2 + 6} ${hautTag - 2})"><g class="e5-petit-coeur"><path d="M0 4 C-4 1 -5 -1.6 -3.2 -2.6 C-1.8 -3.2 -0.6 -2.4 0 -1.6 C0.6 -2.4 1.8 -3.2 3.2 -2.6 C5 -1.6 4 1 0 4 Z" fill="#ff7ab8"/></g></g>` : '';
  const vie = assis ? 'e5-balance' : saute ? 'e5-sautille' : 'e5-respire';
  return `
  <g transform="translate(${x} ${y})">
    <g class="e5-promeneur"${parcours ? ` data-parcours="${parcours}"` : ''}>
      <ellipse cx="0" cy="0" rx="10" ry="3.6" fill="${OMBRE}" opacity=".2"/>
      <g class="e5-pas"><g class="e5-tourne"><g class="e5-joueur ${vie}">${corps}</g></g></g>
      <g transform="translate(0 ${hautTag})">
        <rect x="${-l / 2}" y="-8" width="${l}" height="15" rx="7.5" fill="${fond}" fill-opacity="${opacite}"/>
        <text y="3.2" text-anchor="middle" font-size="9.5" font-weight="600" fill="#fff">${nom}</text>
      </g>
      ${petitCoeur}
    </g>
  </g>`;
}

/** La place du marché. etals : [{ cle, nom, couleur, fonce, articles }]. */
export function marche(etals, joueurs, texteCafe, texteRoue) {
  const C = MARCHE.centre;
  const R = MARCHE.R;
  const e = Object.fromEntries(etals.map((x) => [x.cle, x]));
  // (Gaston et Inesquiressemblepas, 4e et 5e, ne viennent qu'au café.)
  const [nClement, nChachoux, nEstel, , , nAngel, nRachou] = joueurs;
  const place = `M${C.x} ${C.y - R * 14} L${C.x + R * 28} ${C.y} L${C.x} ${C.y + R * 14} L${C.x - R * 28} ${C.y} Z`;
  const touffes = [[-120, 250], [-40, 200], [30, 300], [120, 160], [280, 160], [380, 300], [470, 230], [520, 340], [-90, 360], [10, 420],
    [130, 470], [290, 470], [410, 430], [250, 340], [150, 250], [-230, 300], [640, 300], [60, 520], [350, 540], [-180, 420], [590, 420],
    [200, 60], [40, 110], [360, 100], [-60, 140], [460, 150], [240, 600], [100, 650], [330, 680]].map(([x, y]) => touffe(x, y)).join('');
  const fleurs = [[-70, 270], [12, 262], [96, 300], [168, 214], [262, 200], [300, 330], [420, 310], [480, 360], [-20, 380], [120, 430],
    [262, 452], [340, 440], [228, 368], [150, 372], [-150, 330], [560, 330], [90, 560], [320, 590], [190, 640], [20, 610]].map(([x, y], k) => fleurette(x, y, k % 5 ? '#ffe14a' : '#fffaf0')).join('');
  return `
  <rect x="-1400" y="-1400" width="3200" height="3360" fill="url(#e5-herbe)"/>
  <path d="${place}" fill="#bfe55c" opacity=".55"/>
  ${terre(200, 368, 118, 36)}${terre(118, 258, 64, 20)}${terre(300, 252, 70, 22)}${terre(96, 418, 74, 24)}${terre(300, 424, 76, 24)}
  ${terre(440, 330, 82, 28)}${terre(-40, 336, 70, 24)}${terre(200, 520, 60, 20)}
  ${touffes}${fleurs}
  ${pasJaponais([[200, 340], [200, 398], [196, 470], [204, 560], [196, 700]], 7)}
  ${pasJaponais([[134, 304], [110, 266]], 11)}${pasJaponais([[268, 304], [294, 266]], 13)}
  ${pasJaponais([[140, 336], [112, 398]], 17)}${pasJaponais([[262, 336], [290, 402]], 19)}
  ${pasJaponais([[-20, 330], [80, 330]], 23)}${pasJaponais([[330, 300], [430, 300]], 29)}
  <g transform="translate(${C.x} ${C.y})">${muret('j', -R, 7.5, R)}${muret('i', -R, 7.5, R)}</g>
  ${arbre(-40, 108, 0.9)}${arbre(30, 52, 0.95, true)}${arbre(370, 60, 0.9)}${arbre(450, 116, 0.95)}${arbre(-120, 160, 0.85)}${arbre(530, 170, 0.85, true)}
  ${arbre(250, -10, 0.9)}${arbre(120, -40, 0.85)}${arbre(-260, 220, 0.95)}${arbre(670, 220, 0.95)}
  ${arbre(112, 100, 1.15)}
  ${buisson(-10, 150)}${buisson(420, 150, 1.05)}
  ${etal(e.epicerie)}
  ${chevalet(454, 198)}
  ${etal(e.cremerie)}${etal(e.primeur)}
  ${girouette(-96, 288)}${borneIncendie(-62, 310)}
  ${oranger(500, 284)}${corbeille(532, 302)}
  ${banc(440, 264)}
  ${joueur(nEstel || '', LOOKS[3], { x: 440, y: 263, assis: true })}
  ${joueur('Cycy la famille', { cyriel: true }, { x: 118, y: 244, fond: '#7a3cf0', opacite: 0.85, parcours: '0,0,3 28,12,4 8,20,2' })}
  ${joueur(nChachoux || '', LOOKS[2], { x: 258, y: 238, parcours: '0,0,2.5 26,13,1.5 8,24,3' })}
  <g transform="translate(${C.x} ${C.y})">${fontaineStatue()}</g>
  ${joueur(nRachou || '', LOOKS[7], { x: 158, y: 356, saute: true })}
  ${joueur(nClement || '', LOOKS[0], { x: 264, y: 358, coucou: true, coeur: true })}
  ${etal(e.cave)}${kiosqueRoue(texteRoue)}
  ${poteauCafe(MARCHE.versCafe.x, MARCHE.versCafe.y, texteCafe)}
  ${joueur(nAngel || '', LOOKS[6], { x: 258, y: 414, parcours: '0,0,3 30,14,2' })}
  <g transform="translate(${C.x} ${C.y})">${muret('i', R, -R, -7)}${muret('j', R, -R, -7.5)}</g>
  ${poubelle(426, 398)}
  ${arbre(-60, 470, 0.95)}${arbre(470, 476, 0.95, true)}${arbre(20, 580, 1)}${arbre(390, 590, 0.95)}${arbre(-220, 420, 0.9)}${arbre(630, 420, 0.9)}
  ${buisson(110, 520)}${buisson(300, 528, 1.1)}${buisson(-120, 520)}${buisson(540, 530)}
  ${papillonVolant(60, 180, '#b48cff', 0)}${papillonVolant(380, 460, '#ff9cc8', -2.4)}${papillonVolant(-60, 300, '#8f5cf7', -1.2)}`;
}

/** Fait vivre les promeneurs du marché : chacun suit son parcours en boucle,
 *  à petits pas, se tourne dans le sens de la marche et s'arrête un peu à
 *  chaque étape. Renvoie une fonction qui arrête tout. */
export function animerPromeneurs(racine, { vitesse = 24 } = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const anims = [];
  for (const g of racine.querySelectorAll('.e5-promeneur[data-parcours]')) {
    const pts = g.dataset.parcours.trim().split(/\s+/).map((t) => t.split(',').map(Number));
    if (pts.length < 2) continue;
    const etapes = pts.map((A, k) => {
      const B = pts[(k + 1) % pts.length];
      return { A, B, pause: A[2] || 0, marche: Math.hypot(B[0] - A[0], B[1] - A[1]) / vitesse };
    });
    const total = etapes.reduce((t, e) => t + e.pause + e.marche, 0);
    const faces = etapes.map((e) => (e.B[0] < e.A[0] ? -1 : 1));
    const pos = [];
    const pas = [];
    const tour = [{ offset: 0, transform: `scaleX(${faces[faces.length - 1]})`, easing: 'steps(1, end)' }];
    let t = 0;
    etapes.forEach((e, k) => {
      const ici = `translate(${e.A[0]}px, ${e.A[1]}px)`;
      pos.push({ offset: t / total, transform: ici });
      pas.push({ offset: t / total, transform: 'translateY(0px)' });
      t += e.pause;
      pos.push({ offset: t / total, transform: ici });
      pas.push({ offset: t / total, transform: 'translateY(0px)' });
      tour.push({ offset: t / total, transform: `scaleX(${faces[k]})`, easing: 'steps(1, end)' });
      const n = 2 * Math.max(1, Math.round(e.marche / 0.36));
      for (let q = 1; q <= n; q++) pas.push({ offset: (t + (e.marche * q) / n) / total, transform: `translateY(${q % 2 ? -2.6 : 0}px)` });
      t += e.marche;
    });
    pos.push({ offset: 1, transform: `translate(${etapes[0].A[0]}px, ${etapes[0].A[1]}px)` });
    tour.push({ offset: 1, transform: `scaleX(${faces[faces.length - 1]})` });
    const options = { duration: total * 1000, iterations: Infinity };
    const depart = Math.random() * total * 1000;
    for (const [el, images] of [[g, pos], [g.querySelector('.e5-pas'), pas], [g.querySelector('.e5-tourne'), tour]]) {
      if (!el) continue;
      const a = el.animate(images, options);
      a.currentTime = depart;
      anims.push(a);
    }
  }
  return () => { for (const a of anims) a.cancel(); };
}

/* ========================================= Le camion à cupcakes (café) */

/** Un cupcake au chocolat comme ceux du chef pâtissier, origine sous la
 *  caissette, avec sa cerise. croque : il est croqué sur le côté, et la
 *  confiture coule (le gros cupcake sur le toit du camion). */
export function cupcake({ croque = false, papier = '#f6dfab', bord = '#c49a5e', dome = '#6a3b22', clair = '#8d5636' } = {}) {
  const points = [[-8, -20], [-3, -25], [3, -22], [8, -17], [-11, -16], [0, -17], [5, -27], [-6, -27.5], [10, -22], [-1, -21], [12, -17], [-4, -14.5], [6, -14]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="#fbe4d2"/>`).join('');
  const morsure = croque ? `
    <path d="M-15 -14 Q-15.6 -20 -12.6 -23.4 Q-10.2 -21.8 -11.2 -19.6 Q-8.4 -19.4 -9 -16.6 Q-11 -15 -10 -12.6 Z" fill="#c4834f"/>
    <path d="M-13.4 -21.4 Q-11.4 -19.8 -12.4 -17.6 Q-10.4 -17.2 -11.2 -15 L-12.4 -12.6 L-12.6 -6.4 Q-12.6 -4.6 -13.8 -4.6 Q-15 -4.6 -14.9 -6.4 L-14.6 -12.6 Z" fill="#d42a3d" stroke="#97142a" stroke-width=".5"/>
    <circle cx="-12.2" cy="-1.6" r="1.2" fill="#d42a3d"/>
    <path d="M-12.9 -19.6 Q-12.2 -18.6 -12.6 -17.4" stroke="#ff8c9a" stroke-width=".8" fill="none" stroke-linecap="round"/>` : '';
  return `
  <ellipse cx="0" cy="1" rx="13" ry="3" fill="#2a1745" opacity=".16"/>
  <path d="M-12 -13 L-9 0 H9 L12 -13 Z" fill="${papier}" stroke="${bord}" stroke-width="1" stroke-linejoin="round"/>
  <path d="M-8 -13 L-6.2 0 M-4 -13 L-3.1 0 M0 -13 V0 M4 -13 L3.1 0 M8 -13 L6.2 0" stroke="${bord}" stroke-width=".8" opacity=".7"/>
  <path d="M-14.5 -13 Q-16 -21 -9.5 -24 Q-6 -31 0 -31 Q6 -31 9.5 -24 Q16 -21 14.5 -13 Q0 -10.6 -14.5 -13 Z" fill="${dome}" stroke="#3e2112" stroke-width="1" stroke-linejoin="round"/>
  <path d="M-9 -24 Q-3 -28.4 3 -27" stroke="${clair}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${points}${morsure}
  <ellipse cx="0" cy="-30.6" rx="4.6" ry="1.8" fill="#fffaf0"/>
  <path d="M0.6 -35 Q3 -40 7 -39" stroke="#4f9a2c" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-33.6" r="3.8" fill="#e5304f" stroke="#a81c34" stroke-width=".9"/><circle cx="-1.3" cy="-35" r="1.1" fill="#ff9aa8"/>`;
}

// Le vieux chef du camion, derrière son guichet (moustache blanche et
// toque), origine à la base du cou.
function chefCamion() {
  return `
  <path d="M-11 6 Q-11 -3 0 -4 Q11 -3 11 6 Z" fill="#fffdf8" stroke="#cfc6b6" stroke-width=".8"/>
  <circle cx="0" cy="-11" r="8.4" fill="#f2c6a4"/>
  <circle cx="-8.2" cy="-11" r="2" fill="#f2c6a4"/><circle cx="8.2" cy="-11" r="2" fill="#f2c6a4"/>
  <path d="M-8 -15 Q-9 -10 -7 -7 M8 -15 Q9 -10 7 -7" stroke="#e8e8ee" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <circle cx="-3" cy="-12.6" r="1.1" fill="${ENCRE}"/><circle cx="3" cy="-12.6" r="1.1" fill="${ENCRE}"/>
  <path d="M-5 -15.4 Q-3 -16.6 -1.4 -15.6 M1.4 -15.6 Q3 -16.6 5 -15.4" stroke="#e8e8ee" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-10" rx="1.8" ry="1.4" fill="#e09a80"/>
  <path d="M-7.5 -7 Q-4 -9.4 0 -7.6 Q4 -9.4 7.5 -7 Q5 -4.6 0 -6 Q-5 -4.6 -7.5 -7 Z" fill="#fbfbff" stroke="#d9d9e2" stroke-width=".6"/>
  <path d="M-8 -18 Q-10 -26 -4 -27 Q-2 -32 3 -30 Q9 -31 9 -25 Q11 -21 8 -18 Z" fill="#fff" stroke="#d6d2c8" stroke-width=".9"/>
  <rect x="-8" y="-19.6" width="16" height="3.4" rx="1" fill="#f4f1ea" stroke="#d6d2c8" stroke-width=".7"/>`;
}

/** Le camion du chef pâtissier, garé à droite du café, comme dans le jeu
 *  d'origine : lilas, le vieux chef à son guichet, un plateau de cupcakes,
 *  et un gros cupcake croqué sur le toit. On le touche pour jouer à
 *  « Trouve la garniture ». */
export function camion(etiquette, x = 336, y = 388) {
  const LILAS = { devant: '#cbbbe8', cote: '#b39fdb', dessus: '#e6dcf6' };
  const CREME = { devant: '#f7f2ea', cote: '#e3dbcd', dessus: '#fcfaf5' };
  const trait = '#7a62a8';
  const roue = (i, j) => {
    const [rx, ry] = iso(i, j, 6.5);
    return `<g transform="translate(${rx.toFixed(1)} ${ry.toFixed(1)})"><ellipse rx="7.4" ry="7.8" fill="#2b2b33"/><ellipse rx="3.8" ry="4" fill="#b9bec6"/><circle r="1.4" fill="#5b6169"/></g>`;
  };
  const vitre = '#bfe4f5';
  const [gx, gy] = iso(-0.7, 1.1, 0);
  const [cx, cy] = iso(-0.4, 0, 48);
  const [lx, ly] = iso(1.05, 1.1, 15);
  const [mx, my] = iso(1.7, 1.3, 27);
  const plateau = [-1.65, -0.8, 0.05].map((i) => {
    const [px, py] = iso(i, 1.7, 23);
    return `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(.36)">${cupcake()}</g>`;
  }).join('');
  return `<g class="e5-camion" data-e5="camion" role="button" tabindex="0" aria-label="${etiquette}">
    <rect x="${x - 58}" y="${y - 112}" width="118" height="126" fill="transparent"/>
    <g transform="translate(${x} ${y})">
      ${face([[-2.9, -1.5], [3.5, -1.5], [3.5, 1.7], [-2.9, 1.7]], '#2a1745', ' opacity=".14"')}
      ${roue(-1.5, -1.1)}${roue(2.2, -1.1)}
      ${boite(-2.4, -1.1, 4.0, 2.2, 6, 28, LILAS, trait)}
      ${boite(-2.4, -1.1, 4.0, 2.2, 34, 14, CREME, trait)}
      ${boite(1.6, -1.1, 1.5, 2.2, 6, 28, LILAS, trait)}
      ${face([[3.1, -0.85, 19], [3.1, 0.85, 19], [3.1, 0.85, 31], [3.1, -0.85, 31]], vitre, ` stroke="${trait}" stroke-width=".8"`)}
      ${face([[1.75, 1.1, 19], [2.9, 1.1, 19], [2.9, 1.1, 31], [1.75, 1.1, 31]], vitre, ` stroke="${trait}" stroke-width=".8"`)}
      ${face([[-1.9, 1.1, 22], [0.5, 1.1, 22], [0.5, 1.1, 42], [-1.9, 1.1, 42]], '#4c3e62', ` stroke="${trait}" stroke-width=".8"`)}
      <g transform="translate(${gx.toFixed(1)} ${(gy - 25).toFixed(1)})"><g class="e5-respire">${chefCamion()}</g></g>
      ${boite(-2.0, 1.1, 2.6, 0.75, 20, 2.6, { devant: '#d9a352', cote: '#b98140', dessus: '#ecc47e' }, BOIS_TRAIT)}
      ${plateau}
      <g transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)})"><ellipse rx="6" ry="6.6" fill="#fdf8ef" stroke="${trait}" stroke-width=".8"/><g transform="translate(0 4.2) scale(.24)">${cupcake()}</g></g>
      <ellipse cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" rx="2" ry="2.8" fill="#4a4060"/>
      ${face([[3.1, -0.9, 9], [3.1, 0.9, 9], [3.1, 0.9, 15], [3.1, -0.9, 15]], '#d9dce2', ` stroke="${trait}" stroke-width=".6"`)}
      <path d="M${P(3.1, -0.6, 11)} L${P(3.1, 0.3, 11)} M${P(3.1, -0.6, 13)} L${P(3.1, 0.3, 13)}" stroke="#9aa0aa" stroke-width=".7"/>
      <circle cx="${iso(3.1, 0.68, 12)[0].toFixed(1)}" cy="${iso(3.1, 0.68, 12)[1].toFixed(1)}" r="2" fill="#fff4b0" stroke="${trait}" stroke-width=".6"/>
      ${roue(-1.5, 1.1)}${roue(2.2, 1.1)}
      <g transform="translate(${cx.toFixed(1)} ${(cy + 3).toFixed(1)}) scale(1.5)">${cupcake({ croque: true })}</g>
    </g>
  </g>`;
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
