const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `请求失败（${res.status}）`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (p, token) => request(p, { token }),
  post: (p, body, token) => request(p, { method: 'POST', body, token }),
  put: (p, body, token) => request(p, { method: 'PUT', body, token }),
  del: (p, token) => request(p, { method: 'DELETE', token }),
};
