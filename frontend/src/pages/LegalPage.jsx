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
                <h2 className="text-xl font-black text-[#123B92]">Privacy & Data Protection Notice</h2>
                <p>
                  ZeniTEK Solar Thermal Solutions respects your privacy. All contact and farm specifications submitted through our inquiry and quotation forms are used strictly for generating custom solar dryer technical proposals and subsidy estimations.
                </p>
                <p>
                  We never sell, rent, or trade your contact information or harvest data with third-party advertising brokers.
                </p>
                <div className="p-4 bg-[#F0F4FD] rounded-xl border border-[#002DC2]/20 text-[#123B92] space-y-1">
                  <p className="font-bold">Contact Privacy Officer:</p>
                  <p>Email: <a href="mailto:zenitek2k@gmail.com" className="underline">zenitek2k@gmail.com</a> | Phone: <a href="tel:+918903852623" className="underline">+91 8903852623</a></p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-black text-[#123B92]">Terms of Service & Equipment Guarantee</h2>
                <p>
                  All solar thermal polyhouse dryers, cabinet dryers, and custom dehydration plants supplied by ZeniTEK are manufactured under ISO 9001:2015 quality standards and MNRE specifications.
                </p>
                <p>
                  Performance metrics, moisture extraction rates, and subsidy percentages are indicative guidelines based on standard sunny ambient weather conditions and regional state agriculture ministry policies.
                </p>
                <div className="p-4 bg-[#23AC39]/10 rounded-xl border border-[#23AC39]/30 text-[#1A822B] space-y-1">
                  <p className="font-bold">Corporate Information:</p>
                  <p>GSTIN: 33AACFZ8530G1Z5 | ISO Certification: ZNK-9001-2026</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
