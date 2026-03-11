import { useState, useEffect } from 'react';
import { BookMarked, Trophy, Search, Trash2, ChevronDown, ChevronUp, RefreshCw, Volume2 } from 'lucide-react';

/**
 * VocabBuilder — personal vocabulary list.
 * Words are saved from WordLookup. This component lets you review,
 * quiz yourself, and delete words you've mastered.
 */
const VocabBuilder = () => {
    const [words, setWords] = useState([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [quizMode, setQuizMode] = useState(false);
    const [quizWord, setQuizWord] = useState(null);
    const [quizRevealed, setQuizRevealed] = useState(false);
    const [quizIndex, setQuizIndex] = useState(0);

    useEffect(() => {
        load();
        // Also listen for storage changes (from WordLookup saving a word)
        window.addEventListener('storage', load);
        return () => window.removeEventListener('storage', load);
    }, []);

    // Poll every 2s to catch new words added from WordLookup
    useEffect(() => {
        if (!open) return;
        const interval = setInterval(load, 2000);
        return () => clearInterval(interval);
    }, [open]);

    const load = () => {
        const saved = JSON.parse(localStorage.getItem('laverse_vocab') || '[]');
        setWords(saved);
    };

    const deleteWord = (word) => {
        const updated = words.filter(w => w.word !== word);
        localStorage.setItem('laverse_vocab', JSON.stringify(updated));
        setWords(updated);
    };

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
    };

    const startQuiz = () => {
        if (words.length < 2) return;
        setQuizMode(true);
        setQuizIndex(0);
        setQuizWord(words[Math.floor(Math.random() * words.length)]);
        setQuizRevealed(false);
    };

    const nextQuizWord = (knew) => {
        // Track score in localStorage
        const scores = JSON.parse(localStorage.getItem('laverse_vocab_scores') || '{}');
        if (quizWord) {
            scores[quizWord.word] = (scores[quizWord.word] || 0) + (knew ? 1 : -1);
            localStorage.setItem('laverse_vocab_scores', JSON.stringify(scores));
        }
        const remaining = words.filter(w => w.word !== quizWord?.word);
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        if (!next) { setQuizMode(false); return; }
        setQuizWord(next);
        setQuizRevealed(false);
        setQuizIndex(i => i + 1);
    };

    const filtered = words.filter(w =>
        w.word.toLowerCase().includes(search.toLowerCase()) ||
        w.definition?.toLowerCase().includes(search.toLowerCase())
    );

    if (words.length === 0 && !open) return null;

    return (
        <div style={{ border: '1px solid var(--border-color)', borderRadius: 16, background: 'var(--bg-secondary)', marginBottom: 24, overflow: 'hidden' }}>
            <button onClick={() => { setOpen(!open); if (!open) load(); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BookMarked size={18} style={{ color: '#C3A6FF' }} />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>My Vocabulary</span>
                    {words.length > 0 && (
                        <span style={{ background: '#C3A6FF', color: 'white', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                            {words.length} words
                        </span>
                    )}
                </div>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
                <div style={{ padding: '0 20px 20px' }}>
                    {quizMode && quizWord ? (
                        // Quiz Mode
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>VOCAB QUIZ · Word {quizIndex + 1}</p>
                            <h3 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{quizWord.word}</h3>
                            {quizWord.partOfSpeech && <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{quizWord.partOfSpeech}</span>}
                            <button onClick={() => speak(quizWord.word)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', marginLeft: 8 }}>
                                <Volume2 size={14} />
                            </button>

                            {!quizRevealed ? (
                                <button onClick={() => setQuizRevealed(true)} style={{
                                    marginTop: 20, display: 'block', width: '100%', padding: '12px',
                                    background: 'var(--primary-color)', color: 'white', border: 'none',
                                    borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 600
                                }}>
                                    Reveal Definition
                                </button>
                            ) : (
                                <div style={{ marginTop: 16 }}>
                                    <p style={{
                                        fontSize: 14, color: 'var(--text-color)', lineHeight: 1.6,
                                        padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: 10, marginBottom: 16
                                    }}>
                                        {quizWord.definition}
                                    </p>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button onClick={() => nextQuizWord(false)} style={{ flex: 1, padding: '10px', background: '#FF6B6B22', color: '#FF6B6B', border: '1px solid #FF6B6B', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
                                            😓 Didn't Know
                                        </button>
                                        <button onClick={() => nextQuizWord(true)} style={{ flex: 1, padding: '10px', background: '#4ECDC422', color: '#4ECDC4', border: '1px solid #4ECDC4', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
                                            ✓ Got it!
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button onClick={() => setQuizMode(false)} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
                                Exit Quiz
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input type="text" placeholder="Search your vocab..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 30px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-color)', fontSize: 13, boxSizing: 'border-box' }} />
                                </div>
                                {words.length >= 2 && (
                                    <button onClick={startQuiz} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#C3A6FF', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        <Trophy size={14} /> Quiz Me
                                    </button>
                                )}
                            </div>

                            {words.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center' }}>
                                    Double-click any word while reading → click "Save to Vocab" to build your list!
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
                                    {filtered.map(entry => (
                                        <div key={entry.word} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'var(--bg-primary)', borderRadius: 10 }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                    <span style={{ fontWeight: 700, fontSize: 15 }}>{entry.word}</span>
                                                    {entry.partOfSpeech && <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{entry.partOfSpeech}</span>}
                                                    <button onClick={() => speak(entry.word)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}>
                                                        <Volume2 size={12} />
                                                    </button>
                                                </div>
                                                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>{entry.definition}</p>
                                            </div>
                                            <button onClick={() => deleteWord(entry.word)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, flexShrink: 0 }}>
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default VocabBuilder;
