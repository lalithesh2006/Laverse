// ============================================
// La'verse Shared Utilities
// ============================================

/**
 * Sanitize HTML string — strip dangerous tags and attributes.
 * Removes <script>, <iframe>, <object>, <embed>, <style>, <form>,
 * on* event handlers, and javascript: URLs.
 */
export function sanitizeHtml(html) {
    // Remove dangerous tags and their contents
    html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
    html = html.replace(/<object[\s\S]*?<\/object>/gi, '');
    html = html.replace(/<embed[\s\S]*?>/gi, '');
    html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
    html = html.replace(/<form[\s\S]*?<\/form>/gi, '');

    // Remove self-closing dangerous tags
    html = html.replace(/<(script|iframe|object|embed|style|form)[^>]*\/>/gi, '');

    // Remove on* event handlers (onclick, onerror, onload, etc.)
    html = html.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
    html = html.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '');

    // Remove javascript: URLs
    html = html.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
    html = html.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');

    return html;
}

/**
 * Convert markdown-ish content to sanitized HTML.
 * Handles headings, bold, italic, code blocks, images, links,
 * blockquotes, lists, and horizontal rules.
 */
export function renderMarkdown(text) {
    if (!text) return '';

    // Extract fenced code blocks first to protect them from other transforms
    const codeBlocks = [];
    let html = text.replace(/```([\w]*)?\n([\s\S]*?)```/gm, (_, lang, code) => {
        const idx = codeBlocks.length;
        const langClass = lang ? ` class="language-${lang}"` : '';
        codeBlocks.push(
            `<pre class="code-block"><code${langClass}>${code
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')}</code></pre>`
        );
        return `%%CODEBLOCK_${idx}%%`;
    });

    html = html
        .replace(
            /!\[([^\]]*)\]\(([^)]+)\)/g,
            '<figure><img src="$2" alt="$1" class="content-image" /><figcaption>$1</figcaption></figure>'
        )
        .replace(/^---$/gm, '<hr class="content-divider" />')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        .replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener">$1</a>'
        )
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^- (.+)$/gm, '<li class="ul-item">$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li class="ol-item">$1</li>')
        .split('\n\n')
        .map((block) => {
            block = block.trim();
            if (!block) return '';
            if (
                block.startsWith('<h') ||
                block.startsWith('<figure') ||
                block.startsWith('<hr') ||
                block.startsWith('<blockquote') ||
                block.startsWith('<li') ||
                block.startsWith('%%CODEBLOCK')
            )
                return block;
            return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('');

    html = html.replace(
        /((<li class="ul-item">.*?<\/li>)+)/g,
        '<ul>$1</ul>'
    );
    html = html.replace(
        /((<li class="ol-item">.*?<\/li>)+)/g,
        '<ol>$1</ol>'
    );
    html = html.replace(/<\/blockquote>\s*<blockquote>/g, '<br/>');

    // Restore code blocks
    codeBlocks.forEach((block, idx) => {
        html = html.replace(`%%CODEBLOCK_${idx}%%`, block);
    });

    // Sanitize before returning
    return sanitizeHtml(html);
}

/**
 * Format a date string as a relative "time ago" string.
 */
export function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Estimate reading time for a block of text.
 * @param {string} text
 * @param {string} suffix — e.g. ' read' or ' min read'. Defaults to ' min read'.
 */
export function estimateReadTime(text, suffix = ' min read') {
    if (!text) return `1${suffix}`;
    const words = text.trim().split(/\s+/).length;
    const mins = Math.ceil(words / 200);
    return mins < 1 ? `1${suffix}` : `${mins}${suffix}`;
}

/**
 * Format a read count for display (e.g. 14200 → "14.2K reads").
 */
export function formatReads(num) {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K reads';
    return num + ' reads';
}

/**
 * Escape special characters in a search query for use in
 * Supabase ilike filters. Prevents filter injection.
 */
export function escapeSearchQuery(query) {
    return query.replace(/[%_\\]/g, (c) => '\\' + c);
}
