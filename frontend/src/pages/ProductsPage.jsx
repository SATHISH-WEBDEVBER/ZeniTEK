import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wheat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import IconTile from '../components/IconTile';
import { defaultSectionsData } from '../data/defaultSectionsData';
import { SOLUTION_SLUGS, SOLUTION_ICONS } from '../data/siteMap';

// Products overview: one card per solution page, so the navbar "Products" menu has a page of its own.
export default function ProductsPage() {
  const { t, tf } = useLanguage();
  const sections = SOLUTION_SLUGS.map(slug => {
    const data = defaultSectionsData.find(s => s.slug === slug) || {};
    return {
      to: `/${slug}`,
      icon: SOLUTION_ICONS[slug],
      title: tf(`section_${slug}_title`, data.title || slug),
      desc: tf(`section_${slug}_subtitle`, data.subtitle || ''),
      image: data.thumbnail?.url
    };
  });
  const cards = [
    ...sections,
    { to: '/applications', icon: Wheat, title: t('navApplications'), desc: t('site_productsAppsDesc'), image: '/real-photos/zenitek_photo_35.jpeg' }
  ];

  return (
    <div className="text-black min-h-screen bg-white">
      <PageHero
        images="/real-photos/zenitek_photo_18.jpeg"
        title={<>{t('site_productsTitle1')} <br /><span className="text-[#002DC2]">{t('site_productsTitle2')}</span></>}
        subtitle={t('site_productsSubtitle')}
      />

      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('site_productsGridTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(card => (
              <Link
                key={card.to}
                to={card.to}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-[#002DC2]/40 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  {card.image && <img src={card.image} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <IconTile icon={card.icon} size="md" tone="solid" className="absolute left-4 -bottom-6 shadow-md" />
                </div>
                <div className="flex-1 flex flex-col gap-2 p-5 pt-9">
                  <h3 className="text-lg font-bold text-[#123B92] group-hover:text-[#002DC2] transition-colors">{card.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{card.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2] pt-1">
                    {t('site_open')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
