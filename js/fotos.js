window.ZGZ = window.ZGZ || {};

// Fotos de "prueba de vida": sólo se guardan en este dispositivo (IndexedDB).
ZGZ.fotos = (function () {
  'use strict';
  let dbp;

  function db() {
    if (!dbp) {
      dbp = new Promise((res, rej) => {
        const r = indexedDB.open('pasaporte-zgz-2026', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('fotos');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    }
    return dbp;
  }

  function escribir(fn) {
    return db().then((d) => new Promise((res, rej) => {
      const t = d.transaction('fotos', 'readwrite');
      fn(t.objectStore('fotos'));
      t.oncomplete = () => res();
      t.onerror = t.onabort = () => rej(t.error);
    }));
  }

  async function deRuta(ruta) {
    const d = await db();
    return new Promise((res, rej) => {
      const out = {};
      const rq = d.transaction('fotos').objectStore('fotos').openCursor(IDBKeyRange.bound(ruta + ':', ruta + ':\uffff'));
      rq.onsuccess = () => {
        const c = rq.result;
        if (c) { out[c.key.split(':')[1]] = c.value; c.continue(); } else res(out);
      };
      rq.onerror = () => rej(rq.error);
    });
  }

  async function reducir(file, max) {
    max = max || 1000;
    let bmp;
    try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { bmp = await createImageBitmap(file); }
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    if (bmp.close) bmp.close();
    return new Promise((res) => c.toBlob(res, 'image/jpeg', 0.82));
  }

  return {
    deRuta,
    reducir,
    guardar: (clave, valor) => escribir((s) => s.put(valor, clave)),
    borrar: (clave) => escribir((s) => s.delete(clave))
  };
})();
