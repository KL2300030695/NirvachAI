import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/layout/Sidebar';
import { trackAppPerformance } from './services/analytics';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import TimelinePage from './pages/TimelinePage';
import QuizPage from './pages/QuizPage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import VoterChecklistPage from './pages/VoterChecklistPage';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';

/**
 * AppLayout — Manages sidebar visibility and main content area.
 * The sidebar is hidden on the Home/landing page.
 */
function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Track performance metrics on initial load
  useEffect(() => {
    if (document.readyState === 'complete') {
      trackAppPerformance();
    } else {
      window.addEventListener('load', trackAppPerformance, { once: true });
      return () => window.removeEventListener('load', trackAppPerformance);
    }
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {!isHome && <Sidebar />}
      <main id="main-content" className={!isHome ? 'main-content' : ''} role="main">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/encyclopedia" element={<EncyclopediaPage />} />
            <Route path="/checklist" element={<VoterChecklistPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <div className="aria-live" aria-live="polite" aria-atomic="true" id="aria-announcer" />
    </>
  );
}

/**
 * App — Root application component.
 * Wraps the entire app with BrowserRouter, AuthProvider, and ErrorBoundary.
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
