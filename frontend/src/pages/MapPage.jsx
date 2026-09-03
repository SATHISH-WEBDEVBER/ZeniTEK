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
        <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 border border-green-200 px-3 py-1 rounded-full">
          GEOGRAPHICAL WORK SHOWCASE
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-blue-950">
          Active Solar Dryer Installations <br />
          <span className="text-green-700">
            Across South India & Beyond
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium">
          Explore our interactive project map. Click any marker or filter by state on the sidebar to view active polyhouse dryer installations, capacities, and crop moisture results.
        </p>
      </div>

      {/* Map Component Container */}
      <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />

      {/* Footer Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-blue-700 shrink-0" />
          <div>
            <div className="text-sm font-bold text-slate-900">Want to Visit an Active Solar Dryer Installation Near You?</div>
            <div className="text-xs text-slate-500">We arrange live site visits for FPO directors, government officials, and farmers.</div>
          </div>
        </div>

        <button
          onClick={() => onOpenQuoteModal()}
          className="py-2.5 px-5 bg-gradient-to-r from-blue-700 to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow shrink-0"
        >
          Book Live Site Visit
        </button>
      </div>

    </div>
  );
}
