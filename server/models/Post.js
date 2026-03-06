import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    excerpt: {
        type: String,
    },
    cover_image: {
        type: String,
    },
    category: {
        type: String,
        default: 'Personal',
    },
    published: {
        type: Boolean,
        default: false,
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reads: {
        type: Number,
        default: 0,
    },
    scheduled_at: {
        type: Date,
    },
    published_at: {
        type: Date,
    }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
