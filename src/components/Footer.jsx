import React from 'react';
import { Link } from 'react-router-dom';
import LogoImg from '../assets/images/logo.png';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <img src={LogoImg} alt="La'verse Logo" className="footer-logo" />
                    <p className="footer-tagline">Where stories come alive. A modern blogging platform for writers and readers.</p>
                </div>
                <div className="footer-links-group">
                    <div className="footer-col">
                        <h4>Explore</h4>
                        <Link to="/">Home</Link>
                        <Link to="/archives">Archives</Link>
                        <a href="/#trending">Trending</a>
                        <a href="/#topics">Topics</a>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <Link to="/about">About</Link>
                        <Link to="/blog">Blog</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} La'verse. All rights reserved.</p>
                    <p className="footer-credit">Created with ❤️ by <strong>lalitheshvijay</strong></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
