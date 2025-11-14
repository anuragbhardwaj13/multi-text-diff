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
   * Simple word tokenizer - splits by whitespace, keeps words
   */
  tokenize(text) {
    return text.split(/(\s+)/);
  }

  /**
   * Get words that are different between two strings
   * Returns Set of words that exist in str but not common with reference
   */
  getDifferentWords(strReference, str) {
    const wordsRef = new Set(
      this.tokenize(strReference).filter((w) => w.trim())
    );
    const words = this.tokenize(str).filter((w) => w.trim());

    const different = new Set();
    words.forEach((word) => {
      if (!wordsRef.has(word)) {
        different.add(word);
      }
    });

    return different;
  }

  /**
   * Check if two lines are similar (>50% same words)
   */
  areSimilar(line1, line2) {
    const words1 = this.tokenize(line1).filter((w) => w.trim());
    const words2 = this.tokenize(line2).filter((w) => w.trim());

    if (words1.length === 0 || words2.length === 0) return false;

    const common = words1.filter((w) => words2.includes(w)).length;
    const maxLen = Math.max(words1.length, words2.length);

    return common / maxLen > 0.5;
  }

  /**
   * Performs the multi-text diff comparison
   * Returns aligned results with classification for each line
   */
  compare() {
    const groups = this.getAllUniqueLines();
    const results = [];

    for (const group of groups) {
      const lineResult = {
        group: group,
        occurrences: [],
      };

      // Check each text in this group
      for (let i = 0; i < this.lines.length; i++) {
        lineResult.occurrences.push({
          textIndex: i,
          exists: group.lines[i] !== null,
          content: group.lines[i],
        });
      }

      // Classify the line
      lineResult.classification = this.classifyLine(lineResult.occurrences);
      results.push(lineResult);
    }

    return this.alignResults(results);
  }

  /**
   * Get all unique lines with proper alignment
   * Uses a simpler row-by-row matching approach
   */
  getAllUniqueLines() {
    const groups = [];
    const used = this.lines.map(() => []);
    const maxLen = Math.max(...this.lines.map((l) => l.length));

    // Process line by line
    for (let row = 0; row < maxLen; row++) {
      // Try to find matching lines at this position across all texts
      for (let textIdx = 0; textIdx < this.lines.length; textIdx++) {
        if (row >= this.lines[textIdx].length || used[textIdx][row]) continue;

        const line = this.lines[textIdx][row];
        const group = { lines: Array(this.lines.length).fill(null) };
        group.lines[textIdx] = line;
        used[textIdx][row] = true;

        // Look for exact matches or similar lines in other texts at same position
        for (let otherIdx = 0; otherIdx < this.lines.length; otherIdx++) {
          if (otherIdx === textIdx) continue;

          // Check current row first
          if (
            row < this.lines[otherIdx].length &&
            !used[otherIdx][row] &&
            (this.lines[otherIdx][row] === line ||
              this.areSimilar(this.lines[otherIdx][row], line))
          ) {
            group.lines[otherIdx] = this.lines[otherIdx][row];
            used[otherIdx][row] = true;
          }
          // Check nearby rows (±2)
          else {
            for (let offset = -2; offset <= 2; offset++) {
              if (offset === 0) continue;
              const checkRow = row + offset;
              if (
                checkRow >= 0 &&
                checkRow < this.lines[otherIdx].length &&
                !used[otherIdx][checkRow] &&
                (this.lines[otherIdx][checkRow] === line ||
                  this.areSimilar(this.lines[otherIdx][checkRow], line))
              ) {
                group.lines[otherIdx] = this.lines[otherIdx][checkRow];
                used[otherIdx][checkRow] = true;
                break;
              }
            }
          }
        }

        groups.push(group);
      }
    }

    return groups;
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
   * Align results for side-by-side display with word-level diffs
   */
  alignResults(results) {
    const aligned = [];
    const numTexts = this.texts.length;

    for (const result of results) {
      const row = { cells: [] };

      // Check if lines are different (for word-level diff)
      const lines = result.group.lines.filter((l) => l !== null);
      const allSame = lines.length > 1 && lines.every((l) => l === lines[0]);

      // Collect all unique words from all lines to determine differences
      const allWords = new Set();
      lines.forEach((line) => {
        if (line) {
          this.tokenize(line)
            .filter((w) => w.trim())
            .forEach((w) => allWords.add(w));
        }
      });

      for (let i = 0; i < numTexts; i++) {
        const occurrence = result.occurrences[i];
        let differentWords = null;

        // If lines exist and are not all the same, find different words
        if (!allSame && occurrence.exists && lines.length > 1) {
          // Find words unique to this line compared to others
          const currentWords = new Set(
            this.tokenize(occurrence.content).filter((w) => w.trim())
          );

          differentWords = new Set();
          currentWords.forEach((word) => {
            // Check if this word exists in ALL other non-null lines
            const existsInAll = lines.every((line) => {
              if (line === occurrence.content || line === null) return true;
              return this.tokenize(line)
                .filter((w) => w.trim())
                .includes(word);
            });

            if (!existsInAll) {
              differentWords.add(word);
            }
          });

          // If no differences found, set to null
          if (differentWords.size === 0) differentWords = null;
        }

        row.cells.push({
          content: occurrence.content || "",
          exists: occurrence.exists,
          differentWords: differentWords,
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
 * Enhanced diff - uses base class implementation with smart grouping and word-level diffs
 */
class EnhancedMultiTextDiff extends MultiTextDiff {
  // Uses base class methods - no override needed
}
