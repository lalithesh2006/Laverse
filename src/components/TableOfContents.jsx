import { useState, useEffect } from 'react';
import { List } from 'lucide-react';

const TableOfContents = ({ content }) => {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (!content) return;
        // Extract headings from markdown content
        const lines = content.split('\n');
        const extracted = [];
        lines.forEach((line, index) => {
            const match = line.match(/^(#{1,3})\s+(.+)/);
            if (match) {
                const level = match[1].length;
                const text = match[2].replace(/\*\*/g, '').replace(/\*/g, '').trim();
                const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                extracted.push({ level, text, id });
            }
        });
        setHeadings(extracted);
    }, [content]);

    // Observe rendered headings for scroll highlight
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter(e => e.isIntersecting);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
        );

        // Find rendered heading elements
        const articleEl = document.querySelector('.story-body');
        if (articleEl) {
            const h1s = articleEl.querySelectorAll('h1, h2, h3');
            h1s.forEach((el, i) => {
                if (!el.id) {
                    const text = el.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    el.id = `heading-${i}-${text}`;
                }
                observer.observe(el);
            });
        }

        return () => observer.disconnect();
    }, [headings]);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (headings.length < 2) return null;

    return (
        <nav className={`toc ${collapsed ? 'toc-collapsed' : ''}`}>
            <button className="toc-header" onClick={() => setCollapsed(!collapsed)}>
                <List size={16} />
                <span>Table of Contents</span>
            </button>
            {!collapsed && (
                <ul className="toc-list">
                    {headings.map((h) => (
                        <li key={h.id} className={`toc-item toc-level-${h.level} ${activeId === h.id ? 'toc-active' : ''}`}>
                            <button onClick={() => scrollTo(h.id)}>{h.text}</button>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

export default TableOfContents;
