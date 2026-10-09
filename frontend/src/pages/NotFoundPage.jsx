import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PAGES } from '../data/siteMap';

const POPULAR = ['/products', '/solar-dryer-models', '/subsidies', '/gallery', '/installations', '/contact', '/sitemap'];

// Shown for any address that is not a page of the site.
export default function NotFoundPage() {
  const { t, tf } = useLanguage();

  return (
    <section className="w-full min-h-[60vh] flex items-center py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F0F4FD] text-[#002DC2]">
          <Compass className="w-8 h-8" />
        </span>
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-widest text-[#1A822B]">{t('site_notFoundCode')}</p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('notFoundTitle')}</h1>
          <p className="text-base sm:text-lg text-slate-600">{t('notFoundDesc')}</p>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002DC2] hover:bg-[#123B92] text-white font-bold transition-colors">
          <Home className="w-5 h-5" /> {t('notFoundHome')}
        </Link>
        <div className="pt-4 space-y-3">
          <h2 className="text-lg font-bold text-[#123B92]">{t('site_popularPages')}</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(path => {
              const Icon = PAGES[path].icon;
              return (
                <Link key={path} to={path} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-[#123B92] hover:border-[#002DC2] hover:text-[#002DC2] transition-colors">
                  <Icon className="w-4 h-4" /> {tf(PAGES[path].key, PAGES[path].key)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
