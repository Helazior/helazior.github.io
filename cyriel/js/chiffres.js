// Chiffres tracés au trait dans une boîte de 1 × 1 (y vers le bas), pour
// les dessiner « au néon » à n'importe quelle taille. Le 4 reprend
// exactement le tracé d'origine de la grotte.

const arc = (cx, cy, rx, ry, de, a, n = 18) => Array.from({ length: n + 1 }, (_, i) => {
  const t = ((de + ((a - de) * i) / n) * Math.PI) / 180;
  return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)];
});

const TRAITS = {
  0: [arc(0.5, 0.5, 0.42, 0.48, 0, 360, 36)],
  1: [[[0.28, 0.22], [0.6, 0.02], [0.6, 0.98]]],
  2: [[...arc(0.5, 0.3, 0.4, 0.28, -170, 35), [0.06, 0.98], [0.96, 0.98]]],
  3: [arc(0.5, 0.27, 0.38, 0.25, -160, 90), arc(0.5, 0.73, 0.42, 0.25, -90, 160)],
  4: [[[0.66, 0.0233], [0.0484, 0.62], [0.9677, 0.62]], [[0.66, 0.0233], [0.66, 0.9767]]],
  5: [[[0.9, 0.02], [0.16, 0.02], [0.1, 0.46], ...arc(0.48, 0.68, 0.42, 0.3, -125, 150)]],
  6: [arc(0.6, 0.7, 0.5, 0.63, -100, -180), arc(0.5, 0.7, 0.4, 0.28, 0, 360, 30)],
  7: [[[0.06, 0.02], [0.94, 0.02], [0.38, 0.98]]],
  8: [arc(0.5, 0.26, 0.32, 0.24, 0, 360, 30), arc(0.5, 0.72, 0.4, 0.27, 0, 360, 30)],
  9: [arc(0.5, 0.3, 0.4, 0.28, 0, 360, 30), arc(0.4, 0.3, 0.5, 0.68, 0, 100)],
};

/** Ajoute au chemin courant le tracé du chiffre dans le rectangle (x, y, l, h). */
export function tracerChiffre(ctx, chiffre, x, y, l, h) {
  ctx.beginPath();
  for (const trait of TRAITS[chiffre] || []) {
    trait.forEach(([u, v], i) => {
      if (i === 0) ctx.moveTo(x + u * l, y + v * h);
      else ctx.lineTo(x + u * l, y + v * h);
    });
  }
}

/** Le même tracé, en chemin SVG (attribut d). */
export function cheminChiffre(chiffre, x, y, l, h) {
  return (TRAITS[chiffre] || []).map((trait) => trait.map(([u, v], i) => `${i ? 'L' : 'M'}${(x + u * l).toFixed(2)} ${(y + v * h).toFixed(2)}`).join(' ')).join(' ');
}

/** Chiffre « au néon » violet en SVG, comme celui peint dans la grotte. */
export function chiffreNeon(chiffre, x, y, l, h) {
  const d = cheminChiffre(chiffre, x, y, l, h);
  const k = h / 86;
  const couche = (couleur, largeur) => `<path d="${d}" stroke="${couleur}" stroke-width="${(largeur * k).toFixed(2)}"/>`;
  return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">${couche('rgba(170,100,255,.28)', 26)}${couche('rgba(170,100,255,.42)', 17)}${couche('#9a45ff', 10.5)}${couche('#e6ccff', 3)}</g>`;
}
