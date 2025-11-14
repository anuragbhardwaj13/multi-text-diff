# Multi-Text Diff Tool

A minimal, clean web application for comparing multiple texts side-by-side with smart color-coded differences.

## Features

- **Compare 2-10 texts simultaneously** - Add as many texts as you need (up to 10)
- **Side-by-side comparison** - Clear visual layout like vim's diff mode
- **Smart color coding**:
  - 🟢 Green: Common lines (present in all texts)
  - 🟡 Yellow: Unique lines (present in only one text)
  - 🔵 Blue: Partial matches (present in some texts)
  - ⚪ Gray: Empty/not present
- **Synchronized scrolling** - All columns scroll together
- **Minimal UI** - Clean, distraction-free interface
- **No backend required** - Runs entirely in your browser

## Usage

1. Open `index.html` in your web browser
2. Start with 2 text areas (add more with the "+ Add Text" button)
3. Paste or type your texts
4. Click "Compare" to see the side-by-side diff
5. Scroll through synchronized results

## Quick Start

```bash
# Open the app locally
cd /Users/anuragbhardwaj/Developer/multi-text-diff
open index.html
```

## Deployment Options

### Option 1: GitHub Pages (Recommended - Free & Easy)

1. Create a new GitHub repository:
```bash
cd /Users/anuragbhardwaj/Developer/multi-text-diff
git init
git add .
git commit -m "Initial commit: Multi-text diff tool"
git branch -M main
git remote add origin https://github.com/yourusername/multi-text-diff.git
git push -u origin main
```

2. Go to your repository on GitHub
3. Click Settings → Pages
4. Under "Source", select "Deploy from main branch"
5. Your site will be live at `https://yourusername.github.io/multi-text-diff`

### Option 2: Netlify (Free - Drag & Drop)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `multi-text-diff` folder
4. Get instant URL like `https://your-site.netlify.app`
5. Optional: Configure custom domain in site settings

### Option 3: Vercel (Free)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd /Users/anuragbhardwaj/Developer/multi-text-diff
vercel
```

3. Follow prompts, get instant deployment URL

### Option 4: Local Usage

Simply open `index.html` in any modern web browser. No server needed!

```bash
# macOS
open index.html

# Or use Python's built-in server for cleaner URLs
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

## Files Structure

```
multi-text-diff/
├── index.html      # Main HTML structure
├── styles.css      # Minimal, clean styling
├── app.js          # UI logic and event handling
├── diff.js         # Comparison algorithm
└── README.md       # This file
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Technical Details

- Pure vanilla JavaScript (no frameworks)
- No build process required
- No external dependencies
- Lightweight (~20KB total)
- Privacy-friendly (all processing happens in browser)
- No data sent to any server

## How It Works

1. **Input Phase**: Users add text areas and paste content
2. **Comparison**: Line-by-line diff algorithm identifies:
   - Lines present in all texts (common)
   - Lines present in only one text (unique)
   - Lines present in some texts (partial)
3. **Display**: Side-by-side view with color coding and synchronized scrolling

## Tips

- You can rename each text area by clicking the label at the top
- Remove texts you don't need with the × button
- Use "Clear All" to reset all text areas at once
- "Back to Edit" lets you modify texts and re-compare

## Customization

To change colors, edit the CSS variables in `styles.css`:

```css
:root {
    --common: #f0fdf4;        /* Green for common lines */
    --unique: #fef3c7;        /* Yellow for unique lines */
    --modified: #dbeafe;      /* Blue for partial matches */
    --empty: #f9fafb;         /* Gray for empty cells */
}
```

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues or feature requests, feel free to modify the code or reach out!

