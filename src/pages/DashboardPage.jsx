import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trackPageView } from '../services/analytics';
import { formatPercentage, formatScore } from '../utils/formatters';
import { ROUTES, TIMELINE } from '../config/constants';
import { MessageCircle, Clock, Brain, BookOpen, ClipboardCheck, Award, TrendingUp, Target } from 'lucide-react';
import './pages.css';

/**
 * Achievement definitions for the dashboard gamification system.
 * @param {Object} progress - User progress data
 * @returns {Array<{id: string, title: string, desc: string, icon: string, unlocked: boolean}>}
 */
const getAchievements = (progress) => {
  const chatCount = progress.chatCount || 0;
  const quizScores = progress.quizScores || {};
  const timelineProgress = progress.timelineCompleted?.length || 0;
  const checklistCount = progress.checklistItems?.length || 0;
  const totalActivities = timelineProgress + Object.keys(quizScores).length + (chatCount > 0 ? 1 : 0) + (checklistCount > 0 ? 1 : 0);

  return [
    { id: 'first-chat', title: 'First Conversation', desc: 'Sent your first message to NirvachAI', icon: '💬', unlocked: chatCount > 0 },
    { id: 'quiz-taker', title: 'Quiz Taker', desc: 'Completed your first quiz', icon: '🧠', unlocked: Object.keys(quizScores).length > 0 },
    { id: 'timeline-explorer', title: 'Timeline Explorer', desc: 'Explored all 9 election stages', icon: '🗺️', unlocked: timelineProgress >= TIMELINE.TOTAL_STAGES },
    { id: 'perfect-score', title: 'Perfect Score', desc: 'Got 100% on any quiz', icon: '🏆', unlocked: Object.values(quizScores).some(s => s.score === s.total) },
    { id: 'checklist-pro', title: 'Voter Ready', desc: 'Completed the voter checklist', icon: '✅', unlocked: checklistCount >= 20 },
    { id: 'knowledge-seeker', title: 'Knowledge Seeker', desc: 'Used all 5 features of NirvachAI', icon: '⭐', unlocked: totalActivities >= 5 },
  ];
};

/**
 * DashboardPage — User progress tracking and achievements.
 * @returns {JSX.Element}
 */
export default function DashboardPage() {
  const { userProfile, isAuthenticated } = useAuth();

  useEffect(() => { trackPageView('Dashboard'); }, []);

  const progress = userProfile?.progress || {};
  const timelineProgress = progress.timelineCompleted?.length || 0;
  const quizScores = progress.quizScores || {};
  const chatCount = progress.chatCount || 0;
  const checklistCount = progress.checklistItems?.length || 0;

  const totalActivities = timelineProgress + Object.keys(quizScores).length + (chatCount > 0 ? 1 : 0) + (checklistCount > 0 ? 1 : 0);
  const overallProgress = Math.min(formatPercentage(totalActivities, 12), 100);

  const stats = useMemo(() => [
    { icon: Clock, label: 'Timeline Stages', value: formatScore(timelineProgress, TIMELINE.TOTAL_STAGES), color: '#F7C948' },
    { icon: Brain, label: 'Quizzes Taken', value: Object.keys(quizScores).length, color: '#3B82F6' },
    { icon: MessageCircle, label: 'Chat Messages', value: chatCount, color: '#FF6B35' },
    { icon: ClipboardCheck, label: 'Checklist Items', value: checklistCount, color: '#1DB954' },
  ], [timelineProgress, quizScores, chatCount, checklistCount]);

  const achievements = useMemo(() => getAchievements(progress), [progress]);

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="dashboard-login-prompt glass-card animate-scale-in">
          <h2>📊 Your Learning Dashboard</h2>
          <p>Sign in to track your progress, quiz scores, and achievements across all features.</p>
          <Link to={ROUTES.HOME} className="btn btn-primary">Go to Home to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header animate-fade-in-up">
        <h1>Your <span className="gradient-text">Dashboard</span></h1>
        <p>Track your learning journey through the Indian election process.</p>
      </div>

      <div className="dashboard-welcome glass-card-static animate-fade-in-up">
        <div className="dashboard-welcome-left">
          <h2>Welcome, {userProfile?.displayName || 'Citizen'}! 👋</h2>
          <p>You are {overallProgress}% through your election education journey. Keep going!</p>
          <div className="progress-bar" style={{ maxWidth: 300, marginTop: 'var(--space-3)' }}>
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-4 dashboard-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard-stat-card glass-card animate-fade-in-up">
            <div className="dashboard-stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div className="dashboard-stat-value">{stat.value}</div>
            <div className="dashboard-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {Object.keys(quizScores).length > 0 && (
        <div className="dashboard-section animate-fade-in-up">
          <h3><TrendingUp size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> Quiz Performance</h3>
          <div className="grid grid-3">
            {Object.entries(quizScores).map(([cat, data]) => (
              <div key={cat} className="dashboard-quiz-card glass-card">
                <h4 style={{ textTransform: 'capitalize' }}>{cat}</h4>
                <div className="dashboard-quiz-score gradient-text">{formatScore(data.score, data.total)}</div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${formatPercentage(data.score, data.total)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-section animate-fade-in-up">
        <h3><Award size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> Achievements</h3>
        <div className="grid grid-3 dashboard-achievements">
          {achievements.map((ach) => (
            <div key={ach.id} className={`dashboard-achievement glass-card ${!ach.unlocked ? 'dashboard-achievement-locked' : ''}`}>
              <span className="dashboard-achievement-icon" aria-hidden="true">{ach.icon}</span>
              <h4>{ach.title}</h4>
              <p>{ach.desc}</p>
              {ach.unlocked ? (
                <span className="badge badge-green">Unlocked</span>
              ) : (
                <span className="badge" style={{ background: 'rgba(75,85,99,0.3)', color: '#6B7280', border: '1px solid rgba(75,85,99,0.3)' }}>Locked</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section animate-fade-in-up">
        <h3><Target size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> Continue Learning</h3>
        <div className="grid grid-3">
          <Link to={ROUTES.CHAT} className="dashboard-action-card glass-card">
            <MessageCircle size={20} /> Ask NirvachAI
          </Link>
          <Link to={ROUTES.TIMELINE} className="dashboard-action-card glass-card">
            <Clock size={20} /> Explore Timeline
          </Link>
          <Link to={ROUTES.QUIZ} className="dashboard-action-card glass-card">
            <Brain size={20} /> Take a Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
