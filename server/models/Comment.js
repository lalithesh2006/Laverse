import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
}, { timestamps: true });

commentSchema.index({ post_id: 1, createdAt: 1 });

export default mongoose.model('Comment', commentSchema);
