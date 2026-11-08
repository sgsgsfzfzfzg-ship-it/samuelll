import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE} from '../tema';
import {Fondo} from '../ui/Fondo';
import {Logo} from '../ui/Logo';
import {cuandoDice} from '../tiempos';
import {useHorizontal} from '../formato';

const FRASES: [string, string][] = [
  ['Vende más.', 'Vende'],
  ['Controla todo.', 'controla'],
  ['Duerme tranquilo.', 'duerme'],
];

export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = useHorizontal();
  const logo = spring({frame: f - 2, fps, config: {damping: 12}});
  const cta = spring({frame: f - cuandoDice('outro', 'tranquilo') - 20, fps, config: {damping: 11}});
  const pulso = 1 + Math.max(0, Math.sin((f - 120) / 8)) * 0.03 * cta;
  return (
    <AbsoluteFill style={{fontFamily: FUENTE}}>
      <Fondo />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${interpolate(logo, [0, 1], [0.5, 1])})`, opacity: logo}}>
          <Logo tam={h ? 140 : 180} />
        </div>
        <div style={{marginTop: h ? 60 : 110, display: 'flex', flexDirection: h ? 'row' : 'column', alignItems: 'center', gap: h ? 36 : 10}}>
          {FRASES.map(([frase, palabra], i) => {
            const s = spring({frame: f - cuandoDice('outro', palabra), fps, config: {damping: 14}});
            return (
              <div
                key={frase}
                style={{
                  fontSize: h ? 76 : 110,
                  whiteSpace: 'nowrap',
                  fontWeight: 900,
                  letterSpacing: -4,
                  color: i === 2 ? C.lima : C.blanco,
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
                }}
              >
                {frase}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: h ? 80 : 110,
            background: C.lima,
            color: C.verdeOscuro,
            fontSize: 52,
            fontWeight: 900,
            borderRadius: 999,
            padding: '30px 70px',
            opacity: cta,
            transform: `scale(${cta * pulso})`,
            boxShadow: '0 0 80px rgba(198,238,110,0.45)',
          }}
        >
          ¡Empieza hoy!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
