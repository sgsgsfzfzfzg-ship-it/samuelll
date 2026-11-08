import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../tema';
import {Icono} from '../../ui/Iconos';
import {cuandoDice} from '../../tiempos';
import {PantallaApp, pesos, useEntrada} from './comun';

const PRODUCTOS: [string, number, string][] = [
  ['Arroz 500gr', 4300, '#F3E7C9'],
  ['Arroz 500 Grajales', 5300, '#E7F0D6'],
  ['Nescafé 30gr', 6000, '#EAD9C8'],
  ['Aceite 1L', 9800, '#F7EDB8'],
];

export const MaquetaCatalogo: React.FC = () => {
  const f = useCurrentFrame();
  const toques = [18, 40, 62, 84];
  const enCarrito = toques.filter((t) => f >= t).length;
  const total = PRODUCTOS.slice(0, enCarrito).reduce((s, [, p]) => s + p, 0);
  const tPedido = cuandoDice('catalogo', 'a domicilio');
  const aviso = useEntrada(tPedido, 13);
  return (
    <PantallaApp>
      <div style={{background: C.verde, color: '#fff', padding: '92px 28px 30px'}}>
        <div style={{fontSize: 20, letterSpacing: 2, fontWeight: 700, color: C.lima}}>PEDIDOS EN LÍNEA</div>
        <div style={{fontSize: 40, fontWeight: 900, marginTop: 4}}>Tienda Mingo</div>
        <div style={{fontSize: 21, opacity: 0.85, marginTop: 4}}>🛵 Domicilio gratis en tu barrio</div>
        <div style={{marginTop: 20, background: '#fff', color: C.gris, borderRadius: 18, padding: '16px 20px', fontSize: 22}}>🔍 ¿Qué necesitas hoy?</div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, padding: 22}}>
        {PRODUCTOS.map(([nombre, precio, color], i) => {
          const tocado = f >= toques[i];
          const presion = f >= toques[i] && f < toques[i] + 6 ? 0.9 : 1;
          return (
            <div key={nombre} style={{background: '#fff', borderRadius: 26, padding: 16, border: `1.5px solid ${C.linea}`}}>
              <div style={{height: 150, borderRadius: 18, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.verde}}>
                <Icono.caja size={70} grosor={1.6} />
              </div>
              <div style={{fontSize: 22, fontWeight: 800, marginTop: 12, height: 56}}>{nombre}</div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{fontSize: 24, fontWeight: 900}}>{pesos(precio)}</div>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 16,
                    background: tocado ? C.limaFuerte : C.verde,
                    color: tocado ? C.verde : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 34,
                    fontWeight: 800,
                    transform: `scale(${presion})`,
                  }}
                >
                  {tocado ? <Icono.check size={30} /> : '+'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {enCarrito > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 22,
            right: 22,
            bottom: 40,
            height: 96,
            borderRadius: 26,
            background: C.verdeOscuro,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 30px',
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          <span>Ver carrito ({enCarrito})</span>
          <span style={{color: C.lima}}>{pesos(total)}</span>
        </div>
      )}
      {/* Aviso de pedido nuevo para el tendero */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: 74,
          transform: `translateY(${interpolate(aviso, [0, 1], [-300, 0])}px)`,
          background: '#fff',
          borderRadius: 28,
          padding: 22,
          display: 'flex',
          gap: 18,
          alignItems: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: `2px solid ${C.limaFuerte}`,
        }}
      >
        <div style={{width: 66, height: 66, borderRadius: 18, background: C.verde, color: C.lima, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icono.moto size={40} />
        </div>
        <div>
          <div style={{fontSize: 24, fontWeight: 900}}>¡Nuevo pedido a domicilio!</div>
          <div style={{fontSize: 21, color: C.gris}}>#128 · Calle 12 # 4-30 · {pesos(25400)}</div>
        </div>
      </div>
    </PantallaApp>
  );
};
