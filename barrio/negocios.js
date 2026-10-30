/*
 * Datos de "Barrio" — la app de pedidos del barrio.
 *
 * Aquí se editan el nombre del barrio, las categorías, los banners y las tiendas con sus productos.
 * Para agregar una tienda copia una de la lista NEGOCIOS, cambia los datos y guarda.
 *
 * Tienda:
 * - id: palabra única sin espacios (sale en el enlace de la tienda).
 * - tipo: 'tienda' (se piden productos con carrito) o 'servicio' (se reserva cita: barberías, talleres…).
 * - whatsapp: número con código de país, solo dígitos (Colombia: 57 + celular, ej. '573001234567'). Ahí le llegan los pedidos.
 * - envio: costo del domicilio en pesos (0 = gratis). tiempo: texto que ve el cliente.
 * - horarios: formato 24 h ['abre', 'cierra'] por día. null = ese día no abre.
 *   Si cierra pasada la medianoche escribe la hora tal cual (ej. '01:00').
 * - foto (opcional): imagen de portada, ej. 'fotos/don-toto.jpg' (guárdala en la carpeta fotos/). Si no hay, se usa el emoji y el color.
 *
 * Producto:
 * - id: único dentro de la tienda. seccion: agrupa el menú de la tienda.
 * - antes (opcional): precio anterior. Si es mayor que precio, sale en "Ofertas del día".
 * - vendidos: cuántos se han pedido (ordena "Lo más pedido").
 * - foto (opcional): imagen del producto, ej. 'fotos/pizza-pepperoni.jpg'. Si no hay, se usa el emoji.
 * - duracion (solo servicios): texto, ej. '45 min'.
 *
 * Las tiendas, productos, precios y calificaciones de abajo son EJEMPLOS: cámbialos por los reales.
 */
var BARRIO = {
  nombre: 'Mi Barrio',
  // Pesos colombianos: $12.000, sin decimales.
  moneda: '$',
  decimales: 0,
  // WhatsApp de quien administra la app: aquí llegan las solicitudes de "Vende en Barrio".
  whatsappAdmin: '573000000000',
  // Formas de pago que se ofrecen al hacer el pedido.
  pagos: ['Efectivo', 'Nequi', 'Daviplata', 'Datáfono al recibir']
};

var CATEGORIAS = {
  comida:    { nombre: 'Comida',     icono: '🍔' },
  mercado:   { nombre: 'Mercado',    icono: '🛒' },
  ropa:      { nombre: 'Ropa',       icono: '👕' },
  repuestos: { nombre: 'Repuestos',  icono: '⚙️' },
  barberias: { nombre: 'Barberías',  icono: '💈' },
  talleres:  { nombre: 'Talleres',   icono: '🔧' },
  belleza:   { nombre: 'Belleza',    icono: '💅' },
  servicios: { nombre: 'Servicios',  icono: '🛠️' }
};

// Banners de la portada. destino: enlace dentro de la app (#tienda-<id> o #categoria-<clave>).
var BANNERS = [
  { titulo: 'Martes de pizza 2x1', texto: 'En Pizzas Don Toto, todo el día', emoji: '🍕', color: '#d9480f', destino: '#tienda-don-toto' },
  { titulo: 'Domicilio gratis en el granero', texto: 'Granero Mi Vecino te lo lleva', emoji: '🥑', color: '#2b8a3e', destino: '#tienda-mi-vecino' },
  { titulo: '¿La moto suena rara?', texto: 'Reserva revisión en Moto Taller Rayo', emoji: '🏍️', color: '#1864ab', destino: '#tienda-rayo' }
];

var LUN_SAB = function (abre, cierra) {
  return { domingo: null, lunes: [abre, cierra], martes: [abre, cierra], miercoles: [abre, cierra],
           jueves: [abre, cierra], viernes: [abre, cierra], sabado: [abre, cierra] };
};
var TODOS_LOS_DIAS = function (abre, cierra) {
  var h = LUN_SAB(abre, cierra);
  h.domingo = [abre, cierra];
  return h;
};

var NEGOCIOS = [
  {
    id: 'la-esquina', nombre: 'Arepas y Empanadas La Esquina', categoria: 'comida', tipo: 'tienda',
    emoji: '🫓', color: '#f59f00',
    descripcion: 'Arepas, empanadas y jugos naturales. Desayunos desde temprano.',
    direccion: 'Calle 45 # 12-30', whatsapp: '573000000001',
    horarios: TODOS_LOS_DIAS('06:30', '14:00'),
    rating: 4.7, resenas: 312, tiempo: '15-25 min', envio: 3000,
    productos: [
      { id: 'huevo', nombre: 'Arepa de huevo', precio: 5000, emoji: '🫓', seccion: 'Arepas', vendidos: 980, descripcion: 'Frita, con huevo entero y carne molida.' },
      { id: 'choclo', nombre: 'Arepa de choclo con queso', precio: 7000, emoji: '🌽', seccion: 'Arepas', vendidos: 640, descripcion: 'Arepa dulce de maíz tierno con queso campesino.' },
      { id: 'rellena', nombre: 'Arepa rellena de carne desmechada', precio: 12000, antes: 14000, emoji: '🫓', seccion: 'Arepas', vendidos: 420, descripcion: 'Carne desmechada, queso y hogao.' },
      { id: 'empanada', nombre: 'Empanada de carne y papa', precio: 2500, emoji: '🥟', seccion: 'Empanadas', vendidos: 1200, descripcion: 'Masa de maíz crujiente, con ají de la casa.' },
      { id: 'combo', nombre: 'Combo 3 empanadas + gaseosa', precio: 9000, antes: 11500, emoji: '🥟', seccion: 'Empanadas', vendidos: 530, descripcion: 'Gaseosa personal de 400 ml.' },
      { id: 'jugo', nombre: 'Jugo natural en leche', precio: 6000, emoji: '🧃', seccion: 'Bebidas', vendidos: 700, descripcion: 'Mora, lulo, maracuyá o guanábana.' }
    ]
  },
  {
    id: 'don-toto', nombre: 'Pizzas Don Toto', categoria: 'comida', tipo: 'tienda',
    emoji: '🍕', color: '#e03131',
    descripcion: 'Pizza al horno de leña, por porción o entera.',
    direccion: 'Carrera 7 # 50-12, local 3', whatsapp: '573000000002',
    horarios: TODOS_LOS_DIAS('11:00', '23:30'),
    rating: 4.8, resenas: 541, tiempo: '25-40 min', envio: 4000,
    productos: [
      { id: 'hawaiana', nombre: 'Pizza hawaiana mediana', precio: 34000, emoji: '🍕', seccion: 'Pizzas', vendidos: 1310, descripcion: 'Jamón, piña y mucho queso. 8 porciones.' },
      { id: 'pepp', nombre: 'Pizza pepperoni mediana', precio: 36000, antes: 44000, emoji: '🍕', seccion: 'Pizzas', vendidos: 870, descripcion: 'Doble pepperoni y extra queso. 8 porciones.' },
      { id: 'fam', nombre: 'Pizza familiar mixta', precio: 55000, emoji: '🍕', seccion: 'Pizzas', vendidos: 390, descripcion: 'Jamón, pollo, champiñones y maíz. 12 porciones.' },
      { id: 'porcion', nombre: 'Porción del día', precio: 6000, emoji: '🍕', seccion: 'Pizzas', vendidos: 760, descripcion: 'Pregunta el sabor del día.' },
      { id: 'gaseosa', nombre: 'Gaseosa 1,5 L', precio: 6000, emoji: '🥤', seccion: 'Bebidas', vendidos: 650, descripcion: 'Cola, naranja o manzana.' }
    ]
  },
  {
    id: 'mi-vecino', nombre: 'Granero Mi Vecino', categoria: 'mercado', tipo: 'tienda',
    emoji: '🛒', color: '#2f9e44',
    descripcion: 'Granos, lácteos, frutas y verduras. Domicilio gratis.',
    direccion: 'Calle 47 # 13-05, esquina', whatsapp: '573000000003',
    horarios: TODOS_LOS_DIAS('07:00', '21:00'),
    rating: 4.6, resenas: 204, tiempo: '20-35 min', envio: 0,
    productos: [
      { id: 'arroz', nombre: 'Arroz 1 kg', precio: 4500, emoji: '🍚', seccion: 'Granos y despensa', vendidos: 1500, descripcion: 'Arroz blanco de grano largo.' },
      { id: 'panela', nombre: 'Panela 500 g', precio: 3500, emoji: '🟫', seccion: 'Granos y despensa', vendidos: 900, descripcion: 'Para aguapanela o para endulzar.' },
      { id: 'huevos', nombre: 'Huevos AA x 30', precio: 17000, antes: 20000, emoji: '🥚', seccion: 'Lácteos y huevos', vendidos: 1100, descripcion: 'Bandeja de 30 huevos frescos.' },
      { id: 'queso', nombre: 'Queso campesino 500 g', precio: 11000, emoji: '🧀', seccion: 'Lácteos y huevos', vendidos: 760, descripcion: 'Fresco, ideal para arepas.' },
      { id: 'leche', nombre: 'Leche entera 1,1 L', precio: 4800, emoji: '🥛', seccion: 'Lácteos y huevos', vendidos: 1300, descripcion: 'En bolsa.' },
      { id: 'aguacate', nombre: 'Aguacate Hass x 3', precio: 8000, emoji: '🥑', seccion: 'Frutas y verduras', vendidos: 480, descripcion: 'Listos para comer.' },
      { id: 'banano', nombre: 'Banano 1 kg', precio: 3500, emoji: '🍌', seccion: 'Frutas y verduras', vendidos: 520, descripcion: 'Maduro o pintón, tú eliges.' }
    ]
  },
  {
    id: 'valentina', nombre: 'Boutique Valentina', categoria: 'ropa', tipo: 'tienda',
    emoji: '👗', color: '#c2255c',
    descripcion: 'Ropa de dama y caballero, jeans y tenis.',
    direccion: 'C. C. El Barrio, local 112', whatsapp: '573000000004',
    horarios: LUN_SAB('09:00', '19:00'),
    rating: 4.5, resenas: 98, tiempo: '1-2 h', envio: 5000,
    productos: [
      { id: 'jean', nombre: 'Jean levantacola de dama', precio: 79900, antes: 109900, emoji: '👖', seccion: 'Dama', vendidos: 230, descripcion: 'Tiro alto, tallas 6 a 16. Dinos tu talla.' },
      { id: 'blusa', nombre: 'Blusa de lino', precio: 49900, emoji: '👚', seccion: 'Dama', vendidos: 150, descripcion: 'Blanca, beige o negra.' },
      { id: 'camiseta', nombre: 'Camiseta básica de hombre', precio: 29900, emoji: '👕', seccion: 'Caballero', vendidos: 410, descripcion: '100% algodón, varios colores.' },
      { id: 'tenis', nombre: 'Tenis deportivos', precio: 149900, antes: 189900, emoji: '👟', seccion: 'Calzado', vendidos: 120, descripcion: 'Tallas 35 a 43.' },
      { id: 'gorra', nombre: 'Gorra bordada', precio: 25000, emoji: '🧢', seccion: 'Accesorios', vendidos: 200, descripcion: 'Ajustable.' }
    ]
  },
  {
    id: 'el-primo', nombre: 'Autopartes El Primo', categoria: 'repuestos', tipo: 'tienda',
    emoji: '🚗', color: '#495057',
    descripcion: 'Repuestos para carro: filtros, frenos, aceites y más.',
    direccion: 'Carrera 15 # 40-22', whatsapp: '573000000005',
    horarios: LUN_SAB('08:00', '18:00'),
    rating: 4.6, resenas: 143, tiempo: '30-60 min', envio: 5000,
    productos: [
      { id: 'aceite', nombre: 'Aceite 20W-50 (galón)', precio: 95000, antes: 115000, emoji: '🛢️', seccion: 'Lubricantes', vendidos: 340, descripcion: 'Mineral para motor a gasolina.' },
      { id: 'filtro', nombre: 'Filtro de aceite', precio: 22000, emoji: '🧯', seccion: 'Filtros', vendidos: 410, descripcion: 'Escríbenos marca, modelo y año de tu carro.' },
      { id: 'pastillas', nombre: 'Pastillas de freno delanteras', precio: 85000, emoji: '🛞', seccion: 'Frenos', vendidos: 260, descripcion: 'Juego completo. Indica modelo y año.' },
      { id: 'bujias', nombre: 'Juego de bujías x 4', precio: 60000, emoji: '⚡', seccion: 'Encendido', vendidos: 180, descripcion: 'Estándar e iridio.' },
      { id: 'refrigerante', nombre: 'Refrigerante (galón)', precio: 38000, emoji: '🧪', seccion: 'Lubricantes', vendidos: 150, descripcion: 'Listo para usar.' }
    ]
  },
  {
    id: 'dos-ruedas', nombre: 'MotoRepuestos 2 Ruedas', categoria: 'repuestos', tipo: 'tienda',
    emoji: '🏍️', color: '#1971c2',
    descripcion: 'Todo para tu moto: repuestos, cascos y accesorios.',
    direccion: 'Calle 40 # 15-08', whatsapp: '573000000006',
    horarios: LUN_SAB('08:00', '18:30'),
    rating: 4.4, resenas: 87, tiempo: '30-45 min', envio: 4000,
    productos: [
      { id: 'casco', nombre: 'Casco integral certificado', precio: 189000, antes: 229000, emoji: '⛑️', seccion: 'Accesorios', vendidos: 95, descripcion: 'Con certificación. Tallas M, L y XL.' },
      { id: 'kit', nombre: 'Kit de arrastre', precio: 95000, emoji: '⛓️', seccion: 'Transmisión', vendidos: 160, descripcion: 'Cadena, piñón y corona. Dinos tu moto.' },
      { id: 'bujia', nombre: 'Bujía para moto', precio: 12000, emoji: '⚡', seccion: 'Encendido', vendidos: 300, descripcion: 'Indica el modelo de tu moto.' },
      { id: 'aceite-moto', nombre: 'Aceite 4T 20W-50 (1 L)', precio: 28000, emoji: '🛢️', seccion: 'Lubricantes', vendidos: 380, descripcion: 'Para motos de 4 tiempos.' },
      { id: 'chaleco', nombre: 'Chaleco reflectivo', precio: 25000, emoji: '🦺', seccion: 'Accesorios', vendidos: 140, descripcion: 'Con número de placa sin costo.' }
    ]
  },
  {
    id: 'el-flow', nombre: 'Barbería El Flow', categoria: 'barberias', tipo: 'servicio',
    emoji: '💈', color: '#343a40',
    descripcion: 'Cortes clásicos y modernos, barba y diseños.',
    direccion: 'Calle 46 # 12-15, frente al parque', whatsapp: '573000000007',
    horarios: LUN_SAB('09:00', '20:00'),
    rating: 4.9, resenas: 266, tiempo: 'Con cita',
    productos: [
      { id: 'corte', nombre: 'Corte de cabello', precio: 18000, emoji: '✂️', seccion: 'Servicios', vendidos: 1400, duracion: '30 min', descripcion: 'Clásico o moderno, con lavado.' },
      { id: 'corte-barba', nombre: 'Corte + barba', precio: 25000, antes: 30000, emoji: '🧔', seccion: 'Servicios', vendidos: 900, duracion: '45 min', descripcion: 'Incluye perfilado y toalla caliente.' },
      { id: 'diseno', nombre: 'Diseño / rayitas', precio: 5000, emoji: '〰️', seccion: 'Extras', vendidos: 300, duracion: '10 min', descripcion: 'Se agrega a tu corte.' },
      { id: 'nino', nombre: 'Corte de niño', precio: 15000, emoji: '👦', seccion: 'Servicios', vendidos: 450, duracion: '25 min', descripcion: 'Hasta 12 años.' }
    ]
  },
  {
    id: 'los-amigos', nombre: 'Barber Shop Los Amigos', categoria: 'barberias', tipo: 'servicio',
    emoji: '💈', color: '#5f3dc4',
    descripcion: 'Corte + barba con toalla caliente. Abre domingos.',
    direccion: 'Carrera 9 # 48-20', whatsapp: '573000000008',
    horarios: TODOS_LOS_DIAS('10:00', '21:00'),
    rating: 4.7, resenas: 158, tiempo: 'Con cita',
    productos: [
      { id: 'corte', nombre: 'Corte de cabello', precio: 20000, emoji: '✂️', seccion: 'Servicios', vendidos: 800, duracion: '30 min', descripcion: 'Con lavado y peinado.' },
      { id: 'barba', nombre: 'Arreglo de barba', precio: 12000, emoji: '🧔', seccion: 'Servicios', vendidos: 500, duracion: '20 min', descripcion: 'Perfilado con navaja.' },
      { id: 'tinte', nombre: 'Tinte / decoloración', precio: 60000, emoji: '🎨', seccion: 'Color', vendidos: 120, duracion: '1 h 30 min', descripcion: 'Precio desde. Consulta tu caso.' }
    ]
  },
  {
    id: 'perez', nombre: 'Taller Hermanos Pérez', categoria: 'talleres', tipo: 'servicio',
    emoji: '🔧', color: '#e8590c',
    descripcion: 'Mecánica general, frenos, suspensión y escáner.',
    direccion: 'Carrera 15 # 38-50, bodega azul', whatsapp: '573000000009',
    horarios: LUN_SAB('07:30', '17:30'),
    rating: 4.6, resenas: 121, tiempo: 'Con cita',
    productos: [
      { id: 'cambio-aceite', nombre: 'Cambio de aceite (mano de obra)', precio: 25000, emoji: '🛢️', seccion: 'Mantenimiento', vendidos: 600, duracion: '30 min', descripcion: 'Trae tu aceite y filtro o cómpralos en Autopartes El Primo.' },
      { id: 'escaner', nombre: 'Diagnóstico con escáner', precio: 50000, antes: 70000, emoji: '💻', seccion: 'Diagnóstico', vendidos: 320, duracion: '45 min', descripcion: 'Lectura y borrado de códigos de falla.' },
      { id: 'frenos', nombre: 'Servicio de frenos', precio: 80000, emoji: '🛞', seccion: 'Mantenimiento', vendidos: 210, duracion: '2 h', descripcion: 'Cambio de pastillas y revisión de discos. Mano de obra.' },
      { id: 'alineacion', nombre: 'Alineación y balanceo', precio: 70000, emoji: '🎯', seccion: 'Mantenimiento', vendidos: 180, duracion: '1 h', descripcion: 'Las 4 ruedas.' }
    ]
  },
  {
    id: 'rayo', nombre: 'Moto Taller Rayo', categoria: 'talleres', tipo: 'servicio',
    emoji: '🏍️', color: '#1864ab',
    descripcion: 'Reparación y mantenimiento de motos.',
    direccion: 'Calle 47 # 13-11, al lado del granero', whatsapp: '573000000010',
    horarios: LUN_SAB('08:00', '18:00'),
    rating: 4.5, resenas: 76, tiempo: 'Con cita',
    productos: [
      { id: 'revision', nombre: 'Revisión general', precio: 35000, emoji: '🔍', seccion: 'Mantenimiento', vendidos: 400, duracion: '1 h', descripcion: 'Frenos, luces, cadena y motor.' },
      { id: 'llanta', nombre: 'Despinchada / cambio de llanta', precio: 10000, emoji: '🛞', seccion: 'Mantenimiento', vendidos: 520, duracion: '20 min', descripcion: 'Mano de obra.' },
      { id: 'sincronizacion', nombre: 'Sincronización', precio: 60000, antes: 75000, emoji: '🧰', seccion: 'Motor', vendidos: 230, duracion: '1 h 30 min', descripcion: 'Carburador, bujía, filtro de aire y calibración.' }
    ]
  },
  {
    id: 'divas', nombre: 'Salón de Belleza Divas', categoria: 'belleza', tipo: 'servicio',
    emoji: '💅', color: '#d6336c',
    descripcion: 'Uñas, cejas, pestañas, tintes y keratina.',
    direccion: 'Calle 44 # 11-27', whatsapp: '573000000011',
    horarios: LUN_SAB('09:00', '19:00'),
    rating: 4.8, resenas: 189, tiempo: 'Con cita',
    productos: [
      { id: 'manicure', nombre: 'Manicure semipermanente', precio: 35000, antes: 45000, emoji: '💅', seccion: 'Uñas', vendidos: 700, duracion: '1 h', descripcion: 'Incluye limado y decoración sencilla.' },
      { id: 'cejas', nombre: 'Diseño de cejas', precio: 15000, emoji: '✨', seccion: 'Rostro', vendidos: 450, duracion: '20 min', descripcion: 'Con hilo o cera.' },
      { id: 'pestanas', nombre: 'Pestañas pelo a pelo', precio: 70000, emoji: '👁️', seccion: 'Rostro', vendidos: 210, duracion: '1 h 30 min', descripcion: 'Efecto natural.' },
      { id: 'keratina', nombre: 'Keratina', precio: 150000, emoji: '💇‍♀️', seccion: 'Cabello', vendidos: 90, duracion: '3 h', descripcion: 'Precio desde, según el largo.' }
    ]
  },
  {
    id: 'tecnicel', nombre: 'TecniCel', categoria: 'servicios', tipo: 'tienda',
    emoji: '📱', color: '#0c8599',
    descripcion: 'Reparación de celulares y accesorios.',
    direccion: 'C. C. El Barrio, local 215', whatsapp: '573000000012',
    horarios: LUN_SAB('09:00', '19:00'),
    rating: 4.3, resenas: 64, tiempo: '30-50 min', envio: 3000,
    productos: [
      { id: 'cargador', nombre: 'Cargador rápido USB-C', precio: 35000, antes: 45000, emoji: '🔌', seccion: 'Accesorios', vendidos: 330, descripcion: '20 W con cable incluido.' },
      { id: 'forro', nombre: 'Forro antigolpes', precio: 20000, emoji: '📱', seccion: 'Accesorios', vendidos: 410, descripcion: 'Dinos el modelo de tu celular.' },
      { id: 'vidrio', nombre: 'Vidrio templado', precio: 10000, emoji: '🛡️', seccion: 'Accesorios', vendidos: 520, descripcion: 'Te lo instalamos gratis en el local.' },
      { id: 'audifonos', nombre: 'Audífonos inalámbricos', precio: 55000, emoji: '🎧', seccion: 'Accesorios', vendidos: 140, descripcion: 'Con estuche de carga.' }
    ]
  }
];
