import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectGalleryData } from '../data/projectGalleryData';
import { useLanguage } from '../context/LanguageContext';
import MapComponent from '../components/MapComponent';
import {
  MapPin, Calendar, Search, Filter, Sparkles, ArrowRight, ShieldCheck,
  CheckCircle2, X, PhoneCall, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  SlidersHorizontal, Eye, LayoutGrid
} from 'lucide-react';

export default function SolarDryersPage({ onOpenQuoteModal }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const isTamil = lang === 'ta';

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Configurable rows per page matching table controls

  const stateOptions = [
    { label: 'All States', value: 'All', count: 25 },
    { label: 'Tamil Nadu', value: 'Tamil Nadu', count: 11 },
    { label: 'Karnataka', value: 'Karnataka', count: 8 },
    { label: 'Mizoram', value: 'Mizoram', count: 2 },
    { label: 'Assam', value: 'Assam', count: 1 },
    { label: 'Maharashtra', value: 'Maharashtra', count: 1 },
    { label: 'Chhattisgarh', value: 'Chhattisgarh', count: 1 }
  ];

  const yearOptions = ['All', '2026', '2025', '2024', '2023'];

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projectGalleryData.filter(proj => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.locality.toLowerCase().includes(q) ||
        proj.state.toLowerCase().includes(q) ||
        proj.dryerCode.toLowerCase().includes(q) ||
        proj.application.toLowerCase().includes(q) ||
        proj.id.includes(q);

      const matchesState = selectedState === 'All' || proj.state.toLowerCase() === selectedState.toLowerCase();
      const matchesYear = selectedYear === 'All' || proj.year.toString() === selectedYear;

      return matchesSearch && matchesState && matchesYear;
    });
  }, [searchQuery, selectedState, selectedYear]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedYear]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const gridElem = document.getElementById('dryers-grid');
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="space-y-10 pb-20 pt-6 bg-slate-50 text-slate-900 min-h-screen">
      
      {/* SECTION 1: CLEAN, ELEGANT HERO (AESTHETIC & BREATHABLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 overflow-hidden shadow-xl border border-blue-800/60">
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-green-400" />
                <span>Agricultural Solar Drying Installations • 2023 - 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Operational Solar Dryers <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
                  Across 6 Indian States
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/85 font-medium leading-relaxed">
                Browse our verified 25 field installation sites. Click <strong>"View Details"</strong> on any project to see complete high-resolution photos, technical specifications, and drying metrics.
              </p>
            </div>

            {/* Quick Summary Pill Counters */}
            <div className="flex sm:flex-row md:flex-col gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 flex items-center space-x-3">
                <div className="text-2xl font-black text-green-400">25</div>
                <div className="text-[11px] text-blue-100 font-bold uppercase leading-tight">
                  Projects <br />Installed
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 flex items-center space-x-3">
                <div className="text-2xl font-black text-blue-300">6</div>
                <div className="text-[11px] text-blue-100 font-bold uppercase leading-tight">
                  Indian <br />States
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 2: STREAMLINED FILTER & SEARCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4" id="dryers-grid">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project, state, crop, or model code..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Year Filters */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> Year:
              </span>
              {yearOptions.map(yr => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${selectedYear === yr ? 'bg-green-700 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {yr}
                </button>
              ))}
            </div>

          </div>

          {/* State Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold pt-1 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> State:
            </span>
            {stateOptions.map(st => (
              <button
                key={st.value}
                onClick={() => setSelectedState(st.value)}
                className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${selectedState === st.value ? 'bg-blue-800 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <span>{st.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedState === st.value ? 'bg-blue-900 text-blue-200' : 'bg-slate-200 text-slate-600'}`}>
                  {st.count}
                </span>
              </button>
            ))}

            {(selectedState !== 'All' || selectedYear !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedState('All');
                  setSelectedYear('All');
                  setSearchQuery('');
                }}
                className="ml-auto text-xs font-bold text-rose-600 hover:underline shrink-0 pl-2"
              >
                Clear Filters
              </button>
            )}
          </div>

        </div>

        {/* Results Count Header */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-900">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredProjects.length)}</span> of <span className="font-bold text-blue-900">{filteredProjects.length}</span> solar dryer installations
          </div>
          <div>
            Page <span className="font-bold text-slate-900">{currentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
          </div>
        </div>
      </section>


      {/* SECTION 3: CLEAN, DECLUTTERED 3-COLUMN CARDS WITH "VIEW DETAILS" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Projects Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or state filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {paginatedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group"
              >
                
                <div>
                  {/* FULL IMAGE FIRST - NO TEXT, NO BADGES OR OVERLAYS ON THE IMAGE */}
                  <div
                    className="h-56 sm:h-64 w-full overflow-hidden bg-slate-100 cursor-pointer rounded-t-3xl"
                    onClick={() => navigate(`/dryers/${project.id}`)}
                  >
                    <img
                      src={project.image}
                      alt={`${project.title} - ${project.locality}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Body - All Information & Badges placed cleanly below the image */}
                  <div className="p-5 space-y-3.5">
                    
                    {/* Identification Badges Row (Placed outside the image) */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2.5 py-1 bg-blue-950 text-white font-mono font-black text-xs rounded-lg shadow-sm">
                          #{project.id}
                        </span>
                        <span className="px-2.5 py-1 bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm">
                          {project.year}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 truncate">
                        {project.category}
                      </span>
                    </div>

                    {/* Title & Locality */}
                    <div>
                      <h2
                        onClick={() => navigate(`/dryers/${project.id}`)}
                        className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h2>
                      <div className="text-xs font-semibold text-slate-500 flex items-center mt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1 shrink-0" />
                        <span className="truncate">{project.locality}</span>
                      </div>
                    </div>

                    {/* Model Code Banner (Cleanly styled below title) */}
                    <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        MODEL:
                      </span>
                      <span className="font-mono font-bold text-blue-900 text-xs">
                        {project.dryerCode}
                      </span>
                    </div>

                    {/* Target Application & Produce Icon */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="text-[9px] uppercase font-bold text-green-700 tracking-wider">
                          DRYING CROP
                        </div>
                        <div className="text-xs font-bold text-slate-800 line-clamp-1">
                          {project.application}
                        </div>
                      </div>

                      {project.produceImage && (
                        <div className="w-12 h-10 shrink-0 bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center">
                          <img
                            src={project.produceImage}
                            alt={project.application}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Card Actions: View Details (Primary) & Quote */}
                <div className="p-5 pt-0 space-y-2">
                  <Link
                    to={`/dryers/${project.id}`}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-700 hover:text-white text-blue-900 border border-blue-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-sm group-hover:border-blue-600"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => onOpenQuoteModal && onOpenQuoteModal({
                      capacityNeeded: `${project.dryerCode} (${project.title})`,
                      cropType: project.application,
                      district: project.locality
                    })}
                    className="w-full py-2 text-slate-600 hover:text-green-700 hover:bg-green-50 font-bold text-[11px] rounded-lg transition-all"
                  >
                    Get Quote for This Setup
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 4: DATA-TABLE STYLE PAGINATION BAR (MATCHING USER SCREENSHOT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-slate-950 text-slate-300 border border-slate-800 rounded-2xl px-4 sm:px-6 py-3.5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Row Selection / Project Count Status */}
          <div className="text-xs sm:text-sm text-slate-400 font-medium">
            {filteredProjects.length > 0 ? (
              <span>
                <span className="text-slate-200 font-semibold">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredProjects.length)}</span> of{' '}
                <span className="text-slate-200 font-semibold">{filteredProjects.length}</span> row(s) selected.
              </span>
            ) : (
              <span>0 of 0 row(s) selected.</span>
            )}
          </div>

          {/* Right: Rows per page, Page indicator, and Navigation Controls */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
            
            {/* Rows Per Page Selector */}
            <div className="flex items-center space-x-2.5">
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Rows per page</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none shadow-sm hover:border-slate-600 transition-colors"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                </select>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none rotate-90" />
              </div>
            </div>

            {/* Page X of Y */}
            <div className="text-xs sm:text-sm text-slate-200 font-semibold min-w-[75px] text-center">
              Page {currentPage} of {totalPages}
            </div>

            {/* Pagination Navigation Buttons: << < > >> */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all shadow-sm"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all shadow-sm"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all shadow-sm"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all shadow-sm"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4.5: OPERATIONAL INSTALLATIONS MAP (35 ACTIVE SITES ACROSS INDIA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider bg-green-50 px-2.5 py-1 rounded-full border border-green-200 inline-flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-green-600" /> Pan-India Installations
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-blue-950 mt-1.5">
              Verified Operational Solar Dryers Map
            </h2>
            <p className="text-xs text-slate-500">
              Interactive map of all 35 operational ZeniTEK commercial polyhouse dryer installations across India
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 shrink-0">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>35 Verified Coordinates Active</span>
          </div>
        </div>

        <MapComponent onSelectProjectQuote={(project) => onOpenQuoteModal && onOpenQuoteModal({ cropType: project.cropDrying, capacityNeeded: project.capacity, district: project.locationName })} />
      </section>

      {/* SECTION 5: CLEAN BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold text-green-300 bg-blue-950 px-2.5 py-0.5 rounded uppercase">
              Govt Subsidy Assistance 40% – 60%
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Need a Custom Solar Dryer Sized for Your Farm?
            </h3>
            <p className="text-xs text-blue-100">
              Our engineering team in Coimbatore custom-sizes polyhouse tunnel dryers for any crop harvest volume.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Custom Solar Dryer Project' })}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>{t('getQuote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+918098613422"
              className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5"
            >
              <PhoneCall className="w-4 h-4 text-green-300" />
              <span>Call Support</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
