import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { estimateReadTime } from '../lib/utils';
import { Calendar, BookOpen, ChevronDown, ChevronUp, Clock, Eye } from 'lucide-react';

const ArchivesPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedMonths, setExpandedMonths] = useState({});
    const [categories, setCategories] = useState(['All']);

    const location = useLocation();

    useEffect(() => {
        document.title = "Archives — La'verse";
        fetchPosts();
        return () => { document.title = "La'verse"; };
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [location.search]);

    const fetchPosts = async () => {
        if (!isSupabaseConfigured || !supabase) { setLoading(false); return; }
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('id, title, excerpt, category, cover_image, content, reads, created_at, profiles(full_name)')
                .eq('published', true)
                .order('created_at', { ascending: false });
            if (error) throw error;

            const fetchedPosts = data || [];
            setPosts(fetchedPosts);

            // Dynamically extract unique categories from existing posts
            const extractedCategories = fetchedPosts.map(p => p.category).filter(Boolean);
            const uniqueCategories = ['All', ...new Set(extractedCategories)].sort();
            setCategories(uniqueCategories);
        } catch (err) {
            console.error('Error fetching archives:', err);
        } finally {
            setLoading(false);
        }
    };

    // Group posts by month/year
    const filteredPosts = selectedCategory === 'All' ? posts : posts.filter(p => p.category === selectedCategory);

    const groupedByMonth = {};
    filteredPosts.forEach(post => {
        const date = new Date(post.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!groupedByMonth[key]) groupedByMonth[key] = { label, posts: [] };
        groupedByMonth[key].posts.push(post);
    });

    const months = Object.entries(groupedByMonth).sort((a, b) => b[0].localeCompare(a[0]));

    // Auto-expand first month
    useEffect(() => {
        if (months.length > 0 && Object.keys(expandedMonths).length === 0) {
            setExpandedMonths({ [months[0][0]]: true });
        }
    }, [months.length]);

    const toggleMonth = (key) => {
        setExpandedMonths(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="archives-page">
            <div className="container">
                <div className="archives-header">
                    <h1><Calendar size={28} /> Archives</h1>
                    <p>Browse all published stories by date and category</p>
                </div>

                {/* Category Filter */}
                <div className="archives-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="archives-summary">
                    <span>{filteredPosts.length} stories</span>
                    <span>·</span>
                    <span>{months.length} months</span>
                    <span>·</span>
                    <span>{filteredPosts.reduce((sum, p) => sum + (p.reads || 0), 0).toLocaleString()} total reads</span>
                </div>

                {loading ? (
                    <div className="archives-loading"><div className="spinner"></div><p>Loading archives...</p></div>
                ) : months.length === 0 ? (
                    <div className="archives-empty">
                        <BookOpen size={48} />
                        <h2>No stories found</h2>
                        <p>There are no published stories{selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''} yet.</p>
                    </div>
                ) : (
                    <div className="archives-list">
                        {months.map(([key, { label, posts: monthPosts }]) => (
                            <div key={key} className="archive-month">
                                <button className="archive-month-header" onClick={() => toggleMonth(key)}>
                                    <div className="archive-month-info">
                                        <h2>{label}</h2>
                                        <span className="archive-month-count">{monthPosts.length} {monthPosts.length === 1 ? 'story' : 'stories'}</span>
                                    </div>
                                    {expandedMonths[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>

                                {expandedMonths[key] && (
                                    <div className="archive-month-posts">
                                        {monthPosts.map(post => (
                                            <Link to={`/story/${post.id}`} key={post.id} className="archive-post-item">
                                                <div className="archive-post-date">
                                                    <span className="archive-day">{new Date(post.created_at).getDate()}</span>
                                                    <span className="archive-month-short">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                </div>
                                                {post.cover_image ? (
                                                    <img src={post.cover_image} alt="" className="archive-post-img" />
                                                ) : (
                                                    <div className="archive-post-img-placeholder"><BookOpen size={20} /></div>
                                                )}
                                                <div className="archive-post-info">
                                                    <span className="archive-post-category">{post.category}</span>
                                                    <h3>{post.title}</h3>
                                                    {post.excerpt && <p>{post.excerpt}</p>}
                                                    <div className="archive-post-meta">
                                                        <span>{post.profiles?.full_name || 'Anonymous'}</span>
                                                        <span>·</span>
                                                        <span><Clock size={12} /> {estimateReadTime(post.content)} read</span>
                                                        {post.reads > 0 && <><span>·</span><span><Eye size={12} /> {post.reads}</span></>}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchivesPage;
