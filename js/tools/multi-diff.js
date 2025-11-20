/**
 * Multi-Text Diff Tool
 * Compare multiple texts with word-level precision
 */

import { MultiTextDiff, EnhancedMultiTextDiff } from './diff.js';

export default class MultiDiffTool {
  constructor() {
    this.texts = [];
    this.maxTexts = 10;
    this.minTexts = 2;
  }

  render(container) {
    container.innerHTML = `
      <style>
        .diff-controls {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        
        .diff-input-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .diff-text-wrapper {
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .diff-text-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1.25rem;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
        }
        
        .diff-text-label {
          border: none;
          font-size: 0.9375rem;
          font-weight: 600;
          outline: none;
          flex: 1;
          background: transparent;
          color: var(--text-primary);
        }
        
        .diff-remove-btn {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          font-size: 1.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .diff-remove-btn:hover {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.1);
        }
        
        .diff-textarea {
          flex: 1;
          min-height: 200px;
          padding: 1.25rem;
          border: none;
          font-family: 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .diff-btn {
          padding: 0.625rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .diff-btn-primary {
          background: var(--primary);
          color: white;
        }
        
        .diff-btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }
        
        .diff-btn-secondary {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }
        
        .diff-btn-secondary:hover {
          background: var(--bg-tertiary);
        }
        
        .diff-result-section {
          margin-top: 2rem;
        }
        
        .diff-legend {
          display: flex;
          gap: 2rem;
          padding: 1.25rem;
          background: var(--bg-secondary);
          border-radius: 10px;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
          font-size: 0.875rem;
          border: 1px solid var(--border-color);
        }
        
        .diff-legend-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }
        
        .diff-legend-color {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid;
        }
        
        .diff-display {
          display: grid;
          gap: 1rem;
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          overflow-x: auto;
        }
        
        .diff-column {
          min-width: 300px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          overflow: hidden;
        }
        
        .diff-column-header {
          padding: 1rem;
          background: var(--bg-tertiary);
          border-bottom: 2px solid var(--border-color);
          font-weight: 600;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .diff-content {
          font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
          font-size: 0.8125rem;
          line-height: 1.6;
          max-height: 70vh;
          overflow-y: auto;
        }
        
        .diff-line {
          padding: 0.25rem 0.75rem 0.25rem 1rem;
          border-left: 3px solid transparent;
          white-space: pre-wrap;
          word-break: break-word;
          min-height: 1.5em;
        }
        
        .diff-line.common {
          background: var(--bg-primary);
        }
        
        .diff-line.unique {
          background: #dcfce7;
          border-left-color: #10b981;
        }
        
        [data-theme="dark"] .diff-line.unique {
          background: rgba(16, 185, 129, 0.2);
        }
        
        .diff-line.modified {
          background: #fef3c7;
          border-left-color: #f59e0b;
        }
        
        [data-theme="dark"] .diff-line.modified {
          background: rgba(245, 158, 11, 0.2);
        }
        
        .diff-line.empty {
          background: var(--bg-secondary);
          border-left-color: var(--border-color);
          color: transparent;
        }
        
        .word-diff-change {
          background: #fef08a;
          padding: 0.125em 0.25em;
          border-radius: 3px;
          font-weight: 600;
        }
        
        [data-theme="dark"] .word-diff-change {
          background: rgba(234, 179, 8, 0.4);
        }
      </style>
      
      <div class="diff-controls">
        <button id="addTextBtn" class="diff-btn diff-btn-secondary">+ Add Text</button>
        <button id="compareBtn" class="diff-btn diff-btn-primary">Compare</button>
        <button id="clearBtn" class="diff-btn diff-btn-secondary">Clear All</button>
      </div>
      
      <div id="inputSection" class="diff-input-section"></div>
      
      <div id="resultSection" class="diff-result-section" style="display: none;"></div>
    `;

    this.container = container;
    this.inputSection = container.querySelector('#inputSection');
    this.resultSection = container.querySelector('#resultSection');
    
    this.initEventListeners();
    this.initializeTexts();
  }

  initEventListeners() {
    this.container.querySelector('#addTextBtn').addEventListener('click', () => this.addTextInput());
    this.container.querySelector('#compareBtn').addEventListener('click', () => this.performComparison());
    this.container.querySelector('#clearBtn').addEventListener('click', () => this.clearAll());
  }

  initializeTexts() {
    for (let i = 0; i < this.minTexts; i++) {
      this.addTextInput();
    }
  }

  addTextInput() {
    if (this.texts.length >= this.maxTexts) {
      alert(`Maximum ${this.maxTexts} texts allowed`);
      return;
    }

    const index = this.texts.length;
    const wrapper = document.createElement('div');
    wrapper.className = 'diff-text-wrapper';
    wrapper.dataset.index = index;

    wrapper.innerHTML = `
      <div class="diff-text-header">
        <input type="text" class="diff-text-label" placeholder="Text ${index + 1}" value="Text ${index + 1}">
        ${this.texts.length >= this.minTexts ? '<button class="diff-remove-btn">×</button>' : ''}
      </div>
      <textarea class="diff-textarea" placeholder="Paste or type your text here..."></textarea>
    `;

    const removeBtn = wrapper.querySelector('.diff-remove-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.removeTextInput(index));
    }

    this.inputSection.appendChild(wrapper);
    this.texts.push({ wrapper, label: `Text ${index + 1}`, content: '' });
  }

  removeTextInput(index) {
    const wrapper = this.inputSection.querySelector(`[data-index="${index}"]`);
    if (wrapper) {
      wrapper.remove();
      this.texts.splice(index, 1);
      this.reindexTexts();
    }
  }

  reindexTexts() {
    const wrappers = this.inputSection.querySelectorAll('.diff-text-wrapper');
    this.texts = [];
    wrappers.forEach((wrapper, index) => {
      wrapper.dataset.index = index;
      const label = wrapper.querySelector('.diff-text-label');
      if (!label.value.trim()) {
        label.placeholder = `Text ${index + 1}`;
      }
      this.texts.push({ wrapper, label: label.value || `Text ${index + 1}`, content: '' });
    });
  }

  getTextData() {
    return Array.from(this.inputSection.querySelectorAll('.diff-text-wrapper')).map((wrapper) => {
      const label = wrapper.querySelector('.diff-text-label').value.trim() ||
                    wrapper.querySelector('.diff-text-label').placeholder;
      const content = wrapper.querySelector('.diff-textarea').value;
      return { label, content };
    });
  }

  performComparison() {
    const textData = this.getTextData();
    const nonEmptyTexts = textData.filter((t) => t.content.trim());
    
    if (nonEmptyTexts.length < 2) {
      alert('Please enter at least 2 texts to compare');
      return;
    }

    const contents = textData.map((t) => t.content);
    const labels = textData.map((t) => t.label);

    const differ = new EnhancedMultiTextDiff(contents);
    const results = differ.compare();

    this.displayResults(results, labels);
  }

  displayResults(results, labels) {
    this.resultSection.innerHTML = `
      <div class="diff-legend">
        <div class="diff-legend-item">
          <div class="diff-legend-color" style="background: #dcfce7; border-color: #10b981;"></div>
          <span>Unique</span>
        </div>
        <div class="diff-legend-item">
          <div class="diff-legend-color" style="background: #fef3c7; border-color: #f59e0b;"></div>
          <span>Modified</span>
        </div>
        <div class="diff-legend-item">
          <div class="diff-legend-color" style="background: #fef08a; border-color: #eab308;"></div>
          <span>Word Diff</span>
        </div>
      </div>
      <div class="diff-display" id="diffDisplay"></div>
    `;

    const diffDisplay = this.resultSection.querySelector('#diffDisplay');
    
    for (let i = 0; i < labels.length; i++) {
      const column = document.createElement('div');
      column.className = 'diff-column';

      const header = document.createElement('div');
      header.className = 'diff-column-header';
      header.textContent = labels[i];
      column.appendChild(header);

      const content = document.createElement('div');
      content.className = 'diff-content';

      for (const row of results) {
        const cell = row.cells[i];
        const line = document.createElement('div');
        line.className = `diff-line ${cell.type}`;

        if (cell.exists) {
          if (cell.differentWords && cell.differentWords.size > 0) {
            line.innerHTML = this.renderWithWordHighlight(cell.content, cell.differentWords);
          } else {
            line.textContent = cell.content || ' ';
          }
        } else {
          line.innerHTML = '&nbsp;';
        }

        content.appendChild(line);
      }

      column.appendChild(content);
      diffDisplay.appendChild(column);
    }

    this.resultSection.style.display = 'block';
    this.syncScroll();
  }

  renderWithWordHighlight(text, differentWords) {
    if (!differentWords || differentWords.size === 0) {
      return this.escapeHtml(text);
    }

    const tokens = text.split(/(\s+)/);
    return tokens.map((token) => {
      const escaped = this.escapeHtml(token);
      if (token.trim() && differentWords.has(token.trim())) {
        return `<span class="word-diff-change">${escaped}</span>`;
      }
      return escaped;
    }).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  syncScroll() {
    const columns = this.resultSection.querySelectorAll('.diff-content');
    let isScrolling = false;

    columns.forEach((column) => {
      column.addEventListener('scroll', () => {
        if (isScrolling) return;
        isScrolling = true;
        const scrollTop = column.scrollTop;
        columns.forEach((otherColumn) => {
          if (otherColumn !== column) {
            otherColumn.scrollTop = scrollTop;
          }
        });
        setTimeout(() => { isScrolling = false; }, 10);
      });
    });
  }

  clearAll() {
    if (!confirm('Clear all texts?')) return;
    const textareas = this.inputSection.querySelectorAll('.diff-textarea');
    textareas.forEach((textarea) => { textarea.value = ''; });
    this.resultSection.style.display = 'none';
  }

  cleanup() {
    // Cleanup when navigating away
  }
}

