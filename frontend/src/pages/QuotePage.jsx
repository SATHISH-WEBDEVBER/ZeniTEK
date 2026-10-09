import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, MessageCircle, Clock } from 'lucide-react';
import LeadForm from '../components/LeadForm';
import PageBackBar from '../components/PageBackBar';
import { useLanguage } from '../context/LanguageContext';

// Prefill keys accepted in the URL, e.g. /quote?crop=Spices/Chillies&capacity=SOLDRY%201210
export const QUOTE_PARAMS = {
  name: 'name',
  phone: 'phone',
  state: 'state',
  district: 'district',
  clientType: 'client',
  cropType: 'crop',
  capacityNeeded: 'capacity',
  message: 'message'
};

// Builds a /quote URL from the prefill objects the site's quote buttons pass around.
export const buildQuoteUrl = (prefill = {}) => {
  const params = new URLSearchParams();
  Object.entries(QUOTE_PARAMS).forEach(([key, param]) => {
    if (prefill[key]) params.set(param, String(prefill[key]));
  });
  const qs = params.toString();
  return qs ? `/quote?${qs}` : '/quote';
};

export default function QuotePage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const prefill = useMemo(() => {
    const data = {};
    Object.entries(QUOTE_PARAMS).forEach(([key, param]) => {
      const v = searchParams.get(param);
      if (v) data[key] = v;
    });
    return data;
  }, [searchParams]);

  return (
    <div className="bg-white">
      <section className="w-full py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <PageBackBar crumbs={[{ label: t('getQuote') }]} fallback="/" />

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black text-[#002DC2] uppercase tracking-wider bg-[#F0F4FD] border border-[#002DC2]/20 px-3.5 py-1.5 rounded-full inline-block">
              Official Enquiry
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {t('getQuote')} & Subsidy Sizing
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              {t('quickFormDesc')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <LeadForm prefill={prefill} />
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-semibold text-slate-700">
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#002DC2] shrink-0" /> {t('mnreBadge')}
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200">
              <MessageCircle className="w-4 h-4 text-[#23AC39] shrink-0" /> WhatsApp follow-up
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200">
              <Clock className="w-4 h-4 text-[#002DC2] shrink-0" /> {t('subsidyHelp')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
