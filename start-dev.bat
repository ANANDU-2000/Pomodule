@echo off
set ROOT=%~dp0
echo Starting PO Module (backend :3001 + frontend :5173)...
echo Project: %ROOT%
echo.
start "PO Backend" cmd /k "cd /d "%ROOT%backend" && npm run dev"
timeout /t 2 /nobreak >nul
start "PO Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"
timeout /t 4 /nobreak >nul
start http://localhost:5173/po/list
echo.
echo Two terminal windows should be open. Keep them running.
echo App: http://localhost:5173
echo Health: http://localhost:3001/health
pause
