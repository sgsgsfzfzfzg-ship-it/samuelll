/*
 * Lógica de "Barrio": portada, tiendas, búsqueda, carrito, pedidos y reservas.
 * Los datos se editan en negocios.js.
 *
 * No necesita servidor: el carrito, la dirección y los pedidos se guardan en el navegador
 * del cliente, y cada pedido o reserva se le envía a la tienda por WhatsApp.
 *
 * Rutas (después del #, solo letras, números y guiones para que funcionen en cualquier enlace):
 *   inicio            portada
 *   tienda-<id>       tienda o servicio
 *   categoria-<id>    tiendas y productos de una categoría
 *   buscar            resultados de lo escrito en el buscador
 *   ofertas           todas las ofertas
 *   carrito           carrito y pago
 *   pedidos           mis pedidos
 *   pedido-<id>       pedido recién hecho: enviar a cada tienda
 */
(function () {
  'use strict';

  var DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  var NOMBRE_DIA = { miercoles: 'miércoles', sabado: 'sábado' };

  var $ = function (id) { return document.getElementById(id); };
  var vista = $('vista');

  // ---------- Utilidades ----------

  function leer(clave, porDefecto) {
    try {
      var v = localStorage.getItem('barrio.' + clave);
      return v ? JSON.parse(v) : porDefecto;
    } catch (e) { return porDefecto; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem('barrio.' + clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
  }

  function escapar(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Quita acentos y pasa a minúsculas para que "barberia" encuentre "Barbería".
  function normalizar(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // Formato colombiano: $12.000 (punto para miles; coma para decimales si BARRIO.decimales > 0).
  function dinero(n) {
    var partes = Number(n).toFixed(BARRIO.decimales || 0).split('.');
    return BARRIO.moneda + partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (partes[1] ? ',' + partes[1] : '');
  }

  function minutos(hora) {
    var p = hora.split(':');
    return Number(p[0]) * 60 + Number(p[1]);
  }

  function estrellas(r, resenas) {
    return '<span class="estrellas" title="' + r + ' de 5"><span class="e-fondo">★★★★★</span>' +
      '<span class="e-lleno" style="width:' + (r / 5 * 100) + '%">★★★★★</span></span>' +
      ' <span class="e-num">' + r.toFixed(1) + (resenas ? ' <span class="suave">(' + resenas + ')</span>' : '') + '</span>';
  }

  function descuento(p) {
    return p.antes > p.precio ? Math.round((1 - p.precio / p.antes) * 100) : 0;
  }

  function wa(numero, texto) {
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
  }

  var tiempoToast;
  function toast(texto) {
    var t = $('toast');
    t.textContent = texto;
    t.classList.add('visible');
    clearTimeout(tiempoToast);
    tiempoToast = setTimeout(function () { t.classList.remove('visible'); }, 1800);
  }

  // ---------- Datos ----------

  var TIENDAS = {};
  var PRODUCTOS = {}; // 'tienda:producto' -> { p, t, key }
  NEGOCIOS.forEach(function (t) {
    TIENDAS[t.id] = t;
    t.productos.forEach(function (p) {
      var key = t.id + ':' + p.id;
      PRODUCTOS[key] = { p: p, t: t, key: key };
    });
  });
  var TODOS = Object.keys(PRODUCTOS).map(function (k) { return PRODUCTOS[k]; });

  // Devuelve { abierto, texto } según la hora del dispositivo.
  function horario(t, ahora) {
    ahora = ahora || new Date();
    var h = t.horarios || {};
    var dia = ahora.getDay();
    var min = ahora.getHours() * 60 + ahora.getMinutes();

    // ¿Sigue abierto desde ayer (cierre pasada la medianoche)?
    var ayer = h[DIAS[(dia + 6) % 7]];
    if (ayer && minutos(ayer[1]) < minutos(ayer[0]) && min < minutos(ayer[1])) {
      return { abierto: true, texto: 'Abierto hasta las ' + ayer[1] };
    }
    var hoy = h[DIAS[dia]];
    if (hoy) {
      var abre = minutos(hoy[0]), cierra = minutos(hoy[1]);
      if (min >= abre && (cierra < abre || min < cierra)) return { abierto: true, texto: 'Abierto hasta las ' + hoy[1] };
      if (min < abre) return { abierto: false, texto: 'Abre hoy a las ' + hoy[0] };
    }
    for (var i = 1; i <= 7; i++) {
      var nombre = DIAS[(dia + i) % 7];
      if (h[nombre]) {
        return { abierto: false, texto: 'Abre ' + (i === 1 ? 'mañana' : 'el ' + (NOMBRE_DIA[nombre] || nombre)) + ' a las ' + h[nombre][0] };
      }
    }
    return { abierto: false, texto: 'Cerrado' };
  }

  // ---------- Estado guardado ----------

  var carrito = leer('carrito', {});     // { 'tienda:producto': cantidad }
  var pedidos = leer('pedidos', []);     // más reciente primero
  var vistos = leer('vistos', []);       // claves de productos vistos
  var cliente = leer('cliente', { nombre: '', telefono: '', direccion: '', referencia: '' });

  // Limpia productos que ya no existen en negocios.js.
  Object.keys(carrito).forEach(function (k) { if (!PRODUCTOS[k]) delete carrito[k]; });
  vistos = vistos.filter(function (k) { return PRODUCTOS[k]; });

  function cantidad(key) { return carrito[key] || 0; }

  function cambiarCarrito(key, delta) {
    var n = Math.max(0, cantidad(key) + delta);
    if (n) carrito[key] = n; else delete carrito[key];
    guardar('carrito', carrito);
    actualizarCarritoUI();
    Array.prototype.forEach.call(document.querySelectorAll('[data-boton="' + key + '"]'), function (el) {
      el.outerHTML = botonAgregar(key, el.classList.contains('grande'));
    });
    if (rutaActual().vista === 'carrito') pintar();
  }

  function resumenCarrito() {
    var grupos = {};
    Object.keys(carrito).forEach(function (k) {
      var x = PRODUCTOS[k];
      var g = grupos[x.t.id] || (grupos[x.t.id] = { t: x.t, items: [], subtotal: 0 });
      g.items.push({ x: x, cant: carrito[k] });
      g.subtotal += x.p.precio * carrito[k];
    });
    var lista = Object.keys(grupos).map(function (id) {
      var g = grupos[id];
      g.envio = g.t.envio || 0;
      return g;
    });
    var unidades = 0, total = 0;
    lista.forEach(function (g) {
      g.items.forEach(function (i) { unidades += i.cant; });
      total += g.subtotal + g.envio;
    });
    return { grupos: lista, unidades: unidades, total: total };
  }

  function actualizarCarritoUI() {
    var r = resumenCarrito();
    Array.prototype.forEach.call(document.querySelectorAll('.badge-carrito'), function (b) {
      b.textContent = r.unidades;
      b.hidden = !r.unidades;
    });
    var barra = $('barra-carrito');
    var ocultar = !r.unidades || ['carrito', 'pedido'].indexOf(rutaActual().vista) !== -1;
    barra.hidden = ocultar;
    document.body.classList.toggle('con-barra', !ocultar);
    if (!ocultar) {
      barra.innerHTML = '<span class="bc-num">' + r.unidades + '</span><span>Ver carrito</span><strong>' + dinero(r.total) + '</strong>';
    }
  }

  function marcarVisto(key) {
    vistos = [key].concat(vistos.filter(function (k) { return k !== key; })).slice(0, 12);
    guardar('vistos', vistos);
  }

  // ---------- Piezas de interfaz ----------

  function visual(cosa, clase) {
    if (cosa.foto) return '<div class="' + clase + '"><img src="' + escapar(cosa.foto) + '" alt="" loading="lazy"></div>';
    return '<div class="' + clase + '" aria-hidden="true">' + cosa.emoji + '</div>';
  }

  function botonAgregar(key, grande) {
    var x = PRODUCTOS[key];
    var clase = 'boton-agregar' + (grande ? ' grande' : '');
    if (x.t.tipo === 'servicio') {
      return '<button type="button" class="' + clase + ' reservar" data-boton="' + key + '" data-accion="ver" data-key="' + key + '">Reservar</button>';
    }
    var n = cantidad(key);
    if (!n) {
      return '<button type="button" class="' + clase + '" data-boton="' + key + '" data-accion="mas" data-key="' + key + '">' +
        (grande ? 'Agregar al carrito' : '+ Agregar') + '</button>';
    }
    return '<div class="' + clase + ' paso" data-boton="' + key + '">' +
      '<button type="button" data-accion="menos" data-key="' + key + '" aria-label="Quitar uno">' + (n === 1 ? '🗑' : '−') + '</button>' +
      '<span>' + n + '</span>' +
      '<button type="button" data-accion="mas" data-key="' + key + '" aria-label="Agregar uno">+</button></div>';
  }

  function precioHTML(p) {
    var d = descuento(p);
    return '<span class="precio">' + dinero(p.precio) + '</span>' +
      (d ? ' <s class="antes">' + dinero(p.antes) + '</s>' : '');
  }

  // Tarjeta vertical de producto (carruseles y cuadrículas).
  function tarjetaProducto(x, extra) {
    var p = x.p, d = descuento(p);
    return '<article class="prod">' +
      '<button type="button" class="prod-abrir" data-accion="ver" data-key="' + x.key + '">' +
        visual(p, 'prod-img') +
        (d ? '<span class="sello">-' + d + '%</span>' : '') +
        (extra || '') +
        '<span class="prod-nombre">' + escapar(p.nombre) + '</span>' +
        '<span class="prod-tienda">' + escapar(x.t.nombre) + '</span>' +
        '<span class="prod-rating">' + estrellas(x.t.rating) + '</span>' +
        '<span class="prod-precio">' + precioHTML(p) + '</span>' +
      '</button>' +
      botonAgregar(x.key) +
    '</article>';
  }

  // Fila horizontal de producto (menú de la tienda).
  function filaProducto(x) {
    var p = x.p;
    return '<article class="fila-prod">' +
      '<button type="button" class="fila-info" data-accion="ver" data-key="' + x.key + '">' +
        '<strong>' + escapar(p.nombre) + '</strong>' +
        '<span class="suave">' + escapar(p.descripcion) + '</span>' +
        (p.duracion ? '<span class="suave">⏱ ' + escapar(p.duracion) + '</span>' : '') +
        '<span>' + precioHTML(p) + (descuento(p) ? ' <span class="sello-mini">-' + descuento(p) + '%</span>' : '') + '</span>' +
      '</button>' +
      '<div class="fila-lado">' + visual(p, 'fila-img') + botonAgregar(x.key) + '</div>' +
    '</article>';
  }

  function tarjetaTienda(t) {
    var h = horario(t);
    var cat = CATEGORIAS[t.categoria] || { nombre: '' };
    var entrega = t.tipo === 'servicio' ? '📅 Reserva tu cita'
      : '🛵 ' + escapar(t.tiempo) + ' · ' + (t.envio ? 'Domicilio ' + dinero(t.envio) : '<b class="gratis">Domicilio gratis</b>');
    return '<a class="tienda' + (h.abierto ? '' : ' cerrada') + '" href="#tienda-' + t.id + '">' +
      '<div class="tienda-portada" style="--c:' + t.color + '">' +
        (t.foto ? '<img src="' + escapar(t.foto) + '" alt="" loading="lazy">' : '<span aria-hidden="true">' + t.emoji + '</span>') +
        (h.abierto ? '' : '<em>' + escapar(h.texto) + '</em>') +
      '</div>' +
      '<div class="tienda-info">' +
        '<strong>' + escapar(t.nombre) + '</strong>' +
        '<span class="suave">' + escapar(cat.nombre) + ' · ' + estrellas(t.rating, t.resenas) + '</span>' +
        '<span class="suave">' + entrega + '</span>' +
      '</div></a>';
  }

  function seccion(titulo, contenido, enlace) {
    return '<section class="bloque"><div class="bloque-tit"><h2>' + titulo + '</h2>' +
      (enlace ? '<a href="' + enlace + '">Ver todo</a>' : '') + '</div>' + contenido + '</section>';
  }

  function carrusel(html) { return '<div class="carrusel">' + html + '</div>'; }

  function chipsCategorias(activa) {
    return '<div class="cats">' + Object.keys(CATEGORIAS).map(function (k) {
      var c = CATEGORIAS[k];
      return '<a class="cat' + (k === activa ? ' activa' : '') + '" href="#categoria-' + k + '">' +
        '<span class="cat-ico" aria-hidden="true">' + c.icono + '</span>' + escapar(c.nombre) + '</a>';
    }).join('') + '</div>';
  }

  function porVendidos(a, b) { return b.p.vendidos - a.p.vendidos; }

  // Ordena: primero tiendas abiertas, luego mejor calificadas.
  function tiendasOrdenadas(lista) {
    return lista.map(function (t) { return { t: t, abierto: horario(t).abierto }; })
      .sort(function (a, b) { return (b.abierto - a.abierto) || (b.t.rating - a.t.rating); })
      .map(function (x) { return x.t; });
  }

  // ---------- Vistas ----------

  function vistaInicio() {
    var hora = new Date().getHours();
    var saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';
    var nombre = cliente.nombre ? ', ' + escapar(cliente.nombre.split(' ')[0]) : '';

    var banners = '<div class="banners">' + BANNERS.map(function (b) {
      return '<a class="banner" href="' + b.destino + '" style="--c:' + b.color + '">' +
        '<div><strong>' + escapar(b.titulo) + '</strong><span>' + escapar(b.texto) + '</span><em>Pedir ahora →</em></div>' +
        '<span class="banner-emoji" aria-hidden="true">' + b.emoji + '</span></a>';
    }).join('') + '</div>';

    var ofertas = TODOS.filter(function (x) { return descuento(x.p); })
      .sort(function (a, b) { return descuento(b.p) - descuento(a.p); });

    var masPedidos = TODOS.filter(function (x) { return x.t.tipo === 'tienda'; }).sort(porVendidos).slice(0, 10);
    var servicios = TODOS.filter(function (x) { return x.t.tipo === 'servicio'; }).sort(porVendidos).slice(0, 8);

    var repetir = pedidos.length ? seccion('🔁 Pide de nuevo', carrusel(pedidos.slice(0, 5).map(tarjetaRepetir).join(''))) : '';
    var vistosHTML = vistos.length > 1 ? seccion('👀 Visto recientemente',
      carrusel(vistos.map(function (k) { return tarjetaProducto(PRODUCTOS[k]); }).join(''))) : '';

    return '<h1 class="saludo">' + saludo + nombre + ' 👋<small>¿Qué necesitas hoy en ' + escapar(BARRIO.nombre) + '?</small></h1>' +
      chipsCategorias() +
      banners +
      repetir +
      (ofertas.length ? seccion('⚡ Ofertas del día <span class="cuenta" id="cuenta"></span>',
        carrusel(ofertas.map(function (x) { return tarjetaProducto(x); }).join('')), '#ofertas') : '') +
      seccion('🏪 Tiendas cerca de ti', '<div class="grid-tiendas">' +
        tiendasOrdenadas(NEGOCIOS.filter(function (t) { return t.tipo === 'tienda'; })).map(tarjetaTienda).join('') + '</div>') +
      seccion('🔥 Lo más pedido en el barrio', carrusel(masPedidos.map(function (x, i) {
        return tarjetaProducto(x, '<span class="top">#' + (i + 1) + '</span>');
      }).join(''))) +
      seccion('📅 Reserva servicios', '<div class="grid-tiendas">' +
        tiendasOrdenadas(NEGOCIOS.filter(function (t) { return t.tipo === 'servicio'; })).map(tarjetaTienda).join('') + '</div>') +
      seccion('✂️ Servicios más reservados', carrusel(servicios.map(function (x) { return tarjetaProducto(x); }).join(''))) +
      vistosHTML +
      vistaVende();
  }

  function tarjetaRepetir(pedido) {
    var nombres = pedido.grupos.map(function (g) { return g.tienda; }).join(', ');
    var emojis = pedido.grupos.map(function (g) { return TIENDAS[g.id] ? TIENDAS[g.id].emoji : '🏪'; }).join('');
    return '<article class="prod repetir"><div class="prod-img" aria-hidden="true">' + emojis + '</div>' +
      '<span class="prod-nombre">' + escapar(nombres) + '</span>' +
      '<span class="prod-tienda">' + escapar(new Date(pedido.fecha).toLocaleDateString('es')) + ' · ' + dinero(pedido.total) + '</span>' +
      '<button type="button" class="boton-agregar" data-accion="repetir" data-id="' + pedido.id + '">Pedir de nuevo</button></article>';
  }

  function vistaVende() {
    var opciones = Object.keys(CATEGORIAS).map(function (k) {
      return '<option value="' + escapar(CATEGORIAS[k].nombre) + '">' + CATEGORIAS[k].icono + ' ' + escapar(CATEGORIAS[k].nombre) + '</option>';
    }).join('') + '<option>Otra</option>';
    return '<section class="vende" id="vende">' +
      '<h2>¿Tienes un negocio? Vende en Barrio 🚀</h2>' +
      '<p class="suave">Llega a todos los vecinos. Llena esto y te escribimos por WhatsApp.</p>' +
      '<form id="form-vende" class="form">' +
        '<label>Nombre del negocio <input name="nombre" required></label>' +
        '<label>Categoría <select name="categoria">' + opciones + '</select></label>' +
        '<label class="ancho">¿Qué vendes u ofreces? <textarea name="descripcion" rows="2" required></textarea></label>' +
        '<label>Dirección <input name="direccion" required></label>' +
        '<label>WhatsApp <input name="whatsapp" type="tel" inputmode="tel" required></label>' +
        '<a class="btn-wa ancho" data-wa-form href="#" target="_blank" rel="noopener">💬 Quiero vender en Barrio</a>' +
      '</form></section>';
  }

  function vistaTienda(id) {
    var t = TIENDAS[id];
    if (!t) return vistaNoEncontrado();
    var h = horario(t);
    var cat = CATEGORIAS[t.categoria] || { nombre: '' };
    var secciones = [];
    var porSeccion = {};
    t.productos.forEach(function (p) {
      if (!porSeccion[p.seccion]) { porSeccion[p.seccion] = []; secciones.push(p.seccion); }
      porSeccion[p.seccion].push(PRODUCTOS[t.id + ':' + p.id]);
    });
    var destacados = t.productos.map(function (p) { return PRODUCTOS[t.id + ':' + p.id]; }).sort(porVendidos).slice(0, 3);
    var mapa = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(t.direccion + ', ' + BARRIO.nombre);

    return '<div class="t-portada" style="--c:' + t.color + '">' +
        (t.foto ? '<img src="' + escapar(t.foto) + '" alt="">' : '<span aria-hidden="true">' + t.emoji + '</span>') +
        '<a class="volver" href="#inicio" aria-label="Volver">←</a></div>' +
      '<div class="t-cabeza">' +
        '<h1>' + escapar(t.nombre) + '</h1>' +
        '<p class="suave">' + escapar(t.descripcion) + '</p>' +
        '<p>' + estrellas(t.rating, t.resenas) + ' · ' + escapar(cat.nombre) + '</p>' +
        '<div class="t-datos">' +
          '<span class="' + (h.abierto ? 'abierto' : 'cerrado') + '">' + (h.abierto ? '🟢 ' : '🔴 ') + escapar(h.texto) + '</span>' +
          (t.tipo === 'servicio' ? '<span>📅 Atención con cita</span>'
            : '<span>🛵 ' + escapar(t.tiempo) + '</span><span>' + (t.envio ? 'Domicilio ' + dinero(t.envio) : '<b class="gratis">Domicilio gratis</b>') + '</span>') +
        '</div>' +
        '<div class="t-acciones">' +
          '<a href="' + wa(t.whatsapp, 'Hola ' + t.nombre + ', te escribo desde Barrio 👋') + '" target="_blank" rel="noopener">💬 Escribir</a>' +
          '<a href="' + mapa + '" target="_blank" rel="noopener">📍 ' + escapar(t.direccion) + '</a>' +
        '</div>' +
        (h.abierto ? '' : '<p class="aviso">Ahora está cerrado. Puedes ' + (t.tipo === 'servicio' ? 'reservar' : 'hacer tu pedido') + ' y te responden cuando abran.</p>') +
      '</div>' +
      (secciones.length > 1 ? '<nav class="t-tabs">' + secciones.map(function (s, i) {
        return '<a href="#" data-accion="ir-seccion" data-i="' + i + '">' + escapar(s) + '</a>';
      }).join('') + '</nav>' : '') +
      seccion('⭐ Los favoritos', carrusel(destacados.map(function (x) { return tarjetaProducto(x); }).join(''))) +
      secciones.map(function (s, i) {
        return '<section class="bloque" id="sec-' + i + '"><h2>' + escapar(s) + '</h2>' +
          porSeccion[s].map(filaProducto).join('') + '</section>';
      }).join('');
  }

  function vistaCategoria(k) {
    var c = CATEGORIAS[k];
    if (!c) return vistaNoEncontrado();
    var tiendas = tiendasOrdenadas(NEGOCIOS.filter(function (t) { return t.categoria === k; }));
    var prods = TODOS.filter(function (x) { return x.t.categoria === k; }).sort(porVendidos);
    return chipsCategorias(k) +
      '<h1 class="tit-pagina">' + c.icono + ' ' + escapar(c.nombre) + '</h1>' +
      seccion(tiendas.length === 1 ? '1 lugar' : tiendas.length + ' lugares', '<div class="grid-tiendas">' + tiendas.map(tarjetaTienda).join('') + '</div>') +
      (prods.length ? seccion('Lo más pedido en ' + escapar(c.nombre.toLowerCase()),
        '<div class="grid-prods">' + prods.map(function (x) { return tarjetaProducto(x); }).join('') + '</div>') : '');
  }

  var filtros = { orden: 'relevancia', abiertos: false };
  var consulta = '';

  function vistaBuscar(q, soloOfertas) {
    var palabras = normalizar(q).split(/\s+/).filter(Boolean);
    function encaja(texto) {
      var n = normalizar(texto);
      return palabras.every(function (w) { return n.indexOf(w) !== -1; });
    }

    var prods = TODOS.filter(function (x) {
      if (soloOfertas) return descuento(x.p);
      var cat = CATEGORIAS[x.t.categoria];
      return encaja([x.p.nombre, x.p.descripcion, x.p.seccion, x.t.nombre, cat ? cat.nombre : ''].join(' '));
    });
    var tiendas = soloOfertas || !palabras.length ? [] : NEGOCIOS.filter(function (t) {
      var cat = CATEGORIAS[t.categoria];
      return encaja([t.nombre, t.descripcion, t.direccion, cat ? cat.nombre : ''].join(' '));
    });
    if (filtros.abiertos) {
      prods = prods.filter(function (x) { return horario(x.t).abierto; });
      tiendas = tiendas.filter(function (t) { return horario(t).abierto; });
    }
    var orden = {
      relevancia: porVendidos,
      menor: function (a, b) { return a.p.precio - b.p.precio; },
      mayor: function (a, b) { return b.p.precio - a.p.precio; },
      rating: function (a, b) { return b.t.rating - a.t.rating; },
      descuento: function (a, b) { return descuento(b.p) - descuento(a.p); }
    };
    prods.sort(orden[filtros.orden]);

    var titulo = soloOfertas ? '⚡ Todas las ofertas' : palabras.length ? 'Resultados para “' + escapar(q) + '”' : 'Explora todo';
    var controles = '<div class="filtros">' +
      '<label>Ordenar <select id="orden">' +
        [['relevancia', 'Más pedidos'], ['menor', 'Precio: menor a mayor'], ['mayor', 'Precio: mayor a menor'],
         ['rating', 'Mejor calificados'], ['descuento', 'Mayor descuento']].map(function (o) {
          return '<option value="' + o[0] + '"' + (filtros.orden === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
        }).join('') +
      '</select></label>' +
      '<label class="check"><input type="checkbox" id="abiertos"' + (filtros.abiertos ? ' checked' : '') + '> Solo abiertos ahora</label></div>';

    if (!prods.length && !tiendas.length) {
      return '<h1 class="tit-pagina">' + titulo + '</h1>' + controles +
        '<div class="vacio"><div>🔍</div><p>No encontramos nada.<br>Prueba con otra palabra o explora las categorías.</p></div>' + chipsCategorias();
    }
    return '<h1 class="tit-pagina">' + titulo + '</h1>' + controles +
      (tiendas.length ? seccion('Tiendas y servicios', '<div class="grid-tiendas">' + tiendas.map(tarjetaTienda).join('') + '</div>') : '') +
      (prods.length ? seccion(prods.length + (prods.length === 1 ? ' producto' : ' productos'),
        '<div class="grid-prods">' + prods.map(function (x) { return tarjetaProducto(x); }).join('') + '</div>') : '');
  }

  function vistaCarrito() {
    var r = resumenCarrito();
    if (!r.unidades) {
      return '<div class="vacio"><div>🛍️</div><h1>Tu carrito está vacío</h1><p>Agrega lo que necesites de las tiendas del barrio.</p>' +
        '<a class="btn-principal" href="#inicio">Explorar tiendas</a></div>';
    }
    var cerradas = r.grupos.filter(function (g) { return !horario(g.t).abierto; });
    var pagos = BARRIO.pagos.map(function (p, i) {
      return '<label class="pago"><input type="radio" name="pago" value="' + escapar(p) + '"' + (i ? '' : ' checked') + '> ' + escapar(p) + '</label>';
    }).join('');

    return '<h1 class="tit-pagina">Tu carrito</h1>' +
      r.grupos.map(function (g) {
        return '<section class="caja-tienda">' +
          '<a class="ct-cabeza" href="#tienda-' + g.t.id + '"><span class="ct-ico" style="--c:' + g.t.color + '">' + g.t.emoji + '</span>' +
            '<strong>' + escapar(g.t.nombre) + '</strong><span class="suave">🛵 ' + escapar(g.t.tiempo) + '</span></a>' +
          g.items.map(function (i) {
            return '<div class="ct-item">' + visual(i.x.p, 'ct-img') +
              '<div class="ct-nombre"><strong>' + escapar(i.x.p.nombre) + '</strong><span>' + dinero(i.x.p.precio) + ' c/u</span></div>' +
              botonAgregar(i.x.key) + '<strong class="ct-total">' + dinero(i.x.p.precio * i.cant) + '</strong></div>';
          }).join('') +
          '<div class="ct-linea"><span>Subtotal</span><span>' + dinero(g.subtotal) + '</span></div>' +
          '<div class="ct-linea"><span>Domicilio</span><span>' + (g.envio ? dinero(g.envio) : '<b class="gratis">Gratis</b>') + '</span></div>' +
        '</section>';
      }).join('') +
      (cerradas.length ? '<p class="aviso">' + cerradas.map(function (g) { return escapar(g.t.nombre); }).join(', ') +
        (cerradas.length === 1 ? ' está cerrada' : ' están cerradas') + ' ahora. Tu pedido les llega y te responden al abrir.</p>' : '') +
      '<form id="form-pedido" class="form caja-pago">' +
        '<h2>Datos de entrega</h2>' +
        '<label>Tu nombre <input name="nombre" required value="' + escapar(cliente.nombre) + '" autocomplete="name"></label>' +
        '<label>Teléfono <input name="telefono" type="tel" inputmode="tel" placeholder="Ej: 300 123 4567" required value="' + escapar(cliente.telefono) + '" autocomplete="tel"></label>' +
        '<label class="ancho">Dirección <input name="direccion" required value="' + escapar(cliente.direccion) + '" placeholder="Ej: Calle 45 # 12-30, apto 201" autocomplete="street-address"></label>' +
        '<label class="ancho">Punto de referencia <input name="referencia" value="' + escapar(cliente.referencia) + '" placeholder="Ej: casa de rejas verdes"></label>' +
        '<fieldset class="ancho"><legend>Forma de pago</legend><div class="pagos">' + pagos + '</div></fieldset>' +
        '<label class="ancho">Nota para la tienda <textarea name="nota" rows="2" placeholder="Ej: sin cebolla, talla M, traer cambio de $50.000"></textarea></label>' +
        '<div class="ancho resumen">' +
          '<div class="ct-linea"><span>Productos (' + r.unidades + ')</span><span>' + dinero(r.total - r.grupos.reduce(function (s, g) { return s + g.envio; }, 0)) + '</span></div>' +
          '<div class="ct-linea"><span>Domicilios</span><span>' + dinero(r.grupos.reduce(function (s, g) { return s + g.envio; }, 0)) + '</span></div>' +
          '<div class="ct-linea total"><span>Total</span><span>' + dinero(r.total) + '</span></div>' +
        '</div>' +
        '<button type="submit" class="btn-principal ancho">Hacer pedido · ' + dinero(r.total) + '</button>' +
        '<p class="suave ancho centro">Tu pedido se envía a cada tienda por WhatsApp. Pagas al recibir.</p>' +
      '</form>';
  }

  function mensajePedido(pedido, g) {
    return [
      '🛵 *Nuevo pedido desde Barrio* (#' + pedido.id + ')',
      '',
      g.items.map(function (i) { return '• ' + i.cant + ' x ' + i.nombre + ' — ' + dinero(i.precio * i.cant); }).join('\n'),
      '',
      'Subtotal: ' + dinero(g.subtotal),
      'Domicilio: ' + (g.envio ? dinero(g.envio) : 'gratis'),
      '*Total: ' + dinero(g.subtotal + g.envio) + '*',
      '',
      '👤 ' + pedido.cliente.nombre + ' · ' + pedido.cliente.telefono,
      '📍 ' + pedido.cliente.direccion + (pedido.cliente.referencia ? ' (' + pedido.cliente.referencia + ')' : ''),
      '💳 Pago: ' + pedido.pago,
      pedido.nota ? '📝 ' + pedido.nota : ''
    ].join('\n').trim();
  }

  function vistaPedido(id) {
    var pedido = pedidos.filter(function (p) { return p.id === id; })[0];
    if (!pedido) return vistaNoEncontrado();
    var faltan = pedido.grupos.filter(function (g) { return !g.enviado; }).length;
    return '<div class="exito"><div class="exito-ico">' + (faltan ? '📲' : '🎉') + '</div>' +
      '<h1>' + (faltan ? 'Último paso: envía tu pedido' : '¡Pedido enviado!') + '</h1>' +
      '<p class="suave">' + (faltan
        ? 'Toca el botón de cada tienda para enviarle tu pedido por WhatsApp. Ellos te confirman y te lo llevan.'
        : 'Las tiendas ya tienen tu pedido. Te escribirán por WhatsApp para confirmar.') + '</p></div>' +
      pedido.grupos.map(function (g) {
        return '<section class="caja-tienda">' +
          '<div class="ct-cabeza"><span class="ct-ico" style="--c:' + (TIENDAS[g.id] ? TIENDAS[g.id].color : '#888') + '">' + (TIENDAS[g.id] ? TIENDAS[g.id].emoji : '🏪') + '</span>' +
          '<strong>' + escapar(g.tienda) + '</strong><span>' + dinero(g.subtotal + g.envio) + '</span></div>' +
          g.items.map(function (i) { return '<div class="ct-linea"><span>' + i.cant + ' × ' + escapar(i.nombre) + '</span><span>' + dinero(i.precio * i.cant) + '</span></div>'; }).join('') +
          '<a class="btn-wa' + (g.enviado ? ' hecho' : '') + '" href="' + wa(g.whatsapp, mensajePedido(pedido, g)) + '" target="_blank" rel="noopener" data-accion="enviado" data-id="' + pedido.id + '" data-tienda="' + g.id + '">' +
            (g.enviado ? '✓ Enviado · enviar otra vez' : '💬 Enviar pedido a ' + escapar(g.tienda)) + '</a>' +
        '</section>';
      }).join('') +
      '<p class="centro"><a href="#pedidos">Ver mis pedidos</a> · <a href="#inicio">Seguir comprando</a></p>';
  }

  function vistaPedidos() {
    if (!pedidos.length) {
      return '<div class="vacio"><div>🧾</div><h1>Aún no tienes pedidos</h1><p>Cuando pidas algo lo verás aquí para repetirlo con un toque.</p>' +
        '<a class="btn-principal" href="#inicio">Empezar a pedir</a></div>';
    }
    return '<h1 class="tit-pagina">Mis pedidos</h1>' + pedidos.map(function (p) {
      return '<article class="caja-tienda pedido">' +
        '<div class="ct-cabeza"><strong>' + escapar(new Date(p.fecha).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })) + '</strong>' +
        '<span>' + dinero(p.total) + '</span></div>' +
        p.grupos.map(function (g) {
          return '<p><b>' + escapar(g.tienda) + ':</b> <span class="suave">' + g.items.map(function (i) { return i.cant + '× ' + escapar(i.nombre); }).join(', ') + '</span></p>';
        }).join('') +
        '<div class="pedido-acciones"><a href="#pedido-' + p.id + '">Ver detalle</a>' +
        '<button type="button" class="boton-agregar" data-accion="repetir" data-id="' + p.id + '">🔁 Pedir de nuevo</button></div>' +
      '</article>';
    }).join('');
  }

  function vistaNoEncontrado() {
    return '<div class="vacio"><div>🤷</div><h1>No encontramos esta página</h1><a class="btn-principal" href="#inicio">Ir al inicio</a></div>';
  }

  // ---------- Ventana de producto ----------

  function abrirProducto(key) {
    var x = PRODUCTOS[key];
    if (!x) return;
    marcarVisto(key);
    var p = x.p, t = x.t, d = descuento(p);
    var h = horario(t);
    var similares = TODOS.filter(function (y) { return y.t.categoria === t.categoria && y.key !== key; }).sort(porVendidos).slice(0, 8);
    var f = new Date();
    var hoy = f.getFullYear() + '-' + ('0' + (f.getMonth() + 1)).slice(-2) + '-' + ('0' + f.getDate()).slice(-2);

    var accion = t.tipo === 'servicio'
      ? '<form id="form-reserva" class="form" data-key="' + key + '">' +
          '<label>Día <input type="date" name="dia" min="' + hoy + '" value="' + hoy + '" required></label>' +
          '<label>Hora <input type="time" name="hora" value="10:00" required></label>' +
          '<label class="ancho">Tu nombre <input name="nombre" required value="' + escapar(cliente.nombre) + '"></label>' +
          '<a class="btn-wa ancho" data-wa-form href="#" target="_blank" rel="noopener">📅 Reservar por WhatsApp</a></form>'
      : botonAgregar(key, true);

    $('modal-contenido').innerHTML =
      visual(p, 'm-img') +
      '<div class="m-cuerpo">' +
        '<a class="m-tienda" href="#tienda-' + t.id + '">' + t.emoji + ' ' + escapar(t.nombre) + ' ›</a>' +
        '<h2>' + escapar(p.nombre) + '</h2>' +
        '<p>' + estrellas(t.rating, t.resenas) + ' · <span class="suave">' + p.vendidos + '+ ' + (t.tipo === 'servicio' ? 'reservas' : 'pedidos') + '</span></p>' +
        '<p class="m-precio">' + (d ? '<span class="sello-mini">-' + d + '%</span> ' : '') + precioHTML(p) + '</p>' +
        '<p>' + escapar(p.descripcion) + '</p>' +
        (p.duracion ? '<p class="suave">⏱ Duración aproximada: ' + escapar(p.duracion) + '</p>' : '') +
        '<p class="' + (h.abierto ? 'abierto' : 'cerrado') + '">' + (h.abierto ? '🟢 ' : '🔴 ') + escapar(h.texto) +
          (t.tipo === 'tienda' ? ' · 🛵 ' + escapar(t.tiempo) : '') + '</p>' +
        accion +
        (similares.length ? '<h3>También te puede interesar</h3>' + carrusel(similares.map(function (y) { return tarjetaProducto(y); }).join('')) : '') +
      '</div>';
    $('modal').hidden = false;
    document.body.classList.add('sin-scroll');
    $('modal-contenido').parentNode.scrollTop = 0;
    actualizarEnlacesWA();
  }

  function cerrarModal() {
    $('modal').hidden = true;
    document.body.classList.remove('sin-scroll');
  }

  function abrirDireccion() {
    $('modal-contenido').innerHTML = '<div class="m-cuerpo"><h2>📍 ¿Dónde te lo llevamos?</h2>' +
      '<form id="form-direccion" class="form">' +
        '<label class="ancho">Dirección <input name="direccion" required value="' + escapar(cliente.direccion) + '" placeholder="Ej: Calle 45 # 12-30, apto 201"></label>' +
        '<label class="ancho">Punto de referencia <input name="referencia" value="' + escapar(cliente.referencia) + '" placeholder="Ej: casa de rejas verdes"></label>' +
        '<button type="submit" class="btn-principal ancho">Guardar dirección</button></form></div>';
    $('modal').hidden = false;
    document.body.classList.add('sin-scroll');
  }

  function pintarDireccion() {
    $('txt-direccion').textContent = cliente.direccion || 'Elige tu dirección';
  }

  // ---------- Rutas ----------

  function rutaActual() {
    var h = location.hash.slice(1);
    var i = h.indexOf('-');
    return { vista: (i < 0 ? h : h.slice(0, i)) || 'inicio', arg: i < 0 ? '' : h.slice(i + 1) };
  }

  var cuentaIntervalo;
  function pintar() {
    var r = rutaActual();
    var vistas = {
      inicio: vistaInicio, tienda: vistaTienda, categoria: vistaCategoria,
      buscar: function () { return vistaBuscar(consulta); },
      ofertas: function () { return vistaBuscar('', true); },
      carrito: vistaCarrito, pedidos: vistaPedidos, pedido: vistaPedido
    };
    vista.innerHTML = (vistas[r.vista] || vistaNoEncontrado)(r.arg);
    document.body.setAttribute('data-vista', r.vista);

    if (document.activeElement !== $('buscar')) $('buscar').value = r.vista === 'buscar' ? consulta : '';
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (a) {
      a.classList.toggle('activo', a.getAttribute('data-nav') === r.vista);
    });
    actualizarCarritoUI();
    actualizarEnlacesWA();

    clearInterval(cuentaIntervalo);
    if ($('cuenta')) { cuentaRegresiva(); cuentaIntervalo = setInterval(cuentaRegresiva, 1000); }
  }

  // Las ofertas del día terminan a medianoche.
  function cuentaRegresiva() {
    var el = $('cuenta');
    if (!el) return clearInterval(cuentaIntervalo);
    var ahora = new Date();
    var fin = new Date(ahora); fin.setHours(24, 0, 0, 0);
    var s = Math.floor((fin - ahora) / 1000);
    var dos = function (n) { return (n < 10 ? '0' : '') + n; };
    el.textContent = 'Terminan en ' + dos(Math.floor(s / 3600)) + ':' + dos(Math.floor(s / 60) % 60) + ':' + dos(s % 60);
  }

  // ---------- Acciones ----------

  function repetirPedido(id) {
    var pedido = pedidos.filter(function (p) { return p.id === id; })[0];
    if (!pedido) return;
    var agregados = 0;
    pedido.grupos.forEach(function (g) {
      g.items.forEach(function (i) {
        if (PRODUCTOS[i.key]) { carrito[i.key] = cantidad(i.key) + i.cant; agregados++; }
      });
    });
    guardar('carrito', carrito);
    if (!agregados) return toast('Esos productos ya no están disponibles');
    location.hash = '#carrito';
    toast('Agregamos tu pedido al carrito');
  }

  // Formularios que terminan en WhatsApp: el botón es un enlace real que se actualiza mientras escribes.
  function enlaceWA(f) {
    var d = new FormData(f);
    if (f.id === 'form-reserva') {
      var x = PRODUCTOS[f.getAttribute('data-key')];
      var dia = d.get('dia') ? new Date(d.get('dia') + 'T12:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }) : '';
      return wa(x.t.whatsapp, [
        '📅 *Reserva desde Barrio*',
        'Servicio: ' + x.p.nombre + ' (' + dinero(x.p.precio) + ')',
        'Día: ' + dia,
        'Hora: ' + d.get('hora'),
        'Nombre: ' + d.get('nombre'),
        '¿Tienen disponible?'
      ].join('\n'));
    }
    return wa(BARRIO.whatsappAdmin, [
      '¡Hola! Quiero vender en Barrio:',
      '• Negocio: ' + d.get('nombre'),
      '• Categoría: ' + d.get('categoria'),
      '• Ofrece: ' + d.get('descripcion'),
      '• Dirección: ' + d.get('direccion'),
      '• WhatsApp: ' + d.get('whatsapp')
    ].join('\n'));
  }
  function actualizarEnlacesWA() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-wa-form]'), function (a) {
      a.href = enlaceWA(a.closest('form'));
    });
  }
  document.addEventListener('input', function (e) { if (e.target.form && e.target.form.querySelector('[data-wa-form]')) actualizarEnlacesWA(); });

  document.addEventListener('click', function (e) {
    var enlace = e.target.closest('[data-wa-form]');
    if (enlace) {
      var f = enlace.closest('form');
      if (!f.reportValidity()) return e.preventDefault();
      enlace.href = enlaceWA(f);
      if (f.id === 'form-reserva') {
        cliente.nombre = new FormData(f).get('nombre');
        guardar('cliente', cliente);
        setTimeout(cerrarModal, 300);
        toast('Confirma tu cita en WhatsApp');
      }
      return;
    }
    var el = e.target.closest('[data-accion]');
    if (!el) {
      // Enlaces dentro de la ventana: cerrarla al navegar.
      if (e.target.closest('#modal a[href^="#"]')) cerrarModal();
      return;
    }
    var accion = el.getAttribute('data-accion');
    var key = el.getAttribute('data-key');
    if (accion === 'mas') {
      cambiarCarrito(key, 1);
      if (cantidad(key) === 1) toast('✓ ' + PRODUCTOS[key].p.nombre + ' en tu carrito');
    } else if (accion === 'menos') {
      cambiarCarrito(key, -1);
    } else if (accion === 'ver') {
      abrirProducto(key);
    } else if (accion === 'cerrar-modal') {
      cerrarModal();
    } else if (accion === 'direccion') {
      abrirDireccion();
    } else if (accion === 'repetir') {
      repetirPedido(el.getAttribute('data-id'));
    } else if (accion === 'ir-seccion') {
      e.preventDefault();
      var sec = $('sec-' + el.getAttribute('data-i'));
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (accion === 'enviado') {
      // El enlace abre WhatsApp; aquí solo marcamos esa tienda como enviada.
      var pedido = pedidos.filter(function (p) { return p.id === el.getAttribute('data-id'); })[0];
      pedido.grupos.forEach(function (g) { if (g.id === el.getAttribute('data-tienda')) g.enviado = true; });
      guardar('pedidos', pedidos);
      setTimeout(pintar, 300);
    }
  });

  document.addEventListener('submit', function (e) {
    var f = e.target;
    var d = new FormData(f);
    e.preventDefault();
    if (f.querySelector('[data-wa-form]')) return;

    if (f.id === 'form-pedido') {
      cliente = { nombre: d.get('nombre'), telefono: d.get('telefono'), direccion: d.get('direccion'), referencia: d.get('referencia') };
      guardar('cliente', cliente);
      pintarDireccion();
      var r = resumenCarrito();
      var pedido = {
        id: Date.now().toString(36).toUpperCase(),
        fecha: Date.now(),
        cliente: cliente,
        pago: d.get('pago'),
        nota: d.get('nota'),
        total: r.total,
        grupos: r.grupos.map(function (g) {
          return {
            id: g.t.id, tienda: g.t.nombre, whatsapp: g.t.whatsapp, subtotal: g.subtotal, envio: g.envio, enviado: false,
            items: g.items.map(function (i) { return { key: i.x.key, nombre: i.x.p.nombre, precio: i.x.p.precio, cant: i.cant }; })
          };
        })
      };
      pedidos.unshift(pedido);
      pedidos = pedidos.slice(0, 30);
      guardar('pedidos', pedidos);
      carrito = {};
      guardar('carrito', carrito);
      location.hash = '#pedido-' + pedido.id;
    } else if (f.id === 'form-direccion') {
      cliente.direccion = d.get('direccion');
      cliente.referencia = d.get('referencia');
      guardar('cliente', cliente);
      pintarDireccion();
      cerrarModal();
      if (rutaActual().vista === 'carrito') pintar();
      toast('📍 Dirección guardada');
    } else if (f.id === 'form-buscar') {
      $('buscar').blur();
      buscar($('buscar').value);
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.id === 'orden') { filtros.orden = e.target.value; pintar(); }
    if (e.target.id === 'abiertos') { filtros.abiertos = e.target.checked; pintar(); }
  });

  // Búsqueda mientras se escribe, sin llenar el historial.
  function buscar(q) {
    consulta = q.trim();
    if (rutaActual().vista === 'buscar') pintar(); else location.hash = '#buscar';
  }
  var tiempoBusqueda;
  $('buscar').addEventListener('input', function () {
    var q = this.value;
    clearTimeout(tiempoBusqueda);
    tiempoBusqueda = setTimeout(function () { buscar(q); }, 250);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('modal').hidden) cerrarModal();
  });

  window.addEventListener('hashchange', function () {
    cerrarModal();
    pintar();
    if (rutaActual().vista !== 'buscar') window.scrollTo(0, 0);
    else if (!consulta) $('buscar').focus();
  });

  // Refresca "abierto/cerrado" cada minuto por si la página queda abierta.
  setInterval(function () { if ($('modal').hidden && document.activeElement.tagName !== 'INPUT') pintar(); }, 60000);

  pintarDireccion();
  pintar();
})();
