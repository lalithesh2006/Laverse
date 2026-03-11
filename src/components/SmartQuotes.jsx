import { useState, useMemo } from 'react';
import { Quote, Twitter, Copy, ChevronDown, ChevronUp, Check } from 'lucide-react';

/**
 * SmartQuotes — extracts the most "quotable" sentences from a story.
 * Scoring heuristic: length 60-180 chars, contains strong words,
 * doesn't start with "The/A/An", ends with punctuation.
 */

const STRONG_PATTERNS = [
    /\b(always|never|every|truth|life|love|hope|dream|believe|imagine|remember|greatest|nothing|everything|beauty|courage|fear|power|change|world|soul|heart|time|moment|silence|freedom|wisdom|journey|destiny|wonder)\b/i,
    /\b(must|should|can't|cannot|won't|will|shall)\b/i,
];

function scoreQuotability(sentence) {
    let score = 0;
    const len = sentence.length;
    if (len >= 60 && len <= 180) score += 3;
    else if (len >= 40 && len < 60) score += 1;
    else if (len > 180) score -= 1;
    STRONG_PATTERNS.forEach(p => { if (p.test(sentence)) score += 2; });
    if (/^(The|A|An|I|He|She|They|It|In|On|At|To|From)\s/.test(sentence)) score -= 1;
    if (/[.!?]$/.test(sentence)) score += 1;
    if (/[,;—–]/.test(sentence)) score += 1; // complex = more quotable
    if (/^\d/.test(sentence)) score -= 2;
    return score;
}

function extractQuotes(content) {
    const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const sentences = plain.match(/[^.!?]{30,}[.!?]/g) || [];
    return sentences
        .map(s => ({ text: s.trim(), score: scoreQuotability(s.trim()) }))
        .filter(s => s.score >= 2)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(s => s.text);
}

const SmartQuotes = ({ content, title, author }) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(null);

    const quotes = useMemo(() => extractQuotes(content || ''), [content]);

    if (quotes.length === 0) return null;

    const copyQuote = (text, i) => {
        navigator.clipboard.writeText(`"${text}" — ${author || 'La\'verse'}`).then(() => {
            setCopied(i);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const tweetQuote = (text) => {
        const t = encodeURIComponent(`"${text}" — via La'verse\n${window.location.href}`);
        window.open(`https://twitter.com/intent/tweet?text=${t}`, '_blank');
    };

    return (
        <div style={{ border: '1px solid var(--border-color)', borderRadius: 16, background: 'var(--bg-secondary)', marginBottom: 24, overflow: 'hidden' }}>
            <button onClick={() => setOpen(!open)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Quote size={18} style={{ color: '#FFB800' }} />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>Smart Quotes</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--bg-primary)', borderRadius: 20, color: 'var(--text-secondary)' }}>
                        {quotes.length} extracted
                    </span>
                </div>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
                <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 4px', fontStyle: 'italic' }}>
                        AI-selected most shareable sentences from this story
                    </p>
                    {quotes.map((quote, i) => (
                        <div key={i} style={{
                            padding: '16px 18px', background: 'var(--bg-primary)', borderRadius: 12,
                            borderLeft: '4px solid var(--primary-color)', position: 'relative'
                        }}>
                            <p style={{ fontSize: 15, fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-color)', margin: '0 0 12px' }}>
                                "{quote}"
                            </p>
                            {author && <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 10px' }}>— {author}</p>}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => copyQuote(quote, i)} style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    background: copied === i ? '#4ECDC422' : 'var(--bg-secondary)',
                                    border: `1px solid ${copied === i ? '#4ECDC4' : 'var(--border-color)'}`,
                                    borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
                                    color: copied === i ? '#4ECDC4' : 'var(--text-color)', fontSize: 12
                                }}>
                                    {copied === i ? <Check size={12} /> : <Copy size={12} />}
                                    {copied === i ? 'Copied!' : 'Copy'}
                                </button>
                                <button onClick={() => tweetQuote(quote)} style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    background: '#1DA1F222', border: '1px solid #1DA1F2',
                                    borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
                                    color: '#1DA1F2', fontSize: 12
                                }}>
                                    <Twitter size={12} /> Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SmartQuotes;
