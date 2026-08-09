// Generates assets/og.png (1200x630) for link previews.
// Pure Node + zlib — no dependencies. Draws a branded HH Goa 2026 card.
import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'og.png');
const W = 1200, H = 630;

const buf = Buffer.alloc(W * H * 4);

function blend(x, y, r, g, b, a) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= W || y >= H || a <= 0) return;
  const i = (y * W + x) * 4;
  const oa = buf[i + 3] / 255;
  const na = a + oa * (1 - a);
  if (na <= 0) return;
  buf[i] = Math.round((r * a + buf[i] * oa * (1 - a)) / na);
  buf[i + 1] = Math.round((g * a + buf[i + 1] * oa * (1 - a)) / na);
  buf[i + 2] = Math.round((b * a + buf[i + 2] * oa * (1 - a)) / na);
  buf[i + 3] = Math.round(na * 255);
}

function fillRect(x, y, w, h, r, g, b, a) {
  x = Math.round(x); y = Math.round(y);
  for (let j = 0; j < Math.round(h); j++) {
    for (let i = 0; i < Math.round(w); i++) blend(x + i, y + j, r, g, b, a);
  }
}

function fillCircle(cx, cy, rad, r, g, b, a) {
  for (let j = -rad; j <= rad; j++) {
    for (let i = -rad; i <= rad; i++) {
      if (i * i + j * j <= rad * rad) blend(cx + i, cy + j, r, g, b, a);
    }
  }
}

function strokePath(pts, th, r, g, b, a) {
  const rad = th / 2;
  for (let k = 0; k < pts.length - 1; k++) {
    const p0 = pts[k], p1 = pts[k + 1];
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
    const len = Math.hypot(dx, dy) || 1;
    const steps = Math.ceil(len / 2);
    for (let s = 0; s <= steps; s++) {
      fillCircle(p0[0] + (dx * s) / steps, p0[1] + (dy * s) / steps, rad, r, g, b, a);
    }
  }
}

function quad(a, b, c, t) {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0],
          u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]];
}

function quadPath(a, b, c, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push(quad(a, b, c, i / n));
  return pts;
}

function lerp(a, b, t) { return a + (b - a) * t; }

// flat forest poster background
for (let y = 0; y < H; y++) {
  const t = y / H;
  fillRect(0, y, W, 1,
    Math.round(lerp(11, 14, t)),
    Math.round(lerp(93, 107, t)),
    Math.round(lerp(58, 66, t)), 1);
}

// black frame + gold frame + dotted border
function frameInset(x, y, w, h, sw) {
  for (let i = 0; i < sw; i++) {
    fillRect(x + i, y + i, w - 2 * i, 1, 0, 0, 0, 1);
    fillRect(x + i, y + h - 1 - i, w - 2 * i, 1, 0, 0, 0, 1);
    fillRect(x + i, y + i, 1, h - 2 * i, 0, 0, 0, 1);
    fillRect(x + w - 1 - i, y + i, 1, h - 2 * i, 0, 0, 0, 1);
  }
}
frameInset(10, 10, W - 20, H - 20, 6);
frameInset(20, 20, W - 40, H - 40, 3);
const gold = [245, 213, 32];
function dottedRect(x, y, w, h, gap, rad) {
  for (let px = x; px <= x + w; px += gap) { fillCircle(px, y, rad, ...gold, 1); fillCircle(px, y + h, rad, ...gold, 1); }
  for (let py = y; py <= y + h; py += gap) { fillCircle(x, py, rad, ...gold, 1); fillCircle(x + w, py, rad, ...gold, 1); }
}
dottedRect(30, 30, W - 60, H - 60, 26, 3.5);

// sun + mandala rings, bottom left
fillCircle(120, 470, 98, 245, 213, 32, 0.22);
for (let k = 0; k < 28; k++) {
  const a = (k / 28) * Math.PI * 2;
  fillCircle(120 + Math.cos(a) * 90, 470 + Math.sin(a) * 90, 3.5, 245, 213, 32, 1);
}
fillCircle(120, 470, 48, 0, 0, 0, 1);
fillCircle(120, 470, 42, 245, 213, 32, 1);

// palm, bottom right
strokePath(quadPath([1090, 610], [1095, 550], [1078, 505], 20), 10, 0, 0, 0, 1);
strokePath(quadPath([1090, 610], [1095, 550], [1078, 505], 20), 7, 245, 213, 32, 1);
strokePath(quadPath([1090, 610], [1095, 550], [1078, 505], 20), 2, 255, 255, 255, 0.8);
const crown = [1078, 505];
const fronds = [
  [[1008, 470], [1048, 478]],
  [[1056, 450], [1080, 472]],
  [[1098, 456], [1088, 474]],
  [[1126, 472], [1106, 484]],
  [[1120, 510], [1108, 496]],
  [[1008, 510], [1032, 494]]
];
for (const [end, ctrl] of fronds) {
  strokePath(quadPath(crown, ctrl, end, 16), 8, 0, 0, 0, 1);
  strokePath(quadPath(crown, ctrl, end, 16), 6, 245, 213, 32, 1);
}
fillCircle(crown[0] - 3, crown[1] - 1, 4, 0, 0, 0, 1);
fillCircle(crown[0] + 4, crown[1] + 2, 4, 0, 0, 0, 1);
fillCircle(crown[0] - 3, crown[1] - 1, 2.5, 245, 213, 32, 1);
fillCircle(crown[0] + 4, crown[1] + 2, 2.5, 245, 213, 32, 1);

// 5x7 pixel font
const FONT = {
  'A':[0x0E,0x11,0x11,0x1F,0x11,0x11,0x11], 'B':[0x1E,0x11,0x11,0x1E,0x11,0x11,0x1E],
  'C':[0x0F,0x10,0x10,0x10,0x10,0x10,0x0F], 'D':[0x1E,0x11,0x11,0x11,0x11,0x11,0x1E],
  'E':[0x1F,0x10,0x10,0x1E,0x10,0x10,0x1F], 'F':[0x1F,0x10,0x10,0x1E,0x10,0x10,0x10],
  'G':[0x0F,0x10,0x10,0x17,0x11,0x11,0x0F], 'H':[0x11,0x11,0x11,0x1F,0x11,0x11,0x11],
  'I':[0x1F,0x04,0x04,0x04,0x04,0x04,0x1F], 'J':[0x07,0x02,0x02,0x02,0x02,0x12,0x0C],
  'K':[0x11,0x12,0x14,0x18,0x14,0x12,0x11], 'L':[0x10,0x10,0x10,0x10,0x10,0x10,0x1F],
  'M':[0x11,0x1B,0x15,0x15,0x11,0x11,0x11], 'N':[0x11,0x19,0x15,0x13,0x11,0x11,0x11],
  'O':[0x0E,0x11,0x11,0x11,0x11,0x11,0x0E], 'P':[0x1E,0x11,0x11,0x1E,0x10,0x10,0x10],
  'Q':[0x0E,0x11,0x11,0x11,0x15,0x12,0x0D], 'R':[0x1E,0x11,0x11,0x1E,0x14,0x12,0x11],
  'S':[0x0F,0x10,0x10,0x0E,0x01,0x01,0x1E], 'T':[0x1F,0x04,0x04,0x04,0x04,0x04,0x04],
  'U':[0x11,0x11,0x11,0x11,0x11,0x11,0x0E], 'V':[0x11,0x11,0x11,0x11,0x11,0x0A,0x04],
  'W':[0x11,0x11,0x11,0x15,0x15,0x15,0x0A], 'X':[0x11,0x11,0x0A,0x04,0x0A,0x11,0x11],
  'Y':[0x11,0x11,0x0A,0x04,0x04,0x04,0x04], 'Z':[0x1F,0x01,0x02,0x04,0x08,0x10,0x1F],
  '0':[0x0E,0x11,0x13,0x15,0x19,0x11,0x0E], '1':[0x04,0x0C,0x04,0x04,0x04,0x04,0x0E],
  '2':[0x0E,0x11,0x01,0x02,0x04,0x08,0x1F], '3':[0x1F,0x02,0x04,0x02,0x01,0x11,0x0E],
  '4':[0x02,0x06,0x0A,0x12,0x1F,0x02,0x02], '5':[0x1F,0x10,0x1E,0x01,0x01,0x11,0x0E],
  '6':[0x06,0x08,0x10,0x1E,0x11,0x11,0x0E], '7':[0x1F,0x01,0x02,0x04,0x08,0x08,0x08],
  '8':[0x0E,0x11,0x11,0x0E,0x11,0x11,0x0E], '9':[0x0E,0x11,0x11,0x0F,0x01,0x02,0x0C],
  ' ': [0,0,0,0,0,0,0], '-':[0,0,0,0x1F,0,0,0],
  '.':[0,0,0,0,0,0x08,0x08], '&':[0x0E,0x11,0x12,0x04,0x09,0x11,0x0E],
  '\u00B7':[0,0,0,0x04,0,0,0]
};

function textWidth(str, scale) {
  let w = 0;
  for (const ch of str.toUpperCase()) w += ch === ' ' ? 3 * scale : 6 * scale;
  return w;
}

function drawText(str, cx, topY, scale, r, g, b, a) {
  const w = textWidth(str, scale);
  let x = cx - w / 2;
  for (const ch of str.toUpperCase()) {
    if (ch === ' ') { x += 3 * scale; continue; }
    const glyph = FONT[ch];
    if (!glyph) { x += 6 * scale; continue; }
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if ((glyph[row] >> (4 - col)) & 1) {
          fillRect(x + col * scale, topY + row * scale, scale, scale, r, g, b, a);
        }
      }
    }
    x += 6 * scale;
  }
}

function drawTextLeft(str, left, topY, scale, r, g, b, a) {
  let x = left;
  for (const ch of str.toUpperCase()) {
    if (ch === ' ') { x += 3 * scale; continue; }
    const glyph = FONT[ch];
    if (!glyph) { x += 6 * scale; continue; }
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if ((glyph[row] >> (4 - col)) & 1) {
          fillRect(x + col * scale, topY + row * scale, scale, scale, r, g, b, a);
        }
      }
    }
    x += 6 * scale;
  }
}

function roundRect(x, y, w, h, r, col) {
  fillRect(x + r, y, w - 2 * r, h, ...col, 1);
  fillRect(x, y + r, w, h - 2 * r, ...col, 1);
  fillCircle(x + r, y + r, r, ...col, 1);
  fillCircle(x + w - r, y + r, r, ...col, 1);
  fillCircle(x + r, y + h - r, r, ...col, 1);
  fillCircle(x + w - r, y + h - r, r, ...col, 1);
}
function flower(cx, cy, pr, pc, cc) {
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    fillCircle(cx + Math.cos(a) * pr, cy + Math.sin(a) * pr, pr * 0.7, ...pc, 1);
  }
  fillCircle(cx, cy, pr * 0.6, ...cc, 1);
}

const GOLD = [245, 213, 32], WHITE = [255, 255, 255], PINK = [236, 20, 120], SAGE = [143, 168, 94];

roundRect(950, 34, 200, 54, 14, [0, 0, 0]);
roundRect(954, 38, 192, 46, 11, PINK);
drawText('GOA 2026', 1050, 47, 4, ...WHITE, 1);
flower(934, 61, 7, PINK, GOLD);
flower(1166, 61, 7, PINK, GOLD);

drawTextLeft('OPEN TRIAL · TASK 1', 34, 44, 4, ...SAGE, 1);
drawTextLeft('28-31 OCT 2026', W - 34 - textWidth('28-31 OCT 2026', 4), 44, 4, ...SAGE, 1);

drawText('HACKER HOUSE', W / 2, 116, 16, ...GOLD, 1);
drawText('FRAME & ID CARD GENERATOR', W / 2, 248, 7, ...WHITE, 1);
flower(64, 272, 8, PINK, GOLD);
flower(1136, 272, 8, PINK, GOLD);

// divider: row of dots
const dots = 19;
for (let i = 0; i < dots; i++) {
  const d = 8;
  fillRect(W / 2 + (i - (dots - 1) / 2) * 34 - d / 2, 340 - d / 2, d, d, ...GOLD, 1);
}

drawText('247 BUILDERS · 28-31 OCT 2026 · GOA, INDIA', W / 2, 396, 4, ...WHITE, 1);
drawText('SHIP THINGS THAT MATTER', W / 2, 462, 6, ...GOLD, 1);
drawTextLeft('hhgoa.com', 34, 566, 4, ...WHITE, 1);
drawTextLeft('2:47PM.STUDIO', W - 34 - textWidth('2:47PM.STUDIO', 4), 566, 4, ...GOLD, 1);

// ---- PNG encode ----
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c >>> 0;
}
function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (const b of bytes) c = crcTable[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const raw = Buffer.alloc(H * (1 + W * 4));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 4)] = 0;
  buf.copy(raw, y * (1 + W * 4) + 1, y * W * 4, (y + 1) * W * 4);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, png);

let opaque = 0;
for (let i = 0; i < buf.length; i += 4) if (buf[i + 3] > 10) opaque++;
console.log('Wrote ' + OUT);
console.log('Size ' + (png.length / 1024).toFixed(1) + ' KB · ' + W + 'x' + H + ' · coverage ' + (100 * opaque / (W * H)).toFixed(1) + '%');
