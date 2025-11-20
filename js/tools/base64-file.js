/**
 * Base64 to File Converter Tool
 * Auto-detects file type and provides appropriate download
 */

export default class Base64FileTool {
  render(container) {
    container.innerHTML = `
      <style>
        .b64-file-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .b64-file-textarea {
          min-height: 300px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-family: 'SF Mono', monospace;
          font-size: 0.75rem;
          resize: vertical;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .b64-file-preview {
          padding: 2rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          text-align: center;
        }
        .b64-file-preview img {
          max-width: 100%;
          max-height: 400px;
          border-radius: 8px;
          box-shadow: var(--shadow-md);
        }
        .b64-file-info {
          padding: 1.5rem;
          background: var(--bg-tertiary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid var(--border-color);
        }
        .b64-file-input-group {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .b64-file-input {
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.9375rem;
          flex: 1;
          min-width: 200px;
        }
        .b64-file-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--primary);
          color: white;
        }
        .b64-file-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .b64-file-btn-secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }
        .b64-file-btn-secondary:hover {
          background: var(--bg-secondary);
        }
      </style>
      
      <div class="b64-file-section">
        <div style="font-weight: 600; font-size: 1.125rem;">Base64 Input</div>
        <textarea id="base64Input" class="b64-file-textarea" placeholder="Paste Base64 encoded data here..."></textarea>
        
        <button id="downloadBtn" class="b64-file-btn">💾 Analyze & Download File</button>
        
        <div id="fileInfo" class="b64-file-info" style="display: none;">
          <div style="font-size: 2.5rem;" id="fileIcon">📄</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 1rem;">Detected File Type</div>
            <div style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.25rem;">
              <span id="detectedType"></span> • <span id="detectedSize"></span>
            </div>
          </div>
        </div>
        
        <div id="previewSection" class="b64-file-preview" style="display: none;">
          <div style="font-weight: 600; margin-bottom: 1rem;">Preview</div>
          <img id="imagePreview">
        </div>
        
        <div style="font-weight: 600; font-size: 1.125rem;">File Settings</div>
        <div class="b64-file-input-group">
          <input type="text" id="fileName" class="b64-file-input" placeholder="filename.pdf" value="file">
          <select id="fileExt" class="b64-file-input" style="flex: 0 0 150px;">
            <option value=".pdf">PDF (.pdf)</option>
            <option value=".png">PNG (.png)</option>
            <option value=".jpg">JPG (.jpg)</option>
            <option value=".gif">GIF (.gif)</option>
            <option value=".txt">Text (.txt)</option>
            <option value=".docx">Word (.docx)</option>
            <option value=".xlsx">Excel (.xlsx)</option>
            <option value=".zip">ZIP (.zip)</option>
            <option value="">Custom</option>
          </select>
        </div>
        
        <div style="color: var(--text-secondary); font-size: 0.875rem;">
          💡 Click "Analyze" to auto-detect file type, or manually select the extension
        </div>
      </div>
    `;

    this.base64Input = container.querySelector('#base64Input');
    this.fileName = container.querySelector('#fileName');
    this.fileExt = container.querySelector('#fileExt');
    this.fileInfo = container.querySelector('#fileInfo');
    this.previewSection = container.querySelector('#previewSection');
    this.imagePreview = container.querySelector('#imagePreview');

    container.querySelector('#downloadBtn').addEventListener('click', () => this.analyzeAndDownload());
  }

  analyzeAndDownload() {
    const base64 = this.base64Input.value.trim();
    if (!base64) {
      alert('Please enter Base64 data');
      return;
    }

    // First analyze (silent)
    try {
      this.analyze();
    } catch (error) {
      // If analyze fails, don't proceed to download
      return;
    }
    
    // Then download immediately
    setTimeout(() => {
      this.download();
    }, 100);
  }

  analyze() {
    const base64 = this.base64Input.value.trim();
    if (!base64) {
      alert('Please enter Base64 data');
      return;
    }

    try {
      // Detect MIME type from data URL
      let mimeType = 'application/octet-stream';
      let detectedExt = '';
      
      if (base64.startsWith('data:')) {
        const match = base64.match(/^data:([^;]+);base64,/);
        if (match) {
          mimeType = match[1];
        }
      }

      // Map MIME type to extension
      const mimeMap = {
        'image/png': ['.png', '🖼️'],
        'image/jpeg': ['.jpg', '🖼️'],
        'image/jpg': ['.jpg', '🖼️'],
        'image/gif': ['.gif', '🖼️'],
        'image/webp': ['.webp', '🖼️'],
        'image/svg+xml': ['.svg', '🖼️'],
        'application/pdf': ['.pdf', '📄'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx', '📝'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '📊'],
        'application/zip': ['.zip', '📦'],
        'text/plain': ['.txt', '📝']
      };

      const detected = mimeMap[mimeType] || ['', '📄'];
      detectedExt = detected[0];
      const icon = detected[1];

      // Update UI
      document.getElementById('fileIcon').textContent = icon;
      document.getElementById('detectedType').textContent = mimeType;
      
      // Calculate size
      const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
      const size = Math.round((base64Data.length * 3) / 4);
      document.getElementById('detectedSize').textContent = this.formatFileSize(size);
      
      this.fileInfo.style.display = 'flex';

      // Set extension
      if (detectedExt) {
        this.fileExt.value = detectedExt;
      }

      // Show preview if it's an image
      if (mimeType.startsWith('image/')) {
        this.imagePreview.src = base64;
        this.previewSection.style.display = 'block';
      } else {
        this.previewSection.style.display = 'none';
      }
    } catch (error) {
      alert('Error analyzing file: ' + error.message);
    }
  }

  download() {
    const base64 = this.base64Input.value.trim();
    const filename = this.fileName.value.trim() || 'file';
    const ext = this.fileExt.value || '.pdf';

    if (!base64) {
      alert('Please enter Base64 data');
      return;
    }

    try {
      // Remove data URL prefix if present
      const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
      
      // Convert to binary
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob and download
      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename + ext;
      a.click();
      URL.revokeObjectURL(url);

      alert('File download started! 🎉');
    } catch (error) {
      alert('Error decoding Base64: ' + error.message);
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

