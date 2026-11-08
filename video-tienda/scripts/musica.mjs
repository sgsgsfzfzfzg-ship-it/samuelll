// Genera la música de fondo con ElevenLabs Music.
// Uso: ELEVENLABS_API_KEY=tu_clave node scripts/musica.mjs [segundos]
import fs from 'node:fs';
import path from 'node:path';

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error('Falta ELEVENLABS_API_KEY');
const seg = Number(process.argv[2] || 150);
const raiz = path.resolve(import.meta.dirname, '..');

const res = await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', {
  method: 'POST',
  headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'},
  body: JSON.stringify({
    prompt: 'Upbeat, warm and modern corporate background music for a product demo ad of a small-business point-of-sale app. Light acoustic guitar, soft marimba plucks, claps and a gentle groove, optimistic and friendly, Latin pop touch. Instrumental only, no vocals. Steady energy, clean ending.',
    music_length_ms: Math.round(seg * 1000),
    force_instrumental: true,
  }),
});
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
fs.writeFileSync(path.join(raiz, 'public/musica.mp3'), Buffer.from(await res.arrayBuffer()));
console.log('public/musica.mp3 listo');
