/*
 * Datos de "Barrio" — la app de pedidos del barrio.
 *
 * Aquí se editan el nombre del barrio, las categorías, los banners y las tiendas con sus productos.
 * Para agregar una tienda copia una de la lista NEGOCIOS, cambia los datos y guarda.
 *
 * Tienda:
 * - id: palabra única sin espacios (sale en el enlace de la tienda).
 * - tipo: 'tienda' (se piden productos con carrito) o 'servicio' (se reserva cita: barberías, talleres…).
 * - whatsapp: número con código de país, solo dígitos. Ahí le llegan los pedidos.
 * - envio: costo del domicilio (0 = gratis). tiempo: texto que ve el cliente.
 * - horarios: formato 24 h ['abre', 'cierra'] por día. null = ese día no abre.
 *   Si cierra pasada la medianoche escribe la hora tal cual (ej. '01:00').
 * - foto (opcional): enlace a una imagen de portada. Si no hay, se usa el emoji y el color.
 *
 * Producto:
 * - id: único dentro de la tienda. seccion: agrupa el menú de la tienda.
 * - antes (opcional): precio anterior. Si es mayor que precio, sale en "Ofertas del día".
 * - vendidos: cuántos se han pedido (ordena "Lo más pedido").
 * - foto (opcional): enlace a una imagen. Si no hay, se usa el emoji.
 * - duracion (solo servicios): texto, ej. '45 min'.
 *
 * Las tiendas, productos, precios y calificaciones de abajo son EJEMPLOS: cámbialos por los reales.
 */
var BARRIO = {
  nombre: 'Mi Barrio',
  moneda: '$',
  // WhatsApp de quien administra la app: aquí llegan las solicitudes de "Vende en Barrio".
  whatsappAdmin: '584120000000',
  // Formas de pago que se ofrecen al hacer el pedido.
  pagos: ['Efectivo', 'Transferencia', 'Tarjeta al recibir']
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

// Banners de la portada. destino: enlace dentro de la app (#/tienda/id, #/categoria/clave…).
var BANNERS = [
  { titulo: 'Martes de pizza 2x1', texto: 'En Pizzas Don Toto, todo el día', emoji: '🍕', color: '#d9480f', destino: '#/tienda/don-toto' },
  { titulo: 'Envío gratis en el mercado', texto: 'Bodega Mi Vecino te lo lleva', emoji: '🥑', color: '#2b8a3e', destino: '#/tienda/mi-vecino' },
  { titulo: '¿Tu moto hace ruido?', texto: 'Reserva revisión en Moto Taller Rayo', emoji: '🏍️', color: '#1864ab', destino: '#/tienda/rayo' }
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
    id: 'la-esquina', nombre: 'Arepera La Esquina', categoria: 'comida', tipo: 'tienda',
    emoji: '🫓', color: '#f59f00',
    descripcion: 'Arepas rellenas, empanadas y jugos naturales.',
    direccion: 'Calle 5 con Av. Principal', whatsapp: '584121111111',
    horarios: TODOS_LOS_DIAS('06:30', '14:00'),
    rating: 4.7, resenas: 312, tiempo: '15-25 min', envio: 1,
    productos: [
      { id: 'reina', nombre: 'Arepa reina pepiada', precio: 4.5, emoji: '🫓', seccion: 'Arepas', vendidos: 980, descripcion: 'Pollo, aguacate y mayonesa.' },
      { id: 'domino', nombre: 'Arepa dominó', precio: 3.5, emoji: '🫓', seccion: 'Arepas', vendidos: 640, descripcion: 'Caraotas negras y queso blanco rallado.' },
      { id: 'pabellon', nombre: 'Arepa pabellón', precio: 5, antes: 6, emoji: '🫓', seccion: 'Arepas', vendidos: 420, descripcion: 'Carne mechada, caraotas, plátano y queso.' },
      { id: 'empanada', nombre: 'Empanada de queso', precio: 1.5, emoji: '🥟', seccion: 'Empanadas', vendidos: 1200, descripcion: 'Masa de maíz crujiente, recién frita.' },
      { id: 'combo', nombre: 'Combo 3 empanadas + jugo', precio: 5, antes: 6.5, emoji: '🥟', seccion: 'Empanadas', vendidos: 530, descripcion: 'Elige los rellenos al escribirnos.' },
      { id: 'jugo', nombre: 'Jugo natural grande', precio: 2, emoji: '🧃', seccion: 'Bebidas', vendidos: 700, descripcion: 'Parchita, mango, fresa o guayaba.' }
    ]
  },
  {
    id: 'don-toto', nombre: 'Pizzas Don Toto', categoria: 'comida', tipo: 'tienda',
    emoji: '🍕', color: '#e03131',
    descripcion: 'Pizza al horno de leña, por porción o entera.',
    direccion: 'Av. Principal, local 12', whatsapp: '584121111112',
    horarios: TODOS_LOS_DIAS('11:00', '23:30'),
    rating: 4.8, resenas: 541, tiempo: '25-40 min', envio: 1.5,
    productos: [
      { id: 'marg', nombre: 'Pizza margarita mediana', precio: 8, emoji: '🍕', seccion: 'Pizzas', vendidos: 870, descripcion: 'Salsa de tomate, mozzarella y albahaca.' },
      { id: 'pepp', nombre: 'Pizza pepperoni mediana', precio: 9, antes: 11, emoji: '🍕', seccion: 'Pizzas', vendidos: 1310, descripcion: 'Doble pepperoni y extra queso.' },
      { id: 'fam', nombre: 'Pizza familiar 4 estaciones', precio: 15, emoji: '🍕', seccion: 'Pizzas', vendidos: 390, descripcion: 'Jamón, champiñones, maíz y pimentón.' },
      { id: 'porcion', nombre: 'Porción del día', precio: 2.5, emoji: '🍕', seccion: 'Pizzas', vendidos: 760, descripcion: 'Pregunta el sabor del día.' },
      { id: 'refresco', nombre: 'Refresco 1.5 L', precio: 2.5, emoji: '🥤', seccion: 'Bebidas', vendidos: 650, descripcion: 'Cola, naranja o limón.' }
    ]
  },
  {
    id: 'mi-vecino', nombre: 'Bodega Mi Vecino', categoria: 'mercado', tipo: 'tienda',
    emoji: '🛒', color: '#2f9e44',
    descripcion: 'Víveres, charcutería, frutas y verduras.',
    direccion: 'Callejón 2, esquina', whatsapp: '584121111123',
    horarios: TODOS_LOS_DIAS('07:00', '22:00'),
    rating: 4.6, resenas: 204, tiempo: '20-35 min', envio: 0,
    productos: [
      { id: 'harina', nombre: 'Harina de maíz 1 kg', precio: 1.2, emoji: '🌽', seccion: 'Víveres', vendidos: 1500, descripcion: 'Precocida, blanca.' },
      { id: 'arroz', nombre: 'Arroz 1 kg', precio: 1.3, emoji: '🍚', seccion: 'Víveres', vendidos: 1100, descripcion: 'Tipo I.' },
      { id: 'huevos', nombre: 'Cartón de huevos (30)', precio: 5.5, antes: 6.5, emoji: '🥚', seccion: 'Víveres', vendidos: 900, descripcion: 'Huevos frescos de granja.' },
      { id: 'queso', nombre: 'Queso blanco ½ kg', precio: 3.5, emoji: '🧀', seccion: 'Charcutería', vendidos: 760, descripcion: 'Cortado al momento.' },
      { id: 'aguacate', nombre: 'Aguacates (3 und)', precio: 2.5, emoji: '🥑', seccion: 'Frutas y verduras', vendidos: 480, descripcion: 'Listos para comer.' },
      { id: 'cambur', nombre: 'Cambur / banano 1 kg', precio: 1, emoji: '🍌', seccion: 'Frutas y verduras', vendidos: 520, descripcion: 'Maduro o pintón, tú eliges.' }
    ]
  },
  {
    id: 'valentina', nombre: 'Boutique Valentina', categoria: 'ropa', tipo: 'tienda',
    emoji: '👗', color: '#c2255c',
    descripcion: 'Ropa de dama y caballero, jeans y zapatos.',
    direccion: 'Centro comercial El Barrio, nivel 1', whatsapp: '584121111113',
    horarios: LUN_SAB('09:00', '19:00'),
    rating: 4.5, resenas: 98, tiempo: '1-2 h', envio: 2,
    productos: [
      { id: 'jean', nombre: 'Jean clásico de dama', precio: 18, antes: 24, emoji: '👖', seccion: 'Dama', vendidos: 230, descripcion: 'Tiro alto, tallas 6 a 16. Dinos tu talla.' },
      { id: 'blusa', nombre: 'Blusa de lino', precio: 12, emoji: '👚', seccion: 'Dama', vendidos: 150, descripcion: 'Blanca, beige o negra.' },
      { id: 'franela', nombre: 'Franela básica caballero', precio: 7, emoji: '👕', seccion: 'Caballero', vendidos: 410, descripcion: '100% algodón, varios colores.' },
      { id: 'zapatos', nombre: 'Zapatos deportivos', precio: 30, antes: 38, emoji: '👟', seccion: 'Calzado', vendidos: 120, descripcion: 'Tallas 36 a 44.' },
      { id: 'gorra', nombre: 'Gorra bordada', precio: 6, emoji: '🧢', seccion: 'Accesorios', vendidos: 200, descripcion: 'Ajustable.' }
    ]
  },
  {
    id: 'el-primo', nombre: 'Repuestos El Primo', categoria: 'repuestos', tipo: 'tienda',
    emoji: '🚗', color: '#495057',
    descripcion: 'Repuestos para carros nacionales e importados.',
    direccion: 'Calle 10 con Calle 11', whatsapp: '584121111120',
    horarios: LUN_SAB('08:00', '17:00'),
    rating: 4.6, resenas: 143, tiempo: '30-60 min', envio: 2,
    productos: [
      { id: 'aceite', nombre: 'Aceite 15W-40 (4 L)', precio: 22, antes: 26, emoji: '🛢️', seccion: 'Lubricantes', vendidos: 340, descripcion: 'Mineral para motor a gasolina.' },
      { id: 'filtro', nombre: 'Filtro de aceite', precio: 5, emoji: '🧯', seccion: 'Filtros', vendidos: 410, descripcion: 'Escríbenos la marca y año de tu carro.' },
      { id: 'pastillas', nombre: 'Pastillas de freno delanteras', precio: 16, emoji: '🛞', seccion: 'Frenos', vendidos: 260, descripcion: 'Juego completo. Indica modelo y año.' },
      { id: 'bujias', nombre: 'Juego de bujías (4)', precio: 12, emoji: '⚡', seccion: 'Encendido', vendidos: 180, descripcion: 'Iridio y estándar.' },
      { id: 'refrigerante', nombre: 'Refrigerante 1 gal', precio: 8, emoji: '🧪', seccion: 'Lubricantes', vendidos: 150, descripcion: 'Listo para usar.' }
    ]
  },
  {
    id: 'dos-ruedas', nombre: 'MotoRepuestos 2 Ruedas', categoria: 'repuestos', tipo: 'tienda',
    emoji: '🏍️', color: '#1971c2',
    descripcion: 'Todo para tu moto: repuestos, cascos y accesorios.',
    direccion: 'Av. Bolívar, local 9', whatsapp: '584121111121',
    horarios: LUN_SAB('08:30', '18:00'),
    rating: 4.4, resenas: 87, tiempo: '30-45 min', envio: 1.5,
    productos: [
      { id: 'casco', nombre: 'Casco integral', precio: 35, antes: 42, emoji: '⛑️', seccion: 'Accesorios', vendidos: 95, descripcion: 'Tallas M, L y XL.' },
      { id: 'cadena', nombre: 'Kit de arrastre', precio: 20, emoji: '⛓️', seccion: 'Transmisión', vendidos: 160, descripcion: 'Cadena, piñón y corona.' },
      { id: 'bujia', nombre: 'Bujía para moto', precio: 3, emoji: '⚡', seccion: 'Encendido', vendidos: 300, descripcion: 'Indica el modelo de tu moto.' },
      { id: 'aceite-moto', nombre: 'Aceite 4T 20W-50 (1 L)', precio: 6, emoji: '🛢️', seccion: 'Lubricantes', vendidos: 380, descripcion: 'Para motos de 4 tiempos.' }
    ]
  },
  {
    id: 'el-flow', nombre: 'Barbería El Flow', categoria: 'barberias', tipo: 'servicio',
    emoji: '💈', color: '#343a40',
    descripcion: 'Cortes clásicos y modernos, barba y diseños.',
    direccion: 'Calle 3, frente a la plaza', whatsapp: '584121111115',
    horarios: LUN_SAB('09:00', '20:00'),
    rating: 4.9, resenas: 266, tiempo: 'Con cita',
    productos: [
      { id: 'corte', nombre: 'Corte de cabello', precio: 5, emoji: '✂️', seccion: 'Servicios', vendidos: 1400, duracion: '30 min', descripcion: 'Clásico o moderno, con lavado.' },
      { id: 'corte-barba', nombre: 'Corte + barba', precio: 8, antes: 10, emoji: '🧔', seccion: 'Servicios', vendidos: 900, duracion: '45 min', descripcion: 'Incluye perfilado y toalla caliente.' },
      { id: 'diseno', nombre: 'Diseño / rayitas', precio: 2, emoji: '〰️', seccion: 'Extras', vendidos: 300, duracion: '10 min', descripcion: 'Se agrega a tu corte.' },
      { id: 'nino', nombre: 'Corte de niño', precio: 4, emoji: '👦', seccion: 'Servicios', vendidos: 450, duracion: '25 min', descripcion: 'Hasta 12 años.' }
    ]
  },
  {
    id: 'los-amigos', nombre: 'Barber Shop Los Amigos', categoria: 'barberias', tipo: 'servicio',
    emoji: '💈', color: '#5f3dc4',
    descripcion: 'Corte + barba con toalla caliente. Abre domingos.',
    direccion: 'Av. Bolívar, local 4', whatsapp: '584121111116',
    horarios: TODOS_LOS_DIAS('10:00', '21:00'),
    rating: 4.7, resenas: 158, tiempo: 'Con cita',
    productos: [
      { id: 'corte', nombre: 'Corte de cabello', precio: 6, emoji: '✂️', seccion: 'Servicios', vendidos: 800, duracion: '30 min', descripcion: 'Con lavado y peinado.' },
      { id: 'barba', nombre: 'Arreglo de barba', precio: 4, emoji: '🧔', seccion: 'Servicios', vendidos: 500, duracion: '20 min', descripcion: 'Perfilado con navaja.' },
      { id: 'tinte', nombre: 'Tinte / decoloración', precio: 15, emoji: '🎨', seccion: 'Color', vendidos: 120, duracion: '1 h 30 min', descripcion: 'Precio desde. Consulta tu caso.' }
    ]
  },
  {
    id: 'perez', nombre: 'Taller Hermanos Pérez', categoria: 'talleres', tipo: 'servicio',
    emoji: '🔧', color: '#e8590c',
    descripcion: 'Mecánica general, frenos, suspensión y escáner.',
    direccion: 'Calle 10, galpón azul', whatsapp: '584121111117',
    horarios: LUN_SAB('07:30', '17:30'),
    rating: 4.6, resenas: 121, tiempo: 'Con cita',
    productos: [
      { id: 'cambio-aceite', nombre: 'Cambio de aceite (mano de obra)', precio: 5, emoji: '🛢️', seccion: 'Mantenimiento', vendidos: 600, duracion: '30 min', descripcion: 'Trae tu aceite y filtro o cómpralos en Repuestos El Primo.' },
      { id: 'escaner', nombre: 'Diagnóstico con escáner', precio: 10, antes: 15, emoji: '💻', seccion: 'Diagnóstico', vendidos: 320, duracion: '45 min', descripcion: 'Lectura y borrado de códigos de falla.' },
      { id: 'frenos', nombre: 'Servicio de frenos', precio: 20, emoji: '🛞', seccion: 'Mantenimiento', vendidos: 210, duracion: '2 h', descripcion: 'Cambio de pastillas y revisión de discos.' },
      { id: 'alineacion', nombre: 'Alineación y balanceo', precio: 15, emoji: '🎯', seccion: 'Mantenimiento', vendidos: 180, duracion: '1 h', descripcion: 'Las 4 ruedas.' }
    ]
  },
  {
    id: 'rayo', nombre: 'Moto Taller Rayo', categoria: 'talleres', tipo: 'servicio',
    emoji: '🏍️', color: '#1864ab',
    descripcion: 'Reparación y mantenimiento de motos.',
    direccion: 'Callejón 2, al lado de la bodega', whatsapp: '584121111118',
    horarios: LUN_SAB('08:00', '18:00'),
    rating: 4.5, resenas: 76, tiempo: 'Con cita',
    productos: [
      { id: 'revision', nombre: 'Revisión general', precio: 6, emoji: '🔍', seccion: 'Mantenimiento', vendidos: 400, duracion: '1 h', descripcion: 'Frenos, luces, cadena y motor.' },
      { id: 'llanta', nombre: 'Cambio de llanta', precio: 3, emoji: '🛞', seccion: 'Mantenimiento', vendidos: 520, duracion: '20 min', descripcion: 'Mano de obra.' },
      { id: 'carburador', nombre: 'Limpieza de carburador', precio: 8, antes: 10, emoji: '🧰', seccion: 'Motor', vendidos: 230, duracion: '1 h 30 min', descripcion: 'Desarme, limpieza y calibración.' }
    ]
  },
  {
    id: 'divas', nombre: 'Salón de Belleza Divas', categoria: 'belleza', tipo: 'servicio',
    emoji: '💅', color: '#d6336c',
    descripcion: 'Uñas, cejas, pestañas, tintes y alisados.',
    direccion: 'Calle 4, casa 7', whatsapp: '584121111122',
    horarios: LUN_SAB('09:00', '18:00'),
    rating: 4.8, resenas: 189, tiempo: 'Con cita',
    productos: [
      { id: 'manicure', nombre: 'Manicure semipermanente', precio: 10, antes: 12, emoji: '💅', seccion: 'Uñas', vendidos: 700, duracion: '1 h', descripcion: 'Incluye limado y decoración sencilla.' },
      { id: 'cejas', nombre: 'Diseño de cejas', precio: 5, emoji: '✨', seccion: 'Rostro', vendidos: 450, duracion: '20 min', descripcion: 'Con hilo o cera.' },
      { id: 'pestanas', nombre: 'Pestañas pelo a pelo', precio: 20, emoji: '👁️', seccion: 'Rostro', vendidos: 210, duracion: '1 h 30 min', descripcion: 'Efecto natural.' },
      { id: 'alisado', nombre: 'Alisado con keratina', precio: 35, emoji: '💇‍♀️', seccion: 'Cabello', vendidos: 90, duracion: '3 h', descripcion: 'Precio desde, según el largo.' }
    ]
  },
  {
    id: 'tecnicel', nombre: 'TecniCel', categoria: 'servicios', tipo: 'tienda',
    emoji: '📱', color: '#0c8599',
    descripcion: 'Reparación de celulares y accesorios.',
    direccion: 'Centro comercial El Barrio, nivel 2', whatsapp: '584121111124',
    horarios: LUN_SAB('09:00', '18:30'),
    rating: 4.3, resenas: 64, tiempo: '30-50 min', envio: 1,
    productos: [
      { id: 'cargador', nombre: 'Cargador rápido USB-C', precio: 8, antes: 10, emoji: '🔌', seccion: 'Accesorios', vendidos: 330, descripcion: '20 W con cable incluido.' },
      { id: 'forro', nombre: 'Forro antigolpes', precio: 5, emoji: '📱', seccion: 'Accesorios', vendidos: 410, descripcion: 'Dinos el modelo de tu teléfono.' },
      { id: 'vidrio', nombre: 'Vidrio templado', precio: 3, emoji: '🛡️', seccion: 'Accesorios', vendidos: 520, descripcion: 'Te lo colocamos gratis en tienda.' },
      { id: 'audifonos', nombre: 'Audífonos inalámbricos', precio: 15, emoji: '🎧', seccion: 'Accesorios', vendidos: 140, descripcion: 'Con estuche de carga.' }
    ]
  }
];
