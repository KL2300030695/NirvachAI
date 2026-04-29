import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  MessageCircle, Clock, Brain, BookOpen, ClipboardCheck,
  LayoutDashboard, Sparkles, Shield, Zap, ArrowRight,
} from 'lucide-react';
import { trackPageView } from '../services/analytics';
import { useEffect } from 'react';
import { ROUTES, APP } from '../config/constants';
import './pages.css';

/**
 * Feature cards displayed on the home page.
 * Each feature links to a specific app section.
 * @type {Array<{icon: import('lucide-react').LucideIcon, title: string, desc: string, path: string, color: string}>}
 */
const features = [
  { icon: MessageCircle, title: 'AI Assistant', desc: 'Ask anything about elections powered by Google Gemini AI', path: ROUTES.CHAT, color: '#FF6B35' },
  { icon: Clock, title: 'Election Timeline', desc: 'Interactive 9-stage walkthrough of the election process', path: ROUTES.TIMELINE, color: '#F7C948' },
  { icon: Brain, title: 'Knowledge Quiz', desc: 'Test your understanding with 25+ categorized questions', path: ROUTES.QUIZ, color: '#3B82F6' },
  { icon: BookOpen, title: 'Encyclopedia', desc: 'Searchable glossary of election terms and concepts', path: ROUTES.ENCYCLOPEDIA, color: '#8B5CF6' },
  { icon: ClipboardCheck, title: 'Voter Checklist', desc: 'Step-by-step guide to voter registration and readiness', path: ROUTES.CHECKLIST, color: '#1DB954' },
  { icon: LayoutDashboard, title: 'Dashboard', desc: 'Track your learning progress and achievements', path: ROUTES.DASHBOARD, color: '#06B6D4' },
];

/**
 * Platform statistics displayed in the hero section.
 * @type {Array<{value: string, label: string}>}
 */
const platformStats = [
  { value: '9', label: 'Election Stages' },
  { value: '25+', label: 'Quiz Questions' },
  { value: '18+', label: 'Glossary Terms' },
  { value: 'AI', label: 'Powered by Gemini' },
];

/**
 * Trust indicators displayed below features.
 * @type {Array<{icon: import('lucide-react').LucideIcon, title: string, desc: string}>}
 */
const trustIndicators = [
  { icon: Shield, title: 'Verified Information', desc: 'All content based on official ECI guidelines and Constitutional provisions' },
  { icon: Sparkles, title: 'AI-Powered Learning', desc: 'Google Gemini AI provides intelligent, contextual answers to your questions' },
  { icon: Zap, title: 'Always Accessible', desc: 'WCAG 2.1 AA compliant, works on all devices, keyboard navigable' },
];

/**
 * Home — Landing page for NirvachAI.
 * Displays hero section, platform stats, feature grid, trust indicators, and footer.
 * @returns {JSX.Element}
 */
export default function Home() {
  const { signInWithGoogle, signInAsGuest, isAuthenticated } = useAuth();

  useEffect(() => { trackPageView('Home'); }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero" role="banner">
        <div className="hero-bg-effects" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="hero-content animate-fade-in-up">
          <div className="hero-badge badge badge-saffron">
            <Sparkles size={14} /> AI-Powered Election Education
          </div>
          <h1 className="hero-title">
            Understand Democracy<br />
            <span className="gradient-text-tricolor">{APP.TAGLINE.split(',')[0]}</span>
          </h1>
          <p className="hero-subtitle">
            {APP.NAME} is your intelligent guide to the Indian election process.
            Learn through AI conversations, interactive timelines, quizzes, and more.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to={ROUTES.CHAT} className="btn btn-primary btn-lg">
                Start Learning <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <button className="btn btn-primary btn-lg" onClick={signInWithGoogle}>
                  Get Started with Google <ArrowRight size={18} />
                </button>
                <button className="btn btn-secondary btn-lg" onClick={signInAsGuest}>
                  Explore as Guest
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats" aria-label="Platform statistics">
        <div className="home-stats-grid">
          {platformStats.map((stat, i) => (
            <div key={stat.label} className={`home-stat animate-fade-in-up stagger-${i + 1}`}>
              <span className="home-stat-value gradient-text">{stat.value}</span>
              <span className="home-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-features" aria-label="Features">
        <div className="home-section-header">
          <h2>Everything You Need to<br /><span className="gradient-text">Understand Elections</span></h2>
          <p>Interactive tools designed to make civic education engaging and accessible for every citizen.</p>
        </div>
        <div className="home-features-grid">
          {features.map(({ icon: Icon, title, desc, path, color }, i) => (
            <Link to={path} key={path} className={`home-feature-card glass-card animate-fade-in-up stagger-${i + 1}`}>
              <div className="home-feature-icon" style={{ background: `${color}15`, color }}>
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="home-feature-link" style={{ color }}>
                Explore <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="home-trust" aria-label="Trust indicators">
        <div className="home-trust-grid">
          {trustIndicators.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="home-trust-item">
              <Icon size={28} className="home-trust-icon" />
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="footer-content">
          <div className="footer-brand gradient-text-tricolor">🗳️ {APP.NAME}</div>
          <p className="footer-text">Empowering citizens through election education</p>
          <div className="footer-links">
            <a href={APP.ECI_URL} target="_blank" rel="noopener noreferrer" className="footer-link">ECI Website</a>
            <a href={APP.VOTER_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="footer-link">Voter Portal</a>
            <a href={APP.SVEEP_URL} target="_blank" rel="noopener noreferrer" className="footer-link">SVEEP</a>
          </div>
          <p className="footer-disclaimer">
            ⚠️ {APP.NAME} is an educational tool and not an official ECI product. Always verify information
            from official sources. This application does not collect or process any sensitive personal data
            beyond authentication.
          </p>
        </div>
      </footer>
    </div>
  );
}
