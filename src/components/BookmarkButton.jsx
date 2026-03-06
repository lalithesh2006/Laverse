import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Bookmark } from 'lucide-react';

const BookmarkButton = ({ postId, size = 'default' }) => {
    const { user } = useAuth();
    const [bookmarked, setBookmarked] = useState(false);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (user) checkBookmark();
    }, [postId, user]);

    const checkBookmark = async () => {
        if (!isSupabaseConfigured || !supabase || !user) return;
        try {
            const { data } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('post_id', postId)
                .eq('user_id', user.id)
                .maybeSingle();
            setBookmarked(!!data);
        } catch (err) {
            console.error('Error checking bookmark:', err);
        }
    };

    const toggle = async () => {
        if (!user || !isSupabaseConfigured || !supabase) return;
        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);

        try {
            if (bookmarked) {
                await supabase.from('bookmarks').delete()
                    .eq('post_id', postId).eq('user_id', user.id);
                setBookmarked(false);
            } else {
                await supabase.from('bookmarks').insert([{ post_id: postId, user_id: user.id }]);
                setBookmarked(true);
            }
        } catch (err) {
            console.error('Error toggling bookmark:', err);
        }
    };

    return (
        <button
            className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''} ${animating ? 'bookmark-animate' : ''} bookmark-${size}`}
            onClick={toggle}
            title={user ? (bookmarked ? 'Remove bookmark' : 'Save for later') : 'Sign in to bookmark'}
        >
            <Bookmark size={size === 'sm' ? 16 : 20} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
    );
};

export default BookmarkButton;
