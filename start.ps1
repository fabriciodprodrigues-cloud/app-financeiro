# Script para iniciar Frontend e Backend

Write-Host "Iniciando App Financeiro..." -ForegroundColor Green

# Backend
$backendPath = "C:\Aplicativos\App financeiro\backend"
$backendCmd = "cd '$backendPath'; npm run dev"

# Frontend
$frontendPath = "C:\Aplicativos\App financeiro\frontend"
$frontendCmd = "cd '$frontendPath'; npm run dev"

# Abrir Backend em novo terminal
Write-Host "Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Abrir Frontend em novo terminal
Write-Host "Iniciando Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "Servidores iniciados!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
