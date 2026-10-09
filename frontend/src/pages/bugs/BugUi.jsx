// Shared building blocks for the Developer Admin and Tester dashboards (English-only admin UI).
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LogIn, LogOut, Loader, AlertCircle, User, Lock, Clock, CheckCircle2, AlertTriangle,
  ImageIcon, ExternalLink, ArrowLeft
} from 'lucide-react';
import { PAGES } from '../../data/siteMap';
import { useLanguage } from '../../context/LanguageContext';
import { assetUrl } from '../../utils/bugApi';

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

export const inputCls =
  'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 focus:border-[#002DC2]';
export const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#002DC2] hover:bg-[#123B92] text-white text-sm font-bold disabled:opacity-60 transition-colors cursor-pointer';
export const btnGreen =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#23AC39] hover:bg-[#1A822B] text-white text-sm font-bold disabled:opacity-60 transition-colors cursor-pointer';
export const btnGhost =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold disabled:opacity-60 transition-colors cursor-pointer';
export const btnDanger =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold disabled:opacity-60 transition-colors cursor-pointer';
export const cardCls = 'bg-white rounded-2xl border border-slate-200 shadow-sm';

export function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export const bugCode = bug => (bug?.bugNumber ? `BUG-${bug.bugNumber}` : 'BUG');

/** Current time, refreshed every minute so countdowns stay live */
export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function isOverdueAt(bug, now) {
  return bug.status !== 'completed' && new Date(bug.deadline).getTime() < now;
}

function spanText(ms) {
  const d = Math.floor(ms / DAY);
  const h = Math.floor((ms % DAY) / HOUR);
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.max(1, Math.floor((ms % HOUR) / 60000));
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** "Due in 3d 4h" / "Overdue by 1d 2h" / "Completed (late)" */
export function DeadlineText({ bug, now, className = '' }) {
  if (bug.status === 'completed') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${bug.completedLate ? 'text-amber-700' : 'text-[#1A822B]'} ${className}`}>
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        {bug.completedLate ? 'Completed late' : 'Completed on time'}
      </span>
    );
  }
  const left = new Date(bug.deadline).getTime() - now;
  if (left < 0) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold text-red-600 ${className}`}>
        <AlertTriangle className="w-4 h-4 shrink-0" /> Overdue by {spanText(-left)}
      </span>
    );
  }
  const soon = left < 2 * DAY;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${soon ? 'text-amber-700' : 'text-slate-600'} ${className}`}>
      <Clock className="w-4 h-4 shrink-0" /> Due in {spanText(left)}
    </span>
  );
}

const pill = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide whitespace-nowrap';

export function StatusBadge({ status }) {
  const map = {
    open: ['Open', 'bg-blue-50 text-[#002DC2] ring-1 ring-blue-200'],
    'in-progress': ['In progress', 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'],
    completed: ['Completed', 'bg-green-50 text-[#1A822B] ring-1 ring-green-200']
  };
  const [label, cls] = map[status] || [status, 'bg-slate-100 text-slate-600'];
  return <span className={`${pill} ${cls}`}>{label}</span>;
}

export function OverdueBadge() {
  return (
    <span className={`${pill} bg-red-600 text-white`}>
      <AlertTriangle className="w-3 h-3" /> Overdue
    </span>
  );
}

const LEVEL_CLS = {
  unset: 'bg-slate-100 text-slate-500',
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-50 text-[#123B92]',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-700'
};

export function PriorityBadge({ priority }) {
  return <span className={`${pill} ${LEVEL_CLS[priority] || LEVEL_CLS.unset}`}>{priority === 'unset' || !priority ? 'No priority' : `${priority} priority`}</span>;
}

export function SeverityBadge({ severity }) {
  return <span className={`${pill} ${LEVEL_CLS[severity] || LEVEL_CLS.unset}`}>{severity} severity</span>;
}

/** Status + overdue badges together */
export function BugBadges({ bug, now, showPriority = true }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <StatusBadge status={bug.status} />
      {isOverdueAt(bug, now) && <OverdueBadge />}
      {showPriority && <PriorityBadge priority={bug.priority} />}
    </div>
  );
}

/** Thumbnails; each opens the full-size image in a new tab */
export function ScreenshotGallery({ screenshots = [], size = 'lg' }) {
  if (!screenshots.length) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <ImageIcon className="w-4 h-4" /> No screenshots attached.
      </p>
    );
  }
  const box = size === 'sm' ? 'w-12 h-12 rounded-lg' : 'w-full aspect-video rounded-xl';
  return (
    <div className={size === 'sm' ? 'flex flex-wrap gap-1.5' : 'grid grid-cols-2 sm:grid-cols-3 gap-3'}>
      {screenshots.map(s => (
        <a
          key={s._id || s.url}
          href={assetUrl(s.url)}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open full size: ${s.originalName || s.filename}`}
          className={`group relative block overflow-hidden border border-slate-200 bg-slate-100 ${box}`}
        >
          <img src={assetUrl(s.url)} alt={s.originalName || 'Screenshot'} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          {size !== 'sm' && (
            <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
              <ExternalLink className="w-3 h-3" /> Full size
            </span>
          )}
        </a>
      ))}
    </div>
  );
}

export function HistoryList({ history = [] }) {
  if (!history.length) return <p className="text-sm text-slate-500">No activity yet.</p>;
  return (
    <ol className="relative border-l-2 border-slate-200 ml-2 space-y-4">
      {[...history].reverse().map((h, i) => (
        <li key={i} className="ml-4">
          <span className="absolute -left-[7px] mt-1.5 w-3 h-3 rounded-full bg-[#002DC2] ring-4 ring-white" />
          <p className="text-sm font-bold text-slate-800 break-words">{h.action}{h.note ? <span className="font-normal text-slate-600"> — {h.note}</span> : null}</p>
          <p className="text-xs text-slate-500">{h.by} · {formatDateTime(h.at)}</p>
        </li>
      ))}
    </ol>
  );
}

/** Label + value block used on detail pages */
export function Field({ label, children, wide = false }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-800 whitespace-pre-wrap break-words">{children || <span className="text-slate-400">—</span>}</dd>
    </div>
  );
}

export function ErrorNote({ children }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-2 text-red-700 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2.5" role="alert">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span className="break-words">{children}</span>
    </div>
  );
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-slate-500 text-sm">
      <Loader className="w-5 h-5 animate-spin" /> {label}
    </div>
  );
}

export function BackLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2] hover:underline">
      <ArrowLeft className="w-4 h-4" /> {children}
    </Link>
  );
}

/** Sign-in card for one role */
export function RoleLogin({ title, subtitle, Icon, session }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await session.login(username.trim(), password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#002DC2]/10 text-[#002DC2] flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-[#123B92]">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        {session.expired && <ErrorNote>Your session has expired. Please sign in again.</ErrorNote>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="bug-login-user" className="block text-xs font-bold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input id="bug-login-user" className={`${inputCls} pl-10`} autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
          </div>
          <div>
            <label htmlFor="bug-login-pass" className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input id="bug-login-pass" type="password" className={`${inputCls} pl-10`} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <ErrorNote>{error}</ErrorNote>
          <button type="submit" disabled={loading} className={`${btnPrimary} w-full py-3`}>
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-xs text-slate-500">
          Wrong portal? <Link to="/admin/login" className="font-bold text-[#002DC2] hover:underline">Choose another sign-in</Link>
        </p>
      </div>
    </div>
  );
}

/** Top bar for a dashboard: title, signed-in user, sign out */
export function DashboardBar({ title, Icon, username, onLogout, homeTo }) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        <Link to={homeTo} className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-[#002DC2] text-white flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm sm:text-base font-black text-[#123B92] truncate">{title}</span>
            <span className="block text-xs text-slate-500 truncate">Signed in as <b className="text-slate-700">{username}</b></span>
          </span>
        </Link>
        <button type="button" onClick={onLogout} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer shrink-0">
          <LogOut className="w-4 h-4" /> <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

/** Website pages (from the site map) for the "Affected page" picker */
export function usePageOptions() {
  const { tf } = useLanguage();
  return useMemo(
    () =>
      Object.keys(PAGES).map(path => ({
        value: path,
        label: `${tf(PAGES[path].key, path)} (${path})`
      })),
    [tf]
  );
}
