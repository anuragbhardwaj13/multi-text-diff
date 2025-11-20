/**
 * Case Converter Tool
 */

export default class CaseConverterTool {
  render(container) {
    container.innerHTML = `
      <style>
        .case-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .case-textarea {
          min-height: 200px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-family: 'SF Mono', monospace;
          font-size: 0.875rem;
          resize: vertical;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .case-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }
        .case-btn {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }
        .case-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
      </style>
      
      <div class="case-section">
        <div style="font-weight: 600;">Input Text</div>
        <textarea id="caseInput" class="case-textarea" placeholder="Enter text to convert..."></textarea>
        
        <div class="case-buttons">
          <button class="case-btn" data-case="upper">UPPERCASE</button>
          <button class="case-btn" data-case="lower">lowercase</button>
          <button class="case-btn" data-case="title">Title Case</button>
          <button class="case-btn" data-case="camel">camelCase</button>
          <button class="case-btn" data-case="pascal">PascalCase</button>
          <button class="case-btn" data-case="snake">snake_case</button>
          <button class="case-btn" data-case="kebab">kebab-case</button>
          <button class="case-btn" data-case="constant">CONSTANT_CASE</button>
        </div>
        
        <div style="font-weight: 600;">Output Text</div>
        <textarea id="caseOutput" class="case-textarea" readonly></textarea>
      </div>
    `;

    this.caseInput = container.querySelector('#caseInput');
    this.caseOutput = container.querySelector('#caseOutput');

    container.querySelectorAll('.case-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const caseType = e.target.dataset.case;
        this.convert(caseType);
      });
    });
  }

  convert(caseType) {
    const text = this.caseInput.value;
    if (!text) {
      alert('Please enter text to convert');
      return;
    }

    let result = '';
    switch (caseType) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'camel':
        result = text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
          if (+match === 0) return '';
          return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
        break;
      case 'pascal':
        result = text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
          if (+match === 0) return '';
          return match.toUpperCase();
        });
        break;
      case 'snake':
        result = text.replace(/\s+/g, '_').replace(/[A-Z]/g, (letter, index) => {
          return index === 0 ? letter.toLowerCase() : '_' + letter.toLowerCase();
        }).replace(/_{2,}/g, '_');
        break;
      case 'kebab':
        result = text.replace(/\s+/g, '-').replace(/[A-Z]/g, (letter, index) => {
          return index === 0 ? letter.toLowerCase() : '-' + letter.toLowerCase();
        }).replace(/-{2,}/g, '-').toLowerCase();
        break;
      case 'constant':
        result = text.replace(/\s+/g, '_').replace(/[A-Z]/g, (letter, index) => {
          return index === 0 ? letter : '_' + letter;
        }).replace(/_{2,}/g, '_').toUpperCase();
        break;
    }

    this.caseOutput.value = result;
  }
}

