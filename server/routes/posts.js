import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create a post
router.post('/', auth, async (req, res) => {
    try {
        const post = new Post({
            ...req.body,
            author_id: req.user._id
        });

        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// GET /api/posts/stats — aggregated platform stats
router.get('/stats', async (req, res) => {
    try {
        const totalStories = await Post.countDocuments({ published: true });
        const totalWriters = await User.countDocuments({});
        const categories = await Post.distinct('category', { published: true });
        const totalCategories = categories.length;

        const updated = await Post.findOne({ published: true })
            .sort({ updatedAt: -1 })
            .select('updatedAt');

        res.send({
            totalStories,
            totalWriters,
            totalCategories,
            lastUpdated: updated?.updatedAt || new Date(),
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// GET /api/posts/trending — trending posts by reads
router.get('/trending', async (req, res) => {
    try {
        const posts = await Post.find({ published: true })
            .populate('author_id', 'username full_name avatar_url')
            .sort({ reads: -1 })
            .limit(5);

        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// GET /api/posts/me — current user's posts (requires auth)
router.get('/me', auth, async (req, res) => {
    try {
        const posts = await Post.find({ author_id: req.user._id }).sort({ createdAt: -1 });
        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// GET /api/posts/category-counts — count of posts per category
router.get('/category-counts', async (req, res) => {
    try {
        const counts = await Post.aggregate([
            { $match: { published: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        // Convert to { Category: count } map
        const result = {};
        counts.forEach(c => { result[c._id] = c.count; });
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// GET /api/posts — all published posts with optional filters
router.get('/', async (req, res) => {
    try {
        const { category, search, sortBy, limit } = req.query;
        const match = { published: true };
        const sort = {};

        if (category && category !== 'All') {
            match.category = category;
        }

        if (search && search.trim()) {
            match.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { excerpt: { $regex: search.trim(), $options: 'i' } },
            ];
        }

        if (sortBy === 'popular') {
            sort.reads = -1;
        } else if (sortBy === 'oldest') {
            sort.createdAt = 1;
        } else {
            sort.createdAt = -1; // newest (default)
        }

        const posts = await Post.find(match)
            .populate('author_id', 'username full_name avatar_url bio')
            .sort(sort)
            .limit(parseInt(limit) || 20);

        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// GET /api/posts/:id — single post (increments reads)
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author_id', 'username full_name avatar_url bio tip_link');

        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        // Increment reads
        post.reads += 1;
        await post.save();

        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// PATCH /api/posts/:id — update own post
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'content', 'excerpt', 'cover_image', 'category', 'published', 'scheduled_at', 'published_at', 'tags'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const post = await Post.findOne({ _id: req.params.id, author_id: req.user._id });

        if (!post) {
            // Check if user is admin
            const adminPost = await Post.findById(req.params.id);
            if (!adminPost || !req.user.is_admin) {
                return res.status(404).send({ error: 'Post not found or unauthorized' });
            }
            updates.forEach((update) => adminPost[update] = req.body[update]);
            await adminPost.save();
            return res.send(adminPost);
        }

        updates.forEach((update) => post[update] = req.body[update]);
        await post.save();
        res.send(post);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// DELETE /api/posts/:id — delete own post (or admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        let post = await Post.findOneAndDelete({ _id: req.params.id, author_id: req.user._id });

        // If not found as own post, check if admin
        if (!post && req.user.is_admin) {
            post = await Post.findByIdAndDelete(req.params.id);
        }

        if (!post) {
            return res.status(404).send({ error: 'Post not found or unauthorized' });
        }

        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
