import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, MessageSquareQuote, MessageCircle, Phone, Search, Wrench, Flame, MapPin,
  GraduationCap, Factory, HeartHandshake, Award, ShowerHead
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import IconTile from '../components/IconTile';
import BoldText from '../components/BoldText';
import { ProductGrid } from '../components/ProductCards';
import { CATALOG, productImage } from '../data/productCatalog';

const WHATSAPP = `https://wa.me/918098613422?text=${encodeURIComponent('Hello ZeniTEK team, I would like to enquire about a Solar Thermal System.')}`;

// This product area and its two collectors (Parabolic Trough Collector, Scheffler Dish), each with
// its own page - see src/data/productCatalog.js
const THERMAL = CATALOG.find(n => n.id === 'solar-thermal');

const REFURB_STEPS = [
  { Icon: Search, titleKey: 'prod_thRef1', bodyKey: 'prod_thRef1d' },
  { Icon: Wrench, titleKey: 'prod_thRef2', bodyKey: 'prod_thRef2d' },
  { Icon: Flame, titleKey: 'prod_thRef3', bodyKey: 'prod_thRef3d' },
];

// Landmark projects (same records as the About page)
const PROJECTS = [
  { metric: '1,000 L/day', titleKey: 'about_p1Title', badgeKey: 'about_p1Badge', descKey: 'about_p1Desc', clientKey: 'about_p1Client', location: 'Pachamalai Hills, Thuraiyur, Tamil Nadu' },
  { metric: '592 sq.m', titleKey: 'about_p3Title', badgeKey: 'about_p3Badge', descKey: 'about_p3Desc', client: 'SRM Institute of Science & Technology', location: 'SRM University, Chennai, Tamil Nadu' },
  { metric: '80 sq.m', titleKey: 'about_p6Title', badgeKey: 'about_p6Badge', descKey: 'about_p6Desc', clientKey: 'about_p6Client', location: 'Indo-MIM Pvt Ltd, Hoskote, Bangalore' },
];

const USERS = [
  { Icon: GraduationCap, titleKey: 'prod_thFor1', bodyKey: 'prod_thFor1d' },
  { Icon: Factory, titleKey: 'prod_thFor2', bodyKey: 'prod_thFor2d' },
  { Icon: HeartHandshake, titleKey: 'prod_thFor3', bodyKey: 'prod_thFor3d' },
];

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
      <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{title}</h2>
      {subtitle && <p className="text-base sm:text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}

// Product page: /solar-thermal-system
export default function SolarThermalPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const quote = () => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Solar Thermal System' });

  return (
    <div className="text-black min-h-screen bg-white">
      <PageHero
        title={<>{t('prod_thHeroTitle1')} <span className="text-[#002DC2]">{t('prod_thHeroTitle2')}</span></>}
        subtitle={t('prod_thHeroSub')}
        images={productImage(THERMAL)}
        actions={[
          { label: t('getQuote'), onClick: quote, icon: MessageSquareQuote },
          { label: t('prod_whatsapp'), href: WHATSAPP, external: true, icon: MessageCircle },
        ]}
        stats={[
          { value: '1,000 L+', label: t('prod_thStat1') },
          { value: '592 sq.m', label: t('prod_thStat2') },
          { value: String(THERMAL.children.length), label: t('prod_thStat3') },
        ]}
      />

      {/* What it is */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('prod_thWhatTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed"><BoldText text={t('prod_thWhatBody')} /></p>
          </div>
          <ul className="lg:col-span-2 space-y-3">
            {['prod_thWhat1', 'prod_thWhat2', 'prod_thWhat3'].map(k => (
              <li key={k} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-[#23AC39] shrink-0" />
                <span className="text-base font-bold text-[#123B92]">{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Collector technologies */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('prod_thTechTitle')} subtitle={t('cat_thTechSub')} />
          <ProductGrid nodes={THERMAL.children} />

          {/* Hot water: evacuated tube collectors are on the Solar Water Heater page */}
          <Link to="/solar-water-heater" className="group mt-8 flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#002DC2]/40 hover:shadow-md transition-all">
            <IconTile icon={ShowerHead} tone="green" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#123B92]">{t('cat_swhBannerTitle')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">{t('cat_swhBannerBody')}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2] shrink-0">
              {t('cat_swh')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Refurbishing */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('about_dThermalSpec4')}</h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">{t('prod_thRefBody')}</p>
          </div>
          <ol className="space-y-4">
            {REFURB_STEPS.map(({ Icon, titleKey, bodyKey }, i) => (
              <li key={titleKey} className="flex gap-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative">
                  <IconTile icon={Icon} size="md" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#002DC2] text-white text-xs font-black flex items-center justify-center">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#123B92]">{t(titleKey)}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">{t(bodyKey)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Landmark projects */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('prod_thProjTitle')} subtitle={t('prod_thProjSub')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROJECTS.map(p => (
              <article key={p.titleKey} className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm p-6 gap-3">
                <span className="self-start text-xs font-bold uppercase tracking-wider text-[#002DC2] bg-[#F0F4FD] px-2.5 py-1 rounded-md">{t(p.badgeKey)}</span>
                <div className="text-3xl font-black text-[#23AC39] tracking-tight">{p.metric}</div>
                <h3 className="text-lg font-bold text-[#123B92] leading-snug">{t(p.titleKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">{t(p.descKey)}</p>
                <div className="pt-3 border-t border-slate-100 space-y-1 text-sm">
                  <div className="font-semibold text-slate-800">{p.clientKey ? t(p.clientKey) : p.client}</div>
                  <div className="flex items-start gap-1.5 text-slate-500"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {p.location}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who uses it */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('prod_thForTitle')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {USERS.map(({ Icon, titleKey, bodyKey }) => (
              <div key={titleKey} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                <IconTile icon={Icon} />
                <h3 className="text-lg font-bold text-[#123B92]">{t(titleKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(bodyKey)}</p>
              </div>
            ))}
          </div>

          {/* Mentorship */}
          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#F0F4FD] border border-[#002DC2]/15 flex flex-col sm:flex-row gap-5 items-start">
            <IconTile icon={Award} tone="solid" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#123B92]">{t('about_mentorTitle')}</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed"><BoldText text={t('about_mentorText')} /></p>
            </div>
          </div>
        </div>
      </section>

      {/* Link to the dryers */}
      <section className="w-full pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-5 bg-white shadow-sm">
            <img src="/real-photos/zenitek_photo_04.webp" alt="ZeniTEK SOLDRY polycarbonate tunnel solar dryer" loading="lazy" className="md:col-span-2 w-full h-56 md:h-full object-cover" />
            <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center gap-3">
              <h3 className="text-2xl font-black text-[#123B92]">{t('prod_thDryerTitle')}</h3>
              <p className="text-base text-slate-600 leading-relaxed">{t('prod_thDryerBody')}</p>
              <Link to="/solar-dryer-models" className="self-start inline-flex items-center gap-2 font-bold text-[#002DC2] hover:underline">
                {t('prod_seeDryers')} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="w-full pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#001f7a] to-slate-900 text-white p-6 sm:p-12 text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">{t('prod_thCtaTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">{t('prod_thCtaBody')}</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-2">
              <button type="button" onClick={quote} className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl transition-colors cursor-pointer">
                {t('getQuote')}
              </button>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2">
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
