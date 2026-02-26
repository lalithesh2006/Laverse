import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, AtSign, AlignLeft, Check } from 'lucide-react';

const ProfileSetup = ({ onComplete, onSkip }) => {
    const [formData, setFormData] = useState({
        username: '',
        bio: ''
    });

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
                <div className="avatar-placeholder">
                    <Camera size={32} />
                </div>
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

                <button className="btn-primary w-full" onClick={onComplete}>
                    Complete Setup
                    <Check size={18} />
                </button>

                <button className="skip-link" onClick={onSkip}>
                    Skip for now
                </button>
            </div>
        </motion.div>
    );
};

export default ProfileSetup;
