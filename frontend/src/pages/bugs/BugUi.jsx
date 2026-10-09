// Shared building blocks for the Developer Admin and Tester dashboards (English-only admin UI).
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader, AlertCircle, Clock, CheckCircle2, AlertTriangle, ImageIcon, ExternalLink, ArrowLeft
} from 'lucide-react';
import { AdminLoginCard } from '../../components/admin/AdminLayout';
import { PAGES } from '../../data/siteMap';
import { useLanguage } from '../../context/LanguageContext';
import { assetUrl } from '../../utils/bugApi';
import { categoryLabel, reproducibilityLabel } from '../../utils/bugReporting';

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

/** Sign-in screen for one role (shared admin login card) */
export function RoleLogin({ title, subtitle, Icon, session, afterLogin }) {
  const onLogin = async (username, password) => {
    await session.login(username, password);
    afterLogin?.();
  };
  return (
    <AdminLoginCard roleTitle={title} subtitle={subtitle} Icon={Icon} onLogin={onLogin}
      notice={session.expired ? 'Your session has expired. Please sign in again.' : ''} />
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

/** Bug list: table on desktop, cards on mobile. linkFor(bug) -> detail URL */
export function BugList({ bugs, now, linkFor }) {
  return (
    <>
      <div className={`${cardCls} hidden lg:block overflow-hidden`}>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Bug</th>
              <th className="px-3 py-3 font-bold">Tester</th>
              <th className="px-3 py-3 font-bold">Submitted</th>
              <th className="px-3 py-3 font-bold">Deadline</th>
              <th className="px-3 py-3 font-bold">Priority</th>
              <th className="px-3 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bugs.map(b => {
              const overdue = isOverdueAt(b, now);
              return (
                <tr key={b._id} className={overdue ? 'bg-red-50/70 hover:bg-red-50' : 'hover:bg-slate-50'}>
                  <td className={`px-4 py-3 max-w-[340px] ${overdue ? 'border-l-4 border-red-500' : ''}`}>
                    <Link to={linkFor(b)} className="block group">
                      <span className="text-xs font-bold text-slate-400">{bugCode(b)}</span>
                      <span className="block font-bold text-slate-900 group-hover:text-[#002DC2] break-words">{b.title}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 min-w-0">
                        <span className="truncate">{b.affectedPage}</span>
                        {b.screenshots?.length > 0 && <span className="inline-flex items-center gap-0.5 ml-2 shrink-0"><ImageIcon className="w-4 h-4" />{b.screenshots.length}</span>}
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{b.reportedBy}{b.reporterRole === 'client' && <span className="block mt-0.5"><ReporterRoleBadge role="client" /></span>}<span className="block mt-0.5"><SeverityBadge severity={b.severity} /></span></td>
                  <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{formatDateTime(b.submittedAt)}</td>
                  <td className="px-3 py-3 whitespace-nowrap"><span className="block text-slate-600">{formatDateTime(b.deadline)}</span><DeadlineText bug={b} now={now} /></td>
                  <td className="px-3 py-3"><PriorityBadge priority={b.priority} /></td>
                  <td className="px-3 py-3"><div className="flex flex-col items-start gap-1"><StatusBadge status={b.status} />{overdue && <OverdueBadge />}</div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="lg:hidden space-y-3">
        {bugs.map(b => {
          const overdue = isOverdueAt(b, now);
          return (
            <li key={b._id}>
              <Link to={linkFor(b)} className={`${cardCls} block p-4 space-y-2 ${overdue ? 'border-l-4 border-l-red-500 bg-red-50/40' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-400">{bugCode(b)}</span>
                    <p className="font-bold text-slate-900 break-words">{b.title}</p>
                  </div>
                  {b.screenshots?.length > 0 && <img src={assetUrl(b.screenshots[0].url)} alt="" className="w-14 h-12 rounded-lg object-cover border border-slate-200 shrink-0" loading="lazy" />}
                </div>
                <BugBadges bug={b} now={now} />
                <div className="text-xs text-slate-500 space-y-0.5 min-w-0">
                  <p className="truncate">{b.reportedBy}{b.reporterRole === 'client' ? ' (client admin)' : ''} · {b.affectedPage}</p>
                  <p>Submitted {formatDateTime(b.submittedAt)}</p>
                </div>
                <DeadlineText bug={b} now={now} />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const BAR_TONES = {
  navy: 'bg-[#123B92]', blue: 'bg-[#002DC2]', green: 'bg-[#23AC39]', amber: 'bg-amber-500', red: 'bg-red-500', slate: 'bg-slate-400', orange: 'bg-orange-500'
};

/** Labelled horizontal bars: rows = [{ label, value, tone, onClick? }] */
export function BreakdownBars({ rows }) {
  const max = Math.max(1, ...rows.map(r => r.value || 0));
  return (
    <ul className="space-y-2.5">
      {rows.map(r => {
        const content = (
          <>
            <span className="flex items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-slate-700 truncate">{r.label}</span>
              <span className="font-bold text-slate-900 tabular-nums">{r.value}</span>
            </span>
            <span className="mt-1 block h-2 rounded-full bg-slate-100 overflow-hidden">
              <span className={`block h-full rounded-full ${BAR_TONES[r.tone] || BAR_TONES.navy}`} style={{ width: `${((r.value || 0) / max) * 100}%` }} />
            </span>
          </>
        );
        return (
          <li key={r.label}>
            {r.onClick
              ? <button type="button" onClick={r.onClick} className="block w-full text-left cursor-pointer hover:opacity-80">{content}</button>
              : content}
          </li>
        );
      })}
    </ul>
  );
}

/** "Tester" / "Client admin" chip */
export function ReporterRoleBadge({ role }) {
  const client = role === 'client';
  return <span className={`${pill} ${client ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' : 'bg-slate-100 text-slate-600'}`}>{client ? 'Client admin' : 'Tester'}</span>;
}

/** Reporter-entered classification fields (category, reproducibility, element, suggested fix) */
export function ReportExtraFields({ bug }) {
  return (
    <>
      <Field label="Category">{categoryLabel(bug.category)}</Field>
      <Field label="Reproducibility">{reproducibilityLabel(bug.reproducibility)}</Field>
      <Field label="Affected element / section">{bug.affectedElement}</Field>
      <Field label="Reporter role"><ReporterRoleBadge role={bug.reporterRole} /></Field>
      {bug.suggestedFix ? <Field label="Suggested fix" wide>{bug.suggestedFix}</Field> : null}
    </>
  );
}

/** Browser / page details captured automatically when the bug was reported */
export function TechnicalDetails({ context }) {
  const c = context || {};
  const rows = [
    ['Page URL', c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[#002DC2] hover:underline break-all">{c.url}</a> : ''],
    ['Page title', c.pageTitle],
    ['Browser', c.browser],
    ['Operating system', c.os],
    ['Device', c.deviceType],
    ['Viewport', c.viewport],
    ['Screen', c.screen],
    ['Pixel ratio', c.pixelRatio ? `${c.pixelRatio}x` : ''],
    ['Site language', c.language],
    ['Scroll position', c.scroll],
    ['Network', typeof c.online === 'boolean' ? (c.online ? 'Online' : 'Offline') : ''],
    ['Captured at', c.capturedAt ? formatDateTime(c.capturedAt) : '']
  ].filter(([, v]) => v);
  if (!rows.length && !(c.consoleErrors || []).length) {
    return <p className="text-sm text-slate-500">No technical details were captured for this report.</p>;
  }
  return (
    <div className="space-y-4">
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
        {rows.map(([k, v]) => <Field key={k} label={k}>{v}</Field>)}
      </dl>
      {c.userAgent && <Field label="User agent"><span className="text-xs font-mono">{c.userAgent}</span></Field>}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">Recent console errors ({(c.consoleErrors || []).length})</p>
        {(c.consoleErrors || []).length ? (
          <ul className="text-xs font-mono text-red-700 bg-red-50 rounded-xl p-3 space-y-1 max-h-60 overflow-y-auto">
            {c.consoleErrors.map((e, i) => <li key={i} className="break-all">{e}</li>)}
          </ul>
        ) : <p className="text-sm text-slate-500">None recorded.</p>}
      </div>
    </div>
  );
}
