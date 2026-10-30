# Todo en mi Barrio

Una sola web con todos los negocios y servicios del barrio: comida, ropa, barberías,
talleres, repuestos, belleza, mercados y más.

## Qué hace

- **Buscador**: escribe "corte", "frenos", "pizza"… busca en nombre, descripción, dirección y etiquetas (sin importar acentos).
- **Categorías** con un toque.
- **Abierto / cerrado ahora** según el horario de cada negocio, con filtro "Solo abiertos ahora".
- Botón de **WhatsApp** directo al negocio y **Cómo llegar** (Google Maps).
- Formulario **"¿Tienes un negocio?"** que envía la solicitud por WhatsApp al administrador.
- Funciona en celular, modo oscuro automático, sin servidor ni base de datos.

## Cómo editarla

Todo se cambia en `negocios.js`:

- `BARRIO`: nombre del barrio, lema y tu WhatsApp (donde llegan las solicitudes).
- `CATEGORIAS`: agrega o quita categorías.
- `NEGOCIOS`: la lista. Los que vienen son **ejemplos**; cámbialos por los reales.

## Cómo verla

Abre `index.html` en el navegador. Para publicarla gratis basta subir la carpeta
a GitHub Pages, Netlify o Vercel.
