import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './pages.css';

export default function NotFound() {
  return (
    <div className="page-container not-found-page">
      <div className="not-found-content animate-scale-in">
        <span className="not-found-emoji">🗳️</span>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>This constituency doesn't seem to exist in our electoral map. Let's get you back on track!</p>
        <div className="flex flex-gap-3" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
