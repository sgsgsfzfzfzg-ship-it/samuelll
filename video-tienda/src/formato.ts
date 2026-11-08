import React from 'react';

export type Formato = 'vertical' | 'horizontal';

/** Formato del video: vertical (celular, 1080×1920) u horizontal (PC, 1920×1080). */
export const FormatoContexto = React.createContext<Formato>('vertical');

export const useHorizontal = () => React.useContext(FormatoContexto) === 'horizontal';
