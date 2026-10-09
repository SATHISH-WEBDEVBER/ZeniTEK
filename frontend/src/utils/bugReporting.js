// Helpers for reporting bugs from the website: who is reporting, what the browser looks like,
// and an instant screenshot of the visible part of the page.
import { readValidSession } from './bugApi';
import { getRecentErrors } from './errorCollector';

export const BUG_CATEGORIES = [
  ['ui-design', 'UI / design'],
  ['functionality', 'Functionality'],
  ['content-text', 'Content / text'],
  ['translation', 'Translation'],
  ['performance', 'Performance'],
  ['broken-link', 'Broken link'],
  ['image-media', 'Image / media'],
  ['form', 'Form'],
  ['mobile-responsive', 'Mobile / responsive'],
  ['other', 'Other']
];
export const REPRODUCIBILITY_OPTIONS = [
  ['always', 'Always'],
  ['sometimes', 'Sometimes'],
  ['once', 'Happened once'],
  ['unable', 'Unable to reproduce']
];
export const SEVERITY_OPTIONS = [
  ['low', 'Low — cosmetic / minor'],
  ['medium', 'Medium — something works incorrectly'],
  ['high', 'High — a main feature is broken'],
  ['critical', 'Critical — site unusable / data loss']
];
export const categoryLabel = v => (BUG_CATEGORIES.find(([k]) => k === v) || [null, v || ''])[1];
export const reproducibilityLabel = v => (REPRODUCIBILITY_OPTIONS.find(([k]) => k === v) || [null, v || ''])[1];

/** The signed-in reporter on the website: a tester, else the client admin (valid, unexpired sessions only) */
export function getReporterSession() {
  const tester = readValidSession('tester');
  if (tester) return { ...tester, role: 'tester' };
  const client = readValidSession('client');
  if (client) return { ...client, role: 'client' };
  return null;
}

export const dashboardFor = role => (role === 'client'
  ? { to: '/admin', label: 'Admin panel', reportsTo: id => `/admin/bugs/${id}` }
  : { to: '/admin/tester', label: 'My reports', reportsTo: id => `/admin/tester/bugs/${id}` });

function parseBrowser(ua) {
  const tests = [
    ['Edge', /Edg\/(\d+)/], ['Opera', /OPR\/(\d+)/], ['Samsung Internet', /SamsungBrowser\/(\d+)/],
    ['Chrome', /Chrome\/(\d+)/], ['Firefox', /Firefox\/(\d+)/], ['Safari', /Version\/(\d+).*Safari/]
  ];
  for (const [name, rx] of tests) {
    const m = rx.exec(ua);
    if (m) return `${name} ${m[1]}`;
  }
  return 'Unknown browser';
}

function parseOs(ua) {
  if (/Android (\d+)/.test(ua)) return `Android ${/Android (\d+)/.exec(ua)[1]}`;
  if (/iPhone|iPad|iPod/.test(ua)) return `iOS ${(/OS (\d+)_/.exec(ua) || [])[1] || ''}`.trim();
  if (/Windows NT 10/.test(ua)) return 'Windows 10/11';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua)) return navigator.maxTouchPoints > 1 ? 'iPadOS' : 'macOS';
  if (/CrOS/.test(ua)) return 'ChromeOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown OS';
}

function deviceType(ua) {
  if (/iPad|Tablet/i.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua)) || (/Mac OS X/.test(ua) && navigator.maxTouchPoints > 1)) return 'tablet';
  if (/Mobi|iPhone|iPod|Android.*Mobile/i.test(ua)) return 'mobile';
  return window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 && navigator.maxTouchPoints > 0 ? 'tablet' : 'desktop';
}

/** Everything we can learn automatically about the page and the browser right now */
export function collectContext() {
  const ua = navigator.userAgent || '';
  let language = '';
  try { language = localStorage.getItem('zenitek-lang') || ''; } catch { /* storage blocked */ }
  return {
    url: window.location.href,
    path: `${window.location.pathname}${window.location.search}`,
    pageTitle: document.title,
    browser: parseBrowser(ua),
    os: parseOs(ua),
    deviceType: deviceType(ua),
    screen: `${window.screen?.width || 0}×${window.screen?.height || 0}`,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    pixelRatio: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    language: language || document.documentElement.lang || 'en',
    scroll: `${Math.round(window.scrollX)}, ${Math.round(window.scrollY)}`,
    online: navigator.onLine,
    userAgent: ua,
    consoleErrors: getRecentErrors(),
    capturedAt: new Date().toISOString()
  };
}

export const environmentSummary = c => `${c.browser} on ${c.os} (${c.deviceType}), viewport ${c.viewport} @${c.pixelRatio}x`;

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

/**
 * Screenshot of exactly what the user sees (viewport at the current scroll position).
 * Elements marked data-capture-ignore and the WhatsApp widget are left out.
 * Resolves to { blob, url, width, height }; throws if the browser cannot render it.
 */
export async function captureViewport() {
  const { default: html2canvas } = await import('html2canvas');
  const root = document.documentElement;
  const vw = root.clientWidth;
  const vh = window.innerHeight;
  const prevBehavior = root.style.scrollBehavior;
  // Smooth scrolling would stop the cloned page from jumping to the current scroll position
  root.style.scrollBehavior = 'auto';

  // Skip work for content outside the viewport (hidden in the clone, layout unchanged)
  const marked = [];
  const mark = el => {
    for (const child of el.children) {
      const r = child.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) { mark(child); continue; }
      if (r.top > vh + 20 || r.bottom < -20) { child.setAttribute('data-cap-off', ''); marked.push(child); }
      else mark(child);
    }
  };
  try {
    mark(document.body);
    const canvas = await html2canvas(document.body, {
      useCORS: true,
      logging: false,
      imageTimeout: 5000,
      backgroundColor: '#ffffff',
      x: window.scrollX,
      y: window.scrollY,
      width: vw,
      height: vh,
      windowWidth: vw,
      windowHeight: vh,
      scale: Math.min(window.devicePixelRatio || 1, 2),
      ignoreElements: el => el.hasAttribute?.('data-capture-ignore')
        || (el.tagName === 'ASIDE' && !!el.querySelector?.('a[href*="wa.me"]')),
      onclone: doc => {
        doc.querySelectorAll('[data-cap-off]').forEach(el => {
          el.style.setProperty('visibility', 'hidden', 'important');
          el.querySelectorAll('img').forEach(img => {
            img.style.width = `${img.width}px`;
            img.style.height = `${img.height}px`;
            img.removeAttribute('srcset');
            img.src = BLANK;
          });
        });
      }
    });
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not encode the screenshot'))), 'image/jpeg', 0.9);
    });
    return { blob, url: URL.createObjectURL(blob), width: canvas.width, height: canvas.height };
  } finally {
    root.style.scrollBehavior = prevBehavior;
    marked.forEach(el => el.removeAttribute('data-cap-off'));
  }
}

/** Draw highlight boxes (normalised 0..1 coordinates) onto a screenshot; returns a new JPEG blob */
export async function annotateScreenshot(shot, boxes) {
  if (!boxes.length) return shot.blob;
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('Could not read the screenshot'));
    i.src = shot.url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const line = Math.max(3, Math.round(canvas.width / 300));
  ctx.lineWidth = line;
  ctx.strokeStyle = '#DC2626';
  ctx.fillStyle = 'rgba(220, 38, 38, 0.12)';
  boxes.forEach(b => {
    const x = b.x * canvas.width;
    const y = b.y * canvas.height;
    const w = b.w * canvas.width;
    const h = b.h * canvas.height;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not encode the screenshot'))), 'image/jpeg', 0.9);
  });
}
