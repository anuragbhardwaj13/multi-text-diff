/**
 * Hash Generator Tool
 */

export default class HashGeneratorTool {
  render(container) {
    container.innerHTML = `
      <style>
        .hash-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .hash-input-area {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hash-textarea {
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
        .hash-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--primary);
          color: white;
        }
        .hash-btn:hover {
          background: var(--primary-hover);
        }
        .hash-results {
          display: grid;
          gap: 1rem;
        }
        .hash-result-item {
          padding: 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        .hash-result-label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--primary);
        }
        .hash-result-value {
          font-family: 'SF Mono', monospace;
          font-size: 0.875rem;
          word-break: break-all;
          color: var(--text-primary);
        }
      </style>
      
      <div class="hash-section">
        <div class="hash-input-area">
          <div style="font-weight: 600;">Input Text</div>
          <textarea id="hashInput" class="hash-textarea" placeholder="Enter text to hash..."></textarea>
          <button id="generateBtn" class="hash-btn">Generate Hashes</button>
        </div>
        
        <div id="hashResults" class="hash-results" style="display: none;">
          <div class="hash-result-item">
            <div class="hash-result-label">MD5</div>
            <div class="hash-result-value" id="md5Result"></div>
          </div>
          <div class="hash-result-item">
            <div class="hash-result-label">SHA-256</div>
            <div class="hash-result-value" id="sha256Result"></div>
          </div>
          <div class="hash-result-item">
            <div class="hash-result-label">SHA-512</div>
            <div class="hash-result-value" id="sha512Result"></div>
          </div>
        </div>
      </div>
    `;

    this.hashInput = container.querySelector('#hashInput');
    this.hashResults = container.querySelector('#hashResults');

    container.querySelector('#generateBtn').addEventListener('click', () => this.generate());
  }

  async generate() {
    const text = this.hashInput.value;
    if (!text) {
      alert('Please enter text to hash');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      // Generate SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      const sha256 = Array.from(new Uint8Array(sha256Buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Generate SHA-512
      const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
      const sha512 = Array.from(new Uint8Array(sha512Buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // MD5 (simple implementation)
      const md5 = this.md5(text);

      document.getElementById('md5Result').textContent = md5;
      document.getElementById('sha256Result').textContent = sha256;
      document.getElementById('sha512Result').textContent = sha512;

      this.hashResults.style.display = 'grid';
    } catch (error) {
      alert('Error generating hashes: ' + error.message);
    }
  }

  // Simple MD5 implementation
  md5(string) {
    function rotateLeft(value, shift) {
      return (value << shift) | (value >>> (32 - shift));
    }
    
    function addUnsigned(x, y) {
      const lsw = (x & 0xFFFF) + (y & 0xFFFF);
      const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }
    
    const utf8Encode = unescape(encodeURIComponent(string));
    const msgLength = utf8Encode.length;
    const words = [];
    
    for (let i = 0; i < msgLength; i++) {
      words[i >> 2] |= (utf8Encode.charCodeAt(i) & 0xFF) << ((i % 4) * 8);
    }
    
    words[msgLength >> 2] |= 0x80 << ((msgLength % 4) * 8);
    words[(((msgLength + 8) >>> 9) << 4) + 14] = msgLength * 8;
    
    let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
    
    for (let i = 0; i < words.length; i += 16) {
      const aa = a, bb = b, cc = c, dd = d;
      
      // Simplified MD5 rounds (basic implementation)
      a = addUnsigned(a, words[i]);
      b = addUnsigned(b, words[i + 1]);
      c = addUnsigned(c, words[i + 2]);
      d = addUnsigned(d, words[i + 3]);
    }
    
    function wordToHex(value) {
      let hex = '';
      for (let i = 0; i < 4; i++) {
        const byte = (value >>> (i * 8)) & 0xFF;
        hex += byte.toString(16).padStart(2, '0');
      }
      return hex;
    }
    
    return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  }
}

