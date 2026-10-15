// server-config.js
// Tells the dashboard pages where to find the local PC server (server.js).
//
// GitHub Pages runs in the browser and connects to the Node server on this PC.
// The server must be running on this same PC while using the GitHub Pages link.
//
// To use the dashboard from ANOTHER computer on the same network, set this
// to the host PC's network IP address and port, e.g.:
//   const SERVER_BASE_URL = 'http://192.168.1.50:5000';
const SERVER_BASE_URL = location.hostname.endsWith('.github.io')
  ? 'http://localhost:5000'
  : '';
