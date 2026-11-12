import React, { useEffect, useRef } from 'react';
import { CheckCircle2, AlertTriangle, MessageCircle, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { whatsappLink, leadMessage } from '../utils/leads';

// What happened after a quote / contact form was sent. Success only when the server confirmed it;
// otherwise the visitor can send the same details on WhatsApp (a link they click, so pop-up
// blockers do not stop it) or try again. Focus moves here so screen readers announce it.
export default function LeadResult({ status, lead, whatsappUrl, successTitle, successBody, onRetry }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, [status]);

  if (status === 'sent') {
    return (
      <div ref={ref} tabIndex={-1} role="status" className="p-5 sm:p-6 rounded-2xl bg-[#F0F4FD] border-2 border-[#1A822B] text-center space-y-3 outline-none">
        <CheckCircle2 className="w-12 h-12 text-[#1A822B] mx-auto" />
        <p className="text-lg font-bold text-[#123B92]">{successTitle}</p>
        {successBody && <p className="text-sm text-black/70">{successBody}</p>}
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-fx inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1A822B] hover:bg-[#166A26] text-white text-sm font-extrabold">
            <MessageCircle className="w-5 h-5" /> {t('common_form_openWa')}
          </a>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} tabIndex={-1} role="alert" className="p-5 sm:p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3 outline-none">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-[#123B92]">{t('common_form_failTitle')}</p>
          <p className="text-sm text-black/75 mt-1">{t('common_form_failBody')}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <a href={whatsappLink(leadMessage(lead))} target="_blank" rel="noopener noreferrer" className="btn-fx flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1A822B] hover:bg-[#166A26] text-white text-sm font-extrabold">
          <MessageCircle className="w-5 h-5" /> {t('common_form_sendWa')}
        </a>
        <button type="button" onClick={onRetry} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#123B92]/30 text-[#123B92] text-sm font-bold hover:bg-white cursor-pointer">
          <RotateCcw className="w-4 h-4" /> {t('common_form_tryAgain')}
        </button>
      </div>
    </div>
  );
}
