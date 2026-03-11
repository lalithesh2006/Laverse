import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { api } from '../lib/api';

const LikeButton = ({ postId, size = 'default' }) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (postId) fetchLikes();
    }, [postId, user]);

    const fetchLikes = async () => {
        try {
            const data = await api.likes.getCount(postId);
            setLikeCount(data.count ?? 0);
            setLiked(data.userLiked ?? false);
        } catch (err) {
            // Backend not available — silently fail
            setLikeCount(0);
            setLiked(false);
        }
    };

    const toggleLike = async () => {
        if (!user || loading) return;

        setAnimating(true);
        setLoading(true);
        setTimeout(() => setAnimating(false), 400);

        // Optimistic update
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikeCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1);

        try {
            const data = await api.likes.toggle(postId);
            setLiked(data.liked);
            setLikeCount(data.count);
        } catch (err) {
            // Revert on error
            setLiked(wasLiked);
            setLikeCount(prev => wasLiked ? prev + 1 : Math.max(0, prev - 1));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`like-btn ${liked ? 'liked' : ''} ${animating ? 'like-animate' : ''} like-${size}`}
            onClick={toggleLike}
            title={user ? (liked ? 'Unlike' : 'Like') : 'Sign in to like'}
            disabled={loading}
        >
            <Heart size={size === 'sm' ? 16 : 20} fill={liked ? 'currentColor' : 'none'} />
            <span>{likeCount}</span>
        </button>
    );
};

export default LikeButton;
