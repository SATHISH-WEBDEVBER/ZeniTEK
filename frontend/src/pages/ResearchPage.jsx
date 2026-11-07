import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, MapPin, MessageCircle, Phone, GraduationCap, FlaskConical, Rocket, Gauge,
  ScanSearch, Sun, Microscope, Sprout, Warehouse, Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import IconTile from '../components/IconTile';
import BoldText from '../components/BoldText';

const WHATSAPP = `https://wa.me/918098613422?text=${encodeURIComponent('Hello ZeniTEK team, I would like to discuss a research & development collaboration.')}`;
const HUB_PHOTO = '/projects/project-24.jpg';

// What the R&D team builds: titles from the About page R&D card, descriptions from src/i18n/products.js
const WORK = [
  { Icon: GraduationCap, titleKey: 'about_dRndSpec1', bodyKey: 'prod_rdW1d' },
  { Icon: FlaskConical, titleKey: 'about_dRndSpec2', bodyKey: 'prod_rdW2d' },
  { Icon: Rocket, titleKey: 'about_dRndSpec3', bodyKey: 'prod_rdW3d' },
  { Icon: Gauge, titleKey: 'about_dRndSpec4', bodyKey: 'prod_rdW4d' },
];

const PV_RIGS = [
  { Icon: ScanSearch, key: 'about_dPvSpec2' },
  { Icon: Sun, key: 'about_dPvSpec3' },
  { Icon: Microscope, key: 'about_dPvSpec4' },
];

const PROTOTYPES = [
  { Icon: Sprout, titleKey: 'about_p5Title', bodyKey: 'about_p5Desc', who: 'SELCO Foundation, Bangalore' },
  { Icon: Warehouse, titleKey: 'about_p4Title', bodyKey: 'about_p4Desc', who: 'SELCO Foundation · Chhattisgarh' },
  { Icon: Award, titleKey: 'prod_rdPtcTitle', bodyKey: 'prod_rdPtcDesc', who: 'NISE (India) · Pro-Target (Germany)' },
];

// Academic partners (names and logos as on the About page; notes are about_a<N>Branch / Tag)
const PARTNERS = [
  { name: 'IIT Bhubaneswar', logo: '/client-logos/academic_iit_bhubaneswar.png' },
  { name: 'Anna University Chennai', logo: '/client-logos/academic_anna_univ.jpeg' },
  { name: 'SRM University', logo: '/client-logos/industry_srm.png' },
  { name: 'Sree Sankara College', logo: '/client-logos/academic_sree_sankara.jpeg' },
  { name: 'Gandhigram University', logo: '/client-logos/academic_gandhigram.jpeg' },
  { name: 'College of Fisheries', logo: '/client-logos/academic_fisheries.png' },
];

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
      <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{title}</h2>
      {subtitle && <p className="text-base sm:text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}

// Product page: /research-and-development
export default function ResearchPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const collaborate = () => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Research & Development Collaboration' });

  return (
    <div className="text-black min-h-screen bg-white">
      <PageHero
        images={HUB_PHOTO}
        title={<>{t('prod_rdHeroTitle1')} <br /><span className="text-[#002DC2]">{t('prod_rdHeroTitle2')}</span></>}
        subtitle={t('prod_rdHeroSub')}
        actions={
          <>
            <button type="button" onClick={collaborate} className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl shadow-lg shadow-[#23AC39]/25 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer">
              {t('prod_rdCollaborate')} <ArrowRight className="w-5 h-5" />
            </button>
            <Link to="/installations/loc-1" className="px-5 py-3 bg-white border border-slate-300 hover:border-[#002DC2] text-[#123B92] font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-[#002DC2]" /> {t('prod_rdVisitHub')}
            </Link>
          </>
        }
      >
        <div className="grid grid-cols-3 gap-3 max-w-xl pt-2">
          {[['6+', 'prod_rdStat1'], ['150 kg', 'prod_rdStat2'], ['3', 'prod_rdStat3']].map(([v, k]) => (
            <div key={k} className="bg-white/90 border border-slate-200 rounded-xl p-3 shadow-sm">
              <div className="text-lg sm:text-xl font-black text-[#123B92] whitespace-nowrap">{v}</div>
              <div className="text-xs text-slate-600 font-semibold leading-snug mt-0.5 [overflow-wrap:anywhere]">{t(k)}</div>
            </div>
          ))}
        </div>
      </PageHero>

      {/* R&D hub */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <figure className="space-y-2">
            <img src={HUB_PHOTO} alt={t('prod_rdHubAlt')} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-2xl shadow-md" />
            <figcaption className="text-xs text-slate-500">{t('prod_rdHubAlt')}</figcaption>
          </figure>
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('prod_rdHubTitle')}</h2>
            <div>
              <div className="text-base font-bold text-slate-900">{t('prod_rdHubName')}</div>
              <div className="flex items-start gap-1.5 text-sm text-slate-500 mt-1">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> NH-544, Valayakaranur, Komarapalayam, Namakkal Dt., Tamil Nadu - 638 183
              </div>
            </div>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed"><BoldText text={t('prod_rdHubBody')} /></p>
            <div className="grid grid-cols-3 gap-3">
              {[[t('prod_rdRes1v'), 'prod_rdRes1'], ['75% → 8%', 'prod_rdRes2'], ['150 kg', 'prod_rdRes3']].map(([v, k]) => (
                <div key={k} className="rounded-xl bg-[#F0F4FD] p-3">
                  <div className="text-lg sm:text-xl font-black text-[#23AC39] whitespace-nowrap">{v}</div>
                  <div className="text-xs text-slate-600 font-semibold leading-snug mt-0.5 [overflow-wrap:anywhere]">{t(k)}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
              <Link to="/installations/loc-1" className="inline-flex items-center gap-1.5 font-bold text-[#002DC2] hover:underline">
                {t('prod_rdSiteDetails')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/projects/24" className="inline-flex items-center gap-1.5 font-bold text-[#002DC2] hover:underline">
                {t('prod_rdProjectPage')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What we develop */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('prod_rdWorkTitle')} subtitle={t('prod_rdWorkSub')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORK.map(({ Icon, titleKey, bodyKey }) => (
              <div key={titleKey} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                <IconTile icon={Icon} />
                <h3 className="text-lg font-bold text-[#123B92] leading-snug">{t(titleKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PV testing rigs */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('prod_rdPvTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed"><BoldText text={t('prod_rdPvBody')} /></p>
            <div className="flex items-center gap-3 pt-1">
              <img src="/client-logos/industry_mitsui.jpeg" alt="Mitsui Chemicals" className="w-14 h-14 object-contain rounded-xl border border-slate-200 bg-white p-1" />
              <div className="text-sm">
                <div className="font-bold text-slate-900">Mitsui Chemicals Group</div>
                <div className="text-slate-500">{t('about_i1Detail')}</div>
              </div>
            </div>
          </div>
          <ul className="space-y-3">
            {PV_RIGS.map(({ Icon, key }) => (
              <li key={key} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <IconTile icon={Icon} size="md" />
                <span className="text-base font-bold text-[#123B92]">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prototype to field */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('prod_rdProtoTitle')} subtitle={t('prod_rdProtoSub')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROTOTYPES.map(({ Icon, titleKey, bodyKey, who }) => (
              <article key={titleKey} className="flex flex-col p-6 rounded-2xl border border-slate-200 bg-white shadow-sm gap-3">
                <IconTile icon={Icon} tone="green" />
                <h3 className="text-lg font-bold text-[#123B92] leading-snug">{t(titleKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">{t(bodyKey)}</p>
                <div className="pt-3 border-t border-slate-100 text-sm font-semibold text-slate-700">{who}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('prod_rdPartnersTitle')} subtitle={t('prod_rdPartnersSub')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARTNERS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={p.logo} alt={p.name} loading="lazy" className="w-14 h-14 object-contain shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-[#123B92]">{p.name}</div>
                  <div className="text-sm text-slate-600 leading-snug">{t(`about_a${i + 1}Branch`)}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1A822B] mt-1">{t(`about_a${i + 1}Tag`)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4 p-4 rounded-2xl bg-[#F0F4FD] border border-[#002DC2]/15">
            <img src="/client-logos/industry_nise_protarget.svg" alt="Pro-Target & NISE" loading="lazy" className="w-14 h-14 object-contain shrink-0" />
            <div>
              <div className="font-bold text-[#123B92]">Pro-Target & NISE</div>
              <div className="text-sm text-slate-600">{t('about_i4Detail')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="w-full pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#001f7a] to-slate-900 text-white p-6 sm:p-12 text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">{t('prod_rdCtaTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">{t('prod_rdCtaBody')}</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-2">
              <button type="button" onClick={collaborate} className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl transition-colors cursor-pointer">
                {t('prod_rdDiscuss')}
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
