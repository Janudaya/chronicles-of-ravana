$env:PATH = "C:\Users\JANUDAYA\.gemini\antigravity\scratch\nodejs;" + $env:PATH
$env:NEXT_FORCE_SWC_WASM = "1"
$env:NEXT_TELEMETRY_DISABLED = "1"

Set-Location "C:\Users\JANUDAYA\.gemini\antigravity\scratch\chronicles-of-ravana"
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  RAVANA TRAIL - The Chronicle of Lanka" -ForegroundColor Gold
Write-Host "  Starting Next.js App Router on http://localhost:3000..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Yellow

& "C:\Users\JANUDAYA\.gemini\antigravity\scratch\nodejs\node.exe" "node_modules\next\dist\bin\next" dev -p 3000
