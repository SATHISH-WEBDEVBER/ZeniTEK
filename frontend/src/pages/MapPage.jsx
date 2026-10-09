import React from 'react';
import MapComponent from '../components/MapComponent';
import { MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import IconTile from '../components/IconTile';

// Installations page: every working ZeniTEK site on an interactive map.
export default function MapPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  return (
    <div className="text-black min-h-screen bg-white">
      <PageHero
        images="/real-photos/zenitek_photo_21.jpeg"
        badge={t('mapShowcaseBadge')}
        title={<>{t('mapTitle1')} <br /><span className="text-[#1A822B]">{t('mapTitle2')}</span></>}
        subtitle={t('mapSubtitle')}
      />

      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <IconTile icon={MapPin} size="md" />
              <div>
                <h2 className="text-lg font-bold text-[#123B92]">{t('visitTitle')}</h2>
                <p className="text-sm text-slate-600">{t('visitDesc')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenQuoteModal()}
              className="inline-flex items-center gap-2 py-3 px-5 bg-[#002DC2] hover:bg-[#123B92] text-white font-bold text-sm rounded-xl transition-colors shadow shrink-0 cursor-pointer"
            >
              {t('bookVisitBtn')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
