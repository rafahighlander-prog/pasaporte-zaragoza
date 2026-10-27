(function () {
  'use strict';
  const { RUTAS, EQUIPO, LEMA } = ZGZ;
  const KEY = 'pasaporte-zgz-2026';
  const $ = (s) => document.querySelector(s);

  // ---------- Estado persistente ----------
  function cargar() {
    const base = { tab: 'tubo', nombre: '', tubo: [], cultural: [] };
    try { return Object.assign(base, JSON.parse(localStorage.getItem(KEY))); } catch (e) { return base; }
  }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* almacenamiento no disponible */ } }
  const st = cargar();
  ZGZ.estado = st;
  ZGZ.guardar = guardar;

  // ---------- Utilidades ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('toast--on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('toast--on'), 2200);
  }
  const rutaActual = () => RUTAS[rutaId];
  const visitado = (id) => st[rutaId].includes(id);
  const completa = () => st[rutaId].length === rutaActual().hitos.length;
  const urlIr = (h) => {
    const q = h.dir ? `${h.nombre}, ${h.dir}, Zaragoza` : `${h.nombre}, Zaragoza`;
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(q);
  };

  // ---------- Mapa ----------
  let map, capa, rutaId = 'tubo', selId = null;
  const marcadores = {};

  function iniciarMapa() {
    map = L.map('mapa', { maxZoom: 19 }).setView([41.6535, -0.8795], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    capa = L.layerGroup().addTo(map);
  }

  function iconoPin(h) {
    const cls = 'pin' + (visitado(h.id) ? ' pin--ok' : '') + (selId === h.id ? ' pin--sel' : '');
    return L.divIcon({ className: cls, html: `<span>${h.id}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] });
  }

  function refrescarPin(id) {
    const h = rutaActual().hitos.find((x) => x.id === id);
    const m = marcadores[id];
    if (!m) return;
    m.setIcon(iconoPin(h));
    m.setZIndexOffset(selId === id ? 1000 : 0);
  }

  function dibujarMarcadores() {
    capa.clearLayers();
    Object.keys(marcadores).forEach((k) => delete marcadores[k]);
    const r = rutaActual();
    r.hitos.forEach((h) => {
      marcadores[h.id] = L.marker([h.lat, h.lng], { icon: iconoPin(h), title: h.nombre })
        .on('click', () => seleccionar(h.id, 'mapa'))
        .addTo(capa);
    });
  }

  function encuadrar() {
    const b = L.latLngBounds(rutaActual().hitos.map((h) => [h.lat, h.lng]));
    map.invalidateSize();
    map.fitBounds(b, { padding: [28, 28], maxZoom: 18 });
  }

  // ---------- Lista ----------
  function htmlItem(h) {
    const r = rutaActual();
    const sel = selId === h.id;
    const esTubo = r.id === 'tubo';
    const ok = visitado(h.id);
    const thumb = esTubo ? '' : `<img class="thumb" src="${h.foto}" alt="" loading="lazy">`;
    const detalle = esTubo
      ? `<p class="hito__dir">${h.dir}</p><p class="hito__tapa"><b>Tapa clásica:</b> ${h.tapa}</p>`
      : '';
    let det = '';
    if (sel) {
      const foto = esTubo ? '' : `<img class="hito__foto" src="${h.foto}" alt="${h.nombre}">
        <div class="hito__cred">Foto: ${h.credito.autor} · <a href="${h.credito.url}" target="_blank" rel="noopener">${h.credito.licencia}</a> · Wikimedia Commons</div>`;
      det = `<div class="hito__det">${foto}<a class="btn hito__ir" href="${urlIr(h)}" target="_blank" rel="noopener"><svg class="i"><use href="#i-ruta"/></svg>Cómo llegar</a></div>`;
    }
    return `<div class="hito__fila">
        <span class="num">${h.id}</span>${thumb}
        <div class="hito__txt"><h3 class="hito__nombre">${h.nombre}</h3>${detalle}</div>
        <button type="button" class="sello" aria-pressed="${ok}" aria-label="${ok ? 'Quitar sello de' : 'Sellar'} ${h.nombre}">
          <svg class="i"><use href="#i-check"/></svg><span>${ok ? 'SELLADO' : 'SELLAR'}</span>
        </button>
      </div>${det}`;
  }

  function pintarItem(id, nuevo) {
    const li = document.querySelector(`.hito[data-id="${id}"]`);
    if (!li) return;
    const h = rutaActual().hitos.find((x) => x.id === id);
    li.className = 'hito' + (selId === id ? ' hito--sel' : '') + (visitado(id) ? ' hito--ok' : '') + (nuevo ? ' hito--nuevo' : '');
    li.innerHTML = htmlItem(h);
  }

  function pintarLista() {
    const ol = $('#hitos');
    ol.innerHTML = rutaActual().hitos.map((h) => `<li class="hito" data-id="${h.id}"></li>`).join('');
    rutaActual().hitos.forEach((h) => pintarItem(h.id));
    $('#lista-wrap').scrollTop = 0;
  }

  function pintarProgreso() {
    const r = rutaActual();
    const n = st[r.id].length;
    const total = r.hitos.length;
    const pct = Math.round((n / total) * 100);
    $('#progreso-titulo').textContent = r.titulo;
    $('#progreso-cuenta').textContent = `${n} de ${total} ${r.unidad}`;
    const barra = $('#progreso-barra');
    barra.setAttribute('aria-valuenow', pct);
    barra.firstElementChild.style.width = pct + '%';
    $('#btn-diploma').setAttribute('aria-disabled', String(n < total));
  }

  // ---------- Interacción ----------
  function seleccionar(id, origen) {
    const previo = selId;
    selId = origen === 'lista' && previo === id ? null : id;
    if (previo) { pintarItem(previo); refrescarPin(previo); }
    if (selId) {
      pintarItem(selId);
      refrescarPin(selId);
      const h = rutaActual().hitos.find((x) => x.id === selId);
      map.flyTo([h.lat, h.lng], Math.max(map.getZoom(), 17), { duration: 0.5 });
      const li = document.querySelector(`.hito[data-id="${selId}"]`);
      if (li) {
        li.style.scrollMarginTop = $('.progreso').offsetHeight + 8 + 'px';
        setTimeout(() => li.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 30);
      }
    }
  }

  function alternarSello(id) {
    const r = rutaActual();
    const h = r.hitos.find((x) => x.id === id);
    const arr = st[r.id];
    const i = arr.indexOf(id);
    const estabaCompleta = completa();
    if (i >= 0) {
      arr.splice(i, 1);
      toast(`Sello retirado: ${h.nombre}`);
    } else {
      arr.push(id);
      toast(`¡Sellado! ${h.nombre}`);
      if (navigator.vibrate) navigator.vibrate(25);
    }
    guardar();
    pintarItem(id, i < 0);
    refrescarPin(id);
    pintarProgreso();
    if (!estabaCompleta && completa()) {
      setTimeout(() => ZGZ.abrirDiploma(r), 900);
    }
  }

  $('#hitos').addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const li = e.target.closest('.hito');
    if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.closest('.sello')) { alternarSello(id); return; }
    seleccionar(id, 'lista');
  });

  $('#btn-diploma').addEventListener('click', () => {
    if (completa()) { ZGZ.abrirDiploma(rutaActual()); return; }
    const falta = rutaActual().hitos.length - st[rutaId].length;
    toast(`Te faltan ${falta} ${rutaActual().unidad} por sellar para obtener el diploma`);
  });
  $('#btn-compartir').addEventListener('click', () => ZGZ.abrirPasaporte());

  // ---------- Pestañas ----------
  function mostrarTab(tab) {
    st.tab = tab;
    guardar();
    document.querySelectorAll('#tabs button').forEach((b) => {
      if (b.dataset.tab === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    const esRuta = tab === 'tubo' || tab === 'cultural';
    $('#panel-ruta').hidden = !esRuta;
    $('#panel-equipo').hidden = tab !== 'equipo';
    $('#panel-ayuda').hidden = tab !== 'ayuda';
    if (!esRuta) return;
    if (!map) iniciarMapa();
    rutaId = tab;
    selId = null;
    pintarLista();
    pintarProgreso();
    dibujarMarcadores();
    encuadrar();
  }
  $('#tabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-tab]');
    if (b) mostrarTab(b.dataset.tab);
  });

  // ---------- Bienvenida ----------
  const bienvenida = $('#dlg-bienvenida');
  bienvenida.addEventListener('close', () => { st.bienvenida = true; guardar(); });
  $('#btn-ayuda').addEventListener('click', () => bienvenida.showModal());
  $('#bv-guia').addEventListener('click', () => { bienvenida.close(); mostrarTab('ayuda'); });

  // ---------- Geolocalización ----------
  let watchId = null, yoMarca = null, yoPrec = null;
  function pararUbicacion() {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    if (yoMarca) { map.removeLayer(yoMarca); map.removeLayer(yoPrec); }
    yoMarca = yoPrec = null;
    $('#btn-loc').setAttribute('aria-pressed', 'false');
  }
  $('#btn-loc').addEventListener('click', () => {
    if (watchId !== null) { pararUbicacion(); return; }
    if (!navigator.geolocation) { toast('Tu navegador no permite la geolocalización'); return; }
    $('#btn-loc').setAttribute('aria-pressed', 'true');
    watchId = navigator.geolocation.watchPosition((pos) => {
      const ll = [pos.coords.latitude, pos.coords.longitude];
      if (!yoMarca) {
        yoMarca = L.marker(ll, { icon: L.divIcon({ className: 'pin', html: '<div class="yo-punto"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }), interactive: false, zIndexOffset: -500 }).addTo(map);
        yoPrec = L.circle(ll, { radius: pos.coords.accuracy, weight: 1, color: '#1a73e8', fillOpacity: 0.12, interactive: false }).addTo(map);
        const b = L.latLngBounds(rutaActual().hitos.map((h) => [h.lat, h.lng]));
        if (b.pad(3).contains(ll)) map.fitBounds(b.extend(ll), { padding: [28, 28], maxZoom: 18 });
        else toast('Estás lejos de la ruta; el mapa sigue centrado en Zaragoza');
      } else {
        yoMarca.setLatLng(ll);
        yoPrec.setLatLng(ll).setRadius(pos.coords.accuracy);
      }
    }, () => {
      toast('No se pudo obtener tu ubicación. Revisa los permisos.');
      pararUbicacion();
    }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 });
  });

  // ---------- Conócenos ----------
  $('#lema').textContent = LEMA;
  $('#equipo-grid').innerHTML = EQUIPO.map((m) => `
    <article class="miembro">
      <img src="${m.foto}" alt="Foto de ${m.nombre}" loading="lazy">
      <div><h3>${m.nombre}</h3><h4>${m.cargo}</h4><p>${m.desc}</p></div>
    </article>`).join('');
  $('#creditos').innerHTML = RUTAS.cultural.hitos.map((h) =>
    `<li>${h.nombre}: ${h.credito.autor}, <a href="${h.credito.url}" target="_blank" rel="noopener">${h.credito.licencia}</a>, Wikimedia Commons</li>`).join('');

  // ---------- Instalación y service worker ----------
  let promptInstalar = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    promptInstalar = e;
    $('#btn-instalar').hidden = false;
  });
  $('#btn-instalar').addEventListener('click', async () => {
    if (!promptInstalar) return;
    promptInstalar.prompt();
    await promptInstalar.userChoice;
    promptInstalar = null;
    $('#btn-instalar').hidden = true;
  });
  window.addEventListener('appinstalled', () => { $('#btn-instalar').hidden = true; });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  mostrarTab(['tubo', 'cultural', 'equipo', 'ayuda'].includes(st.tab) ? st.tab : 'tubo');
  if (!st.bienvenida) setTimeout(() => bienvenida.showModal(), 500);
})();
