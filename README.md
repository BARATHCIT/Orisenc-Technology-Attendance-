# Attendance Analysis

A static web page for analysing Biometric and GreatHR attendance files. Open the [GitHub Pages app](https://barathcit.github.io/Orisenc-Technology-Attendance-/), choose both attendance reports, and select **Analyse Attendance**. You can then use the Dashboard, Employee Lookup, View by Date, and Reports pages. An Employee Master file is optional for team names and absent reports.

## Data handling

Uploaded records remain in memory in the open browser tab. The app does not send attendance records to a server or write them to localStorage, IndexedDB, or cookies. Closing or reloading the tab discards the analysis; upload the files again to continue. You can export reports to Excel or print them when you need a copy. No Node.js installation or local server is required.

Existing local `data/` and `backups/` folders from older versions are not read by this web app. They remain ignored by Git.

## Features

- Face, fingerprint, and GreatHR attendance views
- Employee lookup and daily punch details, including source In/Out values
- Date, team, and attendance-mode filters
- Cross-source first in, last out, and working hours calculations
- Attendance, late login, overtime, missing checkout, absent, duplicate punch, and source comparison reports
- Excel export and print

## Files

- `upload.html`: imports and keeps the current tab's data in memory
- `index.html`: dashboard
- `employee.html`: employee lookup
- `dayview.html`: day view
- `reports.html`: reports
- `att-data.js`: shared in-memory data access and attendance calculations
- `images/`: visual assets

## Author

Sherona Appalo
