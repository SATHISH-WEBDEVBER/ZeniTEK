import React, { useState } from 'react';
import { 
  Award, Zap, Sprout, Cpu, Microscope, ShieldCheck, CheckCircle2, 
  MapPin, Phone, Mail, ArrowRight, ExternalLink, ChevronRight, 
  ChevronLeft, Sparkles, Building2, Factory, GraduationCap, X, 
  Layers, Maximize2, Compass, Wrench, Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutUsPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();

  // Active category filter for Landmark Projects
  const [projectCategory, setProjectCategory] = useState('all');
  
  // Lightbox modal state for full-screen photo viewing
  const [lightboxImage, setLightboxImage] = useState(null);

  // 4 Core Domains from Document 1 (Visual-first with real photos)
  const whatWeDoDomains = [
    {
      id: "thermal",
      title: "Solar Thermal Systems",
      badge: "High-Temp Process Heat",
      icon: Zap,
      category: "thermal",
      image: "/real-photos/zenitek_photo_18.jpeg",
      desc: "Engineered solar concentrated and non-concentrated thermal collectors delivering industrial process heat, steam generation, and bulk boiling water.",
      specs: [
        "Evacuated Tube Collectors (ETC)",
        "Parabolic Trough Collectors (PTC)",
        "Scheffler Dishes & Concentrators",
        "Refurbishing & Service of Inoperative Systems"
      ],
      metric: "1,000L+",
      metricLabel: "Daily Boiling Water Capacity"
    },
    {
      id: "agri-solar",
      title: "Agri-Solar Innovations",
      badge: "Post-Harvest Crop Preservation",
      icon: Sprout,
      category: "agri",
      image: "/real-photos/zenitek_photo_04.jpeg",
      desc: "Clean-energy technologies for agricultural operations. Reduces drying times by 40%, preserves nutrient quality, and eliminates crop spoilage.",
      specs: [
        "Commercial Polyhouse Tunnel Dryers (150 – 1000 kg)",
        "Portable Stainless Steel Box Dryers (6 – 100 kg)",
        "Solar-Powered 4-Row Paddy Transplanters",
        "Zero-Power Agricultural Cold Storage Solutions"
      ],
      metric: "40% Faster",
      metricLabel: "Drying Time vs Open-Sun"
    },
    {
      id: "photovoltaic",
      title: "Photovoltaic Solutions",
      badge: "Testing & Turnkey Solar PV",
      icon: Cpu,
      category: "pv",
      image: "/real-photos/zenitek_photo_26.jpeg",
      desc: "Precision photovoltaic integration alongside specialized testing test rigs engineered for national and corporate solar PV certification laboratories.",
      specs: [
        "PV Panels & Turnkey System Integration",
        "Visual Inspection Test Rigs",
        "Outdoor Solar Testing Rigs",
        "Indoor Precision Laboratory Rigs"
      ],
      metric: "Certification",
      metricLabel: "Lab Test Rigs Commissioned"
    },
    {
      id: "rnd",
      title: "Research & Development",
      badge: "Academic & Prototype R&D",
      icon: Microscope,
      category: "rnd",
      image: "/real-photos/zenitek_photo_23.jpeg",
      desc: "Collaborative engineering with India's premier academic institutions. Developing demonstration models, research rigs, and turnkey commercialization pipelines.",
      specs: [
        "Academic Demonstration Models",
        "Prototype Test Rigs for Research",
        "Turnkey Commercialization Pipelines",
        "Sensor Telemetry & Automated Airflow"
      ],
      metric: "6+ Premier",
      metricLabel: "University Partner Deployments"
    }
  ];

  // Landmark Installed Projects from Document 2 (Real-world installations)
  const landmarkProjects = [
    {
      id: 1,
      title: "37.5 Sq.m Parabolic Trough Collector (PTC)",
      category: "thermal",
      location: "Pachamalai Hills, Thuraiyur, Tamil Nadu",
      client: "Anna University Chennai • Funded by DST (NRDMS)",
      desc: "Commissioned to deliver 1,000 litres of boiling water daily for a remote scheduled tribal community, funded by Department of Science & Technology.",
      image: "/real-photos/zenitek_photo_18.jpeg",
      badge: "Tribal Welfare Project",
      tag: "Solar Thermal"
    },
    {
      id: 2,
      title: "Solar PV Certification Laboratory Test Rigs",
      category: "pv",
      location: "Mitsui Chemical Pvt Ltd, Ahmedabad, Gujarat",
      client: "Mitsui Chemicals Group (Global Industry)",
      desc: "Custom visual inspection test rigs, outdoor solar testing rigs, and indoor testing rigs commissioned for a specialized PV certification laboratory.",
      image: "/real-photos/zenitek_photo_25.jpeg",
      badge: "Corporate Testing Lab",
      tag: "PV Solutions"
    },
    {
      id: 3,
      title: "592 Sq.m Scheffler Dish Solar Refurbishment",
      category: "thermal",
      location: "SRM University, Chennai, Tamil Nadu",
      client: "SRM Institute of Science & Technology",
      desc: "Complete re-engineering, structural alignment, and commissioning of a massive 592 sq.m Scheffler dish solar thermal array.",
      image: "/real-photos/zenitek_photo_12.jpeg",
      badge: "Campus Renewable Energy",
      tag: "Solar Thermal"
    },
    {
      id: 4,
      title: "192 Sq.m Commercial Solar Tunnel Dryer",
      category: "agri",
      location: "Chhattisgarh, India",
      client: "SELCO Foundation, Bangalore",
      desc: "Turnkey design, fabrication, and installation of a 192 sq.m industrial solar tunnel dryer for clean agricultural food processing.",
      image: "/real-photos/zenitek_photo_04.jpeg",
      badge: "Agricultural Processing",
      tag: "Agri-Solar"
    },
    {
      id: 5,
      title: "4-Row Solar Paddy Transplanter Machine",
      category: "agri",
      location: "Bangalore, Karnataka",
      client: "SELCO Foundation, Bangalore",
      desc: "Full engineering design, prototyping, and field deployment of a clean solar-powered 4-row paddy transplanter machine.",
      image: "/real-photos/zenitek_photo_27.jpeg",
      badge: "Farm Mechanization",
      tag: "Agri-Solar"
    },
    {
      id: 6,
      title: "80 Sq.m Scheffler Dish Thermal Refurbishment",
      category: "thermal",
      location: "Indo-MIM Pvt Ltd, Hoskote, Bangalore",
      client: "Indo-MIM Pvt Ltd (Precision Aerospace & MIM)",
      desc: "Restored and recommissioned high-efficiency 80 sq.m Scheffler dish concentrator providing sustainable industrial process heat.",
      image: "/real-photos/zenitek_photo_21.jpeg",
      badge: "Industrial Process Heat",
      tag: "Solar Thermal"
    }
  ];

  const filteredProjects = projectCategory === 'all' 
    ? landmarkProjects 
    : landmarkProjects.filter(p => p.category === projectCategory);

  // Prestigious Partners from Document 2 with Real Logos
  const academicClients = [
    { 
      name: "IIT Bhubaneswar", 
      branch: "School of Mechanical Science", 
      tag: "Academic R&D",
      logo: "/client-logos/academic_iit_bhubaneswar.png"
    },
    { 
      name: "Anna University Chennai", 
      branch: "DST NRDMS Tribal Community Project", 
      tag: "Govt Research",
      logo: "/client-logos/academic_anna_univ.jpeg"
    },
    { 
      name: "SRM University", 
      branch: "592 Sq.m Scheffler Solar Thermal Array", 
      tag: "Campus Thermal",
      logo: "/client-logos/industry_srm.png"
    },
    { 
      name: "Sree Sankara College", 
      branch: "Energy Department, Kalady, Kerala", 
      tag: "Lab Test Rigs",
      logo: "/client-logos/academic_sree_sankara.jpeg"
    },
    { 
      name: "Gandhigram University", 
      branch: "Centre for Rural Energy, Dindigul", 
      tag: "Rural Energy",
      logo: "/client-logos/academic_gandhigram.jpeg"
    },
    { 
      name: "College of Fisheries", 
      branch: "Fisheries Engineering, Nagapattinam", 
      tag: "Marine Drying",
      logo: "/client-logos/academic_fisheries.png"
    }
  ];

  const industryClients = [
    { 
      name: "Mitsui Chemicals Group", 
      detail: "Solar PV Certification Lab (Ahmedabad)", 
      tag: "Global Industry",
      logo: "/client-logos/industry_mitsui.jpeg"
    },
    { 
      name: "Indo-MIM Pvt Ltd", 
      detail: "Industrial Scheffler Thermal (Bangalore)", 
      tag: "Aerospace & MIM",
      logo: "/client-logos/industry_indomim.jpeg"
    },
    { 
      name: "SELCO Foundation", 
      detail: "Solar Tunnel Dryers & Paddy Transplanters", 
      tag: "Social Innovation",
      logo: "/client-logos/industry_selco.png"
    },
    { 
      name: "Pro-Target & NISE", 
      detail: "Technical Mentorship (Germany / India)", 
      tag: "Solar Pioneers",
      logo: "/client-logos/industry_nise_protarget.svg"
    }
  ];

  // Real Photo Showcase Grid (8 authentic field photos)
  const realPhotoGallery = [
    { src: "/real-photos/zenitek_photo_18.jpeg", title: "Parabolic Trough Concentrator", tag: "Pachamalai Hills" },
    { src: "/real-photos/zenitek_photo_04.jpeg", title: "SOLDRY 1210 Polyhouse Tunnel", tag: "Commercial Dryer" },
    { src: "/real-photos/zenitek_photo_23.jpeg", title: "Active Solar Dehydration Hub", tag: "SS304 Food Trays" },
    { src: "/real-photos/zenitek_photo_27.jpeg", title: "SUNDRY 50 Stainless Box Dryer", tag: "50 kg Farm Dryer" },
    { src: "/real-photos/zenitek_photo_12.jpeg", title: "Industrial Solar Greenhouse", tag: "SRM Campus" },
    { src: "/real-photos/zenitek_photo_25.jpeg", title: "SUNDRY 12 Dual-Tier Unit", tag: "Micro-Enterprise" },
    { src: "/real-photos/zenitek_photo_26.jpeg", title: "Dual Mobile Testing Rigs", tag: "Field Validation" },
    { src: "/real-photos/zenitek_photo_08.jpeg", title: "Multi-Tier Automated Airflow", tag: "Drying Chamber" }
  ];

  return (
    <div className="text-slate-900 min-h-screen bg-slate-50 font-sans selection:bg-[#002DC2] selection:text-white">
      
      {/* 1. CINEMATIC HERO SECTION WITH BOLD LEGIBLE TYPOGRAPHY */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-slate-50 pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80">
        
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          {/* Top Headline & Quick Metrics */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-white border border-[#002DC2]/25 shadow-sm">
              <span className="w-3 h-3 rounded-full bg-[#23AC39] animate-pulse" />
              <span className="text-sm sm:text-base font-black uppercase tracking-wider text-[#002DC2]">
                ZeniTEK • Renewable Energy Engineering • Erode, Tamil Nadu
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.1]">
              Towards a <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#002DC2] via-[#123B92] to-[#23AC39] bg-clip-text text-transparent">
                Sustainable Future
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 font-medium leading-relaxed max-w-3xl mx-auto">
              Engineering clean-energy systems for agriculture, industry, and educational institutions. 
              Combining thermal engineering, solar automation, and applied research.
            </p>

            {/* 4 Large Bold Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center hover:border-[#002DC2]/40 transition-all hover:shadow-lg">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002DC2]">2021</div>
                <div className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wider mt-1.5">Established</div>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center hover:border-[#002DC2]/40 transition-all hover:shadow-lg">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">Erode</div>
                <div className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wider mt-1.5">Tamil Nadu</div>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center hover:border-[#002DC2]/40 transition-all hover:shadow-lg">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#23AC39]">Turnkey</div>
                <div className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wider mt-1.5">Design & EPC</div>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center hover:border-[#002DC2]/40 transition-all hover:shadow-lg">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#123B92]">100%</div>
                <div className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wider mt-1.5">Clean Energy</div>
              </div>
            </div>

          </div>

          {/* Hero Visual Collage (4 Large Interactive Real Photos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
            
            {/* Card 1: Solar Parabolic Trough */}
            <div 
              onClick={() => setLightboxImage('/real-photos/zenitek_photo_18.jpeg')}
              className="relative h-72 sm:h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 group cursor-pointer"
            >
              <img
                src="/real-photos/zenitek_photo_18.jpeg"
                alt="Parabolic Trough Collector"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black text-blue-700 uppercase">
                Solar Thermal
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-base sm:text-lg font-black leading-snug">Parabolic Trough Collector</div>
                <div className="text-xs sm:text-sm text-slate-200 font-semibold mt-0.5">Pachamalai Hills 37.5 Sq.m</div>
              </div>
            </div>

            {/* Card 2: Commercial Polyhouse Tunnel */}
            <div 
              onClick={() => setLightboxImage('/real-photos/zenitek_photo_04.jpeg')}
              className="relative h-72 sm:h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 group cursor-pointer"
            >
              <img
                src="/real-photos/zenitek_photo_04.jpeg"
                alt="Commercial Polyhouse Tunnel Dryer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black text-emerald-700 uppercase">
                Agri-Solar
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-base sm:text-lg font-black leading-snug">SOLDRY 1210 Polyhouse</div>
                <div className="text-xs sm:text-sm text-slate-200 font-semibold mt-0.5">Automated Fan Circulation</div>
              </div>
            </div>

            {/* Card 3: Active Crop Dehydration Hub */}
            <div 
              onClick={() => setLightboxImage('/real-photos/zenitek_photo_23.jpeg')}
              className="relative h-72 sm:h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 group cursor-pointer"
            >
              <img
                src="/real-photos/zenitek_photo_23.jpeg"
                alt="Internal Dehydration Chamber"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black text-rose-700 uppercase">
                Food Grade
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-base sm:text-lg font-black leading-snug">SS304 Food Drying Trays</div>
                <div className="text-xs sm:text-sm text-slate-200 font-semibold mt-0.5">Zero Dust & Rain Protection</div>
              </div>
            </div>

            {/* Card 4: Precision SUNDRY Box Dryer */}
            <div 
              onClick={() => setLightboxImage('/real-photos/zenitek_photo_27.jpeg')}
              className="relative h-72 sm:h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 group cursor-pointer"
            >
              <img
                src="/real-photos/zenitek_photo_27.jpeg"
                alt="SUNDRY 50 Stainless Box Dryer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black text-amber-700 uppercase">
                Farm Box Dryer
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-base sm:text-lg font-black leading-snug">SUNDRY 50 Commercial Unit</div>
                <div className="text-xs sm:text-sm text-slate-200 font-semibold mt-0.5">Dual Fan & Solar DC System</div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 2. OUR ROOTS, EVOLUTION & GLOBAL MENTORS (DOCUMENT 2) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left 6 cols: Roots & Story */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="space-y-3">
                <span className="text-sm sm:text-base font-black text-[#002DC2] uppercase tracking-wider">
                  Roots & Engineering DNA
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                  Pioneering Renewable Energy <br />
                  <span className="text-[#002DC2]">From Erode to All India</span>
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                <p>
                  Originally established in <strong className="text-slate-950 font-bold">2017</strong> under the name <strong className="text-slate-950 font-bold">Smart Bricks Construction</strong>, our early initiatives manufactured eco-friendly building materials alongside localized solar power systems.
                </p>
                <p>
                  In <strong className="text-slate-950 font-bold">2021</strong>, we transformed into <strong className="text-slate-950 font-bold">ZeniTEK</strong> in Erode, shifting our sole focus to designing, manufacturing, erecting, and servicing advanced solar thermal systems and clean agricultural technologies.
                </p>
              </div>

              {/* Mentorship Gratitude Card (Highlighting NISE & Pro-Target Germany) */}
              <div className="p-6 rounded-3xl bg-[#F0F4FD] border-2 border-[#002DC2]/20 relative overflow-hidden space-y-3 shadow-sm">
                <div className="flex items-center space-x-2 text-sm sm:text-base font-black uppercase tracking-wider text-[#002DC2]">
                  <Award className="w-5 h-5 text-[#002DC2]" />
                  <span>Technical Gratitude & Mentorship</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  We express our deepest gratitude to <strong className="text-slate-950 font-black">Shri. S.K. Singh</strong> (Former Director of Solar Thermal Energy, NISE) and <strong className="text-slate-950 font-black">Mr. John Mitchell</strong> (Technical Director of Pro-Target, Germany) for their invaluable guidance in developing our first commercial parabolic trough collector.
                </p>
              </div>

              {/* Action consultation button */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: "About Us Consultation" })}
                  className="px-7 py-4 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2.5 cursor-pointer hover:scale-102"
                >
                  <span>Connect With Our Engineering Team</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right 6 cols: High-Res Real Installation Image with Emblem Overlay */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white group">
                <img
                  src="/real-photos/zenitek_photo_12.jpeg"
                  alt="ZeniTEK Large Solar Installation"
                  className="w-full h-96 sm:h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Floating Glassmorphic Emblem */}
                <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/60 shadow-xl flex items-center space-x-3.5">
                  <img src="/emblem.png" alt="ZeniTEK Emblem" className="w-10 h-10 object-contain" />
                  <div>
                    <div className="text-sm font-black text-slate-900">ZeniTEK R&D Hub</div>
                    <div className="text-xs font-bold text-slate-500">Erode, Tamil Nadu</div>
                  </div>
                </div>

                {/* Floating Project Pill */}
                <div className="absolute bottom-5 inset-x-5 bg-slate-950/90 backdrop-blur-md p-5 rounded-2xl text-white border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-400 pb-1.5">
                    <span>Field Verified System</span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-black">
                      Patented Aerodynamics
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white">
                    Large-Scale Commercial Solar Polyhouse Facility
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 3. "WHAT WE DO" — 4 CORE DOMAINS (IMAGE-CENTRIC VISUAL CARDS) */}
      <section className="py-16 sm:py-24 bg-slate-100/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-sm sm:text-base font-black text-[#002DC2] uppercase tracking-wider">
              Core Engineering Focus
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              What We Do
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 font-medium">
              Combining thermal engineering, solar energy, automation, and applied research into clean, high-performance systems.
            </p>
          </div>

          {/* 4 Large Visual Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whatWeDoDomains.map((domain) => {
              const Icon = domain.icon;
              return (
                <div
                  key={domain.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Photo Header with Badge */}
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img
                      src={domain.image}
                      alt={domain.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    
                    <span className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-black text-[#002DC2] shadow-sm">
                      {domain.badge}
                    </span>

                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <div className="flex items-center space-x-2 text-emerald-400 text-xs sm:text-sm font-bold mb-1.5">
                        <Icon className="w-4 h-4" />
                        <span>{domain.metricLabel}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        {domain.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content with Larger Legible Text */}
                  <div className="p-7 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                    <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
                      {domain.desc}
                    </p>

                    {/* Bullet Specs List */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      {domain.specs.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 text-sm sm:text-base font-bold text-slate-900">
                          <div className="w-5 h-5 rounded-full bg-[#002DC2]/15 text-[#002DC2] flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: domain.title })}
                        className="w-full py-3.5 bg-[#F0F4FD] hover:bg-[#002DC2] text-[#002DC2] hover:text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                      >
                        <span>Request Specifications</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 4. LANDMARK INSTALLED PROJECTS GALLERY (REAL INSTALLATIONS FROM DOCUMENT 2) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-sm sm:text-base font-black text-[#002DC2] uppercase tracking-wider">
                Installed Projects Portfolio
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight mt-1">
                Landmark Installations & Test Rigs
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setProjectCategory('all')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  projectCategory === 'all'
                    ? 'bg-[#002DC2] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setProjectCategory('thermal')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  projectCategory === 'thermal'
                    ? 'bg-[#002DC2] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Solar Thermal
              </button>
              <button
                onClick={() => setProjectCategory('agri')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  projectCategory === 'agri'
                    ? 'bg-[#002DC2] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Agri-Solar
              </button>
              <button
                onClick={() => setProjectCategory('pv')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  projectCategory === 'pv'
                    ? 'bg-[#002DC2] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                PV Test Labs
              </button>
            </div>
          </div>

          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Photo with zoom & tag */}
                <div 
                  onClick={() => setLightboxImage(proj.image)}
                  className="relative h-60 sm:h-64 overflow-hidden cursor-pointer"
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {proj.badge}
                  </span>
                  <div className="absolute bottom-4 right-4 bg-white/95 p-2 rounded-xl text-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Content with Large Legible Font */}
                <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-500">
                      <MapPin className="w-4 h-4 text-[#23AC39] shrink-0" />
                      <span>{proj.location}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-[#002DC2] transition-colors">
                      {proj.title}
                    </h3>

                    <div className="text-xs sm:text-sm font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl inline-block">
                      {proj.client}
                    </div>

                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium pt-1">
                      {proj.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: proj.title })}
                      className="text-sm sm:text-base font-bold text-[#002DC2] hover:underline flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Inquire About Similar Setup</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 5. PRESTIGIOUS CLIENTS & INSTITUTIONAL PARTNERS (DOCUMENT 2) */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
        <div className="space-y-12">
          
          <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <span className="text-sm sm:text-base font-black text-[#002DC2] uppercase tracking-wider">
              Trusted Institutional Deployments
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              Academic & Industrial Partners
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 font-medium">
              Supplying standard renewable energy systems, prototype demonstration rigs, and commercial installations across India.
            </p>
          </div>

          {/* Academic Partners Continuous Marquee Rail */}
          <div className="space-y-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-sm sm:text-base font-black uppercase tracking-wider text-slate-700">
              <GraduationCap className="w-5 h-5 text-[#002DC2]" />
              <span>Academic Institutions</span>
            </div>

            <div className="relative w-full overflow-hidden py-3">
              {/* Left and Right Fade Gradient Masks */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10" />

              <div className="animate-marquee-continuous flex items-center">
                {/* Track Half 1 */}
                <div className="flex items-center gap-5 pr-5 shrink-0">
                  {academicClients.map((client, idx) => (
                    <div
                      key={`acad-h1-${idx}`}
                      className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4 w-[340px] sm:w-[420px] shrink-0"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-100 shadow-xs p-2 flex items-center justify-center shrink-0">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-[#002DC2] uppercase tracking-wider block truncate">
                          {client.tag}
                        </span>
                        <div className="text-base sm:text-lg font-black text-slate-900 truncate mt-0.5">
                          {client.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium truncate mt-0.5">
                          {client.branch}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Track Half 2 (Identical duplicate for seamless continuous motion) */}
                <div className="flex items-center gap-5 pr-5 shrink-0" aria-hidden="true">
                  {academicClients.map((client, idx) => (
                    <div
                      key={`acad-h2-${idx}`}
                      className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4 w-[340px] sm:w-[420px] shrink-0"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-100 shadow-xs p-2 flex items-center justify-center shrink-0">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-[#002DC2] uppercase tracking-wider block truncate">
                          {client.tag}
                        </span>
                        <div className="text-base sm:text-lg font-black text-slate-900 truncate mt-0.5">
                          {client.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium truncate mt-0.5">
                          {client.branch}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Industry Clients Continuous Marquee Rail */}
          <div className="space-y-4 pt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-sm sm:text-base font-black uppercase tracking-wider text-slate-700">
              <Factory className="w-5 h-5 text-[#23AC39]" />
              <span>Industry Clients & Mentors</span>
            </div>

            <div className="relative w-full overflow-hidden py-3">
              {/* Left and Right Fade Gradient Masks */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10" />

              <div className="animate-marquee-continuous-fast flex items-center">
                {/* Track Half 1 */}
                <div className="flex items-center gap-5 pr-5 shrink-0">
                  {industryClients.map((client, idx) => (
                    <div
                      key={`ind-h1-${idx}`}
                      className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4 w-[340px] sm:w-[420px] shrink-0"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-100 shadow-xs p-2 flex items-center justify-center shrink-0">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-[#23AC39] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block truncate">
                          {client.tag}
                        </span>
                        <div className="text-base sm:text-lg font-black text-slate-900 truncate mt-1">
                          {client.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium truncate mt-0.5">
                          {client.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Track Half 2 (Identical duplicate for seamless continuous motion) */}
                <div className="flex items-center gap-5 pr-5 shrink-0" aria-hidden="true">
                  {industryClients.map((client, idx) => (
                    <div
                      key={`ind-h2-${idx}`}
                      className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4 w-[340px] sm:w-[420px] shrink-0"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-100 shadow-xs p-2 flex items-center justify-center shrink-0">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-[#23AC39] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block truncate">
                          {client.tag}
                        </span>
                        <div className="text-base sm:text-lg font-black text-slate-900 truncate mt-1">
                          {client.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium truncate mt-0.5">
                          {client.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 6. REAL FIELD PHOTO GALLERY REEL (8 PHOTOS) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-sm sm:text-base font-black text-[#002DC2] uppercase tracking-wider">
              Authentic Visual Proof
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              Real Field Photo Reel
            </h2>
            <p className="text-base sm:text-lg text-slate-700 font-medium">
              Click any image to view in full-screen high resolution.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {realPhotoGallery.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(photo.src)}
                className="relative h-48 sm:h-60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 group cursor-pointer"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <div className="text-sm sm:text-base font-black">{photo.title}</div>
                  <div className="text-xs text-slate-300 font-semibold">{photo.tag}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 7. ENGINEERING CAPABILITIES & HOW WE WORK */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left 5 cols: How We Work & Our Focus */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-sm sm:text-base font-black text-[#002DC2] uppercase tracking-wider">
                Our Methodology
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                How We Work
              </h2>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                We combine engineering analysis, practical field testing, and user feedback to develop systems that are technically sound and operationally simple.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1.5">
                  <div className="text-sm sm:text-base font-black text-[#002DC2] uppercase tracking-wider">Sustainable Engineering</div>
                  <p className="text-sm sm:text-base text-slate-700 font-medium">Reduce energy use and support cleaner process technologies.</p>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1.5">
                  <div className="text-sm sm:text-base font-black text-[#002DC2] uppercase tracking-wider">Application-Driven Design</div>
                  <p className="text-sm sm:text-base text-slate-700 font-medium">Develop systems tailored around real farm & factory conditions.</p>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1.5">
                  <div className="text-sm sm:text-base font-black text-[#002DC2] uppercase tracking-wider">Research to Deployment</div>
                  <p className="text-sm sm:text-base text-slate-700 font-medium">Convert ideas and prototypes into practical, manufacturable solutions.</p>
                </div>
              </div>
            </div>

            {/* Right 7 cols: 4 Capabilities Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-[#002DC2]/40 hover:shadow-lg transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#F0F4FD] text-[#002DC2] group-hover:bg-[#002DC2] group-hover:text-white flex items-center justify-center transition-colors">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#002DC2] transition-colors">
                  Product Engineering
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Concept development, system design, and rapid functional prototyping.
                </p>
              </div>

              <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-[#002DC2]/40 hover:shadow-lg transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#F0F4FD] text-[#002DC2] group-hover:bg-[#002DC2] group-hover:text-white flex items-center justify-center transition-colors">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#002DC2] transition-colors">
                  Automation & Controls
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Sensor-based PLC/HMI monitoring, process control, and energy optimization.
                </p>
              </div>

              <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-[#002DC2]/40 hover:shadow-lg transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#F0F4FD] text-[#002DC2] group-hover:bg-[#002DC2] group-hover:text-white flex items-center justify-center transition-colors">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#002DC2] transition-colors">
                  Fabrication & Integration
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Laser-cut GI structural steel, CNC folded enclosures, and weatherproofing.
                </p>
              </div>

              <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-[#002DC2]/40 hover:shadow-lg transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-[#F0F4FD] text-[#002DC2] group-hover:bg-[#002DC2] group-hover:text-white flex items-center justify-center transition-colors">
                  <Microscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#002DC2] transition-colors">
                  Testing & Validation
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Prototype evaluation, demonstration rigs, and iterative field improvements.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 8. REGISTERED DETAILS & CONSULTATION CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#F0F4FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#123B92] text-white rounded-3xl p-8 sm:p-14 lg:p-18 shadow-2xl relative overflow-hidden">
            
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-8 space-y-5 text-left">
                <span className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wider bg-white/10 px-4 py-1.5 rounded-full">
                  Direct EPC Consultation
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  Connect With ZeniTEK Engineers
                </h2>
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-medium">
                  Contact our Erode engineering office for technical sizing, university research collaboration, or subsidy assistance on solar drying systems.
                </p>

                {/* Registered Address & GST Info */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base text-slate-200 font-semibold">
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Erode, Tamil Nadu — 638 112</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>+91-8903852623</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>GST: 33AACFZ8530G1Z5</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
                <button
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: "About Us Consultation" })}
                  className="px-8 py-4 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl hover:scale-102 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
                >
                  <span>Request Engineering Quote</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="tel:+918903852623"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base uppercase tracking-wider rounded-2xl border border-white/20 transition-all flex items-center justify-center space-x-2.5 text-center"
                >
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span>Call: +91-8903852623</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* LIGHTBOX MODAL FOR REAL PHOTOS */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2 cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={lightboxImage}
              alt="Enlarged Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </div>
  );
}
