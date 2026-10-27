// server-config.js
// Tells the dashboard pages where to find the local PC server (server.js).
//
// GitHub Pages runs in the browser and connects to the Node server on this PC.
// The browser keeps a persistent copy when this server is not running.
// The server address points to the same PC that opens the GitHub Pages link.
const SERVER_BASE_URL = location.hostname.endsWith('.github.io')
  ? 'http://127.0.0.1:5000'
  : '';
