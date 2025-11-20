/**
 * XML Formatter Tool
 */

export default class XMLFormatterTool {
  render(container) {
    container.innerHTML = `
      <style>
        .xml-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .xml-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .xml-textarea {
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
        .xml-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--primary);
          color: white;
        }
        .xml-btn:hover {
          background: var(--primary-hover);
        }
        .xml-buttons {
          display: flex;
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .xml-grid { grid-template-columns: 1fr; }
        }
      </style>
      
      <div class="xml-grid">
        <div class="xml-section">
          <div style="font-weight: 600;">Input XML</div>
          <textarea id="xmlInput" class="xml-textarea" placeholder="<root><element>value</element></root>"></textarea>
          <div class="xml-buttons">
            <button id="formatBtn" class="xml-btn">Format XML</button>
            <button id="minifyBtn" class="xml-btn">Minify XML</button>
          </div>
        </div>
        <div class="xml-section">
          <div style="font-weight: 600;">Output XML</div>
          <textarea id="xmlOutput" class="xml-textarea" readonly></textarea>
        </div>
      </div>
    `;

    this.xmlInput = container.querySelector('#xmlInput');
    this.xmlOutput = container.querySelector('#xmlOutput');

    container.querySelector('#formatBtn').addEventListener('click', () => this.format());
    container.querySelector('#minifyBtn').addEventListener('click', () => this.minify());
  }

  format() {
    try {
      const xml = this.xmlInput.value.trim();
      if (!xml) {
        alert('Please enter XML to format');
        return;
      }
      this.xmlOutput.value = this.formatXML(xml);
    } catch (error) {
      alert('Error formatting XML: ' + error.message);
    }
  }

  minify() {
    try {
      const xml = this.xmlInput.value.trim();
      if (!xml) {
        alert('Please enter XML to minify');
        return;
      }
      this.xmlOutput.value = xml.replace(/>\s+</g, '><').trim();
    } catch (error) {
      alert('Error minifying XML: ' + error.message);
    }
  }

  formatXML(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;
    
    xml = xml.replace(reg, '$1\n$2$3');
    
    return xml.split('\n').map((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      
      const padding = PADDING.repeat(pad);
      pad += indent;
      
      return padding + node;
    }).join('\n');
  }
}

