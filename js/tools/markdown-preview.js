/**
 * Markdown Preview Tool
 */

export default class MarkdownPreviewTool {
  render(container) {
    container.innerHTML = `
      <style>
        .markdown-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .markdown-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .markdown-textarea {
          min-height: 500px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-family: 'SF Mono', monospace;
          font-size: 0.875rem;
          resize: vertical;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .markdown-preview {
          min-height: 500px;
          padding: 2rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-primary);
          color: var(--text-primary);
          overflow-y: auto;
        }
        .markdown-preview h1 { font-size: 2rem; margin: 1rem 0; }
        .markdown-preview h2 { font-size: 1.5rem; margin: 1rem 0; }
        .markdown-preview h3 { font-size: 1.25rem; margin: 0.75rem 0; }
        .markdown-preview p { margin: 0.75rem 0; line-height: 1.6; }
        .markdown-preview code {
          background: var(--bg-secondary);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'SF Mono', monospace;
        }
        .markdown-preview pre {
          background: var(--bg-secondary);
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
        }
        .markdown-preview blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 1rem;
          margin: 1rem 0;
          color: var(--text-secondary);
        }
        .markdown-preview ul, .markdown-preview ol {
          margin: 0.75rem 0;
          padding-left: 2rem;
        }
        .markdown-preview a {
          color: var(--primary);
          text-decoration: none;
        }
        .markdown-preview a:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .markdown-container { grid-template-columns: 1fr; }
        }
      </style>
      
      <div class="markdown-container">
        <div class="markdown-section">
          <div style="font-weight: 600;">Markdown</div>
          <textarea id="markdownInput" class="markdown-textarea" placeholder="# Heading&#10;&#10;**Bold text**&#10;&#10;- List item"></textarea>
        </div>
        <div class="markdown-section">
          <div style="font-weight: 600;">Preview</div>
          <div id="markdownPreview" class="markdown-preview"></div>
        </div>
      </div>
    `;

    this.markdownInput = container.querySelector('#markdownInput');
    this.markdownPreview = container.querySelector('#markdownPreview');

    this.markdownInput.addEventListener('input', () => this.preview());
    this.preview();
  }

  preview() {
    const markdown = this.markdownInput.value;
    this.markdownPreview.innerHTML = this.parseMarkdown(markdown);
  }

  parseMarkdown(md) {
    // Basic markdown parser
    let html = md;

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Lists
    html = html.replace(/^\* (.+)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/^\- (.+)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/^\d+\. (.+)/gim, '<ol><li>$1</li></ol>');

    // Blockquotes
    html = html.replace(/^&gt; (.+)/gim, '<blockquote>$1</blockquote>');

    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }

    return html;
  }
}

