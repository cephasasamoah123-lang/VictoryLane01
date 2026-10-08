@echo off
echo Starting VictoryLane - Backend and Frontend...
echo.

REM Start the C# backend in its own window
start "VictoryLane - Backend" cmd /k "cd /d %~dp0server && dotnet run"

REM Give the backend a few seconds head start
timeout /t 5 /nobreak >nul

REM Start the frontend in its own window
start "VictoryLane - Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close BOTH windows when you're done, or just close this one.
pause