// Right-side drawer (full screen on mobile) for reporting a bug on the current website page.
// The parent (BugReportButton) owns the draft, the screenshot and the captured context, so the
// draft survives "Retake screenshot" (close drawer -> capture again -> reopen).
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  X, Bug, Camera, Trash2, RotateCcw, Square, Undo2, ImagePlus, ChevronDown, Loader, AlertCircle, Send, Info
} from 'lucide-react';
import useScrollLock, { useEscapeKey } from '../hooks/useScrollLock';
import { bugRequest } from '../utils/bugApi';
import {
  BUG_CATEGORIES, REPRODUCIBILITY_OPTIONS, SEVERITY_OPTIONS, annotateScreenshot, environmentSummary
} from '../utils/bugReporting';

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

export const EMPTY_DRAFT = {
  title: '', description: '', category: '', severity: '', reproducibility: '',
  stepsToReproduce: '', expectedResult: '', actualResult: '', affectedElement: '', suggestedFix: ''
};

const input = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002DC2]/30 focus:border-[#002DC2]';
const btnGhost = 'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors disabled:opacity-60';

function Label({ children, required, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-bold text-slate-700 mb-1">
      {children}{required && <span className="text-red-600"> *</span>}
    </label>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-black uppercase tracking-wide text-[#123B92]">{title}</h3>
      {children}
    </section>
  );
}

/** Screenshot preview with drag-to-highlight boxes (normalised coordinates) */
function ScreenshotEditor({ shot, boxes, setBoxes, highlight }) {
  const areaRef = useRef(null);
  const [drag, setDrag] = useState(null);

  const point = e => {
    const r = areaRef.current.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    };
  };
  const onDown = e => {
    if (!highlight) return;
    e.preventDefault();
    areaRef.current.setPointerCapture?.(e.pointerId);
    const p = point(e);
    setDrag({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
  };
  const onMove = e => { if (drag) { const p = point(e); setDrag(d => ({ ...d, x1: p.x, y1: p.y })); } };
  const onUp = () => {
    if (!drag) return;
    const box = { x: Math.min(drag.x0, drag.x1), y: Math.min(drag.y0, drag.y1), w: Math.abs(drag.x1 - drag.x0), h: Math.abs(drag.y1 - drag.y0) };
    if (box.w > 0.01 && box.h > 0.01) setBoxes(b => [...b, box]);
    setDrag(null);
  };
  const live = drag ? { x: Math.min(drag.x0, drag.x1), y: Math.min(drag.y0, drag.y1), w: Math.abs(drag.x1 - drag.x0), h: Math.abs(drag.y1 - drag.y0) } : null;

  return (
    <div
      ref={areaRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={() => setDrag(null)}
      className={`relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 select-none ${highlight ? 'cursor-crosshair touch-none ring-2 ring-red-400' : ''}`}
      data-testid="bug-screenshot-preview"
    >
      <img src={shot.url} alt="Screenshot of the page" className="block w-full h-auto pointer-events-none" draggable={false} />
      {[...boxes, ...(live ? [live] : [])].map((b, i) => (
        <span key={i} className="absolute border-[3px] border-red-600 bg-red-600/10 rounded-sm pointer-events-none"
          style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.w * 100}%`, height: `${b.h * 100}%` }} />
      ))}
    </div>
  );
}

export default function BugReportDrawer({
  open, reporter, context, shot, captureError, draft, setDraft, extras, setExtras, boxes, setBoxes,
  onClose, onRetake, onRemoveShot, onSubmitted
}) {
  const [highlight, setHighlight] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showTech, setShowTech] = useState(false);
  const fileRef = useRef(null);
  const firstFieldRef = useRef(null);

  useScrollLock(open);
  const close = useCallback(() => { if (!saving) onClose(); }, [saving, onClose]);
  useEscapeKey(open, close);

  useEffect(() => {
    if (!open) return undefined;
    setError('');
    const t = setTimeout(() => firstFieldRef.current?.focus({ preventScroll: true }), 50);
    return () => clearTimeout(t);
  }, [open]);

  const slotsLeft = MAX_FILES - (shot ? 1 : 0) - extras.length;

  const addFiles = useCallback(list => {
    const problems = [];
    const ok = [];
    Array.from(list || []).forEach(file => {
      if (!IMAGE_TYPES.includes(file.type)) problems.push(`${file.name || 'Pasted item'}: not a PNG/JPG/WEBP/GIF image`);
      else if (file.size > MAX_SIZE) problems.push(`${file.name || 'Pasted image'}: larger than 5 MB`);
      else ok.push(file);
    });
    const room = MAX_FILES - (shot ? 1 : 0) - extras.length;
    if (ok.length > room) problems.push(`Only ${MAX_FILES} images per report`);
    const accepted = ok.slice(0, Math.max(room, 0)).map((file, i) => {
      const named = file.name ? file : new File([file], `pasted-${Date.now()}-${i}.png`, { type: file.type });
      return { file: named, url: URL.createObjectURL(named) };
    });
    if (accepted.length) setExtras(prev => [...prev, ...accepted]);
    setError(problems.join('. '));
    if (fileRef.current) fileRef.current.value = '';
  }, [extras.length, setExtras, shot]);

  // Paste images from the clipboard while the drawer is open
  useEffect(() => {
    if (!open) return undefined;
    const onPaste = e => {
      const files = Array.from(e.clipboardData?.items || []).filter(i => i.kind === 'file' && i.type.startsWith('image/')).map(i => i.getAsFile()).filter(Boolean);
      if (files.length) { e.preventDefault(); addFiles(files); }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [open, addFiles]);

  if (!open) return null;

  const set = key => e => setDraft(d => ({ ...d, [key]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    const missing = [['title', 'Title'], ['category', 'Category'], ['severity', 'Severity'], ['description', 'Description']]
      .filter(([k]) => !draft[k].trim()).map(([, l]) => l);
    if (missing.length) { setError(`Please fill in: ${missing.join(', ')}.`); return; }
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(draft).forEach(([k, v]) => fd.append(k, v.trim ? v.trim() : v));
      fd.append('affectedPage', context.path || '/');
      fd.append('environment', environmentSummary(context));
      fd.append('context', JSON.stringify(context));
      if (shot) {
        const blob = await annotateScreenshot(shot, boxes);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        fd.append('screenshots', new File([blob], `screenshot-${stamp}.jpg`, { type: 'image/jpeg' }));
      }
      extras.forEach(x => fd.append('screenshots', x.file, x.file.name));
      const data = await bugRequest(reporter.role, '/bugs', { method: 'POST', form: fd });
      setSaving(false);
      setHighlight(false);
      onSubmitted(data.bug);
    } catch (err) {
      setError(err.message || 'Could not send the report');
      setSaving(false);
    }
  };

  const tech = [
    ['Page', context.url],
    ['Page title', context.pageTitle],
    ['Browser', context.browser],
    ['Operating system', context.os],
    ['Device', context.deviceType],
    ['Viewport', context.viewport],
    ['Screen', context.screen],
    ['Pixel ratio', `${context.pixelRatio}x`],
    ['Site language', context.language],
    ['Scroll position', context.scroll],
    ['Network', context.online ? 'Online' : 'Offline'],
    ['Captured at', new Date(context.capturedAt).toLocaleString('en-IN')],
    ['Reporter', `${reporter.username} (${reporter.role === 'client' ? 'client admin' : 'tester'})`]
  ];

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="bug-drawer-title" data-capture-ignore="">
      <div className="absolute inset-0 bg-slate-900/40" onClick={close} />
      <form
        onSubmit={submit}
        noValidate
        className="absolute inset-y-0 right-0 w-full sm:w-[480px] lg:w-[540px] bg-white shadow-2xl flex flex-col text-left"
        data-testid="bug-drawer"
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-200">
          <span className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0"><Bug className="w-5 h-5" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="bug-drawer-title" className="text-lg font-black text-[#123B92]">Report a bug</h2>
            <p className="text-xs text-slate-500 truncate" title={context.url}>On {context.path}</p>
          </div>
          <button type="button" onClick={close} aria-label="Close" className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-7">
          <Section title="Screenshot">
            {captureError && (
              <p className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> <span>{captureError}</span>
              </p>
            )}
            {shot ? (
              <div className="space-y-2">
                <ScreenshotEditor shot={shot} boxes={boxes} setBoxes={setBoxes} highlight={highlight} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setHighlight(h => !h)} aria-pressed={highlight}
                    className={`${btnGhost} ${highlight ? '!bg-red-600 !border-red-600 !text-white' : ''}`}>
                    <Square className="w-4 h-4" /> {highlight ? 'Done highlighting' : 'Highlight problem'}
                  </button>
                  {boxes.length > 0 && <button type="button" onClick={() => setBoxes(b => b.slice(0, -1))} className={btnGhost}><Undo2 className="w-4 h-4" /> Undo box</button>}
                  <button type="button" onClick={onRetake} className={btnGhost}><RotateCcw className="w-4 h-4" /> Retake</button>
                  <button type="button" onClick={onRemoveShot} className={`${btnGhost} text-red-600`}><Trash2 className="w-4 h-4" /> Remove</button>
                </div>
                {highlight && <p className="text-xs text-slate-500">Drag on the screenshot to draw a red box around the problem.</p>}
              </div>
            ) : (
              <button type="button" onClick={onRetake} className={`${btnGhost} w-full py-3`}><Camera className="w-4 h-4" /> Take a screenshot of the page</button>
            )}
            <div className="space-y-2">
              {extras.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {extras.map((x, i) => (
                    <li key={x.url} className="relative w-20 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={x.url} alt={x.file.name} className="w-full h-full object-cover" />
                      <button type="button" aria-label={`Remove ${x.file.name}`}
                        onClick={() => { URL.revokeObjectURL(x.url); setExtras(prev => prev.filter((_, j) => j !== i)); }}
                        className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {slotsLeft > 0 && (
                <button type="button" onClick={() => fileRef.current?.click()} className={btnGhost}>
                  <ImagePlus className="w-4 h-4" /> Add more images
                </button>
              )}
              <input ref={fileRef} type="file" accept={IMAGE_TYPES.join(',')} multiple className="hidden" onChange={e => addFiles(e.target.files)} data-testid="bug-extra-input" />
              <p className="text-[11px] text-slate-500">You can also paste an image (Ctrl+V). Up to {MAX_FILES} images, 5 MB each.</p>
            </div>
          </Section>

          <Section title="What is wrong?">
            <div>
              <Label htmlFor="bug-title" required>Title</Label>
              <input id="bug-title" ref={firstFieldRef} className={input} value={draft.title} onChange={set('title')} maxLength={200} placeholder="e.g. Quote button does nothing on mobile" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="bug-category" required>Category</Label>
                <select id="bug-category" className={input} value={draft.category} onChange={set('category')}>
                  <option value="">Choose…</option>
                  {BUG_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="bug-severity" required>Severity</Label>
                <select id="bug-severity" className={input} value={draft.severity} onChange={set('severity')}>
                  <option value="">Choose…</option>
                  {SEVERITY_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="bug-description" required>Description</Label>
              <textarea id="bug-description" className={`${input} min-h-[96px]`} value={draft.description} onChange={set('description')} maxLength={5000} placeholder="What happened? What did you notice?" />
            </div>
          </Section>

          <Section title="How to reproduce">
            <div>
              <Label htmlFor="bug-repro">How often does it happen?</Label>
              <select id="bug-repro" className={input} value={draft.reproducibility} onChange={set('reproducibility')}>
                <option value="">Not sure</option>
                {REPRODUCIBILITY_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="bug-steps">Steps to reproduce</Label>
              <textarea id="bug-steps" className={`${input} min-h-[80px]`} value={draft.stepsToReproduce} onChange={set('stepsToReproduce')} maxLength={5000} placeholder={'1. Open this page\n2. Click …\n3. …'} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="bug-expected">Expected result</Label>
                <textarea id="bug-expected" className={`${input} min-h-[64px]`} value={draft.expectedResult} onChange={set('expectedResult')} maxLength={2000} />
              </div>
              <div>
                <Label htmlFor="bug-actual">Actual result</Label>
                <textarea id="bug-actual" className={`${input} min-h-[64px]`} value={draft.actualResult} onChange={set('actualResult')} maxLength={2000} />
              </div>
            </div>
          </Section>

          <Section title="Extra (optional)">
            <div>
              <Label htmlFor="bug-element">Affected element or section</Label>
              <input id="bug-element" className={input} value={draft.affectedElement} onChange={set('affectedElement')} maxLength={300} placeholder="e.g. Footer contact form, second gallery card" />
            </div>
            <div>
              <Label htmlFor="bug-fix">Suggested fix</Label>
              <textarea id="bug-fix" className={`${input} min-h-[64px]`} value={draft.suggestedFix} onChange={set('suggestedFix')} maxLength={2000} placeholder="Optional idea for how to fix it" />
            </div>
          </Section>

          <section className="rounded-xl border border-slate-200">
            <button type="button" onClick={() => setShowTech(s => !s)} aria-expanded={showTech}
              className="w-full flex items-center gap-2 px-4 py-3 text-left text-xs font-bold text-slate-700 cursor-pointer">
              <Info className="w-4 h-4 text-slate-400" />
              <span className="flex-1">Automatically captured details</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTech ? 'rotate-180' : ''}`} />
            </button>
            {showTech && (
              <div className="px-4 pb-4 space-y-3" data-testid="bug-auto-details">
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                  {tech.map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt className="font-bold text-slate-500 whitespace-nowrap">{k}</dt>
                      <dd className="text-slate-800 break-all">{v || '—'}</dd>
                    </React.Fragment>
                  ))}
                </dl>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1">Recent console errors ({context.consoleErrors.length})</p>
                  {context.consoleErrors.length ? (
                    <ul className="text-[11px] font-mono text-red-700 bg-red-50 rounded-lg p-2 space-y-1 max-h-40 overflow-y-auto">
                      {context.consoleErrors.map((e, i) => <li key={i} className="break-all">{e}</li>)}
                    </ul>
                  ) : <p className="text-xs text-slate-500">None recorded.</p>}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-5 py-3 space-y-2 bg-white">
          {error && (
            <p className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> <span className="break-words">{error}</span>
            </p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#002DC2] hover:bg-[#123B92] text-white text-sm font-bold disabled:opacity-60 cursor-pointer">
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {saving ? 'Sending…' : 'Submit bug report'}
            </button>
            <button type="button" onClick={close} disabled={saving} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-60">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
