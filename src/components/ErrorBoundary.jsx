import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: 'var(--text-secondary)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#fff3cd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px'
                    }}>
                        <AlertTriangle size={36} style={{ color: '#e67e22' }} />
                    </div>
                    <h2 style={{
                        fontSize: '24px',
                        color: 'var(--text-primary)',
                        margin: '0 0 12px 0'
                    }}>
                        Something Went Wrong
                    </h2>
                    <p style={{
                        maxWidth: '400px',
                        lineHeight: 1.6,
                        marginBottom: '24px'
                    }}>
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            className="btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </button>
                        <Link to="/" className="btn-secondary" onClick={() => this.setState({ hasError: false, error: null })}>
                            Go Home
                        </Link>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
