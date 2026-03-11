import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { estimateReadTime } from '../lib/utils';
import { BookOpen } from 'lucide-react';

const RelatedPosts = ({ currentPostId, category, tags = [] }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchRelated();
    }, [currentPostId, category]);

    const fetchRelated = async () => {
        try {
            const data = await api.posts.getPosts({ category, limit: 4 });
            const related = data ? data.filter(p => p._id !== currentPostId).slice(0, 3) : [];
            setPosts(related);
        } catch (err) {
            console.error('Error fetching related posts:', err);
        }
    };

    if (posts.length === 0) return null;

    return (
        <div className="related-posts">
            <h3 className="related-posts-title">
                <BookOpen size={20} /> You Might Also Like
            </h3>
            <div className="related-posts-grid">
                {posts.map(post => (
                    <Link to={`/story/${post._id}`} key={post._id} className="related-post-card">
                        {post.cover_image ? (
                            <img src={post.cover_image} alt={post.title} className="related-post-img" />
                        ) : (
                            <div className="related-post-img-placeholder">
                                <BookOpen size={24} />
                            </div>
                        )}
                        <div className="related-post-info">
                            <span className="related-post-category">{post.category}</span>
                            <h4>{post.title}</h4>
                            <div className="related-post-meta">
                                <span>{post.author_id?.full_name || 'Anonymous'}</span>
                                <span>·</span>
                                <span>{estimateReadTime(post.content)} read</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts;
