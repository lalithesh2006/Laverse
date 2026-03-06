import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
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
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
            }}>
                <BookOpen size={42} style={{ opacity: 0.6 }} />
            </div>
            <h1 style={{
                fontSize: '72px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: '0 0 8px 0',
                lineHeight: 1,
                fontFamily: "'Playfair Display', serif"
            }}>
                404
            </h1>
            <h2 style={{
                fontSize: '24px',
                color: 'var(--text-primary)',
                margin: '0 0 12px 0'
            }}>
                Page Not Found
            </h2>
            <p style={{
                maxWidth: '400px',
                lineHeight: 1.6,
                marginBottom: '32px'
            }}>
                The page you're looking for doesn't exist or has been moved.
                Let's get you back to the stories.
            </p>
            <Link to="/" className="btn-primary" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
