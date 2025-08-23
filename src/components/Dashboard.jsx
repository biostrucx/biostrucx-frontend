// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE } from '../services/api';

export default function Dashboard() {
  const { clientid } = useParams();           // ej: "jeimie"
  const [latest, setLatest] = useState(null); // último punto
  const [stream, setStream] = useState([]);   // ventana reciente
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [now, setNow] = useState(Date.now()); // ← fuerza que el eje X avance

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
      setStream(Array.isArray(s) ? s : []);
    } catch (e) {
      setErr('No se pudo cargar datos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();                     // 1ª carga
    const idPoll = setInterval(fetchData, 5000); // refresco cada 5s
    const idTick = setInterval(() => setNow(Date.now()), 1000); // ← tick 1s para mover eje
    return () => { clearInterval(idPoll); clearInterval(idTick); };
  }, [clientid]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        BioStrucX Live — {clientid}
      </h2>

      {loading && <div>Cargando…</div>}
      {err && <div className="text-red-400">{err}</div>}

      {/* Último dato */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Último ts" value={latest ? new Date(latest.ts).toLocaleString() : '—'} />
        <Card title="disp_mm" value={latest?.disp_mm ?? '—'} />
        <Card title="voltage_dc" value={latest?.voltage_dc ?? '—'} />
        <Card title="adc_raw" value={latest?.adc_raw ?? '—'} />
      </div>

      {/* Widgets en tiempo real (eje X avanza aunque no haya datos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <LiveChart
          title="Voltage (DC)"
          unit="V"
          valueKey="voltage_dc"
          data={stream}
          now={now}
          windowSec={60}
          yMin={0}
          yMax={5}
        />
        <LiveChart
          title="Displacement"
          unit="mm"
          valueKey="disp_mm"
          data={stream}
          now={now}
          windowSec={60}
          yMin={0}
          yMax={5}
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left opacity-70">
            <tr>
              <th className="py-2">ts</th>
              <th>disp_mm</th>
              <th>voltage_dc</th>
              <th>adc_raw</th>
            </tr>
          </thead>
          <tbody>
            {stream.slice(-50).map((d, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="py-2">{new Date(d.ts).toLocaleTimeString()}</td>
                <td>{d.disp_mm}</td>
                <td>{d.voltage_dc}</td>
                <td>{d.adc_raw}</td>
              </tr>
            ))}
            {stream.length === 0 && (
              <tr>
                <td className="py-4 opacity-60" colSpan={4}>
                  Sin datos aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-black/40 rounded-lg p-4">
      <div className="text-xs opacity-70">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

/**
 * LiveChart (SVG puro)
 * - El dominio X es [now - windowSec, now] y se recalcula cada 1s (aunque no haya datos).
 * - Si no hay puntos válidos, se muestra solo grid + eje corriendo.
 * - Divide en segmentos para no unir gaps.
 */
function LiveChart({
  title,
  unit = '',
  valueKey = 'value',
  data = [],
  now,
  windowSec = 60,
  yMin = 'auto',
  yMax = 'auto',
  height = 220,
}) {
  const width = 640; // se adapta con CSS contenedor (usamos viewBox)
  const pad = { l: 48, r: 16, t: 16, b: 28 };
  const viewW = width;
  const viewH = height;

  const end = now;
  const start = end - windowSec * 1000;

  // Filtrar datos dentro de la ventana
  const rows = (Array.isArray(data) ? data : []).filter(d => d && typeof d.ts === 'number' && d.ts >= start - 2000 && d.ts <= end + 1000);

  // Y-domain
  let minV = Number.POSITIVE_INFINITY;
  let maxV = Number.NEGATIVE_INFINITY;
  for (const d of rows) {
    const v = Number(d[valueKey]);
    if (!Number.isFinite(v)) continue;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }
  if (!Number.isFinite(minV) || !Number.isFinite(maxV)) {
    minV = typeof yMin === 'number' ? yMin : 0;
    maxV = typeof yMax === 'number' ? yMax : 1;
  } else {
    if (typeof yMin === 'number') minV = yMin;
    if (typeof yMax === 'number') maxV = yMax;
    if (minV === maxV) { minV -= 1; maxV += 1; }
  }

  // Escalas
  const xScale = (ts) => {
    const t = Math.max(start, Math.min(end, ts));
    const frac = (t - start) / (end - start || 1);
    return pad.l + frac * (viewW - pad.l - pad.r);
  };
  const yScale = (v) => {
    const frac = (v - minV) / (maxV - minV || 1);
    return pad.t + (1 - frac) * (viewH - pad.t - pad.b);
  };

  // Construir segmentos (no conectar puntos no-numéricos)
  const segments = [];
  let current = [];
  for (const d of rows) {
    const v = Number(d[valueKey]);
    if (Number.isFinite(v)) {
      current.push([xScale(d.ts), yScale(v)]);
    } else if (current.length) {
      segments.push(current);
      current = [];
    }
  }
  if (current.length) segments.push(current);

  // Ejes y ticks simples
  const ticksX = 5;
  const ticksY = 5;
  const xTicks = Array.from({ length: ticksX + 1 }, (_, i) => start + (i * (end - start)) / ticksX);
  const yTicks = Array.from({ length: ticksY + 1 }, (_, i) => minV + (i * (maxV - minV)) / ticksY);

  return (
    <div className="rounded-2xl bg-neutral-900/70 p-4 shadow-lg">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-xs text-neutral-400">Window: {windowSec}s</div>
      </div>

      <div className="h-56 w-full">
        <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full h-full">
          {/* Grid */}
          {xTicks.map((t, i) => (
            <line key={`x${i}`} x1={xScale(t)} x2={xScale(t)} y1={pad.t} y2={viewH - pad.b} stroke="currentColor" opacity="0.12" />
          ))}
          {yTicks.map((v, i) => (
            <line key={`y${i}`} x1={pad.l} x2={viewW - pad.r} y1={yScale(v)} y2={yScale(v)} stroke="currentColor" opacity="0.12" />
          ))}

          {/* Ejes */}
          <line x1={pad.l} x2={viewW - pad.r} y1={viewH - pad.b} y2={viewH - pad.b} stroke="currentColor" opacity="0.6" />
          <line x1={pad.l} x2={pad.l} y1={pad.t} y2={viewH - pad.b} stroke="currentColor" opacity="0.6" />

          {/* Labels X */}
          {xTicks.map((t, i) => (
            <text key={`xt${i}`} x={xScale(t)} y={viewH - 6} textAnchor="middle" className="fill-neutral-400 text-[10px]">
              {new Date(t).toLocaleTimeString([], { hour12: false })}
            </text>
          ))}

          {/* Labels Y */}
          {yTicks.map((v, i) => (
            <text key={`yt${i}`} x={pad.l - 6} y={yScale(v)} textAnchor="end" dominantBaseline="middle" className="fill-neutral-400 text-[10px]">
              {Number(v.toFixed(2))}
            </text>
          ))}

          {/* Línea(s) de datos */}
          {segments.map((seg, idx) => {
            const d = seg.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
            return <path key={idx} d={d} fill="none" stroke="currentColor" strokeWidth="2" />;
          })}
        </svg>
      </div>

      {/* Footer mini-stats */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-neutral-800/70 p-2 text-neutral-300">
          <div className="text-xs text-neutral-400">Último ts</div>
          <div className="font-medium">
            {rows.length ? new Date(rows[rows.length - 1].ts).toLocaleTimeString([], { hour12: false }) : '—'}
          </div>
        </div>
        <div className="rounded-xl bg-neutral-800/70 p-2 text-neutral-300">
          <div className="text-xs text-neutral-400">Último valor</div>
          <div className="font-medium">
            {rows.length && Number.isFinite(Number(rows[rows.length - 1][valueKey])))
              ? `${Number(rows[rows.length - 1][valueKey]).toFixed(3)} ${unit}`
              : '—'}
          </div>
        </div>
      </div>

      {rows.length === 0 && (
        <p className="mt-3 text-xs text-neutral-500">
          Modo sin datos: el tiempo avanza en vivo; la línea aparecerá cuando lleguen lecturas.
        </p>
      )}
    </div>
  );
}
