import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductModelShowcase from '../components/ProductModelShowcase';
import MapComponent from '../components/LazyMap';
import { sampleReviews } from '../data/sampleData';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck, Award, ArrowRight, ChevronRight, MapPin, Sprout, Star, Microscope, ThermometerSun, PanelTop, BadgeCheck, MessageSquareQuote
} from 'lucide-react';
import IconTile from '../components/IconTile';
import PageHero from '../components/PageHero';
import { CATALOG } from '../data/productCatalog';

// Home hero: one slide per service, in this order. Each has its own background (composed 2:1 with the
// subject on the right, behind which the text stays readable) and its own title, subtitle and button;
// the dryer slide keeps the Home page's headline and facts, the others show their three key points.
// Names, icons, links and points come from the product catalogue.
const HERO_SERVICES = [
  {
    id: 'solar-dryer', image: '/images/home-hero/slide-2.webp', position: '78% 50%',
    titleKeys: ['heroTitle1', 'heroTitle2'], subtitleKey: 'heroSubtitle', ctaKey: 'exploreModels',
    stats: [['1,200+', 'dryersInstalled'], ['500+ MT', 'foodSaved'], ['8', 'prod_glanceModels']],
  },
  {
    // parabolic trough collector, IIT Bhubaneswar, Odisha
    id: 'solar-thermal', image: '/images/home-hero/service-solar-thermal.webp', position: '82% 50%',
    titleKeys: ['hero_svcThermalTitle1', 'hero_svcThermalTitle2'], subtitleKey: 'hero_svcThermalSub', ctaKey: 'hero_svcThermalCta',
  },
  {
    // wood log splitter for tribal communities in Sikkim
    id: 'research-and-development', image: '/images/home-hero/service-research.webp', position: '72% 50%',
    titleKeys: ['hero_svcRndTitle1', 'hero_svcRndTitle2'], subtitleKey: 'hero_svcRndSub', ctaKey: 'hero_svcRndCta',
  },
  {
    id: 'solar-water-heater', image: '/images/home-hero/service-water-heater.webp', position: '82% 50%',
    titleKeys: ['hero_svcSwhTitle1', 'hero_svcSwhTitle2'], subtitleKey: 'hero_svcSwhSub', ctaKey: 'hero_svcSwhCta',
  },
];

const crops = [
  { titleKey: 'cropSpices', descKey: 'homeSpicesDesc', image: '/images/gallery/photo-23.webp', alt: 'Red chillies drying on trays inside a ZeniTEK tunnel dryer' },
  { titleKey: 'homeHerbsTitle', descKey: 'homeHerbsDesc', image: '/images/gallery/photo-35.webp', alt: 'Butterfly-pea flowers on trays of a ZeniTEK cabinet dryer' },
  { titleKey: 'cropFish', descKey: 'homeFishDesc', image: '/images/gallery/photo-27.webp', alt: 'Dried shrimp on trays of a ZeniTEK cabinet dryer' },
];

const pillars = [
  { key: 'homePillarThermal', Icon: ThermometerSun },
  { key: 'homePillarAgri', Icon: Sprout },
  { key: 'homePillarPV', Icon: PanelTop },
  { key: 'homePillarRnd', Icon: Microscope },
];

const clientPartners = [
  { name: 'IIT Bhubaneswar', logo: '/images/clients/iit-bhubaneswar.webp' },
  { name: 'Anna University', logo: '/images/clients/anna-university.webp' },
  { name: 'SRM University', logo: '/images/clients/srm-ist.webp' },
  { name: 'Mitsui Chemicals', logo: '/images/clients/mitsui-chemicals.webp' },
  { name: 'Indo-MIM', logo: '/images/clients/indo-mim.webp' },
  { name: 'SELCO Foundation', logo: '/images/clients/selco-foundation.webp' },
  { name: 'TNJFU Fisheries Univ', logo: '/images/clients/tnjfu-fisheries.webp' },
  { name: 'Gandhigram Rural Inst.', logo: '/images/clients/gandhigram-rural-institute.webp' },
];

const inputClass = 'w-full bg-[#F0F4FD] border border-[#123B92]/30 text-black rounded-xl px-4 py-3 text-base placeholder-black/50 font-medium focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2]';
const labelClass = 'block text-xs font-bold text-[#123B92] mb-1';

export default function HomePage({ onOpenQuoteModal, onOpenDetailModal }) {
  const { t, tf } = useLanguage();

  const [quickForm, setQuickForm] = useState({
    name: '',
    phone: '',
    district: '',
    capacityNeeded: 'Commercial Polyhouse Tunnel Dryer (100-500 kg)',
    cropType: 'Copra/Coconut',
    message: ''
  });
  const handleQuickSubmit = (e) => {
    e.preventDefault();
    onOpenQuoteModal(quickForm);
  };

  return (
    <div className="bg-slate-50 text-slate-900 w-full max-w-full overflow-x-hidden">

      {/* SECTION 1: HERO - a slide for each service (no breadcrumb on Home) */}
      <PageHero
        breadcrumb={false}
        focus={1}
        slidesLabel={t('hero_servicesLabel')}
        slides={HERO_SERVICES.map((svc) => {
          const node = CATALOG.find(n => n.id === svc.id);
          return {
            image: svc.image,
            position: svc.position,
            label: t(node.titleKey),
            eyebrow: t(node.titleKey),
            icon: node.icon,
            title: <>{t(svc.titleKeys[0])} <span className="text-[#002DC2]">{t(svc.titleKeys[1])}</span></>,
            subtitle: t(svc.subtitleKey),
            actions: [
              { label: t('getQuote'), onClick: () => onOpenQuoteModal(), icon: MessageSquareQuote },
              { label: t(svc.ctaKey), to: node.path, icon: ChevronRight },
            ],
            stats: svc.stats?.map(([value, labelKey]) => ({ value, label: t(labelKey) })),
            points: svc.stats ? undefined : node.points.map(key => t(key)),
          };
        })}
      />


      {/* SECTION 2: TRUST STRIP */}
      <section className="w-full section-even py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { Icon: BadgeCheck, key: 'mnreBadge' },
              { Icon: Award, key: 'isoBadge' },
              { Icon: ShieldCheck, key: 'trustBadge3' },
            ].map(({ Icon, key }) => (
              <div key={key} className="flex items-center space-x-3 px-5 py-4 bg-white rounded-2xl border border-slate-200/90">
                <IconTile icon={Icon} size="md" />
                <span className="text-sm font-bold text-[#123B92] leading-snug">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 3: DRYER MODEL SHOWCASE (every model, one at a time) */}
      <section className="w-full section-even py-10 sm:py-14 px-0 mx-0 overflow-x-hidden">
        <ProductModelShowcase
          onOpenQuoteModal={onOpenQuoteModal}
          onOpenDetailModal={onOpenDetailModal}
        />
      </section>


      {/* SECTION 5: INSTALLATION MAP */}
      <section className="w-full section-odd py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('mapTitle1')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">{t('homeMapDesc')}</p>
          </div>

          <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />
        </div>
      </section>


      {/* SECTION 6: WHAT CAN YOU DRY */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('whatCanYouDry')}</h2>
            <Link to="/applications" className="text-sm font-bold text-[#002DC2] hover:underline inline-flex items-center justify-center">
              {t('viewAllCrops')} <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div key={crop.titleKey} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={crop.image}
                    alt={crop.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="text-xl font-bold text-[#123B92]">{t(crop.titleKey)}</h3>
                  <p className="text-sm text-slate-600">{t(crop.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 7: ABOUT ZENITEK + PARTNERS */}
      <section className="w-full section-odd py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('homeAboutTitle1')} <span className="text-[#002DC2]">{t('homeAboutTitle2')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center !mt-0">
            <div className="space-y-6">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">{t('homeAboutDesc')}</p>

              <div className="flex flex-wrap gap-2.5">
                {pillars.map(({ key, Icon }) => (
                  <span key={key} className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-[#123B92]">
                    <Icon className="w-5 h-5 text-[#002DC2]" />
                    {t(key)}
                  </span>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-[#002DC2] hover:bg-[#123B92] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                <span>{t('homeAboutCta')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/gallery/photo-02.webp"
                alt="Farmers spreading chillies on racks inside a ZeniTEK tunnel dryer"
                loading="lazy"
                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-md"
              />
              <img
                src="/images/gallery/photo-19.webp"
                alt="ZeniTEK solar tunnel dryer among palm trees"
                loading="lazy"
                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-md mt-8"
              />
            </div>
          </div>

          <div className="pt-10 border-t border-slate-200/80 space-y-6">
            <h3 className="text-2xl text-center font-black text-[#123B92] tracking-tight">
              {t('homePartnersTitle')}
            </h3>

            <div className="client-marquee-container py-2">
              <div className="client-marquee-track gap-4 sm:gap-6 pr-4 sm:pr-6">
                {[...clientPartners, ...clientPartners].map((client, idx) => (
                  <div
                    key={`${client.name}-${idx}`}
                    className="flex items-center space-x-3 px-4 py-3 bg-white rounded-2xl border border-slate-200/90 shrink-0 select-none"
                  >
                    <img src={client.logo} alt={client.name} className="w-12 h-12 object-contain shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-[#123B92] whitespace-nowrap">{client.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 8: FARMER STORIES */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B92]">{t('trustedBy')}</h2>
            <p className="text-base sm:text-lg text-slate-600">{t('homeStoriesDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleReviews.map(rev => (
              <div key={rev._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#23AC39]" role="img" aria-label={`${rev.rating || 5}/5`}>
                    {Array.from({ length: rev.rating || 5 }, (_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic">"{tf(`common_review_${rev._id}_comment`, rev.comment)}"</p>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <h3 className="text-lg font-extrabold text-[#123B92]">{rev.name}</h3>
                  <div className="text-xs font-semibold text-[#1A822B]">{tf(`common_review_${rev._id}_role`, rev.role)}</div>
                  <div className="text-xs text-slate-500 flex items-center mt-0.5">
                    <MapPin className="w-4 h-4 mr-0.5" /> {rev.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 9: QUICK ENQUIRY FORM */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#123B92] shadow-xl text-black">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">{t('quickFormTitle')}</h2>
              <p className="text-base sm:text-lg text-black/70">{t('quickFormDesc')}</p>
            </div>

            <form onSubmit={handleQuickSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="qf-name" className={labelClass}>{t('yourName')} *</label>
                  <input
                    id="qf-name"
                    maxLength={80}
                    autoComplete="name"
                    type="text"
                    required
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="qf-phone" className={labelClass}>{t('whatsappNum')} *</label>
                  <input
                    id="qf-phone"
                    maxLength={20}
                    inputMode="tel"
                    autoComplete="tel"
                    pattern="(\+?91|0)?[\s\-]*([0-9][\s\-]*){10}"
                    title={t('common_form_phoneInvalid')}
                    type="tel"
                    required
                    value={quickForm.phone}
                    onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="qf-district" className={labelClass}>{t('districtCity')} *</label>
                  <input
                    id="qf-district"
                    maxLength={60}
                    autoComplete="address-level2"
                    type="text"
                    required
                    placeholder={t('homeDistrictPh')}
                    value={quickForm.district}
                    onChange={(e) => setQuickForm({ ...quickForm, district: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="qf-capacity" className={labelClass}>{t('dryerModel')} *</label>
                  <select
                    id="qf-capacity"
                    value={quickForm.capacityNeeded}
                    onChange={(e) => setQuickForm({ ...quickForm, capacityNeeded: e.target.value })}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="Portable DIY Solar Dryer (10-50 kg)">{t('modelPortable')} (10-50 kg)</option>
                    <option value="Commercial Polyhouse Tunnel Dryer (100-500 kg)">{t('modelPolyhouse')} (100-500 kg)</option>
                    <option value="Multi-Tunnel Industrial Hybrid Dryer (1 Ton+)">{t('modelIndustrial')} (1 Ton+)</option>
                    <option value="Custom Dryer Sizing Consult">{t('common_home_customSizing')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="qf-crop" className={labelClass}>{t('targetCrop')} *</label>
                  <select
                    id="qf-crop"
                    value={quickForm.cropType}
                    onChange={(e) => setQuickForm({ ...quickForm, cropType: e.target.value })}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="Copra/Coconut">{t('cropCopra')}</option>
                    <option value="Moringa/Herbs">{t('cropMoringa')}</option>
                    <option value="Spices/Chillies">{t('cropSpices')}</option>
                    <option value="Fruits/Veggies">{t('cropFruits')}</option>
                    <option value="Fish/Seafood">{t('cropFish')}</option>
                    <option value="Other">{t('cropOther')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="qf-message" className={labelClass}>{t('descriptionReqs')}</label>
                  <input
                    id="qf-message"
                    maxLength={500}
                    type="text"
                    placeholder={t('homeMessagePh')}
                    value={quickForm.message}
                    onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1A822B] hover:bg-[#166A26] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>{t('getQuote')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
