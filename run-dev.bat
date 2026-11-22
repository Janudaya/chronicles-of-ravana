@echo off
cd /d "%~dp0"
set "PATH=C:\Users\JANUDAYA\.gemini\antigravity\scratch\nodejs;%PATH%"
set "NEXT_FORCE_SWC_WASM=1"
set "NEXT_TELEMETRY_DISABLED=1"
echo ========================================================
echo   RAVANA TRAIL - The Chronicle of Lanka
echo   Starting Next.js App Router Development Server...
echo ========================================================
call "C:\Users\JANUDAYA\.gemini\antigravity\scratch\nodejs\npm.cmd" run dev
pause
