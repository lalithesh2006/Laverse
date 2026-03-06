import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    excerpt: String,
    cover_image: String,
    category: String,
    read_time: Number,
    reads: Number,
    published: Boolean,
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    created_at: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password_hash: String,
    full_name: String,
    avatar_url: String,
    bio: String,
});

const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laverse_db';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await Post.deleteMany({});
        await User.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        const author1 = await User.create({
            username: 'alice_writer',
            email: 'alice@example.com',
            password_hash: hashedPassword,
            full_name: 'Alice Johnson',
            avatar_url: 'https://i.pravatar.cc/150?u=alice',
            bio: 'Avid writer and tech enthusiast.'
        });

        const author2 = await User.create({
            username: 'bob_blogger',
            email: 'bob@example.com',
            password_hash: hashedPassword,
            full_name: 'Bob Smith',
            avatar_url: 'https://i.pravatar.cc/150?u=bob',
            bio: 'Exploring the world of web development.'
        });

        const posts = [
            {
                title: 'Getting Started with React in 2026',
                excerpt: 'A comprehensive guide to modern React.',
                content: '<p>React has evolved significantly. Here are the core concepts you need to know today...</p>',
                category: 'Technology',
                cover_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
                read_time: 5,
                reads: 1250,
                published: true,
                author_id: author1._id,
                tags: ['React', 'JavaScript', 'Frontend'],
            },
            {
                title: 'The Art of Minimalist UI Design',
                excerpt: 'Why less is often more when it comes to interfaces.',
                content: '<p>Minimalism isn\'t just about white space; it is about cognitive load...</p>',
                category: 'Design',
                cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
                read_time: 4,
                reads: 3400,
                published: true,
                author_id: author2._id,
                tags: ['UI', 'UX', 'Design'],
            },
            {
                title: 'Understanding Node.js Architecture',
                excerpt: 'Deep dive into the event loop and asynchronous programming.',
                content: '<p>Node.js revolutionized backend development with its non-blocking I/O...</p>',
                category: 'Programming',
                cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
                read_time: 7,
                reads: 890,
                published: true,
                author_id: author1._id,
                tags: ['Node.js', 'Backend', 'Architecture'],
            },
            {
                title: 'Building Scalable APIs with Express',
                excerpt: 'Best practices for organizing and scaling your Express applications.',
                content: '<p>When building large-scale applications with Express, structure is key...</p>',
                category: 'Programming',
                cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
                read_time: 6,
                reads: 2100,
                published: true,
                author_id: author2._id,
                tags: ['Express', 'API', 'Node.js'],
            }
        ];

        await Post.insertMany(posts);
        console.log('Successfully seeded database!');

    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        mongoose.disconnect();
    }
}

seed();
