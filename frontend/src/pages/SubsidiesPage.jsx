import React, { useState } from 'react';
import {
  ArrowRight, CheckCircle2, ChevronDown, Check, MessageCircle, Phone,
  User, UserCheck, Users, Briefcase, FileText, ClipboardList, Landmark, Wrench, BadgeCheck,
  ScrollText, CreditCard, FileCheck2, Camera, Calculator
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import IconTile from '../components/IconTile';

const PHOTO = (n) => `/images/gallery/photo-${String(n).padStart(2, '0')}.webp`;
const WHATSAPP = `https://wa.me/918098613422?text=${encodeURIComponent('Hello ZeniTEK team, I would like help with the government subsidy for a solar dryer.')}`;

// Estimator choices. `value` stays English (it goes into the enquiry); labels are translated.
// The percentage depends on who is applying; `client` pre-selects the quote form's user category.
const BENEFICIARIES = [
  { value: 'Small / Marginal Farmer', key: 'sub_ben1', percent: 50, client: 'Individual Farmer', Icon: User },
  { value: 'SC / ST / Women Farmer', key: 'sub_ben2', percent: 60, client: 'Individual Farmer', Icon: UserCheck },
  { value: 'FPO / SHG Group', key: 'sub_ben3', percent: 60, client: 'FPO / Cooperative Group', Icon: Users },
  { value: 'General Commercial Exporter', key: 'sub_ben4', percent: 40, client: 'Food Processor & Exporter', Icon: Briefcase },
];

// Each dryer is shown with its own catalogue photo (same photos as its model page)
const DRYERS = [
  { value: 'SUNDRY 50', name: 'SUNDRY 50', typeKey: 'sub_m1', image: PHOTO(36) },
  { value: 'SOLDRY 1210', name: 'SOLDRY 1210', typeKey: 'sub_m2', image: PHOTO(4) },
  { value: 'SOLDRY 1709', name: 'SOLDRY 1709', typeKey: 'sub_m3', image: PHOTO(21) },
  { value: 'SOLDRY Modular (1 Ton+)', name: 'SOLDRY Modular', typeKey: 'sub_m4', image: PHOTO(45) },
];

const STATES = [
  ['Tamil Nadu', 'sections_optTN', 'TN'],
  ['Karnataka', 'sections_optKA', 'KA'],
  ['Kerala', 'sections_optKL', 'KL'],
  ['Maharashtra', 'sections_optMH', 'MH'],
  ['Andhra Pradesh', 'sections_state_APTS', 'AP'],
  ['All India', 'sections_optOther', 'ALL'],
];

// Scheme cards: text from sections.js (sections_scheme<N>_*), with a photo of the kind of dryer each scheme funds
const SCHEMES = [
  { n: 1, image: PHOTO(23), alt: 'Red chillies drying on trays inside a ZeniTEK tunnel dryer' },
  { n: 2, image: PHOTO(34), alt: 'ZeniTEK solar tunnel dryer with its solar panel in a paddy field' },
  { n: 3, image: PHOTO(43), alt: 'Wide ZeniTEK solar tunnel dryer on a raised concrete base' },
  { n: 4, image: PHOTO(35), alt: 'ZeniTEK box solar dryer with loaded stainless steel trays' },
];

const STEP_ICONS = [FileText, ClipboardList, Landmark, Wrench, BadgeCheck];

// Documents most schemes ask for (labels reuse the scheme requirement text)
const DOCUMENTS = [
  { key: 'sections_scheme1_c1', Icon: ScrollText, tag: 'sub_tagYou' },
  { key: 'sections_scheme1_c2', Icon: CreditCard, tag: 'sub_tagYou' },
  { key: 'sections_scheme1_c3', Icon: FileCheck2, tag: 'sub_tagUs' },
  { key: 'sections_scheme2_c3', Icon: Camera, tag: 'sub_tagUs' },
  { key: 'sections_scheme4_c3', Icon: BadgeCheck, tag: 'sub_tagHelp' },
];
const TAG_STYLE = {
  sub_tagYou: 'bg-slate-100 text-slate-700',
  sub_tagUs: 'bg-[#EAF7EC] text-[#1A822B]',
  sub_tagHelp: 'bg-[#F0F4FD] text-[#002DC2]',
};

// Native <select> can't wrap its value, so long option labels got truncated on
// mobile. Show the selected label in a wrapping box and overlay a transparent select.
function WrapSelect({ value, onChange, options, ariaLabel }) {
  const current = options.find(([v]) => v === value);
  return (
    <div className="relative w-full bg-white border border-slate-300 rounded-xl focus-within:border-[#002DC2] focus-within:ring-2 focus-within:ring-[#002DC2]/20">
      <div aria-hidden="true" className="pl-4 pr-10 py-3 text-sm font-bold text-[#123B92] leading-snug">
        {current ? current[1] : value}
      </div>
      <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#123B92] pointer-events-none" />
      <select value={value} onChange={onChange} aria-label={ariaLabel} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
        {options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
      </select>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
      <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{title}</h2>
      {subtitle && <p className="text-base sm:text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}

function Question({ n, label, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-[#002DC2] text-white text-sm font-black flex items-center justify-center shrink-0">{n}</span>
        <h3 className="text-lg font-bold text-[#123B92]">{label}</h3>
      </div>
      {children}
    </div>
  );
}

const scrollTo = (id) => (e) => {
  const el = document.getElementById(id);
  if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
};

export default function SubsidiesPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const [beneficiary, setBeneficiary] = useState(BENEFICIARIES[0]);
  const [dryer, setDryer] = useState(DRYERS[1]);
  const [state, setState] = useState('Tamil Nadu');

  const stateRow = STATES.find(([v]) => v === state);
  const stateName = t(`sections_state_${stateRow ? stateRow[2] : 'ALL'}`);

  const applyForSubsidy = () => onOpenQuoteModal({
    capacityNeeded: dryer.value,
    clientType: beneficiary.client,
    ...(state !== 'All India' ? { state } : {}),
    message: `Requesting subsidy DPR and eligibility verification for ${dryer.value} in ${state} (${beneficiary.value}).`
  });

  return (
    <div className="text-slate-900 min-h-screen bg-white">

      {/* 1. HERO */}
      <PageHero
        images={PHOTO(11)}
        title={<>{t('sections_subHeroTitle1')} <span className="text-[#002DC2]">{t('sections_subHeroTitle2')}</span></>}
        subtitle={t('hero_subsidiesSub')}
        actions={[
          { label: t('sections_checkEligibility'), href: '#estimator', onClick: scrollTo('estimator'), icon: Calculator },
          { label: t('sections_viewSchemes'), href: '#subsidy-schemes', onClick: scrollTo('subsidy-schemes'), icon: ScrollText },
        ]}
        stats={[
          { value: '40–60%', label: t('subsidyHelp') },
          { value: '4', label: t('sub_statSchemes') },
          { value: '5', label: t('sub_statSteps') },
        ]}
      />

      {/* 2. ESTIMATOR */}
      <section id="estimator" className="w-full py-12 sm:py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('sub_estTitle')} subtitle={t('sub_estSub')} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-8">
              <Question n={1} label={t('sub_q1')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BENEFICIARIES.map(b => {
                    const active = b.value === beneficiary.value;
                    return (
                      <button
                        key={b.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setBeneficiary(b)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-colors cursor-pointer ${active ? 'border-[#002DC2] bg-white shadow-md' : 'border-slate-200 bg-white hover:border-[#002DC2]/40'}`}
                      >
                        <IconTile icon={b.Icon} size="md" tone={active ? 'solid' : 'blue'} />
                        <span className="flex-1 font-bold text-[#123B92] leading-snug">{t(b.key)}</span>
                        <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${active ? 'bg-[#23AC39] text-white' : 'bg-[#EAF7EC] text-[#1A822B]'}`}>{b.percent}%</span>
                      </button>
                    );
                  })}
                </div>
              </Question>

              <Question n={2} label={t('sub_q2')}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DRYERS.map(d => {
                    const active = d.value === dryer.value;
                    return (
                      <button
                        key={d.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setDryer(d)}
                        className={`relative rounded-2xl border-2 overflow-hidden text-left bg-white transition-colors cursor-pointer ${active ? 'border-[#002DC2] shadow-md' : 'border-slate-200 hover:border-[#002DC2]/40'}`}
                      >
                        <img src={d.image} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover" />
                        {active && (
                          <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#002DC2] text-white flex items-center justify-center shadow">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                        <span className="block p-2.5">
                          <span className="block text-sm font-black text-[#123B92]">{d.name}</span>
                          <span className="block text-xs text-slate-500 font-semibold leading-snug">{t(d.typeKey)}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Question>

              <Question n={3} label={t('sub_q3')}>
                <WrapSelect
                  ariaLabel={t('sub_q3')}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  options={STATES.map(([v, key]) => [v, t(key)])}
                />
              </Question>
            </div>

            {/* Result */}
            <aside className="lg:col-span-2 lg:sticky lg:top-24 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden" aria-live="polite">
              <div className="relative">
                <img src={dryer.image} alt={dryer.name} className="w-full aspect-[16/10] object-cover" />
                <span className="absolute left-4 bottom-4 px-3 py-1 rounded-lg bg-white/95 text-sm font-black text-[#123B92] shadow">{dryer.name}</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('sections_estCoverage')}</div>
                  <div className="text-3xl sm:text-4xl font-black text-[#23AC39] leading-tight mt-1">{t('sections_estPercent', { percent: beneficiary.percent })}</div>
                  <div className="text-sm text-slate-600 mt-1">{t(beneficiary.key)} · {t('sections_estValid', { state: stateName })}</div>
                </div>
                <button type="button" onClick={applyForSubsidy} className="w-full py-3.5 bg-[#002DC2] hover:bg-[#123B92] text-white font-extrabold rounded-xl transition-colors inline-flex items-center justify-center gap-2 cursor-pointer">
                  {t('sections_applyZenitek')} <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-slate-500 leading-relaxed">{t('sub_note')}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 3. SCHEMES */}
      <section id="subsidy-schemes" className="w-full py-12 sm:py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('sections_schemesTitle')} subtitle={t('sections_schemesSub')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SCHEMES.map(({ n, image, alt }) => (
              <article key={n} className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="relative">
                  <img src={image} alt={alt} loading="lazy" className="w-full aspect-[16/10] sm:aspect-[16/7] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <span className="absolute left-4 bottom-4 right-4 sm:right-auto px-3 py-1.5 rounded-lg bg-white text-sm font-black text-[#1A822B] shadow">{t(`sections_scheme${n}_coverage`)}</span>
                </div>
                <div className="flex-1 flex flex-col gap-3 p-6">
                  <h3 className="text-xl font-black text-[#123B92]">{t(`sections_scheme${n}_title`)}</h3>
                  <div className="text-sm font-semibold text-slate-500">{t('sections_schemeTarget', { target: t(`sections_scheme${n}_target`) })}</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{t(`sections_scheme${n}_desc`)}</p>
                  <ul className="pt-3 mt-auto border-t border-slate-100 space-y-2">
                    {[1, 2, 3].map(c => (
                      <li key={c} className="flex items-start gap-2 text-sm text-slate-800">
                        <CheckCircle2 className="w-5 h-5 text-[#23AC39] shrink-0" />
                        <span>{t(`sections_scheme${n}_c${c}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROCESS */}
      <section className="w-full py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <figure className="space-y-2 order-2 lg:order-1">
            <img src={PHOTO(41)} alt="A ZeniTEK tunnel dryer being installed on its concrete foundation" loading="lazy" className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover rounded-3xl shadow-md" />
          </figure>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('sections_stepsTitle')}</h2>
              <p className="text-base sm:text-lg text-slate-600">{t('sections_stepsSub')}</p>
            </div>
            <ol className="relative space-y-5">
              <span className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#002DC2]/20" aria-hidden="true" />
              {STEP_ICONS.map((Icon, i) => (
                <li key={i} className="relative flex gap-4">
                  <span className="relative z-10 w-12 h-12 rounded-full bg-[#002DC2] text-white flex items-center justify-center shrink-0 shadow ring-4 ring-slate-50">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div className="pt-1">
                    <div className="text-xs font-black text-[#23AC39] uppercase tracking-wider">0{i + 1}</div>
                    <h3 className="text-lg font-bold text-[#123B92] leading-snug">{t(`sections_step${i + 1}_title`)}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">{t(`sections_step${i + 1}_desc`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 5. DOCUMENTS */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t('sub_docsTitle')} subtitle={t('sub_docsSub')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {DOCUMENTS.map(({ key, Icon, tag }) => (
              <div key={key} className="flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <IconTile icon={Icon} size="md" />
                <div className="flex-1 text-sm font-bold text-[#123B92] leading-snug">{t(key)}</div>
                <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-md ${TAG_STYLE[tag]}`}>{t(tag)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="w-full pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-xl">
            <img src={PHOTO(2)} alt="Farmers spreading chillies on racks inside a ZeniTEK tunnel dryer" loading="lazy" className="w-full h-60 md:h-full object-cover" />
            <div className="bg-gradient-to-br from-[#001b69] to-[#002DC2] text-white p-6 sm:p-10 flex flex-col justify-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{t('sections_ctaQ')}</h2>
              <p className="text-base text-slate-200 leading-relaxed">{t('sections_ctaQSub')}</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal({ capacityNeeded: 'Subsidy Consultation', message: 'I want a free telephone consultation regarding government subsidy for solar dryer.' })}
                  className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl transition-colors cursor-pointer"
                >
                  {t('sections_freeConsult')}
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
