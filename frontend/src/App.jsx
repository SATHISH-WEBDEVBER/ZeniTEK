import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeadModal from './components/LeadModal';
import DryerDetailModal from './components/DryerDetailModal';
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
  // Opening animation stages:
  // 0 = Initial: Empty navbar bar visible, full website hidden, logo & navitems hidden
  // 1 = Logo opens with animation
  // 2 = Nav items open with animation
  // 3 = Full website smoothly reveals
  const [animStage, setAnimStage] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDryerModel, setSelectedDryerModel] = useState(null);

  React.useEffect(() => {
    // Stage 1: Logo opens with animation (at 400ms)
    const t1 = setTimeout(() => setAnimStage(1), 400);
    // Stage 2: Nav items open with animation (at 1200ms)
    const t2 = setTimeout(() => setAnimStage(2), 1200);
    // Stage 3: Full website becomes visible with smooth transition (at 1900ms)
    const t3 = setTimeout(() => setAnimStage(3), 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

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

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        
        {/* Navigation Header with Opening Reveal Animation */}
        <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} animStage={animStage} />

        {/* Full Website Content - Hidden Initially, Reveals at Stage 3 */}
        <div
          className={`flex-1 flex flex-col transition-all duration-1000 ease-out ${
            animStage >= 3
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
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
        </div>

        {/* Global Floating Bottom-Right Language Switcher */}
        {animStage >= 3 && <LanguageWidget />}

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

