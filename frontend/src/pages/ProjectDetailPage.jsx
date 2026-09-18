import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectGalleryData } from '../data/projectGalleryData';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft, ArrowRight, MapPin, Calendar, ShieldCheck,
  CheckCircle2, Sparkles, PhoneCall, ChevronLeft, ChevronRight,
  Layers, Award, FileText, Share2
} from 'lucide-react';

export default function ProjectDetailPage({ onOpenQuoteModal }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const isTamil = lang === 'ta';

  // Find project by ID
  const project = projectGalleryData.find(p => p.id === id);
  const [activePhoto, setActivePhoto] = useState('main'); // 'main' | 'interior'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActivePhoto('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-500">The requested solar dryer installation could not be found.</p>
        <Link
          to="/dryers"
          className="px-6 py-2.5 bg-blue-700 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-600 transition-all flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Solar Dryers</span>
        </Link>
      </div>
    );
  }

  // Calculate Previous and Next projects
  const currentIndex = projectGalleryData.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? projectGalleryData[currentIndex - 1] : projectGalleryData[projectGalleryData.length - 1];
  const nextProject = currentIndex < projectGalleryData.length - 1 ? projectGalleryData[currentIndex + 1] : projectGalleryData[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-xs">
            <Link to="/" className="text-slate-500 hover:text-blue-700 font-semibold">Home</Link>
            <span className="text-slate-400">/</span>
            <Link to="/dryers" className="text-slate-500 hover:text-blue-700 font-semibold">Solar Dryers</Link>
            <span className="text-slate-400">/</span>
            <span className="text-blue-900 font-bold truncate max-w-[200px] sm:max-w-none">
              Project {project.id}: {project.title}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/dryers"
              className="px-4 py-2 bg-white border border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isTamil ? 'அனைத்து உலர்த்திகளுக்கும் திரும்புக' : 'Back to All Installations'}</span>
            </Link>

            <button
              onClick={handleShare}
              className="p-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm"
              title="Share Link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            {copied && <span className="text-[11px] font-bold text-green-600 animate-fade-in">Link Copied!</span>}
          </div>
        </div>

        {/* Main Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Big Image Display + Story */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Photo Card - 100% Clean Image with no text or badges overlaid */}
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl p-4 sm:p-5 space-y-4">
              
              {/* Badges Header Bar (Outside and above the image) */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3.5 py-1.5 bg-blue-950 text-white font-black text-xs rounded-xl shadow-sm">
                    PROJECT #{project.id}
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    <span>COMMISSIONED {project.year}</span>
                  </span>
                </div>

                <span className="px-3 py-1.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200">
                  {project.state}
                </span>
              </div>

              {/* 100% Clean, Full Image Display */}
              <div className="relative h-[360px] sm:h-[460px] overflow-hidden rounded-2xl bg-slate-900 border border-slate-200">
                <img
                  src={project.id === '06' && activePhoto === 'interior' ? project.interiorImage : project.image}
                  alt={`${project.title} - ${project.dryerCode}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Mulbagal Special Interior/Exterior View Switcher (Cleanly placed below the image) */}
              {project.id === '06' && (
                <div className="flex items-center justify-center space-x-2 pt-1">
                  <span className="text-xs font-bold text-slate-500 mr-2">Switch View:</span>
                  <button
                    onClick={() => setActivePhoto('main')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activePhoto === 'main' ? 'bg-blue-800 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    Exterior Walk-In View
                  </button>
                  <button
                    onClick={() => setActivePhoto('interior')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activePhoto === 'interior' ? 'bg-blue-800 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    Interior Tiered Racks
                  </button>
                </div>
              )}
            </div>

            {/* Produce & Crop Highlight Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                    TARGET CROP & DEHYDRATION APPLICATION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {project.application}
                  </h2>
                </div>

                {/* Official Produce Cutout Thumbnail */}
                {project.produceImage && (
                  <div className="shrink-0 w-24 h-20 sm:w-28 sm:h-24 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
                    <img
                      src={project.produceImage}
                      alt={project.application}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md hover:scale-110 transition-transform"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                <p>{project.description}</p>
                <p>
                  Engineered with heavy-duty structural galvanized hollow steel sections and UV-stabilized polycarbonate twin-wall multi-chamber sheets for optimal thermal heat accumulation and accelerated drying cycles.
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <div className="text-[10px] font-bold uppercase text-blue-700">Weather Defense</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">100% Rain & Dust Sealed</div>
                </div>
                <div className="p-3 bg-green-50/60 rounded-xl border border-green-100">
                  <div className="text-[10px] font-bold uppercase text-green-700">Clean Tech</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">Zero Fuel / Solar Driven</div>
                </div>
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                  <div className="text-[10px] font-bold uppercase text-amber-700">Value Gain</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">+25% to 40% Grade Premium</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Specification Details & Quote Action */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Specs Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
              
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  INSTALLATION SPECIFICATIONS
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {project.title}
                </h1>
                <div className="flex items-center text-xs font-semibold text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 text-rose-500 mr-1 shrink-0" />
                  <span>{project.locality}</span>
                </div>
              </div>

              {/* Specification Table */}
              <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                
                <div className="p-3.5 flex items-center justify-between bg-slate-50/70">
                  <span className="font-bold text-slate-500">Project Index ID</span>
                  <span className="font-mono font-black text-blue-900 text-sm">#{project.id}</span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <span className="font-bold text-slate-500">Dryer / Model Code</span>
                  <span className="font-mono font-bold text-xs text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {project.dryerCode}
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between bg-slate-50/70">
                  <span className="font-bold text-slate-500">Year Commissioned</span>
                  <span className="font-extrabold text-emerald-700">{project.year}</span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <span className="font-bold text-slate-500">Sector / Category</span>
                  <span className="font-bold text-slate-800">{project.category}</span>
                </div>

                <div className="p-3.5 flex items-center justify-between bg-slate-50/70">
                  <span className="font-bold text-slate-500">Map Reference / Pin</span>
                  <span className="font-semibold text-slate-700">{project.mapRef}</span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <span className="font-bold text-slate-500">State / Region</span>
                  <span className="font-bold text-slate-900">{project.state}, India</span>
                </div>

              </div>

              {/* Quality & Subsidy Badges */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 shrink-0" />
                  <span>MNRE Approved Polyhouse Design</span>
                </div>
                <div className="flex items-center text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 shrink-0" />
                  <span>Eligible for 40% – 60% Govt Subsidy (NABARD / Agri)</span>
                </div>
                <div className="flex items-center text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 shrink-0" />
                  <span>Turnkey On-Farm Erection & Operator Training</span>
                </div>
              </div>

              {/* Primary Call to Action Box */}
              <div className="p-5 bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 text-white rounded-2xl space-y-4 shadow-md">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-green-300">
                    GET A QUOTE FOR THIS SETUP
                  </div>
                  <div className="text-sm font-extrabold">
                    Want an installation like {project.title}?
                  </div>
                  <p className="text-[11px] text-blue-100">
                    Receive customized capacity sizing, subsidy eligibility check, and factory-direct pricing on WhatsApp.
                  </p>
                </div>

                <button
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({
                    capacityNeeded: `${project.dryerCode} (${project.title} Reference)`,
                    cropType: project.application,
                    district: project.locality
                  })}
                  className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
                >
                  <span>Request Subsidy & Price Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="tel:+918098613422"
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 border border-white/20"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-green-300" />
                  <span>Call: +91 80986 13422</span>
                </a>
              </div>

            </div>

            {/* Pagination between projects */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between text-xs">
              <button
                onClick={() => navigate(`/dryers/${prevProject.id}`)}
                className="flex items-center space-x-1.5 font-bold text-slate-700 hover:text-blue-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous:</span>
                <span>#{prevProject.id} {prevProject.title}</span>
              </button>

              <span className="text-slate-300">|</span>

              <button
                onClick={() => navigate(`/dryers/${nextProject.id}`)}
                className="flex items-center space-x-1.5 font-bold text-slate-700 hover:text-blue-700 transition-colors"
              >
                <span>#{nextProject.id} {nextProject.title}</span>
                <span className="hidden sm:inline">:Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
