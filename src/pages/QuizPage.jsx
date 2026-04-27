import { useState, useEffect, useMemo } from 'react';
import { quizCategories, quizQuestions } from '../data/quizQuestions';
import { useFirestore } from '../hooks/useFirestore';
import { trackPageView, trackQuizStart, trackQuizComplete, trackQuizAnswer } from '../services/analytics';
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, Trophy, Star, ArrowLeft } from 'lucide-react';
import './pages.css';

export default function QuizPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { saveQuizScore } = useFirestore();

  useEffect(() => { trackPageView('Quiz'); }, []);

  const questions = useMemo(() => {
    if (!selectedCategory) return [];
    return quizQuestions.filter(
      q => q.category === selectedCategory && q.difficulty === selectedDifficulty
    );
  }, [selectedCategory, selectedDifficulty]);

  const currentQuestion = questions[currentIndex];

  const startQuiz = (catId) => {
    setSelectedCategory(catId);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResults(false);
    trackQuizStart(catId, selectedDifficulty);
  };

  const handleAnswer = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    const correct = index === currentQuestion.correctAnswer;
    if (correct) setScore(s => s + 1);
    trackQuizAnswer(correct);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setShowResults(true);
      trackQuizComplete(selectedCategory, score, questions.length);
      saveQuizScore(selectedCategory, score, questions.length);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const resetQuiz = () => {
    setSelectedCategory(null);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResults(false);
  };

  // Category selection
  if (!selectedCategory) {
    return (
      <div className="page-container">
        <div className="page-header animate-fade-in-up">
          <h1>Knowledge <span className="gradient-text">Quiz</span></h1>
          <p>Test your understanding of the Indian election process. Choose a category and difficulty to begin.</p>
        </div>

        {/* Difficulty selector */}
        <div className="quiz-difficulty animate-fade-in-up">
          <span className="quiz-difficulty-label">Difficulty:</span>
          {['beginner', 'intermediate', 'advanced'].map(d => (
            <button
              key={d}
              className={`btn ${selectedDifficulty === d ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setSelectedDifficulty(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <div className="quiz-categories grid grid-3">
          {quizCategories.map((cat, i) => {
            const count = quizQuestions.filter(q => q.category === cat.id && q.difficulty === selectedDifficulty).length;
            return (
              <button
                key={cat.id}
                className={`quiz-category-card glass-card animate-fade-in-up stagger-${i + 1}`}
                onClick={() => count > 0 && startQuiz(cat.id)}
                disabled={count === 0}
                style={{ '--cat-color': cat.color }}
              >
                <span className="quiz-category-icon">{cat.icon}</span>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <span className="badge" style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}25` }}>
                  {count} questions
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const getMessage = () => {
      if (percentage === 100) return { emoji: '🏆', text: 'Perfect Score! You\'re an election expert!' };
      if (percentage >= 75) return { emoji: '🌟', text: 'Excellent! Great understanding of the process!' };
      if (percentage >= 50) return { emoji: '👍', text: 'Good effort! Keep learning to improve!' };
      return { emoji: '📚', text: 'Keep exploring! The Timeline and Encyclopedia can help!' };
    };
    const result = getMessage();

    return (
      <div className="page-container">
        <div className="quiz-results animate-scale-in">
          <div className="quiz-results-card glass-card">
            <span className="quiz-results-emoji">{result.emoji}</span>
            <h2>Quiz Complete!</h2>
            <p className="quiz-results-message">{result.text}</p>
            <div className="quiz-results-score">
              <div className="quiz-score-circle" style={{ '--score-pct': `${percentage}%` }}>
                <span className="quiz-score-value">{score}/{questions.length}</span>
                <span className="quiz-score-label">{percentage}%</span>
              </div>
            </div>
            <div className="quiz-results-stars">
              {[...Array(questions.length)].map((_, i) => (
                <Star key={i} size={20} fill={i < score ? '#F7C948' : 'none'} color={i < score ? '#F7C948' : '#4B5563'} />
              ))}
            </div>
            <div className="quiz-results-actions">
              <button className="btn btn-primary" onClick={() => startQuiz(selectedCategory)}>
                <RotateCcw size={16} /> Retry
              </button>
              <button className="btn btn-secondary" onClick={resetQuiz}>
                <ArrowLeft size={16} /> All Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="page-container">
      <div className="quiz-active">
        {/* Progress bar */}
        <div className="quiz-header animate-fade-in">
          <button className="btn btn-ghost btn-sm" onClick={resetQuiz}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="quiz-progress-info">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="badge badge-gold"><Trophy size={12} /> Score: {score}</span>
          </div>
        </div>
        <div className="progress-bar" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="quiz-question-card glass-card animate-scale-in" key={currentQuestion.id}>
          <div className="quiz-question-badge badge badge-saffron">{selectedDifficulty}</div>
          <h2 className="quiz-question-text">{currentQuestion.question}</h2>

          <div className="quiz-options" role="radiogroup" aria-label="Answer options">
            {currentQuestion.options.map((option, i) => {
              let optionClass = 'quiz-option';
              if (isAnswered) {
                if (i === currentQuestion.correctAnswer) optionClass += ' quiz-option-correct';
                else if (i === selectedAnswer) optionClass += ' quiz-option-wrong';
              } else if (i === selectedAnswer) {
                optionClass += ' quiz-option-selected';
              }

              return (
                <button
                  key={i}
                  className={optionClass}
                  onClick={() => handleAnswer(i)}
                  disabled={isAnswered}
                  role="radio"
                  aria-checked={selectedAnswer === i}
                >
                  <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="quiz-option-text">{option}</span>
                  {isAnswered && i === currentQuestion.correctAnswer && <CheckCircle2 size={20} className="quiz-option-icon" />}
                  {isAnswered && i === selectedAnswer && i !== currentQuestion.correctAnswer && <XCircle size={20} className="quiz-option-icon" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="quiz-explanation animate-fade-in-up">
              <p><strong>💡 Explanation:</strong> {currentQuestion.explanation}</p>
              <button className="btn btn-primary" onClick={nextQuestion}>
                {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
