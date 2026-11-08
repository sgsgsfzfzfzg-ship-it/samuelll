import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE} from '../tema';

/** Encabezado de escena: etiqueta pequeña + título grande que entra palabra por palabra. */
export const Titulo: React.FC<{
  numero?: string;
  etiqueta: string;
  titulo: string;
  proximamente?: boolean;
  top?: number;
}> = ({numero, etiqueta, titulo, proximamente, top = 150}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const eti = spring({frame: f - 2, fps, config: {damping: 18}});
  const palabras = titulo.split(' ');
  return (
    <div style={{position: 'absolute', top, left: 80, right: 80, fontFamily: FUENTE}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: eti,
          transform: `translateX(${interpolate(eti, [0, 1], [-40, 0])}px)`,
        }}
      >
        {numero && (
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: C.verdeOscuro,
              background: C.lima,
              borderRadius: 14,
              padding: '6px 14px',
            }}
          >
            {numero}
          </div>
        )}
        <div style={{fontSize: 32, fontWeight: 700, letterSpacing: 5, color: C.lima, textTransform: 'uppercase'}}>{etiqueta}</div>
        {proximamente && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 3,
              color: C.verdeOscuro,
              background: `linear-gradient(90deg, ${C.limaFuerte}, #FFE58A)`,
              borderRadius: 999,
              padding: '8px 18px',
              boxShadow: '0 0 30px rgba(198,238,110,0.5)',
            }}
          >
            ✦ PRÓXIMAMENTE
          </div>
        )}
      </div>
      <div style={{marginTop: 26, fontSize: 96, lineHeight: 1.02, fontWeight: 900, color: C.blanco, letterSpacing: -3}}>
        {palabras.map((p, i) => {
          const s = spring({frame: f - 6 - i * 4, fps, config: {damping: 14}});
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: 24,
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
              }}
            >
              {p}
            </span>
          );
        })}
      </div>
    </div>
  );
};
