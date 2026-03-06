import { useMemo } from 'react';
import { BarChart3, BookOpen, Eye } from 'lucide-react';

function calculateReadability(text) {
    if (!text || text.trim().length < 20) return null;

    // Clean markdown
    const clean = text
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
        .replace(/[#*>`~_\-|]/g, '')
        .trim();

    const sentences = clean.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = clean.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) return null;

    const totalSentences = sentences.length;
    const totalWords = words.length;
    const totalSyllables = syllables;

    // Flesch-Kincaid Reading Ease
    const fleschEase = 206.835 - (1.015 * (totalWords / totalSentences)) - (84.6 * (totalSyllables / totalWords));

    // Flesch-Kincaid Grade Level
    const gradeLevel = (0.39 * (totalWords / totalSentences)) + (11.8 * (totalSyllables / totalWords)) - 15.59;

    // Average sentence length
    const avgSentenceLen = Math.round(totalWords / totalSentences);

    return {
        ease: Math.max(0, Math.min(100, Math.round(fleschEase))),
        grade: Math.max(1, Math.round(gradeLevel)),
        words: totalWords,
        sentences: totalSentences,
        avgSentenceLen,
        readTime: Math.ceil(totalWords / 200)
    };
}

function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

function getEaseLabel(ease) {
    if (ease >= 80) return { label: 'Very Easy', color: '#27ae60', emoji: '🟢' };
    if (ease >= 60) return { label: 'Easy', color: '#2ecc71', emoji: '🟢' };
    if (ease >= 40) return { label: 'Moderate', color: '#f39c12', emoji: '🟡' };
    if (ease >= 20) return { label: 'Difficult', color: '#e67e22', emoji: '🟠' };
    return { label: 'Very Difficult', color: '#e74c3c', emoji: '🔴' };
}

function getGradeLabel(grade) {
    if (grade <= 5) return '5th grade or below';
    if (grade <= 8) return `${grade}th grade`;
    if (grade <= 12) return `${grade}th grade`;
    return 'College level';
}

const ReadabilityScore = ({ content }) => {
    const stats = useMemo(() => calculateReadability(content), [content]);

    if (!stats) {
        return (
            <div className="readability-panel readability-empty">
                <BarChart3 size={16} />
                <span>Write more to see readability analysis</span>
            </div>
        );
    }

    const { label, color, emoji } = getEaseLabel(stats.ease);

    return (
        <div className="readability-panel">
            <div className="readability-header">
                <BarChart3 size={16} />
                <span>Readability</span>
            </div>

            <div className="readability-score-row">
                <div className="readability-gauge" style={{ '--score-color': color }}>
                    <span className="readability-num">{stats.ease}</span>
                    <span className="readability-max">/100</span>
                </div>
                <div className="readability-label">
                    <span>{emoji} {label}</span>
                    <span className="readability-grade">
                        <Eye size={12} /> {getGradeLabel(stats.grade)}
                    </span>
                </div>
            </div>

            <div className="readability-details">
                <div className="readability-stat">
                    <span className="readability-stat-val">{stats.words}</span>
                    <span className="readability-stat-key">words</span>
                </div>
                <div className="readability-stat">
                    <span className="readability-stat-val">{stats.sentences}</span>
                    <span className="readability-stat-key">sentences</span>
                </div>
                <div className="readability-stat">
                    <span className="readability-stat-val">{stats.avgSentenceLen}</span>
                    <span className="readability-stat-key">avg length</span>
                </div>
                <div className="readability-stat">
                    <span className="readability-stat-val">{stats.readTime}m</span>
                    <span className="readability-stat-key">read time</span>
                </div>
            </div>

            {stats.avgSentenceLen > 25 && (
                <div className="readability-tip">💡 Try shorter sentences for better readability</div>
            )}
            {stats.ease < 40 && (
                <div className="readability-tip">💡 Consider using simpler words and shorter paragraphs</div>
            )}
        </div>
    );
};

export default ReadabilityScore;
