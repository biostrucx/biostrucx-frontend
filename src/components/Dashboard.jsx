import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE } from '../services/api';

export default function Dashboard() {
  const { clientid } = useParams();           // ej: "jeimie"
  const [latest, setLatest] = useState(null); // último punto
  const [stream, setStream] = useState([]);   // ventana reciente
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

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
    fetchData(); // 1ª carga
    const id = setInterval(fetchData, 5000); // refresco cada 5s
    return () => clearInterval(id);
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

      {/* Gráfico muy simple (placeholder) */}
      <div className="bg-black/40 rounded-lg p-4 mb-4">
        {stream.length === 0 ? (
          <div className="opacity-70">Esperando datos…</div>
        ) : (
          <Sparkline data={stream.map(d => Number(d.disp_mm))} />
        )}
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

// mini-sparkline sin libs: dibuja barras simples
function Sparkline({ data = [] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const norm = (v) => max === min ? 0 : (v - min) / (max - min);

  return (
    <div className="flex items-end gap-[2px] h-32">
      {data.map((v, i) => (
        <div
          key={i}
          style={{ height: `${Math.round(norm(v) * 100)}%` }}
          className="w-1 bg-white/70"
        />
      ))}
    </div>
  );
}
