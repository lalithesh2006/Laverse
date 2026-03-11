import { useState, useEffect, useCallback } from 'react';
import { BookOpen, X, Volume2, Star, Plus, Loader, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * WordLookup — floating dictionary panel.
 * Double-click any word inside .story-body to look it up.
 * Uses the FREE dictionaryapi.dev — no API key required.
 */
const WordLookup = ({ containerRef }) => {
    const [word, setWord] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [visible, setVisible] = useState(false);
    const [expandMeanings, setExpandMeanings] = useState(false);

    const lookup = useCallback(async (w, x, y) => {
        const clean = w.toLowerCase().replace(/[^a-z'-]/g, '');
        if (!clean || clean.length < 2) return;
        setWord(clean);
        setVisible(true);
        setLoading(true);
        setError('');
        setData(null);
        setExpandMeanings(false);
        setPosition({ top: y + 20, left: Math.min(x, window.innerWidth - 340) });

        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clean}`);
            if (!res.ok) throw new Error('Word not found');
            const json = await res.json();
            setData(json[0]);
        } catch {
            setError(`No definition found for "${clean}"`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const el = containerRef?.current;
        if (!el) return;

        const handleDblClick = (e) => {
            const selection = window.getSelection();
            const w = selection?.toString().trim().split(/\s+/)[0] || '';
            if (w.length > 1) {
                lookup(w, e.clientX + window.scrollX, e.clientY + window.scrollY);
            }
        };

        el.addEventListener('dblclick', handleDblClick);
        return () => el.removeEventListener('dblclick', handleDblClick);
    }, [containerRef, lookup]);

    const speak = (text) => {
        if (!text || !window.speechSynthesis) return;
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
    };

    const saveToVocab = () => {
        if (!data) return;
        const firstMeaning = data.meanings?.[0];
        const def = firstMeaning?.definitions?.[0]?.definition || '';
        const saved = JSON.parse(localStorage.getItem('laverse_vocab') || '[]');
        if (!saved.find(v => v.word === word)) {
            saved.unshift({ word, partOfSpeech: firstMeaning?.partOfSpeech || '', definition: def, savedAt: new Date().toISOString() });
            localStorage.setItem('laverse_vocab', JSON.stringify(saved.slice(0, 200)));
        }
        const btn = document.getElementById('vocab-save-btn');
        if (btn) { btn.textContent = '✓ Saved!'; setTimeout(() => { if (btn) btn.textContent = '+ Save to Vocab'; }, 2000); }
    };

    if (!visible) return null;

    const phonetic = data?.phonetics?.find(p => p.text)?.text || data?.phonetic || '';
    const audioUrl = data?.phonetics?.find(p => p.audio)?.audio || '';
    const meanings = data?.meanings || [];
    const shownMeanings = expandMeanings ? meanings : meanings.slice(0, 2);

    return (
        <div style={{
            position: 'absolute', top: position.top, left: position.left,
            width: 320, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', zIndex: 9999,
            padding: '20px 20px 16px', fontFamily: 'inherit'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BookOpen size={16} style={{ color: 'var(--primary-color)' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-secondary)' }}>Dictionary</span>
                </div>
                <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 2 }}>
                    <X size={16} />
                </button>
            </div>

            {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', padding: '12px 0' }}>
                    <Loader size={16} className="spinner" /> Looking up <strong>"{word}"</strong>…
                </div>
            )}

            {error && (
                <div style={{ color: 'var(--text-secondary)', fontSize: 14, padding: '8px 0' }}>
                    <span style={{ fontSize: 24 }}>🔍</span>
                    <p style={{ marginTop: 6 }}>{error}</p>
                    <p style={{ fontSize: 12, marginTop: 4 }}>Try double-clicking a single English word.</p>
                </div>
            )}

            {data && !loading && (
                <>
                    <div style={{ marginBottom: 12 }}>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-color)', margin: 0 }}>{data.word}</h3>
                        {phonetic && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{phonetic}</span>
                                {audioUrl && (
                                    <button onClick={() => { const a = new Audio(audioUrl); a.play(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', padding: 2 }} title="Play pronunciation">
                                        <Volume2 size={14} />
                                    </button>
                                )}
                                <button onClick={() => speak(data.word)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 2 }} title="Speak">
                                    <Volume2 size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 12 }}>
                        {shownMeanings.map((m, i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <span style={{ display: 'inline-block', padding: '2px 8px', background: 'var(--primary-color)', color: 'white', borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                                    {m.partOfSpeech}
                                </span>
                                {m.definitions.slice(0, 2).map((d, j) => (
                                    <div key={j} style={{ marginBottom: 6 }}>
                                        <p style={{ fontSize: 13, color: 'var(--text-color)', lineHeight: 1.5, margin: 0 }}>{j + 1}. {d.definition}</p>
                                        {d.example && <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', margin: '4px 0 0', paddingLeft: 12, borderLeft: '2px solid var(--border-color)' }}>"{d.example}"</p>}
                                    </div>
                                ))}
                                {m.synonyms?.length > 0 && (
                                    <div style={{ marginTop: 4 }}>
                                        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Synonyms: </span>
                                        <span style={{ fontSize: 11, color: 'var(--primary-color)' }}>{m.synonyms.slice(0, 5).join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {meanings.length > 2 && (
                            <button onClick={() => setExpandMeanings(!expandMeanings)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
                                {expandMeanings ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                {expandMeanings ? 'Show less' : `+${meanings.length - 2} more meanings`}
                            </button>
                        )}
                    </div>

                    <button id="vocab-save-btn" onClick={saveToVocab} style={{
                        display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 12px',
                        cursor: 'pointer', fontSize: 12, color: 'var(--text-color)', fontWeight: 500, width: '100%', justifyContent: 'center'
                    }}>
                        <Plus size={12} /> Save to Vocab
                    </button>
                </>
            )}
        </div>
    );
};

export default WordLookup;
