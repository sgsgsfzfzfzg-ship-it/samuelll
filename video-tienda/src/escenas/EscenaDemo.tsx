import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {Fondo} from '../ui/Fondo';
import {Globo, GloboDatos} from '../ui/Globo';
import {Telefono} from '../ui/Telefono';
import {Titulo} from '../ui/Titulo';
import {FPS, framesEscena, IdEscena} from '../tiempos';

export type DemoProps = {
  id: IdEscena;
  numero: string;
  etiqueta: string;
  titulo: string;
  /** Tramos [inicio, fin] en segundos de la grabación real (public/demo.mp4). */
  tramos: [number, number][];
  globos: GloboDatos[];
};

/** Escena con la grabación real del sistema dentro de un teléfono. */
export const EscenaDemo: React.FC<DemoProps> = ({id, numero, etiqueta, titulo, tramos, globos}) => {
  const total = framesEscena(id);
  const segTotal = tramos.reduce((s, [a, b]) => s + (b - a), 0);
  let desde = 0;
  return (
    <AbsoluteFill>
      <Fondo />
      <Titulo numero={numero} etiqueta={etiqueta} titulo={titulo} />
      <Telefono top={560} retraso={4}>
        {tramos.map(([a, b], i) => {
          const dur = i === tramos.length - 1 ? total - desde : Math.round((total * (b - a)) / segTotal);
          const vel = ((b - a) * FPS) / dur;
          const el = (
            <Sequence key={i} from={desde} durationInFrames={dur}>
              <OffthreadVideo
                src={staticFile('demo.mp4')}
                muted
                trimBefore={Math.round(a * FPS)}
                playbackRate={vel}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            </Sequence>
          );
          desde += dur;
          return el;
        })}
      </Telefono>
      {globos.map((g, i) => (
        <Globo key={i} {...g} />
      ))}
    </AbsoluteFill>
  );
};
