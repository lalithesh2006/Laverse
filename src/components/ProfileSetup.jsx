import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, AtSign, AlignLeft, Check, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ProfileSetup = ({ onComplete, onSkip }) => {
    const { user, profile, updateProfile } = useAuth();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        username: profile?.username || '',
        bio: profile?.bio || '',
        tip_link: profile?.tip_link || '',
        avatar_url: profile?.avatar_url || ''
    });

    const handleComplete = async () => {
        setSaving(true);
        try {
            await updateProfile({
                username: formData.username,
                bio: formData.bio,
                tip_link: formData.tip_link,
                avatar_url: formData.avatar_url
            });
            onComplete();
        } catch (err) {
            console.error('Error saving profile:', err);
            // Still close — profile can be edited later
            onComplete();
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (event) => {
        if (!isSupabaseConfigured || !supabase) {
            alert('Supabase is not configured. Avatar upload is unavailable in demo mode.');
            return;
        }
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `avatar_${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('post-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('post-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, avatar_url: publicUrl });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="modal-header">
                <h2>Set Up Your Profile</h2>
                <p className="modal-subtitle">Tell the community a bit about yourself.</p>
            </div>

            <div className="avatar-upload">
                <label className="avatar-placeholder" style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                    {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Camera size={32} />
                    )}
                    {uploading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Loader className="spinner" size={24} color="#fff" />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                    />
                </label>
                <span className="story-time">Upload profile photo</span>
            </div>

            <div className="auth-form">
                <div className="form-group">
                    <label>Choose a username</label>
                    <div className="input-icon-wrapper">
                        <AtSign size={18} className="input-icon" />
                        <input
                            type="text"
                            placeholder="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Short Bio</label>
                    <div className="input-icon-wrapper">
                        <AlignLeft size={18} className="input-icon" style={{ top: '1.25rem' }} />
                        <textarea
                            placeholder="Writer, dreamer, explorer..."
                            rows="3"
                            style={{ paddingLeft: '3rem' }}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        ></textarea>
                    </div>
                </div>

                <div className="form-group">
                    <label>Support Link (Optional)</label>
                    <div className="input-icon-wrapper">
                        <span className="input-icon" style={{ fontSize: '14px', top: '14px', color: 'var(--text-secondary)' }}>🔗</span>
                        <input
                            type="text"
                            placeholder="buymeacoffee.com/username"
                            value={formData.tip_link}
                            onChange={(e) => setFormData({ ...formData, tip_link: e.target.value })}
                        />
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Let readers support your work.</p>
                </div>

                <button className="btn-primary w-full" onClick={handleComplete} disabled={saving}>
                    {saving ? 'Saving...' : 'Complete Setup'}
                    {!saving && <Check size={18} />}
                </button>

                <button className="skip-link" onClick={onSkip}>
                    Skip for now
                </button>
            </div>
        </motion.div>
    );
};

export default ProfileSetup;
