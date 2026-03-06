import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, UserMinus } from 'lucide-react';

const FollowButton = ({ authorId, onAuthRequired }) => {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.id === authorId) {
            setLoading(false);
            return;
        }

        checkFollowStatus();
    }, [user, authorId]);

    const checkFollowStatus = async () => {
        try {
            // Mocking for MVP
            setIsFollowing(false);
        } catch (err) {
            // No record found, not following
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFollow = async () => {
        if (!user) {
            if (onAuthRequired) onAuthRequired();
            return;
        }

        if (user.id === authorId) return;

        setLoading(true);

        try {
            // Mock toggle for MVP
            if (isFollowing) {
                setIsFollowing(false);
            } else {
                setIsFollowing(true);
            }
        } catch (err) {
            console.error('Error toggling follow:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.id === authorId) return null;

    return (
        <button
            onClick={handleToggleFollow}
            disabled={loading}
            className={`btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
            style={{
                borderRadius: '20px',
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px'
            }}
        >
            {loading ? (
                <div className="spinner-sm" style={{ borderColor: isFollowing ? 'var(--text-secondary)' : '#fff', borderTopColor: 'transparent' }} />
            ) : isFollowing ? (
                <>
                    <UserMinus size={14} /> Following
                </>
            ) : (
                <>
                    <UserPlus size={14} /> Follow
                </>
            )}
        </button>
    );
};

export default FollowButton;
