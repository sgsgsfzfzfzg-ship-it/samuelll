import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../tema';
import {Icono} from '../../ui/Iconos';
import {cuandoDice} from '../../tiempos';
import {PantallaApp, Tarjeta, pesos, useEntrada} from './comun';

const PRODUCTOS: [string, number, number][] = [
  ['Alcohol', 12, 4500],
  ['Arroz 500gr', 7, 4300],
  ['Arroz 500 Grajales', 8, 5300],
  ['Nescafé 30gr', 5, 6000],
  ['Aceite 1L', 9, 9800],
];

const PEDIDO: [string, number, number][] = [
  ['Arroz 500 Grajales', 24, 4100],
  ['Nescafé 30gr', 12, 4700],
  ['Alcohol', 6, 3400],
];

export const MaquetaStock: React.FC = () => {
  const f = useCurrentFrame();
  const tAlerta = cuandoDice('stock', 'alerta');
  const tPedido = cuandoDice('stock', 'el pedido');
  const tToque = cuandoDice('stock', 'en un toque', 0);
  const baja = Math.round(interpolate(f, [8, tAlerta], [8, 3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const banner = useEntrada(tAlerta, 13);
  const hoja = useEntrada(tPedido, 16);
  const enviado = f >= tToque + 8;
  const presion = f >= tToque && f < tToque + 8 ? 0.94 : 1;
  const totalPedido = PEDIDO.reduce((s, [, n, p]) => s + n * p, 0);
  return (
    <PantallaApp>
      <div style={{padding: '96px 28px 0'}}>
        <div style={{fontSize: 18, fontWeight: 700, letterSpacing: 2, color: C.gris}}>ADMINISTRA TU TIENDA</div>
        <div style={{fontSize: 44, fontWeight: 900, marginTop: 4}}>Inventario</div>
        <Tarjeta style={{marginTop: 22, padding: 0, overflow: 'hidden'}}>
          {PRODUCTOS.map(([nombre, und], i) => {
            const n = nombre === 'Arroz 500 Grajales' ? baja : und;
            const critico = n <= 3;
            return (
              <div
                key={nombre}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '22px 24px',
                  borderTop: i ? `1.5px solid ${C.linea}` : 'none',
                  background: critico ? 'rgba(229,72,77,0.08)' : 'transparent',
                }}
              >
                <div>
                  <div style={{fontSize: 26, fontWeight: 700}}>{nombre}</div>
                  <div style={{marginTop: 10, width: 300, height: 10, borderRadius: 10, background: '#EDF0EC'}}>
                    <div style={{width: `${(n / 12) * 100}%`, height: '100%', borderRadius: 10, background: critico ? C.rojo : C.verdeMedio}} />
                  </div>
                </div>
                <div style={{fontSize: 24, fontWeight: 800, color: critico ? C.rojo : C.gris}}>{n} und</div>
              </div>
            );
          })}
        </Tarjeta>
      </div>

      {/* Notificación de stock bajo */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 74,
          transform: `translateY(${interpolate(banner, [0, 1], [-260, 0])}px)`,
          background: '#fff',
          borderRadius: 28,
          padding: 22,
          display: 'flex',
          gap: 18,
          alignItems: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          border: `2px solid ${C.ambar}`,
        }}
      >
        <div style={{width: 64, height: 64, borderRadius: 18, background: '#FFF1D6', color: C.ambar, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icono.alerta size={38} />
        </div>
        <div>
          <div style={{fontSize: 24, fontWeight: 900}}>Stock bajo</div>
          <div style={{fontSize: 22, color: C.gris}}>Arroz 500 Grajales · quedan 3 und</div>
        </div>
      </div>

      {/* Pedido sugerido */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateY(${interpolate(hoja, [0, 1], [700, 0])}px)`,
          background: '#fff',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          padding: '20px 30px 50px',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{width: 80, height: 8, borderRadius: 8, background: C.linea, margin: '0 auto 22px'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{color: C.verde}}>
            <Icono.camion size={40} />
          </div>
          <div>
            <div style={{fontSize: 30, fontWeight: 900}}>Pedido sugerido</div>
            <div style={{fontSize: 21, color: C.gris}}>Distribuidora El Sol</div>
          </div>
        </div>
        <div style={{marginTop: 18}}>
          {PEDIDO.map(([nombre, n, p]) => (
            <div key={nombre} style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, padding: '9px 0'}}>
              <span>
                <b>{n}×</b> {nombre}
              </span>
              <span style={{color: C.gris}}>{pesos(n * p)}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 20,
            height: 86,
            borderRadius: 22,
            background: enviado ? C.verdeMedio : C.verde,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontSize: 28,
            fontWeight: 800,
            transform: `scale(${presion})`,
          }}
        >
          {enviado ? (
            <>
              <Icono.check size={34} /> Pedido enviado
            </>
          ) : (
            <>Enviar pedido · {pesos(totalPedido)}</>
          )}
        </div>
      </div>
    </PantallaApp>
  );
};
