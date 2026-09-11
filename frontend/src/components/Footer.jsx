import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Phone, Mail, MapPin, Download, ShieldCheck, ExternalLink, ArrowRight, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="ZeniTEK - Towards Sustainable Future"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs leading-relaxed text-slate-600 max-w-sm">
              {t('footerAbout')}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-50 text-green-800 border border-green-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-green-600" /> {t('mnreBadge')}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {t('isoBadge')}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">{t('footerDryerModels')}</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/dryers?model=portable" className="hover:text-blue-700 transition-colors">{t('modelPortable')} (10-50 kg)</Link></li>
              <li><Link to="/dryers?model=polyhouse" className="hover:text-blue-700 transition-colors">{t('modelPolyhouse')} (100-500 kg)</Link></li>
              <li><Link to="/dryers?model=industrial" className="hover:text-blue-700 transition-colors">{t('modelIndustrial')} (1 Ton+)</Link></li>
              <li><Link to="/applications" className="hover:text-blue-700 transition-colors">{t('matrixCropTitle')}</Link></li>
              <li><Link to="/gallery" className="hover:text-blue-700 transition-colors">{t('galleryBadge')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Downloads & Subsidy */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">{t('footerDownloads')}</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href="#download-catalog" onClick={(e) => { e.preventDefault(); alert('Downloading ZeniTEK Solar Dryer Product Catalog PDF...'); }} className="inline-flex items-center text-blue-700 hover:underline">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> {t('footerCatalog')}
                </a>
              </li>
              <li>
                <a href="#download-subsidy" onClick={(e) => { e.preventDefault(); alert('Downloading State Agriculture Subsidy Guide PDF...'); }} className="inline-flex items-center text-green-700 hover:underline">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> {t('footerSubsidyGuide')}
                </a>
              </li>
              <li>
                <a href="#copra-report" onClick={(e) => { e.preventDefault(); alert('Downloading Copra Drying Lab Report PDF...'); }} className="inline-flex items-center text-slate-700 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {t('footerLabReport')}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Offices & Locations */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">{t('footerOffices') || t('footerCoimbatoreFactory')}</h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start space-x-2">
                <Building2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-[11px] block">{t('regOfficeLabel')}:</span>
                  <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5">{t('regOfficeAddress')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-[11px] block">{t('opOfficeLabel')}:</span>
                  <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5">{t('opOfficeAddress')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <Phone className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[11px]">
                  <div>
                    <a href="tel:+918903852623" className="hover:text-blue-700 font-bold text-blue-900">+91-8903852623</a>
                  </div>
                  <div>
                    <a href="tel:+918098613422" className="hover:text-blue-700 font-semibold text-slate-700">+91 80986 13422</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[11px]">
                  <div>
                    <a href="mailto:zenitek2k@gmail.com" className="hover:text-blue-700 font-semibold text-blue-900">zenitek2k@gmail.com</a>
                  </div>
                  <div>
                    <a href="mailto:sales@zenitek.in" className="hover:text-blue-700 text-slate-600">sales@zenitek.in</a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenQuoteModal}
                  className="w-full py-2 px-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-bold text-blue-800 flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>{t('getQuote')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ZeniTEK Solar Thermal Solutions. {t('footerRights')}</p>
          <p className="mt-2 md:mt-0 font-medium">
            Designed by{' '}
            <a
              href="https://knowledgetointelligence.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 hover:underline font-bold transition-colors"
            >
              KnowledgeToIntelligence
            </a>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0 items-center">
            <span className="font-mono text-blue-900 font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
              GSTIN: 33AACFZ8530G1Z5
            </span>
            <span className="hover:text-slate-900 cursor-pointer">{t('footerPrivacy')}</span>
            <span className="hover:text-slate-900 cursor-pointer">{t('footerTerms')}</span>
            <span className="hover:text-slate-900 cursor-pointer">ISO Certification: ZNK-9001-2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
