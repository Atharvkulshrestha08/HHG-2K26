import { Kit } from './canvas-kit.js';
import { Themes } from './themes.js';
import { Share } from './share.js';

(function () {
  var canvas = document.getElementById('genCanvas');
  var ctx = canvas.getContext('2d');
  var metaEl = document.getElementById('previewMeta');

  var state = {
    mode: 'passport',
    photos: [null, null, null],
    name: '',
    stack: '',
    handle: '',
    team: '',
    memberNames: ['', '', ''],
    classes: [],
    roll: 0
  };

  var photoGroup = document.getElementById('photoGroup');
  var slotEls = [];

  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove('show'); }, 3400);
  }

  function classFor(str, idx, roll) {
    if (roll) {
      var pool = ['Bay Builder', 'Coconut Compiler', 'Palm Coder', 'Lagoon Scripts', 'Shack Maker', 'Starfish Stack', 'Harbor Hacker', 'Island Engineer', 'Monsoon Maker', 'Reef Runner', 'Tide Turner', 'Wave Rider'];
      var rnd = Kit.mulberry(roll * 7919 + idx);
      var base = pool[Math.floor(rnd() * pool.length)];
      return idx ? base + [' II', ' III'][idx - 1] : base;
    }
    var kw = String(str || '').toLowerCase();
    var table = [
      [/ai|ml|llm|genai|model/, 'Tide Whisperer'],
      [/front|react|next|vue|svelte|ui|ux|css|web/, 'Wave Rider'],
      [/back|node|api|server|go\b|rust|python/, 'Tide Turner'],
      [/full|typescript|javascript|js\b/, 'Sunset Stacker'],
      [/mobile|flutter|swift|kotlin|ios|android/, 'Reef Runner'],
      [/devops|cloud|aws|k8s|docker|infra|sre|gcp/, 'Lighthouse Keeper'],
      [/data|sql|pandas|analytics|mlops/, 'Monsoon Mapper'],
      [/block|web3|solidity|chain|defi/, 'Reef Miner'],
      [/design|product|pm|figma/, 'Beach Cartographer'],
      [/hardware|iot|embedded|fpga|arduino/, 'Palm Circuit'],
      [/game|unity|unreal|three/, 'Wave Architect']
    ];
    var base = 'Harbor Hacker';
    for (var i = 0; i < table.length; i++) {
      if (table[i][0].test(kw)) { base = table[i][1]; break; }
    }
    return idx ? base + [' II', ' III'][idx - 1] : base;
  }

  function recomputeClasses() {
    state.classes = [classFor(state.stack + ' ' + state.name, 0, state.roll)];
    for (var i = 1; i < 3; i++) {
      var seedName = state.memberNames[i] || state.name;
      state.classes.push(classFor(state.stack + ' ' + seedName, i, state.roll));
    }
    document.getElementById('classValue').textContent = state.classes[0];
  }

  function render() {
    var theme = Themes[state.mode];
    canvas.width = theme.w;
    canvas.height = theme.h;
    theme.draw(ctx, state);
    metaEl.textContent = theme.label + ' \u00b7 ' + theme.w + ' \u00d7 ' + theme.h;
  }

  var renderTimer = null;
  function scheduleRender() {
    recomputeClasses();
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 60);
  }

  var NON_DECODABLE = ['tiff', 'tif', 'psd', 'xcf', 'raw', 'cr2', 'nef', 'arw', 'k25', 'ai', 'eps', 'pdf', 'cdr', 'dwg', 'dxf', 'indd', 'ind', 'indt', '3dm', '3ds', 'max'];

  function looksUndecodable(file) {
    var n = String(file.name || '').toLowerCase();
    var t = String(file.type || '').toLowerCase();
    if (/image\/(tiff|vnd\.)/i.test(t)) return true;
    for (var i = 0; i < NON_DECODABLE.length; i++) {
      if (n.slice(-NON_DECODABLE[i].length - 1) === '.' + NON_DECODABLE[i]) return true;
    }
    return false;
  }

  function readPhoto(file) {
    return new Promise(function (resolve, reject) {
      var isHeic = /\.heic$/i.test(file.name) || /heic|heif/i.test(file.type);
      function load(blob) {
        var url = URL.createObjectURL(blob);
        var img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = function () { reject(new Error('That image type could not be decoded in the browser \u2014 JPG, PNG, GIF, WebP, AVIF, BMP and HEIC work.')); };
        img.src = url;
      }
      if (looksUndecodable(file)) {
        reject(new Error('That file type can\u2019t be decoded by the browser (RAW/PSD/TIFF/AI/3D\u2026). Use JPG, PNG, GIF, WebP, AVIF, BMP or HEIC.'));
        return;
      }
      if (isHeic) {
        if (window.heic2any) {
          window.heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })
            .then(function (b) { load(Array.isArray(b) ? b[0] : b); })
            .catch(function (err) {
              var msg = err && err.message ? err.message : '';
              if (/already browser readable/i.test(msg)) {
                load(file);
              } else {
                reject(err);
              }
            });
        } else {
          reject(new Error('HEIC needs the decoder \u2014 load the page online so it can download.'));
        }
      } else {
        load(file);
      }
    });
  }

  function handleFile(file, idx) {
    readPhoto(file).then(function (img) {
      state.photos[idx] = img;
      updateAllSlots();
      render();
    }).catch(function (err) {
      toast(err && err.message ? err.message : 'Could not read that photo \u2014 try JPG, PNG or HEIC.');
    });
  }

  function emptySlotHTML(i) {
    var label = state.mode === 'squad' ? 'Builder ' + (i + 1) : 'Add your photo';
    var sub = i === 0 ? 'JPG \u00b7 PNG \u00b7 WEBP \u00b7 HEIC' : 'JPG \u00b7 PNG \u00b7 HEIC';
    return '<span class="slot-empty"><span class="slot-plus" aria-hidden="true">+</span><span><b>' + label + '</b><br>' + sub + '</span></span>';
  }

  function createSlot(i) {
    var slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'photo-slot';
    slot.setAttribute('aria-label', 'Add photo ' + (i + 1));

    var img = state.photos[i];
    if (img) {
      slot.classList.add('has-img');
      var im = document.createElement('img');
      im.src = img.src;
      im.alt = 'Your photo';
      slot.appendChild(im);
      var rep = document.createElement('span');
      rep.className = 'slot-replace';
      rep.textContent = 'Replace';
      slot.appendChild(rep);
    } else {
      slot.innerHTML = emptySlotHTML(i);
    }

    var input = document.createElement('input');
    input.type = 'file';
    input.className = 'slot-input';
    input.accept = 'image/*,.jpg,.jpeg,.jpe,.jif,.jfif,.png,.gif,.webp,.avif,.apng,.tiff,.tif,.bmp,.ico,.cur,.heif,.heic,.svg,.svgz,.ai,.eps,.pdf,.cdr,.dwg,.dxf,.indd,.ind,.indt,.raw,.cr2,.nef,.arw,.k25,.psd,.xcf,.3dm,.3ds,.max,.sketch';
    input.addEventListener('change', function () {
      if (this.files && this.files[0]) handleFile(this.files[0], i);
      this.value = '';
    });
    slot.appendChild(input);

    slot.addEventListener('click', function () { input.click(); });
    slot.addEventListener('dragover', function (e) { e.preventDefault(); slot.classList.add('drag'); });
    slot.addEventListener('dragleave', function () { slot.classList.remove('drag'); });
    slot.addEventListener('drop', function (e) {
      e.preventDefault();
      slot.classList.remove('drag');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0], i);
    });

    return slot;
  }

  function updateAllSlots() {
    photoGroup.innerHTML = '';
    slotEls = [];
    var count = state.mode === 'squad' ? 3 : 1;
    var wrap = document.createElement('div');
    wrap.className = 'photo-slot-wrap' + (state.mode === 'squad' ? ' is-squad' : '');
    for (var i = 0; i < count; i++) {
      var slot = createSlot(i);
      wrap.appendChild(slot);
      slotEls.push(slot);
    }
    photoGroup.appendChild(wrap);
  }

  function sampleAvatar() {
    var c = document.createElement('canvas');
    c.width = 600;
    c.height = 720;
    var cx = c.getContext('2d');
    cx.fillStyle = '#0B5D3A';
    cx.fillRect(0, 0, 600, 720);
    cx.fillStyle = '#F5D520';
    cx.strokeStyle = '#000000';
    cx.lineWidth = 6;
    cx.beginPath();
    cx.arc(300, 340, 120, 0, Math.PI * 2);
    cx.fill();
    cx.stroke();
    cx.fillStyle = '#08331F';
    cx.beginPath();
    cx.ellipse(300, 700, 250, 110, 0, Math.PI, 0);
    cx.fill();
    cx.stroke();
    cx.fillStyle = '#F5D520';
    cx.font = '600 30px "JetBrains Mono", monospace';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText('SAMPLE', 300, 96);
    cx.fillStyle = '#FFFFFF';
    cx.fillText('HH GOA 2026', 300, 146);
    c.toBlob(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function () {
        state.photos[0] = img;
        updateAllSlots();
        render();
      };
      img.src = url;
    }, 'image/png');
  }

  function setMode(mode) {
    state.mode = mode;
    var tabs = document.querySelectorAll('.mode-tab');
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute('data-mode') === mode;
      tabs[i].classList.toggle('is-active', on);
      tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
    }
    document.getElementById('fieldGroup').hidden = (mode === 'pfp');
    document.getElementById('teamField').hidden = (mode !== 'squad');
    document.getElementById('memberField').hidden = (mode !== 'squad');
    updateAllSlots();
    render();
  }

  var modeTabs = document.querySelectorAll('.mode-tab');
  for (var t = 0; t < modeTabs.length; t++) {
    modeTabs[t].addEventListener('click', function () {
      setMode(this.getAttribute('data-mode'));
    });
  }

  function bindInput(id, key, memberIdx) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () {
      if (memberIdx != null) {
        state.memberNames[memberIdx] = el.value;
      } else {
        state[key] = el.value;
      }
      scheduleRender();
    });
  }

  bindInput('inName', 'name');
  bindInput('inStack', 'stack');
  bindInput('inHandle', 'handle');
  bindInput('inTeam', 'team');
  bindInput('inMember2', null, 1);
  bindInput('inMember3', null, 2);

  document.getElementById('rerollBtn').addEventListener('click', function () {
    state.roll++;
    recomputeClasses();
    render();
  });

  document.getElementById('dlBtn').addEventListener('click', function () {
    Share.download(canvas, state.mode);
    toast('PNG downloaded \u2014 ready to post.');
  });

  document.getElementById('shareBtn').addEventListener('click', function () {
    Share.shareToX(canvas, state, toast);
  });

  document.getElementById('copyBtn').addEventListener('click', function () {
    Share.copyCaption(state, toast);
  });

  document.querySelectorAll('.sample-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.photos[0] = null;
      sampleAvatar();
    });
  });

  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  navToggle.addEventListener('click', function () {
    var open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  render();
  recomputeClasses();
  updateAllSlots();
  sampleAvatar();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { render(); });
  }
})();
