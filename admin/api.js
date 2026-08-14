const API_BASE = 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('admin_token');
}

function setToken(token) {
  localStorage.setItem('admin_token', token);
}

function clearToken() {
  localStorage.removeItem('admin_token');
}

function requireAuthOrRedirect() {
  if (!getToken()) {
    window.location.href = 'login.html';
  }
}

async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = 'login.html';
    throw new Error('Not authenticated');
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}
