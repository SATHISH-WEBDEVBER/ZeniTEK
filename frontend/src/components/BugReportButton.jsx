// Floating "Report a bug" button for the PUBLIC website.
// Shown only while a tester is signed in (valid, unexpired tester session in this tab);
// ordinary visitors never see it. Opens the tester's report form with the current page prefilled.
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bug } from 'lucide-react';
import { readValidSession } from '../utils/bugApi';

export default function BugReportButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(() => !!readValidSession('tester'));

  // Re-check on navigation, when the tab regains focus, and once a minute (tokens expire after 8h)
  useEffect(() => { setActive(!!readValidSession('tester')); }, [location.pathname]);
  useEffect(() => {
    const check = () => setActive(!!readValidSession('tester'));
    window.addEventListener('focus', check);
    window.addEventListener('storage', check);
    const t = setInterval(check, 60000);
    return () => { window.removeEventListener('focus', check); window.removeEventListener('storage', check); clearInterval(t); };
  }, []);

  if (!active) return null;

  const page = `${location.pathname}${location.search}`;
  return (
    <button
      type="button"
      onClick={() => navigate(`/admin/tester/new?page=${encodeURIComponent(page)}`)}
      className="fixed bottom-5 left-5 z-[60] inline-flex items-center gap-2 rounded-full bg-[#123B92] hover:bg-[#002DC2] text-white text-sm font-bold pl-3.5 pr-4 py-3 shadow-lg ring-2 ring-white/80 transition-colors cursor-pointer print:hidden"
      aria-label={`Report a bug on this page (${page})`}
      title="Tester tool: report a bug on this page"
      data-testid="bug-report-button"
    >
      <Bug className="w-5 h-5" />
      <span>Report a bug</span>
    </button>
  );
}
