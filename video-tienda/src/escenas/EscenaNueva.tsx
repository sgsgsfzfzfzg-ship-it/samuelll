import React from 'react';
import {GloboDatos} from '../ui/Globo';
import {Plantilla} from '../ui/Plantilla';

/** Escena de una función nueva (maqueta animada dentro del teléfono). */
export const EscenaNueva: React.FC<{
  etiqueta: string;
  titulo: string;
  globos: GloboDatos[];
  children: React.ReactNode;
}> = ({etiqueta, titulo, globos, children}) => (
  <Plantilla etiqueta={etiqueta} titulo={titulo} globos={globos} proximamente>
    {children}
  </Plantilla>
);
