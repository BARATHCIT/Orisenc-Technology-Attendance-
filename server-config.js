// server-config.js
// Tells the dashboard pages where to find the local PC server (server.js).
//
// Leave this blank ('') when you open the dashboard from the same computer
// that is running "node server.js" (the normal case) — the pages will just
// call back to whichever host served them.
//
// To use the dashboard from ANOTHER computer on the same network, set this
// to the host PC's network IP address and port, e.g.:
//   const SERVER_BASE_URL = 'http://192.168.1.50:5000';
const SERVER_BASE_URL = '';
