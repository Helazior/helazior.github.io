// La grotte de l'étape 2 : sa forme, ses obstacles et ce qu'on y trouve.
//
// La grotte est vue en coupe. On la décrit par des formes simples :
//   - de l'AIR creusé dans la roche (salles en ellipse, galeries) ;
//   - des OBSTACLES de roche ajoutés ensuite (stalactites, stalagmites, blocs).
// Un bruit déforme légèrement le tout pour que les parois aient l'air naturelles.
// Le résultat est toujours le même (le hasard est fixé par GRAINE).
//
// Ce fichier ne touche pas à l'affichage : il sert aussi au script de
// vérification (outils/verifier-grotte.mjs).

export const MONDE = { l: 1760, h: 1250, pas: 4 };

export const DEPART = { x: 150, y: 1030 };
export const SORTIE = { x: 1668, y: 104, rayon: 60 };

// Le chiffre du code caché dans cette étape, peint en violet lumineux à
// côté des chevaux (coin haut-gauche et taille, en pixels du monde).
export const CHIFFRE = { valeur: 4, x: 978, y: 826, l: 62, h: 86 };

export const RAYON_CORPS = 11;   // « épaisseur » de la chauve-souris face à la roche

const GRAINE = 2311;             // 23/11 :)

/* ------------------------------------------------------------ Le plan */

const salle = (x, y, rx, ry) => ({ genre: 'salle', x, y, rx, ry });
const galerie = (largeur, ...pts) => ({ genre: 'galerie', largeur, pts });
const pointe = (ax, ay, bx, by, r0, r1) => ({ genre: 'pointe', ax, ay, bx, by, r0, r1 });
const bloc = (x, y, r) => ({ genre: 'bloc', x, y, r });

const AIR = [
  salle(240, 1010, 190, 140),                                 // A — départ
  galerie(110, [400, 990], [600, 930], [700, 950]),
  salle(900, 900, 240, 185),                                  // B — chevaux ponctués + le chiffre
  galerie(100, [1080, 990], [1240, 1080]),
  salle(1380, 1080, 170, 110),                                // C — cul-de-sac aux moustiques
  galerie(110, [880, 740], [830, 600], [680, 500]),
  salle(480, 430, 240, 165),                                  // D — mégacéros et bouquetin
  galerie(95, [300, 330], [200, 230]),
  salle(170, 180, 110, 90),                                   // G — petite niche
  galerie(110, [690, 380], [900, 290], [1080, 360]),
  salle(1270, 420, 230, 180),                                 // F — mammouths
  galerie(110, [1430, 320], [1560, 210], [1660, 110]),
  salle(SORTIE.x, SORTIE.y, 78, 78),                          // E — sortie
];

const OBSTACLES = [
  // salle A
  pointe(180, 868, 192, 948, 22, 5),
  pointe(305, 1152, 300, 1070, 26, 6),
  bloc(372, 1088, 26),
  // galerie A → B
  pointe(520, 898, 524, 942, 14, 4),
  // salle B
  pointe(760, 728, 770, 800, 22, 5),
  pointe(1012, 722, 1002, 790, 20, 5),
  pointe(790, 1088, 800, 1004, 28, 6),
  pointe(1000, 1088, 990, 1012, 24, 6),
  bloc(895, 1070, 28),
  // galerie B → D
  bloc(800, 662, 18),
  // salle C
  pointe(1330, 972, 1336, 1040, 20, 5),
  pointe(1440, 1192, 1434, 1122, 22, 5),
  bloc(1284, 1136, 20),
  // salle D
  pointe(380, 268, 386, 346, 24, 5),
  pointe(562, 272, 556, 342, 22, 5),
  pointe(330, 592, 336, 514, 24, 6),
  pointe(470, 600, 476, 534, 20, 5),
  pointe(602, 588, 596, 506, 26, 6),
  // niche G
  pointe(150, 92, 156, 148, 16, 4),
  // galerie D → F
  pointe(900, 232, 900, 272, 14, 4),
  // salle F
  pointe(1150, 248, 1156, 328, 22, 5),
  pointe(1352, 242, 1346, 322, 24, 5),
  pointe(1130, 592, 1140, 514, 24, 6),
  pointe(1282, 604, 1286, 524, 26, 6),
  pointe(1402, 588, 1396, 518, 22, 5),
  bloc(1478, 478, 26),
  // galerie F → sortie
  bloc(1502, 292, 15),
];

// Les moustiques à gober en chemin (facultatifs).
export const MOUSTIQUES = [
  [330, 965], [596, 948], [712, 905], [1366, 1062], [1456, 1084], [1296, 1092],
  [428, 468], [648, 420], [148, 196], [214, 162], [1204, 546], [1424, 402], [1556, 216],
].map(([x, y]) => ({ x, y }));

/* ------------------------------------------------------------- Bruit */

function alea(ix, iy, graine) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(graine, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function bruitLisse(x, y, graine) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  let fx = x - ix;
  let fy = y - iy;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = alea(ix, iy, graine);
  const b = alea(ix + 1, iy, graine);
  const c = alea(ix, iy + 1, graine);
  const d = alea(ix + 1, iy + 1, graine);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/** Bruit « nuageux » entre 0 et 1. */
export function nuage(x, y, graine = GRAINE) {
  return (bruitLisse(x, y, graine) * 4 + bruitLisse(x * 2.1, y * 2.1, graine + 7) * 2
    + bruitLisse(x * 4.3, y * 4.3, graine + 13)) / 7;
}

/* --------------------------------------------- Distances aux formes */

function distSegment(px, py, ax, ay, bx, by) {
  const vx = bx - ax;
  const vy = by - ay;
  const l2 = vx * vx + vy * vy || 1;
  let t = ((px - ax) * vx + (py - ay) * vy) / l2;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return { d: Math.hypot(px - ax - vx * t, py - ay - vy * t), t };
}

// Distance signée (négative à l'intérieur de la forme).
function distance(f, x, y) {
  switch (f.genre) {
    case 'salle':
      return (Math.hypot((x - f.x) / f.rx, (y - f.y) / f.ry) - 1) * Math.min(f.rx, f.ry);
    case 'galerie': {
      let d = Infinity;
      for (let i = 0; i < f.pts.length - 1; i++) {
        const s = distSegment(x, y, f.pts[i][0], f.pts[i][1], f.pts[i + 1][0], f.pts[i + 1][1]);
        if (s.d < d) d = s.d;
      }
      return d - f.largeur / 2;
    }
    case 'pointe': {
      const s = distSegment(x, y, f.ax, f.ay, f.bx, f.by);
      return s.d - (f.r0 + (f.r1 - f.r0) * s.t);
    }
    default: // bloc
      return Math.hypot(x - f.x, y - f.y) - f.r;
  }
}

/* --------------------------------------------------- Construction */

/**
 * Calcule la grotte sur une grille de 4 px.
 * `champ` > 0 : roche ; < 0 : air (la valeur approche la distance à la paroi).
 */
export function creerGrotte() {
  const { l, h, pas } = MONDE;
  const cols = l / pas + 1;
  const rangs = Math.ceil(h / pas) + 1;
  const champ = new Float32Array(cols * rangs);
  const grain = new Float32Array(cols * rangs);

  for (let j = 0; j < rangs; j++) {
    const y = j * pas;
    for (let i = 0; i < cols; i++) {
      const x = i * pas;
      let air = Infinity;
      for (const f of AIR) { const d = distance(f, x, y); if (d < air) air = d; }
      let roche = Infinity;
      for (const f of OBSTACLES) { const d = distance(f, x, y); if (d < roche) roche = d; }
      const n1 = nuage(x / 90, y / 90) - 0.5;
      const n2 = nuage(x / 34, y / 34, GRAINE + 31) - 0.5;
      let g = Math.max(air + n1 * 34 + n2 * 9, -(roche + n2 * 10));
      // le bord du monde est toujours de la roche
      const bord = Math.min(x, y, l - x, h - y);
      g = Math.max(g, 22 - bord);
      champ[j * cols + i] = g;
      grain[j * cols + i] = nuage(x / 48, y / 48, GRAINE + 97);
    }
  }

  function lire(tab, x, y) {
    let gx = x / pas;
    let gy = y / pas;
    if (gx < 0) gx = 0; else if (gx > cols - 1.001) gx = cols - 1.001;
    if (gy < 0) gy = 0; else if (gy > rangs - 1.001) gy = rangs - 1.001;
    const i = gx | 0;
    const j = gy | 0;
    const fx = gx - i;
    const fy = gy - j;
    const k = j * cols + i;
    const a = tab[k];
    const b = tab[k + 1];
    const c = tab[k + cols];
    const d = tab[k + cols + 1];
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }

  const valeur = (x, y) => lire(champ, x, y);
  const solide = (x, y) => lire(champ, x, y) > 0;
  const bloque = (x, y) => lire(champ, x, y) > -RAYON_CORPS;

  /**
   * Lance un rayon depuis (ox, oy) dans la direction (dx, dy).
   * Renvoie la distance parcourue avant la roche (ou `max`) et s'il a touché.
   */
  function rayon(ox, oy, dx, dy, max) {
    for (let d = 2; d < max; d += 2) {
      if (lire(champ, ox + dx * d, oy + dy * d) > 0) return { d, touche: true };
    }
    return { d: max, touche: false };
  }

  return { cols, rangs, champ, grain, valeur, solide, bloque, rayon, texture: (x, y) => lire(grain, x, y) };
}
