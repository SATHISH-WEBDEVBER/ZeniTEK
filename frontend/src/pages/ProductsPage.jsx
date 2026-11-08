import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, MessageSquareQuote, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import IconTile from '../components/IconTile';
import { ProductImage } from '../components/ProductCards';
import { PRODUCTS } from '../data/siteMap';
import { nodeTitle } from '../data/productCatalog';

// Products overview: the four product areas, each listing everything inside it (sub-products and
// models link to their own pages), so the whole range is visible on one page.
export default function ProductsPage() {
  const { t } = useLanguage();

  return (
    <div className="text-black min-h-screen bg-white">
      <PageHero
        images="/real-photos/zenitek_photo_18.webp"
        title={<>{t('site_productsTitle1')} <span className="text-[#002DC2]">{t('site_productsTitle2')}</span></>}
        subtitle={t('cat_hubSubtitle')}
        actions={[
          { label: t('getQuote'), to: '/quote', icon: MessageSquareQuote },
          { label: t('prod_talkToTeam'), to: '/contact', icon: Phone },
        ]}
        stats={[
          { value: String(PRODUCTS.length), label: t('cat_glanceAreas') },
          { value: '8', label: t('prod_glanceModels') },
          { value: '6+', label: t('prod_glancePartners') },
        ]}
      />

      {/* The four product areas */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('cat_hubGridTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {PRODUCTS.map(product => (
              <article key={product.path} className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-[#002DC2]/40 hover:shadow-lg transition-all">
                <Link to={product.path} className="relative block">
                  <div className="aspect-[16/9] overflow-hidden">
                    <ProductImage node={product} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <IconTile icon={product.icon} size="md" tone="solid" className="absolute left-5 -bottom-6 shadow-md" />
                </Link>
                <div className="flex-1 flex flex-col gap-3 p-6 pt-10">
                  <h3 className="text-xl font-bold text-[#123B92]">
                    <Link to={product.path} className="hover:text-[#002DC2] transition-colors">{t(product.key)}</Link>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{t(product.descKey)}</p>

                  {product.children ? (
                    // Everything inside this product area, each with its own page
                    <div className="flex-1 pt-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#1A822B] mb-2">{t('cat_inside')}</div>
                      <ul className="divide-y divide-slate-100 border-y border-slate-100">
                        {product.children.map(child => (
                          <li key={child.id} className="py-2">
                            <Link to={child.path} className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-[#002DC2] transition-colors">
                              <ChevronRight className="w-4 h-4 text-[#23AC39] shrink-0" />
                              <span>{nodeTitle(child, t)}</span>
                            </Link>
                            {child.children && (
                              <div className="flex flex-wrap gap-1.5 mt-2 pl-6">
                                {child.children.map(g => (
                                  <Link key={g.id} to={g.path} className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#002DC2] hover:text-[#002DC2] transition-colors">
                                    {g.code || t(g.titleKey)}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <ul className="space-y-2 flex-1 pt-1">
                      {product.points.map(key => (
                        <li key={key} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="w-5 h-5 text-[#23AC39] shrink-0" />
                          <span>{t(key)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link to={product.path} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2] pt-2">
                    {t('prod_explore')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
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
