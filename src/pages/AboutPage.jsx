import { Link } from 'react-router-dom';
import { Heart, Users, PenTool, BookOpen, Globe, Sparkles } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-hero">
                    <div className="legal-hero-icon">
                        <Sparkles size={32} />
                    </div>
                    <h1>About La'verse</h1>
                    <p className="legal-hero-subtitle">Where stories come alive and every voice finds its stage.</p>
                </div>

                <div className="legal-content">
                    <section>
                        <h2><Heart size={20} /> Our Story</h2>
                        <p>
                            La'verse was born from a simple belief: <strong>everyone has a story worth telling</strong>.
                            In a world overflowing with noise, we wanted to create a space where thoughtful writing thrives —
                            a modern platform where writers can share ideas, experiences, and creativity with a global audience.
                        </p>
                        <p>
                            Founded in 2026 by <strong>lalitheshvijay</strong>, La'verse is more than just a blog platform.
                            It's a community of thinkers, creators, and dreamers who believe in the power of the written word.
                        </p>
                    </section>

                    <section>
                        <h2><Globe size={20} /> Our Mission</h2>
                        <p>
                            To democratize storytelling by providing a beautiful, distraction-free platform where anyone
                            can write, publish, and grow an audience — regardless of their background or technical skill.
                        </p>
                    </section>

                    <section>
                        <h2><Sparkles size={20} /> What Makes Us Different</h2>
                        <div className="about-features-grid">
                            <div className="about-feature">
                                <PenTool size={24} />
                                <h3>Beautiful Writing Experience</h3>
                                <p>A distraction-free editor with markdown support, live preview, and rich formatting tools.</p>
                            </div>
                            <div className="about-feature">
                                <BookOpen size={24} />
                                <h3>Reader-First Design</h3>
                                <p>Clean typography, dark mode, text-to-speech, reading progress, and adjustable font sizes.</p>
                            </div>
                            <div className="about-feature">
                                <Users size={24} />
                                <h3>Community Engagement</h3>
                                <p>Emoji reactions, comments, follows, bookmarks, and sharing — built for meaningful interaction.</p>
                            </div>
                            <div className="about-feature">
                                <Heart size={24} />
                                <h3>Free & Open</h3>
                                <p>No paywalls, no ads, no gimmicks. Just pure writing and reading. Always free.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2><Users size={20} /> Join the Verse</h2>
                        <p>
                            Whether you're a seasoned writer or just getting started, La'verse welcomes you.
                            Create your account, publish your first story, and become part of our growing community.
                        </p>
                        <div style={{ marginTop: '24px' }}>
                            <Link to="/" className="btn-primary">Explore Stories</Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
