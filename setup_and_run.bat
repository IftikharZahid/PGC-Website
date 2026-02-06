@echo off
setlocal
title PGC Website - Auto Setup & Run

echo ===================================================
echo      PGC Website - Automated Setup & Launcher
echo ===================================================
echo.
echo This script will install dependencies (if needed)
echo and start both the Backend Server and Frontend Client.
echo.

:: ---------------------------------------
:: Check for Node.js
:: ---------------------------------------
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: ---------------------------------------
:: Server Setup
:: ---------------------------------------
echo [1/2] Checking Server...
cd server
if not exist "node_modules" (
    echo    - Installing server dependencies (this may take a minute)...
    call npm install
) else (
    echo    - Server dependencies already installed.
)
cd ..

:: ---------------------------------------
:: Client Setup
:: ---------------------------------------
echo [2/2] Checking Client...
cd client
if not exist "node_modules" (
    echo    - Installing client dependencies (this may take a minute)...
    call npm install
) else (
    echo    - Client dependencies already installed.
)
cd ..

:: ---------------------------------------
:: Start Application
:: ---------------------------------------
echo.
echo Starting Application...
echo.

:: Start Server in a new window
echo Starting Backend Server...
start "PGC Server (Port 5000)" cmd /k "cd server && npm start"

:: Wait a few seconds for server to initialize
timeout /t 5 /nobreak >nul

:: Start Client in a new window
echo Starting Frontend Client...
start "PGC Client" cmd /k "cd client && npm run dev"

echo.
echo ===================================================
echo System is running!
echo Backend: Check the "PGC Server" window for logs.
echo Frontend: Browser should open automatically (or check "PGC Client" window).
echo ===================================================
echo.
pause
