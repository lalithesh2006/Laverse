import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EMOJIS = [
    { emoji: '🔥', label: 'Fire' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '👏', label: 'Clap' },
    { emoji: '🤯', label: 'Mind Blown' },
    { emoji: '💡', label: 'Insightful' },
    { emoji: '🎯', label: 'On Point' },
];

const EmojiReactions = ({ postId }) => {
    const { user } = useAuth();
    const [reactions, setReactions] = useState({});
    const [userReactions, setUserReactions] = useState(new Set());
    const [animatingEmoji, setAnimatingEmoji] = useState(null);

    useEffect(() => {
        fetchReactions();
    }, [postId, user]);

    const fetchReactions = async () => {
        try {
            // Mock empty reactions for MVP
            setReactions({});
            setUserReactions(new Set());
        } catch (err) {
            console.error('Error fetching reactions:', err);
        }
    };

    const toggleReaction = async (emoji) => {
        if (!user) return;

        setAnimatingEmoji(emoji);
        setTimeout(() => setAnimatingEmoji(null), 500);

        try {
            if (userReactions.has(emoji)) {
                // Remove reaction (mocked)
                setUserReactions(prev => {
                    const next = new Set(prev);
                    next.delete(emoji);
                    return next;
                });
                setReactions(prev => ({
                    ...prev,
                    [emoji]: Math.max(0, (prev[emoji] || 1) - 1)
                }));
            } else {
                // Add reaction (mocked)
                setUserReactions(prev => new Set([...prev, emoji]));
                setReactions(prev => ({
                    ...prev,
                    [emoji]: (prev[emoji] || 0) + 1
                }));
            }
        } catch (err) {
            console.error('Error toggling reaction:', err);
        }
    };

    return (
        <div className="emoji-reactions">
            <span className="reactions-label">React</span>
            <div className="reactions-row">
                {EMOJIS.map(({ emoji, label }) => {
                    const count = reactions[emoji] || 0;
                    const active = userReactions.has(emoji);
                    const isAnimating = animatingEmoji === emoji;

                    return (
                        <button
                            key={emoji}
                            className={`reaction-btn ${active ? 'reaction-active' : ''} ${isAnimating ? 'reaction-pop' : ''}`}
                            onClick={() => toggleReaction(emoji)}
                            title={user ? label : 'Sign in to react'}
                            aria-label={`${label} ${count}`}
                        >
                            <span className="reaction-emoji">{emoji}</span>
                            {count > 0 && <span className="reaction-count">{count}</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default EmojiReactions;
