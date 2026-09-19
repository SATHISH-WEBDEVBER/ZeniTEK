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
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null

  return (
    <footer className="bg-white border-t-2 border-[#123B92] text-black pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#123B92]/15">
          
          {/* Col 1: Brand Info & Accreditations (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="ZeniTEK - Towards Sustainable Future"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs leading-relaxed text-black max-w-sm">
              {t('footerAbout')}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#F0F4FD] text-[#123B92] border border-[#002DC2] shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#002DC2] shrink-0" /> {t('mnreBadge')}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#F0F4FD] text-[#123B92] border border-[#002DC2] shadow-2xs">
                {t('isoBadge')}
              </span>
            </div>
          </div>

          {/* Col 2: Dryer Models (2 cols on desktop) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#123B92] uppercase tracking-wider mb-4">{t('footerDryerModels')}</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/dryers?model=portable" className="hover:text-[#002DC2] text-black transition-colors block">
                  {t('modelPortable')} <span className="text-[10px] text-black/60 block sm:inline">(10-50 kg)</span>
                </Link>
              </li>
              <li>
                <Link to="/dryers?model=polyhouse" className="hover:text-[#002DC2] text-black transition-colors block">
                  {t('modelPolyhouse')} <span className="text-[10px] text-black/60 block sm:inline">(100-500 kg)</span>
                </Link>
              </li>
              <li>
                <Link to="/dryers?model=industrial" className="hover:text-[#002DC2] text-black transition-colors block">
                  {t('modelIndustrial')} <span className="text-[10px] text-black/60 block sm:inline">(1 Ton+)</span>
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-[#002DC2] text-black transition-colors block">
                  {t('matrixCropTitle')}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#002DC2] text-black transition-colors block">
                  {t('galleryBadge')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Downloads & Resources (2 cols on desktop) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#123B92] uppercase tracking-wider mb-4">{t('footerDownloads')}</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a 
                  href="#download-catalog" 
                  onClick={(e) => { e.preventDefault(); alert('Downloading ZeniTEK Solar Dryer Product Catalog PDF...'); }} 
                  className="inline-flex items-center text-[#002DC2] hover:underline font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#002DC2]" /> 
                  <span>{t('footerCatalog')}</span>
                </a>
              </li>
              <li>
                <a 
                  href="#download-subsidy" 
                  onClick={(e) => { e.preventDefault(); alert('Downloading State Agriculture Subsidy Guide PDF...'); }} 
                  className="inline-flex items-center text-[#123B92] hover:text-[#002DC2] hover:underline font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#002DC2]" /> 
                  <span>{t('footerSubsidyGuide')}</span>
                </a>
              </li>
              <li>
                <a 
                  href="#copra-report" 
                  onClick={(e) => { e.preventDefault(); alert('Downloading Copra Drying Lab Report PDF...'); }} 
                  className="inline-flex items-center text-black hover:text-[#002DC2] hover:underline transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-[#002DC2] shrink-0" /> 
                  <span>{t('footerLabReport')}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Registered & Operations Hubs, Direct Contacts (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-[#123B92] uppercase tracking-wider mb-3">{t('footerOffices') || t('footerCoimbatoreFactory')}</h4>
            <div className="space-y-3 text-xs">
              
              <div className="flex items-start space-x-2.5">
                <Building2 className="w-4 h-4 text-[#002DC2] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#123B92] text-[11px] block">{t('regOfficeLabel')}:</span>
                  <p className="text-black leading-relaxed text-[11px] mt-0.5">{t('regOfficeAddress')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#002DC2] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#123B92] text-[11px] block">{t('opOfficeLabel')}:</span>
                  <p className="text-black leading-relaxed text-[11px] mt-0.5">{t('opOfficeAddress')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#002DC2] shrink-0" />
                  <div className="text-[11px]">
                    <a href="tel:+918903852623" className="hover:text-[#002DC2] font-bold text-[#123B92] block">+91-8903852623</a>
                    <a href="tel:+918098613422" className="hover:text-[#002DC2] font-medium text-black block">+91 80986 13422</a>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-[#002DC2] shrink-0" />
                  <div className="text-[11px]">
                    <a href="mailto:zenitek2k@gmail.com" className="hover:text-[#002DC2] font-semibold text-[#123B92] block">zenitek2k@gmail.com</a>
                    <a href="mailto:sales@zenitek.in" className="hover:text-[#002DC2] text-black block">sales@zenitek.in</a>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={onOpenQuoteModal}
                  className="w-full py-2.5 px-4 bg-[#00FB00] hover:bg-[#002DC2] text-black hover:text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow cursor-pointer active:scale-98"
                >
                  <span>{t('getQuote')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Clean, Perfectly Aligned Bottom Bar */}
        <div className="pt-6 border-t border-[#123B92]/15 mt-2 space-y-4">
          
          {/* Row 1: Copyright & Regulatory Badges */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-black">
            <p className="text-black font-medium text-center md:text-left">
              © {new Date().getFullYear()} <strong className="font-bold text-[#123B92]">ZeniTEK Solar Thermal Solutions</strong>. {t('footerRights')}
            </p>

            <div className="flex items-center justify-center md:justify-end space-x-3 text-[11px]">
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="text-black hover:text-[#002DC2] font-medium transition-colors cursor-pointer"
              >
                {t('footerPrivacy')}
              </button>
              <span className="text-[#123B92]/30">•</span>
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="text-black hover:text-[#002DC2] font-medium transition-colors cursor-pointer"
              >
                {t('footerTerms')}
              </button>
            </div>
          </div>

          {/* Row 2: Subtle Mission & Agency Attributions Sub-bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 text-center sm:text-left">
            <p>
              Pioneering clean agritech solar thermal food preservation across India since 2004.
            </p>
            <p className="font-medium text-slate-500">
              Designed by{' '}
              <a
                href="https://knowledgetointelligence.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 hover:underline font-bold transition-colors inline-flex items-center"
              >
                KnowledgeToIntelligence
              </a>
            </p>
          </div>

        </div>

      </div>

      {/* Privacy Policy & Terms Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                {legalModal === 'privacy' ? (
                  <Lock className="w-4 h-4 text-blue-700" />
                ) : (
                  <FileText className="w-4 h-4 text-green-700" />
                )}
                <h3 className="font-bold text-sm text-slate-900">
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
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 space-y-1">
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
                  <div className="p-3 bg-green-50/60 rounded-xl border border-green-100 text-[11px] text-green-900 space-y-1">
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
                className="px-4 py-1.5 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors shadow-2xs"
              >
                {t('close') || 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
}
