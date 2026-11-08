import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE} from '../tema';
import {Fondo} from '../ui/Fondo';
import {Icono, NombreIcono} from '../ui/Iconos';

const ORBITA: NombreIcono[] = ['chat', 'alerta', 'cerebro', 'tienda', 'recibo', 'personas', 'wifiOff', 'estrella'];

export const Teaser: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 4, fps, config: {damping: 12}});
  const s2 = spring({frame: f - 18, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{fontFamily: FUENTE}}>
      <Fondo />
      <Sequence from={4} layout="none">
        <Audio src={staticFile('sfx-brillo.mp3')} volume={0.45} />
      </Sequence>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        {ORBITA.map((nombre, i) => {
          const I = Icono[nombre];
          const ang = (i / ORBITA.length) * Math.PI * 2 + f / 70;
          const r = 400 * spring({frame: f - 10 - i * 2, fps, config: {damping: 15}});
          return (
            <div
              key={nombre}
              style={{
                position: 'absolute',
                left: 540 + Math.cos(ang) * r - 55,
                top: 960 + Math.sin(ang) * r * 1.25 - 55,
                width: 110,
                height: 110,
                borderRadius: 32,
                background: 'rgba(221,244,168,0.1)',
                border: '2px solid rgba(221,244,168,0.35)',
                color: C.lima,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <I size={56} />
            </div>
          );
        })}
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 6,
            color: C.verdeOscuro,
            background: `linear-gradient(90deg, ${C.limaFuerte}, #FFE58A)`,
            borderRadius: 999,
            padding: '12px 28px',
            opacity: s2,
            transform: `scale(${s2})`,
            boxShadow: '0 0 60px rgba(198,238,110,0.5)',
          }}
        >
          ✦ PRÓXIMAMENTE
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 150,
            fontWeight: 900,
            color: C.blanco,
            letterSpacing: -6,
            lineHeight: 0.95,
            textAlign: 'center',
            transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
            opacity: s,
            textShadow: '0 0 80px rgba(198,238,110,0.35)',
          }}
        >
          Lo que
          <br />
          <span style={{color: C.lima}}>viene</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
