// Keeps the last few browser errors so a bug report can include them.
// Installed once at app start (main.jsx). Cheap: a small ring buffer, no network.
const MAX = 10;
const recent = [];
let installed = false;

function push(kind, message) {
  const text = String(message || '').replace(/\s+/g, ' ').trim().slice(0, 400);
  if (!text) return;
  recent.push(`${new Date().toISOString().slice(11, 19)} [${kind}] ${text}`);
  if (recent.length > MAX) recent.shift();
}

function describe(value) {
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value); } catch { return String(value); }
}

export function installErrorCollector() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('error', e => {
    // Resource load failures (img/script) have no message; record the URL instead
    if (e.message) push('error', `${e.message}${e.filename ? ` (${e.filename.split('/').pop()}:${e.lineno})` : ''}`);
    else if (e.target && e.target !== window) push('resource', `Failed to load ${e.target.src || e.target.href || e.target.tagName}`);
  }, true);
  window.addEventListener('unhandledrejection', e => push('promise', describe(e.reason)));
  const original = console.error;
  console.error = (...args) => {
    try { push('console', args.map(describe).join(' ')); } catch { /* never break logging */ }
    original.apply(console, args);
  };
}

/** Most recent errors, oldest first */
export function getRecentErrors() {
  return recent.slice();
}
