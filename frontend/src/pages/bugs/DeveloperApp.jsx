// Developer Admin portal: /admin/developer (inside the shared admin shell)
//   /admin/developer              dashboard: summary cards + breakdowns
//   /admin/developer/bugs         all bugs (filter / search)
//   /admin/developer/overdue      overdue bugs
//   /admin/developer/completed    completed bugs
//   /admin/developer/bugs/:id     full report, screenshots, priority/status/notes, history, complete
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, Link, useParams, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Wrench, RefreshCw, Download, Search, Loader, ListChecks, CircleDot, Timer, CheckCircle2,
  AlertTriangle, Save, CheckCheck, RotateCcw, X, LayoutDashboard, Bug as BugIcon
} from 'lucide-react';
import { bugRequest, useRoleSession, downloadExcelReport } from '../../utils/bugApi';
import {
  RoleLogin, BugBadges, DeadlineText, ScreenshotGallery, HistoryList, Field, ErrorNote,
  Loading, SeverityBadge, useNow, formatDateTime,
  bugCode, isOverdueAt, inputCls, btnPrimary, btnGhost, btnGreen, cardCls, BugList, BreakdownBars,
  ReportExtraFields, TechnicalDetails
} from './BugUi';
import { AdminPage, AdminShellContext, StatCard } from '../../components/admin/AdminLayout';
import { BUG_CATEGORIES } from '../../utils/bugReporting';

const ROLE = 'developer';
const BASE = '/admin/developer';
const PRIORITIES = ['unset', 'low', 'medium', 'high', 'critical'];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const label = p => (p === 'unset' ? 'No priority' : p[0].toUpperCase() + p.slice(1));

export default function DeveloperApp() {
  const session = useRoleSession(ROLE);
  const [excel, setExcel] = useState({ busy: false, msg: '' });

  const runExcel = useCallback(async () => {
    setExcel({ busy: true, msg: '' });
    try {
      const name = await downloadExcelReport();
      setExcel({ busy: false, msg: `Downloaded ${name}` });
    } catch (err) { setExcel({ busy: false, msg: err.message }); }
  }, []);

  useEffect(() => {
    if (!excel.msg) return undefined;
    const t = setTimeout(() => setExcel(e => ({ ...e, msg: '' })), 5000);
    return () => clearTimeout(t);
  }, [excel.msg]);

  if (!session.session) {
    return <RoleLogin title="Developer Admin" subtitle="Review, prioritise and fix reported bugs" Icon={Wrench} session={session} />;
  }

  const shell = {
    roleTitle: 'Developer Admin',
    RoleIcon: Wrench,
    homeTo: BASE,
    username: session.session.username,
    onLogout: session.logout,
    nav: [
      { to: BASE, end: true, label: 'Dashboard', Icon: LayoutDashboard },
      { to: `${BASE}/bugs`, label: 'All Bugs', Icon: ListChecks },
      { to: `${BASE}/overdue`, label: 'Overdue', Icon: AlertTriangle },
      { to: `${BASE}/completed`, label: 'Completed', Icon: CheckCircle2 },
      { label: excel.busy ? 'Preparing report…' : 'Download Excel Report', Icon: Download, onClick: runExcel, busy: excel.busy }
    ]
  };

  return (
    <AdminShellContext.Provider value={{ ...shell, excel, runExcel }}>
      <Routes>
        <Route index element={<DeveloperDashboard />} />
        <Route path="bugs" element={<BugsBrowser title="All Bugs" subtitle="Every reported bug. Filter, search and open one to triage it." />} />
        <Route path="overdue" element={<BugsBrowser title="Overdue Bugs" subtitle="Not completed and past the 7-day deadline." fixed={{ overdue: 'true' }} />} />
        <Route path="completed" element={<BugsBrowser title="Completed Bugs" subtitle="Bugs that have been fixed." fixed={{ status: 'completed' }} />} />
        <Route path="bugs/:id" element={<DeveloperBugDetail me={session.session.username} />} />
        <Route path="*" element={<Navigate to={BASE} replace />} />
      </Routes>
      {excel.msg && (
        <div role="status" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] rounded-xl bg-slate-900 text-white text-sm font-semibold px-4 py-3 shadow-xl break-words">
          {excel.msg}
        </div>
      )}
    </AdminShellContext.Provider>
  );
}

/* ─── Excel button (developer only) ───────────────────────────────────────── */
function ExcelButton() {
  const { excel, runExcel } = React.useContext(AdminShellContext);
  return (
    <button type="button" onClick={runExcel} disabled={excel.busy} className={btnGreen}>
      {excel.busy ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {excel.busy ? 'Preparing…' : 'Download Excel'}
    </button>
  );
}

/* ─── Dashboard ───────────────────────────────────────────────────────────── */
function DeveloperDashboard() {
  const now = useNow();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    setError('');
    try {
      const [s, l] = await Promise.all([bugRequest(ROLE, '/bugs/reports/summary'), bugRequest(ROLE, '/bugs')]);
      setSummary(s.summary);
      setRecent(l.bugs.slice(0, 6));
    } catch (err) { setError(err.message); }
    setRefreshing(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setInterval(load, 60000); return () => clearInterval(t); }, [load]);

  const actions = (
    <>
      <button type="button" onClick={load} className={btnGhost} disabled={refreshing}>
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
      </button>
      <ExcelButton />
    </>
  );

  return (
    <AdminPage title="Dashboard" subtitle={`Each bug must be fixed within 7 days of submission.${summary ? ` Updated ${formatDateTime(summary.generatedAt)}.` : ''}`} actions={actions}>
      <div className="space-y-6">
        <ErrorNote>{error}</ErrorNote>
        {!summary ? (!error && <Loading label="Loading report…" />) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
              <StatCard label="Total bugs" value={summary.total} Icon={ListChecks} tone="navy" to={`${BASE}/bugs`} />
              <StatCard label="Open" value={summary.open} Icon={CircleDot} tone="blue" to={`${BASE}/bugs?status=open`} />
              <StatCard label="In progress" value={summary.inProgress} Icon={Timer} tone="amber" to={`${BASE}/bugs?status=in-progress`} />
              <StatCard label="Completed" value={summary.completed} Icon={CheckCircle2} tone="green" to={`${BASE}/completed`}
                sub={summary.completed ? `${summary.completedOnTime} on time · ${summary.completedLate} late` : ''} />
              <StatCard label="Overdue" value={summary.overdue} Icon={AlertTriangle} tone="red" to={`${BASE}/overdue`} danger={summary.overdue > 0} />
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              <section className={`${cardCls} p-5 space-y-4`}>
                <h2 className="font-black text-[#123B92]">By status</h2>
                <BreakdownBars rows={[
                  { label: 'Open', value: summary.open, tone: 'blue', onClick: () => navigate(`${BASE}/bugs?status=open`) },
                  { label: 'In progress', value: summary.inProgress, tone: 'amber', onClick: () => navigate(`${BASE}/bugs?status=in-progress`) },
                  { label: 'Completed', value: summary.completed, tone: 'green', onClick: () => navigate(`${BASE}/completed`) },
                  { label: 'Overdue', value: summary.overdue, tone: 'red', onClick: () => navigate(`${BASE}/overdue`) }
                ]} />
              </section>
              <section className={`${cardCls} p-5 space-y-4`}>
                <h2 className="font-black text-[#123B92]">By priority</h2>
                <BreakdownBars rows={PRIORITIES.map(p => ({
                  label: label(p), value: summary.byPriority[p],
                  tone: { unset: 'slate', low: 'slate', medium: 'blue', high: 'orange', critical: 'red' }[p],
                  onClick: () => navigate(`${BASE}/bugs?priority=${p}`)
                }))} />
              </section>
              <section className={`${cardCls} p-5 space-y-4`}>
                <h2 className="font-black text-[#123B92]">By severity (reporter rating)</h2>
                <BreakdownBars rows={SEVERITIES.map(s => ({
                  label: label(s), value: summary.bySeverity[s],
                  tone: { low: 'slate', medium: 'blue', high: 'orange', critical: 'red' }[s]
                }))} />
                {summary.byReporterRole && (
                  <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    Reported by testers: <b>{summary.byReporterRole.tester}</b> · client admin: <b>{summary.byReporterRole.client}</b>
                  </p>
                )}
              </section>
              <section className={`${cardCls} p-5 space-y-4`}>
                <h2 className="font-black text-[#123B92]">By category</h2>
                <BreakdownBars rows={[
                  ...BUG_CATEGORIES.map(([v, l]) => ({ label: l, value: summary.byCategory?.[v] || 0, tone: 'navy', onClick: () => navigate(`${BASE}/bugs?category=${v}`) })),
                  ...(summary.byCategory?.uncategorised ? [{ label: 'Not categorised', value: summary.byCategory.uncategorised, tone: 'slate' }] : [])
                ].filter(r => r.value > 0)} />
                {!Object.values(summary.byCategory || {}).some(Boolean) && <p className="text-sm text-slate-500">No reports yet.</p>}
              </section>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <section className={`${cardCls} p-5 space-y-3`}>
                <h2 className="font-black text-[#123B92]">By reporter</h2>
                <p className="text-xs text-slate-500">Total / completed / overdue</p>
                {summary.byTester.length ? (
                  <ul className="divide-y divide-slate-100">
                    {summary.byTester.map(t => (
                      <li key={t.tester} className="flex items-center justify-between gap-2 py-2 text-sm">
                        <Link to={`${BASE}/bugs?tester=${encodeURIComponent(t.tester)}`} className="font-bold text-[#002DC2] hover:underline truncate">{t.tester}</Link>
                        <span className="text-slate-600 shrink-0 tabular-nums">{t.total} / {t.completed} / <span className={t.overdue ? 'text-red-600 font-bold' : ''}>{t.overdue}</span></span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-slate-500">No reports yet.</p>}
              </section>
              <section className={`${cardCls} p-5 space-y-3`}>
                <h2 className="font-black text-[#123B92]">Due within 2 days</h2>
                {summary.dueSoon.length ? (
                  <ul className="space-y-2">
                    {summary.dueSoon.slice(0, 6).map(b => (
                      <li key={b._id} className="text-sm">
                        <Link to={`${BASE}/bugs/${b._id}`} className="font-bold text-slate-800 hover:text-[#002DC2] break-words">{bugCode(b)} · {b.title}</Link>
                        <span className="block"><DeadlineText bug={b} now={now} /></span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-slate-500">Nothing due in the next 2 days.</p>}
              </section>
              <section className={`${cardCls} p-5 space-y-3`}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-black text-[#123B92]">Latest reports</h2>
                  <Link to={`${BASE}/bugs`} className="text-xs font-bold text-[#002DC2] hover:underline">View all</Link>
                </div>
                {recent && recent.length ? (
                  <ul className="space-y-2.5">
                    {recent.map(b => (
                      <li key={b._id} className="text-sm space-y-1">
                        <Link to={`${BASE}/bugs/${b._id}`} className="font-bold text-slate-800 hover:text-[#002DC2] break-words">{bugCode(b)} · {b.title}</Link>
                        <BugBadges bug={b} now={now} showPriority={false} />
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-slate-500">No reports yet.</p>}
              </section>
            </div>
          </>
        )}
      </div>
    </AdminPage>
  );
}

/* ─── Bug list with filters (All / Overdue / Completed) ───────────────────── */
function BugsBrowser({ title, subtitle, fixed = {} }) {
  const now = useNow();
  const [params, setParams] = useSearchParams();
  const filters = {
    status: fixed.status || params.get('status') || '',
    priority: params.get('priority') || '',
    overdue: fixed.overdue || params.get('overdue') || '',
    tester: params.get('tester') || '',
    category: params.get('category') || '',
    search: params.get('search') || ''
  };
  const [searchText, setSearchText] = useState(filters.search);
  const [bugs, setBugs] = useState(null);
  const [meta, setMeta] = useState({ testers: [] });
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  useEffect(() => { setSearchText(filters.search); }, [filters.search]);
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
      const l = await bugRequest(ROLE, `/bugs${query ? `?${query}` : ''}`);
      if (mine !== latest.current) return;
      setBugs(l.bugs);
    } catch (err) {
      if (mine !== latest.current) return;
      setError(err.message);
      setBugs(b => b || []);
    }
    setRefreshing(false);
  }, [query]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setInterval(load, 60000); return () => clearInterval(t); }, [load]);
  useEffect(() => { bugRequest(ROLE, '/bugs/meta').then(setMeta).catch(() => {}); }, []);

  const userFilters = ['priority', 'tester', 'category', 'search', 'status', 'overdue'].filter(k => !fixed[k] && filters[k]);
  const activeFilters = userFilters.length > 0;

  const actions = (
    <>
      <button type="button" onClick={load} className={btnGhost} disabled={refreshing}>
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
      </button>
      <ExcelButton />
    </>
  );

  return (
    <AdminPage title={title} subtitle={subtitle} actions={actions}>
      <div className="space-y-5">
        <div className={`${cardCls} p-3 sm:p-4 space-y-3`}>
          <div className="grid grid-cols-2 lg:grid-cols-[2fr_repeat(5,minmax(0,1fr))] gap-2">
            <div className="relative col-span-2 lg:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input className={`${inputCls} pl-9`} placeholder="Search title, page, tester, #number" value={searchText} onChange={e => setSearchText(e.target.value)} aria-label="Search bugs" />
            </div>
            {!fixed.status && (
              <select className={inputCls} value={filters.status} onChange={e => setFilter('status', e.target.value)} aria-label="Status">
                <option value="">All statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
            <select className={inputCls} value={filters.priority} onChange={e => setFilter('priority', e.target.value)} aria-label="Priority">
              <option value="">All priorities</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{label(p)}</option>)}
            </select>
            {!fixed.overdue && !fixed.status && (
              <select className={inputCls} value={filters.overdue} onChange={e => setFilter('overdue', e.target.value)} aria-label="Deadline">
                <option value="">Any deadline</option>
                <option value="true">Overdue only</option>
                <option value="false">Not overdue</option>
              </select>
            )}
            <select className={inputCls} value={filters.category} onChange={e => setFilter('category', e.target.value)} aria-label="Category">
              <option value="">All categories</option>
              {BUG_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select className={inputCls} value={filters.tester} onChange={e => setFilter('tester', e.target.value)} aria-label="Reporter">
              <option value="">All reporters</option>
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

        {bugs === null ? <Loading /> : bugs.length === 0 ? (
          <div className={`${cardCls} p-10 text-center text-sm text-slate-500`}>
            <BugIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            {activeFilters ? 'No bugs match these filters.' : fixed.overdue ? 'No overdue bugs. Nice work.' : fixed.status ? 'No completed bugs yet.' : 'No bugs have been reported yet.'}
          </div>
        ) : (
          <>
            <p className="text-xs font-bold text-slate-500">{bugs.length} bug{bugs.length === 1 ? '' : 's'}</p>
            <BugList bugs={bugs} now={now} linkFor={b => `${BASE}/bugs/${b._id}`} />
          </>
        )}
      </div>
    </AdminPage>
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

  const patch = async (body, what) => {
    setSaving(what);
    setError('');
    setNotice('');
    try {
      const d = await bugRequest(ROLE, `/bugs/${id}`, { method: 'PATCH', json: body });
      apply(d.bug);
      setNotice(`${what} saved`);
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
  const back = { to: `${BASE}/bugs`, label: 'All bugs' };

  if (!bug) {
    return (
      <AdminPage title="Bug details" back={back}>
        {error ? <ErrorNote>{error}</ErrorNote> : <Loading />}
      </AdminPage>
    );
  }
  const done = bug.status === 'completed';

  return (
    <AdminPage title={bugCode(bug)} subtitle={bug.title} back={back}>
      <div className="space-y-5">
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
                <h2 className="text-xl font-black text-[#123B92] break-words">{bug.title}</h2>
                <div className="flex flex-wrap gap-1.5"><BugBadges bug={bug} now={now} /><SeverityBadge severity={bug.severity} /></div>
              </div>
              <dl className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <Field label="Reported by">{bug.reportedBy}</Field>
                <Field label="Affected page">{bug.affectedPage}</Field>
                <Field label="Submitted">{formatDateTime(bug.submittedAt)}</Field>
                <Field label="Deadline (7 days)"><span className="block">{formatDateTime(bug.deadline)}</span><DeadlineText bug={bug} now={now} /></Field>
                {done && <Field label="Completed">{formatDateTime(bug.completedAt)} by {bug.completedBy}{bug.completedLate ? ' (after deadline)' : ''}</Field>}
                <Field label="Environment">{bug.environment}</Field>
                <ReportExtraFields bug={bug} />
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
              <h2 className="font-black text-[#123B92]">Technical details</h2>
              <p className="text-xs text-slate-500">Captured automatically by the reporter's browser.</p>
              <TechnicalDetails context={bug.context} />
            </section>
            <section className={`${cardCls} p-5 sm:p-6 space-y-3`}>
              <h2 className="font-black text-[#123B92]">History</h2>
              <HistoryList history={bug.history} />
            </section>
          </div>

          {/* Triage controls */}
          <aside className={`${cardCls} p-5 space-y-5 lg:sticky lg:top-32`}>
            <h2 className="font-black text-[#123B92]">Manage bug</h2>
            <label className="block">
              <span className="block text-xs font-bold text-slate-700 mb-1">Priority</span>
              <select className={inputCls} value={bug.priority} disabled={!!saving} onChange={e => patch({ priority: e.target.value }, 'Priority')}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p === 'unset' ? 'Not set' : label(p)}</option>)}
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
    </AdminPage>
  );
}

