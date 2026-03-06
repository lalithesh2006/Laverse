import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'signup' }) => {
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const navigate = useNavigate();
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
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password
                });
                if (error) throw error;
                // On sign in, navigate to dashboard
                handleClose();
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Reset modal state whenever it opens
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setSuccess(false);
            setResetSent(false);
            setError(null);
            setFormData({ email: '', password: '', fullName: '' });
        }
    }, [isOpen]);

    const handleClose = () => {
        setSuccess(false);
        setResetSent(false);
        setError(null);
        setFormData({ email: '', password: '', fullName: '' });
        onClose();
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Please enter your email address first.');
            return;
        }
        if (!isSupabaseConfigured || !supabase) {
            setError('Password reset requires Supabase to be configured.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                redirectTo: window.location.origin + '/dashboard'
            });
            if (error) throw error;
            setResetSent(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClick = () => {
        const isNewUser = mode === 'signup';
        handleClose();
        if (onSuccess) onSuccess(isNewUser);
        navigate('/dashboard');
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
                            <button className="btn-primary w-full" onClick={handleSuccessClick}>
                                Go to Dashboard
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
                                {resetSent && <div className="auth-success" style={{ background: '#d4edda', color: '#155724', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' }}>Password reset link sent! Check your email.</div>}

                                {mode === 'signin' && (
                                    <div style={{ textAlign: 'right', marginBottom: '12px' }}>
                                        <button
                                            type="button"
                                            className="text-btn"
                                            onClick={handleForgotPassword}
                                            disabled={loading}
                                            style={{ fontSize: '13px' }}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

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
