import { useState } from 'react';
import { Mail, ArrowRight, Check, Sparkles } from 'lucide-react';

const NewsletterCTA = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        // Save to localStorage as demo (in production, integrate with email service)
        try {
            const subs = JSON.parse(localStorage.getItem('laverse-newsletter') || '[]');
            if (!subs.includes(email)) {
                subs.push(email);
                localStorage.setItem('laverse-newsletter', JSON.stringify(subs));
            }
        } catch (err) { }
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setEmail(''); }, 4000);
    };

    return (
        <section className="newsletter-section">
            <div className="container">
                <div className="newsletter-card">
                    <div className="newsletter-glow" />
                    <div className="newsletter-content">
                        <div className="newsletter-icon">
                            <Sparkles size={28} />
                        </div>
                        <h2>Stay in the verse</h2>
                        <p>Get the latest stories, insights, and exclusive content delivered to your inbox every week.</p>
                        {submitted ? (
                            <div className="newsletter-success">
                                <Check size={22} />
                                <span>You're in! Welcome to the verse ✨</span>
                            </div>
                        ) : (
                            <form className="newsletter-form" onSubmit={handleSubmit}>
                                <div className="newsletter-input-wrap">
                                    <Mail size={18} className="newsletter-mail-icon" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="newsletter-btn">
                                    Subscribe <ArrowRight size={16} />
                                </button>
                            </form>
                        )}
                        <p className="newsletter-note">No spam. Unsubscribe anytime.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterCTA;
