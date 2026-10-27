# Attendance Analysis

A static web page for analysing Biometric and GreatHR attendance files. Open the [GitHub Pages app](https://barathcit.github.io/Orisenc-Technology-Attendance-/). You can select Biometric, GreatHR, and Employee Master together; the page checks the file columns, identifies each report, and shows record counts before analysis. The original separate upload fields are also available. After analysis, use the Dashboard, Employee Lookup, View by Date, and Reports pages. To use Team filters and absent reports, include the Employee Master file in the same session. Employee Master accepts either `Employee ID, Employee Name, Team` or `Emp ID, Name, Department` headings.

## Data handling

Imports are saved persistently in this browser using IndexedDB. Closing or reloading the tab does not require another upload; select **Open Dashboard** when saved data appears. Browser storage belongs to the browser profile and website address used for the import.

When the local Node server is running on the same PC, imports are also saved as JSON under `data/attendance/` and `data/employee_master.json`. The site loads and combines browser and server copies so records saved while the server was offline are still available. The page shows where each save succeeded. The `data/` and `backups/` folders remain ignored by Git and are not published on GitHub Pages.

To run the local server, use `npm install` once and then `node server.js` from this folder. The GitHub Pages app connects to `127.0.0.1:5000` on the PC opening the page. On the first connection, click **Connect local server** and allow the browser's loopback network permission. If that permission is blocked, open the local server version using the link on the upload page. The app also works without the server using browser storage. You can export reports to Excel or print them.

## Features

- Face, fingerprint, and GreatHR attendance views
- Employee lookup and daily punch details, including source In/Out values
- Date, team, and attendance-mode filters
- Cross-source first in, last out, and working hours calculations
- Attendance, late login, overtime, missing checkout, absent, duplicate punch, and source comparison reports
- Excel export and print

## Files

- `upload.html`: imports files, restores saved data, and opens reports
- `index.html`: dashboard
- `employee.html`: employee lookup
- `dayview.html`: day view
- `reports.html`: reports
- `att-data.js`: shared attendance data access and calculations
- `att-storage.js`, `browser-store.js`: persistent browser and server saving
- `server.js`: optional local Node server for JSON files
- `images/`: visual assets

## Author

Sherona Appalo
