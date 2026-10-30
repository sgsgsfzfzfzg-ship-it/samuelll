# Barrio — la app de pedidos de tu barrio

Una web tipo app de domicilios donde los vecinos piden comida, mercado, ropa y repuestos,
y reservan en barberías, talleres y salones de belleza del barrio. Todo en un solo lugar.

## Qué tiene

**Para el cliente**
- Portada con saludo, categorías, banners de promociones y buscador.
- **Ofertas del día** con % de descuento y cuenta regresiva hasta medianoche.
- **Lo más pedido en el barrio** (ranking #1, #2…) y **Servicios más reservados**.
- Página de cada tienda: portada, calificación ★, tiempo y costo de envío, abierto/cerrado, menú por secciones.
- Ficha de producto con estrellas, pedidos, precio antes/ahora y **"También te puede interesar"**.
- **Carrito** con varias tiendas a la vez, subtotal y envío por tienda, total.
- Pago: datos de entrega, forma de pago (efectivo, transferencia, tarjeta al recibir) y nota.
- **Reservas** para servicios (barberías, talleres, belleza): eliges día y hora.
- **Mis pedidos**, **Pide de nuevo** con un toque y **Visto recientemente**.
- Dirección de entrega guardada, modo oscuro automático, pensada para el celular.

**Para las tiendas**
- Cada pedido o reserva le llega a la tienda **por WhatsApp**, ya armado: productos, total, dirección, teléfono, forma de pago y nota.
- Sección **"Vende en Barrio"** para que nuevos negocios pidan entrar (te llega a tu WhatsApp).

No necesita servidor ni base de datos: el carrito y los pedidos se guardan en el navegador del cliente.

## Cómo editarla

Todo se cambia en `negocios.js` (tiene instrucciones arriba):

- `BARRIO`: nombre del barrio, moneda, tu WhatsApp y formas de pago.
- `CATEGORIAS` y `BANNERS` de la portada.
- `NEGOCIOS`: cada tienda con sus productos, precios, horarios y WhatsApp.
  Pon `antes` en un producto para que salga en ofertas, y `foto` (enlace a una imagen) para usar fotos reales en vez de emojis.

Las tiendas, precios y calificaciones que trae son **ejemplos**: cámbialos por los reales.

## Cómo verla

Abre `index.html` en el navegador. Para publicarla gratis basta subir la carpeta
a GitHub Pages, Netlify o Vercel.

## Siguientes pasos posibles

- Panel para que cada tienda edite sus productos sin tocar código (requiere servidor/base de datos).
- Reseñas reales de los clientes, seguimiento del domiciliario en el mapa y pago en línea.
