import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE} from '../tema';
import {Fondo} from '../ui/Fondo';
import {Icono, NombreIcono} from '../ui/Iconos';
import {Titulo} from '../ui/Titulo';
import {cuandoDice} from '../tiempos';

const TARJETAS: {icono: NombreIcono; titulo: string; texto: string; palabra: string}[] = [
  {icono: 'recibo', titulo: 'Facturación electrónica', texto: 'Factura válida ante la DIAN desde la misma venta.', palabra: 'facturación'},
  {icono: 'personas', titulo: 'Empleados y permisos', texto: 'Cada quien con su usuario. Tú ves todo.', palabra: 'empleados'},
  {icono: 'wifiOff', titulo: 'Modo sin internet', texto: 'Sigue vendiendo; se sincroniza al volver la señal.', palabra: 'modo sin'},
  {icono: 'estrella', titulo: 'Puntos de fidelidad', texto: 'Premia a tus clientes para que siempre vuelvan.', palabra: 'puntos'},
];

export const Extras: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{fontFamily: FUENTE}}>
      <Fondo />
      <Titulo etiqueta="Y además" titulo="Tu tienda, al siguiente nivel" proximamente />
      <div style={{position: 'absolute', top: 600, left: 70, right: 70, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34}}>
        {TARJETAS.map((t, i) => {
          const en = cuandoDice('extras', t.palabra);
          const s = spring({frame: f - en, fps, config: {damping: 12}});
          const I = Icono[t.icono];
          return (
            <div
              key={t.titulo}
              style={{
                background: i % 3 === 0 ? C.lima : C.blanco,
                borderRadius: 44,
                padding: 40,
                height: 520,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
                opacity: interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
                transform: `translateY(${interpolate(s, [0, 1], [120, 0])}px) rotate(${interpolate(s, [0, 1], [i % 2 ? 6 : -6, 0])}deg)`,
              }}
            >
              <Sequence from={en} durationInFrames={30} layout="none">
                <Audio src={staticFile('sfx-pop.mp3')} volume={0.35} />
              </Sequence>
              <div style={{width: 120, height: 120, borderRadius: 34, background: C.verde, color: C.lima, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <I size={66} />
              </div>
              <div>
                <div style={{fontSize: 50, fontWeight: 900, color: C.tinta, lineHeight: 1.02, letterSpacing: -1}}>{t.titulo}</div>
                <div style={{fontSize: 30, fontWeight: 500, color: '#3d4d45', marginTop: 16, lineHeight: 1.3}}>{t.texto}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
