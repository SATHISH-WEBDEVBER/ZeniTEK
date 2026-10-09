import React from 'react';
import { Lock, FileText } from 'lucide-react';
import PageBackBar from '../components/PageBackBar';
import { useLanguage } from '../context/LanguageContext';

// Privacy Policy (/privacy) and Terms of Service (/terms)
export default function LegalPage({ type }) {
  const { t } = useLanguage();
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t('footerPrivacy') : t('footerTerms');
  const Icon = isPrivacy ? Lock : FileText;

  return (
    <div className="bg-white">
      <section className="w-full py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <PageBackBar crumbs={[{ label: title }]} fallback="/" />

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F4FD] text-[#002DC2] flex items-center justify-center mx-auto">
              <Icon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{title}</h1>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 text-base text-slate-700 leading-relaxed">
            {isPrivacy ? (
              <>
                <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">{t('sections_privacyHeading')}</h2>
                <p>{t('sections_privacyP1')}</p>
                <p>{t('sections_privacyP2')}</p>
                <div className="p-4 bg-[#F0F4FD] rounded-xl border border-[#002DC2]/20 text-[#123B92] space-y-1">
                  <p className="font-bold">{t('sections_privacyContact')}</p>
                  <p>{t('sections_email')}: <a href="mailto:zenitek2k@gmail.com" className="underline">zenitek2k@gmail.com</a> | {t('sections_phone')}: <a href="tel:+918903852623" className="underline">+91 8903852623</a></p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-black text-[#123B92]">{t('sections_termsHeading')}</h2>
                <p>{t('sections_termsP1')}</p>
                <p>{t('sections_termsP2')}</p>
                <div className="p-4 bg-[#23AC39]/10 rounded-xl border border-[#23AC39]/30 text-[#1A822B] space-y-1">
                  <p className="font-bold">{t('sections_corporateInfo')}</p>
                  <p>GSTIN: 33AACFZ8530G1Z5 | {t('sections_isoCert')}: ZNK-9001-2026</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
