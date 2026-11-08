import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Map as MapIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PAGES, PRODUCTS } from '../data/siteMap';
import { activeLocationsData } from '../data/mapLocationsData';
import { zenitekRealGallery } from '../data/zenitekRealGalleryData';
import PageHero from '../components/PageHero';

const POPULAR = ['/products', '/solar-dryer-models', '/subsidies', '/gallery', '/installations', '/contact', '/sitemap'];

// Shown for any address that is not a page of the site, and for unknown model / project /
// site / photo / brochure addresses (title and description can be overridden).
export default function NotFoundPage({ title, description }) {
  const { t, tf } = useLanguage();

  return (
    <div className="bg-white">
      <PageHero
        images="/real-photos/zenitek_photo_45.webp"
        title={title || t('notFoundTitle')}
        subtitle={description || t('notFoundDesc')}
        actions={[
          { label: t('notFoundHome'), to: '/', icon: Home },
          { label: t('site_sitemap'), to: '/sitemap', icon: MapIcon },
        ]}
        stats={[
          { value: String(PRODUCTS.length), label: t('hero_nfProducts') },
          { value: String(activeLocationsData.length), label: t('hero_mapSites') },
          { value: String(zenitekRealGallery.length), label: t('hero_galPhotos') },
        ]}
      />

      <section className="w-full py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-sm font-black uppercase tracking-widest text-[#1A822B]">{t('site_notFoundCode')}</p>
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
      </section>
    </div>
  );
}
