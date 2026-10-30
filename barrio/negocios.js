/*
 * Datos de "Todo en mi Barrio"
 *
 * Aquí se editan el nombre del barrio, las categorías y los negocios.
 * Para agregar un negocio copia uno de la lista NEGOCIOS, cambia los datos y guarda.
 *
 * - whatsapp: número con código de país, solo dígitos (ej. '584121234567').
 * - horarios: formato 24 h ['abre', 'cierra'] por día. null = ese día no abre.
 *   Si cierra pasada la medianoche escribe la hora tal cual (ej. '01:00').
 * - categoria: debe ser una de las claves de CATEGORIAS.
 *
 * Los negocios de abajo son EJEMPLOS: cámbialos por los reales del barrio.
 */
var BARRIO = {
  nombre: 'Mi Barrio',
  lema: 'Todo lo que necesitas, a la vuelta de la esquina',
  // WhatsApp de quien administra la web: aquí llegan las solicitudes de "Suma tu negocio".
  whatsappAdmin: '584120000000'
};

var CATEGORIAS = {
  comida:    { nombre: 'Comida',     icono: '🍔' },
  ropa:      { nombre: 'Ropa',       icono: '👕' },
  barberias: { nombre: 'Barberías',  icono: '💈' },
  talleres:  { nombre: 'Talleres',   icono: '🔧' },
  repuestos: { nombre: 'Repuestos',  icono: '⚙️' },
  belleza:   { nombre: 'Belleza',    icono: '💅' },
  mercado:   { nombre: 'Mercados',   icono: '🛒' },
  servicios: { nombre: 'Servicios',  icono: '🛠️' }
};

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
    nombre: 'Arepera La Esquina',
    categoria: 'comida',
    descripcion: 'Arepas rellenas, empanadas y jugos naturales. Desayunos desde temprano.',
    direccion: 'Calle 5 con Av. Principal',
    whatsapp: '584121111111',
    horarios: TODOS_LOS_DIAS('06:30', '14:00'),
    etiquetas: ['desayunos', 'delivery', 'empanadas']
  },
  {
    nombre: 'Pizzas Don Toto',
    categoria: 'comida',
    descripcion: 'Pizza al horno de leña, por porción o entera. Promo 2x1 los martes.',
    direccion: 'Av. Principal, local 12',
    whatsapp: '584121111112',
    horarios: TODOS_LOS_DIAS('17:00', '23:30'),
    etiquetas: ['pizza', 'delivery', 'cena']
  },
  {
    nombre: 'Boutique Valentina',
    categoria: 'ropa',
    descripcion: 'Ropa de dama y caballero, jeans, zapatos y accesorios a buen precio.',
    direccion: 'Centro comercial El Barrio, nivel 1',
    whatsapp: '584121111113',
    horarios: LUN_SAB('09:00', '19:00'),
    etiquetas: ['jeans', 'zapatos', 'accesorios']
  },
  {
    nombre: 'Uniformes y Más',
    categoria: 'ropa',
    descripcion: 'Uniformes escolares, camisas bordadas y ropa de trabajo por encargo.',
    direccion: 'Calle 8, casa 23',
    whatsapp: '584121111114',
    horarios: LUN_SAB('08:00', '17:00'),
    etiquetas: ['uniformes', 'bordados', 'escolar']
  },
  {
    nombre: 'Barbería El Flow',
    categoria: 'barberias',
    descripcion: 'Cortes clásicos y modernos, perfilado de barba y diseños. Se atiende por cita.',
    direccion: 'Calle 3, frente a la plaza',
    whatsapp: '584121111115',
    horarios: LUN_SAB('09:00', '20:00'),
    etiquetas: ['cortes', 'barba', 'citas']
  },
  {
    nombre: 'Barber Shop Los Amigos',
    categoria: 'barberias',
    descripcion: 'Corte + barba con toalla caliente. Abierto también los domingos.',
    direccion: 'Av. Bolívar, local 4',
    whatsapp: '584121111116',
    horarios: TODOS_LOS_DIAS('10:00', '21:00'),
    etiquetas: ['cortes', 'barba', 'domingos']
  },
  {
    nombre: 'Taller Mecánico Hermanos Pérez',
    categoria: 'talleres',
    descripcion: 'Mecánica general, frenos, suspensión y cambio de aceite. Diagnóstico con escáner.',
    direccion: 'Calle 10, galpón azul',
    whatsapp: '584121111117',
    horarios: LUN_SAB('07:30', '17:30'),
    etiquetas: ['mecánica', 'frenos', 'aceite', 'escáner']
  },
  {
    nombre: 'Moto Taller Rayo',
    categoria: 'talleres',
    descripcion: 'Reparación y mantenimiento de motos. Llantas, cadenas y servicio rápido.',
    direccion: 'Callejón 2, al lado de la bodega',
    whatsapp: '584121111118',
    horarios: LUN_SAB('08:00', '18:00'),
    etiquetas: ['motos', 'llantas', 'cadenas']
  },
  {
    nombre: 'Electroautos Mario',
    categoria: 'talleres',
    descripcion: 'Electricidad automotriz, baterías, alternadores y aire acondicionado.',
    direccion: 'Av. Principal, al fondo del estacionamiento',
    whatsapp: '584121111119',
    horarios: LUN_SAB('08:00', '16:00'),
    etiquetas: ['electricidad', 'baterías', 'aire acondicionado']
  },
  {
    nombre: 'Repuestos El Primo',
    categoria: 'repuestos',
    descripcion: 'Repuestos para carros nacionales e importados, filtros, aceites y correas.',
    direccion: 'Calle 10 con Calle 11',
    whatsapp: '584121111120',
    horarios: LUN_SAB('08:00', '17:00'),
    etiquetas: ['filtros', 'aceite', 'correas', 'carros']
  },
  {
    nombre: 'MotoRepuestos 2 Ruedas',
    categoria: 'repuestos',
    descripcion: 'Todo en repuestos para motos: pastillas, cables, bujías, cascos y accesorios.',
    direccion: 'Av. Bolívar, local 9',
    whatsapp: '584121111121',
    horarios: LUN_SAB('08:30', '18:00'),
    etiquetas: ['motos', 'cascos', 'bujías']
  },
  {
    nombre: 'Salón de Belleza Divas',
    categoria: 'belleza',
    descripcion: 'Uñas, cejas, pestañas, tintes y alisados.',
    direccion: 'Calle 4, casa 7',
    whatsapp: '584121111122',
    horarios: LUN_SAB('09:00', '18:00'),
    etiquetas: ['uñas', 'cejas', 'pestañas', 'cabello']
  },
  {
    nombre: 'Bodega Mi Vecino',
    categoria: 'mercado',
    descripcion: 'Víveres, charcutería, frutas y verduras. Recargas y pagos con tarjeta.',
    direccion: 'Callejón 2, esquina',
    whatsapp: '584121111123',
    horarios: TODOS_LOS_DIAS('07:00', '22:00'),
    etiquetas: ['víveres', 'verduras', 'recargas']
  },
  {
    nombre: 'TecniCel',
    categoria: 'servicios',
    descripcion: 'Reparación de celulares, cambio de pantallas, forros y cargadores.',
    direccion: 'Centro comercial El Barrio, nivel 2',
    whatsapp: '584121111124',
    horarios: LUN_SAB('09:00', '18:30'),
    etiquetas: ['celulares', 'pantallas', 'accesorios']
  },
  {
    nombre: 'Lavandería Burbujas',
    categoria: 'servicios',
    descripcion: 'Lavado y planchado por kilo. Retiro y entrega a domicilio en el barrio.',
    direccion: 'Calle 6, local 2',
    whatsapp: '584121111125',
    horarios: LUN_SAB('08:00', '19:00'),
    etiquetas: ['lavado', 'planchado', 'domicilio']
  }
];
