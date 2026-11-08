# Video promocional · Tienda Mingo

Video vertical (1080×1920, ~2 min 18 s) que muestra el sistema de punto de venta de Tienda Mingo.
Está hecho con [Remotion](https://www.remotion.dev/) y narrado con ElevenLabs (voz "Sofía", acento colombiano).

Resultado: `out/tienda-mingo.mp4`

## Estructura del video

| # | Escena | Fuente |
|---|--------|--------|
| — | Gancho: "¿Las cuentas de tu tienda en un cuaderno?" + marca | animación |
| 01 | Punto de venta | grabación real |
| 02 | Inventario | grabación real |
| 03 | Ventas | grabación real |
| 04 | Caja | grabación real |
| 05 | Clientes y fiados | grabación real |
| 06 | Compras | grabación real |
| 07 | Reportes | grabación real |
| 08 | Guía rápida y configuración | grabación real |
| ✦ | **Lo que viene** (marcado como *Próximamente*) | maquetas animadas |
| | Recibos y cobro de fiados por WhatsApp | |
| | Alertas de stock bajo + pedido sugerido al proveedor | |
| | Asistente con IA: mejores días y proyección de ventas | |
| | Tienda en línea con pedidos a domicilio | |
| | Facturación electrónica, empleados con permisos, modo sin internet, puntos de fidelidad | |
| — | Cierre: "Vende más. Controla todo. Duerme tranquilo." | animación |

Las funciones de la sección "Lo que viene" **todavía no existen en el sistema**: son propuestas y
aparecen en el video con la etiqueta *Próximamente*.

## Cómo editarlo

- **Textos de la narración:** `src/guion.json`. Después de cambiarlos, regenera la voz.
- **Títulos y etiquetas flotantes de cada escena:** `src/TiendaMingo.tsx`.
- **Tramos de la grabación real** que se usan en cada escena: el campo `tramos` (segundos de `public/demo.mp4`).
- **Colores:** `src/tema.ts`.

Las animaciones se sincronizan solas con la voz: cada etiqueta aparece cuando la narradora dice
la palabra indicada en `palabra`.

## Comandos

```bash
npm install
```

```bash
# Regenera la narración (solo las escenas que no tengan audio; usa --forzar para todas)
ELEVENLABS_API_KEY=tu_clave npm run voz
```

```bash
# Música de fondo y efectos de sonido (ElevenLabs Music / Sound Effects)
ELEVENLABS_API_KEY=tu_clave npm run musica
ELEVENLABS_API_KEY=tu_clave node scripts/efectos.mjs
```

```bash
# Vista previa interactiva
npm run studio
```

```bash
# Render final
npm run render
```

`public/demo.mp4` es la grabación de pantalla original, recortada (sin barra del navegador).
