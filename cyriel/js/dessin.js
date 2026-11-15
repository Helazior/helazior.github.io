// Petits dessins faits en code, partagés entre les étapes.

const TAU = Math.PI * 2;

/** Trace (sans remplir) un cœur centré en (0, 0), d'environ `t` de large. */
export function tracerCoeur(ctx, t) {
  const r = t / 2;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.95);
  ctx.bezierCurveTo(-r * 1.55, -r * 0.05, -r * 0.85, -r * 1.25, 0, -r * 0.45);
  ctx.bezierCurveTo(r * 0.85, -r * 1.25, r * 1.55, -r * 0.05, 0, r * 0.95);
  ctx.closePath();
}

/**
 * Dessine une chauve-souris centrée en (x, y).
 * @param env    envergure en pixels
 * @param phase  phase du battement d'ailes (radians)
 */
export function chauveSouris(ctx, x, y, env, phase, couleur, alpha = 1) {
  if (alpha <= 0) return;
  const d = env / 2;
  const b = Math.sin(phase);            // -1 (ailes basses) à 1 (ailes hautes)
  const bout = -d * (0.1 + 0.42 * b);   // hauteur du bout de l'aile
  const large = d * (0.86 + 0.14 * Math.cos(phase * 2));

  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = couleur;

  for (const cote of [-1, 1]) {
    ctx.save();
    ctx.scale(cote, 1);
    ctx.beginPath();
    ctx.moveTo(0, -d * 0.14);
    // bord d'attaque, de l'épaule au bout de l'aile
    ctx.quadraticCurveTo(large * 0.42, -d * 0.5 + bout * 0.7, large, bout);
    // bord de fuite festonné, retour vers le corps
    ctx.quadraticCurveTo(large * 0.84, bout * 0.55 + d * 0.06, large * 0.7, bout * 0.5 + d * 0.36);
    ctx.quadraticCurveTo(large * 0.56, bout * 0.3 + d * 0.1, large * 0.4, bout * 0.25 + d * 0.38);
    ctx.quadraticCurveTo(large * 0.24, d * 0.12, 0, d * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // corps, tête, oreilles
  ctx.beginPath();
  ctx.ellipse(0, d * 0.06, d * 0.15, d * 0.3, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -d * 0.24, d * 0.155, 0, TAU);
  ctx.fill();
  for (const cote of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cote * d * 0.15, -d * 0.27);
    ctx.lineTo(cote * d * 0.13, -d * 0.52);
    ctx.lineTo(cote * d * 0.01, -d * 0.36);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** Position des yeux d'une chauve-souris d'envergure `env` centrée en (0, 0). */
export function yeux(env) {
  const d = env / 2;
  return { dx: d * 0.068, y: -d * 0.25 };
}
