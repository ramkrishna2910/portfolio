// Generates public/images/writing-cloud.svg: a packed word cloud of AI
// terminology, weights from src/lib/writingCloud.ts (real term frequencies
// extracted from the blog articles). Words are rendered as vector paths in
// Archivo Black using exact glyph metrics (opentype.js), packed on an
// archimedean spiral with pixel-accurate collision boxes.
//
// Run manually after changing writingCloud.ts:  node scripts/generate-wordcloud.mjs
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import opentype from "opentype.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontBuf = readFileSync(join(root, "scripts/fonts/ArchivoBlack-Regular.ttf"));
const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));

// parse the cloud data out of the TS module (single source of truth)
const ts = readFileSync(join(root, "src/lib/writingCloud.ts"), "utf8");
const words = [...ts.matchAll(/\{ t: "([^"]+)", w: (\d) \}/g)].map((m) => ({
  t: m[1],
  w: Number(m[2]),
}));
if (words.length < 10) throw new Error("failed to parse writingCloud.ts");

const SIZES = { 5: 66, 4: 40, 3: 25, 2: 16, 1: 11.5 };
const PALETTE = ["#854d0e", "#ca8a04", "#1a1c1e", "#a16207", "#78350f"];

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return h >>> 0;
}

const upm = font.unitsPerEm;
const asc = font.tables.os2.sCapHeight / upm; // cap height for tight boxes
const desc = Math.abs(font.descender) / upm;

function metrics(text, size) {
  const width = font.getAdvanceWidth(text, size);
  const height = size * (asc + desc * 0.35); // caps + a little descender room
  return { width, height };
}

// opentype's toPathData can emit invalid data (missing separators around 0),
// so serialize commands ourselves with explicit spaces.
function pathData(p) {
  const r = (n) => Math.round(n * 10) / 10;
  return p.commands
    .map((c) => {
      switch (c.type) {
        case "M":
          return `M${r(c.x)} ${r(c.y)}`;
        case "L":
          return `L${r(c.x)} ${r(c.y)}`;
        case "Q":
          return `Q${r(c.x1)} ${r(c.y1)} ${r(c.x)} ${r(c.y)}`;
        case "C":
          return `C${r(c.x1)} ${r(c.y1)} ${r(c.x2)} ${r(c.y2)} ${r(c.x)} ${r(c.y)}`;
        case "Z":
          return "Z";
        default:
          return "";
      }
    })
    .join("");
}

const placed = [];
function collides(box, pad) {
  return placed.some(
    (p) => box.x0 - pad < p.x1 && box.x1 + pad > p.x0 && box.y0 - pad < p.y1 && box.y1 + pad > p.y0,
  );
}

const glyphs = [];
const sorted = [...words].sort((a, b) => b.w - a.w);
for (const { t, w } of sorted) {
  const h = hash(t);
  const size = SIZES[w];
  const rotated = w >= 2 && w <= 4 && h % 100 < 30;
  const { width, height } = metrics(t, size);
  const bw = rotated ? height : width;
  const bh = rotated ? width : height;

  const start = ((h >> 6) % 628) / 100;
  let box = null;
  let px = 0;
  let py = 0;
  for (let step = 0; step < 6000; step++) {
    const tt = step * 0.08;
    const r = 1.4 * tt;
    px = r * Math.cos(start + tt);
    py = r * Math.sin(start + tt) * 0.52;
    const c = { x0: px - bw / 2, y0: py - bh / 2, x1: px + bw / 2, y1: py + bh / 2 };
    if (!collides(c, 4)) {
      box = c;
      break;
    }
  }
  if (!box) continue;
  placed.push(box);

  const fill = PALETTE[h % PALETTE.length];
  let path;
  if (rotated) {
    // draw horizontally at origin, then rotate -90 around the word center
    const p = font.getPath(t, -width / 2, (size * asc) / 2, size);
    path = `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(-90)"><path d="${pathData(p)}" fill="${fill}"/></g>`;
  } else {
    const p = font.getPath(t, px - width / 2, py + (size * asc) / 2, size);
    path = `<path d="${pathData(p)}" fill="${fill}"/>`;
  }
  glyphs.push(path);
}

const minX = Math.min(...placed.map((b) => b.x0)) - 14;
const minY = Math.min(...placed.map((b) => b.y0)) - 14;
const maxX = Math.max(...placed.map((b) => b.x1)) + 14;
const maxY = Math.max(...placed.map((b) => b.y1)) + 14;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}">${glyphs.join("")}</svg>`;
writeFileSync(join(root, "public/images/writing-cloud.svg"), svg);
console.log(
  `wrote public/images/writing-cloud.svg: ${glyphs.length}/${words.length} words, ${(svg.length / 1024).toFixed(0)}KB, viewBox ${(maxX - minX).toFixed(0)}x${(maxY - minY).toFixed(0)}`,
);
