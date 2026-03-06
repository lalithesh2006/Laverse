import express from 'express';
import Post from '../models/Post.js';
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

// Get all published posts (with optional category/search filters)
router.get('/', async (req, res) => {
    try {
        const match = { published: true };
        const sort = {};

        if (req.query.category && req.query.category !== 'All') {
            match.category = req.query.category;
        }

        if (req.query.search) {
            match.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { excerpt: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.sortBy === 'popular') {
            sort.reads = -1;
        } else if (req.query.sortBy === 'oldest') {
            sort.created_at = 1;
        } else {
            sort.created_at = -1; // Newest default
        }

        const posts = await Post.find(match)
            .populate('author_id', 'username full_name avatar_url')
            .sort(sort)
            .limit(parseInt(req.query.limit) || 20);

        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get trending posts
router.get('/trending', async (req, res) => {
    try {
        const posts = await Post.find({ published: true })
            .populate('author_id', 'username full_name avatar_url')
            .sort({ reads: -1 })
            .limit(3);

        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get user's own posts (Dashboard)
router.get('/me', auth, async (req, res) => {
    try {
        const posts = await Post.find({ author_id: req.user._id }).sort({ createdAt: -1 });
        res.send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author_id', 'username full_name avatar_url bio');
        if (!post) {
            return res.status(404).send();
        }

        // Increment reads automatically 
        post.reads += 1;
        await post.save();

        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update a post
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'content', 'excerpt', 'cover_image', 'category', 'published', 'scheduled_at'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const post = await Post.findOne({ _id: req.params.id, author_id: req.user._id });

        if (!post) {
            return res.status(404).send();
        }

        updates.forEach((update) => post[update] = req.body[update]);
        await post.save();

        res.send(post);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, author_id: req.user._id });

        if (!post) {
            return res.status(404).send();
        }

        res.send(post);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
