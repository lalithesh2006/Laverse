import { useState, useEffect } from 'react';
import { Award, MessageCircle, Heart, Share2, BookOpen, PenTool, Star } from 'lucide-react';

const BADGE_DEFINITIONS = [
    { id: 'first_post', label: 'First Post', desc: 'Published your first story', icon: PenTool, check: (s) => s.posts >= 1 },
    { id: 'prolific', label: 'Prolific Writer', desc: 'Published 5 stories', icon: PenTool, check: (s) => s.posts >= 5 },
    { id: 'first_comment', label: 'Conversationalist', desc: 'Left your first comment', icon: MessageCircle, check: (s) => s.comments >= 1 },
    { id: 'engaged', label: 'Super Engaged', desc: '10+ comments', icon: MessageCircle, check: (s) => s.comments >= 10 },
    { id: 'first_like', label: 'Heart Giver', desc: 'Liked a story', icon: Heart, check: (s) => s.likes >= 1 },
    { id: 'popular', label: 'Popular Author', desc: '100+ total reads', icon: BookOpen, check: (s) => s.totalReads >= 100 },
    { id: 'viral', label: 'Viral', desc: '1000+ total reads', icon: Star, check: (s) => s.totalReads >= 1000 },
    { id: 'streak_3', label: 'On Fire', desc: '3-day reading streak', icon: Award, check: (s) => s.streak >= 3 },
    { id: 'streak_7', label: 'Dedicated Reader', desc: '7-day reading streak', icon: Award, check: (s) => s.streak >= 7 },
    { id: 'sharer', label: 'Ambassador', desc: 'Shared a post', icon: Share2, check: () => !!localStorage.getItem('laverse-shared') },
];

const UserBadges = ({ stats = {} }) => {
    const [earned, setEarned] = useState([]);

    useEffect(() => {
        const streakData = JSON.parse(localStorage.getItem('laverse-streak') || '{}');
        const fullStats = { ...stats, streak: streakData.currentStreak || 0 };
        const badges = BADGE_DEFINITIONS.filter(b => b.check(fullStats));
        setEarned(badges);
    }, [stats]);

    if (earned.length === 0) {
        return (
            <div className="badges-section badges-empty">
                <Award size={24} />
                <p>Start writing, commenting, and reading to earn badges!</p>
            </div>
        );
    }

    return (
        <div className="badges-section">
            <h4 className="badges-title"><Award size={18} /> Badges ({earned.length}/{BADGE_DEFINITIONS.length})</h4>
            <div className="badges-grid">
                {BADGE_DEFINITIONS.map(badge => {
                    const isEarned = earned.some(e => e.id === badge.id);
                    const Icon = badge.icon;
                    return (
                        <div key={badge.id} className={`badge-item ${isEarned ? 'badge-earned' : 'badge-locked'}`} title={badge.desc}>
                            <Icon size={20} />
                            <span className="badge-label">{badge.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserBadges;
