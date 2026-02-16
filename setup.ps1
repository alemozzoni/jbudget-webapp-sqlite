# Script di Setup Automatico JBudget SQLite per Windows
# Esegue tutti i passaggi necessari per avviare l'applicazione

Write-Host "🚀 JBudget SQLite - Setup Automatico" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Funzioni per output colorato
function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Controlla se Node.js è installato
Write-Host "🔍 Controllo prerequisiti..." -ForegroundColor White
try {
    $nodeVersion = node --version
    Write-Success "Node.js installato: $nodeVersion"
} catch {
    Write-Error "Node.js non è installato!"
    Write-Host "   Scarica da: https://nodejs.org/" -ForegroundColor White
    exit 1
}
Write-Host ""

# Setup Backend
Write-Host "📦 Configurazione Backend..." -ForegroundColor White
Set-Location server

# Installa dipendenze
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installazione dipendenze..." -ForegroundColor Gray
    npm install
    Write-Success "Dipendenze backend installate"
} else {
    Write-Success "Dipendenze backend già installate"
}

# Crea file .env se non esiste
if (-not (Test-Path ".env")) {
    Write-Host "   Creazione file .env..." -ForegroundColor Gray
    Copy-Item .env.example .env
    Write-Success "File .env creato"
} else {
    Write-Warning "File .env già esistente (non sovrascritto)"
}

Set-Location ..
Write-Host ""

# Setup Frontend
Write-Host "📦 Configurazione Frontend..." -ForegroundColor White
Set-Location client

# Installa dipendenze
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installazione dipendenze..." -ForegroundColor Gray
    npm install
    Write-Success "Dipendenze frontend installate"
} else {
    Write-Success "Dipendenze frontend già installate"
}

# Crea file .env se non esiste
if (-not (Test-Path ".env")) {
    Write-Host "   Creazione file .env..." -ForegroundColor Gray
    Copy-Item .env.example .env
    Write-Success "File .env creato"
} else {
    Write-Warning "File .env già esistente (non sovrascritto)"
}

Set-Location ..
Write-Host ""

# Inizializza database (opzionale)
Write-Host "💾 Inizializzazione Database..." -ForegroundColor White
$response = Read-Host "Vuoi creare dati di esempio nel database? (y/N)"
if ($response -eq "y" -or $response -eq "Y") {
    Set-Location server
    npm run init-db:seed
    Set-Location ..
    Write-Success "Database inizializzato con dati demo"
    Write-Host ""
    Write-Host "   📧 Email demo: demo@jbudget.app" -ForegroundColor Cyan
    Write-Host "   🔑 Password demo: demo123" -ForegroundColor Cyan
} else {
    Write-Success "Database verrà creato al primo avvio del server"
}
Write-Host ""

# Riepilogo
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✨ Setup completato con successo!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Per avviare l'applicazione:" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "   PS> cd server" -ForegroundColor Gray
Write-Host "   PS> npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "   PS> cd client" -ForegroundColor Gray
Write-Host "   PS> npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Apri il browser su: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Guide utili:" -ForegroundColor White
Write-Host "   - README.md" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor White
Write-Host "   - Il database SQLite si trova in: server\database.sqlite" -ForegroundColor Gray
Write-Host "   - Backup: Copy-Item server\database.sqlite server\backup.sqlite" -ForegroundColor Gray
Write-Host "   - Reset: Remove-Item server\database.sqlite" -ForegroundColor Gray
Write-Host ""
