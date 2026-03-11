import { useState, useMemo } from 'react';
import { BarChart2, ChevronDown, ChevronUp, Zap, TrendingUp, MessageSquare, AlignLeft } from 'lucide-react';

// Positive/negative word lists for client-side sentiment
const POS_WORDS = new Set(['love','great','amazing','wonderful','beautiful','happy','joy','excellent','fantastic','good','best','better','positive','bright','hope','success','win','perfect','inspiring','exciting','brilliant','outstanding','powerful','creative','innovative','helpful','kind','gentle','peaceful','joyful','wonderful','awesome','magnificent','brilliant','delightful','extraordinary','remarkable','superb','splendid','marvelous','pleasant','glorious','vibrant','radiant','enchanting']);
const NEG_WORDS = new Set(['hate','bad','terrible','awful','horrible','sad','dark','pain','fail','worst','failure','negative','broken','wrong','fear','danger','death','war','crisis','problem','difficult','disaster','tragedy','collapse','corruption','violence','suffering','poverty','struggle','hopeless','desperate','anxious','depressed','angry','frustrated','shattered','haunted','trapped','isolated','abandoned','betrayed','grief','mourning']);

function analyzeSentiment(text) {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    let pos = 0, neg = 0;
    words.forEach(w => {
        if (POS_WORDS.has(w)) pos++;
        if (NEG_WORDS.has(w)) neg++;
    });
    const total = pos + neg || 1;
    const score = Math.round((pos / total) * 100);
    let label, emoji, color;
    if (score >= 65) { label = 'Positive'; emoji = '😊'; color = '#4ECDC4'; }
    else if (score >= 40) { label = 'Neutral'; emoji = '😐'; color = '#FFB800'; }
    else { label = 'Negative'; emoji = '😔'; color = '#FF6B6B'; }
    return { score, label, emoji, color, posCount: pos, negCount: neg };
}

function topWords(text, count = 10) {
    const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','was','are','were','be','been','have','has','had','do','did','does','will','would','could','should','may','might','shall','can','not','that','this','these','those','it','its','they','their','there','then','than','so','as','if','when','where','how','what','which','who','whom','he','she','we','you','i','me','my','your','his','her','our','up','out','into','about','after','before','over','under','again','further','just','more','most','also','some','each','other','only','same','such','even','much','both','while','any','all']);
    const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const freq = {};
    words.forEach(w => { if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, count);
}

function extractKeyPhrases(text) {
    const sentences = text.replace(/<[^>]+>/g, '').split(/[.!?]+/).filter(s => s.trim().length > 20);
    // Score by: position (earlier = more important), length (medium = better), capitalization signals
    const scored = sentences.map((s, i) => ({
        text: s.trim(),
        score: (i === 0 ? 3 : i < 3 ? 2 : 1) + (s.length > 50 && s.length < 200 ? 1 : 0)
    }));
    return scored.sort((a, b) => b.score - a.score).slice(0, 3).map(s => s.text);
}

function readingStats(text) {
    const clean = text.replace(/<[^>]+>/g, '');
    const words = (clean.match(/\b\w+\b/g) || []).length;
    const sentences = (clean.match(/[.!?]+/g) || []).length || 1;
    const syllables = clean.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiou]+/g)?.length || 1;
    const avgWordLength = clean.replace(/[^a-z]/gi, '').length / words;
    const avgSentLen = words / sentences;
    // Flesch Reading Ease
    const ease = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgSentLen - 84.6 * (syllables / words))));
    let level;
    if (ease >= 80) level = 'Very Easy';
    else if (ease >= 60) level = 'Standard';
    else if (ease >= 40) level = 'Difficult';
    else level = 'Very Difficult';
    return { words, sentences, syllables, avgWordLength: avgWordLength.toFixed(1), avgSentLen: Math.round(avgSentLen), ease, level };
}

const StoryInsights = ({ content, title }) => {
    const [open, setOpen] = useState(false);

    const plainText = useMemo(() => (content || '').replace(/<[^>]+>/g, ' '), [content]);
    const sentiment = useMemo(() => analyzeSentiment(plainText), [plainText]);
    const wordFreq = useMemo(() => topWords(plainText), [plainText]);
    const keyPhrases = useMemo(() => extractKeyPhrases(content || ''), [content]);
    const stats = useMemo(() => readingStats(plainText), [plainText]);

    if (!content || plainText.trim().length < 100) return null;

    return (
        <div style={{ border: '1px solid var(--border-color)', borderRadius: 16, background: 'var(--bg-secondary)', marginBottom: 24, overflow: 'hidden' }}>
            <button onClick={() => setOpen(!open)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BarChart2 size={18} style={{ color: 'var(--primary-color)' }} />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>AI Story Insights</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--bg-primary)', borderRadius: 20, color: 'var(--text-secondary)' }}>Client-side AI</span>
                </div>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
                <div style={{ padding: '0 20px 20px' }}>
                    {/* Sentiment */}
                    <div style={{ marginBottom: 20, padding: '16px', background: 'var(--bg-primary)', borderRadius: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <Zap size={16} style={{ color: sentiment.color }} />
                            <span style={{ fontWeight: 600, fontSize: 14 }}>Sentiment Analysis</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{ fontSize: 28 }}>{sentiment.emoji}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700, color: sentiment.color }}>{sentiment.label}</span>
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{sentiment.score}% positive</span>
                                </div>
                                <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 8, overflow: 'hidden' }}>
                                    <div style={{ width: `${sentiment.score}%`, height: '100%', background: sentiment.color, borderRadius: 8, transition: 'width 0.6s ease' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <span style={{ fontSize: 12, color: '#4ECDC4' }}>✓ {sentiment.posCount} positive signals</span>
                            <span style={{ fontSize: 12, color: '#FF6B6B' }}>✗ {sentiment.negCount} negative signals</span>
                        </div>
                    </div>

                    {/* Reading stats */}
                    <div style={{ marginBottom: 20, padding: '16px', background: 'var(--bg-primary)', borderRadius: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <AlignLeft size={16} style={{ color: 'var(--primary-color)' }} />
                            <span style={{ fontWeight: 600, fontSize: 14 }}>Text Statistics</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                            {[
                                { label: 'Words', value: stats.words.toLocaleString() },
                                { label: 'Sentences', value: stats.sentences },
                                { label: 'Avg Sentence', value: `${stats.avgSentLen} words` },
                                { label: 'Reading Ease', value: stats.ease + '/100' },
                                { label: 'Level', value: stats.level },
                                { label: 'Avg Word Len', value: stats.avgWordLength + ' chars' },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-color)' }}>{s.value}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key phrases */}
                    {keyPhrases.length > 0 && (
                        <div style={{ marginBottom: 20, padding: '16px', background: 'var(--bg-primary)', borderRadius: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <MessageSquare size={16} style={{ color: '#A8E6CF' }} />
                                <span style={{ fontWeight: 600, fontSize: 14 }}>Key Sentences</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {keyPhrases.map((p, i) => (
                                    <p key={i} style={{
                                        fontSize: 13, color: 'var(--text-color)', lineHeight: 1.5,
                                        padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8,
                                        borderLeft: `3px solid ${'#4ECDC4,#FFB800,#C3A6FF'.split(',')[i]}`,
                                        margin: 0, fontStyle: 'italic'
                                    }}>
                                        "{p.length > 160 ? p.substring(0, 160) + '…' : p}"
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Word frequency */}
                    {wordFreq.length > 0 && (
                        <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <TrendingUp size={16} style={{ color: '#C3A6FF' }} />
                                <span style={{ fontWeight: 600, fontSize: 14 }}>Most Used Words</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {wordFreq.map(([w, count]) => (
                                    <span key={w} style={{
                                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                        background: `rgba(var(--primary-rgb, 108,99,255), ${Math.min(0.9, 0.2 + count * 0.08)})`,
                                        color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: 4
                                    }}>
                                        {w} <span style={{ opacity: 0.6, fontWeight: 400 }}>×{count}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StoryInsights;
