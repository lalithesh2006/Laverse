import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../lib/utils';
import { MessageCircle, Reply, Trash2, Send, ChevronDown, ChevronUp } from 'lucide-react';

const Comments = ({ postId }) => {
    const { user, profile } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState({});

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        if (!isSupabaseConfigured || !supabase) { setLoading(false); return; }
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*, profiles(username, full_name, avatar_url)')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Build threaded structure
            const rootComments = [];
            const childMap = {};
            (data || []).forEach(c => {
                c.replies = [];
                if (c.parent_id) {
                    if (!childMap[c.parent_id]) childMap[c.parent_id] = [];
                    childMap[c.parent_id].push(c);
                } else {
                    rootComments.push(c);
                }
            });
            rootComments.forEach(c => {
                c.replies = childMap[c.id] || [];
            });

            setComments(rootComments);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (parentId = null) => {
        const content = parentId ? replyContent : newComment;
        if (!content.trim() || !user) return;

        setSubmitting(true);
        try {
            const { error } = await supabase.from('comments').insert([{
                post_id: postId,
                author_id: user.id,
                parent_id: parentId,
                content: content.trim()
            }]);
            if (error) throw error;

            if (parentId) {
                setReplyContent('');
                setReplyingTo(null);
            } else {
                setNewComment('');
            }
            await fetchComments();
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Delete this comment?')) return;
        try {
            const { error } = await supabase.from('comments').delete().eq('id', commentId);
            if (error) throw error;
            await fetchComments();
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const renderComment = (comment, isReply = false) => (
        <div key={comment.id} className={`comment ${isReply ? 'comment-reply' : ''}`}>
            <div className="comment-header">
                <div className="comment-author">
                    {comment.profiles?.avatar_url ? (
                        <img src={comment.profiles.avatar_url} alt="" className="comment-avatar" />
                    ) : (
                        <div className="comment-avatar-fallback">
                            {(comment.profiles?.full_name || 'A')[0].toUpperCase()}
                        </div>
                    )}
                    <div>
                        <span className="comment-name">{comment.profiles?.full_name || comment.profiles?.username || 'Anonymous'}</span>
                        <span className="comment-time">{timeAgo(comment.created_at)}</span>
                    </div>
                </div>
                <div className="comment-actions">
                    {user && !isReply && (
                        <button className="comment-action-btn" onClick={() => { setReplyingTo(comment.id); setReplyContent(''); }}>
                            <Reply size={14} /> Reply
                        </button>
                    )}
                    {user && user.id === comment.author_id && (
                        <button className="comment-action-btn comment-delete" onClick={() => handleDelete(comment.id)}>
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
            <p className="comment-content">{comment.content}</p>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <>
                    <button className="show-replies-btn" onClick={() => toggleReplies(comment.id)}>
                        {expandedReplies[comment.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                    {expandedReplies[comment.id] && (
                        <div className="replies-list">
                            {comment.replies.map(reply => renderComment(reply, true))}
                        </div>
                    )}
                </>
            )}

            {/* Reply form */}
            {replyingTo === comment.id && (
                <div className="reply-form">
                    <textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        rows={2}
                    />
                    <div className="reply-form-actions">
                        <button className="btn-primary btn-sm" onClick={() => handleSubmitComment(comment.id)} disabled={submitting}>
                            <Send size={14} /> {submitting ? 'Sending...' : 'Reply'}
                        </button>
                        <button className="btn-secondary btn-sm" onClick={() => setReplyingTo(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="comments-section">
            <h3 className="comments-title">
                <MessageCircle size={22} /> Comments ({comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0)})
            </h3>

            {/* Add comment form */}
            {user ? (
                <div className="comment-form">
                    <div className="comment-form-avatar">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="comment-avatar" />
                        ) : (
                            <div className="comment-avatar-fallback">
                                {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="comment-form-input">
                        <textarea
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            rows={3}
                        />
                        <button className="btn-primary btn-sm" onClick={() => handleSubmitComment(null)} disabled={submitting || !newComment.trim()}>
                            <Send size={14} /> {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="comment-login-prompt">
                    <p>Sign in to join the discussion</p>
                </div>
            )}

            {/* Comments list */}
            {loading ? (
                <div className="comments-loading"><div className="spinner-sm"></div> Loading comments...</div>
            ) : comments.length === 0 ? (
                <div className="comments-empty">
                    <MessageCircle size={32} />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="comments-list">
                    {comments.map(comment => renderComment(comment))}
                </div>
            )}
        </div>
    );
};

export default Comments;
