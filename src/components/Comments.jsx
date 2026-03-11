import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
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
        setLoading(true);
        try {
            const data = await api.comments.getComments(postId);
            setComments(data || []);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (parentId = null) => {
        const content = parentId ? replyContent : newComment;
        if (!content.trim() || !user) return;

        setSubmitting(true);
        try {
            const created = await api.comments.createComment(postId, content.trim(), parentId);

            if (parentId) {
                setComments(prev => {
                    const addReplyToNode = (nodes) => nodes.map(node => {
                        if (node._id?.toString() === parentId || node.id === parentId) {
                            return { ...node, replies: [...(node.replies || []), created] };
                        } else if (node.replies) {
                            return { ...node, replies: addReplyToNode(node.replies) };
                        }
                        return node;
                    });
                    return addReplyToNode(prev);
                });
                setReplyContent('');
                setReplyingTo(null);
            } else {
                setComments(prev => [...prev, { ...created, replies: [] }]);
                setNewComment('');
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            alert('Failed to post comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Delete this comment?')) return;
        try {
            await api.comments.deleteComment(commentId);
            setComments(prev => {
                const removeNode = (nodes) =>
                    nodes.filter(n => (n._id?.toString() !== commentId && n.id !== commentId))
                         .map(n => ({ ...n, replies: n.replies ? removeNode(n.replies) : [] }));
                return removeNode(prev);
            });
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Failed to delete comment.');
        }
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const renderComment = (comment, isReply = false) => {
        const cId = comment._id?.toString() || comment.id;
        const authorProfile = comment.profiles || comment.author_id;
        const isOwner = user && (user.id === (comment.author_id?._id?.toString() || comment.author_id));

        return (
            <div key={cId} className={`comment ${isReply ? 'comment-reply' : ''}`}>
                <div className="comment-header">
                    <div className="comment-author">
                        {authorProfile?.avatar_url ? (
                            <img src={authorProfile.avatar_url} alt="" className="comment-avatar" />
                        ) : (
                            <div className="comment-avatar-fallback">
                                {(authorProfile?.full_name || 'A')[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <span className="comment-name">{authorProfile?.full_name || authorProfile?.username || 'Anonymous'}</span>
                            <span className="comment-time">{timeAgo(comment.createdAt || comment.created_at)}</span>
                        </div>
                    </div>
                    <div className="comment-actions">
                        {user && !isReply && (
                            <button className="comment-action-btn" onClick={() => { setReplyingTo(cId); setReplyContent(''); }}>
                                <Reply size={14} /> Reply
                            </button>
                        )}
                        {isOwner && (
                            <button className="comment-action-btn comment-delete" onClick={() => handleDelete(cId)}>
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
                <p className="comment-content">{comment.content}</p>

                {comment.replies && comment.replies.length > 0 && (
                    <>
                        <button className="show-replies-btn" onClick={() => toggleReplies(cId)}>
                            {expandedReplies[cId] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </button>
                        {expandedReplies[cId] && (
                            <div className="replies-list">
                                {comment.replies.map(reply => renderComment(reply, true))}
                            </div>
                        )}
                    </>
                )}

                {replyingTo === cId && (
                    <div className="reply-form">
                        <textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            rows={2}
                        />
                        <div className="reply-form-actions">
                            <button className="btn-primary btn-sm" onClick={() => handleSubmitComment(cId)} disabled={submitting}>
                                <Send size={14} /> {submitting ? 'Sending...' : 'Reply'}
                            </button>
                            <button className="btn-secondary btn-sm" onClick={() => setReplyingTo(null)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const totalCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

    return (
        <div className="comments-section">
            <h3 className="comments-title">
                <MessageCircle size={22} /> Comments ({totalCount})
            </h3>

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
                        <button
                            className="btn-primary btn-sm"
                            onClick={() => handleSubmitComment(null)}
                            disabled={submitting || !newComment.trim()}
                        >
                            <Send size={14} /> {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="comment-login-prompt">
                    <p>Sign in to join the discussion</p>
                </div>
            )}

            {loading ? (
                <div className="comments-loading"><div className="spinner-sm" /> Loading comments...</div>
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
