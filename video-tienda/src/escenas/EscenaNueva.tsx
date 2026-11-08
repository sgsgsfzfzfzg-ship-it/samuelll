import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fondo} from '../ui/Fondo';
import {Globo, GloboDatos} from '../ui/Globo';
import {Telefono} from '../ui/Telefono';
import {Titulo} from '../ui/Titulo';

/** Escena de una función nueva (maqueta animada dentro del teléfono). */
export const EscenaNueva: React.FC<{
  etiqueta: string;
  titulo: string;
  globos: GloboDatos[];
  children: React.ReactNode;
}> = ({etiqueta, titulo, globos, children}) => (
  <AbsoluteFill>
    <Fondo />
    <Titulo etiqueta={etiqueta} titulo={titulo} proximamente />
    <Telefono top={560} retraso={4}>
      {children}
    </Telefono>
    {globos.map((g, i) => (
      <Globo key={i} {...g} />
    ))}
  </AbsoluteFill>
);
