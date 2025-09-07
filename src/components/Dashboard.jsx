import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE } from '../services/api';
import FEMViewer from './FEMViewer';

/* ====================== UTILS ====================== */
const toFixed = (v, n = 2) => (Number.isFinite(v) ? Number(v).toFixed(n) : '—');
const kN = (pN) => (Number.isFinite(pN) ? (pN / 1000) : null);
const GPa = (ePa) => (Number.isFinite(ePa) ? (ePa / 1e9) : null);

/* Leyenda simple con gradiente azul→verde→rojo */
function ColorLegend({ min, max, label = 'Desplazamiento (mm)' }) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
        <span>{label}</span>
        <span>{toFixed(min)} — {toFixed(max)} mm</span>
      </div>
      <div
        className="h-2 w-full rounded"
        style={{
          background:
            'linear-gradient(90deg, #2563eb 0%, #22c55e 50%, #ef4444 100%)',
        }}
      />
    </div>
  );
}

/* Mini toolbar para la tarjeta FEM */
function FemToolbar({
  scale, setScale,
  showUndeformed, setShowUndeformed,
  interactive, setInteractive,
  onFit,
}) {
  const btn = 'px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-xs';
  const pill = (v) =>
    `px-2 py-1 rounded text-xs ${scale === v ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
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

/* ====================== DASHBOARD ====================== */
export default function Dashboard() {
  const { clientid } = useParams();

  // Real (sensor)
  const [latest, setLatest] = useState(null);
  const [stream, setStream] = useState([]);

  // FEM
  const [fem, setFem] = useState(null);
  const [femSeries, setFemSeries] = useState([]);

  // UI
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [now, setNow] = useState(Date.now());

  // Controles FEM (ambas tarjetas comparten estado para consistencia visual)
  const [scale, setScale] = useState(50);
  const [showUndeformed, setShowUndeformed] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const handleFit = () => {
    // Si tu FEMViewer expone un método imperativo, puedes conectarlo aquí con ref.
    // De momento dejamos el botón como "hint" visual.
  };

  /* ====== FETCHS ====== */

  // Sensores (real)
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

  // FEM latest (para la tarjeta superior)
  async function fetchFem() {
    try {
      const r = await fetch(`${BASE}/api/simulations/${clientid}/latest`);
      const j = await r.json();
      setFem(j || null);
    } catch {
      setFem(null);
    }
  }

  // FEM series (gráfico 1)
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

  const ELY_VIDEO = "https://res.cloudinary.com/di4esyfmv/video/upload/v1756592748/7670836-uhd_3840_2160_30fps_d7twsq.mp4";

  // viz + marker
  const vizWithMarker = fem?.viz ? { ...fem.viz, marker: fem.viz.marker || [0.5, 0, 0] } : null;

  // Metadatos del modelo/carga para el título técnico
  const femMeta = useMemo(() => {
    const m = fem?.model || {};
    const p = fem?.params || {};
    const L = m.L_m ?? m.L ?? null;
    const E = GPa(m.E_Pa ?? m.E ?? null);
    const PkN = kN(p.P ?? p.load_N ?? null);
    return { L, E, PkN, supports: m.supports || null, bc: m.bc || null };
  }, [fem]);

  // Rango de desplazamientos para leyenda
  const uRange = useMemo(() => {
    const arr = fem?.viz?.u_mag;
    if (!Array.isArray(arr) || !arr.length) return { min: null, max: null };
    let min = +Infinity, max = -Infinity;
    for (const v of arr) {
      const n = Number(v);
      if (Number.isFinite(n)) { if (n < min) min = n; if (n > max) max = n; }
    }
    // valores suelen venir en mm; no transformo unidades
    return { min, max };
  }, [fem]);

  // último valor serie FEM (para mostrar en tarjeta de sensor)
  const lastFemValue = useMemo(() => {
    if (!femSeries?.length) return null;
    return femSeries[femSeries.length - 1]?.v ?? null;
  }, [femSeries]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">BioStrucX Live — {clientid}</h2>

      {loading && <div>Cargando…</div>}
      {err && <div className="text-red-400">{err}</div>}

      {/* ===================== SECCIÓN 1 (arriba) ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 transition-all duration-300">

        {/* Columna IZQUIERDA */}
        <div className="flex flex-col gap-6">
          {/* A1: Video Ely + mensaje bienvenida */}
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
              CHAT CON LA IA DE BIOSTRUCX.AI LLAMADA <strong>ELY</strong>. HELLO WELCOME, cliente <strong>{clientid}</strong>.
            </div>
          </div>

          {/* A2: Mapa 3D (placeholder) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-3 font-semibold">Mapa 3D — ubicación del sensor</div>
            <div className="h-[220px] rounded-xl bg-black/30" />
          </div>
        </div>

        {/* Columna DERECHA – FEM */}
        <div className="flex flex-col gap-6">

          {/* ===== Tarjeta FEM — Análisis ===== */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-1 font-semibold">
              {/* Título técnico con parámetros si existen */}
              FEM — Análisis (OpenSeesPy). Viga {femMeta.L ? `${toFixed(femMeta.L, 2)} m` : '25×25×1 m (demo)'}
              {Number.isFinite(femMeta.PkN) && <> | Carga: {toFixed(femMeta.PkN)} kN</>}
              {Number.isFinite(femMeta.E) && <> | E: {toFixed(femMeta.E)} GPa</>}
              {femMeta.bc && <> | Condiciones: {String(femMeta.bc)}</>}
            </div>

            <div className="h-[220px] rounded-xl bg-black/30 relative">
              {fem && fem.status === 'done' ? (
                <>
                  <FEMViewer
                    viz={fem.viz}
                    height={220}
                    /* Nuevos props no rompen si FEMViewer no los usa */
                    scale={scale}
                    showUndeformed={showUndeformed}
                    showSupports={true}
                    showLoads={true}
                    interactive={interactive}
                  />
                  {/* Leyenda */}
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

            {/* Toolbar */}
            <FemToolbar
              scale={scale} setScale={setScale}
              showUndeformed={showUndeformed} setShowUndeformed={setShowUndeformed}
              interactive={interactive} setInteractive={setInteractive}
              onFit={handleFit}
            />

            <p className="mt-3 text-xs text-white/70">
              Geometría no deformada (gris tenue) y deformada con factor ×{scale} si el viewer lo soporta.
            </p>
          </div>

          {/* ===== Tarjeta FEM — Ubicación del sensor ===== */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-1 font-semibold">FEM — Ubicación del sensor (BSX–FARADAY1)</div>

            <div className="h-[180px] rounded-xl bg-black/30 relative">
              {vizWithMarker ? (
                <>
                  <FEMViewer
                    viz={vizWithMarker}
                    height={180}
                    scale={scale}
                    showUndeformed={showUndeformed}
                    interactive={interactive}
                    showSensorPin={true}     /* si tu viewer lo implementa, dibuja pin/📍 */
                  />
                  {/* Etiqueta del sensor + último valor FEM si existe */}
                  <div className="absolute left-3 bottom-3 text-[12px] bg-black/40 px-2 py-1 rounded">
                    <span className="mr-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 border border-white/70 align-middle mr-1" />
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

            {/* Reutiliza la misma toolbar para consistencia */}
            <FemToolbar
              scale={scale} setScale={setScale}
              showUndeformed={showUndeformed} setShowUndeformed={setShowUndeformed}
              interactive={interactive} setInteractive={setInteractive}
              onFit={handleFit}
            />

            <p className="mt-3 text-xs text-white/70">
              El marcador rojo indica la posición del sensor sobre la viga. Tooltip/📍 pueden activarse en el viewer.
            </p>
          </div>

        </div>
      </div>

      {/* ===================== SECCIÓN 2 (abajo) ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna IZQUIERDA (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Gráfico 1 — Teórico (FEM) */}
          <LiveChart
            title="GRÁFICO 1 — Desplazamiento teórico (FEM) vs tiempo"
            unit="mm"
            valueKey="v"
            data={femSeries}
            now={now}
            windowSec={300}
            yMin={0}
            yMax={5}
          />

          {/* Gráfico 2 — Real (disp_mm) */}
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

        {/* Columna DERECHA */}
        <div className="flex flex-col gap-6">
          {/* Ely secundario */}
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
              Arriba, video de <strong>Ely</strong> explicando la predicción actual.
            </div>
          </div>

          {/* Tarjeta explicativa */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm mb-2 font-semibold">Tarjeta de diagnóstico (explicación)</div>
            <p className="text-sm text-white/80">
              Comparación de curvas y umbrales. Alertas cuando sea necesario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== COMPONENTE REUTILIZADO ===================== */
function LiveChart({
  title, unit = '', valueKey = 'value', data = [], now,
  windowSec = 60, yMin = 0, yMax = 1, height = 220
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
    minV = yMin ?? Math.min(...vals);
    maxV = yMax ?? Math.max(...vals);
    if (minV === maxV) { minV -= 1; maxV += 1; }
  }

  const xScale = (ts) => pad.l + ((ts - start) / (end - start || 1)) * (width - pad.l - pad.r);
  const yScale = (v)  => pad.t + (1 - ((v - minV) / (maxV - minV || 1))) * (height - pad.t - pad.b);

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
              {Number(v.toFixed(2))}{unit && ` ${unit}`}
            </text>
          ))}
          {points && <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />}
        </svg>
      </div>
    </div>
  );
}

