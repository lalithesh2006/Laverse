import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';

const ShareButtons = ({ title, url }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, url: shareUrl });
            } catch (err) {
                // User cancelled
            }
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = shareUrl;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="share-buttons">
            <span className="share-label">Share</span>
            <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-twitter"
                title="Share on Twitter/X"
            >
                <Twitter size={16} />
            </a>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-facebook"
                title="Share on Facebook"
            >
                <Facebook size={16} />
            </a>
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-linkedin"
                title="Share on LinkedIn"
            >
                <Linkedin size={16} />
            </a>
            <button
                className={`share-btn share-copy ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
                title={copied ? 'Copied!' : 'Copy link'}
            >
                {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            </button>
            {navigator?.share && (
                <button className="share-btn share-native" onClick={handleNativeShare} title="More options">
                    <Share2 size={16} />
                </button>
            )}
        </div>
    );
};

export default ShareButtons;
