// Packed word-cloud SVG (classic collage style): spiral placement with
// bounding-box collision, deterministic rotation for some mid-size words.
// Pure build-time output; weights come from writingCloud.ts (real term
// frequencies from the articles).
import { cloud } from "./writingCloud";

const SIZES: Record<number, number> = { 5: 68, 4: 42, 3: 26, 2: 17, 1: 12 };
const WEIGHTS: Record<number, number> = { 5: 800, 4: 700, 3: 600, 2: 500, 1: 500 };
// lemon-family warm ramp: rind, amber, honey, ink
const PALETTE = ["#854d0e", "#ca8a04", "#1a1c1e", "#a16207", "#78350f"];

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return h >>> 0;
}

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function overlaps(a: Box, b: Box, pad: number): boolean {
  return a.x0 - pad < b.x1 && a.x1 + pad > b.x0 && a.y0 - pad < b.y1 && a.y1 + pad > b.y0;
}

export function buildCloudSvg(): string {
  const cx = 0;
  const cy = 0;
  const placed: Box[] = [];
  const texts: string[] = [];

  const words = [...cloud].sort((a, b) => b.w - a.w);

  for (const { t, w } of words) {
    const h = hash(t);
    const size = SIZES[w]!;
    const weight = WEIGHTS[w]!;
    const rotated = w <= 4 && w >= 2 && h % 100 < 28;
    const textW = t.length * size * 0.56;
    const textH = size * 1.02;
    const bw = rotated ? textH : textW;
    const bh = rotated ? textW : textH;

    const startAngle = ((h >> 8) % 628) / 100;
    let placedBox: Box | null = null;
    let px = 0;
    let py = 0;
    for (let step = 0; step < 2200; step++) {
      const tt = step * 0.3;
      const radius = 2.2 * tt;
      const angle = startAngle + tt;
      px = cx + radius * Math.cos(angle);
      py = cy + radius * Math.sin(angle) * 0.55;
      const box: Box = { x0: px - bw / 2, y0: py - bh / 2, x1: px + bw / 2, y1: py + bh / 2 };
      if (!placed.some((p) => overlaps(box, p, 5))) {
        placedBox = box;
        break;
      }
    }
    if (!placedBox) continue;
    placed.push(placedBox);

    const fill = PALETTE[h % PALETTE.length]!;
    const transform = rotated ? ` transform="rotate(-90 ${px.toFixed(0)} ${py.toFixed(0)})"` : "";
    texts.push(
      `<text x="${px.toFixed(0)}" y="${py.toFixed(0)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="middle" dominant-baseline="central"${transform}>${t}</text>`,
    );
  }

  const minX = Math.min(...placed.map((b) => b.x0)) - 10;
  const minY = Math.min(...placed.map((b) => b.y0)) - 10;
  const maxX = Math.max(...placed.map((b) => b.x1)) + 10;
  const maxY = Math.max(...placed.map((b) => b.y1)) + 10;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}" role="img" aria-label="Word cloud of AI terminology from these articles" style="font-family: 'Archivo Variable', Archivo, system-ui, sans-serif">${texts.join("")}</svg>`;
}
