@echo off
echo ========================================================
echo Stopping all running microservices and frontend ports...
echo ========================================================

for %%p in (8761 8080 8081 8082 8083 5173 5174 5175 5176) do (
    echo Checking port %%p...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%p " ^| findstr "LISTENING"') do (
        echo Killing PID %%a on port %%p...
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo.
echo All microservices and frontend ports (8761, 8080, 8081, 8082, 8083, 5173, 5174, 5175, 5176) stopped successfully!
