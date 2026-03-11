import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Sun, Moon, Minus, Plus, AlignLeft, Eye } from 'lucide-react';

/**
 * ZenMode — immersive full-screen distraction-free reading mode.
 * Strips away everything except the story content with custom
 * font size, line spacing, and background color controls.
 */
const ZenMode = ({ title, content }) => {
    const [active, setActive] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.8);
    const [bg, setBg] = useState('white'); // 'white' | 'sepia' | 'dark' | 'midnight'
    const [showControls, setShowControls] = useState(false);
    const [progress, setProgress] = useState(0);

    const BG_THEMES = {
        white: { bg: '#ffffff', text: '#1a1a1a', name: '☀️ Light' },
        sepia: { bg: '#f9f3e3', text: '#3d2b1f', name: '📜 Sepia' },
        dark: { bg: '#1e1e2e', text: '#cdd6f4', name: '🌙 Dark' },
        midnight: { bg: '#0d1117', text: '#e6edf3', name: '🌌 Midnight' },
    };

    const theme = BG_THEMES[bg];

    useEffect(() => {
        if (!active) return;
        const handleScroll = () => {
            const el = document.getElementById('zen-reader');
            if (!el) return;
            const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
            setProgress(Math.min(100, Math.round(pct)));
        };
        const reader = document.getElementById('zen-reader');
        reader?.addEventListener('scroll', handleScroll);
        return () => reader?.removeEventListener('scroll', handleScroll);
    }, [active]);

    useEffect(() => {
        const handle = (e) => {
            if (!active) return;
            if (e.key === 'Escape') setActive(false);
            if (e.key === '+' || e.key === '=') setFontSize(f => Math.min(28, f + 1));
            if (e.key === '-') setFontSize(f => Math.max(14, f - 1));
        };
        window.addEventListener('keydown', handle);
        return () => window.removeEventListener('keydown', handle);
    }, [active]);

    if (!active) {
        return (
            <button onClick={() => setActive(true)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--color-white)', border: '1px solid var(--color-border)',
                borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
                color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 500
            }} title="Enter Zen Reading Mode (distraction-free)">
                <Maximize2 size={14} /> Zen Mode
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: theme.bg, color: theme.text,
            display: 'flex', flexDirection: 'column',
            fontFamily: '"Georgia", "Times New Roman", serif'
        }}>
            {/* Progress bar */}
            <div style={{ height: 3, background: 'rgba(128,128,128,0.15)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100000 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-primary)', transition: 'width 0.3s' }} />
            </div>

            {/* Top bar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 24px', borderBottom: `1px solid ${theme.bg === '#ffffff' ? '#eee' : 'rgba(255,255,255,0.08)'}`,
                background: theme.bg
            }}>
                <span style={{ fontSize: 13, opacity: 0.5, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
                <div style={{ display: 'flex', align: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, opacity: 0.4 }}>{progress}% read</span>
                    <button onClick={() => setShowControls(!showControls)} style={{ background: 'none', border: '1px solid rgba(128,128,128,0.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: theme.text, fontSize: 12 }}>
                        <AlignLeft size={12} style={{ display: 'inline', marginRight: 4 }} />Settings
                    </button>
                    <button onClick={() => setActive(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text, opacity: 0.5, padding: 4 }} title="Exit (Esc)">
                        <Minimize2 size={18} />
                    </button>
                </div>
            </div>

            {/* Controls panel */}
            {showControls && (
                <div style={{
                    display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
                    padding: '10px 24px', background: theme.bg,
                    borderBottom: `1px solid ${theme.bg === '#ffffff' ? '#eee' : 'rgba(255,255,255,0.08)'}`
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, opacity: 0.5 }}>Font:</span>
                        <button onClick={() => setFontSize(f => Math.max(14, f - 1))} style={{ background: 'none', border: '1px solid rgba(128,128,128,0.3)', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', color: theme.text }}><Minus size={12} /></button>
                        <span style={{ fontSize: 13, minWidth: 30, textAlign: 'center' }}>{fontSize}px</span>
                        <button onClick={() => setFontSize(f => Math.min(28, f + 1))} style={{ background: 'none', border: '1px solid rgba(128,128,128,0.3)', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', color: theme.text }}><Plus size={12} /></button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, opacity: 0.5 }}>Spacing:</span>
                        {[1.5, 1.8, 2.2].map(lh => (
                            <button key={lh} onClick={() => setLineHeight(lh)} style={{ background: lineHeight === lh ? 'var(--color-primary)' : 'rgba(128,128,128,0.15)', border: 'none', borderRadius: 4, padding: '2px 10px', cursor: 'pointer', color: lineHeight === lh ? 'white' : theme.text, fontSize: 12 }}>
                                {lh}×
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {Object.entries(BG_THEMES).map(([key, t]) => (
                            <button key={key} onClick={() => setBg(key)} style={{ background: t.bg, border: `2px solid ${bg === key ? 'var(--color-primary)' : 'rgba(128,128,128,0.3)'}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: t.text, fontSize: 11, fontWeight: bg === key ? 700 : 400 }}>
                                {t.name}
                            </button>
                        ))}
                    </div>
                    <span style={{ fontSize: 11, opacity: 0.4 }}>Esc to exit · +/- for font</span>
                </div>
            )}

            {/* Reading area */}
            <div id="zen-reader" style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: 680, width: '100%', padding: '48px 32px' }}>
                    <h1 style={{ fontSize: fontSize * 1.5, fontWeight: 700, lineHeight: 1.3, marginBottom: 32, color: theme.text }}>{title}</h1>
                    <div
                        style={{ fontSize, lineHeight, color: theme.text }}
                        className="rendered-content ql-editor"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ZenMode;
