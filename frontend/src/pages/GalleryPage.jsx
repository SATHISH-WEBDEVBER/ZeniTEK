import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { zenitekRealGallery } from '../data/zenitekRealGalleryData';
import { brochures } from '../data/brochuresData';
import { fetchPublicGallery } from '../utils/api';
import {
  MapPin, ArrowRight, ZoomIn, Loader, FileText, MessageSquareQuote, Images, PlayCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import BrochureCards from '../components/BrochureCards';
import { PhotoGrid, MediaViewer, VideoGrid, photoItems } from '../components/MediaGallery';
import { CATALOG, productPhotos, nodeTitle } from '../data/productCatalog';
import { PRODUCT_PHOTOS, PRODUCT_VIDEOS } from '../data/productMedia';

// The gallery has four tabs (?tab=...): product photos (grouped by product), videos,
// installation photos (filtered with ?cat=...) and the PDF brochures.
const TABS = [
  { id: 'products', labelKey: 'media_tabProducts', icon: Images },
  { id: 'videos', labelKey: 'media_tabVideos', icon: PlayCircle },
  { id: 'sites', labelKey: 'media_tabSites', icon: MapPin },
  { id: 'brochures', labelKey: 'media_tabBrochures', icon: FileText },
];
const TAB_IDS = TABS.map(tab => tab.id);
const CATEGORY_IDS = ['all', 'tunnel_external', 'tunnel_internal', 'box_dryers', 'trays_produce', 'engineering'];
// Older links: /gallery?cat=brochure (or brochures / specs) opened the brochures
const BROCHURE_ALIASES = ['brochure', 'brochures', 'specs'];

const resolveView = (params) => {
  const cat = params.get('cat');
  if (cat && BROCHURE_ALIASES.includes(cat)) return { tab: 'brochures', category: 'all' };
  if (cat) return { tab: 'sites', category: CATEGORY_IDS.includes(cat) ? cat : 'all' };
  const tab = params.get('tab');
  return { tab: TAB_IDS.includes(tab) ? tab : 'products', category: 'all' };
};

// Products that have photos, in catalogue order, under their product area
const walk = (node, out = []) => {
  if (productPhotos(node).length) out.push(node);
  (node.children || []).forEach(child => walk(child, out));
  return out;
};
const PHOTO_AREAS = CATALOG.map(area => ({ area, products: walk(area) })).filter(a => a.products.length);
const PRODUCT_PHOTO_COUNT = Object.values(PRODUCT_PHOTOS).reduce((n, list) => n + list.length, 0);

// One product's photos on the Products tab: name, count, link to the product, photo grid
function ProductPhotoGroup({ node, onOpen }) {
  const { t } = useLanguage();
  const items = photoItems(node, t);
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#123B92] leading-snug">{nodeTitle(node, t)}</h3>
          <p className="text-sm text-slate-500 font-medium">{items.length === 1 ? t('media_onePhoto') : t('media_photos', { count: items.length })}</p>
        </div>
        <Link to={node.path} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2] hover:underline">
          {t('cat_viewProduct')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <PhotoGrid items={items} limit={8} onOpen={(i) => onOpen(items, i)} />
    </section>
  );
}

export default function GalleryPage({ onOpenQuoteModal }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tab: activeTab, category: activeCategory } = resolveView(searchParams);
  const areaParam = searchParams.get('area');
  const activeArea = PHOTO_AREAS.some(a => a.area.id === areaParam) ? areaParam : 'all';
  // Full-screen viewer for the Products tab: the photos of one product
  const [viewer, setViewer] = useState({ items: [], index: null });

  const setParams = (entries) => {
    const next = new URLSearchParams();
    Object.entries(entries).forEach(([k, v]) => { if (v) next.set(k, v); });
    setSearchParams(next, { replace: true });
  };
  const changeTab = (id) => setParams({ tab: id === 'products' ? null : id });
  const changeCategory = (id) => (id === 'all' ? setParams({ tab: 'sites' }) : setParams({ cat: id }));
  const changeArea = (id) => setParams({ area: id === 'all' ? null : id });

  const [searchQuery, setSearchQuery] = useState('');
  const [apiItems, setApiItems] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const { t, tf } = useLanguage();

  // Try fetching from API; fall back to static data
  useEffect(() => {
    fetchPublicGallery()
      .then(data => {
        if (data.items && data.items.length > 0) {
          setApiItems(data.items);
        }
      })
      .catch(() => {})
      .finally(() => setApiLoading(false));
  }, []);

  // Merge: if API has items, use them exclusively; otherwise use static data
  const rawItems = apiItems.length > 0 ? apiItems : zenitekRealGallery;

  // Normalise so both sources share the same field shape for rendering
  const masterGalleryItems = rawItems.map(item => {
    if (item._id) {
      // API item shape
      return {
        id: item._id,
        title: item.title,
        category: item.category,
        categoryLabel: item.category,
        image: item.image?.url || '',
        thumbnail: item.image?.url || '',
        location: item.location || '',
        state: item.state || '',
        productModel: item.productModel || '',
        capacity: item.capacity || '',
        lat: item.lat || 0,
        lng: item.lng || 0,
        description: item.description || '',
        isApiItem: true
      };
    }
    return { ...item, isApiItem: false };
  });

  // Filter items by category and search query
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

  // Filter chip labels come from the gallery translation file (gallery_filter_<id>)
  const categories = CATEGORY_IDS.map(id => ({
    id,
    label: t(`gallery_filter_${id}`),
    count: id === 'all' ? masterGalleryItems.length : masterGalleryItems.filter(i => i.category === id).length
  }));
  const tabCounts = {
    products: PRODUCT_PHOTO_COUNT,
    videos: PRODUCT_VIDEOS.length,
    sites: masterGalleryItems.length,
    brochures: brochures.length,
  };
  const areaChips = [
    { id: 'all', label: t('media_allProducts'), count: PRODUCT_PHOTO_COUNT },
    ...PHOTO_AREAS.map(({ area, products }) => ({
      id: area.id,
      label: t(area.titleKey),
      count: products.reduce((n, node) => n + productPhotos(node).length, 0),
    })),
  ];
  const shownAreas = PHOTO_AREAS.filter(a => activeArea === 'all' || a.area.id === activeArea);
  const chipCls = (active) => `px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
    active ? 'bg-[#002DC2] text-white shadow-md' : 'bg-white text-[#123B92] hover:text-[#002DC2] hover:bg-[#F0F4FD] border border-[#123B92]/20'
  }`;
  const countCls = (active) => `text-2xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-[#F0F4FD] text-[#123B92]'}`;

  return (
    <div className="text-black min-h-screen bg-white">
      
      {/* SECTION 1: HERO (background photo, left-aligned heading) */}
      <PageHero
        images="/images/gallery/photo-43.webp"
        title={<>{t('gallery_heroTitle1')} <span className="text-[#002DC2]">{t('gallery_heroTitle2')}</span></>}
        subtitle={t('hero_gallerySub')}
        actions={[
          { label: t('getQuote'), onClick: () => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Complete Turnkey Dryer Project' }), icon: MessageSquareQuote },
          { label: t('hero_viewBrochures'), to: '/gallery?tab=brochures', icon: FileText },
        ]}
        stats={[
          { value: String(PRODUCT_PHOTO_COUNT + zenitekRealGallery.length), label: t('media_heroPhotos') },
          { value: String(PRODUCT_VIDEOS.length), label: t('media_tabVideos') },
          { value: String(brochures.length), label: t('hero_galBrochures') },
        ]}
      />

      {/* Gallery tabs */}
      <nav aria-label={t('media_galleryAria')} className="w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-1 sm:flex sm:justify-center sm:gap-2 py-2">
            {TABS.map(({ id, labelKey, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => changeTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2 rounded-xl text-2xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    active ? 'bg-[#002DC2] text-white shadow-md' : 'text-slate-600 hover:text-[#002DC2] hover:bg-[#F0F4FD]'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-center leading-tight">{t(labelKey)}</span>
                  <span className={`hidden sm:inline ${countCls(active)}`}>{tabCounts[id]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* PRODUCT PHOTOS: every product's photos, grouped by product area */}
      {activeTab === 'products' && (
        <section className="w-full section-even py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('media_productsTitle')}</h2>
              <p className="text-base sm:text-lg text-slate-600">{t('media_productsSub')}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {areaChips.map(chip => (
                <button key={chip.id} type="button" onClick={() => changeArea(chip.id)} aria-pressed={activeArea === chip.id} className={chipCls(activeArea === chip.id)}>
                  <span>{chip.label}</span>
                  <span className={countCls(activeArea === chip.id)}>{chip.count}</span>
                </button>
              ))}
            </div>
            {shownAreas.map(({ area, products }) => (
              <div key={area.id} className="space-y-4">
                {activeArea === 'all' && (
                  <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-black text-[#123B92] pt-4">
                    <span className="w-1.5 h-8 rounded-full bg-[#23AC39]" aria-hidden="true" />
                    {t(area.titleKey)}
                  </h2>
                )}
                {products.map(node => (
                  <ProductPhotoGroup key={node.id} node={node} onOpen={(items, index) => setViewer({ items, index })} />
                ))}
              </div>
            ))}
          </div>
          <MediaViewer
            items={viewer.items}
            index={viewer.index}
            onIndex={(index) => setViewer(v => ({ ...v, index }))}
            onClose={() => setViewer(v => ({ ...v, index: null }))}
          />
        </section>
      )}

      {/* VIDEOS */}
      {activeTab === 'videos' && (
        <section className="w-full section-even py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('media_tabVideos')}</h2>
              <p className="text-base sm:text-lg text-slate-600">{t('media_videosSub')}</p>
            </div>
            <VideoGrid videos={PRODUCT_VIDEOS} />
          </div>
        </section>
      )}

      {/* INSTALLATION PHOTOS (search + category chips) and BROCHURES */}
      {(activeTab === 'sites' || activeTab === 'brochures') && (
      <section className="w-full section-even py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">
              {activeTab === 'brochures' ? t('media_tabBrochures') : t('media_tabSites')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {activeTab === 'brochures' ? t('media_brochuresIntro') : t('gallery_gridSubtitle')}
            </p>
          </div>

          {activeTab === 'sites' && (<>
          {/* Search */}
          <div className="max-w-md mx-auto mb-5">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('gallery_searchPlaceholder')}
                aria-label={t('gallery_searchAria')}
                className="w-full bg-white border border-[#123B92]/30 rounded-2xl px-4 py-3 text-sm text-black placeholder-black/40 focus:outline-none focus:border-[#002DC2] focus:ring-2 focus:ring-[#002DC2]/20 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs font-bold text-black/50 hover:text-black cursor-pointer"
                >
                  {t('gallery_clear')}
                </button>
              )}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => changeCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#002DC2] text-white shadow-md ring-2 ring-[#23AC39]'
                    : 'bg-white text-[#123B92] hover:text-[#002DC2] hover:bg-[#F0F4FD] border border-[#123B92]/20'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-2xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeCategory === cat.id ? 'bg-[#123B92] text-white' : 'bg-[#F0F4FD] text-[#123B92]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
          </>)}

          {activeTab === 'brochures' ? (
            <BrochureCards brochures={brochures} />
          ) : apiLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader className="w-12 h-12 text-[#002DC2] animate-spin" />
              <p className="text-sm text-black/50 font-medium">{t('gallery_loading')}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#123B92]/20 text-black/60 text-xs">
              {t('gallery_noResults')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-[#123B92]/20 shadow-sm hover:shadow-xl hover:border-[#002DC2] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Zoom button in corner -> opens the photo's own page */}
                  <Link
                    to={`/gallery/${item.id}`}
                    title={t('gallery_viewFullPhoto')}
                    aria-label={t('gallery_viewFullPhotoAria', { title: item.title })}
                    data-zoom-link
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-xl text-xs transition-all shadow-md z-10"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Link>

                  <Link to={`/gallery/${item.id}`} className="block flex-1">
                    {/* Clean, Visible Unobstructed Photo Container */}
                    <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-950 border-b border-[#123B92]/20">
                      <img
                        src={item.thumbnail || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Map Coordinate Badge */}
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-2xs font-mono flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-[#23AC39]" />
                        <span>{item.lat.toFixed(2)}°N, {item.lng.toFixed(2)}°E</span>
                      </div>
                    </div>

                    {/* Photo Details & Metadata */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      {/* Category & Model Tag Row */}
                      <div className="flex flex-wrap items-center content-start justify-between gap-1.5 border-b border-[#123B92]/10 pb-2 sm:min-h-14">
                        <span className="bg-[#123B92] text-white font-bold text-2xs uppercase px-2.5 py-0.5 rounded-md shadow-sm inline-block whitespace-nowrap">
                          {tf(`gallery_cat_${item.category}`, item.categoryLabel || item.category)}
                        </span>
                        {item.productModel && (
                          <span className="bg-[#002DC2] text-white font-bold text-2xs px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                            {item.productModel}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs font-bold text-[#002DC2]">
                        <div
                          className="flex items-start min-w-0 min-h-10"
                          title={`${item.location}${item.state ? `, ${item.state}` : ''}`}
                        >
                          <MapPin className="w-4 h-4 mr-1 mt-[3px] text-[#002DC2] shrink-0" />
                          <span className="line-clamp-2">{item.location}{item.state ? `, ${item.state}` : ''}</span>
                        </div>
                        <div className="flex min-h-[20px]">
                          {item.capacity && (
                            <span
                              title={item.capacity}
                              className="max-w-full truncate text-2xs text-white bg-[#1A822B] px-2 py-0.5 rounded border border-[#1A822B] font-bold"
                            >
                              {item.capacity}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-[#123B92] leading-6 group-hover:text-[#002DC2] transition-colors line-clamp-2 min-h-12">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-600 line-clamp-2 leading-6 font-medium min-h-12">
                        {item.description}
                      </p>
                    </div>
                  </Link>

                  {/* Card Footer: Navigate to Detailed Page with Map */}
                  <Link
                    to={`/gallery/${item.id}`}
                    className="px-4 sm:px-5 py-3.5 bg-slate-50 hover:bg-[#F0F4FD] flex items-center justify-between text-xs text-[#002DC2] font-black border-t border-[#123B92]/10 transition-colors"
                  >
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-[#002DC2]" />
                      <span>{t('gallery_viewDetailsMap')}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* SECTION 3: CALL TO ACTION BANNER (ODD: WHITE) */}
      <section className="w-full section-odd py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#123B92] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col items-center gap-6 border-2 border-[#23AC39]">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {t('gallery_ctaTitle')}
              </h2>
              <p className="text-base sm:text-lg text-white/90">
                {t('gallery_ctaDesc')}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => onOpenQuoteModal && onOpenQuoteModal({ capacityNeeded: 'Complete Turnkey Dryer Project' })}
                className="py-3.5 px-6 bg-[#1A822B] hover:bg-[#002DC2] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                {t('gallery_ctaBtn')}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
