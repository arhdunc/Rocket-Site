/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = 'index.rocket.js';
import { html, layout } from './recursive.data.js';
export { html, layout };
/* END - Rocket auto generated - do not touch */

export const title = 'SPOT Hub';
export const description =
  'Your central portal for accessing business intelligence dashboards and analytics reports';

export default () => html`
  <section class="search-section">
    <div class="container">
      <div class="search-container">
        <div class="welcome-message">
          <h1>Welcome to the Dashboard Hub</h1>
          <p>
            Search for dashboards by name, category, platform, or tags. Filter by department, data
            source, or business area to find exactly what you need.
          </p>
        </div>
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="Search dashboards..."
            id="search-input"
          />
        </div>
        <div class="filters" id="filter-container">
          <!-- Filters will be populated by JavaScript -->
        </div>
      </div>
    </div>
  </section>

  <section class="main-content">
    <div class="container">
      <div id="dashboard-grid" class="dashboard-grid">
        <!-- Dashboard tiles will be populated by JavaScript -->
        <div class="loading">Loading dashboards...</div>
      </div>

      <div id="empty-state" class="empty-state" style="display: none;">
        <div class="empty-state-icon">🔍</div>
        <h3>No dashboards found</h3>
        <p>Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    </div>
  </section>

  <!-- Toast notifications -->
  <div id="toast" class="toast"></div>
`;
