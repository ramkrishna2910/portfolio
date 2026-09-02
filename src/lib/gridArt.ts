// Deterministic "kinetic grid" artwork for writing cards: the same warped-grid
// language as the homepage hero, seeded by the post title so every card gets
// unique but stable art. Pure build-time SVG, no client JS.

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return h >>> 0;
}

function rng(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

export function gridArt(seedText: string, w = 640, h = 260): string {
  const r = rng(hash(seedText));
  const cell = 48;
  const cols = Math.ceil(w / cell) + 1;
  const rows = Math.ceil(h / cell) + 1;
  const fx = w * (0.15 + 0.7 * r());
  const fy = h * (0.2 + 0.6 * r());
  const influence = 150 + 80 * r();
  const maxWarp = 16 + 10 * r();

  const pts: { x: number; y: number; p: number }[][] = [];
  for (let row = 0; row < rows; row++) {
    pts[row] = [];
    for (let col = 0; col < cols; col++) {
      const gx = (col * w) / (cols - 1);
      const gy = (row * h) / (rows - 1);
      const dx = gx - fx;
      const dy = gy - fy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const prox = Math.max(0, 1 - dist / influence);
      let x = gx;
      let y = gy;
      if (dist > 0 && dist < influence) {
        const t = dist / influence;
        const eased = (1 - t) * (1 - t) * Math.min(1, dist / 50);
        const amt = eased * maxWarp;
        x = gx - (dx / dist) * amt;
        y = gy - (dy / dist) * amt;
      }
      pts[row]![col] = { x, y, p: prox * prox * (3 - 2 * prox) };
    }
  }

  const parts: string[] = [];
  const seg = (a: { x: number; y: number; p: number }, b: { x: number; y: number; p: number }) => {
    const t = (a.p + b.p) / 2;
    const color = t > 0.12 ? "202,138,4" : "26,28,30";
    const op = t > 0.12 ? (0.15 + 0.6 * t).toFixed(2) : "0.07";
    const width = (0.8 + 0.9 * t).toFixed(2);
    parts.push(
      `<line x1="${a.x.toFixed(0)}" y1="${a.y.toFixed(0)}" x2="${b.x.toFixed(0)}" y2="${b.y.toFixed(0)}" stroke="rgba(${color},${op})" stroke-width="${width}"/>`,
    );
  };
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols - 1; col++) seg(pts[row]![col]!, pts[row]![col + 1]!);
  for (let col = 0; col < cols; col++)
    for (let row = 0; row < rows - 1; row++) seg(pts[row]![col]!, pts[row + 1]![col]!);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const pt = pts[row]![col]!;
      if (pt.p > 0.25) {
        const radius = 1.6 + 2 * pt.p;
        parts.push(
          `<circle cx="${pt.x.toFixed(0)}" cy="${pt.y.toFixed(0)}" r="${(radius + 4 * pt.p).toFixed(0)}" fill="rgba(253,224,71,${(0.25 * pt.p).toFixed(2)})"/>`,
          `<circle cx="${pt.x.toFixed(0)}" cy="${pt.y.toFixed(0)}" r="${radius.toFixed(0)}" fill="rgba(234,179,8,${(0.5 + 0.5 * pt.p).toFixed(2)})"/>`,
        );
      } else {
        parts.push(
          `<circle cx="${pt.x.toFixed(0)}" cy="${pt.y.toFixed(0)}" r="1.4" fill="rgba(26,28,30,0.12)"/>`,
        );
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">${parts.join("")}</svg>`;
}
