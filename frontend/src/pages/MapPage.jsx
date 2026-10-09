import React from 'react';
import MapComponent from '../components/MapComponent';
import { MapPin, ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MapPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#1A822B] uppercase tracking-widest bg-[#23AC39]/10 border border-[#23AC39]/30 px-3 py-1 rounded-full inline-block">
          {t('mapShowcaseBadge')}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#123B92]">
          {t('mapTitle1')} <br />
          <span className="text-[#1A822B]">
            {t('mapTitle2')}
          </span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
          {t('mapSubtitle')}
        </p>
      </div>

      {/* Map Component Container */}
      <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />

      {/* Footer Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-[#002DC2] shrink-0" />
          <div>
            <div className="text-sm font-bold text-[#123B92]">{t('visitTitle')}</div>
            <div className="text-xs text-slate-500">{t('visitDesc')}</div>
          </div>
        </div>

        <button
          onClick={() => onOpenQuoteModal()}
          className="py-2.5 px-5 bg-gradient-to-r from-blue-700 to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow shrink-0"
        >
          {t('bookVisitBtn')}
        </button>
      </div>

    </div>
  );
}
