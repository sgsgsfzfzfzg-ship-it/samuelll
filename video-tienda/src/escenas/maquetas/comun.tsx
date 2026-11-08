import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE} from '../../tema';

/** Animación de entrada estándar a partir de un frame. */
export const useEntrada = (desde: number, damping = 14) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - desde, fps, config: {damping}});
};

export const Aparece: React.FC<{desde: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties}> = ({
  desde,
  children,
  dy = 40,
  style,
}) => {
  const s = useEntrada(desde);
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
        transform: `translateY(${interpolate(s, [0, 1], [dy, 0])}px) scale(${interpolate(s, [0, 1], [0.92, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const pesos = (n: number) => '$ ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Pantalla base de la app (fondo y tipografía). */
export const PantallaApp: React.FC<{children: React.ReactNode; fondo?: string}> = ({children, fondo = '#F6F7F4'}) => (
  <div style={{position: 'absolute', inset: 0, background: fondo, fontFamily: FUENTE, color: C.tinta, overflow: 'hidden'}}>{children}</div>
);

export const Tarjeta: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: '#fff', borderRadius: 26, border: `1.5px solid ${C.linea}`, padding: 26, boxShadow: '0 6px 20px rgba(15,31,24,0.06)', ...style}}>
    {children}
  </div>
);

/** Encabezado verde estilo app. */
export const Cabecera: React.FC<{titulo: string; sub?: string; icono?: React.ReactNode}> = ({titulo, sub, icono}) => (
  <div style={{background: C.verde, color: '#fff', padding: '92px 30px 26px', display: 'flex', alignItems: 'center', gap: 18}}>
    {icono && (
      <div style={{width: 64, height: 64, borderRadius: '50%', background: C.lima, color: C.verde, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 30}}>
        {icono}
      </div>
    )}
    <div>
      <div style={{fontSize: 32, fontWeight: 800}}>{titulo}</div>
      {sub && <div style={{fontSize: 22, opacity: 0.8, marginTop: 2}}>{sub}</div>}
    </div>
  </div>
);
