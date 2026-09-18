import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PhoneCall, ArrowRight, ShieldCheck, Wrench, FileCheck2, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SolarDryersPage({ onOpenQuoteModal }) {
  const { t, lang } = useLanguage();

  const isTamil = lang === 'ta';

  return (
    <div className="min-h-[75vh] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto w-full text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full shadow-sm">
          <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
          <span>
            {isTamil ? 'அட்டவணை புதுப்பித்தல் பணியில் உள்ளது' : 'Catalogue Update In Progress'}
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-blue-950 tracking-tight">
            {isTamil ? 'சோலார் உலர்த்தி மாடல்கள்' : 'Solar Dryer Models & Specifications'}
            <span className="block text-green-700 mt-2 text-2xl sm:text-3xl font-extrabold">
              {isTamil ? 'விரைவில் புதிய 2026 பதிப்புகளுடன்' : 'New 2026 Models Coming Soon'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {isTamil
              ? 'எங்கள் சோலார் உலர்த்திகளின் புதிய மாடல்கள், தொழில்நுட்ப விவரக்குறிப்புகள் மற்றும் அரசு மானிய வழிகாட்டிகள் தற்போது புதுப்பிக்கப்பட்டு வருகின்றன. உற்பத்தி மற்றும் தனிப்பயனாக்கப்பட்ட தயாரிப்பு சேவைகள் வழக்கம் போல் செயல்படுகின்றன.'
              : 'Our complete solar thermal dryer catalogue is currently being updated with new high-efficiency UV models, enhanced capacity ranges, and updated 2026 MNRE & State Agriculture subsidy schemes.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Custom Solar Dryer Inquiry' })}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <span>{t('getQuote')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-300 hover:border-blue-600 text-slate-800 hover:text-blue-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-blue-700" />
            <span>{t('callUs')}</span>
          </Link>
        </div>

        {/* Info Cards */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              {isTamil ? 'தனிப்பயன் வடிவமைப்பு' : 'Custom Sizing & Fabrication'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isTamil
                ? 'உங்கள் பண்ணை விளைச்சலுக்கு ஏற்ப 10 கி.கி முதல் 10 டன் வரை தனிப்பயனாக்கப்பட்ட உலர்த்திகள்.'
                : 'Engineered polyhouse and walk-in tunnel dryers tailored to your crop type and daily harvest capacity.'}
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              {isTamil ? '40% - 60% அரசு மானியம்' : '40% - 60% Govt Subsidy'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isTamil
                ? 'MNRE, நபார்டு மற்றும் தோட்டக்கலைத்துறை மானிய அனுமதிகளுக்கான முழுமையான உதவி.'
                : 'End-to-end documentation support for MNRE, NABARD, and State Agriculture subsidy schemes.'}
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              {isTamil ? 'நேரடி நிறுவல் & பயிற்சி' : 'On-Farm Installation'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isTamil
                ? 'எங்கள் பொறியாளர்களின் நேரடி கள நிறுவல் மற்றும் உலர்த்தும் அளவுரு பயிற்சிகள்.'
                : 'Complete structural erection at your farm with operator training and moisture testing support.'}
            </p>
          </div>
        </div>

        {/* Direct Helpline Note */}
        <div className="pt-4 text-xs text-slate-500 font-medium">
          {isTamil ? 'உடனடி உதவி மற்றும் விலை விவரங்களுக்கு அழைக்கவும்: ' : 'For immediate consultation and quote inquiries: '}
          <a href="tel:+918098613422" className="text-blue-700 font-bold hover:underline">
            +91 80986 13422
          </a>
        </div>

      </div>
    </div>
  );
}
