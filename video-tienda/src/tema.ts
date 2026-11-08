import {continueRender, delayRender, staticFile} from 'remotion';

// Inter (variable 400–900) incluida en el proyecto para renderizar sin depender de internet.
export const FUENTE = 'Inter Mingo, Inter, system-ui, sans-serif';

if (typeof document !== 'undefined' && !document.fonts.check('16px "Inter Mingo"')) {
  const espera = delayRender('Cargando fuente Inter');
  const fuente = new FontFace('Inter Mingo', `url(${staticFile('fuentes/inter-latin.woff2')}) format('woff2')`, {weight: '400 900'});
  fuente
    .load()
    .then((f) => {
      document.fonts.add(f);
      continueRender(espera);
    })
    .catch((err) => {
      console.error(err);
      continueRender(espera);
    });
}

export const C = {
  verde: '#1F4D3A',
  verdeMedio: '#2E6B52',
  verdeOscuro: '#0B2A1F',
  noche: '#071C15',
  lima: '#DDF4A8',
  limaFuerte: '#C6EE6E',
  crema: '#F5F7F2',
  tinta: '#0F1F18',
  gris: '#6B7A72',
  linea: '#E3E8E2',
  rojo: '#E5484D',
  ambar: '#F5A524',
  blanco: '#FFFFFF',
};
