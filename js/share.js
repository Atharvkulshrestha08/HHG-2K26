const Share = (function () {
  function canvasToBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(resolve, 'image/png');
    });
  }

  function caption(state) {
    var n = state.name || 'a builder';
    var howto = 'How it works: pick a format \u2192 add a photo \u2192 download \u2192 post.';
    var m = state.mode;
    var tag = ' #FrameInGoa #HHGoa2026';
    if (m === 'passport') {
      return 'Just minted my Builder Passport for HH Goa 2026 \u{1F334} 28\u201331 Oct \u00b7 Goa, India \u00b7 247 builders. Ship things that matter. ' + howto + tag;
    }
    if (m === 'boarding') {
      return 'Boarded flight HH-247 to HH Goa 2026 \u{1F681} Gate Paradise \u00b7 Seat B-247 \u00b7 28\u201331 Oct. Ship things that matter. ' + howto + tag;
    }
    if (m === 'squad') {
      return 'Squad ' + (state.team || '247') + ' is locked in for HH Goa 2026 \u2600\ufe0f ' + n + ' + team \u00b7 28\u201331 Oct \u00b7 Goa, India. We ship things that matter. ' + howto + tag;
    }
    return 'Framed for HH Goa 2026 \u{1F3D6}\ufe0f ' + n + '. New PFP, unlocked. Ship things that matter. ' + howto + tag;
  }

  function openIntent(text) {
    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    var w = window.open(url, '_blank', 'noopener,noreferrer');
    if (!w) {
      window.location.href = url;
    }
  }

  function download(canvas, mode) {
    var a = document.createElement('a');
    a.download = 'hhgoa-' + mode + '-frame.png';
    a.href = canvas.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function shareToX(canvas, state, onNote) {
    var text = caption(state);
    if (navigator.canShare) {
      canvasToBlob(canvas).then(function (blob) {
        var file = new File([blob], 'hhgoa-frame.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file], text: text })) {
          navigator.share({
            files: [file],
            text: text,
            title: 'HH Goa 2026 \u2014 Frame'
          }).then(function () {
            if (onNote) onNote('Shared \u2014 make sure #FrameInGoa is in your post.');
          }).catch(function () {});
        } else {
          openIntent(text);
          if (onNote) onNote('X opened \u2014 attach the downloaded PNG and keep #FrameInGoa.');
        }
      });
    } else {
      openIntent(text);
      if (onNote) onNote('X opened \u2014 attach the downloaded PNG and keep #FrameInGoa.');
    }
  }

  function copyCaption(state, onNote) {
    var text = caption(state);
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (onNote) onNote('Caption copied \u2014 paste it into your post.');
      }).catch(fallback);
    } else {
      fallback();
      if (onNote) onNote('Caption copied \u2014 paste it into your post.');
    }
  }

  return {
    caption: caption,
    download: download,
    shareToX: shareToX,
    copyCaption: copyCaption
  };
})();

export { Share };
