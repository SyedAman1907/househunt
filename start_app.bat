@echo off
echo Starting HouseHunt Application...

:: Start Backend in a new window
echo Starting Backend (Server)...
start "HouseHunt Backend" cmd /k "cd /d "%~dp0househunt backend" && npm install && node server.js"

:: Start Frontend in a new window
echo Starting Frontend (Client)...
start "HouseHunt Client" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"

echo.
echo Application started! 
echo Backend running on http://localhost:5000
echo Frontend running on http://localhost:5173
echo.
pause
