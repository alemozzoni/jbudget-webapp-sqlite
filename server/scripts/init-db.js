#!/usr/bin/env node
/**
 * Script di Inizializzazione Database SQLite
 * 
 * Questo script:
 * 1. Crea il file database.sqlite se non esiste
 * 2. Esegue le migrazioni
 * 3. Opzionalmente crea dati di esempio
 * 
 * Uso:
 *   node scripts/init-db.js              # Solo setup
 *   node scripts/init-db.js --seed       # Setup + dati esempio
 *   node scripts/init-db.js --reset      # Reset completo
 */

require('dotenv').config();
const { sequelize, User, Transaction, Tag } = require('../src/models');
const bcrypt = require('bcryptjs');

const args = process.argv.slice(2);
const shouldSeed = args.includes('--seed');
const shouldReset = args.includes('--reset');

async function initDatabase() {
  try {
    console.log('🔧 Inizializzazione database SQLite...\n');

    // Reset se richiesto
    if (shouldReset) {
      console.log('⚠️  Reset database richiesto...');
      await sequelize.drop();
      console.log('✅ Database resettato\n');
    }

    // Test connessione
    await sequelize.authenticate();
    console.log('✅ Connessione database stabilita');

    // Sincronizza modelli
    await sequelize.sync({ alter: !shouldReset });
    console.log('✅ Tabelle create/sincronizzate\n');

    // Seed dati se richiesto
    if (shouldSeed) {
      console.log('📝 Creazione dati di esempio...\n');
      await seedData();
    }

    console.log('\n✨ Inizializzazione completata con successo!');
    console.log('\n📍 Database location: server/database.sqlite');
    console.log('🚀 Avvia il server con: npm run dev\n');

  } catch (error) {
    console.error('❌ Errore durante inizializzazione:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function seedData() {
  try {
    // Crea utente demo
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@jbudget.app',
      password: 'demo123' // Verrà hashata automaticamente
    });
    console.log('✅ Utente demo creato (email: demo@jbudget.app, password: demo123)');

    // Crea tag di esempio
    const tags = await Promise.all([
      Tag.create({ name: 'Alimentari', color: '#4CAF50', user_id: demoUser.id }),
      Tag.create({ name: 'Trasporti', color: '#2196F3', user_id: demoUser.id }),
      Tag.create({ name: 'Svago', color: '#FF9800', user_id: demoUser.id }),
      Tag.create({ name: 'Stipendio', color: '#8BC34A', user_id: demoUser.id }),
      Tag.create({ name: 'Bollette', color: '#F44336', user_id: demoUser.id })
    ]);
    console.log(`✅ ${tags.length} tag creati`);

    // Crea transazioni di esempio
    const now = new Date();
    const transactions = [];

    // Entrate
    transactions.push(
      await Transaction.create({
        user_id: demoUser.id,
        amount: 2500.00,
        type: 'INCOME',
        description: 'Stipendio Gennaio',
        date: new Date(now.getFullYear(), now.getMonth(), 1)
      })
    );

    // Uscite
    transactions.push(
      await Transaction.create({
        user_id: demoUser.id,
        amount: 150.50,
        type: 'EXPENSE',
        description: 'Spesa settimanale',
        date: new Date(now.getFullYear(), now.getMonth(), 5)
      })
    );

    transactions.push(
      await Transaction.create({
        user_id: demoUser.id,
        amount: 45.00,
        type: 'EXPENSE',
        description: 'Carburante',
        date: new Date(now.getFullYear(), now.getMonth(), 7)
      })
    );

    transactions.push(
      await Transaction.create({
        user_id: demoUser.id,
        amount: 80.00,
        type: 'EXPENSE',
        description: 'Bolletta luce',
        date: new Date(now.getFullYear(), now.getMonth(), 10)
      })
    );

    transactions.push(
      await Transaction.create({
        user_id: demoUser.id,
        amount: 35.00,
        type: 'EXPENSE',
        description: 'Cinema',
        date: new Date(now.getFullYear(), now.getMonth(), 12)
      })
    );

    console.log(`✅ ${transactions.length} transazioni create`);

    // Associa tag alle transazioni
    await transactions[1].addTag(tags[0]); // Spesa -> Alimentari
    await transactions[2].addTag(tags[1]); // Carburante -> Trasporti
    await transactions[3].addTag(tags[4]); // Bolletta -> Bollette
    await transactions[4].addTag(tags[2]); // Cinema -> Svago
    await transactions[0].addTag(tags[3]); // Stipendio -> Stipendio

    console.log('✅ Tag associati alle transazioni');

    // Statistiche
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    console.log('\n📊 Statistiche dati demo:');
    console.log(`   Entrate totali: €${totalIncome.toFixed(2)}`);
    console.log(`   Uscite totali: €${totalExpenses.toFixed(2)}`);
    console.log(`   Bilancio: €${(totalIncome - totalExpenses).toFixed(2)}`);

  } catch (error) {
    console.error('❌ Errore durante creazione dati demo:', error);
    throw error;
  }
}

// Esegui
initDatabase();
