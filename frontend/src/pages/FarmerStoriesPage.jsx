import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, ShieldCheck, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sampleReviews } from '../data/sampleData';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerStoriesPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState(sampleReviews);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
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
      
      {/* SECTION 1: HERO TITLE (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#123B92] uppercase tracking-widest bg-[#F0F4FD] border border-[#123B92]/30 px-3 py-1 rounded-full">
            {t('storiesBadge')}
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#123B92]">
            {t('storiesTitle1')} <br />
            <span className="text-[#002DC2]">
              {t('storiesTitle2')}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-black max-w-2xl mx-auto font-medium leading-relaxed">
            {t('storiesSubtitle')}
          </p>
        </div>
      </section>

      {/* SECTION 2: GLOBAL IMPACT DASHBOARD (EVEN SECTION - SOFT LIGHT TINT) */}
      <section className="w-full section-even py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-[#123B92]">1,200+</div>
              <div className="text-xs text-black font-semibold mt-1">{t('impactFamilies')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-[#002DC2]">₹4.2 Cr+</div>
              <div className="text-xs text-black font-semibold mt-1">{t('impactValue')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-[#123B92]">500+ Tons</div>
              <div className="text-xs text-black font-semibold mt-1">{t('impactCrops')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-[#002DC2]">100%</div>
              <div className="text-xs text-black font-semibold mt-1">{t('impactCleanEnergy')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VIDEO REVIEWS (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B92]">{t('videoReviewsTitle')}</h2>
            <p className="text-xs text-black/60">{t('videoReviewsSub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map(rev => (
              <div key={rev._id} className="bg-white rounded-3xl overflow-hidden border border-[#123B92]/20 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="relative h-48 bg-black overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={rev.videoUrl}
                    title={rev.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#123B92]">{rev.name}</h3>
                    <span className="text-[10px] font-bold text-black bg-[#00FB00] px-2 py-0.5 rounded border border-[#00FB00]">
                      ★ {rev.rating}.0
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#002DC2]">{rev.role} • {rev.location}</div>
                  <p className="text-xs text-black italic leading-relaxed">"{rev.comment}"</p>
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B92]">{t('caseStudiesTitle')}</h2>
          </div>

          <div className="bg-[#F0F4FD] p-6 sm:p-8 rounded-3xl border border-[#123B92]/20 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <img src="/real-photos/zenitek_photo_02.jpeg" alt="Commercial Field Case Study" className="w-full h-56 object-cover rounded-2xl border border-[#123B92]/20" />
            </div>
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[10px] font-bold text-[#123B92] bg-white border border-[#123B92]/20 px-2.5 py-0.5 rounded uppercase">
                {t('pollachiCollective')}
              </span>
              <h3 className="text-xl font-bold text-[#123B92]">{t('pollachiTitle')}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-xs">
                  <div className="text-[#123B92] font-bold">{t('probTitle')}</div>
                  <div className="text-black mt-1 leading-relaxed">{t('probDesc')}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-xs">
                  <div className="text-[#002DC2] font-bold">{t('solTitle')}</div>
                  <div className="text-black mt-1 leading-relaxed">{t('solDesc')}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#123B92]/20 shadow-xs">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B92]">{t('commitmentTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm space-y-2">
              <CheckCircle2 className="w-6 h-6 text-[#002DC2] mx-auto" />
              <h3 className="text-sm font-bold text-[#123B92]">{t('comm1Title')}</h3>
              <p className="text-xs text-black leading-relaxed">{t('comm1Desc')}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm space-y-2">
              <CheckCircle2 className="w-6 h-6 text-[#123B92] mx-auto" />
              <h3 className="text-sm font-bold text-[#123B92]">{t('comm2Title')}</h3>
              <p className="text-xs text-black leading-relaxed">{t('comm2Desc')}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-[#123B92]/20 shadow-sm space-y-2">
              <CheckCircle2 className="w-6 h-6 text-[#002DC2] mx-auto" />
              <h3 className="text-sm font-bold text-[#123B92]">{t('comm3Title')}</h3>
              <p className="text-xs text-black leading-relaxed">{t('comm3Desc')}</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-8 py-3.5 bg-[#00FB00] hover:bg-[#002DC2] text-black hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-md inline-flex items-center space-x-2 cursor-pointer"
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
