@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 22 ou superior antes de continuar.
  pause
  exit /b 1
)
if not exist "node_modules\@prisma\client\package.json" (
  call npm ci
  if errorlevel 1 goto failed
)
call npm run setup
if errorlevel 1 goto failed
echo Abra http://localhost:3000 no navegador. Mantenha esta janela aberta.
call npm start
if errorlevel 1 goto failed
exit /b 0
:failed
echo Nao foi possivel iniciar. Confira a mensagem acima.
pause
exit /b 1
