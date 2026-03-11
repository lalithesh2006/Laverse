import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { timeAgo, formatReads } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import HeroBg from '../assets/images/hero-bg.png'
import HeroIllustration from '../assets/images/hero-illustration.png'
import ArchiveIllustration from '../assets/images/archive-illustration.png'
import ReadingHistory from '../components/ReadingHistory'
import AuthorSpotlight from '../components/AuthorSpotlight'
import NewsletterCTA from '../components/NewsletterCTA'
import { PenTool, Users, BookOpen, Book, Cpu, Heart, Plane, Globe, Briefcase, User, Utensils, ArrowRight, Loader } from 'lucide-react'



const DEFAULT_TOPICS = [
    { id: 1, title: 'Fiction', count: '0+', desc: 'Short stories, novels, and more', icon: Book, variant: 'dark' },
    { id: 2, title: 'Technology', count: '0+', desc: 'AI, startups, and innovation', icon: Cpu, variant: 'gradient-orange' },
    { id: 3, title: 'Wellness', count: '0+', desc: 'Mental health, fitness, lifestyle', icon: Heart, variant: 'gradient-yellow' },
    { id: 4, title: 'Travel', count: '0+', desc: 'Adventures and destinations', icon: Plane, variant: 'dark' },
    { id: 5, title: 'Culture', count: '0+', desc: 'Art, music, and society', icon: Globe, variant: 'gradient-purple' },
    { id: 6, title: 'Business', count: '0+', desc: 'Entrepreneurship and careers', icon: Briefcase, variant: 'gradient-blue' },
    { id: 7, title: 'Personal', count: '0+', desc: 'Memoirs and reflections', icon: User, variant: 'gradient-teal' },
    { id: 8, title: 'Food', count: '0+', desc: 'Recipes and culinary tales', icon: Utensils, variant: 'gradient-green' }
];

// formatReads and timeAgo imported from ../lib/utils

const HomePage = ({ onAuthClick }) => {
    const { user } = useAuth();
    const [latestStories, setLatestStories] = useState([]);
    const [trendingStories, setTrendingStories] = useState([]);
    const [topics, setTopics] = useState(DEFAULT_TOPICS);
    const [loadingStories, setLoadingStories] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' or 'following'
    const [archiveStats, setArchiveStats] = useState([
        { label: 'Total Stories', value: '...' },
        { label: 'Topics', value: '...' },
        { label: 'Writers', value: '...' },
        { label: 'Updated', value: '...' }
    ]);

    useEffect(() => {
        fetchStories();
        fetchStats();
    }, [activeTab, user]);

    const fetchStories = async () => {
        setLoadingStories(true);
        try {
            let latest = [];
            if (activeTab === 'following' && user) {
                // To be implemented on backend - using mock empty array for now
                setLatestStories([]);
                const trendingData = await api.posts.getTrending();
                setTrendingStories(trendingData.map(p => ({
                    id: p._id, title: p.title, excerpt: p.excerpt, author: p.author_id?.username || p.author_id?.full_name || 'Anonymous', category: p.category || 'General', reads: p.reads || 0, cover_image: p.cover_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
                })));
                setLoadingStories(false);
                return;
            } else {
                latest = await api.posts.getPosts();
            }

            // Fetch trending (most reads)
            const trending = await api.posts.getTrending();

            setLatestStories(latest?.length > 0 ? latest.map(p => ({
                id: p._id,
                title: p.title,
                excerpt: p.excerpt,
                author: p.author_id?.username || p.author_id?.full_name || 'Anonymous',
                time: timeAgo(p.createdAt),
                cover_image: p.cover_image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'
            })) : []);

            setTrendingStories(trending?.length > 0 ? trending.map(p => ({
                id: p._id,
                title: p.title,
                excerpt: p.excerpt,
                author: p.author_id?.username || p.author_id?.full_name || 'Anonymous',
                category: p.category || 'General',
                reads: p.reads || 0,
                cover_image: p.cover_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
            })) : []);

            // Stats omitted for brevity in migration
        } catch (err) {
            console.error('Error fetching stories:', err);
            setLatestStories([]);
            setTrendingStories([]);
        } finally {
            setLoadingStories(false);
        }
    };

    const fetchStats = async () => {
        try {
            const [stats, counts] = await Promise.all([
                api.posts.getStats().catch(() => null),
                api.posts.getCategoryCounts().catch(() => ({})),
            ]);

            if (stats) {
                const updatedDate = stats.lastUpdated
                    ? new Date(stats.lastUpdated).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'Recently';
                setArchiveStats([
                    { label: 'Total Stories', value: stats.totalStories?.toString() || '0' },
                    { label: 'Topics', value: stats.totalCategories?.toString() || '0' },
                    { label: 'Writers', value: stats.totalWriters?.toString() || '0' },
                    { label: 'Updated', value: updatedDate },
                ]);
            }

            if (counts && Object.keys(counts).length > 0) {
                setTopics(prev => prev.map(topic => ({
                    ...topic,
                    count: (counts[topic.title] || 0).toString(),
                })));
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <img src={HeroBg} className="hero-bg" alt="Hero Background" />
                <div className="container hero">
                    <div className="hero-content-wrapper">
                        <div className="hero-text">
                            <h1>Where Stories Come to Life</h1>
                            <p>A place for writers to share their voice and readers to discover extraordinary stories.</p>
                            <div className="hero-btns">
                                {user ? (
                                    <Link to="/write" className="btn-primary">Start Writing</Link>
                                ) : (
                                    <button className="btn-primary" onClick={onAuthClick}>Start Writing</button>
                                )}
                                <a href="#latest" className="btn-secondary">Explore Stories</a>
                            </div>
                        </div>
                        <div className="hero-illustration">
                            <img src={HeroIllustration} alt="Storytelling Illustration" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose La'verse?</h2>
                        <p>Everything you need to share your voice with the world</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <PenTool size={24} />
                            </div>
                            <h3>Beautiful Editor</h3>
                            <p>Write with ease using our distraction-free editor designed for focused creativity and elegant formatting.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Users size={24} />
                            </div>
                            <h3>Engaged Community</h3>
                            <p>Connect with passionate readers and writers who appreciate thoughtful content and meaningful conversations.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <BookOpen size={24} />
                            </div>
                            <h3>Curated Discovery</h3>
                            <p>Find stories that matter to you through personalized recommendations and expertly curated collections.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Stories Section */}
            <section id="latest" className="stories-section">
                <div className="container">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2>Latest Stories</h2>
                            <p>The newest content from our community of writers</p>
                        </div>
                        {user && (
                            <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '24px' }}>
                                <button
                                    className={`btn-sm ${activeTab === 'for-you' ? 'btn-primary' : ''}`}
                                    onClick={() => setActiveTab('for-you')}
                                    style={{ borderRadius: '20px', background: activeTab === 'for-you' ? '' : 'transparent', color: activeTab === 'for-you' ? '' : 'var(--text-secondary)' }}
                                >
                                    For You
                                </button>
                                <button
                                    className={`btn-sm ${activeTab === 'following' ? 'btn-primary' : ''}`}
                                    onClick={() => setActiveTab('following')}
                                    style={{ borderRadius: '20px', background: activeTab === 'following' ? '' : 'transparent', color: activeTab === 'following' ? '' : 'var(--text-secondary)' }}
                                >
                                    Following
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="stories-grid">
                        {loadingStories ? (
                            <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}><div className="spinner"></div></div>
                        ) : latestStories.length === 0 ? (
                            <div style={{ padding: '60px 0', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
                                <PenTool size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                <h3>{activeTab === 'following' ? "You aren't following anyone yet" : "No stories yet"}</h3>
                                <p style={{ marginTop: '8px' }}>
                                    {activeTab === 'following'
                                        ? 'Discover new writers in the "For You" feed and follow them to see their stories here.'
                                        : 'Our community hasn\'t published any stories yet. Be the first!'}
                                </p>
                                {activeTab === 'following' ? (
                                    <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={() => setActiveTab('for-you')}>Discover Stories</button>
                                ) : (
                                    <Link to="/write" className="btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Start Writing</Link>
                                )}
                            </div>
                        ) : latestStories.map(story => (
                            <Link to={`/story/${story.id}`} key={story.id} className="story-card-link">
                                <article className="story-card">
                                    <div className="story-image">
                                        <img src={story.cover_image} alt={story.title} />
                                    </div>
                                    <div className="story-content">
                                        <span className="story-time">{story.time}</span>
                                        <h3>{story.title}</h3>
                                        <p>{story.excerpt}</p>
                                        <span className="story-author">By {story.author}</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section id="trending" className="trending-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Trending Now</h2>
                        <p>The most popular stories this week</p>
                    </div>

                    <div className="trending-list">
                        {trendingStories.length === 0 ? (
                            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                <h3>No trending stories yet</h3>
                                <p>Check back once writers start publishing!</p>
                            </div>
                        ) : trendingStories.map((story, idx) => (
                            <Link to={`/story/${story.id}`} key={story.id} className="story-card-link">
                                <article className="trending-card">
                                    <div className="trending-rank">{idx + 1}</div>
                                    <div className="trending-content">
                                        <h3>{story.title}</h3>
                                        <p>{story.excerpt}</p>
                                        <div className="trending-meta">
                                            <span className="meta-reads">{typeof story.reads === 'number' ? formatReads(story.reads) : story.reads}</span>
                                            <span className="meta-dot">·</span>
                                            <span className="meta-author">{story.author}</span>
                                            <span className="meta-dot">·</span>
                                            <span className="meta-category">{story.category}</span>
                                        </div>
                                    </div>
                                    <div className="trending-image">
                                        <img src={story.cover_image} alt={story.title} />
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Topics Section */}
            <section id="topics" className="topics-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Explore Topics</h2>
                        <p>Find stories that match your interests</p>
                    </div>

                    <div className="topics-grid">
                        {topics.map(topic => (
                            <Link to={`/archives?category=${topic.title}`} key={topic.id} className={`topic-card ${topic.variant}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="topic-icon">
                                    <topic.icon size={28} />
                                </div>
                                <div className="topic-info">
                                    <h3>{topic.title}</h3>
                                    <span className="topic-count">{topic.count} stories</span>
                                    <p>{topic.desc}</p>
                                </div>
                            </Link>
                        ))}
                        {topics.filter(t => t.count !== '0').length === 0 && (
                            <div style={{ padding: '60px 0', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
                                <Book size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                <h3>No topics yet</h3>
                                <p>Once writers publish stories, their topics will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Archive Section */}
            <section id="archive" className="archive-section">
                <div className="container">
                    <div className="archive-inner">
                        <div className="archive-content">
                            <span className="section-tag">The Archive</span>
                            <h2>Dive into our collection</h2>
                            <p>Explore our complete library of stories, essays, and creative works. From timeless classics to daily new arrivals, discover the depth of the La'verse community's voice.</p>

                            <div className="archive-stats-grid">
                                {archiveStats.map((stat, index) => (
                                    <div key={index} className="stat-card">
                                        <span className="stat-value">{stat.value}</span>
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            <Link to="/archives" className="btn-primary archive-cta">
                                Browse Full Archive
                            </Link>
                        </div>

                        <div className="archive-visual">
                            <img
                                src={ArchiveIllustration}
                                alt="Creative Book Illustration"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Reading History */}
            <ReadingHistory />

            {/* Author Spotlight */}
            <AuthorSpotlight />

            {/* Newsletter */}
            <NewsletterCTA />

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready to Share Your Story?</h2>
                        <p>Join thousands of writers who have found their voice on La'verse. Start your journey today.</p>
                        <div className="cta-buttons">
                            {user ? (
                                <Link to="/write" className="btn-cta-primary">
                                    Write a Story <ArrowRight size={18} />
                                </Link>
                            ) : (
                                <button className="btn-cta-primary" onClick={onAuthClick}>
                                    Create Your Account <ArrowRight size={18} />
                                </button>
                            )}
                            <a href="#latest" className="btn-cta-secondary">Learn More</a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
