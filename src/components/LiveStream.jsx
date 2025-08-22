import React, { useEffect, useRef, useState } from 'react';
import { getStream, getLatest } from '../services/sensors';

export default function LiveStream({ clientid = 'cliente_1', window = '5m', limit = 300, intervalMs = 2000 }) {
  const [rows, setRows] = useState([]);
  const [latest, setLatest] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    let abort = false;

    async function tick() {
      try {
        const [stream, last] = await Promise.all([
          getStream(clientid, window, limit),
          getLatest(clientid),
        ]);
        if (!abort) { setRows(stream); setLatest(last); }
      } catch (e) { /* opcional: console.error(e) */ }
    }

    tick();
    timer.current = setInterval(tick, intervalMs);
    return () => { abort = true; clearInterval(timer.current); };
  }, [clientid, window, limit, intervalMs]);

  // mini gráfico SVG (disp_mm si existe, si no voltage_dc)
  const values = rows.map(r => (typeof r.disp_mm === 'number' ? r.disp_mm : r.voltage_dc || 0));
  const w = 520, h = 140;
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const span = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * (w - 10) + 5;
    const y = h - 10 - ((v - min) / span) * (h - 20);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <h2 style={{ margin: 0, marginBottom: 8 }}>BioStrucX Live — {clientid}</h2>

      <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Último ts</div>
          <div>{latest?.ts ? new Date(latest.ts).toLocaleString() : '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>disp_mm</div>
          <div>{latest?.disp_mm ?? '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>voltage_dc</div>
          <div>{latest?.voltage_dc ?? '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>adc_raw</div>
          <div>{latest?.adc_raw ?? '—'}</div>
        </div>
      </div>

      <svg width={w} height={h} style={{ background: '#fafafa', borderRadius: 8 }}>
        <polyline
          fill="none"
          stroke="black"
          strokeWidth="2"
          points={points}
        />
        <text x="8" y="14" fontSize="10" fill="#6b7280">min {min.toFixed(2)}</text>
        <text x="8" y={h - 2} fontSize="10" fill="#6b7280">max {max.toFixed(2)}</text>
      </svg>

      <div style={{ marginTop: 12, maxHeight: 220, overflow: 'auto', borderTop: '1px solid #eee', paddingTop: 8 }}>
        <table width="100%">
          <thead>
            <tr>
              <th align="left">ts</th>
              <th align="right">disp_mm</th>
              <th align="right">voltage_dc</th>
              <th align="right">adc_raw</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id || r.ts}>
                <td>{new Date(r.ts).toLocaleTimeString()}</td>
                <td align="right">{r.disp_mm ?? ''}</td>
                <td align="right">{r.voltage_dc ?? ''}</td>
                <td align="right">{r.adc_raw ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

