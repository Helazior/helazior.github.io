// Étape 1 — les deux boutons.
//
// « Commencer » : à chaque clic, « Clément c'est vraiment le meilleur ❤️ »
// grossit et des cœurs violets jaillissent. Au 8e clic, la phrase prend tout
// l'écran puis éclate en chauves-souris violettes, et le fond passe au noir.
// « Non » : garde toujours sa taille, ne disparaît jamais, se téléporte dès
// qu'on clique dessus, ne chevauche jamais l'autre bouton et se décale quand
// celui-ci grossit.

const CLICS = 8;        // nombre de clics pour faire éclater la phrase
const TAILLE_DEPART = 22; // taille de la phrase au départ (px)
const MARGE = 14;       // marge avec les bords de l'écran
const ECART = 12;       // distance minimale entre les deux boutons
const OMBRE = 12;       // le relief du gros bouton dépasse en dessous

const TEXTE_PETIT = 'Commencer le jeu parce que';
const TEXTE_GROS = "Clément c'est vraiment le meilleur ❤️";
const TEXTE_NON = "Non c'est un gros caca (prout) 💩";

const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasard = (a, b) => a + Math.random() * (b - a);
const borner = (v, a, b) => Math.min(b, Math.max(a, v));
const croise = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export default {
  fond: 'clair',
  ambiance: 'sons/etape-1.mp3',

  demarrer({ scene, son, fx, fond, suivante }) {
    const racine = document.createElement('div');
    racine.className = 'e1';

    const oui = document.createElement('button');
    oui.type = 'button';
    oui.className = 'e1-oui';
    const petit = document.createElement('span');
    petit.className = 'e1-petit';
    petit.textContent = TEXTE_PETIT;
    const gros = document.createElement('span');
    gros.className = 'e1-gros';
    gros.textContent = TEXTE_GROS;
    oui.append(petit, gros);

    const non = document.createElement('button');
    non.type = 'button';
    non.className = 'e1-non';
    non.textContent = TEXTE_NON;

    racine.append(oui, non);
    scene.append(racine);

    const boutonSon = document.getElementById('son');
    let clics = 0;
    let tailles = [];
    let pos = { x: 0, y: 0 };
    let fini = false;
    let minuterie = 0;

    const ecran = () => ({ L: racine.clientWidth, H: racine.clientHeight });

    /* ---------------------------------------- Taille du gros bouton */

    // On cherche la plus grande taille de police pour laquelle le bouton
    // tient à l'écran en laissant une bande libre en haut et en bas, pour
    // que « Non » ait toujours une place. Les 8 tailles vont de la taille
    // de départ à ce maximum, en progression régulière.
    function calculerTailles() {
      const { H } = ecran();
      const hMax = H - 2 * (non.offsetHeight + 2 * ECART + MARGE);
      const tient = (t) => {
        oui.style.fontSize = t + 'px';
        return oui.scrollWidth <= oui.clientWidth + 1 && oui.offsetHeight <= hMax;
      };
      let bas = TAILLE_DEPART;
      let haut = 480;
      if (!tient(bas)) { haut = bas; bas = 10; }
      for (let i = 0; i < 16; i++) {
        const milieu = (bas + haut) / 2;
        if (tient(milieu)) bas = milieu; else haut = milieu;
      }
      const depart = Math.min(TAILLE_DEPART, bas);
      tailles = Array.from({ length: CLICS }, (_, k) => depart * Math.pow(bas / depart, k / (CLICS - 1)));
      oui.style.fontSize = tailles[Math.min(clics, CLICS - 1)] + 'px';
    }

    /* ------------------------------------------- Placement de « Non » */

    function zoneOui() {
      const { L, H } = ecran();
      const l = oui.offsetWidth;
      const h = oui.offsetHeight;
      return { x: (L - l) / 2 - ECART, y: (H - h) / 2 - ECART, w: l + 2 * ECART, h: h + 2 * ECART + OMBRE };
    }

    function zoneSon() {
      const r = boutonSon.getBoundingClientRect();
      const s = racine.getBoundingClientRect();
      return { x: r.left - s.left - 6, y: r.top - s.top - 6, w: r.width + 12, h: r.height + 12 };
    }

    function tailleNon() {
      return { w: non.offsetWidth, h: non.offsetHeight + 4 };
    }

    function libre(x, y) {
      const { L, H } = ecran();
      const { w, h } = tailleNon();
      if (x < MARGE || y < MARGE || x + w > L - MARGE || y + h > H - MARGE) return false;
      const moi = { x, y, w, h };
      return !croise(moi, zoneOui()) && !croise(moi, zoneSon());
    }

    function poser(x, y, enGlissant) {
      pos = { x: Math.round(x), y: Math.round(y) };
      non.classList.toggle('glisse', enGlissant);
      non.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }

    function placeAuHasard() {
      const { L, H } = ecran();
      const { w, h } = tailleNon();
      return [hasard(MARGE, Math.max(MARGE, L - MARGE - w)), hasard(MARGE, Math.max(MARGE, H - MARGE - h))];
    }

    // Clic sur « Non » : il réapparaît ailleurs, le plus loin possible.
    function teleporter() {
      const { L, H } = ecran();
      let loin = Math.min(L, H) * 0.4;
      for (let passe = 0; passe < 4; passe++, loin /= 2.5) {
        for (let i = 0; i < 90; i++) {
          const [x, y] = placeAuHasard();
          if (libre(x, y) && Math.hypot(x - pos.x, y - pos.y) >= loin) { poser(x, y, false); return; }
        }
      }
    }

    // Le gros bouton vient de grossir : si « Non » est dans le passage,
    // il se pousse vers la place libre la plus proche.
    function decaler() {
      if (libre(pos.x, pos.y)) return;
      const { L, H } = ecran();
      const { w, h } = tailleNon();
      const o = zoneOui();
      const cx = borner(pos.x, MARGE, L - MARGE - w);
      const cy = borner(pos.y, MARGE, H - MARGE - h);
      const candidats = [
        [cx, o.y - h - 1], [cx, o.y + o.h + 1],
        [o.x - w - 1, cy], [o.x + o.w + 1, cy],
      ];
      for (let i = 0; i < 160; i++) candidats.push(placeAuHasard());
      let meilleur = null;
      let dMin = Infinity;
      for (const [x, y] of candidats) {
        if (!libre(x, y)) continue;
        const d = Math.hypot(x - pos.x, y - pos.y);
        if (d < dMin) { dMin = d; meilleur = [x, y]; }
      }
      if (meilleur) poser(meilleur[0], meilleur[1], true);
    }

    function placerAuDepart() {
      const { L } = ecran();
      const o = zoneOui();
      poser((L - non.offsetWidth) / 2, o.y + o.h + 8, false);
      decaler();
    }

    /* ------------------------------------------------------- Clics */

    function pointDuClic(e, bouton) {
      if (e.detail === 0 || (!e.clientX && !e.clientY)) {   // clavier
        const r = bouton.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      return { x: e.clientX, y: e.clientY };
    }

    oui.addEventListener('click', (e) => {
      if (fini) return;
      clics++;
      const p = pointDuClic(e, oui);
      fx.coeurs(p.x, p.y, 5 + clics);
      son.bip('clic', clics / CLICS);

      if (clics >= CLICS) { eclater(); return; }

      oui.style.fontSize = tailles[clics] + 'px';
      if (!calme) {
        oui.animate([
          { transform: 'translate(-50%, -50%) scale(0.9)' },
          { transform: 'translate(-50%, -50%) scale(1)' },
        ], { duration: 300, easing: 'cubic-bezier(0.3, 1.7, 0.5, 1)' });
      }
      decaler();
    });

    non.addEventListener('click', () => {
      if (fini) return;
      son.bip('non');
      teleporter();
      if (!calme) {
        const ici = `translate(${pos.x}px, ${pos.y}px)`;
        non.animate([
          { transform: ici + ' scale(0.5)' },
          { transform: ici + ' scale(1)' },
        ], { duration: 240, easing: 'cubic-bezier(0.3, 1.7, 0.5, 1)' });
      }
    });

    /* -------------------------------------------------- Éclatement */

    async function eclater() {
      fini = true;
      const { L, H } = ecran();
      const echelle = Math.max(L / oui.offsetWidth, H / oui.offsetHeight) * 1.3;
      const gonfle = oui.animate([
        { transform: 'translate(-50%, -50%) scale(1)' },
        { transform: `translate(-50%, -50%) scale(${echelle})` },
      ], { duration: calme ? 250 : 650, easing: 'cubic-bezier(0.6, 0, 0.9, 0.4)', fill: 'forwards' });
      try { await gonfle.finished; } catch { return; }
      if (!racine.isConnected) return;

      son.bip('eclat');
      oui.remove();
      fx.chauvesSouris(L / 2, H / 2);
      fond('sombre');

      // « Non » est soufflé par l'éclatement.
      const ici = `translate(${pos.x}px, ${pos.y}px)`;
      const versX = pos.x + (pos.x + non.offsetWidth / 2 < L / 2 ? -L : L);
      non.animate([
        { transform: ici + ' rotate(0deg)', opacity: 1 },
        { transform: `translate(${versX}px, ${pos.y - H * 0.4}px) rotate(540deg)`, opacity: 0 },
      ], { duration: 800, easing: 'cubic-bezier(0.2, 0.6, 0.6, 1)', fill: 'forwards' });

      minuterie = setTimeout(suivante, calme ? 900 : 1700);
    }

    /* ------------------------------------------------------- Départ */

    function recaler() {
      if (fini) return;
      calculerTailles();
      if (!libre(pos.x, pos.y)) decaler();
    }

    calculerTailles();
    placerAuDepart();
    // La police arrive parfois après le premier affichage : on remesure.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (fini || !racine.isConnected) return;
        calculerTailles();
        if (clics === 0) placerAuDepart(); else decaler();
      });
    }
    window.addEventListener('resize', recaler);

    return () => {
      clearTimeout(minuterie);
      window.removeEventListener('resize', recaler);
    };
  },
};
