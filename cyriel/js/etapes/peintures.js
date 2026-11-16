// Les peintures des parois de la grotte, dessinées à la main en code,
// à la manière de celles vues dans le Lot :
//   - Pech Merle : cheval ponctué, mains négatives, points rouges, mammouths ;
//   - Cougnac : mégacéros et bouquetin à l'ocre rouge.
// Ce sont de simples décors : rien ici n'est cliquable.
//
// Tout est tracé en pixels du monde ; le contexte reçu est déjà mis à l'échelle.

import { CHIFFRE } from './grotte.js';
import { tracerChiffre } from '../chiffres.js';

const NOIR = '#17120f';
export const OCRE_ROUGE = '#a13c22';
const OCRE_JAUNE = '#c98a3c';
const VIOLET = '#9a45ff';

// Hasard fixé : le tremblé des traits est le même à chaque partie.
let graine = 20261123;
function alea() {
  graine = (graine + 0x6d2b79f5) | 0;
  let t = Math.imul(graine ^ (graine >>> 15), 1 | graine);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const tremble = (v, j) => v + (alea() - 0.5) * j;

/* --------------------------------------------------------- Outils */

function courbe(ctx, pts) {
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
  }
  const d = pts[pts.length - 1];
  ctx.lineTo(d[0], d[1]);
}

// Un trait « au charbon » : trois passages légèrement décalés.
export function trait(ctx, pts, couleur, largeur = 3) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = couleur;
  [[1, 0.85, 0], [0.6, 0.45, 1.6], [1.5, 0.25, 1.2]].forEach(([l, a, j]) => {
    ctx.globalAlpha = a;
    ctx.lineWidth = largeur * l;
    ctx.beginPath();
    courbe(ctx, pts.map(([x, y]) => [tremble(x, j), tremble(y, j)]));
    ctx.stroke();
  });
  ctx.restore();
}

function tache(ctx, pts, couleur, alpha = 0.85) {
  ctx.save();
  ctx.fillStyle = couleur;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  courbe(ctx, pts);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function point(ctx, x, y, r, couleur, alpha = 0.85) {
  ctx.save();
  ctx.fillStyle = couleur;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.ellipse(tremble(x, 1.5), tremble(y, 1.5), r * (0.9 + alea() * 0.25), r * (0.9 + alea() * 0.25), alea() * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Place un dessin : origine (x, y), échelle e, retourné ou non.
function poser(ctx, x, y, e, largeur, retourne, dessin) {
  ctx.save();
  ctx.translate(x, y);
  if (retourne) { ctx.translate(largeur * e, 0); ctx.scale(-e, e); } else ctx.scale(e, e);
  dessin();
  ctx.restore();
}

// Une plage de calcaire clair, pour que les peintures ressortent.
function panneau(ctx, x, y, rx, ry) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, 'rgba(203, 184, 146, 0.72)');
  g.addColorStop(0.55, 'rgba(190, 168, 130, 0.58)');
  g.addColorStop(0.85, 'rgba(160, 138, 108, 0.22)');
  g.addColorStop(1, 'rgba(150, 128, 100, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ------------------------------------------------------- Figures */

// Cheval ponctué (boîte 220 × 160, tourné vers la gauche).
function cheval(ctx) {
  // tête et encolure, pleines et noires
  tache(ctx, [[20, 58], [26, 46], [36, 38], [52, 30], [72, 28], [90, 35], [76, 52], [60, 68],
    [46, 71], [36, 64], [28, 72], [18, 74], [13, 66]], NOIR, 0.88);
  // crinière
  for (let x = 40; x <= 84; x += 7) trait(ctx, [[x, 32 - (x > 50 ? 2 : -4)], [x + 3, 23 - (x > 50 ? 2 : -4)]], NOIR, 2.4);
  trait(ctx, [[86, 34], [100, 38], [120, 43], [146, 41], [170, 45], [188, 57], [196, 76]], NOIR, 3.2);   // dos, croupe
  trait(ctx, [[193, 62], [206, 84], [209, 112], [204, 132]], NOIR, 3);                                   // queue
  trait(ctx, [[60, 68], [58, 84], [63, 100], [72, 111], [92, 119], [122, 123], [150, 119], [170, 106]], NOIR, 3); // poitrail, ventre
  trait(ctx, [[70, 110], [73, 130], [70, 151]], NOIR, 2.6);
  trait(ctx, [[86, 118], [90, 136], [87, 153]], NOIR, 2.6);
  trait(ctx, [[170, 106], [179, 123], [173, 139], [175, 155]], NOIR, 2.6);
  trait(ctx, [[195, 78], [197, 104], [189, 127], [193, 151]], NOIR, 2.6);
  // ponctuations
  [[100, 60], [118, 72], [136, 58], [152, 74], [110, 92], [131, 97], [151, 99], [169, 84],
    [93, 78], [122, 53], [161, 56], [141, 83], [80, 96], [178, 66]].forEach(([x, y]) => point(ctx, x, y, 4.2, NOIR));
  [[104, 14], [128, 19], [152, 17], [176, 26], [82, 10], [202, 40]].forEach(([x, y]) => point(ctx, x, y, 4.2, NOIR, 0.8));
  [[66, 132], [100, 138], [134, 140], [160, 136]].forEach(([x, y]) => point(ctx, x, y, 4, OCRE_ROUGE));
}

// Mammouth (boîte 220 × 175, tourné vers la gauche).
export function mammouth(ctx, couleur = NOIR) {
  trait(ctx, [[40, 64], [46, 46], [58, 34], [74, 32], [86, 40], [92, 50], [104, 40], [122, 34],
    [142, 38], [164, 54], [184, 80], [194, 108], [196, 128]], couleur, 3.4);                  // crâne, bosse, dos
  trait(ctx, [[40, 64], [30, 84], [25, 108], [27, 132], [34, 148], [42, 153]], couleur, 3);    // trompe
  trait(ctx, [[52, 92], [46, 112], [45, 132], [48, 145], [42, 153]], couleur, 2.6);
  trait(ctx, [[49, 93], [37, 111], [38, 127], [50, 131], [60, 122]], couleur, 2.8);           // défense
  trait(ctx, [[54, 94], [61, 106], [63, 120]], couleur, 2.6);
  trait(ctx, [[63, 120], [63, 143], [60, 167]], couleur, 2.8);                                 // patte avant
  trait(ctx, [[87, 130], [87, 149], [84, 167]], couleur, 2.8);
  trait(ctx, [[58, 168], [86, 168]], couleur, 2.4);
  trait(ctx, [[170, 130], [171, 150], [168, 167]], couleur, 2.8);                              // patte arrière
  trait(ctx, [[196, 128], [195, 150], [190, 167]], couleur, 2.8);
  trait(ctx, [[166, 168], [192, 168]], couleur, 2.4);
  trait(ctx, [[196, 112], [205, 127]], couleur, 2.2);                                          // queue
  // longs poils du ventre
  for (let x = 92; x <= 166; x += 7) {
    trait(ctx, [[x, 128 + alea() * 4], [x - 2, 140], [x - 4 + alea() * 4, 152 + alea() * 6]], couleur, 1.8);
  }
  // toupet et poils de la bosse
  [[60, 34], [68, 32], [76, 33], [108, 38], [118, 35]].forEach(([x, y]) => trait(ctx, [[x, y], [x - 2, y + 9]], couleur, 1.6));
  point(ctx, 58, 58, 2.4, couleur);
}

// Mégacéros de Cougnac (boîte 230 × 150, tourné vers la gauche).
function megaceros(ctx) {
  const c = OCRE_ROUGE;
  trait(ctx, [[14, 70], [22, 60], [32, 54], [46, 50], [62, 48], [78, 34], [96, 22], [112, 20],
    [126, 28], [146, 40], [172, 46], [198, 52], [212, 66], [216, 86]], c, 3.6);                // tête, garrot en bosse, dos
  trait(ctx, [[14, 70], [18, 78], [30, 80], [44, 76], [56, 84], [64, 98]], c, 3);              // mâchoire, gorge
  trait(ctx, [[64, 98], [68, 122], [66, 146]], c, 2.8);
  trait(ctx, [[82, 106], [86, 126], [84, 146]], c, 2.8);
  trait(ctx, [[82, 106], [110, 111], [140, 111], [168, 102]], c, 3);                           // ventre
  trait(ctx, [[168, 102], [178, 120], [176, 146]], c, 2.8);
  trait(ctx, [[214, 82], [210, 108], [214, 144]], c, 2.8);
  trait(ctx, [[34, 52], [30, 34], [20, 20]], c, 2.6);                                          // bois
  trait(ctx, [[30, 34], [42, 22]], c, 2.4);
  trait(ctx, [[26, 27], [14, 31]], c, 2.2);
  // hachures de la bosse
  for (let x = 84; x <= 120; x += 9) trait(ctx, [[x, 30 + Math.abs(x - 104) * 0.3], [x - 4, 44 + Math.abs(x - 104) * 0.3]], c, 1.8);
  point(ctx, 28, 62, 2, c);
}

// Bouquetin (boîte 115 × 100, tourné vers la droite).
function bouquetin(ctx) {
  const c = OCRE_ROUGE;
  trait(ctx, [[100, 42], [94, 32], [84, 30], [70, 36], [48, 36], [28, 38], [16, 48], [14, 62]], c, 2.8);
  trait(ctx, [[90, 30], [82, 10], [62, 2], [46, 8]], c, 2.8);                                  // grandes cornes
  trait(ctx, [[86, 31], [76, 16], [60, 10], [50, 14]], c, 2.2);
  trait(ctx, [[100, 42], [98, 50], [88, 52], [82, 60], [78, 67]], c, 2.6);
  trait(ctx, [[78, 67], [58, 69], [36, 67], [26, 62]], c, 2.6);
  trait(ctx, [[78, 67], [80, 82], [78, 95]], c, 2.4);
  trait(ctx, [[66, 68], [68, 84], [66, 95]], c, 2.2);
  trait(ctx, [[14, 62], [18, 80], [14, 95]], c, 2.4);
  trait(ctx, [[26, 62], [30, 80], [28, 95]], c, 2.2);
  trait(ctx, [[94, 52], [92, 61]], c, 2);                                                      // barbiche
}

// Main négative : un halo de pigment soufflé autour d'une main posée sur la paroi.
function mainNegative(ctx, x, y, taille = 1, couleur = OCRE_ROUGE, angle = 0) {
  const c = document.createElement('canvas');
  const k = 3;                               // dessinée 3 fois plus grande, pour rester nette
  c.width = 120 * k;
  c.height = 130 * k;
  const m = c.getContext('2d');
  m.scale(k, k);
  const g = m.createRadialGradient(60, 62, 8, 60, 62, 58);
  g.addColorStop(0, couleur);
  g.addColorStop(0.55, couleur);
  g.addColorStop(1, 'rgba(161, 60, 34, 0)');
  m.globalAlpha = 0.82;
  m.fillStyle = g;
  m.fillRect(0, 0, 120, 130);
  // éclaboussures
  m.fillStyle = couleur;
  for (let i = 0; i < 46; i++) {
    const a = alea() * Math.PI * 2;
    const d = 40 + alea() * 18;
    m.globalAlpha = 0.25 + alea() * 0.35;
    m.beginPath();
    m.arc(60 + Math.cos(a) * d, 62 + Math.sin(a) * d, 0.8 + alea() * 1.6, 0, Math.PI * 2);
    m.fill();
  }
  // la main, retirée du halo
  m.globalAlpha = 1;
  m.globalCompositeOperation = 'destination-out';
  m.lineCap = 'round';
  m.strokeStyle = '#000';
  m.fillStyle = '#000';
  m.beginPath();
  m.ellipse(60, 76, 15, 17, 0, 0, Math.PI * 2);
  m.fill();
  m.fillRect(51, 84, 18, 46);
  [[52, 64, 46, 36, 7.5], [59, 62, 58, 30, 8], [66, 63, 69, 35, 7.5], [72, 69, 80, 48, 6.5], [47, 76, 33, 62, 8]]
    .forEach(([ax, ay, bx, by, l]) => {
      m.lineWidth = l;
      m.beginPath();
      m.moveTo(ax, ay);
      m.lineTo(bx, by);
      m.stroke();
    });

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(taille, taille);
  ctx.drawImage(c, -60, -65, 120, 130);
  ctx.restore();
}

// Le chiffre du code : violet lumineux, pour trancher avec l'ocre et le noir.
function chiffre(ctx) {
  const { valeur, x, y, l, h } = CHIFFRE;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const tracer = () => {
    tracerChiffre(ctx, valeur, x, y, l, h);
    ctx.stroke();
  };
  // halo
  ctx.strokeStyle = 'rgba(170, 100, 255, 0.28)';
  ctx.lineWidth = 26;
  tracer();
  ctx.strokeStyle = 'rgba(170, 100, 255, 0.4)';
  ctx.lineWidth = 17;
  tracer();
  // chiffre
  ctx.strokeStyle = VIOLET;
  ctx.lineWidth = 10.5;
  tracer();
  ctx.strokeStyle = '#e6ccff';
  ctx.lineWidth = 3;
  tracer();
  ctx.restore();
}

/* ------------------------------------------------ Toute la grotte */

/** Peint toutes les parois. À appeler après le fond, avant la roche. */
export function peindreParois(ctx) {
  graine = 20261123;

  // Salle A (départ) : quelques points, pour annoncer la suite.
  [[232, 936], [250, 931], [268, 929], [286, 930], [304, 934]].forEach(([x, y]) => point(ctx, x, y, 4.5, OCRE_ROUGE, 0.7));

  // Salle B : le panneau des chevaux ponctués, et le chiffre.
  panneau(ctx, 892, 880, 228, 132);
  mainNegative(ctx, 800, 792, 0.62, OCRE_ROUGE, -0.25);
  mainNegative(ctx, 905, 776, 0.62, NOIR, 0.1);
  poser(ctx, 732, 806, 1, 220, false, () => cheval(ctx));
  chiffre(ctx);

  // Salle C : mains et ponctuations.
  panneau(ctx, 1388, 1076, 128, 76);
  mainNegative(ctx, 1352, 1070, 0.66, OCRE_ROUGE, -0.15);
  mainNegative(ctx, 1432, 1082, 0.6, OCRE_ROUGE, 0.3);
  for (let i = 0; i < 6; i++) point(ctx, 1368 + i * 13, 1130 + Math.sin(i) * 3, 4, OCRE_ROUGE);

  // Salle D : mégacéros et bouquetin de Cougnac.
  panneau(ctx, 492, 424, 208, 112);
  poser(ctx, 338, 346, 1, 230, false, () => megaceros(ctx));
  poser(ctx, 566, 396, 0.92, 115, false, () => bouquetin(ctx));
  [[392, 508], [407, 512], [422, 514]].forEach(([x, y]) => point(ctx, x, y, 3.6, OCRE_JAUNE));

  // Niche G : une main et des points.
  panneau(ctx, 172, 186, 78, 60);
  mainNegative(ctx, 180, 190, 0.6, OCRE_ROUGE, 0.2);
  for (let i = 0; i < 4; i++) point(ctx, 118 + i * 11, 216 - i * 3, 3.6, OCRE_ROUGE);

  // Salle F : la frise des mammouths.
  panneau(ctx, 1262, 420, 182, 118);
  poser(ctx, 1128, 334, 1, 220, false, () => mammouth(ctx));
  poser(ctx, 1338, 372, 0.52, 220, true, () => mammouth(ctx));
}
