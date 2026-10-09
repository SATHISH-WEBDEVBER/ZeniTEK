import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPublicSection } from '../utils/api';
import { defaultSectionsData } from '../data/defaultSectionsData';
import { useLanguage } from '../context/LanguageContext';
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

// Per-slug copy for the generic section headers and the bottom CTA
const SECTION_COPY = {
  'solar-thermal-system': {
    highlightsEyebrow: 'Engineered Excellence',
    highlightsTitle: 'Key Capabilities & Impact',
    overviewTitle: 'Technical Overview & Operations',
    overviewSubtitle: 'Engineering design and operating methodology',
    ctaTitle: 'Ready to Upgrade to High-Efficiency Solar Thermal?',
    ctaBody: 'Our engineering team provides end-to-end site assessment, solar thermal sizing, MNRE subsidy processing, and commissioning.'
  },
  'agri-solar-innovation': {
    highlightsEyebrow: 'Farmer Impact',
    highlightsTitle: 'Key Benefits for Growers',
    overviewTitle: 'How Agri-Solar Drying Works',
    overviewSubtitle: 'From open-yard losses to export-ready produce',
    ctaTitle: 'Ready to Bring Agri-Solar Drying to Your Farm?',
    ctaBody: 'Our engineering team provides site assessment, dryer sizing for your crops, MNRE subsidy processing, and commissioning.'
  },
  'photovoltaic-solutions': {
    highlightsEyebrow: 'Self-Powered Operation',
    highlightsTitle: 'Key Capabilities & Impact',
    overviewTitle: 'Technical Overview & Operations',
    overviewSubtitle: 'Solar PV integration, blowers, and energy storage',
    ctaTitle: 'Ready to Run Your Dryer on Solar Power?',
    ctaBody: 'Our engineering team provides site assessment, PV and blower sizing, MNRE subsidy processing, and commissioning.'
  },
  'government-subsidies': {
    highlightsEyebrow: 'Eligible Schemes',
    highlightsTitle: 'Subsidy Schemes & Support',
    overviewTitle: 'How the Subsidy Process Works',
    overviewSubtitle: 'Eligibility and step-by-step application support',
    ctaTitle: 'Ready to Claim Your Solar Dryer Subsidy?',
    ctaBody: 'Our liaison desk supports DPR preparation, portal registration, inspections, and subsidy processing for your installation.'
  },
  'crop-preservation-guide': {
    highlightsEyebrow: 'Drying Best Practices',
    highlightsTitle: 'Key Preservation Guidelines',
    overviewTitle: 'Crop Drying Guidelines',
    overviewSubtitle: 'Temperature benchmarks and tray loading recommendations',
    ctaTitle: 'Ready to Dry Your Crops to Export Grade?',
    ctaBody: 'Our engineering team helps you size the right dryer for your crops, set drying temperatures, process MNRE subsidies, and commission the system.'
  },
  'technical-spec-sheets': {
    highlightsEyebrow: 'Build Quality',
    highlightsTitle: 'Key Specifications',
    overviewTitle: 'Technical Specifications',
    overviewSubtitle: 'Structural, material, and foundation requirements',
    ctaTitle: 'Need Detailed Specs for Your Project?',
    ctaBody: 'Our engineering team provides site assessment, dryer sizing, project-specific specifications, MNRE subsidy processing, and commissioning.'
  }
};

const getSectionCopy = (slug, title) => SECTION_COPY[slug] || {
  highlightsEyebrow: 'At a Glance',
  highlightsTitle: 'Key Highlights',
  overviewTitle: 'Overview',
  overviewSubtitle: title,
  ctaTitle: `Interested in ${title}?`,
  ctaBody: 'Our engineering team provides end-to-end site assessment, dryer sizing, MNRE subsidy processing, and commissioning.'
};

// Render **bold** segments inside a line of text as React elements
const renderInline = (text, keyPrefix) =>
  text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => (
    /^\*\*[^*]+\*\*$/.test(part)
      ? <strong key={`${keyPrefix}-${i}`} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
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
        <h4 key={bIdx} className="text-lg font-bold text-slate-900 leading-snug pt-3">
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
  const { t } = useLanguage();

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
          setError('Section not found or not published');
        }
      })
      .catch(err => {
        if (fallback) {
          setSection(fallback);
        } else {
          setError(err.message || 'Error loading page content');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Update page title
  useEffect(() => {
    if (section?.title) {
      document.title = `${section.title} | ZeniTEK Solar Thermal Solutions`;
    }
  }, [section]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white py-20">
        <Loader className="w-10 h-10 text-[#002DC2] animate-spin mb-4" />
        <p className="text-slate-600 font-bold text-sm">Loading dynamic section content...</p>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Section Unavailable</h1>
        <p className="text-slate-600 max-w-md mb-6 text-sm">
          {error || 'This section is currently in draft mode or being updated by the administrator.'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/solar-dryer-models"
            className="px-5 py-2.5 bg-[#002DC2] hover:bg-[#002299] text-white font-bold rounded-xl text-sm transition-colors"
          >
            Explore Solar Dryer Models
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const copy = getSectionCopy(slug, section.title);

  // Subsidy percentage calculation for the calculator widget
  let subsidyPercent = 50;
  if (calcFarmerType === 'SC / ST / Women Farmer' || calcFarmerType === 'FPO / SHG Group') {
    subsidyPercent = 60;
  } else if (calcFarmerType === 'General Commercial Exporter') {
    subsidyPercent = 40;
  }

  // Crop guide benchmark table data
  const cropGuideData = [
    { crop: 'Turmeric (Finger & Bulb)', freshMoisture: '80%', dryMoisture: '8-10%', temp: '55°C - 60°C', duration: '2.5 Days (vs 12-15 Days)', benefit: 'Retains 4.8% high curcumin; 0% aflatoxin' },
    { crop: 'Coconut (Copra for Oil)', freshMoisture: '52%', dryMoisture: '6%', temp: '50°C - 58°C', duration: '28-36 Hours', benefit: '100% Grade-1 sulfur-free white copra' },
    { crop: 'Moringa Leaf Powder', freshMoisture: '78%', dryMoisture: '7%', temp: '42°C - 48°C', duration: '8-10 Hours', benefit: 'Retains vibrant green chlorophyll & nutrients' },
    { crop: 'Red Chillies', freshMoisture: '82%', dryMoisture: '9%', temp: '50°C - 60°C', duration: '3 Days (vs 10 Days)', benefit: 'Maintains capsaicin & deep natural red luster' },
    { crop: 'Cardamom & Pepper', freshMoisture: '75%', dryMoisture: '10%', temp: '45°C - 52°C', duration: '24-30 Hours', benefit: 'Essential oils lock; premium export auction grade' },
    { crop: 'Banana & Mango Chips', freshMoisture: '85%', dryMoisture: '12%', temp: '55°C - 62°C', duration: '18-24 Hours', benefit: 'Uniform pliable texture without sugar or sulfur' },
    { crop: 'Ginger / Sonth', freshMoisture: '80%', dryMoisture: '9%', temp: '50°C - 55°C', duration: '2.5 Days', benefit: 'Full gingerol retention with clean fiber' }
  ];

  const filteredCrops = cropGuideData.filter(c =>
    c.crop.toLowerCase().includes(cropSearch.toLowerCase()) ||
    c.benefit.toLowerCase().includes(cropSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      
      {/* ─── BREADCRUMBS & HERO SECTION — full-bleed photo, left-aligned heading (matches Home hero) ─── */}
      <PageHero
        images={HERO_BACKGROUNDS[slug] || section.thumbnail?.url}
        top={
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-600">
            <Link to="/" className="hover:text-[#002DC2] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Products</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#002DC2] font-bold">{section.title}</span>
          </nav>
        }
        badge={
          <>
            <Sparkles className="w-3.5 h-3.5 text-[#002DC2] shrink-0" />
            <span>ZeniTEK Solution Category</span>
          </>
        }
        title={section.title}
        subtitle={section.subtitle}
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: section.title });
              }}
              className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl shadow-lg shadow-[#23AC39]/25 hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <span>Get Free Quote & Subsidy DPR</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/918098613422?text=${encodeURIComponent(`Hello ZeniTEK team, I would like to inquire about ${section.title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white border border-slate-300 hover:border-[#002DC2] text-slate-800 hover:text-[#002DC2] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-[#23AC39]" />
              <span>WhatsApp Enquiry</span>
            </a>
          </>
        }
      >
        {/* Highlights Micro Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-white/90 border border-slate-200 shadow-sm px-3 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-[#23AC39] mr-1.5" />
            MNRE Approved Quality
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-white/90 border border-slate-200 shadow-sm px-3 py-1 rounded-lg">
            <Sun className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
            100% Clean Solar Energy
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-white/90 border border-slate-200 shadow-sm px-3 py-1 rounded-lg">
            <Zap className="w-3.5 h-3.5 text-[#002DC2] mr-1.5" />
            Zero Electricity Bills
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{copy.overviewTitle}</h2>
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
              <span className="text-2xs sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-400/30 inline-block whitespace-nowrap">
                Live State & Central Subsidy Tool
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Calculate Your Solar Dryer Subsidy
              </h2>
              <p className="text-base sm:text-lg text-slate-200">
                Check estimated subsidy benefits under MIDH, SHM, and MNRE schemes for your state.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Your State</label>
                <WrapSelect
                  ariaLabel="Your State"
                  value={calcState}
                  onChange={(e) => setCalcState(e.target.value)}
                  options={[
                    ["Tamil Nadu", "Tamil Nadu (TNAU / SHM)"],
                    ["Karnataka", "Karnataka (UAS / MIDH)"],
                    ["Kerala", "Kerala (VFPCK / SHM)"],
                    ["Maharashtra", "Maharashtra (MahaDBT)"],
                    ["Andhra Pradesh", "Andhra Pradesh / Telangana"],
                    ["Other States", "Other States (Central MNRE)"],
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Dryer Model / Capacity</label>
                <WrapSelect
                  ariaLabel="Dryer Model / Capacity"
                  value={calcModel}
                  onChange={(e) => setCalcModel(e.target.value)}
                  options={[
                    ["SOLDRY 1210 (Commercial)", "SOLDRY 1210 (300-500 kg)"],
                    ["SOLDRY 1709 (Industrial)", "SOLDRY 1709 (500 kg - 1 Ton)"],
                    ["SOLDRY 300 (Multi-Unit)", "SOLDRY 300 (Multi-Unit Plant)"],
                    ["SUNDRY 50 (Stainless Box)", "SUNDRY 50 (50 kg Farm Unit)"],
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Beneficiary Farmer Category</label>
                <WrapSelect
                  ariaLabel="Beneficiary Farmer Category"
                  value={calcFarmerType}
                  onChange={(e) => setCalcFarmerType(e.target.value)}
                  options={[
                    ["Small / Marginal Farmer", "Small / Marginal Farmer (50% Subsidy)"],
                    ["SC / ST / Women Farmer", "SC / ST / Women Farmer (60% Subsidy)"],
                    ["FPO / SHG Group", "FPO / SHG Farmer Group (60% Subsidy)"],
                    ["General Commercial Exporter", "General Commercial Exporter (40% Subsidy)"],
                  ]}
                />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Estimated Government Assistance</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 leading-tight">
                  {subsidyPercent}% Capital Subsidy Available
                </div>
                <p className="text-sm text-slate-300 mt-1">
                  For {calcState} · {calcModel} under active Horticulture schemes.
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
                Apply for Subsidy DPR & Invoice
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. If slug is "crop-preservation-guide": Show Crop Guide Benchmark Table */}
      {slug === 'crop-preservation-guide' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Validated Crop Dehydration Matrix</h2>
            <p className="text-base sm:text-lg text-slate-600">Benchmark drying curves, operating temperatures, and quality results</p>
            <div className="pt-3 flex justify-center">
              <input
                type="text"
                value={cropSearch}
                onChange={(e) => setCropSearch(e.target.value)}
                placeholder="Search crop or spice..."
                className="w-full sm:w-72 border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]"
              />
            </div>
          </div>

          <p className="sm:hidden text-sm font-semibold text-slate-500 flex items-center">
            <ArrowRight className="w-3.5 h-3.5 mr-1 text-[#002DC2]" />
            Swipe the table sideways to see all columns
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto overscroll-x-contain shadow-sm">
            <table className="w-full min-w-[860px] text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                  <th className="p-3.5">Crop / Commodity</th>
                  <th className="p-3.5">Fresh Moisture</th>
                  <th className="p-3.5">Target Dry</th>
                  <th className="p-3.5">Safe Temp</th>
                  <th className="p-3.5">Drying Duration</th>
                  <th className="p-3.5">Value Addition Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCrops.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 min-w-[160px]">{c.crop}</td>
                    <td className="p-3.5 text-slate-600 whitespace-nowrap">{c.freshMoisture}</td>
                    <td className="p-3.5 font-semibold text-emerald-600 whitespace-nowrap">{c.dryMoisture}</td>
                    <td className="p-3.5 text-amber-700 font-semibold whitespace-nowrap">{c.temp}</td>
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Official Specification Sheets & CAD Blueprints</h2>
            <p className="text-base sm:text-lg text-slate-600">Download complete manufacturer engineering documents in PDF format</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {brochures.map((b, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-[#002DC2] bg-[#F0F4FD] px-2 py-0.5 rounded-md">PDF Spec Sheet</span>
                    <span>{b.pageCount} Pages · {b.size}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug">{b.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.subtitle}</p>
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                  <Link
                    to={`/brochures/${b.id}`}
                    className="flex-1 py-2 text-center text-xs font-bold text-[#002DC2] bg-[#F0F4FD] hover:bg-[#002DC2] hover:text-white rounded-xl transition-colors"
                  >
                    View Brochure
                  </Link>
                  <a
                    href={b.url}
                    download={b.downloadName}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    title="Download PDF"
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
              {section.images.length} Photos
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Project Field Photos & Installations</h2>
            <p className="text-base sm:text-lg text-slate-600">Live operational systems photographed at customer sites</p>
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
                  alt={img.alt || section.title}
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
              Empower Your Farm or Facility
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {copy.ctaTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
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
                Request Free Engineering Quote
              </button>
              <Link
                to="/solar-dryer-models"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-colors text-sm w-full sm:w-auto text-balance sm:whitespace-nowrap"
              >
                Browse All Dryer Models
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
              alt="Field Photo"
              className="max-w-full max-h-[85vh] mx-auto object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white text-slate-900 rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
