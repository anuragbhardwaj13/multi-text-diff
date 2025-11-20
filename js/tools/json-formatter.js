/**
 * JSON Formatter with Collapsible Tree View
 */

export default class JSONFormatterTool {
  constructor() {
    this.treeMode = false;
  }

  render(container) {
    container.innerHTML = `
      <style>
        .json-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .json-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        .json-toggle input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .json-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .json-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .json-textarea {
          min-height: 400px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-family: 'SF Mono', monospace;
          font-size: 0.875rem;
          resize: vertical;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .json-tree {
          min-height: 400px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          overflow: auto;
          font-family: 'SF Mono', monospace;
          font-size: 0.875rem;
        }
        .json-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--primary);
          color: white;
        }
        .json-btn:hover {
          background: var(--primary-hover);
        }
        .json-tree-node {
          margin-left: 1.5rem;
        }
        .json-tree-key {
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
        }
        .json-tree-string { color: #10b981; }
        .json-tree-number { color: #f59e0b; }
        .json-tree-boolean { color: #8b5cf6; }
        .json-tree-null { color: var(--text-tertiary); }
        .json-tree-toggle {
          cursor: pointer;
          user-select: none;
          display: inline-block;
          width: 20px;
        }
        .json-tree-collapsed { display: none; }
        @media (max-width: 768px) {
          .json-grid { grid-template-columns: 1fr; }
        }
      </style>
      
      <div class="json-controls">
        <label class="json-toggle">
          <input type="checkbox" id="treeToggle">
          <span>Enable Tree View</span>
        </label>
        <button id="formatBtn" class="json-btn">Format JSON</button>
        <button id="minifyBtn" class="json-btn">Minify JSON</button>
      </div>
      
      <div class="json-grid">
        <div class="json-section">
          <div style="font-weight: 600;">Input JSON</div>
          <textarea id="jsonInput" class="json-textarea" placeholder='{"key": "value"}'></textarea>
        </div>
        <div class="json-section">
          <div style="font-weight: 600;">Output</div>
          <textarea id="jsonOutput" class="json-textarea" readonly style="display: block;"></textarea>
          <div id="jsonTree" class="json-tree" style="display: none;"></div>
        </div>
      </div>
    `;

    this.jsonInput = container.querySelector('#jsonInput');
    this.jsonOutput = container.querySelector('#jsonOutput');
    this.jsonTree = container.querySelector('#jsonTree');
    this.treeToggle = container.querySelector('#treeToggle');

    container.querySelector('#formatBtn').addEventListener('click', () => this.format());
    container.querySelector('#minifyBtn').addEventListener('click', () => this.minify());
    this.treeToggle.addEventListener('change', (e) => {
      this.treeMode = e.target.checked;
      this.toggleView();
    });
  }

  toggleView() {
    if (this.treeMode) {
      this.jsonOutput.style.display = 'none';
      this.jsonTree.style.display = 'block';
      this.format();
    } else {
      this.jsonOutput.style.display = 'block';
      this.jsonTree.style.display = 'none';
    }
  }

  format() {
    try {
      const json = JSON.parse(this.jsonInput.value);
      if (this.treeMode) {
        this.jsonTree.innerHTML = this.renderTree(json);
        this.attachTreeEvents();
      } else {
        this.jsonOutput.value = JSON.stringify(json, null, 2);
      }
    } catch (error) {
      alert('Invalid JSON: ' + error.message);
    }
  }

  minify() {
    try {
      const json = JSON.parse(this.jsonInput.value);
      this.jsonOutput.value = JSON.stringify(json);
      this.treeMode = false;
      this.treeToggle.checked = false;
      this.toggleView();
    } catch (error) {
      alert('Invalid JSON: ' + error.message);
    }
  }

  renderTree(obj, key = null) {
    if (obj === null) {
      return `<span class="json-tree-null">null</span>`;
    }
    
    const type = typeof obj;
    
    if (type === 'string') {
      return `<span class="json-tree-string">"${this.escapeHtml(obj)}"</span>`;
    }
    if (type === 'number') {
      return `<span class="json-tree-number">${obj}</span>`;
    }
    if (type === 'boolean') {
      return `<span class="json-tree-boolean">${obj}</span>`;
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const id = Math.random().toString(36).substr(2, 9);
      let html = `<span class="json-tree-toggle" data-id="${id}">▼</span>[<div class="json-tree-node" id="node-${id}">`;
      obj.forEach((item, i) => {
        html += this.renderTree(item);
        if (i < obj.length - 1) html += ',';
        html += '<br>';
      });
      html += '</div>]';
      return html;
    }
    
    if (type === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      const id = Math.random().toString(36).substr(2, 9);
      let html = `<span class="json-tree-toggle" data-id="${id}">▼</span>{<div class="json-tree-node" id="node-${id}">`;
      keys.forEach((k, i) => {
        html += `<span class="json-tree-key">"${this.escapeHtml(k)}"</span>: `;
        html += this.renderTree(obj[k], k);
        if (i < keys.length - 1) html += ',';
        html += '<br>';
      });
      html += '</div>}';
      return html;
    }
    
    return String(obj);
  }

  attachTreeEvents() {
    this.jsonTree.querySelectorAll('.json-tree-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const node = document.getElementById(`node-${id}`);
        if (node.classList.contains('json-tree-collapsed')) {
          node.classList.remove('json-tree-collapsed');
          e.target.textContent = '▼';
        } else {
          node.classList.add('json-tree-collapsed');
          e.target.textContent = '▶';
        }
      });
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

