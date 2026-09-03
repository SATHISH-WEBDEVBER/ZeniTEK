import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeadModal from './components/LeadModal';
import LanguageWidget from './components/LanguageWidget';

import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import SolarDryersPage from './pages/SolarDryersPage';
import ApplicationsPage from './pages/ApplicationsPage';
import FarmerStoriesPage from './pages/FarmerStoriesPage';
import MapPage from './pages/MapPage';
import ContactUsPage from './pages/ContactUsPage';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});

  const handleOpenQuoteModal = (initialData = {}) => {
    setModalInitialData(initialData);
    setModalOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        
        {/* Navigation Header */}
        <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />

        {/* Main Page Routing */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/about" element={<AboutUsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/dryers" element={<SolarDryersPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/applications" element={<ApplicationsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/stories" element={<FarmerStoriesPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/map" element={<MapPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/contact" element={<ContactUsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer onOpenQuoteModal={() => handleOpenQuoteModal()} />

        {/* Global Floating Bottom-Right Language Switcher */}
        <LanguageWidget />

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
