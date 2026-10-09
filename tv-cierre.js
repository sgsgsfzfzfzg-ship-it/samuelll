/*
 * Pantalla animada de cierre para julietaspizzas.com/tv
 *
 * Uso: copia este archivo a web/public/tv-cierre.js y agrega antes de </body>:
 *   <script src="/tv-cierre.js"></script>
 *
 * - X minutos antes de cerrar cubre la pantalla con una cuenta regresiva animada.
 * - Al llegar la hora de cierre cambia a "Cerrado" hasta la siguiente apertura.
 * - Usa la hora del reloj de la TV/dispositivo.
 *
 * Para probar sin esperar:  /tv?demo=aviso   o   /tv?demo=cerrado
 * Para forzar un tema al probar: agrega &tema=halloween o &tema=normal
 */
(function () {
  'use strict';

  var CONFIG = {
    // Horario de cada día en formato 24 h: ['abre', 'cierra'].
    // null = ese día no abre. Si cierra pasada la medianoche, escribe la hora tal cual (ej. '01:00').
    horarios: {
      domingo:   ['17:00', '23:00'],
      lunes:     ['17:00', '23:00'],
      martes:    ['17:00', '23:00'],
      miercoles: ['17:00', '23:00'],
      jueves:    ['17:00', '23:00'],
      viernes:   ['17:00', '23:00'],
      sabado:    ['17:00', '23:00']
    },
    minutosAntes: 10,
    // true: después de cerrar muestra "Cerrado" hasta que vuelva a abrir.
    // false: la pantalla desaparece al cerrar.
    mostrarCerrado: true,
    // 'auto' = Halloween todo octubre y normal el resto del año.
    // También puedes forzar 'halloween' o 'normal'.
    tema: 'auto'
  };

  var TEXTOS = {
    normal: {
      iconoAviso: '🍕', iconoCerrado: '🍕',
      subAviso: 'Últimos pedidos — haz el tuyo ya',
      gracias: '¡Gracias por tu preferencia!'
    },
    halloween: {
      iconoAviso: '🎃', iconoCerrado: '👻',
      subAviso: 'Últimos pedidos… ¡si te atreves!',
      gracias: 'Los fantasmas cuidan el horno.'
    }
  };

  var DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  var NOMBRES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var CIRCUNFERENCIA = 2 * Math.PI * 52;

  var desfase = 0; // solo se usa en modo demo
  function ahora() { return new Date(Date.now() + desfase); }

  function temaActivo() {
    var m = /[?&]tema=(halloween|normal)/.exec(location.search);
    if (m) return m[1];
    if (CONFIG.tema !== 'auto') return CONFIG.tema;
    return ahora().getMonth() === 9 ? 'halloween' : 'normal';
  }

  function mediodia(fecha, dias) {
    var d = new Date(fecha);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + dias);
    return d;
  }

  function aHora(fecha, hhmm) {
    var p = hhmm.split(':');
    var d = new Date(fecha);
    d.setHours(+p[0], +p[1], 0, 0);
    return d;
  }

  // Turno que empieza el día de `fecha` (el cierre puede caer al día siguiente).
  function turno(fecha) {
    var h = CONFIG.horarios[DIAS[fecha.getDay()]];
    if (!h) return null;
    var abre = aHora(fecha, h[0]);
    var cierra = aHora(fecha, h[1]);
    if (cierra <= abre) cierra.setDate(cierra.getDate() + 1);
    return { abre: abre, cierra: cierra };
  }

  function proximaApertura(t0) {
    for (var i = 0; i <= 7; i++) {
      var t = turno(mediodia(t0, i));
      if (t && t.abre > t0) return t.abre;
    }
    return null;
  }

  function estado(t0) {
    // Revisa el turno de ayer (por si cruza medianoche) y el de hoy.
    for (var i = -1; i <= 0; i++) {
      var t = turno(mediodia(t0, i));
      if (t && t0 >= t.abre && t0 < t.cierra) {
        var restante = t.cierra - t0;
        if (restante <= CONFIG.minutosAntes * 60000) return { modo: 'aviso', restante: restante };
        return { modo: 'abierto' };
      }
    }
    return { modo: 'cerrado', proxima: proximaApertura(t0) };
  }

  function hora12(d) {
    var h = d.getHours(), m = d.getMinutes();
    var sufijo = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + sufijo;
  }

  function textoProxima(d, t0) {
    if (!d) return '';
    var dias = Math.round((mediodia(d, 0) - mediodia(t0, 0)) / 86400000);
    var cuando = dias === 0 ? 'hoy' : dias === 1 ? 'mañana' : 'el ' + NOMBRES[d.getDay()];
    return 'Te esperamos ' + cuando + ' a las ' + hora12(d);
  }

  function mmss(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(s / 60);
    s = s % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  var CSS =
    '#jp-cierre{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;overflow:hidden;' +
      'background:radial-gradient(circle at 50% 40%,#7a1d0e 0%,#2a0805 55%,#0d0201 100%);color:#fff7e8;' +
      'font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-align:center;' +
      'opacity:0;visibility:hidden;transition:opacity .8s ease,visibility 0s linear .8s}' +
    '#jp-cierre.jp-on{opacity:1;visibility:visible;transition:opacity .8s ease}' +
    '#jp-cierre .jp-rayos{position:absolute;left:50%;top:40%;width:200vmax;height:200vmax;margin:-100vmax 0 0 -100vmax;' +
      'background:repeating-conic-gradient(rgba(255,150,50,.07) 0deg 10deg,transparent 10deg 20deg);animation:jp-girar 60s linear infinite}' +
    '#jp-cierre .jp-caja{position:relative;padding:4vmin}' +
    '#jp-cierre.jp-on .jp-caja{animation:jp-entrada 1s cubic-bezier(.2,1.4,.4,1) both}' +
    '#jp-cierre .jp-pizza{font-size:18vmin;line-height:1;display:inline-block;animation:jp-girar 8s linear infinite;' +
      'filter:drop-shadow(0 0 3vmin rgba(255,160,40,.6))}' +
    '#jp-cierre .jp-titulo{margin:2vmin 0 1vmin;font-size:9vmin;font-weight:900;letter-spacing:.02em;text-transform:uppercase;color:#ffd166;' +
      'text-shadow:0 0 2vmin rgba(255,120,0,.8),0 .6vmin 0 #b23a00;animation:jp-latido 1.6s ease-in-out infinite}' +
    '#jp-cierre .jp-sub{margin:0 0 4vmin;font-size:4.2vmin;opacity:.92}' +
    '#jp-cierre .jp-reloj{position:relative;width:34vmin;height:34vmin;margin:0 auto}' +
    '#jp-cierre .jp-reloj svg{width:100%;height:100%;transform:rotate(-90deg)}' +
    '#jp-cierre .jp-pista{fill:none;stroke:rgba(255,255,255,.12);stroke-width:8}' +
    '#jp-cierre .jp-progreso{fill:none;stroke:#ffb703;stroke-width:8;stroke-linecap:round;transition:stroke-dashoffset 1s linear,stroke .5s}' +
    '#jp-cierre .jp-tiempo{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;' +
      'font-size:9vmin;font-weight:800;font-variant-numeric:tabular-nums}' +
    '#jp-cierre.jp-urgente .jp-progreso{stroke:#ff4d2e}' +
    '#jp-cierre.jp-urgente .jp-titulo{animation-duration:.6s;color:#ff8a5c}' +
    '#jp-cierre.jp-urgente .jp-tiempo{animation:jp-latido .6s ease-in-out infinite;color:#ffb199}' +
    '#jp-cierre.jp-cerrado .jp-reloj{display:none}' +
    '#jp-cierre.jp-cerrado .jp-pizza{animation-duration:30s}' +
    '#jp-cierre.jp-cerrado .jp-titulo{animation:jp-flotar 4s ease-in-out infinite}' +
    '#jp-cierre .jp-brasa{position:absolute;bottom:-2vmin;width:1vmin;height:1vmin;border-radius:50%;background:#ffb347;' +
      'box-shadow:0 0 1.5vmin #ff7b00;opacity:0;animation:jp-subir linear infinite}' +
    '@keyframes jp-girar{to{transform:rotate(360deg)}}' +
    '@keyframes jp-latido{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}' +
    '@keyframes jp-flotar{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5vmin)}}' +
    '@keyframes jp-entrada{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}' +
    '@keyframes jp-subir{0%{transform:translateY(0);opacity:0}10%{opacity:1}100%{transform:translateY(-110vh);opacity:0}}' +

    // ---- Tema Halloween ----
    '#jp-cierre .jp-deco{display:none}' +
    '#jp-cierre.jp-halloween .jp-deco{display:block}' +
    '#jp-cierre.jp-halloween{background:radial-gradient(circle at 50% 45%,#3b1460 0%,#1a0830 50%,#07020d 100%);color:#f3e9ff}' +
    '#jp-cierre.jp-halloween .jp-rayos{background:repeating-conic-gradient(rgba(255,122,0,.06) 0deg 10deg,transparent 10deg 20deg)}' +
    '#jp-cierre .jp-luna{position:absolute;top:6vmin;right:8vmin;width:20vmin;height:20vmin;border-radius:50%;opacity:.9;' +
      'background:radial-gradient(circle at 40% 40%,#fff6d5,#ffd27a 60%,#e8a33a);box-shadow:0 0 8vmin 2vmin rgba(255,200,100,.35)}' +
    '#jp-cierre .jp-niebla{position:absolute;left:0;bottom:-5vh;width:200%;height:35vh;animation:jp-niebla 30s linear infinite alternate;' +
      'background:radial-gradient(ellipse at 20% 100%,rgba(200,190,255,.28),transparent 60%),radial-gradient(ellipse at 55% 100%,rgba(200,190,255,.2),transparent 60%),' +
      'radial-gradient(ellipse at 85% 100%,rgba(200,190,255,.25),transparent 60%)}' +
    '#jp-cierre .jp-arana{position:absolute;top:0;left:12%;width:2px;height:20vh;background:rgba(255,255,255,.35);animation:jp-colgar 6s ease-in-out infinite}' +
    '#jp-cierre .jp-arana span{position:absolute;bottom:-5vmin;left:-3.2vmin;font-size:6.5vmin;line-height:1}' +
    '#jp-cierre .jp-murcielago{position:absolute;left:0;font-size:6vmin;line-height:1;animation:jp-volar linear infinite}' +
    '#jp-cierre .jp-murcielago i{display:inline-block;font-style:normal;animation:jp-aleteo .22s ease-in-out infinite alternate}' +
    '#jp-cierre.jp-halloween .jp-pizza{animation:jp-columpio 2.4s ease-in-out infinite;transform-origin:50% 0;filter:drop-shadow(0 0 4vmin rgba(255,122,0,.85))}' +
    '#jp-cierre.jp-halloween.jp-cerrado .jp-pizza{animation:jp-fantasma 4s ease-in-out infinite;filter:drop-shadow(0 0 4vmin rgba(200,180,255,.75))}' +
    '#jp-cierre.jp-halloween .jp-titulo{font-family:"Creepster",Impact,fantasy;font-weight:400;letter-spacing:.06em;color:#ff7a00;' +
      'text-shadow:0 0 2vmin rgba(255,122,0,.9),0 0 5vmin rgba(150,60,255,.7),0 .5vmin 0 #3a0a00;' +
      'animation:jp-latido 1.6s ease-in-out infinite,jp-parpadeo 5s linear infinite}' +
    '#jp-cierre.jp-halloween.jp-cerrado .jp-titulo{animation:jp-flotar 4s ease-in-out infinite,jp-parpadeo 7s linear infinite}' +
    '#jp-cierre.jp-halloween .jp-progreso{stroke:#ff7a00}' +
    '#jp-cierre.jp-halloween .jp-reloj svg{filter:drop-shadow(0 0 1.5vmin rgba(255,122,0,.8))}' +
    '#jp-cierre.jp-halloween .jp-brasa{background:#ff9a3c;box-shadow:0 0 1.5vmin #ff6a00}' +
    '#jp-cierre.jp-halloween .jp-brasa.jp-alt{background:#c9a6ff;box-shadow:0 0 1.5vmin #8a4dff}' +
    '#jp-cierre.jp-halloween.jp-urgente .jp-titulo{color:#ff4a3d;animation-duration:.6s,2s;' +
      'text-shadow:0 0 2vmin rgba(255,60,40,.95),0 0 6vmin rgba(255,0,0,.7),0 .5vmin 0 #3a0000}' +
    '#jp-cierre.jp-halloween.jp-urgente .jp-progreso{stroke:#ff3030}' +
    '#jp-cierre.jp-halloween.jp-urgente .jp-reloj svg{filter:drop-shadow(0 0 2vmin rgba(255,30,30,.9))}' +
    '@keyframes jp-columpio{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}' +
    '@keyframes jp-fantasma{0%,100%{transform:translateY(0) rotate(-4deg);opacity:.85}50%{transform:translateY(-3vmin) rotate(4deg);opacity:1}}' +
    '@keyframes jp-parpadeo{0%,88%,90%,94%,100%{opacity:1}89%{opacity:.35}92%{opacity:.55}}' +
    '@keyframes jp-niebla{to{transform:translateX(-50%)}}' +
    '@keyframes jp-colgar{0%,100%{height:12vh}50%{height:32vh}}' +
    '@keyframes jp-aleteo{to{transform:scaleY(.55)}}' +
    '@keyframes jp-volar{0%{transform:translate(-15vw,0)}25%{transform:translate(20vw,-6vh)}50%{transform:translate(50vw,4vh)}' +
      '75%{transform:translate(80vw,-5vh)}100%{transform:translate(115vw,0)}}';

  var raiz, icono, titulo, sub, tiempo, progreso, modoActual, textos, fuenteCargada;

  function construir() {
    var estilo = document.createElement('style');
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    raiz = document.createElement('div');
    raiz.id = 'jp-cierre';
    raiz.setAttribute('aria-live', 'polite');
    raiz.innerHTML =
      '<div class="jp-rayos"></div>' +
      '<div class="jp-deco jp-luna"></div>' +
      '<div class="jp-deco jp-niebla"></div>' +
      '<div class="jp-deco jp-arana"><span>🕷️</span></div>' +
      '<div class="jp-caja">' +
        '<div class="jp-pizza">🍕</div>' +
        '<h1 class="jp-titulo"></h1>' +
        '<p class="jp-sub"></p>' +
        '<div class="jp-reloj">' +
          '<svg viewBox="0 0 120 120"><circle class="jp-pista" cx="60" cy="60" r="52"/>' +
          '<circle class="jp-progreso" cx="60" cy="60" r="52"/></svg>' +
          '<span class="jp-tiempo"></span>' +
        '</div>' +
      '</div>';

    for (var i = 0; i < 30; i++) {
      var b = document.createElement('span');
      b.className = i % 2 ? 'jp-brasa jp-alt' : 'jp-brasa';
      b.style.left = (Math.random() * 100) + '%';
      b.style.animationDuration = (5 + Math.random() * 7) + 's';
      b.style.animationDelay = (-Math.random() * 12) + 's';
      var escala = 0.5 + Math.random() * 1.2;
      b.style.width = b.style.height = escala + 'vmin';
      raiz.appendChild(b);
    }

    var caja = raiz.querySelector('.jp-caja');
    for (var j = 0; j < 6; j++) {
      var m = document.createElement('span');
      m.className = 'jp-deco jp-murcielago';
      m.innerHTML = '<i>🦇</i>';
      m.style.top = (5 + Math.random() * 55) + '%';
      m.style.fontSize = (4 + Math.random() * 4) + 'vmin';
      m.style.animationDuration = (9 + Math.random() * 8) + 's';
      m.style.animationDelay = (-Math.random() * 17) + 's';
      if (j % 2) m.style.animationDirection = 'reverse';
      raiz.insertBefore(m, caja);
    }

    document.body.appendChild(raiz);
    icono = raiz.querySelector('.jp-pizza');
    titulo = raiz.querySelector('.jp-titulo');
    sub = raiz.querySelector('.jp-sub');
    tiempo = raiz.querySelector('.jp-tiempo');
    progreso = raiz.querySelector('.jp-progreso');
    progreso.style.strokeDasharray = CIRCUNFERENCIA;
  }

  function actualizar() {
    var t0 = ahora();
    var e = estado(t0);
    var visible = e.modo === 'aviso' || (e.modo === 'cerrado' && CONFIG.mostrarCerrado);

    if (e.modo !== modoActual) {
      modoActual = e.modo;
      var tema = temaActivo();
      textos = TEXTOS[tema];
      if (tema === 'halloween') cargarFuente();
      raiz.className = 'jp-' + tema + (e.modo === 'cerrado' ? ' jp-cerrado' : '');
      if (e.modo === 'aviso') {
        icono.textContent = textos.iconoAviso;
        titulo.textContent = '¡Estamos por cerrar!';
        sub.textContent = textos.subAviso;
      } else if (e.modo === 'cerrado') {
        icono.textContent = textos.iconoCerrado;
      }
      // Forzar reflow para que la animación de entrada se repita al cambiar de modo.
      void raiz.offsetWidth;
    }

    if (e.modo === 'aviso') {
      var total = CONFIG.minutosAntes * 60000;
      tiempo.textContent = mmss(e.restante);
      progreso.style.strokeDashoffset = CIRCUNFERENCIA * (1 - e.restante / total);
      raiz.classList.toggle('jp-urgente', e.restante <= 60000);
    } else if (e.modo === 'cerrado') {
      var abreHoy = e.proxima && e.proxima.toDateString() === t0.toDateString();
      titulo.textContent = abreHoy ? 'Cerrado' : 'Cerrado por hoy';
      sub.textContent = textos.gracias + ' ' + textoProxima(e.proxima, t0);
    }

    raiz.classList.toggle('jp-on', visible);
  }

  // Fuente "Creepster" de Google Fonts para el título de Halloween (si no carga, usa Impact).
  function cargarFuente() {
    if (fuenteCargada) return;
    fuenteCargada = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Creepster&display=swap';
    document.head.appendChild(link);
  }

  function prepararDemo() {
    var m = /[?&]demo=(aviso|cerrado)/.exec(location.search);
    if (!m) return;
    var t0 = new Date();
    var t = null;
    for (var i = -1; i <= 7 && !t; i++) {
      var c = turno(mediodia(t0, i));
      if (c && c.cierra > t0) t = c;
    }
    if (!t) return;
    var objetivo = m[1] === 'aviso'
      ? t.cierra.getTime() - CONFIG.minutosAntes * 60000
      : t.cierra.getTime() + 1000;
    desfase = objetivo - Date.now();
  }

  function iniciar() {
    prepararDemo();
    construir();
    actualizar();
    setInterval(actualizar, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
