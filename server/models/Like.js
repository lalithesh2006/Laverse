import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

// Each user can only like a post once
likeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);
