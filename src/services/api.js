// src/services/api.js
const fromCRA   = process.env.REACT_APP_BACKEND_URL;
const fromVite  = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_BACKEND_URL : undefined;
const fromWindow = window.__BACKEND_URL__; // opcional si algún día lo inyectas en runtime

export const BASE =
  (fromCRA || fromVite || fromWindow || 'https://api.biostrucx.com').replace(/\/$/, '');

export async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`);
  return res.json();
}

export async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`POST ${path} ${res.status}`);
  return res.json();
}
