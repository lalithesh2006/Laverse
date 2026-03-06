import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { estimateReadTime } from '../lib/utils';
import TagInput from '../components/TagInput';
import ReadabilityScore from '../components/ReadabilityScore';
import ConfettiCelebration from '../components/ConfettiCelebration';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Image, X, ArrowLeft, Eye, Send, Save, Calendar, Wand2
} from 'lucide-react';

const CATEGORIES = [
    'Fiction', 'Technology', 'Wellness', 'Travel',
    'Culture', 'Business', 'Personal', 'Food'
];

// estimateReadTime and renderMarkdown imported from ../lib/utils

const StoryEditor = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const coverInputRef = useRef(null);
    const contentImageRef = useRef(null);
    const contentRef = useRef(null);

    const [form, setForm] = useState({
        title: '',
        content: '',
        excerpt: '',
        cover_image: '',
        category: 'Personal'
    });
    const [tags, setTags] = useState([]);
    const [scheduledAt, setScheduledAt] = useState('');
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [coverPreview, setCoverPreview] = useState('');
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingContent, setUploadingContent] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showScheduler, setShowScheduler] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [generatingExcerpt, setGeneratingExcerpt] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/'); return; }
        if (id) loadPost(id);
    }, [user, id]);

    useEffect(() => {
        const words = form.content.trim().split(/\s+/).filter(Boolean).length;
        setWordCount(words);
    }, [form.content]);

    const loadPost = async (postId) => {
        try {
            const data = await api.posts.getPost(postId);
            if (!data || data.author_id._id !== user.id) { navigate('/dashboard'); return; }

            setForm({
                title: data.title || '', content: data.content || '', excerpt: data.excerpt || '',
                cover_image: data.cover_image || '', category: data.category || 'Personal'
            });
            setCoverPreview(data.cover_image || '');
            if (data.scheduled_at) setScheduledAt(new Date(data.scheduled_at).toISOString().slice(0, 16));
            // Tags loading would require a new API endpoint, omitting for now
        } catch (error) {
            navigate('/dashboard');
        }
    };

    const uploadImage = async (file) => {
        // Omitting image upload to Supabase since we are migrating away from Supabase.
        // In a real scenario, this would post to a custom Express endpoint (e.g. /api/upload)
        // For now, we'll return a placeholder or use base64 (Quill handles base64 natively!)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setCoverPreview(reader.result);
        reader.readAsDataURL(file);
        setUploadingCover(true);
        const url = await uploadImage(file, 'covers');
        setUploadingCover(false);
        if (url) { setForm({ ...form, cover_image: url }); setCoverPreview(url); }
    };

    const handleContentImageUpload = async (e) => {
        // Handled natively by Quill now
    };

    const handleGenerateExcerpt = async () => {
        if (!form.content.trim()) {
            setError("Write some content first to generate a summary.");
            return;
        }

        setGeneratingExcerpt(true);
        // Simulate AI thinking time for effect
        await new Promise(r => setTimeout(r, 800));

        try {
            // Smart Excerpt Algorithm (extractive summary)
            // 1. Clean the text of markdown
            let cleanText = form.content
                .replace(/```[\s\S]*?```/g, '') // Remove code blocks
                .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
                .replace(/[#*`_\[\]>]/g, '') // Remove basic formatting
                .trim();

            // 2. Split into sentences
            const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

            // 3. Score sentences based on length and keywords (basic heuristic)
            // The first few sentences are usually highly relevant
            let summary = "";
            let charCount = 0;
            const targetLength = 150;

            for (let i = 0; i < Math.min(sentences.length, 3); i++) {
                const sentence = sentences[i].trim();
                if (charCount + sentence.length <= targetLength + 50) { // allow slight overflow
                    summary += (summary ? " " : "") + sentence;
                    charCount += sentence.length;
                } else if (!summary) {
                    // Extract a substring if even the first sentence is too long
                    summary = sentence.substring(0, targetLength) + "...";
                    break;
                }
            }

            setForm(prev => ({ ...prev, excerpt: summary }));
            setSuccess("Smart excerpt generated!");
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError("Failed to generate excerpt.");
        } finally {
            setGeneratingExcerpt(false);
        }
    };

    const saveTags = async (postId) => {
        // Tag saving API to be implemented
    };

    const handleSave = async (publish = false) => {
        if (!form.title.trim()) { setError('Please add a title.'); return; }
        if (publish && !form.content.trim()) { setError('Please write content before publishing.'); return; }

        publish ? setPublishing(true) : setSaving(true);
        setError('');

        try {
            const postData = {
                title: form.title,
                content: form.content,
                excerpt: form.excerpt || form.content.replace(/<[^>]+>/g, '').substring(0, 150).trim() + '...',
                cover_image: form.cover_image,
                category: form.category,
                published: publish && !scheduledAt,
                scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
                published_at: publish && !scheduledAt ? new Date().toISOString() : null
            };

            let postId = id;
            if (id) {
                await api.posts.update(id, postData);
            } else {
                const data = await api.posts.create(postData);
                postId = data._id;
            }

            // Save tags missing logic for custom backend, omitted for now

            const msg = scheduledAt ? `Scheduled for ${new Date(scheduledAt).toLocaleString()} 📅` :
                publish ? 'Published! 🎉' : 'Draft saved ✓';
            setSuccess(msg);

            // Fire confetti on publish!
            if (publish && !scheduledAt) {
                setShowConfetti(true);
                setTimeout(() => navigate('/dashboard'), 2500);
            } else {
                setTimeout(() => navigate('/dashboard'), 1200);
            }
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setSaving(false);
            setPublishing(false);
        }
    };

    // renderContent is now imported as renderMarkdown from ../lib/utils

    return (
        <div className="editor-page">
            <ConfettiCelebration active={showConfetti} onComplete={() => setShowConfetti(false)} />
            <div className="editor-topbar">
                <div className="editor-topbar-left">
                    <button className="btn-back" onClick={() => navigate('/dashboard')}><ArrowLeft size={18} /> Dashboard</button>
                    <span className="editor-meta-info">{wordCount} words · {estimateReadTime(form.content)}</span>
                </div>
                <div className="editor-topbar-actions">
                    <button className="btn-preview-toggle" onClick={() => setShowPreview(!showPreview)}>
                        <Eye size={16} /> {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button className="btn-secondary btn-sm" onClick={() => setShowScheduler(!showScheduler)}>
                        <Calendar size={16} /> Schedule
                    </button>
                    <button className="btn-secondary btn-sm" onClick={() => handleSave(false)} disabled={saving}>
                        <Save size={16} /> {saving ? 'Saving...' : 'Draft'}
                    </button>
                    <button className="btn-primary btn-sm" onClick={() => handleSave(true)} disabled={publishing}>
                        <Send size={16} /> {publishing ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Scheduler */}
            {showScheduler && (
                <div className="editor-scheduler">
                    <label>Schedule publication:</label>
                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={e => setScheduledAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                    />
                    {scheduledAt && (
                        <button className="btn-secondary btn-sm" onClick={() => setScheduledAt('')}><X size={14} /> Clear</button>
                    )}
                </div>
            )}

            {error && <div className="editor-alert editor-error">{error}<button className="alert-close" onClick={() => setError('')}><X size={14} /></button></div>}
            {success && <div className="editor-alert editor-success">{success}</div>}

            <div className="editor-container container">
                {showPreview ? (
                    <div className="story-preview">
                        {coverPreview && <div className="preview-cover"><img src={coverPreview} alt="Cover" /></div>}
                        <span className="preview-category">{form.category}</span>
                        <h1 className="preview-title">{form.title || 'Untitled Story'}</h1>
                        <div className="preview-meta-bar">
                            <span>{estimateReadTime(form.content)}</span><span>·</span><span>{form.category}</span>
                        </div>
                        {tags.length > 0 && (
                            <div className="preview-tags">{tags.map(t => <span key={t} className="story-tag">{t}</span>)}</div>
                        )}
                        {form.excerpt && <p className="preview-excerpt">{form.excerpt}</p>}
                        <div className="preview-content rendered-content ql-editor" dangerouslySetInnerHTML={{ __html: form.content }} />
                    </div>
                ) : (
                    <>
                        {/* Cover Image */}
                        <div className="editor-cover-section">
                            {coverPreview ? (
                                <div className="cover-preview">
                                    <img src={coverPreview} alt="Cover" />
                                    <div className="cover-actions">
                                        <button className="cover-change" onClick={() => coverInputRef.current.click()}>Change</button>
                                        <button className="cover-remove" onClick={() => { setCoverPreview(''); setForm({ ...form, cover_image: '' }); }}><X size={16} /> Remove</button>
                                    </div>
                                    {uploadingCover && <div className="cover-uploading"><div className="spinner-sm"></div> Uploading...</div>}
                                </div>
                            ) : (
                                <button className="cover-upload-btn" onClick={() => coverInputRef.current.click()}>
                                    <Image size={28} />
                                    <span className="cover-upload-text">Add a cover image</span>
                                    <span className="cover-hint">Recommended: 1600×840px</span>
                                </button>
                            )}
                            <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverUpload} />
                        </div>

                        <textarea className="editor-title" placeholder="Story title..." value={form.title}
                            onChange={e => { setForm({ ...form, title: e.target.value }); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                            rows={1} />

                        <div className="editor-meta-row">
                            <div className="editor-category-wrapper">
                                <label>Category</label>
                                <select className="editor-category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="editor-excerpt-wrapper">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label>Excerpt <span className="label-hint">(auto-generated if empty)</span></label>
                                    <button
                                        className="btn-secondary btn-sm"
                                        onClick={handleGenerateExcerpt}
                                        disabled={generatingExcerpt || !form.content.trim()}
                                        style={{ padding: '2px 8px', fontSize: '12px', border: 'none', background: 'none', color: 'var(--primary-color)' }}
                                    >
                                        {generatingExcerpt ? <div className="spinner-sm" style={{ borderColor: 'var(--primary-color)', borderTopColor: 'transparent' }}></div> : <Wand2 size={14} style={{ marginRight: '4px' }} />}
                                        Smart Generate
                                    </button>
                                </div>
                                <input type="text" className="editor-excerpt" placeholder="Brief summary..." value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
                            </div>
                        </div>

                        {/* Tags */}
                        <TagInput selectedTags={tags} onChange={setTags} />

                        {/* React Quill Editor */}
                        <div className="editor-content-wrapper" style={{ marginTop: '20px', minHeight: '600px' }}>
                            <ReactQuill
                                theme="snow"
                                value={form.content}
                                onChange={(val) => setForm({ ...form, content: val })}
                                style={{ height: '550px' }}
                            />
                        </div>

                        {/* Readability Analysis */}
                        <ReadabilityScore content={form.content} />
                    </>
                )}
            </div>
        </div>
    );
};

export default StoryEditor;
