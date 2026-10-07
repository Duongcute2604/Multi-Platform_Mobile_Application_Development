@echo off
chcp 65001 >nul
setlocal

REM ============================================================
REM  Cook - Tat Web Admin (5173) va Mobile Expo (8081).
REM  Khong tat Docker/MySQL, khong tat backend pm2, khong tat
REM  tien trinh khac cua ban.
REM  (Dung PowerShell de tim PID theo cong, tranh loi parse batch)
REM ============================================================

echo.
echo ============================================================
echo  Cook dev stop
echo ============================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ids = @();" ^
  "foreach ($port in 5173,8081) {" ^
  "  $lines = netstat -ano | Select-String (':' + $port + '\s') | Select-String 'LISTENING';" ^
  "  foreach ($line in $lines) {" ^
  "    $parts = ($line.Line -split '\s+') | Where-Object { $_ };" ^
  "    $p = [int]$parts[-1];" ^
  "    if ($ids -notcontains $p) { $ids += $p }" ^
  "  }" ^
  "}" ^
  "if ($ids.Count -eq 0) { Write-Output '  Khong co Web Admin (5173) / Mobile (8081) nao dang chay.' }" ^
  "else { foreach ($id in $ids) { Write-Output ('  Dang tat PID ' + $id + ' ...'); taskkill /F /T /PID $id 2>&1 | Out-Null } }"

echo.
echo  Da xong. Backend (3000) va MySQL (3306) van con chay.
echo  Tat backend:      pm2 stop cook-backend
echo  Tat MySQL/Docker: dung Docker Desktop
echo.
endlocal