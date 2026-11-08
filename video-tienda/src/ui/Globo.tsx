import React from 'react';
import {Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE} from '../tema';
import {Icono, NombreIcono} from './Iconos';

export type GloboDatos = {
  /** Frame de la escena en que aparece. */
  en: number;
  texto: string;
  icono: NombreIcono;
  lado: 'izq' | 'der';
  /** Posición vertical en px. */
  y: number;
  sonido?: 'pop' | 'caja';
};

/** Etiqueta flotante que aparece sobre el borde del teléfono para resaltar una función. */
export const Globo: React.FC<GloboDatos> = ({en, texto, icono, lado, y, sonido = 'pop'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - en, fps, config: {damping: 11, stiffness: 140}});
  const I = Icono[icono];
  return (
    <>
      <Sequence from={en} durationInFrames={45} layout="none">
        <Audio src={staticFile(`sfx-${sonido}.mp3`)} volume={sonido === 'caja' ? 0.5 : 0.35} />
      </Sequence>
      <div
        style={{
          position: 'absolute',
          top: y,
          [lado === 'izq' ? 'left' : 'right']: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '18px 30px 18px 18px',
          borderRadius: 999,
          background: C.blanco,
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          fontFamily: FUENTE,
          fontSize: 38,
          fontWeight: 800,
          color: C.tinta,
          opacity: interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
          transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [lado === 'izq' ? -8 : 8, 0])}deg)`,
          transformOrigin: lado === 'izq' ? 'left center' : 'right center',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 66,
            height: 66,
            borderRadius: '50%',
            background: C.verde,
            color: C.lima,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <I size={36} grosor={2.4} />
        </div>
        {texto}
      </div>
    </>
  );
};
