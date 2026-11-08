import guion from './guion.json';
import duraciones from './duraciones.json';

export const FPS = 30;
export const ANCHO = 1080;
export const ALTO = 1920;
/** Frames de silencio antes de que empiece la voz en cada escena. */
export const PAUSA_ENTRADA = 12;
/** Frames de silencio después de la voz (antes de la transición). */
export const PAUSA_SALIDA = 10;
/** Duración de cada transición entre escenas. */
export const TRANSICION = 16;
/** Frames extra al final del cierre. */
export const COLA_FINAL = 60;

export type IdEscena = keyof typeof duraciones;

export const ORDEN = guion.map((g) => g.id) as IdEscena[];

export const textoDe = (id: IdEscena) => guion.find((g) => g.id === id)!.texto;
export const framesVoz = (id: IdEscena) => Math.ceil(duraciones[id] * FPS);

export const framesEscena = (id: IdEscena) =>
  PAUSA_ENTRADA + framesVoz(id) + PAUSA_SALIDA + TRANSICION + (id === 'outro' ? COLA_FINAL : 0);

export const DURACION_TOTAL =
  ORDEN.reduce((s, id) => s + framesEscena(id), 0) - TRANSICION * (ORDEN.length - 1);

/**
 * Frame (dentro de la escena) en el que la narradora dice `palabra`.
 * Se estima por la posición del texto dentro de la frase: suficiente para sincronizar animaciones.
 */
export const cuandoDice = (id: IdEscena, palabra: string, adelanto = 4) => {
  const texto = textoDe(id);
  const i = texto.indexOf(palabra);
  if (i < 0) throw new Error(`"${palabra}" no está en el guion de ${id}`);
  return Math.max(0, Math.round(PAUSA_ENTRADA + (i / texto.length) * framesVoz(id)) - adelanto);
};
