import { useState, useEffect } from 'react';

const ReadingProgressBar = () => {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const pct = Math.min((scrollTop / docHeight) * 100, 100);
            setProgress(pct);
            setVisible(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <div className="reading-progress-bar" aria-hidden="true">
            <div
                className="reading-progress-fill"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ReadingProgressBar;
