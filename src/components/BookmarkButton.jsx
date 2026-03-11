import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bookmark } from 'lucide-react';
import { api } from '../lib/api';

const BookmarkButton = ({ postId, size = 'default' }) => {
    const { user } = useAuth();
    const [bookmarked, setBookmarked] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && postId) checkBookmark();
        else setBookmarked(false);
    }, [postId, user]);

    const checkBookmark = async () => {
        try {
            const data = await api.bookmarks.getStatus(postId);
            setBookmarked(data.bookmarked ?? false);
        } catch (err) {
            setBookmarked(false);
        }
    };

    const toggle = async () => {
        if (!user || loading) return;

        setAnimating(true);
        setLoading(true);
        setTimeout(() => setAnimating(false), 400);

        // Optimistic update
        const wasBookmarked = bookmarked;
        setBookmarked(!wasBookmarked);

        try {
            const data = await api.bookmarks.toggle(postId);
            setBookmarked(data.bookmarked);
        } catch (err) {
            setBookmarked(wasBookmarked); // revert
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''} ${animating ? 'bookmark-animate' : ''} bookmark-${size}`}
            onClick={toggle}
            disabled={loading}
            title={user ? (bookmarked ? 'Remove bookmark' : 'Save for later') : 'Sign in to bookmark'}
        >
            <Bookmark size={size === 'sm' ? 16 : 20} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
    );
};

export default BookmarkButton;
