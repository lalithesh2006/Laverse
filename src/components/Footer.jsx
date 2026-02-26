import React from 'react';
import LogoImg from '../assets/images/logo.png';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <img src={LogoImg} alt="La'verse Logo" className="footer-logo" />
                </div>
                <nav className="footer-nav">
                    <a href="#latest">About</a>
                    <a href="#trending">Blog</a>
                    <a href="#topics">Terms</a>
                    <a href="#archive">Privacy</a>
                </nav>
                <div className="footer-copy">
                    <p>© 2026 La'verse. All rights reserved.</p>
                    <p className="footer-credit">Created by <strong>lalitheshvijay</strong></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
