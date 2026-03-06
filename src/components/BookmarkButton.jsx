import { useState, useEffect } from 'react';
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
        try {
            // Mock bookmark status for MVP
            setBookmarked(false);
        } catch (err) {
            console.error('Error checking bookmark:', err);
        }
    };

    const toggle = async () => {
        if (!user) return;
        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);

        try {
            // Mock toggle logic for MVP
            if (bookmarked) {
                setBookmarked(false);
            } else {
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
