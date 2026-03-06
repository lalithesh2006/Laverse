import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
    { keys: ['Ctrl', 'K'], desc: 'Open search' },
    { keys: ['Ctrl', '/'], desc: 'Keyboard shortcuts' },
    { keys: ['Esc'], desc: 'Close modals' },
    { keys: ['Ctrl', 'Enter'], desc: 'Publish / Submit' },
    { keys: ['Alt', 'N'], desc: 'New story' },
    { keys: ['Alt', 'H'], desc: 'Go home' },
    { keys: ['Alt', 'D'], desc: 'Go to dashboard' },
];

const KeyboardShortcuts = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="shortcuts-overlay" onClick={onClose}>
            <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
                <div className="shortcuts-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Keyboard size={22} />
                        <h3>Keyboard Shortcuts</h3>
                    </div>
                    <button className="shortcuts-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="shortcuts-list">
                    {SHORTCUTS.map((s, i) => (
                        <div key={i} className="shortcut-row">
                            <span className="shortcut-desc">{s.desc}</span>
                            <div className="shortcut-keys">
                                {s.keys.map((k, j) => (
                                    <span key={j}>
                                        <kbd className="shortcut-kbd">{k}</kbd>
                                        {j < s.keys.length - 1 && <span className="shortcut-plus">+</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="shortcuts-footer">
                    <p>Press <kbd>Ctrl</kbd> + <kbd>/</kbd> anytime to toggle this panel</p>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcuts;
