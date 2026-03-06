import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, X } from 'lucide-react';

const STORAGE_KEY = 'laverse-reading-history';
const MAX_HISTORY = 20;

/**
 * Save a story to reading history in localStorage.
 * Call this from StoryPage when a post is viewed.
 */
export function trackReading(post) {
    if (!post || !post.id) return;
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        // Remove if already exists (to re-add at top)
        const filtered = history.filter(h => h.id !== post.id);
        filtered.unshift({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt || '',
            cover_image: post.cover_image || '',
            category: post.category || '',
            readAt: new Date().toISOString(),
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_HISTORY)));
    } catch (e) {
        // localStorage might be full or unavailable
    }
}

/**
 * Clear all reading history.
 */
export function clearReadingHistory() {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * ReadingHistory Component — shows "Continue Reading" section
 */
const ReadingHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            setHistory(stored.slice(0, 4));
        } catch (e) {
            setHistory([]);
        }
    }, []);

    const removeItem = (id) => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const updated = stored.filter(h => h.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            setHistory(updated.slice(0, 4));
        } catch (e) { }
    };

    if (history.length === 0) return null;

    return (
        <section className="reading-history-section">
            <div className="container">
                <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={22} style={{ color: 'var(--color-primary)' }} />
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Continue Reading</h3>
                    </div>
                </div>
                <div className="reading-history-grid">
                    {history.map(item => (
                        <div key={item.id} className="reading-history-card">
                            <button
                                className="history-remove"
                                onClick={(e) => { e.preventDefault(); removeItem(item.id); }}
                                title="Remove from history"
                            >
                                <X size={14} />
                            </button>
                            <Link to={`/story/${item.id}`} className="history-link">
                                {item.cover_image ? (
                                    <img src={item.cover_image} alt="" className="history-img" />
                                ) : (
                                    <div className="history-img-placeholder">
                                        <BookOpen size={20} />
                                    </div>
                                )}
                                <div className="history-info">
                                    <span className="history-category">{item.category}</span>
                                    <h4>{item.title}</h4>
                                    <span className="history-time">
                                        Read {new Date(item.readAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReadingHistory;
