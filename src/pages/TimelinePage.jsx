import { useState, useEffect, useCallback } from 'react';
import { electionStages } from '../data/electionStages';
import { useFirestore } from '../hooks/useFirestore';
import { trackPageView, trackTimelineStageViewed } from '../services/analytics';
import { formatPercentage } from '../utils/formatters';
import { TIMELINE } from '../config/constants';
import { ChevronDown, ChevronUp, CheckCircle2, Scale, Users } from 'lucide-react';
import './pages.css';

/**
 * TimelinePage — Interactive visualization of the 9-stage Indian election process.
 * Each stage can be expanded to reveal key steps, facts, officials, and legal references.
 * Progress is tracked per-user.
 * @returns {JSX.Element}
 */
export default function TimelinePage() {
  const [expandedStage, setExpandedStage] = useState(null);
  const [completedStages, setCompletedStages] = useState(new Set());
  const { completeTimelineStage } = useFirestore();

  useEffect(() => { trackPageView('Timeline'); }, []);

  /**
   * Toggle stage expansion and mark as completed on first view
   * @param {string} id - Stage ID
   * @param {number} index - Stage index
   */
  const toggleStage = useCallback((id, index) => {
    setExpandedStage(prev => prev === id ? null : id);
    if (expandedStage !== id) {
      trackTimelineStageViewed(id, index);
      if (!completedStages.has(id)) {
        setCompletedStages(prev => new Set([...prev, id]));
        completeTimelineStage(id);
      }
    }
  }, [expandedStage, completedStages, completeTimelineStage]);

  const progress = formatPercentage(completedStages.size, TIMELINE.TOTAL_STAGES);

  return (
    <div className="page-container">
      <div className="page-header animate-fade-in-up">
        <h1>Election <span className="gradient-text">Timeline</span></h1>
        <p>Explore the complete Indian election process — from announcement to government formation. Click each stage to learn more.</p>
      </div>

      {/* Progress */}
      <div className="timeline-progress glass-card-static animate-fade-in-up">
        <div className="timeline-progress-header">
          <span className="timeline-progress-label">Your Learning Progress</span>
          <span className="timeline-progress-value">{completedStages.size}/{TIMELINE.TOTAL_STAGES} stages explored</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline" role="list" aria-label="Election process stages">
        {electionStages.map((stage, index) => {
          const isExpanded = expandedStage === stage.id;
          const isCompleted = completedStages.has(stage.id);

          return (
            <div
              key={stage.id}
              className={`timeline-item animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
              role="listitem"
            >
              {/* Connector line */}
              {index < electionStages.length - 1 && (
                <div className="timeline-connector" style={{ borderColor: isCompleted ? stage.color : undefined }} />
              )}

              {/* Stage node */}
              <div className="timeline-node" style={{ background: stage.color, boxShadow: `0 0 16px ${stage.color}40` }}>
                {isCompleted ? <CheckCircle2 size={18} /> : <span className="timeline-node-number">{stage.number}</span>}
              </div>

              {/* Stage card */}
              <button
                className={`timeline-card glass-card ${isExpanded ? 'timeline-card-expanded' : ''}`}
                onClick={() => toggleStage(stage.id, index)}
                aria-expanded={isExpanded}
                aria-controls={`stage-detail-${stage.id}`}
                style={{ '--stage-color': stage.color }}
              >
                <div className="timeline-card-header">
                  <div className="timeline-card-left">
                    <span className="timeline-stage-icon" aria-hidden="true">{stage.icon}</span>
                    <div>
                      <h3 className="timeline-card-title">{stage.title}</h3>
                      <span className="timeline-card-duration badge" style={{ background: `${stage.color}15`, color: stage.color, border: `1px solid ${stage.color}25` }}>
                        {stage.duration}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                <p className="timeline-card-desc">{stage.description}</p>

                {isExpanded && (
                  <div id={`stage-detail-${stage.id}`} className="timeline-detail animate-fade-in">
                    <div className="divider" />

                    <div className="timeline-detail-section">
                      <h4>📋 Key Steps</h4>
                      <ul className="timeline-detail-list">
                        {stage.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="timeline-detail-section">
                      <h4>📊 Key Facts</h4>
                      <div className="timeline-facts-grid">
                        {stage.keyFacts.map((fact, i) => (
                          <div key={i} className="timeline-fact">
                            <span className="timeline-fact-label">{fact.label}</span>
                            <span className="timeline-fact-value">{fact.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="timeline-detail-section">
                      <h4><Users size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Key Officials</h4>
                      <div className="flex flex-gap-2 flex-wrap">
                        {stage.officials.map((official, i) => (
                          <span key={i} className="badge badge-blue">{official}</span>
                        ))}
                      </div>
                    </div>

                    <div className="timeline-detail-section">
                      <h4><Scale size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Legal Reference</h4>
                      <p className="timeline-legal-ref">{stage.legalReference}</p>
                    </div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
