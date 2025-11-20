/**
 * File to Base64 Converter Tool
 * Handles all file types including images, PDFs, documents, etc.
 */

export default class FileBase64Tool {
  render(container) {
    container.innerHTML = `
      <style>
        .file-b64-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .file-upload-area {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: var(--bg-secondary);
        }
        .file-upload-area:hover {
          border-color: var(--primary);
          background: var(--bg-tertiary);
          transform: scale(1.01);
        }
        .file-upload-area.dragover {
          border-color: var(--primary);
          background: var(--bg-tertiary);
          box-shadow: var(--shadow-md);
        }
        .file-preview {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          margin: 1rem 0;
          box-shadow: var(--shadow-md);
        }
        .file-info {
          padding: 1.5rem;
          background: var(--bg-tertiary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid var(--border-color);
        }
        .file-b64-textarea {
          min-height: 250px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-family: 'SF Mono', monospace;
          font-size: 0.75rem;
          resize: vertical;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .file-b64-btn {
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
        .file-b64-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      </style>
      
      <div class="file-b64-section">
        <div style="font-weight: 600; font-size: 1.125rem;">Upload File</div>
        <div class="file-upload-area" id="uploadArea">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📁</div>
          <div style="font-size: 1.125rem; font-weight: 500; margin-bottom: 0.5rem;">
            Drop file here or click to upload
          </div>
          <div style="color: var(--text-secondary); font-size: 0.875rem;">
            Supports all file types: Images, PDFs, Documents, etc.
          </div>
          <input type="file" id="fileInput" style="display: none;">
        </div>
        
        <div id="previewSection" style="display: none;">
          <img id="filePreview" class="file-preview" style="display: none;">
        </div>
        
        <div id="fileInfo" class="file-info" style="display: none;">
          <div style="font-size: 2.5rem;">📄</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 1rem;" id="fileInfoName"></div>
            <div style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.25rem;">
              <span id="fileInfoSize"></span> • <span id="fileInfoType"></span>
            </div>
          </div>
        </div>
        
        <div style="font-weight: 600; font-size: 1.125rem;">Base64 Output</div>
        <textarea id="base64Output" class="file-b64-textarea" readonly placeholder="Base64 encoded output will appear here..."></textarea>
        <button id="copyBtn" class="file-b64-btn" style="display: none;">📋 Copy Base64</button>
      </div>
    `;

    this.uploadArea = container.querySelector('#uploadArea');
    this.fileInput = container.querySelector('#fileInput');
    this.filePreview = container.querySelector('#filePreview');
    this.fileInfo = container.querySelector('#fileInfo');
    this.base64Output = container.querySelector('#base64Output');
    this.previewSection = container.querySelector('#previewSection');
    this.copyBtn = container.querySelector('#copyBtn');

    this.uploadArea.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this.handleFile(e.target.files[0]));
    
    // Drag and drop
    this.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadArea.classList.add('dragover');
    });
    this.uploadArea.addEventListener('dragleave', () => {
      this.uploadArea.classList.remove('dragover');
    });
    this.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadArea.classList.remove('dragover');
      this.handleFile(e.dataTransfer.files[0]);
    });

    this.copyBtn.addEventListener('click', () => {
      this.base64Output.select();
      document.execCommand('copy');
      alert('Base64 copied to clipboard! ✅');
    });
  }

  handleFile(file) {
    if (!file) return;

    // Display file info
    document.getElementById('fileInfoName').textContent = file.name;
    document.getElementById('fileInfoSize').textContent = this.formatFileSize(file.size);
    document.getElementById('fileInfoType').textContent = file.type || 'Unknown type';
    this.fileInfo.style.display = 'flex';

    // Show preview if it's an image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.filePreview.src = e.target.result;
        this.filePreview.style.display = 'block';
        this.previewSection.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      this.filePreview.style.display = 'none';
      this.previewSection.style.display = 'none';
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      this.base64Output.value = base64;
      this.copyBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

