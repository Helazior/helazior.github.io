// LES PIÈCES JOINTES SUR LE WEB (09/11/2026). Comme sur Android, tout reste sur
// l'appareil : le fichier choisi est COPIÉ dans IndexedDB (base « scheduler-files »),
// l'app ne garde que sa clé (`Attachment.path`, tirée ici, jamais lue dans une donnée).
// L'app (Kotlin, js et wasm) ne passe que des CHAÎNES : chaque opération asynchrone
// rend un numéro de demande, dont le résultat se relit par `result(id)` (null tant
// qu'il n'est pas prêt) — pas de promesse à traverser.
//   pick(kind)            → JSON {path,name,mime,size} ou "" (annulé / échec)
//   image(path, maxPx)    → base64 d'un JPEG/PNG au plus maxPx de côté, ou ""
//   open(path)            → ouvre le fichier dans un nouvel onglet (blob:)
//   remove(path)          → efface
//   purge(refsJson, olderThanMs) → efface les fichiers non référencés plus vieux
(function () {
  'use strict';
  var DB = 'scheduler-files', STORE = 'files', MAX_SIDE = 2048, MAX_BYTES = 50 * 1024 * 1024;
  var results = {}, next = 1;
  function db() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore(STORE); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (resolve, reject) {
        var t = d.transaction(STORE, mode), store = t.objectStore(STORE), out;
        var r = fn(store);
        if (r) r.onsuccess = function () { out = r.result; };
        t.oncomplete = function () { resolve(out); };
        t.onerror = function () { reject(t.error); };
      });
    });
  }
  function put(path, blob) { return tx('readwrite', function (s) { return s.put({ blob: blob, at: Date.now() }, path); }); }
  function get(path) { return tx('readonly', function (s) { return s.get(path); }).then(function (v) { return v ? v.blob : null; }); }
  function track(promise) {
    var id = next++;
    promise.then(function (v) { results[id] = (v == null ? '' : String(v)); }, function () { results[id] = ''; });
    return id;
  }
  function randomName(ext) {
    var a = new Uint8Array(12); crypto.getRandomValues(a);
    return 'att_' + Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('') + (ext ? '.' + ext : '');
  }
  function extOf(name) { var m = /\.([A-Za-z0-9]{1,8})$/.exec(name || ''); return m ? m[1].toLowerCase() : ''; }
  function toBase64(blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { var s = String(r.result); resolve(s.slice(s.indexOf(',') + 1)); };
      r.onerror = function () { reject(r.error); };
      r.readAsDataURL(blob);
    });
  }
  // Une image plus grande que maxSide est réduite (JPEG 85 %), comme ImageShrink sur Android ;
  // un GIF et une petite image restent tels quels.
  function shrink(blob, maxSide, quality) {
    if (!/^image\//.test(blob.type) || blob.type === 'image/gif' || typeof createImageBitmap !== 'function') return Promise.resolve(blob);
    return createImageBitmap(blob).then(function (bmp) {
      var scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
      if (scale >= 1 && blob.size < 1.5 * 1024 * 1024) { bmp.close && bmp.close(); return blob; }
      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(bmp.width * scale)); c.height = Math.max(1, Math.round(bmp.height * scale));
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      bmp.close && bmp.close();
      return new Promise(function (resolve) { c.toBlob(function (b) { resolve(b || blob); }, 'image/jpeg', quality); });
    }).catch(function () { return blob; });
  }
  window.SchedulerFiles = {
    supported: function () { return typeof indexedDB !== 'undefined'; },
    result: function (id) { if (!(id in results)) return null; var v = results[id]; delete results[id]; return v; },
    pick: function (kind) {
      return track(new Promise(function (resolve) {
        var input = document.createElement('input');
        input.type = 'file';
        if (kind === 'IMAGE') input.accept = 'image/*';
        input.style.display = 'none';
        var done = false;
        function finish(v) { if (!done) { done = true; input.remove(); resolve(v); } }
        input.addEventListener('change', function () {
          var f = input.files && input.files[0];
          if (!f || f.size > MAX_BYTES) { finish(''); return; }
          var isImage = /^image\//.test(f.type);
          shrink(f, MAX_SIDE, 0.85).then(function (blob) {
            var shrunk = blob !== f, name = f.name || 'fichier';
            if (shrunk) name = name.replace(/\.[^.]*$/, '') + '.jpg';
            var mime = shrunk ? 'image/jpeg' : (f.type || 'application/octet-stream');
            var path = randomName(isImage ? (shrunk ? 'jpg' : extOf(f.name)) : extOf(f.name));
            return put(path, blob).then(function () {
              finish(JSON.stringify({ path: path, name: name.slice(0, 200), mime: mime.slice(0, 100), size: blob.size }));
            });
          }).catch(function () { finish(''); });
        });
        // Fenêtre fermée sans choix : certains navigateurs envoient « cancel ».
        input.addEventListener('cancel', function () { finish(''); });
        document.body.appendChild(input);
        input.click();
      }));
    },
    image: function (path, maxPx) {
      return track(get(path).then(function (blob) {
        if (!blob) return '';
        return shrink(blob, maxPx, 0.9).then(toBase64);
      }));
    },
    open: function (path) {
      get(path).then(function (blob) {
        if (!blob) return;
        var url = URL.createObjectURL(blob);
        window.open(url, '_blank', 'noopener,noreferrer');
        setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      });
    },
    remove: function (path) { tx('readwrite', function (s) { return s.delete(path); }).catch(function () {}); },
    purge: function (refsJson, olderThan) {
      var refs = {}; try { JSON.parse(refsJson).forEach(function (p) { refs[p] = true; }); } catch (e) { return; }
      db().then(function (d) {
        var t = d.transaction(STORE, 'readwrite'), s = t.objectStore(STORE), req = s.openCursor();
        req.onsuccess = function () {
          var c = req.result; if (!c) return;
          if (!refs[c.key] && c.value && c.value.at < olderThan) c.delete();
          c.continue();
        };
      }).catch(function () {});
    }
  };
})();
