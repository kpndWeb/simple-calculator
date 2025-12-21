// db/migrate.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

const createCalculationsTable = `
  CREATE TABLE IF NOT EXISTS calculations (
    id SERIAL PRIMARY KEY,
    expression VARCHAR(255) NOT NULL,
    result NUMERIC(15, 6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

const createIndex = `
  CREATE INDEX IF NOT EXISTS idx_calculations_created_at 
  ON calculations(created_at);
`;

async function migrate() {
  try {
    console.log('⏳ Running database migrations...');
    await pool.query(createCalculationsTable);
    await pool.query(createIndex);
    console.log('✅ Database migrated successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  migrate();
}

module.exports = { migrate };