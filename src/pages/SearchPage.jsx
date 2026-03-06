import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { escapeSearchQuery } from '../lib/utils';
import { Search, SlidersHorizontal, BookOpen, Clock, Loader, TrendingUp } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Fiction', 'Wellness', 'Travel', 'Culture', 'Business', 'Personal', 'Food'];

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest'); // 'newest', 'oldest', 'popular'

    useEffect(() => {
        if (query.trim() || category !== 'All') {
            performSearch();
        } else {
            setResults([]);
        }

        // Update URL params
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (category !== 'All') params.set('category', category);
        if (sortBy !== 'newest') params.set('sort', sortBy);
        setSearchParams(params, { replace: true });

    }, [query, category, sortBy]);

    const performSearch = async () => {
        setLoading(true);

        try {
            const data = await api.posts.getPosts({
                search: query.trim(),
                category: category !== 'All' ? category : undefined,
                sort: sortBy
            });

            setResults(data || []);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        performSearch();
    };

    return (
        <div className="search-page">
            <div className="container" style={{ padding: '120px 20px 60px', minHeight: '80vh' }}>
                <div className="search-header-area" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '16px', fontWeight: 800, background: 'linear-gradient(90deg, var(--primary-color), var(--text-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Discover Stories
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Dive into thousands of articles, ideas, and perspectives.
                    </p>
                </div>

                <div className="search-controls-wrapper" style={{
                    background: 'var(--bg-secondary)',
                    padding: '24px',
                    borderRadius: '24px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
                    marginBottom: '40px'
                }}>
                    <form onSubmit={handleSearchSubmit} className="search-bar-main" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={22} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by title, keyword, or author..."
                                style={{
                                    width: '100%',
                                    padding: '16px 20px 16px 48px',
                                    borderRadius: '16px',
                                    border: '2px solid transparent',
                                    background: 'var(--bg-primary)',
                                    fontSize: '1.1rem',
                                    color: 'var(--text-color)',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ padding: '0 32px', borderRadius: '16px', fontSize: '1.1rem' }}>
                            Search
                        </button>
                    </form>

                    <div className="search-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                            <SlidersHorizontal size={18} style={{ color: 'var(--text-secondary)' }} />
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        background: category === cat ? 'var(--primary-color)' : 'transparent',
                                        color: category === cat ? 'white' : 'var(--text-secondary)',
                                        border: category === cat ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s',
                                        fontWeight: 500
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="sort-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-color)',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="search-results-area">
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: 'var(--primary-color)' }}>
                            <Loader className="spinner" size={40} />
                            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Scouring the universe...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="search-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '24px'
                        }}>
                            {results.map(post => (
                                <Link to={`/story/${post._id}`} key={post._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <article className="story-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        {post.cover_image && (
                                            <div className="story-image" style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                                                <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <div className="story-content" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ display: 'inline-block', padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', alignSelf: 'flex-start' }}>
                                                {post.category}
                                            </span>
                                            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', lineHeight: 1.4 }}>{post.title}</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, flex: 1, marginBottom: '20px' }}>
                                                {post.excerpt?.substring(0, 120)}...
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {post.author_id?.avatar_url ? (
                                                        <img src={post.author_id.avatar_url} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                                            {post.author_id?.full_name?.[0] || 'U'}
                                                        </div>
                                                    )}
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{post.author_id?.full_name || post.author_id?.username}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                                    {post.reads > 0 && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> {post.reads}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    ) : (query || category !== 'All') ? (
                        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--bg-secondary)', borderRadius: '24px' }}>
                            <BookOpen size={64} style={{ color: 'var(--text-secondary)', opacity: 0.5, marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No stories found</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>We couldn't find any stories matching your search criteria.</p>
                            <button onClick={() => { setQuery(''); setCategory('All'); }} className="btn-secondary" style={{ marginTop: '20px' }}>
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Enter a search term or select a category to view stories.</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default SearchPage;
