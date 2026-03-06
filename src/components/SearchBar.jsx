import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { escapeSearchQuery } from '../lib/utils';
import { Search, X, Clock, ArrowRight, Loader } from 'lucide-react';

const SearchBar = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            const saved = JSON.parse(localStorage.getItem('laverse-recent-searches') || '[]');
            setRecentSearches(saved);
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length >= 2) {
                searchPosts(query.trim());
            } else {
                setResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Escape key closes the search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const searchPosts = async (searchQuery) => {
        if (!isSupabaseConfigured || !supabase) return;
        setLoading(true);
        try {
            const safeQuery = escapeSearchQuery(searchQuery);
            const { data, error } = await supabase
                .from('posts')
                .select('id, title, excerpt, category, cover_image, created_at')
                .eq('published', true)
                .or(`title.ilike.%${safeQuery}%,content.ilike.%${safeQuery}%,excerpt.ilike.%${safeQuery}%`)
                .order('created_at', { ascending: false })
                .limit(8);

            if (error) throw error;
            setResults(data || []);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (postId) => {
        // Save to recent
        const searches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        localStorage.setItem('laverse-recent-searches', JSON.stringify(searches));
        setRecentSearches(searches);
        navigate(`/story/${postId}`);
        onClose();
        setQuery('');
    };

    const handleRecentClick = (term) => {
        setQuery(term);
        searchPosts(term);
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-modal" onClick={e => e.stopPropagation()}>
                <div className="search-input-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search stories, topics, authors..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="search-input"
                    />
                    {loading && <Loader size={18} className="search-spinner" />}
                    <button className="search-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="search-results">
                    {query.length < 2 && recentSearches.length > 0 && (
                        <div className="search-recent">
                            <h4><Clock size={14} /> Recent Searches</h4>
                            {recentSearches.map((term, i) => (
                                <button key={i} className="recent-search-item" onClick={() => handleRecentClick(term)}>
                                    <Clock size={14} /> {term} <ArrowRight size={12} />
                                </button>
                            ))}
                        </div>
                    )}

                    {query.length >= 2 && !loading && results.length === 0 && (
                        <div className="search-no-results">
                            <p>No stories found for "{query}"</p>
                        </div>
                    )}

                    {results.map(post => (
                        <button key={post.id} className="search-result-item" onClick={() => handleSelect(post.id)}>
                            {post.cover_image && (
                                <img src={post.cover_image} alt="" className="search-result-img" />
                            )}
                            <div className="search-result-info">
                                <h4>{post.title}</h4>
                                <p>{post.excerpt?.substring(0, 80)}...</p>
                                <span className="search-result-meta">{post.category} · {new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="search-footer">
                    <span className="search-shortcut">
                        <kbd>Esc</kbd> to close · <kbd>Ctrl+K</kbd> to search
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
