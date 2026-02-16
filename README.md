# JBudget - Applicazione Web/Mobile per Gestione Budget

## 📋 Descrizione
Applicazione web responsive per la gestione del budget familiare, fruibile sia da browser desktop che da dispositivi mobili.

## ✅ Requisiti Implementati

### 1. Fruibilità Web/Mobile
- ✅ Interfaccia web responsive progettata con React
- ✅ Design mobile-first con breakpoint responsive
- ✅ Progressive Web App (PWA) ready
- ✅ Compatibile con tutti i dispositivi moderni

### 2. Pattern MVC / Single Page Application
- ✅ **Single Page Application (SPA)** con React
- ✅ React Router per la navigazione client-side
- ✅ Separazione logica tra componenti (View), servizi (Controller) e stato (Model)
- ✅ Context API per la gestione dello stato globale

### 3. Backend + DBMS
- ✅ Backend RESTful API con Node.js + Express
- ✅ Database SQLite per persistenza dati (embedded, nessun server richiesto)
- ✅ Autenticazione utenti con JWT
- ✅ Validazione dati lato server
- ✅ Migrations per gestione schema database

## 🏗️ Architettura

```
jbudget-webapp/
├── client/                 # Frontend React (SPA)
│   ├── public/            # File statici
│   ├── src/
│   │   ├── components/    # Componenti React riutilizzabili
│   │   ├── pages/         # Pagine principali dell'app
│   │   ├── services/      # Servizi API (Controller logic)
│   │   ├── context/       # Context API per stato globale
│   │   ├── hooks/         # Custom React hooks
│   │   └── App.jsx        # Componente principale
│   └── package.json
│
├── server/                # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Logic dei controller
│   │   ├── models/        # Modelli dati (Sequelize ORM)
│   │   ├── routes/        # Definizione route API
│   │   ├── middleware/    # Middleware (auth, validation)
│   │   ├── config/        # Configurazioni
│   │   └── server.js      # Entry point server
│   ├── migrations/        # Database migrations
│   └── package.json
│
└── README.md
```

## 🚀 Tecnologie Utilizzate

### Frontend
- **React 18** - Framework UI
- **React Router 6** - Routing SPA
- **Axios** - HTTP client
- **Chart.js** - Grafici statistiche
- **CSS Modules** - Styling componenti
- **Vite** - Build tool moderno

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Database embedded (DBMS)
- **Sequelize** - ORM per SQLite
- **JWT** - Autenticazione
- **bcrypt** - Hashing password
- **express-validator** - Validazione input

## 📦 Installazione

### Prerequisiti
- Node.js 18+ 
- npm o yarn

**Nota:** SQLite è incluso come dipendenza npm, non serve installare nulla separatamente!

### 1. Clona il repository
```bash
git clone <repository-url>
cd jbudget-webapp
```

### 2. Configurazione Backend
```bash
cd server
npm install

# Crea file .env (copia dall'esempio)
cp .env.example .env

# Modifica .env se necessario (il database SQLite verrà creato automaticamente)
# Il file database.sqlite verrà creato automaticamente al primo avvio
```

### 3. Configurazione Frontend
```bash
cd ../client
npm install

# Crea file .env
cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
EOL
```

## 🏃‍♂️ Avvio Applicazione

### Modalità Sviluppo

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server in ascolto su http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App disponibile su http://localhost:5173
```

### Modalità Produzione

```bash
# Build frontend
cd client
npm run build

# Avvia server (serve anche i file static del frontend)
cd ../server
npm start
```

## 🌐 API Endpoints

### Autenticazione
- `POST /api/auth/register` - Registrazione utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/me` - Info utente corrente

### Transazioni
- `GET /api/transactions` - Lista transazioni
- `POST /api/transactions` - Crea transazione
- `PUT /api/transactions/:id` - Aggiorna transazione
- `DELETE /api/transactions/:id` - Elimina transazione
- `GET /api/transactions/stats` - Statistiche

### Tag
- `GET /api/tags` - Lista tag
- `POST /api/tags` - Crea tag
- `PUT /api/tags/:id` - Aggiorna tag
- `DELETE /api/tags/:id` - Elimina tag

## 📱 Funzionalità

### Gestione Transazioni
- ✅ Aggiunta transazioni (entrate/uscite)
- ✅ Modifica e cancellazione
- ✅ Filtri per data, tipo, tag
- ✅ Ricerca testuale

### Gestione Tag
- ✅ Creazione categorie personalizzate
- ✅ Assegnazione multipla a transazioni
- ✅ Colori personalizzati

### Statistiche e Dashboard
- ✅ Bilancio totale in tempo reale
- ✅ Grafici entrate/uscite per periodo
- ✅ Distribuzione per categoria
- ✅ Trend temporali

### Multi-utente
- ✅ Sistema di autenticazione
- ✅ Dati privati per ogni utente
- ✅ Sessioni sicure con JWT

## 🎨 Responsive Design

L'applicazione si adatta a:
- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🔒 Sicurezza

- Password hashate con bcrypt
- JWT per autenticazione stateless
- Protezione CSRF
- Validazione input server-side
- SQL injection protection (Sequelize ORM)
- HTTPS ready

## 📊 Database Schema

### Users
- id (PK)
- email (unique)
- password_hash
- name
- created_at

### Transactions
- id (PK)
- user_id (FK)
- amount
- type (INCOME/EXPENSE)
- date
- description
- created_at

### Tags
- id (PK)
- user_id (FK)
- name
- color
- created_at

### TransactionTags (Many-to-Many)
- transaction_id (FK)
- tag_id (FK)

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📝 Note di Sviluppo

### Pattern Architetturale
Il progetto implementa una **Single Page Application (SPA)** che soddisfa i requisiti:
- **View**: Componenti React con logica di presentazione
- **Controller**: Service layer che gestisce chiamate API
- **Model**: Stato applicazione (Context API) + Modelli Sequelize backend

### Persistenza Dati
A differenza dell'originale (XML files), ora utilizza:
- SQLite come **DBMS** embedded (nessun server separato richiesto)
- Migrations per versionare schema
- ORM (Sequelize) per type-safety
- Database salvato in un singolo file `database.sqlite`
- Facile backup (basta copiare il file)

## 💾 Database SQLite

### Vantaggi
- ✅ **Zero configurazione**: nessun server database da installare
- ✅ **File singolo**: tutto il database in `server/database.sqlite`
- ✅ **Portable**: copia il file per backup o migrazione
- ✅ **Leggero**: perfetto per sviluppo locale e piccole applicazioni
- ✅ **Veloce**: ottimo per app con traffico basso-medio

### Gestione Database

**Visualizzare il database:**
```bash
# Opzione 1: DB Browser for SQLite (GUI)
# Scarica da https://sqlitebrowser.org/

# Opzione 2: SQLite CLI
sqlite3 server/database.sqlite
.tables
.schema users
SELECT * FROM users;
```

**Backup:**
```bash
# Semplice copia del file
cp server/database.sqlite server/backup.sqlite

# Backup con data
cp server/database.sqlite server/backup-$(date +%Y%m%d).sqlite
```

**Reset database:**
```bash
# Elimina il file
rm server/database.sqlite

# Al prossimo avvio verrà ricreato automaticamente
cd server && npm start
```


## 👥 Autori
- Progetto originale: JBudget JavaFX
- Versione Web/Mobile: [Alessandro Mozzoni, Tommaso Ferretti, Mattia Farabollini, Alessandro Acciarresi]

## 📄 Licenza
MIT License
