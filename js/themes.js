import { Kit } from './canvas-kit.js';

const Themes = (function () {
  var K = Kit;
  var G = K.P.forest, G2 = K.P.forest2, GD = K.P.forestDark;
  var Y = K.P.white, Y2 = K.P.white;
  var R = K.P.pink, RP = K.P.baby, W = K.P.white, B = K.P.black, S = K.P.sage;

  // Cards use the sunset gradient only; the full scene (sun, palms, churches)
  // lives on the landing page hero instead.
  function backdrop(ctx, W, H, muteOpacity) {
    K.goaBeachScene(ctx, W, H);
    if (muteOpacity) {
      ctx.save();
      ctx.fillStyle = 'rgba(11, 93, 58, ' + muteOpacity + ')';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  function photoImg(state, i) {
    return state.photos[i] || null;
  }

  function putPhoto(ctx, img, x, y, w, h) {
    if (img) K.cover(ctx, img, x, y, w, h);
    else K.silhouette(ctx, x, y, w, h);
  }

  function cap(ctx, text, x, y, size, fill, font) {
    ctx.save();
    ctx.font = '600 ' + size + 'px ' + (font || K.F.mono);
    ctx.fillStyle = fill || Y;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(String(text).toUpperCase().split('').join(' '), x, y);
    ctx.restore();
  }

  function val(ctx, text, x, y, size, fill, maxW, font) {
    ctx.save();
    ctx.font = '600 ' + size + 'px ' + (font || K.F.sans);
    var t = maxW ? K.fitText(ctx, text, maxW, ctx.font) : String(text);
    ctx.fillStyle = fill || W;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(t, x, y);
    ctx.restore();
  }

  function posterBorder(ctx, W, H, inset) {
    ctx.save();
    K.rr(ctx, inset, inset, W - inset * 2, H - inset * 2, 18);
    ctx.strokeStyle = B;
    ctx.lineWidth = 3;
    ctx.stroke();
    K.rr(ctx, inset + 7, inset + 7, W - (inset + 7) * 2, H - (inset + 7) * 2, 13);
    ctx.strokeStyle = Y;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    K.dotBorder(ctx, inset + 13, inset + 13, W - (inset + 13) * 2, H - (inset + 13) * 2, 10, Y, 3, 17);
    ctx.restore();
  }

  function dotLine(ctx, x0, x1, y, color) {
    ctx.save();
    ctx.strokeStyle = color || Y;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.setLineDash([0.01, 9]);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.restore();
  }

  function goaBadge(ctx, cx, cy, w, h, text, size, bg, fg) {
    ctx.save();
    K.rr(ctx, cx - w / 2, cy - h / 2, w, h, Math.min(h / 2, 14));
    ctx.fillStyle = bg || RP;
    ctx.fill();
    ctx.strokeStyle = B;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = fg || GD;
    ctx.font = '700 ' + size + 'px ' + K.F.serif;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, cy + 1);
    ctx.restore();
  }

  function photoPanel(ctx, x, y, w, h, img) {
    ctx.save();
    K.rr(ctx, x, y, w, h, 10);
    ctx.fillStyle = K.P.paper;
    ctx.fill();
    ctx.strokeStyle = B;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    K.rr(ctx, x + 5, y + 5, w - 10, h - 10, 7);
    ctx.strokeStyle = Y;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.save();
    K.rr(ctx, x + 8, y + 8, w - 16, h - 16, 6);
    ctx.clip();
    putPhoto(ctx, img, x + 8, y + 8, w - 16, h - 16);
    ctx.restore();
    ctx.restore();
  }

  function fieldRow(ctx, label, value, x, y, w, o) {
    o = o || {};
    var font = o.mono ? K.F.mono : K.F.sans;
    cap(ctx, label, x, y, 14, o.labelFill || Y, font);
    val(ctx, value, x, y + 24, o.valueSize || 28, o.valueFill || W, w, font);
    if (o.line !== false) dotLine(ctx, x, x + w, y + 60, 'rgba(255,255,255,0.55)');
  }

  function docNo(name) {
    var h = K.seed(name || 'hhgoa');
    return h.toString(36).toUpperCase().padStart(5, '0').slice(-5);
  }

  /* ---------------- BUILDER PASSPORT · forest + gold + pink ---------------- */

  var passport = {
    w: 800,
    h: 800,
    label: 'Builder Passport',
    draw: function (ctx, state) {
      var W = 800, H = 800;
      var img = photoImg(state, 0);

      backdrop(ctx, W, H, 0.85);
      
      // Draw outer rounded gold boundary line (sleek and thin like reference)
      ctx.save();
      ctx.strokeStyle = K.P.gold;
      ctx.lineWidth = 3;
      K.rr(ctx, 16, 16, W - 32, H - 32, 24);
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(245, 213, 32, 0.4)';
      ctx.lineWidth = 1;
      K.rr(ctx, 22, 22, W - 44, H - 44, 20);
      ctx.stroke();
      ctx.restore();

      // Margins
      var mx = 56;

      // Top Header Area
      // 1. Dotted accent top left
      ctx.save();
      ctx.fillStyle = K.P.gold;
      ctx.font = '700 12px ' + K.F.mono;
      ctx.fillText('...', mx, 45);
      ctx.restore();

      // 2. Main Title: "HACKER HOUSE" in gold serif
      ctx.save();
      ctx.font = '700 36px ' + K.F.serif;
      ctx.fillStyle = K.P.gold;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('HACKER HOUSE', mx, 55);
      ctx.restore();

      // 3. Devnagari Goa badge under HACKER HOUSE
      ctx.save();
      ctx.fillStyle = K.P.pink;
      ctx.font = '700 28px ' + K.F.serif;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('गोवा', mx, 96);
      ctx.restore();

      // 4. Subtitle line: "GOA, INDIA - OCT 28-31 - 2026"
      ctx.save();
      ctx.font = '600 12px ' + K.F.mono;
      ctx.fillStyle = K.P.sage;
      ctx.fillText('GOA, INDIA  -  OCT 28-31  -  2026', mx, 142);
      ctx.restore();

      // 5. Lotus logo on top right (aligned with mx)
      K.lotus(ctx, W - mx - 30, 80, 26, K.P.gold);

      // Yellow separator line
      ctx.save();
      ctx.strokeStyle = K.P.gold;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mx, 168);
      ctx.lineTo(W - mx, 168);
      ctx.stroke();
      ctx.restore();

      // Left Side: Photo Frame
      var px = mx, py = 196, pw = 240, ph = 240;
      ctx.save();
      K.rr(ctx, px, py, pw, ph, 16);
      ctx.fillStyle = '#063822';
      ctx.fill();
      ctx.strokeStyle = K.P.gold;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      // Draw actual photo inside
      ctx.save();
      K.rr(ctx, px + 3, py + 3, pw - 6, ph - 6, 13);
      ctx.clip();
      putPhoto(ctx, img, px + 3, py + 3, pw - 6, ph - 6);
      ctx.restore();

      // Code tag badge overlaps photo bottom right
      K.codeBadge(ctx, px + pw - 42, py + ph - 32, 42, 26, K.P.pink, K.P.white);
      
      // Right Side: Builder Details
      var fx = px + pw + 40;
      
      // Builder Class Sub-label
      ctx.save();
      ctx.textBaseline = 'top';
      ctx.font = '600 11px ' + K.F.mono;
      ctx.fillStyle = K.P.pink;
      ctx.fillText('BUILDING TEST · BUILDER', fx, py + 10);
      ctx.restore();

      // Name (Serif bold in yellow, moved down to prevent overlap)
      ctx.save();
      ctx.textBaseline = 'top';
      ctx.font = '700 32px ' + K.F.serif;
      ctx.fillStyle = K.P.gold;
      ctx.fillText((state.name || 'Your Name').toUpperCase(), fx, py + 28);
      ctx.restore();

      // Stack text/role
      ctx.save();
      ctx.textBaseline = 'top';
      ctx.font = '600 11px ' + K.F.mono;
      ctx.fillStyle = K.P.sage;
      ctx.fillText((state.stack || 'FULL-STACK DEVELOPER - GOA, INDIA').toUpperCase(), fx, py + 78);
      ctx.restore();

      // Call sign pill badge
      var pillW = 280, pillH = 34, pillX = fx, pillY = py + 104;
      ctx.save();
      K.rr(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fillStyle = K.P.pink;
      ctx.fill();
      ctx.fillStyle = K.P.white;
      ctx.font = '700 11px ' + K.F.mono;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var callSignText = 'CALL SIGN - ' + (state.classes[0] || 'Wave Rider');
      ctx.fillText(callSignText.toUpperCase(), pillX + pillW / 2, pillY + pillH / 2 + 1);
      ctx.restore();

      // Details footer list (e.g. STACK details)
      ctx.save();
      ctx.textBaseline = 'top';
      ctx.font = '600 11px ' + K.F.mono;
      ctx.fillStyle = K.P.sage;
      ctx.fillText('STACK', fx, py + 158);
      ctx.fillStyle = K.P.white;
      var lines = [
        'REACT · NODE.JS · TYPESCRIPT',
        'TAILWINDCSS · RUST'
      ];
      if (state.stack) {
        var parts = state.stack.toUpperCase().split(/[·,·|•]/);
        if (parts.length > 0) {
          lines[0] = parts.slice(0, 3).map(s => s.trim()).join(' · ');
          lines[1] = parts.slice(3).map(s => s.trim()).join(' · ') || 'HH GOA · BUILDER';
        }
      }
      ctx.fillText(lines[0], fx, py + 178);
      ctx.fillText(lines[1], fx, py + 196);
      ctx.restore();

      // Middle Divider: Dashed/Triangle Line
      K.triangleDivider(ctx, 0, W, 470, K.P.gold);

      // Lower Section Details
      var ly = 490;
      
      // Builder No details
      ctx.save();
      ctx.textBaseline = 'top';
      ctx.font = '600 11px ' + K.F.mono;
      ctx.fillStyle = K.P.pink;
      ctx.fillText('BUILDER NO.', mx, ly + 10);
      
      // Large builder fraction text
      ctx.font = '700 32px ' + K.F.mono;
      ctx.fillStyle = K.P.gold;
      var bNo = docNo(state.name);
      var bNoInt = (parseInt(bNo, 36) % 247) + 1;
      ctx.fillText(bNoInt + '  /  247', mx, ly + 30);
      ctx.restore();

      // Barcode
      K.barcode(ctx, mx, ly + 82, 180, 36, state.name || 'builder');
      
      ctx.save();
      ctx.textBaseline = 'top';
      ctx.font = '600 10px ' + K.F.mono;
      ctx.fillStyle = K.P.sage;
      ctx.fillText('HHG - ' + docNo(state.name) + ' - TEST', mx, ly + 130);
      ctx.restore();

       // Verified Seal
      K.verifiedSeal(ctx, W - mx - 70, ly + 70, 70, "GOA '26", "BUILDER PASS", K.P.pink, K.P.gold);

      // Draw HND -> GOA flight route text in the open center area
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 38px ' + K.F.serif;
      ctx.fillStyle = K.P.gold;
      ctx.fillText('H N D  →  G O A', 400, ly + 92);
      ctx.restore();

      // Footer
      ctx.save();
      ctx.textBaseline = 'top';
      ctx.font = '700 15px ' + K.F.mono;
      ctx.fillStyle = K.P.pink;
      ctx.fillText('#FrameInGoa', mx, H - 65);
      
      ctx.font = '600 10px ' + K.F.mono;
      ctx.fillStyle = K.P.sage;
      ctx.fillText('BUILD · SHIP · GOA', mx, H - 45);

      ctx.textAlign = 'right';
      ctx.font = '700 15px ' + K.F.sans;
      ctx.fillStyle = K.P.gold;
      ctx.fillText('BUILD IN PARADISE', W - mx, H - 65);
      
      ctx.font = '600 10px ' + K.F.mono;
      ctx.fillStyle = K.P.sage;
      ctx.fillText('HH GOA - 2026', W - mx, H - 45);
      ctx.restore();
    }
  };

  /* ---------------- BOARDING PASS · forest band + gold ---------------- */

  var boarding = {
    w: 1240,
    h: 800,
    label: 'Boarding Pass',
    draw: function (ctx, state) {
      var W = 1240, H = 800;
      var img = photoImg(state, 0);

      backdrop(ctx, W, H, 0.85);
      posterBorder(ctx, W, H, 14);

      var band = 330;
      ctx.fillStyle = G2;
      ctx.fillRect(0, 0, band, H);
      ctx.strokeStyle = B;
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, band, H);
      ctx.strokeStyle = Y;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(band + 6, 20);
      ctx.lineTo(band + 6, H - 20);
      ctx.stroke();
      K.dotBorder(ctx, 10, 10, band - 20, H - 20, 12, Y, 3, 16);

      var bcx = band / 2;
      ctx.save();
      ctx.font = '600 20px ' + K.F.mono;
      ctx.fillStyle = Y;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('BOARDING PASS'.split('').join(' '), bcx, 80);
      ctx.restore();
      ctx.textAlign = 'center';
      ctx.font = '700 44px ' + K.F.serif;
      ctx.fillStyle = Y;
      ctx.fillText('HHG \u2192 GOA', bcx, 130);
      dotLine(ctx, 90, band - 90, 208, 'rgba(255,255,255,0.6)');

      function bandRow(label, value, y) {
        ctx.fillStyle = Y;
        ctx.font = '600 13px ' + K.F.mono;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(String(label).toUpperCase(), bcx, y);
        ctx.fillStyle = W;
        ctx.font = '600 24px ' + K.F.mono;
        ctx.fillText(value, bcx, y + 24);
      }
      bandRow('Flight', 'HH-247', 240);
      bandRow('Date', '28 OCT \u00b7 2:47PM', 298);
      bandRow('Gate', 'PARADISE', 356);
      bandRow('Seat', 'B-247', 414);
      bandRow('Class', state.classes[0] || 'Wave Rider', 472);

      goaBadge(ctx, bcx, 566, 110, 44, '\u0917\u094B\u0935\u093E', 24);
      K.flower(ctx, bcx - 84, 566, 11, RP);
      K.flower(ctx, bcx + 84, 566, 11, RP);

      ctx.fillStyle = Y;
      ctx.font = '600 19px ' + K.F.mono;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('EDITION 2026', bcx, 690);

      var perf = 354;
      ctx.save();
      ctx.strokeStyle = Y;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.setLineDash([0.01, 11]);
      ctx.beginPath();
      ctx.moveTo(perf, 48);
      ctx.lineTo(perf, H - 48);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = K.P.paper;
      ctx.strokeStyle = B;
      ctx.lineWidth = 2;
      var rivets = [48, H / 2, H - 48];
      var rv;
      for (rv = 0; rv < rivets.length; rv++) {
        ctx.beginPath();
        ctx.arc(perf, rivets[rv], 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      var x0 = perf + 58;

      cap(ctx, 'PASSENGER', x0, 108, 16, Y);
      ctx.font = '700 40px ' + K.F.serif;
      ctx.fillStyle = W;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(state.name || 'Your Name', x0, 140);

      cap(ctx, 'BUILDER CLASS', x0, 190, 15, Y);
      ctx.font = '600 28px ' + K.F.mono;
      ctx.fillStyle = Y;
      ctx.fillText(state.classes[0] || 'Harbor Hacker', x0, 218);

      cap(ctx, 'STACK / ROLE', x0, 262, 15, Y);
      ctx.font = '500 24px ' + K.F.mono;
      ctx.fillStyle = W;
      ctx.fillText(K.fitText(ctx, state.stack || 'Full-stack \u00b7 Mobile', 520, '500 24px ' + K.F.mono), x0, 290);

      cap(ctx, 'HANDLE', x0, 332, 15, Y);
      ctx.font = '500 24px ' + K.F.mono;
      ctx.fillStyle = R;
      ctx.fillText(state.handle || '@yourhandle', x0, 360);

      dotLine(ctx, x0, W - 46, 424, Y);

      var phx = W - 276, phy = 122, pw = 232, ph = 296;
      photoPanel(ctx, phx, phy, pw, ph, img);
      ctx.fillStyle = GD;
      ctx.fillRect(phx + 8, phy + ph - 48, pw - 16, 40);
      ctx.fillStyle = Y;
      ctx.font = '600 17px ' + K.F.mono;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GOA 2026', phx + pw / 2, phy + ph - 28);

      ctx.save();
      ctx.translate(W - 360, 470);
      ctx.rotate(-0.16);
      K.stamp(ctx, 0, 0, 72, 'GOA 2026', 'LANDING', R);
      ctx.restore();

      ctx.fillStyle = K.P.paper;
      ctx.strokeStyle = B;
      ctx.lineWidth = 2;
      K.rr(ctx, x0, 558, 560, 76, 10);
      ctx.fill();
      ctx.stroke();
      K.rr(ctx, x0 + 5, 563, 550, 66, 8);
      ctx.strokeStyle = Y;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      K.barcode(ctx, x0 + 18, 572, 524, 48, state.name + state.stack);
      ctx.font = '500 16px ' + K.F.mono;
      ctx.fillStyle = Y;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('247 2026 10 28 GOA 247', x0, 650);

      ctx.save();
      ctx.globalAlpha = 0.55;
      K.palm(ctx, W - 108, H - 6, 104, Y);
      ctx.restore();

      ctx.font = '600 17px ' + K.F.mono;
      ctx.fillStyle = Y;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('SHIP THINGS THAT MATTER \u00b7 HH GOA 2026 \u00b7 #FrameInGoa', x0, H - 36);
      ctx.font = '500 16px ' + K.F.mono;
      ctx.fillStyle = W;
      ctx.textAlign = 'right';
      ctx.fillText('\u0917\u094B\u0935\u093E 2026', W - 46, H - 36);
    }
  };

  /* ---------------- SQUAD PASS · one card, one crew ---------------- */

  var squad = {
    w: 1240,
    h: 800,
    label: 'Squad Pass',
    draw: function (ctx, state) {
      var W = 1240, H = 800;

      backdrop(ctx, W, H, 0.82);
      posterBorder(ctx, W, H, 14);

      ctx.font = '700 60px ' + K.F.serif;
      ctx.fillStyle = Y;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('SQUAD 247', 46, 44);
      ctx.font = '600 21px ' + K.F.mono;
      ctx.fillStyle = W;
      ctx.fillText(state.team || 'HACKER HOUSE GOA 2026', 48, 126);

      goaBadge(ctx, W - 220, 84, 140, 52, '\u0917\u094B\u0935\u093E', 30);
      K.flower(ctx, W - 306, 84, 13, RP);
      K.flower(ctx, W - 134, 84, 13, RP);

      dotLine(ctx, 46, W - 46, 164, Y);

      var i;
      for (i = 0; i < 3; i++) {
        var cx = 48 + i * 396;
        var cy = 192, cw = 352, ch = 452;
        ctx.save();
        K.rr(ctx, cx, cy, cw, ch, 14);
        ctx.fillStyle = K.P.paper;
        ctx.fill();
        ctx.strokeStyle = B;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        K.rr(ctx, cx + 6, cy + 6, cw - 12, ch - 12, 10);
        ctx.strokeStyle = Y;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = GD;
        ctx.fillRect(cx + 1, cy + 1, cw - 2, 44);
        ctx.fillStyle = Y;
        ctx.font = '600 17px ' + K.F.mono;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('HH \u00b7 2026', cx + 18, cy + 23);
        ctx.textAlign = 'right';
        ctx.fillText('0' + (i + 1) + ' / 03', cx + cw - 18, cy + 23);

        var pw2 = cw - 32;
        ctx.save();
        K.rr(ctx, cx + 16, cy + 62, pw2, 292, 10);
        ctx.strokeStyle = B;
        ctx.lineWidth = 2;
        ctx.stroke();
        K.rr(ctx, cx + 19, cy + 65, pw2 - 6, 286, 8);
        ctx.clip();
        putPhoto(ctx, photoImg(state, i), cx + 19, cy + 65, pw2 - 6, 286);
        ctx.restore();

        var nm = i === 0 ? state.name : (state.memberNames && state.memberNames[i]) || '';
        ctx.font = '700 28px ' + K.F.serif;
        ctx.fillStyle = G;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(K.fitText(ctx, nm || ('Builder ' + (i + 1)), cw - 40, '700 28px ' + K.F.serif), cx + cw / 2, cy + 368);

        var pillW = 258, pillH = 38, pillX = cx + (cw - pillW) / 2, pillY = cy + 412;
        ctx.save();
        K.rr(ctx, pillX, pillY, pillW, pillH, pillH / 2);
        ctx.strokeStyle = Y;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = G;
        ctx.font = '600 19px ' + K.F.mono;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(state.classes[i] || 'Harbor Hacker', cx + cw / 2, pillY + pillH / 2 + 1);
        ctx.restore();
      }

      ctx.fillStyle = G2;
      ctx.fillRect(14, 676, W - 28, H - 14 - 676);
      ctx.strokeStyle = B;
      ctx.lineWidth = 2;
      ctx.strokeRect(14, 676, W - 28, H - 14 - 676);
      K.dotBorder(ctx, 22, 684, W - 44, H - 14 - 676 - 16, 10, Y, 3, 15);

      K.sun(ctx, 96, 732, 24, Y);
      K.palm(ctx, W - 96, 742, 60, Y);

      ctx.fillStyle = W;
      ctx.font = '700 25px ' + K.F.mono;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('\u0917\u094B\u0935\u093E \u00b7 247 BUILDERS \u00b7 28\u201331 OCT 2026 \u00b7 hhgoa.com', W / 2, 700);
      ctx.fillStyle = Y;
      ctx.font = '500 16px ' + K.F.mono;
      ctx.fillText('2:47PM.STUDIO \u00b7 #FrameInGoa', W / 2, 744);
    }
  };

  /* ---------------- PFP FRAME · poster sun + mandala ---------------- */

  var pfp = {
    w: 1080,
    h: 1080,
    label: 'PFP Frame',
    draw: function (ctx, state) {
      var W = 1080, H = 1080;
      var cx = W / 2, cy = 505, r = 310;

      backdrop(ctx, W, H, 0.85);
      posterBorder(ctx, W, H, 10);

      // Draw mandala/flower decorations in corners offset to prevent overlap
      K.mandala(ctx, 118, 118, 44, Y);
      K.mandala(ctx, W - 118, 118, 44, Y);
      K.mandala(ctx, 118, H - 118, 44, Y);
      K.mandala(ctx, W - 118, H - 118, 44, Y);
      
      // Secondary flower ornaments
      K.flower(ctx, W - 180, 180, 15, RP);
      K.flower(ctx, 180, H - 180, 15, RP);

      // Cleaned decorative top corner details
      ctx.save();
      ctx.globalAlpha = 0.8;
      K.palm(ctx, W - 120, 220, 80, Y);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = K.P.paper;
      ctx.fill();
      ctx.strokeStyle = B;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 7, 0, Math.PI * 2);
      ctx.strokeStyle = Y;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 17, 0, Math.PI * 2);
      ctx.strokeStyle = Y;
      ctx.lineWidth = 3;
      ctx.setLineDash([0.01, 14]);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
      ctx.clip();
      putPhoto(ctx, photoImg(state, 0), cx - r, cy - r, r * 2, r * 2);
      ctx.restore();

      K.arcTop(ctx, 'HACKER HOUSE GOA 2026', cx, cy, r + 76, '700 ' + Math.round(H * 0.052) + 'px ' + K.F.serif, Y);
      K.arcBottom(ctx, 'BUILD \u00b7 SHIP \u00b7 LAUNCH', cx, cy, r + 70, '600 ' + Math.round(H * 0.044) + 'px ' + K.F.serif, W);

      goaBadge(ctx, cx, 824, 212, 58, '\u0917\u094B\u0935\u093E', 36);
      K.flower(ctx, cx - 140, 824, 13, R);
      K.flower(ctx, cx + 140, 824, 13, R);

      ctx.fillStyle = Y;
      ctx.font = '600 ' + Math.round(H * 0.021) + 'px ' + K.F.mono;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('2:47PM \u00b7 hhgoa.com', cx, 962);
      ctx.fillStyle = W;
      ctx.font = '500 ' + Math.round(H * 0.017) + 'px ' + K.F.mono;
      ctx.fillText('28\u201331 OCT 2026 \u00b7 GOA, INDIA \u00b7 #FrameInGoa', cx, 1002);

      ctx.textAlign = 'left';
      ctx.fillStyle = W;
      ctx.font = '500 16px ' + K.F.mono;
      ctx.fillText('EDITION 2026', 34, H - 40);
      ctx.textAlign = 'right';
      ctx.fillStyle = Y;
      ctx.font = '600 16px ' + K.F.mono;
      ctx.fillText('SHIP THINGS THAT MATTER', W - 34, H - 40);
    }
  };

  return {
    passport: passport,
    boarding: boarding,
    squad: squad,
    pfp: pfp
  };
})();

export { Themes };
