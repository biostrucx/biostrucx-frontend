// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE } from '../services/api';
import FEMViewer from './FEMViewer';

export default function Dashboard() {
  const { clientid } = useParams();
  const [latest, setLatest] = useState(null);
  const [stream, setStream] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [now, setNow] = useState(Date.now());

  // FEM (arriba)
  const [fem, setFem] = useState(null);
  async function fetchFem() {
    try {
      const r = await fetch(`${BASE}/api/simulations/${clientid}/latest`);
      const j = await r.json();
      setFem(j || null);
    } catch {
      setFem(null);
    }
  }

  // FEM serie (abajo)
  const [femSeries, setFemSeries] = useState([]);
  async function fetchFemSeries() {
    try {
      const r = await fetch(`${BASE}/api/simulations/${clientid}/series?window=5m&limit=300`);
      const j = await r.json();
      setFemSeries(Array.isArray(j) ? j.map(d => ({ ...d, ts: new Date(d.ts).getTime() })) : []);
    } catch {
      setFemSeries([]);
    }
  }

  async function fetchData() {
    try {
      setErr('');
      const [lRes, sRes] = await Promise.all([
        fetch(`${BASE}/api/sensors/latest/${clientid}`),
        fetch(`${BASE}/api/sensors/stream/${clientid}?window=5m&limit=300`)
      ]);
      const l = await lRes.json();
      const s = await sRes.json();
      setLatest(l || null);
      setStream(Array.isArray(s) ? s.map(d => ({ ...d, ts: new Date(d.ts).getTime() })) : []);
    } catch (e) {
      setErr('No se pudo cargar datos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    fetchFem();
    fetchFemSeries();
    const idPoll = setInterval(() => { fetchData(); fetchFemSeries(); }, 5000);
    const idTick = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(idPoll); clearInterval(idTick); };
  }, [clientid]);

  const ELY_VIDEO = "https://res.cloudinary.com/di4esyfmv/video/upload/v1756592748/7670836-uhd_3840_2160_30fps_d7twsq.mp4";

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">BioStrucX Live — {clientid}</h2>

      {loading && <div>Cargando…</div>}
      {err && <div className="text-red-400">{err}</div>}

      {/* ====== SECCIÓN 1 ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* IZQ: video + mapa */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="relative aspect-video w-full">
              <video className="absolute inset-0 h-full w-full object-cover" src={ELY_VIDEO} autoPlay muted loop playsInline />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="p-4 text-sm">
              CHAT CON LA IA BIOSTRUCX.AI (<strong>ELY</strong>). HELLO WELCOME, cliente <strong>{clientid}</strong>.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-3 font-semibold">Mapa 3D — ubicación del sensor</div>
            <div className="h-[220px] rounded-xl bg-black/30" />
            <p className="mt-3 text-xs text-white/70">Mapa interactivo (próximamente).</p>
          </div>
        </div>

        {/* DER: FEM teórico (viz) */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm mb-3 font-semibold">FEM — Análisis (OpenSeesPy). Viga 25×25×1 m (demo).</div>
          <div className="h-[220px] rounded-xl bg-black/30">
            {fem && fem.status === 'done'
              ? <FEMViewer viz={fem.viz} />
              : (
                <div className="w-full h-full flex items-center justify-center text-sm">
                  {!fem ? 'sin modelo' : `estado: ${fem.status}`}
                </div>
              )}
          </div>
          <p className="mt-3 text-xs text-white/70">Aquí irá el render/imagen de la viga con cargas/condiciones.</p>
        </div>
      </div>

      {/* ====== SECCIÓN 2 ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2/3 izquierda */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-2 font-semibold">GRÁFICO 1 — Desplazamiento teórico (FEM) vs tiempo</div>
            <div className="h-[180px] rounded-xl bg-black/30" />
            <div className="mt-2 text-xs text-white/60">Eje vertical: mm · Eje horizontal: tiempo.</div>
          </div>

          <FEMvsRealChart real={stream} pred={femSeries} now={now} windowSec={300} />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-2 font-semibold">GRÁFICO 3 — Desplazamiento predictivo (IA + FEM + Real)</div>
            <div className="h-[180px] rounded-xl bg-black/30" />
            <div className="mt-2 text-xs text-white/60">Comparación de curvas y umbrales.</div>
          </div>
        </div>

        {/* 1/3 derecha */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="relative aspect-video w-full">
              <video className="absolute inset-0 h-full w-full object-cover" src={ELY_VIDEO} autoPlay muted loop playsInline />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="p-4 text-sm">
              Video de <strong>Ely</strong> explicando la predicción actual.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-2 font-semibold">Tarjeta de diagnóstico (explicación)</div>
            <p className="text-sm text-white/80">Evolución de la deflexión real vs FEM. Alarmas próximamente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== CHARTS ====== */

function FEMvsRealChart({ real = [], pred = [], now, windowSec = 300, height = 220 }) {
  const width = 640;
  const pad = { l: 48, r: 16, t: 16, b: 28 };
  const end = now;
  const start = end - windowSec * 1000;

  const rRows = (Array.isArray(real) ? real : []).filter(d => d.ts >= start && d.ts <= end);
  const pRows = (Array.isArray(pred) ? pred : []).filter(d => d.ts >= start && d.ts <= end);

  const vals = [
    ...rRows.map(d => Number(d.disp_mm)).filter(Number.isFinite),
    ...pRows.map(d => Number(d.u_pred_mm)).filter(Number.isFinite),
  ];
  let minV = Math.min(...(vals.length ? vals : [0]));
  let maxV = Math.max(...(vals.length ? vals : [1]));
  if (minV === maxV) { minV -= 1; maxV += 1; }

  const x = (ts) => pad.l + ((ts - start) / (end - start || 1)) * (width - pad.l - pad.r);
  const y = (v)  => pad.t + (1 - (v - minV) / (maxV - minV || 1)) * (height - pad.t - pad.b);

  const rPoints = rRows.map(d => `${x(d.ts)},${y(Number(d.disp_mm))}`).join(' ');
  const pPoints = pRows.map(d => `${x(d.ts)},${y(Number(d.u_pred_mm))}`).join(' ');

  const gx = 5, gy = 5;
  const xTicks = Array.from({ length: gx + 1 }, (_, i) => start + (i * (end - start)) / gx);
  const yTicks = Array.from({ length: gy + 1 }, (_, i) => minV + (i * (maxV - minV)) / gy);

  return (
    <div className="rounded-2xl bg-neutral-900/70 p-4 shadow-lg">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">GRÁFICO 2 — FEM (pred) vs Real (disp_mm)</h3>
        <div className="text-xs text-neutral-400">Window: {windowSec}s</div>
      </div>

      <div className="h-56 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {xTicks.map((t, i) => (
            <line key={`x${i}`} x1={x(t)} x2={x(t)} y1={pad.t} y2={height - pad.b} stroke="currentColor" opacity="0.12" />
          ))}
          {yTicks.map((v, i) => (
            <line key={`y${i}`} x1={pad.l} x2={width - pad.r} y1={y(v)} y2={y(v)} stroke="currentColor" opacity="0.12" />
          ))}
          <line x1={pad.l} x2={width - pad.r} y1={height - pad.b} y2={height - pad.b} stroke="currentColor" opacity="0.6" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={height - pad.b} stroke="currentColor" opacity="0.6" />

          {xTicks.map((t, i) => (
            <text key={`xt${i}`} x={x(t)} y={height - 6} textAnchor="middle" className="fill-neutral-400 text-[10px]">
              {new Date(t).toLocaleTimeString([], { hour12: false })}
            </text>
          ))}
          {yTicks.map((v, i) => (
            <text key={`yt${i}`} x={pad.l - 6} y={y(v)} textAnchor="end" dominantBaseline="middle" className="fill-neutral-400 text-[10px]">
              {Number(v.toFixed(2))}
            </text>
          ))}

          {rPoints && <polyline points={rPoints} fill="none" stroke="currentColor" strokeWidth="2" />}
          {pPoints && <polyline points={pPoints} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.65" />}
        </svg>
      </div>

      <div className="mt-2 text-xs text-neutral-400 flex gap-4">
        <span>Real: línea sólida</span>
        <span>FEM: línea punteada</span>
      </div>
    </div>
  );
}

