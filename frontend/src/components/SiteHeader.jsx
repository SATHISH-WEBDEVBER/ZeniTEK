import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PAGES, matchPage } from '../data/siteMap';

// Lets a detail page (dryer model, installation, photo...) name itself in the page header.
const PageTitleContext = createContext({ title: null, setTitle: () => {} });

export function PageTitleProvider({ children }) {
  const [title, setTitle] = useState(null);
  return <PageTitleContext.Provider value={{ title, setTitle }}>{children}</PageTitleContext.Provider>;
}

export function usePageTitle(title) {
  const { setTitle } = useContext(PageTitleContext);
  useEffect(() => {
    setTitle(title || null);
    return () => setTitle(null);
  }, [title, setTitle]);
}

// Simple page header shown at the top of every page except Home:
// breadcrumb (Home > Section > Page) on the left, Back button on the right.
// Also keeps the browser tab title in sync with the current page.
export default function SiteHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, tf } = useLanguage();
  const { title } = useContext(PageTitleContext);

  const pattern = matchPage(pathname);
  const label = (key) => tf(key, key);

  // Build the chain of pages from Home down to the current one
  const chain = [];
  if (pattern) {
    for (let p = pattern; p; p = PAGES[p].parent) chain.unshift(p);
  } else {
    chain.push('/');
  }
  const currentLabel = title || (pattern ? label(PAGES[pattern].key) : t('notFoundTitle'));

  useEffect(() => {
    document.title = pattern === '/' ? 'ZeniTEK | Solar Dryers & Solar Thermal Systems' : `${currentLabel} | ZeniTEK`;
  }, [pattern, currentLabel]);

  if (pattern === '/' || pathname.startsWith('/admin')) return null;

  const crumbs = pattern ? chain.slice(0, -1) : chain;
  const parent = crumbs[crumbs.length - 1] || '/';
  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate(parent);
  };

  return (
    <div className="no-divider w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        <nav aria-label={t('site_youAreHere')} className="min-w-0">
          <ol className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 min-w-0">
            {/* on phones only the parent page is shown, so the trail fits on one line */}
            {crumbs.map((p, i) => (
              <li key={p} className={`${i === crumbs.length - 1 ? 'flex' : 'hidden sm:flex'} items-center gap-1.5 shrink-0`}>
                <Link to={p} className="inline-flex items-center gap-1.5 hover:text-[#002DC2] transition-colors whitespace-nowrap">
                  {p === '/' ? <><Home className="w-4 h-4" /><span className="sr-only sm:not-sr-only">{label('navHome')}</span></> : label(PAGES[p].key)}
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </li>
            ))}
            <li className="min-w-0">
              <span aria-current="page" className="block truncate text-[#123B92] font-bold">{currentLabel}</span>
            </li>
          </ol>
        </nav>
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-[#123B92] hover:border-[#002DC2] hover:text-[#002DC2] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('sections_back')}</span>
        </button>
      </div>
    </div>
  );
}
