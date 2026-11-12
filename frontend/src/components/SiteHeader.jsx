import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PAGES, matchPage } from '../data/siteMap';
import { pageDescription, SITE_URL } from '../data/seo';

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

// The current page as seen from the site map: its pattern, the chain of parent pages and its label.
function usePagePath() {
  const { pathname } = useLocation();
  const { t, tf } = useLanguage();
  const { title } = useContext(PageTitleContext);
  const pattern = matchPage(pathname);
  const label = (key) => tf(key, key);
  // a page's own label; model pages carry their code ("D1210 – 150 Tunnel Solar Dryer")
  const pageLabel = (p) => (PAGES[p].code ? `${PAGES[p].code} ${label(PAGES[p].key)}` : label(PAGES[p].key));
  const chain = [];
  if (pattern) {
    for (let p = pattern; p; p = PAGES[p].parent) chain.unshift(p);
  } else {
    chain.push('/');
  }
  const currentLabel = title || (pattern ? pageLabel(pattern) : t('notFoundTitle'));
  return { pathname, pattern, chain, label, pageLabel, currentLabel };
}

// Sets a <meta> / <link> tag in the head (created if missing)
function setHeadTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(create.tag);
    Object.entries(create.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

// Keeps the browser tab title, the search description, the canonical address and the link-preview
// tags in sync with the current page (renders nothing; the visible breadcrumb is part of every
// page's hero, see Breadcrumb below).
export default function SiteHeader() {
  const { pathname, pattern, currentLabel } = usePagePath();
  useEffect(() => {
    const title = pattern === '/' ? 'ZeniTEK | Solar Dryers & Solar Thermal Systems' : `${currentLabel} | ZeniTEK`;
    const description = pageDescription(pathname);
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
    document.title = title;
    setHeadTag('meta[name="description"]', { tag: 'meta', attrs: { name: 'description' } }, 'content', description);
    setHeadTag('link[rel="canonical"]', { tag: 'link', attrs: { rel: 'canonical' } }, 'href', url);
    setHeadTag('meta[property="og:title"]', { tag: 'meta', attrs: { property: 'og:title' } }, 'content', title);
    setHeadTag('meta[property="og:description"]', { tag: 'meta', attrs: { property: 'og:description' } }, 'content', description);
    setHeadTag('meta[property="og:url"]', { tag: 'meta', attrs: { property: 'og:url' } }, 'content', url);
    setHeadTag('meta[name="twitter:title"]', { tag: 'meta', attrs: { name: 'twitter:title' } }, 'content', title);
    setHeadTag('meta[name="twitter:description"]', { tag: 'meta', attrs: { name: 'twitter:description' } }, 'content', description);
    // pages that are not found should not be indexed
    setHeadTag('meta[name="robots"]', { tag: 'meta', attrs: { name: 'robots' } }, 'content', pattern ? 'index, follow' : 'noindex');
  }, [pathname, pattern, currentLabel]);
  return null;
}

// Breadcrumb tab (Back + Home > Section > Page) drawn at the bottom-left corner of the page hero:
// white, with a curved top-right corner, layered above the hero photo.
export function Breadcrumb() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { pathname, pattern, chain, label, pageLabel, currentLabel } = usePagePath();
  if (pattern === '/' || pathname.startsWith('/admin')) return null;

  const crumbs = pattern ? chain.slice(0, -1) : chain;
  const parent = crumbs[crumbs.length - 1] || '/';
  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate(parent);
  };

  return (
    <div className="no-divider absolute left-0 bottom-0 z-20 max-w-[calc(100%-1rem)] bg-white rounded-tr-[1.75rem] pl-5 md:pl-20 pr-5 sm:pr-7 pt-3 pb-2.5 flex items-center gap-3">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-[#123B92] hover:border-[#002DC2] hover:text-[#002DC2] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('sections_back')}</span>
      </button>
      <nav aria-label={t('site_youAreHere')} className="min-w-0">
        <ol className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 min-w-0">
          {/* on phones only the parent page is shown, so the trail fits on one line */}
          {crumbs.map((p, i) => (
            <li key={p} className={`${i === crumbs.length - 1 ? 'flex' : 'hidden sm:flex'} items-center gap-1.5 shrink-0`}>
              <Link to={p} className="inline-flex items-center justify-center gap-1.5 min-h-6 min-w-6 py-1 hover:text-[#002DC2] transition-colors whitespace-nowrap">
                {p === '/' ? <><Home className="w-4 h-4" /><span className="sr-only sm:not-sr-only">{label('navHome')}</span></> : pageLabel(p)}
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </li>
          ))}
          <li className="min-w-0">
            <span aria-current="page" className="block truncate text-[#123B92] font-bold max-w-[40vw] sm:max-w-xs">{currentLabel}</span>
          </li>
        </ol>
      </nav>
    </div>
  );
}
