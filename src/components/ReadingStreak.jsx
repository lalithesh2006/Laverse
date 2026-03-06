import { useState, useEffect } from 'react';
import { Flame, Trophy } from 'lucide-react';

function getStreakData() {
    const raw = localStorage.getItem('laverse-streak');
    if (!raw) return { currentStreak: 0, longestStreak: 0, lastVisit: null, totalReads: 0 };
    try { return JSON.parse(raw); } catch { return { currentStreak: 0, longestStreak: 0, lastVisit: null, totalReads: 0 }; }
}

function updateStreak() {
    const data = getStreakData();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (data.lastVisit === today) {
        // Already visited today
        return data;
    }

    data.totalReads = (data.totalReads || 0) + 1;

    if (data.lastVisit === yesterday) {
        // Consecutive day
        data.currentStreak += 1;
    } else if (data.lastVisit !== today) {
        // Streak broken
        data.currentStreak = 1;
    }

    data.longestStreak = Math.max(data.longestStreak || 0, data.currentStreak);
    data.lastVisit = today;

    localStorage.setItem('laverse-streak', JSON.stringify(data));
    return data;
}

const ReadingStreak = () => {
    const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, totalReads: 0 });

    useEffect(() => {
        const data = updateStreak();
        setStreak(data);
    }, []);

    return (
        <div className="reading-streak">
            <div className="streak-current">
                <Flame size={24} className={streak.currentStreak >= 3 ? 'streak-flame-active' : 'streak-flame'} />
                <div>
                    <span className="streak-num">{streak.currentStreak}</span>
                    <span className="streak-label">day streak</span>
                </div>
            </div>
            <div className="streak-stats">
                <div className="streak-stat">
                    <Trophy size={14} />
                    <span>Best: {streak.longestStreak} days</span>
                </div>
                <div className="streak-stat">
                    <span>📚 {streak.totalReads} total reads</span>
                </div>
            </div>
        </div>
    );
};

export default ReadingStreak;
