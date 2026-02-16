#!/usr/bin/env node
/**
 * Migration Script: Add payment_method column to transactions table
 * 
 * This script adds the payment_method column to existing SQLite database
 * Run with: node scripts/migrate-payment-method.js
 */

const { sequelize } = require('../src/models');

async function migrate() {
  try {
    console.log('🔄 Starting migration: Adding payment_method column...\n');

    // Check if column already exists
    const [results] = await sequelize.query(`
      PRAGMA table_info(transactions);
    `);

    const columnExists = results.some(col => col.name === 'payment_method');

    if (columnExists) {
      console.log('✅ Column payment_method already exists. No migration needed.');
      process.exit(0);
    }

    // Add the column
    await sequelize.query(`
      ALTER TABLE transactions 
      ADD COLUMN payment_method TEXT DEFAULT 'CASH';
    `);

    console.log('✅ Successfully added payment_method column');
    console.log('📊 Default value: CASH');
    console.log('\n✨ Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
