// Genera efectos de sonido cortos con ElevenLabs.
// Uso: ELEVENLABS_API_KEY=tu_clave node scripts/efectos.mjs
import fs from 'node:fs';
import path from 'node:path';

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error('Falta ELEVENLABS_API_KEY');
const raiz = path.resolve(import.meta.dirname, '..');
const efectos = {
  whoosh: ['Soft quick airy whoosh transition sound, clean, modern UI', 0.8],
  pop: ['Short soft bubbly UI pop notification sound', 0.5],
  caja: ['Pleasant cash register cha-ching coin sound, short and clean', 1.2],
  brillo: ['Magical shimmering sparkle reveal sound, bright and short', 1.5],
};
for (const [nombre, [texto, seg]] of Object.entries(efectos)) {
  const res = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {
    method: 'POST',
    headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'},
    body: JSON.stringify({text: texto, duration_seconds: seg, prompt_influence: 0.6}),
  });
  if (!res.ok) throw new Error(`${nombre}: ${res.status} ${await res.text()}`);
  fs.writeFileSync(path.join(raiz, `public/sfx-${nombre}.mp3`), Buffer.from(await res.arrayBuffer()));
  console.log(nombre, 'listo');
}
