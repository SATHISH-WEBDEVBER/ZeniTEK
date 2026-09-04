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
    <div className="space-y-16 pb-16 pt-6 bg-slate-50 text-slate-900">
      
      {/* Hero Title */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 border border-green-200 px-3 py-1 rounded-full">
          FARMER PROSPERITY STORIES
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-blue-950">
          Real Stories. Real Prosperity. <br />
          <span className="text-green-700">
            Zero Food Waste.
          </span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Hear directly from farmers, self-help groups, and FPO presidents who multiplied their post-harvest margins with ZeniTEK.
        </p>
      </section>

      {/* Global Impact Dashboard */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">1,200+</div>
              <div className="text-xs text-blue-100 font-semibold mt-1">Rural Families Empowered</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-green-300">₹4.2 Cr+</div>
              <div className="text-xs text-blue-100 font-semibold mt-1">Total Farmer Value Added</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">500+ Tons</div>
              <div className="text-xs text-blue-100 font-semibold mt-1">Crops Saved from Mold</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-green-300">100%</div>
              <div className="text-xs text-blue-100 font-semibold mt-1">Sun Powered Clean Energy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">Regional Client Video Reviews</h2>
          <p className="text-xs text-slate-500">Watch full on-farm interviews with clients in Tamil Nadu, Kerala & Maharashtra.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map(rev => (

            <div key={rev._id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md space-y-4">
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={rev.videoUrl}
                  title={rev.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{rev.name}</h3>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    ★ {rev.rating}.0
                  </span>
                </div>
                <div className="text-xs font-bold text-green-700">{rev.role} • {rev.location}</div>
                <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">In-Depth Case Studies</h2>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4">
            <img src="https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80" alt="Pollachi Copra Case" className="w-full h-56 object-cover rounded-2xl border border-slate-200" />
          </div>
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[10px] font-bold text-green-800 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded uppercase">
              Pollachi Coconut Farmers Collective
            </span>
            <h3 className="text-xl font-bold text-blue-950">How 50 Coconut Farmers Eliminated Rain Losses & Increased Copra Revenue by 28%</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-rose-700 font-bold">The Problem</div>
                <div className="text-slate-600 mt-1">Unseasonal monsoon rains destroyed 30% of copra with mold stains.</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-blue-700 font-bold">Solar Solution</div>
                <div className="text-slate-600 mt-1">500 kg Polyhouse Solar Dryer installed with 50% State Agri Subsidy.</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-green-700 font-bold">Profit Result</div>
                <div className="text-slate-600 mt-1">100% Grade-1 White Copra dried in 2.5 days. Extra profit of ₹18/kg.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl font-extrabold text-blue-950">Our 360° Partner Support Commitment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-6 h-6 text-blue-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">End-to-End Subsidy Clearance</h3>
            <p className="text-xs text-slate-600">We file all government agritech subsidy applications and bank loan tie-ups on your behalf.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-6 h-6 text-green-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">On-Farm Installation & Training</h3>
            <p className="text-xs text-slate-600">Our Coimbatore engineers install the setup on your farm and train your team on crop parameters.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-6 h-6 text-blue-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Direct B2B Buyer Linkage</h3>
            <p className="text-xs text-slate-600">We connect FPOs with certified corporate food exporters buying premium dried produce.</p>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => onOpenQuoteModal()}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-700 to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-md inline-flex items-center space-x-2"
          >
            <span>Start Your Prosperity Story Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
