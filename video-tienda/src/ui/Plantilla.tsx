import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useHorizontal} from '../formato';
import {Fondo} from './Fondo';
import {Globo, GloboDatos} from './Globo';
import {Telefono} from './Telefono';
import {Titulo} from './Titulo';

/**
 * Escena con título, etiquetas de funciones y un teléfono.
 * Vertical: título arriba, teléfono abajo y etiquetas flotando sobre el teléfono.
 * Horizontal: título y etiquetas en columna a la izquierda, teléfono a la derecha.
 */
export const Plantilla: React.FC<{
  numero?: string;
  etiqueta: string;
  titulo: string;
  proximamente?: boolean;
  globos: GloboDatos[];
  children: React.ReactNode;
}> = ({numero, etiqueta, titulo, proximamente, globos, children}) => {
  const horizontal = useHorizontal();
  if (horizontal) {
    return (
      <AbsoluteFill>
        <Fondo />
        <div style={{position: 'absolute', left: 130, top: 0, bottom: 0, width: 900, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Titulo numero={numero} etiqueta={etiqueta} titulo={titulo} proximamente={proximamente} />
          <div style={{marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22}}>
            {globos.map((g, i) => (
              <Globo key={i} {...g} />
            ))}
          </div>
        </div>
        <Telefono retraso={4}>{children}</Telefono>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Fondo />
      <Titulo numero={numero} etiqueta={etiqueta} titulo={titulo} proximamente={proximamente} />
      <Telefono top={560} retraso={4}>
        {children}
      </Telefono>
      {globos.map((g, i) => (
        <Globo key={i} {...g} />
      ))}
    </AbsoluteFill>
  );
};
