import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { email, password, full_name, username } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User({ email, password: hashedPassword, full_name, username });

        await user.save();

        // Auto login
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'fallback_secret_laverse', { expiresIn: '7d' });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).send({ user: userResponse, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'fallback_secret_laverse', { expiresIn: '7d' });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.send({ user: userResponse, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/me', auth, async (req, res) => {
    const userResponse = req.user.toObject();
    delete userResponse.password;
    res.send(userResponse);
});

router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['full_name', 'username', 'bio', 'avatar_url'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        const userResp = req.user.toObject();
        delete userResp.password;
        res.send(userResp);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


export default router;
