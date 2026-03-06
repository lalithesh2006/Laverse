import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
        if (!isSupabaseConfigured || !supabase) return;
        try {

            const { count } = await supabase
                .from('likes')
                .select('*', { count: 'exact', head: true })
                .eq('post_id', postId);
            setLikeCount(count || 0);


            if (user) {
                const { data } = await supabase
                    .from('likes')
                    .select('id')
                    .eq('post_id', postId)
                    .eq('user_id', user.id)
                    .maybeSingle();
                setLiked(!!data);
            }
        } catch (err) {
            console.error('Error fetching likes:', err);
        }
    };

    const toggleLike = async () => {
        if (!user || !isSupabaseConfigured || !supabase) return;

        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);

        try {
            if (liked) {
                await supabase
                    .from('likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user.id);
                setLiked(false);
                setLikeCount(prev => Math.max(0, prev - 1));
            } else {
                await supabase.from('likes').insert([{ post_id: postId, user_id: user.id }]);
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
