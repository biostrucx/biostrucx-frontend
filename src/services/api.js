const BASE = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');

export async function fetchJson(path, opts = {}) {
  const url = BASE + (path.startsWith('/') ? path : '/' + path);
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

