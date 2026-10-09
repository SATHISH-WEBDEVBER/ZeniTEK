import React, { useState } from 'react';
import { 
  ShieldCheck, Award, ArrowRight, CheckCircle2, FileText, 
  HelpCircle, IndianRupee, Landmark, Sparkles, Building, PhoneCall,
  Download, Calculator, Clock, Users, Check, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

// Native <select> can't wrap its value, so long option labels got truncated on
// mobile. Show the selected label in a wrapping box and overlay a transparent select.
function WrapSelect({ value, onChange, options, ariaLabel }) {
  const current = options.find(([v]) => v === value);
  return (
    <div className="relative w-full bg-[#F0F4FD] border border-[#123B92]/30 rounded-xl focus-within:border-[#002DC2] focus-within:ring-2 focus-within:ring-[#002DC2]/20">
      <div aria-hidden="true" className="pl-3.5 pr-9 py-2.5 text-sm font-bold text-[#123B92] leading-snug">
        {(current ? current[1] : value).replace(/\(([^)]{1,16})\)/g, (m) => m.replace(/ /g, ' '))}
      </div>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#123B92] pointer-events-none" />
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {options.map(([v, label]) => (
          <option key={v} value={v}>{label}</option>
        ))}
      </select>
    </div>
  );
}

export default function SubsidiesPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  const [calcState, setCalcState] = useState('Tamil Nadu');
  const [calcModel, setCalcModel] = useState('SOLDRY 1210 (Commercial)');
  const [calcFarmerType, setCalcFarmerType] = useState('Small / Marginal Farmer');

  // Subsidy percentage calculation
  let subsidyPercent = 50;
  if (calcFarmerType === 'SC / ST / Women Farmer' || calcFarmerType === 'FPO / SHG Group') {
    subsidyPercent = 60;
  } else if (calcFarmerType === 'General Commercial Exporter') {
    subsidyPercent = 40;
  }

  const subsidySchemes = [
    {
      title: "State Horticulture Mission (MIDH / SHM)",
      coverage: "40% – 50% Direct Capital Subsidy",
      target: "Farmers, FPOs, Agri-Entrepreneurs",
      description: "Direct back-ended capital subsidy under Mission for Integrated Development of Horticulture for solar polyhouse and tunnel dryers.",
      criteria: ["Farmer Land Ownership (Patta / Chitta)", "Aadhaar Card & Bank Account", "MNRE Approved Dryer Quotation (Provided by ZeniTEK)"]
    },
    {
      title: "Ministry of New & Renewable Energy (MNRE)",
      coverage: "Direct Enlisted Manufacturer Subsidy",
      target: "Pan-India Agricultural Beneficiaries",
      description: "Central government subsidy for decentralized renewable solar thermal applications and food dehydration equipment.",
      criteria: ["Manufacturer must be MNRE Enlisted (ZeniTEK is Enlisted)", "Valid Soil & Water Test (if required)", "Photographic Geo-tagged Installation"]
    },
    {
      title: "Agriculture Infrastructure Fund (AIF)",
      coverage: "3% Interest Subvention + Credit Guarantee",
      target: "Agri-Entrepreneurs, Startups, PACS & FPOs",
      description: "Financing facility for post-harvest management infrastructure with collateral-free loans up to ₹2 Crore under CGTMSE.",
      criteria: ["Viable Post-Harvest Processing Proposal", "Bank DPR Approval Assistance", "Joint Inspection Verification"]
    },
    {
      title: "PM-FME & MSME Food Processing Scheme",
      coverage: "35% – 50% Subsidy (Up to ₹10 Lakhs)",
      target: "Micro Food Processing Units & SHGs",
      description: "Credit-linked capital subsidy for establishing micro food processing enterprises, drying spices, fruits, vegetables, and herbal tea.",
      criteria: ["Existing or New Micro Enterprise", "10% Beneficiary Contribution", "FSSAI Registration Assistance"]
    }
  ];

  const subsidySteps = [
    {
      step: "01",
      title: "Select Model & Get Official Quote",
      desc: "Our engineering team provides an official MNRE-compliant technical specification and GST invoice quotation."
    },
    {
      step: "02",
      title: "DPR & Document Preparation",
      desc: "ZeniTEK prepares the Detailed Project Report (DPR), technical layout drawing, and required documentation."
    },
    {
      step: "03",
      title: "Government Portal Submission",
      desc: "Submit application to the State Horticulture/Agriculture Department with full end-to-end guidance from our liaisons."
    },
    {
      step: "04",
      title: "Manufacturing & Installation",
      desc: "ZeniTEK installs the complete solar dryer on your farm foundation with GPS geo-tagging and test batch runs."
    },
    {
      step: "05",
      title: "Department Inspection & Direct Credit",
      desc: "Government officials conduct field verification, and the subsidy amount is directly credited to your bank account."
    }
  ];

  return (
    <div className="text-slate-900 min-h-screen bg-white">
      
      {/* SECTION 1: HERO HEADER (background photo, left-aligned heading) */}
      <PageHero
        images="/real-photos/zenitek_photo_33.jpeg"
        badge={<><Landmark className="w-4 h-4 text-[#002DC2] shrink-0" /><span className="text-balance">Govt of India & State Department Schemes</span></>}
        title={<>Government Subsidies for <br /><span className="text-[#002DC2]">ZeniTEK Solar Dryers{' '}<span className="whitespace-nowrap">(40% – 60%)</span></span></>}
        subtitle={<>ZeniTEK is an <strong>MNRE Enlisted & ISO 9001:2015 Certified</strong> manufacturer. Our solar drying systems are eligible for central and state capital subsidies across Tamil Nadu, Karnataka, Kerala, Maharashtra, and all Indian states.</>}
        actions={<>
          <button
            type="button"
            onClick={() => onOpenQuoteModal({ capacityNeeded: "Subsidy Assistance", message: "I want subsidy assistance for ZeniTEK Solar Dryer." })}
            className="px-6 py-3.5 bg-[#23AC39] hover:bg-[#1f9632] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl active:scale-95"
          >
            <span>Check My Subsidy Eligibility</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
          <a
            href="#subsidy-schemes"
            onClick={(e) => {
              const el = document.getElementById('subsidy-schemes');
              if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            }}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 border-2 border-[#123B92] text-[#123B92] font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>View Schemes & Guidelines</span>
          </a>
        </>}
      />


      {/* SECTION 2: FAST ELIGIBILITY ESTIMATOR */}
      <section className="w-full section-even py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-[#F0F4FD] border border-[#123B92]/20 flex items-center justify-center text-[#123B92]">
                <Calculator className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              Instant State Subsidy Estimator
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Select your state and beneficiary profile to calculate eligible subsidy assistance.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-1.5">
                  State / Region
                </label>
                <WrapSelect
                  ariaLabel="State / Region"
                  value={calcState}
                  onChange={(e) => setCalcState(e.target.value)}
                  options={[
                    ["Tamil Nadu", "Tamil Nadu (Horticulture & TEDA)"],
                    ["Karnataka", "Karnataka (KREDL & Dept of Agri)"],
                    ["Kerala", "Kerala (ANERT & Agri Dept)"],
                    ["Maharashtra", "Maharashtra (MEDA & MahaAgri)"],
                    ["Andhra Pradesh", "Andhra Pradesh / Telangana"],
                    ["All India", "Other Indian States (Central Schemes)"],
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-1.5">
                  Product Capacity Needed
                </label>
                <WrapSelect
                  ariaLabel="Product Capacity Needed"
                  value={calcModel}
                  onChange={(e) => setCalcModel(e.target.value)}
                  options={[
                    ["SUNDRY 50 (50-100 kg)", "SUNDRY 50 Commercial Box (50–100 kg)"],
                    ["SOLDRY 1210 (Commercial)", "SOLDRY 1210 Polyhouse Tunnel (150–500 kg)"],
                    ["SOLDRY 1709 (Parabolic)", "SOLDRY 1709 Parabolic Tunnel (400–1200 kg)"],
                    ["Industrial Multi-Tunnel (1 Ton+)", "Industrial Multi-Tunnel Plant (1 Ton+)"],
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-1.5">
                  Beneficiary Category
                </label>
                <WrapSelect
                  ariaLabel="Beneficiary Category"
                  value={calcFarmerType}
                  onChange={(e) => setCalcFarmerType(e.target.value)}
                  options={[
                    ["Small / Marginal Farmer", "Small / Marginal Farmer (50% Subsidy)"],
                    ["SC / ST / Women Farmer", "SC / ST / Women Farmer (60% Subsidy)"],
                    ["FPO / SHG Group", "FPO / SHG / Cooperative (60% Subsidy)"],
                    ["General Commercial Exporter", "General Agri-Business / Exporter (40% Subsidy)"],
                  ]}
                />
              </div>
            </div>

            {/* Calculated Result Box */}
            <div className="bg-gradient-to-br from-[#123B92] via-[#0D2E73] to-[#0A225C] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-lg">
              <div>
                <div className="text-xs text-white/85 uppercase font-bold tracking-wider">
                  Estimated Subsidy Coverage
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#23AC39] leading-tight text-balance">
                  {subsidyPercent}% Government Assistance
                </div>
                <div className="text-sm text-white/80 mt-1">
                  Valid for {calcState} under National & State Horticulture Mission
                </div>
              </div>

              <button
                onClick={() => onOpenQuoteModal({ 
                  capacityNeeded: calcModel,
                  district: calcState,
                  message: `Requesting subsidy DPR and eligibility verification for ${calcModel} in ${calcState} (${calcFarmerType}).`
                })}
                className="w-full sm:w-auto px-6 py-3 bg-[#23AC39] hover:bg-[#1f9632] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Apply with ZeniTEK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 3: KEY SUBSIDY SCHEMES */}
      <section id="subsidy-schemes" className="w-full section-odd py-14 sm:py-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#123B92]">
              Available Central & State Subsidy Schemes
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              ZeniTEK equipment complies with all MNRE and state nodal agency specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subsidySchemes.map((scheme, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md hover:shadow-xl transition-all space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-black uppercase tracking-normal sm:tracking-wide text-[#1A822B] bg-[#23AC39]/10 border border-[#23AC39]/30 px-2.5 py-1 rounded-md inline-block max-w-full leading-snug text-balance">
                      {scheme.coverage}
                    </span>
                    <h3 className="text-lg font-black text-[#123B92] mt-2">
                      {scheme.title}
                    </h3>
                    <div className="text-sm text-slate-500 font-semibold mt-1">
                      Target: {scheme.target}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {scheme.description}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-bold uppercase text-slate-600">Key Requirements:</div>
                  {scheme.criteria.map((c, idx) => (
                    <div key={idx} className="flex items-start text-sm text-slate-800 leading-snug">
                      <CheckCircle2 className="w-4 h-4 text-[#23AC39] mr-2 mt-0.5 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* SECTION 4: 5-STEP ASSISTANCE PROCESS */}
      <section className="w-full section-even py-14 sm:py-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#123B92]">
              How ZeniTEK Handles Your Subsidy <span className="whitespace-nowrap">End-to-End</span>
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              We eliminate paperwork friction so you receive maximum government benefits without delays.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {subsidySteps.map((step) => (
              <div key={step.step} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm relative">
                <div className="text-3xl font-black text-[#002DC2] mb-2">
                  {step.step}
                </div>
                <h4 className="text-lg sm:text-xl font-black text-[#123B92] leading-snug mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Action Card */}
          <div className="bg-[#123B92] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Have questions about your state subsidy or paperwork?
              </h3>
              <p className="text-sm text-white/85">
                Speak directly with ZeniTEK's Government Scheme Documentation Specialist today.
              </p>
            </div>
            <button
              onClick={() => onOpenQuoteModal({ capacityNeeded: "Subsidy Consultation", message: "I want a free telephone consultation regarding government subsidy for solar dryer." })}
              className="w-full md:w-auto px-8 py-3.5 bg-[#23AC39] hover:bg-[#1f9632] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all shrink-0 cursor-pointer text-balance md:whitespace-nowrap"
            >
              Get Free Subsidy Consultation
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
