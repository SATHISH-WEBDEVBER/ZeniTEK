import React, { useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import SectionDividers from './components/SectionDividers';
import SiteHeader, { PageTitleProvider } from './components/SiteHeader';

import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import SolarDryersPage from './pages/SolarDryersPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ApplicationsPage from './pages/ApplicationsPage';
import GalleryPage from './pages/GalleryPage';
import GalleryDetailPage from './pages/GalleryDetailPage';
import ContactUsPage from './pages/ContactUsPage';
import SubsidiesPage from './pages/SubsidiesPage';
// Admin dashboards load on demand, so public visitors never download them
const ClientAdminApp = React.lazy(() => import('./pages/admin/ClientAdminApp'));
const AdminLoginChooser = React.lazy(() => import('./pages/bugs/AdminLoginChooser'));
const DeveloperApp = React.lazy(() => import('./pages/bugs/DeveloperApp'));
const TesterApp = React.lazy(() => import('./pages/bugs/TesterApp'));
import BugReportButton from './components/BugReportButton';
import { useLocation, useNavigate } from 'react-router-dom';

import SectionDetailPage from './pages/SectionDetailPage';
import QuotePage, { buildQuoteUrl } from './pages/QuotePage';
import DryerModelPage from './pages/DryerModelPage';
import InstallationPage from './pages/InstallationPage';
import BrochurePage from './pages/BrochurePage';
import LegalPage from './pages/LegalPage';
import ProductsPage from './pages/ProductsPage';
import MapPage from './pages/MapPage';
import FarmerStoriesPage from './pages/FarmerStoriesPage';
import SitemapPage from './pages/SitemapPage';
import NotFoundPage from './pages/NotFoundPage';

// Old /dryers/:id links keep working by forwarding to the project page
function LegacyProjectRedirect() {
  const { id } = useParams();
  return <Navigate to={`/projects/${id}`} replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Every /admin route is a dashboard: no public navbar, footer, WhatsApp widget or reveal animation
const isAdminPath = pathname => /^\/admin(\/|$)/.test(pathname);

function AdminRoutes() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50" aria-busy="true" />}>
    <Routes>
      <Route path="/admin/login" element={<AdminLoginChooser />} />
      <Route path="/admin/developer/*" element={<DeveloperApp />} />
      <Route path="/admin/tester/*" element={<TesterApp />} />
      <Route path="/admin/*" element={<ClientAdminApp />} />
    </Routes>
    </React.Suspense>
  );
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <LanguageProvider>
      {isAdminPath(pathname) ? <AdminRoutes /> : <PublicSite />}
    </LanguageProvider>
  );
}

function PublicSite() {
  // Opening animation stages:
  // 0 = Initial: Empty navbar bar visible, full website hidden, logo & navitems hidden
  // 1 = Logo opens with animation
  // 2 = Nav items open with animation
  // 3 = Full website smoothly reveals
  const [animStage, setAnimStage] = useState(0);

  const navigate = useNavigate();

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

  // Every quote button across the site opens the /quote page (prefilled via the URL)
  // instead of a popup, so it has its own address and the browser Back button works.
  const handleOpenQuoteModal = (initialData = {}) => {
    navigate(buildQuoteUrl(initialData || {}));
  };

  // "Learn more" on a dryer model opens that model's own page
  const handleOpenDetailModal = (model) => {
    if (model?.id) navigate(`/solar-dryer-models/${model.id}`);
    else navigate('/solar-dryer-models');
  };

  return (
      <PageTitleProvider>
      {/* Scroll to Top on route change */}
      <ScrollToTop />
      <SectionDividers />

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#002DC2] selection:text-white">
        
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
            {/* Simple page header (breadcrumb + Back) on every page except Home */}
            <SiteHeader />
            <Routes>
              <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuoteModal} onOpenDetailModal={handleOpenDetailModal} />} />
              <Route path="/about" element={<AboutUsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/products" element={<ProductsPage />} />
              
              {/* 7 Solution & Information Categories */}
              <Route path="/solar-dryer-models" element={<SolarDryersPage onOpenQuoteModal={handleOpenQuoteModal} onOpenDetailModal={handleOpenDetailModal} />} />
              <Route path="/solar-thermal-system" element={<SectionDetailPage slug="solar-thermal-system" onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/agri-solar-innovation" element={<SectionDetailPage slug="agri-solar-innovation" onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/photovoltaic-solutions" element={<SectionDetailPage slug="photovoltaic-solutions" onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/government-subsidies" element={<SectionDetailPage slug="government-subsidies" onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/crop-preservation-guide" element={<SectionDetailPage slug="crop-preservation-guide" onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/technical-spec-sheets" element={<SectionDetailPage slug="technical-spec-sheets" onOpenQuoteModal={handleOpenQuoteModal} />} />
              
              {/* Old addresses forward to their current pages */}
              <Route path="/dryers" element={<Navigate to="/solar-dryer-models" replace />} />
              <Route path="/dryers/:id" element={<LegacyProjectRedirect />} />
              <Route path="/map" element={<Navigate to="/installations" replace />} />

              <Route path="/installations" element={<MapPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/projects/:id" element={<ProjectDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/stories" element={<FarmerStoriesPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/applications" element={<ApplicationsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/gallery" element={<GalleryPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/gallery/:id" element={<GalleryDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/subsidies" element={<SubsidiesPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/contact" element={<ContactUsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/solar-dryer-models/:modelId" element={<DryerModelPage />} />
              <Route path="/installations/:id" element={<InstallationPage />} />
              <Route path="/quote" element={<QuotePage />} />
              <Route path="/brochures/:brochureId" element={<BrochurePage />} />
              <Route path="/privacy" element={<LegalPage type="privacy" />} />
              <Route path="/terms" element={<LegalPage type="terms" />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer onOpenQuoteModal={() => handleOpenQuoteModal()} />
        </div>

        {/* Global Floating Bottom-Right WhatsApp Quick Contact */}
        {animStage >= 3 && <WhatsAppWidget />}

        {/* Tester-only floating "Report a bug" button (hidden for normal visitors) */}
        {animStage >= 3 && <BugReportButton />}

      </div>
      </PageTitleProvider>
  );
}

