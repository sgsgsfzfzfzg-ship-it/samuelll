import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../tema';

/** Fondo verde con manchas de luz que se mueven suave y una trama de puntos. */
export const Fondo: React.FC<{claro?: boolean}> = ({claro = false}) => {
  const f = useCurrentFrame();
  const a = f / 90;
  return (
    <AbsoluteFill
      style={{
        background: claro
          ? `linear-gradient(170deg, ${C.crema} 0%, #E8F0E2 100%)`
          : `linear-gradient(165deg, ${C.verdeOscuro} 0%, ${C.noche} 60%, #04130E 100%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          left: -380 + Math.sin(a) * 120,
          top: -320 + Math.cos(a * 0.8) * 100,
          background: `radial-gradient(circle, ${claro ? 'rgba(198,238,110,0.45)' : 'rgba(46,107,82,0.75)'} 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          right: -420 + Math.cos(a * 0.7) * 110,
          bottom: -260 + Math.sin(a * 0.9) * 120,
          background: `radial-gradient(circle, ${claro ? 'rgba(31,77,58,0.18)' : 'rgba(198,238,110,0.16)'} 0%, transparent 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${claro ? 'rgba(15,31,24,0.08)' : 'rgba(221,244,168,0.08)'} 2px, transparent 2px)`,
          backgroundSize: '44px 44px',
          backgroundPosition: `0 ${-(f * 0.4) % 44}px`,
        }}
      />
    </AbsoluteFill>
  );
};
