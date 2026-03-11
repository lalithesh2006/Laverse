import express from 'express';
import Like from '../models/Like.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/likes/:postId — get count + whether current user liked it
router.get('/:postId', async (req, res) => {
    try {
        const count = await Like.countDocuments({ post_id: req.params.postId });

        let userLiked = false;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            try {
                const jwt = (await import('jsonwebtoken')).default;
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_laverse');
                const existing = await Like.findOne({
                    post_id: req.params.postId,
                    user_id: decoded._id
                });
                userLiked = !!existing;
            } catch (_) { /* token invalid — treat as not logged in */ }
        }

        res.send({ count, userLiked });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// POST /api/likes/:postId — toggle like (auth required)
router.post('/:postId', auth, async (req, res) => {
    try {
        const existing = await Like.findOne({
            post_id: req.params.postId,
            user_id: req.user._id
        });

        if (existing) {
            await existing.deleteOne();
            const count = await Like.countDocuments({ post_id: req.params.postId });
            return res.send({ liked: false, count });
        } else {
            await Like.create({ post_id: req.params.postId, user_id: req.user._id });
            const count = await Like.countDocuments({ post_id: req.params.postId });
            return res.send({ liked: true, count });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
