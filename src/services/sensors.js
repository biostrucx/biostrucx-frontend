// src/services/sensors.js
import { get } from './api';

// Lectura del último registro por cliente
export function fetchLatest(clientid) {
  return get(`/api/sensors/latest/${clientid}`);
}

// Lectura del stream/ventana de tiempo (por defecto 24h, 300 filas)
export function fetchStream(clientid, { window = '24h', limit = 300 } = {}) {
  return get(`/api/sensors/stream/${clientid}?window=${window}&limit=${limit}`);
}
