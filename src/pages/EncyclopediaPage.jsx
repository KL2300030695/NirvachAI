import { useState, useMemo, useEffect, useCallback } from 'react';
import { glossaryTerms } from '../data/glossaryTerms';
import { trackPageView, trackTermViewed, trackSearch, trackAIExplainUsed } from '../services/analytics';
import { generateTermSummary } from '../services/gemini';
import { measureAsync, TRACE_NAMES } from '../services/performanceService';
import { validateSearchQuery } from '../utils/validators';
import { Search, Tag, Sparkles, Loader2 } from 'lucide-react';
import './pages.css';

/** Unique categories derived from glossary data */
const categories = [...new Set(glossaryTerms.map(t => t.category))];

/**
 * EncyclopediaPage — Searchable glossary of election terms with AI enrichment.
 * Uses Google Gemini AI to generate enhanced explanations for each term.
 * @returns {JSX.Element}
 */
export default function EncyclopediaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTerm, setExpandedTerm] = useState(null);
  const [aiEnrichment, setAiEnrichment] = useState({});
  const [loadingTerm, setLoadingTerm] = useState(null);

  useEffect(() => { trackPageView('Encyclopedia'); }, []);

  /** Filtered terms based on search and category */
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

  /** Handle search input with validation */
  const handleSearch = useCallback((value) => {
    const cleaned = validateSearchQuery(value);
    setSearchQuery(cleaned);
    if (cleaned.length > 2) trackSearch(cleaned);
  }, []);

  /** Toggle term expansion and track views */
  const toggleTerm = useCallback((id) => {
    if (expandedTerm !== id) trackTermViewed(id);
    setExpandedTerm(expandedTerm === id ? null : id);
  }, [expandedTerm]);

  /**
   * Generate AI-enriched explanation for a term using Google Gemini.
   * Results are cached in component state to avoid redundant API calls.
   * @param {Object} term - Glossary term object
   */
  const handleAIExplain = useCallback(async (term) => {
    if (aiEnrichment[term.id]) return; // Already enriched

    setLoadingTerm(term.id);
    trackAIExplainUsed(term.term);

    try {
      const { result: enriched } = await measureAsync(
        TRACE_NAMES.AI_TERM_ENRICHMENT,
        () => generateTermSummary(term.term, term.definition),
        { term_id: term.id }
      );
      setAiEnrichment(prev => ({ ...prev, [term.id]: enriched }));
    } catch {
      setAiEnrichment(prev => ({ ...prev, [term.id]: term.context }));
    } finally {
      setLoadingTerm(null);
    }
  }, [aiEnrichment]);

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
          <div
            key={term.id}
            className={`encyclopedia-card glass-card animate-fade-in-up stagger-${Math.min(i + 1, 6)} ${expandedTerm === term.id ? 'encyclopedia-card-expanded' : ''}`}
          >
            <button
              className="encyclopedia-card-toggle"
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
            </button>

            {expandedTerm === term.id && (
              <div className="encyclopedia-context animate-fade-in">
                <div className="divider" />
                <h4>📌 Additional Context</h4>
                <p>{term.context}</p>

                {/* AI Explain Button — Gemini-powered enrichment */}
                <div className="encyclopedia-ai-section">
                  {aiEnrichment[term.id] ? (
                    <div className="encyclopedia-ai-result">
                      <h4><Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> AI-Enhanced Explanation</h4>
                      <p>{aiEnrichment[term.id]}</p>
                    </div>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm encyclopedia-ai-btn"
                      onClick={() => handleAIExplain(term)}
                      disabled={loadingTerm === term.id}
                    >
                      {loadingTerm === term.id ? (
                        <><Loader2 size={14} className="spinner-icon" /> Asking Gemini AI…</>
                      ) : (
                        <><Sparkles size={14} /> Explain with AI</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="encyclopedia-empty">
          <p>🔍 No terms found matching &quot;{searchQuery}&quot;</p>
          <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
