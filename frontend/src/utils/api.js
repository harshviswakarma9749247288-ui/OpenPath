const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]');

const rawApiUrl = isLocalhost
  ? (import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000/api')
  : (import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? 'https://openpath-jkpo.onrender.com/api'
      : 'http://localhost:5000/api'));

const sanitizedApiUrl = rawApiUrl.trim().replace(/\/+$/, '');
const API_BASE = sanitizedApiUrl.endsWith('/api') ? sanitizedApiUrl : `${sanitizedApiUrl}/api`;

export const request = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const token = localStorage.getItem('openpath_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    method,
    headers,
    credentials: 'include',
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const timeoutMs = options.timeout || 45000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...config,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(
        data?.message || data?.error || `Request failed with status ${res.status}`
      );
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection to the server.');
    }
    throw error;
  }
};

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
