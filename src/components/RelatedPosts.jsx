import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { estimateReadTime } from '../lib/utils';
import { BookOpen } from 'lucide-react';

const RelatedPosts = ({ currentPostId, category, tags = [] }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchRelated();
    }, [currentPostId, category]);

    const fetchRelated = async () => {
        if (!isSupabaseConfigured || !supabase) return;
        try {
            // Fetch posts in same category, excluding current
            const { data, error } = await supabase
                .from('posts')
                .select('id, title, excerpt, cover_image, category, content, created_at, profiles(full_name)')
                .eq('published', true)
                .eq('category', category)
                .neq('id', currentPostId)
                .order('reads', { ascending: false })
                .limit(3);

            if (error) throw error;
            setPosts(data || []);
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
                    <Link to={`/story/${post.id}`} key={post.id} className="related-post-card">
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
                                <span>{post.profiles?.full_name || 'Anonymous'}</span>
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
