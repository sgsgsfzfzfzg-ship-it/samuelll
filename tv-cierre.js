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
    mostrarCerrado: true
  };

  var DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  var NOMBRES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var CIRCUNFERENCIA = 2 * Math.PI * 52;

  var desfase = 0; // solo se usa en modo demo
  function ahora() { return new Date(Date.now() + desfase); }

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
    '@keyframes jp-subir{0%{transform:translateY(0);opacity:0}10%{opacity:1}100%{transform:translateY(-110vh);opacity:0}}';

  var raiz, titulo, sub, tiempo, progreso, modoActual;

  function construir() {
    var estilo = document.createElement('style');
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    raiz = document.createElement('div');
    raiz.id = 'jp-cierre';
    raiz.setAttribute('aria-live', 'polite');
    raiz.innerHTML =
      '<div class="jp-rayos"></div>' +
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
      b.className = 'jp-brasa';
      b.style.left = (Math.random() * 100) + '%';
      b.style.animationDuration = (5 + Math.random() * 7) + 's';
      b.style.animationDelay = (-Math.random() * 12) + 's';
      var escala = 0.5 + Math.random() * 1.2;
      b.style.width = b.style.height = escala + 'vmin';
      raiz.appendChild(b);
    }

    document.body.appendChild(raiz);
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
      raiz.className = '';
      if (e.modo === 'aviso') {
        titulo.textContent = '¡Estamos por cerrar!';
        sub.textContent = 'Últimos pedidos — haz el tuyo ya';
      } else if (e.modo === 'cerrado') {
        raiz.className = 'jp-cerrado';
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
      sub.textContent = '¡Gracias por tu preferencia! ' + textoProxima(e.proxima, t0);
    }

    raiz.classList.toggle('jp-on', visible);
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
