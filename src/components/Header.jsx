import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
import { ToggleTheme } from './ui/toggle-theme';
import { Search } from 'lucide-react';
import LogoImg from '../assets/images/logo.png';

const Header = ({ onAuthClick }) => {
    const { user, profile } = useAuth();
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <>
            <header className="app-header">
                <div className="container header-inner">
                    <nav className="nav-links">
                        <Link to="/" className="logo-link">
                            <img src={LogoImg} alt="La'verse" style={{ height: '36px', width: 'auto' }} />
                        </Link>
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/archives" className="nav-link">Archives</Link>
                        <a href="/#trending" className="nav-link">Trending</a>
                        <a href="/#topics" className="nav-link">Topics</a>
                    </nav>

                    <div className="nav-actions">
                        <button className="nav-search-btn" onClick={() => setSearchOpen(true)} title="Search (Ctrl+K)">
                            <Search size={20} strokeWidth={2.5} />
                        </button>

                        <ToggleTheme />

                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <NotificationBell />
                                <Link to="/write" className="btn-primary header-write-btn">
                                    Start Posting
                                </Link>
                                <Link to="/dashboard" className="nav-avatar-link">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="nav-avatar" />
                                    ) : (
                                        <div className="nav-avatar-fallback">
                                            {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <button className="header-write-btn btn-primary" onClick={() => onAuthClick('signup')}>
                                    Start Posting
                                </button>
                                <button className="btn-signin" onClick={() => onAuthClick('signin')}>
                                    Login
                                </button>
                                <button className="btn-signin btn-signup-outline" onClick={() => onAuthClick('signup')}>
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
};

export default Header;
