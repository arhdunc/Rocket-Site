import { html } from 'lit';

export { html };

export const layout = data => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>Dashboard Hub</title>
      <meta
        name="description"
        content="Central portal for accessing multiple dashboards and reports"
      />
      <link rel="stylesheet" href="/main.css" />
      <link rel="icon" href="/favicon.ico" />
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

      <script type="module" src="/dashboard-hub.js"></script>
    </body>
  </html>
`;
