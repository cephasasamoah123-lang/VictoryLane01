@echo off
echo ====================================
echo Starting E-Commerce Platform
echo ====================================
echo.

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo ERROR: Dependencies not installed!
    echo Please run INSTALL.bat first or run: npm install
    echo.
    pause
    exit /b 1
)

echo Starting development server...
echo.
echo The application will open in your browser at:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
