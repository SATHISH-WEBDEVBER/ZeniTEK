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
    <div className="text-slate-900 min-h-screen bg-slate-50">
      
      {/* SECTION 1: HERO TITLE (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            {t('storiesBadge')}
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-blue-950">
            {t('storiesTitle1')} <br />
            <span className="text-green-700">
              {t('storiesTitle2')}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('storiesSubtitle')}
          </p>
        </div>
      </section>

      {/* SECTION 2: GLOBAL IMPACT DASHBOARD (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-blue-950">1,200+</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">{t('impactFamilies')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-green-700">₹4.2 Cr+</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">{t('impactValue')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-blue-950">500+ Tons</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">{t('impactCrops')}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl sm:text-4xl font-black text-green-700">100%</div>
              <div className="text-xs text-slate-600 font-semibold mt-1">{t('impactCleanEnergy')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VIDEO REVIEWS (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">{t('videoReviewsTitle')}</h2>
            <p className="text-xs text-slate-500">{t('videoReviewsSub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map(rev => (
              <div key={rev._id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="relative h-48 bg-slate-900 overflow-hidden">
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
                    <h3 className="text-base font-bold text-slate-900">{rev.name}</h3>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ★ {rev.rating}.0
                    </span>
                  </div>
                  <div className="text-xs font-bold text-green-700">{rev.role} • {rev.location}</div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">"{rev.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CASE STUDIES (EVEN SECTION - SOFT OFF-WHITE) */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">{t('caseStudiesTitle')}</h2>
          </div>

          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <img src="/real-photos/zenitek_photo_02.jpeg" alt="Commercial Field Case Study" className="w-full h-56 object-cover rounded-2xl border border-slate-200" />
            </div>
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[10px] font-bold text-green-800 bg-green-100 border border-green-200 px-2.5 py-0.5 rounded uppercase">
                {t('pollachiCollective')}
              </span>
              <h3 className="text-xl font-bold text-blue-950">{t('pollachiTitle')}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-rose-700 font-bold">{t('probTitle')}</div>
                  <div className="text-slate-600 mt-1 leading-relaxed">{t('probDesc')}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-blue-700 font-bold">{t('solTitle')}</div>
                  <div className="text-slate-600 mt-1 leading-relaxed">{t('solDesc')}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-green-700 font-bold">{t('resTitle')}</div>
                  <div className="text-slate-600 mt-1 leading-relaxed">{t('resDesc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: SUPPORT GRID / COMMITMENT (ODD SECTION - CRISP WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16 text-center space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">{t('commitmentTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <CheckCircle2 className="w-6 h-6 text-blue-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">{t('comm1Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('comm1Desc')}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <CheckCircle2 className="w-6 h-6 text-green-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">{t('comm2Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('comm2Desc')}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <CheckCircle2 className="w-6 h-6 text-blue-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">{t('comm3Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('comm3Desc')}</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-700 to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-md inline-flex items-center space-x-2 cursor-pointer"
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
