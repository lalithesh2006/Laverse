import express from 'express';
import Bookmark from '../models/Bookmark.js';
import Post from '../models/Post.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/bookmarks/me — get this user's bookmarked posts
router.get('/me', auth, async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ user_id: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        const postIds = bookmarks.map(b => b.post_id);
        const posts = await Post.find({ _id: { $in: postIds }, published: true })
            .populate('author_id', 'username full_name avatar_url')
            .lean();

        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// GET /api/bookmarks/:postId — check if user has bookmarked a post
router.get('/:postId', auth, async (req, res) => {
    try {
        const existing = await Bookmark.findOne({
            post_id: req.params.postId,
            user_id: req.user._id
        });
        res.send({ bookmarked: !!existing });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// POST /api/bookmarks/:postId — toggle bookmark (auth required)
router.post('/:postId', auth, async (req, res) => {
    try {
        const existing = await Bookmark.findOne({
            post_id: req.params.postId,
            user_id: req.user._id
        });

        if (existing) {
            await existing.deleteOne();
            return res.send({ bookmarked: false });
        } else {
            await Bookmark.create({ post_id: req.params.postId, user_id: req.user._id });
            return res.send({ bookmarked: true });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
