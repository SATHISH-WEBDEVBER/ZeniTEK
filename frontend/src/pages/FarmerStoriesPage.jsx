import React, { useState, useEffect } from 'react';
import {
  ArrowRight, Star, Ruler, Wrench, Handshake, MessageSquareQuote, MapPin
} from 'lucide-react';
import IconTile from '../components/IconTile';
import PageHero from '../components/PageHero';
import { sampleReviews } from '../data/sampleData';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../utils/api';

// Only real YouTube videos are embedded (from the reviews in the admin panel); anything else - an empty
// field, another site's address - shows no video. Uses YouTube's privacy-enhanced domain.
const youtubeEmbed = (url) => {
  const m = /^https:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})(?:[?&#].*)?$/.exec(String(url || '').trim());
  return m && m[1] !== 'dQw4w9WgXcQ' ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
};

export default function FarmerStoriesPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState(sampleReviews);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${API_BASE}/reviews`);
        const data = await res.json();
        if (data.success && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.log('Using sample reviews fallback:', err);
      }
    }
    fetchReviews();
  }, []);

  return (
    <div className="text-black min-h-screen bg-white">
      
      {/* SECTION 1: HERO (the impact figures live here) */}
      <PageHero
        images="/images/gallery/photo-02.webp"
        title={<>{t('storiesTitle1')} <span className="text-[#002DC2]">{t('storiesTitle2')}</span></>}
        subtitle={t('storiesSubtitle')}
        actions={[
          { label: t('startProsperityBtn'), onClick: () => onOpenQuoteModal(), icon: MessageSquareQuote },
          { label: t('hero_viewInstallations'), to: '/installations', icon: MapPin },
        ]}
        stats={[
          { value: '1,200+', label: t('impactFamilies') },
          { value: '₹4.2 Cr+', label: t('impactValue') },
          { value: '500+ Tons', label: t('impactCrops') },
        ]}
      />

      {/* SECTION 3: VIDEO REVIEWS (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B92]">{t('videoReviewsTitle')}</h2>
            <p className="text-base sm:text-lg text-black/60">{t('videoReviewsSub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map(rev => (
              <div key={rev._id} className="bg-white rounded-3xl overflow-hidden border border-[#123B92]/20 shadow-sm space-y-4 flex flex-col justify-between">
                {youtubeEmbed(rev.videoUrl) ? (
                  <div className="relative h-48 bg-black overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={youtubeEmbed(rev.videoUrl)}
                      title={rev.name}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  // no video for this review: its quote mark and the reviewer's initials instead
                  <div className="relative h-48 bg-gradient-to-br from-[#001b69] to-[#002DC2] flex items-center justify-center" aria-hidden="true">
                    <MessageSquareQuote className="absolute top-4 left-4 w-8 h-8 text-white/30" />
                    <span className="w-20 h-20 rounded-full bg-white/15 ring-2 ring-white/40 text-white text-2xl font-black flex items-center justify-center">
                      {String(rev.name || '').split(/\s+/).map(w => w.replace(/[^A-Za-z]/g, '')[0]).filter(Boolean).slice(-2).join('')}
                    </span>
                  </div>
                )}

                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#123B92]">{rev.name}</h3>
                    <span className="inline-flex items-center gap-1 text-2xs font-bold text-white bg-[#1A822B] px-2 py-0.5 rounded border border-[#23AC39]">
                      <Star className="w-4 h-4 fill-current" /> {rev.rating}.0
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#002DC2]">{rev.role} • {rev.location}</div>
                  <p className="text-sm text-black italic leading-relaxed">"{rev.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CASE STUDIES (EVEN SECTION - SOFT LIGHT TINT) */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B92]">{t('caseStudiesTitle')}</h2>
          </div>

          <div className="bg-[#F0F4FD] p-6 sm:p-8 rounded-3xl border border-[#123B92]/20 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <img src="/images/gallery/photo-02.webp" alt={t('gallery_caseStudyAlt')} className="w-full h-56 object-cover rounded-2xl border border-[#123B92]/20" />
            </div>
            <div className="lg:col-span-8 space-y-3">
              <span className="text-2xs font-bold text-[#123B92] bg-white border border-[#123B92]/20 px-2.5 py-0.5 rounded uppercase inline-block">
                {t('pollachiCollective')}
              </span>
              <h3 className="text-xl font-bold text-[#123B92]">{t('pollachiTitle')}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm">
                  <div className="text-[#123B92] font-bold">{t('probTitle')}</div>
                  <div className="text-black mt-1 leading-relaxed">{t('probDesc')}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm">
                  <div className="text-[#002DC2] font-bold">{t('solTitle')}</div>
                  <div className="text-black mt-1 leading-relaxed">{t('solDesc')}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-sm">
                  <div className="text-[#123B92] font-bold">{t('resTitle')}</div>
                  <div className="text-black mt-1 leading-relaxed">{t('resDesc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: SUPPORT GRID / COMMITMENT (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16 text-center space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B92]">{t('commitmentTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm space-y-2">
              <IconTile icon={Ruler} />
              <h3 className="text-xl font-bold text-[#123B92]">{t('comm1Title')}</h3>
              <p className="text-sm text-black leading-relaxed">{t('comm1Desc')}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm space-y-2">
              <IconTile icon={Wrench} tone="navy" />
              <h3 className="text-xl font-bold text-[#123B92]">{t('comm2Title')}</h3>
              <p className="text-sm text-black leading-relaxed">{t('comm2Desc')}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm space-y-2">
              <IconTile icon={Handshake} tone="green" />
              <h3 className="text-xl font-bold text-[#123B92]">{t('comm3Title')}</h3>
              <p className="text-sm text-black leading-relaxed">{t('comm3Desc')}</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-8 py-3.5 bg-[#1A822B] hover:bg-[#002DC2] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-md inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>{t('startProsperityBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
