// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE } from '../services/api';
import FEMViewer from './FEMViewer';

export default function Dashboard() {
  const { clientid } = useParams();

  // ---- series y últimos ----
  const [fem, setFem] = useState(null);            // último resultado (para el viewer 3D)
  const [femSeries, setFemSeries] = useState([]);  // { ts, u_teo_mm }
  const [realSeries, setRealSeries] = useState([]);// { ts, disp_mm }

  // auxiliares UI
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [now, setNow] = useState(Date.now());

  async function fetchFem() {
    try {
      setErr('');

      const [lRes, sRes] = await Promise.all([
        fetch(`${BASE}/api/simulations/${clientid}/latest`),
        fetch(`${BASE}/api/simulations/${clientid}/series?window=5m&limit=300`)
      ]);

      const latest = await lRes.json();
      const series = await sRes.json();

      setFem(latest || null);

      const femS = Array.isArray(series?.fem)
        ? series.fem.map(d => ({ ...d, ts: new Date(d.ts).getTime() }))
        : [];
      const realS = Array.isArray(series?.real)
        ? series.real.map(d => ({ ...d, ts: new Date(d.ts).getTime() }))
        : [];

      setFemSeries(femS);
      setRealSeries(realS);
    } catch (e) {
      console.error(e);
      setErr('No se pudo cargar datos.');
      setFem(null);
      setFemSeries([]);
      setRealSeries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFem();
    const idPoll = setInterval(fetchFem, 5000);
    const idTick = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(idPoll); clearInterval(idTick); };
  }, [clientid]);

  const ELY_VIDEO = "https://res.cloudinary.com/di4esyfmv/video/upload/v1756592748/7670836-uhd_3840_2160_30fps_d7twsq.mp4";

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">BioStrucX Live — {clientid}</h2>

      {loading && <div>Cargando…</div>}
      {err && <div className="text-red-400">{err}</div>}

      {/* ===================== SECCIÓN 1 ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 transition-all duration-300">
        {/* Columna IZQUIERDA */}
        <div className="flex flex-col gap-6">
          {/* A1: Video Ely */}
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="relative aspect-video w-full">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={ELY_VIDEO}
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="p-4 text-sm">
              CHAT CON LA IA DE BIOSTRUCX.AI LLAMADA <strong>ELY</strong>. Al entrar a tu
              dashboard se reproduce este video. HELLO WELCOME, cliente <strong>{clientid}</strong>.
              Si necesitas soporte, pregúntame aquí (chat pronto).
            </div>
          </div>

          {/* A2: Mapa 3D (placeholder) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-3 font-semibold">Mapa 3D — ubicación del sensor</div>
            <div className="h-[220px] rounded-xl bg-black/30" />
            <p className="mt-3 text-xs text-white/70">
              Mapa interactivo para ver dónde está instalado el sensor (Wi-Fi/MQTT/HTTP/SIM).
            </p>
          </div>
        </div>

        {/* Columna DERECHA — FEM 3D / estado */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-3 font-semibold">
              FEM — Análisis (OpenSeesPy). Viga 25×25×1 m (demo).
            </div>
            <div className="h-[220px] rounded-xl bg-black/30">
              {fem && fem.status === 'done' ? (
                <FEMViewer viz={fem.viz} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm">
                  {!fem ? 'sin modelo' : `estado: ${fem.status}`}
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-white/70">
              Aquí irá el render/imagen de la viga con cargas/condiciones.
            </p>
          </div>

          {/* B2: FEM — Ubicación del sensor (placeholder) + tarjeta */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm mb-3 font-semibold">
                  FEM — Ubicación del sensor (BSX–FARADAY1)
                </div>
                <div className="h-[180px] rounded-xl bg-black/30" />
                <p className="mt-3 text-xs text-white/70">
                  Visualización destacando el punto exacto donde está el sensor (marcador rojo).
                </p>
              </div>

              <div className="w-48 shrink-0 rounded-xl border border-white/10 bg-black/40 p-3">
                <div className="text-xs opacity-70">Sensor info</div>
                <div className="mt-1 text-sm">
                  <div><span className="opacity-70">Modelo:</span> BSX–FARADAY1</div>
                  <div><span className="opacity-70">Cantidad:</span> 1</div>
                  <div><span className="opacity-70">Cliente:</span> {clientid}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== SECCIÓN 2 ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Gráfico 1 — Serie teórica FEM */}
          <LiveChart
            title="GRÁFICO 1 — Desplazamiento teórico (FEM) vs tiempo"
            unit="mm"
            valueKey="u_teo_mm"
            data={femSeries}
            now={now}
            windowSec={300}
          />

          {/* Gráfico 2 — Serie real (sensor) */}
          <LiveChart
            title="GRÁFICO 2 — Real (disp_mm) vs tiempo"
            unit="mm"
            valueKey="disp_mm"
            data={realSeries}
            now={now}
            windowSec={300}
          />

          {/* Gráfico 3 — (placeholder) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-2 font-semibold">GRÁFICO 3 — Desplazamiento predictivo (IA + FEM + Real)</div>
            <div className="h-[180px] rounded-xl bg-black/30" />
            <div className="mt-2 text-xs text-white/60">Comparación de curvas y umbrales.</div>
          </div>
        </div>

        {/* Columna derecha: Ely + tarjeta */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="relative aspect-video w-full">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={ELY_VIDEO}
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="p-4 text-sm">
              Video de <strong>Ely</strong> explicando la predicción actual.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-2 font-semibold">Tarjeta de diagnóstico (explicación)</div>
            <p className="text-sm text-white/80">
              Evolución de la deflexión real vs FEM. Alarmas próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== COMPONENTE CHART (1 serie) ===================== */
function LiveChart({
  title, unit = '', valueKey = 'value', data = [], now,
  windowSec = 60, yMin, yMax, height = 220
}) {
  const width = 640;
  const pad = { l: 48, r: 16, t: 16, b: 28 };
  const end = now;
  const start = end - windowSec * 1000;

  const rows = (Array.isArray(data) ? data : [])
    .filter(d => d && typeof d.ts === 'number' && d.ts >= start && d.ts <= end);

  let minV = yMin, maxV = yMax;
  const vals = rows.map(r => Number(r[valueKey])).filter(Number.isFinite);
  if (vals.length) {
    if (minV === undefined) minV = Math.min(...vals);
    if (maxV === undefined) maxV = Math.max(...vals);
    if (minV === maxV) { minV -= 1; maxV += 1; }
  } else {
    minV = minV ?? 0;
    maxV = maxV ?? 1;
  }

  const xScale = (ts) => {
    const f = (ts - start) / (end - start || 1);
    return pad.l + f * (width - pad.l - pad.r);
  };
  const yScale = (v) => {
    const f = (v - minV) / (maxV - minV || 1);
    return pad.t + (1 - f) * (height - pad.t - pad.b);
  };

  const points = rows
    .filter(r => Number.isFinite(Number(r[valueKey])))
    .map(r => `${xScale(r.ts)},${yScale(Number(r[valueKey]))}`)
    .join(' ');

  const ticksX = 5, ticksY = 5;
  const xTicks = Array.from({ length: ticksX + 1 }, (_, i) => start + (i * (end - start)) / ticksX);
  const yTicks = Array.from({ length: ticksY + 1 }, (_, i) => minV + (i * (maxV - minV)) / ticksY);

  return (
    <div className="rounded-2xl bg-neutral-900/70 p-4 shadow-lg">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-xs text-neutral-400">Window: {windowSec}s</div>
      </div>

      <div className="h-56 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {xTicks.map((t, i) => (
            <line key={`x${i}`} x1={xScale(t)} x2={xScale(t)} y1={pad.t} y2={height - pad.b} stroke="currentColor" opacity="0.12" />
          ))}
          {yTicks.map((v, i) => (
            <line key={`y${i}`} x1={pad.l} x2={width - pad.r} y1={yScale(v)} y2={yScale(v)} stroke="currentColor" opacity="0.12" />
          ))}
          <line x1={pad.l} x2={width - pad.r} y1={height - pad.b} y2={height - pad.b} stroke="currentColor" opacity="0.6" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={height - pad.b} stroke="currentColor" opacity="0.6" />
          {xTicks.map((t, i) => (
            <text key={`xt${i}`} x={xScale(t)} y={height - 6} textAnchor="middle" className="fill-neutral-400 text-[10px]">
              {new Date(t).toLocaleTimeString([], { hour12: false })}
            </text>
          ))}
          {yTicks.map((v, i) => (
            <text key={`yt${i}`} x={pad.l - 6} y={yScale(v)} textAnchor="end" dominantBaseline="middle" className="fill-neutral-400 text-[10px]">
              {Number(v.toFixed(2))}
            </text>
          ))}
          {points && <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />}
        </svg>
      </div>
    </div>
  );
}

