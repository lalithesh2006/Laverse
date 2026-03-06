import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { timeAgo } from '../lib/utils';
import { Newspaper, BookOpen, ArrowRight } from 'lucide-react';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await api.posts.getPosts({ limit: 20 });
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching blog posts:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="legal-page blog-page">
            <div className="container">
                <div className="legal-hero">
                    <div className="legal-hero-icon">
                        <Newspaper size={32} />
                    </div>
                    <h1>Blog</h1>
                    <p className="legal-hero-subtitle">
                        The latest stories, insights, and updates from the La'verse community.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div className="spinner"></div>
                        <p>Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
                        <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                        <p>No posts yet. Be the first to write a story!</p>
                        <Link to="/write" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
                            Write a Story
                        </Link>
                    </div>
                ) : (
                    <div className="blog-posts-grid">
                        {posts.map(post => (
                            <Link to={`/story/${post._id}`} key={post._id} className="blog-post-card">
                                {post.cover_image && (
                                    <div className="blog-post-image">
                                        <img src={post.cover_image} alt={post.title} />
                                    </div>
                                )}
                                <div className="blog-post-body">
                                    <div className="blog-post-meta">
                                        <span className="blog-post-category">{post.category || 'General'}</span>
                                        <span className="blog-post-date">{timeAgo(post.createdAt)}</span>
                                    </div>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt?.substring(0, 120)}...</p>
                                    <div className="blog-post-footer">
                                        <span className="blog-post-author">
                                            by {post.author_id?.full_name || post.author_id?.username || 'Anonymous'}
                                        </span>
                                        <span className="blog-read-more">
                                            Read <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
