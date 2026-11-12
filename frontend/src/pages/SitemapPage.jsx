import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PAGES, SITEMAP_GROUPS } from '../data/siteMap';
import { LANGS } from '../i18n/langs';
import PageHero from '../components/PageHero';

const PAGE_COUNT = SITEMAP_GROUPS.reduce((n, g) => n + g.paths.length, 0);

// How deep a product page sits below /products (sub-products and models are indented)
const productDepth = (path) => {
  let depth = 0;
  for (let p = PAGES[path].parent; p && p !== '/products' && p !== '/'; p = PAGES[p].parent) depth++;
  return depth;
};

// Lists every page of the website, grouped by section, so any page can be found in one click.
export default function SitemapPage() {
  const { t, tf } = useLanguage();

  return (
    <div className="text-black min-h-screen bg-white">
      <PageHero
        images="/images/gallery/photo-10.webp"
        title={t('site_sitemapTitle')}
        subtitle={t('site_sitemapSubtitle')}
        actions={[
          { label: t('navHome'), to: '/', icon: Home },
          { label: t('navContact'), to: '/contact', icon: Phone },
        ]}
        stats={[
          { value: String(SITEMAP_GROUPS.length), label: t('hero_smGroups') },
          { value: String(PAGE_COUNT), label: t('hero_smPages') },
          { value: String(LANGS.length), label: t('hero_smLangs') },
        ]}
      />

      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SITEMAP_GROUPS.map(group => (
              <div key={group.key} className="rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3">
                <h2 className="text-xl font-bold text-[#123B92]">{t(group.key)}</h2>
                <ul className="divide-y divide-slate-100">
                  {group.paths.map(path => {
                    const page = PAGES[path];
                    const Icon = page.icon;
                    const name = tf(page.key, page.key);
                    const depth = productDepth(path);
                    return (
                      <li key={path} style={depth ? { paddingLeft: `${depth * 1.5}rem` } : undefined}>
                        <Link to={path} className="group flex items-center gap-3 py-3 text-[#123B92] hover:text-[#002DC2] transition-colors">
                          <Icon className={`${depth ? 'w-4 h-4' : 'w-5 h-5'} text-[#002DC2]`} />
                          <span className={`flex-1 ${depth ? 'text-sm font-medium' : 'font-semibold'}`}>{page.code ? `${page.code} ${name}` : name}</span>
                          <span className="hidden sm:inline text-sm text-slate-500 font-mono">{path}</span>
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
