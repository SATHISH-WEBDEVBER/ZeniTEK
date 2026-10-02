import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPublicSection } from '../utils/api';
import { defaultSectionsData } from '../data/defaultSectionsData';
import { useLanguage } from '../context/LanguageContext';
import {
  Sun, Zap, ShieldCheck, ArrowRight, CheckCircle2, FileText,
  Download, HelpCircle, PhoneCall, Sparkles, Building, Layers,
  Calculator, Sprout, Cpu, ChevronRight, Eye, X, AlertCircle, Loader
} from 'lucide-react';

export default function SectionDetailPage({ slug: propSlug, onOpenQuoteModal }) {
  const { slug: paramSlug } = useParams();
  const slug = propSlug || paramSlug;
  const { t } = useLanguage();

  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageModal, setActiveImageModal] = useState(null);

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
      
      {/* ─── BREADCRUMBS & HERO SECTION ─── */}
      <section className="bg-gradient-to-b from-[#F0F4FD] via-white to-white pt-8 pb-12 sm:pb-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-6">
            <Link to="/" className="hover:text-[#002DC2] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Products</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#002DC2] font-bold">{section.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#002DC2]/10 border border-[#002DC2]/20 text-[#002DC2] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#002DC2]" />
                <span>ZeniTEK Solution Category</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {section.title}
              </h1>

              {section.subtitle && (
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                  {section.subtitle}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: section.title });
                  }}
                  className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl shadow-lg shadow-[#23AC39]/25 hover:shadow-xl transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Get Free Quote & Subsidy DPR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/918098613422?text=${encodeURIComponent(`Hello ZeniTEK team, I would like to inquire about ${section.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white border border-slate-300 hover:border-[#002DC2] text-slate-800 hover:text-[#002DC2] font-bold rounded-xl transition-all shadow-xs flex items-center space-x-2"
                >
                  <PhoneCall className="w-4 h-4 text-[#23AC39]" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>

              {/* Highlights Micro Badges */}
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#23AC39] mr-1.5" />
                  MNRE Approved Quality
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  <Sun className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                  100% Clean Solar Energy
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-[#002DC2] mr-1.5" />
                  Zero Electricity Bills
                </span>
              </div>

            </div>

            {/* Right Featured Image / Thumbnail */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 group aspect-[4/3]">
                {section.thumbnail?.url ? (
                  <img
                    src={section.thumbnail.url}
                    alt={section.thumbnail.alt || section.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <Sun className="w-16 h-16 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-black tracking-wider uppercase text-emerald-400">
                    Verified Commercial Installation
                  </div>
                  <div className="text-sm font-bold truncate">
                    {section.title}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── KEY HIGHLIGHTS / SOLUTION FEATURES ─── */}
      {section.highlights && section.highlights.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-extrabold text-[#002DC2] uppercase tracking-wider bg-[#F0F4FD] px-3 py-1 rounded-full">
              Engineered Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Key Capabilities & Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#002DC2]/30 transition-all flex items-start space-x-3.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F0F4FD] text-[#002DC2] group-hover:bg-[#002DC2] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-slate-800 leading-snug">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── RICH BODY CONTENT ─── */}
      {section.content && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-slate-50/70 rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#002DC2] text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Technical Overview & Operations</h3>
                <p className="text-xs text-slate-500">Official engineering documentation and operating methodology</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
              {section.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SPECIALIZED SECTION WIDGETS ─── */}

      {/* 1. If slug is "government-subsidies": Show Interactive Subsidy Calculator */}
      {slug === 'government-subsidies' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-br from-[#001b69] to-[#002DC2] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-400/30">
                Live State & Central Subsidy Tool
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Calculate Your Solar Dryer Subsidy
              </h2>
              <p className="text-xs sm:text-sm text-slate-200">
                Check estimated subsidy benefits under MIDH, SHM, and MNRE schemes for your state.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Your State</label>
                <select
                  value={calcState}
                  onChange={(e) => setCalcState(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="Tamil Nadu" className="text-slate-900">Tamil Nadu (TNAU / SHM)</option>
                  <option value="Karnataka" className="text-slate-900">Karnataka (UAS / MIDH)</option>
                  <option value="Kerala" className="text-slate-900">Kerala (VFPCK / SHM)</option>
                  <option value="Maharashtra" className="text-slate-900">Maharashtra (MahaDBT)</option>
                  <option value="Andhra Pradesh" className="text-slate-900">Andhra Pradesh / Telangana</option>
                  <option value="Other States" className="text-slate-900">Other States (Central MNRE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Dryer Model / Capacity</label>
                <select
                  value={calcModel}
                  onChange={(e) => setCalcModel(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="SOLDRY 1210 (Commercial)" className="text-slate-900">SOLDRY 1210 (300-500 kg)</option>
                  <option value="SOLDRY 1709 (Industrial)" className="text-slate-900">SOLDRY 1709 (500 kg - 1 Ton)</option>
                  <option value="SOLDRY 300 (Multi-Unit)" className="text-slate-900">SOLDRY 300 (Multi-Unit Plant)</option>
                  <option value="SUNDRY 50 (Stainless Box)" className="text-slate-900">SUNDRY 50 (50 kg Farm Unit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Beneficiary Farmer Category</label>
                <select
                  value={calcFarmerType}
                  onChange={(e) => setCalcFarmerType(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="Small / Marginal Farmer" className="text-slate-900">Small / Marginal Farmer (50% Subsidy)</option>
                  <option value="SC / ST / Women Farmer" className="text-slate-900">SC / ST / Women Farmer (60% Subsidy)</option>
                  <option value="FPO / SHG Group" className="text-slate-900">FPO / SHG Farmer Group (60% Subsidy)</option>
                  <option value="General Commercial Exporter" className="text-slate-900">General Commercial Exporter (40% Subsidy)</option>
                </select>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Estimated Government Assistance</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">
                  {subsidyPercent}% Capital Subsidy Available
                </div>
                <p className="text-xs text-slate-300 mt-1">
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
                className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl shadow-lg transition-colors shrink-0 cursor-pointer text-sm"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Validated Crop Dehydration Matrix</h3>
              <p className="text-xs text-slate-500">Benchmark drying curves, operating temperatures, and quality results</p>
            </div>
            <input
              type="text"
              value={cropSearch}
              onChange={(e) => setCropSearch(e.target.value)}
              placeholder="Search crop or spice..."
              className="w-full sm:w-64 border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002DC2]"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
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
                    <td className="p-3.5 font-bold text-slate-900">{c.crop}</td>
                    <td className="p-3.5 text-slate-600">{c.freshMoisture}</td>
                    <td className="p-3.5 font-semibold text-emerald-600">{c.dryMoisture}</td>
                    <td className="p-3.5 text-amber-700 font-semibold">{c.temp}</td>
                    <td className="p-3.5 text-slate-600 font-medium">{c.duration}</td>
                    <td className="p-3.5 text-slate-600">{c.benefit}</td>
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
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">Official Specification Sheets & CAD Blueprints</h3>
            <p className="text-xs text-slate-500">Download complete manufacturer engineering documents in PDF format</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "SOLDRY Commercial Polyhouse Specification", pages: "10 Pages", size: "7.1 MB", desc: "Detailed structural drawings, air velocity metrics, and tray layout", file: "/brochures/zenitek-commercial-brochure.pdf" },
              { title: "SUNDRY 50 Stainless Steel Spec Sheet", pages: "3 Pages", size: "1.0 MB", desc: "Electrical ratings, blower airflow, and food contact SS304 certificates", file: "/brochures/zenitek-sundry-spec.pdf" },
              { title: "Solar Thermal Collector Efficiency Report", pages: "4 Pages", size: "1.2 MB", desc: "Solar irradiance conversion test benchmarks and temperature curves", file: "/brochures/zenitek-thermal-efficiency.pdf" }
            ].map((b, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-[#002DC2] bg-[#F0F4FD] px-2 py-0.5 rounded-md">PDF Spec Sheet</span>
                    <span>{b.pages} · {b.size}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{b.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                  <Link
                    to="/gallery?cat=brochure"
                    className="flex-1 py-2 text-center text-xs font-bold text-[#002DC2] bg-[#F0F4FD] hover:bg-[#002DC2] hover:text-white rounded-xl transition-colors"
                  >
                    View in Gallery
                  </Link>
                  <a
                    href={b.file}
                    download
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">Project Field Photos & Installations</h3>
              <p className="text-xs text-slate-500">Live operational systems photographed at customer sites</p>
            </div>
            <span className="text-xs font-bold text-slate-400">{section.images.length} Photos</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {section.images.map((img, idx) => (
              <div
                key={img._id || idx}
                onClick={() => setActiveImageModal(img.url)}
                className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-xs cursor-pointer"
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
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[11px] p-2 truncate">
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
        <div className="bg-gradient-to-br from-slate-900 via-[#001f7a] to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#23AC39]">
              Empower Your Farm or Facility
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Ready to Upgrade to High-Efficiency Solar Thermal?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our engineering team provides end-to-end site assessment, solar thermal sizing, MNRE subsidy processing, and commissioning.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: section.title });
                }}
                className="px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer text-sm"
              >
                Request Free Engineering Quote
              </button>
              <Link
                to="/solar-dryer-models"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-colors text-sm"
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
