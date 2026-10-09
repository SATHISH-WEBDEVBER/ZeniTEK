import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PAGES, SITEMAP_GROUPS } from '../data/siteMap';

// Lists every page of the website, grouped by section, so any page can be found in one click.
export default function SitemapPage() {
  const { t, tf } = useLanguage();

  return (
    <div className="text-black min-h-screen bg-white">
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('site_sitemapTitle')}</h1>
            <p className="text-base sm:text-lg text-slate-600">{t('site_sitemapSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SITEMAP_GROUPS.map(group => (
              <div key={group.key} className="rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3">
                <h2 className="text-xl font-bold text-[#123B92]">{t(group.key)}</h2>
                <ul className="divide-y divide-slate-100">
                  {group.paths.map(path => {
                    const page = PAGES[path];
                    const Icon = page.icon;
                    return (
                      <li key={path}>
                        <Link to={path} className="group flex items-center gap-3 py-3 text-[#123B92] hover:text-[#002DC2] transition-colors">
                          <Icon className="w-5 h-5 text-[#002DC2]" />
                          <span className="flex-1 font-semibold">{tf(page.key, page.key)}</span>
                          <span className="hidden sm:inline text-sm text-slate-400 font-mono">{path}</span>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
