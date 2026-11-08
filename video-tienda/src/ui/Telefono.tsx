import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useHorizontal} from '../formato';

export const PANTALLA_ANCHO = 640;
export const PANTALLA_ALTO = Math.round(640 * (1312 / 720));
const BISEL = 18;

/** Teléfono con entrada animada y una flotación suave. */
export const Telefono: React.FC<{children: React.ReactNode; top?: number; retraso?: number; escala?: number}> = ({
  children,
  top = 600,
  retraso = 0,
  escala = 1,
}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const horizontal = useHorizontal();
  const ent = spring({frame: f - retraso, fps, config: {damping: 16, mass: 0.9}});
  const flota = Math.sin(f / 28) * 6;
  const giro = interpolate(ent, [0, 1], [10, 0]);
  const ancho = PANTALLA_ANCHO + BISEL * 2;
  const alto = PANTALLA_ALTO + BISEL * 2;
  // En horizontal el teléfono va a la derecha y más pequeño para que quepa en 1080 px de alto.
  const esc = horizontal ? 0.76 : escala;
  const izquierda = horizontal ? 1440 - ancho / 2 : (width - ancho) / 2;
  const arriba = horizontal ? (height - alto * esc) / 2 : top;
  return (
    <div
      style={{
        position: 'absolute',
        left: izquierda,
        top: arriba,
        width: ancho,
        height: alto,
        transform: `perspective(2000px) translateY(${interpolate(ent, [0, 1], [700, 0]) + flota}px) rotateX(${giro}deg) scale(${esc})`,
        transformOrigin: '50% 0%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 86,
          background: 'linear-gradient(145deg,#2a2f2c,#0b0d0c)',
          boxShadow: '0 60px 120px rgba(0,0,0,0.55), 0 0 0 3px #3a403c inset',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: BISEL,
          top: BISEL,
          width: PANTALLA_ANCHO,
          height: PANTALLA_ALTO,
          borderRadius: 70,
          overflow: 'hidden',
          background: '#F6F7F4',
        }}
      >
        {children}
        <div style={{position: 'absolute', top: 18, left: '50%', marginLeft: -78, width: 156, height: 42, borderRadius: 30, background: '#000'}} />
      </div>
    </div>
  );
};
