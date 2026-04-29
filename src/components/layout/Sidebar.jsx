import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES, APP } from '../../config/constants';
import {
  Home, MessageCircle, Clock, Brain, BookOpen, LayoutDashboard,
  ClipboardCheck, LogOut, LogIn, Menu, X, ChevronRight
} from 'lucide-react';
import './layout.css';

/**
 * Navigation items for the sidebar.
 * @type {Array<{path: string, label: string, icon: import('lucide-react').LucideIcon}>}
 */
const navItems = [
  { path: ROUTES.HOME, label: 'Home', icon: Home },
  { path: ROUTES.CHAT, label: 'AI Assistant', icon: MessageCircle },
  { path: ROUTES.TIMELINE, label: 'Election Timeline', icon: Clock },
  { path: ROUTES.QUIZ, label: 'Knowledge Quiz', icon: Brain },
  { path: ROUTES.ENCYCLOPEDIA, label: 'Encyclopedia', icon: BookOpen },
  { path: ROUTES.CHECKLIST, label: 'Voter Checklist', icon: ClipboardCheck },
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
];

export default function Sidebar() {
  const { user, userProfile, signInWithGoogle, signInAsGuest, signOut, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-mobile-toggle btn-icon"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <aside
        className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🗳️</span>
            {!collapsed && <span className="sidebar-logo-text gradient-text-tricolor">{APP.NAME}</span>}
          </div>
          <button
            className="sidebar-collapse-btn btn-icon hide-mobile"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight size={16} style={{ transform: collapsed ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div className="sidebar-user">
              <div className="sidebar-user-info">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="" className="sidebar-avatar" />
                ) : (
                  <div className="sidebar-avatar-placeholder">
                    {(userProfile?.displayName || 'C')[0].toUpperCase()}
                  </div>
                )}
                {!collapsed && (
                  <div className="sidebar-user-details">
                    <span className="sidebar-user-name">{userProfile?.displayName || 'Citizen'}</span>
                    <span className="sidebar-user-role">{userProfile?.isAnonymous ? 'Guest' : 'Member'}</span>
                  </div>
                )}
              </div>
              <button className="btn-icon" onClick={signOut} title="Sign out" aria-label="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="sidebar-auth">
              {!collapsed && (
                <>
                  <button className="btn btn-primary btn-sm sidebar-auth-btn" onClick={signInWithGoogle}>
                    <LogIn size={14} /> Sign in with Google
                  </button>
                  <button className="btn btn-ghost btn-sm sidebar-auth-btn" onClick={signInAsGuest}>
                    Continue as Guest
                  </button>
                </>
              )}
              {collapsed && (
                <button className="btn-icon" onClick={signInWithGoogle} title="Sign in" aria-label="Sign in">
                  <LogIn size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
