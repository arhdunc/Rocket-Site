/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = 'index.rocket.js';
import { html, layout } from './recursive.data.js';
export { html, layout };
/* END - Rocket auto generated - do not touch */

export const title = 'Dashboard Hub';
export const description = 'Central portal for accessing multiple dashboards and reports';

export default () => html`
  <section class="search-section">
    <div class="container">
      <div class="search-container">
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
