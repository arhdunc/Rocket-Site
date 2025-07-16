import { html } from 'lit';

export { html };

export const layout = data => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${data.title || 'Dashboard Hub'}</title>
      <meta
        name="description"
        content="${data.description ||
        'Central portal for accessing multiple dashboards and reports'}"
      />

      <link rel="stylesheet" href="/src/styles/main.css" />

      <!-- Favicon -->
      <link rel="icon" href="/favicon.ico" />

      <!-- Theme color for mobile browsers -->
      <meta name="theme-color" content="#007bff" />
    </head>
    <body data-theme="light">
      <header class="header">
        <div class="container">
          <div class="header-content">
            <a href="/" class="logo">📊 Dashboard Hub</a>
            <div class="header-actions">
              <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
                🌙
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>${data.content()}</main>

      <!-- Load JavaScript modules -->
      <script type="module" src="/src/components/dashboard-hub.js"></script>

      <!-- Theme persistence script -->
      <script>
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('dashboard-hub-theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);

        // Update theme toggle icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
          themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
      </script>
    </body>
  </html>
`;
