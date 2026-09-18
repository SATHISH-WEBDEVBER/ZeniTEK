import { sampleGalleryItems } from '../data/sampleData';
import { brochurePages } from '../data/zenitekBrochureData';
import { Camera, Filter, MapPin, X, ArrowRight, Sun, ZoomIn, ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GalleryPage({ onOpenQuoteModal }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useLanguage();

  const allGalleryItems = React.useMemo(() => {
    const brochureItems = brochurePages.map(bp => ({
      id: `brochure-${bp.page}`,
      title: `Page ${bp.page}: ${bp.title}`,
      category: 'brochure',
      location: 'Official Technical Brochure',
      modelName: bp.category,
      imageUrl: bp.image,
      caption: bp.summary
    }));
    return [...sampleGalleryItems, ...brochureItems];
  }, []);

  const filteredItems = activeCategory === 'all'
    ? allGalleryItems
    : allGalleryItems.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'all', label: t('catAll') },
    { id: 'brochure', label: 'Official PDF Brochure (9 Pages)' },
    { id: 'installations', label: t('catInstallations') },
    { id: 'models', label: t('catModels') },
    { id: 'produce', label: t('catProduce') },
    { id: 'factory', label: t('catFactory') },
  ];

  return (
    <div className="space-y-16 pb-16 pt-6 bg-slate-50 text-slate-900">
      
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 border border-green-200 px-3.5 py-1 rounded-full inline-flex items-center space-x-1.5">
          <Camera className="w-3.5 h-3.5 mr-1" /> {t('galleryBadge')}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-blue-950">
          {t('galleryTitle1')} <br />
          <span className="text-green-700">
            {t('galleryTitle2')}
          </span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
          {t('gallerySubtitle')}
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center shadow-sm ${activeCategory === cat.id ? 'bg-blue-700 text-white shadow-md scale-105' : 'bg-white text-slate-700 hover:text-blue-700 border border-slate-300'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="px-4 py-2 bg-white/90 text-slate-900 font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <ZoomIn className="w-4 h-4 text-blue-700" />
                      <span>{t('viewEnlarged')}</span>
                    </span>
                  </div>

                  <span className="absolute top-3 left-3 bg-blue-900/90 backdrop-blur-md text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow">
                    {item.modelName}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center text-[11px] font-bold text-blue-700">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-green-600 shrink-0" />
                    <span>{item.location}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <div className="text-[11px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center transition-colors">
                  <span>{t('clickFullSpec')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subsidy CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-green-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold text-green-300 bg-blue-950 px-2.5 py-0.5 rounded uppercase">
              {t('customDryerBadge')}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">{t('customDryerTitle')}</h3>
            <p className="text-xs text-blue-100 max-w-xl">
              {t('customDryerDesc')}
            </p>
          </div>

          <button
            onClick={() => onOpenQuoteModal()}
            className="py-3.5 px-6 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all shrink-0"
          >
            {t('getQuote')}
          </button>
        </div>
      </section>

      {/* Lightbox / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-950 via-blue-900 to-green-900 text-white">
              <div>
                <span className="text-[10px] font-bold text-green-300 bg-blue-950 px-2 py-0.5 rounded uppercase tracking-wider">
                  {selectedItem.modelName}
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-0.5">{selectedItem.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-80 sm:h-96 bg-slate-950">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-xs font-bold text-blue-700">
                  <MapPin className="w-4 h-4 mr-1 text-green-600 shrink-0" />
                  <span>{t('locationLabel')} {selectedItem.location}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedItem.caption}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                {t('close')}
              </button>

              <button
                onClick={() => {
                  const item = selectedItem;
                  setSelectedItem(null);
                  if (onOpenQuoteModal) {
                    onOpenQuoteModal({ capacityNeeded: item.modelName, district: item.location });
                  }
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <span>{t('requestQuoteForModel')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
