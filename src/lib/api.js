const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('laverse_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const api = {
    auth: {
        login: async (email, password) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return res.json();
        },
        signup: async (email, password, fullName, username) => {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name: fullName, username })
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return res.json();
        },
        getProfile: async () => {
            const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
            if (!res.ok) throw new Error('Unauthorized');
            return res.json();
        },
        updateProfile: async (updates) => {
            const res = await fetch(`${API_URL}/auth/me`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return res.json();
        }
    },
    posts: {
        getPosts: async (query = '') => {
            const res = await fetch(`${API_URL}/posts${query}`);
            if (!res.ok) throw new Error('Failed to fetch posts');
            return res.json();
        },
        getTrending: async () => {
            const res = await fetch(`${API_URL}/posts/trending`);
            if (!res.ok) throw new Error('Failed to fetch trending');
            return res.json();
        },
        getPost: async (id) => {
            const res = await fetch(`${API_URL}/posts/${id}`);
            if (!res.ok) throw new Error('Post not found');
            return res.json();
        },
        create: async (postData) => {
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(postData)
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return res.json();
        },
        update: async (id, postData) => {
            const res = await fetch(`${API_URL}/posts/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(postData)
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${API_URL}/posts/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (!res.ok) throw new Error((await res.json()).error);
            return res.json();
        },
        getMyPosts: async () => {
            const res = await fetch(`${API_URL}/posts/me`, { headers: getHeaders() });
            if (!res.ok) throw new Error('Failed to fetch your posts');
            return res.json();
        }
    }
};
