const TOKEN_KEY = 'patina_token'

// In local dev this stays empty and Vite's proxy (vite.config.js) forwards
// /api and /uploads to Flask on :5000. In production (frontend and backend
// deployed separately, e.g. Vercel + Render) set VITE_API_URL to your
// deployed backend's origin, e.g. https://patina-api.onrender.com
const API_BASE = import.meta.env.VITE_API_URL || ''

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export async function apiUpload(path, formData) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}

// Listing photos come back from the API as relative paths like
// "/uploads/MW-014.jpg". In local dev the Vite proxy resolves that
// correctly against the current origin. In production, once frontend and
// backend live on different domains, it needs the same API_BASE prefix.
export function mediaUrl(path) {
  if (!path) return path
  return `${API_BASE}${path}`
}

export { TOKEN_KEY }
