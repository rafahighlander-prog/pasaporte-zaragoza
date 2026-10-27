(function () {
  'use strict';
  const { RUTAS, LEMA } = ZGZ;
  const $ = (s) => document.querySelector(s);
  const dlg = $('#dlg');
  const canvas = $('#dlg-canvas');
  const inputNombre = $('#dlg-nombre');
  const FUENTE = "'Montserrat','Segoe UI',Arial,sans-serif";
  const AMARILLO = '#f7c701', NAVY = '#101354', AZUL = '#0b64b0', TURQ = '#5ff0f0', TURQ_OSC = '#087a8c', VERDE = '#14a05a';

  const logo = new Image();
  logo.src = 'img/logo-ministerio.jpg';
  const logoListo = logo.decode ? logo.decode().catch(() => {}) : Promise.resolve();

  let actual = null;
  let tRender;

  async function dibujar() {
    await Promise.all([logoListo, document.fonts.load('800 40px Montserrat'), document.fonts.load('700 40px Montserrat')]);
    actual.dibujar(inputNombre.value.trim());
  }

  function abrir(cfg) {
    actual = cfg;
    $('#dlg-titulo').textContent = cfg.titulo;
    inputNombre.value = ZGZ.estado.nombre || '';
    $('#dlg-compartir').hidden = !navigator.canShare;
    if (!dlg.open) dlg.showModal();
    dibujar();
  }

  inputNombre.addEventListener('input', () => {
    ZGZ.estado.nombre = inputNombre.value.trim();
    ZGZ.guardar();
    clearTimeout(tRender);
    tRender = setTimeout(dibujar, 150);
  });
  inputNombre.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); inputNombre.blur(); } });

  const blobPng = () => new Promise((res) => canvas.toBlob(res, 'image/png'));

  function descargar(blob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = actual.archivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  $('#dlg-descargar').addEventListener('click', async () => descargar(await blobPng()));
  $('#dlg-compartir').addEventListener('click', async () => {
    const blob = await blobPng();
    const file = new File([blob], actual.archivo, { type: 'image/png' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: actual.titulo, text: actual.texto });
      } else {
        descargar(blob);
      }
    } catch (e) {
      if (e.name !== 'AbortError') descargar(blob);
    }
  });

  // ---------- Utilidades de dibujo ----------
  function preparar(w, h) {
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    return ctx;
  }

  function tamanoQueCabe(ctx, txt, max, tam, peso) {
    let s = tam;
    for (; s > 20; s -= 2) {
      ctx.font = `${peso} ${s}px ${FUENTE}`;
      if (ctx.measureText(txt).width <= max) break;
    }
    return s;
  }

  function parrafo(ctx, txt, x, y, maxW, interlineado) {
    let linea = '';
    txt.split(' ').forEach((p) => {
      const prueba = linea ? linea + ' ' + p : p;
      if (ctx.measureText(prueba).width > maxW && linea) {
        ctx.fillText(linea, x, y);
        linea = p;
        y += interlineado;
      } else {
        linea = prueba;
      }
    });
    ctx.fillText(linea, x, y);
    return y + interlineado;
  }

  function cabecera(ctx, x, y, w, alto, centrado) {
    ctx.fillStyle = AMARILLO;
    ctx.fillRect(x, y, w, alto);
    const ah = alto - 16;
    const aw = ah * 504 / 154;
    const lx = centrado ? x + (w - aw) / 2 : x;
    ctx.drawImage(logo, 4, 4, 504, 154, lx, y + 8, aw, ah);
  }

  // ---------- Diploma ----------
  function diploma(ruta) {
    const W = 1080, H = 1400;
    const ctx = preparar(W, H);
    ctx.fillStyle = '#fffdf4';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = NAVY; ctx.lineWidth = 10; ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.strokeStyle = AMARILLO; ctx.lineWidth = 4; ctx.strokeRect(44, 44, W - 88, H - 88);

    cabecera(ctx, 49, 49, W - 98, 170, true);

    ctx.fillStyle = NAVY;
    ctx.font = `800 112px ${FUENTE}`;
    ctx.fillText('DIPLOMA', W / 2, 360);
    ctx.fillStyle = TURQ_OSC;
    ctx.fillRect(W / 2 - 90, 385, 180, 8);

    ctx.fillStyle = '#4a5578';
    ctx.font = `700 32px ${FUENTE}`;
    ctx.fillText('El Ministerio del Buen Vivir tiene el honor de otorgar a', W / 2, 465);

    const nombre = ZGZ.estado.nombre || inputNombre.value.trim();
    ctx.fillStyle = AZUL;
    const txtNombre = nombre || '';
    const s = tamanoQueCabe(ctx, txtNombre || 'x', W - 200, 84, 800);
    ctx.font = `800 ${s}px ${FUENTE}`;
    ctx.fillText(txtNombre, W / 2, 565);
    ctx.fillStyle = NAVY;
    ctx.fillRect(140, 590, W - 280, 3);

    ctx.fillStyle = '#4a5578';
    ctx.font = `700 32px ${FUENTE}`;
    ctx.fillText('el título de', W / 2, 670);

    ctx.fillStyle = TURQ_OSC;
    const s2 = tamanoQueCabe(ctx, ruta.tituloDiploma, W - 160, 80, 800);
    ctx.font = `800 ${s2}px ${FUENTE}`;
    ctx.fillText(ruta.tituloDiploma, W / 2, 775);

    ctx.fillStyle = '#1c2540';
    ctx.font = `600 32px ${FUENTE}`;
    parrafo(ctx, ruta.textoDiploma, W / 2, 860, 840, 46);

    // Sello
    const cx = W / 2, cy = 1070;
    ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.fillStyle = AMARILLO; ctx.fill();
    ctx.lineWidth = 8; ctx.strokeStyle = NAVY; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 82, 0, Math.PI * 2);
    ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = NAVY;
    ctx.font = `800 24px ${FUENTE}`; ctx.fillText('★ ★ ★', cx, cy - 36);
    ctx.font = `800 62px ${FUENTE}`; ctx.fillText('ZGZ', cx, cy + 22);
    ctx.font = `800 26px ${FUENTE}`; ctx.fillText('2026', cx, cy + 60);

    const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    ctx.fillStyle = '#1c2540';
    ctx.font = `700 28px ${FUENTE}`;
    ctx.fillText(`En Zaragoza, a ${fecha}`, W / 2, 1215);
    ctx.fillStyle = NAVY; ctx.fillRect(W / 2 - 230, 1262, 460, 2);
    ctx.fillStyle = '#4a5578';
    ctx.font = `700 22px ${FUENTE}`;
    ctx.fillText('El Gabinete del Ministerio del Buen Vivir', W / 2, 1296);

    ctx.fillStyle = '#6b7692';
    ctx.font = `italic 600 24px ${FUENTE}`;
    parrafo(ctx, '«' + LEMA + '»', W / 2, 1326, 860, 32);
  }

  // ---------- Pasaporte (resumen de sellos) ----------
  function marcaCheck(ctx, x, y, r) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - r * 0.5, y); ctx.lineTo(x - r * 0.1, y + r * 0.4); ctx.lineTo(x + r * 0.55, y - r * 0.4);
    ctx.strokeStyle = VERDE; ctx.lineWidth = r * 0.3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  }

  function filaSellos(ctx, ruta, y0, W, porFila) {
    const marg = 70;
    const paso = (W - marg * 2) / porFila;
    const hechos = ZGZ.estado[ruta.id];
    ruta.hitos.forEach((h, i) => {
      const x = marg + paso / 2 + (i % porFila) * paso;
      const y = y0 + Math.floor(i / porFila) * 128;
      const ok = hechos.includes(h.id);
      ctx.beginPath(); ctx.arc(x, y, 46, 0, Math.PI * 2);
      if (ok) {
        ctx.fillStyle = VERDE; ctx.fill();
        ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fill();
        ctx.lineWidth = 3; ctx.setLineDash([9, 8]); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.fillStyle = ok ? '#fff' : 'rgba(255,255,255,.55)';
      ctx.font = `800 40px ${FUENTE}`;
      ctx.fillText(String(h.id), x, y + 14);
      if (ok) marcaCheck(ctx, x + 34, y - 34, 15);
    });
  }

  function pasaporte() {
    const W = 1080, H = 1350;
    const ctx = preparar(W, H);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#101354'); g.addColorStop(1, '#0c2a74');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    cabecera(ctx, 0, 0, W, 170, false);

    ctx.lineJoin = 'round'; ctx.lineWidth = 10; ctx.strokeStyle = TURQ_OSC;
    ctx.font = `800 80px ${FUENTE}`;
    ctx.strokeText('PASAPORTE ZARAGOZA', W / 2, 300);
    ctx.fillStyle = TURQ; ctx.fillText('PASAPORTE ZARAGOZA', W / 2, 300);
    ctx.font = `800 96px ${FUENTE}`;
    ctx.strokeStyle = '#0c2a74'; ctx.strokeText('2026', W / 2, 400);
    ctx.fillStyle = '#fff'; ctx.fillText('2026', W / 2, 400);

    const nombre = ZGZ.estado.nombre || inputNombre.value.trim();
    if (nombre) {
      ctx.fillStyle = '#fff';
      const s = tamanoQueCabe(ctx, 'Pasaporte de ' + nombre, W - 140, 40, 700);
      ctx.font = `700 ${s}px ${FUENTE}`;
      ctx.fillText('Pasaporte de ' + nombre, W / 2, 468);
    }

    const secciones = [[RUTAS.tubo, 7, 540], [RUTAS.cultural, 7, 900]];
    secciones.forEach(([ruta, porFila, y]) => {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#fff'; ctx.font = `800 40px ${FUENTE}`;
      ctx.fillText(ruta.titulo, 70, y);
      ctx.textAlign = 'right';
      ctx.fillStyle = TURQ;
      ctx.fillText(`${ZGZ.estado[ruta.id].length} / ${ruta.hitos.length}`, W - 70, y);
      ctx.textAlign = 'center';
      filaSellos(ctx, ruta, y + 80, W, porFila);
    });

    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.font = `italic 600 28px ${FUENTE}`;
    parrafo(ctx, '«' + LEMA + '»', W / 2, 1180, 860, 38);
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.font = `700 22px ${FUENTE}`;
    ctx.fillText('Ministerio del Buen Vivir · Sede no oficial', W / 2, 1300);
  }

  ZGZ.abrirDiploma = (ruta) => abrir({
    titulo: `Diploma · ${ruta.titulo}`,
    texto: `¡He completado la ${ruta.titulo} del Pasaporte Zaragoza 2026!`,
    archivo: `diploma-${ruta.id}-zaragoza-2026.png`,
    dibujar: () => diploma(ruta)
  });

  ZGZ.abrirPasaporte = () => abrir({
    titulo: 'Mi pasaporte',
    texto: 'Mi Pasaporte Zaragoza 2026',
    archivo: 'pasaporte-zaragoza-2026.png',
    dibujar: pasaporte
  });
})();
