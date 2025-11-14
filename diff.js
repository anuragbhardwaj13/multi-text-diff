/**
 * Diff Algorithm for Multi-Text Comparison
 * Implements line-by-line comparison with smart similarity detection
 */

class MultiTextDiff {
  constructor(texts) {
    this.texts = texts.map((t) => this.normalizeText(t));
    this.lines = this.texts.map((t) => t.split("\n"));
  }

  normalizeText(text) {
    return text.replace(/\r\n/g, "\n").trim();
  }

  /**
   * Performs the multi-text diff comparison
   * Returns aligned results with classification for each line
   */
  compare() {
    const allLines = this.getAllUniqueLines();
    const results = [];

    for (const line of allLines) {
      const lineResult = {
        content: line,
        occurrences: [],
      };

      // Check which texts contain this line
      for (let i = 0; i < this.lines.length; i++) {
        const index = this.lines[i].indexOf(line);
        lineResult.occurrences.push({
          textIndex: i,
          exists: index !== -1,
          firstOccurrence: index,
        });
      }

      // Classify the line
      lineResult.classification = this.classifyLine(lineResult.occurrences);
      results.push(lineResult);
    }

    return this.alignResults(results);
  }

  /**
   * Get all unique lines from all texts in order of appearance
   */
  getAllUniqueLines() {
    const lineMap = new Map();
    const totalTexts = this.lines.length;

    // First pass: collect all lines with their first appearance
    for (let textIdx = 0; textIdx < totalTexts; textIdx++) {
      for (let lineIdx = 0; lineIdx < this.lines[textIdx].length; lineIdx++) {
        const line = this.lines[textIdx][lineIdx];
        if (!lineMap.has(line)) {
          lineMap.set(line, {
            line,
            firstTextIdx: textIdx,
            firstLineIdx: lineIdx,
          });
        }
      }
    }

    // Sort by first appearance
    return Array.from(lineMap.values())
      .sort((a, b) => {
        if (a.firstTextIdx !== b.firstTextIdx) {
          return a.firstTextIdx - b.firstTextIdx;
        }
        return a.firstLineIdx - b.firstLineIdx;
      })
      .map((item) => item.line);
  }

  /**
   * Classify a line based on where it appears
   */
  classifyLine(occurrences) {
    const existsIn = occurrences.filter((o) => o.exists).length;
    const total = occurrences.length;

    if (existsIn === total) {
      return "common"; // Exists in all texts
    } else if (existsIn === 1) {
      return "unique"; // Exists in only one text
    } else if (existsIn > 1 && existsIn < total) {
      return "partial"; // Exists in some texts
    }
    return "unique";
  }

  /**
   * Align results for side-by-side display
   */
  alignResults(results) {
    const aligned = [];
    const numTexts = this.texts.length;

    for (const result of results) {
      const row = {
        lineContent: result.content,
        cells: [],
      };

      for (let i = 0; i < numTexts; i++) {
        const occurrence = result.occurrences[i];
        row.cells.push({
          content: occurrence.exists ? result.content : "",
          exists: occurrence.exists,
          type: this.getCellType(
            result.classification,
            occurrence.exists,
            numTexts,
            result.occurrences
          ),
        });
      }

      aligned.push(row);
    }

    return aligned;
  }

  /**
   * Determine the visual type for a cell
   */
  getCellType(classification, exists, numTexts, occurrences) {
    if (!exists) {
      return "empty";
    }

    if (classification === "common") {
      return "common";
    } else if (classification === "unique") {
      return "unique";
    } else {
      // Partial - exists in some but not all
      return "modified";
    }
  }
}

/**
 * Enhanced diff with better line matching
 */
class EnhancedMultiTextDiff extends MultiTextDiff {
  /**
   * Get all unique lines preserving order from each text
   */
  getAllUniqueLines() {
    const seen = new Set();
    const ordered = [];

    // Use longest common subsequence approach
    const maxLength = Math.max(...this.lines.map((l) => l.length));

    for (let i = 0; i < maxLength; i++) {
      for (let textIdx = 0; textIdx < this.lines.length; textIdx++) {
        if (i < this.lines[textIdx].length) {
          const line = this.lines[textIdx][i];
          if (!seen.has(line)) {
            seen.add(line);
            ordered.push(line);
          }
        }
      }
    }

    return ordered;
  }
}
