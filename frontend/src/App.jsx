import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeadModal from './components/LeadModal';
import DryerDetailModal from './components/DryerDetailModal';
import Preloader from './components/Preloader';
import LanguageWidget from './components/LanguageWidget';

import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import SolarDryersPage from './pages/SolarDryersPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ApplicationsPage from './pages/ApplicationsPage';
import GalleryPage from './pages/GalleryPage';
import ContactUsPage from './pages/ContactUsPage';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDryerModel, setSelectedDryerModel] = useState(null);

  const handleOpenQuoteModal = (initialData = {}) => {
    setModalInitialData(initialData);
    setModalOpen(true);
  };

  const handleOpenDetailModal = (model) => {
    setSelectedDryerModel(model);
    setDetailModalOpen(true);
  };

  return (
    <LanguageProvider>
      {/* Scroll to Top on route change */}
      <ScrollToTop />

      {/* Animated Splash Preloader on Page Open & Reload */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        
        {/* Navigation Header */}
        <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />

        {/* Main Page Routing */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuoteModal} onOpenDetailModal={handleOpenDetailModal} />} />
            <Route path="/about" element={<AboutUsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/dryers" element={<SolarDryersPage onOpenQuoteModal={handleOpenQuoteModal} onOpenDetailModal={handleOpenDetailModal} />} />
            <Route path="/dryers/:id" element={<ProjectDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/applications" element={<ApplicationsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/gallery" element={<GalleryPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/contact" element={<ContactUsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer onOpenQuoteModal={() => handleOpenQuoteModal()} />

        {/* Global Floating Bottom-Right Language Switcher */}
        <LanguageWidget />

        {/* Global Product Detail Modal */}
        <DryerDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          model={selectedDryerModel}
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        {/* Global Lead Quote Modal */}
        <LeadModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialData={modalInitialData}
        />

      </div>
    </LanguageProvider>
  );
}

