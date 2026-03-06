import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../lib/utils';
import { Bell, Check, Heart, MessageCircle, UserPlus, Flame } from 'lucide-react';

const ICON_MAP = {
    like: Heart,
    comment: MessageCircle,
    follow: UserPlus,
    reaction: Flame,
};

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const fetchNotifications = async () => {
        if (!isSupabaseConfigured || !supabase || !user) return;
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setNotifications(data || []);
            setUnreadCount((data || []).filter(n => !n.is_read).length);
        } catch (err) {
            // Table might not exist yet — silently ignore
        }
    };

    const markAllRead = async () => {
        if (!isSupabaseConfigured || !supabase || !user) return;
        try {
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking notifications read:', err);
        }
    };

    if (!user) return null;

    return (
        <div className="notification-bell-wrapper" ref={dropdownRef}>
            <button
                className="notification-bell-btn"
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
                aria-label={`Notifications (${unreadCount} unread)`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button className="mark-read-btn" onClick={markAllRead}>
                                <Check size={14} /> Mark all read
                            </button>
                        )}
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                <Bell size={24} style={{ opacity: 0.3 }} />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(n => {
                                const IconComponent = ICON_MAP[n.type] || Bell;
                                return (
                                    <Link
                                        key={n.id}
                                        to={n.link || '#'}
                                        className={`notification-item ${!n.is_read ? 'notification-unread' : ''}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className={`notification-icon notification-icon-${n.type}`}>
                                            <IconComponent size={14} />
                                        </div>
                                        <div className="notification-content">
                                            <p>{n.message}</p>
                                            <span className="notification-time">{timeAgo(n.created_at)}</span>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
