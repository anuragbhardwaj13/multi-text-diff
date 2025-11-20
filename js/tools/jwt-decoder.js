/**
 * JWT Decoder Tool
 */

export default class JWTDecoderTool {
  render(container) {
    container.innerHTML = `
      <style>
        .jwt-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .jwt-textarea {
          min-height: 150px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-family: 'SF Mono', monospace;
          font-size: 0.875rem;
          resize: vertical;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .jwt-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--primary);
          color: white;
          align-self: flex-start;
        }
        .jwt-btn:hover {
          background: var(--primary-hover);
        }
        .jwt-results {
          display: grid;
          gap: 1.5rem;
        }
        .jwt-result-item {
          padding: 1.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        .jwt-result-label {
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--primary);
          font-size: 1.125rem;
        }
        .jwt-result-value {
          font-family: 'SF Mono', monospace;
          font-size: 0.875rem;
          white-space: pre-wrap;
          word-break: break-all;
          color: var(--text-primary);
        }
      </style>
      
      <div class="jwt-section">
        <div style="font-weight: 600;">JWT Token</div>
        <textarea id="jwtInput" class="jwt-textarea" placeholder="Paste JWT token here..."></textarea>
        <button id="decodeBtn" class="jwt-btn">Decode JWT</button>
        
        <div id="jwtResults" class="jwt-results" style="display: none;">
          <div class="jwt-result-item">
            <div class="jwt-result-label">Header</div>
            <div class="jwt-result-value" id="headerResult"></div>
          </div>
          <div class="jwt-result-item">
            <div class="jwt-result-label">Payload</div>
            <div class="jwt-result-value" id="payloadResult"></div>
          </div>
          <div class="jwt-result-item">
            <div class="jwt-result-label">Signature</div>
            <div class="jwt-result-value" id="signatureResult"></div>
          </div>
        </div>
      </div>
    `;

    this.jwtInput = container.querySelector('#jwtInput');
    this.jwtResults = container.querySelector('#jwtResults');

    container.querySelector('#decodeBtn').addEventListener('click', () => this.decode());
  }

  decode() {
    const token = this.jwtInput.value.trim();
    if (!token) {
      alert('Please enter a JWT token');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      document.getElementById('headerResult').textContent = JSON.stringify(header, null, 2);
      document.getElementById('payloadResult').textContent = JSON.stringify(payload, null, 2);
      document.getElementById('signatureResult').textContent = signature;

      this.jwtResults.style.display = 'grid';
    } catch (error) {
      alert('Error decoding JWT: ' + error.message);
    }
  }
}

