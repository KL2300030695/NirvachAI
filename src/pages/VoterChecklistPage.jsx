import { useState, useEffect, useCallback, useMemo } from 'react';
import { voterChecklist, importantLinks } from '../data/voterChecklist';
import { useFirestore } from '../hooks/useFirestore';
import { trackPageView, trackChecklistProgress } from '../services/analytics';
import { formatPercentage } from '../utils/formatters';
import { APP } from '../config/constants';
import { Check, Circle, ExternalLink, AlertTriangle } from 'lucide-react';
import './pages.css';

/**
 * VoterChecklistPage — Step-by-step voter readiness guide.
 * @returns {JSX.Element}
 */
export default function VoterChecklistPage() {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const { updateChecklist } = useFirestore();

  useEffect(() => { trackPageView('VoterChecklist'); }, []);

  const totalItems = useMemo(
    () => voterChecklist.reduce((sum, s) => sum + s.items.length, 0), []
  );

  const progress = formatPercentage(checkedItems.size, totalItems);

  const toggleItem = useCallback((itemId) => {
    setCheckedItems(prev => {
      const updated = new Set(prev);
      if (updated.has(itemId)) updated.delete(itemId);
      else updated.add(itemId);
      trackChecklistProgress(updated.size, totalItems);
      updateChecklist([...updated]);
      return updated;
    });
  }, [totalItems, updateChecklist]);

  return (
    <div className="page-container">
      <div className="page-header animate-fade-in-up">
        <h1>Voter Readiness <span className="gradient-text">Checklist</span></h1>
        <p>Follow this step-by-step guide to ensure you are fully prepared to exercise your right to vote.</p>
      </div>

      <div className="checklist-progress glass-card-static animate-fade-in-up">
        <div className="flex flex-between">
          <span>Overall Progress</span>
          <span className="gradient-text" style={{ fontWeight: 700 }}>{progress}% Complete</span>
        </div>
        <div className="progress-bar" style={{ marginTop: 'var(--space-3)' }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
          {checkedItems.size} of {totalItems} items completed
        </p>
      </div>

      <div className="checklist-sections">
        {voterChecklist.map((section, sIndex) => {
          const sectionComplete = section.items.every(item => checkedItems.has(item.id));
          return (
            <div key={section.id} className={`checklist-section glass-card animate-fade-in-up stagger-${Math.min(sIndex + 1, 6)}`}>
              <div className="checklist-section-header">
                <div className="checklist-section-icon" aria-hidden="true">{section.icon}</div>
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>
                {sectionComplete && <span className="badge badge-green"><Check size={12} /> Done</span>}
              </div>
              <div className="checklist-items">
                {section.items.map(item => (
                  <label key={item.id} className={`checklist-item ${checkedItems.has(item.id) ? 'checklist-item-checked' : ''}`}>
                    <button
                      className="checklist-checkbox"
                      role="checkbox"
                      aria-checked={checkedItems.has(item.id)}
                      onClick={() => toggleItem(item.id)}
                    >
                      {checkedItems.has(item.id) ? <Check size={14} /> : <Circle size={14} />}
                    </button>
                    <span className="checklist-text">{item.text}</span>
                    {item.required && !checkedItems.has(item.id) && (
                      <span className="badge badge-saffron" style={{ fontSize: '0.65rem' }}>Required</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="checklist-links animate-fade-in-up">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>🔗 Important Resources</h3>
        <div className="grid grid-2">
          {importantLinks.map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="checklist-link-card glass-card">
              <div>
                <h4>{link.title}</h4>
                <p>{link.description}</p>
              </div>
              <ExternalLink size={16} />
            </a>
          ))}
        </div>
      </div>

      <div className="checklist-disclaimer glass-card-static animate-fade-in-up">
        <AlertTriangle size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Always verify the latest requirements at <a href={APP.VOTER_PORTAL_URL} target="_blank" rel="noopener noreferrer">voters.eci.gov.in</a>. Contact ECI Helpline <strong>{APP.ECI_HELPLINE}</strong> for assistance.
        </p>
      </div>
    </div>
  );
}
