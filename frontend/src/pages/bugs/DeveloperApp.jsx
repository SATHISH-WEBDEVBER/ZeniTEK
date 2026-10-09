// Developer Admin portal: /admin/developer
//   /admin/developer            summary + all bugs (filter / search) + Excel report
//   /admin/developer/bugs/:id   full report, screenshots, priority/status/notes, history
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, Link, useParams, Navigate, useSearchParams } from 'react-router-dom';
import {
  Wrench, RefreshCw, Download, Search, Loader, ListChecks, CircleDot, Timer, CheckCircle2,
  AlertTriangle, FileText, User, Save, CheckCheck, RotateCcw, Image as ImageIcon, X
} from 'lucide-react';
import { bugRequest, useRoleSession, downloadExcelReport, assetUrl } from '../../utils/bugApi';
import {
  RoleLogin, DashboardBar, BugBadges, DeadlineText, ScreenshotGallery, HistoryList, Field, ErrorNote,
  Loading, BackLink, SeverityBadge, PriorityBadge, StatusBadge, OverdueBadge, useNow, formatDateTime,
  bugCode, isOverdueAt, inputCls, btnPrimary, btnGhost, btnGreen, cardCls
} from './BugUi';

const ROLE = 'developer';
const PRIORITIES = ['unset', 'low', 'medium', 'high', 'critical'];

export default function DeveloperApp() {
  const session = useRoleSession(ROLE);
  if (!session.session) {
    return <RoleLogin title="Developer Admin Sign In" subtitle="Review, prioritise and fix reported bugs" Icon={Wrench} session={session} />;
  }
  return (
    <div className="bg-slate-50 min-h-[70vh]">
      <DashboardBar title="Developer Admin" Icon={Wrench} username={session.session.username} onLogout={session.logout} homeTo="/admin/developer" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route index element={<DeveloperDashboard />} />
          <Route path="bugs/:id" element={<DeveloperBugDetail me={session.session.username} />} />
          <Route path="*" element={<Navigate to="/admin/developer" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ─── Excel button (developer only) ───────────────────────────────────────── */
function ExcelButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const run = async () => {
    setBusy(true);
    setMsg('');
    try {
      const name = await downloadExcelReport();
      setMsg(`Downloaded ${name}`);
    } catch (err) { setMsg(err.message); }
    setBusy(false);
  };
  return (
    <div className="flex flex-col items-stretch sm:items-end gap-1">
      <button type="button" onClick={run} disabled={busy} className={btnGreen}>
        {busy ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {busy ? 'Preparing…' : 'Download Excel Report'}
      </button>
      {msg && <span className="text-[11px] text-slate-500 break-all" role="status">{msg}</span>}
    </div>
  );
}

/* ─── Dashboard ───────────────────────────────────────────────────────────── */
function DeveloperDashboard() {
  const now = useNow();
  const [params, setParams] = useSearchParams();
  const filters = {
    status: params.get('status') || '',
    priority: params.get('priority') || '',
    overdue: params.get('overdue') || '',
    tester: params.get('tester') || '',
    search: params.get('search') || ''
  };
  const [searchText, setSearchText] = useState(filters.search);
  const [summary, setSummary] = useState(null);
  const [bugs, setBugs] = useState(null);
  const [meta, setMeta] = useState({ testers: [] });
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const query = params.toString();

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  // Keep the box in sync when filters change elsewhere (cards, clear)
  useEffect(() => { setSearchText(filters.search); }, [filters.search]);

  // Debounce the search box into the URL
  useEffect(() => {
    const t = setTimeout(() => { if (searchText !== filters.search) setFilter('search', searchText.trim()); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const latest = useRef(0);
  const load = useCallback(async () => {
    const mine = ++latest.current; // only the newest request may update the screen
    setRefreshing(true);
    setError('');
    try {
      const [s, l] = await Promise.all([
        bugRequest(ROLE, '/bugs/reports/summary'),
        bugRequest(ROLE, `/bugs${query ? `?${query}` : ''}`)
      ]);
      if (mine !== latest.current) return;
      setSummary(s.summary);
      setBugs(l.bugs);
    } catch (err) {
      if (mine !== latest.current) return;
      setError(err.message);
      setBugs(b => b || []);
    }
    setRefreshing(false);
  }, [query]);

  useEffect(() => { load(); }, [load]);
  // Keep the report live: refresh every minute
  useEffect(() => { const t = setInterval(load, 60000); return () => clearInterval(t); }, [load]);
  useEffect(() => { bugRequest(ROLE, '/bugs/meta').then(setMeta).catch(() => {}); }, []);

  const cards = summary ? [
    { label: 'Total bugs', value: summary.total, Icon: ListChecks, cls: 'text-[#123B92] bg-blue-50', onClick: () => setParams({}, { replace: true }) },
    { label: 'Open', value: summary.open, Icon: CircleDot, cls: 'text-[#002DC2] bg-blue-50', onClick: () => setParams({ status: 'open' }, { replace: true }) },
    { label: 'In progress', value: summary.inProgress, Icon: Timer, cls: 'text-amber-700 bg-amber-50', onClick: () => setParams({ status: 'in-progress' }, { replace: true }) },
    { label: 'Completed', value: summary.completed, Icon: CheckCircle2, cls: 'text-[#1A822B] bg-green-50', sub: summary.completedLate ? `${summary.completedLate} late` : 'all on time', onClick: () => setParams({ status: 'completed' }, { replace: true }) },
    { label: 'Overdue', value: summary.overdue, Icon: AlertTriangle, cls: 'text-red-600 bg-red-50', danger: summary.overdue > 0, onClick: () => setParams({ overdue: 'true' }, { replace: true }) }
  ] : [];
  const activeFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#123B92]">Bug Tracking Dashboard</h1>
          <p className="text-sm text-slate-500">
            Each bug must be fixed within 7 days of submission.
            {summary && <> Updated {formatDateTime(summary.generatedAt)}.</>}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" onClick={load} className={btnGhost} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <ExcelButton />
        </div>
      </div>

      {/* Summary cards */}
      {summary ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {cards.map(c => (
            <button key={c.label} type="button" onClick={c.onClick}
              className={`${cardCls} p-4 text-left hover:shadow-md transition-shadow cursor-pointer ${c.danger ? 'ring-2 ring-red-500 border-red-200' : ''} ${c.label === 'Overdue' ? 'col-span-2 sm:col-span-1' : ''}`}>
              <span className={`inline-flex w-9 h-9 rounded-xl items-center justify-center ${c.cls}`}><c.Icon className="w-5 h-5" /></span>
              <p className={`mt-2 text-2xl font-black ${c.danger ? 'text-red-600' : 'text-slate-900'}`}>{c.value}</p>
              <p className="text-xs font-bold text-slate-500">{c.label}{c.sub ? <span className="font-normal"> · {c.sub}</span> : null}</p>
            </button>
          ))}
        </div>
      ) : !error && <Loading label="Loading report…" />}

      {summary && (
        <div className="grid lg:grid-cols-3 gap-3">
          <div className={`${cardCls} p-4`}>
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">By priority</h2>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map(p => (
                <button key={p} type="button" onClick={() => setFilter('priority', filters.priority === p ? '' : p)} className="cursor-pointer inline-flex items-center gap-1">
                  <PriorityBadge priority={p} /> <span className="text-sm font-bold text-slate-700">{summary.byPriority[p]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={`${cardCls} p-4`}>
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">By tester (total / done / overdue)</h2>
            {summary.byTester.length ? (
              <ul className="space-y-1">
                {summary.byTester.map(t => (
                  <li key={t.tester} className="flex items-center justify-between gap-2 text-sm">
                    <button type="button" onClick={() => setFilter('tester', t.tester)} className="font-bold text-[#002DC2] hover:underline truncate cursor-pointer">{t.tester}</button>
                    <span className="text-slate-600 shrink-0">{t.total} / {t.completed} / <span className={t.overdue ? 'text-red-600 font-bold' : ''}>{t.overdue}</span></span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-500">No reports yet.</p>}
          </div>
          <div className={`${cardCls} p-4`}>
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Due within 2 days</h2>
            {summary.dueSoon.length ? (
              <ul className="space-y-1.5">
                {summary.dueSoon.slice(0, 5).map(b => (
                  <li key={b._id} className="text-sm">
                    <Link to={`/admin/developer/bugs/${b._id}`} className="font-bold text-slate-800 hover:text-[#002DC2] break-words">{bugCode(b)} · {b.title}</Link>
                    <DeadlineText bug={b} now={now} className="ml-1" />
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-500">Nothing due in the next 2 days.</p>}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={`${cardCls} p-3 sm:p-4 space-y-3`}>
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2">
          <div className="relative col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={`${inputCls} pl-9`} placeholder="Search title, page, tester, #number" value={searchText} onChange={e => setSearchText(e.target.value)} aria-label="Search bugs" />
          </div>
          <select className={inputCls} value={filters.status} onChange={e => setFilter('status', e.target.value)} aria-label="Status">
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <select className={inputCls} value={filters.priority} onChange={e => setFilter('priority', e.target.value)} aria-label="Priority">
            <option value="">All priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p === 'unset' ? 'No priority' : p[0].toUpperCase() + p.slice(1)}</option>)}
          </select>
          <select className={inputCls} value={filters.overdue} onChange={e => setFilter('overdue', e.target.value)} aria-label="Deadline">
            <option value="">Any deadline</option>
            <option value="true">Overdue only</option>
            <option value="false">Not overdue</option>
          </select>
          <select className={inputCls} value={filters.tester} onChange={e => setFilter('tester', e.target.value)} aria-label="Tester">
            <option value="">All testers</option>
            {(meta.testers || []).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {activeFilters && (
          <button type="button" onClick={() => { setSearchText(''); setParams({}, { replace: true }); }} className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-red-600 cursor-pointer">
            <X className="w-4 h-4" /> Clear filters
          </button>
        )}
      </div>

      <ErrorNote>{error}</ErrorNote>

      {/* Bug list */}
      {bugs === null ? <Loading /> : bugs.length === 0 ? (
        <div className={`${cardCls} p-10 text-center text-sm text-slate-500`}>{activeFilters ? 'No bugs match these filters.' : 'No bugs have been reported yet.'}</div>
      ) : (
        <>
          <p className="text-xs font-bold text-slate-500">{bugs.length} bug{bugs.length === 1 ? '' : 's'}</p>
          {/* Desktop table */}
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
                        <Link to={`/admin/developer/bugs/${b._id}`} className="block group">
                          <span className="text-xs font-bold text-slate-400">{bugCode(b)}</span>
                          <span className="block font-bold text-slate-900 group-hover:text-[#002DC2] break-words">{b.title}</span>
                          <span className="flex items-center gap-1 text-xs text-slate-500 min-w-0">
                            <FileText className="w-4 h-4 shrink-0" /><span className="truncate">{b.affectedPage}</span>
                            {b.screenshots?.length > 0 && <span className="inline-flex items-center gap-0.5 ml-2 shrink-0"><ImageIcon className="w-4 h-4" />{b.screenshots.length}</span>}
                          </span>
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-slate-700">{b.reportedBy}<span className="block"><SeverityBadge severity={b.severity} /></span></td>
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
          {/* Mobile / tablet cards */}
          <ul className="lg:hidden space-y-3">
            {bugs.map(b => {
              const overdue = isOverdueAt(b, now);
              return (
                <li key={b._id}>
                  <Link to={`/admin/developer/bugs/${b._id}`} className={`${cardCls} block p-4 space-y-2 ${overdue ? 'border-l-4 border-l-red-500 bg-red-50/40' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-400">{bugCode(b)}</span>
                        <p className="font-bold text-slate-900 break-words">{b.title}</p>
                      </div>
                      {b.screenshots?.length > 0 && <img src={assetUrl(b.screenshots[0].url)} alt="" className="w-14 h-12 rounded-lg object-cover border border-slate-200 shrink-0" loading="lazy" />}
                    </div>
                    <BugBadges bug={b} now={now} />
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p className="flex items-center gap-1 min-w-0"><User className="w-4 h-4 shrink-0" /> {b.reportedBy} · <span className="truncate">{b.affectedPage}</span></p>
                      <p>Submitted {formatDateTime(b.submittedAt)}</p>
                    </div>
                    <DeadlineText bug={b} now={now} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

/* ─── Detail / triage page ────────────────────────────────────────────────── */
function DeveloperBugDetail({ me }) {
  const { id } = useParams();
  const now = useNow();
  const [bug, setBug] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState('');
  const [draft, setDraft] = useState({ developerNotes: '', note: '' });

  const apply = useCallback(b => {
    setBug(b);
    setDraft({ developerNotes: b.developerNotes || '', note: '' });
  }, []);

  useEffect(() => {
    let cancelled = false; // a superseded load must not overwrite notes being typed
    bugRequest(ROLE, `/bugs/${id}`)
      .then(d => { if (!cancelled) apply(d.bug); })
      .catch(err => { if (!cancelled) setError(err.message); });
    bugRequest(ROLE, '/bugs/meta').then(m => { if (!cancelled) setDevelopers(m.developers || []); }).catch(() => {});
    return () => { cancelled = true; };
  }, [id, apply]);

  const patch = async (body, label) => {
    setSaving(label);
    setError('');
    setNotice('');
    try {
      const d = await bugRequest(ROLE, `/bugs/${id}`, { method: 'PATCH', json: body });
      apply(d.bug);
      setNotice(`${label} saved`);
    } catch (err) { setError(err.message); }
    setSaving('');
  };

  const complete = async () => {
    setSaving('complete');
    setError('');
    setNotice('');
    try {
      const d = await bugRequest(ROLE, `/bugs/${id}/complete`, { method: 'POST', json: { note: draft.note } });
      apply(d.bug);
      setNotice('Bug marked as completed');
    } catch (err) { setError(err.message); }
    setSaving('');
  };

  const overdue = useMemo(() => bug && isOverdueAt(bug, now), [bug, now]);

  if (!bug) return error ? <div className="space-y-4"><BackLink to="/admin/developer">All bugs</BackLink><ErrorNote>{error}</ErrorNote></div> : <Loading />;
  const done = bug.status === 'completed';

  return (
    <div className="space-y-5">
      <BackLink to="/admin/developer">All bugs</BackLink>

      {overdue && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-600 text-white p-4" role="alert">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-black uppercase tracking-wide">Overdue</p>
            <p className="text-sm text-red-50">The 7-day deadline passed on {formatDateTime(bug.deadline)}. <DeadlineText bug={bug} now={now} className="!text-white" /></p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
        {/* Report */}
        <div className="space-y-5 min-w-0">
          <div className={`${cardCls} p-5 sm:p-6 space-y-4`}>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400">{bugCode(bug)}</p>
              <h1 className="text-xl font-black text-[#123B92] break-words">{bug.title}</h1>
              <div className="flex flex-wrap gap-1.5"><BugBadges bug={bug} now={now} /><SeverityBadge severity={bug.severity} /></div>
            </div>
            <dl className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <Field label="Reported by">{bug.reportedBy}</Field>
              <Field label="Affected page">{bug.affectedPage}</Field>
              <Field label="Submitted">{formatDateTime(bug.submittedAt)}</Field>
              <Field label="Deadline (7 days)"><span className="block">{formatDateTime(bug.deadline)}</span><DeadlineText bug={bug} now={now} /></Field>
              {done && <Field label="Completed">{formatDateTime(bug.completedAt)} by {bug.completedBy}{bug.completedLate ? ' (after deadline)' : ''}</Field>}
              <Field label="Environment">{bug.environment}</Field>
              <Field label="Description" wide>{bug.description}</Field>
              <Field label="Steps to reproduce" wide>{bug.stepsToReproduce}</Field>
              <Field label="Expected result">{bug.expectedResult}</Field>
              <Field label="Actual result">{bug.actualResult}</Field>
            </dl>
          </div>
          <section className={`${cardCls} p-5 sm:p-6 space-y-3`}>
            <h2 className="font-black text-[#123B92]">Screenshots ({bug.screenshots.length})</h2>
            <p className="text-xs text-slate-500">Click an image to open it full size.</p>
            <ScreenshotGallery screenshots={bug.screenshots} />
          </section>
          <section className={`${cardCls} p-5 sm:p-6 space-y-3`}>
            <h2 className="font-black text-[#123B92]">History</h2>
            <HistoryList history={bug.history} />
          </section>
        </div>

        {/* Triage controls */}
        <aside className={`${cardCls} p-5 space-y-5 lg:sticky lg:top-24`}>
          <h2 className="font-black text-[#123B92]">Manage bug</h2>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 mb-1">Priority</span>
            <select className={inputCls} value={bug.priority} disabled={!!saving} onChange={e => patch({ priority: e.target.value }, 'Priority')}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p === 'unset' ? 'Not set' : p[0].toUpperCase() + p.slice(1)}</option>)}
            </select>
          </label>
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-1">Progress</span>
            <div className="grid grid-cols-2 gap-2">
              {[['open', 'Open'], ['in-progress', 'In progress']].map(([s, l]) => (
                <button key={s} type="button" disabled={!!saving || bug.status === s} onClick={() => patch({ status: s }, 'Status')}
                  className={`px-3 py-2 rounded-xl text-sm font-bold border transition-colors cursor-pointer disabled:cursor-default ${bug.status === s ? 'bg-[#002DC2] border-[#002DC2] text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-[#002DC2]'}`}>
                  {done && s === 'open' ? <span className="inline-flex items-center gap-1"><RotateCcw className="w-4 h-4" />Reopen</span> : l}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 mb-1">Assigned to</span>
            <select className={inputCls} value={bug.assignedTo || ''} disabled={!!saving} onChange={e => patch({ assignedTo: e.target.value }, 'Assignment')}>
              <option value="">Unassigned</option>
              {developers.map(d => <option key={d} value={d}>{d}{d === me ? ' (me)' : ''}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 mb-1">Developer notes</span>
            <textarea className={`${inputCls} min-h-[90px]`} value={draft.developerNotes} maxLength={5000}
              onChange={e => setDraft(d => ({ ...d, developerNotes: e.target.value }))} placeholder="Root cause, fix details…" />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 mb-1">Progress update (added to history)</span>
            <input className={inputCls} value={draft.note} maxLength={2000} onChange={e => setDraft(d => ({ ...d, note: e.target.value }))} placeholder="e.g. Reproduced on Safari" />
          </label>
          <button type="button" className={`${btnPrimary} w-full`} disabled={!!saving || (draft.developerNotes === (bug.developerNotes || '') && !draft.note.trim())}
            onClick={() => patch({ developerNotes: draft.developerNotes, ...(draft.note.trim() ? { note: draft.note.trim() } : {}) }, 'Notes')}>
            {saving === 'Notes' ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save notes
          </button>
          <div className="pt-4 border-t border-slate-100">
            {done ? (
              <p className="flex items-start gap-2 text-sm text-[#1A822B] font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0" /> Completed {formatDateTime(bug.completedAt)} by {bug.completedBy}{bug.completedLate ? ' — after the deadline' : ''}
              </p>
            ) : (
              <button type="button" onClick={complete} disabled={!!saving} className={`${btnGreen} w-full py-3`}>
                {saving === 'complete' ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-5 h-5" />} Mark as completed
              </button>
            )}
          </div>
          {notice && <p className="text-xs font-bold text-[#1A822B]" role="status">{notice}</p>}
          <ErrorNote>{error}</ErrorNote>
        </aside>
      </div>
    </div>
  );
}
