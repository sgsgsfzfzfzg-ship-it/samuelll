import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE} from '../tema';
import {Fondo} from '../ui/Fondo';
import {Icono} from '../ui/Iconos';
import {Logo} from '../ui/Logo';
import {cuandoDice} from '../tiempos';

const MODULOS = ['Punto de venta', 'Inventario', 'Ventas', 'Caja', 'Clientes y fiados', 'Compras', 'Reportes'];

export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cambio = cuandoDice('intro', 'Te presento', 6);

  // Parte 1: el cuaderno de siempre
  const p1 = spring({frame: f, fps, config: {damping: 14}});
  const tacha = interpolate(f, [cambio - 30, cambio - 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const salida1 = interpolate(f, [cambio - 6, cambio + 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tiembla = Math.sin(f * 1.3) * 3 * (1 - tacha);

  // Parte 2: la marca
  const p2 = spring({frame: f - cambio, fps, config: {damping: 13}});
  const lema = spring({frame: f - cuandoDice('intro', 'todo tu negocio'), fps, config: {damping: 16}});

  return (
    <AbsoluteFill style={{fontFamily: FUENTE}}>
      <Fondo />
      {salida1 > 0 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: salida1}}>
          <div style={{transform: `scale(${p1}) rotate(${tiembla}deg)`, position: 'relative', color: C.lima}}>
            <Icono.libreta size={360} grosor={1.3} />
            <svg width={420} height={420} viewBox="0 0 100 100" style={{position: 'absolute', left: -30, top: -30}}>
              <line x1="12" y1="12" x2={12 + 76 * tacha} y2={12 + 76 * tacha} stroke={C.rojo} strokeWidth="7" strokeLinecap="round" />
              <line x1="88" y1="12" x2={88 - 76 * tacha} y2={12 + 76 * tacha} stroke={C.rojo} strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
          <div
            style={{
              marginTop: 70,
              fontSize: 84,
              fontWeight: 900,
              color: C.blanco,
              textAlign: 'center',
              lineHeight: 1.05,
              letterSpacing: -2,
              padding: '0 80px',
              opacity: p1,
              transform: `translateY(${interpolate(p1, [0, 1], [40, 0])}px)`,
            }}
          >
            ¿Las cuentas de tu tienda
            <br />
            <span style={{color: C.lima}}>en un cuaderno?</span>
          </div>
        </AbsoluteFill>
      )}
      {f >= cambio - 2 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{transform: `scale(${interpolate(p2, [0, 1], [0.6, 1])})`, opacity: p2}}>
            <Logo tam={170} />
          </div>
          <div
            style={{
              marginTop: 80,
              fontSize: 76,
              fontWeight: 900,
              color: C.blanco,
              textAlign: 'center',
              lineHeight: 1.08,
              letterSpacing: -2,
              opacity: lema,
              transform: `translateY(${interpolate(lema, [0, 1], [40, 0])}px)`,
            }}
          >
            Todo tu negocio,
            <br />
            <span style={{color: C.lima}}>en la palma de tu mano.</span>
          </div>
          <div style={{marginTop: 80, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, padding: '0 90px'}}>
            {MODULOS.map((m, i) => {
              const s = spring({frame: f - cambio - 20 - i * 4, fps, config: {damping: 14}});
              return (
                <div
                  key={m}
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: C.lima,
                    border: `2px solid rgba(221,244,168,0.4)`,
                    background: 'rgba(221,244,168,0.08)',
                    borderRadius: 999,
                    padding: '12px 26px',
                    opacity: s,
                    transform: `scale(${s})`,
                  }}
                >
                  {m}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
