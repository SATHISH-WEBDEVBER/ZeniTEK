// Floating bug-report stack for the PUBLIC website, directly above the WhatsApp button.
// Visible only while a tester or the client admin is signed in (valid, unexpired session in this tab);
// ordinary visitors never see it.
//   - round "Report a bug" button: instantly screenshots the visible page and opens the report drawer
//   - small pill: the reporter's dashboard (tester: My reports, client: Admin panel)
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bug, Camera, LayoutDashboard, Loader, CheckCircle2, X } from 'lucide-react';
import BugReportDrawer, { EMPTY_DRAFT } from './BugReportDrawer';
import { getReporterSession, dashboardFor, collectContext, captureViewport } from '../utils/bugReporting';

const bugCode = bug => (bug?.bugNumber ? `BUG-${bug.bugNumber}` : 'Bug');
const nextFrame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

export default function BugReportButton() {
  const location = useLocation();
  const [reporter, setReporter] = useState(() => getReporterSession());
  const [phase, setPhase] = useState('idle'); // idle | capturing | open
  const [context, setContext] = useState(null);
  const [shot, setShot] = useState(null);
  const [captureError, setCaptureError] = useState('');
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [extras, setExtras] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [done, setDone] = useState(null); // submitted bug
  const shotRef = useRef(null);
  shotRef.current = shot;

  // Re-check the session on navigation, focus and every minute (tokens expire after 8h)
  useEffect(() => { setReporter(getReporterSession()); }, [location.pathname]);
  useEffect(() => {
    const check = () => setReporter(getReporterSession());
    window.addEventListener('focus', check);
    window.addEventListener('storage', check);
    const t = setInterval(check, 60000);
    return () => { window.removeEventListener('focus', check); window.removeEventListener('storage', check); clearInterval(t); };
  }, []);
  useEffect(() => () => { if (shotRef.current) URL.revokeObjectURL(shotRef.current.url); }, []);
  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(() => setDone(null), 9000);
    return () => clearTimeout(t);
  }, [done]);

  const replaceShot = useCallback(next => {
    setShot(prev => { if (prev) URL.revokeObjectURL(prev.url); return next; });
    setBoxes([]);
  }, []);

  const capture = useCallback(async () => {
    setDone(null);
    setPhase('capturing');
    setCaptureError('');
    setContext(collectContext());
    await nextFrame(); // let the drawer close / the stack switch to its capturing state first
    try {
      replaceShot(await captureViewport());
    } catch (err) {
      replaceShot(null);
      setCaptureError(`The screenshot could not be taken (${err?.message || 'unknown error'}). You can still send the report, or add an image yourself.`);
    }
    setPhase('open');
  }, [replaceShot]);

  if (!reporter) return null;
  const dash = dashboardFor(reporter.role);

  const reset = () => {
    replaceShot(null);
    extras.forEach(x => URL.revokeObjectURL(x.url));
    setExtras([]);
    setDraft(EMPTY_DRAFT);
    setCaptureError('');
  };

  return (
    <>
      {/* Stack sits above the WhatsApp button: WA is 52px (56px sm+) tall at bottom 20px (24px sm+) */}
      <div
        className="fixed right-5 bottom-[84px] sm:right-6 sm:bottom-[92px] z-50 flex flex-col items-end gap-2 print:hidden"
        data-capture-ignore=""
        data-testid="bug-stack"
      >
        {phase === 'capturing' ? (
          <span role="status" className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 text-white text-xs font-bold px-3 py-2 shadow-lg">
            <Loader className="w-4 h-4 animate-spin" /> Capturing…
          </span>
        ) : (
          <>
            <Link
              to={dash.to}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-slate-200 text-[#123B92] hover:text-[#002DC2] text-xs font-bold px-3 py-1.5 shadow-md"
              title={`Signed in as ${reporter.username}`}
              data-testid="bug-stack-dashboard"
            >
              <LayoutDashboard className="w-4 h-4" /> {dash.label}
            </Link>
            <button
              type="button"
              onClick={capture}
              className="group relative w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-full bg-[#123B92] hover:bg-[#002DC2] text-white flex items-center justify-center shadow-lg shadow-black/15 border-2 border-white cursor-pointer transition-colors"
              aria-label="Report a bug on this page (takes a screenshot)"
              data-testid="bug-report-button"
            >
              <Bug className="w-6 h-6" />
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#23AC39] border-2 border-white flex items-center justify-center">
                <Camera className="w-3 h-3" />
              </span>
              <span className="hidden md:flex items-center absolute right-full mr-3 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-semibold rounded-lg whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Report a bug (screenshot)
              </span>
            </button>
          </>
        )}
      </div>

      {done && (
        <div role="status" data-capture-ignore="" data-testid="bug-success"
          className="fixed left-1/2 -translate-x-1/2 bottom-5 z-[90] w-[min(92vw,420px)] flex items-start gap-3 rounded-2xl bg-[#1A822B] text-white px-4 py-3 shadow-xl">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm flex-1 min-w-0">
            <b>{bugCode(done)} reported.</b> Thank you!{' '}
            <Link to={dash.reportsTo(done._id)} className="underline font-bold">View report</Link>
          </p>
          <button type="button" onClick={() => setDone(null)} aria-label="Dismiss" className="shrink-0 cursor-pointer opacity-80 hover:opacity-100"><X className="w-4 h-4" /></button>
        </div>
      )}

      {context && (
        <BugReportDrawer
          open={phase === 'open'}
          reporter={reporter}
          context={context}
          shot={shot}
          captureError={captureError}
          draft={draft}
          setDraft={setDraft}
          extras={extras}
          setExtras={setExtras}
          boxes={boxes}
          setBoxes={setBoxes}
          onClose={() => setPhase('idle')}
          onRetake={capture}
          onRemoveShot={() => replaceShot(null)}
          onSubmitted={bug => { reset(); setPhase('idle'); setDone(bug); }}
        />
      )}
    </>
  );
}
