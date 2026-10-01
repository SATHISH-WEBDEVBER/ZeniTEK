import React, { useState } from 'react';
import { 
  ShieldCheck, Award, ArrowRight, CheckCircle2, FileText, 
  HelpCircle, IndianRupee, Landmark, Sparkles, Building, PhoneCall,
  Download, Calculator, Clock, Users, Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
      
      {/* SECTION 1: HERO HEADER */}
      <section className="w-full section-odd py-12 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F0F4FD] border border-[#123B92]/30 text-[#123B92] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Landmark className="w-4 h-4 text-[#002DC2]" />
            <span>Govt of India & State Department Schemes</span>
          </div>

          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-black text-[#123B92] tracking-tight leading-tight">
            Government Subsidies for <br />
            <span className="text-[#002DC2]">ZeniTEK Solar Dryers (40% – 60%)</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            ZeniTEK is an <strong>MNRE Enlisted & ISO 9001:2015 Certified</strong> manufacturer. Our solar drying systems are eligible for central and state capital subsidies across Tamil Nadu, Karnataka, Kerala, Maharashtra, and all Indian states.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenQuoteModal({ capacityNeeded: "Subsidy Assistance", message: "I want subsidy assistance for ZeniTEK Solar Dryer." })}
              className="px-6 py-3.5 bg-[#23AC39] hover:bg-[#1f9632] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer hover:shadow-xl active:scale-95"
            >
              <span>Check My Subsidy Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#subsidy-schemes"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 border-2 border-[#123B92] text-[#123B92] font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center space-x-2"
            >
              <span>View Schemes & Guidelines</span>
            </a>
          </div>
        </div>
      </section>


      {/* SECTION 2: FAST ELIGIBILITY ESTIMATOR */}
      <section className="w-full section-even py-10 sm:py-14 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
            
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#F0F4FD] border border-[#123B92]/20 flex items-center justify-center text-[#123B92] shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#123B92]">
                  Instant State Subsidy Estimator
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Select your state and beneficiary profile to calculate eligible subsidy assistance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-1.5">
                  State / Region
                </label>
                <select
                  value={calcState}
                  onChange={(e) => setCalcState(e.target.value)}
                  className="w-full bg-[#F0F4FD] border border-[#123B92]/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <option value="Tamil Nadu">Tamil Nadu (Horticulture & TEDA)</option>
                  <option value="Karnataka">Karnataka (KREDL & Dept of Agri)</option>
                  <option value="Kerala">Kerala (ANERT & Agri Dept)</option>
                  <option value="Maharashtra">Maharashtra (MEDA & MahaAgri)</option>
                  <option value="Andhra Pradesh">Andhra Pradesh / Telangana</option>
                  <option value="All India">Other Indian States (Central Schemes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-1.5">
                  Product Capacity Needed
                </label>
                <select
                  value={calcModel}
                  onChange={(e) => setCalcModel(e.target.value)}
                  className="w-full bg-[#F0F4FD] border border-[#123B92]/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <option value="SUNDRY 50 (50-100 kg)">SUNDRY 50 Commercial Box (50–100 kg)</option>
                  <option value="SOLDRY 1210 (Commercial)">SOLDRY 1210 Polyhouse Tunnel (150–500 kg)</option>
                  <option value="SOLDRY 1709 (Parabolic)">SOLDRY 1709 Parabolic Tunnel (400–1200 kg)</option>
                  <option value="Industrial Multi-Tunnel (1 Ton+)">Industrial Multi-Tunnel Plant (1 Ton+)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B92] uppercase tracking-wider mb-1.5">
                  Beneficiary Category
                </label>
                <select
                  value={calcFarmerType}
                  onChange={(e) => setCalcFarmerType(e.target.value)}
                  className="w-full bg-[#F0F4FD] border border-[#123B92]/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <option value="Small / Marginal Farmer">Small / Marginal Farmer (50% Subsidy)</option>
                  <option value="SC / ST / Women Farmer">SC / ST / Women Farmer (60% Subsidy)</option>
                  <option value="FPO / SHG Group">FPO / SHG / Cooperative (60% Subsidy)</option>
                  <option value="General Commercial Exporter">General Agri-Business / Exporter (40% Subsidy)</option>
                </select>
              </div>
            </div>

            {/* Calculated Result Box */}
            <div className="bg-gradient-to-br from-[#123B92] via-[#0D2E73] to-[#0A225C] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <div className="text-[11px] text-blue-200 uppercase font-bold tracking-wider">
                  Estimated Subsidy Coverage
                </div>
                <div className="text-2xl sm:text-3xl font-black text-green-300">
                  {subsidyPercent}% Government Assistance
                </div>
                <div className="text-xs text-white/80 mt-0.5">
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
      <section id="subsidy-schemes" className="w-full section-odd py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#123B92]">
              Available Central & State Subsidy Schemes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              ZeniTEK equipment complies with all MNRE and state nodal agency specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subsidySchemes.map((scheme, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-md hover:shadow-xl transition-all space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#23AC39] bg-green-50 border border-green-200 px-2.5 py-0.5 rounded">
                      {scheme.coverage}
                    </span>
                    <h3 className="text-lg font-black text-[#123B92] mt-2">
                      {scheme.title}
                    </h3>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      Target: {scheme.target}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {scheme.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase text-slate-600">Key Requirements:</div>
                  {scheme.criteria.map((c, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#23AC39] mr-2 shrink-0" />
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
      <section className="w-full section-even py-14 sm:py-18 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#123B92]">
              How ZeniTEK Handles Your Subsidy End-to-End
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              We eliminate paperwork friction so you receive maximum government benefits without delays.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {subsidySteps.map((step) => (
              <div key={step.step} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative">
                <div className="text-3xl font-black text-[#002DC2]/20 mb-2">
                  {step.step}
                </div>
                <h4 className="text-sm font-black text-[#123B92] leading-snug mb-1.5">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Action Card */}
          <div className="bg-[#123B92] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black">
                Have questions about your state subsidy or paperwork?
              </h3>
              <p className="text-xs sm:text-sm text-blue-200">
                Speak directly with ZeniTEK's Government Scheme Documentation Specialist today.
              </p>
            </div>
            <button
              onClick={() => onOpenQuoteModal({ capacityNeeded: "Subsidy Consultation", message: "I want a free telephone consultation regarding government subsidy for solar dryer." })}
              className="px-8 py-3.5 bg-[#23AC39] hover:bg-[#1f9632] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
            >
              Get Free Subsidy Consultation
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
