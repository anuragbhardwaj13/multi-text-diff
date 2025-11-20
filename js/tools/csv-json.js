/**
 * CSV ↔ JSON Converter Tool
 */

export default class CSVJSONTool {
  render(container) {
    container.innerHTML = `
      <style>
        .csv-json-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .csv-json-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .csv-json-textarea {
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
        .csv-json-buttons {
          display: flex;
          gap: 0.75rem;
        }
        .csv-json-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--primary);
          color: white;
        }
        .csv-json-btn:hover {
          background: var(--primary-hover);
        }
        @media (max-width: 768px) {
          .csv-json-container { grid-template-columns: 1fr; }
        }
      </style>
      
      <div class="csv-json-container">
        <div class="csv-json-section">
          <div style="font-weight: 600;">CSV</div>
          <textarea id="csvInput" class="csv-json-textarea" placeholder="name,age,city&#10;John,30,NYC"></textarea>
          <div class="csv-json-buttons">
            <button id="csvToJson" class="csv-json-btn">CSV → JSON</button>
          </div>
        </div>
        <div class="csv-json-section">
          <div style="font-weight: 600;">JSON</div>
          <textarea id="jsonInput" class="csv-json-textarea" placeholder='[{"name":"John","age":30}]'></textarea>
          <div class="csv-json-buttons">
            <button id="jsonToCsv" class="csv-json-btn">JSON → CSV</button>
          </div>
        </div>
      </div>
    `;

    this.csvInput = container.querySelector('#csvInput');
    this.jsonInput = container.querySelector('#jsonInput');

    container.querySelector('#csvToJson').addEventListener('click', () => this.csvToJson());
    container.querySelector('#jsonToCsv').addEventListener('click', () => this.jsonToCsv());
  }

  csvToJson() {
    try {
      const csv = this.csvInput.value.trim();
      if (!csv) {
        alert('Please enter CSV data');
        return;
      }

      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const obj = {};
        const values = lines[i].split(',').map(v => v.trim());
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        result.push(obj);
      }

      this.jsonInput.value = JSON.stringify(result, null, 2);
    } catch (error) {
      alert('Error converting CSV to JSON: ' + error.message);
    }
  }

  jsonToCsv() {
    try {
      const json = JSON.parse(this.jsonInput.value);
      if (!Array.isArray(json) || json.length === 0) {
        alert('Please enter a valid JSON array');
        return;
      }

      const headers = Object.keys(json[0]);
      let csv = headers.join(',') + '\n';

      json.forEach(obj => {
        const row = headers.map(header => {
          const value = obj[header] !== undefined ? obj[header] : '';
          return String(value).includes(',') ? `"${value}"` : value;
        });
        csv += row.join(',') + '\n';
      });

      this.csvInput.value = csv.trim();
    } catch (error) {
      alert('Error converting JSON to CSV: ' + error.message);
    }
  }
}

