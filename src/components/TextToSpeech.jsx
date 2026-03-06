import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, RotateCcw } from 'lucide-react';

const TextToSpeech = ({ text, title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [rate, setRate] = useState(1);
    const [isSupported, setIsSupported] = useState(true);

    // Use refs to avoid stale closure in utterance callbacks
    const isPlayingRef = useRef(false);
    const isPausedRef = useRef(false);

    // We split text into chunks because some browsers have a length limit on speech synthesis
    const chunksRef = useRef([]);
    const currentChunkIndexRef = useRef(0);

    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            setIsSupported(false);
            return;
        }

        const populateVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            // Try to find a good default English voice
            const defaultVoice = availableVoices.find(v => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Eng'))) || availableVoices[0];
            if (defaultVoice) setSelectedVoice(defaultVoice);
        };

        populateVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoices;
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // Split text into manageable sentences to avoid browser limits
    const splitTextIntoChunks = (textToAnalyse) => {
        // Remove markdown tokens for better reading
        let cleanText = textToAnalyse
            .replace(/[#*`_\[\]()]/g, '')
            .replace(/!\[.*?\]/g, '')
            .replace(/\n+/g, '. '); // Replace newlines with periods for pausing

        // Add title as the first chunk
        cleanText = `${title}. . ` + cleanText;

        // Split by sentences roughly
        const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

        // Combine short sentences into chunks of max ~200 chars
        const chunks = [];
        let currentChunk = '';

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length > 200) {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += ' ' + sentence;
            }
        }
        if (currentChunk) chunks.push(currentChunk.trim());

        return chunks.filter(c => c.length > 0);
    };

    const speakChunk = () => {
        if (currentChunkIndexRef.current >= chunksRef.current.length) {
            handleStop();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(chunksRef.current[currentChunkIndexRef.current]);

        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = 1;

        utterance.onend = () => {
            currentChunkIndexRef.current += 1;
            const newProgress = (currentChunkIndexRef.current / chunksRef.current.length) * 100;
            setProgress(newProgress);

            // Use refs instead of stale state closures
            if (isPlayingRef.current && !isPausedRef.current) {
                speakChunk();
            }
        };

        utterance.onerror = (e) => {
            console.error('Speech synthesis error', e);
            handleStop();
        };

        window.speechSynthesis.speak(utterance);
    };

    const handlePlay = () => {
        if (!text) return;

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            isPausedRef.current = false;
            setIsPlaying(true);
            isPlayingRef.current = true;
            return;
        }

        if (isPlaying) return;

        // Fresh start
        chunksRef.current = splitTextIntoChunks(text);
        currentChunkIndexRef.current = 0;
        setProgress(0);
        setIsPlaying(true);
        isPlayingRef.current = true;
        setIsPaused(false);
        isPausedRef.current = false;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        speakChunk();
    };

    const handlePause = () => {
        if (isPlaying && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            isPausedRef.current = true;
            setIsPlaying(false);
            isPlayingRef.current = false;
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsPaused(false);
        isPausedRef.current = false;
        setProgress(0);
        currentChunkIndexRef.current = 0;
    };

    const handleRestart = () => {
        handleStop();
        // Slight delay to ensure cancel propagation
        setTimeout(handlePlay, 100);
    };

    const toggleRate = () => {
        const newRate = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 2 : 1;
        setRate(newRate);

        if (isPlaying && !isPaused) {
            handleRestart();
        }
    };

    if (!isSupported) return null;

    return (
        <div className="tts-container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            marginBottom: '24px',
            transition: 'all 0.3s ease'
        }}>
            <div className="tts-icon" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
            }}>
                <Volume2 size={20} />
            </div>

            <div className="tts-controls" style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                        Listen to this article
                    </span>
                    <button
                        onClick={toggleRate}
                        disabled={isPlaying || isPaused}
                        style={{
                            background: 'none',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '2px 8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        {rate}x
                    </button>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: 'var(--primary-color)',
                        transition: 'width 0.3s ease'
                    }} />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {!isPlaying ? (
                        <button onClick={handlePlay} className="btn-secondary btn-sm" style={{ padding: '4px 12px' }}>
                            <Play size={14} style={{ marginRight: '4px' }} /> Play
                        </button>
                    ) : (
                        <button onClick={handlePause} className="btn-secondary btn-sm" style={{ padding: '4px 12px' }}>
                            <Pause size={14} style={{ marginRight: '4px' }} /> Pause
                        </button>
                    )}

                    {(isPlaying || isPaused) && (
                        <>
                            <button onClick={handleStop} className="btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                                <Square size={14} />
                            </button>
                            <button onClick={handleRestart} className="btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                                <RotateCcw size={14} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextToSpeech;
