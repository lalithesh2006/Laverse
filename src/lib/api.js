const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('laverse_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * Build a URL with query params from an object.
 * Skips undefined and null values.
 */
function buildUrl(base, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
            query.append(k, v);
        }
    });
    const qs = query.toString();
    return qs ? `${base}?${qs}` : base;
}

async function handleResponse(res) {
    if (!res.ok) {
        let errorMsg = 'Request failed';
        try {
            const data = await res.json();
            errorMsg = data.error || data.message || errorMsg;
        } catch (_) { /* ignore parse errors */ }
        throw new Error(errorMsg);
    }
    return res.json();
}

export const api = {
    auth: {
        login: async (email, password) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return handleResponse(res);
        },
        signup: async (email, password, fullName, username) => {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name: fullName, username })
            });
            return handleResponse(res);
        },
        getProfile: async () => {
            const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
            return handleResponse(res);
        },
        updateProfile: async (updates) => {
            const res = await fetch(`${API_URL}/auth/me`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });
            return handleResponse(res);
        }
    },

    posts: {
        /**
         * Fetch published posts.
         * @param {Object} params — { category, search, sortBy, limit }
         */
        getPosts: async (params = {}) => {
            const url = buildUrl(`${API_URL}/posts`, params);
            const res = await fetch(url);
            return handleResponse(res);
        },

        getTrending: async () => {
            const res = await fetch(`${API_URL}/posts/trending`);
            return handleResponse(res);
        },

        getPost: async (id) => {
            const res = await fetch(`${API_URL}/posts/${id}`);
            return handleResponse(res);
        },

        /** Get stats: totalStories, totalWriters, totalCategories, lastUpdated */
        getStats: async () => {
            const res = await fetch(`${API_URL}/posts/stats`);
            return handleResponse(res);
        },

        /** Get per-category post counts { Fiction: 3, Technology: 7, ... } */
        getCategoryCounts: async () => {
            const res = await fetch(`${API_URL}/posts/category-counts`);
            return handleResponse(res);
        },

        create: async (postData) => {
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(postData)
            });
            return handleResponse(res);
        },

        update: async (id, postData) => {
            const res = await fetch(`${API_URL}/posts/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(postData)
            });
            return handleResponse(res);
        },

        delete: async (id) => {
            const res = await fetch(`${API_URL}/posts/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return handleResponse(res);
        },

        /** Get the currently authenticated user's posts */
        getMyPosts: async () => {
            const res = await fetch(`${API_URL}/posts/me`, { headers: getHeaders() });
            return handleResponse(res);
        },

        /** Alias for getMyPosts — backward compatible */
        getUserPosts: async () => {
            const res = await fetch(`${API_URL}/posts/me`, { headers: getHeaders() });
            return handleResponse(res);
        },
    },

    comments: {
        getComments: async (postId) => {
            const res = await fetch(`${API_URL}/comments/${postId}`);
            return handleResponse(res);
        },
        createComment: async (postId, content, parentId = null) => {
            const res = await fetch(`${API_URL}/comments/${postId}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ content, parent_id: parentId })
            });
            return handleResponse(res);
        },
        deleteComment: async (commentId) => {
            const res = await fetch(`${API_URL}/comments/${commentId}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return handleResponse(res);
        },
    },

    likes: {
        /** Returns { count, userLiked } */
        getCount: async (postId) => {
            const res = await fetch(`${API_URL}/likes/${postId}`, { headers: getHeaders() });
            return handleResponse(res);
        },
        /** Returns { liked, count } */
        toggle: async (postId) => {
            const res = await fetch(`${API_URL}/likes/${postId}`, {
                method: 'POST',
                headers: getHeaders()
            });
            return handleResponse(res);
        },
    },

    bookmarks: {
        /** Returns { bookmarked } */
        getStatus: async (postId) => {
            const res = await fetch(`${API_URL}/bookmarks/${postId}`, { headers: getHeaders() });
            return handleResponse(res);
        },
        /** Returns { bookmarked } */
        toggle: async (postId) => {
            const res = await fetch(`${API_URL}/bookmarks/${postId}`, {
                method: 'POST',
                headers: getHeaders()
            });
            return handleResponse(res);
        },
        /** Returns array of Post objects */
        getMyBookmarks: async () => {
            const res = await fetch(`${API_URL}/bookmarks/me`, { headers: getHeaders() });
            return handleResponse(res);
        },
    },
};
