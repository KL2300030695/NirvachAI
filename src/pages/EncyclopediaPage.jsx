import { useState, useMemo, useEffect } from 'react';
import { glossaryTerms } from '../data/glossaryTerms';
import { trackPageView, trackTermViewed, trackSearch } from '../services/analytics';
import { Search, Bookmark, Tag, ArrowRight } from 'lucide-react';
import './pages.css';

const categories = [...new Set(glossaryTerms.map(t => t.category))];

export default function EncyclopediaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTerm, setExpandedTerm] = useState(null);

  useEffect(() => { trackPageView('Encyclopedia'); }, []);

  const filteredTerms = useMemo(() => {
    let results = glossaryTerms;
    if (selectedCategory !== 'All') {
      results = results.filter(t => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        (t.fullForm && t.fullForm.toLowerCase().includes(q))
      );
    }
    return results;
  }, [searchQuery, selectedCategory]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.length > 2) trackSearch(value);
  };

  const toggleTerm = (id) => {
    if (expandedTerm !== id) trackTermViewed(id);
    setExpandedTerm(expandedTerm === id ? null : id);
  };

  return (
    <div className="page-container">
      <div className="page-header animate-fade-in-up">
        <h1>Election <span className="gradient-text">Encyclopedia</span></h1>
        <p>Comprehensive glossary of election terms, concepts, and procedures used in Indian democracy.</p>
      </div>

      {/* Search & Filter */}
      <div className="encyclopedia-controls animate-fade-in-up">
        <div className="encyclopedia-search">
          <Search size={18} className="encyclopedia-search-icon" />
          <input
            type="search"
            className="input-field encyclopedia-search-input"
            placeholder="Search terms (e.g., EVM, NOTA, MCC...)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search election terms"
          />
        </div>
        <div className="encyclopedia-categories">
          <button
            className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="encyclopedia-count">{filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found</p>

      {/* Terms Grid */}
      <div className="encyclopedia-grid">
        {filteredTerms.map((term, i) => (
          <button
            key={term.id}
            className={`encyclopedia-card glass-card animate-fade-in-up stagger-${Math.min(i + 1, 6)} ${expandedTerm === term.id ? 'encyclopedia-card-expanded' : ''}`}
            onClick={() => toggleTerm(term.id)}
            aria-expanded={expandedTerm === term.id}
          >
            <div className="encyclopedia-card-header">
              <div>
                <h3 className="encyclopedia-term">{term.term}</h3>
                {term.fullForm && <span className="encyclopedia-fullform">{term.fullForm}</span>}
              </div>
              <span className="badge badge-blue"><Tag size={10} /> {term.category}</span>
            </div>
            <p className="encyclopedia-definition">{term.definition}</p>
            {expandedTerm === term.id && (
              <div className="encyclopedia-context animate-fade-in">
                <div className="divider" />
                <h4>📌 Additional Context</h4>
                <p>{term.context}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="encyclopedia-empty">
          <p>🔍 No terms found matching "{searchQuery}"</p>
          <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
