// Tester portal: /admin/tester (inside the shared admin shell)
//   /admin/tester                dashboard: my bug counts + recent reports
//   /admin/tester/bugs           my bug reports (filter / search)
//   /admin/tester/new            report a bug (?page=/some/path prefills "Affected page")
//   /admin/tester/bugs/:id       report details
//   /admin/tester/bugs/:id/edit  edit a report
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Bug as BugIcon, Plus, Edit2, Trash2, RefreshCw, FileText, Search, ClipboardList,
  LayoutDashboard, ListChecks, CircleDot, Timer, CheckCircle2, AlertTriangle, Globe
} from 'lucide-react';
import { bugRequest, useRoleSession, assetUrl } from '../../utils/bugApi';
import {
  RoleLogin, BugBadges, DeadlineText, ScreenshotGallery, HistoryList, Field, ErrorNote,
  Loading, SeverityBadge, useNow, formatDateTime, bugCode, isOverdueAt,
  inputCls, btnPrimary, btnGhost, btnDanger, cardCls, ReportExtraFields, TechnicalDetails
} from './BugUi';
import BugForm from './BugForm';
import { AdminPage, AdminShellContext, StatCard } from '../../components/admin/AdminLayout';

const ROLE = 'tester';
const BASE = '/admin/tester';

export default function TesterApp() {
  const session = useRoleSession(ROLE);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (!session.session) {
    // After signing in from the portal's front door, go straight to the website to test it;
    // a deep link (e.g. a report page) stays where it is.
    const afterLogin = () => { if (pathname.replace(/\/+$/, '') === BASE) navigate('/'); };
    return <RoleLogin title="Tester" subtitle="Sign in, then test the website. Use the bug button above the WhatsApp icon to report problems." Icon={BugIcon} session={session} afterLogin={afterLogin} />;
  }
  const shell = {
    roleTitle: 'Tester',
    RoleIcon: BugIcon,
    homeTo: BASE,
    username: session.session.username,
    onLogout: session.logout,
    nav: [
      { to: BASE, end: true, label: 'Dashboard', Icon: LayoutDashboard },
      { to: `${BASE}/bugs`, label: 'My Bugs', Icon: ListChecks },
      { to: `${BASE}/new`, label: 'Report a Bug', Icon: Plus }
    ]
  };
  return (
    <AdminShellContext.Provider value={shell}>
      <Routes>
        <Route index element={<TesterDashboard />} />
        <Route path="bugs" element={<MyBugs />} />
        <Route path="new" element={<BugForm role={ROLE} listPath={`${BASE}/bugs`} detailPath={id => `${BASE}/bugs/${id}`} />} />
        <Route path="bugs/:id" element={<TesterBugDetail />} />
        <Route path="bugs/:id/edit" element={<BugForm editing role={ROLE} listPath={`${BASE}/bugs`} detailPath={id => `${BASE}/bugs/${id}`} />} />
        <Route path="*" element={<Navigate to={BASE} replace />} />
      </Routes>
    </AdminShellContext.Provider>
  );
}

/** Load my bugs once (testers only ever receive their own reports) */
function useMyBugs() {
  const [bugs, setBugs] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const data = await bugRequest(ROLE, '/bugs');
      setBugs(data.bugs);
    } catch (err) { setError(err.message); setBugs(b => b || []); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  return { bugs, error, loading, load };
}

function countBugs(list, now) {
  return {
    all: list.length,
    open: list.filter(b => b.status === 'open').length,
    'in-progress': list.filter(b => b.status === 'in-progress').length,
    completed: list.filter(b => b.status === 'completed').length,
    overdue: list.filter(b => isOverdueAt(b, now)).length
  };
}

/* ─── Dashboard ───────────────────────────────────────────────────────────── */
function TesterDashboard() {
  const now = useNow();
  const { bugs, error, loading, load } = useMyBugs();
  const counts = useMemo(() => countBugs(bugs || [], now), [bugs, now]);

  const actions = (
    <>
      <button type="button" onClick={load} className={btnGhost} disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      <Link to={`${BASE}/new`} className={btnPrimary}><Plus className="w-4 h-4" /> Report a Bug</Link>
    </>
  );

  return (
    <AdminPage title="Dashboard" subtitle="Every bug you report gets a 7-day fix deadline." actions={actions}>
      <div className="space-y-6">
        <ErrorNote>{error}</ErrorNote>
        {bugs === null ? <Loading /> : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
              <StatCard label="Total reported" value={counts.all} Icon={ListChecks} tone="navy" to={`${BASE}/bugs`} />
              <StatCard label="Open" value={counts.open} Icon={CircleDot} tone="blue" to={`${BASE}/bugs?filter=open`} />
              <StatCard label="In progress" value={counts['in-progress']} Icon={Timer} tone="amber" to={`${BASE}/bugs?filter=in-progress`} />
              <StatCard label="Completed" value={counts.completed} Icon={CheckCircle2} tone="green" to={`${BASE}/bugs?filter=completed`} />
              <StatCard label="Overdue" value={counts.overdue} Icon={AlertTriangle} tone="red" to={`${BASE}/bugs?filter=overdue`} danger={counts.overdue > 0} />
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
              <section className={`${cardCls} p-5 space-y-3 min-w-0`}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-black text-[#123B92]">Recent reports</h2>
                  <Link to={`${BASE}/bugs`} className="text-xs font-bold text-[#002DC2] hover:underline">View all</Link>
                </div>
                {bugs.length ? (
                  <ul className="divide-y divide-slate-100">
                    {bugs.slice(0, 5).map(b => (
                      <li key={b._id} className="py-3 first:pt-0 last:pb-0">
                        <Link to={`${BASE}/bugs/${b._id}`} className="block space-y-1.5 group">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-[#002DC2] break-words">
                            <span className="text-slate-400">{bugCode(b)}</span> · {b.title}
                          </p>
                          <BugBadges bug={b} now={now} />
                          <DeadlineText bug={b} now={now} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <ClipboardList className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-sm text-slate-500">You have not reported any bugs yet.</p>
                    <Link to={`${BASE}/new`} className={btnPrimary}><Plus className="w-4 h-4" /> Report your first bug</Link>
                  </div>
                )}
              </section>
              <section className={`${cardCls} p-5 space-y-3`}>
                <h2 className="font-black text-[#123B92]">Testing the website</h2>
                <p className="text-sm text-slate-600">
                  While you are signed in, every website page shows a round <b>bug button</b> just above the WhatsApp icon.
                  It takes a screenshot of what you see and opens the report form on the same page.
                </p>
                <a href="/" target="_blank" rel="opener" className={`${btnGhost} w-full`}><Globe className="w-4 h-4" /> Open the website</a>
              </section>
            </div>
          </>
        )}
      </div>
    </AdminPage>
  );
}

/* ─── My bugs list ─────────────────────────────────────────────────────────── */
const TABS = [['all', 'All'], ['open', 'Open'], ['in-progress', 'In progress'], ['completed', 'Completed'], ['overdue', 'Overdue']];

function MyBugs() {
  const now = useNow();
  const { bugs, error, loading, load } = useMyBugs();
  const [params, setParams] = useSearchParams();
  const filter = TABS.some(([id]) => id === params.get('filter')) ? params.get('filter') : 'all';
  const setFilter = id => setParams(id === 'all' ? {} : { filter: id }, { replace: true });
  const [search, setSearch] = useState('');

  const counts = useMemo(() => countBugs(bugs || [], now), [bugs, now]);

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (bugs || []).filter(b => {
      if (filter === 'overdue' && !isOverdueAt(b, now)) return false;
      if (!['all', 'overdue'].includes(filter) && b.status !== filter) return false;
      if (term && ![b.title, b.affectedPage, b.description, bugCode(b)].some(v => (v || '').toLowerCase().includes(term))) return false;
      return true;
    });
  }, [bugs, filter, search, now]);

  const actions = (
    <>
      <button type="button" onClick={load} className={btnGhost} disabled={loading} title="Refresh"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      <Link to={`${BASE}/new`} className={btnPrimary}><Plus className="w-4 h-4" /> Report a Bug</Link>
    </>
  );

  return (
    <AdminPage title="My Bugs" subtitle="Bugs you have reported and their progress." actions={actions}>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map(([id, text]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  filter === id
                    ? id === 'overdue' ? 'bg-red-600 border-red-600 text-white' : 'bg-[#002DC2] border-[#002DC2] text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {text} <span className="opacity-75">({counts[id]})</span>
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className={`${inputCls} pl-9`} placeholder="Search my reports" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search my reports" />
          </div>
        </div>

        <ErrorNote>{error}</ErrorNote>
        {bugs === null ? <Loading /> : shown.length === 0 ? (
          <div className={`${cardCls} p-10 text-center space-y-3`}>
            <ClipboardList className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm text-slate-500">{bugs.length ? 'No reports match this filter.' : 'You have not reported any bugs yet.'}</p>
            {!bugs.length && <Link to={`${BASE}/new`} className={btnPrimary}><Plus className="w-4 h-4" /> Report your first bug</Link>}
          </div>
        ) : (
          <ul className="space-y-3">
            {shown.map(b => {
              const overdue = isOverdueAt(b, now);
              return (
                <li key={b._id}>
                  <Link
                    to={`${BASE}/bugs/${b._id}`}
                    className={`${cardCls} block p-4 hover:border-[#002DC2]/40 hover:shadow-md transition-all ${overdue ? 'border-l-4 border-l-red-500' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-xs font-bold text-slate-400">{bugCode(b)}</span>
                          <h2 className="font-bold text-slate-900 break-words min-w-0">{b.title}</h2>
                        </div>
                        <BugBadges bug={b} now={now} />
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1 min-w-0 max-w-full"><FileText className="w-4 h-4 shrink-0" /><span className="truncate">{b.affectedPage}</span></span>
                          <span>Submitted {formatDateTime(b.submittedAt)}</span>
                          <span>Deadline {formatDateTime(b.deadline)}</span>
                        </div>
                        <DeadlineText bug={b} now={now} />
                      </div>
                      {b.screenshots?.length > 0 && (
                        <div className="shrink-0">
                          <img src={assetUrl(b.screenshots[0].url)} alt="" className="w-20 h-16 sm:w-28 sm:h-20 object-cover rounded-lg border border-slate-200" loading="lazy" />
                          {b.screenshots.length > 1 && <p className="text-[11px] text-slate-500 text-center mt-1">+{b.screenshots.length - 1} more</p>}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminPage>
  );
}

/* ─── Detail ──────────────────────────────────────────────────────────────── */
function TesterBugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const now = useNow();
  const [bug, setBug] = useState(null);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    bugRequest(ROLE, `/bugs/${id}`)
      .then(d => { if (!cancelled) setBug(d.bug); })
      .catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [id]);

  const remove = async () => {
    setDeleting(true);
    try {
      await bugRequest(ROLE, `/bugs/${id}`, { method: 'DELETE' });
      navigate(`${BASE}/bugs`, { replace: true });
    } catch (err) { setError(err.message); setDeleting(false); setConfirmDelete(false); }
  };

  const back = { to: `${BASE}/bugs`, label: 'My bugs' };
  if (!bug) {
    return <AdminPage title="Bug report" back={back}>{error ? <ErrorNote>{error}</ErrorNote> : <Loading />}</AdminPage>;
  }
  const locked = bug.status === 'completed';
  const actions = !locked ? (
    <>
      <Link to={`${BASE}/bugs/${bug._id}/edit`} className={btnGhost}><Edit2 className="w-4 h-4" /> Edit</Link>
      {!confirmDelete && (
        <button type="button" onClick={() => setConfirmDelete(true)} className={`${btnGhost} text-red-600 hover:bg-red-50`}><Trash2 className="w-4 h-4" /> Delete</button>
      )}
    </>
  ) : null;

  return (
    <AdminPage title={bugCode(bug)} subtitle={bug.title} back={back} actions={actions}>
      <div className="space-y-5">
        <div className={`${cardCls} p-5 sm:p-6 space-y-4`}>
          <div className="min-w-0 space-y-2">
            <h2 className="text-xl font-black text-[#123B92] break-words">{bug.title}</h2>
            <BugBadges bug={bug} now={now} />
          </div>
          {confirmDelete && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
              <p className="text-sm font-bold text-red-800">Delete this bug report and its screenshots? This cannot be undone.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={remove} disabled={deleting} className={btnDanger}><Trash2 className="w-4 h-4" /> {deleting ? 'Deleting…' : 'Yes, delete'}</button>
                <button type="button" onClick={() => setConfirmDelete(false)} className={btnGhost}>Cancel</button>
              </div>
            </div>
          )}
          {locked && <p className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2">This bug has been completed by a developer, so it can no longer be edited or deleted.</p>}
          <ErrorNote>{error}</ErrorNote>
          <dl className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <Field label="Affected page">{bug.affectedPage}</Field>
            <Field label="Severity (your rating)"><SeverityBadge severity={bug.severity} /></Field>
            <Field label="Submitted">{formatDateTime(bug.submittedAt)}</Field>
            <Field label="Deadline (7 days)"><span className="block">{formatDateTime(bug.deadline)}</span><DeadlineText bug={bug} now={now} /></Field>
            {bug.completedAt && <Field label="Completed">{formatDateTime(bug.completedAt)} by {bug.completedBy}</Field>}
            {bug.assignedTo && <Field label="Assigned developer">{bug.assignedTo}</Field>}
            <Field label="Description" wide>{bug.description}</Field>
            <Field label="Steps to reproduce" wide>{bug.stepsToReproduce}</Field>
            <Field label="Expected result">{bug.expectedResult}</Field>
            <Field label="Actual result">{bug.actualResult}</Field>
            <Field label="Environment (browser / device)" wide>{bug.environment}</Field>
            <ReportExtraFields bug={bug} />
            {bug.developerNotes && <Field label="Developer notes" wide>{bug.developerNotes}</Field>}
          </dl>
        </div>
        <section className={`${cardCls} p-5 sm:p-6 space-y-3`}>
          <h2 className="font-black text-[#123B92]">Technical details</h2>
          <TechnicalDetails context={bug.context} />
        </section>
        <section className={`${cardCls} p-5 sm:p-6 space-y-3`}>
          <h2 className="font-black text-[#123B92]">Screenshots ({bug.screenshots.length})</h2>
          <ScreenshotGallery screenshots={bug.screenshots} />
        </section>
        <section className={`${cardCls} p-5 sm:p-6 space-y-3`}>
          <h2 className="font-black text-[#123B92]">Progress</h2>
          <HistoryList history={bug.history} />
        </section>
      </div>
    </AdminPage>
  );
}
