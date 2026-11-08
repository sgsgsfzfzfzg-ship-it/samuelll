import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../../tema';
import {Icono} from '../../ui/Iconos';
import {cuandoDice} from '../../tiempos';
import {Aparece, Cabecera, PantallaApp, Tarjeta, pesos} from './comun';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const VALORES = [180, 210, 190, 260, 340, 520, 300];

export const MaquetaAsistente: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tPregunta = 10;
  const tGrafica = cuandoDice('ia', 'qué días');
  const tMejor = cuandoDice('ia', 'vendes más');
  const tProy = cuandoDice('ia', 'cuánto vas');
  const escribiendo = f > tPregunta + 10 && f < tGrafica;
  const proy = interpolate(f, [tProy, tProy + 40], [0, 1250000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <PantallaApp>
      <Cabecera titulo="Asistente Mingo" sub="Inteligencia para tu tienda" icono={<Icono.chispa size={34} />} />
      <div style={{padding: '28px 24px'}}>
        <Aparece desde={tPregunta} style={{display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{background: C.verde, color: '#fff', fontSize: 27, fontWeight: 600, borderRadius: 26, borderTopRightRadius: 6, padding: '18px 26px'}}>
            ¿Cómo voy esta semana?
          </div>
        </Aparece>
        {escribiendo && (
          <div style={{display: 'flex', gap: 10, marginTop: 24, padding: '20px 26px', background: '#fff', borderRadius: 26, width: 120}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{width: 16, height: 16, borderRadius: '50%', background: C.gris, opacity: 0.4 + 0.6 * Math.abs(Math.sin((f + i * 6) / 6))}} />
            ))}
          </div>
        )}
        <Aparece desde={tGrafica} style={{marginTop: 24}}>
          <Tarjeta>
            <div style={{fontSize: 22, fontWeight: 700, color: C.gris}}>Ventas por día (miles)</div>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 16, height: 300, marginTop: 20}}>
              {DIAS.map((d, i) => {
                const s = spring({frame: f - tGrafica - 6 - i * 3, fps, config: {damping: 15}});
                const top = i === 5;
                const resalta = top && f >= tMejor;
                return (
                  <div key={d} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                    <div style={{fontSize: 18, fontWeight: 800, color: resalta ? C.verde : C.gris, marginBottom: 6}}>{Math.round(VALORES[i] * s)}</div>
                    <div
                      style={{
                        width: '100%',
                        height: (VALORES[i] / 520) * 220 * s,
                        borderRadius: 12,
                        background: resalta ? C.limaFuerte : C.verde,
                        boxShadow: resalta ? '0 0 30px rgba(198,238,110,0.9)' : 'none',
                      }}
                    />
                    <div style={{marginTop: 10, fontSize: 22, fontWeight: 800}}>{d}</div>
                  </div>
                );
              })}
            </div>
            <Aparece desde={tMejor} dy={20}>
              <div style={{marginTop: 18, fontSize: 25, fontWeight: 700}}>
                🔥 Los <b>sábados</b> vendes <b style={{color: C.verde}}>2× más</b>. ¡Surte el viernes!
              </div>
            </Aparece>
          </Tarjeta>
        </Aparece>
        <Aparece desde={tProy} style={{marginTop: 22}}>
          <div style={{background: C.verdeOscuro, color: '#fff', borderRadius: 28, padding: 28}}>
            <div style={{fontSize: 21, letterSpacing: 2, fontWeight: 700, color: C.lima}}>PROYECCIÓN ESTA SEMANA</div>
            <div style={{fontSize: 64, fontWeight: 900, marginTop: 6}}>{pesos(proy)}</div>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 10, background: C.lima, color: C.verdeOscuro, borderRadius: 999, padding: '6px 16px', fontSize: 22, fontWeight: 800}}>
              <Icono.grafica size={24} /> +18% vs. semana pasada
            </div>
          </div>
        </Aparece>
      </div>
    </PantallaApp>
  );
};
