import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import TimelinePage from './pages/TimelinePage';
import QuizPage from './pages/QuizPage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import VoterChecklistPage from './pages/VoterChecklistPage';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {!isHome && <Sidebar />}
      <main id="main-content" className={!isHome ? 'main-content' : ''} role="main">
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
      </main>
      <div className="aria-live" aria-live="polite" aria-atomic="true" id="aria-announcer" />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
