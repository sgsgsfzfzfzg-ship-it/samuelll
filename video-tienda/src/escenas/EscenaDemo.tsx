import React from 'react';
import {OffthreadVideo, Sequence, staticFile} from 'remotion';
import {GloboDatos} from '../ui/Globo';
import {Plantilla} from '../ui/Plantilla';
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
    <Plantilla numero={numero} etiqueta={etiqueta} titulo={titulo} globos={globos}>
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
    </Plantilla>
  );
};
