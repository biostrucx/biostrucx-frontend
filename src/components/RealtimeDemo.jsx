import React, { useEffect, useMemo, useRef, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

/**
 * BioStrucX Realtime Widget (clock-driven X axis)
 * - Works without backend data; the X axis advances with time.
 * - When you later plug real data, call pushPoint({ ts: Date.now(), value: <number> }).
 * - If value is null/undefined, the chart shows a gap (no line), but time keeps moving.
 */

function useRealtimeSeries({ windowSec = 60, tickMs = 1000, simulate = false }) {
  const [series, setSeries] = useState([]);
  const simRef = useRef({ v: 0.0, dir: 1 });

  useEffect(() => {
    const id = setInterval(() => {
      const ts = Date.now();
      let value = null;
      if (simulate) {
        // Simple slow random walk for visual feedback (can turn off)
        const s = simRef.current;
        s.v += s.dir * (Math.random() * 0.02);
        if (Math.abs(s.v) > 1) s.dir *= -1;
        value = Number(s.v.toFixed(3));
      }
      setSeries((prev) => {
        const next = [...prev, { ts, value }];
        const cutoff = ts - windowSec * 1000;
        while (next.length && next[0].ts < cutoff) next.shift();
        return next;
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [windowSec, tickMs, simulate]);

  // External API to push real points later
  const pushPoint = (pt) => {
    const ts = pt?.ts ?? Date.now();
    const value = typeof pt?.value === "number" ? pt.value : null;
    setSeries((prev) => {
      const next = [...prev, { ts, value }];
      const cutoff = ts - windowSec * 1000;
      while (next.length && next[0].ts < cutoff) next.shift();
      return next;
    });
  };

  return { series, pushPoint };
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour12: false });
}

function LiveChart({ title, unit = "", yDomain = ["auto", "auto"], windowSec = 60, simulate = false }) {
  const { series } = useRealtimeSeries({ windowSec, tickMs: 1000, simulate });

  const data = useMemo(
    () => series.map((p) => ({ t: p.ts, value: p.value })),
    [series]
  );

  const latest = data.length ? data[data.length - 1] : null;

  return (
    <div className="w-full rounded-2xl bg-neutral-900/70 p-4 shadow-lg">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="text-xs text-neutral-400">Window: {windowSec}s</div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeOpacity={0.15} />
            <XAxis
              dataKey="t"
              type="number"
              domain={[Date.now() - windowSec * 1000, "dataMax"]}
              tickFormatter={formatTime}
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
            />
            <YAxis domain={yDomain} tick={{ fill: "#a3a3a3", fontSize: 12 }} tickCount={6} width={56} />
            <Tooltip
              labelFormatter={(v) => formatTime(v)}
              formatter={(v) => (v == null ? "–" : `${v} ${unit}`)}
              contentStyle={{ background: "#0a0a0a", border: "1px solid #333" }}
            />
            <ReferenceLine y={0} strokeOpacity={0.25} />
            <Line type="monotone" dataKey="value" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-neutral-800/70 p-2 text-neutral-300">
          <div className="text-xs text-neutral-400">Último ts</div>
          <div className="font-medium">{latest ? formatTime(latest.t) : "—"}</div>
        </div>
        <div className="rounded-xl bg-neutral-800/70 p-2 text-neutral-300">
          <div className="text-xs text-neutral-400">Valor</div>
          <div className="font-medium">{latest?.value ?? "—"} {unit}</div>
        </div>
      </div>
      {!simulate && (
        <p className="mt-3 text-xs text-neutral-500">
          En modo "sin datos". El eje tiempo avanza en vivo. Cuando conectes el backend, empuja puntos reales y la línea aparecerá.
        </p>
      )}
    </div>
  );
}

export default function RealtimeDemo() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <h2 className="text-2xl font-bold text-white">BioStrucX Live – Realtime Widgets</h2>
      <p className="text-sm text-neutral-400">
        Demo del widget en tiempo real sin datos: el eje X (tiempo) avanza aunque la serie esté vacía. Activa la simulación
        si quieres ver una línea de ejemplo.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LiveChart title="Voltage (DC)" unit="V" yDomain={[0, 5]} windowSec={60} simulate={false} />
        <LiveChart title="Displacement" unit="mm" yDomain={[0, 5]} windowSec={60} simulate={false} />
      </div>

      <div className="rounded-2xl bg-neutral-900/70 p-4 text-neutral-300">
        <h4 className="mb-2 font-semibold text-white">Cómo enchufar tus datos reales luego</h4>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>Extrae useRealtimeSeries de este archivo a un hook separado si gustas.</li>
          <li>
            Llama a <code>pushPoint({ ts: Date.now(), value: yourNumber })</code> cuando llegue un dato de tu API o WebSocket.
          </li>
          <li>Deja <code>simulate</code> en <code>false</code> para ver gaps cuando no hay datos (igual que ThingsBoard).</li>
        </ol>
      </div>
    </div>
  );
}
