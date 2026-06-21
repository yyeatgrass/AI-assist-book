# Build the Windows installers (.msi + NSIS .exe).
# Run this on a Windows machine in PowerShell:
#
#   powershell -ExecutionPolicy Bypass -File scripts\build\build-windows.ps1
#
# Prerequisites (one-time):
#   - Node.js 20+         https://nodejs.org
#   - Rust (stable)       https://rustup.rs
#   - Microsoft C++ Build Tools / "Desktop development with C++"
#   - WebView2 runtime    (preinstalled on Windows 10/11)

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..\..")

Write-Host "==> Installing frontend dependencies"
npm install

Write-Host "==> Building Windows bundle"
npm run tauri build

Write-Host ""
Write-Host "Done. Installers are in:"
Write-Host "  src-tauri\target\release\bundle\msi\   (.msi)"
Write-Host "  src-tauri\target\release\bundle\nsis\  (.exe setup)"
