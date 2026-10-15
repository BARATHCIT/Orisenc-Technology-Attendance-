/**
 * server.js — local PC server for the Attendance Dashboard.
 *
 * Replaces Firebase/Firestore: attendance data and the Employee Master are
 * stored as plain JSON files on this computer, under the data/ folder
 * (created automatically on first run). No cloud account or database
 * setup is required.
 *
 * Run with:
 *   npm install
 *   node server.js
 * Then open http://localhost:5000 in a browser.
 *
 * To reach this dashboard from another computer on the same network,
 * update SERVER_BASE_URL in server-config.js to this PC's network IP
 * address (e.g. "http://192.168.1.50:5000") instead of "localhost".
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const ATTENDANCE_DIR = path.join(DATA_DIR, 'attendance');
const EMPLOYEE_MASTER_FILE = path.join(DATA_DIR, 'employee_master.json');

// Only these attendance keys may be read/written — prevents arbitrary
// filenames (and path traversal) being used as the JSON filename.
const ALLOWED_ATTENDANCE_KEYS = new Set([
  'att_face_summary',
  'att_fingerprint_summary',
  'att_ghr_summary',
  'att_punch_details',
]);

function ensureDataDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ATTENDANCE_DIR)) fs.mkdirSync(ATTENDANCE_DIR, { recursive: true });
}
ensureDataDirs();

function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read ${filePath}:`, e.message);
    return [];
  }
}

// Writes atomically (write to a temp file, then rename) so a crash or power
// loss mid-write can never corrupt the existing data file.
function writeJsonFile(filePath, data) {
  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(data));
  fs.renameSync(tmpPath, filePath);
}

app.use(express.json({ limit: '100mb' }));

// ── Attendance data (face / fingerprint / Great HR summaries + punch details) ──
app.get('/api/attendance/:key', (req, res) => {
  const { key } = req.params;
  if (!ALLOWED_ATTENDANCE_KEYS.has(key)) {
    return res.status(400).json({ error: 'Unknown attendance key: ' + key });
  }
  const filePath = path.join(ATTENDANCE_DIR, key + '.json');
  res.json(readJsonFile(filePath));
});

app.post('/api/attendance/:key', (req, res) => {
  const { key } = req.params;
  if (!ALLOWED_ATTENDANCE_KEYS.has(key)) {
    return res.status(400).json({ error: 'Unknown attendance key: ' + key });
  }
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Expected a JSON array body' });
  }
  const filePath = path.join(ATTENDANCE_DIR, key + '.json');
  try {
    writeJsonFile(filePath, req.body);
    res.json({ ok: true, count: req.body.length });
  } catch (e) {
    console.error('Failed to save attendance data:', e.message);
    res.status(500).json({ error: 'Failed to save data on the server' });
  }
});

// ── Employee Master (kept separate — never touched by attendance retention) ──
app.get('/api/employee-master', (req, res) => {
  res.json(readJsonFile(EMPLOYEE_MASTER_FILE));
});

app.post('/api/employee-master', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Expected a JSON array body' });
  }
  try {
    writeJsonFile(EMPLOYEE_MASTER_FILE, req.body);
    res.json({ ok: true, count: req.body.length });
  } catch (e) {
    console.error('Failed to save Employee Master:', e.message);
    res.status(500).json({ error: 'Failed to save data on the server' });
  }
});

// ── Static dashboard files (index.html, employee.html, etc.) ────────────────
// Keep local records, backups, and installed packages out of the public site.
app.use(['/data', '/backups', '/node_modules'], (_req, res) => res.sendStatus(404));
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Attendance Dashboard server running at http://localhost:${PORT}`);
  console.log(`Data is stored locally in: ${DATA_DIR}`);
});
