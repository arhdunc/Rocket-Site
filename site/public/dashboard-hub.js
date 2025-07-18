/**
 * Dashboard Hub - Main Application Logic
 * Handles dashboard loading, search, filtering, favorites, and theme management
 */

class DashboardHub {
  constructor() {
    this.dashboards = [];
    this.categories = [];
    this.platforms = [];
    this.filteredDashboards = [];
    this.favorites = new Set();
    this.currentFilters = {
      search: '',
      category: '',
      platform: '',
      tags: [],
    };
    this.analytics = {
      clicks: JSON.parse(localStorage.getItem('dashboard-hub-analytics') || '{}'),
      searches: JSON.parse(localStorage.getItem('dashboard-hub-searches') || '[]'),
    };

    console.log('DashboardHub constructor called');
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.loadFavorites();
      this.loadStateFromUrl();
      this.setupEventListeners();
      this.renderFilters();
      this.renderDashboards();
      this.setupThemeToggle();
    } catch (error) {
      console.error('Failed to initialize dashboard hub:', error);
      this.showError('Failed to load dashboards. Please refresh the page.');
    }
  }

  async loadData() {
    console.log('Loading dashboard data...');
    try {
      // Load from JSON data file
      const response = await fetch('/src/data/dashboards.json');
      if (response.ok) {
        const data = await response.json();
        this.dashboards = data.dashboards || [];
        console.log('Loaded dashboards from JSON:', this.dashboards.length);
      } else {
        console.error('Failed to load dashboard data, status:', response.status);
        this.dashboards = [];
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.dashboards = [];
    }

    // Extract categories and platforms dynamically from dashboard data
    this.extractCategoriesAndPlatforms();
    console.log('Dashboard data loaded:', this.dashboards.length, 'dashboards');
    this.filteredDashboards = [...this.dashboards];
  }

  extractDashboardsFromPageTree(pageTree) {
    const dashboards = [];

    // Recursively search through pageTree for dashboard pages
    const searchNode = node => {
      if (node.sourceRelativeFilePath && node.sourceRelativeFilePath.includes('dashboards/')) {
        // This is a dashboard page
        const dashboard = {
          id: node.id || node.sourceRelativeFilePath.replace(/.*\/(.+)\.rocket\.md$/, '$1'),
          title: node.title || node.name || 'Untitled Dashboard',
          description: node.description || '',
          url: node.url || '#',
          platform: node.platform || 'Unknown',
          category: node.category || 'General',
          tags: node.tags || [],
          image: node.image || '',
          lastUpdated: node.lastUpdated || new Date().toISOString().split('T')[0],
          isActive: node.isActive !== false, // Default to true unless explicitly false
        };
        dashboards.push(dashboard);
      }

      // Check children if they exist
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => searchNode(child));
      }
    };

    searchNode(pageTree);
    return dashboards;
  }

  extractCategoriesAndPlatforms() {
    const categoryMap = new Map();
    const platformMap = new Map();

    // Define category colors and icons
    const categoryDefaults = {
      Sales: { color: '#66B2A3', icon: '📊' },
      Finance: { color: '#2F7E68', icon: '💰' },
      Marketing: { color: '#ed8b4e', icon: '📈' },
      Operations: { color: '#b288cf', icon: '⚙️' },
      'Human Resources': { color: '#5bacfc', icon: '👥' },
      General: { color: '#3E5C76', icon: '📋' },
    };

    // Define platform colors
    const platformDefaults = {
      'Power BI': { color: '#F2C811', logo: '/images/powerbi-logo.png' },
      Tableau: { color: '#E97627', logo: '/images/tableau-logo.png' },
      SharePoint: { color: '#0078D4', logo: '/images/sharepoint-logo.png' },
      Kubernetes: { color: '#326CE5', logo: '' },
      'Python Dash': { color: '#3F4F75', logo: '/images/plotlydash-logo.jpeg' },
      Unknown: { color: '#9E9E9E', logo: '' },
    };

    this.dashboards.forEach(dashboard => {
      if (dashboard.category && !categoryMap.has(dashboard.category)) {
        const defaults = categoryDefaults[dashboard.category] || categoryDefaults['General'];
        categoryMap.set(dashboard.category, {
          id: dashboard.category.toLowerCase().replace(/\s+/g, '-'),
          name: dashboard.category,
          color: defaults.color,
          icon: defaults.icon,
        });
      }

      if (dashboard.platform && !platformMap.has(dashboard.platform)) {
        const defaults = platformDefaults[dashboard.platform] || platformDefaults['Unknown'];
        platformMap.set(dashboard.platform, {
          id: dashboard.platform.toLowerCase().replace(/\s+/g, '-'),
          name: dashboard.platform,
          color: defaults.color,
          logo: defaults.logo || '', // Use the logo from defaults or an empty string
        });
      }
    });

    this.categories = Array.from(categoryMap.values());
    this.platforms = Array.from(platformMap.values());
  }

  loadFavorites() {
    const saved = localStorage.getItem('dashboard-hub-favorites');
    this.favorites = new Set(saved ? JSON.parse(saved) : []);
  }

  saveFavorites() {
    localStorage.setItem('dashboard-hub-favorites', JSON.stringify([...this.favorites]));
  }

  loadStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state');

    if (state) {
      try {
        const decoded = JSON.parse(atob(state));
        this.favorites = new Set(decoded.f || []);
        this.currentFilters.search = decoded.s || '';
        this.currentFilters.tags = decoded.t || [];
        this.currentFilters.category = decoded.c || '';
        this.currentFilters.platform = decoded.p || '';

        this.saveFavorites();
        this.showToast('Shared dashboard state loaded!');
      } catch (err) {
        console.warn('Invalid share URL');
      }
    }
  }

  setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = this.currentFilters.search;
      searchInput.addEventListener('input', e => {
        this.currentFilters.search = e.target.value;
        this.trackSearch(e.target.value);
        this.debounce(() => this.applyFilters(), 300)();
      });
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Set up filter container event delegation
    const filterContainer = document.getElementById('filter-container');
    if (filterContainer) {
      filterContainer.addEventListener('click', e => {
        if (!e.target.classList.contains('filter-chip')) return;

        const type = e.target.dataset.type;
        const value = e.target.dataset.value;

        switch (type) {
          case 'category':
            this.currentFilters.category = this.currentFilters.category === value ? '' : value;
            break;
          case 'platform':
            this.currentFilters.platform = this.currentFilters.platform === value ? '' : value;
            break;
          case 'clear':
            this.clearFilters();
            return; // Early return to avoid double execution
        }

        this.renderFilters();
        this.applyFilters();
      });
    }

    // Set up dashboard container event delegation
    const dashboardContainer = document.getElementById('dashboard-grid');
    if (dashboardContainer) {
      dashboardContainer.addEventListener('click', e => {
        const dashboardId = e.target.closest('[data-dashboard-id]')?.dataset.dashboardId;
        if (!dashboardId) return;

        if (e.target.classList.contains('btn-favorite')) {
          e.preventDefault();

          this.toggleFavorite(dashboardId);
        } else if (e.target.classList.contains('btn-copy-url')) {
          e.preventDefault();
          const url = e.target.dataset.url;
          this.copyShortUrl(url, e.target);
        } else if (e.target.classList.contains('btn-primary')) {
          this.trackClick(dashboardId);
        }
      });
    }
  }

  setupThemeToggle() {
    console.log('Setting up theme toggle...');

    // Initialize theme from localStorage
    const currentTheme = localStorage.getItem('spot-hub-theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
      console.warn('Theme toggle button not found');
      return;
    }

    // Set initial icon and class
    themeToggle.textContent = currentTheme === 'dark' ? '☀' : '☾';
    themeToggle.classList.remove('light-mode', 'dark-mode');
    themeToggle.classList.add(currentTheme === 'dark' ? 'dark-mode' : 'light-mode');

    // Add click event listener
    themeToggle.addEventListener('click', () => {
      console.log('Theme toggle clicked!');
      this.toggleTheme();
    });

    console.log('Theme toggle initialized with theme:', currentTheme);
  }

  toggleTheme() {
    console.log('Toggling theme...');
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    console.log('Current theme:', currentTheme, '-> New theme:', newTheme);

    // Update body attribute
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('spot-hub-theme', newTheme);

    // Update button icon and class
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = newTheme === 'dark' ? '☀' : '☾';
      themeToggle.classList.remove('light-mode', 'dark-mode');
      themeToggle.classList.add(newTheme === 'dark' ? 'dark-mode' : 'light-mode');
    }

    console.log('Theme switched to:', newTheme);
    console.log('Body data-theme is now:', body.getAttribute('data-theme'));
  }

  renderFilters() {
    const container = document.getElementById('filter-container');
    if (!container) return;

    const filterElements = [
      ...this.categories.map(category => {
        const isActive = this.currentFilters.category === category.id;
        return `<button class="filter-chip ${isActive ? 'active' : ''}" 
                data-type="category" data-value="${category.id}"
                style="--filter-color: ${category.color}; ${
          isActive
            ? `background: linear-gradient(135deg, ${category.color}, ${
                category.color
              }dd); border-color: ${category.color}; color: ${this.getContrastColor(
                category.color,
              )};`
            : `border-color: ${category.color}40; color: ${category.color};`
        }">
          ${category.icon} ${category.name}
        </button>`;
      }),
      ...this.platforms.map(platform => {
        const isActive = this.currentFilters.platform === platform.id;
        return `<button class="filter-chip ${isActive ? 'active' : ''}"
                data-type="platform" data-value="${platform.id}"
                style="--filter-color: ${platform.color}; ${
          isActive
            ? `background: linear-gradient(135deg, ${platform.color}, ${
                platform.color
              }dd); border-color: ${platform.color}; color: ${this.getContrastColor(
                platform.color,
              )};`
            : `border-color: ${platform.color}40; color: ${platform.color};`
        }">
          ${platform.name}
        </button>`;
      }),
      '<button class="filter-chip" data-type="clear">🗑️ Clear All</button>',
    ];

    container.innerHTML = filterElements.join('');
  }

  renderDashboards() {
    const container = document.getElementById('dashboard-grid');
    const emptyState = document.getElementById('empty-state');

    if (!container) return;

    if (this.filteredDashboards.length === 0) {
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    const dashboardElements = this.filteredDashboards
      .map(dashboard => this.createDashboardTile(dashboard))
      .join('');

    container.innerHTML = dashboardElements;
  }

  createDashboardTile(dashboard) {
    const isFavorite = this.favorites.has(dashboard.id);
    const category = this.categories.find(c => c.name === dashboard.category);
    const platform = this.platforms.find(p => p.name === dashboard.platform);

    return `
      <div class="dashboard-tile" data-dashboard-id="${dashboard.id}">
        <div class="dashboard-image" style="background-image: url('${
          dashboard.image || '/src/images/financial-overview.png'
        }')">
        </div>
        <div class="dashboard-content">
          <h3 class="dashboard-title">${dashboard.title}</h3>
          <p class="dashboard-description">${dashboard.description}</p>
          
          <div class="dashboard-meta">
            <span class="platform-badge" style="background-color: ${
              platform?.color || '#gray'
            }20; color: ${platform?.color || '#gray'}; font-weight: 600;">
              ${dashboard.platform}
            </span>
            <span class="category-badge" style="background-color: ${
              category?.color || '#gray'
            }; color: ${this.getContrastColor(category?.color || '#gray')}; font-weight: 600;">
              ${category?.icon || '📊'} ${dashboard.category}
            </span>
          </div>

          <div class="dashboard-tags">
            ${dashboard.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>

          <div class="dashboard-actions">
            <button class="btn btn-favorite ${isFavorite ? 'active' : ''}" 
                    title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
              ${isFavorite ? '⭐' : '☆'}
            </button>
            <button class="btn btn-copy-url" 
                    data-url="${dashboard.url}"
                    title="Copy shortened URL">
              📋 Copy URL
            </button>
            <a href="${dashboard.url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-primary">
              Open Dashboard
            </a>
          </div>
        </div>
      </div>
    `;
  }

  applyFilters() {
    this.filteredDashboards = this.dashboards.filter(dashboard => {
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search.toLowerCase();
        const searchableText = [
          dashboard.title,
          dashboard.description,
          dashboard.category,
          dashboard.platform,
          ...dashboard.tags,
        ]
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(searchTerm)) return false;
      }

      if (
        this.currentFilters.category &&
        dashboard.category !== this.getCategoryName(this.currentFilters.category)
      ) {
        return false;
      }

      if (
        this.currentFilters.platform &&
        dashboard.platform !== this.getPlatformName(this.currentFilters.platform)
      ) {
        return false;
      }

      return true;
    });

    this.renderDashboards();
  }

  getCategoryName(categoryId) {
    return this.categories.find(c => c.id === categoryId)?.name || '';
  }

  getPlatformName(platformId) {
    return this.platforms.find(p => p.id === platformId)?.name || '';
  }

  /**
   * Get appropriate text color for light/yellow backgrounds
   * Simplified approach focusing on known problematic colors
   */
  getContrastColor(bgColor) {
    if (!bgColor) return '#ffffff';

    const lightColors = ['#F4D06F', '#E6C45A', '#F2C811', '#FFDD44', '#FFF8DC', '#FFEB3B'];
    const normalizedColor = bgColor.toUpperCase();

    // For known light/yellow colors, always use dark text
    if (lightColors.some(light => normalizedColor.includes(light.replace('#', '')))) {
      return '#2c2c2c';
    }

    // Default to white text for other colors
    return '#ffffff';
  }

  clearFilters() {
    this.currentFilters = {
      search: '',
      category: '',
      platform: '',
      tags: [],
    };

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    this.renderFilters();
    this.applyFilters();
  }

  toggleFavorite(dashboardId) {
    if (this.favorites.has(dashboardId)) {
      this.favorites.delete(dashboardId);
    } else {
      this.favorites.add(dashboardId);
    }

    this.saveFavorites();
    this.renderDashboards();

    const dashboard = this.dashboards.find(d => d.id === dashboardId);
    const action = this.favorites.has(dashboardId) ? 'added to' : 'removed from';
    this.showToast(`${dashboard?.title} ${action} favorites`);
  }

  async copyShortUrl(originalUrl, buttonElement) {
    try {
      // Show loading state
      const originalText = buttonElement.textContent;
      buttonElement.textContent = '⏳ Copying...';
      buttonElement.disabled = true;

      // Generate a shortened URL (using a simple hash-based approach)
      const shortUrl = await this.shortenUrl(originalUrl);

      // Copy to clipboard
      await navigator.clipboard.writeText(shortUrl);

      // Show success feedback
      buttonElement.textContent = '✅ Copied!';
      this.showToast('Shortened URL copied to clipboard!');

      // Reset button after delay
      setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);

      // Fallback: show prompt with original URL
      prompt('Copy this URL:', originalUrl);

      // Reset button
      buttonElement.textContent = '📋 Copy URL';
      buttonElement.disabled = false;
      this.showToast('Copy failed - URL shown in prompt');
    }
  }

  async shortenUrl(originalUrl) {
    // Simple client-side URL shortening using a hash-based approach
    // In a real application, you might use a service like bit.ly, tinyurl, etc.

    // Generate a short hash from the URL
    const hash = await this.generateShortHash(originalUrl);

    // Store the mapping in localStorage for this session
    const shortUrlMap = JSON.parse(localStorage.getItem('spot-hub-short-urls') || '{}');
    shortUrlMap[hash] = originalUrl;
    localStorage.setItem('spot-hub-short-urls', JSON.stringify(shortUrlMap));

    // Return a shortened URL that could be processed by your server or handled client-side
    return `${window.location.origin}/s/${hash}`;
  }

  async generateShortHash(text) {
    // Generate a short hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);

    // Convert to base36 and take first 6 characters for a short code
    let hash = '';
    for (let i = 0; i < 6; i++) {
      hash += (hashArray[i] % 36).toString(36);
    }

    return hash.toUpperCase();
  }

  trackClick(dashboardId) {
    this.analytics.clicks[dashboardId] = (this.analytics.clicks[dashboardId] || 0) + 1;
    localStorage.setItem('dashboard-hub-analytics', JSON.stringify(this.analytics.clicks));
  }

  trackSearch(searchTerm) {
    if (searchTerm.trim()) {
      this.analytics.searches.push({
        term: searchTerm,
        timestamp: Date.now(),
      });

      if (this.analytics.searches.length > 100) {
        this.analytics.searches = this.analytics.searches.slice(-100);
      }

      localStorage.setItem('dashboard-hub-searches', JSON.stringify(this.analytics.searches));
    }
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
      toast.className = 'toast';
    }, 3000);
  }

  showError(message) {
    this.showToast(message, 'error');
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize the dashboard hub when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new DashboardHub());
} else {
  new DashboardHub();
}
