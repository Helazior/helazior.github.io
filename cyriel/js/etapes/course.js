// La petite course entre le marais et le café (environ 6 secondes).
//
// Cyriel et Clément courent jusqu'au café. Cyriel n'avance que si on la fait
// marcher : chaque toucher d'un pied (bouton ou flèche du clavier) est un pas.
// En martelant droite, gauche, très vite, elle dépasse Clément. Sinon il
// arrive le premier… puis l'attend et l'encourage jusqu'à ce qu'elle arrive.

import { clementTrail } from './cafe-dessins.js';
import { cyrielNatte } from './clins-doeil.js';

/* ======================================================= Textes à modifier */

const TEXTES = {
  consigne: 'Course jusqu’au café ! Martèle droite, gauche !',
  partez: 'C’est parti !',
  gauche: 'Pied gauche',
  droite: 'Pied droit',
  gagne: 'Gagné ! Tu cours plus vite que Clément !',
  attend: 'Clément est arrivé le premier… il t’encourage !',
  enseigne: 'Café de Cyriel',
};

/* ================================================================ Réglages */

const ARRIVEE = 205;        // distance à courir, en unités du décor
const DUREE = 6;            // Clément arrive 6 secondes après le départ
const PAS = 9.5;            // un toucher = un pas (environ 22 pas pour arriver)
const NS = 'http://www.w3.org/2000/svg';

function decor() {
  const roseaux = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="#6f9a4a" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M-5 0 C-6 -14 -9 -24 -12 -32 M5 0 C6 -14 9 -24 12 -30 M0 0 C1 -16 -1 -30 -2 -40"/>
    <rect x="-3.6" y="-44" width="4" height="12" rx="2" fill="#7a4d31" stroke="none"/></g>`;
  const arbres = Array.from({ length: 16 }, (_, i) => {
    const x = -200 + i * 60 + ((i * 23) % 17);
    const r = 22 + ((i * 11) % 10);
    return `<circle cx="${x}" cy="${150 - r * 0.3}" r="${r}" fill="${i % 2 ? '#86bf72' : '#74b062'}"/>`;
  }).join('');
  return {
    fond: `
      <rect x="-600" y="-400" width="1600" height="560" fill="#cfe8ff"/>
      <circle cx="320" cy="48" r="20" fill="#fff6c4"/>
      <g fill="#fff" opacity=".9"><ellipse cx="90" cy="54" rx="24" ry="8"/><ellipse cx="104" cy="47" rx="14" ry="8"/></g>`,
    loin: `${arbres}<rect x="-600" y="150" width="1800" height="30" fill="#b8dc9a"/>`,
    pres: `${[-120, -40, 30, 120, 210, 300, 390, 480].map((x, i) => roseaux(x, 306 + (i % 2) * 6, 0.9 + (i % 3) * 0.12)).join('')}`,
    sol: `
      <rect x="-600" y="176" width="1800" height="400" fill="#b5dc8f"/>
      <path d="M-600 214 H1200 V262 H-600 Z" fill="#e3c99a"/>
      <path d="M-600 214 H1200 M-600 262 H1200" stroke="#cfae78" stroke-width="2"/>`,
  };
}

// La devanture du café, à l'arrivée.
function cafe() {
  return `
  <rect x="-34" y="-74" width="68" height="74" rx="4" fill="#fdf7ee" stroke="#1a1026" stroke-width="2"/>
  <path d="M-40 -74 H40 L34 -60 H-34 Z" fill="#8f5cf7" stroke="#1a1026" stroke-width="2" stroke-linejoin="round"/>
  <path d="M-26 -74 L-24 -60 M-10 -74 L-9 -60 M6 -74 L5 -60 M22 -74 L21 -60" stroke="#fff" stroke-width="3"/>
  <rect x="-12" y="-38" width="24" height="38" rx="3" fill="#9a6438" stroke="#1a1026" stroke-width="1.6"/>
  <rect x="-28" y="-52" width="12" height="14" rx="2" fill="#bfe3ff" stroke="#1a1026" stroke-width="1.4"/>
  <rect x="16" y="-52" width="12" height="14" rx="2" fill="#bfe3ff" stroke="#1a1026" stroke-width="1.4"/>
  <text x="0" y="-84" text-anchor="middle" font-size="11" font-weight="700" fill="#4a1fa8">${TEXTES.enseigne}</text>
  <path d="M-46 0 V-30 M46 0 V-30" stroke="#e04a7a" stroke-width="2"/>
  <path d="M-46 -26 Q0 -16 46 -26" stroke="#e04a7a" stroke-width="2.6" fill="none" stroke-dasharray="5 3"/>`;
}

/**
 * Lance la course dans l'élément racine (plein écran). Renvoie une promesse
 * tenue à la fin. V : facteur de vitesse des essais.
 */
export function course(racine, { son, fx, V = 1, calme = false, debug = null }) {
  return new Promise((fini) => {
    const bip = (...a) => son.bip(...a);
    const el = document.createElement('div');
    el.className = 'cr';
    el.innerHTML = `
      <svg class="cr-svg" viewBox="0 70 320 230" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg>
      <p class="cr-texte" aria-live="polite">${TEXTES.consigne}</p>
      <button type="button" class="cr-partez" data-cr="partez">${TEXTES.partez}</button>
      <div class="cr-boutons cr-cache">
        <button type="button" class="cr-bouton" data-cr="gauche" aria-label="${TEXTES.gauche}"><svg viewBox="0 0 40 48" aria-hidden="true"><g transform=""><path d="M17 46 C10 46 9 39 9 33 C9 27 7 22 9 17 C11 12 25 10 29 15 C31 19 27 26 26 33 C25 41 23 46 17 46 Z"/><circle cx="27" cy="7" r="4"/><circle cx="20.4" cy="4.6" r="2.9"/><circle cx="15" cy="5.8" r="2.5"/><circle cx="10.6" cy="8.6" r="2.1"/><circle cx="7.6" cy="12.6" r="1.8"/></g></svg><span>${TEXTES.gauche}</span></button>
        <button type="button" class="cr-bouton" data-cr="droite" aria-label="${TEXTES.droite}"><svg viewBox="0 0 40 48" aria-hidden="true"><g transform="translate(40 0) scale(-1 1)"><path d="M17 46 C10 46 9 39 9 33 C9 27 7 22 9 17 C11 12 25 10 29 15 C31 19 27 26 26 33 C25 41 23 46 17 46 Z"/><circle cx="27" cy="7" r="4"/><circle cx="20.4" cy="4.6" r="2.9"/><circle cx="15" cy="5.8" r="2.5"/><circle cx="10.6" cy="8.6" r="2.1"/><circle cx="7.6" cy="12.6" r="1.8"/></g></svg><span>${TEXTES.droite}</span></button>
      </div>`;
    racine.append(el);
    const svg = el.querySelector('.cr-svg');
    const texte = el.querySelector('.cr-texte');
    const d = decor();
    svg.innerHTML = `${d.fond}<g class="cr-loin">${d.loin}</g>${d.sol}<g class="cr-cafe">${cafe()}</g>
      <g class="cr-clement"><g class="cr-corps">${clementTrail()}</g></g>
      <g class="cr-cyriel"><g class="cr-corps">${cyrielNatte()}</g></g>
      <g class="cr-pres">${d.pres}</g>`;
    const $ = (s) => svg.querySelector(s);
    const loin = $('.cr-loin');
    const pres = $('.cr-pres');
    const cafeG = $('.cr-cafe');
    const coureurs = {
      clement: { g: $('.cr-clement'), corps: $('.cr-clement .cr-corps'), x: 0, v: ARRIVEE / DUREE, y: 232, k: 1.9, phase: 0, fini: false },
      cyriel: { g: $('.cr-cyriel'), corps: $('.cr-cyriel .cr-corps'), x: 0, cible: 0, v: 0, y: 260, k: 2.05, phase: 1.4, fini: false },
    };

    // Un toucher = un pas.
    let nbPas = 0;
    let encourage = false;
    let depart = false;
    function toucher(cote) {
      if (fin || !depart) return;
      nbPas++;
      coureurs.cyriel.cible = Math.min(ARRIVEE, coureurs.cyriel.cible + PAS);
      bip('clic', cote === 'droite' ? 0.55 : 0.4);
      const b = el.querySelector(`[data-cr="${cote}"]`);
      b.classList.remove('cr-presse');
      void b.offsetWidth;
      b.classList.add('cr-presse');
    }
    el.querySelectorAll('.cr-bouton').forEach((b) => {
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); toucher(b.dataset.cr); });
      b.addEventListener('click', (e) => { if (e.detail === 0) toucher(b.dataset.cr); });   // clavier
    });
    // Le départ : quand elle touche « C'est parti ! » (la consigne a eu le
    // temps d'être lue).
    const partez = el.querySelector('.cr-partez');
    partez.addEventListener('click', () => {
      depart = true;
      partez.remove();
      el.querySelector('.cr-boutons').classList.remove('cr-cache');
      bip('vol');
    }, { once: true });
    setTimeout(() => partez.focus({ preventScroll: true }), 50);

    const clavier = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); toucher('gauche'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); toucher('droite'); }
    };
    document.addEventListener('keydown', clavier);

    // Le départ : au premier toucher, ou tout seul après un court instant.
    let fin = false;
    let gagne = false;
    let avant = performance.now();
    let image = 0;
    const X0 = 40;
    const pas = (t) => {
      if (!el.isConnected) return;
      const dt = Math.min(0.05, (t - avant) / 1000) * V;
      avant = t;
      if (depart && !fin) {
        const cy = coureurs.cyriel;
        const cl = coureurs.clement;
        if (!cl.fini) {
          cl.x = Math.min(ARRIVEE, cl.x + cl.v * dt);
          if (cl.x >= ARRIVEE) cl.fini = true;
        }
        // elle rattrape doucement l'endroit où ses pas la mènent
        const avance = Math.min(cy.cible - cy.x, (cy.cible - cy.x) * 14 * dt + 0.01);
        cy.v = avance / Math.max(dt, 0.001);
        cy.x += avance;
        if (cy.x >= ARRIVEE - 0.05) { cy.x = ARRIVEE; cy.fini = true; }
        if (cl.fini && !cy.fini && !encourage) { encourage = true; texte.textContent = TEXTES.attend; bip('ding'); }
        if (cy.fini) {
          fin = true;
          gagne = !encourage;
          terminer();
        }
      }
      // le décor défile un peu (parallaxe), les coureurs avancent
      const moyenne = (coureurs.cyriel.x + coureurs.clement.x) / 2;
      loin.style.transform = `translateX(${(-moyenne * 0.15).toFixed(1)}px)`;
      pres.style.transform = `translateX(${(-moyenne * 0.6).toFixed(1)}px)`;
      cafeG.setAttribute('transform', `translate(${X0 + ARRIVEE + 28} 214) scale(1.1)`);
      for (const c of Object.values(coureurs)) {
        const court = depart && !c.fini && (c === coureurs.clement || c.v > 4);
        c.phase += dt * (court ? 4 + Math.min(c.v, 90) / 12 : 1.5);
        const saut = court ? Math.abs(Math.sin(c.phase)) * 9 : Math.abs(Math.sin(c.phase)) * (c === coureurs.clement && encourage ? 6 : 0);
        const penche = court ? 7 + Math.sin(c.phase * 2) * 3 : 0;
        c.g.setAttribute('transform', `translate(${(X0 + c.x).toFixed(1)} ${(c.y - saut).toFixed(1)}) rotate(${penche.toFixed(1)}) scale(${c.k})`);
      }
      image = requestAnimationFrame(pas);
    };
    image = requestAnimationFrame(pas);

    function terminer() {
      texte.textContent = gagne ? TEXTES.gagne : TEXTES.attend;
      bip('chiffre');
      el.querySelector('.cr-boutons').classList.add('cr-cache');
      if (fx) {
        const r = coureurs.cyriel.g.getBoundingClientRect();
        const base = racine.getBoundingClientRect();
        fx.coeurs(r.left + r.width / 2 - base.left, r.top - base.top, calme ? 6 : 14);
      }
      setTimeout(() => {
        cancelAnimationFrame(image);
        document.removeEventListener('keydown', clavier);
        el.classList.add('cr-sort');
        setTimeout(() => { el.remove(); fini(gagne); }, 450 / V);
      }, 1300 / V);
    }

    if (debug !== null) window.__course = { get pas() { return nbPas; }, get fin() { return fin; }, coureurs };
  });
}
