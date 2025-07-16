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
    try {
      // Try to load from pageTreeData.rocketGenerated.json which contains all page metadata
      const response = await fetch('/pageTreeData.rocketGenerated.json');
      if (response.ok) {
        const pageTree = await response.json();
        this.dashboards = this.extractDashboardsFromPageTree(pageTree);
      } else {
        // Fallback to JSON file if pageTree not available
        const jsonResponse = await fetch('/src/data/dashboards.json');
        if (jsonResponse.ok) {
          const data = await jsonResponse.json();
          this.dashboards = data.dashboards || [];
        }
      }
    } catch (error) {
      console.warn('Loading from pageTree failed, trying JSON fallback:', error);
      try {
        const response = await fetch('/src/data/dashboards.json');
        if (response.ok) {
          const data = await response.json();
          this.dashboards = data.dashboards || [];
        }
      } catch (fallbackError) {
        console.error('Both pageTree and JSON loading failed:', fallbackError);
        this.dashboards = [];
      }
    }

    // Extract categories and platforms dynamically from dashboard data
    this.extractCategoriesAndPlatforms();
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
      Sales: { color: '#4CAF50', icon: '📊' },
      Finance: { color: '#2196F3', icon: '💰' },
      Marketing: { color: '#FF9800', icon: '📈' },
      Operations: { color: '#9C27B0', icon: '⚙️' },
      'Human Resources': { color: '#E91E63', icon: '👥' },
      General: { color: '#607D8B', icon: '📋' },
    };

    // Define platform colors
    const platformDefaults = {
      'Power BI': { color: '#F2C811' },
      Tableau: { color: '#E97627' },
      SharePoint: { color: '#0078D4' },
      Kubernetes: { color: '#326CE5' },
      'Python Dash': { color: '#3F4F75' },
      Unknown: { color: '#9E9E9E' },
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
          logo: `/images/${dashboard.platform.toLowerCase().replace(/\s+/g, '-')}-logo.png`,
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
  }

  setupThemeToggle() {
    // Initialize theme from localStorage
    const currentTheme = localStorage.getItem('dashboard-hub-theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Set initial icon
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('dashboard-hub-theme', newTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  renderFilters() {
    const container = document.getElementById('filter-container');
    if (!container) return;

    const filterElements = [
      ...this.categories.map(
        category =>
          `<button class="filter-chip ${
            this.currentFilters.category === category.id ? 'active' : ''
          }" 
                data-type="category" data-value="${category.id}">
          ${category.icon} ${category.name}
        </button>`,
      ),
      ...this.platforms.map(
        platform =>
          `<button class="filter-chip ${
            this.currentFilters.platform === platform.id ? 'active' : ''
          }"
                data-type="platform" data-value="${platform.id}">
          ${platform.name}
        </button>`,
      ),
      '<button class="filter-chip" data-type="clear">Clear All</button>',
      '<button class="filter-chip" data-type="share">📤 Share Favorites</button>',
    ];

    container.innerHTML = filterElements.join('');

    container.addEventListener('click', e => {
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
          break;
        case 'share':
          this.shareFavorites();
          return;
      }

      this.renderFilters();
      this.applyFilters();
    });
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

    container.addEventListener('click', e => {
      const dashboardId = e.target.closest('[data-dashboard-id]')?.dataset.dashboardId;
      if (!dashboardId) return;

      if (e.target.classList.contains('btn-favorite')) {
        e.preventDefault();
        this.toggleFavorite(dashboardId);
      } else if (e.target.classList.contains('btn-primary')) {
        this.trackClick(dashboardId);
      }
    });
  }

  createDashboardTile(dashboard) {
    const isFavorite = this.favorites.has(dashboard.id);
    const category = this.categories.find(c => c.name === dashboard.category);
    const platform = this.platforms.find(p => p.name === dashboard.platform);

    return `
      <div class="dashboard-tile" data-dashboard-id="${dashboard.id}">
        <div class="dashboard-image" style="background-image: url('${dashboard.image}')">
        </div>
        <div class="dashboard-content">
          <h3 class="dashboard-title">${dashboard.title}</h3>
          <p class="dashboard-description">${dashboard.description}</p>
          
          <div class="dashboard-meta">
            <span class="platform-badge" style="background-color: ${
              platform?.color || '#gray'
            }20; color: ${platform?.color || '#gray'}">
              ${dashboard.platform}
            </span>
            <span class="category-badge" style="background-color: ${category?.color || '#gray'}">
              ${category?.icon || '📊'} ${dashboard.category}
            </span>
          </div>

          <div class="dashboard-tags">
            ${dashboard.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>

          <div class="dashboard-actions">
            <button class="btn btn-favorite ${isFavorite ? 'active' : ''}" 
                    title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
              ${isFavorite ? '❤️' : '🤍'}
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

  shareFavorites() {
    if (this.favorites.size === 0) {
      this.showToast('No favorites to share');
      return;
    }

    const state = {
      f: [...this.favorites],
      s: this.currentFilters.search,
      c: this.currentFilters.category,
      p: this.currentFilters.platform,
      t: this.currentFilters.tags,
    };

    const encoded = btoa(JSON.stringify(state));
    const shareUrl = `${window.location.origin}${window.location.pathname}?state=${encoded}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        this.showToast('Share link copied to clipboard!');
      })
      .catch(() => {
        prompt('Copy this link to share your favorites:', shareUrl);
      });
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
