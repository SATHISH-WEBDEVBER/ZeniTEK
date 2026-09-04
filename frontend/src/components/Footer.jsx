import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Phone, Mail, MapPin, Download, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-blue-900">
                ZeniTEK Solar
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 max-w-sm">
              ZeniTEK is India's leading designer & manufacturer of high-efficiency polyhouse greenhouse solar thermal dryers. Engineered in Coimbatore to eliminate post-harvest waste for farmers, FPOs, and exporters.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-50 text-green-800 border border-green-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-green-600" /> MNRE Enlisted
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                ISO 9001:2015
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Dryer Models</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/dryers?model=portable" className="hover:text-blue-700 transition-colors">Portable DIY Solar Dryer (10-50 kg)</Link></li>
              <li><Link to="/dryers?model=polyhouse" className="hover:text-blue-700 transition-colors">Polyhouse Tunnel Dryer (100-500 kg)</Link></li>
              <li><Link to="/dryers?model=industrial" className="hover:text-blue-700 transition-colors">Industrial Multi-Tunnel Dryer (1 Ton+)</Link></li>
              <li><Link to="/applications" className="hover:text-blue-700 transition-colors">Crop Moisture Parameter Chart</Link></li>
              <li><Link to="/gallery" className="hover:text-blue-700 transition-colors">Installation Photo Gallery</Link></li>
            </ul>
          </div>

          {/* Col 3: Downloads & Subsidy */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Downloads & Guides</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href="#download-catalog" onClick={(e) => { e.preventDefault(); alert('Downloading ZeniTEK Solar Dryer Product Catalog PDF...'); }} className="inline-flex items-center text-blue-700 hover:underline">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Product Catalog (PDF)
                </a>
              </li>
              <li>
                <a href="#download-subsidy" onClick={(e) => { e.preventDefault(); alert('Downloading State Agriculture Subsidy Guide PDF...'); }} className="inline-flex items-center text-green-700 hover:underline">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Govt Subsidy Guide 2026
                </a>
              </li>
              <li>
                <a href="#copra-report" onClick={(e) => { e.preventDefault(); alert('Downloading Copra Drying Lab Report PDF...'); }} className="inline-flex items-center text-slate-700 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Copra Lab Test Report
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Factory Address */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Coimbatore Factory</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>ZeniTEK Solar Works, SF 248/1, SIDCO Industrial Estate, Malumichampatti, Coimbatore, Tamil Nadu 641021</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-700 shrink-0" />
                <a href="tel:+919442589000" className="hover:text-blue-700 font-semibold">+91 94425 89000 / +91 422 2689000</a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-700 shrink-0" />
                <a href="mailto:sales@zenitek.in" className="hover:text-blue-700">sales@zenitek.in</a>
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
          <p>© {new Date().getFullYear()} ZeniTEK Solar Thermal Solutions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 cursor-pointer">ISO Certification: ZNK-9001-2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
