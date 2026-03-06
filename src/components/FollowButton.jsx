import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
        if (!isSupabaseConfigured || !supabase) return;

        try {
            const { data, error } = await supabase
                .from('follows')
                .select('*')
                .eq('follower_id', user.id)
                .eq('following_id', authorId)
                .single();

            if (data && !error) {
                setIsFollowing(true);
            }
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

        if (!isSupabaseConfigured || !supabase) return;

        try {
            if (isFollowing) {
                // Unfollow
                await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', user.id)
                    .eq('following_id', authorId);
                setIsFollowing(false);
            } else {
                // Follow
                await supabase
                    .from('follows')
                    .insert([{ follower_id: user.id, following_id: authorId }]);
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
