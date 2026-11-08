import React from 'react';
import {Composition} from 'remotion';
import {TiendaMingo} from './TiendaMingo';
import {ALTO, ANCHO, DURACION_TOTAL, FPS} from './tiempos';

export const Root: React.FC = () => (
  <Composition id="TiendaMingo" component={TiendaMingo} durationInFrames={DURACION_TOTAL} fps={FPS} width={ANCHO} height={ALTO} />
);
