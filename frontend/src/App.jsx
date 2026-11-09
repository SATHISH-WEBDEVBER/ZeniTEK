import React, { useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import SectionDividers from './components/SectionDividers';
import SiteHeader, { PageTitleProvider } from './components/SiteHeader';
import SmoothScroll from './motion/SmoothScroll';
import RevealEngine from './motion/RevealEngine';
import { markSiteReady, scrollToTop, prefersReducedMotion } from './motion/core';

import HomePage from './pages/HomePage';
// Pages other than Home load on demand (each in its own small file), so the first visit only
// downloads what it shows; Quote and Not Found stay in the main bundle because other pages use them.
const AboutUsPage = React.lazy(() => import('./pages/AboutUsPage'));
const SolarDryersPage = React.lazy(() => import('./pages/SolarDryersPage'));
const ProjectDetailPage = React.lazy(() => import('./pages/ProjectDetailPage'));
const ApplicationsPage = React.lazy(() => import('./pages/ApplicationsPage'));
const GalleryPage = React.lazy(() => import('./pages/GalleryPage'));
const GalleryDetailPage = React.lazy(() => import('./pages/GalleryDetailPage'));
const ContactUsPage = React.lazy(() => import('./pages/ContactUsPage'));
const SubsidiesPage = React.lazy(() => import('./pages/SubsidiesPage'));
const SolarThermalPage = React.lazy(() => import('./pages/SolarThermalPage'));
const ResearchPage = React.lazy(() => import('./pages/ResearchPage'));
const DryerModelPage = React.lazy(() => import('./pages/DryerModelPage'));
const InstallationPage = React.lazy(() => import('./pages/InstallationPage'));
const BrochurePage = React.lazy(() => import('./pages/BrochurePage'));
const LegalPage = React.lazy(() => import('./pages/LegalPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const CatalogPage = React.lazy(() => import('./pages/CatalogPage'));
const MapPage = React.lazy(() => import('./pages/MapPage'));
const FarmerStoriesPage = React.lazy(() => import('./pages/FarmerStoriesPage'));
const SitemapPage = React.lazy(() => import('./pages/SitemapPage'));
// Admin dashboards load on demand, so public visitors never download them
const ClientAdminApp = React.lazy(() => import('./pages/admin/ClientAdminApp'));
const AdminLoginChooser = React.lazy(() => import('./pages/bugs/AdminLoginChooser'));
const DeveloperApp = React.lazy(() => import('./pages/bugs/DeveloperApp'));
const TesterApp = React.lazy(() => import('./pages/bugs/TesterApp'));
import BugReportButton from './components/BugReportButton';
import { useLocation, useNavigate } from 'react-router-dom';

import QuotePage, { buildQuoteUrl } from './pages/QuotePage';
import { CATALOG_PAGES } from './data/productCatalog';
import NotFoundPage from './pages/NotFoundPage';

// Old /dryers/:id links keep working by forwarding to the project page
function LegacyProjectRedirect() {
  const { id } = useParams();
  return <Navigate to={`/projects/${id}`} replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    scrollToTop();
  }, [pathname]);
  return null;
}

// A soft fade when moving to another page (opacity only: a transform here would shift fixed pop-ups)
function usePageFade(ref) {
  const { pathname } = useLocation();
  const first = React.useRef(true);
  React.useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!ref.current?.animate || prefersReducedMotion()) return;
    ref.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  }, [pathname, ref]);
}

// Shown while a page's file loads: keeps the footer below the fold; a small spinner fades in only if
// loading takes longer than a moment
function PageLoading() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center" aria-busy="true">
      <span className="page-loading w-10 h-10 rounded-full border-[3px] border-[#002DC2]/15 border-t-[#002DC2]" />
    </div>
  );
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
    // A short sequence, so the page is readable within a moment: logo, then menu, then the page.
    // Page animations (hero, scroll reveals) start once the page is visible (markSiteReady).
    const quick = prefersReducedMotion();
    const t1 = setTimeout(() => setAnimStage(1), quick ? 0 : 120);
    const t2 = setTimeout(() => setAnimStage(2), quick ? 0 : 360);
    const t3 = setTimeout(() => setAnimStage(3), quick ? 0 : 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Page animations start once the page has actually been painted visible (two frames after stage 3)
  React.useEffect(() => {
    if (animStage < 3) return undefined;
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(markSiteReady); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [animStage]);

  const mainRef = React.useRef(null);
  usePageFade(mainRef);

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
      {/* Motion system: smooth scrolling and scroll reveals for every page (src/motion) */}
      <SmoothScroll />
      <RevealEngine />

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#002DC2] selection:text-white">
        
        {/* Navigation Header with Opening Reveal Animation */}
        <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} animStage={animStage} />

        {/* Full Website Content - Hidden Initially, Reveals at Stage 3.
            Once revealed it must have no transform: a transform here would make every
            position:fixed pop-up (lightboxes, viewers) position against the page instead of the screen. */}
        <div
          className={`flex-1 flex flex-col transition-all duration-700 ease-out ${
            animStage >= 3
              ? 'opacity-100 transform-none'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Main Page Routing */}
          <main ref={mainRef} className="flex-1">
            {/* Simple page header (breadcrumb + Back) on every page except Home */}
            <SiteHeader />
            <React.Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuoteModal} onOpenDetailModal={handleOpenDetailModal} />} />
              <Route path="/about" element={<AboutUsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/products" element={<ProductsPage />} />
              
              {/* Product areas with their own pages */}
              <Route path="/solar-dryer-models" element={<SolarDryersPage onOpenQuoteModal={handleOpenQuoteModal} onOpenDetailModal={handleOpenDetailModal} />} />
              <Route path="/solar-thermal-system" element={<SolarThermalPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              <Route path="/research-and-development" element={<ResearchPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              {/* Every other product / sub-product page from the catalogue (Tunnel Dryers, Parabolic Trough,
                  Scheffler Dish, Solar Water Heater, PV Laboratory and its setups, Wood Log Splitter) */}
              {CATALOG_PAGES.map(path => (
                <Route key={path} path={path} element={<CatalogPage onOpenQuoteModal={handleOpenQuoteModal} />} />
              ))}

              {/* Old addresses forward to their current pages */}
              <Route path="/agri-solar-innovation" element={<Navigate to="/solar-dryer-models" replace />} />
              <Route path="/photovoltaic-solutions" element={<Navigate to="/research-and-development" replace />} />
              <Route path="/government-subsidies" element={<Navigate to="/subsidies" replace />} />
              <Route path="/crop-preservation-guide" element={<Navigate to="/applications" replace />} />
              <Route path="/technical-spec-sheets" element={<Navigate to="/solar-dryer-models" replace />} />
              <Route path="/dryers" element={<Navigate to="/solar-dryer-models" replace />} />
              {/* the tunnel dryer models are listed on the Solar Dryer Models page itself */}
              <Route path="/solar-dryer-models/tunnel-dryers" element={<Navigate to="/solar-dryer-models" replace />} />
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
            </React.Suspense>
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

