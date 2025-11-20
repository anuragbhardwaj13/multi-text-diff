/**
 * Base64 Text Encoder/Decoder Tool
 */

export default class Base64TextTool {
  render(container) {
    container.innerHTML = `
      <style>
        .base64-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .base64-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .base64-label {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .base64-textarea {
          flex: 1;
          min-height: 300px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
          font-size: 0.875rem;
          resize: vertical;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        
        .base64-buttons {
          display: flex;
          gap: 0.75rem;
        }
        
        .base64-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .base64-btn-primary {
          background: var(--primary);
          color: white;
        }
        
        .base64-btn-primary:hover {
          background: var(--primary-hover);
        }
        
        .base64-btn-secondary {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }
        
        .base64-btn-secondary:hover {
          background: var(--bg-tertiary);
        }
        
        @media (max-width: 768px) {
          .base64-container {
            grid-template-columns: 1fr;
          }
        }
      </style>
      
      <div class="base64-container">
        <div class="base64-section">
          <div class="base64-label">Plain Text</div>
          <textarea id="plainText" class="base64-textarea" placeholder="Enter text to encode..."></textarea>
          <div class="base64-buttons">
            <button id="encodeBtn" class="base64-btn base64-btn-primary">Encode →</button>
            <button id="clearLeft" class="base64-btn base64-btn-secondary">Clear</button>
          </div>
        </div>
        
        <div class="base64-section">
          <div class="base64-label">Base64</div>
          <textarea id="base64Text" class="base64-textarea" placeholder="Enter Base64 to decode..."></textarea>
          <div class="base64-buttons">
            <button id="decodeBtn" class="base64-btn base64-btn-primary">← Decode</button>
            <button id="clearRight" class="base64-btn base64-btn-secondary">Clear</button>
          </div>
        </div>
      </div>
    `;

    this.plainText = container.querySelector('#plainText');
    this.base64Text = container.querySelector('#base64Text');

    container.querySelector('#encodeBtn').addEventListener('click', () => this.encode());
    container.querySelector('#decodeBtn').addEventListener('click', () => this.decode());
    container.querySelector('#clearLeft').addEventListener('click', () => this.plainText.value = '');
    container.querySelector('#clearRight').addEventListener('click', () => this.base64Text.value = '');
  }

  encode() {
    try {
      const text = this.plainText.value;
      if (!text) {
        alert('Please enter text to encode');
        return;
      }
      this.base64Text.value = btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      alert('Encoding error: ' + error.message);
    }
  }

  decode() {
    try {
      const base64 = this.base64Text.value.trim();
      if (!base64) {
        alert('Please enter Base64 text to decode');
        return;
      }
      this.plainText.value = decodeURIComponent(escape(atob(base64)));
    } catch (error) {
      alert('Decoding error: Invalid Base64 string');
    }
  }
}

