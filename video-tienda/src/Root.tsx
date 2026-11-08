import React from 'react';
import {Composition} from 'remotion';
import {TiendaMingo} from './TiendaMingo';
import {ALTO, ANCHO, DURACION_TOTAL, FPS} from './tiempos';

export const Root: React.FC = () => (
  <>
    {/* Vertical para celular, WhatsApp, Reels y TikTok */}
    <Composition id="TiendaMingo" component={TiendaMingo} durationInFrames={DURACION_TOTAL} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{formato: 'vertical' as const}} />
    {/* Horizontal 16:9 para PC, presentaciones y YouTube */}
    <Composition id="TiendaMingoPC" component={TiendaMingo} durationInFrames={DURACION_TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{formato: 'horizontal' as const}} />
  </>
);
