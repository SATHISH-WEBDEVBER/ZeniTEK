import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

// Breadcrumb + Back button for detail pages. Back returns to the previous page in this
// site's history, or to `fallback` when the page was opened directly (shared link, new tab).
export default function PageBackBar({ crumbs = [], fallback = '/' }) {
  const navigate = useNavigate();
  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate(fallback);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs sm:text-sm font-semibold text-slate-500 min-w-0">
        <Link to="/" className="hover:text-[#002DC2]">Home</Link>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            {c.to ? (
              <Link to={c.to} className="hover:text-[#002DC2] whitespace-nowrap">{c.label}</Link>
            ) : (
              <span className="text-[#123B92] truncate max-w-[60vw] sm:max-w-md" aria-current="page">{c.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#123B92]/25 bg-white text-sm font-bold text-[#123B92] hover:border-[#002DC2] hover:text-[#002DC2] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
    </div>
  );
}
