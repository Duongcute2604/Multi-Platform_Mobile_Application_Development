@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ============================================================
REM  Cook - Khoi dong toan bo dev (1 lenh):
REM   1. Cho MySQL Docker (cong 3306)
REM   2. Backend NestJS (pm2: cook-backend)
REM   3. Web Admin Vite  (cong 5173)
REM   4. Mobile Expo web  (cong 8081)
REM ============================================================

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%recipe-backend-api"
set "WEB_DIR=%ROOT%recipe-admin-web"
set "MOBILE_DIR=%ROOT%recipe-app-mobile"

set "MYSQL_PORT=3306"
set "WEB_PORT=5173"
set "EXPO_PORT=8081"
set "BACKEND_PORT=3000"
set "PM2_APP=cook-backend"

echo.
echo ============================================================
echo  Cook dev launcher
echo ============================================================
echo.

REM ---------- 1/4 MySQL Docker ----------
echo [1/4] Kiem tra MySQL (cong %MYSQL_PORT%) ...
set "mysql_ok="
for /l %%i in (1,1,60) do (
  powershell -NoProfile -Command "try { $c = New-Object Net.Sockets.TcpClient('127.0.0.1', %MYSQL_PORT%); if ($c.Connected) { $c.Close(); exit 0 } } catch { exit 1 }" >nul 2>&1
  if not errorlevel 1 (
    set "mysql_ok=1"
    goto mysql_up
  )
  if "%%i"=="1" (
    echo     MySQL chua len. Dang mo Docker Desktop...
    if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
      start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    )
  )
  timeout /t 1 /nobreak >nul
)
echo     [SAI] MySQL khong len sau 60s. Vui long mo Docker Desktop roi chay lai.
exit /b 1

:mysql_up
echo     MySQL OK.

REM ---------- 2/4 Backend ----------
echo [2/4] Backend (pm2: %PM2_APP%) ...
set "pm2_ok="
for /f "usebackq delims=" %%l in (`pm2 ls 2^>nul ^| findstr "%PM2_APP%" ^| findstr "online"`) do set "pm2_ok=1"
if defined pm2_ok (
  echo     Backend da online.
) else (
  echo     Backend chua chay. Dang khoi dong...
  pushd "%BACKEND_DIR%"
  call pm2 start "dist\recipe-backend-api\src\main.js" --name %PM2_APP% --cwd "%BACKEND_DIR%" >nul 2>&1
  popd
)
echo     Dang cho backend (cong %BACKEND_PORT%)...
set "backend_up="
for /l %%i in (1,1,30) do (
  powershell -NoProfile -Command "try { $c = New-Object Net.Sockets.TcpClient('127.0.0.1', %BACKEND_PORT%); if ($c.Connected) { $c.Close(); exit 0 } } catch { exit 1 }" >nul 2>&1
  if not errorlevel 1 (
    set "backend_up=1"
    goto backend_up
  )
  timeout /t 1 /nobreak >nul
)
echo     [SAI] Backend khong len sau 30s. Xem log: pm2 logs %PM2_APP%
exit /b 1

:backend_up
echo     Backend OK. Docs: http://localhost:%BACKEND_PORT%/api/docs

REM ---------- 3/4 Web Admin ----------
echo [3/4] Web Admin (cong %WEB_PORT%) ...
set "web_used="
for /f "usebackq delims=" %%l in (`netstat -ano ^| findstr ":%WEB_PORT% " ^| findstr "LISTENING"`) do set "web_used=1"
if defined web_used (
  echo     Web Admin da chay.
) else (
  echo     Dang mo cua so moi: Vite :%WEB_PORT%
  start "Cook Web Admin" /D "%WEB_DIR%" cmd /k "npx vite --port %WEB_PORT% --host"
)

REM ---------- 4/4 Mobile ----------
echo [4/4] Mobile Expo (cong %EXPO_PORT%) ...
set "expo_used="
for /f "usebackq delims=" %%l in (`netstat -ano ^| findstr ":%EXPO_PORT% " ^| findstr "LISTENING"`) do set "expo_used=1"
if defined expo_used (
  echo     Expo da chay.
) else (
  echo     Dang mo cua so moi: Expo web :%EXPO_PORT%
  start "Cook Mobile" /D "%MOBILE_DIR%" cmd /k "npx expo start --web --port %EXPO_PORT%"
)

echo.
echo ============================================================
echo  Khoi dong xong. URL:
echo    Backend API : http://localhost:%BACKEND_PORT%/api/docs
echo    Web Admin   : http://localhost:%WEB_PORT%
echo    Mobile (web): http://localhost:%EXPO_PORT%
echo ============================================================
echo  Tat dev web/mobile bang stop-dev.cmd (khong tat MySQL/backend).
echo.
endlocal