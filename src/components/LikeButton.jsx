import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

const LikeButton = ({ postId, size = 'default' }) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        fetchLikes();
    }, [postId, user]);

    const fetchLikes = async () => {
        try {
            // Mocking for MVP migration
            setLikeCount(Math.floor(Math.random() * 10)); // Just some fake initial likes
            setLiked(false);
        } catch (err) {
            console.error('Error fetching likes:', err);
        }
    };

    const toggleLike = async () => {
        if (!user) return;

        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);

        try {
            // Mocking toggle logic for MVP
            if (liked) {
                setLiked(false);
                setLikeCount(prev => Math.max(0, prev - 1));
            } else {
                setLiked(true);
                setLikeCount(prev => prev + 1);
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    return (
        <button
            className={`like-btn ${liked ? 'liked' : ''} ${animating ? 'like-animate' : ''} like-${size}`}
            onClick={toggleLike}
            title={user ? (liked ? 'Unlike' : 'Like') : 'Sign in to like'}
        >
            <Heart size={size === 'sm' ? 16 : 20} fill={liked ? 'currentColor' : 'none'} />
            <span>{likeCount}</span>
        </button>
    );
};

export default LikeButton;
