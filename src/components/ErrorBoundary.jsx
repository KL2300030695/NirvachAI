import { Component } from 'react';
import { trackError } from '../services/analytics';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs them to Firebase Analytics, and displays a fallback UI.
 * 
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to Firebase Analytics
    trackError('react_error_boundary', error?.message || 'Unknown error');
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '50vh', padding: '2rem',
          textAlign: 'center', color: '#F1F5F9',
        }}>
          <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</span>
          <h2 style={{ marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem', maxWidth: '400px' }}>
            An unexpected error occurred. Please try refreshing the page or going back.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={this.handleReset}
              className="btn btn-primary"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="btn btn-secondary"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
