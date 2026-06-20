@echo off
REM ============================================================
REM Double Cert Management System - Startup Script
REM Recommended: double-click 启动系统.vbs instead of this file
REM ============================================================
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   Double Cert Management System
echo   Starting services...
echo ========================================
echo.

REM ===== 1. Check if Node.js is available =====
where node.exe >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is NOT installed or not in PATH!
    echo         Please download and install from:
    echo         https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node.exe --version') do set NODE_VER=%%i
echo [OK] Node.js found: %NODE_VER%

REM ===== 2. Check if launcher.js exists =====
if not exist "launcher.js" (
    echo.
    echo [ERROR] launcher.js not found in current directory!
    echo         Current directory: %~dp0
    echo.
    pause
    exit /b 1
)
echo [OK] launcher.js found

REM ===== 3. Check backend/frontend files =====
if not exist "backend\demo-server.js" (
    echo.
    echo [ERROR] backend\demo-server.js is missing!
    echo.
    pause
    exit /b 1
)
if not exist "frontend\package.json" (
    echo.
    echo [ERROR] frontend\package.json is missing!
    echo.
    pause
    exit /b 1
)
echo [OK] Project files verified

REM ===== 4. Inform user =====
echo.
echo [INFO] Services are starting in a new console window...
echo [INFO] Backend URL:  http://localhost:5000
echo [INFO] Frontend URL: http://localhost:3000
echo [INFO] Default account: admin / admin123
echo.
echo [TIP] A new console window will open showing logs.
echo       Wait about 20-30 seconds for the first compile,
echo       then manually open: http://localhost:3000
echo.
echo       To stop: press Ctrl+C in the service window,
echo       or double-click stop.bat
echo.

REM Small pause so user can read
timeout /t 3 /nobreak >nul

REM ===== 5. Start launcher in a new persistent window =====
REM The new cmd window uses /k so it stays open even if node exits
cd /d "%~dp0"
start "DoubleCert-System" cmd /k "node.exe launcher.js"

REM ===== 6. Done - do NOT auto-open browser (avoids duplicate tabs) =====
echo.
echo ========================================
echo   Startup requested successfully!
echo ========================================
echo.
echo [NOTE] Browser will NOT open automatically to avoid duplicate tabs.
echo        Please manually open this URL after ~20 seconds:
echo.
echo             http://localhost:3000
echo.
echo        If the page shows an error, wait 15 seconds and refresh.
echo        The React dev server takes a moment to compile on first run.
echo.
pause
