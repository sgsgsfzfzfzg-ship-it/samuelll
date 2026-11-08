import React from 'react';

type P = {size?: number; color?: string; grosor?: number};

const Base: React.FC<P & {children: React.ReactNode}> = ({size = 40, color = 'currentColor', grosor = 2.2, children}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const Icono = {
  escaner: (p: P) => (
    <Base {...p}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </Base>
  ),
  camara: (p: P) => (
    <Base {...p}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
      <circle cx="12" cy="13" r="3.5" />
    </Base>
  ),
  rayo: (p: P) => (
    <Base {...p}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
    </Base>
  ),
  caja: (p: P) => (
    <Base {...p}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </Base>
  ),
  historial: (p: P) => (
    <Base {...p}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5M12 7v5l3 2" />
    </Base>
  ),
  descarga: (p: P) => (
    <Base {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </Base>
  ),
  calendario: (p: P) => (
    <Base {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Base>
  ),
  billete: (p: P) => (
    <Base {...p}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" />
    </Base>
  ),
  balanza: (p: P) => (
    <Base {...p}>
      <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a4 4 0 0 0 6 0zM19 7l-3 7a4 4 0 0 0 6 0z" />
    </Base>
  ),
  check: (p: P) => (
    <Base {...p}>
      <path d="M20 6 9 17l-5-5" />
    </Base>
  ),
  personas: (p: P) => (
    <Base {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </Base>
  ),
  libreta: (p: P) => (
    <Base {...p}>
      <path d="M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M9 7h7M9 11h5" />
    </Base>
  ),
  camion: (p: P) => (
    <Base {...p}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </Base>
  ),
  grafica: (p: P) => (
    <Base {...p}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </Base>
  ),
  tarjeta: (p: P) => (
    <Base {...p}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </Base>
  ),
  estrella: (p: P) => (
    <Base {...p}>
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </Base>
  ),
  alerta: (p: P) => (
    <Base {...p}>
      <path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3" />
      <path d="M12 9v4M12 17h.01" />
    </Base>
  ),
  libro: (p: P) => (
    <Base {...p}>
      <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
    </Base>
  ),
  tienda: (p: P) => (
    <Base {...p}>
      <path d="M3 9 4.5 4h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6" />
    </Base>
  ),
  escudo: (p: P) => (
    <Base {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </Base>
  ),
  chat: (p: P) => (
    <Base {...p}>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4-.9L3 20l1.1-4.2A8 8 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5" />
    </Base>
  ),
  chispa: (p: P) => (
    <Base {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </Base>
  ),
  recibo: (p: P) => (
    <Base {...p}>
      <path d="M4 2v20l3-2 3 2 2-2 2 2 3-2 3 2V2l-3 2-3-2-2 2-2-2-3 2z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </Base>
  ),
  wifiOff: (p: P) => (
    <Base {...p}>
      <path d="m2 2 20 20M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5.2-2.8M19 12.9a10 10 0 0 0-2.1-1.6M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 11 4.7M12 20h.01" />
    </Base>
  ),
  moto: (p: P) => (
    <Base {...p}>
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6h2l3 11.5M5.5 17.5 9 10h6l3.5 7.5M9 10l-1-3H5" />
    </Base>
  ),
  cerebro: (p: P) => (
    <Base {...p}>
      <path d="M12 5a3 3 0 1 0-6 .1 4 4 0 0 0-2.5 5.8A4 4 0 0 0 6 18a4 4 0 0 0 6 1.5zM12 5a3 3 0 1 1 6 .1 4 4 0 0 1 2.5 5.8A4 4 0 0 1 18 18a4 4 0 0 1-6 1.5z" />
      <path d="M12 5v14.5" />
    </Base>
  ),
};

export type NombreIcono = keyof typeof Icono;
