// src/services/api.js

// Toma la URL del backend desde Render/Vite
export const BASE = import.meta.env.VITE_BACKEND_URL || 'https://api.biostrucx.com';

// Helper genérico para requests, sin caché
async function request(method, path, body) {
  const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}_t=${Date.now()}`; // anti-cache
  const headers = { 'Cache-Control': 'no-store' };
  const opts = { method, headers, cache: 'no-store' };

  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body ?? {});
  }

  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}`);
  return res.json();
}

export const get  = (path) => request('GET',  path);
export const post = (path, body) => request('POST', path, body);
