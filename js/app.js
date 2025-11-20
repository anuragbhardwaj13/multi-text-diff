/**
 * DevTools Suite - Main App Controller
 * Handles routing, theme, and tool loading
 */

class DevToolsApp {
  constructor() {
    this.currentTool = null;
    this.tools = new Map();
    this.init();
  }

  init() {
    this.initTheme();
    this.initEventListeners();
    this.initSearch();
    this.registerTools();
  }

  /**
   * Theme Management
   */
  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    this.updateThemeIcon(next);
  }

  updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  /**
   * Event Listeners
   */
  initEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Back button
    document.getElementById('backBtn')?.addEventListener('click', () => {
      this.showHome();
    });

    // Tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', () => {
        const toolId = card.getAttribute('data-tool');
        this.loadTool(toolId);
      });
    });
  }

  /**
   * Search Functionality
   */
  initSearch() {
    const searchInput = document.getElementById('toolSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.tool-card');

      cards.forEach(card => {
        const name = card.querySelector('.tool-name').textContent.toLowerCase();
        const desc = card.querySelector('.tool-desc').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag'))
          .map(tag => tag.textContent.toLowerCase()).join(' ');

        const matches = name.includes(query) || desc.includes(query) || tags.includes(query);
        card.style.display = matches ? 'block' : 'none';
      });
    });
  }

  /**
   * Register all tools
   */
  registerTools() {
    // Tools will be lazy-loaded when needed
    this.tools.set('multi-diff', {
      name: 'Multi-Text Diff',
      module: () => import('./tools/multi-diff.js')
    });
    
    this.tools.set('base64-text', {
      name: 'Base64 Text Encoder/Decoder',
      module: () => import('./tools/base64-text.js')
    });
    
    this.tools.set('json-formatter', {
      name: 'JSON Formatter',
      module: () => import('./tools/json-formatter.js')
    });
    
    this.tools.set('xml-formatter', {
      name: 'XML Formatter',
      module: () => import('./tools/xml-formatter.js')
    });
    
    this.tools.set('hash-generator', {
      name: 'Hash Generator',
      module: () => import('./tools/hash-generator.js')
    });
    
    this.tools.set('case-converter', {
      name: 'Case Converter',
      module: () => import('./tools/case-converter.js')
    });
    
    this.tools.set('csv-json', {
      name: 'CSV ↔ JSON Converter',
      module: () => import('./tools/csv-json.js')
    });
    
    this.tools.set('markdown-preview', {
      name: 'Markdown Preview',
      module: () => import('./tools/markdown-preview.js')
    });
    
    this.tools.set('jwt-decoder', {
      name: 'JWT Decoder',
      module: () => import('./tools/jwt-decoder.js')
    });
    
    this.tools.set('file-base64', {
      name: 'File to Base64',
      module: () => import('./tools/file-base64.js')
    });
    
    this.tools.set('base64-file', {
      name: 'Base64 to File',
      module: () => import('./tools/base64-file.js')
    });
  }

  /**
   * Load and render a tool
   */
  async loadTool(toolId) {
    const toolInfo = this.tools.get(toolId);
    if (!toolInfo) {
      console.error(`Tool not found: ${toolId}`);
      return;
    }

    try {
      // Show loading state
      const toolContent = document.getElementById('toolContent');
      const toolTitle = document.getElementById('toolTitle');
      
      toolTitle.textContent = toolInfo.name;
      toolContent.innerHTML = '<div style="text-align: center; padding: 3rem;">Loading...</div>';
      
      // Hide home, show tool container
      document.getElementById('home').classList.add('hidden');
      document.getElementById('toolContainer').classList.remove('hidden');
      
      // Load the tool module
      const module = await toolInfo.module();
      const tool = new module.default();
      
      // Render the tool
      toolContent.innerHTML = '';
      tool.render(toolContent);
      
      this.currentTool = tool;
    } catch (error) {
      console.error(`Error loading tool ${toolId}:`, error);
      document.getElementById('toolContent').innerHTML = 
        '<div style="text-align: center; padding: 3rem; color: var(--danger);">Error loading tool. Please try again.</div>';
    }
  }

  /**
   * Show home page
   */
  showHome() {
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('toolContainer').classList.add('hidden');
    
    if (this.currentTool && typeof this.currentTool.cleanup === 'function') {
      this.currentTool.cleanup();
    }
    this.currentTool = null;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.devToolsApp = new DevToolsApp();
  });
} else {
  window.devToolsApp = new DevToolsApp();
}

