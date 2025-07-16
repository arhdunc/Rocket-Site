# Dashboard Hub

A central portal for accessing multiple dashboards and reports across various platforms.

## Features

✅ **Search & Filter** - Find dashboards by name, category, platform, or tags  
✅ **Favorites System** - Save frequently used dashboards with browser storage  
✅ **Share Favorites** - Generate shareable links for favorite dashboard collections  
✅ **Dark/Light Mode** - Toggle between themes with persistence  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Analytics Tracking** - Simple click and search analytics stored locally  
✅ **Multi-Platform Support** - Power BI, Tableau, SharePoint, Kubernetes, Python Dash, etc.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Adding/Updating Dashboards

Dashboards are managed as individual Markdown files in `site/pages/dashboards/`. 

### Steps to Add a Dashboard:

1. **Create a new file**: Name it something like `my-dashboard.rocket.md` (use kebab-case for the filename).
2. **Add frontmatter**: At the top, between `---` lines, add the metadata in YAML format.
3. **Optional content**: Below the frontmatter, you can add any additional Markdown content (though it's not currently used in the hub display).
4. **Commit and deploy**: Push to Git, and your CI/CD will rebuild the site.

### Required Fields:
- **id**: Unique identifier (kebab-case)
- **title**: Display name
- **description**: Brief overview
- **url**: Link to the dashboard
- **platform**: e.g., 'Power BI', 'Tableau'
- **category**: e.g., 'Sales', 'Finance'
- **tags**: Array of keywords

### Optional Fields:
- **image**: Path to preview image (e.g., '/images/my-dash.png')
- **lastUpdated**: Date in YYYY-MM-DD format
- **isActive**: Boolean (default: true)

### Sample Dashboard File (`site/pages/dashboards/sample.rocket.md`):

```markdown
---
id: sample-dashboard
title: Sample Dashboard
description: This is a sample dashboard entry
url: https://example.com/dashboard
platform: Power BI
category: Operations
tags: [sample, test, demo]
image: /images/sample.png
lastUpdated: 2024-01-01
isActive: true
---

Additional notes or details can go here (not displayed in hub).
```

After adding files, restart the dev server or rebuild to see changes.

## Technology Stack

- **Framework**: Rocket (Static Site Generator)
- **Templating**: Lit HTML
- **Styling**: CSS Custom Properties with CSS Grid
- **JavaScript**: Vanilla ES6+ with modules
- **Build Tool**: Rollup (via Rocket)