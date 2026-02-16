#!/bin/bash

# Script di Setup Automatico JBudget SQLite
# Esegue tutti i passaggi necessari per avviare l'applicazione

set -e  # Exit on error

echo "🚀 JBudget SQLite - Setup Automatico"
echo "===================================="
echo ""

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funzione per stampare successo
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Funzione per stampare warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Funzione per stampare errore
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Controlla se Node.js è installato
echo "🔍 Controllo prerequisiti..."
if ! command -v node &> /dev/null; then
    error "Node.js non è installato!"
    echo "   Scarica da: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
success "Node.js installato: $NODE_VERSION"
echo ""

# Setup Backend
echo "📦 Configurazione Backend..."
cd server

# Installa dipendenze
if [ ! -d "node_modules" ]; then
    echo "   Installazione dipendenze..."
    npm install
    success "Dipendenze backend installate"
else
    success "Dipendenze backend già installate"
fi

# Crea file .env se non esiste
if [ ! -f ".env" ]; then
    echo "   Creazione file .env..."
    cp .env.example .env
    success "File .env creato"
else
    warning "File .env già esistente (non sovrascritto)"
fi

cd ..
echo ""

# Setup Frontend
echo "📦 Configurazione Frontend..."
cd client

# Installa dipendenze
if [ ! -d "node_modules" ]; then
    echo "   Installazione dipendenze..."
    npm install
    success "Dipendenze frontend installate"
else
    success "Dipendenze frontend già installate"
fi

# Crea file .env se non esiste
if [ ! -f ".env" ]; then
    echo "   Creazione file .env..."
    cp .env.example .env
    success "File .env creato"
else
    warning "File .env già esistente (non sovrascritto)"
fi

cd ..
echo ""

# Inizializza database (opzionale)
echo "💾 Inizializzazione Database..."
read -p "Vuoi creare dati di esempio nel database? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd server
    npm run init-db:seed
    cd ..
    success "Database inizializzato con dati demo"
    echo ""
    echo "   📧 Email demo: demo@jbudget.app"
    echo "   🔑 Password demo: demo123"
else
    success "Database verrà creato al primo avvio del server"
fi
echo ""

# Riepilogo
echo "======================================"
echo "✨ Setup completato con successo!"
echo "======================================"
echo ""
echo "📝 Per avviare l'applicazione:"
echo ""
echo "   Terminal 1 - Backend:"
echo "   $ cd server"
echo "   $ npm run dev"
echo ""
echo "   Terminal 2 - Frontend:"
echo "   $ cd client"  
echo "   $ npm run dev"
echo ""
echo "🌐 Apri il browser su: http://localhost:5173"
echo ""
echo "📚 Guide utili:"
echo "   - GUIDA_RAPIDA_SQLITE.md"
echo "   - README.md"
echo ""
echo "💡 Tips:"
echo "   - Il database SQLite si trova in: server/database.sqlite"
echo "   - Backup: cp server/database.sqlite server/backup.sqlite"
echo "   - Reset: rm server/database.sqlite"
echo ""
