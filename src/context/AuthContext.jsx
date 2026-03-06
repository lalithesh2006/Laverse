import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateProfile = async (updates) => {
        if (!user) return;
        const updatedProfile = await api.auth.updateProfile(updates);
        setProfile(updatedProfile);
        return updatedProfile;
    };

    const signOut = async () => {
        localStorage.removeItem('laverse_token');
        setUser(null);
        setProfile(null);
    };

    const signIn = (userData, token) => {
        localStorage.setItem('laverse_token', token);
        setUser({ id: userData._id, email: userData.email });
        setProfile(userData);
    };

    useEffect(() => {
        const token = localStorage.getItem('laverse_token');
        if (!token) {
            setLoading(false);
            return;
        }

        api.auth.getProfile()
            .then(userData => {
                setUser({ id: userData._id, email: userData.email });
                setProfile(userData);
            })
            .catch(() => {
                localStorage.removeItem('laverse_token');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const value = {
        user,
        profile,
        loading,
        signOut,
        signIn,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
