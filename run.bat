@echo off
setlocal enabledelayedexpansion
title Spiro's Diner — Starting...
color 0A

echo.
echo  ========================================
echo    Spiro's Diner — Starting Services
echo  ========================================
echo.

REM ── MOBILE FLAG ──────────────────────────────────────────────────
set MOBILE_FLAG=0
for %%a in (%*) do (
    if "%%a"=="--mobile" set MOBILE_FLAG=1
)

if %MOBILE_FLAG% equ 1 (
    echo [INFO] --mobile flag detected.
    set "ANDROID_STUDIO_FOUND=0"
    if EXIST "C:\Program Files\Android\Android Studio\bin\studio64.exe"       set ANDROID_STUDIO_FOUND=1
    if EXIST "C:\Program Files (x86)\Android\Android Studio\bin\studio64.exe" set ANDROID_STUDIO_FOUND=1

    if "!ANDROID_STUDIO_FOUND!"=="0" (
        echo [ERROR] Android Studio not found. Please install it first.
        exit /b 1
    )
    if EXIST "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
        start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" ".\mobile"
    ) else (
        start "" "C:\Program Files (x86)\Android\Android Studio\bin\studio64.exe" ".\mobile"
    )
)

REM ── STOP ANYTHING ALREADY RUNNING ON OUR PORTS ───────────────────
echo [1/5] Freeing ports 8000 and 8080...

for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8000 "') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8080 "') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo [1/5] Ports cleared.

REM ── CHECK DOCKER ─────────────────────────────────────────────────
echo [2/5] Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Docker is not running.
    echo         Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)
echo [2/5] Docker is running.

REM ── STOP OLD CONTAINERS ──────────────────────────────────────────
echo [3/5] Stopping any previous containers...
where docker-compose >nul 2>&1
if %errorlevel% equ 0 (
    set COMPOSE_CMD=docker-compose
) else (
    docker compose version >nul 2>&1
    if %errorlevel% equ 0 (
        set COMPOSE_CMD=docker compose
    ) else (
        echo [ERROR] Neither 'docker-compose' nor 'docker compose' found.
        pause
        exit /b 1
    )
)
%COMPOSE_CMD% down >nul 2>&1
echo [3/5] Old containers stopped.

REM ── COPY .ENV FILES IF MISSING ───────────────────────────────────
echo [4/5] Checking environment files...

if not exist "frontend\.env" (
    if exist "frontend\.env.template" (
        copy /Y "frontend\.env.template" "frontend\.env" >nul
        echo [4/5] Created frontend\.env from template.
    )
) else (
    echo [4/5] frontend\.env already exists.
)

if not exist "backend\.env" (
    if exist "backend\.env.template" (
        copy /Y "backend\.env.template" "backend\.env" >nul
        echo [4/5] Created backend\.env from template.
    )
) else (
    echo [4/5] backend\.env already exists.
)

REM ── START CONTAINERS ─────────────────────────────────────────────
echo [5/5] Starting containers (this may take a moment on first run)...
echo.

REM Open browser after a short delay in the background
start /b cmd /c "timeout /t 12 /nobreak >nul && start http://localhost:8080"

REM Start docker compose (foreground so logs are visible)
%COMPOSE_CMD% up --build

exit /b 0
