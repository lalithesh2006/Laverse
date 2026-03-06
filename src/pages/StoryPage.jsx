import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { renderMarkdown, estimateReadTime } from '../lib/utils';
import { ArrowLeft, Clock, Eye, BookOpen, Tag, Trash2 } from 'lucide-react';
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

const StoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        if (!isSupabaseConfigured || !supabase) {
            setError('Supabase is not configured.');
            setLoading(false);
            return;
        }

        try {
            let postData = null;

            const { data, error: fetchErr } = await supabase
                .from('posts')
                .select('*, profiles(username, full_name, avatar_url, bio)')
                .eq('id', id)
                .single();

            if (fetchErr) {
                const { data: fallback, error: fallbackErr } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (fallbackErr) throw fallbackErr;
                postData = fallback;
            } else {
                postData = data;
                setAuthor(data.profiles);
            }

            setPost(postData);

            if (!postData.profiles && postData.author_id) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('username, full_name, avatar_url, bio')
                    .eq('id', postData.author_id)
                    .single();
                if (profileData) setAuthor(profileData);
            }

            const { data: tagData } = await supabase
                .from('post_tags')
                .select('tags(name, slug)')
                .eq('post_id', id);
            setTags(tagData?.map(t => t.tags) || []);

            try {
                await supabase.rpc('increment_reads', { post_id: id });
            } catch {
                await supabase.from('posts')
                    .update({ reads: (postData.reads || 0) + 1 })
                    .eq('id', id);
            }

            trackReading(postData);
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
            const { error: deleteErr } = await supabase.from('posts').delete().eq('id', post.id);
            if (deleteErr) throw deleteErr;
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
                        {(user?.id === post.author_id || profile?.is_admin) && (
                            <button onClick={handleDelete} className="btn-icon btn-danger" title="Delete Post">
                                <Trash2 size={18} />
                            </button>
                        )}
                        <BookmarkButton postId={post.id} />
                        <LikeButton postId={post.id} />
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

                    <div className="story-body rendered-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

                    {tags.length > 0 && (
                        <div className="story-tags">
                            <Tag size={16} />
                            {tags.map(tag => (
                                <span key={tag.slug} className="story-tag">{tag.name}</span>
                            ))}
                        </div>
                    )}

                    <div className="story-engagement-bar">
                        <LikeButton postId={post.id} />
                        <BookmarkButton postId={post.id} />
                        <ShareButtons title={post.title} />
                    </div>

                    <EmojiReactions postId={post.id} />

                    {author?.tip_link && (
                        <TipAuthorLink tipLink={author.tip_link} authorName={author.full_name || author.username} />
                    )}
                </article>

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

                <RelatedPosts currentPostId={post.id} category={post.category} tags={tags.map(t => t.name)} />
                <Comments postId={post.id} />
            </div>
        </div>
    );
};

export default StoryPage;
