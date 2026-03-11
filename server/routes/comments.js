import express from 'express';
import Comment from '../models/Comment.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/comments/:postId — fetch top-level comments + their replies
router.get('/:postId', async (req, res) => {
    try {
        // Fetch all comments for this post
        const all = await Comment.find({ post_id: req.params.postId })
            .populate('author_id', 'username full_name avatar_url')
            .sort({ createdAt: 1 })
            .lean();

        // Nest replies under their parents
        const topLevel = [];
        const byId = {};

        all.forEach(c => {
            c.id = c._id.toString();
            c.replies = [];
            c.profiles = c.author_id; // alias for frontend compatibility
            byId[c.id] = c;
        });

        all.forEach(c => {
            if (c.parent_id) {
                const parent = byId[c.parent_id.toString()];
                if (parent) parent.replies.push(c);
            } else {
                topLevel.push(c);
            }
        });

        res.send(topLevel);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// POST /api/comments/:postId — create a comment or reply
router.post('/:postId', auth, async (req, res) => {
    try {
        const { content, parent_id } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).send({ error: 'Content is required.' });
        }

        const comment = new Comment({
            post_id: req.params.postId,
            author_id: req.user._id,
            content: content.trim(),
            parent_id: parent_id || null,
        });

        await comment.save();
        await comment.populate('author_id', 'username full_name avatar_url');

        const response = comment.toObject();
        response.id = response._id.toString();
        response.profiles = response.author_id;
        response.replies = [];

        res.status(201).send(response);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// DELETE /api/comments/:commentId — delete own comment
router.delete('/:commentId', auth, async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({
            _id: req.params.commentId,
            author_id: req.user._id
        });

        if (!comment) {
            return res.status(404).send({ error: 'Comment not found or not authorized.' });
        }

        // Also delete all replies to this comment
        await Comment.deleteMany({ parent_id: req.params.commentId });

        res.send({ success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
