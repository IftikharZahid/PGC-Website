# PGC Website - Migration & Setup Guide

This guide explains how to move your project to a new laptop using a USB drive and set it up to run strictly offline or on a new local network.

## 1. Prerequisites (On the New Laptop)

Before you copy the files, ensure the new laptop has the following installed:

1.  **Node.js (LTS Version)**
    *   Download and install from: [https://nodejs.org/](https://nodejs.org/)
    *   Verify by opening a terminal (Command Prompt) and typing: `node -v`

2.  **MongoDB Community Server**
    *   Download and install from: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
    *   **IMPORTANT:** During installation, choose "Run service as Network Service user" (default).
    *   Install **MongoDB Compass** (optional but recommended for viewing data).

3.  **VS Code (Optional)**
    *   Recommended text editor: [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

## 2. Copying the Project

1.  **Copy to USB**: Copy the entire `PGC Website` folder from your current computer to your USB drive.
2.  **Copy to New Laptop**: Paste the folder onto the new laptop (e.g., on the `Desktop`).

---

## 3. One-Click Setup & Run

We have created an automated script to handle installation and startup.

1.  Open the `PGC Website` folder on the new laptop.
2.  Double-click the **`setup_and_run.bat`** file.
3.  This script will automatically:
    *   Install `client` (Frontend) dependencies.
    *   Install `server` (Backend) dependencies.
    *   Start the Backend Server (Termial Window 1).
    *   Start the Frontend Client (Terminal Window 2).

**Note:** The first time you run this, it depends on your internet speed to download the `node_modules`. Subsequent runs will be instant.

---

## 4. Manual Setup (If the script fails)

If the batch script doesn't work, you can do it manually:

### Step A: Setup Backend (Server)
1.  Open Command Prompt (`cmd`).
2.  Navigate to the server folder:
    ```bash
    cd "Desktop\PGC Website\server"
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    *   It should say `Server running on port 5000` and `MongoDB Connected`.

### Step B: Setup Frontend (Client)
1.  Open a **new** Command Prompt window.
2.  Navigate to the client folder:
    ```bash
    cd "Desktop\PGC Website\client"
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the app:
    ```bash
    npm run dev
    ```
5.  Open the link shown (usually `http://localhost:5173`) in your browser.

---

## 5. Database Setup (Seeding Data)

If you are on a fresh laptop, your database will be empty. To add sample students and results:

1.  Ensure the server is running.
2.  Open a terminal in the `server` folder.
3.  Run the student seeder:
    ```bash
    node seed_students.js
    ```
4.  Run the results seeder (if available):
    ```bash
    node seed_results.js
    ```
    *(Or any other seed scripts present in the `server` folder)*

---

## 6. Database Backup & Restore (Optional)

If you want to keep your **existing data** (students, results, etc.) instead of starting fresh:

### Exporting Data (On Old Laptop)
1.  Open **MongoDB Compass** and connect to your database (e.g., `punjab-college`).
2.  Select a collection (e.g., `students`).
3.  Click the **Export Data** button (usually in the top menu bar or collection tab).
4.  Choose **JSON** format and select "Export Full Collection".
5.  Save the file (e.g., `students_backup.json`) to your USB drive.
6.  Repeat for other collections if needed.

### Importing Data (On New Laptop)
1.  Ensure you have completed "Step B: Setup Backend" and the server is running (so the database is created).
2.  Open **MongoDB Compass** on the new laptop.
3.  Connect and navigate to the `punjab-college` database.
4.  Select (or create) the collection you want to restore (e.g., `students`).
5.  Click the **Add Data** -> **Import JSON or CSV file**.
6.  Select the backup file from your USB drive and click **Import**.

---

## Troubleshooting

*   **'node' is not recognized**: You haven't installed Node.js or need to restart your computer/terminal after installation.
*   **MongoDB connection error**:
    *   Ensure MongoDB service is running in Windows Services.
    *   Check `server/.env` file. If running locally, ensure `MONGODB_URI` aligns with your local setup (usually `mongodb://localhost:27017/punjab-college` or similar, depending on if you use Cloud or Local).
    *   *Tip: The project currently uses a Cloud Atlas URI in `.env`. For purely offline use, comment that out and uncomment the local URI.*

