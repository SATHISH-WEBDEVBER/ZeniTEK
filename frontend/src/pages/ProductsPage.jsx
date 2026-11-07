import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MessageSquareQuote, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import IconTile from '../components/IconTile';
import SolarThermalArt from '../components/SolarThermalArt';
import { PRODUCTS } from '../data/siteMap';

// Figures that summarise the three product areas (all taken from the product pages themselves)
const GLANCE = [
  ['8', 'prod_glanceModels'],
  ['3', 'prod_glanceCollectors'],
  ['6+', 'prod_glancePartners'],
  ['35', 'prod_glanceSites'],
];

// Products overview: the three product areas, so the navbar "Products" menu has a page of its own.
export default function ProductsPage() {
  const { t } = useLanguage();

  return (
    <div className="text-black min-h-screen bg-white">
      <PageHero
        images="/real-photos/zenitek_photo_18.jpeg"
        title={<>{t('site_productsTitle1')} <br /><span className="text-[#002DC2]">{t('site_productsTitle2')}</span></>}
        subtitle={t('prod_hubSubtitle')}
      />

      {/* At a glance */}
      <section className="w-full border-b border-slate-200 bg-[#F0F4FD]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {GLANCE.map(([value, key]) => (
            <div key={key} className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl font-black text-[#123B92] tracking-tight">{value}</div>
              <div className="text-sm font-semibold text-slate-600 leading-snug">{t(key)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The three product areas */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('prod_hubGridTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map(product => (
              <Link
                key={product.path}
                to={product.path}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-[#002DC2]/40 hover:shadow-lg transition-all"
              >
                <div className="relative">
                  <div className="aspect-[16/10] bg-[#F0F4FD] overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <SolarThermalArt type={product.art} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <IconTile icon={product.icon} size="md" tone="solid" className="absolute left-5 -bottom-6 shadow-md" />
                </div>
                <div className="flex-1 flex flex-col gap-3 p-6 pt-10">
                  <h3 className="text-xl font-bold text-[#123B92] group-hover:text-[#002DC2] transition-colors">{t(product.key)}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{t(product.descKey)}</p>
                  <ul className="space-y-2 flex-1 pt-1">
                    {product.points.map(key => (
                      <li key={key} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-[#23AC39] shrink-0" />
                        <span>{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2] pt-2">
                    {t('prod_explore')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help choosing */}
      <section className="w-full pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#001b69] to-[#002DC2] text-white p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t('prod_helpTitle')}</h2>
              <p className="text-base text-slate-200 leading-relaxed">{t('prod_helpBody')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/quote" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold transition-colors">
                <MessageSquareQuote className="w-5 h-5" /> {t('getQuote')}
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold transition-colors">
                <Phone className="w-5 h-5" /> {t('prod_talkToTeam')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
