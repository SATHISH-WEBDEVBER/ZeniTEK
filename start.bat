@echo off
title ZeniTEK Launcher
cd /d "%~dp0"

echo ============================================
echo   ZeniTEK Solar Thermal - Local Dev Launcher
echo ============================================

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js / npm not found. Install Node.js from https://nodejs.org
    pause
    exit /b 1
)

rem Install dependencies on first run
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    pushd frontend && call npm install && popd
)
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    pushd backend && call npm install && popd
)

rem 1. Start frontend (Vite on port 3000)
echo [1/3] Starting frontend...
start "ZeniTEK Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

rem 2. Start backend (Express on port 5000)
echo [2/3] Starting backend...
start "ZeniTEK Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

rem 3. Wait until the frontend responds, then open the default browser
echo [3/3] Waiting for http://localhost:3000 ...
set /a tries=0
:wait
set /a tries+=1
curl -s -o nul http://localhost:3000 >nul 2>nul
if not errorlevel 1 goto open
if %tries% geq 60 goto open
timeout /t 1 /nobreak >nul
goto wait

:open
start "" http://localhost:3000
echo Done. Close the "ZeniTEK Frontend" and "ZeniTEK Backend" windows to stop the servers.
timeout /t 5 >nul
