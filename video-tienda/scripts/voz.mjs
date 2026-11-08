// Genera la narración de cada escena con ElevenLabs y guarda las duraciones.
// Uso: ELEVENLABS_API_KEY=tu_clave node scripts/voz.mjs
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const VOZ = process.env.ELEVENLABS_VOICE_ID || 'b2htR0pMe28pYwCY9gnP'; // Sofía (acento colombiano)
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error('Falta ELEVENLABS_API_KEY');

const raiz = path.resolve(import.meta.dirname, '..');
const guion = JSON.parse(fs.readFileSync(path.join(raiz, 'src/guion.json'), 'utf8'));
const dir = path.join(raiz, 'public/voz');
fs.mkdirSync(dir, {recursive: true});

const duraciones = {};
for (const [i, escena] of guion.entries()) {
  const archivo = path.join(dir, `${escena.id}.mp3`);
  if (!fs.existsSync(archivo) || process.argv.includes('--forzar')) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        text: escena.texto,
        model_id: 'eleven_multilingual_v2',
        previous_text: guion[i - 1]?.texto,
        next_text: guion[i + 1]?.texto,
        voice_settings: {stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true},
      }),
    });
    if (!res.ok) throw new Error(`${escena.id}: ${res.status} ${await res.text()}`);
    fs.writeFileSync(archivo, Buffer.from(await res.arrayBuffer()));
  }
  const seg = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo]).toString());
  duraciones[escena.id] = seg;
  console.log(escena.id.padEnd(12), seg.toFixed(2), 's');
}
fs.writeFileSync(path.join(raiz, 'src/duraciones.json'), JSON.stringify(duraciones, null, 2) + '\n');
