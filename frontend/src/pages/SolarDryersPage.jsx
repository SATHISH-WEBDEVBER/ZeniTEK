import React, { useState, useMemo } from 'react';
import { projectGalleryData } from '../data/projectGalleryData';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin, Calendar, Search, Filter, Sparkles, ArrowRight, ShieldCheck,
  Eye, CheckCircle2, X, PhoneCall, Grid, List, SlidersHorizontal, Tag, Award
} from 'lucide-react';

export default function SolarDryersPage({ onOpenQuoteModal }) {
  const { t, lang } = useLanguage();
  const isTamil = lang === 'ta';

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modal / Lightbox State
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [mulbagalView, setMulbagalView] = useState('exterior'); // 'exterior' | 'interior'

  // Extract unique filter options
  const stateOptions = ['All', 'Tamil Nadu', 'Karnataka', 'Mizoram', 'Assam', 'Maharashtra', 'Chhattisgarh'];
  const yearOptions = ['All', '2026', '2025', '2024', '2023'];
  const categoryOptions = ['All', 'Business', 'Women\'s self-help group business', 'Household', 'Farm business', 'Research & development'];

  // Filter logic
  const filteredProjects = useMemo(() => {
    return projectGalleryData.filter(proj => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.locality.toLowerCase().includes(q) ||
        proj.state.toLowerCase().includes(q) ||
        proj.dryerCode.toLowerCase().includes(q) ||
        proj.application.toLowerCase().includes(q) ||
        proj.category.toLowerCase().includes(q) ||
        proj.id.includes(q);

      // State
      const matchesState = selectedState === 'All' || proj.state.toLowerCase() === selectedState.toLowerCase();

      // Year
      const matchesYear = selectedYear === 'All' || proj.year.toString() === selectedYear;

      // Category
      const matchesCat = selectedCategory === 'All' || proj.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesState && matchesYear && matchesCat;
    });
  }, [searchQuery, selectedState, selectedYear, selectedCategory]);

  return (
    <div className="space-y-12 pb-20 pt-6 bg-slate-50 text-slate-900 min-h-screen">
      
      {/* SECTION 1: HERO HEADER (Matching Page 1 of Official PDF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-blue-800/60">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-800/80 border border-blue-600 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-green-400" />
                <span>
                  {isTamil ? 'திட்ட நிறுவல் படத்தொகுப்பு • 2023 - 2026' : 'PROJECT INSTALLATION GALLERY • 2023 - 2026'}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  {isTamil ? 'இந்தியா முழுவதும் விவசாய' : 'Agricultural Solar Drying'} <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-blue-300">
                    {isTamil ? 'சோலார் உலர்த்தி களத் திட்டங்கள்' : 'Installations Across India'}
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-blue-100/90 font-medium max-w-2xl leading-relaxed pt-1">
                  {isTamil
                    ? '25 கள திட்டங்கள், 6 மாநிலங்கள் மற்றும் 50+ பயிர் உலர்த்தல் அனுபவங்கள். கோயம்பத்தூரில் தயாரிக்கப்படும் உயர் திறன் UV பாலிஹவுஸ் சோலார் உலர்த்திகள்.'
                    : 'Explore all 25 field installation sites documented across 6 Indian states. High-efficiency UV-stabilized polyhouse greenhouse solar thermal dryers engineered by ZeniTEK for farmers, FPOs, and agro-businesses.'}
                </p>
              </div>

              {/* Stat Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                  <div className="text-3xl font-black text-green-400">25</div>
                  <div className="text-xs text-blue-200 uppercase font-bold tracking-wider mt-0.5">
                    {isTamil ? 'நிறுவப்பட்ட திட்டங்கள்' : 'Projects Completed'}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                  <div className="text-3xl font-black text-blue-300">6</div>
                  <div className="text-xs text-blue-200 uppercase font-bold tracking-wider mt-0.5">
                    {isTamil ? 'மாநிலங்கள்' : 'States Across India'}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                  <div className="text-3xl font-black text-amber-300">2023–26</div>
                  <div className="text-xs text-blue-200 uppercase font-bold tracking-wider mt-0.5">
                    {isTamil ? 'செயல்பாட்டு ஆண்டுகள்' : 'Active Field Years'}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                  <div className="text-3xl font-black text-emerald-400">100%</div>
                  <div className="text-xs text-blue-200 uppercase font-bold tracking-wider mt-0.5">
                    {isTamil ? 'சூரிய ஒளி ஆற்றல்' : 'Zero Fuel Clean Tech'}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual (Gohpur Featured Card) */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl space-y-3 group hover:border-green-400/50 transition-all">
                <div className="relative rounded-2xl overflow-hidden h-52 sm:h-56">
                  <img
                    src="/projects/project-19.jpg"
                    alt="Gohpur, Assam Solar Dryer Installation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 bg-blue-900/90 text-white font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-lg border border-blue-700 backdrop-blur-md">
                    GOHPUR, ASSAM • 2026
                  </span>
                  <span className="absolute bottom-3 right-3 bg-green-700/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-md backdrop-blur-md">
                    Model: D1210 - 300
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-blue-100 pt-1">
                  <span className="font-semibold flex items-center">
                    <ShieldCheck className="w-4 h-4 text-green-400 mr-1" /> MNRE & ISO Certified
                  </span>
                  <button
                    onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Commercial Polyhouse Solar Dryer' })}
                    className="font-bold text-white bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg transition-colors shadow"
                  >
                    {t('getQuote')}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 2: SEARCH & INTERACTIVE FILTER CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
          
          {/* Top Row: Search Input + State Filters + Grid/List View Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTamil ? "திட்டம், ஊர், பயிர் அல்லது மாடல் தேடுக (எ.கா. Pollachi, D1210, Copra)..." : "Search project, location, crop, or model (e.g. Pollachi, D1210, Copra)..."}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-inner font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results Count & View Toggle */}
            <div className="flex items-center justify-between lg:justify-end space-x-4">
              <div className="text-xs font-bold text-slate-600">
                {isTamil ? 'காட்டப்படுவது: ' : 'Showing: '}
                <span className="text-blue-900 font-extrabold text-sm">{filteredProjects.length}</span> / 25 {isTamil ? 'திட்டங்கள்' : 'Projects'}
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${viewMode === 'grid' ? 'bg-white text-blue-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${viewMode === 'list' ? 'bg-white text-blue-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* State Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-bold">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> State:
            </span>
            {stateOptions.map(st => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${selectedState === st ? 'bg-blue-800 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Secondary Filter: Year & Category */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            
            {/* Year Filters */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> Year:
              </span>
              {yearOptions.map(yr => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${selectedYear === yr ? 'bg-green-700 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {yr}
                </button>
              ))}
            </div>

            <span className="text-slate-300 hidden sm:inline">|</span>

            {/* Category Dropdown Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center">
                <SlidersHorizontal className="w-3 h-3 mr-1" /> Sector:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold rounded-lg px-2.5 py-1 cursor-pointer focus:outline-none focus:border-blue-600"
              >
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Reset Filter Button */}
            {(selectedState !== 'All' || selectedYear !== 'All' || selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedState('All');
                  setSelectedYear('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="ml-auto text-[11px] font-bold text-rose-600 hover:underline flex items-center"
              >
                <X className="w-3 h-3 mr-1" /> Reset All Filters
              </button>
            )}

          </div>

        </div>
      </section>


      {/* SECTION 3: PROJECT INSTALLATION GALLERY CARDS (GRID VIEW) */}
      {viewMode === 'grid' ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Projects Found</h3>
              <p className="text-xs text-slate-500">Try adjusting your search query or filter tags to explore installations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group"
                >
                  
                  {/* Top Image & Header */}
                  <div>
                    <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                      
                      {/* Photo Display (Handles Mulbagal exterior/interior toggle) */}
                      <img
                        src={project.id === '06' && mulbagalView === 'interior' ? project.interiorImage : project.image}
                        alt={`${project.title} - ${project.locality}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 flex items-center space-x-2">
                        <span className="px-3 py-1 bg-blue-950/90 backdrop-blur-md text-white font-black text-xs rounded-xl shadow border border-blue-800">
                          {project.id}
                        </span>
                        <span className="px-3 py-1 bg-emerald-800/90 backdrop-blur-md text-white font-bold text-[11px] rounded-xl shadow border border-emerald-700">
                          YEAR {project.year}
                        </span>
                      </div>

                      {/* Mulbagal Special Interior/Exterior Toggle */}
                      {project.id === '06' && (
                        <div className="absolute top-3.5 right-3.5 flex items-center space-x-1 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow border border-slate-200">
                          <button
                            onClick={() => setMulbagalView('exterior')}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${mulbagalView === 'exterior' ? 'bg-blue-800 text-white' : 'text-slate-700'}`}
                          >
                            Exterior
                          </button>
                          <button
                            onClick={() => setMulbagalView('interior')}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${mulbagalView === 'interior' ? 'bg-blue-800 text-white' : 'text-slate-700'}`}
                          >
                            Interior Racks
                          </button>
                        </div>
                      )}

                      {/* Bottom Banner: Dryer Model / Area Code */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            DRYER CODE:
                          </span>
                          <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {project.dryerCode}
                          </span>
                        </div>

                        <button
                          onClick={() => setActiveProjectModal(project)}
                          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Quick View
                        </button>
                      </div>

                    </div>

                    {/* Card Content Area */}
                    <div className="p-6 space-y-4">
                      
                      {/* Title & Locality */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {project.title}
                          </h2>
                          <div className="text-xs font-semibold text-slate-500 flex items-center mt-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1 shrink-0" />
                            <span>{project.locality}</span>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl shrink-0">
                          {project.category}
                        </span>
                      </div>

                      {/* Drying Application Box with Official Produce Cutout */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase font-bold text-green-700 tracking-wider">
                            DRYING APPLICATION
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                            {project.application}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            Map Pin: <span className="font-semibold text-slate-600">{project.mapRef}</span>
                          </div>
                        </div>

                        {/* Produce Cutout Graphic */}
                        {project.produceImage && (
                          <div className="shrink-0 w-20 h-16 sm:w-24 sm:h-20 flex items-center justify-center p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <img
                              src={project.produceImage}
                              alt={project.application}
                              className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {project.description}
                      </p>

                    </div>
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className="p-6 pt-0 space-y-2">
                    <button
                      onClick={() => onOpenQuoteModal && onOpenQuoteModal({
                        capacityNeeded: `${project.dryerCode} (${project.title} Reference)`,
                        cropType: project.application,
                        district: project.locality
                      })}
                      className="w-full py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow hover:shadow-md hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Request Quote for This Setup</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* SECTION 3B: LIST VIEW (COMPACT TABULAR SPECIFICATION FORMAT) */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-x-auto border border-slate-200 shadow-md">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-blue-950 text-white text-xs uppercase font-bold tracking-wider">
                  <th className="p-4">#</th>
                  <th className="p-4">PHOTO</th>
                  <th className="p-4">LOCATION</th>
                  <th className="p-4">YEAR</th>
                  <th className="p-4 text-green-300">DRYER CODE</th>
                  <th className="p-4">DRYING APPLICATION</th>
                  <th className="p-4">SECTOR</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700 font-medium">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-900">{project.id}</td>
                    <td className="p-4">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-16 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer shadow-sm"
                        onClick={() => setActiveProjectModal(project)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{project.title}</div>
                      <div className="text-[11px] text-slate-500">{project.locality}</div>
                    </td>
                    <td className="p-4 font-bold text-emerald-700">{project.year}</td>
                    <td className="p-4 font-mono font-bold text-blue-800 bg-blue-50/50">{project.dryerCode}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{project.application}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {project.category}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onOpenQuoteModal && onOpenQuoteModal({
                          capacityNeeded: `${project.dryerCode} (${project.title})`,
                          cropType: project.application,
                          district: project.locality
                        })}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-extrabold text-[11px] rounded-lg shadow transition-all whitespace-nowrap"
                      >
                        Enquire
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}


      {/* SECTION 4: DETAIL LIGHTBOX MODAL */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <span className="px-2.5 py-1 bg-blue-900 text-white font-black text-xs rounded-lg">
                  Project {activeProjectModal.id}
                </span>
                <h3 className="text-lg font-black text-slate-900">{activeProjectModal.title}</h3>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded border border-green-200">
                  {activeProjectModal.year}
                </span>
              </div>

              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Full Image */}
              <div className="relative rounded-2xl overflow-hidden h-72 sm:h-80 border border-slate-200 bg-slate-100">
                <img
                  src={activeProjectModal.image}
                  alt={activeProjectModal.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 right-3 bg-blue-950/90 text-white text-xs font-mono font-bold px-3 py-1 rounded-lg backdrop-blur-md">
                  {activeProjectModal.dryerCode}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Location</div>
                  <div className="font-bold text-slate-900 mt-0.5">{activeProjectModal.locality}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Dryer Model Code</div>
                  <div className="font-bold text-blue-800 font-mono mt-0.5">{activeProjectModal.dryerCode}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Sector / Category</div>
                  <div className="font-bold text-green-700 mt-0.5">{activeProjectModal.category}</div>
                </div>
              </div>

              {/* Application Details with Produce Cutout */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">
                    TARGET CROP & PRODUCE
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {activeProjectModal.application}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {activeProjectModal.description}
                  </div>
                </div>

                {activeProjectModal.produceImage && (
                  <div className="w-20 h-20 shrink-0 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                    <img
                      src={activeProjectModal.produceImage}
                      alt={activeProjectModal.application}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => setActiveProjectModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const proj = activeProjectModal;
                  setActiveProjectModal(null);
                  onOpenQuoteModal && onOpenQuoteModal({
                    capacityNeeded: `${proj.dryerCode} (${proj.title})`,
                    cropType: proj.application,
                    district: proj.locality
                  });
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center space-x-2"
              >
                <span>Get Subsidy & Price Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}


      {/* SECTION 5: CALL TO ACTION BOTTOM BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[10px] font-bold text-green-300 bg-blue-950 px-3 py-1 rounded-full uppercase tracking-wider">
              {isTamil ? 'அரசு மானிய உதவி 40% - 60%' : 'GOVT SUBSIDY ASSISTANCE 40% - 60%'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              {isTamil ? 'உங்கள் பண்ணையில் இதே போன்ற சோலார் உலர்த்தி அமைக்க வேண்டுமா?' : 'Want a Similar Polyhouse Solar Dryer on Your Farm?'}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl font-medium">
              {isTamil
                ? 'நாங்கள் இந்தியா முழுவதும் சோலார் உலர்த்திகளை நேரடியாக அமைத்து, அரசு மானிய அனுமதிகளையும் முழுமையாக ஒருங்கிணைக்கிறோம்.'
                : 'ZeniTEK delivers turnkey design, precision fabrication, on-farm installation, and complete MNRE & State Horticulture subsidy clearance.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Custom Solar Dryer Project' })}
              className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>{t('getQuote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+918098613422"
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2 backdrop-blur-md"
            >
              <PhoneCall className="w-4 h-4 text-green-300" />
              <span>+91 80986 13422</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
