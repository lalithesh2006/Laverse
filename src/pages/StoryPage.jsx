import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { estimateReadTime } from '../lib/utils';
import { ArrowLeft, Clock, Eye, BookOpen, Tag, Trash2, Highlighter, Twitter } from 'lucide-react';
import Comments from '../components/Comments';
import LikeButton from '../components/LikeButton';
import BookmarkButton from '../components/BookmarkButton';
import ShareButtons from '../components/ShareButtons';
import RelatedPosts from '../components/RelatedPosts';
import TableOfContents from '../components/TableOfContents';
import ReadingToolbar from '../components/ReadingToolbar';
import TextToSpeech from '../components/TextToSpeech';
import FollowButton from '../components/FollowButton';
import TipAuthorLink from '../components/TipAuthorLink';
import ReadingProgressBar from '../components/ReadingProgressBar';
import EmojiReactions from '../components/EmojiReactions';
import { trackReading } from '../components/ReadingHistory';
import WordLookup from '../components/WordLookup';
import StoryNotes from '../components/StoryNotes';
import StoryInsights from '../components/StoryInsights';
import VocabBuilder from '../components/VocabBuilder';
import ZenMode from '../components/ZenMode';
import SmartQuotes from '../components/SmartQuotes';

const StoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const storyBodyRef = useRef(null);

    // Text Highlighting State
    const [selectionRect, setSelectionRect] = useState(null);
    const [selectedText, setSelectedText] = useState('');
    const [highlights, setHighlights] = useState([]); // Array of { id, text, rect, top, left, width, height }

    // Highlight Tooltip positioning
    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
                setSelectionRect(null);
                setSelectedText('');
                return;
            }

            const text = selection.toString().trim();
            if (!text || text.length < 3) {
                setSelectionRect(null);
                setSelectedText('');
                return;
            }

            // check if selection is inside .story-body
            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer;
            if (container.nodeType === Node.TEXT_NODE ? !container.parentElement.closest('.story-body') : !container.closest('.story-body')) {
                setSelectionRect(null);
                return;
            }

            const rect = range.getBoundingClientRect();
            setSelectionRect({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            });
            setSelectedText(text);
        };

        document.addEventListener('mouseup', handleSelection);
        return () => document.removeEventListener('mouseup', handleSelection);
    }, []);

    const handleApplyHighlight = () => {
        if (!selectionRect || !selectedText) return;

        // Save the highlight to our local array just for session visual
        const newHighlight = {
            id: Date.now(),
            text: selectedText,
            ...selectionRect
        };
        setHighlights(prev => [...prev, newHighlight]);

        // Clear selection
        window.getSelection()?.removeAllRanges();
        setSelectionRect(null);
        setSelectedText('');
    };

    const handleShareHighlight = () => {
        if (!selectedText) return;
        const text = encodeURIComponent(`"${selectedText}" — via La'verse`);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        window.getSelection()?.removeAllRanges();
        setSelectionRect(null);
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (post) {
            document.title = `${post.title} — La'verse`;
        }
        return () => { document.title = "La'verse"; };
    }, [post]);

    const fetchPost = async () => {
        try {
            const data = await api.posts.getPost(id);
            if (!data) throw new Error("Story not found");

            setPost(data);
            setAuthor(data.author_id);
            setTags([]); // Custom API currently doesn't fetch tags in this implementation

            trackReading(data);
        } catch (err) {
            console.error('Error fetching post:', err);
            setError(err?.message || 'Story not found.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="story-page-loading">
                <div className="spinner"></div>
                <p>Loading story...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="story-page-error">
                <BookOpen size={48} />
                <h2>{error || 'Story not found'}</h2>
                <p>This story may have been removed or doesn't exist.</p>
                <Link to="/" className="btn-primary"><ArrowLeft size={16} /> Back to Home</Link>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.posts.delete(post._id);
            navigate('/');
        } catch (err) {
            alert('Failed to delete post: ' + err.message);
        }
    };

    return (
        <div className="story-page">
            <ReadingProgressBar />
            {post.cover_image && (
                <div className="story-hero">
                    <img src={post.cover_image} alt={post.title} />
                    <div className="story-hero-overlay" />
                </div>
            )}

            <div className="story-page-content container">
                <div className="story-nav-bar">
                    <button className="btn-back-story" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="story-nav-actions">
                        {(user?.id === post.author_id?._id?.toString() || user?.id === post.author_id?.toString() || profile?.is_admin) && (
                            <button onClick={handleDelete} className="btn-icon btn-danger" title="Delete Post">
                                <Trash2 size={18} />
                            </button>
                        )}
                        <ZenMode title={post.title} content={post.content} />
                        <BookmarkButton postId={post._id} />
                        <LikeButton postId={post._id} />
                        <ShareButtons title={post.title} />
                    </div>
                </div>

                <article className="story-article">
                    <header className="story-article-header">
                        <span className="story-category-badge">{post.category}</span>
                        <h1>{post.title}</h1>

                        <div className="story-article-meta">
                            <div className="story-author-info">
                                <div className="story-author-avatar">
                                    {author?.avatar_url ? (
                                        <img src={author.avatar_url} alt={author.full_name} />
                                    ) : (
                                        <div className="avatar-fallback-sm">
                                            {(author?.full_name || 'A')[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="story-author-name">{author?.full_name || 'Anonymous'}</span>
                                        {author && <FollowButton authorId={post.author_id} />}
                                    </div>
                                    {author?.username && <span className="story-author-handle">@{author.username}</span>}
                                </div>
                            </div>
                            <div className="story-meta-right">
                                <span className="story-date">
                                    <Clock size={14} />
                                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="meta-dot">·</span>
                                <span className="story-read-time">{estimateReadTime(post.content)}</span>
                                <span className="meta-dot">·</span>
                                <span className="story-reads-count"><Eye size={14} /> {post.reads || 0}</span>
                            </div>
                        </div>
                    </header>

                    {post.excerpt && <p className="story-excerpt-display">{post.excerpt}</p>}

                    <TextToSpeech text={post.content} title={post.title} />
                    <ReadingToolbar title={post.title} content={post.content} />
                    <TableOfContents content={post.content} />

                    <div
                        ref={storyBodyRef}
                        className="story-body rendered-content ql-editor"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        style={{ position: 'relative' }}
                    />
                    {/* AI: Word Lookup Panel — attached to story body */}
                    <WordLookup containerRef={storyBodyRef} />

                    {/* Visual Overlays for Highlights */}
                    {highlights.map(h => (
                        <div key={h.id} style={{
                            position: 'absolute',
                            top: h.top,
                            left: h.left,
                            width: h.width,
                            height: h.height,
                            backgroundColor: 'rgba(255, 204, 0, 0.3)',
                            pointerEvents: 'none',
                            zIndex: 1,
                            borderRadius: '2px'
                        }} />
                    ))}

                    {/* Popover for selected text */}
                    {selectionRect && selectedText && (
                        <div style={{
                            position: 'absolute',
                            top: selectionRect.top - 40,
                            left: selectionRect.left + (selectionRect.width / 2) - 60,
                            backgroundColor: 'var(--bg-secondary)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            borderRadius: '8px',
                            padding: '4px 8px',
                            display: 'flex',
                            gap: '8px',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s ease-out'
                        }}>
                            <button onClick={handleApplyHighlight} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-color)', fontSize: '12px', fontWeight: 500, padding: '4px' }}>
                                <Highlighter size={14} style={{ color: '#FFB800' }} /> Highlight
                            </button>
                            <div style={{ width: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                            <button onClick={handleShareHighlight} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-color)', fontSize: '12px', fontWeight: 500, padding: '4px' }}>
                                <Twitter size={14} style={{ color: '#1DA1F2' }} /> Share
                            </button>

                            {/* Tooltip arrow */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-4px',
                                left: '50%',
                                transform: 'translateX(-50%) rotate(45deg)',
                                width: '8px',
                                height: '8px',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRight: '1px solid rgba(0,0,0,0.05)',
                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                            }} />
                        </div>
                    )}

                    {tags.length > 0 && (
                        <div className="story-tags">
                            <Tag size={16} />
                            {tags.map(tag => (
                                <span key={tag.slug} className="story-tag">{tag.name}</span>
                            ))}
                        </div>
                    )}

                    <div className="story-engagement-bar">
                        <LikeButton postId={post._id} />
                        <BookmarkButton postId={post._id} />
                        <ShareButtons title={post.title} />
                    </div>

                    <EmojiReactions postId={post._id} />

                    {author?.tip_link && (
                        <TipAuthorLink tipLink={author.tip_link} authorName={author.full_name || author.username} />
                    )}
                </article>

                {/* AI FEATURES PANEL */}
                <div className="ai-features-panel">
                    <StoryInsights content={post.content} title={post.title} />
                    <SmartQuotes content={post.content} title={post.title} author={author?.full_name || author?.username} />
                    <StoryNotes postId={post._id} postTitle={post.title} />
                    <VocabBuilder />
                </div>

                {author && (
                    <div className="story-author-card">
                        <div className="author-card-avatar">
                            {author.avatar_url ? (
                                <img src={author.avatar_url} alt={author.full_name} />
                            ) : (
                                <div className="avatar-fallback-lg">
                                    {(author.full_name || 'A')[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="author-card-info" style={{ flexGrow: 1 }}>
                            <span className="author-card-label">Written by</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3>{author.full_name || author.username}</h3>
                                <FollowButton authorId={post.author_id} />
                            </div>
                            {author.bio && <p>{author.bio}</p>}
                        </div>
                    </div>
                )}

                <RelatedPosts currentPostId={post._id} category={post.category} tags={tags.map(t => t.name)} />
                <Comments postId={post._id} />
            </div>
        </div>
    );
};

export default StoryPage;
