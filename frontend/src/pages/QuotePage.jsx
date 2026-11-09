import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Phone } from 'lucide-react';
import LeadForm from '../components/LeadForm';
import PageHero from '../components/PageHero';
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
      <PageHero
        images="/images/gallery/photo-17.webp"
        title={t('sections_quoteTitle')}
        subtitle={t('quickFormDesc')}
        actions={[
          { label: t('chatWhatsapp'), href: 'https://wa.me/918098613422?text=Hi%20ZeniTEK%20Team!%20I%20want%20a%20quote%20for%20a%20ZeniTEK%20Solar%20Thermal%20Dryer.', external: true, icon: MessageCircle },
          { label: t('about_callDirectly'), href: 'tel:+918903852623', icon: Phone },
        ]}
        stats={[
          { value: 'MNRE', label: t('hero_quoteMnre') },
          { value: '30 sec', label: t('hero_quoteTime') },
          { value: '40–60%', label: t('subsidyHelp') },
        ]}
      />

      <section className="w-full py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadForm prefill={prefill} />
        </div>
      </section>
    </div>
  );
}
