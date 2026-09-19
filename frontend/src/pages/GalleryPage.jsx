import React, { useState, useMemo } from 'react';
import { zenitekRealGallery } from '../data/zenitekRealGalleryData';
import { brochurePages } from '../data/zenitekBrochureData';
import { 
  Camera, Filter, MapPin, X, ArrowRight, Sun, ZoomIn, ShieldCheck, 
  Download, Layers, Grid, Sparkles, CheckCircle2, SlidersHorizontal, Info, Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GalleryPage({ onOpenQuoteModal }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  // Combine real master photographs with brochure pages into a single gallery
  const masterGalleryItems = useMemo(() => {
    const brochureItems = brochurePages.map((bp) => ({
      id: `brochure-p${bp.page}`,
      title: `Brochure Page ${bp.page}: ${bp.title}`,
      category: 'brochure',
      categoryLabel: 'Official PDF Brochure',
      image: bp.image,
      thumbnail: bp.image,
      location: 'Official Documentation',
      state: 'All India',
      productModel: bp.category,
      dimensions: bp.floorArea,
      capacity: bp.trayArea,
      crop: 'Technical Guide',
      description: bp.summary
    }));

    return [...zenitekRealGallery, ...brochureItems];
  }, []);

  // Filter items by category and search
  const filteredItems = useMemo(() => {
    return masterGalleryItems.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.state && item.state.toLowerCase().includes(q)) ||
        (item.productModel && item.productModel.toLowerCase().includes(q)) ||
        (item.crop && item.crop.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [masterGalleryItems, activeCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Photographs', count: masterGalleryItems.length },
    { id: 'tunnel_external', label: 'Polyhouse Tunnels', count: masterGalleryItems.filter(i => i.category === 'tunnel_external').length },
    { id: 'tunnel_internal', label: 'Tunnel Interior & Trays', count: masterGalleryItems.filter(i => i.category === 'tunnel_internal').length },
    { id: 'box_dryers', label: 'Box Type Dryers', count: masterGalleryItems.filter(i => i.category === 'box_dryers').length },
    { id: 'trays_produce', label: 'Produce & SS304 Trays', count: masterGalleryItems.filter(i => i.category === 'trays_produce').length },
    { id: 'engineering', label: 'Engineering & Packaging', count: masterGalleryItems.filter(i => i.category === 'engineering').length },
    { id: 'brochure', label: 'Official PDF Brochure (9)', count: 9 },
  ];

  return (
    <div className="text-black min-h-screen bg-white">
      
      {/* SECTION 1: HERO BANNER (ODD: WHITE) */}
      <section className="w-full section-odd py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F0F4FD] border border-[#123B92]/30 text-[#123B92] text-xs font-bold uppercase tracking-widest shadow-xs">
            <Camera className="w-3.5 h-3.5 text-[#002DC2]" />
            <span>Authentic Field & Manufacturing Gallery</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#123B92] tracking-tight leading-tight">
            ZeniTEK Solar Drying Systems <br />
            <span className="text-[#002DC2]">
              Real Installation & Product Photographs
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-black max-w-2xl mx-auto font-medium leading-relaxed">
            Explore authentic photographs of our commercial walk-in solar polyhouses, SS304 food-grade trolley trays, portable box dryers, and manufacturing craftsmanship across India.
          </p>

          {/* Quick Search & Category Bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by crop, model, location, or state..."
                className="w-full bg-[#F0F4FD] border border-[#123B92]/30 rounded-2xl px-4 py-2.5 text-xs text-black placeholder-black/40 focus:outline-none focus:border-[#002DC2] focus:ring-2 focus:ring-[#002DC2]/20 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-2.5 text-xs font-bold text-black/50 hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#002DC2] text-white shadow-md ring-2 ring-[#23AC39]'
                    : 'bg-white text-black hover:text-[#002DC2] hover:bg-[#F0F4FD] border border-[#123B92]/20'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeCategory === cat.id ? 'bg-[#123B92] text-white' : 'bg-[#F0F4FD] text-[#123B92]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: GALLERY GRID (EVEN: LIGHT TINT, FULLY VISIBLE UNOBSTRUCTED IMAGES) */}
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#123B92]/20 text-black/60 text-xs">
              No photographs match your current filter. Try selecting "All Photographs" or clearing search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 4k:grid-cols-4 gap-4 sm:gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhoto(item)}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#123B92]/20 shadow-xs hover:shadow-xl hover:border-[#002DC2] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* 100% Clean, Fully Visible Unobstructed Photo Container (No text overlay) */}
                    <div className="relative h-60 sm:h-64 overflow-hidden bg-black border-b border-[#123B92]/20">
                      <img
                        src={item.thumbnail || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Photo Details & Metadata Placed Below the Image */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      {/* Category & Model Tag Row (Above Details, Never on Image) */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#123B92]/10 pb-2">
                        <span className="bg-[#123B92] text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-md shadow-2xs">
                          {item.categoryLabel || item.category}
                        </span>
                        {item.productModel && (
                          <span className="bg-[#002DC2] text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                            {item.productModel}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold text-[#002DC2]">
                        <div className="flex items-center line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-[#002DC2] shrink-0" />
                          <span>{item.location}{item.state ? `, ${item.state}` : ''}</span>
                        </div>
                        {item.capacity && (
                          <span className="text-[10px] text-white bg-[#23AC39] px-2 py-0.5 rounded border border-[#23AC39] font-bold shrink-0">
                            {item.capacity}
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-[#123B92] text-xs sm:text-sm leading-snug group-hover:text-[#002DC2] transition-colors line-clamp-2">
                        {item.title}
                      </h4>

                      <p className="text-[11.5px] text-black line-clamp-2 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="px-4 sm:px-5 pb-4 pt-1 flex items-center justify-between text-xs text-[#002DC2] font-extrabold border-t border-[#123B92]/10">
                    <span className="flex items-center space-x-1 group-hover:underline">
                      <ZoomIn className="w-3.5 h-3.5 text-[#002DC2]" />
                      <span>View High-Res Photo</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: SUBSIDY ASSISTANCE CTA BANNER (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#123B92] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[#23AC39]">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold text-[#23AC39] bg-black/40 px-3 py-1 rounded-full uppercase tracking-wider border border-[#23AC39]/50">
                Turnkey Manufacturing & Field Commissioning
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Looking for a Complete Commercial Polyhouse Dryer Installation?
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                ZeniTEK handles structural engineering, CNC fabrication, food-grade SS304 tray carts, and government subsidy paperwork end-to-end.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Complete Turnkey Dryer Project' })}
                className="py-3.5 px-6 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                Get Turnkey Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL: FULL HIGH-RES PHOTO VIEWER WITH COMPLETE SPECS */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative bg-white rounded-2xl sm:rounded-3xl max-w-5xl 4k:max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl border-2 border-[#123B92]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#123B92] text-white flex items-center justify-between border-b-2 border-[#23AC39] shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase bg-black/40 text-[#23AC39] border border-[#23AC39]/50 px-2.5 py-0.5 rounded">
                  {selectedPhoto.categoryLabel || selectedPhoto.category}
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-1">
                  {selectedPhoto.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={selectedPhoto.image}
                  download={selectedPhoto.title.replace(/\s+/g, '_') + '.jpg'}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white flex items-center space-x-1 transition-colors"
                  title="Download High-Res Master Image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save Image</span>
                </a>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photo Viewport */}
            <div className="p-2 sm:p-4 overflow-auto flex-1 bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-[#123B92]/30"
              />
            </div>

            {/* Specifications & Location Bar */}
            <div className="px-6 py-4 bg-[#F0F4FD] border-t border-[#123B92]/20 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="font-extrabold text-[#123B92]">{selectedPhoto.productModel || selectedPhoto.title}</span>
                  {selectedPhoto.dimensions && <span className="text-black/60">• Dimensions: {selectedPhoto.dimensions}</span>}
                  {selectedPhoto.capacity && <span className="text-[#002DC2] font-bold">• Capacity: {selectedPhoto.capacity}</span>}
                </div>
                <p className="text-[11.5px] text-black leading-relaxed font-medium">
                  {selectedPhoto.description}
                </p>
              </div>

              <button
                onClick={() => {
                  const targetItem = selectedPhoto;
                  setSelectedPhoto(null);
                  if (onOpenQuoteModal) onOpenQuoteModal({ capacityNeeded: targetItem.productModel || targetItem.title });
                }}
                className="px-5 py-2.5 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer shrink-0"
              >
                Enquire About This Setup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
