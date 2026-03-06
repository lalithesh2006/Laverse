import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import ProfileSetup from './components/ProfileSetup'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import BackToTop from './components/BackToTop'
import QuickDraftFAB from './components/QuickDraftFAB'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import StoryEditor from './pages/StoryEditor'
import StoryPage from './pages/StoryPage'
import ArchivesPage from './pages/ArchivesPage'
import NotFoundPage from './pages/NotFoundPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import BlogPage from './pages/BlogPage'
import SearchPage from './pages/SearchPage'
import { useAuth } from './context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './App.css'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('signup');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+/ — toggle shortcuts panel
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
      // Alt+N — new story
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        navigate('/write');
      }
      // Alt+H — go home
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        navigate('/');
      }
      // Alt+D — go to dashboard
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        navigate('/dashboard');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleAuthClose = () => setIsAuthOpen(false);

  const handleAuthOpen = (mode = 'signup') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (isNewUser) => {
    setIsAuthOpen(false);
    if (isNewUser) setShowProfileSetup(true);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading La'verse...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <ScrollToTop />
      <Header onAuthClick={handleAuthOpen} />

      <ErrorBoundary>
        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><HomePage onAuthClick={handleAuthOpen} /></AnimatedPage>} />
              <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              <Route path="/write" element={<AnimatedPage><StoryEditor /></AnimatedPage>} />
              <Route path="/write/:id" element={<AnimatedPage><StoryEditor /></AnimatedPage>} />
              <Route path="/story/:id" element={<AnimatedPage><StoryPage /></AnimatedPage>} />
              <Route path="/archives" element={<AnimatedPage><ArchivesPage /></AnimatedPage>} />
              <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
              <Route path="/privacy" element={<AnimatedPage><PrivacyPage /></AnimatedPage>} />
              <Route path="/terms" element={<AnimatedPage><TermsPage /></AnimatedPage>} />
              <Route path="/blog" element={<AnimatedPage><BlogPage /></AnimatedPage>} />
              <Route path="/search" element={<AnimatedPage><SearchPage /></AnimatedPage>} />
              <Route path="*" element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </main>
      </ErrorBoundary>

      <Footer />

      {/* Global floating elements */}
      <BackToTop />
      <QuickDraftFAB onAuthClick={() => handleAuthOpen('signup')} />
      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      <AuthModal isOpen={isAuthOpen} onClose={handleAuthClose} onSuccess={handleAuthSuccess} initialMode={authInitialMode} />

      {showProfileSetup && (
        <div className="modal-overlay" onClick={() => setShowProfileSetup(false)}>
          <div onClick={e => e.stopPropagation()}>
            <ProfileSetup onComplete={() => setShowProfileSetup(false)} onSkip={() => setShowProfileSetup(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
