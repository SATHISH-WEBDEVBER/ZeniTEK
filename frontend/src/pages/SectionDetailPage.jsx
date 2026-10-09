import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPublicSection } from '../utils/api';
import { defaultSectionsData } from '../data/defaultSectionsData';
import { useLanguage } from '../context/LanguageContext';
import sectionsText from '../i18n/sections';
import { brochures } from '../data/brochuresData';
import useScrollLock, { useEscapeKey } from '../hooks/useScrollLock';
import PageHero from '../components/PageHero';
import {
  Sun, Zap, ShieldCheck, ArrowRight, CheckCircle2, FileText,
  Download, HelpCircle, PhoneCall, Sparkles, Building, Layers,
  Calculator, Sprout, Cpu, ChevronRight, ChevronDown, Eye, X, AlertCircle, Loader
} from 'lucide-react';

// Hero background photo per slug (overrides the DB thumbnail, some of which are unsuitable as a backdrop)
const HERO_BACKGROUNDS = {
  'solar-thermal-system': '/real-photos/zenitek_photo_19.jpeg',
  'agri-solar-innovation': '/real-photos/zenitek_photo_34.jpeg',
  'photovoltaic-solutions': '/real-photos/zenitek_photo_38.jpeg',
  'government-subsidies': '/real-photos/zenitek_photo_02.jpeg',
  'crop-preservation-guide': '/real-photos/zenitek_photo_23.jpeg',
  'technical-spec-sheets': '/real-photos/zenitek_photo_10.jpeg',
};

// Per-slug copy for the generic section headers and the bottom CTA. The text lives in
// src/i18n/sections.js as sections_copy_<slug>_<field>; other slugs use sections_copyDefault_*.
const SECTION_COPY_SLUGS = [
  'solar-thermal-system', 'agri-solar-innovation', 'photovoltaic-solutions',
  'government-subsidies', 'crop-preservation-guide', 'technical-spec-sheets'
];
const COPY_FIELDS = ['highlightsEyebrow', 'highlightsTitle', 'overviewTitle', 'overviewSubtitle', 'ctaTitle', 'ctaBody'];

const getSectionCopy = (t, slug, title) => {
  if (SECTION_COPY_SLUGS.includes(slug)) {
    return Object.fromEntries(COPY_FIELDS.map((f) => [f, t(`sections_copy_${slug}_${f}`)]));
  }
  return {
    highlightsEyebrow: t('sections_copyDefault_highlightsEyebrow'),
    highlightsTitle: t('sections_copyDefault_highlightsTitle'),
    overviewTitle: t('sections_copyDefault_overviewTitle'),
    overviewSubtitle: title,
    ctaTitle: t('sections_copyDefault_ctaTitle', { title }),
    ctaBody: t('sections_copyDefault_ctaBody')
  };
};

// Display names for the calculator's state values (values stay English for the enquiry)
const STATE_KEYS = {
  'Tamil Nadu': 'TN', 'Karnataka': 'KA', 'Kerala': 'KL', 'Maharashtra': 'MH',
  'Andhra Pradesh': 'AP', 'Other States': 'OTHER'
};

// Render **bold** segments inside a line of text as React elements
const renderInline = (text, keyPrefix) =>
  text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => (
    /^\*\*[^*]+\*\*$/.test(part)
      ? <strong key={`${keyPrefix}-${i}`} className="font-bold text-[#123B92]">{part.slice(2, -2)}</strong>
      : <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>
  ));

// Minimal, safe markdown renderer: paragraphs, **bold**, "- " bullet lists, "1." numbered lists
function RichText({ text }) {
  const blocks = [];
  let current = null;

  const flush = () => {
    if (current) blocks.push(current);
    current = null;
  };

  String(text || '').replace(/\r\n?/g, '\n').split('\n').forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flush();
      return;
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (bullet) {
      if (!current || current.type !== 'ul') { flush(); current = { type: 'ul', items: [] }; }
      current.items.push(bullet[1]);
    } else if (numbered) {
      if (!current || current.type !== 'ol') { flush(); current = { type: 'ol', start: Number(numbered[1]), items: [] }; }
      current.items.push(numbered[2]);
    } else if (/^\*\*[^*]+\*\*:?$/.test(line)) {
      flush();
      blocks.push({ type: 'heading', text: line.replace(/^\*\*|\*\*:?$|:?\*\*$/g, '').replace(/:$/, '') });
    } else {
      if (!current || current.type !== 'p') { flush(); current = { type: 'p', lines: [] }; }
      current.lines.push(line);
    }
  });
  flush();

  return blocks.map((block, bIdx) => {
    if (block.type === 'heading') {
      return (
        <h4 key={bIdx} className="text-lg font-bold text-[#123B92] leading-snug pt-3">
          {block.text}
        </h4>
      );
    }
    if (block.type === 'ul') {
      return (
        <ul key={bIdx} className="space-y-2 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#23AC39] shrink-0" />
              <span>{renderInline(item, `${bIdx}-${i}`)}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === 'ol') {
      return (
        <ol key={bIdx} className="space-y-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-[#002DC2] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                {block.start + i}
              </span>
              <span>{renderInline(item, `${bIdx}-${i}`)}</span>
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p key={bIdx} className="leading-relaxed">
        {block.lines.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {renderInline(l, `${bIdx}-${i}`)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

// Native <select> can't wrap its value, so long option labels were truncated on
// mobile. Show the selected label in a wrapping box and overlay a transparent select.
function WrapSelect({ value, onChange, options, ariaLabel }) {
  const current = options.find(([v]) => v === value);
  const label = (current ? current[1] : value).replace(/\(([^)]{1,16})\)/g, (m) => m.replace(/ /g, ' '));
  return (
    <div className="relative w-full bg-white/10 border border-white/20 rounded-xl focus-within:ring-2 focus-within:ring-emerald-400">
      <div aria-hidden="true" className="pl-4 pr-10 py-3 text-white text-sm leading-snug">
        {label}
      </div>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 pointer-events-none" />
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {options.map(([v, text]) => (
          <option key={v} value={v} className="text-slate-900">{text}</option>
        ))}
      </select>
    </div>
  );
}

export default function SectionDetailPage({ slug: propSlug, onOpenQuoteModal }) {
  const { slug: paramSlug } = useParams();
  const slug = propSlug || paramSlug;
  const { t, tf } = useLanguage();

  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageModal, setActiveImageModal] = useState(null);
  // Freeze the page behind the photo viewer; Esc closes it
  useScrollLock(!!activeImageModal);
  useEscapeKey(!!activeImageModal, () => setActiveImageModal(null));

  // Government Subsidies interactive calculator state
  const [calcState, setCalcState] = useState('Tamil Nadu');
  const [calcModel, setCalcModel] = useState('SOLDRY 1210 (Commercial)');
  const [calcFarmerType, setCalcFarmerType] = useState('Small / Marginal Farmer');

  // Crop Preservation Guide search
  const [cropSearch, setCropSearch] = useState('');

  // Fallback data if backend is starting or offline
  const fallback = defaultSectionsData.find(s => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    fetchPublicSection(slug)
      .then(data => {
        if (data && data.section) {
          setSection(data.section);
        } else if (fallback) {
          setSection(fallback);
        } else {
          setError('sections_errNotFound');
        }
      })
      .catch(err => {
        if (fallback) {
          setSection(fallback);
        } else {
          setError('sections_errLoading');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Update page title
  useEffect(() => {
    if (section?.title) {
      document.title = `${tf(`section_${slug}_title`, section.title)} | ZeniTEK Solar Thermal Solutions`;
    }
  }, [section, slug, tf]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white py-20">
        <Loader className="w-10 h-10 text-[#002DC2] animate-spin mb-4" />
        <p className="text-slate-600 font-bold text-sm">{t('sections_loading')}</p>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F0F4FD] text-[#002DC2] flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#123B92] mb-2">{t('sections_unavailable')}</h1>
        <p className="text-slate-600 max-w-md mb-6 text-sm">
          {error ? t(error) : t('sections_unavailableDesc')}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/solar-dryer-models"
            className="px-5 py-2.5 bg-[#002DC2] hover:bg-[#002299] text-white font-bold rounded-xl text-sm transition-colors"
          >
            {t('sections_exploreModels')}
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
          >
            {t('sections_returnHome')}
          </Link>
        </div>
      </div>
    );
  }

  const sectionTitle = tf(`section_${slug}_title`, section.title);
  const sectionSubtitle = tf(`section_${slug}_subtitle`, section.subtitle);
  const copy = getSectionCopy(t, slug, sectionTitle);

  // Subsidy percentage calculation for the calculator widget
  let subsidyPercent = 50;
  if (calcFarmerType === 'SC / ST / Women Farmer' || calcFarmerType === 'FPO / SHG Group') {
    subsidyPercent = 60;
  } else if (calcFarmerType === 'General Commercial Exporter') {
    subsidyPercent = 40;
  }

  // Crop guide benchmark table data
  // Crop guide benchmark table data (crop names / benefits: sections_crop<N> / sections_benefit<N>)
  const cropGuideData = [
    { freshMoisture: '80%', dryMoisture: '8-10%', temp: '55°C - 60°C', duration: t('sections_daysVs', { n: '2.5', m: '12-15' }) },
    { freshMoisture: '52%', dryMoisture: '6%', temp: '50°C - 58°C', duration: t('sections_hours', { n: '28-36' }) },
    { freshMoisture: '78%', dryMoisture: '7%', temp: '42°C - 48°C', duration: t('sections_hours', { n: '8-10' }) },
    { freshMoisture: '82%', dryMoisture: '9%', temp: '50°C - 60°C', duration: t('sections_daysVs', { n: '3', m: '10' }) },
    { freshMoisture: '75%', dryMoisture: '10%', temp: '45°C - 52°C', duration: t('sections_hours', { n: '24-30' }) },
    { freshMoisture: '85%', dryMoisture: '12%', temp: '55°C - 62°C', duration: t('sections_hours', { n: '18-24' }) },
    { freshMoisture: '80%', dryMoisture: '9%', temp: '50°C - 55°C', duration: t('sections_days', { n: '2.5' }) }
  ].map((row, i) => ({ ...row, crop: t(`sections_crop${i + 1}`), benefit: t(`sections_benefit${i + 1}`) }));

  // Search matches the shown language and English names
  const query = cropSearch.trim().toLowerCase();
  const filteredCrops = cropGuideData.filter((c, i) => !query || [
    c.crop, c.benefit, sectionsText.en[`sections_crop${i + 1}`], sectionsText.en[`sections_benefit${i + 1}`]
  ].some(v => String(v || '').toLowerCase().includes(query)));

  // Calculator select options: values stay English (sent with the enquiry), labels are translated
  const stateOptions = [
    ['Tamil Nadu', `${t('sections_state_TN')} (TNAU / SHM)`],
    ['Karnataka', `${t('sections_state_KA')} (UAS / MIDH)`],
    ['Kerala', `${t('sections_state_KL')} (VFPCK / SHM)`],
    ['Maharashtra', `${t('sections_state_MH')} (MahaDBT)`],
    ['Andhra Pradesh', t('sections_state_APTS')],
    ['Other States', t('sections_otherStatesMnre')],
  ];
  const modelOptions = [
    ['SOLDRY 1210 (Commercial)', 'SOLDRY 1210 (300-500 kg)'],
    ['SOLDRY 1709 (Industrial)', 'SOLDRY 1709 (500 kg - 1 Ton)'],
    ['SOLDRY 300 (Multi-Unit)', t('sections_calcModel3')],
    ['SUNDRY 50 (Stainless Box)', t('sections_calcModel4')],
  ];
  const stateName = STATE_KEYS[calcState] ? t(`sections_state_${STATE_KEYS[calcState]}`) : calcState;
  const modelLabel = (modelOptions.find(([v]) => v === calcModel) || [calcModel, calcModel])[1];

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      
      {/* ─── BREADCRUMBS & HERO SECTION — full-bleed photo, left-aligned heading (matches Home hero) ─── */}
      <PageHero
        images={HERO_BACKGROUNDS[slug] || section.thumbnail?.url}
        top={
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-600">
            <Link to="/" className="hover:text-[#002DC2] transition-colors">{t('navHome')}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">{t('navbar_products')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#002DC2] font-bold">{sectionTitle}</span>
          </nav>
        }
        badge={
          <>
            <Sparkles className="w-3.5 h-3.5 text-[#002DC2] shrink-0" />
            <span>{t('sections_solutionBadge')}</span>
          </>
        }
        title={sectionTitle}
        subtitle={sectionSubtitle}
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: section.title });
              }}
              className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl shadow-lg shadow-[#23AC39]/25 hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <span>{t('sections_quoteDpr')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/918098613422?text=${encodeURIComponent(`Hello ZeniTEK team, I would like to inquire about ${section.title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white border border-slate-300 hover:border-[#002DC2] text-[#123B92] hover:text-[#002DC2] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-[#23AC39]" />
              <span>{t('sections_waEnquiry')}</span>
            </a>
          </>
        }
      >
        {/* Highlights Micro Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-white/90 border border-slate-200 shadow-sm px-3 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-[#23AC39] mr-1.5" />
            {t('sections_badgeMnre')}
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-white/90 border border-slate-200 shadow-sm px-3 py-1 rounded-lg">
            <Sun className="w-3.5 h-3.5 text-[#23AC39] mr-1.5" />
            {t('sections_badgeSolar')}
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-white/90 border border-slate-200 shadow-sm px-3 py-1 rounded-lg">
            <Zap className="w-3.5 h-3.5 text-[#002DC2] mr-1.5" />
            {t('sections_badgeZeroBill')}
          </span>
        </div>
      </PageHero>

      {/* ─── KEY HIGHLIGHTS / SOLUTION FEATURES ─── */}
      {section.highlights && section.highlights.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-extrabold text-[#002DC2] uppercase tracking-wider bg-[#F0F4FD] px-3 py-1 rounded-full inline-block">
              {copy.highlightsEyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">
              {copy.highlightsTitle}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {section.highlights.map((item, idx) => (
              <div
                key={idx}
                className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)] bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#002DC2]/30 transition-all flex items-center gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F0F4FD] text-[#002DC2] group-hover:bg-[#002DC2] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-slate-800 leading-snug text-balance">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── RICH BODY CONTENT ─── */}
      {section.content && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#002DC2] text-white flex items-center justify-center font-bold mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">{copy.overviewTitle}</h2>
            <p className="text-base sm:text-lg text-slate-600">{copy.overviewSubtitle}</p>
          </div>

          <div className="bg-slate-50/70 rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
              <RichText text={section.content} />
            </div>
          </div>
        </section>
      )}

      {/* ─── SPECIALIZED SECTION WIDGETS ─── */}

      {/* 1. If slug is "government-subsidies": Show Interactive Subsidy Calculator */}
      {slug === 'government-subsidies' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-br from-[#001b69] to-[#002DC2] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-2xs sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest text-[#23AC39] bg-[#123B92]/70 px-3 py-1 rounded-full border border-[#23AC39]/40 inline-block whitespace-nowrap">
                {t('sections_calcBadge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {t('sections_calcTitle')}
              </h2>
              <p className="text-base sm:text-lg text-slate-200">
                {t('sections_calcSub')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">{t('sections_yourState')}</label>
                <WrapSelect
                  ariaLabel={t('sections_yourState')}
                  value={calcState}
                  onChange={(e) => setCalcState(e.target.value)}
                  options={stateOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">{t('sections_dryerModelCap')}</label>
                <WrapSelect
                  ariaLabel={t('sections_dryerModelCap')}
                  value={calcModel}
                  onChange={(e) => setCalcModel(e.target.value)}
                  options={modelOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">{t('sections_beneficiaryFarmer')}</label>
                <WrapSelect
                  ariaLabel={t('sections_beneficiaryFarmer')}
                  value={calcFarmerType}
                  onChange={(e) => setCalcFarmerType(e.target.value)}
                  options={[
                    ["Small / Marginal Farmer", t('sections_farmerSmall')],
                    ["SC / ST / Women Farmer", t('sections_farmerSc')],
                    ["FPO / SHG Group", t('sections_farmerFpo2')],
                    ["General Commercial Exporter", t('sections_farmerGeneral2')],
                  ]}
                />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t('sections_calcAssist')}</div>
                <div className="text-2xl sm:text-3xl font-black text-[#23AC39] mt-1 leading-tight">
                  {t('sections_calcPercent', { percent: subsidyPercent })}
                </div>
                <p className="text-sm text-slate-300 mt-1">
                  {t('sections_calcFor', { state: stateName, model: modelLabel })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenQuoteModal) {
                    onOpenQuoteModal({
                      capacityNeeded: `${calcModel} (${subsidyPercent}% Subsidy Enquiry - ${calcState})`
                    });
                  }
                }}
                className="w-full md:w-auto px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl shadow-lg transition-colors shrink-0 cursor-pointer text-sm text-center text-balance md:whitespace-nowrap"
              >
                {t('sections_calcApply')}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. If slug is "crop-preservation-guide": Show Crop Guide Benchmark Table */}
      {slug === 'crop-preservation-guide' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">{t('sections_cropTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-600">{t('sections_cropSub')}</p>
            <div className="pt-3 flex justify-center">
              <input
                type="text"
                value={cropSearch}
                onChange={(e) => setCropSearch(e.target.value)}
                placeholder={t('sections_cropSearch')}
                aria-label={t('sections_cropSearch')}
                className="w-full sm:w-72 border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]"
              />
            </div>
          </div>

          <p className="sm:hidden text-sm font-semibold text-slate-500 flex items-center">
            <ArrowRight className="w-3.5 h-3.5 mr-1 text-[#002DC2]" />
            {t('sections_swipeHint')}
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto overscroll-x-contain shadow-sm">
            <table className="w-full min-w-[860px] text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                  <th className="p-3.5">{t('sections_thCrop')}</th>
                  <th className="p-3.5">{t('sections_thFresh')}</th>
                  <th className="p-3.5">{t('sections_thTarget')}</th>
                  <th className="p-3.5">{t('sections_thTemp')}</th>
                  <th className="p-3.5">{t('sections_thDuration')}</th>
                  <th className="p-3.5">{t('sections_thBenefit')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCrops.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-[#123B92] min-w-[160px]">{c.crop}</td>
                    <td className="p-3.5 text-slate-600 whitespace-nowrap">{c.freshMoisture}</td>
                    <td className="p-3.5 font-semibold text-[#1A822B] whitespace-nowrap">{c.dryMoisture}</td>
                    <td className="p-3.5 text-[#002DC2] font-semibold whitespace-nowrap">{c.temp}</td>
                    <td className="p-3.5 text-slate-600 font-medium whitespace-nowrap">{c.duration}</td>
                    <td className="p-3.5 text-slate-600 min-w-[220px]">{c.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. If slug is "technical-spec-sheets": Show Downloadable Brochure Cards */}
      {slug === 'technical-spec-sheets' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">{t('sections_specSheetsTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-600">{t('sections_specSheetsSub')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {brochures.map((b, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-[#002DC2] bg-[#F0F4FD] px-2 py-0.5 rounded-md">{t('sections_pdfSpecSheet')}</span>
                    <span>{t('sections_pagesSize', { pages: b.pageCount, size: b.size })}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#123B92] leading-snug">{b.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.subtitle}</p>
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                  <Link
                    to={`/brochures/${b.id}`}
                    className="flex-1 py-2 text-center text-xs font-bold text-[#002DC2] bg-[#F0F4FD] hover:bg-[#002DC2] hover:text-white rounded-xl transition-colors"
                  >
                    {t('sections_viewBrochure')}
                  </Link>
                  <a
                    href={b.url}
                    download={b.downloadName}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    title={t('sections_downloadPdf')}
                    aria-label={t('sections_downloadPdf')}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── ADDITIONAL IMAGES GALLERY ─── */}
      {section.images && section.images.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-extrabold text-[#002DC2] uppercase tracking-wider bg-[#F0F4FD] px-3 py-1 rounded-full inline-block">
              {t('sections_photosCount', { count: section.images.length })}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">{t('sections_photosTitle')}</h2>
            <p className="text-base sm:text-lg text-slate-600">{t('sections_photosSub')}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {section.images.map((img, idx) => (
              <div
                key={img._id || idx}
                onClick={() => setActiveImageModal(img.url)}
                className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-sm cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.alt || sectionTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white drop-shadow" />
                </div>
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-2 truncate">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── BOTTOM CALL TO ACTION ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-gradient-to-br from-slate-900 via-[#001f7a] to-slate-900 text-white rounded-3xl p-6 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#23AC39]">
              {t('sections_ctaEyebrow')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {copy.ctaTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {copy.ctaBody}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: section.title });
                }}
                className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer text-sm w-full sm:w-auto text-balance sm:whitespace-nowrap"
              >
                {t('sections_ctaQuote')}
              </button>
              <Link
                to="/solar-dryer-models"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-colors text-sm w-full sm:w-auto text-balance sm:whitespace-nowrap"
              >
                {t('sections_ctaBrowse')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <img
              src={activeImageModal}
              alt={t('sections_fieldPhoto')}
              className="max-w-full max-h-[85vh] mx-auto object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setActiveImageModal(null)}
              aria-label={t('close')}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white text-[#123B92] rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
