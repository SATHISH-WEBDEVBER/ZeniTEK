// Tester portal: /admin/tester (inside the shared admin shell)
//   /admin/tester                dashboard: my bug counts + recent reports
//   /admin/tester/bugs           my bug reports (filter / search)
//   /admin/tester/new            report a bug (?page=/some/path prefills "Affected page")
//   /admin/tester/bugs/:id       report details
//   /admin/tester/bugs/:id/edit  edit a report
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams, Navigate, useSearchParams } from 'react-router-dom';
import {
  Bug as BugIcon, Plus, Edit2, Trash2, Upload, X, RefreshCw, FileText, Search, Save, ClipboardList,
  LayoutDashboard, ListChecks, CircleDot, Timer, CheckCircle2, AlertTriangle, Globe
} from 'lucide-react';
import { bugRequest, useRoleSession, assetUrl } from '../../utils/bugApi';
import {
  RoleLogin, BugBadges, DeadlineText, ScreenshotGallery, HistoryList, Field, ErrorNote,
  Loading, SeverityBadge, usePageOptions, useNow, formatDateTime, bugCode, isOverdueAt,
  inputCls, btnPrimary, btnGhost, btnDanger, cardCls
} from './BugUi';
import { AdminPage, AdminShellContext, StatCard } from '../../components/admin/AdminLayout';

const ROLE = 'tester';
const BASE = '/admin/tester';
const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif';
const OTHER = '__other__';

export default function TesterApp() {
  const session = useRoleSession(ROLE);
  if (!session.session) {
    return <RoleLogin title="Tester" subtitle="Report and track website bugs" Icon={BugIcon} session={session} />;
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
        <Route path="new" element={<BugForm />} />
        <Route path="bugs/:id" element={<TesterBugDetail />} />
        <Route path="bugs/:id/edit" element={<BugForm editing />} />
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
                  While you are signed in, every website page shows a <b>Report a bug</b> button in the bottom-left corner.
                  It opens the report form with the page already filled in.
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
            {bug.developerNotes && <Field label="Developer notes" wide>{bug.developerNotes}</Field>}
          </dl>
        </div>
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

/* ─── Create / edit form ──────────────────────────────────────────────────── */
const EMPTY = {
  title: '', affectedPage: '/', description: '', stepsToReproduce: '', expectedResult: '',
  actualResult: '', severity: 'medium', environment: ''
};

/** "?page=/gallery?x=1" -> a safe path to prefill (same-site paths only) */
function pageFromQuery(value) {
  if (!value || typeof value !== 'string') return '';
  const v = value.trim().slice(0, 500);
  return v.startsWith('/') && !v.startsWith('//') ? v : '';
}

function BugForm({ editing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const pageOptions = usePageOptions();
  const fileInput = useRef(null);
  const prefillPage = editing ? '' : pageFromQuery(params.get('page'));

  const [form, setForm] = useState(EMPTY);
  const [pageChoice, setPageChoice] = useState('/');
  const [existing, setExisting] = useState([]);
  const [removeIds, setRemoveIds] = useState([]);
  const [files, setFiles] = useState([]); // { file, url }
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) {
      setForm(f => ({ ...f, environment: f.environment || guessEnvironment() }));
      if (prefillPage) {
        // A listed page is picked in the dropdown; anything else (query strings, detail pages) goes in "Other"
        if (pageOptions.some(o => o.value === prefillPage)) setPageChoice(prefillPage);
        else { setPageChoice(OTHER); setForm(f => ({ ...f, affectedPage: prefillPage })); }
      }
      return undefined;
    }
    // Ignore responses from a superseded load so they never overwrite what the user typed
    let cancelled = false;
    bugRequest(ROLE, `/bugs/${id}`)
      .then(({ bug }) => {
        if (cancelled) return;
        if (bug.status === 'completed') { navigate(`${BASE}/bugs/${id}`, { replace: true }); return; }
        setForm(Object.fromEntries(Object.keys(EMPTY).map(k => [k, bug[k] || ''])));
        setPageChoice(pageOptions.some(o => o.value === bug.affectedPage) ? bug.affectedPage : OTHER);
        setExisting(bug.screenshots);
        setLoading(false);
      })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, id, prefillPage]);

  // Revoke preview URLs on unmount
  const filesRef = useRef(files);
  filesRef.current = files;
  useEffect(() => () => filesRef.current.forEach(f => URL.revokeObjectURL(f.url)), []);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const keptCount = existing.filter(s => !removeIds.includes(s._id)).length;
  const slotsLeft = MAX_FILES - keptCount - files.length;

  const addFiles = list => {
    setError('');
    const picked = Array.from(list || []);
    const problems = [];
    const ok = [];
    for (const file of picked) {
      if (!ACCEPT.split(',').includes(file.type)) problems.push(`${file.name}: not a PNG/JPG/WEBP/GIF image`);
      else if (file.size > MAX_SIZE) problems.push(`${file.name}: larger than 5 MB`);
      else ok.push(file);
    }
    if (ok.length > slotsLeft) problems.push(`Only ${MAX_FILES} screenshots per bug — ${ok.length - Math.max(slotsLeft, 0)} not added`);
    const accepted = ok.slice(0, Math.max(slotsLeft, 0)).map(file => ({ file, url: URL.createObjectURL(file) }));
    setFiles(prev => [...prev, ...accepted]);
    if (problems.length) setError(problems.join('. '));
    if (fileInput.current) fileInput.current.value = '';
  };

  const submit = async e => {
    e.preventDefault();
    const affectedPage = (pageChoice === OTHER ? form.affectedPage : pageChoice).trim();
    if (!form.title.trim() || !form.description.trim() || !affectedPage) {
      setError('Title, affected page and description are required.');
      return;
    }
    setSaving(true);
    setError('');
    const fd = new FormData();
    Object.entries({ ...form, affectedPage }).forEach(([k, v]) => fd.append(k, v));
    files.forEach(f => fd.append('screenshots', f.file, f.file.name));
    if (editing && removeIds.length) fd.append('removeScreenshots', JSON.stringify(removeIds));
    try {
      const data = await bugRequest(ROLE, editing ? `/bugs/${id}` : '/bugs', { method: editing ? 'PUT' : 'POST', form: fd });
      navigate(`${BASE}/bugs/${data.bug._id}`, { replace: editing });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const back = editing ? { to: `${BASE}/bugs/${id}`, label: 'Back to report' } : { to: `${BASE}/bugs`, label: 'My bugs' };
  const title = editing ? 'Edit Bug Report' : 'Report a Bug';
  if (loading) return <AdminPage title={title} back={back}><Loading /></AdminPage>;

  const fieldLabel = (text, required) => (
    <span className="block text-xs font-bold text-slate-700 mb-1">{text}{required && <span className="text-red-600"> *</span>}</span>
  );

  return (
    <AdminPage title={title} subtitle="Describe what went wrong so a developer can reproduce and fix it." back={back}>
      <form onSubmit={submit} className={`${cardCls} p-5 sm:p-6 space-y-5 max-w-4xl`} noValidate>
        {prefillPage && (
          <p className="text-xs text-[#123B92] bg-blue-50 rounded-xl px-3 py-2 break-words">
            Reporting from <b>{prefillPage}</b>. The affected page has been filled in for you.
          </p>
        )}
        <label className="block">
          {fieldLabel('Title', true)}
          <input className={inputCls} value={form.title} onChange={set('title')} maxLength={200} placeholder="e.g. Quote form does not submit on mobile" required />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block min-w-0">
            {fieldLabel('Affected page', true)}
            <select className={inputCls} value={pageChoice} onChange={e => setPageChoice(e.target.value)} name="affectedPageChoice">
              {pageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              <option value={OTHER}>Other page / full URL…</option>
            </select>
          </label>
          <label className="block min-w-0">
            {fieldLabel('Severity')}
            <select className={inputCls} value={form.severity} onChange={set('severity')}>
              <option value="low">Low — cosmetic / minor</option>
              <option value="medium">Medium — something works incorrectly</option>
              <option value="high">High — a main feature is broken</option>
              <option value="critical">Critical — site unusable / data loss</option>
            </select>
          </label>
        </div>
        {pageChoice === OTHER && (
          <label className="block">
            {fieldLabel('Page path or URL', true)}
            <input className={inputCls} name="affectedPage" value={form.affectedPage === '/' ? '' : form.affectedPage} onChange={set('affectedPage')} maxLength={500} placeholder="/installations/12 or https://zenitek.in/…" />
          </label>
        )}

        <label className="block">
          {fieldLabel('Description', true)}
          <textarea className={`${inputCls} min-h-[110px]`} value={form.description} onChange={set('description')} maxLength={5000} placeholder="What is the problem?" required />
        </label>
        <label className="block">
          {fieldLabel('Steps to reproduce')}
          <textarea className={`${inputCls} min-h-[90px]`} value={form.stepsToReproduce} onChange={set('stepsToReproduce')} maxLength={5000} placeholder={'1. Open the page\n2. Click …\n3. …'} />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            {fieldLabel('Expected result')}
            <textarea className={`${inputCls} min-h-[70px]`} value={form.expectedResult} onChange={set('expectedResult')} maxLength={2000} />
          </label>
          <label className="block">
            {fieldLabel('Actual result')}
            <textarea className={`${inputCls} min-h-[70px]`} value={form.actualResult} onChange={set('actualResult')} maxLength={2000} />
          </label>
        </div>
        <label className="block">
          {fieldLabel('Environment (browser / device)')}
          <input className={inputCls} name="environment" value={form.environment} onChange={set('environment')} maxLength={300} placeholder="e.g. Chrome 130 on Android, 390px wide" />
        </label>

        <div className="space-y-2">
          {fieldLabel(`Screenshots (up to ${MAX_FILES}, 5 MB each)`)}
          <div className="flex flex-wrap gap-3">
            {existing.filter(s => !removeIds.includes(s._id)).map(s => (
              <Thumb key={s._id} src={assetUrl(s.url)} name={s.originalName} onRemove={() => setRemoveIds(r => [...r, s._id])} />
            ))}
            {files.map((f, i) => (
              <Thumb key={f.url} src={f.url} name={f.file.name} isNew onRemove={() => { URL.revokeObjectURL(f.url); setFiles(prev => prev.filter((_, j) => j !== i)); }} />
            ))}
            {slotsLeft > 0 && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                className="w-28 h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#002DC2] text-slate-500 hover:text-[#002DC2] flex flex-col items-center justify-center gap-1 text-xs font-bold cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5" /> Add image
              </button>
            )}
          </div>
          <input ref={fileInput} type="file" accept={ACCEPT} multiple className="hidden" onChange={e => addFiles(e.target.files)} data-testid="screenshot-input" />
          {removeIds.length > 0 && <p className="text-xs text-amber-700">{removeIds.length} existing screenshot(s) will be removed when you save.</p>}
        </div>

        <ErrorNote>{error}</ErrorNote>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {editing ? <Save className="w-4 h-4" /> : <BugIcon className="w-4 h-4" />}
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Submit Bug Report'}
          </button>
          <Link to={back.to} className={btnGhost}>Cancel</Link>
        </div>
      </form>
    </AdminPage>
  );
}

function Thumb({ src, name, onRemove, isNew }) {
  return (
    <div className="relative w-28 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
      <img src={src} alt={name || 'Screenshot'} className="w-full h-full object-cover" />
      {isNew && <span className="absolute left-1 top-1 rounded bg-[#23AC39] px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>}
      <button type="button" onClick={onRemove} title="Remove" aria-label={`Remove ${name || 'screenshot'}`}
        className="absolute right-1 top-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function guessEnvironment() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const version = (/(?:Edg|Chrome|Firefox|Version)\/(\d+)/.exec(ua) || [])[1];
  const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '';
  return `${browser}${version ? ` ${version}` : ''}${os ? ` on ${os}` : ''}, ${window.innerWidth}×${window.innerHeight} viewport`;
}
