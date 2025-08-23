// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE } from '../services/api';

export default function Dashboard() {
  const { clientid } = useParams();
  const [latest, setLatest] = useState(null);
  const [stream, setStream] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [now, setNow] = useState(Date.now());

  async function fetchData() {
  try {
    setErr('');
    const [lRes, sRes] = await Promise.all([
      fetch(`${BASE}/api/sensors/latest/${clientid}`),
      fetch(`${BASE}/api/sensors/stream/${clientid}?window=5m&limit=300`)
    ]);
    const l = await lRes.json();
    const s = await sRes.json();

    // 👇 Conversión del ts a número (epoch ms) para LiveChart
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
    const idPoll = setInterval(fetchData, 5000);
    const idTick = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(idPoll); clearInterval(idTick); };
  }, [clientid]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">BioStrucX Live — {clientid}</h2>

      {loading && <div>Cargando…</div>}
      {err && <div className="text-red-400">{err}</div>}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Último ts" value={latest ? new Date(latest.ts).toLocaleString() : '—'} />
        <Card title="disp_mm" value={latest?.disp_mm ?? '—'} />
        <Card title="voltage_dc" value={latest?.voltage_dc ?? '—'} />
        <Card title="adc_raw" value={latest?.adc_raw ?? '—'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <LiveChart title="Voltage (DC)" unit="V" valueKey="voltage_dc" data={stream} now={now} windowSec={60} yMin={0} yMax={5} />
        <LiveChart title="Displacement" unit="mm" valueKey="disp_mm" data={stream} now={now} windowSec={60} yMin={0} yMax={5} />
      </div>

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
                <td className="py-4 opacity-60" colSpan={4}>Sin datos aún.</td>
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
