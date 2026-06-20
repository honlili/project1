@echo off
REM Double Cert System - Stop Script
chcp 65001 >nul

echo.
echo ========================================
echo   Double Cert System - Stop Services
echo ========================================
echo.

echo [1/3] Stopping Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/3] Stopping npm processes...
taskkill /F /IM npm.cmd >nul 2>&1
taskkill /F /FI "IMAGENAME eq cmd.exe" /FI "WINDOWTITLE eq Backend*" >nul 2>&1
taskkill /F /FI "IMAGENAME eq cmd.exe" /FI "WINDOWTITLE eq Frontend*" >nul 2>&1
taskkill /F /FI "IMAGENAME eq cmd.exe" /FI "WINDOWTITLE eq DoubleCert*" >nul 2>&1

echo [3/3] Cleaning up...
timeout /t 1 /nobreak >nul

echo.
echo ========================================
echo   All services stopped!
echo ========================================
echo.
pause
