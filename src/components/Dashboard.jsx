// ================================================================
// DASHBOARD BioStrucX Live — Diseño con Proporción Áurea (φ ≈ 1.618)
// ================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE } from '../services/api';
import FEMViewer from './FEMViewer';

// ================================================================
// [UTILS] Formateadores y helpers numéricos
// ================================================================
const toFixed = (v, n = 2) => (Number.isFinite(v) ? Number(v).toFixed(n) : '—');
const kN = (pN) => (Number.isFinite(pN) ? (pN / 1000) : null);
const GPa = (ePa) => (Number.isFinite(ePa) ? (ePa / 1e9) : null);

// ================================================================
// [UI] Leyenda de colores (gradiente) — Fibonacci paddings/radios
// ================================================================
function ColorLegend({ min, max, label = 'Desplazamiento (mm)' }) {
  return (
    <div className="mt-[13px]">
      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-[8px]">
        <span>{label}</span>
        <span>{toFixed(min)} — {toFixed(max)} mm</span>
      </div>
      <div
        className="h-[8px] w-full rounded-[13px]"
        style={{
          background: 'linear-gradient(90deg, #2563eb 0%, #22c55e 50%, #ef4444 100%)',
        }}
      />
    </div>
  );
}

// ================================================================
// [UI] Mini-toolbar para tarjetas FEM — botones con 13/21 px
// ================================================================
function FemToolbar({
  scale, setScale,
  showUndeformed, setShowUndeformed,
  interactive, setInteractive,
  onFit,
}) {
  const btn = 'px-[13px] py-[8px] rounded-[13px] bg-white/10 hover:bg-white/15 text-xs';
  const pill = (v) =>
    `px-[13px] py-[8px] rounded-[13px] text-xs ${scale === v ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`;
  return (
    <div className="mt-[13px] flex flex-wrap items-center gap-[13px]">
      <div className="flex items-center gap-[8px]">
        <span className="text-[11px] text-neutral-400">Deformada</span>
        <button className={pill(1)} onClick={() => setScale(1)}>×1</button>
        <button className={pill(10)} onClick={() => setScale(10)}>×10</button>
        <button className={pill(50)} onClick={() => setScale(50)}>×50</button>
        <button className={pill(100)} onClick={() => setScale(100)}>×100</button>
      </div>
      <button className={btn} onClick={() => setShowUndeformed((s) => !s)}>
        {showUndeformed ? 'Ocultar ref.' : 'Ver ref.'}
      </button>
      <button className={btn} onClick={() => setInteractive((s) => !s)}>
        {interactive ? 'Bloquear pan/zoom' : 'Pan/zoom ON'}
      </button>
      <button className={btn} onClick={onFit}>Fit</button>
    </div>
  );
}

// ================================================================
// [COMPONENTE PRINCIPAL] Dashboard con layout áureo 61.8% / 38.2%
// ================================================================
export default function Dashboard() {
  const { clientid } = useParams();

  // ------------------------------------------------------------
  // [STATE] Sensores (real)
  // ------------------------------------------------------------
  const [latest, setLatest] = useState(null);
  const [stream, setStream] = useState([]);

  // ------------------------------------------------------------
  // [STATE] FEM (simulación)
  // ------------------------------------------------------------
  const [fem, setFem] = useState(null);
  const [femSeries, setFemSeries] = useState([]);

  // ------------------------------------------------------------
  // [STATE] UI (carga/errores/tiempo)
  // ------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [now, setNow] = useState(Date.now());

  // ------------------------------------------------------------
  // [STATE] Controles compartidos para FEM
  // ------------------------------------------------------------
  const [scale, setScale] = useState(50);
  const [showUndeformed, setShowUndeformed] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const handleFit = () => { /* conectar ref de FEMViewer si aplica */ };

  // ============================================================
  // [DATA FETCH] Sensores y FEM
  // ============================================================
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
    } catch {
      setErr('No se pudo cargar datos.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchFem() {
    try {
      const r = await fetch(`${BASE}/api/simulations/${clientid}/latest`);
      const j = await r.json();
      setFem(j || null);
    } catch {
      setFem(null);
    }
  }

  async function fetchFemSeries() {
    try {
      const r = await fetch(`${BASE}/api/simulations/${clientid}/series?windowSec=300&limit=300`);
      const j = await r.json();
      const femArr = Array.isArray(j?.fem)
        ? j.fem.map(d => ({ ts: new Date(d.ts).getTime(), v: Number(d.fem_mm) }))
        : [];
      setFemSeries(femArr);
    } catch (e) {
      console.error('fetchFemSeries error', e);
    }
  }

  useEffect(() => {
    fetchData();
    fetchFem();
    fetchFemSeries();
    const id1 = setInterval(fetchData, 5000);
    const id2 = setInterval(fetchFemSeries, 5000);
    const id3 = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(id1); clearInterval(id2); clearInterval(id3); };
  }, [clientid]);

  // ============================================================
  // [MEDIA] Video Ely
  // ============================================================
  const ELY_VIDEO = "https://res.cloudinary.com/di4esyfmv/video/upload/v1756592748/7670836-uhd_3840_2160_30fps_d7twsq.mp4";

  // ============================================================
  // [VIZ] Marker para FEMViewer si no viene
  // ============================================================
  const vizWithMarker = fem?.viz ? { ...fem.viz, marker: fem.viz.marker || [0.5, 0, 0] } : null;

  // ============================================================
  // [META] Título técnico FEM
  // ============================================================
  const femMeta = useMemo(() => {
    const m = fem?.model || {};
    const p = fem?.params || {};
    const L = m.L_m ?? m.L ?? null;
    const E = GPa(m.E_Pa ?? m.E ?? null);
    const PkN = kN(p.P ?? p.load_N ?? null);
    return { L, E, PkN, supports: m.supports || null, bc: m.bc || null };
  }, [fem]);

  // ============================================================
  // [RANGO] Leyenda desplazamientos
  // ============================================================
  const uRange = useMemo(() => {
    const arr = fem?.viz?.u_mag;
    if (!Array.isArray(arr) || !arr.length) return { min: null, max: null };
    let min = +Infinity, max = -Infinity;
    for (const v of arr) {
      const n = Number(v);
      if (Number.isFinite(n)) { if (n < min) min = n; if (n > max) max = n; }
    }
    return { min, max };
  }, [fem]);

  // ============================================================
  // [SERIE] Último valor FEM para badge
  // ============================================================
  const lastFemValue = useMemo(() => {
    if (!femSeries?.length) return null;
    return femSeries[femSeries.length - 1]?.v ?? null;
  }, [femSeries]);

  // ============================================================
  // [RENDER] Layout con proporción áurea
  // ============================================================
  return (
    <div className="p-6">
      {/* -------------------------------------------------------- */}
      {/* [HEADER] Título */}
      {/* -------------------------------------------------------- */}
      <h2 className="text-xl font-bold mb-4">BioStrucX Live — {clientid}</h2>

      {loading && <div>Cargando…</div>}
      {err && <div className="text-red-400">{err}</div>}

      {/* ======================================================= */}
      {/* [SECCIÓN 1] GRID ÁUREO 61.8% / 38.2%                     */}
      {/* ======================================================= */}
      <div
        className="grid grid-cols-1 gap-[34px] mb-[34px] transition-all duration-300
                   md:[grid-template-columns:61.8%_38.2%]"
      >

        {/* --------------------- IZQUIERDA (61.8%) --------------------- */}
        <div className="flex flex-col gap-[34px]">
          {/* [A1] Video Ely + bienvenida */}
          <div className="rounded-[21px] border border-white/10 bg-black/40 overflow-hidden">
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
            <div className="p-[13px] text-sm">
              CHAT CON LA IA DE BIOSTRUCX.AI LLAMADA <strong>ELY</strong>. HELLO WELCOME, cliente <strong>{clientid}</strong>.
            </div>
          </div>

          {/* [A2] Mapa 3D (placeholder) */}
          <div className="rounded-[21px] border border-white/10 bg-white/5 p-[21px]">
            <div className="text-sm mb-[13px] font-semibold">Mapa 3D — ubicación del sensor</div>
            <div className="h-[233px] rounded-[21px] bg-black/30" />
          </div>
        </div>

        {/* --------------------- DERECHA (38.2%) ----------------------- */}
        <div className="flex flex-col gap-[34px]">

          {/* [B1] FEM — Análisis */}
          <div className="rounded-[21px] border border-white/10 bg-white/5 p-[21px]">
            <div className="text-sm mb-[8px] font-semibold">
              FEM — Análisis (OpenSeesPy). Viga {femMeta.L ? `${toFixed(femMeta.L, 2)} m` : '25×25×1 m (demo)'}
              {Number.isFinite(femMeta.PkN) && <> | Carga: {toFixed(femMeta.PkN)} kN</>}
              {Number.isFinite(femMeta.E) && <> | E: {toFixed(femMeta.E)} GPa</>}
              {femMeta.bc && <> | Condiciones: {String(femMeta.bc)}</>}
            </div>

            <div className="h-[220px] rounded-[21px] bg-black/30 relative">
              {fem && fem.status === 'done' ? (
                <>
                  <FEMViewer
                    viz={fem.viz}
                    height={220}
                    scale={scale}
                    showUndeformed={showUndeformed}
                    showSupports={true}
                    showLoads={true}
                    interactive={interactive}
                  />
                  <div className="absolute left-3 right-3 bottom-3">
                    <ColorLegend min={uRange.min} max={uRange.max} />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm">
                  {!fem ? 'sin modelo' : `estado: ${fem.status}`}
                </div>
              )}
            </div>

            <FemToolbar
              scale={scale} setScale={setScale}
              showUndeformed={showUndeformed} setShowUndeformed={setShowUndeformed}
              interactive={interactive} setInteractive={setInteractive}
              onFit={handleFit}
            />

            <p className="mt-[13px] text-xs text-white/70">
              Geometría no deformada (gris tenue) y deformada con factor ×{scale} si el viewer lo soporta.
            </p>
          </div>

          {/* [B2] FEM — Ubicación del sensor */}
          <div className="rounded-[21px] border border-white/10 bg-white/5 p-[21px]">
            <div className="text-sm mb-[8px] font-semibold">FEM — Ubicación del sensor (BSX–FARADAY1)</div>

            <div className="h-[180px] rounded-[21px] bg-black/30 relative">
              {vizWithMarker ? (
                <>
                  <FEMViewer
                    viz={vizWithMarker}
                    height={180}
                    scale={scale}
                    showUndeformed={showUndeformed}
                    interactive={interactive}
                    showSensorPin={true}
                  />
                  <div className="absolute left-3 bottom-3 text-[12px] bg-black/40 px-[8px] py-[6px] rounded-[13px]">
                    <span className="mr-[8px]">
                      <span className="inline-block w-[8px] h-[8px] rounded-full bg-red-500 border border-white/70 align-middle mr-[6px]" />
                      <strong>Sensor:</strong> BSX–FARADAY1
                    </span>
                    {Number.isFinite(lastFemValue) && (
                      <span className="text-neutral-300">| FEM: {toFixed(lastFemValue)} mm</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm">sin modelo</div>
              )}
            </div>

            <FemToolbar
              scale={scale} setScale={setScale}
              showUndeformed={showUndeformed} setShowUndeformed={setShowUndeformed}
              interactive={interactive} setInteractive={setInteractive}
              onFit={handleFit}
            />

            <p className="mt-[13px] text-xs text-white/70">
              El marcador rojo indica la posición del sensor sobre la viga. Tooltip/📍 pueden activarse en el viewer.
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================= */}
      {/* [SECCIÓN 2] GRID INFERIOR — 2/3 + 1/3 (Fibonacci)        */}
      {/* ======================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[34px]">

        {/* --------------------- IZQUIERDA 2/3 ------------------------- */}
        <div className="lg:col-span-2 flex flex-col gap-[34px]">
          {/* [C1] Gráfico FEM — autoscale */}
          <LiveChart
            title="GRÁFICO 1 — Desplazamiento teórico (FEM) vs tiempo"
            unit="mm"
            valueKey="v"
            data={femSeries}
            now={now}
            windowSec={300}
            yMin={null}
            yMax={null}
            showZeroLine
            highlightLast
          />

          {/* [C2] Gráfico Real — 0..5 mm fijo */}
          <LiveChart
            title="GRÁFICO 2 — Real (disp_mm) vs tiempo"
            unit="mm"
            valueKey="disp_mm"
            data={stream}
            now={now}
            windowSec={300}
            yMin={0}
            yMax={5}
          />
        </div>

        {/* --------------------- DERECHA 1/3 --------------------------- */}
        <div className="flex flex-col gap-[34px]">
          {/* [D1] Video Ely secundario */}
          <div className="rounded-[21px] border border-white/10 bg-black/40 overflow-hidden">
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
            <div className="p-[13px] text-sm">
              Arriba, video de <strong>Ely</strong> explicando la predicción actual.
            </div>
          </div>

          {/* [D2] Tarjeta explicativa */}
          <div className="rounded-[21px] border border-white/10 bg-white/5 p-[21px]">
            <div className="text-sm mb-[13px] font-semibold">Tarjeta de diagnóstico (explicación)</div>
            <p className="text-sm text-white/80">
              Comparación de curvas y umbrales. Alertas cuando sea necesario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// [COMPONENTE REUTILIZADO] LiveChart con alturas y márgenes áureos
// - Altura: 233 px (≈ 144 × φ)
// - Márgenes: 34/21 px (Fibonacci)
// - Ticks: X=8, Y=5 (pareja Fibonacci)
// ================================================================
function LiveChart({
  title, unit = '', valueKey = 'value', data = [], now,
  windowSec = 60,
  // yMin/yMax = null => AUTOESCALA; si ambos son número => escala fija
  yMin = null,
  yMax = null,
  height = 233,
  // ajustes de autoscale
  minSpan = 0.2,   // mm mínimos de span para que se vea algo
  padPct = 0.15,   // 15% de padding arriba/abajo
  showZeroLine = false,
  highlightLast = false,
}) {
  const width = 640;
  const pad = { l: 34, r: 21, t: 21, b: 34 }; // Fibonacci
  const end = now;
  const start = end - windowSec * 1000;

  const rows = (Array.isArray(data) ? data : [])
    .filter(d => d && typeof d.ts === 'number' && d.ts >= start && d.ts <= end);

  let minV, maxV;

  // ¿escala fija?
  if (Number.isFinite(yMin) && Number.isFinite(yMax)) {
    minV = yMin; maxV = yMax;
  } else {
    const vals = rows.map(r => Number(r[valueKey])).filter(Number.isFinite);
    if (vals.length) {
      let vmin = Math.min(...vals);
      let vmax = Math.max(...vals);
      let range = vmax - vmin;

      if (range < 1e-9) {
        // todos iguales → abre ventana mínima alrededor del valor
        const span = Math.max(Math.abs(vmax) * 0.2, minSpan);
        vmin = vmax - span;
        vmax = vmax + span;
      } else {
        const padY = range * padPct;
        vmin -= padY;
        vmax += padY;
        if (vmin > 0) vmin = Math.max(0, vmin - padY);
        if (vmax < 0) vmax = Math.min(0, vmax + padY);
      }
      minV = vmin;
      maxV = vmax;
    } else {
      minV = 0; maxV = 1;
    }
  }

  const xScale = (ts) => pad.l + ((ts - start) / (end - start || 1)) * (width - pad.l - pad.r);
  const yScale = (v)  => pad.t + (1 - ((v - minV) / (maxV - minV || 1))) * (height - pad.t - pad.b);

  const pointsArr = rows
    .filter(r => Number.isFinite(Number(r[valueKey])))
    .map(r => ({ x: xScale(r.ts), y: yScale(Number(r[valueKey])) }));

  const points = pointsArr.map(p => `${p.x},${p.y}`).join(' ');

  const ticksX = 8, ticksY = 5; // Fibonacci
  const xTicks = Array.from({ length: ticksX + 1 }, (_, i) => start + (i * (end - start)) / ticksX);
  const yTicks = Array.from({ length: ticksY + 1 }, (_, i) => minV + (i * (maxV - minV)) / ticksY);

  const zeroInside = showZeroLine && minV < 0 && maxV > 0;
  const y0 = yScale(0);
  const last = highlightLast && pointsArr.length ? pointsArr[pointsArr.length - 1] : null;

  return (
    <div className="rounded-[21px] bg-neutral-900/70 p-[21px] shadow-lg">
      {/* -------------------------------------------------------- */}
      {/* [HEADER CHART] Título + ventana */}
      {/* -------------------------------------------------------- */}
      <div className="mb-[13px] flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-xs text-neutral-400">Window: {windowSec}s</div>
      </div>

      {/* -------------------------------------------------------- */}
      {/* [SVG] Plot principal */}
      {/* -------------------------------------------------------- */}
      <div className="h-[233px] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Grid */}
          {xTicks.map((t, i) => (
            <line key={`x${i}`} x1={xScale(t)} x2={xScale(t)} y1={pad.t} y2={height - pad.b} stroke="currentColor" opacity="0.12" />
          ))}
          {yTicks.map((v, i) => (
            <line key={`y${i}`} x1={pad.l} x2={width - pad.r} y1={yScale(v)} y2={yScale(v)} stroke="currentColor" opacity="0.12" />
          ))}
          {/* Axes */}
          <line x1={pad.l} x2={width - pad.r} y1={height - pad.b} y2={height - pad.b} stroke="currentColor" opacity="0.6" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={height - pad.b} stroke="currentColor" opacity="0.6" />

          {/* Línea 0 mm */}
          {zeroInside && (
            <line x1={pad.l} x2={width - pad.r} y1={y0} y2={y0} stroke="currentColor" opacity="0.4" strokeDasharray="4 4" />
          )}

          {/* Tick labels */}
          {xTicks.map((t, i) => (
            <text key={`xt${i}`} x={xScale(t)} y={height - 6} textAnchor="middle" className="fill-neutral-400 text-[10px]">
              {new Date(t).toLocaleTimeString([], { hour12: false })}
            </text>
          ))}
          {yTicks.map((v, i) => (
            <text key={`yt${i}`} x={pad.l - 6} y={yScale(v)} textAnchor="end" dominantBaseline="middle" className="fill-neutral-400 text-[10px]">
              {Number(v.toFixed(2))}{unit && ` ${unit}`}
            </text>
          ))}

          {/* Serie */}
          {points && <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />}

          {/* Último punto */}
          {last && <circle cx={last.x} cy={last.y} r="3" fill="currentColor" opacity="0.9" />}
        </svg>
      </div>
    </div>
  );
}


