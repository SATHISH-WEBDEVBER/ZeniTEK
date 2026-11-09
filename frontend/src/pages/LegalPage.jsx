import React from 'react';
import { Phone, Mail, MessageSquareQuote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

// Privacy Policy (/privacy) and Terms of Service (/terms)
export default function LegalPage({ type }) {
  const { t } = useLanguage();
  const isPrivacy = type === 'privacy';

  const hero = isPrivacy
    ? {
        images: '/images/gallery/photo-20.webp',
        title: t('footerPrivacy'),
        subtitle: t('hero_privacySub'),
        actions: [
          { label: t('navContact'), to: '/contact', icon: Phone },
          { label: t('hero_emailUs'), href: 'mailto:zenitek2k@gmail.com', icon: Mail },
        ],
        stats: [
          { value: '100%', label: t('hero_privacy1') },
          { value: '0', label: t('hero_privacy2') },
          { value: '2', label: t('hero_privacy3') },
        ],
      }
    : {
        images: '/images/gallery/photo-38.webp',
        title: t('footerTerms'),
        subtitle: t('hero_termsSub'),
        actions: [
          { label: t('getQuote'), to: '/quote', icon: MessageSquareQuote },
          { label: t('navContact'), to: '/contact', icon: Phone },
        ],
        stats: [
          { value: 'ISO 9001', label: t('hero_terms1') },
          { value: 'MNRE', label: t('hero_terms2') },
          { value: 'GST', label: t('hero_terms3') },
        ],
      };

  return (
    <div className="bg-white">
      <PageHero {...hero} />

      <section className="w-full py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-base text-slate-700 leading-relaxed">
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
      </section>
    </div>
  );
}
