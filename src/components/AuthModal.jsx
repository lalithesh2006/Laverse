import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthModal = ({ isOpen, onClose, initialMode = 'signup' }) => {
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Demo mode — simulate success without real Supabase
        if (!isSupabaseConfigured) {
            await new Promise(resolve => setTimeout(resolve, 800));
            setSuccess(true);
            setLoading(false);
            return;
        }

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName
                        }
                    }
                });
                if (error) throw error;
                setSuccess(true);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password
                });
                if (error) throw error;
                onClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setError(null);
        setFormData({ email: '', password: '', fullName: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={handleClose}>
                <motion.div
                    className="modal-content"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="modal-close" onClick={handleClose}>
                        <X size={20} />
                    </button>

                    {success ? (
                        <div className="auth-success">
                            <div className="success-icon">
                                <CheckCircle size={48} />
                            </div>
                            <h2>Welcome to La'verse!</h2>
                            <p className="modal-subtitle">
                                {mode === 'signup'
                                    ? `Your account has been created successfully, ${formData.fullName || 'Writer'}! Check your email to confirm.`
                                    : 'You have signed in successfully.'}
                            </p>
                            <button className="btn-primary w-full" onClick={handleClose}>
                                Start Exploring
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="modal-header">
                                <h2>{mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}</h2>
                                <p className="modal-subtitle">
                                    {mode === 'signup'
                                        ? 'Join our community of writers and readers.'
                                        : 'Enter your credentials to access your account.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="auth-form">
                                {mode === 'signup' && (
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <div className="input-icon-wrapper">
                                            <User size={18} className="input-icon" />
                                            <input
                                                type="text"
                                                placeholder="Your full name"
                                                required
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-icon-wrapper">
                                        <Mail size={18} className="input-icon" />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <div className="input-icon-wrapper">
                                        <Lock size={18} className="input-icon" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {error && <div className="auth-error">{error}</div>}

                                <button type="submit" className="btn-primary w-full" disabled={loading}>
                                    {loading ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                            </form>

                            <div className="modal-footer">
                                {mode === 'signup' ? (
                                    <p>Already have an account? <button onClick={() => { setMode('signin'); setError(null); }} className="text-btn">Sign In</button></p>
                                ) : (
                                    <p>Don't have an account? <button onClick={() => { setMode('signup'); setError(null); }} className="text-btn">Sign Up</button></p>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
