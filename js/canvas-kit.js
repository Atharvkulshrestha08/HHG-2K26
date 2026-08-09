const Kit = (function () {
  var P = {
    forest: '#0B5D3A',
    forest2: '#0E6B42',
    forestDark: '#08331F',
    gold: '#F5D520',
    gold2: '#FFD500',
    pink: '#EC1478',
    magenta: '#F0158A',
    baby: '#FFAFC9',
    sage: '#8FA85E',
    white: '#FFFFFF',
    black: '#000000',
    paper: '#FFFDF4',
    cream: '#FFF8E7',
    ink: '#0B5D3A',
    inkSoft: 'rgba(11,93,58,0.62)',
    line: 'rgba(11,93,58,0.18)',
    lineGold: 'rgba(245,213,32,0.45)'
  };

  var F = {
    sans: '"Space Grotesk",sans-serif',
    inter: '"Inter",sans-serif',
    serif: '"Cormorant Garamond",serif',
    mono: '"JetBrains Mono",ui-monospace,"Cascadia Mono",SFMono-Regular,Menlo,Consolas,monospace'
  };

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function dotBorder(ctx, x, y, w, h, r, color, dot, gap) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = dot;
    ctx.lineCap = 'round';
    ctx.setLineDash([0.01, gap]);
    rr(ctx, x, y, w, h, r);
    ctx.stroke();
    ctx.restore();
  }

  function mandala(ctx, cx, cy, r, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    var n = 16, i, a, x, y;
    for (i = 0; i < n; i++) {
      a = (i / n) * Math.PI * 2;
      x = cx + Math.cos(a) * r * 0.78;
      y = cy + Math.sin(a) * r * 0.78;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.11, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function flower(ctx, cx, cy, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    var petals = 6, i, a;
    for (i = 0; i < petals; i++) {
      a = (i / petals) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = P.gold2;
    ctx.fill();
    ctx.restore();
  }

  function crest(ctx, cx, cy, r, top, bottom, ring1, ring2, disc) {
    ctx.save();
    ring1 = ring1 || P.gold;
    ring2 = ring2 || P.baby;
    disc = disc || P.forest;
    ctx.strokeStyle = P.black;
    ctx.lineWidth = Math.max(2, r * 0.05);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = ring1;
    ctx.lineWidth = Math.max(2.5, r * 0.045);
    ctx.beginPath();
    ctx.arc(cx, cy, r - r * 0.05, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = ring2;
    ctx.lineWidth = Math.max(1.5, r * 0.03);
    ctx.setLineDash([0.01, r * 0.11]);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, r - r * 0.16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = ring1;
    ctx.lineWidth = Math.max(2, r * 0.035);
    ctx.beginPath();
    ctx.arc(cx, cy, r - r * 0.24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
    ctx.fillStyle = disc;
    ctx.fill();
    ctx.strokeStyle = ring1;
    ctx.lineWidth = Math.max(1.5, r * 0.025);
    ctx.stroke();
    var inner = r * 0.34;
    var ring = r - r * 0.2;
    arcText(ctx, top, cx, cy, ring, Math.PI * 1.16, Math.PI * 1.84, '600 ' + Math.round(r * 0.16) + 'px ' + F.sans, ring1);
    arcText(ctx, bottom.split('').reverse().join(''), cx, cy, ring, Math.PI * 0.4, Math.PI * 0.6, '600 ' + Math.round(r * 0.12) + 'px ' + F.sans, ring1);
    ctx.restore();
    return inner;
  }

  function cover(ctx, img, x, y, w, h) {
    var s = Math.max(w / img.width, h / img.height);
    var dw = img.width * s;
    var dh = img.height * s;
    var dx = x + (w - dw) / 2;
    var dy = y + (h - dh) / 2 - Math.max(0, dh - h) * 0.14;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function seed(str) {
    var h = 2166136261, i;
    str = String(str || '');
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry(s) {
    return function () {
      s |= 0;
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function arcText(ctx, text, cx, cy, radius, a0, a1, font, fill) {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = fill;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var chars = text.split('');
    var step = (a1 - a0) / Math.max(1, chars.length - 1);
    var i, a, x, y;
    for (i = 0; i < chars.length; i++) {
      a = a0 + step * i;
      x = cx + Math.cos(a) * radius;
      y = cy + Math.sin(a) * radius;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a + Math.PI / 2);
      ctx.fillText(chars[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  function arcTop(ctx, text, cx, cy, r, font, fill) {
    arcText(ctx, text, cx, cy, r, Math.PI * 1.18, Math.PI * 1.82, font, fill);
  }

  function arcBottom(ctx, text, cx, cy, r, font, fill) {
    var s = text.split('').reverse().join('');
    arcText(ctx, s, cx, cy, r, Math.PI * 0.42, Math.PI * 0.58, font, fill);
  }

  function wrap(ctx, text, x, y, maxW, lh, font, fill, align) {
    ctx.font = font;
    ctx.fillStyle = fill;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'top';
    var words = String(text).split(' ');
    var line = '', yy = y, i, t;
    for (i = 0; i < words.length; i++) {
      t = line ? line + ' ' + words[i] : words[i];
      if (line && ctx.measureText(t).width > maxW) {
        ctx.fillText(line, x, yy);
        yy += lh;
        line = words[i];
      } else {
        line = t;
      }
    }
    ctx.fillText(line, x, yy);
    return yy + lh;
  }

  function fitText(ctx, text, maxW, font) {
    ctx.font = font;
    var t = String(text);
    while (t.length > 1 && ctx.measureText(t).width > maxW) {
      t = t.slice(0, -1);
    }
    return t;
  }

  function stamp(ctx, cx, cy, r, top, mid, color) {
    var col = color || P.ink;
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = Math.max(2, r * 0.035);
    ctx.globalAlpha = 0.82;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.74, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    arcTop(ctx, top, cx, cy, r * 0.87, '600 ' + Math.round(r * 0.27) + 'px ' + F.sans, col);
    arcBottom(ctx, top, cx, cy, r * 0.88, '600 ' + Math.round(r * 0.21) + 'px ' + F.sans, col);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 16);
    ctx.font = '700 ' + Math.round(r * 0.24) + 'px ' + F.sans;
    ctx.fillStyle = col;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mid, 0, 0);
    ctx.restore();
    ctx.restore();
  }

  function fakeQR(ctx, x, y, s, seedStr, fg) {
    var n = 9, cell = s / n, rnd = mulberry(seed(seedStr)), i, j;
    ctx.save();
    ctx.fillStyle = fg || P.ink;
    function finder(fx, fy) {
      ctx.fillRect(fx, fy, cell * 3, cell * 3);
      ctx.fillStyle = P.paper;
      ctx.fillRect(fx + cell, fy + cell, cell, cell);
      ctx.fillStyle = fg || P.ink;
      ctx.fillRect(fx + cell * 1.15, fy + cell * 1.15, cell * 0.7, cell * 0.7);
    }
    finder(x, y);
    finder(x + s - cell * 3, y);
    finder(x, y + s - cell * 3);
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        var inF = (i < 3 && j < 3) || (i < 3 && j >= n - 3) || (i >= n - 3 && j < 3);
        if (inF) continue;
        if (rnd() < 0.42) ctx.fillRect(x + j * cell, y + i * cell, cell * 0.86, cell * 0.86);
      }
    }
    ctx.restore();
  }

  function barcode(ctx, x, y, w, h, seedStr) {
    ctx.save();
    ctx.fillStyle = P.ink;
    var rnd = mulberry(seed(seedStr));
    var px = x;
    while (px < x + w) {
      var bw = 2 + rnd() * 8;
      if (rnd() < 0.72) ctx.fillRect(px, y, bw, h);
      px += bw + rnd() * 3;
    }
    ctx.restore();
  }

  function palm(ctx, x, y, h, color) {
    ctx.save();
    var OUT = P.black;
    var col = color || P.gold;
    ctx.lineCap = 'round';
    function strokeQuad(a, b, c, outW, inW) {
      ctx.strokeStyle = OUT;
      ctx.lineWidth = outW;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo(b[0], b[1], c[0], c[1]);
      ctx.stroke();
      ctx.strokeStyle = col;
      ctx.lineWidth = inW;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo(b[0], b[1], c[0], c[1]);
      ctx.stroke();
    }
    var tx = x, ty = y - h * 0.98;
    strokeQuad([x, y], [x + h * 0.16, y - h * 0.5], [tx, ty], h * 0.058, h * 0.038);
    ctx.strokeStyle = P.white;
    ctx.lineWidth = h * 0.012;
    ctx.beginPath();
    ctx.moveTo(x - h * 0.01, y - h * 0.04);
    ctx.quadraticCurveTo(x + h * 0.14, y - h * 0.5, tx - h * 0.02, ty + h * 0.04);
    ctx.stroke();
    var fr = [[-1.1, 0.5], [-0.68, 0.74], [-0.24, 0.88], [0.24, 0.88], [0.68, 0.74], [1.1, 0.5]];
    var i;
    for (i = 0; i < fr.length; i++) {
      strokeQuad(
        [tx, ty],
        [tx + fr[i][0] * h * 0.34, ty - h * 0.16 * fr[i][1]],
        [tx + fr[i][0] * h * 0.58, ty + h * 0.22 * fr[i][1]],
        h * 0.042, h * 0.026
      );
    }
    ctx.fillStyle = OUT;
    ctx.beginPath();
    ctx.arc(tx - h * 0.04, ty + h * 0.01, h * 0.052, 0, Math.PI * 2);
    ctx.arc(tx + h * 0.04, ty + h * 0.01, h * 0.052, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(tx - h * 0.04, ty + h * 0.01, h * 0.032, 0, Math.PI * 2);
    ctx.arc(tx + h * 0.04, ty + h * 0.01, h * 0.032, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function waves(ctx, x, y, w, h, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = h * 0.09;
    ctx.lineCap = 'round';
    var i, px;
    for (i = 0; i < 3; i++) {
      ctx.beginPath();
      var yy = y + i * h * 0.34;
      for (px = x; px <= x + w; px += Math.max(4, w / 14)) {
        var a = ((px - x) / w) * Math.PI * 2 + i * Math.PI * 0.6;
        var py = yy + Math.sin(a) * h * 0.14;
        if (px === x) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function sun(ctx, cx, cy, r, color) {
    ctx.save();
    var c = color || P.gold;
    ctx.fillStyle = c;
    ctx.strokeStyle = P.black;
    ctx.lineWidth = Math.max(2, r * 0.08);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = c;
    ctx.lineWidth = Math.max(2, r * 0.09);
    ctx.lineCap = 'round';
    var rays = Math.max(8, Math.round(r / 3) * 2);
    for (var i = 0; i < rays; i++) {
      var a = (i / rays) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.lineTo(cx + Math.cos(a) * r * 1.28, cy + Math.sin(a) * r * 1.28);
      ctx.stroke();
    }
    ctx.strokeStyle = c === P.gold ? 'rgba(11,93,58,0.6)' : 'rgba(245,213,32,0.5)';
    ctx.lineWidth = Math.max(1.5, r * 0.05);
    ctx.setLineDash([0.01, r * 0.38]);
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function squiggle(ctx, x, y, w, seedStr, color) {
    ctx.save();
    ctx.strokeStyle = color || P.ink;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.7;
    var rnd = mulberry(seed(seedStr));
    var x0 = x;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    while (x0 < x + w) {
      var nx = x0 + 10 + rnd() * 22;
      var amp = (rnd() - 0.5) * 9;
      ctx.quadraticCurveTo(x0 + (nx - x0) / 2, y + amp, nx, y);
      x0 = nx;
    }
    ctx.stroke();
    ctx.restore();
  }

  function coconutSil(ctx, x, baseY, h, color) {
    ctx.save();
    var col = color || '#052015';
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(3, h * 0.03);
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x + h * 0.2, baseY - h * 0.55, x + h * 0.06, baseY - h);
    ctx.stroke();
    var topX = x + h * 0.06, topY = baseY - h;
    var fr = [[-0.9, -0.55], [-0.45, -0.95], [0, -1.1], [0.45, -0.95], [0.9, -0.55]];
    var i;
    for (i = 0; i < fr.length; i++) {
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(
        topX + fr[i][0] * h * 0.3, topY + fr[i][1] * h * 0.28,
        topX + fr[i][0] * h * 0.62, topY + fr[i][1] * h * 0.12);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(topX - h * 0.03, topY + h * 0.015, h * 0.03, 0, Math.PI * 2);
    ctx.arc(topX + h * 0.035, topY + h * 0.02, h * 0.025, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function churchSil(ctx, x, baseY, h, color) {
    ctx.save();
    var col = color || '#052015';
    ctx.fillStyle = col;
    var w = h * 0.5;
    ctx.fillRect(x, baseY - h, w, h);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.06, baseY - h);
    ctx.lineTo(x + w * 0.25, baseY - h - w * 0.42);
    ctx.lineTo(x + w * 0.56, baseY - h);
    ctx.closePath();
    ctx.fill();
    var tw = w * 0.3;
    ctx.fillRect(x + w, baseY - h * 1.5, tw, h * 1.5);
    ctx.fillRect(x + w - tw * 0.12, baseY - h * 1.5 - tw * 0.4, tw * 1.24, tw * 0.4);
    ctx.beginPath();
    ctx.arc(x + w + tw / 2, baseY - h * 1.5 - tw * 0.4, tw * 0.5, Math.PI, 0);
    ctx.fill();
    var cxp = x + w + tw / 2, cyt = baseY - h * 1.5 - tw * 0.4 - tw * 0.5 - h * 0.05;
    ctx.fillRect(cxp - h * 0.008, cyt, h * 0.016, h * 0.09);
    ctx.fillRect(cxp - h * 0.05, cyt + h * 0.022, h * 0.1, h * 0.018);
    ctx.restore();
  }

  function goaGradient(ctx, W, H) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#041B14');
    g.addColorStop(0.22, '#0A3A24');
    g.addColorStop(0.42, '#0E5D38');
    g.addColorStop(0.56, '#6E1D4A');
    g.addColorStop(0.68, '#C0287A');
    g.addColorStop(0.78, '#F0563C');
    g.addColorStop(0.85, '#F5D520');
    g.addColorStop(0.87, '#0B5D3A');
    g.addColorStop(1, '#08331F');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function goaSunset(ctx, W, H) {
    ctx.save();
    goaGradient(ctx, W, H);

    var sx = W * 0.5, sy = H * 0.83, sr = H * 0.085;
    var i;
    for (i = 4; i >= 0; i--) {
      ctx.globalAlpha = 0.07 + i * 0.02;
      ctx.fillStyle = '#FFF3C4';
      ctx.beginPath();
      ctx.arc(sx, sy, sr + i * H * 0.032, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFEFAD';
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = P.gold;
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 0.72, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(245,213,32,0.35)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.setLineDash([0.01, 13]);
    ctx.beginPath();
    ctx.moveTo(0, H * 0.745);
    ctx.lineTo(W, H * 0.745);
    ctx.moveTo(0, H * 0.805);
    ctx.lineTo(W, H * 0.805);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#052015';
    ctx.lineWidth = Math.max(2.5, H * 0.004);
    ctx.beginPath();
    ctx.moveTo(W * 0.3, H * 0.23);
    ctx.quadraticCurveTo(W * 0.305, H * 0.225, W * 0.31, H * 0.232);
    ctx.quadraticCurveTo(W * 0.315, H * 0.225, W * 0.32, H * 0.23);
    ctx.moveTo(W * 0.36, H * 0.27);
    ctx.quadraticCurveTo(W * 0.365, H * 0.265, W * 0.37, H * 0.272);
    ctx.quadraticCurveTo(W * 0.375, H * 0.265, W * 0.38, H * 0.27);
    ctx.stroke();

    var gy = H * 0.87;
    ctx.fillStyle = '#052015';
    ctx.fillRect(0, gy, W, H - gy);
    ctx.beginPath();
    ctx.moveTo(0, gy);
    for (i = 0; i <= 8; i++) {
      ctx.quadraticCurveTo(W * (i + 0.5) / 9, gy + (i % 2 ? -6 : 6), W * (i + 1) / 9, gy);
    }
    ctx.fill();

    var SIL = '#052015';
    coconutSil(ctx, W * 0.06, gy, H * 0.22, SIL);
    coconutSil(ctx, W * 0.94, gy, H * 0.26, SIL);
    churchSil(ctx, W * 0.2, gy, H * 0.16, SIL);
    churchSil(ctx, W * 0.5, gy, H * 0.2, SIL);
    churchSil(ctx, W * 0.78, gy, H * 0.14, SIL);
    ctx.restore();
  }

  function silhouette(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = P.forest;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = P.black;
    ctx.lineWidth = Math.max(2, w * 0.012);
    var cw = w * 0.32, ch = h * 0.3, cx = x + w / 2, cy = y + h * 0.4;
    ctx.fillStyle = P.gold;
    ctx.beginPath();
    ctx.arc(cx, cy, cw, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = P.forestDark;
    ctx.beginPath();
    ctx.ellipse(cx, y + h * 0.98, w * 0.68, h * 0.3, 0, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = P.gold;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, cw, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = '600 ' + Math.round(w * 0.085) + 'px ' + F.mono;
    ctx.fillStyle = P.gold;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YOUR PHOTO', cx, cy + ch + h * 0.05);
    ctx.restore();
  }

  return {
    P: P,
    F: F,
    rr: rr,
    dotBorder: dotBorder,
    mandala: mandala,
    flower: flower,
    crest: crest,
    cover: cover,
    seed: seed,
    mulberry: mulberry,
    arcText: arcText,
    arcTop: arcTop,
    arcBottom: arcBottom,
    wrap: wrap,
    fitText: fitText,
    stamp: stamp,
    fakeQR: fakeQR,
    barcode: barcode,
    palm: palm,
    waves: waves,
    sun: sun,
    squiggle: squiggle,
    coconutSil: coconutSil,
    churchSil: churchSil,
    goaGradient: goaGradient,
    goaSunset: goaSunset,
    silhouette: silhouette
  };
})();

export { Kit };
