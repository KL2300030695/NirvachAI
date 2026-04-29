import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/layout/Sidebar';
import { trackAppPerformance, trackScreenView } from './services/analytics';
import { initRemoteConfig } from './services/remoteConfig';
import { ROUTES, A11Y } from './config/constants';

// ─── Lazy-loaded page components for code splitting ─────────
const Home = lazy(() => import('./pages/Home'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const EncyclopediaPage = lazy(() => import('./pages/EncyclopediaPage'));
const VoterChecklistPage = lazy(() => import('./pages/VoterChecklistPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Loading fallback shown during lazy route transitions.
 * @returns {JSX.Element} Spinner UI
 */
function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <div className="page-loader-spinner" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/**
 * AppLayout — Manages sidebar visibility, route-level screen tracking,
 * and main content area. The sidebar is hidden on the Home/landing page.
 */
function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === ROUTES.HOME;

  // Track performance metrics on initial load
  useEffect(() => {
    if (document.readyState === 'complete') {
      trackAppPerformance();
    } else {
      window.addEventListener('load', trackAppPerformance, { once: true });
      return () => window.removeEventListener('load', trackAppPerformance);
    }
  }, []);

  // Initialize Firebase Remote Config
  useEffect(() => {
    initRemoteConfig();
  }, []);

  // Track screen views on route change (GA4 recommended event)
  useEffect(() => {
    const screenName = location.pathname === '/'
      ? 'Home'
      : location.pathname.slice(1).replace(/^\w/, c => c.toUpperCase());
    trackScreenView(screenName, 'Page');
  }, [location.pathname]);

  return (
    <>
      <a href={A11Y.SKIP_LINK_TARGET} className="skip-link">Skip to main content</a>
      {!isHome && <Sidebar />}
      <main id={A11Y.MAIN_CONTENT_ID} className={!isHome ? 'main-content' : ''} role="main">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.CHAT} element={<ChatPage />} />
              <Route path={ROUTES.TIMELINE} element={<TimelinePage />} />
              <Route path={ROUTES.QUIZ} element={<QuizPage />} />
              <Route path={ROUTES.ENCYCLOPEDIA} element={<EncyclopediaPage />} />
              <Route path={ROUTES.CHECKLIST} element={<VoterChecklistPage />} />
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <div className="aria-live" aria-live="polite" aria-atomic="true" id={A11Y.ARIA_ANNOUNCER_ID} />
    </>
  );
}

/**
 * App — Root application component.
 * Wraps the entire app with BrowserRouter, AuthProvider, and ErrorBoundary.
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
