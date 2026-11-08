// Renderiza fotogramas sueltos para revisar el diseño sin renderizar todo el video.
// Uso: node scripts/capturas.mjs 60 500 900 ...   (salen en out/capturas/)
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const raiz = path.resolve(import.meta.dirname, '..');
const salida = path.join(raiz, "out/capturas", process.env.COMPOSICION || "TiendaMingo");
fs.mkdirSync(salida, {recursive: true});
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({entryPoint: path.join(raiz, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: process.env.COMPOSICION || "TiendaMingo", browserExecutable});
for (const frame of process.argv.slice(2).map(Number)) {
  await renderStill({composition, serveUrl, frame, output: path.join(salida, `f${frame}.png`), browserExecutable, scale: 0.5});
  console.log('frame', frame);
}
