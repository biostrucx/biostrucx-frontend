import { fetchJson } from './api';

export function getLatest(clientid) {
  return fetchJson(`/api/sensors/latest/${encodeURIComponent(clientid)}`);
}

export function getStream(clientid, window = '5m', limit = 300) {
  const q = `?window=${encodeURIComponent(window)}&limit=${limit}`;
  return fetchJson(`/api/sensors/stream/${encodeURIComponent(clientid)}${q}`);
}

