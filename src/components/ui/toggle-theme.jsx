import { useState, useEffect } from 'react';
import { MonitorCog, Sun, MoonStar } from 'lucide-react';
import { motion } from 'framer-motion';

const themes = [
    { icon: MonitorCog, value: 'system', label: 'System' },
    { icon: Sun, value: 'light', label: 'Light' },
    { icon: MoonStar, value: 'dark', label: 'Dark' },
];

function resolveTheme(theme) {
    if (theme === 'system') {
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
}

function apply(theme) {
    document.documentElement.setAttribute('data-theme', resolveTheme(theme));
    localStorage.setItem('laverse-theme', theme);
}

export function ToggleTheme() {
    const [active, setActive] = useState(() => {
        return localStorage.getItem('laverse-theme') || 'system';
    });

    useEffect(() => {
        apply(active);
    }, [active]);

    useEffect(() => {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => { if (active === 'system') apply('system'); };
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, [active]);

    return (
        <div className="toggle-theme-group" role="radiogroup" aria-label="Theme switcher">
            {themes.map((t) => {
                const Icon = t.icon;
                const selected = active === t.value;
                return (
                    <button
                        key={t.value}
                        className={`toggle-theme-btn${selected ? ' active' : ''}`}
                        role="radio"
                        aria-checked={selected}
                        aria-label={`Switch to ${t.label} theme`}
                        onClick={() => setActive(t.value)}
                    >
                        {selected && (
                            <motion.span
                                layoutId="theme-indicator"
                                className="toggle-theme-indicator"
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <Icon size={14} />
                    </button>
                );
            })}
        </div>
    );
}

export default ToggleTheme;
