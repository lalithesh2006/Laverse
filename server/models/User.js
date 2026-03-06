import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar_url: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    is_admin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
