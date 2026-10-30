/*
 * Lógica de "Todo en mi Barrio": búsqueda, filtros por categoría,
 * "abierto ahora" y el formulario para sumar negocios por WhatsApp.
 * Los datos se editan en negocios.js.
 */
(function () {
  'use strict';

  var DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  var estado = { categoria: 'todas', texto: '', soloAbiertos: false };

  var $ = function (id) { return document.getElementById(id); };

  function minutos(hora) {
    var p = hora.split(':');
    return Number(p[0]) * 60 + Number(p[1]);
  }

  // Quita acentos y pasa a minúsculas para que "barberia" encuentre "Barbería".
  function normalizar(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function escapar(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Devuelve { abierto, texto } según la hora del dispositivo.
  function estadoHorario(negocio, ahora) {
    var h = negocio.horarios || {};
    var dia = ahora.getDay();
    var min = ahora.getHours() * 60 + ahora.getMinutes();

    // ¿Sigue abierto desde ayer (cierre pasada la medianoche)?
    var ayer = h[DIAS[(dia + 6) % 7]];
    if (ayer && minutos(ayer[1]) < minutos(ayer[0]) && min < minutos(ayer[1])) {
      return { abierto: true, texto: 'Abierto · cierra a las ' + ayer[1] };
    }

    var hoy = h[DIAS[dia]];
    if (hoy) {
      var abre = minutos(hoy[0]);
      var cierra = minutos(hoy[1]);
      var pasaMedianoche = cierra < abre;
      if (min >= abre && (pasaMedianoche || min < cierra)) {
        return { abierto: true, texto: 'Abierto · cierra a las ' + hoy[1] };
      }
      if (min < abre) {
        return { abierto: false, texto: 'Cerrado · abre hoy a las ' + hoy[0] };
      }
    }

    for (var i = 1; i <= 7; i++) {
      var sig = h[DIAS[(dia + i) % 7]];
      if (sig) {
        var cuando = i === 1 ? 'mañana' : 'el ' + DIAS[(dia + i) % 7].replace('miercoles', 'miércoles').replace('sabado', 'sábado');
        return { abierto: false, texto: 'Cerrado · abre ' + cuando + ' a las ' + sig[0] };
      }
    }
    return { abierto: false, texto: 'Cerrado' };
  }

  function coincide(negocio) {
    if (estado.categoria !== 'todas' && negocio.categoria !== estado.categoria) return false;
    if (!estado.texto) return true;
    var cat = CATEGORIAS[negocio.categoria];
    var pajar = normalizar([
      negocio.nombre, negocio.descripcion, negocio.direccion,
      cat ? cat.nombre : '', (negocio.etiquetas || []).join(' ')
    ].join(' '));
    return normalizar(estado.texto).split(/\s+/).every(function (palabra) {
      return pajar.indexOf(palabra) !== -1;
    });
  }

  function tarjeta(negocio, horario) {
    var cat = CATEGORIAS[negocio.categoria] || { nombre: negocio.categoria, icono: '🏪' };
    var mensaje = encodeURIComponent('Hola ' + negocio.nombre + ', te vi en Todo en mi Barrio 👋');
    var mapa = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(negocio.direccion + ', ' + BARRIO.nombre);
    var etiquetas = (negocio.etiquetas || []).map(function (e) {
      return '<span>#' + escapar(e) + '</span>';
    }).join('');

    return '<article class="negocio">' +
      '<header><div class="icono" aria-hidden="true">' + cat.icono + '</div>' +
      '<div><h3>' + escapar(negocio.nombre) + '</h3><div class="cat">' + escapar(cat.nombre) + '</div></div></header>' +
      '<p>' + escapar(negocio.descripcion) + '</p>' +
      '<p class="estado ' + (horario.abierto ? 'si' : 'no') + '">' + (horario.abierto ? '🟢 ' : '🔴 ') + horario.texto + '</p>' +
      '<p class="dato">📍 ' + escapar(negocio.direccion) + '</p>' +
      (etiquetas ? '<div class="etiquetas">' + etiquetas + '</div>' : '') +
      '<div class="acciones">' +
        '<a class="btn-wa" href="https://wa.me/' + escapar(negocio.whatsapp) + '?text=' + mensaje + '" target="_blank" rel="noopener">WhatsApp</a>' +
        '<a class="btn-mapa" href="' + mapa + '" target="_blank" rel="noopener">Cómo llegar</a>' +
      '</div>' +
    '</article>';
  }

  function pintar() {
    var ahora = new Date();
    var visibles = NEGOCIOS.map(function (n) {
      return { negocio: n, horario: estadoHorario(n, ahora) };
    }).filter(function (x) {
      return coincide(x.negocio) && (!estado.soloAbiertos || x.horario.abierto);
    }).sort(function (a, b) {
      // Primero los abiertos, luego por nombre.
      return (b.horario.abierto - a.horario.abierto) || a.negocio.nombre.localeCompare(b.negocio.nombre, 'es');
    });

    $('lista').innerHTML = visibles.map(function (x) { return tarjeta(x.negocio, x.horario); }).join('');
    $('vacio').hidden = visibles.length > 0;
    $('contador').textContent = visibles.length === 1 ? '1 negocio' : visibles.length + ' negocios';
  }

  function pintarChips() {
    var opciones = [['todas', '🏘️', 'Todo']].concat(Object.keys(CATEGORIAS).map(function (k) {
      return [k, CATEGORIAS[k].icono, CATEGORIAS[k].nombre];
    }));
    $('chips').innerHTML = opciones.map(function (o) {
      return '<button type="button" class="chip" data-cat="' + o[0] + '" aria-pressed="' + (o[0] === estado.categoria) + '">' +
        '<span aria-hidden="true">' + o[1] + '</span>' + escapar(o[2]) + '</button>';
    }).join('');
  }

  function iniciarFormulario() {
    $('sel-categoria').innerHTML = Object.keys(CATEGORIAS).map(function (k) {
      return '<option value="' + k + '">' + CATEGORIAS[k].icono + ' ' + escapar(CATEGORIAS[k].nombre) + '</option>';
    }).join('') + '<option value="otra">Otra</option>';

    $('form-sumate').addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(e.target);
      var cat = CATEGORIAS[d.get('categoria')];
      var texto = [
        '¡Hola! Quiero sumar mi negocio a Todo en mi Barrio:',
        '• Nombre: ' + d.get('nombre'),
        '• Categoría: ' + (cat ? cat.nombre : 'Otra'),
        '• Qué ofrece: ' + d.get('descripcion'),
        '• Dirección: ' + d.get('direccion'),
        '• WhatsApp: ' + d.get('whatsapp'),
        '• Horario: ' + (d.get('horario') || 'por confirmar')
      ].join('\n');
      window.open('https://wa.me/' + BARRIO.whatsappAdmin + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    });
  }

  function iniciar() {
    $('nombre-barrio').textContent = BARRIO.nombre;
    $('lema').textContent = BARRIO.lema;
    Array.prototype.forEach.call(document.querySelectorAll('.nombre-barrio'), function (el) {
      el.textContent = BARRIO.nombre;
    });

    pintarChips();
    iniciarFormulario();
    pintar();

    $('chips').addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      estado.categoria = chip.getAttribute('data-cat');
      Array.prototype.forEach.call(this.children, function (c) {
        c.setAttribute('aria-pressed', c === chip);
      });
      pintar();
    });
    $('buscar').addEventListener('input', function () {
      estado.texto = this.value.trim();
      pintar();
    });
    $('solo-abiertos').addEventListener('change', function () {
      estado.soloAbiertos = this.checked;
      pintar();
    });

    // Refresca "abierto/cerrado" cada minuto por si la página queda abierta.
    setInterval(pintar, 60000);
  }

  iniciar();
})();
