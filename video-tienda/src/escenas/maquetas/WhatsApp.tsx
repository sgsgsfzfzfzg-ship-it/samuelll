import React from 'react';
import {C} from '../../tema';
import {Icono} from '../../ui/Iconos';
import {cuandoDice} from '../../tiempos';
import {Aparece, Cabecera, PantallaApp, pesos} from './comun';

const Burbuja: React.FC<{yo?: boolean; children: React.ReactNode; hora: string}> = ({yo, children, hora}) => (
  <div style={{display: 'flex', justifyContent: yo ? 'flex-end' : 'flex-start', marginBottom: 18}}>
    <div
      style={{
        maxWidth: 470,
        background: yo ? '#DCF8C6' : '#fff',
        borderRadius: 24,
        borderTopRightRadius: yo ? 6 : 24,
        borderTopLeftRadius: yo ? 24 : 6,
        padding: '18px 22px 12px',
        fontSize: 25,
        lineHeight: 1.35,
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      }}
    >
      {children}
      <div style={{textAlign: 'right', fontSize: 18, color: C.gris, marginTop: 6}}>
        {hora} {yo && <span style={{color: '#34B7F1'}}>✓✓</span>}
      </div>
    </div>
  </div>
);

const ITEMS: [string, number, number][] = [
  ['Arroz 500gr', 2, 4300],
  ['Nescafé 30gr', 1, 6000],
  ['Arroz 500 Grajales', 1, 5300],
];

export const MaquetaWhatsApp: React.FC = () => {
  const total = ITEMS.reduce((s, [, n, p]) => s + n * p, 0);
  return (
    <PantallaApp fondo="#EFE7DD">
      <Cabecera titulo="Doña Rosa" sub="Cliente · WhatsApp" icono="R" />
      <div style={{padding: '30px 24px'}}>
        <Aparece desde={cuandoDice('whatsapp', 'recibo')}>
          <Burbuja yo hora="8:41 a.m.">
            <div style={{fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, color: C.verde}}>
              <Icono.recibo size={28} /> Recibo · Tienda Mingo
            </div>
            <div style={{borderTop: '1px dashed #9bb59a', margin: '10px 0'}} />
            {ITEMS.map(([nombre, n, p]) => (
              <div key={nombre} style={{display: 'flex', justifyContent: 'space-between', gap: 20}}>
                <span>
                  {n}× {nombre}
                </span>
                <span>{pesos(n * p)}</span>
              </div>
            ))}
            <div style={{borderTop: '1px dashed #9bb59a', margin: '10px 0'}} />
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 28}}>
              <span>Total</span>
              <span>{pesos(total)}</span>
            </div>
            <div style={{marginTop: 8}}>¡Gracias por comprar en Tienda Mingo! 💚</div>
          </Burbuja>
        </Aparece>
        <Aparece desde={cuandoDice('whatsapp', 'recuérdale')}>
          <div style={{textAlign: 'center', margin: '6px 0 16px'}}>
            <span style={{background: '#FFF6C9', borderRadius: 12, padding: '6px 16px', fontSize: 19, fontWeight: 700, color: '#7a6400'}}>
              ⚡ Recordatorio automático · viernes
            </span>
          </div>
          <Burbuja yo hora="9:00 a.m.">
            Hola Doña Rosa 👋 Te recordamos que tienes un saldo pendiente de <b>{pesos(25000)}</b> en Tienda Mingo. ¡Te esperamos!
          </Burbuja>
        </Aparece>
        <Aparece desde={cuandoDice('whatsapp', 'automático') + 18}>
          <Burbuja hora="9:04 a.m.">¡Listo, mijo! Hoy paso a pagar 🙌</Burbuja>
        </Aparece>
      </div>
    </PantallaApp>
  );
};
