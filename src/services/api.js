// src/services/api.js
const fromCRA    = process.env.REACT_APP_BACKEND_URL;
const fromVite   = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_BACKEND_URL : undefined;
const fromWindow = typeof window !== 'undefined' ? window.__BACKEND_URL__ : undefined;

export const BASE =
  (fromCRA || fromVite || fromWindow || 'https://api.biostrucx.com').replace(/\/$/, '');

// Helper interno para todas las requests (no exportado)
async function request(method, path, body) {
  const opts = { method };
  if (body !== undefined) {
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body = JSON.stringify(body ?? {});
  }
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}`);
  return res.json();
}

// === Exports originales (sin cambios) ===
export async function get(path) {
  return request('GET', path);
}

export async function post(path, body) {
  return request('POST', path, body);
}
