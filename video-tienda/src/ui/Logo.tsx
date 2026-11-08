import React from 'react';
import {C, FUENTE} from '../tema';

/** Marca de Tienda Mingo: cuadrado verde con la "m" y el nombre. */
export const Logo: React.FC<{tam?: number; claro?: boolean; conTexto?: boolean}> = ({tam = 120, claro = true, conTexto = true}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: tam * 0.24, fontFamily: FUENTE}}>
    <div
      style={{
        width: tam,
        height: tam,
        borderRadius: tam * 0.26,
        background: claro ? C.lima : C.verde,
        color: claro ? C.verde : C.lima,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: tam * 0.72,
        letterSpacing: -tam * 0.04,
        boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        position: 'relative',
      }}
    >
      <span style={{marginTop: -tam * 0.08}}>m</span>
      <div style={{position: 'absolute', right: tam * 0.1, top: tam * 0.1, width: tam * 0.1, height: tam * 0.1, borderRadius: '50%', background: claro ? C.verde : C.lima}} />
    </div>
    {conTexto && (
      <div style={{lineHeight: 0.95}}>
        <div style={{fontSize: tam * 0.56, fontWeight: 800, color: claro ? C.blanco : C.tinta, letterSpacing: -tam * 0.015}}>Tienda Mingo</div>
        <div style={{fontSize: tam * 0.17, fontWeight: 700, color: claro ? C.lima : C.verde, letterSpacing: tam * 0.03, marginTop: tam * 0.08}}>PUNTO DE VENTA</div>
      </div>
    )}
  </div>
);
