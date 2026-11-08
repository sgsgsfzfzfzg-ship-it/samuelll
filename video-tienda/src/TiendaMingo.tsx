import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {Cierre} from './escenas/Cierre';
import {DemoProps, EscenaDemo} from './escenas/EscenaDemo';
import {EscenaNueva} from './escenas/EscenaNueva';
import {Extras} from './escenas/Extras';
import {Intro} from './escenas/Intro';
import {MaquetaAsistente} from './escenas/maquetas/Asistente';
import {MaquetaCatalogo} from './escenas/maquetas/Catalogo';
import {MaquetaStock} from './escenas/maquetas/Stock';
import {MaquetaWhatsApp} from './escenas/maquetas/WhatsApp';
import {Teaser} from './escenas/Teaser';
import {GloboDatos} from './ui/Globo';
import {cuandoDice as d, DURACION_TOTAL, framesEscena, IdEscena, ORDEN, PAUSA_ENTRADA, TRANSICION} from './tiempos';

type G = Omit<GloboDatos, 'en'> & {palabra: string};
const globos = (id: IdEscena, lista: G[]): GloboDatos[] => lista.map(({palabra, ...g}) => ({...g, en: d(id, palabra)}));

/** Funciones que ya tiene el sistema (grabación real). */
const demo = (p: Omit<DemoProps, 'globos'> & {globos: G[]}): DemoProps => ({...p, globos: globos(p.id, p.globos)});

const ESCENAS: Record<IdEscena, React.ReactNode> = {
  intro: <Intro />,
  pos: (
    <EscenaDemo
      {...demo({
        id: 'pos',
        numero: '01',
        etiqueta: 'Punto de venta',
        titulo: 'Vende en segundos',
        tramos: [[0.3, 6.8]],
        globos: [
          {palabra: 'Busca', texto: 'Busca o escanea', icono: 'escaner', lado: 'izq', y: 780},
          {palabra: 'escanéalo', texto: 'Escáner con la cámara', icono: 'camara', lado: 'der', y: 1100},
          {palabra: 'cobra', texto: 'Cobra en 1 toque', icono: 'rayo', lado: 'izq', y: 1450, sonido: 'caja'},
        ],
      })}
    />
  ),
  inventario: (
    <EscenaDemo
      {...demo({
        id: 'inventario',
        numero: '02',
        etiqueta: 'Inventario',
        titulo: 'Todo tu stock, bajo control',
        tramos: [[8, 15.5]],
        globos: [
          {palabra: 'código', texto: 'Código, precio y stock', icono: 'caja', lado: 'der', y: 800},
          {palabra: 'Agrega varios', texto: 'Carga con la cámara', icono: 'camara', lado: 'izq', y: 1120},
          {palabra: 'cada movimiento', texto: 'Cada movimiento', icono: 'historial', lado: 'der', y: 1440},
        ],
      })}
    />
  ),
  ventas: (
    <EscenaDemo
      {...demo({
        id: 'ventas',
        numero: '03',
        etiqueta: 'Ventas',
        titulo: 'Cada peso, a la vista',
        tramos: [[17, 23.6]],
        globos: [
          {palabra: 'ventas netas', texto: 'Ventas netas al instante', icono: 'billete', lado: 'izq', y: 800},
          {palabra: 'Filtra', texto: 'Filtra por fechas', icono: 'calendario', lado: 'der', y: 1120},
          {palabra: 'exporta', texto: 'Exporta en 1 clic', icono: 'descarga', lado: 'izq', y: 1440},
        ],
      })}
    />
  ),
  caja: (
    <EscenaDemo
      {...demo({
        id: 'caja',
        numero: '04',
        etiqueta: 'Caja',
        titulo: 'Tu caja, siempre cuadrada',
        tramos: [[25, 33.6]],
        globos: [
          {palabra: 'base', texto: 'Base del día', icono: 'billete', lado: 'der', y: 820},
          {palabra: 'ingresos', texto: 'Ingresos y gastos', icono: 'balanza', lado: 'izq', y: 1120},
          {palabra: 'descuadres', texto: 'Cero descuadres', icono: 'check', lado: 'der', y: 1440},
        ],
      })}
    />
  ),
  clientes: (
    <EscenaDemo
      {...demo({
        id: 'clientes',
        numero: '05',
        etiqueta: 'Clientes y fiados',
        titulo: 'Adiós al cuaderno de fiados',
        tramos: [[35, 41]],
        globos: [
          {palabra: 'fiados', texto: 'Fiados al día', icono: 'libreta', lado: 'izq', y: 920},
          {palabra: 'sin olvidos', texto: 'Sin olvidos', icono: 'personas', lado: 'der', y: 1320},
        ],
      })}
    />
  ),
  compras: (
    <EscenaDemo
      {...demo({
        id: 'compras',
        numero: '06',
        etiqueta: 'Compras',
        titulo: 'Siempre bien surtida',
        tramos: [[43, 46.6]],
        globos: [
          {palabra: 'proveedores', texto: 'Tus proveedores', icono: 'camion', lado: 'der', y: 920},
          {palabra: 'surtida', texto: 'Mercancía al día', icono: 'caja', lado: 'izq', y: 1320},
        ],
      })}
    />
  ),
  reportes: (
    <EscenaDemo
      {...demo({
        id: 'reportes',
        numero: '07',
        etiqueta: 'Reportes',
        titulo: 'Tu negocio de un vistazo',
        tramos: [[48, 62]],
        globos: [
          {palabra: 'margen', texto: 'Margen de ganancia', icono: 'grafica', lado: 'izq', y: 800},
          {palabra: 'efectivo', texto: 'Efectivo, Nequi, Daviplata', icono: 'tarjeta', lado: 'der', y: 1060},
          {palabra: 'más vendidos', texto: 'Lo más vendido', icono: 'estrella', lado: 'izq', y: 1340},
          {palabra: 'reponer', texto: 'Qué reponer', icono: 'alerta', lado: 'der', y: 1600},
        ],
      })}
    />
  ),
  config: (
    <EscenaDemo
      {...demo({
        id: 'config',
        numero: '08',
        etiqueta: 'Configuración',
        titulo: 'Hecha a tu medida',
        tramos: [
          [64, 67.8],
          [71, 78.6],
        ],
        globos: [
          {palabra: 'guía', texto: 'Guía paso a paso', icono: 'libro', lado: 'izq', y: 820},
          {palabra: 'comprobantes', texto: 'Tus comprobantes', icono: 'recibo', lado: 'der', y: 1150},
          {palabra: 'respaldos', texto: 'Respaldos seguros', icono: 'escudo', lado: 'izq', y: 1450},
        ],
      })}
    />
  ),
  teaser: <Teaser />,
  whatsapp: (
    <EscenaNueva
      etiqueta="WhatsApp"
      titulo="Recibos y cobros por WhatsApp"
      globos={globos('whatsapp', [
        {palabra: 'recibo', texto: 'Recibo al instante', icono: 'recibo', lado: 'izq', y: 1000},
        {palabra: 'automático', texto: 'Cobro automático', icono: 'chat', lado: 'der', y: 1500},
      ])}
    >
      <MaquetaWhatsApp />
    </EscenaNueva>
  ),
  stock: (
    <EscenaNueva
      etiqueta="Alertas"
      titulo="Nunca te quedes sin producto"
      globos={globos('stock', [{palabra: 'en un toque', texto: 'Pedido en 1 toque', icono: 'camion', lado: 'izq', y: 1180}])}
    >
      <MaquetaStock />
    </EscenaNueva>
  ),
  ia: (
    <EscenaNueva
      etiqueta="Asistente IA"
      titulo="Sabe cuánto vas a vender"
      globos={globos('ia', [{palabra: 'vendes más', texto: 'Tu mejor día', icono: 'estrella', lado: 'der', y: 1000}])}
    >
      <MaquetaAsistente />
    </EscenaNueva>
  ),
  catalogo: (
    <EscenaNueva
      etiqueta="Tienda en línea"
      titulo="Vende también a domicilio"
      globos={globos('catalogo', [{palabra: 'clientes', texto: 'Tu catálogo en línea', icono: 'tienda', lado: 'der', y: 1250}])}
    >
      <MaquetaCatalogo />
    </EscenaNueva>
  ),
  extras: <Extras />,
  outro: <Cierre />,
};

const transicion = (i: number) =>
  i % 2 === 0 ? slide({direction: i % 4 === 0 ? 'from-right' : 'from-bottom'}) : fade();

export const TiendaMingo: React.FC = () => {
  let inicio = 0;
  const marcas: number[] = [];
  ORDEN.forEach((id) => {
    marcas.push(inicio);
    inicio += framesEscena(id) - TRANSICION;
  });

  return (
    <AbsoluteFill style={{background: '#04130E'}}>
      <TransitionSeries>
        {ORDEN.flatMap((id, i) => {
          const items = [
            <TransitionSeries.Sequence key={id} durationInFrames={framesEscena(id)}>
              {ESCENAS[id]}
              <Sequence from={PAUSA_ENTRADA} layout="none">
                <Audio src={staticFile(`voz/${id}.mp3`)} />
              </Sequence>
            </TransitionSeries.Sequence>,
          ];
          if (i < ORDEN.length - 1) {
            items.push(
              <TransitionSeries.Transition key={`${id}-t`} presentation={transicion(i)} timing={linearTiming({durationInFrames: TRANSICION})} />,
            );
          }
          return items;
        })}
      </TransitionSeries>

      {/* Whoosh en cada cambio de escena */}
      {marcas.slice(1).map((m, i) => (
        <Sequence key={i} from={m - 4} durationInFrames={30} layout="none">
          <Audio src={staticFile('sfx-whoosh.mp3')} volume={0.22} />
        </Sequence>
      ))}

      {/* Música de fondo: baja bajo la voz y sube al final */}
      <Audio
        src={staticFile('musica.mp3')}
        loop
        volume={(f) => {
          const finalVoz = DURACION_TOTAL - 75;
          const entrada = interpolate(f, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
          const salida = interpolate(f, [DURACION_TOTAL - 30, DURACION_TOTAL], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const base = interpolate(f, [finalVoz, finalVoz + 15], [0.12, 0.32], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return base * entrada * salida;
        }}
      />
    </AbsoluteFill>
  );
};
