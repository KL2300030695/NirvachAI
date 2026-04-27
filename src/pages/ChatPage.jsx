import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw, ExternalLink } from 'lucide-react';
import { generateChatResponse } from '../services/gemini';
import { useFirestore } from '../hooks/useFirestore';
import { trackPageView, trackChatMessage } from '../services/analytics';
import './pages.css';

const suggestedQuestions = [
  'How does the Indian election process work?',
  'What is the role of the Election Commission?',
  'How do EVMs and VVPAT work?',
  'What is NOTA and when was it introduced?',
  'How can I register as a voter?',
  'What is the Model Code of Conduct?',
  'What are the eligibility criteria to contest elections?',
  'Explain postal ballots in India',
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 **Namaste! I\'m NirvachAI**, your Election Process Education Assistant.\n\nI can help you understand how Indian elections work — from voter registration to government formation. I\'m powered by **Google Gemini AI** and trained on official ECI guidelines.\n\n🗳️ Ask me anything about the election process, or pick a question below to get started!\n\n*📌 Disclaimer: I\'m an educational tool. Always verify critical information from [eci.gov.in](https://eci.gov.in).*',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { incrementChatCount } = useFirestore();

  useEffect(() => { trackPageView('Chat'); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    trackChatMessage(userMsg.split(' ').slice(0, 3).join(' '));

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await generateChatResponse(userMsg, chatHistory);

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        },
      ]);

      incrementChatCount();
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '❌ Something went wrong. Please try again or explore other sections!',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([messages[0]]);
    setInput('');
  };

  const formatContent = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>')
      .replace(/^• (.*)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header glass-card-static">
          <div className="chat-header-info">
            <div className="chat-header-avatar">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="chat-header-title">NirvachAI Assistant</h1>
              <span className="chat-header-status">
                <span className="chat-status-dot" /> Powered by Google Gemini AI
              </span>
            </div>
          </div>
          <div className="chat-header-actions">
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              <ExternalLink size={14} /> ECI Website
            </a>
            <button className="btn btn-ghost btn-sm" onClick={resetChat} aria-label="Reset conversation">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" role="log" aria-label="Chat conversation" aria-live="polite">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message chat-message-${msg.role} animate-fade-in-up`}>
              <div className={`chat-bubble chat-bubble-${msg.role}`}>
                <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message chat-message-assistant animate-fade-in">
              <div className="chat-bubble chat-bubble-assistant">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="chat-suggestions">
            <p className="chat-suggestions-title">💡 Try asking:</p>
            <div className="chat-suggestions-grid">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  className="chat-suggestion-chip"
                  onClick={() => sendMessage(q)}
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="chat-input-container glass-card-static">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about elections, voting, ECI, or any civic topic..."
              rows={1}
              aria-label="Type your question"
              disabled={isLoading}
            />
            <button
              className="chat-send-btn btn btn-primary"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="chat-disclaimer">
            NirvachAI may make mistakes. Verify important info at <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer">eci.gov.in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
