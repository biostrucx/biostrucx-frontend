// src/components/Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLatest, fetchStream } from '../services/sensors';

export default function Dashboard() {
  const { clientid: cidFromRoute } = useParams();
  const clientid = cidFromRoute || 'jeimie';

  const [latest, setLatest] = useState(null); // último punto
  const [stream, setStream] = useState([]);   // ventana reciente
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function loadData() {
    try {
      setErr('');
      // Ambas llamadas a la vez
      const [l, s] = await Promise.all([
        fetchLatest(clientid),
        fetchStream(clientid, { window: '24h', limit: 300 }),
      ]);

      // Normaliza stream si viene como { items: [...] } o como [...]
      const arr = Array.isArray(s) ? s : (Array.isArray(s?.items) ? s.items : []);
      // Ordena por ts ascendente (mejor para gráfico)
      arr.sort((a, b) => Number(a.ts) - Number(b.ts));

      setLatest(l ?? null);
      setStream(arr);
    } catch (e) {
      console.error('Dashboard loadData error:', e);
      setErr('No se pudo cargar datos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadData();                         // 1ª carga
    const id = setInterval(loadData, 5000); // refresco cada 5s
    return () => clearInterval(id);
  }, [clientid]);

  const last50 = useMemo
