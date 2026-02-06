@echo off
echo ===================================================
echo   PGC Website - Fast & Secure Demo Link
echo ===================================================
echo.
echo Step 1: Starting Backend Server...
start "PGC Server" /min cmd /k "cd server && npm run dev"

echo Step 2: Starting Frontend Client...
start "PGC Client" /min cmd /k "cd client && npm run dev -- --port 5173"

echo.
echo Waiting 10 seconds for servers to fully start...
timeout /t 10 /nobreak >nul

echo.
echo Step 3: Generating Secure Link...
echo.
echo ===================================================
echo INSTRUCTIONS:
echo 1. The script will now try to connect using SSH.
echo 2. If valid, you will see a URL like 'domain.localhost.run'.
echo 3. COPY that URL and share it.
echo.
echo NOTE: If asked "Are you sure you want to continue connecting?", type 'yes' and press ENTER.
echo ===================================================
echo.
ssh -R 80:localhost:5173 nokey@localhost.run
pause
