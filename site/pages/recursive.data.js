import { html } from 'lit';

export { html };

export const layout = data => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>SPOT Hub</title>
      <meta
        name="description"
        content="Central portal for accessing multiple dashboards and reports"
      />
      <link rel="stylesheet" href="/main.css" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="theme-color" content="#55406D" />
    </head>
    <body data-theme="light">
      <header class="header">
        <div class="container">
          <div class="header-content">
            <a href="/" class="logo">📊 SPOT Hub</a>
            <div class="header-actions">
              <button
                class="theme-toggle light-mode"
                id="theme-toggle"
                aria-label="Toggle dark mode"
              >
                ☾
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>${data.content()}</main>

      <script type="module" src="/dashboard-hub.js"></script>

      <!-- Debug script for theme toggle -->
      <script>
        console.log('Inline debug script loaded');

        // Simple theme toggle test
        window.debugToggleTheme = function () {
          console.log('Debug toggle called');
          const body = document.body;
          const current = body.getAttribute('data-theme') || 'light';
          const newTheme = current === 'dark' ? 'light' : 'dark';
          body.setAttribute('data-theme', newTheme);
          console.log('Theme changed from', current, 'to', newTheme);

          // Test if CSS variables are working
          const bgColor = window.getComputedStyle(body).backgroundColor;
          console.log('New background color:', bgColor);
        };

        // Add a simple click handler as backup
        document.addEventListener('DOMContentLoaded', function () {
          console.log('DOM loaded, looking for theme toggle...');
          const toggle = document.getElementById('theme-toggle');
          if (toggle) {
            console.log('Found theme toggle button');
            // Add a backup click handler
            toggle.addEventListener('click', function (e) {
              console.log('Backup theme toggle clicked');
              window.debugToggleTheme();
            });
          } else {
            console.error('Theme toggle button not found!');
          }
        });
      </script>
    </body>
  </html>
`;
