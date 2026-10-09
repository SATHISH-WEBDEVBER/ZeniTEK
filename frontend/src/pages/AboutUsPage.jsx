import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Award, Zap, Sprout, Cpu, Microscope, ShieldCheck, CheckCircle2,
  MapPin, Phone, Mail, ArrowRight, ExternalLink, ChevronRight,
  ChevronLeft, Sparkles, Building2, Factory, GraduationCap, X,
  Layers, Maximize2, Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutUsPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const location = useLocation();

  // Active category filter for Landmark Projects
  const [projectCategory, setProjectCategory] = useState('all');

  // Lightbox modal state for full-screen photo viewing
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    if (location.hash === '#rnd') {
      const el = document.getElementById('rnd');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  }, [location.hash]);

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
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-slate-50 pt-14 pb-20 lg:pt-20 lg:pb-28">

        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

          {/* Top Headline & Quick Metrics */}
          <div className="text-center max-w-4xl mx-auto space-y-6">

            <div className="inline-flex items-center gap-2.5 max-w-full px-4 sm:px-5 py-2 rounded-2xl sm:rounded-full bg-white border border-[#002DC2]/25 shadow-sm">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#23AC39] animate-pulse shrink-0" />
              <span className="text-2xs sm:text-base font-black uppercase tracking-wide sm:tracking-wider text-[#002DC2] text-balance leading-snug">
                {'ZeniTEK • Renewable Energy Engineering • Erode, Tamil Nadu'}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4">
              <div className="bg-white px-3 py-5 sm:p-5 lg:p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center hover:border-[#002DC2]/40 transition-all hover:shadow-lg min-w-0">
                <div className="text-3xl lg:text-4xl leading-tight font-black tracking-tight text-[#002DC2] break-words">2021</div>
                <div className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wider mt-1.5">Established</div>
              </div>
              <div className="bg-white px-3 py-5 sm:p-5 lg:p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center hover:border-[#002DC2]/40 transition-all hover:shadow-lg min-w-0">
                <div className="text-3xl lg:text-4xl leading-tight font-black tracking-tight text-slate-900 break-words">Erode</div>
                <div className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wider mt-1.5">Tamil Nadu</div>
              </div>
              <div className="bg-white px-3 py-5 sm:p-5 lg:p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center hover:border-[#002DC2]/40 transition-all hover:shadow-lg min-w-0">
                <div className="text-3xl lg:text-4xl leading-tight font-black tracking-tight text-[#23AC39] break-words">Turnkey</div>
                <div className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wider mt-1.5">Design & EPC</div>
              </div>
              <div className="bg-white px-3 py-5 sm:p-5 lg:p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center hover:border-[#002DC2]/40 transition-all hover:shadow-lg min-w-0">
                <div className="text-3xl lg:text-4xl leading-tight font-black tracking-tight text-[#123B92] break-words">100%</div>
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
      <section className="py-16 sm:py-24 bg-white">
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
                <div className="flex items-start gap-2 text-sm sm:text-base font-black uppercase tracking-wider text-[#002DC2] leading-snug">
                  <Award className="w-5 h-5 text-[#002DC2] shrink-0 -mt-px" />
                  <span className="text-balance">Technical Gratitude & Mentorship</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  We express our deepest gratitude to <strong className="text-slate-950 font-black">Shri. S.K. Singh</strong> (Former Director of Solar Thermal Energy, NISE) and <strong className="text-slate-950 font-black">Mr. John Mitchell</strong> (Technical Director of Pro-Target, Germany) for their invaluable guidance in developing our first commercial parabolic trough collector.
                </p>
              </div>

              {/* Action consultation button */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: "About Us Consultation" })}
                  className="w-full sm:w-auto max-w-full px-6 sm:px-7 py-4 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold text-sm uppercase tracking-wide sm:tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2.5 text-center cursor-pointer hover:scale-[1.02]"
                >
                  <span className="text-balance">Connect With Our Engineering Team</span>
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
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-3 rounded-2xl border border-white/60 shadow-xl flex items-center space-x-3.5">
                  <img src="/emblem.png" alt="ZeniTEK Emblem" className="w-10 h-10 object-contain" />
                  <div>
                    <div className="text-sm font-black text-slate-900">ZeniTEK R&D Hub</div>
                    <div className="text-xs font-bold text-slate-500">Erode, Tamil Nadu</div>
                  </div>
                </div>

                {/* Floating Project Pill */}
                <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 bg-slate-950/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl text-white border border-white/10 shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-xs sm:text-sm font-bold text-emerald-400 pb-2">
                    <span className="whitespace-nowrap">Field Verified System</span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-black whitespace-nowrap">
                      Patented Aerodynamics
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white leading-snug text-balance">
                    Large-Scale Commercial Solar Polyhouse Facility
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 3. "WHAT WE DO" — 4 CORE DOMAINS (IMAGE-CENTRIC VISUAL CARDS) */}
      <section className="py-16 sm:py-24 bg-slate-100/70">
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
                  id={domain.id === 'rnd' ? 'rnd' : undefined}
                  className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group scroll-mt-28 ${
                    domain.id === 'rnd' && location.hash === '#rnd'
                      ? 'border-[#002DC2] ring-4 ring-[#002DC2]/20 shadow-2xl'
                      : 'border-slate-200/90 shadow-md hover:shadow-2xl'
                  }`}
                >
                  {/* Photo Header with Badge */}
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img
                      src={domain.image}
                      alt={domain.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    <span className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-black text-[#002DC2] shadow-sm whitespace-nowrap">
                      {domain.badge}
                    </span>

                    <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 text-white">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-emerald-300 text-xs sm:text-sm font-bold mb-1.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-white font-black whitespace-nowrap">{domain.metric}</span>
                        <span>{domain.metricLabel}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
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
                        className="w-full py-3.5 bg-[#F0F4FD] hover:bg-[#002DC2] text-[#002DC2] hover:text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
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
      <section className="py-16 sm:py-24 bg-white">
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
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${projectCategory === 'all'
                    ? 'bg-[#002DC2] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setProjectCategory('thermal')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${projectCategory === 'thermal'
                    ? 'bg-[#002DC2] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                Solar Thermal
              </button>
              <button
                onClick={() => setProjectCategory('agri')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${projectCategory === 'agri'
                    ? 'bg-[#002DC2] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                Agri-Solar
              </button>
              <button
                onClick={() => setProjectCategory('pv')}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${projectCategory === 'pv'
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
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-[#002DC2] transition-colors">
                      {proj.title}
                    </h3>

                    <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-slate-500 leading-snug">
                      <MapPin className="w-4 h-4 text-[#23AC39] shrink-0 mt-px" />
                      <span>{proj.location}</span>
                    </div>

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
      <section className="py-16 sm:py-24 bg-slate-50 overflow-hidden">
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
          <div className="space-y-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-2.5 text-sm sm:text-base lg:text-lg font-black uppercase tracking-wider text-slate-800 text-center">
              <GraduationCap className="w-6 h-6 text-[#002DC2]" />
              <span>Academic Institutions</span>
            </div>

            <div className="relative w-full overflow-hidden py-3 client-marquee-container">
              {/* Left and Right Fade Gradient Masks */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10" />

              <div className="animate-marquee-continuous flex items-center">
                {/* Track Half 1 */}
                <div className="flex items-center gap-6 pr-6 shrink-0">
                  {academicClients.map((client, idx) => (
                    <div
                      key={`acad-h1-${idx}`}
                      className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-shadow flex items-center space-x-5 w-[380px] sm:w-[470px] shrink-0"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200 shadow-sm p-2.5 sm:p-3 flex items-center justify-center shrink-0">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-bold text-[#002DC2] uppercase tracking-wider block truncate">
                          {client.tag}
                        </span>
                        <div className="text-lg sm:text-xl font-black text-slate-900 truncate mt-1">
                          {client.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2 leading-snug mt-1">
                          {client.branch}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Track Half 2 (Identical duplicate for seamless continuous motion) */}
                <div className="flex items-center gap-6 pr-6 shrink-0" aria-hidden="true">
                  {academicClients.map((client, idx) => (
                    <div
                      key={`acad-h2-${idx}`}
                      className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-shadow flex items-center space-x-5 w-[380px] sm:w-[470px] shrink-0"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200 shadow-sm p-2.5 sm:p-3 flex items-center justify-center shrink-0">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-bold text-[#002DC2] uppercase tracking-wider block truncate">
                          {client.tag}
                        </span>
                        <div className="text-lg sm:text-xl font-black text-slate-900 truncate mt-1">
                          {client.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2 leading-snug mt-1">
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
          <div className="space-y-5 pt-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-2.5 text-sm sm:text-base lg:text-lg font-black uppercase tracking-wider text-slate-800 text-center">
              <Factory className="w-6 h-6 text-[#23AC39]" />
              <span>Industry Clients & Mentors</span>
            </div>

            <div className="relative w-full overflow-hidden py-3 client-marquee-container">
              {/* Left and Right Fade Gradient Masks */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10" />

              <div className="animate-marquee-continuous-fast flex items-center">
                {/* Track Half 1 */}
                <div className="flex items-center gap-6 pr-6 shrink-0">
                  {industryClients.map((client, idx) => (
                    <div
                      key={`ind-h1-${idx}`}
                      className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-shadow flex items-center space-x-5 w-[380px] sm:w-[470px] shrink-0"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200 shadow-sm p-2.5 sm:p-3 flex items-center justify-center shrink-0">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-bold text-[#23AC39] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block truncate">
                          {client.tag}
                        </span>
                        <div className="text-lg sm:text-xl font-black text-slate-900 truncate mt-1.5">
                          {client.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2 leading-snug mt-1">
                          {client.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Track Half 2 (Identical duplicate for seamless continuous motion) */}
                <div className="flex items-center gap-6 pr-6 shrink-0" aria-hidden="true">
                  {industryClients.map((client, idx) => (
                    <div
                      key={`ind-h2-${idx}`}
                      className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-shadow flex items-center space-x-5 w-[380px] sm:w-[470px] shrink-0"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200 shadow-sm p-2.5 sm:p-3 flex items-center justify-center shrink-0">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-bold text-[#23AC39] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block truncate">
                          {client.tag}
                        </span>
                        <div className="text-lg sm:text-xl font-black text-slate-900 truncate mt-1.5">
                          {client.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2 leading-snug mt-1">
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
      <section className="py-16 sm:py-24 bg-white">
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

      {/* 7. REGISTERED DETAILS & CONSULTATION CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#F0F4FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-[#123B92] text-white rounded-3xl p-8 sm:p-14 lg:p-[72px] shadow-2xl relative overflow-hidden">

            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              <div className="lg:col-span-8 space-y-5 text-left">
                <span className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wider bg-white/10 px-4 py-1.5 rounded-full inline-block">
                  Direct EPC Consultation
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  Connect With ZeniTEK Engineers
                </h2>
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-medium">
                  Contact our Erode engineering office for technical sizing, university research collaboration, or subsidy assistance on solar drying systems.
                </p>

                {/* Registered Address & GST Info */}
                <div className="pt-3 flex flex-col sm:flex-row sm:flex-wrap gap-x-8 gap-y-3 text-sm sm:text-base text-slate-200 font-semibold">
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="whitespace-nowrap">Erode, Tamil Nadu — 638 112</span>
                  </div>
                  <a
                    href="tel:+918903852623"
                    className="flex items-center space-x-2.5 hover:text-emerald-300 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>+91-8903852623</span>
                  </a>
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>GST: 33AACFZ8530G1Z5</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                <button
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: "About Us Consultation" })}
                  className="w-full px-6 py-4 bg-[#23AC39] hover:bg-[#1f9632] text-white font-extrabold text-sm sm:text-base uppercase tracking-wide sm:tracking-wider rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 text-center cursor-pointer"
                >
                  <span className="text-balance">Request Engineering Quote</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Direct Call & WhatsApp Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <a
                    href="tel:+918903852623"
                    className="px-3 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap rounded-2xl border border-white/20 hover:border-white/40 transition-all flex items-center justify-center space-x-2 text-center hover:scale-[1.01] shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Call Directly</span>
                  </a>

                  <a
                    href="https://wa.me/918903852623?text=Hello%20ZeniTEK%20Team,%20I%20would%20like%20to%20consult%20regarding%20solar%20thermal%20and%20drying%20solutions."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-center hover:scale-[1.01]"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 2C6.495 2 2 6.494 2 12.03c0 1.769.46 3.498 1.334 5.018L2 22l5.122-1.342a10.016 10.016 0 004.909 1.272h.004c5.535 0 10.03-4.494 10.03-10.03A10.03 10.03 0 0012.031 2zm0 18.366h-.003a8.318 8.318 0 01-4.238-1.163l-.304-.18-3.148.825.84-3.068-.198-.315A8.32 8.32 0 013.7 12.03c0-4.595 3.738-8.332 8.334-8.332a8.3 8.3 0 015.892 2.44 8.3 8.3 0 012.44 5.892c0 4.596-3.738 8.336-8.335 8.336zm4.568-6.242c-.25-.125-1.48-.73-1.71-.813-.23-.083-.398-.125-.565.125-.168.25-.65.813-.797.98-.146.166-.293.187-.543.062a6.93 6.93 0 01-2.02-1.246 7.64 7.64 0 01-1.398-1.74c-.146-.25-.016-.385.109-.51.112-.112.25-.292.375-.438.125-.146.167-.25.25-.417.084-.167.042-.313-.02-.438-.063-.125-.564-1.36-.773-1.862-.204-.49-.41-.423-.564-.431-.146-.008-.313-.01-.48-.01-.167 0-.438.063-.667.313-.23.25-.875.855-.875 2.085s.896 2.418 1.021 2.585c.125.167 1.76 2.688 4.264 3.77.596.257 1.061.411 1.424.526.598.19 1.143.163 1.573.099.48-.072 1.48-.605 1.688-1.189.209-.584.209-1.084.146-1.189-.062-.104-.23-.166-.48-.291z" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
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
