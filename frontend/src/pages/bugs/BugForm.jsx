// Full-page bug report form (create / edit) used inside the admin shell by testers and the client admin.
// The main reporting flow is the floating button on the website; this page is the alternative entry
// and the place to edit an existing report.  ?page=/some/path prefills the affected page.
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Bug as BugIcon, Upload, X, Save } from 'lucide-react';
import { bugRequest, assetUrl } from '../../utils/bugApi';
import {
  BUG_CATEGORIES, REPRODUCIBILITY_OPTIONS, SEVERITY_OPTIONS, collectContext, environmentSummary
} from '../../utils/bugReporting';
import { ErrorNote, Loading, usePageOptions, inputCls, btnPrimary, btnGhost, cardCls } from './BugUi';
import { AdminPage } from '../../components/admin/AdminLayout';

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif';
const OTHER = '__other__';

const EMPTY = {
  title: '', affectedPage: '/', description: '', category: '', severity: '', reproducibility: '',
  stepsToReproduce: '', expectedResult: '', actualResult: '', affectedElement: '', suggestedFix: '', environment: ''
};

/** "?page=/gallery?x=1" -> a safe same-site path to prefill */
function pageFromQuery(value) {
  if (!value || typeof value !== 'string') return '';
  const v = value.trim().slice(0, 500);
  return v.startsWith('/') && !v.startsWith('//') ? v : '';
}

/**
 * role: 'tester' | 'client'
 * listPath: where "Cancel" / back goes for a new report
 * detailPath(id): the report's detail page
 */
export default function BugForm({ editing = false, role, listPath, detailPath }) {
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
      setForm(f => ({ ...f, environment: f.environment || environmentSummary(collectContext()) }));
      if (prefillPage) {
        // A listed page is picked in the dropdown; anything else (query strings, detail pages) goes in "Other"
        if (pageOptions.some(o => o.value === prefillPage)) setPageChoice(prefillPage);
        else { setPageChoice(OTHER); setForm(f => ({ ...f, affectedPage: prefillPage })); }
      }
      return undefined;
    }
    // Ignore responses from a superseded load so they never overwrite what the user typed
    let cancelled = false;
    bugRequest(role, `/bugs/${id}`)
      .then(({ bug }) => {
        if (cancelled) return;
        if (bug.status === 'completed') { navigate(detailPath(id), { replace: true }); return; }
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
    const problems = [];
    const ok = [];
    for (const file of Array.from(list || [])) {
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
    const missing = [['title', 'Title'], ['category', 'Category'], ['severity', 'Severity'], ['description', 'Description']]
      .filter(([k]) => !form[k].trim()).map(([, l]) => l);
    if (!affectedPage) missing.push('Affected page');
    if (missing.length) { setError(`Please fill in: ${missing.join(', ')}.`); return; }
    setSaving(true);
    setError('');
    const fd = new FormData();
    Object.entries({ ...form, affectedPage }).forEach(([k, v]) => fd.append(k, v));
    if (!editing) {
      // Browser details from this device; the page itself is the one named above
      const ctx = collectContext();
      const path = affectedPage.startsWith('/') ? affectedPage : '';
      fd.append('context', JSON.stringify({
        ...ctx,
        url: path ? `${window.location.origin}${path}` : affectedPage,
        path: path || affectedPage,
        pageTitle: '',
        scroll: ''
      }));
    }
    files.forEach(f => fd.append('screenshots', f.file, f.file.name));
    if (editing && removeIds.length) fd.append('removeScreenshots', JSON.stringify(removeIds));
    try {
      const data = await bugRequest(role, editing ? `/bugs/${id}` : '/bugs', { method: editing ? 'PUT' : 'POST', form: fd });
      navigate(detailPath(data.bug._id), { replace: editing });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const back = editing ? { to: detailPath(id), label: 'Back to report' } : { to: listPath, label: 'Back' };
  const title = editing ? 'Edit Bug Report' : 'Report a Bug';
  if (loading) return <AdminPage title={title} back={back}><Loading /></AdminPage>;

  const fieldLabel = (text, required) => (
    <span className="block text-xs font-bold text-slate-700 mb-1">{text}{required && <span className="text-red-600"> *</span>}</span>
  );
  const sectionTitle = text => <h2 className="text-xs font-black uppercase tracking-wide text-[#123B92]">{text}</h2>;

  return (
    <AdminPage title={title} subtitle="Tip: the quickest way is the round bug button on any website page; it adds a screenshot automatically." back={back}>
      <form onSubmit={submit} className={`${cardCls} p-5 sm:p-6 space-y-7 max-w-4xl`} noValidate>
        {prefillPage && (
          <p className="text-xs text-[#123B92] bg-blue-50 rounded-xl px-3 py-2 break-words">
            Reporting from <b>{prefillPage}</b>. The affected page has been filled in for you.
          </p>
        )}

        <div className="space-y-4">
          {sectionTitle('What is wrong?')}
          <label className="block">
            {fieldLabel('Title', true)}
            <input className={inputCls} value={form.title} onChange={set('title')} maxLength={200} placeholder="e.g. Quote form does not submit on mobile" name="title" />
          </label>
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block min-w-0">
              {fieldLabel('Category', true)}
              <select className={inputCls} value={form.category} onChange={set('category')} name="category">
                <option value="">Choose…</option>
                {BUG_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="block min-w-0">
              {fieldLabel('Severity', true)}
              <select className={inputCls} value={form.severity} onChange={set('severity')} name="severity">
                <option value="">Choose…</option>
                {SEVERITY_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="block min-w-0">
              {fieldLabel('How often?')}
              <select className={inputCls} value={form.reproducibility} onChange={set('reproducibility')} name="reproducibility">
                <option value="">Not sure</option>
                {REPRODUCIBILITY_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block min-w-0">
              {fieldLabel('Affected page', true)}
              <select className={inputCls} value={pageChoice} onChange={e => setPageChoice(e.target.value)} name="affectedPageChoice">
                {pageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                <option value={OTHER}>Other page / full URL…</option>
              </select>
            </label>
            <label className="block min-w-0">
              {fieldLabel('Affected element or section')}
              <input className={inputCls} value={form.affectedElement} onChange={set('affectedElement')} maxLength={300} placeholder="e.g. Footer contact form" />
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
            <textarea className={`${inputCls} min-h-[110px]`} value={form.description} onChange={set('description')} maxLength={5000} placeholder="What is the problem?" name="description" />
          </label>
        </div>

        <div className="space-y-4">
          {sectionTitle('How to reproduce')}
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
            {fieldLabel('Suggested fix')}
            <textarea className={`${inputCls} min-h-[60px]`} value={form.suggestedFix} onChange={set('suggestedFix')} maxLength={2000} placeholder="Optional" />
          </label>
          <label className="block">
            {fieldLabel('Environment (browser / device)')}
            <input className={inputCls} name="environment" value={form.environment} onChange={set('environment')} maxLength={300} placeholder="e.g. Chrome 130 on Android, 390px wide" />
          </label>
        </div>

        <div className="space-y-2">
          {sectionTitle(`Screenshots (up to ${MAX_FILES}, 5 MB each)`)}
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
