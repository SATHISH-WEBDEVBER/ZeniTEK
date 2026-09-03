import React from 'react';
import { ShieldCheck, Award, Factory, Users, Globe, Cpu, Leaf, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutUsPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-16 pt-6 bg-slate-50 text-slate-900">
      
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          ABOUT ZENITEK SOLAR THERMAL
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-blue-950">
          Empowering Farmers. <br />
          <span className="text-green-700">
            Eliminating Post-Harvest Waste.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
          Headquartered in Coimbatore, Tamil Nadu — India's premier engineering hub — ZeniTEK designs and manufactures state-of-the-art polyhouse greenhouse solar thermal dryers for global agriculture.
        </p>
      </section>

      {/* Section 2: Roots & Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">COIMBATORE MANUFACTURING HUB</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">Over 2 Decades of Solar Thermal Innovation</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              ZeniTEK was founded with a single mission: to stop agricultural decay by putting clean, sun-powered thermal technology directly into the hands of farmers and smallholder cooperatives.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our 25,000 sq. ft. manufacturing facility in Malumichampatti, Coimbatore, integrates advanced thermal dynamics research with precision structural steel fabrication to deliver 100% weather-proof dryers.
            </p>
            <div className="pt-2 flex items-center space-x-6 text-xs text-blue-800 font-bold">
              <span>✓ 25,000+ Sq. Ft. Factory</span>
              <span>✓ In-House Thermal Testing Lab</span>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <img
              src="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80"
              alt="Coimbatore Factory Facility"
              className="w-full h-80 object-cover rounded-2xl border border-slate-200 shadow-md"
            />
          </div>

        </div>
      </section>

      {/* Section 3: Technology Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-blue-950">Our 3 Technology Pillars</h2>
          <p className="text-xs text-slate-500">Engineering excellence built into every solar dryer we construct.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Research & Innovation</h3>
            <p className="text-xs text-slate-600">Center for Excellence focusing on fluid dynamics, thermal storage mass, and UV polycarbonate light amplification.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Quality & Standards</h3>
            <p className="text-xs text-slate-600">Precision manufacturing conforming to strict ISO 9001:2015 standards and CE safety certifications.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Carbon Footprint Offset</h3>
            <p className="text-xs text-slate-600">Replacing fossil-fuel food drying to offset over 15,000 MT of CO₂ emissions annually across rural India.</p>
          </div>
        </div>
      </section>

      {/* Section 4: Impact Metrics Panel */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">1,200+</div>
              <div className="text-xs text-blue-100 font-semibold mt-1">Farmers & FPOs Served</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-green-300">500+ Tons</div>
              <div className="text-xs text-blue-100 font-semibold mt-1">Food Waste Prevented</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">45% Avg</div>
              <div className="text-xs text-blue-100 font-semibold mt-1">Farmer Income Rise</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-green-300">100%</div>
              <div className="text-xs text-blue-100 font-semibold mt-1">Subsidy Assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Subsidy Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">Govt Approvals & Quality Badges</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-blue-800 shadow-sm flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-green-600" /> MNRE Approved Manufacturer
          </span>
          <span className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-green-800 shadow-sm flex items-center">
            <Award className="w-4 h-4 mr-2 text-blue-600" /> ISO 9001:2015 Quality System
          </span>
          <span className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-sm flex items-center">
            <Factory className="w-4 h-4 mr-2 text-blue-700" /> CE Marked Thermal Components
          </span>
        </div>

        <div className="pt-4">
          <button
            onClick={() => onOpenQuoteModal()}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-700 to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-md inline-flex items-center space-x-2"
          >
            <span>Consult Our Thermal Engineers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
