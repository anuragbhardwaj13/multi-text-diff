/**
 * Multi-Text Diff Application
 * Main application logic and UI management
 */

class DiffApp {
  constructor() {
    this.texts = [];
    this.maxTexts = 10;
    this.minTexts = 2;

    this.initElements();
    this.initEventListeners();
    this.initializeTexts();
  }

  initElements() {
    this.addTextBtn = document.getElementById("addText");
    this.compareBtn = document.getElementById("compare");
    this.clearBtn = document.getElementById("clear");
    this.backToEditBtn = document.getElementById("backToEdit");
    this.inputSection = document.getElementById("inputSection");
    this.resultSection = document.getElementById("resultSection");
    this.diffDisplay = document.getElementById("diffDisplay");
  }

  initEventListeners() {
    this.addTextBtn.addEventListener("click", () => this.addTextInput());
    this.compareBtn.addEventListener("click", () => this.performComparison());
    this.clearBtn.addEventListener("click", () => this.clearAll());
    this.backToEditBtn.addEventListener("click", () => this.backToEdit());
  }

  initializeTexts() {
    // Start with 2 text inputs
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
    const wrapper = document.createElement("div");
    wrapper.className = "text-input-wrapper";
    wrapper.dataset.index = index;

    wrapper.innerHTML = `
            <div class="text-input-header">
                <input type="text" 
                       class="text-label" 
                       placeholder="Text ${index + 1}" 
                       value="Text ${index + 1}">
                ${
                  this.texts.length >= this.minTexts
                    ? '<button class="remove-btn" title="Remove">×</button>'
                    : ""
                }
            </div>
            <textarea placeholder="Paste or type your text here..."></textarea>
        `;

    const removeBtn = wrapper.querySelector(".remove-btn");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => this.removeTextInput(index));
    }

    this.inputSection.appendChild(wrapper);
    this.texts.push({
      wrapper,
      label: `Text ${index + 1}`,
      content: "",
    });

    this.updateAddButton();
  }

  removeTextInput(index) {
    const wrapper = this.inputSection.querySelector(`[data-index="${index}"]`);
    if (wrapper) {
      wrapper.remove();
      this.texts.splice(index, 1);
      this.reindexTexts();
      this.updateAddButton();
    }
  }

  reindexTexts() {
    const wrappers = this.inputSection.querySelectorAll(".text-input-wrapper");
    wrappers.forEach((wrapper, index) => {
      wrapper.dataset.index = index;
      const labelInput = wrapper.querySelector(".text-label");
      if (labelInput && !labelInput.value.trim()) {
        labelInput.placeholder = `Text ${index + 1}`;
      }
    });
  }

  updateAddButton() {
    this.addTextBtn.disabled = this.texts.length >= this.maxTexts;
  }

  getTextData() {
    return Array.from(
      this.inputSection.querySelectorAll(".text-input-wrapper")
    ).map((wrapper) => {
      const label =
        wrapper.querySelector(".text-label").value.trim() ||
        wrapper.querySelector(".text-label").placeholder;
      const content = wrapper.querySelector("textarea").value;
      return { label, content };
    });
  }

  performComparison() {
    const textData = this.getTextData();

    // Validate
    const nonEmptyTexts = textData.filter((t) => t.content.trim());
    if (nonEmptyTexts.length < 2) {
      alert("Please enter at least 2 texts to compare");
      return;
    }

    // Perform diff
    const contents = textData.map((t) => t.content);
    const labels = textData.map((t) => t.label);

    const differ = new EnhancedMultiTextDiff(contents);
    const results = differ.compare();

    this.displayResults(results, labels);
  }

  /**
   * Render text with word highlighting based on differentWords Set
   */
  renderWithWordHighlight(text, differentWords) {
    if (!differentWords || differentWords.size === 0) {
      return this.escapeHtml(text);
    }

    // Tokenize the text
    const tokens = text.split(/(\s+)/);

    return tokens
      .map((token) => {
        const escaped = this.escapeHtml(token);
        // If this word (trimmed) is in the different set, highlight it
        if (token.trim() && differentWords.has(token.trim())) {
          return `<span class="word-diff-change">${escaped}</span>`;
        }
        return escaped;
      })
      .join("");
  }

  /**
   * Escape HTML characters
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  displayResults(results, labels) {
    // Clear previous results
    this.diffDisplay.innerHTML = "";

    // Add legend
    const legend = this.createLegend();
    this.diffDisplay.before(legend);

    // Create columns
    const numColumns = labels.length;

    for (let i = 0; i < numColumns; i++) {
      const column = document.createElement("div");
      column.className = "diff-column";

      const header = document.createElement("div");
      header.className = "diff-column-header";
      header.textContent = labels[i];
      column.appendChild(header);

      const content = document.createElement("div");
      content.className = "diff-content";

      // Add lines
      for (const row of results) {
        const cell = row.cells[i];
        const line = document.createElement("div");
        line.className = `diff-line ${cell.type}`;

        if (cell.exists) {
          // If different words exist, render with highlighting
          if (cell.differentWords && cell.differentWords.size > 0) {
            line.innerHTML = this.renderWithWordHighlight(
              cell.content,
              cell.differentWords
            );
          } else {
            line.textContent = cell.content || " ";
          }
        } else {
          line.textContent = "";
          line.innerHTML = "&nbsp;";
        }

        content.appendChild(line);
      }

      column.appendChild(content);
      this.diffDisplay.appendChild(column);
    }

    // Show results section
    this.inputSection.style.display = "none";
    document.querySelector(".controls").style.display = "none";
    this.resultSection.classList.remove("hidden");

    // Sync scroll
    this.syncScroll();
  }

  createLegend() {
    const existingLegend = document.querySelector(".legend");
    if (existingLegend) {
      existingLegend.remove();
    }

    const legend = document.createElement("div");
    legend.className = "legend";
    legend.innerHTML = `
            <div class="legend-item">
                <div class="legend-color unique"></div>
                <span>Added (unique to this text)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color modified"></div>
                <span>Partial match (in some texts)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color common"></div>
                <span>Common (in all texts)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color empty"></div>
                <span>Missing (not in this text)</span>
            </div>
        `;
    return legend;
  }

  syncScroll() {
    const columns = this.diffDisplay.querySelectorAll(".diff-content");
    let isScrolling = false;

    columns.forEach((column) => {
      column.addEventListener("scroll", () => {
        if (isScrolling) return;

        isScrolling = true;
        const scrollTop = column.scrollTop;

        columns.forEach((otherColumn) => {
          if (otherColumn !== column) {
            otherColumn.scrollTop = scrollTop;
          }
        });

        setTimeout(() => {
          isScrolling = false;
        }, 10);
      });
    });
  }

  backToEdit() {
    this.resultSection.classList.add("hidden");
    this.inputSection.style.display = "";
    document.querySelector(".controls").style.display = "";

    // Remove legend
    const legend = document.querySelector(".legend");
    if (legend) {
      legend.remove();
    }
  }

  clearAll() {
    if (!confirm("Clear all texts?")) {
      return;
    }

    const textareas = this.inputSection.querySelectorAll("textarea");
    textareas.forEach((textarea) => {
      textarea.value = "";
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new DiffApp();
});
