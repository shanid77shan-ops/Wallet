@echo off
echo Starting Crypto Wallet Development Environment...
echo.
echo Opening API Server in new window (port 3001)...
start cmd /k "node api-dev-server.js"

timeout /t 2 /nobreak

echo Opening Vite Dev Server in new window (port 5173)...
start cmd /k "npm run dev:vite"

echo.
echo ✅ Both servers are starting!
echo.
echo 📧 API Server: http://localhost:3001
echo 🎨 Frontend:   http://localhost:5173
echo.
pause
