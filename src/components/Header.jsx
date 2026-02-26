import React from 'react';
import LogoImg from '../assets/images/logo.png';

const Header = ({ onAuthClick }) => {
    return (
        <header className="app-header">
            <div className="container header-inner">
                <a href="/" className="logo-link">
                    <img src={LogoImg} alt="La'verse Logo" className="brand-logo" />
                </a>
                <nav className="nav-links">
                    <a href="#latest" className="nav-link">Latest</a>
                    <a href="#trending" className="nav-link">Trending</a>
                    <a href="#topics" className="nav-link">Topics</a>
                    <a href="#archive" className="nav-link">Archive</a>
                    <button className="btn-primary" onClick={onAuthClick}>
                        Get Started
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
