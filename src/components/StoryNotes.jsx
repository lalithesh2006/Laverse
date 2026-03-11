import { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, X, ChevronDown, ChevronUp, Save, Clock } from 'lucide-react';
import { timeAgo } from '../lib/utils';

/**
 * StoryNotes — personal notes per story, stored in localStorage.
 * Each story gets its own note collection, searchable and timestamped.
 */
const StoryNotes = ({ postId, postTitle }) => {
    const key = `laverse_notes_${postId}`;
    const [notes, setNotes] = useState([]);
    const [open, setOpen] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [search, setSearch] = useState('');
    const [highlight, setHighlight] = useState('');

    // HIGHLIGHT COLORS
    const COLORS = ['#FFB800', '#FF6B6B', '#4ECDC4', '#A8E6CF', '#C3A6FF', '#FFD700'];
    const [selColor, setSelColor] = useState(COLORS[0]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        setNotes(saved);
    }, [postId]);

    const save = (updated) => {
        setNotes(updated);
        localStorage.setItem(key, JSON.stringify(updated));
    };

    const addNote = () => {
        const text = newNote.trim();
        if (!text) return;
        const note = {
            id: Date.now().toString(),
            text,
            color: selColor,
            highlight: highlight.trim(),
            createdAt: new Date().toISOString(),
        };
        save([note, ...notes]);
        setNewNote('');
        setHighlight('');
    };

    const deleteNote = (id) => save(notes.filter(n => n.id !== id));

    const startEdit = (n) => { setEditingId(n.id); setEditText(n.text); };

    const saveEdit = (id) => {
        save(notes.map(n => n.id === id ? { ...n, text: editText, updatedAt: new Date().toISOString() } : n));
        setEditingId(null);
    };

    const filtered = notes.filter(n =>
        n.text.toLowerCase().includes(search.toLowerCase()) ||
        n.highlight?.toLowerCase().includes(search.toLowerCase())
    );

    const totalNotes = notes.length;

    return (
        <div className="story-notes-widget" style={{
            border: '1px solid var(--color-border)', borderRadius: 16,
            background: 'var(--color-white)', marginBottom: 24, overflow: 'hidden'
        }}>
            <button onClick={() => setOpen(!open)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-text-primary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StickyNote size={18} style={{ color: '#FFB800' }} />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>My Notes</span>
                    {totalNotes > 0 && (
                        <span style={{ background: 'var(--color-primary)', color: 'white', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                            {totalNotes}
                        </span>
                    )}
                </div>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
                <div style={{ padding: '0 20px 20px' }}>
                    {/* New note input */}
                    <div style={{ marginBottom: 16 }}>
                        <input
                            type="text"
                            placeholder="Highlighted text (optional)..."
                            value={highlight}
                            onChange={e => setHighlight(e.target.value)}
                            style={{
                                width: '100%', padding: '8px 12px', borderRadius: 8, marginBottom: 8,
                                border: '1px solid var(--color-border)', background: 'var(--color-background)',
                                color: 'var(--color-text-primary)', fontSize: 13, fontStyle: 'italic'
                            }}
                        />
                        <div style={{ position: 'relative' }}>
                            <textarea
                                placeholder="Write your note..."
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                                rows={3}
                                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) addNote(); }}
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: 8,
                                    border: '1px solid var(--color-border)', background: 'var(--color-background)',
                                    color: 'var(--color-text-primary)', fontSize: 14, resize: 'vertical', boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Color:</span>
                            {COLORS.map(c => (
                                <button key={c} onClick={() => setSelColor(c)} style={{
                                    width: 18, height: 18, borderRadius: '50%', background: c, border: selColor === c ? '2px solid var(--color-text-primary)' : '2px solid transparent', cursor: 'pointer', padding: 0
                                }} />
                            ))}
                            <button onClick={addNote} disabled={!newNote.trim()} style={{
                                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
                                background: 'var(--color-primary)', color: 'white', border: 'none',
                                borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600
                            }}>
                                <Plus size={14} /> Add Note <span style={{ fontSize: 10, opacity: 0.7 }}>(Ctrl+↵)</span>
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    {notes.length > 2 && (
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '8px 12px', borderRadius: 8, marginBottom: 12,
                                border: '1px solid var(--color-border)', background: 'var(--color-background)',
                                color: 'var(--color-text-primary)', fontSize: 13, boxSizing: 'border-box'
                            }}
                        />
                    )}

                    {/* Notes list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto' }}>
                        {filtered.length === 0 && (
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
                                {notes.length === 0 ? 'No notes yet. Start taking notes as you read!' : 'No notes match your search.'}
                            </p>
                        )}
                        {filtered.map(note => (
                            <div key={note.id} style={{
                                background: 'var(--color-background)', borderRadius: 10, padding: '12px 14px',
                                borderLeft: `4px solid ${note.color}`, position: 'relative'
                            }}>
                                {note.highlight && (
                                    <p style={{
                                        fontSize: 12, fontStyle: 'italic', color: 'var(--color-text-secondary)',
                                        background: `${note.color}22`, borderRadius: 4, padding: '3px 8px',
                                        marginBottom: 6
                                    }}>
                                        📌 "{note.highlight}"
                                    </p>
                                )}
                                {editingId === note.id ? (
                                    <div>
                                        <textarea
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                            rows={3}
                                            style={{ width: '100%', padding: '6px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-white)', color: 'var(--color-text-primary)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
                                        />
                                        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                                            <button onClick={() => saveEdit(note.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>
                                                <Save size={12} /> Save
                                            </button>
                                            <button onClick={() => setEditingId(null)} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: 'var(--color-text-secondary)' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p onClick={() => startEdit(note)} style={{ fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.5, margin: 0, cursor: 'text', whiteSpace: 'pre-wrap' }}>{note.text}</p>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                    <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Clock size={10} /> {timeAgo(note.updatedAt || note.createdAt)}
                                        {note.updatedAt && ' (edited)'}
                                    </span>
                                    <button onClick={() => deleteNote(note.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 2 }}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryNotes;
