import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem('laverse-theme');
        if (saved) return saved === 'dark';
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        localStorage.setItem('laverse-theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <button
            className="dark-mode-toggle"
            onClick={() => setDark(!dark)}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
        >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
};

export default DarkModeToggle;
