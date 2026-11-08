import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, MessageSquareQuote, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import BoldText from '../components/BoldText';
import { usePageTitle } from '../components/SiteHeader';
import { ProductImage, ProductGrid } from '../components/ProductCards';
import { findNodeByPath, productImage, nodeTitle } from '../data/productCatalog';
import { findDryerModel } from './DryerModelPage';
import NotFoundPage from './NotFoundPage';

const WHATSAPP = (name) => `https://wa.me/918098613422?text=${encodeURIComponent(`Hello ZeniTEK team, I would like to enquire about: ${name}`)}`;

// "2.5 kg to 12.5 kg per batch (…)" -> "2.5–12.5 kg"
const shortCapacity = (text = '') => {
  const m = /([\d.,]+\+?)\s*kg\s*to\s*([\d.,]+\+?)\s*kg/i.exec(text);
  return m ? `${m[1]}–${m[2]} kg` : (text || '—');
};
// "36 Nos. (SS304 …)" -> "36"; descriptive values stay as they are
const shortTrays = (text = '') => (/^(\d+)\s*Nos?\b/i.exec(text)?.[1] || text || '—');

function SectionTitle({ title }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10">
      <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{title}</h2>
    </div>
  );
}

// Shared page for every catalogue product without a page of its own (productCatalog.js, page: 'catalog'):
// Tunnel Solar Dryers, Parabolic Trough Collector, Scheffler Dish, Solar Water Heater, PV Laboratory,
// its three test setups and the Wood Log Splitter.
export default function CatalogPage({ onOpenQuoteModal }) {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const entry = findNodeByPath(pathname.replace(/\/+$/, ''));
  const node = entry?.node;
  const parent = entry?.parent;
  const title = node ? nodeTitle(node, t) : '';
  usePageTitle(title || undefined);

  if (!node) return <NotFoundPage />;

  const quote = () => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: title });
  const models = (node.children || []).filter(c => c.modelId).map(c => ({ node: c, model: findDryerModel(c.modelId) })).filter(m => m.model);
  const siblings = parent ? parent.children.filter(c => c.id !== node.id) : [];

  return (
    <div className="text-black min-h-screen bg-white">
      <PageHero
        images={productImage(node)}
        title={title}
        subtitle={t(node.shortKey)}
        actions={[
          { label: t('getQuote'), onClick: quote, icon: MessageSquareQuote },
          { label: t('prod_whatsapp'), href: WHATSAPP(title), external: true, icon: MessageCircle },
        ]}
      />

      {/* Overview: photo + what it is + three key facts */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <ProductImage node={node} className="w-full aspect-[4/3] rounded-3xl shadow-lg" />
          <div className="space-y-5">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('cat_overview')}</h2>
            {node.bodyKey && <p className="text-base sm:text-lg text-slate-700 leading-relaxed"><BoldText text={t(node.bodyKey)} /></p>}
            {node.points && (
              <ul className="space-y-3">
                {node.points.map(k => (
                  <li key={k} className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-[#23AC39] shrink-0" />
                    <span className="text-base font-bold text-[#123B92]">{t(k)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Sub-products / models */}
      {node.children && (
        <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title={t('cat_inThis')} />
            <ProductGrid nodes={node.children} />

            {/* Dryer models side by side */}
            {models.length > 1 && (
              <div className="mt-12">
                <h3 className="text-2xl font-black text-[#123B92] text-center mb-6">{t('cat_compareTitle')}</h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead>
                      <tr className="bg-[#123B92] text-white text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">{t('cat_colModel')}</th>
                        <th className="p-4 font-bold">{t('cat_colFloor')}</th>
                        <th className="p-4 font-bold">{t('cat_colCapacity')}</th>
                        <th className="p-4 font-bold">{t('cat_colTrays')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {models.map(({ node: m, model }) => (
                        <tr key={m.id} className="hover:bg-[#F0F4FD] transition-colors">
                          <td className="p-4 font-bold">
                            <Link to={m.path} className="text-[#002DC2] hover:underline whitespace-nowrap">{m.code || t(m.titleKey)}</Link>
                          </td>
                          <td className="p-4 text-slate-700">{model.floorArea}</td>
                          <td className="p-4 text-slate-700 whitespace-nowrap">{shortCapacity(model.capacityRange)}</td>
                          <td className="p-4 text-slate-700">{shortTrays(model.trayCount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Other products in the same family */}
      {siblings.length > 0 && (
        <section className="w-full py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title={t('cat_moreIn', { name: nodeTitle(parent, t) })} />
            <ProductGrid nodes={siblings} />
            <div className="text-center mt-8">
              <Link to={parent.path} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#002DC2]/25 font-bold text-[#002DC2] hover:bg-[#F0F4FD] transition-colors">
                {nodeTitle(parent, t)} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="w-full pb-20 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-12 text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">{t('cat_ctaTitle', { name: title })}</h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">{t('cat_ctaBody')}</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-2">
              <button type="button" onClick={quote} className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-2">
                <MessageSquareQuote className="w-5 h-5" /> {t('getQuote')}
              </button>
              <a href={WHATSAPP(title)} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" /> {t('prod_whatsapp')}
              </a>
              <a href="tel:+918903852623" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> {t('about_callDirectly')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
