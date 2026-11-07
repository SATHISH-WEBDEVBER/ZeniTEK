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

const PHOTO = (n) => `/real-photos/zenitek_photo_${String(n).padStart(2, '0')}.webp`;
const HUB_PHOTO = '/projects/project-24.webp';
const WHATSAPP = `https://wa.me/918098613422?text=${encodeURIComponent('Hello ZeniTEK team, I would like to discuss a research & development collaboration.')}`;

// What the R&D team builds. Titles from the About page R&D card, descriptions from src/i18n/products.js.
// Each photo is a real ZeniTEK photo of that kind of work (gallery labels in brackets).
const WORK = [
  { Icon: GraduationCap, titleKey: 'about_dRndSpec1', bodyKey: 'prod_rdW1d', image: PHOTO(16), alt: 'SUNDRY 12 demonstration unit with solar panel and control station' }, // "Demonstration Room"
  { Icon: FlaskConical, titleKey: 'about_dRndSpec2', bodyKey: 'prod_rdW2d', image: PHOTO(37), alt: 'Compact SUNDRY solar dryer unit under testing outdoors' }, // "Unit Under Testing"
  { Icon: Rocket, titleKey: 'about_dRndSpec3', bodyKey: 'prod_rdW3d', image: PHOTO(45), alt: 'Commercial ZeniTEK SOLDRY tunnel dryer installed in an open field' },
  { Icon: Gauge, titleKey: 'about_dRndSpec4', bodyKey: 'prod_rdW4d', image: PHOTO(1), alt: 'SUNDRY 50 dryer with its solar panel and temperature control panel', position: 'top' },
];

// Engineering photo strip: each opens that photo's page in the gallery
const LAB_PHOTOS = [
  { image: PHOTO(5), captionKey: 'prod_rdPic1', to: '/gallery/photo-05' },
  { image: PHOTO(7), captionKey: 'prod_rdPic2', to: '/gallery/photo-07' },
  { image: PHOTO(14), captionKey: 'prod_rdPic3', to: '/gallery/photo-15' },
  { image: PHOTO(15), captionKey: 'prod_rdPic4', to: '/gallery/photo-16' },
  { image: PHOTO(10), captionKey: 'prod_rdPic5', to: '/gallery/photo-11' },
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
  { name: 'IIT Bhubaneswar', logo: '/client-logos/iit-bhubaneswar.webp' },
  { name: 'Anna University Chennai', logo: '/client-logos/anna-university.webp' },
  { name: 'SRM University', logo: '/client-logos/srm-ist.webp' },
  { name: 'Sree Sankara College', logo: '/client-logos/sree-sankara-college.webp' },
  { name: 'Gandhigram University', logo: '/client-logos/gandhigram-rural-institute.webp' },
  { name: 'College of Fisheries', logo: '/client-logos/tnjfu-fisheries.webp' },
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

      {/* 1. HERO */}
      <PageHero
        images={PHOTO(42)}
        title={<>{t('prod_rdHeroTitle1')} <span className="text-[#002DC2]">{t('prod_rdHeroTitle2')}</span></>}
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

      {/* 2. R&D HUB */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <figure className="relative">
            <img src={HUB_PHOTO} alt={t('prod_rdHubAlt')} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg" />
            <figcaption className="absolute left-4 right-4 bottom-4 px-4 py-2.5 rounded-xl bg-white/95 text-xs sm:text-sm font-semibold text-slate-700 shadow">
              {t('prod_rdHubAlt')}
            </figcaption>
          </figure>
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('prod_rdHubTitle')}</h2>
              <div className="text-base font-bold text-slate-900">{t('prod_rdHubName')}</div>
              <div className="flex items-start gap-1.5 text-sm text-slate-500">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> NH-544, Valayakaranur, Komarapalayam, Namakkal Dt., Tamil Nadu - 638 183
              </div>
            </div>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed"><BoldText text={t('prod_rdHubBody')} /></p>
            <div className="grid grid-cols-3 gap-3">
              {[[t('prod_rdRes1v'), 'prod_rdRes1'], ['75% → 8%', 'prod_rdRes2'], ['150 kg', 'prod_rdRes3']].map(([v, k]) => (
                <div key={k} className="rounded-2xl bg-[#F0F4FD] p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-black text-[#23AC39] whitespace-nowrap">{v}</div>
                  <div className="text-xs text-slate-600 font-semibold leading-snug mt-0.5 [overflow-wrap:anywhere]">{t(k)}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/installations/loc-1" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#002DC2]/25 font-bold text-[#002DC2] hover:bg-[#F0F4FD] transition-colors">
                {t('prod_rdSiteDetails')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/projects/24" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#002DC2]/25 font-bold text-[#002DC2] hover:bg-[#F0F4FD] transition-colors">
                {t('prod_rdProjectPage')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE DEVELOP (photo cards) */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('prod_rdWorkTitle')} subtitle={t('prod_rdWorkSub')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORK.map(({ Icon, titleKey, bodyKey, image, alt, position }) => (
              <article key={titleKey} className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="relative">
                  <img src={image} alt={alt} loading="lazy" className={`w-full aspect-[4/3] object-cover ${position === 'top' ? 'object-top' : ''}`} />
                  <IconTile icon={Icon} size="md" tone="solid" className="absolute left-4 -bottom-6 shadow-md" />
                </div>
                <div className="flex-1 p-5 pt-9 space-y-2">
                  <h3 className="text-lg font-bold text-[#123B92] leading-snug">{t(titleKey)}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{t(bodyKey)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INSIDE OUR ENGINEERING (photo strip) */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('prod_rdLabTitle')} subtitle={t('prod_rdLabSub')} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {LAB_PHOTOS.map(({ image, captionKey, to }, i) => (
              <Link
                key={to}
                to={to}
                className={`group relative block overflow-hidden rounded-2xl bg-slate-100 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img src={image} alt={t(captionKey)} loading="lazy" className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${i === 0 ? 'aspect-square lg:aspect-auto' : 'aspect-square'}`} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 pt-10">
                  <div className="text-xs sm:text-sm font-bold text-white leading-snug">{t(captionKey)}</div>
                  <div className="hidden sm:inline-flex text-xs font-semibold text-white/80 items-center gap-1 mt-0.5">
                    {t('prod_rdViewPhoto')} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PV TESTING RIGS */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('prod_rdPvTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed"><BoldText text={t('prod_rdPvBody')} /></p>
            <div className="inline-flex items-center gap-3 p-3 pr-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <img src="/client-logos/mitsui-chemicals.webp" alt="Mitsui Chemicals" className="w-14 h-14 object-contain" />
              <div className="text-sm">
                <div className="font-bold text-slate-900">Mitsui Chemicals Group</div>
                <div className="text-slate-500">{t('about_i1Detail')}</div>
              </div>
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {PV_RIGS.map(({ Icon, key }) => (
              <li key={key} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <IconTile icon={Icon} size="md" />
                <span className="text-base font-bold text-[#123B92]">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. PROTOTYPE TO FIELD */}
      <section className="w-full py-12 sm:py-16">
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

      {/* 7. PARTNERS (logos) */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('prod_rdPartnersTitle')} subtitle={t('prod_rdPartnersSub')} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PARTNERS.map((p, i) => (
              <div key={p.name} className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={p.logo} alt={p.name} loading="lazy" className="w-20 h-20 object-contain" />
                <div>
                  <div className="font-bold text-[#123B92] leading-snug">{p.name}</div>
                  <div className="text-xs text-slate-600 leading-snug mt-1">{t(`about_a${i + 1}Branch`)}</div>
                </div>
                <span className="mt-auto text-2xs sm:text-xs font-bold uppercase tracking-wider text-[#1A822B] bg-[#EAF7EC] px-2 py-0.5 rounded">{t(`about_a${i + 1}Tag`)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 p-4 rounded-2xl bg-white border border-[#002DC2]/15 max-w-xl mx-auto">
            <img src="/client-logos/nise.webp" alt="NISE — National Institute of Solar Energy" loading="lazy" className="w-16 h-16 object-contain shrink-0" />
            <div>
              <div className="font-bold text-[#123B92]">Pro-Target & NISE</div>
              <div className="text-sm text-slate-600">{t('about_i4Detail')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-xl">
            <div className="relative min-h-[16rem]">
              <img src={PHOTO(40)} alt="Inspecting trolley racks inside a ZeniTEK SOLDRY tunnel dryer" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-[center_30%]" />
            </div>
            <div className="bg-gradient-to-br from-[#001b69] to-[#002DC2] text-white p-6 sm:p-10 flex flex-col justify-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{t('prod_rdCtaTitle')}</h2>
              <p className="text-base text-slate-200 leading-relaxed">{t('prod_rdCtaBody')}</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
                <button type="button" onClick={collaborate} className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl transition-colors cursor-pointer">
                  {t('prod_rdDiscuss')}
                </button>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/25 font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" /> {t('prod_whatsapp')}
                </a>
                <a href="tel:+918903852623" className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/25 font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" /> {t('about_callDirectly')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
