/**
 * Bug tracker API client + per-role sessions (developer / tester).
 * Each role keeps its own JWT in sessionStorage, so a developer and a tester
 * session can be open side by side in different tabs.
 */
import { useCallback, useEffect, useState } from 'react';
import { API_BASE, CLIENT_UNAUTHORIZED_EVENT } from './api';

const sessionKey = role => `zenitek_session_${role}`;
const UNAUTHORIZED_EVENT = 'zenitek:bug-unauthorized';

// Screenshots are served by the backend at /uploads/bugs/... (outside /api)
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');
export const assetUrl = url => (url && /^https?:\/\//.test(url) ? url : `${API_ORIGIN}${url || ''}`);

export function readSession(role) {
  try { return JSON.parse(sessionStorage.getItem(sessionKey(role)) || 'null'); } catch { return null; }
}

/** Seconds-since-epoch expiry from a JWT (no signature check: the server still verifies every call) */
export function tokenExpiry(token) {
  try {
    const part = String(token).split('.')[1];
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '='));
    const { exp } = JSON.parse(json);
    return typeof exp === 'number' ? exp : null;
  } catch { return null; }
}

/** The stored session for a role, or null when missing or its token has expired */
export function readValidSession(role) {
  const session = readSession(role);
  if (!session?.token) return null;
  const exp = tokenExpiry(session.token);
  if (!exp || exp * 1000 <= Date.now()) return null;
  return session;
}

function writeSession(role, session) {
  try {
    if (session) sessionStorage.setItem(sessionKey(role), JSON.stringify(session));
    else sessionStorage.removeItem(sessionKey(role));
  } catch { /* storage unavailable: session lasts for this page only */ }
}

/** React hook: { session, login, logout, expired } for one role */
export function useRoleSession(role) {
  const [session, setSession] = useState(() => {
    const stored = readSession(role);
    if (stored && !readValidSession(role)) { writeSession(role, null); return null; } // token already expired
    return stored;
  });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const onUnauthorized = e => {
      if (e.detail !== role) return;
      writeSession(role, null);
      setSession(null);
      setExpired(true);
    };
    // The client admin's CMS calls (utils/api.js) report a 401 through their own event
    const onClientUnauthorized = () => onUnauthorized({ detail: 'client' });
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    if (role === 'client') window.addEventListener(CLIENT_UNAUTHORIZED_EVENT, onClientUnauthorized);
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
      window.removeEventListener(CLIENT_UNAUTHORIZED_EVENT, onClientUnauthorized);
    };
  }, [role]);

  const login = useCallback(async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Sign-in failed (${res.status})`);
    const next = { token: data.token, username: data.user.username, role };
    writeSession(role, next);
    setSession(next);
    setExpired(false);
    return next;
  }, [role]);

  const logout = useCallback(() => {
    writeSession(role, null);
    setSession(null);
    setExpired(false);
  }, [role]);

  return { session, login, logout, expired };
}

/** Authenticated request for a role. Throws Error(message); 401 signs the role out. */
export async function bugRequest(role, path, { method = 'GET', json, form, raw = false } = {}) {
  const session = readSession(role);
  const headers = {};
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  let body;
  if (json !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(json); }
  if (form) body = form;

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body });
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT, { detail: role }));
    throw new Error('Your session has expired. Please sign in again.');
  }
  if (raw && res.ok) return res;
  const data = await res.json().catch(() => ({ message: `Request failed (${res.status})` }));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/** Developer only: download the Excel report */
export async function downloadExcelReport() {
  const res = await bugRequest('developer', '/bugs/reports/excel', { raw: true });
  const blob = await res.blob();
  const match = /filename="?([^"]+)"?/.exec(res.headers.get('Content-Disposition') || '');
  const filename = match ? match[1] : `zenitek-bug-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}
