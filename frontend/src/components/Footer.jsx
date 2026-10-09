import React from 'react';
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
import { brochures } from '../data/brochuresData';

export default function Footer({ onOpenQuoteModal }) {
  const { t } = useLanguage();
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
                <Link to="/solar-dryer-models/soldry-1210-150" className="hover:text-[#002DC2] text-black transition-colors block">
                  <span className="font-bold text-[#123B92] block">SOLDRY 1210</span>
                  <span className="text-2xs text-slate-500 block">Polyhouse Tunnel <span className="whitespace-nowrap">(100-300 kg)</span></span>
                </Link>
              </li>
              <li>
                <Link to="/solar-dryer-models/soldry-1709-200" className="hover:text-[#002DC2] text-black transition-colors block">
                  <span className="font-bold text-[#123B92] block">SOLDRY 1709</span>
                  <span className="text-2xs text-slate-500 block">Commercial Tunnel <span className="whitespace-nowrap">(500 kg-1 Ton)</span></span>
                </Link>
              </li>
              <li>
                <Link to="/solar-dryer-models/soldry-1210-300" className="hover:text-[#002DC2] text-black transition-colors block">
                  <span className="font-bold text-[#123B92] block">SOLDRY 300</span>
                  <span className="text-2xs text-slate-500 block">Industrial Multi-Unit Rig</span>
                </Link>
              </li>
              <li>
                <Link to="/solar-dryer-models/sundry-50" className="hover:text-[#002DC2] text-black transition-colors block">
                  <span className="font-bold text-[#123B92] block">SUNDRY 50</span>
                  <span className="text-2xs text-slate-500 block">Stainless Box Dryer <span className="whitespace-nowrap">(50 kg)</span></span>
                </Link>
              </li>
              <li>
                <Link to="/solar-dryer-models/sundry-12" className="hover:text-[#002DC2] text-black transition-colors block">
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
                  className="p-2.5 rounded-xl border border-slate-200/90 hover:border-[#002DC2] bg-white hover:bg-[#F0F4FD] transition-all flex items-center justify-between group shadow-sm"
                >
                  <Link
                    to={`/brochures/${b.id}`}
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
                    <span className="text-xs font-bold text-[#123B92] group-hover:text-[#002DC2] transition-colors block leading-snug">
                      {b.title}
                    </span>
                    <span className="text-2xs text-slate-500 block leading-snug line-clamp-2 mt-0.5">
                      {b.subtitle}
                    </span>
                  </Link>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      to={`/brochures/${b.id}`}
                      title="View PDF Brochure"
                      aria-label={`View ${b.title}`}
                      className="w-7 h-7 rounded-lg bg-[#F0F4FD] text-[#002DC2] hover:bg-[#002DC2] hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
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
            <Link to="/privacy" className="text-black hover:text-[#002DC2] font-medium transition-colors">
              {t('footerPrivacy')}
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/terms" className="text-black hover:text-[#002DC2] font-medium transition-colors">
              {t('footerTerms')}
            </Link>
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

    </footer>
  );
}
