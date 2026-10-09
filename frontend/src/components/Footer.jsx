import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  Building2, 
  X,
  FileText,
  Lock,
  Eye,
  Share2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null
  const [activeBrochure, setActiveBrochure] = useState(null); // active PDF brochure object | null

  const brochures = [
    {
      id: 'solar-dryer',
      title: 'Solar Dryer Technical Brochure',
      subtitle: 'Commercial Polyhouse (10 Pages)',
      url: '/brochures/zenitek-solar-dryer-brochure.pdf',
      downloadName: 'ZeniTEK-Commercial-Solar-Dryer-Brochure.pdf',
      size: '7.1 MB',
      pageCount: 10,
      pages: Array.from({ length: 10 }, (_, i) => `/brochures/pages/solar-dryer/page-${i + 1}.jpg`),
      badge: 'Commercial',
      badgeColor: 'bg-blue-50 text-[#002DC2] border-blue-200'
    },
    {
      id: 'household-box',
      title: 'Household Solar Box Dryer',
      subtitle: 'Sundry Mini (Kitchen & Balcony)',
      url: '/brochures/zenitek-household-box-dryer-brochure.pdf',
      downloadName: 'ZeniTEK-Household-Solar-Box-Dryer-Brochure.pdf',
      size: '1.0 MB',
      pageCount: 3,
      pages: Array.from({ length: 3 }, (_, i) => `/brochures/pages/household-box/page-${i + 1}.jpg`),
      badge: 'Domestic',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'entrepreneur-box',
      title: 'Entrepreneur Box Dryer',
      subtitle: 'Commercial 4 & 8-Tray SS304 Model',
      url: '/brochures/zenitek-entrepreneur-box-dryer-brochure.pdf',
      downloadName: 'ZeniTEK-Entrepreneur-Solar-Box-Dryer-Brochure.pdf',
      size: '1.2 MB',
      pageCount: 4,
      pages: Array.from({ length: 4 }, (_, i) => `/brochures/pages/entrepreneur-box/page-${i + 1}.jpg`),
      badge: 'Business',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  // Ensure "Tamil Nadu - 000 000" never breaks across lines
  const formatAddress = (text) => {
    if (!text || typeof text !== 'string') return text;
    const regex = /(Tamil Nadu\s*-\s*\d{3}\s*\d{3}|Tamil Nadu)/;
    const parts = text.split(regex);
    if (parts.length <= 1) return text;
    return parts.map((part, idx) => {
      if (/Tamil Nadu/.test(part)) {
        return (
          <span key={idx} className="whitespace-nowrap font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <footer className="bg-white text-black pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8">
          
          {/* Col 1: Brand Info & Accreditations (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="ZeniTEK - Towards Sustainable Future"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-black max-w-sm font-medium">
              ZeniTEK manufactures high-efficiency solar thermal collectors and commercial polyhouse dryers, delivering sustainable clean energy solutions to eliminate post-harvest crop loss for farmers, FPOs, and industries.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#F0F4FD] text-[#123B92] border border-[#002DC2] shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#002DC2] shrink-0" /> {t('mnreBadge')}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-2xs font-bold bg-[#F0F4FD] text-[#123B92] border border-[#002DC2] shadow-sm">
                {t('isoBadge')}
              </span>
            </div>
          </div>

          {/* Col 2: Dryer Models (2 cols on desktop) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#123B92] uppercase tracking-wider mb-4">Dryer Models</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/dryers" className="hover:text-[#002DC2] text-black transition-colors block">
                  <span className="font-bold text-[#123B92] block">SOLDRY 1210</span>
                  <span className="text-2xs text-slate-500 block">Polyhouse Tunnel <span className="whitespace-nowrap">(100-300 kg)</span></span>
                </Link>
              </li>
              <li>
                <Link to="/dryers" className="hover:text-[#002DC2] text-black transition-colors block">
                  <span className="font-bold text-[#123B92] block">SOLDRY 1709</span>
                  <span className="text-2xs text-slate-500 block">Commercial Tunnel <span className="whitespace-nowrap">(500 kg-1 Ton)</span></span>
                </Link>
              </li>
              <li>
                <Link to="/dryers" className="hover:text-[#002DC2] text-black transition-colors block">
                  <span className="font-bold text-[#123B92] block">SOLDRY 300</span>
                  <span className="text-2xs text-slate-500 block">Industrial Multi-Unit Rig</span>
                </Link>
              </li>
              <li>
                <Link to="/dryers" className="hover:text-[#002DC2] text-black transition-colors block">
                  <span className="font-bold text-[#123B92] block">SUNDRY 50</span>
                  <span className="text-2xs text-slate-500 block">Stainless Box Dryer <span className="whitespace-nowrap">(50 kg)</span></span>
                </Link>
              </li>
              <li>
                <Link to="/dryers" className="hover:text-[#002DC2] text-black transition-colors block">
                  <span className="font-bold text-[#123B92] block">SUNDRY 12 &amp; 6</span>
                  <span className="text-2xs text-slate-500 block">Portable Micro Dryer Units</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Brochures & Downloads (3 cols on desktop) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-[#123B92] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#002DC2]" />
              <span>Product Brochures (PDF)</span>
            </h4>
            <div className="space-y-2.5">
              {brochures.map((b) => (
                <div 
                  key={b.id}
                  className="p-2.5 rounded-xl border border-slate-200/90 hover:border-[#002DC2] bg-white hover:bg-blue-50/20 transition-all flex items-center justify-between group shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setActiveBrochure(b)}
                    className="text-left flex-1 min-w-0 pr-2 focus:outline-none"
                    title={`Open and View ${b.title}`}
                  >
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-0.5">
                      <span className={`text-2xs font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${b.badgeColor}`}>
                        {b.badge}
                      </span>
                      <span className="text-2xs text-slate-500 font-medium whitespace-nowrap">
                        {b.pageCount} Pages • {b.size}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#002DC2] transition-colors block leading-snug">
                      {b.title}
                    </span>
                    <span className="text-2xs text-slate-500 block leading-snug line-clamp-2 mt-0.5">
                      {b.subtitle}
                    </span>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveBrochure(b)}
                      title="View PDF Brochure"
                      className="w-7 h-7 rounded-lg bg-blue-50 text-[#002DC2] hover:bg-[#002DC2] hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={b.url}
                      download={b.downloadName}
                      title="Direct Download PDF"
                      className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#002DC2] hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}

              <div className="pt-1">
                <Link 
                  to="/subsidies"
                  className="inline-flex items-center text-xs font-bold text-[#123B92] hover:text-[#002DC2] hover:underline transition-colors"
                >
                  <ArrowRight className="w-3 h-3 mr-1 text-[#002DC2]" />
                  <span>State Agriculture Subsidy Guide</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Col 4: Registered & Operations Hubs, Direct Contacts (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-[#123B92] uppercase tracking-wider mb-3">{t('footerOffices') || t('footerCoimbatoreFactory')}</h4>
            <div className="space-y-3 text-xs">
              
              <div className="flex items-start space-x-2.5">
                <Building2 className="w-4 h-4 text-[#002DC2] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#123B92] text-xs block">{t('regOfficeLabel')}:</span>
                  <p className="text-black leading-relaxed text-sm mt-0.5">{formatAddress(t('regOfficeAddress'))}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#002DC2] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#123B92] text-xs block">{t('opOfficeLabel')}:</span>
                  <p className="text-black leading-relaxed text-sm mt-0.5">{formatAddress(t('opOfficeAddress'))}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#002DC2] shrink-0" />
                  <div className="text-xs">
                    <a href="tel:+918903852623" className="hover:text-[#002DC2] font-bold text-[#123B92] block">+91-8903852623</a>
                    <a href="tel:+918098613422" className="hover:text-[#002DC2] font-bold text-[#123B92] block">+91 80986 13422</a>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-[#002DC2] shrink-0" />
                  <div className="text-xs">
                    <a href="mailto:zenitek2k@gmail.com" className="hover:text-[#002DC2] font-bold text-[#123B92] block">zenitek2k@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={onOpenQuoteModal}
                  className="w-full py-2.5 px-4 bg-[#23AC39] hover:bg-[#002DC2] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow cursor-pointer active:scale-[0.98]"
                >
                  <span>{t('getQuote')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Clean, Single-Line Bottom Bar */}
        <div className="pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-black">
          <p className="text-black font-medium text-center md:text-left">
            © {new Date().getFullYear()} <strong className="font-bold text-[#123B92]">ZeniTEK Solar Thermal Solutions</strong>. {t('footerRights')}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="text-black hover:text-[#002DC2] font-medium transition-colors cursor-pointer"
            >
              {t('footerPrivacy')}
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="text-black hover:text-[#002DC2] font-medium transition-colors cursor-pointer"
            >
              {t('footerTerms')}
            </button>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">
              Designed by{' '}
              <a
                href="https://knowledgetointelligence.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#002DC2] hover:underline font-bold transition-colors"
              >
                KnowledgeToIntelligence
              </a>
            </span>
          </div>
        </div>

      </div>

      {/* Privacy Policy & Terms Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                {legalModal === 'privacy' ? (
                  <Lock className="w-4 h-4 text-blue-700" />
                ) : (
                  <FileText className="w-4 h-4 text-green-700" />
                )}
                <h3 className="font-bold text-base text-slate-900">
                  {legalModal === 'privacy' ? t('footerPrivacy') : t('footerTerms')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs text-slate-600 space-y-3 overflow-y-auto">
              {legalModal === 'privacy' ? (
                <>
                  <p className="font-semibold text-slate-800">Privacy & Data Protection Notice</p>
                  <p>
                    ZeniTEK Solar Thermal Solutions respects your privacy. All contact and farm specifications submitted through our inquiry and quotation forms are used strictly for generating custom solar dryer technical proposals and subsidy estimations.
                  </p>
                  <p>
                    We never sell, rent, or trade your contact information or harvest data with third-party advertising brokers.
                  </p>
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                    <p className="font-bold">Contact Privacy Officer:</p>
                    <p>Email: zenitek2k@gmail.com | Phone: +91 8903852623</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-800">Terms of Service & Equipment Guarantee</p>
                  <p>
                    All solar thermal polyhouse dryers, cabinet dryers, and custom dehydration plants supplied by ZeniTEK are manufactured under ISO 9001:2015 quality standards and MNRE specifications.
                  </p>
                  <p>
                    Performance metrics, moisture extraction rates, and subsidy percentages are indicative guidelines based on standard sunny ambient weather conditions and regional state agriculture ministry policies.
                  </p>
                  <div className="p-3 bg-green-50/60 rounded-xl border border-green-100 text-xs text-green-900 space-y-1">
                    <p className="font-bold">Corporate Information:</p>
                    <p>GSTIN: 33AACFZ8530G1Z5 | ISO Certification: ZNK-9001-2026</p>
                  </div>
                </>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-1.5 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors shadow-sm"
              >
                {t('close') || 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Interactive High-Res PDF Brochure Viewer Modal */}
      {activeBrochure && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveBrochure(null)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#002DC2] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-base text-slate-900 truncate">
                      {activeBrochure.title}
                    </h3>
                    <span className="hidden sm:inline-block text-2xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#002DC2] border border-blue-200">
                      {activeBrochure.pageCount} Pages • {activeBrochure.size}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate hidden sm:block">
                    {activeBrochure.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Download Button */}
                <a
                  href={activeBrochure.url}
                  download={activeBrochure.downloadName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002DC2] hover:bg-[#002299] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  title="Download PDF to your computer/phone"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>

                {/* Open in New Tab / Native Viewer */}
                <a
                  href={activeBrochure.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                  title="Open Original PDF in New Window"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open in Tab</span>
                </a>

                {/* WhatsApp Share */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out the official ZeniTEK ${activeBrochure.title}: ${window.location.origin}${activeBrochure.url}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors"
                  title="Share via WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActiveBrochure(null)}
                  className="w-8 h-8 rounded-xl hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors ml-1"
                  title="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Switch Tabs & Page Navigator */}
            <div className="px-4 sm:px-6 py-2 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                  Brochures:
                </span>
                {brochures.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setActiveBrochure(b)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      activeBrochure.id === b.id
                        ? 'bg-[#002DC2] text-white shadow-sm'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {b.badge}: {b.title.replace(' Technical Brochure', '').replace(' Dryer', '')}
                  </button>
                ))}
              </div>

              {/* Page Quick Jump Links */}
              <div className="hidden md:flex items-center gap-1 overflow-x-auto text-xs font-bold text-slate-600">
                <span className="text-slate-400 mr-1">Jump to:</span>
                {activeBrochure.pages.map((_, i) => (
                  <a
                    key={i}
                    href={`#brochure-page-${i + 1}`}
                    className="w-5 h-5 rounded hover:bg-blue-100 hover:text-[#002DC2] flex items-center justify-center transition-colors"
                  >
                    {i + 1}
                  </a>
                ))}
              </div>
            </div>

            {/* Visual Document Pages Reader (No Auto-Download, Works Everywhere) */}
            <div className="flex-1 bg-slate-900/95 overflow-y-auto p-3 sm:p-6 flex flex-col items-center space-y-4 sm:space-y-6">
              {activeBrochure.pages.map((pageImg, idx) => (
                <div 
                  key={idx}
                  id={`brochure-page-${idx + 1}`}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full border border-slate-700/60"
                >
                  <div className="bg-slate-100 px-3 sm:px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs sm:text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#002DC2]" />
                      Page {idx + 1} of {activeBrochure.pageCount}
                    </span>
                    <span className="text-slate-400 font-mono text-2xs hidden sm:inline">
                      {activeBrochure.title}
                    </span>
                    <a
                      href={`#brochure-page-${idx + 1}`}
                      className="text-slate-400 hover:text-[#002DC2] text-2xs"
                    >
                      #P{idx + 1}
                    </a>
                  </div>
                  <img
                    src={pageImg}
                    alt={`${activeBrochure.title} - Page ${idx + 1}`}
                    className="w-full h-auto object-contain block bg-white"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            {/* Footer Toolbar */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold text-slate-900">{activeBrochure.title}</span>
                <span className="text-slate-400">•</span>
                <span>{activeBrochure.pageCount} Pages</span>
                <span className="text-slate-400">•</span>
                <span>{activeBrochure.size}</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={activeBrochure.url}
                  download={activeBrochure.downloadName}
                  className="font-bold text-[#002DC2] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF File
                </a>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBrochure(null);
                    if (onOpenQuoteModal) onOpenQuoteModal();
                  }}
                  className="font-bold text-[#123B92] hover:text-[#002DC2]"
                >
                  Request Technical Quotation →
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
}
