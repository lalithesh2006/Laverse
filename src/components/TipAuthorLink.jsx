import { Coffee } from 'lucide-react';

const TipAuthorLink = ({ tipLink, authorName }) => {
    if (!tipLink) return null;

    // Optional: Extract platform name based on URL
    let platformName = "Support the Author";
    if (tipLink.includes('buymeacoffee.com')) platformName = "Buy me a coffee";
    else if (tipLink.includes('ko-fi.com')) platformName = "Support on Ko-fi";
    else if (tipLink.includes('patreon.com')) platformName = "Support on Patreon";
    else if (tipLink.includes('stripe.com')) platformName = "Tip via Stripe";

    return (
        <div style={{
            marginTop: '32px',
            marginBottom: '16px',
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px'
        }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Enjoyed this story?</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>
                If you found value in {authorName}'s writing, consider supporting their work directly.
            </p>

            <a
                href={tipLink.startsWith('http') ? tipLink : `https://${tipLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    padding: '10px 24px'
                }}
            >
                <Coffee size={18} />
                {platformName}
            </a>
        </div>
    );
};

export default TipAuthorLink;
