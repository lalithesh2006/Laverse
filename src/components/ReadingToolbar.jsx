import { useState, useEffect } from 'react';
import { BookOpen, Type, Minus, Plus, Download, XCircle } from 'lucide-react';

const ReadingToolbar = ({ title, content }) => {
    const [fontSize, setFontSize] = useState(100); // percentage
    const [readingMode, setReadingMode] = useState(false);

    // Clean up reading-mode class when component unmounts (e.g. navigate away)
    useEffect(() => {
        return () => {
            document.body.classList.remove('reading-mode');
        };
    }, []);

    const changeFontSize = (delta) => {
        const newSize = Math.min(150, Math.max(75, fontSize + delta));
        setFontSize(newSize);
        const article = document.querySelector('.story-body');
        if (article) article.style.fontSize = `${newSize}%`;
    };

    const toggleReadingMode = () => {
        setReadingMode(!readingMode);
        document.body.classList.toggle('reading-mode', !readingMode);
    };

    const exportMarkdown = () => {
        if (!content) return;
        const blob = new Blob([`# ${title || 'Untitled'}\n\n${content}`], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(title || 'story').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="reading-toolbar">
            {/* Font Size */}
            <div className="reading-tool-group">
                <button className="reading-tool-btn" onClick={() => changeFontSize(-10)} title="Decrease font">
                    <Minus size={14} />
                </button>
                <span className="reading-tool-label"><Type size={14} /> {fontSize}%</span>
                <button className="reading-tool-btn" onClick={() => changeFontSize(10)} title="Increase font">
                    <Plus size={14} />
                </button>
            </div>

            <span className="reading-toolbar-divider" />

            {/* Reading Mode */}
            <button
                className={`reading-tool-btn ${readingMode ? 'active' : ''}`}
                onClick={toggleReadingMode}
                title={readingMode ? 'Exit reading mode' : 'Reading mode'}
            >
                {readingMode ? <XCircle size={16} /> : <BookOpen size={16} />}
                <span>{readingMode ? 'Exit' : 'Focus'}</span>
            </button>

            <span className="reading-toolbar-divider" />

            {/* Export */}
            <button className="reading-tool-btn" onClick={exportMarkdown} title="Download as Markdown">
                <Download size={16} /> <span>Export</span>
            </button>
        </div>
    );
};

export default ReadingToolbar;
