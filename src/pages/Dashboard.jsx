import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { PenTool, BookOpen, Eye, Settings, LogOut, Trash2, Edit3, Plus, Bookmark, Shield } from 'lucide-react';
import ReadingStreak from '../components/ReadingStreak';
import UserBadges from '../components/UserBadges';
import { Loader } from 'lucide-react';

const Dashboard = () => {
    const { user, profile, signOut, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookmarks, setBookmarks] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [editingProfile, setEditingProfile] = useState(false);
    const [userStats, setUserStats] = useState({ comments: 0, likes: 0 });
    const [adminPosts, setAdminPosts] = useState([]);
    const [loadingAdmin, setLoadingAdmin] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [profileForm, setProfileForm] = useState({
        username: '',
        full_name: '',
        bio: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchUserPosts();
        fetchBookmarks();
        fetchUserStats();
    }, [user]);

    useEffect(() => {
        if (profile) {
            setProfileForm({
                username: profile.username || '',
                full_name: profile.full_name || '',
                bio: profile.bio || '',
                avatar_url: profile.avatar_url || ''
            });
        }
    }, [profile]);

    const fetchUserPosts = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const data = await api.posts.getMyPosts();
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookmarks = async () => {
        if (!user) return;
        try {
            const data = await api.bookmarks.getMyBookmarks();
            setBookmarks(data || []);
        } catch (err) {
            console.error('Error fetching bookmarks:', err);
            setBookmarks([]);
        }
    };

    const fetchUserStats = async () => {
        if (!user) return;
        // Comment/like stats are out of scope for the current MVP migration logic
        setUserStats({ comments: 0, likes: 0 });
    };

    const fetchAllPosts = async () => {
        if (!profile?.is_admin) return;
        setLoadingAdmin(true);
        try {
            const data = await api.posts.getPosts();
            setAdminPosts(data || []);
        } catch (err) {
            console.error('Error fetching all posts:', err);
        } finally {
            setLoadingAdmin(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'admin' && adminPosts.length === 0) {
            fetchAllPosts();
        }
    }, [activeTab]);

    const handleDeletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await api.posts.delete(postId);
            setPosts(posts.filter(p => p._id !== postId));
            setAdminPosts(adminPosts.filter(p => p._id !== postId));
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleProfileSave = async () => {
        try {
            await updateProfile(profileForm);
            setEditingProfile(false);
        } catch (err) {
            alert('Error updating profile: ' + err.message);
        }
    };

    const handleAvatarUpload = async (event) => {
        try {
            setUploadingAvatar(true);
            const file = event.target.files[0];
            if (!file) return;

            // Normally this would be handled via a custom express file upload route using Multer directly to S3 or a comparable store
            // We mock it for the migration phase to avoid requiring object block storage.
            const reader = new FileReader();
            reader.onloadend = async () => {
                const publicUrl = reader.result;
                const updatedProfileForm = { ...profileForm, avatar_url: publicUrl };
                setProfileForm(updatedProfileForm);

                // Auto-save the avatar change directly when uploaded
                await updateProfile({ avatar_url: publicUrl });
                setUploadingAvatar(false);
            };
            reader.readAsDataURL(file);

        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar: ' + error.message);
            setUploadingAvatar(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const publishedPosts = posts.filter(p => p.published);
    const draftPosts = posts.filter(p => !p.published);
    const totalReads = posts.reduce((sum, p) => sum + (p.reads || 0), 0);

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-layout">
                    {/* Sidebar / Profile Card */}
                    <aside className="dashboard-sidebar">
                        <div className="profile-card">
                            <div className="profile-avatar" style={{ position: 'relative' }}>
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" />
                                ) : (
                                    <div className="avatar-fallback">
                                        {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                                {editingProfile && (
                                    <label style={{ position: 'absolute', bottom: -10, background: 'var(--primary-color)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                                        {uploadingAvatar ? <Loader size={12} className="spinner" /> : 'Change Photo'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            style={{ display: 'none' }}
                                            disabled={uploadingAvatar}
                                        />
                                    </label>
                                )}
                            </div>

                            {editingProfile ? (
                                <div className="profile-edit-form">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={profileForm.full_name}
                                        onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={profileForm.username}
                                        onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Tell us about yourself..."
                                        value={profileForm.bio}
                                        onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                                        rows={3}
                                    />
                                    <div className="profile-edit-actions">
                                        <button className="btn-primary" onClick={handleProfileSave}>Save</button>
                                        <button className="btn-secondary" onClick={() => setEditingProfile(false)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="profile-name">{profile?.full_name || 'Writer'}</h2>
                                    <p className="profile-username">@{profile?.username || 'username'}</p>
                                    {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
                                    <button className="btn-edit-profile" onClick={() => setEditingProfile(true)}>
                                        <Settings size={14} /> Edit Profile
                                    </button>
                                </>
                            )}

                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <span className="stat-num">{publishedPosts.length}</span>
                                    <span className="stat-txt">Published</span>
                                </div>
                                <div className="profile-stat">
                                    <span className="stat-num">{draftPosts.length}</span>
                                    <span className="stat-txt">Drafts</span>
                                </div>
                                <div className="profile-stat">
                                    <span className="stat-num">{totalReads >= 1000 ? (totalReads / 1000).toFixed(1) + 'K' : totalReads}</span>
                                    <span className="stat-txt">Reads</span>
                                </div>
                            </div>

                            <button className="btn-signout" onClick={handleSignOut}>
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>

                        {/* Reading Streak */}
                        <ReadingStreak />

                        {/* Badges */}
                        <UserBadges stats={{
                            posts: publishedPosts.length,
                            comments: userStats.comments,
                            likes: userStats.likes,
                            totalReads: totalReads
                        }} />
                    </aside>

                    {/* Main Content */}
                    <main className="dashboard-main">
                        <div className="dashboard-header">
                            <h1>Your Stories</h1>
                            <Link to="/write" className="btn-primary">
                                <Plus size={18} /> Write New Story
                            </Link>
                        </div>

                        {/* Tabs */}
                        <div className="dashboard-tabs">
                            <button className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>My Stories</button>
                            <button className={`tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`} onClick={() => setActiveTab('bookmarks')}>
                                <Bookmark size={14} /> Bookmarks ({bookmarks.length})
                            </button>
                            {profile?.is_admin && (
                                <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
                                    <Shield size={14} /> All Posts (Admin)
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="dashboard-loading">
                                <div className="spinner"></div>
                                <p>Loading your stories...</p>
                            </div>
                        ) : activeTab === 'posts' && (
                            posts.length === 0 ? (
                                <div className="dashboard-empty">
                                    <PenTool size={48} />
                                    <h2>No stories yet</h2>
                                    <p>Your creative journey starts with a single word. Write your first story today!</p>
                                    <Link to="/write" className="btn-primary">
                                        <PenTool size={18} /> Start Writing
                                    </Link>
                                </div>
                            ) : (
                                <div className="posts-list">
                                    {posts.map(post => (
                                        <div key={post._id} className="post-list-item">
                                            <div className="post-list-image">
                                                {post.cover_image ? (
                                                    <img src={post.cover_image} alt={post.title} />
                                                ) : (
                                                    <div className="post-image-placeholder">
                                                        <BookOpen size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="post-list-content">
                                                <div className="post-list-meta">
                                                    <span className={`post-status ${post.published ? 'published' : 'draft'}`}>
                                                        {post.published ? 'Published' : 'Draft'}
                                                    </span>
                                                    <span className="post-category">{post.category}</span>
                                                    {post.reads > 0 && (
                                                        <span className="post-reads"><Eye size={14} /> {post.reads}</span>
                                                    )}
                                                </div>
                                                <h3>{post.title}</h3>
                                                {post.excerpt && <p>{post.excerpt}</p>}
                                                <span className="post-date">
                                                    {new Date(post.createdAt || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="post-list-actions">
                                                <Link to={`/write/${post._id}`} className="btn-icon" title="Edit">
                                                    <Edit3 size={16} />
                                                </Link>
                                                {post.published && (
                                                    <Link to={`/story/${post._id}`} className="btn-icon" title="View">
                                                        <Eye size={16} />
                                                    </Link>
                                                )}
                                                <button className="btn-icon btn-danger" title="Delete" onClick={() => handleDeletePost(post._id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {/* Bookmarks Tab */}
                        {activeTab === 'bookmarks' && (
                            bookmarks.length === 0 ? (
                                <div className="dashboard-empty">
                                    <Bookmark size={48} />
                                    <h2>No bookmarks yet</h2>
                                    <p>Save posts you want to read later!</p>
                                </div>
                            ) : (
                                <div className="posts-list">
                                    {bookmarks.map(post => (
                                        <Link key={post._id} to={`/story/${post._id}`} className="post-list-item bookmark-item">
                                            <div className="post-list-image">
                                                {post.cover_image ? (
                                                    <img src={post.cover_image} alt={post.title} />
                                                ) : (
                                                    <div className="post-image-placeholder"><BookOpen size={24} /></div>
                                                )}
                                            </div>
                                            <div className="post-list-content">
                                                <span className="post-category">{post.category}</span>
                                                <h3>{post.title}</h3>
                                                {post.excerpt && <p>{post.excerpt}</p>}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )
                        )}

                        {/* Admin Tab */}
                        {activeTab === 'admin' && profile?.is_admin && (
                            loadingAdmin ? (
                                <div className="dashboard-loading">
                                    <div className="spinner"></div>
                                    <p>Loading all posts...</p>
                                </div>
                            ) : adminPosts.length === 0 ? (
                                <div className="dashboard-empty">
                                    <Shield size={48} />
                                    <h2>No posts found</h2>
                                </div>
                            ) : (
                                <div className="posts-list">
                                    {adminPosts.map(post => (
                                        <div key={post._id} className="post-list-item">
                                            <div className="post-list-image">
                                                {post.cover_image ? (
                                                    <img src={post.cover_image} alt={post.title} />
                                                ) : (
                                                    <div className="post-image-placeholder">
                                                        <BookOpen size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="post-list-content">
                                                <div className="post-list-meta">
                                                    <span className="post-category" style={{ color: 'var(--primary-color)' }}>By {post.profiles?.full_name || post.profiles?.username || 'Unknown'}</span>
                                                    <span className={`post-status ${post.published ? 'published' : 'draft'}`}>
                                                        {post.published ? 'Published' : 'Draft'}
                                                    </span>
                                                    <span className="post-category">{post.category}</span>
                                                </div>
                                                <h3>{post.title}</h3>
                                                {post.excerpt && <p>{post.excerpt}</p>}
                                                <span className="post-date">
                                                    {new Date(post.createdAt || post.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="post-list-actions">
                                                <Link to={`/story/${post._id}`} className="btn-icon" title="View">
                                                    <Eye size={16} />
                                                </Link>
                                                <button className="btn-icon btn-danger" title="Delete" onClick={() => handleDeletePost(post._id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
