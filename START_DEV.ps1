# Script para iniciar Frontend e Backend do App Financeiro

Write-Host "
╔════════════════════════════════════════╗
║  🚀 App Financeiro - Dev Environment  ║
╚════════════════════════════════════════╝
" -ForegroundColor Cyan

# Cores
$green = 'Green'
$yellow = 'Yellow'
$cyan = 'Cyan'

# Verificar se Node.js está instalado
Write-Host "✓ Verificando Node.js..." -ForegroundColor $yellow
$nodeVersion = node --version
Write-Host "  Node.js versão: $nodeVersion" -ForegroundColor $green

# Verificar se npm está instalado
Write-Host "`n✓ Verificando npm..." -ForegroundColor $yellow
$npmVersion = npm --version
Write-Host "  npm versão: $npmVersion" -ForegroundColor $green

# Iniciar Backend
Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor $cyan
Write-Host "║  Starting Backend Server...            ║" -ForegroundColor $cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor $cyan

Write-Host "`n📌 Abrindo novo terminal para BACKEND..." -ForegroundColor $yellow
$backendPath = "C:\Aplicativos\App financeiro\backend"

# Criar comando para backend
$backendCmd = @"
cd "$backendPath"
npm run dev
"@

# Abrir novo PowerShell para backend
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $backendCmd

Write-Host "✅ Backend iniciado em novo terminal`n" -ForegroundColor $green

# Esperar um pouco para backend iniciar
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor $cyan
Write-Host "║  Starting Frontend Server...           ║" -ForegroundColor $cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor $cyan

Write-Host "`n📌 Abrindo novo terminal para FRONTEND..." -ForegroundColor $yellow
$frontendPath = "C:\Aplicativos\App financeiro\frontend"

# Criar comando para frontend
$frontendCmd = @"
cd "$frontendPath"
npm run dev
"@

# Abrir novo PowerShell para frontend
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "✅ Frontend iniciado em novo terminal`n" -ForegroundColor $green

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor $green
Write-Host "║  ✅ Servidores Iniciados!              ║" -ForegroundColor $green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor $green

Write-Host "`n📊 Status:`n" -ForegroundColor $cyan
Write-Host "  🔵 Backend:  http://localhost:3000" -ForegroundColor $yellow
Write-Host "  🟢 Frontend: http://localhost:5173" -ForegroundColor $yellow
Write-Host "`n💡 Dica: Abra http://localhost:5173 no navegador`n" -ForegroundColor $yellow

Write-Host "Pressione qualquer tecla para fechar este terminal..." -ForegroundColor $gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
