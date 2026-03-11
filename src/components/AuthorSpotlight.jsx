import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const AuthorSpotlight = () => {
    const [authors, setAuthors] = useState([]);
    const [scrollIndex, setScrollIndex] = useState(0);

    useEffect(() => {
        fetchTopAuthors();
    }, []);

    const fetchTopAuthors = async () => {
        try {
            // Fetch posts to derive active authors from
            const data = await api.posts.getPosts({ limit: 50 });

            if (!data) return;

            // Aggregate by author locally
            const authorMap = {};
            data.forEach(post => {
                const p = post.author_id;
                if (!p) return;
                if (!authorMap[p._id]) {
                    authorMap[p._id] = {
                        id: p._id,
                        name: p.full_name || p.username || 'Anonymous',
                        username: p.username || '',
                        avatar: p.avatar_url || '',
                        bio: p.bio || '',
                        posts: 0,
                        reads: 0,
                    };
                }
                authorMap[p._id].posts += 1;
                authorMap[p._id].reads += (post.reads || 0);
            });

            const sorted = Object.values(authorMap)
                .sort((a, b) => b.reads - a.reads)
                .slice(0, 8);

            setAuthors(sorted);
        } catch (err) {
            console.error('Error fetching top authors:', err);
        }
    };

    const scrollLeft = () => setScrollIndex(Math.max(0, scrollIndex - 1));
    const scrollRight = () => setScrollIndex(Math.min(authors.length - 3, scrollIndex + 1));

    if (authors.length === 0) return null;

    return (
        <section className="author-spotlight-section">
            <div className="container">
                <div className="spotlight-header">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <Star size={20} style={{ color: 'var(--color-primary)' }} />
                            <span className="section-tag">SPOTLIGHT</span>
                        </div>
                        <h2 style={{ fontSize: '2.5rem' }}>Top Writers</h2>
                    </div>
                    {authors.length > 3 && (
                        <div className="spotlight-arrows">
                            <button onClick={scrollLeft} disabled={scrollIndex === 0} className="spotlight-arrow">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={scrollRight} disabled={scrollIndex >= authors.length - 3} className="spotlight-arrow">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
                <div className="spotlight-grid" style={{ transform: `translateX(-${scrollIndex * 310}px)` }}>
                    {authors.map(author => (
                        <Link to={`/dashboard`} key={author.id} className="spotlight-card">
                            <div className="spotlight-avatar">
                                {author.avatar ? (
                                    <img src={author.avatar} alt={author.name} />
                                ) : (
                                    <div className="spotlight-avatar-fallback">
                                        {author.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h4 style={{ textTransform: 'capitalize' }}>{author.name}</h4>
                            {author.bio && <p className="spotlight-bio">{author.bio.substring(0, 60)}</p>}
                            <div className="spotlight-stats">
                                <span>{author.posts} stories</span>
                                <span className="meta-dot" />
                                <span>{author.reads >= 1000 ? (author.reads / 1000).toFixed(1) + 'K' : author.reads} reads</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AuthorSpotlight;
