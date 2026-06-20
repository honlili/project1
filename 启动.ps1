# Double Cert Management System - PowerShell Launcher
# Usage: Right-click -> Run with PowerShell

$ErrorActionPreference = "Continue"

# Get script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Double Cert System - Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check node.exe
try {
    $nodeVer = & node.exe --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Node.js found: $nodeVer" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "[ERROR] Node.js is NOT installed or not in PATH!" -ForegroundColor Red
    Write-Host "         Please download and install from:" -ForegroundColor Yellow
    Write-Host "         https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    Exit 1
}

# Check launcher.js
if (-not (Test-Path "$scriptPath\launcher.js")) {
    Write-Host "[ERROR] launcher.js not found in current directory!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    Exit 1
}
Write-Host "[OK] launcher.js found" -ForegroundColor Green

# Check project files
if (-not (Test-Path "$scriptPath\backend\demo-server.js") -or -not (Test-Path "$scriptPath\frontend\package.json")) {
    Write-Host "[ERROR] Project files missing!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    Exit 1
}
Write-Host "[OK] Project files verified" -ForegroundColor Green

Write-Host ""
Write-Host "[INFO] Backend URL:  http://localhost:5000" -ForegroundColor Gray
Write-Host "[INFO] Frontend URL: http://localhost:3000" -ForegroundColor Gray
Write-Host "[INFO] Default account: admin / admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "[NOTE] Browser will NOT open automatically to avoid duplicate tabs." -ForegroundColor Yellow
Write-Host "       Please manually open http://localhost:3000 after ~20 seconds." -ForegroundColor Gray
Write-Host ""

Start-Sleep -Seconds 2

# Start launcher in a new visible window
try {
    Start-Process cmd -ArgumentList "/k", "cd /d ""$scriptPath"" && node.exe launcher.js" -WindowStyle Normal
    Write-Host "[INFO] Service window launched." -ForegroundColor Yellow
} catch {
    Write-Host "[ERROR] Failed to start: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    Exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Startup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Now please manually open: http://localhost:3000" -ForegroundColor Gray
Write-Host "(React dev server needs ~20 seconds for first compile)" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to close this window (services keep running)"
