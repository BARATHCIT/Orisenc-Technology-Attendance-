// Saves attendance in this browser and, when reachable, on the same PC's Node server.
(function () {
  const attendanceKeys = [
    'att_face_summary', 'att_fingerprint_summary', 'att_ghr_summary', 'att_punch_details'
  ];
  const keys = [...attendanceKeys, 'master'];
  const browserKey = key => key === 'master' ? 'emp_master' : key;
  const serverPath = key => key === 'master'
    ? '/api/employee-master'
    : '/api/attendance/' + encodeURIComponent(key);
  const serverBase = typeof SERVER_BASE_URL === 'string' ? SERVER_BASE_URL : '';
  const loopbackOptions = location.hostname.endsWith('.github.io')
    ? { targetAddressSpace: 'loopback' } : {};

  async function readBrowser(key) {
    const name = browserKey(key);
    try {
      const stored = await window.BrowserStore.get(name);
      if (Array.isArray(stored)) return stored;
    } catch (error) {
      console.warn('Browser storage read failed:', error);
    }
    try {
      const oldValue = localStorage.getItem(name);
      const parsed = oldValue ? JSON.parse(oldValue) : null;
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  async function writeBrowser(key, rows) {
    const name = browserKey(key);
    try {
      await window.BrowserStore.put(name, rows);
    } catch (error) {
      // Keep the older localStorage path available if IndexedDB is blocked.
      localStorage.setItem(name, JSON.stringify(rows));
    }
  }

  async function readServer(key) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch(serverBase + serverPath(key), {
        cache: 'no-store', signal: controller.signal, ...loopbackOptions
      });
      if (!response.ok) throw new Error('Server read failed (' + response.status + ')');
      const rows = await response.json();
      if (!Array.isArray(rows)) throw new Error('Invalid server data');
      return rows;
    } finally {
      clearTimeout(timer);
    }
  }

  async function load(merge = {}) {
    const browser = await Promise.all(keys.map(readBrowser));
    const server = keys.map(() => ({ status: 'rejected' }));
    try {
      const master = await readServer('master');
      server[keys.indexOf('master')] = { status: 'fulfilled', value: master };
      const attendance = await Promise.allSettled(attendanceKeys.map(readServer));
      attendance.forEach((result, index) => { server[index] = result; });
    } catch (error) {
      console.warn('Local Node server read failed:', error);
    }
    const data = {};
    keys.forEach((key, index) => {
      const serverRows = server[index].status === 'fulfilled' ? server[index].value : null;
      const browserRows = browser[index];
      // Keep records from both copies if one was updated while the other was unavailable.
      const mergeRows = key === 'att_punch_details' ? merge.punches
        : key === 'master' ? merge.master : merge.summary;
      data[key] = serverRows?.length && browserRows?.length && mergeRows
        ? mergeRows(serverRows, browserRows)
        : browserRows?.length ? browserRows : serverRows || browserRows || [];
    });
    await Promise.allSettled(keys.map(key => writeBrowser(key, data[key])));
    return {
      data,
      hasAttendance: attendanceKeys.some(key => data[key].length > 0),
      serverAvailable: server.every(result => result.status === 'fulfilled')
    };
  }

  async function writeServer(key, rows) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(serverBase + serverPath(key), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows), signal: controller.signal, ...loopbackOptions
      });
      if (!response.ok) throw new Error('Server save failed (' + response.status + ')');
    } finally {
      clearTimeout(timer);
    }
  }

  async function save(data, selectedKeys = keys) {
    const browser = await Promise.allSettled(selectedKeys.map(key =>
      writeBrowser(key, data[key])));
    let server = selectedKeys.map(() => ({ status: 'rejected' }));
    try {
      await readServer('master');
      server = await Promise.allSettled(selectedKeys.map(key => writeServer(key, data[key])));
    } catch (error) {
      console.warn('Local Node server save is unavailable:', error);
    }
    const browserSaved = browser.every(result => result.status === 'fulfilled');
    const serverSaved = server.every(result => result.status === 'fulfilled');
    if (!browserSaved && !serverSaved) {
      throw new Error('Could not save in this browser or on the local Node server. Check browser storage or start node server.js.');
    }
    return { browserSaved, serverSaved };
  }

  window.AttStorage = { load, save, attendanceKeys };
})();
